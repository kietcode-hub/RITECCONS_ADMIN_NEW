# URD — USER REQUIREMENTS DOCUMENT
## Hệ thống Quản trị Sản xuất – Kinh doanh Bê tông Thương phẩm (RMC-MS)

| Thông tin | Nội dung |
|---|---|
| Mã tài liệu | URD-RMCMS-v1.0 |
| Tài liệu gốc | BRD-RMCMS-v1.0, PRD-RMCMS-v1.0 |
| Ngày lập | 08/09/2026 |
| Đối tượng | Người dùng cuối, Trưởng phòng, UAT team, BA, QA |
| Trạng thái | Draft — cần ký xác nhận của từng phòng ban |

---

## 1. MỤC ĐÍCH

URD ghi lại **yêu cầu từ góc nhìn người sử dụng**: mỗi phòng ban cần làm được việc gì trên hệ thống, trong hoàn cảnh làm việc thực tế của họ, và điều kiện nào thì họ coi là "hệ thống dùng được".

Tài liệu này là **cơ sở nghiệm thu UAT**. Mỗi yêu cầu người dùng (UR) có tiêu chí chấp nhận có thể kiểm chứng được.

---

## 2. ĐỐI TƯỢNG NGƯỜI DÙNG (USER CLASSES)

| Mã | Nhóm người dùng | Số lượng | Tần suất dùng | Môi trường làm việc | Trình độ CNTT |
|---|---|---|---|---|---|
| UC-01 | Nhân viên Kinh doanh | 15 (5×3 CN) | Hàng ngày, nhiều lần | Ngoài công trình, xe, điện thoại; mạng 4G không ổn định | Trung bình — dùng Zalo, Excel cơ bản |
| UC-02 | Trưởng phòng Kinh doanh | 3 | Hàng ngày | Văn phòng + di chuyển | Trung bình |
| UC-03 | Nhân viên Kỹ thuật | 3 (1×3 CN) | Hàng ngày | Phòng thí nghiệm, trạm trộn, hiện trường | Trung bình–tốt |
| UC-04 | Nhân viên Kế hoạch | 3 (1×3 CN) | Hàng ngày, cuối ngày cao điểm | Văn phòng trạm | Tốt (đang dùng Excel nặng) |
| UC-05 | Điều hành / Dispatcher | 9 (3×3 CN) | **Liên tục theo ca, kể cả ca đêm** | Phòng điều hành tại trạm, 1–2 màn hình lớn | Trung bình |
| UC-06 | Tài xế xe mixer / vận hành bơm | 30–60 | Mỗi chuyến | Trong cabin, ngoài trời, tay bẩn, mạng yếu | **Thấp** — chỉ dùng Zalo, gọi điện |
| UC-07 | Giám đốc chi nhánh | 3 | Hàng ngày, ngắn | Di động chủ yếu | Trung bình |
| UC-08 | Tổng Giám đốc / Ban LĐ công ty | 1–3 | Hàng ngày, ngắn | Di động | Trung bình |
| UC-09 | Kế toán | 3–6 | Hàng ngày | Văn phòng | Tốt |
| UC-10 | Quản trị hệ thống (IT) | 1–2 | Theo nhu cầu | Văn phòng | Cao |

### Đặc điểm người dùng ảnh hưởng đến thiết kế

| Mã | Đặc điểm | Yêu cầu dẫn xuất |
|---|---|---|
| UCH-01 | Kỹ thuật và Kế hoạch chỉ có **1 người/chi nhánh** | Không có quy trình phê duyệt nội bộ nhiều tầng trong 2 phòng này; phải có uỷ quyền; tự động hóa tính toán; nhập liệu tối thiểu |
| UCH-02 | Tài xế trình độ CNTT thấp, điều kiện làm việc khắc nghiệt | App chữ tối thiểu 18px, nút lớn ≥ 48px, luồng 1 chiều, không menu lồng nhau, offline, không bắt nhập chữ |
| UCH-03 | Điều hành làm ca đêm, cường độ cao | Hệ thống 24/7, chế độ tối (dark mode) tùy chọn, phím tắt bàn phím, không tự đăng xuất khi đang trên bảng điều phối |
| UCH-04 | NVKD làm việc ngoài hiện trường | Mobile app đầy đủ nghiệp vụ bán hàng; không bắt về văn phòng để hoàn tất báo giá/đơn hàng |
| UCH-05 | Ban lãnh đạo chỉ dùng di động | Phê duyệt và dashboard phải dùng được trên điện thoại, không cần laptop |
| UCH-06 | 3 chi nhánh có tập quán khác nhau | Cấu hình được theo chi nhánh (giờ ca, cut-off, phụ phí) nhưng quy trình lõi thống nhất |

---

## 3. YÊU CẦU NGƯỜI DÙNG THEO PHÒNG BAN

### 3.1 PHÒNG KINH DOANH (UC-01, UC-02)

| Mã | Yêu cầu người dùng | Tiêu chí chấp nhận | Ưu tiên | Truy vết |
|---|---|---|---|---|
| UR-KD-01 | Tôi cần tra cứu được toàn bộ khách hàng và công trình mình phụ trách trên điện thoại | Tìm theo tên/SĐT/MST/tên công trình, ra kết quả ≤ 2 giây; xem được lịch sử giao dịch | Must | BR-01, PR-M02-01 |
| UR-KD-02 | Tôi cần tạo hồ sơ công trình mới ngay khi khảo sát, kèm toạ độ và ảnh | Tạo được trên mobile, tự lấy GPS, đính kèm ≥ 5 ảnh, lưu được khi mất mạng | Must | PR-M02-03 |
| UR-KD-03 | Tôi cần lập báo giá tại công trình và gửi cho khách trong vòng 5 phút | Chọn công trình → sản phẩm → khối lượng → hệ thống tự tính giá → xuất PDF → gửi Zalo/email; toàn bộ ≤ 5 phút | Must | BR-02, PR-M03-08 |
| UR-KD-04 | Tôi cần hệ thống tự tính đơn giá thay vì tôi nhớ bảng giá | Đơn giá tự sinh theo mác, độ sụt, cự ly, phương thức bơm, ca, điều kiện thanh toán; hiển thị rõ cấu thành giá | Must | BR-02, PR-M03-04 |
| UR-KD-05 | Khi khách ép giá dưới sàn, tôi cần xin duyệt nhanh mà không phải chạy về công ty | Gửi đề nghị kèm lý do; GĐ chi nhánh duyệt trên điện thoại; nhận kết quả qua thông báo đẩy; SLA mục tiêu ≤ 2 giờ | Must | BR-03, PR-M03-06 |
| UR-KD-06 | Tôi cần biết ngay khách còn được nợ bao nhiêu trước khi cam kết cấp hàng | Hiển thị hạn mức – đã dùng – khả dụng – nợ quá hạn trên hồ sơ khách và trên màn hình tạo đơn | Must | BR-05, PR-M04-04 |
| UR-KD-07 | Tôi cần chuyển báo giá thành hợp đồng mà không nhập lại thông tin | 1 nút "Tạo hợp đồng từ báo giá", kế thừa 100% giá và điều kiện | Must | PR-M04-02 |
| UR-KD-08 | Tôi cần đặt hàng cấp bê tông cho ngày mai ngay khi khách chốt, kể cả buổi tối | Tạo yêu cầu trên mobile 24/7; nếu quá giờ cut-off, hệ thống cảnh báo và cho gửi dạng "đơn gấp" | Must | PR-M05-04, PR-M05-08 |
| UR-KD-09 | Khi khách gọi hỏi "xe đâu rồi", tôi cần trả lời được ngay mà không phải gọi Điều hành | Xem được trạng thái từng chuyến của đơn: đã xuất trạm chưa, dự kiến đến lúc nào, đã đổ bao nhiêu m³ | Must | BR-07, PR-M10-04 |
| UR-KD-10 | Tôi cần biết hôm nay/tháng này tôi đã bán được bao nhiêu m³ và bao nhiêu tiền | Dashboard cá nhân: m³ theo ngày/tháng, doanh thu, so với chỉ tiêu, công nợ khách mình phụ trách | Must | PR-M14-04 |
| UR-KD-11 | Tôi cần theo dõi các cơ hội đang đàm phán để không bỏ sót | Danh sách cơ hội theo giai đoạn, nhắc việc theo ngày, lý do thắng/thua | Should | BR-06, PR-M02-05 |
| UR-KD-12 | Tôi cần cảnh báo trước nếu khách đang có nợ quá hạn hoặc khiếu nại chất lượng | Nhãn cảnh báo màu trên hồ sơ khách và khi tạo báo giá/đơn hàng | Should | PR-M02-08 |
| UR-KD-13 | Tôi cần xuất được hồ sơ chất lượng cho khách khi họ nghiệm thu | Chọn công trình + kỳ → tải bộ hồ sơ PDF; không cần nhờ Kỹ thuật gom tay | Must | BR-12, PR-M07-07 |
| UR-KD-14 | (Trưởng phòng) Tôi cần thấy hiệu quả từng NVKD trên một màn hình | Bảng so sánh: số báo giá, tỷ lệ chốt, m³, doanh thu, giá bán bình quân, công nợ quá hạn | Should | BR-06, PR-M14-04 |
| UR-KD-15 | (Trưởng phòng) Khi NVKD nghỉ việc, tôi cần bàn giao khách sang người khác trong 1 lần | Chọn NVKD nguồn → NVKD đích → chuyển toàn bộ hoặc chọn lọc; giữ nguyên lịch sử | Should | PR-M02-07 |
| UR-KD-16 | Tôi cần theo dõi hợp đồng sắp hết hạn hoặc sắp hết khối lượng cam kết | Cảnh báo trước 30 ngày hết hạn và khi đạt 90% khối lượng | Should | PR-M04-03 |

### 3.2 PHÒNG KỸ THUẬT (UC-03) — *1 người/chi nhánh*

| Mã | Yêu cầu người dùng | Tiêu chí chấp nhận | Ưu tiên | Truy vết |
|---|---|---|---|---|
| UR-KT-01 | Tôi cần thư viện cấp phối dùng lại được, không phải thiết kế lại cho mỗi công trình | Tìm cấp phối theo mác + độ sụt + Dmax + điều kiện bơm; xem được cấp phối của cả 3 chi nhánh | Must | BR-08, PR-M06-01 |
| UR-KT-02 | Tôi cần nhập định mức vật tư/m³ một lần và hệ thống tự dùng cho mọi tính toán sau đó | Kế hoạch vật tư, giá thành, đối chiếu tiêu hao đều lấy từ định mức này; không nhập lại | Must | BR-09, PR-M06-02 |
| UR-KT-03 | Tôi cần cấp phối có phiên bản và trạng thái hiệu lực rõ ràng | Cấp phối "Hết hiệu lực" không xuất hiện khi chọn cho đơn hàng mới; lịch sử phiên bản xem được | Must | PR-M06-03 |
| UR-KT-04 | **Khi tôi nghỉ, phải có người duyệt cấp phối thay tôi** | Uỷ quyền theo khoảng thời gian cho Kỹ thuật CN khác hoặc Trưởng KT công ty; hệ thống ghi rõ "duyệt thay" | Must | BR-14, PR-M06-08, PR-M01-03 |
| UR-KT-05 | Tôi cần ghi nhận độ sụt tại công trình bằng điện thoại, kèm ảnh | Nhập trên mobile, gắn đúng chuyến/phiếu giao hàng, kèm ảnh, lưu offline được | Must | PR-M07-02 |
| UR-KT-06 | Tôi cần hệ thống nhắc tôi mẫu nào đến hạn ép R7/R28 | Thông báo trước 1 ngày + danh sách "mẫu đến hạn hôm nay" trên dashboard | Should | BR-10, PR-M07-04 |
| UR-KT-07 | Tôi cần nhập kết quả nén và hệ thống tự kết luận Đạt/Không đạt | Nhập kết quả từng viên → tự tính trung bình, so mác thiết kế, kết luận theo quy tắc cấu hình | Should | PR-M07-03 |
| UR-KT-08 | Khi mẫu không đạt, tôi cần biết ngay những chuyến nào bị ảnh hưởng | Hệ thống liệt kê các chuyến cùng cấp phối/cùng ca/cùng công trình và cảnh báo tới GĐ chi nhánh | Should | PR-M07-05 |
| UR-KT-09 | **Tôi cần xuất hồ sơ chất lượng cho một công trình bằng một nút** | Chọn công trình/hợp đồng/kỳ → PDF gộp gồm cấp phối, bảng kê phiếu giao hàng, độ sụt, kết quả nén, chứng chỉ vật tư; thời gian ≤ 1 phút | Must | BR-12, PR-M07-07 |
| UR-KT-10 | Tôi cần lưu chứng chỉ vật tư theo lô nhập để truy xuất khi cần | Đính kèm CO/CQ theo lô, tìm được theo nhà cung cấp/ngày nhập/loại vật tư | Should | BR-11, PR-M07-06 |
| UR-KT-11 | Khi có khiếu nại chất lượng, tôi cần truy ra được mẻ trộn, cấp phối và lô vật tư liên quan | Từ phiếu giao hàng/chuyến → mẻ trộn → cấp phối → lô vật tư trong ≤ 3 bước bấm | Should | BR-13, PR-M07-08 |
| UR-KT-12 | Tôi cần được Điều hành/Kế hoạch hỏi ý kiến trên hệ thống, không qua điện thoại | Yêu cầu xác nhận cấp phối cho đơn hàng hiện trên danh sách việc của tôi, kèm thông báo đẩy | Must | PR-M06-04 |
| UR-KT-13 | Tôi không muốn nhập lại số liệu mà trạm trộn đã có | Khi có tích hợp trạm trộn, khối lượng và vật tư thực dùng tự về hệ thống | Should | PR-M16-01 |
| UR-KT-14 | Tôi cần theo dõi độ ổn định cường độ theo cấp phối/trạm | Biểu đồ R28 theo thời gian, độ lệch chuẩn, tỷ lệ mẫu đạt | Could | PR-M07-09 |

### 3.3 PHÒNG KẾ HOẠCH (UC-04) — *1 người/chi nhánh*

| Mã | Yêu cầu người dùng | Tiêu chí chấp nhận | Ưu tiên | Truy vết |
|---|---|---|---|---|
| UR-KH-01 | Tôi cần thấy toàn bộ đơn hàng ngày mai trên một màn hình theo trục giờ | Biểu đồ 24h × trạm, mỗi đơn là một khối theo giờ và m³; lọc theo trạm/khách/mác | Must | BR-15, PR-M08-01 |
| UR-KH-02 | Tôi cần hệ thống cảnh báo khi tổng đơn vượt năng lực trạm trong một khung giờ | Tô đỏ khung giờ vượt công suất m³/h; hiện số m³ vượt; đề xuất giãn giờ | Must | BR-16, PR-M08-02 |
| UR-KH-03 | Tôi cần hệ thống tự tính nhu cầu xi măng, cát, đá, phụ gia cho kế hoạch — tôi không tính tay nữa | Nhu cầu = Σ(m³ × định mức cấp phối), hiển thị theo ngày/ca/vật tư; xuất Excel được | Must | BR-17, PR-M08-04 |
| UR-KH-04 | Tôi cần biết tồn vật tư còn đủ mấy ngày | Dự báo tồn theo kế hoạch, hiển thị "số ngày còn lại" theo từng vật tư, cảnh báo dưới ngưỡng an toàn | Should | BR-18, PR-M09-04 |
| UR-KH-05 | Tôi cần sinh đề nghị mua vật tư từ cảnh báo thiếu, không phải soạn tay | 1 nút "Tạo đề nghị mua" từ dòng cảnh báo, tự điền vật tư/khối lượng/ngày cần | Should | PR-M09-05 |
| UR-KH-06 | Tôi cần chốt kế hoạch và Điều hành thấy ngay, không phải gửi Excel qua Zalo | Kế hoạch "Đã chốt" xuất hiện tức thời trên bảng điều phối | Must | PR-M08-05 |
| UR-KH-07 | Tôi cần sửa kế hoạch trong ngày khi khách đổi giờ, có ghi lý do | Sửa được đến trước khi chuyến bắt đầu trộn; ghi người sửa, thời điểm, lý do | Must | PR-M08-06 |
| UR-KH-08 | Tôi cần biết cần bao nhiêu xe và bơm cho kế hoạch ngày mai | Hệ thống tính số xe cần theo m³, cự ly, chu kỳ xe; cảnh báo nếu đội xe không đủ | Should | PR-M08-07 |
| UR-KH-09 | Tôi cần đối chiếu tiêu hao vật tư thực tế với định mức để phát hiện thất thoát | Báo cáo chênh lệch theo ca/tháng/vật tư, có ngưỡng cảnh báo (%) | Should | BR-19, PR-M09-06 |
| UR-KH-10 | Tôi cần dự báo sản lượng tuần/tháng để đàm phán mua vật tư | Dự báo từ hợp đồng đã ký + cơ hội có xác suất cao | Should | PR-M08-08 |
| UR-KH-11 | **Khi tôi nghỉ, người khác phải chốt được kế hoạch thay tôi** | Uỷ quyền theo thời gian; Kế hoạch CN khác hoặc Điều hành trưởng có thể chốt kế hoạch | Must | UCH-01, PR-M01-03 |
| UR-KH-12 | Tôi cần bàn giao ca có căn cứ, không nói miệng | Biểu bàn giao ca: đơn còn dở, khối lượng còn lại, sự cố, ghi chú | Must | PR-M08-03 |

### 3.4 PHÒNG ĐIỀU HÀNH (UC-05) — *người dùng cường độ cao nhất*

| Mã | Yêu cầu người dùng | Tiêu chí chấp nhận | Ưu tiên | Truy vết |
|---|---|---|---|---|
| UR-DH-01 | **Tôi cần một màn hình duy nhất để làm việc cả ca, không phải mở nhiều tab** | Bảng điều phối gồm 3 khối: đơn hàng theo giờ / xe & trạng thái / chuyến đang chạy; không cần rời màn hình để phân xe | Must | BR-20, PR-M10-01 |
| UR-DH-02 | Tôi cần hệ thống tự đề xuất chia chuyến cho một đơn hàng | Nhập đơn 60 m³ → đề xuất 8 chuyến × 7,5 m³ theo tải xe, giãn cách theo tốc độ đổ; tôi chỉ điều chỉnh | Must | PR-M10-02 |
| UR-DH-03 | Tôi cần phân xe và tài xế bằng kéo-thả hoặc ≤ 3 lần bấm | Thao tác phân 1 chuyến ≤ 20 giây; hỗ trợ phím tắt | Must | BR-21, PR-M10-03 |
| UR-DH-04 | Tôi cần hệ thống chặn tôi khi phân xe đang chạy chuyến khác hoặc đang bảo dưỡng | Cảnh báo/chặn trùng lịch, xe không khả dụng, tài xế vượt giờ lái, tải vượt bồn | Must | PR-M10-03 |
| UR-DH-05 | Tôi cần thấy xe nào đang rảnh, đang trên đường, đang chờ ở công trình | Trạng thái xe cập nhật ≤ 3 giây, phân biệt bằng màu; số phút ở trạng thái hiện tại | Must | BR-22, PR-M10-04 |
| UR-DH-06 | **Tôi cần cảnh báo khi bê tông đã quá 90 phút kể từ lúc trộn** | Chuyến hiện cảnh báo đỏ khi vượt ngưỡng cấu hình; cảnh báo cả khi xe chờ tại công trình quá ngưỡng | Must | PR-M10-05 |
| UR-DH-07 | Tôi cần biết chuyến nào đang trễ so với kế hoạch để gọi khách trước khi khách gọi tôi | Danh sách "chuyến trễ" tự cập nhật; hiển thị số phút trễ và thông tin liên hệ hiện trường | Must | PR-M10-05 |
| UR-DH-08 | Tôi cần xử lý sự cố ngay trên hệ thống: xe hỏng, khách dừng đổ, bê tông trả về | Ghi sự cố với phân loại nguyên nhân, chuyển chuyến sang xe khác 1 bước, ghi nhận khối lượng trả về | Must | PR-M10-08 |
| UR-DH-09 | Tôi cần gửi lệnh chuyến tới tài xế mà không phải gọi điện | Tài xế nhận thông báo đẩy kèm đầy đủ thông tin chuyến; hệ thống hiện tài xế đã nhận/chưa nhận | Must | PR-M15-01 |
| UR-DH-10 | Tôi cần biết chu kỳ xe thực tế theo từng công trình để giãn chuyến chính xác | Chu kỳ trung bình theo tuyến/công trình/xe trong 30 ngày gần nhất, hiện ngay khi phân chuyến | Should | BR-23, PR-M10-06 |
| UR-DH-11 | Tôi cần thấy xe trên bản đồ khi tài xế không bắt máy | Bản đồ hiển thị vị trí xe (từ GPS) và công trình đích; thời gian cập nhật ≤ 2 phút | Should | PR-M10-07 |
| UR-DH-12 | Tôi cần quản lý xe thuê ngoài giống xe công ty | Xe thuê ngoài phân chuyến bình thường, có nhãn riêng và ghi nhận chi phí thuê theo chuyến | Should | BR-24, PR-M11-01 |
| UR-DH-13 | Khi thiếu xe, tôi cần xin xe từ chi nhánh khác trên hệ thống | Tạo đề nghị điều chuyển → GĐ duyệt → xe hiện trong danh sách khả dụng của CN nhận | Could | BR-25, PR-M10-09 |
| UR-DH-14 | Tôi cần bàn giao ca mà ca sau hiểu ngay tình hình | Biểu giao ca tự tổng hợp: đơn hoàn thành/dở, sự cố, xe hỏng, ghi chú tay | Should | PR-M10-10 |
| UR-DH-15 | Tôi cần chốt ngày: không còn phiếu giao hàng nào thiếu ký hay thiếu khối lượng | Danh sách phiếu chưa hoàn tất; không cho chốt ngày khi còn phiếu treo (hoặc phải ghi lý do) | Must | PR-M12-06 |
| UR-DH-16 | Hệ thống không được tự đăng xuất khi tôi đang trực bảng điều phối | Không hết hạn phiên khi màn hình điều phối đang hoạt động; nếu mất mạng thì tự kết nối lại và cảnh báo rõ | Must | UCH-03 |
| UR-DH-17 | Tôi cần chế độ tối cho ca đêm | Bật/tắt dark mode, lưu theo người dùng | Should | UCH-03 |

### 3.5 TÀI XẾ / VẬN HÀNH BƠM (UC-06)

| Mã | Yêu cầu người dùng | Tiêu chí chấp nhận | Ưu tiên | Truy vết |
|---|---|---|---|---|
| UR-TX-01 | Tôi cần mở app là thấy ngay chuyến tiếp theo của mình | Màn hình đầu tiên là chuyến hiện tại/kế tiếp: khách, địa chỉ, m³, mác, giờ; không qua menu | Must | PR-M15-01 |
| UR-TX-02 | **Tôi chỉ muốn bấm vài nút cho một chuyến** | Toàn bộ chuyến ≤ 5 lần chạm: Nhận chuyến → Xuất trạm → Đến nơi → Xong đổ → Lấy ký | Must | UCH-02, PR-M12-02 |
| UR-TX-03 | Tôi cần app dùng được khi công trình không có mạng | Ghi nhận mốc thời gian, khối lượng, chữ ký offline; tự đồng bộ khi có mạng; không mất dữ liệu | Must | PR-M12-05 |
| UR-TX-04 | Tôi cần xin khách ký nhận trên điện thoại thay vì phiếu giấy | Khách ký bằng ngón tay trên màn hình hoặc xác nhận OTP; kèm ảnh và toạ độ | Must | BR-26, PR-M12-02 |
| UR-TX-05 | Khi khách nhận thiếu m³, tôi cần ghi lại và chọn lý do | Nhập khối lượng thực nhận, chọn lý do từ danh sách; bắt buộc khi lệch so với phiếu | Must | PR-M12-03 |
| UR-TX-06 | Tôi cần chỉ đường tới công trình | Bấm 1 nút mở Google Maps theo toạ độ công trình | Should | PR-M15-02 |
| UR-TX-07 | Tôi cần chữ to, nút to, dùng được khi tay bẩn và trời nắng | Chữ ≥ 18px, nút ≥ 48px, tương phản cao, không có ô nhập chữ dài | Must | UCH-02 |
| UR-TX-08 | Tôi muốn xem số chuyến và m³ tôi đã chạy trong tháng | Màn hình cá nhân: số chuyến, m³, km theo ngày/tháng | Should | PR-M11-05 |
| UR-TX-09 | Tôi cần báo sự cố nhanh (xe hỏng, tắc đường, khách chưa sẵn sàng) | Nút "Báo sự cố" với danh sách chọn nhanh + ảnh; Điều hành nhận ngay | Must | PR-M10-08 |
| UR-TX-10 | Tôi cần in được phiếu giấy khi khách yêu cầu | Gửi PDF qua Zalo cho khách, hoặc in từ Điều hành/bảo vệ trạm | Should | PR-M12-04 |

### 3.6 GIÁM ĐỐC CHI NHÁNH (UC-07)

| Mã | Yêu cầu người dùng | Tiêu chí chấp nhận | Ưu tiên | Truy vết |
|---|---|---|---|---|
| UR-GD-01 | Tôi cần biết sản lượng và doanh thu chi nhánh hôm nay, ngay trên điện thoại | Dashboard mobile: m³ hôm nay/tháng, doanh thu, số chuyến, so kỳ trước, cập nhật T+0 | Must | BR-31, PR-M14-01 |
| UR-GD-02 | Tôi cần duyệt giá dưới sàn trên điện thoại trong vài giây | Thông báo đẩy → xem đề nghị (giá, giá sàn, lý do, khách, khối lượng) → Duyệt/Từ chối kèm ghi chú | Must | BR-03, PR-M03-06 |
| UR-GD-03 | Tôi cần duyệt hạn mức công nợ và ngoại lệ vượt hạn mức | Luồng duyệt riêng, hiển thị lịch sử thanh toán của khách để ra quyết định | Must | BR-05, PR-M13-06 |
| UR-GD-04 | Tôi cần biết đơn hàng ngày mai và năng lực trạm có đáp ứng được không | Xem kế hoạch ngày mai, cảnh báo quá tải, cảnh báo thiếu vật tư | Must | PR-M08-02 |
| UR-GD-05 | Tôi cần biết công nợ quá hạn của chi nhánh và ai phụ trách | Danh sách nợ quá hạn theo tuổi nợ, kèm NVKD phụ trách | Should | BR-30, PR-M14-08 |
| UR-GD-06 | Tôi cần biết chi nhánh mình đang lãng phí ở đâu | Báo cáo năng suất xe, thời gian chờ, chênh lệch định mức vật tư, tỷ lệ chuyến hủy | Should | PR-M14-05, PR-M14-06 |
| UR-GD-07 | Tôi cần được cảnh báo ngay khi có mẫu bê tông không đạt hoặc khiếu nại chất lượng | Thông báo đẩy tức thời kèm phạm vi ảnh hưởng | Should | PR-M07-05 |

### 3.7 BAN LÃNH ĐẠO CÔNG TY (UC-08)

| Mã | Yêu cầu người dùng | Tiêu chí chấp nhận | Ưu tiên | Truy vết |
|---|---|---|---|---|
| UR-BLD-01 | **Tôi cần một dashboard hợp nhất cả 3 chi nhánh, số liệu trong ngày** | m³, doanh thu, giá bán bình quân/m³, công nợ theo từng CN và tổng; không phải chờ báo cáo tháng | Must | BR-31, PR-M14-09 |
| UR-BLD-02 | Tôi cần so sánh 3 chi nhánh trên cùng bộ chỉ số | Bảng so sánh: sản lượng, giá bình quân, chuyến/xe/ngày, tỷ lệ mẫu đạt, DSO | Must | PR-M14-09 |
| UR-BLD-03 | Tôi cần thấy xu hướng giá bán bình quân để biết có bị xói mòn giá không | Biểu đồ giá bình quân/m³ theo tháng, theo mác, theo chi nhánh | Must | BO-01, PR-M14-03 |
| UR-BLD-04 | Tôi cần duyệt các trường hợp vượt thẩm quyền GĐ chi nhánh | Luồng duyệt cấp 2 khi giá thấp hơn ngưỡng sâu hoặc hạn mức lớn | Must | PR-M03-06 |
| UR-BLD-05 | Tôi cần biết biên lợi nhuận gộp/m³ để định giá | Giá bán bình quân trừ giá thành sơ bộ (vật tư + vận chuyển) theo CN/mác | Could | BR-32, PR-M14-10 |
| UR-BLD-06 | Tôi cần điều phối nguồn lực giữa các chi nhánh dựa trên số liệu | Xem tình trạng xe/bơm/năng lực trạm cả 3 CN trên 1 màn hình; duyệt điều chuyển | Could | BR-25, PR-M10-09 |

### 3.8 KẾ TOÁN (UC-09)

| Mã | Yêu cầu người dùng | Tiêu chí chấp nhận | Ưu tiên | Truy vết |
|---|---|---|---|---|
| UR-KTO-01 | Tôi cần khối lượng nghiệm thu chốt số, không lệch với phiếu giao hàng | Khối lượng nghiệm thu = Σ phiếu đã ký; mọi điều chỉnh có phê duyệt và lưu vết | Should | BR-28, PR-M13-01 |
| UR-KTO-02 | Tôi cần bảng kê chi tiết kèm biên bản nghiệm thu để xuất hóa đơn | Xuất Excel/PDF bảng kê theo phiếu, đơn giá, thành tiền, thuế | Should | PR-M13-02 |
| UR-KTO-03 | Tôi không muốn nhập lại hóa đơn từ đầu | Đề nghị hóa đơn đẩy sang HĐĐT/phần mềm kế toán; nhận lại số hóa đơn và trạng thái | Should | BR-29, PR-M16-03 |
| UR-KTO-04 | Tôi cần đối chiếu công nợ khớp giữa hệ thống và kế toán | Báo cáo đối chiếu, danh sách lệch, cập nhật thu tiền tự động về hệ thống | Should | PR-M13-05 |
| UR-KTO-05 | Tôi cần biết sản lượng theo xe/tài xế để tính lương chuyến | Xuất báo cáo chuyến theo tài xế theo kỳ | Should | PR-M11-05 |

### 3.9 QUẢN TRỊ HỆ THỐNG (UC-10)

| Mã | Yêu cầu người dùng | Tiêu chí chấp nhận | Ưu tiên | Truy vết |
|---|---|---|---|---|
| UR-IT-01 | Tôi cần tạo/khoá tài khoản và gán vai trò, phạm vi chi nhánh | Quản lý người dùng tập trung; khoá tài khoản tức thời khi nhân sự nghỉ | Must | PR-M01-02 |
| UR-IT-02 | Tôi cần import dữ liệu gốc từ Excel | Template có kiểm tra lỗi, báo dòng lỗi cụ thể, import lại được | Must | PR-M01-09 |
| UR-IT-03 | Tôi cần tra được ai đã sửa giá/khối lượng/hạn mức và khi nào | Audit log tìm theo người dùng, đối tượng, thời gian; không cho phép xóa log | Must | BR-33, PR-M01-08 |
| UR-IT-04 | Tôi cần thêm chi nhánh/trạm mới bằng cấu hình | Thêm chi nhánh, trạm, tham số vận hành không cần lập trình | Must | PR-M01-01 |
| UR-IT-05 | Tôi cần sao lưu và phục hồi dữ liệu | Sao lưu hàng ngày, kiểm chứng phục hồi định kỳ | Must | SRS §6 |

---

## 4. MA TRẬN PHÂN QUYỀN (RACI VIEW)

Chú giải: **C** = Tạo/Sửa, **R** = Chỉ xem, **A** = Phê duyệt, **–** = Không truy cập. Mọi quyền đều bị giới hạn trong **phạm vi chi nhánh** được gán, trừ vai trò công ty.

| Chức năng | NVKD | TP KD | Kỹ thuật | Kế hoạch | Điều hành | Tài xế | GĐ CN | Ban LĐ | Kế toán | Admin |
|---|---|---|---|---|---|---|---|---|---|---|
| Khách hàng, công trình | C (của mình) | C | R | R | R | – | R | R | R | C |
| Bảng giá & giá sàn | R | R | – | – | – | – | A | A | R | C |
| Báo giá | C | C, A | R | – | – | – | A | A | R | R |
| Duyệt giá dưới sàn | – | – | – | – | – | – | **A** | **A** | – | – |
| Hợp đồng, phụ lục | C | C, A | R | R | R | – | A | A | R | R |
| Hạn mức công nợ | R | R | – | – | – | – | **A** | **A** | R | – |
| Đơn hàng | C | C | R | C, A | C, R | R (chuyến) | A | R | R | R |
| Cấp phối & định mức | R | R | **C, A** | R | R | – | R | R | – | R |
| Thí nghiệm, chất lượng | R | R | **C** | R | R | R (độ sụt) | R | R | – | R |
| Hồ sơ chất lượng (xuất) | C | C | C | R | R | – | R | R | R | R |
| Kế hoạch sản xuất | R | R | R | **C, A** | C, R | – | A | R | – | R |
| Vật tư, tồn silo | – | – | R | **C** | R | – | R | R | R | R |
| Đề nghị mua vật tư | – | – | R | C | – | – | **A** | A | R | R |
| Bảng điều phối, chuyến | R | R | R | R | **C** | R | R | R | – | R |
| Đội xe, tài xế | R | R | – | R | C | – | A | R | R | C |
| Phiếu giao hàng | R | R | R | R | **C** | **C** (ký nhận) | R | R | R | R |
| Điều chỉnh phiếu đã chốt | – | – | – | – | Đề nghị | – | **A** | A | R | – |
| Nghiệm thu khối lượng | C | C, A | R | – | R | – | A | R | C, A | R |
| Hóa đơn, thu tiền | R | R | – | – | – | – | R | R | **C** | R |
| Điều chuyển liên chi nhánh | – | – | – | R | Đề nghị | – | A | **A** | – | R |
| Báo cáo chi nhánh | R (của mình) | R | R | R | R | – | R | R | R | R |
| Báo cáo hợp nhất 3 CN | – | – | – | – | – | – | R (CN mình) | **R** | R | R |
| Quản trị người dùng, cấu hình | – | – | – | – | – | – | R | R | – | **C** |
| Audit log | – | – | – | – | – | – | R | R | – | **R** |

---

## 5. HÀNH TRÌNH NGƯỜI DÙNG CHÍNH (USER JOURNEYS)

### UJ-01 · NVKD: từ khảo sát công trình đến đơn hàng đầu tiên
1. Đến công trình mới → mở app → **Tạo công trình** (tự lấy GPS, chụp ảnh đường vào, ghi giờ cấm tải).
2. Trao đổi với chủ thầu → **Tạo báo giá**: chọn mác M300, độ sụt 12±2, bơm cần, khối lượng 800 m³ → hệ thống tính đơn giá theo vùng cự ly 12 km + phụ phí bơm.
3. Khách yêu cầu giảm 30.000 đ/m³ → giá xuống dưới sàn → app hiện cảnh báo → **Gửi duyệt** kèm lý do "khách có 3 công trình tiếp theo".
4. GĐ chi nhánh nhận thông báo, duyệt trên điện thoại sau 25 phút → NVKD nhận thông báo.
5. **Xuất PDF** → gửi Zalo cho khách.
6. Khách đồng ý → **Tạo hợp đồng từ báo giá** → xin duyệt hạn mức công nợ 1,5 tỷ / 45 ngày → upload hợp đồng đã ký.
7. Khách chốt đổ móng 60 m³ lúc 6h ngày mai → **Tạo yêu cầu cấp bê tông** trên app lúc 19h30 (sau cut-off 16h → đánh dấu "đơn gấp").
8. Kế hoạch nhận thông báo, kiểm tra năng lực → xác nhận đơn → NVKD và khách nhận thông báo xác nhận.

### UJ-02 · Kế hoạch: lập kế hoạch ca cho ngày mai (16h00–17h00)
1. Mở **Kế hoạch ngày mai** → thấy 14 đơn đã xác nhận, tổng 620 m³.
2. Khung giờ 06:00–08:00 hiện **đỏ**: 180 m³ trong khi trạm 60 m³/h → vượt 60 m³.
3. Chọn 1 đơn không gấp → đề nghị NVKD dời sang 08:30 → NVKD xác nhận với khách → khung giờ về xanh.
4. Xem **Nhu cầu vật tư**: cần 210 tấn xi măng; tồn silo 260 tấn → đủ 1,2 ngày → **Tạo đề nghị mua** 300 tấn giao trước 14h mai.
5. Xem **Nhu cầu xe**: cần 11 xe, đội có 9 xe khả dụng (2 bảo dưỡng) → cảnh báo → tạo đề nghị điều chuyển 2 xe từ CN2.
6. **Chốt kế hoạch** → Điều hành ca đêm và ca sáng thấy ngay trên bảng điều phối.

### UJ-03 · Kỹ thuật: một ngày làm việc (1 người/CN)
1. Sáng: dashboard hiện **3 việc**: 2 đơn hàng chờ xác nhận cấp phối, 4 mẫu đến hạn ép R7 hôm nay.
2. Xác nhận cấp phối cho 2 đơn (hệ thống đã gợi ý đúng từ thư viện) → 2 lần bấm.
3. Ra hiện trường: **ghi độ sụt** cho 3 chuyến trên app, chụp ảnh, đúc 1 tổ mẫu → tạo mẫu trên app, hệ thống tự đặt ngày ép R7/R28.
4. Chiều: nhập kết quả nén 4 tổ mẫu → 1 tổ không đạt → hệ thống liệt kê 9 chuyến cùng cấp phối trong ca đó và cảnh báo GĐ chi nhánh.
5. Mở hồ sơ điều tra: truy xuất → mẻ trộn → lô cát mới nhập ngày 05/09 → gắn kết luận, đề xuất điều chỉnh cấp phối.
6. NVKD yêu cầu hồ sơ chất lượng công trình Vinhomes đợt 2 → **xuất 1 nút** → PDF 46 trang trong 40 giây.

### UJ-04 · Điều hành: một ca sản xuất
1. 05:30 vào ca → bảng điều phối hiện kế hoạch đã chốt: 14 đơn, 620 m³, 9 xe, 2 bơm.
2. Đơn đầu 6h/60 m³/bơm cần → hệ thống đề xuất 8 chuyến × 7,5 m³ giãn 12 phút (chu kỳ xe tuyến này 68 phút) → chấp nhận.
3. Kéo-thả gán 5 xe cho 8 chuyến → cảnh báo xe 29H-123.45 sắp đến hạn bảo dưỡng → đổi xe khác.
4. Gửi lệnh → 5 tài xế nhận thông báo, 4 người xác nhận, 1 người chưa → gọi trực tiếp.
5. 07:20: cảnh báo đỏ — chuyến #5 đã 95 phút từ lúc trộn, xe đang chờ tại công trình 40 phút → gọi giám sát công trình, khách đang chờ cẩu → ghi **sự cố "khách chưa sẵn sàng"**, tạm dừng 2 chuyến sau.
6. 09:00: xe 29H-567.89 hỏng bơm thủy lực → tài xế báo sự cố trên app → chuyển 2 chuyến sang xe khác 1 bước, đặt trạng thái xe "Bảo dưỡng".
7. 17:00 chốt ca: 3 phiếu giao hàng thiếu ký → gọi tài xế bổ sung ảnh ký nhận → chốt ngày → **bàn giao ca** cho ca đêm với ghi chú.

### UJ-05 · Tài xế: một chuyến
1. Điện thoại rung → mở app → thấy **chuyến kế tiếp**: Vinhomes Grand Park, 7,5 m³ M300, 06:12, bơm cần → chạm **Nhận chuyến** *(1)*.
2. Vào trạm nạp bê tông → chạm **Xuất trạm** *(2)* → hệ thống ghi giờ, tự sinh phiếu giao hàng.
3. Chạm **Chỉ đường** → Google Maps mở theo toạ độ.
4. Đến công trình → chạm **Đến nơi** *(3)* (hoặc tự nhận diện bằng geofence GPS).
5. Đổ xong → chạm **Xong đổ** *(4)* → nhập khối lượng thực nhận 7,5 m³ (mặc định đúng, không cần sửa).
6. Đưa điện thoại cho giám sát → khách ký → chạm **Hoàn tất** *(5)*. Không có mạng → app lưu offline, hiện biểu tượng "chờ đồng bộ".
7. Về đến vùng có 4G → tự đồng bộ, phiếu lên hệ thống, Điều hành và NVKD thấy ngay.

### UJ-06 · Ban lãnh đạo: buổi sáng 10 phút
1. Mở app → **Dashboard hợp nhất**: hôm qua 1.840 m³ / 3 CN; CN2 thấp hơn kế hoạch 18%.
2. Chạm CN2 → thấy 4 chuyến hủy do sự cố xe và 1 đơn dừng vì khách chưa sẵn sàng.
3. Xem **giá bán bình quân/m³**: CN3 giảm 2,1% trong 30 ngày → xem danh sách đơn duyệt dưới giá sàn của CN3.
4. Có 2 đề nghị chờ duyệt (1 giá dưới sàn sâu, 1 hạn mức 3 tỷ) → xem lịch sử thanh toán khách → duyệt 1, từ chối 1 kèm ghi chú.

---

## 6. YÊU CẦU VỀ TRẢI NGHIỆM & GIAO DIỆN

| Mã | Yêu cầu | Áp dụng cho |
|---|---|---|
| UX-01 | Toàn bộ giao diện, thông báo, mẫu in bằng tiếng Việt có dấu | Tất cả |
| UX-02 | Đơn vị và định dạng Việt Nam: m³, tấn, km, VNĐ (1.234.567), ngày dd/MM/yyyy, giờ 24h | Tất cả |
| UX-03 | Bảng điều phối: không quá 1 lần cuộn để thấy toàn bộ đơn trong ca; hỗ trợ phím tắt | Điều hành |
| UX-04 | App tài xế: chữ ≥ 18px, nút ≥ 48×48px, tương phản cao, tối đa 1 hành động chính mỗi màn hình | Tài xế |
| UX-05 | Mọi màn hình danh sách phải lọc được theo chi nhánh, khoảng thời gian, trạng thái và xuất Excel | Tất cả |
| UX-06 | Thông báo lỗi phải nói rõ nguyên nhân và cách xử lý (không dùng mã lỗi kỹ thuật) | Tất cả |
| UX-07 | Các số liệu tiền và giá phải ẩn với vai trò không có quyền (thay bằng "—") | Tất cả |
| UX-08 | Hiển thị trạng thái đồng bộ offline rõ ràng trên mobile (đang chờ / đã đồng bộ / lỗi) | Tài xế, NVKD, Kỹ thuật |
| UX-09 | Cảnh báo phân 3 mức màu: thông tin (xanh), cảnh báo (vàng), nghiêm trọng (đỏ) — dùng nhất quán | Tất cả |
| UX-10 | Dark mode tùy chọn | Điều hành |
| UX-11 | Người dùng đăng nhập một lần trong ngày trên mobile, không bắt đăng nhập lại mỗi lần mở app | Tài xế, NVKD |

---

## 7. YÊU CẦU ĐÀO TẠO & CHUYỂN ĐỔI

| Mã | Nhóm | Nội dung đào tạo | Thời lượng | Hình thức |
|---|---|---|---|---|
| TR-01 | NVKD (15) | CRM, báo giá, hợp đồng, đơn hàng, app mobile | 1 ngày + 1 buổi thực hành tại công trình | Nhóm 5 người/CN |
| TR-02 | Kỹ thuật (3) | Cấp phối, định mức, thí nghiệm, hồ sơ chất lượng | 1,5 ngày | Kèm 1-1, có tài liệu riêng |
| TR-03 | Kế hoạch (3) | Kế hoạch ca, vật tư, đề nghị mua | 1,5 ngày | Kèm 1-1 |
| TR-04 | Điều hành (9) | Bảng điều phối, chuyến, sự cố, phiếu giao hàng, giao ca | 2 ngày + 1 tuần hỗ trợ tại chỗ theo ca | Bao gồm ca đêm |
| TR-05 | Tài xế (30–60) | App tài xế | **≤ 30 phút**, tại bãi xe, cầm tay chỉ việc | Nhóm 10 người, video ngắn 3 phút |
| TR-06 | GĐ CN & Ban LĐ | Dashboard, phê duyệt trên mobile | 1 giờ | 1-1 |
| TR-07 | Kế toán | Nghiệm thu, hóa đơn, công nợ, đối chiếu | 1 ngày | Nhóm |
| TR-08 | Admin/IT | Quản trị, phân quyền, import, audit, sao lưu | 1 ngày | 1-1 |
| TR-09 | Tất cả | Tài liệu hướng dẫn ngắn theo vai trò (≤ 6 trang) + video ≤ 5 phút/nghiệp vụ | — | Truy cập trong hệ thống |

**Yêu cầu chuyển đổi:** mỗi chi nhánh chạy song song sổ/phiếu giấy **2 tuần**; có "người dùng chủ chốt" (key user) tại từng phòng làm đầu mối; hỗ trợ tại chỗ theo ca trong tuần đầu golive.

---

## 8. TIÊU CHÍ NGHIỆM THU CỦA NGƯỜI DÙNG (UAT ACCEPTANCE)

| Mã | Tiêu chí | Người xác nhận |
|---|---|---|
| UA-01 | NVKD lập và gửi được báo giá hoàn chỉnh từ điện thoại tại công trình trong ≤ 5 phút | TP Kinh doanh |
| UA-02 | Đề nghị duyệt giá dưới sàn được GĐ CN duyệt trên điện thoại và NVKD nhận kết quả | GĐ CN |
| UA-03 | Kế hoạch chốt được kế hoạch 1 ngày (≥ 12 đơn) trong ≤ 45 phút, có cảnh báo quá tải và nhu cầu vật tư đúng | NV Kế hoạch |
| UA-04 | Kỹ thuật xuất được hồ sơ chất lượng 1 công trình bằng 1 nút, nội dung đầy đủ theo mẫu khách yêu cầu | NV Kỹ thuật + 1 khách hàng thử nghiệm |
| UA-05 | Điều hành phân xe cho toàn bộ 1 ca (≥ 60 chuyến) hoàn toàn trên hệ thống, không dùng bảng trắng | Trưởng Điều hành |
| UA-06 | ≥ 90% chuyến trong 2 tuần thử nghiệm có phiếu giao hàng điện tử ký nhận đầy đủ | Trưởng Điều hành |
| UA-07 | Tài xế mới được đào tạo 30 phút thực hiện được 1 chuyến trọn vẹn trên app mà không cần trợ giúp | 5 tài xế bất kỳ |
| UA-08 | App tài xế hoàn tất 1 chuyến ở chế độ máy bay (offline) và đồng bộ đủ dữ liệu khi bật mạng | QA + tài xế |
| UA-09 | Khối lượng nghiệm thu 1 kỳ khớp 100% với tổng phiếu giao hàng đã ký | Kế toán |
| UA-10 | Dashboard hợp nhất 3 chi nhánh hiển thị đúng số liệu hôm nay, đối chiếu khớp với sổ tay của từng CN | Ban LĐ |
| UA-11 | Người dùng chỉ thấy dữ liệu chi nhánh được phân quyền (kiểm thử chéo 3 CN) | Admin + QA |
| UA-12 | Khi người phụ trách Kỹ thuật/Kế hoạch nghỉ, người được uỷ quyền hoàn tất được công việc phê duyệt | GĐ CN |
| UA-13 | Bảng điều phối hoạt động liên tục 1 ca 12 giờ không mất phiên đăng nhập, không phải tải lại trang | Điều hành |

---

## 9. YÊU CẦU CHƯA CHỐT / CẦN LÀM RÕ VỚI NGƯỜI DÙNG

| Mã | Nội dung | Nhóm liên quan |
|---|---|---|
| UQ-01 | Số nhân sự Điều hành/CN và có tách vai điều phối sản xuất vs điều phối xe? | Điều hành |
| UQ-02 | Tần suất lấy mẫu bắt buộc theo nội bộ công ty (theo m³ hay theo ca hay theo công trình)? | Kỹ thuật |
| UQ-03 | Bộ hồ sơ chất lượng khách hàng lớn yêu cầu gồm chính xác những chứng từ nào? | Kỹ thuật + Kinh doanh |
| UQ-04 | Giờ cut-off nhận đơn và chính sách phí hủy/phí chờ áp dụng ra sao? | Kinh doanh + Điều hành |
| UQ-05 | Tài xế dùng điện thoại cá nhân hay công ty cấp? Có chính sách hỗ trợ data? | HR + Điều hành |
| UQ-06 | Có cho phép NVKD chi nhánh A bán hàng cho công trình gần chi nhánh B (bán chéo)? Chia doanh số thế nào? | Kinh doanh + Ban LĐ |
| UQ-07 | Ba chi nhánh dùng bảng giá và giá sàn chung hay riêng? | Ban LĐ |
| UQ-08 | Ai được quyền điều chỉnh khối lượng phiếu giao hàng sau khi đã ký? | Điều hành + Kế toán |
| UQ-09 | Khách hàng có được cấp quyền tra cứu tiến độ giao hàng và hồ sơ chất lượng không? | Kinh doanh + Ban LĐ |

---

## 10. XÁC NHẬN CỦA NGƯỜI DÙNG

| Phòng ban | Đại diện | Ngày | Ký xác nhận |
|---|---|---|---|
| Phòng Kinh doanh (CN1/2/3) | | | |
| Phòng Kỹ thuật | | | |
| Phòng Kế hoạch | | | |
| Phòng Điều hành | | | |
| Đại diện tài xế | | | |
| Kế toán | | | |
| Giám đốc chi nhánh | | | |
| Ban lãnh đạo công ty | | | |
