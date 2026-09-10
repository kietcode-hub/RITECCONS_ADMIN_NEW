// BRULE-03 (SRS SS5): Khong xac nhan don khi khung gio vuot 100% cong suat tram
// (canh bao do, cho phep xac nhan neu nguoi dung chap nhan va ghi ly do).
// FR-M08-02: to vang >= 85%, do > 100%.
// Cong thuc nhu cau vat tu / so ngay ton / so xe can (SRS SS12.3).

export type CapacityLevel = 'OK' | 'WARNING' | 'OVER';

export interface CapacityCheckResult {
  level: CapacityLevel;
  loadRatio: number; // tong m3 / cong suat m3/h
  overVolumeM3: number; // so m3 vuot (0 neu khong vuot)
}

export function checkHourlyCapacity(
  totalVolumeM3: number,
  plantCapacityM3PerHour: number,
): CapacityCheckResult {
  const loadRatio = plantCapacityM3PerHour > 0 ? totalVolumeM3 / plantCapacityM3PerHour : Infinity;
  const overVolumeM3 = Math.max(0, totalVolumeM3 - plantCapacityM3PerHour);

  let level: CapacityLevel = 'OK';
  if (loadRatio > 1) level = 'OVER';
  else if (loadRatio >= 0.85) level = 'WARNING';

  return { level, loadRatio, overVolumeM3 };
}

/** Nhu cau vat tu(v, ngay) = Sum over PlanLine [ m3 x dinh muc/m3(cap phoi, v) ] */
export function materialDemand(
  planLines: { volumeM3: number; qtyPerM3ByMaterial: Record<string, number> }[],
): Record<string, number> {
  const demand: Record<string, number> = {};
  for (const line of planLines) {
    for (const [materialCode, qtyPerM3] of Object.entries(line.qtyPerM3ByMaterial)) {
      demand[materialCode] = (demand[materialCode] ?? 0) + line.volumeM3 * qtyPerM3;
    }
  }
  return demand;
}

/** So ngay ton(v) = Ton hien tai(v) / Nhu cau binh quan ngay(v, 7 ngay toi) */
export function stockDaysRemaining(currentStock: number, avgDailyDemandNext7Days: number): number {
  if (avgDailyDemandNext7Days <= 0) return Infinity;
  return currentStock / avgDailyDemandNext7Days;
}

/** So xe can(h) = ceil( m3 can trong gio h / (tai bon x 60 / cycle_time_phut) ) */
export function vehiclesNeeded(
  volumeM3InHour: number,
  vehicleCapacityM3: number,
  cycleTimeMinutes: number,
): number {
  const throughputPerVehiclePerHour = (vehicleCapacityM3 * 60) / cycleTimeMinutes;
  return Math.ceil(volumeM3InHour / throughputPerVehiclePerHour);
}
