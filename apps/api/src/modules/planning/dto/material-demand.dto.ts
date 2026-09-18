import { IsObject } from 'class-validator';

export class MaterialDemandDto {
  @IsObject()
  qtyPerM3ByMaterialByOrder!: Record<string, Record<string, number>>;
}
