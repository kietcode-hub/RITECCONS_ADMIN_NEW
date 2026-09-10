import {
  checkVehicleAssignment,
  cycleTimeMinutes,
  isMixingTimeExceeded,
} from '../src/dispatch';

describe('BRULE-11: canh bao qua 90 phut tu luc tron', () => {
  it('TC-11: canh bao do khi vuot 90 phut va chua xong do', () => {
    const mixingStartedAt = new Date('2026-09-10T06:00:00');
    const now = new Date('2026-09-10T07:35:00'); // 95 phut sau
    expect(isMixingTimeExceeded(mixingStartedAt, now, null)).toBe(true);
  });

  it('khong canh bao khi chua vuot nguong', () => {
    const mixingStartedAt = new Date('2026-09-10T06:00:00');
    const now = new Date('2026-09-10T07:00:00'); // 60 phut sau
    expect(isMixingTimeExceeded(mixingStartedAt, now, null)).toBe(false);
  });

  it('khong canh bao neu da xong do du qua 90 phut', () => {
    const mixingStartedAt = new Date('2026-09-10T06:00:00');
    const now = new Date('2026-09-10T08:00:00');
    const pourDoneAt = new Date('2026-09-10T07:10:00');
    expect(isMixingTimeExceeded(mixingStartedAt, now, pourDoneAt)).toBe(false);
  });
});

describe('BRULE-12: kiem tra khi phan xe', () => {
  const window = { start: new Date('2026-09-10T06:00:00'), end: new Date('2026-09-10T07:00:00') };

  it('TC-05: chan khi phan 1 xe cho 2 chuyen trung khung gio', () => {
    const existing = [
      {
        vehicleId: 'V1',
        windowStart: new Date('2026-09-10T06:30:00'),
        windowEnd: new Date('2026-09-10T07:30:00'),
      },
    ];
    const result = checkVehicleAssignment('V1', 'AVAILABLE', 8, 7.5, window, existing);
    expect(result.allowed).toBe(false);
  });

  it('chan khi xe dang bao duong', () => {
    const result = checkVehicleAssignment('V2', 'MAINTENANCE', 8, 7.5, window, []);
    expect(result.allowed).toBe(false);
  });

  it('chan khi khoi luong chuyen vuot tai bon', () => {
    const result = checkVehicleAssignment('V3', 'AVAILABLE', 6, 7.5, window, []);
    expect(result.allowed).toBe(false);
  });

  it('cho phep khi khong xung dot, xe san sang, khong vuot tai', () => {
    const result = checkVehicleAssignment('V4', 'AVAILABLE', 8, 7.5, window, []);
    expect(result.allowed).toBe(true);
  });
});

describe('Cong thuc cycle time', () => {
  it('UJ-04: xap xi chu ky 68 phut cho tuyen tham chieu', () => {
    const departedAt = new Date('2026-09-10T06:12:00');
    const returnedAt = new Date('2026-09-10T07:10:00'); // 58 phut di+ve
    const minutes = cycleTimeMinutes(departedAt, returnedAt, 10); // +10 phut nap
    expect(minutes).toBe(68);
  });
});
