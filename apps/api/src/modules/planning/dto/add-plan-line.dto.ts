import { IsISO8601, IsNumber, IsOptional, IsPositive, IsString, MinLength } from 'class-validator';

export class AddPlanLineDto {
  @IsString() @MinLength(1)
  orderId!: string;

  @IsISO8601()
  timeSlotStart!: string; // ISO datetime

  @IsNumber() @IsPositive()
  volumeM3!: number;

  /** Bat buoc neu khung gio vuot 100% cong suat tram (BRULE-03) va nguoi dung van muon xac nhan */
  @IsOptional() @IsString()
  overrideReason?: string;
}
