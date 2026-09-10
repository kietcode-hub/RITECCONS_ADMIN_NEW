// BRULE-11: Canh bao do khi thoi gian tu moc "Bat dau tron" > nguong (mac dinh 90 phut)
// va chuyen chua "Xong do".
// BRULE-12: Khong phan xe dang chay chuyen khac trong khung gio trung, xe Bao duong/Ngung,
// hoac m3 > tai bon.
// Cong thuc cycle time (SRS SS12.3): t(Ve tram) - t(Xuat tram) + thoi gian nap binh quan.

export const DEFAULT_MIXING_TO_POUR_WARNING_MINUTES = 90;

export function isMixingTimeExceeded(
  mixingStartedAt: Date,
  now: Date,
  pourDoneAt: Date | null,
  thresholdMinutes: number = DEFAULT_MIXING_TO_POUR_WARNING_MINUTES,
): boolean {
  if (pourDoneAt) return false; // da xong do thi khong con canh bao
  const elapsedMinutes = (now.getTime() - mixingStartedAt.getTime()) / 60000;
  return elapsedMinutes > thresholdMinutes;
}

export interface ExistingTripAssignment {
  vehicleId: string;
  windowStart: Date;
  windowEnd: Date;
}

export type VehicleAvailability = 'AVAILABLE' | 'RUNNING' | 'MAINTENANCE' | 'STOPPED';

export interface VehicleAssignmentCheckResult {
  allowed: boolean;
  reason?: string;
}

/**
 * BRULE-12: kiem tra truoc khi phan 1 xe cho 1 chuyen moi.
 */
export function checkVehicleAssignment(
  vehicleId: string,
  vehicleStatus: VehicleAvailability,
  vehicleCapacityM3: number,
  tripVolumeM3: number,
  newWindow: { start: Date; end: Date },
  existingAssignments: ExistingTripAssignment[],
): VehicleAssignmentCheckResult {
  if (vehicleStatus === 'MAINTENANCE' || vehicleStatus === 'STOPPED') {
    return { allowed: false, reason: `Xe dang o trang thai ${vehicleStatus}` };
  }

  if (tripVolumeM3 > vehicleCapacityM3) {
    return {
      allowed: false,
      reason: `Khoi luong chuyen (${tripVolumeM3} m3) vuot tai bon (${vehicleCapacityM3} m3)`,
    };
  }

  const hasOverlap = existingAssignments
    .filter((a) => a.vehicleId === vehicleId)
    .some((a) => newWindow.start < a.windowEnd && a.windowStart < newWindow.end);

  if (hasOverlap) {
    return { allowed: false, reason: 'Xe dang duoc phan cho chuyen khac trong khung gio trung' };
  }

  return { allowed: true };
}

/** Cycle time(chuyen) = t(Ve tram) - t(Xuat tram) + thoi gian nap binh quan */
export function cycleTimeMinutes(
  departedAt: Date,
  returnedAt: Date,
  avgLoadingMinutes: number,
): number {
  return (returnedAt.getTime() - departedAt.getTime()) / 60000 + avgLoadingMinutes;
}
