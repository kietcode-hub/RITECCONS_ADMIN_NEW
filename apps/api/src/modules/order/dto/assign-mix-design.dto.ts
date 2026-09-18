import { IsString, MinLength } from 'class-validator';

export class AssignMixDesignDto {
  @IsString() @MinLength(1)
  mixDesignId!: string;
}
