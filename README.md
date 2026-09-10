# RMC-MS — Hệ thống Quản trị Sản xuất – Kinh doanh Bê tông Thương phẩm

Monorepo (npm workspaces) cho hệ thống RMC-MS. Toàn bộ đặc tả nghiệp vụ/kỹ thuật nằm ở [`files/`](files/) — đọc [`files/05_System_Documentation_RMC-MS.md`](files/05_System_Documentation_RMC-MS.md) trước để có toàn cảnh.

## Cấu trúc

```
apps/
  api/      NestJS backend — modular monolith, 1 thư mục module = 1 module nghiệp vụ (M01..M16, xem SRS §4)
  web/      (chưa scaffold) — dự kiến React + Vite + TS
  mobile/   (chưa scaffold) — dự kiến React Native, offline-first cho tài xế/NVKD
packages/
  shared-types/     Enum trạng thái + interface entity dùng chung 3 app
  business-rules/   22 quy tắc nghiệp vụ (BRULE-01..22) viết thành pure function, có unit test riêng
files/    Tài liệu đặc tả gốc: BRD, PRD, URD, SRS + tài liệu tổng hợp
```

## Cài đặt

```bash
npm install
```

## Lệnh thường dùng

| Lệnh | Việc gì |
|---|---|
| `npm run test:business-rules` | Chạy toàn bộ unit test cho 22 quy tắc nghiệp vụ (41 test) |
| `npm run build:packages` | Build `shared-types` + `business-rules` sang `dist/` (bắt buộc trước khi chạy API) |
| `npm run dev:api` (workspace `apps/api`) | Chạy API ở chế độ watch, `http://localhost:3000` |
| `npm run test -w apps/api` | Chạy unit test của API (vd. `OrderService`) |
| `npx nest build` (trong `apps/api`) | Build production cho API |

Chạy 1 file test riêng lẻ (Jest):
```bash
npm run test -w packages/business-rules -- creditLimit.test.ts
npm run test -w apps/api -- order.service.spec.ts
```

## Trạng thái hiện tại

- ✅ `packages/business-rules`: 22 BRULE đã cài đặt đầy đủ, 41 unit test pass.
- ✅ `apps/api`: khung NestJS với 16 module theo đúng ranh giới M01–M16 (SRS §4). 3 module đã wiring đầy đủ với `business-rules` (in-memory, chưa nối DB):
  - `order` (M05) — BRULE-02 (hạn mức công nợ), BRULE-13 (đơn gấp/cut-off), BRULE-14 (không giảm khối lượng dưới đã giao)
  - `planning` (M08) — BRULE-03 (vượt công suất trạm, cần lý do), BRULE-04 (chặn chốt kế hoạch khi đơn chưa có cấp phối), tính nhu cầu vật tư (FR-M08-03)
  - `dispatch` (M10) — BRULE-11 (cảnh báo quá 90 phút từ lúc trộn), BRULE-12 (chặn phân xe trùng lịch/bảo dưỡng/vượt tải), tính chu kỳ xe

  12 module còn lại đang là **placeholder** (giữ ranh giới kiến trúc, chưa có logic) — xem `apps/api/src/modules/order` làm mẫu khi triển khai tiếp.
- ✅ `apps/api/prisma/schema.prisma`: schema DB cho luồng lõi (Khách hàng → Đơn hàng → Kế hoạch → Chuyến → Phiếu giao hàng). Chưa kết nối DB thật — cần `DATABASE_URL` (xem `apps/api/.env.example`) rồi chạy `npx prisma migrate dev`.
- ⏳ `apps/web`, `apps/mobile`: chưa scaffold.

## Quy ước bắt buộc

- Mọi bảng/entity nghiệp vụ phải có `branchId` và được lọc theo phạm vi chi nhánh **ở tầng service** (BRULE-17) — không dựa vào client lọc dữ liệu.
- Quy tắc nghiệp vụ mới phải viết trong `packages/business-rules` dưới dạng pure function + unit test, không viết trực tiếp trong controller/service của `apps/api`.
- Xem [`CLAUDE.md`](CLAUDE.md) để biết quy ước mã yêu cầu (BR-nn, FR-Mxx-nn, BRULE-nn...) và cách các tài liệu trong `files/` liên kết với nhau.
