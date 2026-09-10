import { checkFloorPrice, finalUnitPrice } from '../src/pricing';

describe('cong thuc don gia cuoi', () => {
  it('cong phu phi, tru chiet khau dung', () => {
    const price = finalUnitPrice(
      1_200_000,
      [
        { code: 'PUMP_BOOM', amount: 50_000 },
        { code: 'NIGHT_SHIFT', amount: 30_000 },
      ],
      [{ code: 'VOLUME_DISCOUNT', amount: 20_000 }],
    );
    expect(price).toBe(1_260_000);
  });
});

describe('BRULE-05: gia duoi gia san', () => {
  it('khong yeu cau duyet khi gia >= gia san', () => {
    const result = checkFloorPrice(1_200_000, 1_150_000, 3);
    expect(result.isBelowFloor).toBe(false);
    expect(result.requiresApproval).toBe(false);
  });

  it('TC-02: chan/yeu cau duyet ngay khi thap hon gia san du chi 1 dong', () => {
    const result = checkFloorPrice(1_149_999, 1_150_000, 3);
    expect(result.isBelowFloor).toBe(true);
    expect(result.requiresApproval).toBe(true);
  });

  it('duyet cap 1 (GD CN) khi muc lech nam trong nguong alpha%', () => {
    // lech ~1.7% < nguong 3%
    const result = checkFloorPrice(1_130_000, 1_150_000, 3);
    expect(result.approvalLevel).toBe('BRANCH_MANAGER');
  });

  it('duyet cap 2 (Ban LD) khi muc lech vuot nguong alpha%', () => {
    // lech ~13% > nguong 3%
    const result = checkFloorPrice(1_000_000, 1_150_000, 3);
    expect(result.approvalLevel).toBe('EXECUTIVE_BOARD');
  });
});
