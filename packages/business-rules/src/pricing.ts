// BRULE-05 (SRS SS5): Gia ban < gia san phai duoc phe duyet truoc khi phat hanh bao gia.
// BRULE-20: Bang gia da "Hieu luc" khong sua; chi tao phien ban moi.
// BRULE-21: Gia ap dung cho don hang la gia hieu luc tai ngay do, hoac gia hop dong/phu luc neu co.
// Cong thuc don gia cuoi (SRS SS12.3):
//   Don gia cuoi = Don gia co so + Sum Phu phi - Chiet khau

export interface Surcharge {
  code: string; // vi du "PUMP_BOOM", "NIGHT_SHIFT", "SMALL_VOLUME", "OUT_OF_ZONE", "WAITING"
  amount: number;
}

export interface Discount {
  code: string;
  amount: number;
}

export function finalUnitPrice(
  basePrice: number,
  surcharges: Surcharge[],
  discounts: Discount[] = [],
): number {
  const surchargeTotal = surcharges.reduce((sum, s) => sum + s.amount, 0);
  const discountTotal = discounts.reduce((sum, d) => sum + d.amount, 0);
  return basePrice + surchargeTotal - discountTotal;
}

export interface FloorPriceCheckResult {
  isBelowFloor: boolean;
  requiresApproval: boolean;
  approvalLevel: 'NONE' | 'BRANCH_MANAGER' | 'EXECUTIVE_BOARD';
}

/**
 * BRULE-05 + FR-M03-07 (2-cap phe duyet): cap 1 GD CN khi chenh <= nguong alpha%,
 * cap 2 Ban LD khi chenh > alpha%. alpha cau hinh theo chi nhanh.
 */
export function checkFloorPrice(
  unitPrice: number,
  floorPrice: number,
  branchApprovalThresholdPercent: number,
): FloorPriceCheckResult {
  if (unitPrice >= floorPrice) {
    return { isBelowFloor: false, requiresApproval: false, approvalLevel: 'NONE' };
  }

  const belowPercent = ((floorPrice - unitPrice) / floorPrice) * 100;
  const approvalLevel =
    belowPercent <= branchApprovalThresholdPercent ? 'BRANCH_MANAGER' : 'EXECUTIVE_BOARD';

  return { isBelowFloor: true, requiresApproval: true, approvalLevel };
}
