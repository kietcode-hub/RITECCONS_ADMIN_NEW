import { canReduceOrderVolume, isUrgentOrder, requiresVolumeVarianceReason } from '../src/order';

describe('BRULE-13: cut-off va don gap', () => {
  const cutoff = '16:00';

  it('UJ-01: tao don luc 19h30 cho ngay mai, cut-off 16h => don gap', () => {
    const createdAt = new Date('2026-09-10T19:30:00');
    const pourDate = new Date('2026-09-11T06:00:00');
    expect(isUrgentOrder(createdAt, pourDate, cutoff)).toBe(true);
  });

  it('tao don truoc cut-off cho ngay mai => khong phai don gap', () => {
    const createdAt = new Date('2026-09-10T10:00:00');
    const pourDate = new Date('2026-09-11T06:00:00');
    expect(isUrgentOrder(createdAt, pourDate, cutoff)).toBe(false);
  });
});

describe('BRULE-15: lech khoi luong thuc nhan > 5%', () => {
  it('yeu cau ly do khi lech vuot 5%', () => {
    expect(requiresVolumeVarianceReason(60, 56)).toBe(true); // lech 6.67%
  });

  it('khong yeu cau ly do khi lech trong nguong 5%', () => {
    expect(requiresVolumeVarianceReason(60, 58)).toBe(false); // lech 3.33%
  });
});

describe('BRULE-14: khong cho sua m3 don xuong duoi m3 da giao', () => {
  it('chan khi khoi luong moi nho hon da giao', () => {
    const result = canReduceOrderVolume(50, 55);
    expect(result.allowed).toBe(false);
  });

  it('cho phep khi khoi luong moi >= da giao', () => {
    const result = canReduceOrderVolume(60, 55);
    expect(result.allowed).toBe(true);
  });
});
