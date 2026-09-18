import { IsIn, IsISO8601 } from 'class-validator';

export type TripMilestone =
  | 'MIXING_STARTED'
  | 'DEPARTED'
  | 'ARRIVED'
  | 'POUR_STARTED'
  | 'POUR_DONE'
  | 'RETURNED';

const MILESTONES: TripMilestone[] = ['MIXING_STARTED', 'DEPARTED', 'ARRIVED', 'POUR_STARTED', 'POUR_DONE', 'RETURNED'];

export class RecordMilestoneDto {
  @IsIn(MILESTONES)
  milestone!: TripMilestone;

  @IsISO8601()
  timestamp!: string; // ISO datetime
}
