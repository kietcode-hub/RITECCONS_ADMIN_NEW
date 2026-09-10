import { BadRequestException } from '@nestjs/common';
import { OrderService } from './order.service';

describe('OrderService (demo wiring cho BRULE-02, BRULE-13, BRULE-14)', () => {
  let service: OrderService;

  beforeEach(() => {
    service = new OrderService();
  });

  it('tao don thanh cong khi trong han muc cong no', () => {
    const order = service.create({
      branchId: 'CN1',
      customerId: 'cust-001',
      siteId: 'site-001',
      pourDateTime: '2026-09-11T06:00:00',
      volumeM3: 60,
      estimatedValue: 100_000_000,
      siteContactName: 'Nguyen Van A',
      siteContactPhone: '0900000000',
    });

    expect(order.orderNo).toMatch(/^DH-CN1-/);
    expect(order.volumeM3).toBe(60);
  });

  it('BRULE-02: tu choi tao don khi gia tri vuot han muc kha dung', () => {
    expect(() =>
      service.create({
        branchId: 'CN1',
        customerId: 'cust-001',
        siteId: 'site-001',
        pourDateTime: '2026-09-11T06:00:00',
        volumeM3: 600,
        estimatedValue: 900_000_000, // han muc kha dung chi con 800 trieu
        siteContactName: 'Nguyen Van A',
        siteContactPhone: '0900000000',
      }),
    ).toThrow(BadRequestException);
  });

  it('BRULE-14: tu choi sua khoi luong xuong duoi khoi luong da giao', () => {
    const order = service.create({
      branchId: 'CN1',
      customerId: 'cust-001',
      siteId: 'site-001',
      pourDateTime: '2026-09-11T06:00:00',
      volumeM3: 60,
      estimatedValue: 50_000_000,
      siteContactName: 'Nguyen Van A',
      siteContactPhone: '0900000000',
    });

    expect(() => service.updateVolume(order.id, 40, 55)).toThrow(BadRequestException);
  });
});
