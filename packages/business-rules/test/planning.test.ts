import {
  checkHourlyCapacity,
  materialDemand,
  stockDaysRemaining,
  vehiclesNeeded,
} from '../src/planning';

describe('BRULE-03 / FR-M08-02: canh bao nang luc tram theo khung gio', () => {
  it('UJ-02: 180 m3 trong khung 06:00-08:00, tram 60 m3/h => vuot 60 m3, do', () => {
    // vi du trong URD UJ-02 la 2 gio (180 m3 / 2h = 90 m3/h > 60 m3/h),
    // o day kiem tra truc tiep cong thuc voi 1 khung gio tuong duong
    const result = checkHourlyCapacity(120, 60);
    expect(result.level).toBe('OVER');
    expect(result.overVolumeM3).toBe(60);
  });

  it('canh bao vang khi tai >= 85% cong suat', () => {
    const result = checkHourlyCapacity(51, 60);
    expect(result.level).toBe('WARNING');
  });

  it('OK khi tai duoi 85% cong suat', () => {
    const result = checkHourlyCapacity(40, 60);
    expect(result.level).toBe('OK');
    expect(result.overVolumeM3).toBe(0);
  });
});

describe('Nhu cau vat tu = Sum(m3 x dinh muc/m3)', () => {
  it('cong don dung theo tung loai vat tu qua nhieu PlanLine', () => {
    const demand = materialDemand([
      { volumeM3: 100, qtyPerM3ByMaterial: { CEMENT: 350, SAND: 650 } },
      { volumeM3: 50, qtyPerM3ByMaterial: { CEMENT: 350, SAND: 650 } },
    ]);
    expect(demand.CEMENT).toBe(52_500);
    expect(demand.SAND).toBe(97_500);
  });
});

describe('So ngay ton = Ton hien tai / Nhu cau binh quan ngay', () => {
  it('UJ-02: ton 260 tan, nhu cau ~210 tan/ngay => con khoang 1.2 ngay', () => {
    const days = stockDaysRemaining(260, 210);
    expect(days).toBeCloseTo(1.238, 2);
  });
});

describe('So xe can(h) = ceil(m3/gio / (tai bon x 60 / cycle_time))', () => {
  it('60 m3/h, xe 10 m3, cycle 60 phut => can 6 xe', () => {
    expect(vehiclesNeeded(60, 10, 60)).toBe(6);
  });

  it('lam tron len (ceil) khi le', () => {
    // throughput = 10*60/90 = 6.667 m3/h/xe; 45/6.667 = 6.75 -> ceil = 7
    expect(vehiclesNeeded(45, 10, 90)).toBe(7);
  });
});
