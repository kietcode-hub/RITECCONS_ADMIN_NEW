import { BadRequestException } from '@nestjs/common';
import { OrderService } from '../order/order.service';
import { PlanningService } from './planning.service';

function makeOrder(orderService: OrderService, volumeM3: number, estimatedValue = 10_000_000) {
  return orderService.create({
    branchId: 'CN1',
    customerId: 'cust-001',
    siteId: 'site-001',
    pourDateTime: '2026-09-11T06:00:00',
    volumeM3,
    estimatedValue,
    siteContactName: 'Nguyen Van A',
    siteContactPhone: '0900000000',
  });
}

describe('PlanningService (demo wiring cho BRULE-03, BRULE-04)', () => {
  let orderService: OrderService;
  let planningService: PlanningService;

  beforeEach(() => {
    orderService = new OrderService();
    planningService = new PlanningService(orderService);
  });

  it('them dong binh thuong khi trong cong suat tram (plant-001 = 60 m3/h)', () => {
    const plan = planningService.createPlan({
      branchId: 'CN1',
      plantId: 'plant-001',
      planDate: '2026-09-11',
      shift: 'MORNING',
    });
    const order = makeOrder(orderService, 40);

    const { line, capacityWarning } = planningService.addLine(plan.id, {
      orderId: order.id,
      timeSlotStart: '2026-09-11T06:00:00',
      volumeM3: 40,
    });

    expect(line.volumeM3).toBe(40);
    expect(capacityWarning).toBeNull();
  });

  it('BRULE-03: chan khi khung gio vuot 100% cong suat va khong co ly do', () => {
    const plan = planningService.createPlan({
      branchId: 'CN1',
      plantId: 'plant-001',
      planDate: '2026-09-11',
      shift: 'MORNING',
    });
    const order = makeOrder(orderService, 90);

    expect(() =>
      planningService.addLine(plan.id, {
        orderId: order.id,
        timeSlotStart: '2026-09-11T06:00:00',
        volumeM3: 90, // > 60 m3/h cong suat tram
      }),
    ).toThrow(BadRequestException);
  });

  it('BRULE-03: cho phep vuot cong suat neu co ghi ly do (overrideReason)', () => {
    const plan = planningService.createPlan({
      branchId: 'CN1',
      plantId: 'plant-001',
      planDate: '2026-09-11',
      shift: 'MORNING',
    });
    const order = makeOrder(orderService, 90);

    const { capacityWarning } = planningService.addLine(plan.id, {
      orderId: order.id,
      timeSlotStart: '2026-09-11T06:00:00',
      volumeM3: 90,
      overrideReason: 'Khach yeu cau gap, da xac nhan voi truong tram',
    });

    expect(capacityWarning).toContain('Vuot cong suat');
  });

  it('BRULE-04: khong chot duoc ke hoach khi don chua co cap phoi', () => {
    const plan = planningService.createPlan({
      branchId: 'CN1',
      plantId: 'plant-001',
      planDate: '2026-09-11',
      shift: 'MORNING',
    });
    const order = makeOrder(orderService, 40);
    planningService.addLine(plan.id, {
      orderId: order.id,
      timeSlotStart: '2026-09-11T06:00:00',
      volumeM3: 40,
    });

    expect(() => planningService.lockPlan(plan.id)).toThrow(BadRequestException);
  });

  it('chot ke hoach thanh cong sau khi don da duoc gan cap phoi', () => {
    const plan = planningService.createPlan({
      branchId: 'CN1',
      plantId: 'plant-001',
      planDate: '2026-09-11',
      shift: 'MORNING',
    });
    const order = makeOrder(orderService, 40);
    orderService.assignMixDesign(order.id, 'mix-m300-001');
    planningService.addLine(plan.id, {
      orderId: order.id,
      timeSlotStart: '2026-09-11T06:00:00',
      volumeM3: 40,
    });

    const locked = planningService.lockPlan(plan.id);
    expect(locked.status).toBe('LOCKED');
  });

  it('FR-M08-03: tinh nhu cau vat tu = Sum(m3 x dinh muc/m3)', () => {
    const plan = planningService.createPlan({
      branchId: 'CN1',
      plantId: 'plant-001',
      planDate: '2026-09-11',
      shift: 'MORNING',
    });
    const order = makeOrder(orderService, 40);
    planningService.addLine(plan.id, {
      orderId: order.id,
      timeSlotStart: '2026-09-11T06:00:00',
      volumeM3: 40,
    });

    const demand = planningService.materialDemandForPlan(plan.id, {
      [order.id]: { CEMENT: 350, SAND: 650 },
    });

    expect(demand.CEMENT).toBe(14_000);
    expect(demand.SAND).toBe(26_000);
  });
});
