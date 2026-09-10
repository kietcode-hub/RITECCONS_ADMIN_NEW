import { assertBranchScope, BranchScopeViolationError, isInBranchScope } from '../src/branchScope';

describe('BRULE-17: pham vi chi nhanh', () => {
  it('TC-01: tu choi truy cap du lieu ngoai pham vi chi nhanh duoc gan', () => {
    const scope = { isCompanyWide: false, branchIds: ['CN1'] };
    expect(() => assertBranchScope('CN2', scope)).toThrow(BranchScopeViolationError);
    expect(isInBranchScope('CN2', scope)).toBe(false);
  });

  it('cho phep khi du lieu thuoc chi nhanh duoc gan', () => {
    const scope = { isCompanyWide: false, branchIds: ['CN1', 'CN2'] };
    expect(() => assertBranchScope('CN2', scope)).not.toThrow();
  });

  it('Ban lanh dao (isCompanyWide) xem duoc moi chi nhanh', () => {
    const scope = { isCompanyWide: true, branchIds: [] };
    expect(() => assertBranchScope('CN3', scope)).not.toThrow();
    expect(isInBranchScope('CN3', scope)).toBe(true);
  });
});
