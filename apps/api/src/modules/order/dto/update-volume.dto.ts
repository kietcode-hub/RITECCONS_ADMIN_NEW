import { IsNumber, IsPositive, Min } from 'class-validator';

export class UpdateVolumeDto {
  @IsNumber() @IsPositive()
  volumeM3!: number;

  @IsNumber() @Min(0)
  alreadyDeliveredM3!: number;
}
