import {
  averageSellingPricePerM3,
  debtAgeBucket,
  debtAgeDays,
  materialVariancePercent,
} from '../src/finance';

describe('Tuoi no', () => {
  it('tinh dung so ngay qua han sau khi cong ky han thanh toan', () => {
    const invoiceDate = new Date('2026-08-01T00:00:00');
    const today = new Date('2026-09-10T00:00:00');
    // han thanh toan = 01/08 + 30 ngay = 31/08; 10/09 - 31/08 = 10 ngay qua han
    expect(debtAgeDays(invoiceDate, 30, today)).toBe(10);
  });

  it('phan nhom tuoi no dung bucket', () => {
    expect(debtAgeBucket(-5)).toBe('CURRENT');
    expect(debtAgeBucket(10)).toBe('0-30');
    expect(debtAgeBucket(45)).toBe('31-60');
    expect(debtAgeBucket(75)).toBe('61-90');
    expect(debtAgeBucket(120)).toBe('>90');
  });
});

describe('Gia ban binh quan/m3', () => {
  it('tinh dung doanh thu / tong m3 thuc giao', () => {
    expect(averageSellingPricePerM3(1_200_000_000, 1000)).toBe(1_200_000);
  });

  it('tra ve 0 khi chua co m3 nao giao (tranh chia cho 0)', () => {
    expect(averageSellingPricePerM3(0, 0)).toBe(0);
  });
});

describe('BO-06: chenh lech dinh muc vat tu', () => {
  it('BR-19: phat hien chenh lech duong (thuc xuat nhieu hon dinh muc)', () => {
    // dinh muc: 100 m3 x 350 kg/m3 = 35,000 kg; thuc xuat 36,050 kg => +3%
    expect(materialVariancePercent(36_050, 35_000)).toBeCloseTo(3, 5);
  });

  it('phat hien chenh lech am (tiet kiem hon dinh muc)', () => {
    expect(materialVariancePercent(34_300, 35_000)).toBeCloseTo(-2, 5);
  });
});
