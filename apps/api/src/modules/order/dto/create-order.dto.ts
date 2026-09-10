import { PumpMethod } from '@rmc-ms/shared-types';

export class CreateOrderDto {
  branchId!: string;
  customerId!: string;
  siteId!: string;
  pourDateTime!: string; // ISO datetime
  volumeM3!: number;
  estimatedValue!: number; // dung de kiem tra han muc cong no (BRULE-02)
  pumpMethod?: PumpMethod;
  siteContactName!: string;
  siteContactPhone!: string;
}
