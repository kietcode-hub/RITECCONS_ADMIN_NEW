import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import {
  assertBranchScope,
  checkCreditLimit,
  canReduceOrderVolume,
  isInBranchScope,
  isUrgentOrder,
  UserBranchScope,
} from '@rmc-ms/business-rules';
import { Order, OrderStatus, PumpMethod } from '@rmc-ms/shared-types';
import { randomUUID } from 'crypto';
import { CreateOrderDto } from './dto/create-order.dto';

/**
 * Trien khai demo cho M05 - Don hang & Yeu cau cap be tong (PRD SS4.5, SRS SS4.5).
 * Repository va du lieu khach hang/chi nhanh dang la in-memory de chung minh
 * cach cac quy tac nghiep vu (BRULE-02, BRULE-13, BRULE-14) duoc goi tu service layer.
 * Khi co Prisma + module Kinh doanh/Cong no that, thay in-memory bang truy van DB.
 */
@Injectable()
export class OrderService {
  private readonly orders = new Map<string, Order>();

  // Du lieu mau de demo BRULE-02 (han muc cong no) - se thay bang bang CreditLimit that (E-19)
  private readonly creditLimitsByCustomer = new Map([
    [
      'cust-001',
      {
        limitAmount: 1_500_000_000,
        outstandingDebt: 500_000_000,
        confirmedUnbilledOrders: 200_000_000,
        overdueDays: 0,
        maxAllowedOverdueDays: 30,
      },
    ],
  ]);

  // Cut-off theo chi nhanh - se thay bang Branch that (E-02, FR-M01-09)
  private readonly cutoffByBranch = new Map([['CN1', '16:00']]);

  create(dto: CreateOrderDto, scope: UserBranchScope): Order {
    // BRULE-17: khong duoc tao du lieu cho chi nhanh ngoai pham vi duoc gan
    assertBranchScope(dto.branchId, scope);

    const creditInput = this.creditLimitsByCustomer.get(dto.customerId);
    if (!creditInput) {
      throw new NotFoundException(`Khong tim thay ho so han muc cua khach hang ${dto.customerId}`);
    }

    const creditResult = checkCreditLimit(creditInput, dto.estimatedValue);
    if (!creditResult.allowed) {
      // BRULE-02: chan xac nhan don - can GD CN / Ban LD duyet ngoai le
      throw new BadRequestException(`Khong the tao don (BRULE-02): ${creditResult.reason}`);
    }

    const cutoffTime = this.cutoffByBranch.get(dto.branchId) ?? '16:00';
    const isUrgent = isUrgentOrder(new Date(), new Date(dto.pourDateTime), cutoffTime);

    const order: Order = {
      id: randomUUID(),
      branchId: dto.branchId,
      orderNo: this.generateOrderNo(dto.branchId),
      siteId: dto.siteId,
      pourDateTime: dto.pourDateTime,
      volumeM3: dto.volumeM3,
      pumpMethod: dto.pumpMethod ?? PumpMethod.DIRECT_DISCHARGE,
      siteContactName: dto.siteContactName,
      siteContactPhone: dto.siteContactPhone,
      status: isUrgent ? OrderStatus.PENDING_CONFIRM : OrderStatus.DRAFT,
      isUrgent,
    };

    this.orders.set(order.id, order);
    return order;
  }

  findAll(scope: UserBranchScope): Order[] {
    // BRULE-17: loc theo pham vi chi nhanh o tang service, khong dua vao client
    return Array.from(this.orders.values()).filter((o) => isInBranchScope(o.branchId, scope));
  }

  findOne(id: string, scope: UserBranchScope): Order {
    const order = this.orders.get(id);
    if (!order) throw new NotFoundException(`Khong tim thay don hang ${id}`);
    assertBranchScope(order.branchId, scope);
    return order;
  }

  /** FR-M05-10: gan cap phoi cho don (Ky thuat xac nhan gia y de xuat cua he thong). */
  assignMixDesign(id: string, mixDesignId: string, scope: UserBranchScope): Order {
    const order = this.findOne(id, scope);
    order.mixDesignId = mixDesignId;
    return order;
  }

  updateVolume(id: string, newVolumeM3: number, alreadyDeliveredM3: number, scope: UserBranchScope): Order {
    const order = this.findOne(id, scope);

    // BRULE-14: khong cho sua m3 don xuong duoi m3 da giao thuc te
    const check = canReduceOrderVolume(newVolumeM3, alreadyDeliveredM3);
    if (!check.allowed) {
      throw new BadRequestException(`Khong the sua khoi luong (BRULE-14): ${check.reason}`);
    }

    order.volumeM3 = newVolumeM3;
    return order;
  }

  private generateOrderNo(branchId: string): string {
    // Quy uoc dinh so chung tu theo FR-M01-13: prefix + chi nhanh + nam + so tang dan
    const year = new Date().getFullYear();
    const seq = this.orders.size + 1;
    return `DH-${branchId}-${year}-${String(seq).padStart(5, '0')}`;
  }
}
