# RITECCONS ADMIN

Backend là 1 Google Apps Script (`Code.gs`) chạy trên Google Sheet làm database. Frontend (`index.html`)
tự nhận diện môi trường: khi mở qua URL Web App của Apps Script sẽ dùng `google.script.run` thật; khi
chạy qua Node (`server.js`) sẽ tự dùng `fetch` để gọi cùng các API đó qua `/api/apps-script`.

## Cách 1 — Chạy thật trên web qua Google Apps Script (khuyến nghị, không cần hosting riêng)

1. Vào [script.google.com](https://script.google.com) → tạo project mới (hoặc mở project đang gắn với
   Google Sheet dữ liệu).
2. Tạo/ghi đè file script `Code.gs` bằng nội dung file `Code.gs` trong repo này.
3. Tạo 1 file HTML tên **`index`** (Apps Script tự thêm đuôi `.html`) và dán nội dung file `index.html`
   trong repo vào đó.
4. Sửa hằng số `SS_ID` đầu file `Code.gs` thành ID của Google Sheet dữ liệu bạn dùng.
5. Deploy → New deployment → chọn loại **Web app**:
   - Execute as: **Me**
   - Who has access: **Anyone**
6. Bấm Deploy, lấy URL dạng `https://script.google.com/macros/s/AKfycb.../exec` — đây chính là địa chỉ
   web công khai để dùng ngay, không cần server Node hay hosting nào khác.
7. Mỗi lần sửa code, chọn **Deploy → Manage deployments → Edit → New version** để URL cũ tự cập nhật code mới.

## Cách 2 — Chạy local bằng Node (chỉ dùng để phát triển/kiểm thử)

Yêu cầu Node.js 18+.

```powershell
npm install
npm start
```

Mở: http://localhost:3000

`server.js` chỉ phục vụ `index.html` tĩnh và proxy các lời gọi API sang URL Web App Apps Script đã deploy
ở Cách 1 (biến `APPS_SCRIPT_URL`, đặt qua biến môi trường hoặc mặc định trong code).

## Khởi tạo tài khoản Admin đầu tiên

Chạy trực tiếp trong Apps Script Editor (menu Run), **chỉ dùng khi hệ thống chưa có Admin nào**:

```javascript
taoTaiKhoanAdmin("ADMIN", "Quản trị viên", "matkhau123");
```

Sau khi đã có ít nhất 1 Admin, muốn tạo thêm tài khoản Admin phải xác thực bằng 1 Admin đang hoạt động:

```javascript
taoTaiKhoanAdmin("ADMIN2", "Admin phụ", "matkhau456", "ADMIN", "matkhau123");
```

## Phân quyền xem dữ liệu bảng

Trong màn hình **Quản trị hệ thống**, Admin chọn 1 tài khoản (bất kỳ vai trò nào, kể cả chính Admin) và
tick những sheet Google Sheet mà tài khoản đó được phép xem — lưu ở sheet `PHAN_QUYEN`. Tài khoản được
cấp quyền sẽ thấy khối **"DỮ LIỆU BẢNG ĐƯỢC CẤP QUYỀN XEM"** ngay trong trang của vai trò mình, bấm vào
tên sheet để xem toàn bộ dữ liệu thô (mọi dòng/cột) — chỉ xem, không sửa/xóa/thêm được gì.

## Bảo mật mật khẩu

Mật khẩu trong `TAI_KHOAN` và `TAI_XE` được băm SHA-256 kèm salt riêng mỗi tài khoản (định dạng lưu
`salt$hash`). Dữ liệu cũ nhập tay dạng chữ thường vẫn đăng nhập được bình thường và sẽ tự động được băm
lại ngay sau lần đăng nhập thành công đầu tiên — không cần thao tác thủ công gì thêm.
