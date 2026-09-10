import { availableCreditLimit, checkCreditLimit } from '../src/creditLimit';

describe('BRULE-02: han muc cong no', () => {
  const baseInput = {
    limitAmount: 1_500_000_000,
    outstandingDebt: 500_000_000,
    confirmedUnbilledOrders: 200_000_000,
    overdueDays: 0,
    maxAllowedOverdueDays: 30,
  };

  it('tinh dung han muc kha dung', () => {
    expect(availableCreditLimit(baseInput)).toBe(800_000_000);
  });

  it('cho phep don trong han muc, khong canh bao khi < 80%', () => {
    const result = checkCreditLimit(baseInput, 100_000_000);
    expect(result.allowed).toBe(true);
    if (result.allowed) expect(result.warning).toBe(false);
  });

  it('canh bao vang khi don day muc su dung >= 80% han muc', () => {
    // du no+don da xac nhan+don moi = 500tr+200tr+500tr = 1.2 ty / 1.5 ty = 80%
    const result = checkCreditLimit(baseInput, 500_000_000);
    expect(result.allowed).toBe(true);
    if (result.allowed) {
      expect(result.warning).toBe(true);
    }
  });

  it('BI CHAN (TC-03) khi gia tri don vuot han muc kha dung', () => {
    const result = checkCreditLimit(baseInput, 900_000_000);
    expect(result.allowed).toBe(false);
  });

  it('BI CHAN khi khach dang no qua han vuot nguong cho phep', () => {
    const result = checkCreditLimit({ ...baseInput, overdueDays: 45 }, 10_000_000);
    expect(result.allowed).toBe(false);
  });

  it('KHONG chan khi no qua han nhung van trong nguong cho phep', () => {
    const result = checkCreditLimit({ ...baseInput, overdueDays: 20 }, 100_000_000);
    expect(result.allowed).toBe(true);
  });
});
