import { BadRequestException } from '@nestjs/common';
import { BranchScopeViolationError, UserBranchScope } from '@rmc-ms/business-rules';
import { OrderService } from './order.service';

const CN1_SCOPE: UserBranchScope = { isCompanyWide: false, branchIds: ['CN1'] };
const CN2_SCOPE: UserBranchScope = { isCompanyWide: false, branchIds: ['CN2'] };

describe('OrderService (demo wiring cho BRULE-02, BRULE-13, BRULE-14, BRULE-17)', () => {
  let service: OrderService;

  beforeEach(() => {
    service = new OrderService();
  });

  it('tao don thanh cong khi trong han muc cong no', () => {
    const order = service.create(
      {
        branchId: 'CN1',
        customerId: 'cust-001',
        siteId: 'site-001',
        pourDateTime: '2026-09-11T06:00:00',
        volumeM3: 60,
        estimatedValue: 100_000_000,
        siteContactName: 'Nguyen Van A',
        siteContactPhone: '0900000000',
      },
      CN1_SCOPE,
    );

    expect(order.orderNo).toMatch(/^DH-CN1-/);
    expect(order.volumeM3).toBe(60);
  });

  it('BRULE-02: tu choi tao don khi gia tri vuot han muc kha dung', () => {
    expect(() =>
      service.create(
        {
          branchId: 'CN1',
          customerId: 'cust-001',
          siteId: 'site-001',
          pourDateTime: '2026-09-11T06:00:00',
          volumeM3: 600,
          estimatedValue: 900_000_000, // han muc kha dung chi con 800 trieu
          siteContactName: 'Nguyen Van A',
          siteContactPhone: '0900000000',
        },
        CN1_SCOPE,
      ),
    ).toThrow(BadRequestException);
  });

  it('BRULE-14: tu choi sua khoi luong xuong duoi khoi luong da giao', () => {
    const order = service.create(
      {
        branchId: 'CN1',
        customerId: 'cust-001',
        siteId: 'site-001',
        pourDateTime: '2026-09-11T06:00:00',
        volumeM3: 60,
        estimatedValue: 50_000_000,
        siteContactName: 'Nguyen Van A',
        siteContactPhone: '0900000000',
      },
      CN1_SCOPE,
    );

    expect(() => service.updateVolume(order.id, 40, 55, CN1_SCOPE)).toThrow(BadRequestException);
  });

  it('BRULE-17: tu choi tao don cho chi nhanh ngoai pham vi nguoi dung', () => {
    expect(() =>
      service.create(
        {
          branchId: 'CN1',
          customerId: 'cust-001',
          siteId: 'site-001',
          pourDateTime: '2026-09-11T06:00:00',
          volumeM3: 60,
          estimatedValue: 50_000_000,
          siteContactName: 'Nguyen Van A',
          siteContactPhone: '0900000000',
        },
        CN2_SCOPE, // nguoi dung chi duoc gan CN2, tao don cho CN1
      ),
    ).toThrow(BranchScopeViolationError);
  });

  it('BRULE-17: tu choi xem/sua don ngoai pham vi chi nhanh (IDOR)', () => {
    const order = service.create(
      {
        branchId: 'CN1',
        customerId: 'cust-001',
        siteId: 'site-001',
        pourDateTime: '2026-09-11T06:00:00',
        volumeM3: 60,
        estimatedValue: 50_000_000,
        siteContactName: 'Nguyen Van A',
        siteContactPhone: '0900000000',
      },
      CN1_SCOPE,
    );

    expect(() => service.findOne(order.id, CN2_SCOPE)).toThrow(BranchScopeViolationError);
  });

  it('BRULE-17: findAll chi tra ve don thuoc pham vi chi nhanh duoc gan', () => {
    service.create(
      {
        branchId: 'CN1',
        customerId: 'cust-001',
        siteId: 'site-001',
        pourDateTime: '2026-09-11T06:00:00',
        volumeM3: 60,
        estimatedValue: 50_000_000,
        siteContactName: 'Nguyen Van A',
        siteContactPhone: '0900000000',
      },
      CN1_SCOPE,
    );

    expect(service.findAll(CN2_SCOPE)).toHaveLength(0);
    expect(service.findAll(CN1_SCOPE)).toHaveLength(1);
    expect(service.findAll({ isCompanyWide: true, branchIds: [] })).toHaveLength(1);
  });
});
