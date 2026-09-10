import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { checkHourlyCapacity, materialDemand } from '@rmc-ms/business-rules';
import { PlanLine, ProductionPlan, ProductionPlanStatus } from '@rmc-ms/shared-types';
import { randomUUID } from 'crypto';
import { OrderService } from '../order/order.service';
import { AddPlanLineDto } from './dto/add-plan-line.dto';
import { CreatePlanDto } from './dto/create-plan.dto';

/**
 * M08 - Ke hoach san xuat ngay/ca (PRD SS4.8, SRS SS4.8).
 * Repository dang in-memory - xem ghi chu tuong tu trong order.service.ts.
 */
@Injectable()
export class PlanningService {
  private readonly plans = new Map<string, ProductionPlan>();
  private readonly linesByPlan = new Map<string, PlanLine[]>();

  // Cong suat tram - se thay bang Plant that (E-03, FR-M01-09)
  private readonly plantCapacityM3PerHour = new Map([['plant-001', 60]]);

  constructor(private readonly orderService: OrderService) {}

  createPlan(dto: CreatePlanDto): ProductionPlan {
    const plan: ProductionPlan = {
      id: randomUUID(),
      branchId: dto.branchId,
      plantId: dto.plantId,
      planDate: dto.planDate,
      shift: dto.shift,
      status: ProductionPlanStatus.DRAFT,
    };
    this.plans.set(plan.id, plan);
    this.linesByPlan.set(plan.id, []);
    return plan;
  }

  findOne(planId: string): { plan: ProductionPlan; lines: PlanLine[] } {
    const plan = this.plans.get(planId);
    if (!plan) throw new NotFoundException(`Khong tim thay ke hoach ${planId}`);
    return { plan, lines: this.linesByPlan.get(planId) ?? [] };
  }

  findAll(): ProductionPlan[] {
    return Array.from(this.plans.values());
  }

  /**
   * BRULE-03: khong xac nhan khi khung gio vuot 100% cong suat tram, tru khi
   * nguoi dung chap nhan va ghi ly do (canh bao, khong tu dong chan cung nhu BRULE-02).
   */
  addLine(planId: string, dto: AddPlanLineDto): { line: PlanLine; capacityWarning: string | null } {
    const { plan, lines } = this.findOne(planId);
    if (plan.status !== ProductionPlanStatus.DRAFT) {
      throw new BadRequestException('Chi duoc them dong vao ke hoach dang o trang thai Nhap');
    }

    const capacity = this.plantCapacityM3PerHour.get(plan.plantId) ?? 60;
    const hourBucket = new Date(dto.timeSlotStart);
    hourBucket.setMinutes(0, 0, 0);
    const hourEnd = new Date(hourBucket.getTime() + 60 * 60 * 1000);

    const volumeInSameHour =
      lines
        .filter((l) => {
          const t = new Date(l.timeSlotStart);
          return t >= hourBucket && t < hourEnd;
        })
        .reduce((sum, l) => sum + l.volumeM3, 0) + dto.volumeM3;

    const capacityCheck = checkHourlyCapacity(volumeInSameHour, capacity);

    let capacityWarning: string | null = null;
    if (capacityCheck.level === 'OVER') {
      if (!dto.overrideReason) {
        throw new BadRequestException(
          `Khung gio ${hourBucket.toISOString()} vuot cong suat tram ${capacity} m3/h ` +
            `(vuot ${capacityCheck.overVolumeM3} m3) (BRULE-03) - can ghi ro ly do de xac nhan`,
        );
      }
      capacityWarning = `Vuot cong suat ${capacityCheck.overVolumeM3} m3 - da duoc chap nhan: "${dto.overrideReason}"`;
    } else if (capacityCheck.level === 'WARNING') {
      capacityWarning = `Sap toi han cong suat tram (${(capacityCheck.loadRatio * 100).toFixed(0)}%)`;
    }

    const line: PlanLine = {
      planId,
      orderId: dto.orderId,
      timeSlotStart: dto.timeSlotStart,
      volumeM3: dto.volumeM3,
    };
    lines.push(line);

    return { line, capacityWarning };
  }

  /**
   * BRULE-04: don phai co cap phoi hieu luc phu hop truoc khi vao ke hoach.
   * O day dung proxy don gian: Order.mixDesignId phai duoc gan (mixdesign module
   * that se kiem tra ca trang thai "Hieu luc" khi duoc trien khai).
   */
  lockPlan(planId: string): ProductionPlan {
    const { plan, lines } = this.findOne(planId);

    if (lines.length === 0) {
      throw new BadRequestException('Khong the chot ke hoach rong - chua co dong nao');
    }

    const missingMixDesign = lines.filter((line) => {
      const order = this.orderService.findOne(line.orderId);
      return !order.mixDesignId;
    });

    if (missingMixDesign.length > 0) {
      throw new BadRequestException(
        `Khong the chot ke hoach (BRULE-04): cac don sau chua co cap phoi hieu luc: ` +
          missingMixDesign.map((l) => l.orderId).join(', '),
      );
    }

    plan.status = ProductionPlanStatus.LOCKED;
    return plan;
  }

  /** FR-M08-03: Nhu cau vat tu(v, ngay) = Sum over PlanLine [ m3 x dinh muc/m3 ] */
  materialDemandForPlan(
    planId: string,
    qtyPerM3ByMaterialByOrder: Record<string, Record<string, number>>,
  ): Record<string, number> {
    const { lines } = this.findOne(planId);
    return materialDemand(
      lines.map((line) => ({
        volumeM3: line.volumeM3,
        qtyPerM3ByMaterial: qtyPerM3ByMaterialByOrder[line.orderId] ?? {},
      })),
    );
  }
}
