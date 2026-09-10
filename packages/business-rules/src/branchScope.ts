// BRULE-17: Nguoi dung chi truy cap du lieu thuoc pham vi chi nhanh duoc gan;
// kiem tra o tang service (khong chi an UI). Ban LD duoc xem toan cong ty.
//
// Day la helper de goi o MOI service method truoc khi tra du lieu ve -
// khong duoc dua vao viec client tu loc theo branchId.

export class BranchScopeViolationError extends Error {
  constructor(entityBranchId: string, allowedBranchIds: string[]) {
    super(
      `Truy cap bi tu choi: du lieu thuoc chi nhanh ${entityBranchId}, ` +
        `nguoi dung chi duoc phep xem [${allowedBranchIds.join(', ')}]`,
    );
    this.name = 'BranchScopeViolationError';
  }
}

export interface UserBranchScope {
  isCompanyWide: boolean; // vd: Ban lanh dao - xem toan cong ty
  branchIds: string[];
}

/** Nem loi neu entityBranchId nam ngoai pham vi duoc gan cho nguoi dung. */
export function assertBranchScope(entityBranchId: string, scope: UserBranchScope): void {
  if (scope.isCompanyWide) return;
  if (!scope.branchIds.includes(entityBranchId)) {
    throw new BranchScopeViolationError(entityBranchId, scope.branchIds);
  }
}

export function isInBranchScope(entityBranchId: string, scope: UserBranchScope): boolean {
  return scope.isCompanyWide || scope.branchIds.includes(entityBranchId);
}
