export class AddPlanLineDto {
  orderId!: string;
  timeSlotStart!: string; // ISO datetime
  volumeM3!: number;
  /** Bat buoc neu khung gio vuot 100% cong suat tram (BRULE-03) va nguoi dung van muon xac nhan */
  overrideReason?: string;
}
