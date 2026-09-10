# BRD — BUSINESS REQUIREMENTS DOCUMENT
## Hệ thống Quản trị Sản xuất – Kinh doanh Bê tông Thương phẩm (RMC-MS)

| Thông tin | Nội dung |
|---|---|
| Mã tài liệu | BRD-RMCMS-v1.0 |
| Phiên bản | 1.0 (Draft) |
| Ngày lập | 08/09/2026 |
| Đối tượng | Ban lãnh đạo, Chủ đầu tư dự án, PMO, Đơn vị triển khai |
| Trạng thái | Chờ phê duyệt |

---

## 1. TỔNG QUAN

### 1.1 Bối cảnh doanh nghiệp
Khách hàng là doanh nghiệp sản xuất và cung cấp **bê tông thương phẩm (ready-mix concrete)**, vận hành theo mô hình **3 chi nhánh**, mỗi chi nhánh có trạm trộn, đội xe mixer/xe bơm và bộ máy phòng ban riêng tương đương nhau.

Đặc thù ngành ảnh hưởng trực tiếp đến thiết kế hệ thống:
- Sản phẩm **không lưu kho được** — thời gian sống của bê tông tươi chỉ 90–120 phút kể từ khi trộn. Sai lệch điều phối 30 phút có thể dẫn tới hủy chuyến, mất hàng.
- Đơn hàng **biến động theo giờ** — khách hàng (nhà thầu) thường đặt trước 1 ngày và điều chỉnh khối lượng ngay trong ca đổ.
- Giá bán **phụ thuộc nhiều biến số**: mác bê tông, độ sụt, cự ly vận chuyển, phương thức bơm (bơm cần / bơm tĩnh / xả trực tiếp), ca ngày/ca đêm, điều kiện thanh toán.
- Chi phí biến đổi lớn nhất là **vật tư (xi măng, cát, đá, phụ gia, tro bay)** và **vận chuyển** — chỉ kiểm soát được nếu có số liệu sản lượng và định mức theo từng chuyến.
- Hồ sơ **chất lượng (mẫu R7/R28, độ sụt, chứng chỉ vật tư)** là điều kiện bắt buộc để nghiệm thu và thu tiền.

### 1.2 Cơ cấu tổ chức trong phạm vi dự án

| Phòng ban | Số người/chi nhánh | Tổng 3 CN | Chức năng chính |
|---|---|---|---|
| Phòng Kinh doanh | 5 | 15 | Khai thác thị trường, báo giá, chốt hợp đồng, thu hồi công nợ |
| Phòng Kỹ thuật | 1 | 3 | Thiết kế cấp phối (mix design), quản lý chất lượng |
| Phòng Kế hoạch | 1 | 3 | Lập kế hoạch sản xuất, cân đối vật tư |
| Phòng Điều hành | 3 *(giả định)* | 9 | Điều phối sản xuất, điều phối xe mixer/xe bơm |
| Ban lãnh đạo / Kế toán *(liên quan)* | 2–3 | 6–9 | Phê duyệt giá, hạn mức công nợ, hóa đơn |
| **Tổng người dùng nội bộ** | ~12–13 | **~36–39** | Chưa gồm tài xế (~30–60 tài khoản mobile) |

> **Lưu ý quan trọng về thiết kế:** Phòng Kỹ thuật và Phòng Kế hoạch chỉ có **1 người/chi nhánh**. Hệ thống **không được** thiết kế theo luồng phê duyệt nhiều tầng trong hai phòng này, và **phải** hỗ trợ 1 người kiêm nhiệm nhiều chi nhánh, uỷ quyền khi nghỉ phép, cùng thư viện cấp phối dùng chung toàn công ty.

### 1.3 Mục đích tài liệu
BRD xác định **nhu cầu và mục tiêu kinh doanh** — trả lời câu hỏi *"Tại sao đầu tư hệ thống và doanh nghiệp được gì?"*. Tài liệu này là gốc truy vết (traceability root) cho PRD, URD và SRS.

---

## 2. VẤN ĐỀ HIỆN TẠI (AS-IS PAIN POINTS)

| Mã | Vấn đề | Tác động kinh doanh |
|---|---|---|
| PP-01 | Báo giá làm trên Excel/Zalo cá nhân, mỗi NVKD một mẫu; không có giá sàn kiểm soát | Bán dưới giá sàn, thất thu biên lợi nhuận; tranh chấp giá khi xuất hóa đơn |
| PP-02 | Không có dữ liệu tập trung về công trình/khách hàng; NVKD nghỉ việc là mất khách | Mất cơ hội bán lại, không đo được hiệu quả khai thác thị trường |
| PP-03 | Đơn hàng nhận qua điện thoại/Zalo, không có bản ghi chuẩn | Sai mác bê tông, sai giờ đổ, sai địa điểm → hủy chuyến, mất hàng |
| PP-04 | Kế hoạch sản xuất lập thủ công, không nhìn được năng lực trạm và tồn vật tư theo thời gian thực | Nhận đơn quá năng lực, hoặc dừng trạm vì hết xi măng/phụ gia |
| PP-05 | Điều phối xe bằng bảng trắng + điện thoại | Xe chờ tại công trình, chu kỳ xe (cycle time) cao, chi phí vận chuyển/m³ cao |
| PP-06 | Phiếu giao hàng giấy, thất lạc, không đối chiếu được với khối lượng khách xác nhận | Tranh chấp khối lượng nghiệm thu, chậm thu tiền, công nợ khó đòi |
| PP-07 | Hồ sơ chất lượng (R7/R28, độ sụt, chứng chỉ vật tư) lưu rời rạc theo file | Chậm nghiệm thu; rủi ro khi có khiếu nại chất lượng hoặc kiểm tra |
| PP-08 | Định mức cấp phối và tiêu hao thực tế không đối chiếu được | Không phát hiện thất thoát vật tư, không biết giá thành thực tế/m³ |
| PP-09 | 3 chi nhánh báo cáo theo 3 biểu mẫu khác nhau, tổng hợp thủ công theo tháng | Ban lãnh đạo ra quyết định trên số liệu trễ 15–30 ngày |
| PP-10 | Không điều chuyển được nguồn lực (xe, bơm, vật tư) giữa các chi nhánh vì thiếu thông tin | Chi nhánh này thiếu xe trong khi chi nhánh khác xe nằm bãi |

---

## 3. MỤC TIÊU KINH DOANH (BUSINESS OBJECTIVES)

| Mã | Mục tiêu | Chỉ số đo (KPI) | Hiện tại | Mục tiêu sau 12 tháng |
|---|---|---|---|---|
| BO-01 | Chuẩn hóa và kiểm soát giá bán | % đơn bán dưới giá sàn không được duyệt | Không đo được | < 1% |
| BO-02 | Tăng hiệu quả khai thác thị trường | Tỷ lệ chuyển đổi báo giá → hợp đồng | Không đo được | Đo được và tăng ≥ 15% |
| BO-03 | Giảm sai sót đơn hàng | Số chuyến hủy/trả về do sai thông tin đơn | Không đo được | ≤ 0,5% tổng chuyến |
| BO-04 | Tăng năng suất đội xe | Chu kỳ xe trung bình (cycle time) | Không đo được | Giảm ≥ 10% |
| BO-05 | Rút ngắn kỳ thu tiền | DSO (số ngày thu tiền bình quân) | ~60–90 ngày | Giảm 10–15 ngày |
| BO-06 | Kiểm soát tiêu hao vật tư | Chênh lệch định mức cấp phối vs thực xuất | Không đo được | ≤ 2% |
| BO-07 | Số hóa hồ sơ chất lượng | % đơn hàng có hồ sơ chất lượng đầy đủ, truy xuất ≤ 1 phút | < 50% | ≥ 98% |
| BO-08 | Báo cáo hợp nhất kịp thời | Độ trễ số liệu sản lượng – doanh thu toàn công ty | 15–30 ngày | Trong ngày (T+0) |
| BO-09 | Tối ưu nguồn lực liên chi nhánh | Số lần điều chuyển xe/bơm liên CN theo dữ liệu hệ thống | 0 | Có cơ chế và số liệu theo tháng |

---

## 4. PHẠM VI (SCOPE)

### 4.1 Trong phạm vi (In-scope)

| Nhóm | Nội dung |
|---|---|
| Kinh doanh | Khách hàng – công trình, cơ hội bán, bảng giá & giá sàn, báo giá, hợp đồng & phụ lục, hạn mức công nợ, tiếp nhận đơn hàng |
| Kỹ thuật | Thư viện cấp phối, định mức vật tư/m³, phê duyệt cấp phối, kế hoạch & kết quả thí nghiệm (độ sụt, R7, R28), chứng chỉ vật tư, xử lý khiếu nại chất lượng |
| Kế hoạch | Kế hoạch sản xuất ngày/ca, cân đối năng lực trạm trộn, cân đối và dự báo vật tư, tồn silo/bãi, đề nghị mua vật tư |
| Điều hành | Bảng điều phối (dispatch board), phân xe mixer/xe bơm/tài xế, theo dõi chuyến theo trạng thái, chu kỳ xe, điều chuyển liên chi nhánh |
| Giao hàng | Phiếu giao hàng điện tử, ký nhận tại công trình, khối lượng thực giao, đối chiếu sản lượng |
| Tài chính – thương mại | Nghiệm thu khối lượng, đề nghị xuất hóa đơn, theo dõi công nợ và cảnh báo hạn mức |
| Quản trị & Báo cáo | Đa chi nhánh, phân quyền theo chi nhánh/vai trò, dashboard chi nhánh & hợp nhất, nhật ký hệ thống |
| Mobile | App cho NVKD, tài xế, giám sát chất lượng tại công trình |

### 4.2 Ngoài phạm vi (Out-of-scope, giai đoạn 1)
- Phần mềm kế toán tổng hợp, sổ sách, thuế, báo cáo tài chính theo chế độ kế toán (chỉ **tích hợp**, không thay thế).
- Quản trị nhân sự – tiền lương (HRM), tính lương tài xế theo chuyến (chỉ **cung cấp dữ liệu chuyến**).
- Bảo trì – sửa chữa thiết bị, quản lý phụ tùng (đề xuất Giai đoạn 3).
- Thay thế hệ thống điều khiển trạm trộn (batching plant control) — chỉ **đọc dữ liệu** từ hệ thống này.
- Sàn thương mại điện tử / cổng đặt hàng công khai cho khách lẻ.
- Mua sắm – đấu thầu vật tư (chỉ tạo đề nghị mua hàng).

### 4.3 Ranh giới hệ thống

```
        ┌──────────────────────── RMC-MS ────────────────────────┐
        │  Kinh doanh │ Kỹ thuật │ Kế hoạch │ Điều hành │ BI     │
        └───┬────────────┬───────────┬───────────┬──────────┬────┘
            │            │           │           │          │
   Hệ ĐK trạm trộn   GPS/định vị   Kế toán/ERP  HĐ điện tử  Zalo/SMS
   (khối lượng thực   (vị trí xe,   (khách hàng, (NĐ123/TT78) (thông báo
    trộn theo mẻ)      hành trình)   hóa đơn,                  đơn hàng,
                                     thu tiền)                 OTP ký nhận)
```

---

## 5. QUY TRÌNH NGHIỆP VỤ MỤC TIÊU (TO-BE)

### 5.1 Chuỗi giá trị tổng thể

```
[KINH DOANH] Khai thác → Báo giá → Hợp đồng → Nhận đơn
      │                                          │
      ▼                                          ▼
[KỸ THUẬT] Chọn/thiết kế cấp phối ─────► [KẾ HOẠCH] Kế hoạch SX ngày/ca
      │                                          │  ↕ cân đối vật tư & năng lực
      │                                          ▼
      │                                  [ĐIỀU HÀNH] Phân xe → Trộn → Vận chuyển → Đổ
      │                                          │
      ▼                                          ▼
[KỸ THUẬT] Lấy mẫu, độ sụt, R7/R28 ────► Phiếu giao hàng ký nhận
                                                 │
                                                 ▼
                            Nghiệm thu khối lượng → Hóa đơn → Thu tiền
                                                 │
                                                 ▼
                                  [BI] Sản lượng – Giá thành – Công nợ
```

### 5.2 Các quy trình chuẩn hóa (Level-2)

| Mã | Quy trình | Chủ trì | Đầu vào → Đầu ra | Nguyên tắc mới |
|---|---|---|---|---|
| BP-01 | Khai thác thị trường & quản lý công trình | Kinh doanh | Danh sách công trình tiềm năng → Cơ hội có xác suất & khối lượng dự kiến | Mỗi công trình có 1 hồ sơ duy nhất, gắn với 1 NVKD phụ trách |
| BP-02 | Báo giá | Kinh doanh + Kỹ thuật | Yêu cầu khách → Báo giá có hiệu lực | Giá tự sinh từ bảng giá + cự ly + dịch vụ; dưới giá sàn phải duyệt |
| BP-03 | Ký hợp đồng & cấp hạn mức | Kinh doanh + Ban LĐ | Báo giá được chấp thuận → Hợp đồng + phụ lục giá + hạn mức công nợ | Không có hạn mức được duyệt thì không nhận đơn trả chậm |
| BP-04 | Tiếp nhận & xác nhận đơn cấp bê tông | Kinh doanh → Kế hoạch | Yêu cầu cấp hàng (ngày, giờ, m³, mác, độ sụt, bơm) → Đơn xác nhận | Cut-off nhận đơn cho ngày kế tiếp; kiểm tra công nợ & năng lực trước khi xác nhận |
| BP-05 | Thiết kế & phê duyệt cấp phối | Kỹ thuật | Yêu cầu mác/độ sụt/vật liệu → Cấp phối được duyệt, có định mức | Thư viện cấp phối dùng chung 3 CN; chỉ dùng cấp phối còn hiệu lực & đạt R28 |
| BP-06 | Lập kế hoạch sản xuất ngày/ca | Kế hoạch | Đơn xác nhận → Kế hoạch ca + nhu cầu vật tư | Cảnh báo tự động khi vượt năng lực trạm hoặc thiếu vật tư |
| BP-07 | Cân đối & đề nghị mua vật tư | Kế hoạch | Nhu cầu vật tư + tồn silo → Đề nghị mua hàng | Dự báo tồn theo ngày, ngưỡng tồn an toàn theo từng vật tư |
| BP-08 | Điều phối sản xuất & xe | Điều hành | Kế hoạch ca → Lệnh chuyến, phân xe/tài xế/bơm | Bảng điều phối trực quan theo giờ; tính chu kỳ xe để giãn chuyến |
| BP-09 | Giao hàng & ký nhận | Điều hành + Tài xế | Lệnh chuyến → Phiếu giao hàng ký nhận điện tử | Mỗi chuyến 1 phiếu, khối lượng thực giao có xác nhận của khách |
| BP-10 | Quản lý chất lượng lô/ca | Kỹ thuật | Chuyến/ca → Kết quả độ sụt, R7, R28, hồ sơ chất lượng | Lấy mẫu theo tần suất bắt buộc; cảnh báo mẫu chưa ép đúng hạn |
| BP-11 | Nghiệm thu khối lượng & xuất hóa đơn | Kinh doanh + Kế toán | Phiếu giao hàng đã ký → Biên bản nghiệm thu → Hóa đơn | Khối lượng nghiệm thu bắt buộc khớp tổng phiếu đã ký |
| BP-12 | Theo dõi công nợ & thu hồi | Kinh doanh + Kế toán | Hóa đơn → Kế hoạch thu, cảnh báo quá hạn | Tự động chặn/cảnh báo đơn mới khi vượt hạn mức hoặc quá hạn |
| BP-13 | Xử lý khiếu nại chất lượng | Kỹ thuật | Phản ánh khách → Hồ sơ điều tra, hành động khắc phục | Truy xuất được từ khiếu nại → chuyến → mẻ trộn → cấp phối → lô vật tư |
| BP-14 | Điều chuyển nguồn lực liên chi nhánh | Điều hành + Ban LĐ | Thiếu hụt cục bộ → Lệnh điều chuyển xe/bơm/vật tư | Có phê duyệt và ghi nhận chi phí nội bộ giữa các chi nhánh |
| BP-15 | Báo cáo hợp nhất & điều hành | Ban LĐ | Dữ liệu vận hành → Dashboard chi nhánh & toàn công ty | Số liệu T+0, một nguồn sự thật duy nhất |

---

## 6. YÊU CẦU NGHIỆP VỤ (BUSINESS REQUIREMENTS)

### 6.1 Nhóm Kinh doanh

| Mã | Yêu cầu nghiệp vụ | Ưu tiên | KPI liên quan |
|---|---|---|---|
| BR-01 | Quản lý tập trung dữ liệu khách hàng, công trình, đầu mối; dữ liệu thuộc công ty, không thuộc cá nhân NVKD | Must | BO-02 |
| BR-02 | Chuẩn hóa mẫu báo giá toàn công ty; giá tính tự động theo mác, độ sụt, cự ly, dịch vụ bơm, ca đêm, điều kiện thanh toán | Must | BO-01 |
| BR-03 | Thiết lập giá sàn theo chi nhánh/sản phẩm; báo giá dưới giá sàn phải qua phê duyệt có lưu vết | Must | BO-01 |
| BR-04 | Quản lý hợp đồng, phụ lục giá, thời hạn hiệu lực, điều khoản thanh toán, tiến độ thực hiện so với khối lượng cam kết | Must | BO-05 |
| BR-05 | Quản lý hạn mức công nợ theo khách hàng và cảnh báo/chặn đơn khi vượt hạn mức hoặc quá hạn thanh toán | Must | BO-05 |
| BR-06 | Theo dõi phễu bán hàng (pipeline) và hiệu quả từng NVKD theo sản lượng, doanh thu, tỷ lệ chốt, công nợ | Should | BO-02 |
| BR-07 | Cho phép NVKD tra cứu tình trạng đơn/chuyến và công nợ khách hàng trên thiết bị di động khi ở công trình | Must | BO-03, BO-05 |

### 6.2 Nhóm Kỹ thuật – Chất lượng

| Mã | Yêu cầu nghiệp vụ | Ưu tiên | KPI liên quan |
|---|---|---|---|
| BR-08 | Xây dựng thư viện cấp phối dùng chung 3 chi nhánh, có phiên bản, hiệu lực và trạng thái phê duyệt | Must | BO-06, BO-07 |
| BR-09 | Mỗi cấp phối phải có định mức vật tư/m³ làm cơ sở tính nhu cầu vật tư và giá thành | Must | BO-06 |
| BR-10 | Quản lý kế hoạch và kết quả thí nghiệm (độ sụt hiện trường, mẫu R7, R28), cảnh báo mẫu đến hạn ép và mẫu không đạt | Must | BO-07 |
| BR-11 | Lưu và truy xuất chứng chỉ/kết quả kiểm nghiệm vật tư đầu vào theo lô | Should | BO-07 |
| BR-12 | Tự động tập hợp hồ sơ chất lượng theo công trình/hợp đồng để cung cấp cho khách khi nghiệm thu | Must | BO-05, BO-07 |
| BR-13 | Truy xuất nguồn gốc 2 chiều: khiếu nại ⇄ chuyến ⇄ mẻ trộn ⇄ cấp phối ⇄ lô vật tư | Should | BO-07 |
| BR-14 | Hỗ trợ 1 nhân sự kỹ thuật phụ trách/kiêm nhiệm nhiều chi nhánh và uỷ quyền khi vắng mặt | Must | — |

### 6.3 Nhóm Kế hoạch – Vật tư

| Mã | Yêu cầu nghiệp vụ | Ưu tiên | KPI liên quan |
|---|---|---|---|
| BR-15 | Lập kế hoạch sản xuất theo ngày và theo ca cho từng trạm trộn, hiển thị trực quan theo giờ | Must | BO-03, BO-04 |
| BR-16 | Kiểm tra năng lực trạm (m³/giờ), số xe, số bơm khả dụng trước khi xác nhận đơn | Must | BO-03 |
| BR-17 | Tự động tính nhu cầu vật tư từ kế hoạch × định mức cấp phối; đối chiếu tồn silo/bãi và cảnh báo thiếu | Must | BO-06 |
| BR-18 | Dự báo tồn vật tư theo ngày và sinh đề nghị mua hàng theo ngưỡng tồn an toàn | Should | BO-06 |
| BR-19 | Đối chiếu tiêu hao vật tư thực tế (từ trạm trộn) với định mức để phát hiện chênh lệch | Should | BO-06 |

### 6.4 Nhóm Điều hành – Vận chuyển

| Mã | Yêu cầu nghiệp vụ | Ưu tiên | KPI liên quan |
|---|---|---|---|
| BR-20 | Bảng điều phối trực quan theo giờ: đơn hàng, chuyến, xe, tài xế, bơm, trạng thái thực hiện | Must | BO-04 |
| BR-21 | Phân bổ xe mixer/xe bơm/tài xế theo chuyến, cảnh báo trùng lịch và quá tải | Must | BO-04 |
| BR-22 | Theo dõi trạng thái chuyến theo mốc thời gian (bắt đầu trộn → xuất trạm → đến công trình → bắt đầu đổ → xong → về trạm) | Must | BO-04 |
| BR-23 | Đo chu kỳ xe và thời gian chờ tại công trình theo xe/tài xế/công trình để tối ưu điều phối | Should | BO-04 |
| BR-24 | Quản lý xe thuê ngoài tương đương xe tự có, tách chi phí riêng | Should | BO-04 |
| BR-25 | Cơ chế điều chuyển xe/bơm giữa 3 chi nhánh có phê duyệt và ghi nhận chi phí nội bộ | Should | BO-09 |
| BR-26 | Phiếu giao hàng điện tử: mỗi chuyến một phiếu, có khối lượng, thời gian, độ sụt, ký nhận của đại diện khách | Must | BO-03, BO-05 |

### 6.5 Nhóm Quản trị – Tài chính – Báo cáo

| Mã | Yêu cầu nghiệp vụ | Ưu tiên | KPI liên quan |
|---|---|---|---|
| BR-27 | Mô hình đa chi nhánh: dữ liệu tách theo chi nhánh, người dùng chỉ thấy phạm vi được phân quyền | Must | BO-08 |
| BR-28 | Nghiệm thu khối lượng dựa trên phiếu giao hàng đã ký; hỗ trợ nghiệm thu theo kỳ/đợt | Must | BO-05 |
| BR-29 | Tạo đề nghị xuất hóa đơn từ nghiệm thu và chuyển sang hệ thống hóa đơn điện tử/kế toán | Must | BO-05 |
| BR-30 | Theo dõi công nợ theo khách/công trình/hợp đồng, tuổi nợ, kế hoạch thu và cảnh báo quá hạn | Must | BO-05 |
| BR-31 | Dashboard theo chi nhánh và hợp nhất toàn công ty với số liệu trong ngày | Must | BO-08 |
| BR-32 | Tính giá thành sơ bộ/m³ theo cấp phối, vật tư, vận chuyển để so sánh với giá bán | Could | BO-01, BO-06 |
| BR-33 | Nhật ký hệ thống đầy đủ cho các thao tác trọng yếu (giá, hạn mức, khối lượng, cấp phối, phiếu giao hàng) | Must | BO-01 |

---

## 7. CÁC BÊN LIÊN QUAN (STAKEHOLDERS)

| Vai trò | Quan tâm chính | Mức ảnh hưởng |
|---|---|---|
| Tổng Giám đốc / HĐQT | Sản lượng, doanh thu, biên lợi nhuận, công nợ toàn công ty | Cao — phê duyệt đầu tư |
| Giám đốc chi nhánh | Kết quả chi nhánh, năng lực trạm, đội xe, phê duyệt giá & hạn mức | Cao — chủ sở hữu quy trình |
| Trưởng phòng Kinh doanh | Pipeline, hiệu quả NVKD, giá, công nợ | Cao |
| NVKD (15 người) | Báo giá nhanh, tra cứu đơn/công nợ tại hiện trường | Cao — nhóm người dùng lớn nhất |
| Nhân sự Kỹ thuật (3) | Cấp phối, kết quả thí nghiệm, hồ sơ chất lượng | Cao — nút cổ chai nếu quá tải |
| Nhân sự Kế hoạch (3) | Kế hoạch ca, cân đối vật tư | Cao — nút cổ chai nếu quá tải |
| Điều hành (9) | Bảng điều phối, trạng thái xe, thay đổi gấp | Cao — dùng hệ thống liên tục theo ca |
| Tài xế / vận hành bơm | Nhận lệnh chuyến, ký nhận, đơn giản – tối thiểu thao tác | Trung bình — quyết định chất lượng dữ liệu |
| Kế toán | Hóa đơn, công nợ, đối chiếu khối lượng | Cao — tích hợp bắt buộc |
| Khách hàng (nhà thầu) | Đúng giờ, đúng mác, hồ sơ chất lượng, khối lượng minh bạch | Trung bình — thụ hưởng |
| Đơn vị triển khai / IT | Kiến trúc, tích hợp, vận hành | Cao |

---

## 8. GIẢ ĐỊNH VÀ RÀNG BUỘC

### 8.1 Giả định (cần khách hàng xác nhận)

| Mã | Giả định |
|---|---|
| AS-01 | Phòng Điều hành có **3 người/chi nhánh** (tài liệu gốc để trống số lượng) |
| AS-02 | Mỗi chi nhánh có **1 trạm trộn** với 1–2 line; nếu nhiều hơn cần điều chỉnh mô hình dữ liệu |
| AS-03 | Doanh nghiệp đã có hệ thống điều khiển trạm trộn có khả năng xuất dữ liệu (file/CSV/DB/API) |
| AS-04 | Đội xe đã gắn thiết bị GPS của nhà cung cấp trong nước có API |
| AS-05 | Đã sử dụng hóa đơn điện tử theo NĐ123/2020 và TT78/2021 |
| AS-06 | Kế toán tiếp tục dùng phần mềm hiện tại; RMC-MS chỉ đẩy dữ liệu sang |
| AS-07 | Tài xế có smartphone Android và làm việc trong vùng có 3G/4G không liên tục → app cần chạy offline |
| AS-08 | Thư viện cấp phối dùng chung được toàn công ty đồng thuận (không tách riêng theo chi nhánh) |

### 8.2 Ràng buộc

| Mã | Ràng buộc |
|---|---|
| CO-01 | Nhân sự Kỹ thuật và Kế hoạch chỉ 1 người/CN → không chấp nhận quy trình nhập liệu nặng, phải tự động hóa tối đa |
| CO-02 | Điều hành làm việc theo ca, có ca đêm → hệ thống phải khả dụng 24/7 và hỗ trợ giao ca |
| CO-03 | Kết nối mạng tại công trình không ổn định → mobile app offline-first, đồng bộ khi có mạng |
| CO-04 | Ngôn ngữ giao diện: tiếng Việt; đơn vị: m³, kg, km, VNĐ |
| CO-05 | Tuân thủ Nghị định 13/2023/NĐ-CP về bảo vệ dữ liệu cá nhân (dữ liệu tài xế, liên hệ khách hàng) |
| CO-06 | Hồ sơ chất lượng phải tương thích yêu cầu TCVN hiện hành về bê tông trộn sẵn và nghiệm thu |
| CO-07 | Dữ liệu giá và công nợ chỉ hiển thị theo phân quyền chi nhánh và cấp bậc |

---

## 9. LỘ TRÌNH TRIỂN KHAI ĐỀ XUẤT

| Giai đoạn | Thời gian | Nội dung | Kết quả kinh doanh |
|---|---|---|---|
| **GĐ 0 – Chuẩn bị** | 3–4 tuần | Khảo sát chi tiết, chuẩn hóa danh mục, dữ liệu gốc (khách hàng, công trình, cấp phối, xe, bảng giá) | Nền dữ liệu sạch |
| **GĐ 1 – MVP (Xương sống vận hành)** | 10–12 tuần | Danh mục & phân quyền, Khách hàng–Công trình, Báo giá–Hợp đồng, Đơn hàng, Cấp phối, Kế hoạch ca, Điều phối xe, Phiếu giao hàng điện tử, App tài xế, Báo cáo sản lượng | BO-01, BO-03, BO-07 (một phần), BO-08 (một phần) |
| **GĐ 2 – Chất lượng & Tài chính** | 8–10 tuần | Thí nghiệm R7/R28 & hồ sơ chất lượng, Nghiệm thu – hóa đơn – công nợ, Vật tư & tồn silo, Tích hợp trạm trộn + GPS + hóa đơn điện tử, App NVKD | BO-05, BO-06, BO-07 |
| **GĐ 3 – Tối ưu & Mở rộng** | 8 tuần | Chu kỳ xe & tối ưu điều phối, Điều chuyển liên CN, Giá thành/m³, BI hợp nhất, Bảo trì thiết bị | BO-04, BO-09, BR-32 |
| Triển khai theo chi nhánh | Song song | Pilot 1 chi nhánh (4 tuần) → nhân rộng CN2, CN3 | Giảm rủi ro thay đổi |

---

## 10. PHÂN TÍCH LỢI ÍCH SƠ BỘ

| Nguồn lợi ích | Cơ chế | Ghi chú định lượng |
|---|---|---|
| Bảo vệ biên lợi nhuận | Kiểm soát giá sàn, chặn bán thấp không duyệt | Chỉ cần cải thiện 1% giá bán trên sản lượng năm đã bù phần lớn chi phí đầu tư |
| Giảm chi phí vận chuyển/m³ | Giảm chu kỳ xe 10% → tăng số chuyến/xe/ngày | Giảm nhu cầu thuê xe ngoài trong giờ cao điểm |
| Giảm thất thoát vật tư | Đối chiếu định mức vs thực xuất | Xi măng + phụ gia là cấu phần chi phí lớn nhất |
| Cải thiện dòng tiền | Nghiệm thu nhanh nhờ phiếu giao hàng số + hồ sơ chất lượng số | Giảm DSO 10–15 ngày |
| Giảm tổn thất do hủy chuyến | Đơn hàng chuẩn hóa, giảm sai mác/sai giờ | Mỗi chuyến hủy = mất toàn bộ giá trị bê tông trong bồn |
| Năng suất quản lý | Bỏ tổng hợp báo cáo thủ công 3 chi nhánh | Giải phóng thời gian Kế hoạch & Kỹ thuật (vốn chỉ 1 người/CN) |

---

## 11. RỦI RO VÀ BIỆN PHÁP

| Mã | Rủi ro | Mức | Biện pháp |
|---|---|---|---|
| RI-01 | Tài xế không dùng app, quay lại phiếu giấy | Cao | App tối giản (≤ 5 thao tác/chuyến), tập huấn tại bãi, gắn với cơ chế tính lương theo chuyến từ hệ thống |
| RI-02 | Kỹ thuật/Kế hoạch (1 người) quá tải khi nhập liệu ban đầu | Cao | Nhập liệu gốc do đội triển khai thực hiện; template Excel import; cấp phối dùng chung |
| RI-03 | NVKD phản kháng vì "mất khách của mình" | Trung bình | Truyền thông chính sách dữ liệu, gắn KPI & hoa hồng vào số liệu hệ thống |
| RI-04 | Hệ điều khiển trạm trộn không cho phép tích hợp | Trung bình | GĐ1 nhập khối lượng thủ công theo mẻ; đánh giá kỹ thuật tích hợp trong GĐ0 |
| RI-05 | Dữ liệu gốc bẩn (trùng khách hàng, sai địa chỉ công trình) | Cao | Làm sạch dữ liệu ở GĐ0, quy tắc chống trùng theo MST/SĐT/toạ độ |
| RI-06 | Mạng yếu tại công trình gây mất dữ liệu ký nhận | Trung bình | Offline-first, lưu tạm cục bộ, hàng đợi đồng bộ, ký ảnh + toạ độ |
| RI-07 | Phạm vi phình to sang kế toán/HRM | Trung bình | Cố định out-of-scope trong PRD, quản lý thay đổi qua CR |
| RI-08 | Ba chi nhánh muốn ba quy trình khác nhau | Cao | Chuẩn hóa quy trình cấp công ty trước khi lập trình; chỉ cấu hình tham số theo CN |

---

## 12. TIÊU CHÍ THÀNH CÔNG DỰ ÁN

| Mã | Tiêu chí | Ngưỡng chấp nhận |
|---|---|---|
| SC-01 | 100% đơn hàng và chuyến giao được ghi nhận trên hệ thống, không còn sổ/phiếu giấy song song | Sau 2 tháng golive/CN |
| SC-02 | 100% báo giá phát hành từ hệ thống theo mẫu chuẩn | Sau 1 tháng golive |
| SC-03 | Báo cáo sản lượng – doanh thu hợp nhất 3 CN xem được trong ngày | Cuối GĐ2 |
| SC-04 | Tỷ lệ tài xế dùng app ký nhận điện tử | ≥ 90% chuyến |
| SC-05 | Người dùng chính (Kỹ thuật, Kế hoạch, Điều hành) hoàn thành công việc ca trên hệ thống mà không cần Excel phụ | Cuối GĐ2 |
| SC-06 | Đạt ≥ 5/9 mục tiêu kinh doanh (mục 3) sau 12 tháng | 12 tháng sau golive CN đầu |

---

## 13. VẤN ĐỀ CẦN LÀM RÕ VỚI KHÁCH HÀNG

| Mã | Câu hỏi |
|---|---|
| OQ-01 | Số lượng nhân sự Phòng Điều hành thực tế mỗi chi nhánh? Có phân biệt điều phối sản xuất và điều phối xe? |
| OQ-02 | Mỗi chi nhánh có bao nhiêu trạm trộn, công suất (m³/h), số xe mixer, số xe bơm? |
| OQ-03 | Ba chi nhánh có bảng giá và giá sàn riêng hay chung? Có bán chéo chi nhánh không? |
| OQ-04 | Chính sách cut-off nhận đơn cho ngày kế tiếp là mấy giờ? Chính sách phí hủy/chờ? |
| OQ-05 | Hệ điều khiển trạm trộn đang dùng là hãng nào, phiên bản nào, có API/DB truy cập được? |
| OQ-06 | Nhà cung cấp GPS hiện tại và khả năng cung cấp API? |
| OQ-07 | Phần mềm kế toán và nhà cung cấp hóa đơn điện tử đang dùng? |
| OQ-08 | Có yêu cầu cổng tra cứu cho khách hàng (xem tiến độ giao hàng, hồ sơ chất lượng) không? |
| OQ-09 | Cách tính lương/thưởng tài xế và hoa hồng NVKD hiện tại — có muốn lấy dữ liệu từ hệ thống? |
| OQ-10 | Ưu tiên hạ tầng: cloud hay on-premise tại từng chi nhánh? |

---

## 14. PHÊ DUYỆT

| Vai trò | Họ tên | Ngày | Ký |
|---|---|---|---|
| Đại diện khách hàng (Sponsor) | | | |
| Giám đốc chi nhánh (đại diện) | | | |
| Chủ nhiệm dự án (Đơn vị triển khai) | | | |
| Business Analyst | | | |

---
*Tài liệu này là gốc truy vết cho PRD-RMCMS-v1.0, URD-RMCMS-v1.0 và SRS-RMCMS-v1.0.*
