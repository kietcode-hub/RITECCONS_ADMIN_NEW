# PRD — PRODUCT REQUIREMENTS DOCUMENT
## Hệ thống Quản trị Sản xuất – Kinh doanh Bê tông Thương phẩm (RMC-MS)

| Thông tin | Nội dung |
|---|---|
| Mã tài liệu | PRD-RMCMS-v1.0 |
| Tài liệu gốc | BRD-RMCMS-v1.0 |
| Ngày lập | 08/09/2026 |
| Đối tượng | Product Owner, BA, Tech Lead, UX, QA, Ban lãnh đạo |
| Trạng thái | Draft |

---

## 1. TẦM NHÌN SẢN PHẨM

> **RMC-MS là hệ thống điều hành xuyên suốt từ báo giá đến chuyến bê tông cuối cùng và đồng tiền cuối cùng thu về — cho doanh nghiệp bê tông thương phẩm nhiều chi nhánh.**

**Định vị:** không phải ERP tổng thể, mà là **lõi vận hành ngành bê tông (industry core)**: đơn hàng – cấp phối – kế hoạch ca – điều phối xe – phiếu giao hàng – nghiệm thu. Kế toán, HRM, bảo trì được tích hợp chứ không thay thế.

**Nguyên tắc sản phẩm:**
1. **Một nguồn sự thật duy nhất** — mọi m³ bê tông chỉ tồn tại một lần trong hệ thống, từ đơn hàng đến hóa đơn.
2. **Tối giản cho người nhập liệu, tối đa cho người ra quyết định** — Kỹ thuật/Kế hoạch chỉ 1 người/CN, nên hệ thống phải tự tính, tự cảnh báo, không bắt nhập lại.
3. **Bảng điều phối là màn hình trung tâm** — Điều hành sống trên một màn hình duy nhất suốt ca.
4. **Mobile-first cho hiện trường** — tài xế và NVKD làm việc ngoài trạm, offline vẫn dùng được.
5. **Đa chi nhánh từ ngày đầu** — không "làm 1 chi nhánh rồi nhân bản".
6. **Cảnh báo thay vì chặn** (trừ giá sàn và hạn mức công nợ) — vận hành bê tông không cho phép hệ thống làm nghẽn ca đổ.

---

## 2. PERSONAS

### P-01 · Hùng — Nhân viên Kinh doanh (15 người, nhóm lớn nhất)
- Ở ngoài đường 70% thời gian, tại công trình, dùng điện thoại.
- Cần: báo giá trong 5 phút ngay tại công trình; biết ngay khách còn hạn mức không; biết xe đến chưa.
- Đau: khách gọi hỏi "xe đâu rồi", phải gọi Điều hành; báo giá phải về công ty làm Excel.
- Thành công = số m³ chốt được, không phải số phiếu nhập.

### P-02 · Trang — Nhân viên Kỹ thuật (1 người/CN)
- Vừa thiết kế cấp phối, vừa quản lý chất lượng, vừa đi hiện trường lấy mẫu.
- Cần: thư viện cấp phối dùng lại được, nhắc mẫu đến hạn ép, xuất hồ sơ chất lượng 1 nút.
- Đau: nghỉ 1 ngày là không ai duyệt cấp phối; hồ sơ chất lượng gom tay khi khách nghiệm thu.
- **Rủi ro sản phẩm:** nếu bắt Trang nhập nhiều, cả hệ thống nghẽn.

### P-03 · Nam — Nhân viên Kế hoạch (1 người/CN)
- Mỗi chiều lập kế hoạch cho ngày mai từ các đơn đã xác nhận.
- Cần: nhìn được tổng m³ theo giờ vs năng lực trạm; biết xi măng đủ mấy ngày.
- Đau: nhận đơn quá năng lực rồi mới biết; hết phụ gia lúc 2h sáng.

### P-04 · Dũng — Điều hành/Dispatcher (3 người/CN, làm theo ca)
- Người dùng cường độ cao nhất: 8–12 giờ liên tục trên một màn hình.
- Cần: kéo-thả phân xe, thấy xe nào rảnh, đơn nào trễ, khách nào đang gọi.
- Đau: bảng trắng + 3 điện thoại; khách đổi giờ lúc đang đổ; xe chờ 90 phút không ai biết.
- Thành công = không có chuyến nào trễ và không có bê tông nào bị hủy.

### P-05 · Tuấn — Tài xế xe mixer (30–60 người)
- Dùng điện thoại cá nhân, tay bẩn, ngoài nắng, mạng yếu.
- Cần: xem chuyến kế tiếp, bấm mốc thời gian, xin khách ký, xong.
- **Yêu cầu tuyệt đối:** ≤ 5 lần chạm cho một chuyến, chữ to, chạy offline.

### P-06 · Chị Loan — Giám đốc chi nhánh
- Cần: sản lượng hôm nay, đơn mai, công nợ quá hạn, ai xin bán dưới giá sàn.
- Duyệt trên điện thoại, không mở laptop.

### P-07 · Anh Sơn — Tổng Giám đốc
- Cần: 1 dashboard hợp nhất 3 chi nhánh, so sánh chi nhánh, xu hướng giá bán bình quân.

### P-08 · Chị Hà — Kế toán
- Cần: khối lượng nghiệm thu chốt số, không lệch với hóa đơn; dữ liệu đẩy sang phần mềm kế toán và hóa đơn điện tử.

---

## 3. BẢN ĐỒ SẢN PHẨM (MODULE MAP)

| Mã | Module | Người dùng chính | Truy vết BRD |
|---|---|---|---|
| M01 | Quản trị hệ thống & Danh mục nền | Admin, Ban LĐ | BR-27, BR-33 |
| M02 | Khách hàng – Công trình – Cơ hội (CRM) | Kinh doanh | BR-01, BR-06 |
| M03 | Bảng giá – Báo giá – Phê duyệt giá | Kinh doanh, Ban LĐ | BR-02, BR-03 |
| M04 | Hợp đồng – Phụ lục – Hạn mức | Kinh doanh, Ban LĐ | BR-04, BR-05 |
| M05 | Đơn hàng & Yêu cầu cấp bê tông | Kinh doanh, Kế hoạch | BR-07, BR-16 |
| M06 | Cấp phối & Định mức (Mix Design) | Kỹ thuật | BR-08, BR-09, BR-14 |
| M07 | Chất lượng & Thí nghiệm | Kỹ thuật | BR-10, BR-11, BR-12, BR-13 |
| M08 | Kế hoạch sản xuất ngày/ca | Kế hoạch | BR-15, BR-16 |
| M09 | Vật tư – Tồn silo – Đề nghị mua | Kế hoạch | BR-17, BR-18, BR-19 |
| M10 | Bảng điều phối & Quản lý chuyến | Điều hành | BR-20, BR-21, BR-22, BR-23 |
| M11 | Đội xe – Tài xế – Xe bơm | Điều hành | BR-21, BR-24, BR-25 |
| M12 | Phiếu giao hàng điện tử (e-DO) | Điều hành, Tài xế | BR-26 |
| M13 | Nghiệm thu – Hóa đơn – Công nợ | Kinh doanh, Kế toán | BR-28, BR-29, BR-30 |
| M14 | Báo cáo & Dashboard (chi nhánh + hợp nhất) | Toàn bộ | BR-31, BR-32 |
| M15 | Mobile App (Tài xế / NVKD / QC hiện trường) | Tài xế, Kinh doanh, Kỹ thuật | BR-07, BR-26 |
| M16 | Tích hợp (trạm trộn, GPS, HĐĐT, kế toán, Zalo/SMS) | Hệ thống | AS-03…AS-06 |

---

## 4. YÊU CẦU SẢN PHẨM THEO MODULE

Ký hiệu ưu tiên (MoSCoW): **M** = Must (GĐ1), **S** = Should (GĐ2), **C** = Could (GĐ3), **W** = Won't (ngoài phạm vi).

### M01 · Quản trị hệ thống & Danh mục nền

| Mã | Tính năng | Ưu tiên | Mô tả sản phẩm |
|---|---|---|---|
| PR-M01-01 | Cây tổ chức đa chi nhánh | M | Công ty → Chi nhánh → Trạm trộn → Phòng ban. Mỗi bản ghi nghiệp vụ luôn thuộc 1 chi nhánh |
| PR-M01-02 | Người dùng & vai trò | M | Vai trò định nghĩa sẵn (12 vai trò, xem URD §4) + gán phạm vi chi nhánh (1 hoặc nhiều) |
| PR-M01-03 | Uỷ quyền tạm thời | M | Người dùng chuyển quyền phê duyệt cho người khác trong khoảng thời gian (nghỉ phép) — bắt buộc vì Kỹ thuật/Kế hoạch chỉ 1 người |
| PR-M01-04 | Danh mục sản phẩm bê tông | M | Mác/cấp cường độ, độ sụt, Dmax đá, loại xi măng, phụ gia, bê tông bơm/không bơm |
| PR-M01-05 | Danh mục vật tư & nhà cung cấp | M | Xi măng, cát, đá, phụ gia, tro bay, nước; đơn vị, hệ số quy đổi |
| PR-M01-06 | Danh mục vùng giá & cự ly | M | Khu vực/bán kính giao hàng, phụ phí theo km, thời gian di chuyển chuẩn |
| PR-M01-07 | Cấu hình tham số vận hành theo chi nhánh | M | Giờ cut-off nhận đơn, giờ ca, phụ thu ca đêm, năng lực trạm m³/h, ngưỡng cảnh báo |
| PR-M01-08 | Nhật ký hệ thống (audit log) | M | Ghi mọi thay đổi giá, hạn mức, khối lượng, cấp phối, phiếu giao hàng: ai – khi nào – giá trị cũ/mới |
| PR-M01-09 | Import dữ liệu gốc từ Excel | M | Template import khách hàng, công trình, cấp phối, xe, bảng giá (giảm tải nhập liệu ban đầu) |

### M02 · Khách hàng – Công trình – Cơ hội

| Mã | Tính năng | Ưu tiên | Mô tả sản phẩm |
|---|---|---|---|
| PR-M02-01 | Hồ sơ khách hàng | M | Pháp nhân/MST, liên hệ nhiều người, loại khách (nhà thầu chính/phụ/dân dụng), chi nhánh phụ trách, NVKD phụ trách |
| PR-M02-02 | Chống trùng khách hàng | M | Kiểm tra trùng theo MST/SĐT/tên khi tạo mới; cảnh báo và đề xuất gộp |
| PR-M02-03 | Hồ sơ công trình | M | Tên, địa chỉ, toạ độ trên bản đồ, cự ly từ trạm, khối lượng dự kiến, tiến độ, điều kiện tiếp cận xe (đường vào, cao độ, giờ cấm tải) |
| PR-M02-04 | Cự ly & thời gian di chuyển | S | Tự tính cự ly trạm → công trình để áp giá vận chuyển và ước tính thời gian giao |
| PR-M02-05 | Cơ hội bán (pipeline) | S | Giai đoạn (Tiềm năng → Báo giá → Đàm phán → Thắng/Thua), khối lượng & giá trị dự kiến, xác suất, lý do thua |
| PR-M02-06 | Lịch sử tương tác & viếng thăm | S | Ghi nhận cuộc gọi/gặp/khảo sát công trình, check-in GPS trên mobile |
| PR-M02-07 | Bàn giao khách khi NVKD thay đổi | S | Chuyển toàn bộ khách/công trình/cơ hội sang NVKD khác, giữ lịch sử |
| PR-M02-08 | Cảnh báo khách hàng có rủi ro | S | Đánh dấu khách có nợ quá hạn/khiếu nại chất lượng để NVKD biết trước khi báo giá |

### M03 · Bảng giá – Báo giá – Phê duyệt giá

| Mã | Tính năng | Ưu tiên | Mô tả sản phẩm |
|---|---|---|---|
| PR-M03-01 | Bảng giá theo chi nhánh & hiệu lực | M | Giá theo mác × độ sụt × vùng cự ly; có ngày hiệu lực, phiên bản, trạng thái |
| PR-M03-02 | **Giá sàn** | M | Giá sàn riêng theo sản phẩm/chi nhánh; hệ thống so sánh khi báo giá |
| PR-M03-03 | Cấu hình phụ phí/chiết khấu | M | Phụ phí bơm cần/bơm tĩnh theo m³ hoặc theo ca, phụ thu ca đêm, phụ thu khối lượng nhỏ, phụ phí chờ, phụ phí cự ly ngoài vùng, chiết khấu theo khối lượng cam kết |
| PR-M03-04 | Trình tạo báo giá | M | Chọn công trình → chọn sản phẩm → nhập khối lượng/điều kiện → hệ thống tự tính đơn giá và tổng giá trị |
| PR-M03-05 | Xuất báo giá PDF theo mẫu công ty | M | Mẫu chuẩn có logo, điều khoản, hiệu lực; gửi email/Zalo trực tiếp từ hệ thống |
| PR-M03-06 | Luồng phê duyệt giá dưới sàn | M | Tự động chuyển GĐ chi nhánh (hoặc TGĐ nếu dưới ngưỡng sâu hơn); duyệt được trên mobile; ghi lý do |
| PR-M03-07 | Phiên bản báo giá & so sánh | S | Rev 1, 2, 3… giữ lịch sử đàm phán |
| PR-M03-08 | Báo giá nhanh trên mobile | M | NVKD báo giá tại công trình, gửi PDF trong ≤ 5 phút |
| PR-M03-09 | Ước tính lợi nhuận gộp khi báo giá | C | Hiển thị giá thành sơ bộ/m³ (cấp phối + vận chuyển) để NVKD biết biên còn lại |

### M04 · Hợp đồng – Phụ lục – Hạn mức

| Mã | Tính năng | Ưu tiên | Mô tả sản phẩm |
|---|---|---|---|
| PR-M04-01 | Hợp đồng & phụ lục giá | M | Số HĐ, khách, công trình, khối lượng cam kết, thời hạn, điều khoản thanh toán, bảo lãnh/tạm ứng |
| PR-M04-02 | Chuyển báo giá → hợp đồng | M | Kế thừa toàn bộ giá và điều kiện, không nhập lại |
| PR-M04-03 | Quản lý hiệu lực & cảnh báo | M | Cảnh báo HĐ sắp hết hạn, sắp hết khối lượng cam kết (≥ 90%) |
| PR-M04-04 | **Hạn mức công nợ & điều khoản** | M | Hạn mức tiền, số ngày nợ cho phép; do Ban LĐ duyệt; hiển thị hạn mức khả dụng thời gian thực |
| PR-M04-05 | Điều chỉnh giá giữa kỳ | S | Phụ lục điều chỉnh giá theo biến động giá xi măng/vật tư, áp dụng từ ngày |
| PR-M04-06 | Lưu file scan hợp đồng đã ký | M | Đính kèm PDF/ảnh; hợp đồng chỉ "Hiệu lực" khi có file ký |
| PR-M04-07 | Tiến độ thực hiện hợp đồng | S | Khối lượng đã giao / cam kết, doanh thu, đã thu, còn nợ |

### M05 · Đơn hàng & Yêu cầu cấp bê tông

| Mã | Tính năng | Ưu tiên | Mô tả sản phẩm |
|---|---|---|---|
| PR-M05-01 | Tiếp nhận yêu cầu cấp bê tông | M | Ngày giờ đổ, công trình, hạng mục/kết cấu, mác, độ sụt, khối lượng, phương thức (bơm cần/tĩnh/xả), tốc độ đổ mong muốn (m³/h), người liên hệ tại hiện trường |
| PR-M05-02 | **Kiểm tra tự động khi tạo đơn** | M | 4 kiểm tra: (1) hợp đồng còn hiệu lực, (2) hạn mức công nợ khả dụng, (3) năng lực trạm & xe trong khung giờ, (4) cấp phối phù hợp đã được duyệt |
| PR-M05-03 | Trạng thái đơn hàng | M | Nháp → Chờ xác nhận → Đã xác nhận → Đang thực hiện → Hoàn thành / Hủy / Tạm dừng |
| PR-M05-04 | Cut-off & đơn gấp | M | Đơn cho ngày mai phải nhập trước giờ cut-off; sau cut-off đánh dấu "đơn gấp" cần Điều hành/Kế hoạch chấp thuận |
| PR-M05-05 | Thay đổi & hủy đơn có lưu vết | M | Ghi nhận thay đổi khối lượng/giờ, người yêu cầu, thời điểm; áp dụng chính sách phí hủy/chờ |
| PR-M05-06 | Đơn định kỳ / đơn nhiều ngày | S | Một công trình đổ nhiều ngày liên tục, sinh tự động lịch cấp hàng |
| PR-M05-07 | Thông báo cho khách hàng | S | Zalo/SMS: xác nhận đơn, xe xuất trạm, hoàn thành đổ |
| PR-M05-08 | Đặt hàng từ mobile NVKD | M | NVKD tạo yêu cầu ngay tại công trình khi khách chốt |

### M06 · Cấp phối & Định mức (Mix Design)

| Mã | Tính năng | Ưu tiên | Mô tả sản phẩm |
|---|---|---|---|
| PR-M06-01 | Thư viện cấp phối dùng chung | M | Danh mục cấp phối theo mác × độ sụt × Dmax × loại xi măng × điều kiện (bơm/không bơm); dùng chung 3 chi nhánh, có thể gắn nhãn chi nhánh áp dụng |
| PR-M06-02 | Định mức vật tư/m³ | M | Khối lượng từng vật tư/m³, tỷ lệ N/X, độ ẩm cốt liệu, hệ số điều chỉnh |
| PR-M06-03 | Phiên bản & phê duyệt cấp phối | M | Nháp → Chờ duyệt → Hiệu lực → Hết hiệu lực; chỉ cấp phối "Hiệu lực" được dùng cho sản xuất |
| PR-M06-04 | Gắn cấp phối vào đơn hàng | M | Hệ thống gợi ý cấp phối phù hợp; Kỹ thuật xác nhận hoặc thay thế |
| PR-M06-05 | Cấp phối riêng theo công trình | S | Trường hợp khách yêu cầu đặc biệt (bê tông khối lớn, chống thấm, tự lèn, đá mi…) |
| PR-M06-06 | Điều chỉnh cấp phối theo lô vật tư | C | Cập nhật khi đổi nguồn cát/đá/xi măng, có ghi nhận lý do |
| PR-M06-07 | So sánh giá thành cấp phối | C | Tính chi phí vật tư/m³ theo giá vật tư hiện hành, so sánh giữa các phương án |
| PR-M06-08 | Uỷ quyền phê duyệt cấp phối | M | Khi Kỹ thuật CN vắng, người được uỷ quyền (Kỹ thuật CN khác/Trưởng KT công ty) duyệt thay |

### M07 · Chất lượng & Thí nghiệm

| Mã | Tính năng | Ưu tiên | Mô tả sản phẩm |
|---|---|---|---|
| PR-M07-01 | Kế hoạch lấy mẫu theo tần suất | S | Cấu hình tần suất (theo m³/ca/công trình); hệ thống sinh yêu cầu lấy mẫu |
| PR-M07-02 | Ghi nhận độ sụt hiện trường | M | Nhập trên mobile tại công trình, gắn với chuyến giao, kèm ảnh |
| PR-M07-03 | Quản lý mẫu & kết quả R7/R28 | S | Mã mẫu, ngày đúc, ngày ép dự kiến, kích thước mẫu, kết quả từng viên, cường độ trung bình, kết luận Đạt/Không đạt |
| PR-M07-04 | Nhắc mẫu đến hạn ép | S | Cảnh báo trên dashboard và thông báo cho Kỹ thuật trước 1 ngày |
| PR-M07-05 | Cảnh báo mẫu không đạt | S | Escalate ngay tới Kỹ thuật + GĐ chi nhánh, khoanh vùng các chuyến cùng cấp phối/ca |
| PR-M07-06 | Chứng chỉ vật tư đầu vào theo lô | S | Đính kèm CO/CQ, kết quả kiểm nghiệm cát/đá/xi măng, ngày nhập, nhà cung cấp |
| PR-M07-07 | **Xuất hồ sơ chất lượng 1 nút** | M | Chọn công trình/hợp đồng/kỳ → xuất bộ hồ sơ (cấp phối, phiếu giao hàng, độ sụt, kết quả nén, chứng chỉ vật tư) dạng PDF gộp |
| PR-M07-08 | Hồ sơ khiếu nại chất lượng | S | Tiếp nhận → điều tra (truy xuất chuyến/mẻ/cấp phối/lô vật tư) → kết luận → hành động khắc phục → đóng |
| PR-M07-09 | Bảng theo dõi cường độ theo thời gian | C | Biểu đồ cường độ R28 theo cấp phối/trạm để kiểm soát ổn định chất lượng |

### M08 · Kế hoạch sản xuất ngày/ca

| Mã | Tính năng | Ưu tiên | Mô tả sản phẩm |
|---|---|---|---|
| PR-M08-01 | Màn hình kế hoạch ngày theo giờ | M | Trục thời gian 24h × trạm; hiển thị các đơn đã xác nhận theo khung giờ và khối lượng |
| PR-M08-02 | Kiểm tra năng lực & cảnh báo quá tải | M | So tổng m³/giờ với công suất trạm; tô đỏ khung giờ vượt; đề xuất giãn giờ |
| PR-M08-03 | Kế hoạch theo ca & giao ca | M | Ca sáng/chiều/đêm; bàn giao ca ghi nhận đơn còn dở |
| PR-M08-04 | Tính nhu cầu vật tư từ kế hoạch | M | Kế hoạch × định mức cấp phối = nhu cầu từng vật tư theo ngày/ca |
| PR-M08-05 | Chốt kế hoạch & phát hành cho Điều hành | M | Kế hoạch "Đã chốt" là đầu vào cho bảng điều phối |
| PR-M08-06 | Điều chỉnh kế hoạch trong ngày | M | Cho phép sửa và ghi nhận lý do; đồng bộ ngay sang Điều hành |
| PR-M08-07 | Kế hoạch nhu cầu xe & bơm | S | Tính số xe cần theo khối lượng, cự ly, chu kỳ xe; cảnh báo thiếu xe/bơm |
| PR-M08-08 | Kế hoạch tuần/tháng dự báo | S | Dựa trên hợp đồng và cơ hội để dự báo sản lượng và vật tư |

### M09 · Vật tư – Tồn silo – Đề nghị mua

| Mã | Tính năng | Ưu tiên | Mô tả sản phẩm |
|---|---|---|---|
| PR-M09-01 | Theo dõi tồn vật tư theo silo/bãi | S | Tồn đầu, nhập, xuất, tồn cuối theo ngày; theo từng silo xi măng/bồn phụ gia/bãi cát đá |
| PR-M09-02 | Ghi nhận nhập vật tư | S | Phiếu nhập, nhà cung cấp, lô, khối lượng, chứng chỉ kèm theo |
| PR-M09-03 | Xuất vật tư theo sản xuất | S | Tự động theo mẻ trộn từ tích hợp trạm trộn; hoặc theo định mức nếu chưa tích hợp |
| PR-M09-04 | Dự báo tồn & cảnh báo | S | Dự báo tồn theo kế hoạch; cảnh báo "xi măng đủ 1,5 ngày"; ngưỡng tồn an toàn theo vật tư |
| PR-M09-05 | Đề nghị mua vật tư | S | Sinh tự động từ cảnh báo thiếu; gửi phê duyệt; theo dõi tình trạng |
| PR-M09-06 | Đối chiếu định mức vs thực tế | S | Chênh lệch tiêu hao theo ca/tháng/vật tư; báo cáo top chênh lệch |
| PR-M09-07 | Giá vật tư & cập nhật giá thành | C | Nhập giá vật tư theo kỳ để tính giá thành/m³ |

### M10 · Bảng điều phối & Quản lý chuyến ⭐ *(màn hình trung tâm)*

| Mã | Tính năng | Ưu tiên | Mô tả sản phẩm |
|---|---|---|---|
| PR-M10-01 | **Dispatch board** | M | 3 khối trên 1 màn hình: (1) đơn hàng theo giờ, (2) danh sách xe & trạng thái, (3) chuyến đang thực hiện. Cập nhật realtime |
| PR-M10-02 | Tạo chuyến từ đơn hàng | M | Chia khối lượng đơn thành nhiều chuyến theo tải xe (6/8/10 m³); tự đề xuất số chuyến và giãn cách |
| PR-M10-03 | Phân xe – tài xế – bơm | M | Kéo-thả hoặc gán nhanh; cảnh báo trùng lịch, xe đang bảo dưỡng, tài xế quá giờ lái |
| PR-M10-04 | Trạng thái chuyến theo mốc thời gian | M | Tạo → Bắt đầu trộn → Xuất trạm → Đến công trình → Bắt đầu đổ → Xong đổ → Về trạm → Hoàn thành. Mỗi mốc có timestamp |
| PR-M10-05 | Cảnh báo trễ & xe chờ | M | Cảnh báo khi chuyến trễ so với kế hoạch, khi xe chờ tại công trình > ngưỡng, khi thời gian từ lúc trộn > 90 phút |
| PR-M10-06 | Chu kỳ xe (cycle time) | S | Tính và hiển thị chu kỳ trung bình theo xe/công trình/tuyến; dùng để đề xuất giãn chuyến |
| PR-M10-07 | Theo dõi vị trí xe trên bản đồ | S | Tích hợp GPS; hiển thị xe trên bản đồ cùng công trình đích |
| PR-M10-08 | Xử lý sự cố chuyến | M | Ghi nhận sự cố (xe hỏng, khách dừng đổ, bê tông trả về), phân loại nguyên nhân, xử lý khối lượng trả về |
| PR-M10-09 | Điều chuyển xe/bơm liên chi nhánh | C | Đề nghị → phê duyệt → ghi nhận thời gian và chi phí nội bộ |
| PR-M10-10 | Bảng giao ca điều hành | S | Tóm tắt ca: đơn hoàn thành, đơn dở, sự cố, ghi chú cho ca sau |

### M11 · Đội xe – Tài xế – Xe bơm

| Mã | Tính năng | Ưu tiên | Mô tả sản phẩm |
|---|---|---|---|
| PR-M11-01 | Hồ sơ xe mixer | M | Biển số, tải trọng bồn (m³), chi nhánh, tự có/thuê ngoài, trạng thái (Khả dụng/Đang chạy/Bảo dưỡng/Ngừng) |
| PR-M11-02 | Hồ sơ xe bơm | M | Loại (bơm cần/bơm tĩnh), tầm với, năng suất m³/h, trạng thái |
| PR-M11-03 | Hồ sơ tài xế & vận hành bơm | M | Thông tin, giấy phép & hạn, chi nhánh, xe mặc định, tài khoản mobile |
| PR-M11-04 | Lịch làm việc & ca của tài xế | S | Ca trực, ngày nghỉ; dùng để kiểm tra khi phân chuyến |
| PR-M11-05 | Sản lượng theo xe & tài xế | S | Số chuyến, m³, km, giờ hoạt động theo kỳ — dữ liệu để tính lương/thưởng |
| PR-M11-06 | Nhật ký nhiên liệu & km | C | Ghi nhận cấp dầu, chỉ số km, tiêu hao/100km |
| PR-M11-07 | Lịch bảo dưỡng cơ bản | C | Nhắc bảo dưỡng theo km/giờ; tự đặt trạng thái xe |

### M12 · Phiếu giao hàng điện tử (e-DO)

| Mã | Tính năng | Ưu tiên | Mô tả sản phẩm |
|---|---|---|---|
| PR-M12-01 | Sinh phiếu giao hàng theo chuyến | M | Mã phiếu duy nhất theo chi nhánh; chứa: khách, công trình, hạng mục, mác, độ sụt, cấp phối, khối lượng, biển số, tài xế, giờ trộn, giờ xuất trạm, giờ đến, giờ xong |
| PR-M12-02 | Ký nhận điện tử tại công trình | M | Người nhận ký trên điện thoại tài xế (hoặc OTP qua SMS/Zalo), kèm ảnh và toạ độ |
| PR-M12-03 | Khối lượng thực giao | M | Cho phép điều chỉnh khối lượng thực nhận (khách nhận thiếu/hơn), bắt buộc ghi lý do khi lệch |
| PR-M12-04 | In/gửi phiếu | M | In phiếu giấy khi cần, gửi bản PDF cho khách qua Zalo/email |
| PR-M12-05 | Hoạt động offline | M | Tài xế ghi nhận và lấy ký khi không có mạng; tự đồng bộ khi có mạng; chống trùng |
| PR-M12-06 | Đối soát phiếu chưa ký | M | Danh sách phiếu thiếu ký/thiếu thông tin để Điều hành xử lý trước khi chốt ngày |
| PR-M12-07 | Khoá phiếu sau khi chốt | M | Sau khi đưa vào nghiệm thu, phiếu không sửa được; muốn sửa phải tạo điều chỉnh có duyệt |

### M13 · Nghiệm thu – Hóa đơn – Công nợ

| Mã | Tính năng | Ưu tiên | Mô tả sản phẩm |
|---|---|---|---|
| PR-M13-01 | Tổng hợp khối lượng theo kỳ | S | Gom phiếu giao hàng đã ký theo khách/công trình/hợp đồng/kỳ |
| PR-M13-02 | Biên bản nghiệm thu khối lượng | S | Xuất mẫu biên bản, ký xác nhận, đính kèm bảng kê phiếu giao hàng |
| PR-M13-03 | Đề nghị xuất hóa đơn | S | Từ nghiệm thu → tạo đề nghị hóa đơn; đẩy sang HĐĐT/kế toán qua tích hợp |
| PR-M13-04 | Theo dõi công nợ | S | Theo khách/công trình/hợp đồng; tuổi nợ (0–30/31–60/61–90/>90) |
| PR-M13-05 | Ghi nhận thu tiền | S | Nhận từ kế toán qua tích hợp hoặc nhập tay; cập nhật hạn mức khả dụng |
| PR-M13-06 | Cảnh báo & chặn theo hạn mức | M | Cảnh báo khi dùng ≥ 80% hạn mức; chặn xác nhận đơn khi vượt 100% hoặc có nợ quá hạn (trừ khi được duyệt ngoại lệ) |
| PR-M13-07 | Kế hoạch thu & nhắc nợ | C | Lịch thu dự kiến, nhắc NVKD, mẫu thư nhắc nợ |
| PR-M13-08 | Đối chiếu công nợ với khách | C | Xuất bảng đối chiếu chi tiết theo phiếu giao hàng |

### M14 · Báo cáo & Dashboard

| Mã | Báo cáo | Ưu tiên | Người xem |
|---|---|---|---|
| PR-M14-01 | Dashboard điều hành ngày (sản lượng, chuyến, xe, đơn trễ) | M | Điều hành, GĐ CN |
| PR-M14-02 | Báo cáo sản lượng theo ngày/tháng, theo mác, theo công trình, theo NVKD | M | Kinh doanh, Ban LĐ |
| PR-M14-03 | Báo cáo doanh thu & giá bán bình quân/m³ | M | Ban LĐ |
| PR-M14-04 | Báo cáo hiệu quả NVKD (báo giá, tỷ lệ chốt, sản lượng, công nợ) | S | Trưởng phòng KD |
| PR-M14-05 | Báo cáo năng suất đội xe (chuyến/xe/ngày, chu kỳ xe, thời gian chờ) | S | Điều hành, Ban LĐ |
| PR-M14-06 | Báo cáo tiêu hao vật tư & chênh lệch định mức | S | Kế hoạch, Kỹ thuật |
| PR-M14-07 | Báo cáo chất lượng (độ sụt, R7/R28, tỷ lệ mẫu đạt) | S | Kỹ thuật, Ban LĐ |
| PR-M14-08 | Báo cáo công nợ & tuổi nợ | S | Kinh doanh, Kế toán, Ban LĐ |
| PR-M14-09 | **Dashboard hợp nhất 3 chi nhánh & so sánh chi nhánh** | M | TGĐ |
| PR-M14-10 | Báo cáo giá thành sơ bộ & biên lợi nhuận/m³ | C | Ban LĐ |
| PR-M14-11 | Tự xuất Excel/PDF mọi báo cáo, lịch gửi email tự động | S | Toàn bộ |

### M15 · Mobile App

| Mã | Tính năng | Ưu tiên | Đối tượng |
|---|---|---|---|
| PR-M15-01 | App Tài xế: danh sách chuyến, bấm mốc thời gian, ký nhận, độ sụt, offline | M | Tài xế |
| PR-M15-02 | App Tài xế: điều hướng tới công trình | S | Tài xế |
| PR-M15-03 | App NVKD: tra cứu khách, công nợ, tình trạng đơn/chuyến | M | Kinh doanh |
| PR-M15-04 | App NVKD: báo giá nhanh + gửi PDF | M | Kinh doanh |
| PR-M15-05 | App NVKD: tạo yêu cầu cấp bê tông, check-in công trình | M | Kinh doanh |
| PR-M15-06 | App QC: ghi độ sụt, tạo mẫu, chụp ảnh hiện trường | S | Kỹ thuật |
| PR-M15-07 | App Lãnh đạo: phê duyệt giá/hạn mức, xem dashboard | M | Ban LĐ |
| PR-M15-08 | Thông báo đẩy theo vai trò | M | Toàn bộ |

### M16 · Tích hợp

| Mã | Tích hợp | Ưu tiên | Nội dung |
|---|---|---|---|
| PR-M16-01 | Hệ điều khiển trạm trộn | S | Đọc dữ liệu mẻ trộn: mã mẻ, cấp phối, khối lượng thực, vật tư thực dùng, thời điểm; đối chiếu với chuyến |
| PR-M16-02 | GPS đội xe | S | Vị trí, hành trình, tốc độ; tự nhận diện đến/rời công trình (geofence) |
| PR-M16-03 | Hóa đơn điện tử (NĐ123/TT78) | S | Đẩy đề nghị hóa đơn, nhận số/mã hóa đơn và trạng thái |
| PR-M16-04 | Phần mềm kế toán | S | Đồng bộ khách hàng, hóa đơn, thu tiền |
| PR-M16-05 | Zalo OA / SMS | S | Thông báo khách hàng, OTP ký nhận |
| PR-M16-06 | Bản đồ & định tuyến | S | Toạ độ công trình, cự ly, thời gian di chuyển dự kiến |
| PR-M16-07 | API mở & webhook | C | Cho phép tích hợp thêm về sau (BI ngoài, app khách hàng) |
| PR-M16-08 | Cân điện tử / cân xe | C | Ghi nhận khối lượng vật tư nhập |

---

## 5. YÊU CẦU PHI CHỨC NĂNG (tóm tắt cấp sản phẩm)

| Nhóm | Yêu cầu sản phẩm |
|---|---|
| Hiệu năng | Bảng điều phối cập nhật ≤ 3 giây; mở màn hình danh sách ≤ 2 giây với 100.000 chuyến/năm |
| Khả dụng | 24/7, uptime ≥ 99,5%; bảo trì trong khung 02:00–04:00 và phải báo trước |
| Offline | App tài xế hoạt động đầy đủ offline cho nghiệp vụ chuyến & ký nhận |
| Bảo mật | Phân quyền theo vai trò + chi nhánh; giá và công nợ chỉ hiện theo quyền; audit log bất biến |
| Khả dụng UX | Tài xế ≤ 5 chạm/chuyến; Điều hành hoàn tất phân xe ≤ 3 chạm; NVKD báo giá ≤ 5 phút |
| Mở rộng | Thêm chi nhánh/trạm mới chỉ bằng cấu hình, không sửa code |
| Tiếng Việt | Toàn bộ giao diện, thông báo, báo cáo, mẫu in bằng tiếng Việt |
| Thiết bị | Web: Chrome/Edge trên desktop 1366×768+; Mobile: Android 10+, iOS 14+ |

*(Chi tiết định lượng xem SRS §6.)*

---

## 6. KẾ HOẠCH PHÁT HÀNH (RELEASE PLAN)

### R1 — MVP "Xương sống vận hành" (GĐ1, 10–12 tuần)
**Mục tiêu:** mỗi m³ bê tông đi qua hệ thống từ đơn hàng đến phiếu giao hàng có ký nhận.

Gồm: M01 (toàn bộ Must), M02 (01–03, 07–08 cơ bản), M03 (01–06, 08), M04 (01–04, 06), M05 (01–05, 08), M06 (01–04, 08), M07 (02, 07), M08 (01–06), M10 (01–05, 08), M11 (01–03), M12 (toàn bộ), M13 (06), M14 (01–03, 09), M15 (01, 03–05, 07–08).

**Điều kiện phát hành R1:** dữ liệu gốc đã import; pilot 1 chi nhánh 4 tuần chạy song song sổ giấy; đạt SC-02, SC-04.

### R2 — "Chất lượng & Dòng tiền" (GĐ2, 8–10 tuần)
Gồm: M07 (01, 03–06, 08), M09 (01–06), M13 (01–05), M02 (04–06), M04 (05, 07), M08 (07–08), M10 (06–07, 10), M11 (04–05), M14 (04–08, 11), M15 (02, 06), M16 (01–06).

### R3 — "Tối ưu & Mở rộng" (GĐ3, 8 tuần)
Gồm: M03 (07, 09), M06 (05–07), M07 (09), M09 (07), M10 (09), M11 (06–07), M13 (07–08), M14 (10), M16 (07–08).

### Nhân rộng
CN pilot (R1) → CN2 (+3 tuần) → CN3 (+3 tuần). Mỗi CN: chuẩn hóa dữ liệu 1 tuần, tập huấn 3 ngày, chạy song song 2 tuần.

---

## 7. CHỈ SỐ ĐO SẢN PHẨM (PRODUCT METRICS)

| Mã | Chỉ số | Mục tiêu |
|---|---|---|
| PM-01 | % chuyến có phiếu giao hàng điện tử ký nhận | ≥ 90% sau 2 tháng |
| PM-02 | Tỷ lệ tài xế hoạt động hàng ngày trên app (DAU/tổng tài xế) | ≥ 85% |
| PM-03 | Thời gian trung bình lập một báo giá | ≤ 5 phút |
| PM-04 | Thời gian trung bình phân xe cho một chuyến | ≤ 20 giây |
| PM-05 | % đơn hàng bị sửa/hủy sau khi đã xác nhận | ≤ 8% |
| PM-06 | % hồ sơ chất lượng xuất được trong ≤ 1 phút | ≥ 98% |
| PM-07 | Số lần người dùng vẫn phải dùng Excel ngoài hệ thống (khảo sát) | Về 0 với Kế hoạch & Điều hành |
| PM-08 | Độ lệch giữa khối lượng phiếu giao hàng và khối lượng nghiệm thu | ≤ 0,5% |

---

## 8. NGOÀI PHẠM VI SẢN PHẨM (WON'T HAVE — cần CR nếu muốn)

| Mã | Nội dung | Lý do |
|---|---|---|
| WH-01 | Kế toán tổng hợp, sổ sách, thuế, báo cáo tài chính | Đã có phần mềm chuyên dụng; chỉ tích hợp |
| WH-02 | Tính lương, chấm công, HRM | Ngoài lõi vận hành; cung cấp dữ liệu chuyến |
| WH-03 | Mua sắm – đấu thầu vật tư | Chỉ tạo đề nghị mua hàng |
| WH-04 | Thay thế hệ điều khiển trạm trộn | Rủi ro kỹ thuật & an toàn cao |
| WH-05 | App/portal cho khách hàng tự đặt hàng | Đánh giá lại sau R3 (OQ-08) |
| WH-06 | Quản lý sản phẩm bê tông đúc sẵn (cống, cọc, gạch block) | Khác mô hình nghiệp vụ; mở rộng riêng |
| WH-07 | Tối ưu định tuyến bằng AI | Sau khi có ≥ 6 tháng dữ liệu chu kỳ xe |

---

## 9. PHỤ THUỘC & VẤN ĐỀ MỞ

| Mã | Nội dung | Người xử lý |
|---|---|---|
| DP-01 | Khách hàng chốt quy trình chuẩn chung cho 3 chi nhánh trước khi lập trình | Ban LĐ khách hàng |
| DP-02 | Xác nhận khả năng tích hợp hệ điều khiển trạm trộn (OQ-05) | IT khách hàng + NCC trạm |
| DP-03 | Cung cấp API GPS (OQ-06) | NCC GPS |
| DP-04 | Cung cấp mẫu báo giá, hợp đồng, phiếu giao hàng, biên bản nghiệm thu đang dùng | Kinh doanh + Kỹ thuật |
| DP-05 | Chốt bảng giá, giá sàn, quy tắc phụ phí (OQ-03, OQ-04) | Ban LĐ |
| DP-06 | Chốt bộ hồ sơ chất lượng khách hàng yêu cầu | Kỹ thuật |
| DP-07 | Trang bị điện thoại/đăng ký tài khoản cho tài xế | HR/Hành chính |
| DP-08 | Quyết định cloud vs on-premise (OQ-10) | IT khách hàng |

---

## 10. LỊCH SỬ PHIÊN BẢN

| Phiên bản | Ngày | Nội dung | Người lập |
|---|---|---|---|
| 1.0 | 08/09/2026 | Bản đầu tiên từ BRD v1.0 | BA |
