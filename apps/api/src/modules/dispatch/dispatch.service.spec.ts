import { BadRequestException } from '@nestjs/common';
import { BranchScopeViolationError, UserBranchScope } from '@rmc-ms/business-rules';
import { DispatchService } from './dispatch.service';

const CN1_SCOPE: UserBranchScope = { isCompanyWide: false, branchIds: ['CN1'] }; // V1/V2/V3 deu thuoc CN1
const CN2_SCOPE: UserBranchScope = { isCompanyWide: false, branchIds: ['CN2'] };

describe('DispatchService (demo wiring cho BRULE-11, BRULE-12, BRULE-17)', () => {
  let service: DispatchService;

  beforeEach(() => {
    service = new DispatchService();
  });

  it('phan xe thanh cong khi xe san sang, khong xung dot, khong vuot tai', () => {
    const trip = service.assignVehicle(
      {
        orderId: 'order-1',
        vehicleId: 'V1',
        driverId: 'driver-1',
        sequenceNo: 1,
        volumeM3: 7.5,
        windowStart: '2026-09-11T06:00:00',
        windowEnd: '2026-09-11T07:00:00',
      },
      CN1_SCOPE,
    );

    expect(trip.status).toBe('ASSIGNED');
  });

  it('BRULE-12: tu choi khi xe dang bao duong', () => {
    expect(() =>
      service.assignVehicle(
        {
          orderId: 'order-1',
          vehicleId: 'V2', // MAINTENANCE
          driverId: 'driver-1',
          sequenceNo: 1,
          volumeM3: 7.5,
          windowStart: '2026-09-11T06:00:00',
          windowEnd: '2026-09-11T07:00:00',
        },
        CN1_SCOPE,
      ),
    ).toThrow(BadRequestException);
  });

  it('BRULE-12: tu choi khi khoi luong chuyen vuot tai bon', () => {
    expect(() =>
      service.assignVehicle(
        {
          orderId: 'order-1',
          vehicleId: 'V3', // tai bon 6 m3
          driverId: 'driver-1',
          sequenceNo: 1,
          volumeM3: 7.5,
          windowStart: '2026-09-11T06:00:00',
          windowEnd: '2026-09-11T07:00:00',
        },
        CN1_SCOPE,
      ),
    ).toThrow(BadRequestException);
  });

  it('TC-05: tu choi khi phan 1 xe cho 2 chuyen trung khung gio', () => {
    service.assignVehicle(
      {
        orderId: 'order-1',
        vehicleId: 'V1',
        driverId: 'driver-1',
        sequenceNo: 1,
        volumeM3: 7.5,
        windowStart: '2026-09-11T06:00:00',
        windowEnd: '2026-09-11T07:00:00',
      },
      CN1_SCOPE,
    );

    expect(() =>
      service.assignVehicle(
        {
          orderId: 'order-2',
          vehicleId: 'V1',
          driverId: 'driver-2',
          sequenceNo: 1,
          volumeM3: 7.5,
          windowStart: '2026-09-11T06:30:00', // trung voi chuyen tren
          windowEnd: '2026-09-11T07:30:00',
        },
        CN1_SCOPE,
      ),
    ).toThrow(BadRequestException);
  });

  it('TC-11 / BRULE-11: phat hien canh bao khi qua 90 phut tu luc tron chua xong do', () => {
    const trip = service.assignVehicle(
      {
        orderId: 'order-1',
        vehicleId: 'V1',
        driverId: 'driver-1',
        sequenceNo: 1,
        volumeM3: 7.5,
        windowStart: '2026-09-11T06:00:00',
        windowEnd: '2026-09-11T07:00:00',
      },
      CN1_SCOPE,
    );

    service.recordMilestone(trip.id, { milestone: 'MIXING_STARTED', timestamp: '2026-09-11T06:00:00' }, CN1_SCOPE);

    const now = new Date('2026-09-11T07:35:00'); // 95 phut sau
    const warnings = service.getMixingWarnings(now, CN1_SCOPE);

    expect(warnings).toHaveLength(1);
    expect(warnings[0].tripId).toBe(trip.id);
    expect(warnings[0].elapsedMinutes).toBe(95);
  });

  it('khong canh bao sau khi da ghi moc Xong do', () => {
    const trip = service.assignVehicle(
      {
        orderId: 'order-1',
        vehicleId: 'V1',
        driverId: 'driver-1',
        sequenceNo: 1,
        volumeM3: 7.5,
        windowStart: '2026-09-11T06:00:00',
        windowEnd: '2026-09-11T07:00:00',
      },
      CN1_SCOPE,
    );

    service.recordMilestone(trip.id, { milestone: 'MIXING_STARTED', timestamp: '2026-09-11T06:00:00' }, CN1_SCOPE);
    service.recordMilestone(trip.id, { milestone: 'POUR_DONE', timestamp: '2026-09-11T06:40:00' }, CN1_SCOPE);

    const warnings = service.getMixingWarnings(new Date('2026-09-11T08:00:00'), CN1_SCOPE);
    expect(warnings).toHaveLength(0);
  });

  it('UJ-04: tinh chu ky xe tu moc Xuat tram va Ve tram', () => {
    const trip = service.assignVehicle(
      {
        orderId: 'order-1',
        vehicleId: 'V1',
        driverId: 'driver-1',
        sequenceNo: 1,
        volumeM3: 7.5,
        windowStart: '2026-09-11T06:00:00',
        windowEnd: '2026-09-11T07:00:00',
      },
      CN1_SCOPE,
    );

    service.recordMilestone(trip.id, { milestone: 'DEPARTED', timestamp: '2026-09-11T06:12:00' }, CN1_SCOPE);
    service.recordMilestone(trip.id, { milestone: 'RETURNED', timestamp: '2026-09-11T07:10:00' }, CN1_SCOPE);

    expect(service.getCycleTimeMinutes(trip.id, CN1_SCOPE, 10)).toBe(68);
  });

  it('BRULE-17: tu choi phan xe / xem chuyen ngoai pham vi chi nhanh', () => {
    expect(() =>
      service.assignVehicle(
        {
          orderId: 'order-1',
          vehicleId: 'V1', // thuoc CN1
          driverId: 'driver-1',
          sequenceNo: 1,
          volumeM3: 7.5,
          windowStart: '2026-09-11T06:00:00',
          windowEnd: '2026-09-11T07:00:00',
        },
        CN2_SCOPE, // nguoi dung chi duoc gan CN2
      ),
    ).toThrow(BranchScopeViolationError);

    const trip = service.assignVehicle(
      {
        orderId: 'order-1',
        vehicleId: 'V1',
        driverId: 'driver-1',
        sequenceNo: 1,
        volumeM3: 7.5,
        windowStart: '2026-09-11T06:00:00',
        windowEnd: '2026-09-11T07:00:00',
      },
      CN1_SCOPE,
    );
    expect(() => service.findOne(trip.id, CN2_SCOPE)).toThrow(BranchScopeViolationError);
    expect(service.findAll(CN2_SCOPE)).toHaveLength(0);
  });
});
