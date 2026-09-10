// Cong thuc tai chinh (SRS SS12.3):
// Tuoi no = Ngay hien tai - (Ngay hoa don + So ngay dieu khoan thanh toan)
// Gia ban binh quan/m3 = Sum Doanh thu be tong / Sum m3 thuc giao
// Chenh lech vat tu = (Thuc xuat - Sum(m3 giao x dinh muc)) / Sum(m3 giao x dinh muc) x 100%

export function debtAgeDays(invoiceDate: Date, termDays: number, today: Date): number {
  const dueDate = new Date(invoiceDate);
  dueDate.setDate(dueDate.getDate() + termDays);
  const ageMs = today.getTime() - dueDate.getTime();
  return Math.floor(ageMs / (24 * 60 * 60 * 1000));
}

export type DebtAgeBucket = 'CURRENT' | '0-30' | '31-60' | '61-90' | '>90';

export function debtAgeBucket(ageDays: number): DebtAgeBucket {
  if (ageDays <= 0) return 'CURRENT';
  if (ageDays <= 30) return '0-30';
  if (ageDays <= 60) return '31-60';
  if (ageDays <= 90) return '61-90';
  return '>90';
}

export function averageSellingPricePerM3(totalRevenue: number, totalVolumeM3Delivered: number): number {
  if (totalVolumeM3Delivered <= 0) return 0;
  return totalRevenue / totalVolumeM3Delivered;
}

export function materialVariancePercent(actualUsage: number, plannedUsage: number): number {
  if (plannedUsage === 0) return 0;
  return ((actualUsage - plannedUsage) / plannedUsage) * 100;
}
