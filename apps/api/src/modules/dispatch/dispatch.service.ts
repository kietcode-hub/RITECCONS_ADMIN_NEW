import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import {
  checkVehicleAssignment,
  cycleTimeMinutes,
  DEFAULT_MIXING_TO_POUR_WARNING_MINUTES,
  isMixingTimeExceeded,
} from '@rmc-ms/business-rules';
import { Trip, TripStatus, Vehicle, VehicleStatus } from '@rmc-ms/shared-types';
import { randomUUID } from 'crypto';
import { AssignTripDto } from './dto/assign-trip.dto';
import { RecordMilestoneDto, TripMilestone } from './dto/record-milestone.dto';

export interface TripRecord extends Trip {
  windowStart: Date;
  windowEnd: Date;
}

const MILESTONE_TO_STATUS: Record<TripMilestone, TripStatus> = {
  MIXING_STARTED: TripStatus.MIXING,
  DEPARTED: TripStatus.DEPARTED,
  ARRIVED: TripStatus.ARRIVED,
  POUR_STARTED: TripStatus.POURING,
  POUR_DONE: TripStatus.POUR_DONE,
  RETURNED: TripStatus.RETURNED,
};

const MILESTONE_TO_FIELD: Record<TripMilestone, keyof Trip> = {
  MIXING_STARTED: 'mixingStartedAt',
  DEPARTED: 'departedAt',
  ARRIVED: 'arrivedAt',
  POUR_STARTED: 'pourStartedAt',
  POUR_DONE: 'pourDoneAt',
  RETURNED: 'returnedAt',
};

/**
 * M10 - Bang dieu phoi & Quan ly chuyen (PRD SS3, SRS SS4.10) - man hinh trung tam
 * cua Dieu hanh. Repository dang in-memory, xem ghi chu tuong tu order.service.ts.
 */
@Injectable()
export class DispatchService {
  private readonly trips = new Map<string, TripRecord>();

  // Doi xe mau - se thay bang Vehicle that (E-34, module Fleet)
  private readonly vehicles = new Map<string, Vehicle>([
    ['V1', { id: 'V1', branchId: 'CN1', plateNumber: '51C-123.45', capacityM3: 8, owned: true, status: VehicleStatus.AVAILABLE }],
    ['V2', { id: 'V2', branchId: 'CN1', plateNumber: '51C-678.90', capacityM3: 8, owned: true, status: VehicleStatus.MAINTENANCE }],
    ['V3', { id: 'V3', branchId: 'CN1', plateNumber: '51C-111.22', capacityM3: 6, owned: true, status: VehicleStatus.AVAILABLE }],
  ]);

  /** BRULE-12: kiem tra truoc khi phan xe cho 1 chuyen. */
  assignVehicle(dto: AssignTripDto): Trip {
    const vehicle = this.vehicles.get(dto.vehicleId);
    if (!vehicle) throw new NotFoundException(`Khong tim thay xe ${dto.vehicleId}`);

    const existingAssignments = Array.from(this.trips.values())
      .filter((t) => t.status !== TripStatus.CANCELLED)
      .map((t) => ({ vehicleId: t.vehicleId, windowStart: t.windowStart, windowEnd: t.windowEnd }));

    const newWindow = { start: new Date(dto.windowStart), end: new Date(dto.windowEnd) };

    const check = checkVehicleAssignment(
      dto.vehicleId,
      vehicle.status,
      vehicle.capacityM3,
      dto.volumeM3,
      newWindow,
      existingAssignments,
    );

    if (!check.allowed) {
      throw new BadRequestException(`Khong the phan xe (BRULE-12): ${check.reason}`);
    }

    const trip: TripRecord = {
      id: randomUUID(),
      orderId: dto.orderId,
      vehicleId: dto.vehicleId,
      driverId: dto.driverId,
      sequenceNo: dto.sequenceNo,
      volumeM3: dto.volumeM3,
      status: TripStatus.ASSIGNED,
      windowStart: newWindow.start,
      windowEnd: newWindow.end,
    };

    this.trips.set(trip.id, trip);
    return trip;
  }

  findAll(): Trip[] {
    return Array.from(this.trips.values());
  }

  findOne(id: string): TripRecord {
    const trip = this.trips.get(id);
    if (!trip) throw new NotFoundException(`Khong tim thay chuyen ${id}`);
    return trip;
  }

  recordMilestone(id: string, dto: RecordMilestoneDto): Trip {
    const trip = this.findOne(id);
    const field = MILESTONE_TO_FIELD[dto.milestone];
    (trip as unknown as Record<string, unknown>)[field] = dto.timestamp;
    trip.status = MILESTONE_TO_STATUS[dto.milestone];
    return trip;
  }

  /**
   * BRULE-11: canh bao do khi qua nguong (mac dinh 90 phut) tu luc tron ma chua xong do.
   * Tra ve danh sach chuyen dang canh bao tai thoi diem `now`.
   */
  getMixingWarnings(now: Date = new Date()): { tripId: string; elapsedMinutes: number }[] {
    const warnings: { tripId: string; elapsedMinutes: number }[] = [];

    for (const trip of this.trips.values()) {
      if (!trip.mixingStartedAt) continue;
      const mixingStartedAt = new Date(trip.mixingStartedAt);
      const pourDoneAt = trip.pourDoneAt ? new Date(trip.pourDoneAt) : null;

      if (isMixingTimeExceeded(mixingStartedAt, now, pourDoneAt)) {
        const elapsedMinutes = Math.round((now.getTime() - mixingStartedAt.getTime()) / 60000);
        warnings.push({ tripId: trip.id, elapsedMinutes });
      }
    }

    return warnings;
  }

  /** Cong thuc cycle time (SRS SS12.3) - chi tinh duoc khi da co departedAt va returnedAt. */
  getCycleTimeMinutes(id: string, avgLoadingMinutes = 10): number {
    const trip = this.findOne(id);
    if (!trip.departedAt || !trip.returnedAt) {
      throw new BadRequestException('Chuyen chua co du moc Xuat tram va Ve tram de tinh chu ky xe');
    }
    return cycleTimeMinutes(new Date(trip.departedAt), new Date(trip.returnedAt), avgLoadingMinutes);
  }

  get mixingWarningThresholdMinutes(): number {
    return DEFAULT_MIXING_TO_POUR_WARNING_MINUTES;
  }
}
