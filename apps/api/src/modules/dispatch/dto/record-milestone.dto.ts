export type TripMilestone =
  | 'MIXING_STARTED'
  | 'DEPARTED'
  | 'ARRIVED'
  | 'POUR_STARTED'
  | 'POUR_DONE'
  | 'RETURNED';

export class RecordMilestoneDto {
  milestone!: TripMilestone;
  timestamp!: string; // ISO datetime
}
