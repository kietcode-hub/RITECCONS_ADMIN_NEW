import { BadRequestException } from '@nestjs/common';
import { DispatchService } from './dispatch.service';

describe('DispatchService (demo wiring cho BRULE-11, BRULE-12)', () => {
  let service: DispatchService;

  beforeEach(() => {
    service = new DispatchService();
  });

  it('phan xe thanh cong khi xe san sang, khong xung dot, khong vuot tai', () => {
    const trip = service.assignVehicle({
      orderId: 'order-1',
      vehicleId: 'V1',
      driverId: 'driver-1',
      sequenceNo: 1,
      volumeM3: 7.5,
      windowStart: '2026-09-11T06:00:00',
      windowEnd: '2026-09-11T07:00:00',
    });

    expect(trip.status).toBe('ASSIGNED');
  });

  it('BRULE-12: tu choi khi xe dang bao duong', () => {
    expect(() =>
      service.assignVehicle({
        orderId: 'order-1',
        vehicleId: 'V2', // MAINTENANCE
        driverId: 'driver-1',
        sequenceNo: 1,
        volumeM3: 7.5,
        windowStart: '2026-09-11T06:00:00',
        windowEnd: '2026-09-11T07:00:00',
      }),
    ).toThrow(BadRequestException);
  });

  it('BRULE-12: tu choi khi khoi luong chuyen vuot tai bon', () => {
    expect(() =>
      service.assignVehicle({
        orderId: 'order-1',
        vehicleId: 'V3', // tai bon 6 m3
        driverId: 'driver-1',
        sequenceNo: 1,
        volumeM3: 7.5,
        windowStart: '2026-09-11T06:00:00',
        windowEnd: '2026-09-11T07:00:00',
      }),
    ).toThrow(BadRequestException);
  });

  it('TC-05: tu choi khi phan 1 xe cho 2 chuyen trung khung gio', () => {
    service.assignVehicle({
      orderId: 'order-1',
      vehicleId: 'V1',
      driverId: 'driver-1',
      sequenceNo: 1,
      volumeM3: 7.5,
      windowStart: '2026-09-11T06:00:00',
      windowEnd: '2026-09-11T07:00:00',
    });

    expect(() =>
      service.assignVehicle({
        orderId: 'order-2',
        vehicleId: 'V1',
        driverId: 'driver-2',
        sequenceNo: 1,
        volumeM3: 7.5,
        windowStart: '2026-09-11T06:30:00', // trung voi chuyen tren
        windowEnd: '2026-09-11T07:30:00',
      }),
    ).toThrow(BadRequestException);
  });

  it('TC-11 / BRULE-11: phat hien canh bao khi qua 90 phut tu luc tron chua xong do', () => {
    const trip = service.assignVehicle({
      orderId: 'order-1',
      vehicleId: 'V1',
      driverId: 'driver-1',
      sequenceNo: 1,
      volumeM3: 7.5,
      windowStart: '2026-09-11T06:00:00',
      windowEnd: '2026-09-11T07:00:00',
    });

    service.recordMilestone(trip.id, {
      milestone: 'MIXING_STARTED',
      timestamp: '2026-09-11T06:00:00',
    });

    const now = new Date('2026-09-11T07:35:00'); // 95 phut sau
    const warnings = service.getMixingWarnings(now);

    expect(warnings).toHaveLength(1);
    expect(warnings[0].tripId).toBe(trip.id);
    expect(warnings[0].elapsedMinutes).toBe(95);
  });

  it('khong canh bao sau khi da ghi moc Xong do', () => {
    const trip = service.assignVehicle({
      orderId: 'order-1',
      vehicleId: 'V1',
      driverId: 'driver-1',
      sequenceNo: 1,
      volumeM3: 7.5,
      windowStart: '2026-09-11T06:00:00',
      windowEnd: '2026-09-11T07:00:00',
    });

    service.recordMilestone(trip.id, { milestone: 'MIXING_STARTED', timestamp: '2026-09-11T06:00:00' });
    service.recordMilestone(trip.id, { milestone: 'POUR_DONE', timestamp: '2026-09-11T06:40:00' });

    const warnings = service.getMixingWarnings(new Date('2026-09-11T08:00:00'));
    expect(warnings).toHaveLength(0);
  });

  it('UJ-04: tinh chu ky xe tu moc Xuat tram va Ve tram', () => {
    const trip = service.assignVehicle({
      orderId: 'order-1',
      vehicleId: 'V1',
      driverId: 'driver-1',
      sequenceNo: 1,
      volumeM3: 7.5,
      windowStart: '2026-09-11T06:00:00',
      windowEnd: '2026-09-11T07:00:00',
    });

    service.recordMilestone(trip.id, { milestone: 'DEPARTED', timestamp: '2026-09-11T06:12:00' });
    service.recordMilestone(trip.id, { milestone: 'RETURNED', timestamp: '2026-09-11T07:10:00' });

    expect(service.getCycleTimeMinutes(trip.id, 10)).toBe(68);
  });
});
