import { BadRequestException } from '@nestjs/common';
import { BranchScopeViolationError, UserBranchScope } from '@rmc-ms/business-rules';
import { OrderService } from '../order/order.service';
import { PlanningService } from './planning.service';

const CN1_SCOPE: UserBranchScope = { isCompanyWide: false, branchIds: ['CN1'] };
const CN2_SCOPE: UserBranchScope = { isCompanyWide: false, branchIds: ['CN2'] };

function makeOrder(orderService: OrderService, volumeM3: number, estimatedValue = 10_000_000) {
  return orderService.create(
    {
      branchId: 'CN1',
      customerId: 'cust-001',
      siteId: 'site-001',
      pourDateTime: '2026-09-11T06:00:00',
      volumeM3,
      estimatedValue,
      siteContactName: 'Nguyen Van A',
      siteContactPhone: '0900000000',
    },
    CN1_SCOPE,
  );
}

describe('PlanningService (demo wiring cho BRULE-03, BRULE-04, BRULE-17)', () => {
  let orderService: OrderService;
  let planningService: PlanningService;

  beforeEach(() => {
    orderService = new OrderService();
    planningService = new PlanningService(orderService);
  });

  it('them dong binh thuong khi trong cong suat tram (plant-001 = 60 m3/h)', () => {
    const plan = planningService.createPlan(
      { branchId: 'CN1', plantId: 'plant-001', planDate: '2026-09-11', shift: 'MORNING' },
      CN1_SCOPE,
    );
    const order = makeOrder(orderService, 40);

    const { line, capacityWarning } = planningService.addLine(
      plan.id,
      { orderId: order.id, timeSlotStart: '2026-09-11T06:00:00', volumeM3: 40 },
      CN1_SCOPE,
    );

    expect(line.volumeM3).toBe(40);
    expect(capacityWarning).toBeNull();
  });

  it('BRULE-03: chan khi khung gio vuot 100% cong suat va khong co ly do', () => {
    const plan = planningService.createPlan(
      { branchId: 'CN1', plantId: 'plant-001', planDate: '2026-09-11', shift: 'MORNING' },
      CN1_SCOPE,
    );
    const order = makeOrder(orderService, 90);

    expect(() =>
      planningService.addLine(
        plan.id,
        { orderId: order.id, timeSlotStart: '2026-09-11T06:00:00', volumeM3: 90 }, // > 60 m3/h cong suat tram
        CN1_SCOPE,
      ),
    ).toThrow(BadRequestException);
  });

  it('BRULE-03: cho phep vuot cong suat neu co ghi ly do (overrideReason)', () => {
    const plan = planningService.createPlan(
      { branchId: 'CN1', plantId: 'plant-001', planDate: '2026-09-11', shift: 'MORNING' },
      CN1_SCOPE,
    );
    const order = makeOrder(orderService, 90);

    const { capacityWarning } = planningService.addLine(
      plan.id,
      {
        orderId: order.id,
        timeSlotStart: '2026-09-11T06:00:00',
        volumeM3: 90,
        overrideReason: 'Khach yeu cau gap, da xac nhan voi truong tram',
      },
      CN1_SCOPE,
    );

    expect(capacityWarning).toContain('Vuot cong suat');
  });

  it('BRULE-04: khong chot duoc ke hoach khi don chua co cap phoi', () => {
    const plan = planningService.createPlan(
      { branchId: 'CN1', plantId: 'plant-001', planDate: '2026-09-11', shift: 'MORNING' },
      CN1_SCOPE,
    );
    const order = makeOrder(orderService, 40);
    planningService.addLine(
      plan.id,
      { orderId: order.id, timeSlotStart: '2026-09-11T06:00:00', volumeM3: 40 },
      CN1_SCOPE,
    );

    expect(() => planningService.lockPlan(plan.id, CN1_SCOPE)).toThrow(BadRequestException);
  });

  it('chot ke hoach thanh cong sau khi don da duoc gan cap phoi', () => {
    const plan = planningService.createPlan(
      { branchId: 'CN1', plantId: 'plant-001', planDate: '2026-09-11', shift: 'MORNING' },
      CN1_SCOPE,
    );
    const order = makeOrder(orderService, 40);
    orderService.assignMixDesign(order.id, 'mix-m300-001', CN1_SCOPE);
    planningService.addLine(
      plan.id,
      { orderId: order.id, timeSlotStart: '2026-09-11T06:00:00', volumeM3: 40 },
      CN1_SCOPE,
    );

    const locked = planningService.lockPlan(plan.id, CN1_SCOPE);
    expect(locked.status).toBe('LOCKED');
  });

  it('FR-M08-03: tinh nhu cau vat tu = Sum(m3 x dinh muc/m3)', () => {
    const plan = planningService.createPlan(
      { branchId: 'CN1', plantId: 'plant-001', planDate: '2026-09-11', shift: 'MORNING' },
      CN1_SCOPE,
    );
    const order = makeOrder(orderService, 40);
    planningService.addLine(
      plan.id,
      { orderId: order.id, timeSlotStart: '2026-09-11T06:00:00', volumeM3: 40 },
      CN1_SCOPE,
    );

    const demand = planningService.materialDemandForPlan(plan.id, { [order.id]: { CEMENT: 350, SAND: 650 } }, CN1_SCOPE);

    expect(demand.CEMENT).toBe(14_000);
    expect(demand.SAND).toBe(26_000);
  });

  it('BRULE-17: tu choi xem ke hoach ngoai pham vi chi nhanh', () => {
    const plan = planningService.createPlan(
      { branchId: 'CN1', plantId: 'plant-001', planDate: '2026-09-11', shift: 'MORNING' },
      CN1_SCOPE,
    );

    expect(() => planningService.findOne(plan.id, CN2_SCOPE)).toThrow(BranchScopeViolationError);
    expect(planningService.findAll(CN2_SCOPE)).toHaveLength(0);
  });
});
