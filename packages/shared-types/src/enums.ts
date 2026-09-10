// Trang thai (state machines) theo SRS-RMCMS-v1.0 SS3.3

export enum OrderStatus {
  DRAFT = 'DRAFT', // Nhap
  PENDING_CONFIRM = 'PENDING_CONFIRM', // Cho xac nhan
  CONFIRMED = 'CONFIRMED', // Da xac nhan
  IN_PROGRESS = 'IN_PROGRESS', // Dang thuc hien
  COMPLETED = 'COMPLETED', // Hoan thanh
  ON_HOLD = 'ON_HOLD', // Tam dung
  CANCELLED = 'CANCELLED', // Huy (bat buoc ly do)
}

export enum TripStatus {
  CREATED = 'CREATED', // Da tao
  ASSIGNED = 'ASSIGNED', // Da phan xe
  MIXING = 'MIXING', // Dang tron
  DEPARTED = 'DEPARTED', // Xuat tram
  ARRIVED = 'ARRIVED', // Den cong trinh
  POURING = 'POURING', // Dang do
  POUR_DONE = 'POUR_DONE', // Xong do
  RETURNED = 'RETURNED', // Ve tram
  COMPLETED = 'COMPLETED', // Hoan thanh
  INCIDENT = 'INCIDENT', // Su co
  CANCELLED = 'CANCELLED', // Huy chuyen
}

export enum DeliveryNoteStatus {
  DRAFT = 'DRAFT', // Nhap (sinh khi xuat tram)
  PENDING_SIGNATURE = 'PENDING_SIGNATURE', // Cho ky
  SIGNED = 'SIGNED', // Da ky
  LOCKED = 'LOCKED', // Da chot (vao nghiem thu)
  ADJUSTMENT_REQUESTED = 'ADJUSTMENT_REQUESTED', // Yeu cau dieu chinh
  ADJUSTED = 'ADJUSTED', // Da dieu chinh
}

export enum MixDesignStatus {
  DRAFT = 'DRAFT', // Nhap
  PENDING_APPROVAL = 'PENDING_APPROVAL', // Cho duyet
  ACTIVE = 'ACTIVE', // Hieu luc
  SUSPENDED = 'SUSPENDED', // Tam dung (mau khong dat)
  EXPIRED = 'EXPIRED', // Het hieu luc
}

export enum QuotationStatus {
  DRAFT = 'DRAFT',
  PENDING_PRICE_APPROVAL = 'PENDING_PRICE_APPROVAL', // Cho duyet gia (neu duoi san)
  ISSUED = 'ISSUED', // Da phat hanh
  ACCEPTED = 'ACCEPTED', // Khach chap thuan
  REJECTED = 'REJECTED', // Tu choi
  EXPIRED = 'EXPIRED', // Het hieu luc
  CONVERTED = 'CONVERTED', // Da chuyen hop dong
}

export enum ProductionPlanStatus {
  DRAFT = 'DRAFT', // Nhap
  LOCKED = 'LOCKED', // Da chot
  IN_PROGRESS = 'IN_PROGRESS', // Dang thuc hien
  CLOSED = 'CLOSED', // Da dong
}

export enum VehicleStatus {
  AVAILABLE = 'AVAILABLE', // Kha dung
  RUNNING = 'RUNNING', // Dang chay
  MAINTENANCE = 'MAINTENANCE', // Bao duong
  STOPPED = 'STOPPED', // Ngung
}

export enum PumpMethod {
  BOOM_PUMP = 'BOOM_PUMP', // Bom can
  LINE_PUMP = 'LINE_PUMP', // Bom tinh
  DIRECT_DISCHARGE = 'DIRECT_DISCHARGE', // Xa truc tiep
}
