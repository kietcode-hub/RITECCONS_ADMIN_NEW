// BRULE-13: Don cho ngay hom sau nhap sau cut-off -> is_urgent = true,
// can xac nhan cua Ke hoach/Dieu hanh truong.
// BRULE-15: Khoi luong thuc nhan lech so voi phieu > 5% phai co ly do
// va xac nhan cua Dieu hanh.
// BRULE-14: Khong cho sua m3 don hang xuong duoi m3 da giao thuc te.

export function isUrgentOrder(createdAt: Date, pourDate: Date, cutoffTime: string): boolean {
  const [cutoffHour, cutoffMinute] = cutoffTime.split(':').map(Number);

  const dayBeforePour = new Date(pourDate);
  dayBeforePour.setDate(dayBeforePour.getDate() - 1);
  dayBeforePour.setHours(cutoffHour, cutoffMinute, 0, 0);

  return createdAt.getTime() > dayBeforePour.getTime();
}

export const DELIVERY_VARIANCE_REASON_THRESHOLD = 0.05; // 5%

export function requiresVolumeVarianceReason(volumeOrdered: number, volumeActual: number): boolean {
  if (volumeOrdered <= 0) return false;
  const variance = Math.abs(volumeActual - volumeOrdered) / volumeOrdered;
  return variance > DELIVERY_VARIANCE_REASON_THRESHOLD;
}

export function canReduceOrderVolume(
  newVolumeM3: number,
  alreadyDeliveredM3: number,
): { allowed: boolean; reason?: string } {
  if (newVolumeM3 < alreadyDeliveredM3) {
    return {
      allowed: false,
      reason: `Khong the sua khoi luong don (${newVolumeM3} m3) xuong duoi khoi luong da giao (${alreadyDeliveredM3} m3)`,
    };
  }
  return { allowed: true };
}
