// BRULE-02 (SRS SS5): Khong xac nhan don khi han muc kha dung < gia tri don,
// hoac khach co no qua han > n ngay. Canh bao vang khi dung >= 80% han muc.
// Cong thuc: Han muc kha dung = Han muc - Du no - Gia tri don da xac nhan chua xuat HD (SRS SS12.3)

export interface CreditLimitInput {
  limitAmount: number;
  outstandingDebt: number;
  confirmedUnbilledOrders: number;
  overdueDays: number; // so ngay no qua han hien tai cua khach (0 neu khong co no qua han)
  maxAllowedOverdueDays: number; // nguong cau hinh theo chi nhanh
}

export type CreditCheckResult =
  | { allowed: true; availableLimit: number; warning: false }
  | { allowed: true; availableLimit: number; warning: true; reason: string }
  | { allowed: false; availableLimit: number; reason: string };

export function availableCreditLimit(input: CreditLimitInput): number {
  return input.limitAmount - input.outstandingDebt - input.confirmedUnbilledOrders;
}

/**
 * Kiem tra co duoc xac nhan don gia tri `orderValue` cho khach hang hay khong.
 * Ket qua allowed=false nghia la BI CHAN theo BRULE-02 - can GD CN / Ban LD duyet ngoai le.
 */
export function checkCreditLimit(
  input: CreditLimitInput,
  orderValue: number,
): CreditCheckResult {
  const availableLimit = availableCreditLimit(input);

  if (input.overdueDays > input.maxAllowedOverdueDays) {
    return {
      allowed: false,
      availableLimit,
      reason: `Khach dang no qua han ${input.overdueDays} ngay (vuot nguong ${input.maxAllowedOverdueDays} ngay)`,
    };
  }

  if (orderValue > availableLimit) {
    return {
      allowed: false,
      availableLimit,
      reason: `Gia tri don (${orderValue.toLocaleString('vi-VN')}) vuot han muc kha dung (${availableLimit.toLocaleString('vi-VN')})`,
    };
  }

  const usedRatio = input.limitAmount > 0
    ? (input.limitAmount - availableLimit + orderValue) / input.limitAmount
    : 1;

  if (usedRatio >= 0.8) {
    return {
      allowed: true,
      availableLimit,
      warning: true,
      reason: `Sau don nay se dung ${(usedRatio * 100).toFixed(1)}% han muc`,
    };
  }

  return { allowed: true, availableLimit, warning: false };
}
