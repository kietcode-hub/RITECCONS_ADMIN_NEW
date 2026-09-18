import { IsISO8601, IsInt, IsNumber, IsPositive, IsString, Min, MinLength } from 'class-validator';

export class AssignTripDto {
  @IsString() @MinLength(1)
  orderId!: string;

  @IsString() @MinLength(1)
  vehicleId!: string;

  @IsString() @MinLength(1)
  driverId!: string;

  @IsInt() @Min(1)
  sequenceNo!: number;

  @IsNumber() @IsPositive()
  volumeM3!: number;

  @IsISO8601()
  windowStart!: string; // ISO datetime - khung gio du kien chiem dung cua xe

  @IsISO8601()
  windowEnd!: string; // ISO datetime
}
