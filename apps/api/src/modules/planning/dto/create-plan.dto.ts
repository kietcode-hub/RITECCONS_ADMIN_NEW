export class CreatePlanDto {
  branchId!: string;
  plantId!: string;
  planDate!: string; // "yyyy-MM-dd"
  shift!: 'MORNING' | 'AFTERNOON' | 'NIGHT';
}
