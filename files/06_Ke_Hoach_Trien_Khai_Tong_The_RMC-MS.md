# KẾ HOẠCH TRIỂN KHAI TỔNG THỂ — RMC-MS
## Từ đặc tả + mock UI hiện có → hệ thống chạy thật

| Thông tin | Nội dung |
|---|---|
| Mã tài liệu | PLAN-RMCMS-v1.0 |
| Dựa trên | BRD/PRD/URD/SRS-RMCMS-v1.0, `05_System_Documentation_RMC-MS.md`, code hiện có trong `apps/`, `packages/`, `design/` |
| Ngày lập | 15/09/2026 |
| Đối tượng | Tech Lead, Dev team, PO, Ban lãnh đạo |
| Trạng thái | Draft |

---

## 1. HIỆN TRẠNG — CÓ GÌ, THIẾU GÌ

### 1.1 Đã có (kiểm chứng được, không phải kế hoạch)

| Lớp | Đã có | Bằng chứng |
|---|---|---|
| **Đặc tả nghiệp vụ** | BRD, PRD, URD, SRS đầy đủ — 132 chức năng (PR-Mxx-nn), 22 quy tắc nghiệp vụ (BRULE), 48 thực thể dữ liệu, ma trận truy vết | `files/01-05` |
| **Business rules** | 22/22 BRULE cài thành pure function, 41 unit test pass | `packages/business-rules/` |
| **Backend API** | NestJS modular monolith, 16 thư mục module đúng M01-M16; 3 module wiring thật (order, planning, dispatch) gọi business-rules, có unit test | `apps/api/src/modules/` |
| **Schema DB** | Prisma schema cho luồng lõi (Customer→Order→Plan→Trip→DeliveryNote), chưa nối DB thật | `apps/api/prisma/schema.prisma` |
| **Bảo mật** | Đã code-review + security-review; 2 lỗ hổng xác nhận (branch-scope chưa gọi, thiếu ValidationPipe) — **chưa vá** | Kết quả review trong hội thoại |
| **UI mock** | 2 file HTML/CSS/JS độc lập: `dashboard-hop-nhat-3CN.html` (M14) và `app-shell-16-modules.html` (15/16 module có màn hình đại diện + đăng nhập + phân quyền demo), style đồng bộ | `design/` |

### 1.2 Khoảng cách (gap) — đây là phần "kế hoạch" phải lấp

| Khoảng cách | Chi tiết |
|---|---|
| **UI mock ≠ web app thật** | 2 file mock là HTML/JS thuần, dữ liệu hard-code trong biến JS, không gọi API. Cần viết lại bằng React (đã chọn ở roadmap kỹ thuật ban đầu), lấy dữ liệu từ `apps/api`. |
| **Backend: 12/16 module chưa có logic thật** | M02,M03,M04,M06,M07,M09,M11,M13,M16 chỉ là `@Module({})` rỗng — dù đã có màn hình UI mock đại diện, chưa có service/controller/entity thật đằng sau. |
| **Chưa có Auth thật** | `apps/api` không có tầng xác thực nào (xác nhận từ security-review). UI mock có màn hình đăng nhập nhưng chỉ là demo phân quyền phía client. |
| **Branch-scope (BRULE-17) chưa enforce** | `assertBranchScope()` đã viết, có test, nhưng **0 call site** trong service thật — lỗ hổng an ninh dữ liệu đa chi nhánh cao nhất cần vá trước khi nối DB thật. |
| **Chưa nối DB thật** | Toàn bộ 3 service đang dùng in-memory `Map`, mất dữ liệu khi restart server. |
| **`apps/web`, `apps/mobile` chưa scaffold** | Chỉ có `package.json` giữ chỗ. |
| **8/8 tích hợp ngoài (M16)** | Chưa có tích hợp thật nào (trạm trộn, GPS, HĐĐT, kế toán, Zalo/SMS) — cần câu trả lời kỹ thuật từ khách hàng trước (TQ-01…08 trong SRS). |

---

## 2. NGUYÊN TẮC CHỈ ĐẠO KẾ HOẠCH

1. **Vá bảo mật trước khi mở rộng** — không thêm module/tính năng mới lên nền tảng đang có lỗ hổng branch-scope đã biết. Đây là việc đầu tiên của Giai đoạn 0.
2. **UI mock đã "duyệt hình" xong** — không thiết kế lại từ đầu khi code React; dùng chính 2 file mock làm đặc tả trực quan (design reference), chuyển đổi 1:1 cấu trúc màn hình + design token đã thống nhất.
3. **Theo đúng pattern `order.service.ts` đã lập** — mọi service mới: gọi `@rmc-ms/business-rules` cho mọi rule check, ném lỗi kèm mã BRULE, không tự viết logic nghiệp vụ trong controller.
4. **Core flow trước, bề rộng sau** — thứ tự hoàn thiện module dựa theo phụ thuộc dữ liệu thực tế đã lộ ra khi build mock (xem §4), không theo thứ tự M01→M16 máy móc.
5. **Mỗi module xong phải có: entity Prisma + service (gọi business-rules) + controller + test + màn hình React tương ứng** — "xong" nghĩa là cả 5 phần, không tính module chỉ có 1 phần.

---

## 3. KIẾN TRÚC MỤC TIÊU (nhắc lại, đã chốt trong `CLAUDE.md`)

```
apps/
  api/      NestJS modular monolith — 1 thư mục module = 1 module nghiệp vụ
  web/      React + Vite + TS — SPA nhiều vai trò (chưa scaffold)
  mobile/   React Native — Tài xế/NVKD/QC offline-first (chưa scaffold)
packages/
  shared-types/     Enum + interface entity dùng chung 3 app
  business-rules/   22 BRULE dạng pure function, test độc lập (ĐÃ XONG)
```

Không đổi stack đã chọn (NestJS+React+React Native, PostgreSQL qua Prisma) — kế hoạch này chỉ lấp khoảng trống, không xét lại quyết định kiến trúc.

---

## 4. THỨ TỰ HOÀN THIỆN MODULE — DỰA TRÊN PHỤ THUỘC DỮ LIỆU THẬT

Khi build UI mock, đã lộ ra rõ chuỗi phụ thuộc dữ liệu thật giữa các module (đơn hàng cần khách hàng+công trình đã tồn tại, cần cấp phối đã duyệt; kế hoạch cần đơn đã xác nhận; điều phối cần kế hoạch đã chốt...). Thứ tự đề xuất:

```
Nhóm A — Nền tảng (bắt buộc trước mọi module khác)
  M01 (Quản trị & Nhân sự) → Auth + RBAC + branch-scope thật

Nhóm B — Đầu vào của Đơn hàng (không có thì M05 không tạo được đơn hợp lệ)
  M02 (Khách hàng–Công trình) → M06 (Cấp phối) → M04 (Hợp đồng–Hạn mức) → M03 (Bảng giá–Báo giá)

Nhóm C — Core flow (ĐÃ CÓ NỀN TỪ TRƯỚC — hoàn thiện DB thật + React)
  M05 (Đơn hàng) → M08 (Kế hoạch) → M10 (Điều phối) → M12 (Phiếu giao hàng)

Nhóm D — Khép vòng dòng tiền + chất lượng (chạy song song sau khi Nhóm C ổn định)
  M07 (Chất lượng) · M09 (Vật tư) · M11 (Đội xe) · M13 (Nghiệm thu–Công nợ)

Nhóm E — Mở rộng (sau khi có câu trả lời kỹ thuật từ khách hàng)
  M14 (Dashboard hợp nhất — build React từ mock đã có) · M16 (Tích hợp) · Mobile app
```

**Vì sao M02/M06 lên trước M05 dù M05 đã có sẵn code:** hiện `OrderService` demo credit-limit bằng dữ liệu giả lập cứng trong service; muốn dùng thật cần bảng `Customer`/`CreditLimit` (M02/M04) và `MixDesign` (M06) tồn tại trước để `assignMixDesign()` có dữ liệu thật để gán, không phải chuỗi string tự do như hiện tại.

---

## 5. KẾ HOẠCH THEO GIAI ĐOẠN

### Giai đoạn 0 — Vá nền tảng & thiết lập hạ tầng (2–3 tuần)

| # | Việc | Đầu ra | Ưu tiên | Trạng thái |
|---|---|---|---|---|
| 0.1 | Vá Vuln #1 (security-review): gọi `assertBranchScope`/`isInBranchScope` trong **mọi** method của `order`, `planning`, `dispatch` service | Không còn IDOR xuyên chi nhánh | Chặn | ✅ Xong 15/09 — có test (`BRULE-17` × 3 module) + smoke test HTTP thật (403 khi trái quyền, danh sách rỗng khi ngoài phạm vi) |
| 0.2 | Vá Vuln #2: cài `class-validator`/`class-transformer`, `ValidationPipe({whitelist:true, forbidNonWhitelisted:true, transform:true})` cho toàn bộ DTO | Request sai kiểu bị 400 thay vì lọt qua so sánh `NaN` | Chặn | ✅ Xong 15/09 — toàn bộ DTO đã có decorator, verify bằng smoke test |
| 0.3 | Auth: NestJS `AuthModule` (JWT), bảng `User`/`Role`/`Delegation` thật theo `E-04..E-06`, guard toàn cục `APP_GUARD` | Đăng nhập thật, không còn API mở hoàn toàn | Chặn | ⚠️ Một phần — JWT + guard toàn cục + 8 user demo **in-memory** hoạt động thật (`POST /auth/login`); **chưa** có bảng `User` Prisma thật, chưa có `Delegation` API, chưa có refresh token |
| 0.4 | Kết nối PostgreSQL thật, `prisma migrate dev`, thay `Map` in-memory bằng Prisma trong 3 service đã có | Dữ liệu không mất khi restart | Chặn | ❌ Chưa làm — môi trường dev hiện không có Docker/Postgres cài sẵn, cần chuẩn bị hạ tầng trước |
| 0.5 | Git hook pre-commit chạy `build:packages && test` + CI GitHub Actions build+test mọi PR | Không merge code chưa qua test (bài học từ phân tích `vibe-coding`) | Cao | ❌ Chưa làm |
| 0.6 | Scaffold `apps/web` (Vite+React+TS), copy design token/CSS từ 2 file mock vào theme dùng chung | Có khung React thật để bắt đầu chuyển màn hình | Cao | ❌ Chưa làm |

**Phát sinh ngoài kế hoạch, đã xử lý:** `assertBranchScope()` ném `Error` thường (không phải `HttpException`), nên khi wire vào controller ban đầu trả về HTTP 500 thay vì 403 — phát hiện qua smoke test, vá bằng `BranchScopeExceptionFilter` toàn cục (`apps/api/src/common/filters/`). Bài học: mọi hàm `business-rules` ném lỗi tự định nghĩa cần có exception filter tương ứng khi wire vào NestJS, không mặc định Nest tự hiểu.

**Điều kiện qua giai đoạn:** `security-review` chạy lại không còn 2 finding cũ; đăng nhập/đăng xuất thật hoạt động; `docker-compose` hoặc DB local chạy được `prisma studio` xem dữ liệu.

### Giai đoạn 1 — Core flow thật đầu-cuối (6–8 tuần)

Hoàn thiện Nhóm B + Nhóm C ở §4 — mục tiêu: **1 đơn hàng đi từ tạo đơn → kế hoạch → điều phối → ký giao hàng, toàn bộ qua DB thật + giao diện React thật**, không còn dữ liệu giả lập ở bất kỳ bước nào.

| Module | Việc chính | Dựa trên mock có sẵn |
|---|---|---|
| M02 | Entity `Customer`/`Site`/`Opportunity` + service (chống trùng MST/SĐT — FR-M02-02) + React từ `VIEWS.M02` | `app-shell` M02 |
| M06 | Entity `MixDesign`/`MixDesignItem` + service (state machine Nháp→Chờ duyệt→Hiệu lực, BRULE-10) + React từ `VIEWS.M06` | `app-shell` M06 |
| M04 | Entity `Contract`/`CreditLimit` thật, nối `checkCreditLimit()` với dữ liệu `CreditLimit` thật thay vì hard-code | `app-shell` M04 |
| M03 | Entity `PriceList`/`Quotation`, nối `checkFloorPrice()` thật | `app-shell` M03 |
| M05 | Bỏ in-memory, nối Prisma; `assignMixDesign()` chọn từ M06 thật | Đã có sẵn — chỉ đổi tầng dữ liệu |
| M08 | Bỏ in-memory, `materialDemand()` nối `MixDesignItem` thật từ M06 | Đã có sẵn |
| M10 | Bỏ in-memory, `Vehicle`/`Driver` thật (rút gọn từ M11) | Đã có sẵn |
| M12 | Entity `DeliveryNote` thật, ký nhận lưu ảnh vào object storage (S3/MinIO — theo kiến trúc đã chọn) | `app-shell` M12 |

**Điều kiện qua giai đoạn:** UAT nội bộ chạy được đúng kịch bản UJ-01→UJ-05 trong URD (khảo sát → báo giá → đơn hàng → kế hoạch → điều phối → ký giao hàng) bằng dữ liệu thật trên `apps/web`, không phải mock.

### Giai đoạn 2 — Khép vòng chất lượng & dòng tiền (6–8 tuần)

Hoàn thiện Nhóm D ở §4: M07, M09, M11, M13 — theo đúng pattern đã lập, chuyển 4 màn hình mock tương ứng thành React thật + entity Prisma còn thiếu (`SampleSet`, `SampleResult`, `Silo`, `MaterialRequest`, `Acceptance`, `InvoiceRequest`, `Payment`).

**Điều kiện qua giai đoạn:** nghiệm thu tính được từ Σ phiếu giao hàng đã ký thật (BRULE-08), không phải số liệu minh hoạ.

### Giai đoạn 3 — Dashboard, tích hợp, mobile (8–10 tuần)

- Build React cho M14 từ `dashboard-hop-nhat-3CN.html` (đã có design đầy đủ, chỉ cần nối API báo cáo thật).
- M16: triển khai từng tích hợp theo thứ tự trả lời được câu hỏi kỹ thuật (TQ-01…08 trong SRS §12.4) — **không tự làm khi chưa có câu trả lời từ khách hàng về nhà cung cấp GPS/trạm trộn/HĐĐT**.
- Scaffold `apps/mobile` (React Native) cho app Tài xế — dùng `VIEWS.M12`'s phone-frame mock làm đặc tả UX trực tiếp (≤5 chạm/chuyến đã thiết kế sẵn).

---

## 6. ƯỚC LƯỢNG QUY MÔ (tham khảo, không phải cam kết)

| Giai đoạn | Thời gian | Số module hoàn thiện đầu-cuối |
|---|---|---|
| GĐ0 — Vá nền tảng | 2–3 tuần | 0 module mới, vá 3 module đã có |
| GĐ1 — Core flow | 6–8 tuần | +4 module (M02,M03,M04,M06) hoàn thiện; 4 module cũ (M05,M08,M10,M12) chuyển từ demo sang thật |
| GĐ2 — Chất lượng & dòng tiền | 6–8 tuần | +4 module (M07,M09,M11,M13) |
| GĐ3 — Dashboard, tích hợp, mobile | 8–10 tuần | +2 module (M14,M16) + `apps/mobile` |
| **Tổng** | **~24–30 tuần** (~6–7 tháng) | 15/16 module (M15 là mobile client, tính trong GĐ3) |

*(So sánh: BRD §9 ước lượng 26–34 tuần cho GĐ1-GĐ3 kể từ đầu — hai con số gần khớp nhau vì nay đã có sẵn nền tảng business-rules + UI đã duyệt hình, bù lại cho phần thời gian phát sinh khi vá bảo mật ở GĐ0 mà bản kế hoạch gốc chưa tính tới.)*

---

## 7. RỦI RO CẦN THEO DÕI TRONG KẾ HOẠCH NÀY

| Rủi ro | Biện pháp |
|---|---|
| Đội dev copy UI mock 1:1 sang React nhưng quên mang theo logic đã có trong JS mock (BRULE checklist real-time, dynamic pending-count...) | Dùng mock làm checklist nghiệm thu màn hình, không chỉ làm ảnh tham chiếu tĩnh |
| Vá branch-scope (0.1) bị hoãn vì "chưa có auth nên chưa cần" | Sai — phải làm cả 2 cùng lúc trong GĐ0, vì thiếu 1 trong 2 vẫn có lỗ hổng khi cái còn lại xong sau |
| M16 (tích hợp) bị đội dự án tự "đoán" API khi chưa có câu trả lời khách hàng | Chặn cứng: không bắt đầu code tích hợp nào trong M16 nếu ô TQ-xx tương ứng trong SRS §12.4 chưa có câu trả lời ghi nhận |
| Redesign UI giữa chừng (như đợt đổi sang phong cách "Adminty" vừa làm) làm lệch lại giữa mock và code React đang dở | Chốt design system trước khi bắt đầu GĐ1; nếu đổi giữa chừng, áp dụng lại đồng bộ cả 2 file mock trước, không sửa trực tiếp trên code React đang chạy |

---

## 8. BƯỚC TIẾP THEO NGAY SAU TÀI LIỆU NÀY

1. Duyệt tài liệu này (Tech Lead + PO).
2. Bắt đầu GĐ0 mục 0.1–0.2 (vá bảo mật) — có thể làm ngay, không phụ thuộc quyết định gì thêm.
3. Song song: gửi danh sách câu hỏi kỹ thuật (TQ-01…08, SRS §12.4) cho khách hàng — vì đây là đường găng dài nhất (câu trả lời chậm sẽ chặn toàn bộ GĐ3).

---

*Tài liệu này là kế hoạch — khi thực thi lệch khỏi kế hoạch (module nào chậm/nhanh hơn dự kiến), cập nhật lại chính file này thay vì tạo file kế hoạch mới, để giữ đúng vai trò "một nguồn sự thật duy nhất" cho tiến độ dự án.*
