// Cac entity cot loi cho "luong xuong song" (Buoc 1 trong roadmap ky thuat):
// Khach hang/Cong trinh -> Don hang -> Ke hoach -> Dieu phoi -> Chuyen -> Phieu giao hang.
// Ma E-nn tham chieu SRS-RMCMS-v1.0 SS3.1. Day KHONG phai toan bo 48 entity -
// cac entity con lai (chat luong, vat tu, tai chinh...) se bo sung khi trien khai module tuong ung.

import {
  DeliveryNoteStatus,
  MixDesignStatus,
  OrderStatus,
  ProductionPlanStatus,
  PumpMethod,
  TripStatus,
  VehicleStatus,
} from './enums';

export interface BranchScoped {
  branchId: string;
}

/** E-02 Branch */
export interface Branch {
  id: string;
  code: string;
  name: string;
  address: string;
  cutoffTime: string; // "HH:mm" - gio cut-off nhan don cho ngay ke tiep
  nightShiftSurchargeStart: string; // "HH:mm"
}

/** E-03 Plant */
export interface Plant extends BranchScoped {
  id: string;
  code: string;
  capacityM3PerHour: number;
  lineCount: number;
}

/** E-07 Customer */
export interface Customer extends BranchScoped {
  id: string;
  name: string;
  taxCode?: string;
  phone?: string;
  salesRepUserId: string;
}

/** E-09 Site (Cong trinh) */
export interface Site extends BranchScoped {
  id: string;
  customerId: string;
  name: string;
  address: string;
  lat?: number;
  lng?: number;
  distanceFromPlantKm?: number;
}

/** E-19 CreditLimit (Han muc cong no) */
export interface CreditLimit {
  customerId: string;
  limitAmount: number;
  termDays: number;
  outstandingDebt: number; // du no hien tai
  confirmedUnbilledOrders: number; // gia tri don da xac nhan chua xuat hoa don
}

/** E-22 MixDesign (Cap phoi) */
export interface MixDesign {
  id: string;
  code: string;
  productGrade: string; // mac be tong, vi du "M300"
  slumpCm: number;
  dmaxMm: number;
  pumpable: boolean;
  branchScope: 'ALL' | string[]; // dung chung 3 CN hoac gan nhan chi nhanh ap dung
  status: MixDesignStatus;
  version: number;
}

/** E-23 MixDesignItem (Dinh muc vat tu/m3) */
export interface MixDesignItem {
  mixDesignId: string;
  materialCode: string;
  qtyPerM3: number;
  unit: string;
}

/** E-20 Order (Don hang / Yeu cau cap be tong) */
export interface Order extends BranchScoped {
  id: string;
  orderNo: string;
  siteId: string;
  contractId?: string;
  mixDesignId?: string;
  pourDateTime: string; // ISO datetime
  volumeM3: number;
  pumpMethod: PumpMethod;
  pourRateM3PerHour?: number;
  siteContactName: string;
  siteContactPhone: string;
  status: OrderStatus;
  isUrgent: boolean; // true neu tao sau cut-off (BRULE-13)
}

/** E-28 ProductionPlan (Ke hoach san xuat ngay/ca) */
export interface ProductionPlan extends BranchScoped {
  id: string;
  plantId: string;
  planDate: string; // "yyyy-MM-dd"
  shift: 'MORNING' | 'AFTERNOON' | 'NIGHT';
  status: ProductionPlanStatus;
}

/** E-29 PlanLine */
export interface PlanLine {
  planId: string;
  orderId: string;
  timeSlotStart: string; // ISO datetime, buoc 30 phut
  volumeM3: number;
}

/** E-34 Vehicle (Xe mixer) */
export interface Vehicle extends BranchScoped {
  id: string;
  plateNumber: string;
  capacityM3: number;
  owned: boolean; // tu co / thue ngoai
  status: VehicleStatus;
}

/** E-36 Driver (Tai xe) */
export interface Driver extends BranchScoped {
  id: string;
  userId: string;
  fullName: string;
  licenseNumber: string;
  licenseExpiry: string; // "yyyy-MM-dd"
  defaultVehicleId?: string;
}

/** E-30 Trip (Chuyen) */
export interface Trip {
  id: string;
  orderId: string;
  vehicleId: string;
  driverId: string;
  sequenceNo: number; // thu tu chuyen trong don
  volumeM3: number;
  status: TripStatus;
  mixingStartedAt?: string;
  departedAt?: string;
  arrivedAt?: string;
  pourStartedAt?: string;
  pourDoneAt?: string;
  returnedAt?: string;
}

/** E-32 DeliveryNote (Phieu giao hang dien tu) */
export interface DeliveryNote {
  id: string;
  noteNo: string; // duy nhat toan he thong, vi du PGH-CN1-260908-0456
  tripId: string;
  volumeOrdered: number;
  volumeActual: number;
  volumeVarianceReason?: string; // bat buoc khi lech > 5% (BRULE-15)
  slumpCm?: number;
  signedByName?: string;
  signedAt?: string;
  signatureImageUrl?: string;
  signatureLat?: number;
  signatureLng?: number;
  status: DeliveryNoteStatus;
}
