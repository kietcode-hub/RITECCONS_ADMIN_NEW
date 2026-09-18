import { IsIn, IsISO8601, IsString, MinLength } from 'class-validator';

export class CreatePlanDto {
  @IsString() @MinLength(1)
  branchId!: string;

  @IsString() @MinLength(1)
  plantId!: string;

  @IsISO8601()
  planDate!: string; // "yyyy-MM-dd"

  @IsIn(['MORNING', 'AFTERNOON', 'NIGHT'])
  shift!: 'MORNING' | 'AFTERNOON' | 'NIGHT';
}
