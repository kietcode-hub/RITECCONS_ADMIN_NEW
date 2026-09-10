# SRS — SOFTWARE REQUIREMENTS SPECIFICATION
## Hệ thống Quản trị Sản xuất – Kinh doanh Bê tông Thương phẩm (RMC-MS)

| Thông tin | Nội dung |
|---|---|
| Mã tài liệu | SRS-RMCMS-v1.0 |
| Chuẩn tham chiếu | IEEE 830 / ISO-IEC-IEEE 29148 |
| Tài liệu gốc | BRD-RMCMS-v1.0, PRD-RMCMS-v1.0, URD-RMCMS-v1.0 |
| Ngày lập | 08/09/2026 |
| Đối tượng | Tech Lead, Kiến trúc, Dev, QA, DevOps, BA |
| Trạng thái | Draft |

---

# 1. GIỚI THIỆU

## 1.1 Mục đích
Đặc tả đầy đủ yêu cầu chức năng và phi chức năng của RMC-MS ở mức đủ để thiết kế kỹ thuật, lập trình và kiểm thử. Tài liệu này là căn cứ hợp đồng kỹ thuật giữa khách hàng và đơn vị phát triển.

## 1.2 Phạm vi hệ thống
RMC-MS là hệ thống web + mobile, đa chi nhánh (3 chi nhánh, mở rộng được), phục vụ nghiệp vụ: kinh doanh (báo giá – hợp đồng – đơn hàng), kỹ thuật (cấp phối – chất lượng), kế hoạch (kế hoạch sản xuất – vật tư), điều hành (điều phối sản xuất và vận chuyển), và các nghiệp vụ liên đới (phiếu giao hàng, nghiệm thu, công nợ, báo cáo).

Không bao gồm: kế toán tổng hợp, HRM/tiền lương, mua sắm–đấu thầu, hệ điều khiển trạm trộn (chỉ tích hợp đọc dữ liệu).

## 1.3 Định nghĩa & thuật ngữ

| Thuật ngữ | Giải thích |
|---|---|
| Bê tông thương phẩm (RMC) | Bê tông trộn sẵn tại trạm, vận chuyển bằng xe mixer tới công trình |
| Cấp phối (Mix design) | Công thức tỷ lệ vật liệu cho 1 m³ bê tông đạt mác thiết kế |
| Mác bê tông | Cấp cường độ chịu nén thiết kế (M200, M250, M300… hoặc B15, B22.5) |
| Độ sụt (Slump) | Chỉ tiêu độ dẻo của bê tông tươi, đơn vị cm (VD: 12±2) |
| Dmax | Đường kính hạt lớn nhất của cốt liệu (VD: 20 mm) |
| Mẻ trộn (Batch) | Một lần trộn tại trạm, thường 1–3 m³ |
| Chuyến (Trip/Load) | Một lần xe mixer chở bê tông từ trạm tới công trình |
| Phiếu giao hàng (e-DO) | Chứng từ điện tử kèm mỗi chuyến, có ký nhận của khách |
| Chu kỳ xe (Cycle time) | Tổng thời gian xe từ lúc nạp đến lúc quay lại trạm sẵn sàng chuyến kế |
| Bơm cần / bơm tĩnh | Xe bơm có cần vươn / máy bơm cố định qua ống |
| R7 / R28 | Cường độ nén mẫu ở tuổi 7 ngày / 28 ngày |
| Cut-off | Mốc giờ chốt nhận đơn cho ngày kế tiếp |
| Giá sàn | Giá bán tối thiểu cho phép không cần phê duyệt |
| DSO | Days Sales Outstanding — số ngày thu tiền bình quân |
| Geofence | Vùng ranh giới địa lý ảo để tự nhận diện xe đến/rời công trình |

## 1.4 Quy ước mã yêu cầu
`FR-<Mm>-<nn>` yêu cầu chức năng; `NFR-<nhóm>-<nn>` phi chức năng; `BRULE-<nn>` quy tắc nghiệp vụ; `INT-<nn>` yêu cầu tích hợp; `RPT-<nn>` báo cáo; `E-<nn>` thực thể dữ liệu.

---

# 2. MÔ TẢ TỔNG QUAN

## 2.1 Kiến trúc hệ thống đề xuất

```
┌─────────────────────────── CLIENT TIER ───────────────────────────┐
│  Web App (SPA)          Mobile App (Android/iOS)                  │
│  • Kinh doanh           • Tài xế (offline-first)                  │
│  • Kỹ thuật             • NVKD                                    │
│  • Kế hoạch             • Kỹ thuật/QC hiện trường                 │
│  • Điều hành (realtime) • Lãnh đạo (duyệt + dashboard)            │
└────────────┬─────────────────────────────┬────────────────────────┘
             │ HTTPS/REST + WebSocket      │ HTTPS/REST + Sync API
┌────────────▼─────────────────────────────▼────────────────────────┐
│                      API GATEWAY / BFF                            │
│        AuthN/AuthZ (JWT) · Rate limit · Audit · Branch scope      │
└────────────┬──────────────────────────────────────────────────────┘
             │
┌────────────▼──────────────────────────────────────────────────────┐
│                    APPLICATION SERVICES                           │
│  Sales  │ Contract │ Order │ MixDesign │ Quality │ Planning │      │
│  Material │ Dispatch │ Fleet │ Delivery │ AR │ Reporting │ Admin   │
│                                                                    │
│  Cross-cutting: Notification · Document (PDF) · Rules engine ·     │
│                 Integration adapters · Job scheduler               │
└────┬───────────────┬───────────────┬───────────────┬──────────────┘
     │               │               │               │
┌────▼────┐  ┌───────▼──────┐  ┌────▼─────┐  ┌──────▼──────────┐
│ RDBMS   │  │ Cache/PubSub │  │ Object   │  │ Read/Analytics  │
│(Postgre │  │ (Redis)      │  │ Storage  │  │ store (BI)      │
│ SQL)    │  │              │  │ (S3/MinIO│  │                 │
└─────────┘  └──────────────┘  └──────────┘  └─────────────────┘

┌──────────────────────── EXTERNAL SYSTEMS ─────────────────────────┐
│ Batching plant │ GPS provider │ E-Invoice │ Accounting │ Zalo/SMS │
│ (DB/file/API)  │ (REST)       │ (NĐ123)   │ (API/file) │ Map API  │
└───────────────────────────────────────────────────────────────────┘
```

**Ghi chú kiến trúc:**
- **Modular monolith** được khuyến nghị cho giai đoạn 1 (đội dùng ~40 người nội bộ, không cần microservices), nhưng phải tách rõ ranh giới module theo bảng M01–M16 để có thể tách dịch vụ về sau.
- **Realtime**: bảng điều phối dùng WebSocket/SSE; các module khác dùng REST.
- **Offline mobile**: SQLite cục bộ + hàng đợi đồng bộ có idempotency key.
- **Đa chi nhánh**: single database, cột `branch_id` bắt buộc trên mọi bảng nghiệp vụ + row-level scope ở tầng service (không dựa vào client filter).

## 2.2 Người dùng hệ thống
Xem URD §2. Tổng: ~40 tài khoản văn phòng + 30–60 tài khoản tài xế. Đồng thời (peak): ~35 phiên web + ~60 phiên mobile.

## 2.3 Ràng buộc thiết kế

| Mã | Ràng buộc |
|---|---|
| DC-01 | Giao diện, dữ liệu, báo cáo tiếng Việt (UTF-8); múi giờ Asia/Ho_Chi_Minh |
| DC-02 | Hệ thống hoạt động 24/7 (có ca đêm); cửa sổ bảo trì 02:00–04:00, thông báo trước ≥ 24h |
| DC-03 | Mobile tài xế phải chạy trên Android 10+ máy cấu hình thấp (RAM 2GB), APK ≤ 60 MB |
| DC-04 | Không phụ thuộc kết nối liên tục ở tầng mobile hiện trường |
| DC-05 | Tuân thủ NĐ13/2023 về dữ liệu cá nhân; NĐ123/2020 & TT78/2021 về hóa đơn điện tử |
| DC-06 | Mọi số liệu tiền tệ dùng kiểu decimal (không float); khối lượng bê tông decimal(10,2) m³ |
| DC-07 | Không xóa cứng (hard delete) bản ghi nghiệp vụ — chỉ soft delete/huỷ có lý do |

## 2.4 Giả định & phụ thuộc
Xem BRD §8.1 (AS-01…AS-08) và PRD §9 (DP-01…DP-08).

---

# 3. MÔ HÌNH DỮ LIỆU

## 3.1 Thực thể chính

| Mã | Thực thể | Thuộc tính chính | Quan hệ |
|---|---|---|---|
| E-01 | `Company` | mã, tên, MST, địa chỉ | 1–N Branch |
| E-02 | `Branch` (Chi nhánh) | mã, tên, địa chỉ, toạ độ, tham số vận hành (cut-off, giờ ca, phụ thu đêm) | 1–N Plant, User, Vehicle |
| E-03 | `Plant` (Trạm trộn) | mã, chi nhánh, công suất m³/h, số line, trạng thái | 1–N Silo, Batch |
| E-04 | `User` | mã, tên, SĐT, email, trạng thái, chi nhánh mặc định | N–N Role, N–N BranchScope |
| E-05 | `Role` / `Permission` | mã vai trò, danh sách quyền | — |
| E-06 | `Delegation` (Uỷ quyền) | người uỷ quyền, người nhận, phạm vi quyền, từ ngày – đến ngày | N–1 User |
| E-07 | `Customer` (Khách hàng) | mã, tên, MST, loại, NVKD phụ trách, chi nhánh, trạng thái rủi ro | 1–N Site, Contract, Invoice |
| E-08 | `Contact` | khách hàng, tên, chức vụ, SĐT, email | N–1 Customer |
| E-09 | `Site` (Công trình) | mã, tên, khách hàng, địa chỉ, toạ độ, cự ly từ trạm, điều kiện tiếp cận, khối lượng dự kiến | 1–N Order |
| E-10 | `Opportunity` (Cơ hội) | site, giai đoạn, m³ dự kiến, giá trị, xác suất, NVKD, lý do thắng/thua | N–1 Site |
| E-11 | `Product` (Sản phẩm bê tông) | mã, mác, độ sụt, Dmax, loại XM, bơm/không bơm | 1–N MixDesign, PriceItem |
| E-12 | `PriceList` / `PriceItem` | chi nhánh, hiệu lực từ–đến, phiên bản, trạng thái / sản phẩm, vùng cự ly, đơn giá, **giá sàn** | N–1 Branch |
| E-13 | `SurchargeRule` | loại (bơm cần/tĩnh/ca đêm/KL nhỏ/chờ/ngoài vùng), cách tính (theo m³/ca/giờ), giá trị, điều kiện áp dụng | N–1 Branch |
| E-14 | `Quotation` (Báo giá) | số BG, site, khách, phiên bản, trạng thái, hiệu lực, người lập | 1–N QuotationLine, 1–1 Contract |
| E-15 | `QuotationLine` | sản phẩm, m³, đơn giá, phụ phí, thành tiền, giá sàn tại thời điểm, cờ dưới sàn |  N–1 Quotation |
| E-16 | `Approval` (Phê duyệt) | loại (giá/hạn mức/điều chuyển/điều chỉnh phiếu), đối tượng, cấp duyệt, người duyệt, kết quả, lý do, thời điểm | polymorphic |
| E-17 | `Contract` (Hợp đồng) | số HĐ, khách, site, m³ cam kết, hiệu lực, điều khoản thanh toán, file ký | 1–N ContractAnnex, Order |
| E-18 | `ContractAnnex` (Phụ lục) | hợp đồng, loại (giá/khối lượng), hiệu lực từ, nội dung | N–1 Contract |
| E-19 | `CreditLimit` (Hạn mức) | khách hàng, hạn mức tiền, số ngày nợ, người duyệt, hiệu lực | N–1 Customer |
| E-20 | `Order` (Đơn hàng/Yêu cầu cấp BT) | số đơn, chi nhánh, site, hợp đồng, ngày giờ đổ, hạng mục, sản phẩm, m³ đặt, độ sụt, phương thức bơm, tốc độ đổ, liên hệ hiện trường, trạng thái, cờ đơn gấp | 1–N Trip, N–1 MixDesign |
| E-21 | `OrderChangeLog` | đơn, trường thay đổi, giá trị cũ/mới, người, thời điểm, lý do | N–1 Order |
| E-22 | `MixDesign` (Cấp phối) | mã, tên, sản phẩm, phiên bản, trạng thái, hiệu lực, người duyệt, phạm vi chi nhánh, ghi chú | 1–N MixDesignItem |
| E-23 | `MixDesignItem` (Định mức) | cấp phối, vật tư, khối lượng/m³, dung sai | N–1 MixDesign, Material |
| E-24 | `Material` (Vật tư) | mã, tên, loại (XM/cát/đá/phụ gia/tro bay/nước), đơn vị, ngưỡng tồn an toàn | 1–N MaterialLot |
| E-25 | `MaterialLot` (Lô vật tư) | vật tư, nhà cung cấp, số lô, ngày nhập, khối lượng, chứng chỉ (file) | N–1 Material |
| E-26 | `Silo` / `StockBalance` | trạm, vật tư, dung tích / tồn theo ngày | N–1 Plant |
| E-27 | `MaterialRequest` (Đề nghị mua) | chi nhánh, vật tư, khối lượng, ngày cần, trạng thái, người duyệt | N–1 Branch |
| E-28 | `ProductionPlan` (Kế hoạch SX) | chi nhánh, trạm, ngày, ca, trạng thái (Nháp/Chốt), người chốt | 1–N PlanLine |
| E-29 | `PlanLine` | kế hoạch, đơn hàng, khung giờ, m³, cấp phối, ghi chú | N–1 ProductionPlan, Order |
| E-30 | `Trip` (Chuyến) | mã chuyến, đơn hàng, xe, tài xế, xe bơm, m³ dự kiến, thứ tự chuyến, trạng thái, các mốc thời gian (trộn/xuất trạm/đến/bắt đầu đổ/xong/về trạm) | 1–1 DeliveryNote, 1–N Batch |
| E-31 | `Batch` (Mẻ trộn) | chuyến, mã mẻ từ trạm, cấp phối, m³, thời điểm, vật tư thực dùng (JSON) | N–1 Trip |
| E-32 | `DeliveryNote` (Phiếu giao hàng) | số phiếu (theo CN), chuyến, m³ theo phiếu, **m³ thực nhận**, độ sụt hiện trường, người nhận, chữ ký (file), ảnh, toạ độ ký, trạng thái (Nháp/Đã ký/Đã chốt/Điều chỉnh) | 1–1 Trip |
| E-33 | `TripIncident` (Sự cố) | chuyến, loại, nguyên nhân, m³ trả về, mô tả, ảnh, người ghi | N–1 Trip |
| E-34 | `Vehicle` (Xe mixer) | biển số, tải bồn m³, chi nhánh, tự có/thuê, trạng thái, thiết bị GPS | 1–N Trip |
| E-35 | `PumpUnit` (Xe bơm) | mã, loại, tầm với, năng suất m³/h, chi nhánh, trạng thái | 1–N Trip |
| E-36 | `Driver` (Tài xế) | user, giấy phép & hạn, chi nhánh, xe mặc định, trạng thái | 1–N Trip |
| E-37 | `ResourceTransfer` (Điều chuyển) | loại (xe/bơm/vật tư), CN nguồn, CN đích, đối tượng, từ–đến, trạng thái, phê duyệt, chi phí nội bộ | — |
| E-38 | `SampleSet` (Tổ mẫu) | mã mẫu, chuyến/đơn/site, cấp phối, ngày đúc, số viên, ngày ép R7/R28 dự kiến | 1–N SampleResult |
| E-39 | `SampleResult` (Kết quả nén) | tổ mẫu, tuổi mẫu, viên số, lực nén, cường độ, người thí nghiệm, kết luận | N–1 SampleSet |
| E-40 | `QualityComplaint` (Khiếu nại) | khách, site, chuyến liên quan, nội dung, điều tra, kết luận, hành động khắc phục, trạng thái | — |
| E-41 | `QualityDossier` (Hồ sơ chất lượng) | site/hợp đồng, kỳ, danh sách chứng từ, file PDF gộp, người xuất | — |
| E-42 | `Acceptance` (Nghiệm thu) | khách, site, hợp đồng, kỳ, tổng m³, danh sách phiếu, file biên bản, trạng thái | 1–N InvoiceRequest |
| E-43 | `InvoiceRequest` (Đề nghị HĐ) | nghiệm thu, tổng tiền, thuế, trạng thái, số hóa đơn nhận về, mã tra cứu | N–1 Acceptance |
| E-44 | `Payment` (Thu tiền) | khách, hóa đơn, số tiền, ngày, hình thức, nguồn (tay/tích hợp) | N–1 Customer |
| E-45 | `Notification` | người nhận, loại, nội dung, kênh (in-app/push/Zalo/SMS), trạng thái | — |
| E-46 | `AuditLog` | người, hành động, thực thể, khoá bản ghi, giá trị cũ/mới (JSON), IP, thời điểm | append-only |
| E-47 | `Attachment` | thực thể, khoá, loại file, đường dẫn, kích thước, người tải | polymorphic |
| E-48 | `SyncQueueItem` (mobile) | thiết bị, người dùng, loại nghiệp vụ, payload, idempotency key, trạng thái | — |

## 3.2 Quan hệ trọng yếu (luồng khối lượng)

```
Contract ──1:N──► Order ──1:N──► Trip ──1:1──► DeliveryNote
                    │              │                │
                    │              └──1:N──► Batch  │
                    │                               │
                    └──N:1──► MixDesign             ▼
                                            Acceptance ──1:N──► InvoiceRequest ──► Payment
```
**Nguyên tắc bất biến:** một m³ bê tông chỉ được ghi nhận doanh thu qua **duy nhất một** `DeliveryNote` đã ký, và mỗi `DeliveryNote` chỉ thuộc **một** `Acceptance`.

## 3.3 Máy trạng thái

**E-20 `Order`:**
```
Nháp → Chờ xác nhận → Đã xác nhận → Đang thực hiện → Hoàn thành
  │          │              │              │
  └──────────┴──────────────┴──────────────┴──► Hủy (bắt buộc lý do)
                            └──► Tạm dừng ──► Đã xác nhận
```

**E-30 `Trip`:**
```
Đã tạo → Đã phân xe → Đang trộn → Xuất trạm → Đến công trình
   → Đang đổ → Xong đổ → Về trạm → Hoàn thành
        │
        └──► Sự cố ──► Hủy chuyến (kèm m³ trả về) / Chuyển xe khác
```

**E-32 `DeliveryNote`:**
```
Nháp (sinh khi xuất trạm) → Chờ ký → Đã ký → Đã chốt (đưa vào nghiệm thu)
                                        │
                                        └──► Yêu cầu điều chỉnh → (duyệt) → Đã điều chỉnh
```

**E-22 `MixDesign`:** `Nháp → Chờ duyệt → Hiệu lực → Hết hiệu lực` (có thể `Tạm dừng` khi mẫu không đạt)

**E-14 `Quotation`:** `Nháp → Chờ duyệt giá (nếu dưới sàn) → Đã phát hành → Khách chấp thuận / Từ chối / Hết hiệu lực → Đã chuyển hợp đồng`

**E-28 `ProductionPlan`:** `Nháp → Đã chốt → Đang thực hiện → Đã đóng`

---

# 4. YÊU CẦU CHỨC NĂNG

## 4.1 M01 — Quản trị hệ thống & Danh mục

| Mã | Yêu cầu | Chi tiết kỹ thuật | Ưu tiên |
|---|---|---|---|
| FR-M01-01 | Quản lý cây tổ chức Company → Branch → Plant → Department | CRUD; không cho xóa nếu đã có dữ liệu nghiệp vụ; thêm chi nhánh chỉ bằng cấu hình | M |
| FR-M01-02 | Quản lý người dùng | CRUD; trạng thái Active/Locked; reset mật khẩu; bắt buộc đổi mật khẩu lần đầu | M |
| FR-M01-03 | Quản lý vai trò & quyền | 12 vai trò định nghĩa sẵn (URD §4); quyền ở mức chức năng + mức hành động (view/create/edit/approve/export) | M |
| FR-M01-04 | Gán phạm vi chi nhánh cho người dùng | 1 người có thể được gán N chi nhánh; mọi truy vấn tự lọc theo scope ở tầng service | M |
| FR-M01-05 | Uỷ quyền theo thời gian | Người dùng/Admin tạo `Delegation`; hệ thống tự áp dụng quyền phê duyệt trong khoảng thời gian; log rõ "X duyệt thay Y" | M |
| FR-M01-06 | Danh mục sản phẩm bê tông | Mác, độ sụt, Dmax, loại XM, cờ bơm; chống trùng theo tổ hợp thuộc tính | M |
| FR-M01-07 | Danh mục vật tư, nhà cung cấp, đơn vị & hệ số quy đổi | Bao gồm quy đổi kg↔tấn, m³↔tấn theo khối lượng riêng cốt liệu | M |
| FR-M01-08 | Danh mục vùng cự ly & thời gian di chuyển chuẩn | Vùng theo bán kính (0–5, 5–10, 10–20, >20 km) hoặc theo địa bàn; thời gian chuẩn dùng để tính giãn chuyến | M |
| FR-M01-09 | Tham số vận hành theo chi nhánh | Cut-off (giờ), giờ bắt đầu 3 ca, ngưỡng phụ thu đêm, công suất trạm, ngưỡng cảnh báo (phút từ lúc trộn, phút chờ tại CT, % hạn mức) | M |
| FR-M01-10 | Nhật ký hệ thống | Append-only; ghi bắt buộc cho: giá, giá sàn, hạn mức, cấp phối, m³ phiếu giao hàng, nghiệm thu, phân quyền; lưu ≥ 5 năm; không có API xóa | M |
| FR-M01-11 | Import dữ liệu từ Excel | Template cho Customer, Site, MixDesign, Vehicle, Driver, PriceItem; validate từng dòng, xuất file lỗi kèm số dòng và nguyên nhân; import lại chỉ dòng lỗi | M |
| FR-M01-12 | Cấu hình mẫu chứng từ | Mẫu báo giá, phiếu giao hàng, biên bản nghiệm thu, hồ sơ chất lượng: logo, thông tin CN, điều khoản | M |
| FR-M01-13 | Cấu hình bộ đánh số chứng từ | Prefix theo chi nhánh + năm + số tăng dần, VD `BG-CN1-2026-00123`, `PGH-CN1-260908-0456`; duy nhất toàn hệ thống | M |

## 4.2 M02 — Khách hàng, Công trình, Cơ hội

| Mã | Yêu cầu | Chi tiết kỹ thuật | Ưu tiên |
|---|---|---|---|
| FR-M02-01 | CRUD khách hàng | Trường bắt buộc: tên, loại KH, chi nhánh, NVKD phụ trách; MST bắt buộc với KH doanh nghiệp | M |
| FR-M02-02 | Chống trùng khách hàng | Kiểm tra MST (exact), SĐT (exact), tên (fuzzy ≥ 85%); cảnh báo và cho chọn "dùng bản ghi có sẵn" hoặc "vẫn tạo mới (kèm lý do)" | M |
| FR-M02-03 | CRUD liên hệ | Nhiều liên hệ/khách, đánh dấu liên hệ chính | M |
| FR-M02-04 | CRUD công trình | Bắt buộc: tên, khách, địa chỉ; toạ độ lấy từ GPS hoặc chọn trên bản đồ; cự ly tính tự động từ trạm gần nhất | M |
| FR-M02-05 | Ghi nhận điều kiện tiếp cận công trình | Đường vào (rộng/hẹp), tải trọng cho phép, giờ cấm tải, yêu cầu bơm, ảnh hiện trường (≥ 5 ảnh) | M |
| FR-M02-06 | Tính cự ly & thời gian di chuyển | Gọi Map API; cache kết quả; cho phép ghi đè thủ công có ghi lý do | S |
| FR-M02-07 | Quản lý cơ hội | Giai đoạn (Tiềm năng/Báo giá/Đàm phán/Thắng/Thua); tự chuyển giai đoạn khi phát hành báo giá / ký hợp đồng | S |
| FR-M02-08 | Lịch sử tương tác | Loại (gọi/gặp/khảo sát), nội dung, check-in GPS trên mobile, đính kèm ảnh | S |
| FR-M02-09 | Bàn giao khách hàng | Chuyển hàng loạt Customer/Site/Opportunity từ NVKD A sang B; giữ lịch sử; ghi audit | S |
| FR-M02-10 | Nhãn rủi ro khách hàng | Tự động gắn nhãn khi: có nợ quá hạn > 0, dùng ≥ 80% hạn mức, có khiếu nại chất lượng chưa đóng | S |

## 4.3 M03 — Bảng giá, Báo giá, Phê duyệt giá

| Mã | Yêu cầu | Chi tiết kỹ thuật | Ưu tiên |
|---|---|---|---|
| FR-M03-01 | Quản lý bảng giá theo chi nhánh & phiên bản | Khoá: (branch, product, distance_zone, effective_from); có `list_price` và `floor_price`; chỉ 1 phiên bản hiệu lực tại một thời điểm | M |
| FR-M03-02 | Phê duyệt bảng giá | Bảng giá mới ở trạng thái Nháp → GĐ CN/Ban LĐ duyệt → Hiệu lực; không sửa bảng giá đã hiệu lực (phải tạo phiên bản mới) | M |
| FR-M03-03 | Quản lý quy tắc phụ phí | Loại: bơm cần (đ/m³ hoặc đ/ca + tối thiểu m³), bơm tĩnh, phụ thu ca đêm (% hoặc đ/m³), phụ thu khối lượng nhỏ (< n m³), phụ phí chờ (đ/giờ sau x phút), phụ phí ngoài vùng (đ/km), chiết khấu khối lượng (bậc thang) | M |
| FR-M03-04 | Máy tính giá (Pricing engine) | Input: product, m³, site (→ zone), phương thức bơm, ca, điều kiện thanh toán, hợp đồng (nếu có). Output: đơn giá cơ sở + từng dòng phụ phí/chiết khấu + đơn giá cuối + so sánh giá sàn. Thứ tự áp dụng phải cấu hình được | M |
| FR-M03-05 | Tạo báo giá | Nhiều dòng sản phẩm; hiệu lực báo giá (mặc định 30 ngày, cấu hình được); tự sinh số theo FR-M01-13 | M |
| FR-M03-06 | Phát hiện & xử lý giá dưới sàn | Nếu `unit_price < floor_price` → chặn phát hành, bắt buộc tạo `Approval` kèm lý do; lưu `floor_price` tại thời điểm đó vào QuotationLine | M |
| FR-M03-07 | Luồng phê duyệt giá 2 cấp | Cấp 1: GĐ CN (khi chênh ≤ ngưỡng α%). Cấp 2: Ban LĐ (khi chênh > α%). α cấu hình theo chi nhánh. Duyệt được trên mobile; ghi timestamp và lý do | M |
| FR-M03-08 | Xuất PDF báo giá theo mẫu | Server-side render; logo, thông tin CN, bảng giá, điều khoản, hiệu lực, người lập; watermark "Bản nháp" nếu chưa phát hành | M |
| FR-M03-09 | Gửi báo giá | Email (SMTP) và/hoặc Zalo OA; log trạng thái gửi | M |
| FR-M03-10 | Phiên bản báo giá | Tạo Rev mới từ bản cũ; giữ toàn bộ lịch sử; so sánh 2 phiên bản | S |
| FR-M03-11 | Báo giá trên mobile | Luồng rút gọn ≤ 4 bước; hoạt động khi mạng yếu (lưu nháp offline, phát hành khi có mạng) | M |
| FR-M03-12 | Hiển thị giá thành sơ bộ & biên lợi nhuận | Giá thành = Σ(định mức cấp phối × giá vật tư hiện hành) + chi phí vận chuyển theo cự ly + chi phí bơm; chỉ hiển thị cho vai trò có quyền | C |

## 4.4 M04 — Hợp đồng, Phụ lục, Hạn mức

| Mã | Yêu cầu | Chi tiết kỹ thuật | Ưu tiên |
|---|---|---|---|
| FR-M04-01 | CRUD hợp đồng | Số HĐ, khách, site (1 hoặc nhiều), m³ cam kết, hiệu lực từ–đến, điều khoản thanh toán (số ngày, tạm ứng %, bảo lãnh) | M |
| FR-M04-02 | Tạo hợp đồng từ báo giá | Kế thừa toàn bộ QuotationLine → giá hợp đồng; liên kết 2 chiều | M |
| FR-M04-03 | Đính kèm hợp đồng đã ký | Hợp đồng chỉ chuyển trạng thái "Hiệu lực" khi có ≥ 1 attachment loại "Hợp đồng ký" | M |
| FR-M04-04 | Quản lý hạn mức công nợ | `CreditLimit` do GĐ CN/Ban LĐ duyệt; tính **hạn mức khả dụng** = hạn mức − (dư nợ + giá trị đơn đã xác nhận chưa xuất hóa đơn) | M |
| FR-M04-05 | Cảnh báo hợp đồng | Job hàng ngày: cảnh báo hết hạn ≤ 30 ngày; đạt ≥ 90% m³ cam kết; hợp đồng hết hiệu lực còn đơn đang chạy | M |
| FR-M04-06 | Phụ lục điều chỉnh giá | Tạo `ContractAnnex` loại giá, hiệu lực từ ngày; đơn hàng sau ngày đó dùng giá mới; đơn trước giữ giá cũ | S |
| FR-M04-07 | Tiến độ hợp đồng | m³ đã giao / cam kết, doanh thu, đã thu, còn nợ; cập nhật realtime từ DeliveryNote và Payment | S |

## 4.5 M05 — Đơn hàng & Yêu cầu cấp bê tông

| Mã | Yêu cầu | Chi tiết kỹ thuật | Ưu tiên |
|---|---|---|---|
| FR-M05-01 | Tạo yêu cầu cấp bê tông | Bắt buộc: site, ngày giờ đổ, hạng mục kết cấu, sản phẩm (mác + độ sụt), m³, phương thức (bơm cần/bơm tĩnh/xả trực tiếp), tốc độ đổ mong muốn (m³/h), liên hệ hiện trường (tên + SĐT) | M |
| FR-M05-02 | Kiểm tra tự động khi tạo/xác nhận đơn | 4 kiểm tra bắt buộc — xem BRULE-01…BRULE-04 | M |
| FR-M05-03 | Quy tắc cut-off & đơn gấp | So `created_at` với cut-off của chi nhánh cho ngày đổ; nếu sau cut-off → set `is_urgent = true`, yêu cầu xác nhận của Kế hoạch/Điều hành trưởng | M |
| FR-M05-04 | Xác nhận đơn | Chỉ Kế hoạch (hoặc người được uỷ quyền) chuyển "Chờ xác nhận" → "Đã xác nhận"; gửi thông báo tới NVKD và (tùy chọn) khách hàng | M |
| FR-M05-05 | Sửa/hủy đơn có lưu vết | Ghi `OrderChangeLog` cho mọi thay đổi m³, giờ, sản phẩm, site; không cho sửa m³ nhỏ hơn m³ đã giao | M |
| FR-M05-06 | Áp dụng phí hủy/phí chờ | Theo cấu hình: hủy sau cut-off / hủy khi xe đã xuất trạm → sinh dòng phụ phí vào nghiệm thu | S |
| FR-M05-07 | Đơn nhiều ngày | Một yêu cầu sinh N đơn theo lịch (ngày, m³/ngày, giờ) | S |
| FR-M05-08 | Thông báo khách hàng | Zalo/SMS tại các mốc: xác nhận đơn, xe xuất trạm chuyến đầu, hoàn thành đơn; template cấu hình được; opt-out theo khách | S |
| FR-M05-09 | Tạo đơn từ mobile | NVKD tạo đơn 24/7; lưu nháp offline | M |
| FR-M05-10 | Gợi ý cấp phối cho đơn | Tìm `MixDesign` trạng thái Hiệu lực khớp (mác, độ sụt, Dmax, cờ bơm), ưu tiên cấp phối riêng của site; Kỹ thuật xác nhận | M |

## 4.6 M06 — Cấp phối & Định mức

| Mã | Yêu cầu | Chi tiết kỹ thuật | Ưu tiên |
|---|---|---|---|
| FR-M06-01 | CRUD cấp phối | Thuộc tính: sản phẩm, phiên bản, phạm vi chi nhánh áp dụng (1/nhiều/tất cả), điều kiện áp dụng, ghi chú kỹ thuật | M |
| FR-M06-02 | Định mức vật tư/m³ | Dòng vật tư + khối lượng/m³ + dung sai %; tính và hiển thị tổng khối lượng/m³, tỷ lệ N/X, hệ số điều chỉnh độ ẩm cốt liệu | M |
| FR-M06-03 | Validate định mức | Cảnh báo nếu tổng khối lượng/m³ ngoài khoảng 2.200–2.600 kg; nếu N/X ngoài 0,3–0,7; cảnh báo không chặn | M |
| FR-M06-04 | Phê duyệt cấp phối | Nháp → Chờ duyệt → Hiệu lực; người duyệt là Kỹ thuật cấp có quyền hoặc người được uỷ quyền (FR-M01-05); ghi audit | M |
| FR-M06-05 | Tạo phiên bản mới | Clone cấp phối, tăng version; phiên bản cũ tự chuyển "Hết hiệu lực" từ ngày phiên bản mới hiệu lực | M |
| FR-M06-06 | Chỉ cấp phối hiệu lực được dùng sản xuất | Ràng buộc ở tầng service khi gán vào Order/PlanLine/Batch | M |
| FR-M06-07 | Cấp phối riêng theo công trình | Gắn `site_id`; ưu tiên hơn cấp phối chung khi gợi ý | S |
| FR-M06-08 | Tạm dừng cấp phối | Khi có kết quả mẫu không đạt liên quan, cho phép chuyển "Tạm dừng"; các đơn đang dùng phải được xử lý và ghi nhận | S |
| FR-M06-09 | So sánh chi phí cấp phối | Tính chi phí vật tư/m³ theo giá vật tư kỳ hiện hành; so sánh N phương án | C |

## 4.7 M07 — Chất lượng & Thí nghiệm

| Mã | Yêu cầu | Chi tiết kỹ thuật | Ưu tiên |
|---|---|---|---|
| FR-M07-01 | Cấu hình tần suất lấy mẫu | Theo m³ (mỗi n m³/ca/cấp phối), theo ca, hoặc theo công trình; sinh nhiệm vụ lấy mẫu tự động | S |
| FR-M07-02 | Ghi độ sụt hiện trường | Trên mobile, gắn với `Trip`/`DeliveryNote`; nhập giá trị (cm), so dung sai của sản phẩm, cảnh báo nếu ngoài dung sai; kèm ảnh; offline được | M |
| FR-M07-03 | Tạo tổ mẫu | Mã mẫu tự sinh; gắn chuyến/đơn/site/cấp phối; số viên; hệ thống tự tính ngày ép R7 = ngày đúc + 7, R28 = + 28 | S |
| FR-M07-04 | Nhập kết quả nén | Kết quả từng viên (lực nén kN hoặc cường độ MPa); hệ thống tính trung bình tổ mẫu và so mác thiết kế; kết luận Đạt/Không đạt theo quy tắc cấu hình | S |
| FR-M07-05 | Nhắc mẫu đến hạn | Job hàng ngày 07:00: thông báo mẫu đến hạn ép hôm nay và quá hạn chưa có kết quả | S |
| FR-M07-06 | Escalate mẫu không đạt | Khi kết luận "Không đạt": thông báo tức thời tới Kỹ thuật + GĐ CN; tự tạo `QualityComplaint` nội bộ; liệt kê các `Trip` cùng cấp phối trong ±1 ca | S |
| FR-M07-07 | Quản lý lô vật tư & chứng chỉ | CRUD `MaterialLot` + attachment CO/CQ/kết quả kiểm nghiệm; liên kết lô với `Batch` (từ tích hợp trạm hoặc gán theo ngày) | S |
| FR-M07-08 | Xuất hồ sơ chất lượng | Chọn site/hợp đồng + kỳ → sinh PDF gộp gồm: trang bìa, cấp phối được duyệt, bảng kê phiếu giao hàng, bảng độ sụt, bảng kết quả R7/R28, chứng chỉ vật tư; thời gian ≤ 60 giây cho ≤ 500 phiếu; lưu lại bản đã xuất (`QualityDossier`) | M |
| FR-M07-09 | Hồ sơ khiếu nại chất lượng | Luồng: Tiếp nhận → Điều tra → Kết luận → Hành động khắc phục → Đóng; đính kèm; truy xuất từ phiếu → mẻ → cấp phối → lô vật tư | S |
| FR-M07-10 | Biểu đồ ổn định cường độ | R28 theo thời gian theo cấp phối/trạm; trung bình, độ lệch chuẩn, tỷ lệ đạt | C |

## 4.8 M08 — Kế hoạch sản xuất

| Mã | Yêu cầu | Chi tiết kỹ thuật | Ưu tiên |
|---|---|---|---|
| FR-M08-01 | Màn hình kế hoạch ngày | Grid: trục X = giờ (00–24, bước 30 phút), trục Y = trạm/line; mỗi đơn là 1 block hiển thị khách/m³/mác; kéo-thả đổi khung giờ | M |
| FR-M08-02 | Tính tải theo khung giờ | Với mỗi khung 1 giờ: Σm³ của các đơn giao trong khung; so `plant.capacity_m3h`; tô vàng ≥ 85%, đỏ > 100%; hiển thị số m³ vượt | M |
| FR-M08-03 | Tính nhu cầu vật tư | Nhu cầu(vật tư, ngày/ca) = Σ(PlanLine.m³ × MixDesignItem.qty_per_m3); hiển thị theo vật tư và theo ca; xuất Excel | M |
| FR-M08-04 | Đối chiếu tồn & cảnh báo thiếu | So nhu cầu với `StockBalance` hiện tại + lượng nhập đã xác nhận; cảnh báo thiếu và số ngày tồn còn lại | M |
| FR-M08-05 | Tính nhu cầu xe & bơm | Số xe ≈ ceil(m³ peak/h ÷ (tải bồn × 60 ÷ cycle_time)); dùng cycle time trung bình 30 ngày theo tuyến; cảnh báo nếu > số xe khả dụng | S |
| FR-M08-06 | Chốt kế hoạch | Chuyển `ProductionPlan` sang "Đã chốt" → phát sự kiện `plan.locked` → bảng điều phối nhận realtime | M |
| FR-M08-07 | Điều chỉnh kế hoạch trong ngày | Cho sửa PlanLine khi Trip liên quan chưa ở trạng thái "Đang trộn"; bắt buộc lý do; ghi audit | M |
| FR-M08-08 | Kế hoạch ca & bàn giao ca | Định nghĩa 3 ca theo cấu hình CN; biểu bàn giao tự tổng hợp: đơn hoàn thành/dở, m³ còn lại, sự cố, ghi chú tự do | M |
| FR-M08-09 | Dự báo tuần/tháng | Từ Contract (m³ còn lại theo tiến độ) + Opportunity (m³ × xác suất); xuất báo cáo dự báo sản lượng và vật tư | S |

## 4.9 M09 — Vật tư, Tồn kho, Đề nghị mua

| Mã | Yêu cầu | Chi tiết kỹ thuật | Ưu tiên |
|---|---|---|---|
| FR-M09-01 | Quản lý silo/bãi & tồn | Khai báo silo (vật tư, dung tích) theo trạm; tồn đầu ngày, nhập, xuất, tồn cuối; nhập tồn thủ công hoặc từ cảm biến/tích hợp | S |
| FR-M09-02 | Phiếu nhập vật tư | Nhà cung cấp, lô, khối lượng, chứng từ cân, chứng chỉ đính kèm; cập nhật tồn | S |
| FR-M09-03 | Xuất vật tư theo sản xuất | Ưu tiên số liệu thực từ `Batch` (tích hợp trạm); nếu không có, tính theo định mức × m³ đã giao | S |
| FR-M09-04 | Dự báo tồn & cảnh báo | Dự báo tồn theo ngày = tồn hiện tại + nhập kế hoạch − nhu cầu kế hoạch; cảnh báo khi < ngưỡng an toàn hoặc số ngày tồn < n | S |
| FR-M09-05 | Đề nghị mua vật tư | Tạo từ cảnh báo (1 nút) hoặc thủ công; luồng duyệt; trạng thái (Nháp/Chờ duyệt/Đã duyệt/Đã đặt/Đã nhận) | S |
| FR-M09-06 | Đối chiếu định mức vs thực tế | Theo ca/ngày/tháng: (thực xuất − định mức×m³)/định mức×m³; cảnh báo khi |chênh| > ngưỡng (mặc định 2%); top 10 chênh lệch | S |
| FR-M09-07 | Giá vật tư theo kỳ | Bảng giá vật tư theo kỳ để tính giá thành; lịch sử giá | C |

## 4.10 M10 — Bảng điều phối & Chuyến ⭐

| Mã | Yêu cầu | Chi tiết kỹ thuật | Ưu tiên |
|---|---|---|---|
| FR-M10-01 | Bảng điều phối realtime | Layout 3 vùng: (A) đơn hàng theo trục giờ, (B) danh sách xe + trạng thái + phút ở trạng thái hiện tại, (C) chuyến đang thực hiện + cảnh báo. Cập nhật qua WebSocket, độ trễ ≤ 3 giây | M |
| FR-M10-02 | Đề xuất chia chuyến | Input: m³ đơn, tải bồn khả dụng, tốc độ đổ mong muốn, cycle time tuyến. Output: số chuyến, m³/chuyến, giờ xuất trạm đề xuất từng chuyến. Điều hành sửa được | M |
| FR-M10-03 | Phân xe/tài xế/bơm | Kéo-thả hoặc gán nhanh; thao tác ≤ 20 giây/chuyến; hỗ trợ phân hàng loạt cho 1 đơn | M |
| FR-M10-04 | Kiểm tra khi phân xe | Chặn: xe đang chạy chuyến khác trong khung giờ, xe trạng thái Bảo dưỡng/Ngừng, m³ chuyến > tải bồn, tài xế không thuộc CN (trừ khi có điều chuyển). Cảnh báo: tài xế vượt giờ lái cấu hình, xe sắp đến hạn bảo dưỡng | M |
| FR-M10-05 | Ghi mốc thời gian chuyến | 7 mốc (§3.3); nguồn: mobile tài xế, tích hợp trạm trộn (giờ trộn), geofence GPS (đến/rời); ưu tiên nguồn tự động, cho phép Điều hành sửa kèm lý do | M |
| FR-M10-06 | Cảnh báo vận hành | (a) Thời gian từ mốc trộn > ngưỡng (mặc định 90 phút) → đỏ; (b) xe chờ tại CT > ngưỡng (mặc định 30 phút) → vàng; (c) chuyến trễ so giờ đề xuất > 15 phút → vàng; (d) đơn có nguy cơ không hoàn thành trong ca → đỏ | M |
| FR-M10-07 | Xử lý sự cố chuyến | Loại: xe hỏng, tắc đường, khách chưa sẵn sàng, khách dừng đổ, bê tông không đạt, khác. Hành động: chuyển xe khác (1 bước), hủy chuyến kèm m³ trả về, tạm dừng đơn | M |
| FR-M10-08 | Tính chu kỳ xe | cycle_time = mốc "Về trạm" − mốc "Xuất trạm" (+ thời gian nạp); tính trung bình/trung vị theo xe, tuyến (plant→site), 7/30 ngày; hiển thị khi phân chuyến | S |
| FR-M10-09 | Bản đồ theo dõi xe | Hiển thị vị trí xe từ GPS + site đích; cập nhật ≤ 2 phút; hiển thị hành trình chuyến khi cần đối chiếu | S |
| FR-M10-10 | Điều chuyển liên chi nhánh | Tạo `ResourceTransfer` (xe/bơm) → duyệt GĐ CN nguồn + đích (hoặc Ban LĐ) → xe hiện trong pool CN đích trong khoảng thời gian; ghi chi phí nội bộ | C |
| FR-M10-11 | Giao ca điều hành | Tổng hợp tự động + ghi chú; ca sau phải "Nhận ca" để xác nhận đã đọc | S |
| FR-M10-12 | Chốt ngày điều hành | Kiểm tra: mọi Trip đã ở trạng thái cuối, mọi DeliveryNote đã ký hoặc có lý do; chỉ cho chốt khi thỏa hoặc ghi lý do treo | M |

## 4.11 M11 — Đội xe, Tài xế, Xe bơm

| Mã | Yêu cầu | Chi tiết kỹ thuật | Ưu tiên |
|---|---|---|---|
| FR-M11-01 | CRUD xe mixer | Biển số (unique), tải bồn m³, CN, tự có/thuê (kèm nhà cung cấp và đơn giá thuê), thiết bị GPS (device id), trạng thái | M |
| FR-M11-02 | CRUD xe bơm | Loại, tầm với (m), năng suất m³/h, CN, trạng thái | M |
| FR-M11-03 | CRUD tài xế | Liên kết `User`; số GPLX, hạng, hạn; CN; xe mặc định; cảnh báo GPLX hết hạn ≤ 30 ngày | M |
| FR-M11-04 | Lịch ca tài xế | Đăng ký ca/ngày nghỉ; dùng trong kiểm tra FR-M10-04 | S |
| FR-M11-05 | Sản lượng theo xe/tài xế | Số chuyến, m³, km (từ GPS), giờ hoạt động theo kỳ; xuất Excel phục vụ tính lương | S |
| FR-M11-06 | Nhật ký nhiên liệu | Ghi cấp dầu, số km, tính lít/100km; báo cáo bất thường | C |
| FR-M11-07 | Lịch bảo dưỡng | Theo km hoặc giờ hoạt động; nhắc trước ngưỡng; tự đề xuất chuyển trạng thái xe | C |

## 4.12 M12 — Phiếu giao hàng điện tử

| Mã | Yêu cầu | Chi tiết kỹ thuật | Ưu tiên |
|---|---|---|---|
| FR-M12-01 | Sinh phiếu giao hàng | Tự sinh khi Trip chuyển "Xuất trạm"; số phiếu theo FR-M01-13, unique toàn hệ thống; snapshot dữ liệu (khách, site, hạng mục, mác, độ sụt, cấp phối, m³, biển số, tài xế, đơn giá) — không phụ thuộc thay đổi sau này | M |
| FR-M12-02 | Ký nhận điện tử | Ký tay trên canvas (lưu PNG) **hoặc** OTP gửi SMS/Zalo tới liên hệ hiện trường; bắt buộc: tên người nhận, thời điểm, toạ độ, ≥ 1 ảnh | M |
| FR-M12-03 | Khối lượng thực nhận | Mặc định = m³ phiếu; nếu sửa → bắt buộc chọn lý do từ danh mục + ghi chú; lệch > 5% cần Điều hành xác nhận | M |
| FR-M12-04 | Xuất/gửi phiếu | PDF theo mẫu; in được; gửi Zalo/email cho khách | M |
| FR-M12-05 | Hoạt động offline | Mobile lưu SQLite; hàng đợi đồng bộ với `idempotency_key = device_id + local_id`; server chống trùng; xử lý xung đột theo nguyên tắc "bản ghi hiện trường thắng cho các trường hiện trường, server thắng cho dữ liệu chủ" | M |
| FR-M12-06 | Danh sách phiếu chưa hoàn tất | Bộ lọc: thiếu ký, thiếu ảnh, thiếu độ sụt, chưa đồng bộ > 2 giờ; hiển thị trên bảng điều phối | M |
| FR-M12-07 | Khoá & điều chỉnh phiếu | Sau khi vào `Acceptance` → read-only; muốn sửa phải tạo yêu cầu điều chỉnh → GĐ CN duyệt → sinh bản ghi điều chỉnh (không sửa bản gốc); ghi audit | M |
| FR-M12-08 | Đối chiếu phiếu với mẻ trộn | Khi có tích hợp trạm: so m³ phiếu với Σm³ các `Batch` của chuyến; cảnh báo lệch > 0,3 m³ | S |

## 4.13 M13 — Nghiệm thu, Hóa đơn, Công nợ

| Mã | Yêu cầu | Chi tiết kỹ thuật | Ưu tiên |
|---|---|---|---|
| FR-M13-01 | Tổng hợp khối lượng theo kỳ | Lọc DeliveryNote trạng thái "Đã ký", chưa thuộc Acceptance nào; nhóm theo khách/site/hợp đồng; tính tiền theo đơn giá snapshot trên phiếu | S |
| FR-M13-02 | Tạo nghiệm thu | `Acceptance` gồm danh sách phiếu; xuất biên bản nghiệm thu + bảng kê (Excel/PDF); đính kèm bản ký | S |
| FR-M13-03 | Đề nghị xuất hóa đơn | Từ Acceptance đã ký → `InvoiceRequest` (tiền trước thuế, thuế suất, tổng); đẩy sang HĐĐT qua INT-03; nhận số hóa đơn + mã tra cứu | S |
| FR-M13-04 | Theo dõi công nợ | Dư nợ = Σ hóa đơn − Σ thu tiền; theo khách/site/hợp đồng; tuổi nợ 0–30/31–60/61–90/>90 dựa `due_date` = ngày hóa đơn + số ngày điều khoản | S |
| FR-M13-05 | Ghi nhận thu tiền | Nhập tay hoặc nhận từ kế toán qua INT-04; cập nhật hạn mức khả dụng tức thời | S |
| FR-M13-06 | Cảnh báo & chặn theo hạn mức | Xem BRULE-02 | M |
| FR-M13-07 | Nhắc nợ | Job: danh sách quá hạn theo NVKD; thông báo đẩy; mẫu thư nhắc nợ | C |
| FR-M13-08 | Bảng đối chiếu công nợ | Xuất chi tiết theo phiếu/hóa đơn/thu tiền cho khách | C |

## 4.14 M14 — Báo cáo & Dashboard

| Mã | Báo cáo | Chiều phân tích | Nguồn | Ưu tiên |
|---|---|---|---|---|
| RPT-01 | Dashboard điều hành ngày | Chi nhánh, trạm, ca | Trip, DeliveryNote | M |
| RPT-02 | Sản lượng bê tông | Ngày/tuần/tháng × CN × mác × site × NVKD | DeliveryNote (m³ thực nhận) | M |
| RPT-03 | Doanh thu & giá bán bình quân/m³ | Ngày/tháng × CN × mác × khách | DeliveryNote × đơn giá snapshot | M |
| RPT-04 | Đơn hàng & tỷ lệ thực hiện | Ngày × CN; m³ đặt vs m³ giao; đơn hủy theo nguyên nhân | Order, Trip, TripIncident | M |
| RPT-05 | Hiệu quả NVKD | Số báo giá, tỷ lệ chốt, m³, doanh thu, giá bình quân, công nợ quá hạn | Quotation, Contract, DeliveryNote, AR | S |
| RPT-06 | Năng suất đội xe | Chuyến/xe/ngày, m³/xe, cycle time, thời gian chờ CT, tỷ lệ xe thuê | Trip, GPS | S |
| RPT-07 | Tiêu hao & chênh lệch định mức vật tư | Ca/ngày/tháng × vật tư × trạm | Batch, MixDesignItem, Stock | S |
| RPT-08 | Tồn vật tư & dự báo | Ngày × vật tư × silo | StockBalance, Plan | S |
| RPT-09 | Chất lượng | Tỷ lệ mẫu đạt R7/R28, độ sụt ngoài dung sai, số khiếu nại | SampleResult, DeliveryNote, Complaint | S |
| RPT-10 | Công nợ & tuổi nợ | Khách × site × NVKD × tuổi nợ | InvoiceRequest, Payment | S |
| RPT-11 | **Dashboard hợp nhất & so sánh 3 CN** | CN × kỳ, bộ chỉ số chung | Data mart | M |
| RPT-12 | Giá thành sơ bộ & biên lợi nhuận/m³ | CN × mác × kỳ | MixDesign, giá vật tư, chi phí VC | C |
| FR-M14-01 | Xuất Excel/PDF mọi báo cáo | Giữ nguyên bộ lọc; xuất bất đồng bộ nếu > 50.000 dòng | M |
| FR-M14-02 | Lịch gửi báo cáo tự động | Cấu hình người nhận, tần suất (ngày/tuần/tháng), định dạng | S |
| FR-M14-03 | Bộ lọc chuẩn cho mọi báo cáo | Chi nhánh (theo scope), khoảng thời gian, trạm, khách, sản phẩm | M |

## 4.15 M15 — Mobile App

| Mã | Yêu cầu | Chi tiết kỹ thuật | Ưu tiên |
|---|---|---|---|
| FR-M15-01 | App tài xế — luồng chuyến | Màn hình chính = chuyến hiện tại/kế tiếp; 5 nút tuần tự; ≤ 5 chạm/chuyến; chữ ≥ 18sp, nút ≥ 48dp | M |
| FR-M15-02 | App tài xế — offline-first | Toàn bộ nghiệp vụ chuyến + ký nhận hoạt động offline; hiển thị badge số bản ghi chờ đồng bộ; tự đồng bộ khi có mạng và khi mở app | M |
| FR-M15-03 | App tài xế — chỉ đường | Deep link Google Maps theo toạ độ site | S |
| FR-M15-04 | App tài xế — báo sự cố | Danh sách loại sự cố chọn nhanh + ảnh + ghi âm ngắn (tùy chọn) | M |
| FR-M15-05 | App NVKD — tra cứu | Khách, site, đơn, chuyến, công nợ, hạn mức; tìm kiếm nhanh; hoạt động khi mạng yếu (cache) | M |
| FR-M15-06 | App NVKD — báo giá & đơn hàng | Luồng rút gọn; xuất & gửi PDF; tạo site kèm GPS/ảnh | M |
| FR-M15-07 | App QC — chất lượng hiện trường | Ghi độ sụt, tạo tổ mẫu, chụp ảnh; offline | S |
| FR-M15-08 | App lãnh đạo — phê duyệt & dashboard | Danh sách chờ duyệt; duyệt/từ chối kèm ghi chú; dashboard rút gọn | M |
| FR-M15-09 | Thông báo đẩy theo vai trò | FCM/APNs; nhóm theo loại; cấu hình bật/tắt từng loại | M |
| FR-M15-10 | Bảo mật mobile | Token có refresh; PIN/sinh trắc học tùy chọn; xóa dữ liệu cục bộ khi đăng xuất/khoá tài khoản | M |

## 4.16 M16 — Tích hợp

| Mã | Tích hợp | Chiều | Dữ liệu | Cơ chế | Ưu tiên |
|---|---|---|---|---|---|
| INT-01 | Hệ điều khiển trạm trộn | Vào | Mã mẻ, thời điểm, cấp phối, m³ thực, vật tư thực dùng, mã xe/chuyến | Đọc DB/ file CSV theo dõi thư mục / API nếu có; poll ≤ 5 phút; đối chiếu với Trip theo (biển số + khung thời gian) | S |
| INT-02 | GPS đội xe | Vào | Vị trí, thời điểm, tốc độ, km | REST poll 60–120 giây; geofence bán kính cấu hình (mặc định 150 m) quanh site và trạm để tự sinh mốc đến/rời | S |
| INT-03 | Hóa đơn điện tử (NĐ123/TT78) | Ra + Vào | Đẩy: thông tin hóa đơn từ InvoiceRequest. Nhận: số hóa đơn, mã CQT, trạng thái, link tra cứu | REST API của NCC HĐĐT; retry + hàng đợi; lưu log giao dịch | S |
| INT-04 | Phần mềm kế toán | Ra + Vào | Ra: khách hàng, hóa đơn. Vào: thu tiền, dư nợ đối chiếu | API hoặc file trao đổi định kỳ; mapping mã khách 2 hệ thống | S |
| INT-05 | Zalo OA / SMS | Ra | Thông báo đơn/chuyến, OTP ký nhận | API NCC; template được duyệt trước; giới hạn tần suất | S |
| INT-06 | Map API | Ra | Geocoding, cự ly, thời gian di chuyển | Cache kết quả để giảm chi phí gọi | S |
| INT-07 | API mở & webhook | Ra | Sự kiện: đơn xác nhận, chuyến xuất trạm, phiếu đã ký, hóa đơn phát hành | REST + webhook có ký HMAC; API key theo ứng dụng | C |
| INT-08 | Cân điện tử | Vào | Khối lượng vật tư nhập | Serial/TCP hoặc nhập tay có ảnh phiếu cân | C |

**Nguyên tắc tích hợp chung:** mọi tích hợp phải (a) có hàng đợi và retry lũy tiến, (b) idempotent, (c) ghi log giao dịch đầy đủ, (d) có màn hình theo dõi trạng thái tích hợp cho Admin, (e) hệ thống vẫn vận hành được thủ công khi tích hợp lỗi (graceful degradation).

---

# 5. QUY TẮC NGHIỆP VỤ (BUSINESS RULES)

| Mã | Quy tắc | Hành vi hệ thống | Ai vượt được |
|---|---|---|---|
| BRULE-01 | Đơn hàng phải thuộc hợp đồng còn hiệu lực (trừ khách thanh toán ngay) | Chặn xác nhận đơn | GĐ CN (kèm lý do) |
| BRULE-02 | Không xác nhận đơn khi hạn mức khả dụng < giá trị đơn, hoặc khách có nợ quá hạn > n ngày | **Chặn**; cảnh báo vàng khi dùng ≥ 80% hạn mức | GĐ CN / Ban LĐ (phê duyệt ngoại lệ, có thời hạn) |
| BRULE-03 | Không xác nhận đơn khi khung giờ vượt 100% công suất trạm | Cảnh báo đỏ, cho phép xác nhận nếu người dùng chấp nhận và ghi lý do | Kế hoạch |
| BRULE-04 | Đơn phải có cấp phối trạng thái "Hiệu lực" phù hợp trước khi vào kế hoạch | Chặn chốt kế hoạch | Không |
| BRULE-05 | Giá bán < giá sàn phải được phê duyệt trước khi phát hành báo giá | Chặn phát hành | GĐ CN (cấp 1) / Ban LĐ (cấp 2) |
| BRULE-06 | Mỗi chuyến có duy nhất 1 phiếu giao hàng; số phiếu unique toàn hệ thống | Ràng buộc DB (unique) | Không |
| BRULE-07 | Phiếu giao hàng đã vào nghiệm thu là read-only | Chặn sửa; chỉ tạo bản điều chỉnh có duyệt | GĐ CN duyệt điều chỉnh |
| BRULE-08 | Khối lượng nghiệm thu = Σ m³ thực nhận của các phiếu "Đã ký" trong kỳ | Tính tự động, không cho nhập tay | Không |
| BRULE-09 | Không cho phép 1 phiếu giao hàng thuộc 2 nghiệm thu | Ràng buộc DB | Không |
| BRULE-10 | Cấp phối chỉ chuyển "Hiệu lực" khi có người có quyền phê duyệt (hoặc người được uỷ quyền hợp lệ) | Chặn | Không |
| BRULE-11 | Cảnh báo đỏ khi thời gian từ mốc "Bắt đầu trộn" > ngưỡng (mặc định 90 phút) và chuyến chưa "Xong đổ" | Cảnh báo, không chặn | — |
| BRULE-12 | Không phân xe đang chạy chuyến khác trong khung giờ trùng, xe Bảo dưỡng/Ngừng, hoặc m³ > tải bồn | Chặn | Không |
| BRULE-13 | Đơn cho ngày hôm sau nhập sau cut-off → `is_urgent`, cần xác nhận của Kế hoạch/Điều hành trưởng | Yêu cầu xác nhận bổ sung | — |
| BRULE-14 | Không cho sửa m³ đơn hàng xuống dưới m³ đã giao thực tế | Chặn | Không |
| BRULE-15 | Khối lượng thực nhận lệch so với phiếu > 5% phải có lý do và xác nhận của Điều hành | Chặn hoàn tất phiếu | Điều hành |
| BRULE-16 | Kết quả mẫu "Không đạt" → tự escalate và cho phép Tạm dừng cấp phối liên quan | Thông báo bắt buộc tới GĐ CN | — |
| BRULE-17 | Người dùng chỉ truy cập dữ liệu thuộc phạm vi chi nhánh được gán; kiểm tra ở tầng service | Chặn ở API, không chỉ ẩn UI | Ban LĐ (toàn công ty) |
| BRULE-18 | Không hard delete bản ghi nghiệp vụ | Soft delete/Hủy kèm lý do; giữ audit | Không |
| BRULE-19 | Uỷ quyền chỉ hợp lệ trong khoảng thời gian và trong phạm vi quyền được cấp; không uỷ quyền chuyển tiếp (không A→B→C) | Chặn | Không |
| BRULE-20 | Bảng giá đã "Hiệu lực" không sửa; chỉ tạo phiên bản mới | Chặn | Không |
| BRULE-21 | Giá áp dụng cho đơn hàng là giá hiệu lực tại **ngày đổ**, hoặc giá hợp đồng/phụ lục nếu có | Tự xác định, hiển thị nguồn giá | Không |
| BRULE-22 | Đơn hàng chỉ "Hoàn thành" khi mọi chuyến ở trạng thái cuối và mọi phiếu đã ký (hoặc có lý do treo được duyệt) | Chặn | GĐ CN |

---

# 6. YÊU CẦU PHI CHỨC NĂNG

## 6.1 Hiệu năng

| Mã | Yêu cầu | Ngưỡng |
|---|---|---|
| NFR-PER-01 | Thời gian phản hồi API đọc (p95) | ≤ 500 ms |
| NFR-PER-02 | Thời gian phản hồi API ghi (p95) | ≤ 1.000 ms |
| NFR-PER-03 | Tải màn hình danh sách (100 dòng, có lọc) | ≤ 2 giây |
| NFR-PER-04 | Độ trễ cập nhật bảng điều phối (realtime) | ≤ 3 giây |
| NFR-PER-05 | Thao tác phân xe cho 1 chuyến | ≤ 20 giây (bao gồm thao tác người dùng) |
| NFR-PER-06 | Sinh PDF báo giá | ≤ 5 giây |
| NFR-PER-07 | Xuất hồ sơ chất lượng (≤ 500 phiếu) | ≤ 60 giây |
| NFR-PER-08 | Tính nhu cầu vật tư cho kế hoạch 1 ngày (≤ 30 đơn) | ≤ 3 giây |
| NFR-PER-09 | Đồng bộ 1 phiếu giao hàng từ mobile (có ảnh + chữ ký) khi có mạng 3G | ≤ 15 giây |
| NFR-PER-10 | Khởi động app tài xế (cold start) | ≤ 3 giây |
| NFR-PER-11 | Dung lượng dữ liệu thiết kế | 200.000 chuyến/năm, 3.000 khách, 8.000 công trình, 5 năm dữ liệu online |
| NFR-PER-12 | Số phiên đồng thời | ≥ 60 web + 120 mobile không suy giảm hiệu năng |

## 6.2 Độ tin cậy & khả dụng

| Mã | Yêu cầu |
|---|---|
| NFR-REL-01 | Uptime ≥ 99,5%/tháng trong giờ vận hành; hệ thống hoạt động 24/7 |
| NFR-REL-02 | Cửa sổ bảo trì 02:00–04:00, thông báo trước ≥ 24 giờ; không bảo trì khi có ca sản xuất đang chạy |
| NFR-REL-03 | RPO ≤ 15 phút; RTO ≤ 4 giờ |
| NFR-REL-04 | Sao lưu tự động hàng ngày; giữ 30 bản ngày + 12 bản tháng; kiểm chứng phục hồi ≥ 1 lần/quý |
| NFR-REL-05 | Mobile tài xế hoạt động đầy đủ nghiệp vụ chuyến khi offline ≥ 24 giờ, hàng đợi ≥ 200 bản ghi |
| NFR-REL-06 | Mất kết nối tích hợp (GPS/trạm trộn/HĐĐT) không làm dừng nghiệp vụ cốt lõi |
| NFR-REL-07 | Không mất dữ liệu ký nhận trong mọi trường hợp: lưu cục bộ trước, xác nhận server sau |

## 6.3 Bảo mật

| Mã | Yêu cầu |
|---|---|
| NFR-SEC-01 | Xác thực: username/mật khẩu + tùy chọn OTP; chính sách mật khẩu (≥ 8 ký tự, có chữ và số); khoá sau 5 lần sai 15 phút |
| NFR-SEC-02 | Phân quyền RBAC + branch scope, kiểm tra ở tầng service cho **mọi** endpoint |
| NFR-SEC-03 | Mã hóa: TLS 1.2+ khi truyền; mã hóa at-rest cho dữ liệu cá nhân và file đính kèm |
| NFR-SEC-04 | Audit log append-only cho các hành động trọng yếu (FR-M01-10), lưu ≥ 5 năm |
| NFR-SEC-05 | Dữ liệu giá, giá sàn, công nợ, giá thành chỉ trả về API khi người dùng có quyền (không lọc ở client) |
| NFR-SEC-06 | Tuân thủ NĐ13/2023: thu thập tối thiểu, có mục đích rõ ràng, cơ chế xóa/ẩn dữ liệu cá nhân theo yêu cầu, hợp đồng xử lý dữ liệu với NCC |
| NFR-SEC-07 | Token JWT có thời hạn ngắn + refresh token; thu hồi token khi khoá tài khoản |
| NFR-SEC-08 | Chống các lỗ hổng OWASP Top 10; kiểm thử bảo mật trước golive |
| NFR-SEC-09 | Ảnh và chữ ký lưu ở object storage với URL có thời hạn (presigned), không truy cập công khai |
| NFR-SEC-10 | Ghi nhận và giới hạn xuất dữ liệu (export) — log ai xuất gì, khi nào |

## 6.4 Khả dụng (Usability)

| Mã | Yêu cầu |
|---|---|
| NFR-USA-01 | 100% giao diện, thông báo lỗi, mẫu in bằng tiếng Việt có dấu |
| NFR-USA-02 | App tài xế: ≤ 5 chạm/chuyến; chữ ≥ 18sp; nút ≥ 48dp; tương phản ≥ 4,5:1; không ô nhập chữ tự do bắt buộc |
| NFR-USA-03 | Bảng điều phối: hỗ trợ phím tắt cho các thao tác chính; không tự đăng xuất khi màn hình đang hoạt động |
| NFR-USA-04 | Thông báo lỗi mô tả nguyên nhân + hành động khắc phục, không hiển thị mã lỗi kỹ thuật cho người dùng cuối |
| NFR-USA-05 | Mọi danh sách hỗ trợ lọc, sắp xếp, phân trang, xuất Excel |
| NFR-USA-06 | Dark mode cho màn hình điều phối |
| NFR-USA-07 | Hướng dẫn trong ứng dụng theo vai trò (tooltip + tài liệu ≤ 6 trang + video ≤ 5 phút) |
| NFR-USA-08 | Người dùng mới được đào tạo 30 phút thực hiện được nghiệp vụ chính của vai trò (đo trong UAT) |

## 6.5 Khả năng bảo trì & mở rộng

| Mã | Yêu cầu |
|---|---|
| NFR-MNT-01 | Thêm chi nhánh, trạm, silo, vùng giá, quy tắc phụ phí, tham số cảnh báo bằng cấu hình — không sửa code |
| NFR-MNT-02 | Kiến trúc module theo ranh giới M01–M16; phụ thuộc giữa module qua interface rõ ràng |
| NFR-MNT-03 | Test tự động: unit ≥ 60% cho pricing engine, planning và dispatch; integration test cho toàn bộ luồng đơn→phiếu→nghiệm thu |
| NFR-MNT-04 | Tài liệu API (OpenAPI) đầy đủ và cập nhật |
| NFR-MNT-05 | Log tập trung, có correlation id xuyên request; giám sát (metrics + alert) cho lỗi 5xx, hàng đợi tích hợp, độ trễ realtime |
| NFR-MNT-06 | Triển khai CI/CD, có môi trường Dev/Staging/Prod; rollback được |
| NFR-MNT-07 | Mã nguồn, tài liệu thiết kế, quyền sở hữu bàn giao cho khách hàng theo hợp đồng |

## 6.6 Tương thích

| Mã | Yêu cầu |
|---|---|
| NFR-COM-01 | Web: Chrome/Edge 2 phiên bản gần nhất; độ phân giải tối thiểu 1366×768; bảng điều phối tối ưu cho 1920×1080 |
| NFR-COM-02 | Mobile: Android 10+ (RAM ≥ 2 GB), iOS 14+ |
| NFR-COM-03 | Xuất file: Excel (.xlsx), PDF (PDF/A cho hồ sơ chất lượng) |
| NFR-COM-04 | Bộ ký tự UTF-8; múi giờ Asia/Ho_Chi_Minh; định dạng số 1.234.567,89 |

---

# 7. YÊU CẦU GIAO DIỆN NGOÀI

## 7.1 Giao diện người dùng
- **Web**: SPA, layout 3 khu (điều hướng trái, nội dung, panel cảnh báo phải); màn hình đặc biệt: bảng điều phối (full-width, realtime), kế hoạch ngày (grid giờ × trạm), dashboard.
- **Mobile**: 4 gói giao diện theo vai trò (Tài xế / NVKD / QC / Lãnh đạo) trong cùng một ứng dụng, hiển thị theo quyền.

## 7.2 Giao diện phần cứng
- Máy in phiếu giao hàng tại trạm (in A5/A4 qua trình duyệt hoặc in nhiệt cầm tay — tùy chọn).
- Thiết bị GPS trên xe (qua nhà cung cấp, không kết nối trực tiếp).
- Cân điện tử (giai đoạn 3, INT-08).

## 7.3 Giao diện phần mềm
Xem M16 (INT-01…INT-08).

## 7.4 Giao diện truyền thông
- REST/JSON over HTTPS cho toàn bộ API; WebSocket (wss) cho bảng điều phối.
- Webhook ra ngoài có ký HMAC-SHA256.
- Mobile sync API dạng batch, có `idempotency_key`, hỗ trợ nén payload.

---

# 8. YÊU CẦU DỮ LIỆU & CHUYỂN ĐỔI

| Mã | Yêu cầu |
|---|---|
| DR-01 | Dữ liệu gốc phải chuẩn hóa và import trước golive: khách hàng, công trình, cấp phối, vật tư, xe, tài xế, bảng giá, hợp đồng đang hiệu lực, dư nợ đầu kỳ |
| DR-02 | Có template Excel kèm hướng dẫn cho từng loại dữ liệu; báo lỗi theo dòng |
| DR-03 | Làm sạch trùng lặp khách hàng/công trình trước import (theo MST, SĐT, toạ độ) |
| DR-04 | Dư nợ đầu kỳ nhập theo hóa đơn hoặc tổng theo khách (có ghi chú "số dư mang sang") |
| DR-05 | Lưu trữ: dữ liệu nghiệp vụ online ≥ 5 năm; ảnh và chữ ký ≥ 5 năm; audit log ≥ 5 năm; hồ sơ chất lượng lưu theo yêu cầu công trình (có thể > 5 năm) |
| DR-06 | Xuất toàn bộ dữ liệu của khách hàng theo định dạng mở khi kết thúc hợp đồng |

---

# 9. MA TRẬN TRUY VẾT (TRACEABILITY)

| Mục tiêu KD | Yêu cầu KD (BRD) | Yêu cầu SP (PRD) | Yêu cầu người dùng (URD) | Yêu cầu chức năng (SRS) |
|---|---|---|---|---|
| BO-01 Kiểm soát giá | BR-02, BR-03 | PR-M03-01…08 | UR-KD-03…05, UR-GD-02, UR-BLD-03 | FR-M03-01…11, BRULE-05, BRULE-20, BRULE-21 |
| BO-02 Khai thác thị trường | BR-01, BR-06 | PR-M02-01…08 | UR-KD-01, 02, 11, 14, 15 | FR-M02-01…10, RPT-05 |
| BO-03 Giảm sai sót đơn | BR-07, BR-16 | PR-M05-01…08 | UR-KD-08, 09, UR-KH-01, 02 | FR-M05-01…10, BRULE-01…04, 13 |
| BO-04 Năng suất đội xe | BR-20…BR-24 | PR-M10-01…10, PR-M11 | UR-DH-01…14 | FR-M10-01…12, FR-M11-01…07, RPT-06 |
| BO-05 Rút ngắn thu tiền | BR-04, BR-05, BR-26, BR-28…30 | PR-M04, PR-M12, PR-M13 | UR-KD-06, 13, UR-KTO-01…04 | FR-M04-04, FR-M12-01…08, FR-M13-01…08, BRULE-02, 06…09 |
| BO-06 Kiểm soát vật tư | BR-09, BR-17…19 | PR-M06-02, PR-M08-04, PR-M09 | UR-KT-02, UR-KH-03, 04, 09 | FR-M06-02, FR-M08-03, 04, FR-M09-01…07, RPT-07 |
| BO-07 Hồ sơ chất lượng | BR-08, BR-10…13 | PR-M06, PR-M07 | UR-KT-01…14 | FR-M06-01…09, FR-M07-01…10, BRULE-04, 10, 16 |
| BO-08 Báo cáo kịp thời | BR-27, BR-31 | PR-M14-01…11 | UR-GD-01, UR-BLD-01, 02 | RPT-01…12, FR-M14-01…03, BRULE-17 |
| BO-09 Tối ưu liên CN | BR-25 | PR-M10-09 | UR-DH-13, UR-BLD-06 | FR-M10-10 |
| Nền tảng | BR-14, BR-27, BR-33 | PR-M01-01…09, PR-M15, PR-M16 | UR-KT-04, UR-KH-11, UR-IT-01…05 | FR-M01-01…13, FR-M15-01…10, INT-01…08, BRULE-17…19 |

---

# 10. KIỂM THỬ & NGHIỆM THU

## 10.1 Chiến lược kiểm thử

| Cấp | Nội dung | Trách nhiệm |
|---|---|---|
| Unit test | Pricing engine (mọi tổ hợp phụ phí/chiết khấu/giá sàn), tính nhu cầu vật tư, tính cycle time, tính hạn mức khả dụng, tính tuổi nợ | Dev |
| Integration test | Luồng đầu-cuối: Báo giá → HĐ → Đơn → Kế hoạch → Chuyến → Phiếu → Nghiệm thu → Hóa đơn | Dev + QA |
| System test | Toàn bộ FR theo checklist; ma trận phân quyền × 3 chi nhánh (kiểm thử chéo dữ liệu) | QA |
| Performance test | Bảng điều phối với 200 chuyến/ngày; 120 phiên mobile đồng thời; đồng bộ 500 bản ghi offline | QA |
| Offline test | App tài xế chế độ máy bay: 20 chuyến, mất pin giữa luồng, đồng bộ trùng lặp | QA |
| Security test | OWASP Top 10, kiểm thử vượt quyền chi nhánh, truy cập file đính kèm không phép | Bên thứ 3/QA |
| UAT | Theo URD §8 (UA-01…UA-13) | Người dùng cuối |

## 10.2 Các ca kiểm thử trọng yếu (bắt buộc pass)

| Mã | Ca kiểm thử | Kết quả mong đợi |
|---|---|---|
| TC-01 | NVKD CN1 truy vấn API dữ liệu khách hàng của CN2 (sửa tham số request) | HTTP 403, có log |
| TC-02 | Báo giá dưới giá sàn 1 đồng | Chặn phát hành, tạo yêu cầu duyệt |
| TC-03 | Khách dùng 100% hạn mức, tạo đơn mới | Chặn xác nhận; sau khi GĐ duyệt ngoại lệ thì cho phép, có log |
| TC-04 | Kế hoạch chốt kế hoạch với đơn chưa có cấp phối hiệu lực | Chặn, chỉ rõ đơn nào |
| TC-05 | Phân 1 xe cho 2 chuyến trùng khung giờ | Chặn, hiển thị chuyến xung đột |
| TC-06 | Tài xế hoàn tất 3 chuyến ở chế độ offline, bật mạng | 3 phiếu lên hệ thống, không trùng, đủ ảnh & chữ ký |
| TC-07 | Gửi lại cùng payload đồng bộ 2 lần (retry) | Chỉ 1 phiếu được tạo (idempotency) |
| TC-08 | Sửa m³ trên phiếu đã vào nghiệm thu | Chặn; luồng điều chỉnh có duyệt hoạt động đúng |
| TC-09 | Kết quả mẫu R28 không đạt | Escalate GĐ CN, liệt kê đúng các chuyến cùng cấp phối ±1 ca |
| TC-10 | Kỹ thuật CN1 nghỉ, uỷ quyền cho Kỹ thuật CN2 | CN2 duyệt được cấp phối CN1; log ghi "duyệt thay"; hết thời hạn thì không duyệt được nữa |
| TC-11 | Bê tông quá 90 phút chưa đổ | Cảnh báo đỏ trên bảng điều phối trong ≤ 3 giây sau khi vượt ngưỡng |
| TC-12 | Ngắt tích hợp GPS và trạm trộn | Nghiệp vụ chuyến/phiếu vẫn hoàn tất bằng nhập tay; màn hình tích hợp báo lỗi |
| TC-13 | Nghiệm thu 1 kỳ với 120 phiếu | Tổng m³ = Σ m³ thực nhận; không phiếu nào bị tính 2 lần |
| TC-14 | Bảng điều phối mở liên tục 12 giờ | Không mất phiên, không rò rỉ bộ nhớ, tự kết nối lại sau mất mạng |
| TC-15 | Xuất hồ sơ chất lượng công trình 500 phiếu | PDF đầy đủ, ≤ 60 giây |

---

# 11. TRIỂN KHAI & VẬN HÀNH

| Mã | Yêu cầu |
|---|---|
| OPS-01 | Ba môi trường: Dev, Staging (bản sao dữ liệu đã ẩn danh), Production |
| OPS-02 | Hạ tầng: cloud (khuyến nghị) hoặc on-premise tại trụ sở; nếu on-premise cần UPS, đường truyền dự phòng vì hệ thống chạy 24/7 |
| OPS-03 | Giám sát: uptime, lỗi 5xx, độ trễ realtime, độ dài hàng đợi tích hợp, tỷ lệ đồng bộ mobile thất bại; alert qua email/Zalo cho IT |
| OPS-04 | Hỗ trợ: giờ hành chính cho nghiệp vụ; **hỗ trợ 24/7 cho sự cố chặn sản xuất** (bảng điều phối, phiếu giao hàng) trong 3 tháng đầu mỗi chi nhánh |
| OPS-05 | SLA sự cố: P1 (chặn sản xuất) phản hồi ≤ 30 phút, khắc phục ≤ 4 giờ; P2 ≤ 4 giờ / 1 ngày làm việc; P3 theo bản phát hành |
| OPS-06 | Bàn giao: mã nguồn, tài liệu kiến trúc, hướng dẫn vận hành, tài liệu người dùng theo vai trò, kịch bản sao lưu–phục hồi |
| OPS-07 | Bảo hành ≥ 12 tháng sau golive chi nhánh cuối; bảo trì theo hợp đồng riêng |

---

# 12. PHỤ LỤC

## 12.1 Danh sách vai trò hệ thống

| Mã | Vai trò | Phạm vi |
|---|---|---|
| ROLE-01 | Nhân viên Kinh doanh | Chi nhánh, dữ liệu của mình + xem chung theo cấu hình |
| ROLE-02 | Trưởng phòng Kinh doanh | Chi nhánh |
| ROLE-03 | Nhân viên Kỹ thuật | Chi nhánh (có thể nhiều CN) |
| ROLE-04 | Trưởng Kỹ thuật công ty | Toàn công ty |
| ROLE-05 | Nhân viên Kế hoạch | Chi nhánh (có thể nhiều CN) |
| ROLE-06 | Điều hành / Dispatcher | Chi nhánh |
| ROLE-07 | Trưởng Điều hành | Chi nhánh |
| ROLE-08 | Tài xế / Vận hành bơm | Chỉ chuyến của mình |
| ROLE-09 | Giám đốc chi nhánh | Chi nhánh, có quyền phê duyệt |
| ROLE-10 | Ban lãnh đạo công ty | Toàn công ty, phê duyệt cấp 2 |
| ROLE-11 | Kế toán | Chi nhánh hoặc toàn công ty (theo phân công) |
| ROLE-12 | Quản trị hệ thống | Toàn hệ thống (không xem dữ liệu giá/công nợ nếu không được cấp) |

## 12.2 Danh mục lý do (cấu hình được)

| Nhóm | Giá trị mẫu |
|---|---|
| Lý do hủy đơn | Khách dừng thi công, thời tiết, khách đổi NCC, sai thông tin, khác |
| Lý do sự cố chuyến | Xe hỏng, tắc đường, khách chưa sẵn sàng, khách dừng đổ, mất điện trạm, bê tông không đạt, khác |
| Lý do lệch khối lượng | Khách đổ không hết, đổ bù, sai số cân, trả về, khác |
| Lý do duyệt giá dưới sàn | Khách chiến lược, cạnh tranh, khối lượng lớn, thanh toán ngay, khác |
| Lý do điều chỉnh phiếu | Nhập sai khối lượng, sai công trình, sai sản phẩm, sai giờ |

## 12.3 Công thức tính chuẩn

```
Đơn giá cuối        = Đơn giá cơ sở(sản phẩm, vùng cự ly)
                      + Σ Phụ phí (bơm, ca đêm, KL nhỏ, ngoài vùng, chờ)
                      − Chiết khấu(khối lượng, điều kiện thanh toán)

Hạn mức khả dụng    = Hạn mức − Dư nợ − Giá trị đơn đã xác nhận chưa xuất HĐ

Nhu cầu vật tư(v,d) = Σ over PlanLine của ngày d [ m³ × qty_per_m3(cấp phối, v) ]

Số ngày tồn(v)      = Tồn hiện tại(v) ÷ Nhu cầu bình quân ngày(v, 7 ngày tới)

Cycle time(chuyến)  = t(Về trạm) − t(Xuất trạm) + thời gian nạp bình quân

Số xe cần(h)        = ceil( m³ cần trong giờ h ÷ (tải bồn × 60 ÷ cycle_time_phút) )

Chênh lệch vật tư   = (Thực xuất − Σ(m³ giao × định mức)) ÷ Σ(m³ giao × định mức) × 100%

Khối lượng nghiệm thu = Σ m³ thực nhận của DeliveryNote trạng thái "Đã ký" trong kỳ

Tuổi nợ             = Ngày hiện tại − (Ngày hóa đơn + Số ngày điều khoản thanh toán)

Giá bán bình quân/m³ = Σ Doanh thu bê tông ÷ Σ m³ thực giao  (loại trừ phụ phí bơm nếu cấu hình)
```

## 12.4 Vấn đề kỹ thuật cần chốt trước khi thiết kế chi tiết

| Mã | Nội dung |
|---|---|
| TQ-01 | Hệ điều khiển trạm trộn: hãng, phiên bản, cơ chế truy cập dữ liệu (DB/file/API), tần suất, mapping mã xe ↔ chuyến |
| TQ-02 | Nhà cung cấp GPS: API, tần suất cho phép, có hỗ trợ webhook/geofence sẵn không |
| TQ-03 | Nhà cung cấp hóa đơn điện tử và phần mềm kế toán: tài liệu API, mapping mã khách hàng |
| TQ-04 | Hạ tầng: cloud vs on-premise; nếu on-premise thì cấu hình server, đường truyền, UPS |
| TQ-05 | Chính sách thiết bị mobile cho tài xế (thiết bị cá nhân hay công ty cấp, hỗ trợ data) |
| TQ-06 | Có yêu cầu xác thực SSO/AD nội bộ không |
| TQ-07 | Quy định lưu trữ hồ sơ chất lượng theo yêu cầu chủ đầu tư lớn (thời hạn, định dạng, chữ ký số?) |
| TQ-08 | Có cần chữ ký số (không chỉ chữ ký hình ảnh) trên phiếu giao hàng/nghiệm thu? |

## 12.5 Lịch sử phiên bản

| Phiên bản | Ngày | Nội dung | Người lập |
|---|---|---|---|
| 1.0 | 08/09/2026 | Bản đầu tiên, xây dựng từ BRD/PRD/URD v1.0 | BA |

---

# 13. PHÊ DUYỆT

| Vai trò | Họ tên | Ngày | Ký |
|---|---|---|---|
| Đại diện khách hàng | | | |
| Chủ nhiệm dự án | | | |
| Kiến trúc / Tech Lead | | | |
| Business Analyst | | | |
| QA Lead | | | |
