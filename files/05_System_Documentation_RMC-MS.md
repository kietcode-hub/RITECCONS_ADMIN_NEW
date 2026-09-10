# TÀI LIỆU TỔNG HỢP HỆ THỐNG (SYSTEM DOCUMENTATION)
## RMC-MS — Hệ thống Quản trị Sản xuất – Kinh doanh Bê tông Thương phẩm

| Thông tin | Nội dung |
|---|---|
| Mã tài liệu | SYS-DOC-RMCMS-v1.0 |
| Tổng hợp từ | BRD-RMCMS-v1.0, PRD-RMCMS-v1.0, URD-RMCMS-v1.0, SRS-RMCMS-v1.0 |
| Ngày lập | 10/09/2026 |
| Đối tượng | Toàn bộ team dự án — BA, PO, Tech Lead, Dev, QA, DevOps, Ban lãnh đạo |
| Trạng thái hệ thống | **Đặc tả (Draft)** — chưa có mã nguồn, đang ở giai đoạn tài liệu hoá yêu cầu |
| Mục đích tài liệu này | Một điểm tra cứu duy nhất để hiểu toàn cảnh hệ thống mà không cần đọc lại cả 4 tài liệu gốc. Mọi chi tiết đầy đủ vẫn nằm ở 4 tài liệu gốc — tài liệu này trỏ tới chúng bằng mã tham chiếu. |

> **Lưu ý về trạng thái dự án:** Thư mục dự án hiện chỉ chứa 4 tài liệu đặc tả (`01_BRD`, `02_PRD`, `03_URD`, `04_SRS`) — chưa có bất kỳ dòng code, schema, hay cấu hình hạ tầng nào được triển khai. Tài liệu này mô tả hệ thống **như đã được đặc tả**, không phải hệ thống đang chạy.

---

## 1. HỆ THỐNG LÀ GÌ — TÓM TẮT 1 PHÚT

**RMC-MS** là hệ thống điều hành xuyên suốt cho doanh nghiệp bê tông thương phẩm 3 chi nhánh, phủ toàn bộ chuỗi giá trị: **báo giá → hợp đồng → đơn hàng → cấp phối → kế hoạch sản xuất → điều phối xe → giao hàng ký nhận → nghiệm thu → hoá đơn → công nợ → báo cáo hợp nhất.**

**Định vị:** không phải ERP tổng thể — là **lõi vận hành ngành bê tông** (industry core). Kế toán, HRM, mua sắm, bảo trì thiết bị chỉ **tích hợp**, không thay thế. *(→ BRD §1.3, PRD §1)*

**Đặc thù ngành quyết định thiết kế:**
- Sản phẩm không lưu kho được — bê tông tươi sống 90–120 phút từ lúc trộn.
- Đơn hàng biến động theo giờ, giá phụ thuộc nhiều biến số (mác, độ sụt, cự ly, bơm, ca, thanh toán).
- 2 phòng ban trọng yếu (Kỹ thuật, Kế hoạch) chỉ có **1 người/chi nhánh** → không được thiết kế phê duyệt nhiều tầng, bắt buộc tự động hoá và uỷ quyền.

**6 nguyên tắc sản phẩm cốt lõi** *(→ PRD §1)*:
1. Một nguồn sự thật duy nhất — mỗi m³ bê tông chỉ tồn tại một lần từ đơn hàng đến hoá đơn.
2. Tối giản cho người nhập liệu, tối đa cho người ra quyết định.
3. Bảng điều phối là màn hình trung tâm của Điều hành.
4. Mobile-first, offline-first cho hiện trường.
5. Đa chi nhánh từ ngày đầu (không "làm 1 CN rồi nhân bản").
6. Cảnh báo thay vì chặn — trừ giá sàn và hạn mức công nợ.

---

## 2. BÀI TOÁN KINH DOANH (VẤN ĐỀ ĐANG GIẢI QUYẾT)

10 vấn đề hiện trạng (AS-IS) được ghi nhận, dẫn tới 9 mục tiêu kinh doanh có KPI đo được:

| Nhóm vấn đề | Hệ quả | Mục tiêu (BO) | KPI mục tiêu 12 tháng |
|---|---|---|---|
| Báo giá thủ công trên Excel/Zalo, không kiểm soát giá sàn | Bán dưới giá sàn, tranh chấp giá | BO-01 | < 1% đơn dưới giá sàn không duyệt |
| Dữ liệu khách hàng/công trình phân tán theo NVKD cá nhân | Mất khách khi NVKD nghỉ việc | BO-02 | Tỷ lệ chốt báo giá tăng ≥ 15% |
| Đơn hàng nhận qua điện thoại/Zalo, không chuẩn hoá | Hủy chuyến, mất hàng | BO-03 | ≤ 0,5% chuyến hủy do sai thông tin |
| Điều phối xe bằng bảng trắng + điện thoại | Chu kỳ xe cao, xe chờ lâu | BO-04 | Giảm chu kỳ xe ≥ 10% |
| Phiếu giao hàng giấy, dễ thất lạc | Tranh chấp khối lượng, chậm thu tiền | BO-05 | DSO giảm 10–15 ngày |
| Không đối chiếu định mức vs tiêu hao thực tế | Thất thoát vật tư không phát hiện được | BO-06 | Chênh lệch định mức ≤ 2% |
| Hồ sơ chất lượng rời rạc theo file | Chậm nghiệm thu, rủi ro khiếu nại | BO-07 | ≥ 98% đơn có hồ sơ đầy đủ, truy xuất ≤ 1 phút |
| 3 chi nhánh báo cáo 3 biểu mẫu khác nhau | Ra quyết định trễ 15–30 ngày | BO-08 | Báo cáo hợp nhất trong ngày (T+0) |
| Không điều chuyển được nguồn lực liên chi nhánh | Mất cân đối xe/vật tư giữa các CN | BO-09 | Có cơ chế điều chuyển theo dữ liệu |

*(Chi tiết đầy đủ → BRD §2, §3)*

---

## 3. PHẠM VI HỆ THỐNG

### Trong phạm vi (In-scope)
Kinh doanh (CRM, báo giá, hợp đồng, công nợ) · Kỹ thuật (cấp phối, chất lượng) · Kế hoạch (kế hoạch SX, vật tư) · Điều hành (dispatch, chuyến, xe) · Giao hàng (e-DO) · Tài chính – thương mại (nghiệm thu, hoá đơn, công nợ) · Quản trị & báo cáo đa chi nhánh · Mobile (NVKD, tài xế, QC).

### Ngoài phạm vi (Out-of-scope — chỉ tích hợp, không thay thế)
- Kế toán tổng hợp, sổ sách, thuế → chỉ tích hợp (WH-01)
- HRM, tính lương tài xế → chỉ cung cấp dữ liệu chuyến (WH-02)
- Mua sắm – đấu thầu vật tư → chỉ tạo đề nghị mua hàng (WH-03)
- Hệ điều khiển trạm trộn (batching plant control) → chỉ **đọc** dữ liệu, không thay thế (WH-04)
- Sàn TMĐT / cổng đặt hàng công khai cho khách lẻ (WH-05)
- Bê tông đúc sẵn, tối ưu định tuyến bằng AI → xem xét sau (WH-06, WH-07)

*(→ BRD §4, PRD §8)*

---

## 4. KIẾN TRÚC HỆ THỐNG ĐỀ XUẤT

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
│  Sales │ Contract │ Order │ MixDesign │ Quality │ Planning │       │
│  Material │ Dispatch │ Fleet │ Delivery │ AR │ Reporting │ Admin   │
│  Cross-cutting: Notification · Document (PDF) · Rules engine ·    │
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

### Quyết định kiến trúc chính *(→ SRS §2.1)*

| Quyết định | Lý do |
|---|---|
| **Modular monolith** cho GĐ1 (không microservices) | Quy mô ~40 người dùng nội bộ không cần độ phức tạp của microservices; nhưng ranh giới module M01–M16 phải rõ để tách dịch vụ về sau nếu cần |
| **Single database**, `branch_id` bắt buộc trên mọi bảng nghiệp vụ | Đa chi nhánh từ ngày đầu; row-level scope thực thi ở **tầng service**, không dựa vào lọc phía client |
| Realtime qua **WebSocket/SSE** cho bảng điều phối; REST cho phần còn lại | Bảng điều phối cần độ trễ ≤ 3 giây |
| Mobile **offline-first**: SQLite cục bộ + hàng đợi đồng bộ có `idempotency_key` | Công trình có kết nối mạng không ổn định (CO-03) |
| Stack đề xuất: PostgreSQL + Redis + Object Storage (S3/MinIO) + kho dữ liệu BI riêng | Tách OLTP khỏi tải báo cáo/dashboard hợp nhất |

---

## 5. NGƯỜI DÙNG HỆ THỐNG

### 5.1 Quy mô
~36–39 người dùng nội bộ văn phòng + 30–60 tài khoản tài xế mobile. Đồng thời cao điểm: ~35 phiên web + ~60 phiên mobile *(SRS: thiết kế cho ≥ 60 web + 120 mobile không suy giảm hiệu năng)*.

### 5.2 10 nhóm người dùng (User classes) *(→ URD §2)*

| Mã | Nhóm | SL | Đặc điểm chi phối thiết kế |
|---|---|---|---|
| UC-01 | Nhân viên Kinh doanh | 15 | Ngoài công trình 70% thời gian, mobile là kênh chính |
| UC-02 | Trưởng phòng Kinh doanh | 3 | Xem hiệu quả team, phê duyệt báo giá |
| UC-03 | Nhân viên Kỹ thuật | 3 | **1 người/CN** — không chịu được quy trình nhập liệu nặng |
| UC-04 | Nhân viên Kế hoạch | 3 | **1 người/CN** — đang dùng Excel nặng, cần tự động hoá tối đa |
| UC-05 | Điều hành/Dispatcher | 9 | **Cường độ cao nhất** — làm việc liên tục theo ca, kể cả ca đêm |
| UC-06 | Tài xế xe mixer | 30–60 | **Trình độ CNTT thấp nhất**, tay bẩn, mạng yếu, ngoài trời |
| UC-07 | Giám đốc chi nhánh | 3 | Chỉ dùng di động, phê duyệt nhanh |
| UC-08 | Tổng Giám đốc/Ban LĐ | 1–3 | Chỉ dùng di động, cần dashboard hợp nhất |
| UC-09 | Kế toán | 3–6 | Cần đối chiếu khối lượng — hóa đơn khớp tuyệt đối |
| UC-10 | Quản trị hệ thống (IT) | 1–2 | Cấu hình, phân quyền, audit |

### 5.3 8 Personas chính *(→ PRD §2)*
Hùng (NVKD) · Trang (Kỹ thuật) · Nam (Kế hoạch) · Dũng (Điều hành) · Tuấn (Tài xế) · Chị Loan (GĐ chi nhánh) · Anh Sơn (TGĐ) · Chị Hà (Kế toán) — mỗi persona có nhu cầu, môi trường làm việc và "định nghĩa thành công" riêng, dùng làm cơ sở thiết kế UX cho từng vai trò.

### 5.4 12 vai trò hệ thống (ROLE) *(→ SRS §12.1)*
NVKD · Trưởng phòng KD · Nhân viên Kỹ thuật · Trưởng Kỹ thuật công ty · Nhân viên Kế hoạch · Điều hành · Trưởng Điều hành · Tài xế · Giám đốc chi nhánh · Ban lãnh đạo công ty · Kế toán · Quản trị hệ thống.

---

## 6. BẢN ĐỒ MODULE (M01–M16)

| Mã | Module | Người dùng chính | Điểm cốt lõi |
|---|---|---|---|
| M01 | Quản trị hệ thống & Danh mục nền | Admin, Ban LĐ | Cây tổ chức đa CN, vai trò, **uỷ quyền tạm thời**, audit log |
| M02 | Khách hàng – Công trình – Cơ hội (CRM) | Kinh doanh | Chống trùng khách hàng, hồ sơ công trình với GPS |
| M03 | Bảng giá – Báo giá – Phê duyệt giá | Kinh doanh, Ban LĐ | **Giá sàn**, pricing engine tự động, luồng duyệt 2 cấp |
| M04 | Hợp đồng – Phụ lục – Hạn mức | Kinh doanh, Ban LĐ | **Hạn mức công nợ** chặn đơn khi vượt |
| M05 | Đơn hàng & Yêu cầu cấp bê tông | Kinh doanh, Kế hoạch | 4 kiểm tra tự động khi tạo đơn (BRULE-01…04) |
| M06 | Cấp phối & Định mức (Mix Design) | Kỹ thuật | Thư viện dùng chung 3 CN, có phiên bản & hiệu lực |
| M07 | Chất lượng & Thí nghiệm | Kỹ thuật | Độ sụt, R7/R28, **xuất hồ sơ chất lượng 1 nút** |
| M08 | Kế hoạch sản xuất ngày/ca | Kế hoạch | Grid giờ × trạm, tự tính nhu cầu vật tư |
| M09 | Vật tư – Tồn silo – Đề nghị mua | Kế hoạch | Dự báo tồn, đối chiếu định mức vs thực tế |
| M10 | Bảng điều phối & Quản lý chuyến ⭐ | Điều hành | **Màn hình trung tâm** — realtime, 3 vùng, cảnh báo trễ |
| M11 | Đội xe – Tài xế – Xe bơm | Điều hành | Hồ sơ xe/tài xế, sản lượng theo xe |
| M12 | Phiếu giao hàng điện tử (e-DO) | Điều hành, Tài xế | Ký nhận điện tử, hoạt động offline |
| M13 | Nghiệm thu – Hoá đơn – Công nợ | Kinh doanh, Kế toán | Nghiệm thu = Σ phiếu đã ký, đẩy hoá đơn điện tử |
| M14 | Báo cáo & Dashboard | Toàn bộ | Dashboard hợp nhất 3 CN, T+0 |
| M15 | Mobile App | Tài xế, NVKD, QC, Lãnh đạo | 4 gói giao diện theo vai trò trong 1 app |
| M16 | Tích hợp | Hệ thống | Trạm trộn, GPS, HĐĐT, kế toán, Zalo/SMS, Map API |

*(Chi tiết từng tính năng theo module, mã PR-Mxx-nn (PRD) và FR-Mxx-nn (SRS) → PRD §4, SRS §4)*

### Ưu tiên phát hành (MoSCoW → Release)

| Release | Nội dung chính | Mục tiêu |
|---|---|---|
| **R1 — MVP "Xương sống vận hành"** (10–12 tuần) | M01 (toàn bộ), M02 cơ bản, M03–M06 Must, M08, M10, M11 cơ bản, M12 toàn bộ, M13-06, M14 cơ bản, M15 phần lớn | Mỗi m³ đi qua hệ thống từ đơn hàng → phiếu giao hàng ký nhận |
| **R2 — "Chất lượng & Dòng tiền"** (8–10 tuần) | M07 đầy đủ, M09 đầy đủ, M13 đầy đủ, M16 tích hợp | Hồ sơ chất lượng, nghiệm thu – hoá đơn – công nợ, tích hợp trạm/GPS/HĐĐT |
| **R3 — "Tối ưu & Mở rộng"** (8 tuần) | Chu kỳ xe, điều chuyển liên CN, giá thành/m³, BI hợp nhất | Tối ưu vận hành dựa trên dữ liệu đã tích luỹ |

Nhân rộng chi nhánh: Pilot 1 CN (4 tuần) → CN2 (+3 tuần) → CN3 (+3 tuần), mỗi CN chạy song song sổ giấy 2 tuần.

*(→ PRD §6, BRD §9)*

---

## 7. MÔ HÌNH DỮ LIỆU

### 7.1 Luồng thực thể trọng yếu (luồng khối lượng — xương sống của hệ thống)

```
Contract ──1:N──► Order ──1:N──► Trip ──1:1──► DeliveryNote
                    │              │                │
                    │              └──1:N──► Batch  │
                    │                               │
                    └──N:1──► MixDesign             ▼
                                            Acceptance ──1:N──► InvoiceRequest ──► Payment
```

**Nguyên tắc bất biến:** một m³ bê tông chỉ được ghi nhận doanh thu qua **duy nhất một** `DeliveryNote` đã ký, và mỗi `DeliveryNote` chỉ thuộc **một** `Acceptance`. Đây là ràng buộc lõi để đảm bảo "một nguồn sự thật duy nhất" (nguyên tắc sản phẩm #1).

### 7.2 48 thực thể chính (E-01 → E-48)

Nhóm theo domain:

| Domain | Thực thể |
|---|---|
| Tổ chức & quyền | Company, Branch, Plant, User, Role/Permission, Delegation |
| Khách hàng & bán hàng | Customer, Contact, Site, Opportunity |
| Giá & hợp đồng | Product, PriceList/PriceItem, SurchargeRule, Quotation, QuotationLine, Approval, Contract, ContractAnnex, CreditLimit |
| Đơn hàng | Order, OrderChangeLog |
| Cấp phối & vật tư | MixDesign, MixDesignItem, Material, MaterialLot, Silo/StockBalance, MaterialRequest |
| Kế hoạch & sản xuất | ProductionPlan, PlanLine, Trip, Batch |
| Giao hàng | DeliveryNote, TripIncident |
| Đội xe | Vehicle, PumpUnit, Driver, ResourceTransfer |
| Chất lượng | SampleSet, SampleResult, QualityComplaint, QualityDossier |
| Tài chính | Acceptance, InvoiceRequest, Payment |
| Hệ thống | Notification, AuditLog, Attachment, SyncQueueItem |

*(Đầy đủ thuộc tính từng thực thể → SRS §3.1)*

### 7.3 Các máy trạng thái (state machines) quan trọng *(→ SRS §3.3)*

**`Order`:** Nháp → Chờ xác nhận → Đã xác nhận → Đang thực hiện → Hoàn thành / Hủy (bắt buộc lý do) / Tạm dừng

**`Trip`:** Đã tạo → Đã phân xe → Đang trộn → Xuất trạm → Đến công trình → Đang đổ → Xong đổ → Về trạm → Hoàn thành (nhánh phụ: Sự cố → Hủy chuyến / Chuyển xe khác)

**`DeliveryNote`:** Nháp (sinh khi xuất trạm) → Chờ ký → Đã ký → Đã chốt (vào nghiệm thu) → *(read-only, chỉ sửa qua Yêu cầu điều chỉnh có duyệt)*

**`MixDesign`:** Nháp → Chờ duyệt → Hiệu lực → Hết hiệu lực (nhánh phụ: Tạm dừng khi mẫu không đạt)

**`Quotation`:** Nháp → Chờ duyệt giá (nếu dưới sàn) → Đã phát hành → Khách chấp thuận/Từ chối/Hết hiệu lực → Đã chuyển hợp đồng

**`ProductionPlan`:** Nháp → Đã chốt → Đang thực hiện → Đã đóng

---

## 8. QUY TẮC NGHIỆP VỤ CỐT LÕI (BRULE)

Toàn bộ 22 quy tắc nghiệp vụ bắt buộc *(nguyên trạng từ SRS §5)*:

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

*(→ SRS §5)*

---

## 9. PHÂN QUYỀN (RACI THEO CHỨC NĂNG)

Nguyên tắc: **C** = Tạo/Sửa, **R** = Chỉ xem, **A** = Phê duyệt, **–** = Không truy cập. Mọi quyền bị giới hạn trong **phạm vi chi nhánh** được gán, trừ vai trò cấp công ty (Ban LĐ, Admin).

Điểm phân quyền nhạy cảm nhất:

| Chức năng | Ai được Tạo/Sửa | Ai được Phê duyệt |
|---|---|---|
| Duyệt giá dưới sàn | — | **Chỉ** GĐ CN / Ban LĐ |
| Hạn mức công nợ | — | **Chỉ** GĐ CN / Ban LĐ |
| Cấp phối & định mức | **Chỉ** Kỹ thuật | Kỹ thuật |
| Kế hoạch sản xuất | **Chỉ** Kế hoạch | GĐ CN |
| Bảng điều phối, chuyến | **Chỉ** Điều hành | — |
| Phiếu giao hàng | Điều hành tạo; Tài xế ký nhận | — |
| Điều chỉnh phiếu đã chốt | — | Đề nghị bởi Điều hành, duyệt bởi GĐ CN |
| Hoá đơn, thu tiền | **Chỉ** Kế toán | — |
| Báo cáo hợp nhất 3 CN | — | Chỉ xem: Ban LĐ |
| Quản trị người dùng, cấu hình | **Chỉ** Admin | — |
| Audit log | — | Chỉ xem: GĐ CN, Ban LĐ, Admin |

Ma trận RACI đầy đủ 24 dòng chức năng × 10 vai trò → URD §4.

---

## 10. HÀNH TRÌNH NGƯỜI DÙNG CHÍNH (USER JOURNEYS)

6 hành trình đầu-cuối minh hoạ cách các vai trò dùng hệ thống trong một ngày làm việc thực tế *(→ URD §5, có ví dụ số liệu cụ thể)*:

1. **NVKD**: khảo sát công trình mới → báo giá tại hiện trường (≤ 5 phút) → xin duyệt giá dưới sàn qua mobile → chuyển hợp đồng → tạo đơn "gấp" ngoài giờ cut-off.
2. **Kế hoạch**: lập kế hoạch ngày mai — phát hiện khung giờ vượt công suất trạm → giãn đơn → tính nhu cầu vật tư → tạo đề nghị mua → tạo đề nghị điều chuyển xe liên CN → chốt kế hoạch.
3. **Kỹ thuật** (1 người/CN): xác nhận cấp phối cho đơn hàng → ghi độ sụt hiện trường → nhập kết quả nén (1 tổ không đạt → hệ thống tự liệt kê chuyến ảnh hưởng) → truy xuất nguồn gốc tới lô vật tư → xuất hồ sơ chất lượng 1 nút (46 trang trong 40 giây).
4. **Điều hành**: vào ca → nhận kế hoạch đã chốt → hệ thống đề xuất chia chuyến → kéo-thả phân xe → xử lý cảnh báo đỏ (bê tông quá 90 phút) → xử lý sự cố xe hỏng (chuyển chuyến 1 bước) → chốt ngày → bàn giao ca.
5. **Tài xế**: 5 lần chạm cho trọn 1 chuyến (Nhận chuyến → Xuất trạm → Đến nơi → Xong đổ → Hoàn tất/ký), hoạt động offline hoàn toàn, tự đồng bộ khi có mạng.
6. **Ban lãnh đạo**: 10 phút buổi sáng — dashboard hợp nhất, phát hiện CN thấp hơn kế hoạch, xem nguyên nhân, duyệt/từ chối các đề nghị đang chờ.

---

## 11. TÍCH HỢP HỆ THỐNG (M16)

| Mã | Tích hợp | Chiều | Cơ chế | Mức độ bắt buộc |
|---|---|---|---|---|
| INT-01 | Hệ điều khiển trạm trộn | Vào (đọc) | Poll DB/CSV/API ≤ 5 phút; đối chiếu theo biển số + khung giờ | Should (GĐ2) |
| INT-02 | GPS đội xe | Vào | REST poll 60–120s; geofence 150m quanh site/trạm | Should (GĐ2) |
| INT-03 | Hoá đơn điện tử (NĐ123/TT78) | Ra + Vào | REST API NCC, retry + hàng đợi | Should (GĐ2) |
| INT-04 | Phần mềm kế toán | Ra + Vào | API hoặc file định kỳ, mapping mã khách 2 hệ thống | Should (GĐ2) |
| INT-05 | Zalo OA / SMS | Ra | API NCC, template duyệt trước | Should (GĐ2) |
| INT-06 | Map API | Ra | Geocoding, cự ly, thời gian di chuyển; cache | Should (GĐ2) |
| INT-07 | API mở & webhook | Ra | REST + webhook ký HMAC | Could (GĐ3) |
| INT-08 | Cân điện tử | Vào | Serial/TCP hoặc nhập tay có ảnh | Could (GĐ3) |

**Nguyên tắc bắt buộc cho mọi tích hợp**: (a) có hàng đợi + retry lũy tiến, (b) idempotent, (c) log giao dịch đầy đủ, (d) màn hình theo dõi trạng thái cho Admin, (e) **graceful degradation** — hệ thống vẫn vận hành thủ công được khi tích hợp lỗi. *(→ SRS §4.16)*

---

## 12. YÊU CẦU PHI CHỨC NĂNG (NFR) — TÓM TẮT NGƯỠNG

| Nhóm | Ngưỡng quan trọng nhất |
|---|---|
| **Hiệu năng** | API đọc p95 ≤ 500ms; bảng điều phối cập nhật realtime ≤ 3s; phân xe ≤ 20s/chuyến; xuất hồ sơ chất lượng ≤ 60s (500 phiếu); thiết kế cho 200.000 chuyến/năm |
| **Độ tin cậy** | Uptime ≥ 99,5%/tháng; RPO ≤ 15 phút, RTO ≤ 4 giờ; mobile offline ≥ 24 giờ, hàng đợi ≥ 200 bản ghi |
| **Bảo mật** | RBAC + branch scope kiểm tra ở **mọi** endpoint (không lọc client); TLS 1.2+; audit log append-only ≥ 5 năm; tuân thủ NĐ13/2023 |
| **Khả dụng (UX)** | Tài xế ≤ 5 chạm/chuyến, chữ ≥ 18sp, nút ≥ 48dp; NVKD báo giá ≤ 5 phút; điều hành không tự đăng xuất khi đang trực |
| **Bảo trì/mở rộng** | Thêm chi nhánh/trạm chỉ bằng cấu hình, không sửa code; unit test ≥ 60% cho pricing/planning/dispatch |
| **Tương thích** | Web: Chrome/Edge 2 bản gần nhất, ≥1366×768; Mobile: Android 10+ (RAM ≥2GB), iOS 14+ |

*(Đầy đủ → SRS §6)*

---

## 13. VẬN HÀNH & TRIỂN KHAI

- **3 môi trường**: Dev, Staging (dữ liệu ẩn danh), Production.
- **Hạ tầng**: cloud khuyến nghị; nếu on-premise cần UPS + đường truyền dự phòng (hệ thống chạy 24/7).
- **SLA sự cố**: P1 (chặn sản xuất) — phản hồi ≤ 30 phút, khắc phục ≤ 4 giờ. Hỗ trợ 24/7 trong 3 tháng đầu mỗi chi nhánh.
- **Bảo hành** ≥ 12 tháng sau golive chi nhánh cuối.
- **Chuyển đổi**: mỗi chi nhánh chạy song song sổ giấy 2 tuần; có "key user" tại từng phòng ban.

*(→ SRS §11)*

---

## 14. RỦI RO DỰ ÁN CẦN THEO DÕI

| Rủi ro | Mức | Biện pháp đã đề xuất |
|---|---|---|
| Tài xế không dùng app, quay lại phiếu giấy | Cao | App tối giản ≤5 thao tác, gắn với tính lương theo chuyến |
| Kỹ thuật/Kế hoạch (1 người/CN) quá tải khi nhập liệu ban đầu | Cao | Đội triển khai nhập hộ; template Excel; cấp phối dùng chung |
| NVKD phản kháng vì "mất khách của mình" | Trung bình | Gắn KPI/hoa hồng vào số liệu hệ thống |
| Hệ điều khiển trạm trộn không cho tích hợp | Trung bình | GĐ1 nhập khối lượng thủ công; đánh giá kỹ thuật ở GĐ0 |
| Dữ liệu gốc bẩn (trùng khách, sai địa chỉ) | Cao | Làm sạch ở GĐ0, chống trùng theo MST/SĐT/toạ độ |
| Mạng yếu tại công trình gây mất dữ liệu ký nhận | Trung bình | Offline-first, lưu tạm cục bộ, hàng đợi đồng bộ |
| Phạm vi phình to sang kế toán/HRM | Trung bình | Cố định out-of-scope trong PRD, quản lý thay đổi qua CR |
| 3 chi nhánh muốn 3 quy trình khác nhau | Cao | Chuẩn hoá quy trình cấp công ty trước khi lập trình |

*(Toàn bộ 8 rủi ro RI-01…RI-08 → BRD §11)*

---

## 15. VẤN ĐỀ CHƯA CHỐT — CẦN TRẢ LỜI TRƯỚC KHI THIẾT KẾ CHI TIẾT

Đây là danh sách các câu hỏi mở quan trọng nhất còn tồn đọng xuyên suốt cả 4 tài liệu gốc, nên được xử lý ở giai đoạn Chuẩn bị (GĐ0):

| Nhóm | Câu hỏi cần chốt |
|---|---|
| Tổ chức | Số nhân sự Điều hành thực tế/CN? Có tách vai điều phối sản xuất vs điều phối xe? |
| Năng lực | Mỗi CN có bao nhiêu trạm trộn, công suất m³/h, số xe mixer, số xe bơm? |
| Giá | 3 CN dùng bảng giá/giá sàn chung hay riêng? Có bán chéo chi nhánh? |
| Vận hành | Giờ cut-off nhận đơn? Chính sách phí hủy/chờ? Tần suất lấy mẫu bắt buộc? |
| Kỹ thuật tích hợp | Hệ điều khiển trạm trộn hãng nào, có API/DB truy cập được không? Nhà cung cấp GPS có API? |
| Kế toán | Phần mềm kế toán và nhà cung cấp hoá đơn điện tử đang dùng là gì? |
| Hạ tầng | Cloud hay on-premise từng chi nhánh? Cần SSO/AD nội bộ không? |
| Pháp lý/Bảo mật | Yêu cầu chữ ký số (không chỉ ký hình ảnh) trên phiếu giao hàng/nghiệm thu? |
| Sản phẩm | Có cổng tra cứu cho khách hàng xem tiến độ/hồ sơ chất lượng không? |

*(Tổng hợp từ BRD §13 OQ-01…10, PRD §9 DP-01…08, URD §9 UQ-01…09, SRS §12.4 TQ-01…08)*

---

## 16. BẢN ĐỒ TRA CỨU NHANH — TÀI LIỆU NÀO TRẢ LỜI CÂU HỎI GÌ

| Câu hỏi | Tài liệu | Mục |
|---|---|---|
| "Tại sao đầu tư hệ thống này? Lợi ích gì?" | 01_BRD | §2, §3, §10 |
| "Hệ thống gồm những module/tính năng nào?" | 02_PRD | §3, §4 |
| "Ai dùng, dùng để làm gì, tiêu chí chấp nhận là gì?" | 03_URD | §2, §3, §8 |
| "Thiết kế kỹ thuật, entity, API, quy tắc nghiệp vụ ra sao?" | 04_SRS | §3, §4, §5, §6 |
| "Toàn cảnh hệ thống — tra nhanh không cần đọc hết 4 file" | 05 (tài liệu này) | Toàn bộ |

---

## 17. BẢNG THUẬT NGỮ (GLOSSARY)

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

*(→ SRS §1.3)*

---

## 18. CÔNG THỨC TÍNH CHUẨN

Các công thức nghiệp vụ lõi mà mọi module tính toán (pricing engine, kế hoạch, điều phối, công nợ) phải dùng thống nhất — tránh mỗi module tự suy diễn một cách tính khác nhau:

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

*(→ SRS §12.3)*

---

*Tài liệu này là bản tổng hợp điều hướng (navigation layer) — mọi con số, quy tắc, đặc tả chi tiết đều lấy nguyên trạng từ 4 tài liệu gốc. Khi có xung đột thông tin, tài liệu gốc (BRD/PRD/URD/SRS) luôn là nguồn chính thức.*
