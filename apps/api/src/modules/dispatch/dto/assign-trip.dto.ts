export class AssignTripDto {
  orderId!: string;
  vehicleId!: string;
  driverId!: string;
  sequenceNo!: number;
  volumeM3!: number;
  windowStart!: string; // ISO datetime - khung gio du kien chiem dung cua xe
  windowEnd!: string; // ISO datetime
}
