import { PumpMethod } from '@rmc-ms/shared-types';
import { IsEnum, IsISO8601, IsNumber, IsOptional, IsPositive, IsString, MinLength } from 'class-validator';

export class CreateOrderDto {
  @IsString() @MinLength(1)
  branchId!: string;

  @IsString() @MinLength(1)
  customerId!: string;

  @IsString() @MinLength(1)
  siteId!: string;

  @IsISO8601()
  pourDateTime!: string; // ISO datetime

  @IsNumber() @IsPositive()
  volumeM3!: number;

  // dung de kiem tra han muc cong no (BRULE-02)
  @IsNumber() @IsPositive()
  estimatedValue!: number;

  @IsOptional() @IsEnum(PumpMethod)
  pumpMethod?: PumpMethod;

  @IsString() @MinLength(1)
  siteContactName!: string;

  @IsString() @MinLength(1)
  siteContactPhone!: string;
}
