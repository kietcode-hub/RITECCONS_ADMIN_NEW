// ============================================================
// RITECCONS - HỆ THỐNG GIAO BÊ TÔNG
// CODE.GS
// NHAT_KY: MỖI PHIẾU CHỈ 1 DÒNG, CẬP NHẬT TRÊN CÙNG DÒNG
// ============================================================

const SS_ID = "107V8j5BKGt2c5Rjom8SUkfR0w1FsKHoPy9zlK0yv0AE";

const SHEET_TAI_KHOAN = "TAI_KHOAN";
const SHEET_TAI_XE = "TAI_XE";
const SHEET_KHACH_HANG = "KHACH_HANG";
const SHEET_PHIEU = "PHIEU";
const SHEET_NHAT_KY = "NHAT_KY";
const SHEET_DU_AN = "DU_AN";
const SHEET_CAP_PHOI = "CAP_PHOI";
const SHEET_QUAN_LY_LAI_XE = "QUAN_LY_LAI_XE";
const SHEET_SO_CHUYEN = "SO_CHUYEN";
const SHEET_BANG_CHAM_CONG = "BANG_CHAM_CONG";
const SHEET_PHAN_QUYEN = "PHAN_QUYEN";
const SHEET_THONG_KE_PHIEU_TN = "THONG_KE_PHIEU_TN";


// ============================================================
// SO_CHUYEN - TỔNG HỢP SỐ CHUYẾN THEO TÀI XẾ
// Cột: TÊN TÀI XẾ | SỐ CHUYẾN | HOÀN THÀNH | THẤT BẠI
// ============================================================
function ensureSoChuyenSheet_() {
  const ss = getSpreadsheet();
  let sh = ss.getSheetByName(SHEET_SO_CHUYEN);
  if (!sh) {
    sh = ss.insertSheet(SHEET_SO_CHUYEN);
    sh.getRange(1,1,1,4).setValues([["TÊN TÀI XẾ","SỐ CHUYẾN","HOÀN THÀNH","THẤT BẠI"]]);
    sh.getRange(1,1,1,4).setFontWeight("bold");
    sh.setFrozenRows(1);
  }
  return sh;
}
function getTenTaiXe_(maTaiXe) {
  const sh = getSheet_(SHEET_TAI_XE);
  if (!sh || sh.getLastRow() < 2) return text_(maTaiXe);
  const data = sh.getDataRange().getValues();
  for (let i=1;i<data.length;i++) {
    if (text_(data[i][0]) === text_(maTaiXe)) return text_(data[i][1]) || text_(maTaiXe);
  }
  return text_(maTaiXe);
}
function capNhatSoChuyen_(maTaiXe, trangThaiCuoi) {
  const sh = ensureSoChuyenSheet_();
  const ten = getTenTaiXe_(maTaiXe);
  let row = 0;
  if (sh.getLastRow() >= 2) {
    const names = sh.getRange(2,1,sh.getLastRow()-1,1).getValues();
    for (let i=0;i<names.length;i++) if (text_(names[i][0]) === ten) { row=i+2; break; }
  }
  if (!row) { row=sh.getLastRow()+1; sh.getRange(row,1,1,4).setValues([[ten,0,0,0]]); }
  const vals=sh.getRange(row,2,1,3).getValues()[0].map(num_);
  vals[0]++;
  if (trangThaiCuoi === "Thành công") vals[1]++;
  if (trangThaiCuoi === "Thất bại") vals[2]++;
  sh.getRange(row,2,1,3).setValues([vals]);
  return {tenTaiXe:ten,soChuyen:vals[0],hoanThanh:vals[1],thatBai:vals[2]};
}
function dongBoBangChamCong_() {
  const sh = ensureBangChamCongSheet_();
  if (sh.getLastRow() > 1) return;

  const tx = getSheet_(SHEET_TAI_XE);
  const nk = getSheet_(SHEET_NHAT_KY);
  const drivers = {};
  const maToTen = {};

  if (tx && tx.getLastRow() >= 2) {
    const data = tx.getRange(2,1,tx.getLastRow()-1,5).getValues();
    data.forEach(function(r){
      const ma=text_(r[0]), ten=text_(r[1]), st=text_(r[4]);
      if (!ma || !ten || st !== "Đang hoạt động") return;
      maToTen[ma]=ten;
      const k=key_(ten);
      if (!drivers[k]) drivers[k]={ma:ma,ten:ten,total:0,vgok:0,vgfail:0,ylok:0,ylfail:0};
    });
  }

  if (nk && nk.getLastRow() >= 2) {
    const data=nk.getRange(2,1,nk.getLastRow()-1,Math.max(17,nk.getLastColumn())).getValues();
    data.forEach(function(r){
      const ma=text_(r[1]);
      const ten=maToTen[ma] || getTenTaiXe_(ma);
      if (!ten) return;
      const k=key_(ten);
      if (!drivers[k]) drivers[k]={ma:ma,ten:ten,total:0,vgok:0,vgfail:0,ylok:0,ylfail:0};
      const st=text_(r[12]);
      if (st !== "Thành công" && st !== "Đã hoàn thành" && st !== "Thất bại") return;
      const khu=text_(r[15]) || text_(r[16]);
      drivers[k].total++;
      if (khu === "Vận hành Văn Giang" || khu === "Văn Giang") {
        if (st === "Thành công" || st === "Đã hoàn thành") drivers[k].vgok++;
        if (st === "Thất bại") drivers[k].vgfail++;
      } else if (khu === "Vận hành Yên Lệnh" || khu === "Yên Lệnh") {
        if (st === "Thành công" || st === "Đã hoàn thành") drivers[k].ylok++;
        if (st === "Thất bại") drivers[k].ylfail++;
      }
    });
  }

  const rows=Object.keys(drivers).map(function(k){
    const d=drivers[k];
    return [d.ma,d.ten,d.total,d.vgok,d.vgfail,d.ylok,d.ylfail];
  });
  if (rows.length) sh.getRange(2,1,rows.length,7).setValues(rows);
}

function ensureBangChamCongSheet_() {
  const ss = getSpreadsheet();
  let sh = ss.getSheetByName(SHEET_BANG_CHAM_CONG);
  if (!sh) {
    sh = ss.insertSheet(SHEET_BANG_CHAM_CONG);
    sh.getRange(1,1,1,7).setValues([[
      "MÃ TX",
      "TÊN TX",
      "TỔNG SỐ CHUYẾN",
      "HOÀN THÀNH VĂN GIANG",
      "THẤT BẠI VĂN GIANG",
      "HOÀN THÀNH YÊN LỆNH",
      "THẤT BẠI YÊN LỆNH"
    ]]);
    sh.getRange(1,1,1,7).setFontWeight("bold");
    sh.setFrozenRows(1);
    sh.setColumnWidths(1,7,150);
  }
  return sh;
}

function capNhatBangChamCong_(maTaiXe, trangThaiCuoi, loaiVanHanh) {
  const sh = ensureBangChamCongSheet_();
  const ten = getTenTaiXe_(maTaiXe);
  const khuVuc = key_(loaiVanHanh);
  let row = 0;
  const last = sh.getLastRow();
  if (last >= 2) {
    const data = sh.getRange(2,1,last-1,2).getValues();
    for (let i=0;i<data.length;i++) {
      if (key_(data[i][1]) === key_(ten) || text_(data[i][0]) === text_(maTaiXe)) {
        row=i+2; break;
      }
    }
  }
  if (!row) {
    row=sh.getLastRow()+1;
    sh.getRange(row,1,1,7).setValues([[text_(maTaiXe),ten,0,0,0,0,0]]);
  }
  const v=sh.getRange(row,3,1,5).getValues()[0].map(num_);
  v[0]++;
  if (
    khuVuc.indexOf("vận hành văn giang") >= 0 ||
    khuVuc === "văn giang"
  ) {
    if (trangThaiCuoi === "Thành công" || trangThaiCuoi === "Đã hoàn thành") {
      v[1]++;
    } else if (trangThaiCuoi === "Thất bại") {
      v[2]++;
    }
  } else if (
    khuVuc.indexOf("vận hành yên lệnh") >= 0 ||
    khuVuc === "yên lệnh"
  ) {
    if (trangThaiCuoi === "Thành công" || trangThaiCuoi === "Đã hoàn thành") {
      v[3]++;
    } else if (trangThaiCuoi === "Thất bại") {
      v[4]++;
    }
  }
  sh.getRange(row,3,1,5).setValues([v]);
}

function layThongKeTaiXe(maTaiXe) {
  const sh=ensureSoChuyenSheet_();
  const ten=getTenTaiXe_(maTaiXe);
  if (sh.getLastRow()<2) return {tongChuyen:0,tongHoanThanh:0,tongThatBai:0,tongDong:0};
  const data=sh.getRange(2,1,sh.getLastRow()-1,4).getValues();
  for (let i=0;i<data.length;i++) {
    if (text_(data[i][0])===ten) {
      const sc=num_(data[i][1]),ht=num_(data[i][2]),tb=num_(data[i][3]);
      return {tongChuyen:sc,tongHoanThanh:ht,tongThatBai:tb,tongDong:ht+tb};
    }
  }
  return {tongChuyen:0,tongHoanThanh:0,tongThatBai:0,tongDong:0};
}


// ============================================================
// PHÂN QUYỀN XEM DỮ LIỆU BẢNG (THEO TÊN SHEET)
//
// Admin chọn 1 tài khoản (bất kỳ vai trò nào, kể cả chính Admin) và tick
// những sheet Google Sheet mà tài khoản đó được phép XEM TOÀN BỘ dữ liệu
// thô (chỉ xem, không sửa/xóa/thêm). Lưu ở sheet PHAN_QUYEN, mỗi tài khoản
// 1 dòng, cột "SHEET ĐƯỢC XEM" là danh sách tên sheet nối bằng dấu phẩy.
// ============================================================

function ensurePhanQuyenSheet_() {
  const ss = getSpreadsheet();
  let sh = ss.getSheetByName(SHEET_PHAN_QUYEN);
  const headers = ["MÃ TÀI KHOẢN","TÊN","VAI TRÒ","SHEET ĐƯỢC XEM"];
  if (!sh) {
    sh = ss.insertSheet(SHEET_PHAN_QUYEN);
    sh.getRange(1,1,1,headers.length).setValues([headers]);
    sh.getRange(1,1,1,headers.length).setFontWeight("bold");
    sh.setFrozenRows(1);
  }
  return sh;
}

// Danh sách tên tất cả các sheet đang có trong Google Sheet (để Admin tick chọn).
function layDanhSachTenSheetHeThong() {
  return getSpreadsheet().getSheets().map(function (s) { return s.getName(); });
}

function layDanhSachSheetDuocXem_(maNguoiDung) {
  maNguoiDung = text_(maNguoiDung);
  if (!maNguoiDung) return [];
  const sh = ensurePhanQuyenSheet_();
  if (sh.getLastRow() < 2) return [];
  const data = sh.getRange(2,1,sh.getLastRow()-1,4).getValues();
  for (let i=0;i<data.length;i++) {
    if (text_(data[i][0]) === maNguoiDung) {
      return text_(data[i][3]).split(",").map(text_).filter(Boolean);
    }
  }
  return [];
}

// Hàm public để tài khoản tự tải lại danh sách sheet mình được cấp quyền xem.
function layDanhSachSheetDuocCap(maNguoiDung) {
  return layDanhSachSheetDuocXem_(maNguoiDung);
}

function coQuyenXemSheet_(maNguoiDung, tenSheet) {
  const list = layDanhSachSheetDuocXem_(maNguoiDung);
  return list.indexOf(text_(tenSheet)) >= 0;
}

// Trả về toàn bộ dữ liệu thô (chỉ đọc) của 1 sheet, nếu tài khoản được cấp quyền xem sheet đó.
function layDuLieuBang(maNguoiDung, tenSheet) {
  maNguoiDung = text_(maNguoiDung);
  tenSheet = text_(tenSheet);
  if (!maNguoiDung || !tenSheet) return {success:false,message:"Thiếu tham số."};
  if (!coQuyenXemSheet_(maNguoiDung, tenSheet)) {
    return {success:false,message:"Bạn không có quyền xem sheet này."};
  }
  const sh = getSheet_(tenSheet);
  if (!sh) return {success:false,message:"Không tìm thấy sheet: " + tenSheet};

  const lastRow = sh.getLastRow();
  const lastCol = sh.getLastColumn();
  if (lastRow < 1 || lastCol < 1) return {success:true,tenSheet:tenSheet,headers:[],rows:[]};

  const values = sh.getRange(1,1,lastRow,lastCol).getValues();
  const headers = values[0].map(text_);
  const rows = values.slice(1).map(function (r) {
    return r.map(function (v) {
      if (v instanceof Date) return fmtDate_(v);
      if (typeof v === "boolean") return v ? "TRUE" : "FALSE";
      return v;
    });
  });

  return {success:true,tenSheet:tenSheet,headers:headers,rows:rows};
}

function laAdmin_(maNguoiDung) {
  const tk = getSheet_(SHEET_TAI_KHOAN);
  if (!tk || tk.getLastRow() < 2) return false;
  const data = tk.getDataRange().getValues();
  for (let i=1;i<data.length;i++) {
    if (text_(data[i][0]) === text_(maNguoiDung) &&
        key_(data[i][3]) === "admin" && text_(data[i][4]) === "Đang hoạt động") return true;
  }
  return false;
}

function layDanhSachTaiKhoanAdmin(adminMa) {
  if (!laAdmin_(adminMa)) return {success:false,message:"Bạn không có quyền ADMIN.",rows:[]};
  const tk = getSheet_(SHEET_TAI_KHOAN);
  const rows = [];
  if (!tk || tk.getLastRow() < 2) return {success:true,rows:[],danhSachSheet:layDanhSachTenSheetHeThong()};
  const accounts = tk.getDataRange().getValues();
  for (let i=1;i<accounts.length;i++) {
    const ma=text_(accounts[i][0]), ten=text_(accounts[i][1]), vaiTro=text_(accounts[i][3]), st=text_(accounts[i][4]);
    if (!ma || st !== "Đang hoạt động") continue;
    rows.push({ma:ma,ten:ten,vaiTro:vaiTro,sheets:layDanhSachSheetDuocXem_(ma)});
  }
  return {success:true,rows:rows,danhSachSheet:layDanhSachTenSheetHeThong()};
}

function luuQuyenAdmin(adminMa, payload) {
  if (!laAdmin_(adminMa)) return {success:false,message:"Bạn không có quyền ADMIN."};
  payload = payload || {};
  const ma = text_(payload.ma);
  if (!ma) return {success:false,message:"Thiếu mã tài khoản."};
  const tk = getSheet_(SHEET_TAI_KHOAN);
  if (!tk) return {success:false,message:"Không tìm thấy sheet TAI_KHOAN."};
  let ten="", vaiTro="";
  const accounts=tk.getDataRange().getValues();
  for (let i=1;i<accounts.length;i++) if (text_(accounts[i][0])===ma) { ten=text_(accounts[i][1]); vaiTro=text_(accounts[i][3]); break; }
  if (!ten) return {success:false,message:"Không tìm thấy tài khoản."};

  const danhSachTenSheetHopLe = layDanhSachTenSheetHeThong();
  const danhSachSheet = (Array.isArray(payload.sheets) ? payload.sheets : [])
    .map(text_)
    .filter(function (s) { return danhSachTenSheetHopLe.indexOf(s) >= 0; });

  const sh=ensurePhanQuyenSheet_();
  const vals=[[ma,ten,vaiTro,danhSachSheet.join(",")]];
  const data=sh.getLastRow()>=2?sh.getRange(2,1,sh.getLastRow()-1,1).getValues():[];
  let row=0;
  for(let i=0;i<data.length;i++) if(text_(data[i][0])===ma){row=i+2;break;}
  if(!row) { sh.getRange(sh.getLastRow()+1,1,1,4).setValues(vals); }
  else { sh.getRange(row,1,1,4).setValues(vals); }
  return {success:true,message:"Đã lưu quyền xem dữ liệu bảng cho tài khoản "+ma+"."};
}

// ma/hoTen/matKhau: tài khoản Admin mới cần tạo.
// adminMa/adminMatKhau: tài khoản Admin đang hoạt động dùng để xác thực quyền tạo thêm.
// Nếu hệ thống CHƯA có Admin nào (lần khởi tạo đầu tiên) thì không cần adminMa/adminMatKhau.
function taoTaiKhoanAdmin(ma, hoTen, matKhau, adminMa, adminMatKhau) {
  ma=text_(ma)||"ADMIN"; hoTen=text_(hoTen)||"Quản trị viên"; matKhau=text_(matKhau);
  if(!matKhau) return {success:false,message:"Phải nhập mật khẩu ADMIN."};
  const sh=getSheet_(SHEET_TAI_KHOAN);
  if(!sh) return {success:false,message:"Không tìm thấy sheet TAI_KHOAN."};
  const data=sh.getDataRange().getValues();

  const daCoAdmin = data.slice(1).some(function(r){
    return key_(r[3]) === "admin" && text_(r[4]) === "Đang hoạt động";
  });

  if (daCoAdmin) {
    adminMa = text_(adminMa);
    adminMatKhau = text_(adminMatKhau);
    if (!adminMa || !adminMatKhau) {
      return {success:false,message:"Hệ thống đã có Admin. Cần cung cấp tài khoản/mật khẩu Admin để xác thực trước khi tạo thêm."};
    }
    const xacThuc = data.slice(1).some(function(r){
      return text_(r[0]) === adminMa &&
        key_(r[3]) === "admin" &&
        text_(r[4]) === "Đang hoạt động" &&
        xacThucMatKhau_(adminMatKhau, r[2]);
    });
    if (!xacThuc) return {success:false,message:"Sai tài khoản hoặc mật khẩu Admin xác thực."};
  }

  for(let i=1;i<data.length;i++) if(text_(data[i][0])===ma) return {success:false,message:"Mã tài khoản đã tồn tại."};
  sh.appendRow([ma,hoTen,hashMatKhau_(matKhau),"Admin","Đang hoạt động"]);
  ensurePhanQuyenSheet_();
  return {success:true,message:"Đã tạo tài khoản ADMIN: "+ma};
}

// ============================================================
// WEB APP
// ============================================================

function doGet() {

  ensureBangChamCongSheet_();
  dongBoBangChamCong_();

  return HtmlService
    .createHtmlOutputFromFile("index")
    .setTitle(
      "RITECCONS - Hệ thống giao bê tông"
    )
    .setXFrameOptionsMode(
      HtmlService.XFrameOptionsMode.ALLOWALL
    );

}


// ============================================================
// COMMON
// ============================================================

function getSpreadsheet() {

  return SpreadsheetApp.openById(
    SS_ID
  );

}


function getSheet_(name) {

  return getSpreadsheet()
    .getSheetByName(name);

}


function text_(v) {

  // .normalize("NFC") để tránh trường hợp gõ tiếng Việt trên Google Sheet
  // (đặc biệt là ký tự đã có dấu dán vào từ Word) tạo ra chuỗi Unicode
  // dựng sẵn khác dạng (NFD) trông giống hệt nhưng so sánh "===" bị sai,
  // gây lỗi kiểu "Vai trò không hợp lệ" dù gõ đúng chữ.
  return String(
    v == null ? "" : v
  ).trim().normalize("NFC");

}


function key_(v) {

  return text_(v)
    .replace(/\s+/g, " ")
    .toLowerCase();

}


function num_(v) {

  const n =
    Number(v);

  return Number.isFinite(n)
    ? n
    : 0;

}


function fmtDate_(v) {

  if (
    v instanceof Date
  ) {

    return Utilities.formatDate(
      v,
      Session.getScriptTimeZone(),
      "dd/MM/yyyy HH:mm"
    );

  }

  return text_(v);

}


function normalizeMau_(v) {

  const s =
    text_(v).toLowerCase();

  if (
    s === "1" ||
    s === "1.0" ||
    s === "mẫu 1"
  ) {

    return "1";

  }

  if (
    s === "2" ||
    s === "2.0" ||
    s === "mẫu 2"
  ) {

    return "2";

  }

  return "";

}


// ============================================================
// TẠO SHEET DU_AN
// ============================================================

function ensureDuAnSheet_() {

  const ss =
    getSpreadsheet();

  let sh =
    ss.getSheetByName(
      SHEET_DU_AN
    );


  if (!sh) {

    sh =
      ss.insertSheet(
        SHEET_DU_AN
      );


    sh
      .getRange(
        1,
        1,
        1,
        4
      )
      .setValues([[
        "MÃ DỰ ÁN",
        "TÊN DỰ ÁN",
        "ĐỊA CHỈ",
        "TRẠNG THÁI"
      ]]);

  }


  return sh;

}


// ============================================================
// TẠO SHEET CAP_PHOI
// ============================================================

function ensureCapPhoiSheet_() {

  const ss =
    getSpreadsheet();

  let sh =
    ss.getSheetByName(
      SHEET_CAP_PHOI
    );


  if (!sh) {

    sh =
      ss.insertSheet(
        SHEET_CAP_PHOI
      );


    sh
      .getRange(
        1,
        1,
        1,
        13
      )
      .setValues([[
        "ĐƠN VỊ MUA HÀNG",
        "DỰ ÁN",
        "MÁC BÊ TÔNG (KG/CM3)",
        "ĐỘ SỤT (CM)",
        "CÁT 1",
        "ĐÁ 1",
        "ĐÁ 2",
        "CÁT 2",
        "XI MĂNG 1",
        "XI MĂNG 2",
        "NƯỚC",
        "PG1",
        "PG2"
      ]]);

  }


  return sh;

}


// ============================================================
// TẠO SHEET QUAN_LY_LAI_XE
// ============================================================

function ensureQuanLyLaiXeSheet_() {

  const ss =
    getSpreadsheet();

  let sh =
    ss.getSheetByName(
      SHEET_QUAN_LY_LAI_XE
    );

  if (!sh) {

    sh =
      ss.insertSheet(
        SHEET_QUAN_LY_LAI_XE
      );

    sh
      .getRange(
        1,
        1,
        1,
        4
      )
      .setValues([[
        "THỜI GIAN",
        "TRẠNG THÁI",
        "SỐ PHIẾU",
        "ĐỊA ĐIỂM"
      ]]);

    sh
      .getRange(
        1,
        1,
        1,
        4
      )
      .setFontWeight("bold");

    sh.setFrozenRows(1);

    sh.setColumnWidth(1, 165);
    sh.setColumnWidth(2, 190);
    sh.setColumnWidth(3, 120);
    sh.setColumnWidth(4, 320);

  }

  return sh;

}


// ============================================================
// GHI GPS TÀI XẾ
// ============================================================

function ghiViTriTaiXe_(
  thoiGian,
  trangThai,
  soPhieu,
  latitude,
  longitude
) {

  const sh =
    ensureQuanLyLaiXeSheet_();

  const lat =
    Number(latitude);

  const lng =
    Number(longitude);

  if (
    !Number.isFinite(lat) ||
    !Number.isFinite(lng)
  ) {

    throw new Error(
      "Không nhận được vị trí GPS hợp lệ."
    );

  }

  const toaDo =
    lat.toFixed(6) +
    ", " +
    lng.toFixed(6);

  const googleMapsUrl =
    "https://www.google.com/maps?q=" +
    lat +
    "," +
    lng;

  const row =
    sh.getLastRow() + 1;

  sh
    .getRange(
      row,
      1,
      1,
      4
    )
    .setValues([[
      thoiGian,
      trangThai,
      soPhieu,
      toaDo
    ]]);

  sh
    .getRange(
      row,
      4
    )
    .setRichTextValue(
      SpreadsheetApp
        .newRichTextValue()
        .setText(toaDo)
        .setLinkUrl(googleMapsUrl)
        .build()
    );

  sh
    .getRange(
      row,
      1
    )
    .setNumberFormat(
      "dd/MM/yyyy HH:mm:ss"
    );

}



// ============================================================
// XÓA PHIẾU KHỎI PHIEU SAU KHI KẾT THÚC
// Chỉ gọi sau khi đã ghi trạng thái + GPS thành công.
// NHAT_KY và QUAN_LY_LAI_XE vẫn được giữ lại làm lịch sử.
// ============================================================

function xoaPhieuSauKetThuc_(row, soPhieu) {

  const sh =
    getSheet_(SHEET_PHIEU);

  if (!sh) {
    throw new Error("Không tìm thấy sheet PHIEU.");
  }

  const lastRow = sh.getLastRow();

  row = Number(row);

  if (row < 2 || row > lastRow) {
    throw new Error("Không thể xóa phiếu: dòng phiếu không hợp lệ.");
  }

  const maDangXoa = text_(
    sh.getRange(row, 1).getValue()
  );

  if (maDangXoa !== text_(soPhieu)) {
    throw new Error(
      "Không thể xóa phiếu: số phiếu không khớp, dữ liệu chưa bị xóa."
    );
  }

  sh.deleteRow(row);

}

// ============================================================
// MẬT KHẨU (BĂM SHA-256 + TỰ NÂNG CẤP DỮ LIỆU CŨ)
//
// Định dạng lưu trong sheet: "<salt16hex>$<sha256hex>".
// Dữ liệu cũ (mật khẩu thô, không có dấu "$") vẫn đăng nhập được;
// ngay khi đăng nhập thành công, mật khẩu đó sẽ được băm lại và
// ghi đè vào ô tương ứng để tự động nâng cấp, không cần thao tác gì thêm.
// ============================================================

function sha256Hex_(str) {
  const bytes = Utilities.computeDigest(
    Utilities.DigestAlgorithm.SHA_256,
    str,
    Utilities.Charset.UTF_8
  );
  return bytes.map(function (b) {
    b = b < 0 ? b + 256 : b;
    return (b < 16 ? "0" : "") + b.toString(16);
  }).join("");
}

function hashMatKhau_(matKhauTho) {
  const salt = Utilities.getUuid().replace(/-/g, "").slice(0, 16);
  return salt + "$" + sha256Hex_(salt + matKhauTho);
}

function laMatKhauDaBam_(luuTru) {
  const parts = text_(luuTru).split("$");
  return parts.length === 2 &&
    /^[0-9a-f]{16}$/i.test(parts[0]) &&
    /^[0-9a-f]{64}$/i.test(parts[1]);
}

function xacThucMatKhau_(matKhauNhap, luuTru) {
  matKhauNhap = text_(matKhauNhap);
  luuTru = text_(luuTru);
  if (laMatKhauDaBam_(luuTru)) {
    const parts = luuTru.split("$");
    return sha256Hex_(parts[0] + matKhauNhap) === parts[1];
  }
  // Dữ liệu cũ chưa băm: so sánh trực tiếp (sẽ được tự nâng cấp sau khi đăng nhập thành công).
  return luuTru === matKhauNhap;
}

// ============================================================
// ĐĂNG NHẬP
// ============================================================

function dangNhap(
  ma,
  matKhau
) {

  ma =
    text_(ma);

  matKhau =
    text_(matKhau);


  if (
    !ma ||
    !matKhau
  ) {

    return {

      success: false,

      message:
        "Vui lòng nhập tài khoản và mật khẩu."

    };

  }


  const ss =
    getSpreadsheet();


  // ----------------------------------------------------------
  // TÀI KHOẢN
  // ----------------------------------------------------------

  const tk =
    ss.getSheetByName(
      SHEET_TAI_KHOAN
    );


  if (tk) {

    const data =
      tk
        .getDataRange()
        .getValues();


    for (
      let i = 1;
      i < data.length;
      i++
    ) {

      if (
        text_(data[i][0]) === ma &&
        xacThucMatKhau_(matKhau, data[i][2])
      ) {

        if (!laMatKhauDaBam_(data[i][2])) {
          tk.getRange(i + 1, 3).setValue(hashMatKhau_(matKhau));
        }

        if (
          text_(data[i][4]) !==
          "Đang hoạt động"
        ) {

          return {

            success: false,

            message:
              "Tài khoản đang bị khóa."

          };

        }


        const vaiTro =
          text_(data[i][3]);


        if (
          vaiTro !== "Admin" &&
          vaiTro !== "Kế toán" &&
          vaiTro !== "Vận hành" &&
          vaiTro !== "Thí nghiệm" &&
          vaiTro !== "Kỹ Thuật"
        ) {

          return {

            success: false,

            message:
              "Vai trò không hợp lệ."

          };

        }


        return {

          success: true,

          vaiTro:
            vaiTro,

          sheetDuocXem:
            layDanhSachSheetDuocXem_(ma),

          ma:
            ma,

          hoTen:
            text_(data[i][1])

        };

      }

    }

  }


  // ----------------------------------------------------------
  // TÀI XẾ - GỘP CÁC DÒNG TRÙNG TÊN THÀNH 1 TÀI KHOẢN
  // ----------------------------------------------------------

  const tx = ss.getSheetByName(SHEET_TAI_XE);

  if (tx) {
    const lastRow = tx.getLastRow();
    if (lastRow >= 2) {
      const data = tx.getRange(2,1,lastRow-1,5).getValues();
      let matched = null;

      for (let i=0; i<data.length; i++) {
        if (text_(data[i][0]) === ma && xacThucMatKhau_(matKhau, data[i][3])) {
          if (!laMatKhauDaBam_(data[i][3])) {
            tx.getRange(i + 2, 4).setValue(hashMatKhau_(matKhau));
          }
          if (text_(data[i][4]) !== "Đang hoạt động") {
            return {
              success:false,
              message:"Tài khoản tài xế đang bị khóa."
            };
          }
          matched = {
            ma: text_(data[i][0]),
            ten: text_(data[i][1])
          };
          break;
        }
      }

      if (matched) {
        const bienSoList = [];
        let canonicalMa = matched.ma;
        let canonicalTen = matched.ten;

        for (let i=0; i<data.length; i++) {
          if (text_(data[i][4]) !== "Đang hoạt động") continue;
          if (key_(data[i][1]) !== key_(matched.ten)) continue;

          if (!canonicalMa) canonicalMa = text_(data[i][0]);
          if (!canonicalTen) canonicalTen = text_(data[i][1]);

          const bs = text_(data[i][2]);
          if (bs && bienSoList.indexOf(bs) < 0) bienSoList.push(bs);
        }

        return {
          success:true,
          vaiTro:"Tài xế",
          ma:canonicalMa,
          maTaiXe:canonicalMa,
          hoTen:canonicalTen,
          bienSo:bienSoList[0] || "",
          bienSoList:bienSoList,
          sheetDuocXem:layDanhSachSheetDuocXem_(canonicalMa)
        };
      }
    }
  }

  return {

    success: false,

    message:
      "Sai tài khoản hoặc mật khẩu."

  };

}


// ============================================================
// KIỂM TRA KẾ TOÁN
// ============================================================

function laKeToan(
  maNguoiDung
) {

  const sh =
    getSheet_(
      SHEET_TAI_KHOAN
    );


  if (!sh) {
    return false;
  }


  const data =
    sh
      .getDataRange()
      .getValues();


  const ma =
    text_(maNguoiDung);


  for (
    let i = 1;
    i < data.length;
    i++
  ) {

    if (

      text_(data[i][0]) === ma &&

      text_(data[i][3]) ===
        "Kế toán" &&

      text_(data[i][4]) ===
        "Đang hoạt động"

    ) {

      return true;

    }

  }


  return false;

}


// ============================================================
// KHÁCH HÀNG
// ============================================================

function layKhachHang(maNguoiDung) {
  const sh =
    getSheet_(
      SHEET_KHACH_HANG
    );


  if (
    !sh ||
    sh.getLastRow() < 2
  ) {

    return [];

  }


  const data =
    sh
      .getDataRange()
      .getValues();


  const result = [];


  for (
    let i = 1;
    i < data.length;
    i++
  ) {

    if (

      text_(data[i][0]) &&
      text_(data[i][1]) &&
      text_(data[i][3]) ===
        "Đang hoạt động"

    ) {

      result.push({

        id:
          text_(data[i][0]),

        ten:
          text_(data[i][1]),

        diaChi:
          text_(data[i][2])

      });

    }

  }


  return result;

}


// ============================================================
// THÊM KHÁCH HÀNG
// ============================================================

function themKhachHang(
  maNguoiDung,
  ten,
  diaChi
) {

  if (
    !laKeToan(
      maNguoiDung
    )
  ) {

    return {

      success: false,

      message:
        "Bạn không có quyền thêm khách hàng."

    };

  }


  ten =
    text_(ten);

  diaChi =
    text_(diaChi);


  if (!ten) {

    return {

      success: false,

      message:
        "Vui lòng nhập tên khách hàng."

    };

  }


  const sh =
    getSheet_(
      SHEET_KHACH_HANG
    );


  if (!sh) {

    return {

      success: false,

      message:
        "Không tìm thấy sheet KHACH_HANG."

    };

  }


  const data =
    sh
      .getDataRange()
      .getValues();


  let max =
    0;


  for (
    let i = 1;
    i < data.length;
    i++
  ) {

    const m =
      text_(data[i][0])
        .match(
          /^KH(\d+)$/i
        );


    if (m) {

      max =
        Math.max(
          max,
          Number(
            m[1]
          )
        );

    }

  }


  const id =
    "KH" +
    String(
      max + 1
    )
    .padStart(
      4,
      "0"
    );


  sh.appendRow([

    id,
    ten,
    diaChi,
    "Đang hoạt động"

  ]);


  return {

    success: true,

    message:
      "Đã thêm khách hàng.",

    id:
      id

  };

}


// ============================================================
// XÓA KHÁCH HÀNG
// ============================================================

function xoaKhachHang(
  maNguoiDung,
  id
) {

  if (
    !laKeToan(
      maNguoiDung
    )
  ) {

    return {

      success: false,

      message:
        "Bạn không có quyền xóa khách hàng."

    };

  }


  const sh =
    getSheet_(
      SHEET_KHACH_HANG
    );


  if (!sh) {

    return {

      success: false,

      message:
        "Không tìm thấy sheet KHACH_HANG."

    };

  }


  const data =
    sh
      .getDataRange()
      .getValues();


  for (
    let i = 1;
    i < data.length;
    i++
  ) {

    if (
      text_(data[i][0]) ===
      text_(id)
    ) {

      sh
        .getRange(
          i + 1,
          4
        )
        .setValue(
          "Ngừng hoạt động"
        );


      return {

        success: true,

        message:
          "Đã xóa khách hàng."

      };

    }

  }


  return {

    success: false,

    message:
      "Không tìm thấy khách hàng."

  };

}


// ============================================================
// DỰ ÁN
// ============================================================

function layDuAn(maNguoiDung) {
  const sh =
    ensureDuAnSheet_();


  if (
    sh.getLastRow() < 2
  ) {

    return [];

  }


  const data =
    sh
      .getDataRange()
      .getValues();


  const result = [];


  for (
    let i = 1;
    i < data.length;
    i++
  ) {

    if (

      text_(data[i][0]) &&
      text_(data[i][1]) &&
      text_(data[i][3]) ===
        "Đang hoạt động"

    ) {

      result.push({

        id:
          text_(data[i][0]),

        ten:
          text_(data[i][1]),

        diaChi:
          text_(data[i][2])

      });

    }

  }


  return result;

}


// ============================================================
// THÔNG TIN DỰ ÁN
// ============================================================

function layThongTinDuAn(
  tenDuAn
) {

  const sh =
    ensureDuAnSheet_();


  if (
    sh.getLastRow() < 2
  ) {

    return null;

  }


  const data =
    sh
      .getDataRange()
      .getValues();


  const target =
    key_(tenDuAn);


  for (
    let i = 1;
    i < data.length;
    i++
  ) {

    if (

      text_(data[i][3]) ===
        "Đang hoạt động"

      &&

      key_(data[i][1]) ===
        target

    ) {

      return {

        id:
          text_(data[i][0]),

        ten:
          text_(data[i][1]),

        diaChi:
          text_(data[i][2])

      };

    }

  }


  return null;

}


// ============================================================
// THÊM DỰ ÁN
// ============================================================

function themDuAn(
  maNguoiDung,
  ten,
  diaChi
) {

  if (
    !laKeToan(
      maNguoiDung
    )
  ) {

    return {

      success: false,

      message:
        "Bạn không có quyền thêm dự án."

    };

  }


  ten =
    text_(ten);

  diaChi =
    text_(diaChi);


  if (!ten) {

    return {

      success: false,

      message:
        "Vui lòng nhập tên dự án."

    };

  }


  const sh =
    ensureDuAnSheet_();


  const data =
    sh
      .getDataRange()
      .getValues();


  let max =
    0;


  for (
    let i = 1;
    i < data.length;
    i++
  ) {

    const m =
      text_(data[i][0])
        .match(
          /^DA(\d+)$/i
        );


    if (m) {

      max =
        Math.max(
          max,
          Number(
            m[1]
          )
        );

    }


    if (

      text_(data[i][3]) ===
        "Đang hoạt động"

      &&

      key_(data[i][1]) ===
        key_(ten)

    ) {

      return {

        success: false,

        message:
          "Dự án này đã tồn tại."

      };

    }

  }


  const id =
    "DA" +
    String(
      max + 1
    )
    .padStart(
      4,
      "0"
    );


  sh.appendRow([

    id,
    ten,
    diaChi,
    "Đang hoạt động"

  ]);


  return {

    success: true,

    message:
      "Đã thêm dự án.",

    id:
      id

  };

}


// ============================================================
// XÓA DỰ ÁN
// ============================================================

function xoaDuAn(
  maNguoiDung,
  id
) {

  if (
    !laKeToan(
      maNguoiDung
    )
  ) {

    return {

      success: false,

      message:
        "Bạn không có quyền xóa dự án."

    };

  }


  const sh =
    ensureDuAnSheet_();


  const data =
    sh
      .getDataRange()
      .getValues();


  for (
    let i = 1;
    i < data.length;
    i++
  ) {

    if (
      text_(data[i][0]) ===
      text_(id)
    ) {

      sh
        .getRange(
          i + 1,
          4
        )
        .setValue(
          "Ngừng hoạt động"
        );


      return {

        success: true,

        message:
          "Đã xóa dự án."

      };

    }

  }


  return {

    success: false,

    message:
      "Không tìm thấy dự án."

  };

}


// ============================================================
// CẤP PHỐI
// ============================================================

function emptyCapPhoi_() {

  return {

    cat1: "",
    da1: "",
    da2: "",
    cat2: "",
    xiMang1: "",
    xiMang2: "",
    nuoc: "",
    pg1: "",
    pg2: ""

  };

}


function layCapPhoi(
  khachHang,
  duAn,
  mac,
  doSut,
  maNguoiDung
) {
  const sh =
    ensureCapPhoiSheet_();


  const empty =
    emptyCapPhoi_();


  khachHang =
    text_(khachHang);

  duAn =
    text_(duAn);

  mac =
    text_(mac);

  doSut =
    text_(doSut);


  if (
    !khachHang ||
    !duAn ||
    !mac ||
    !doSut ||
    sh.getLastRow() < 2
  ) {

    return {

      found: false,

      values:
        empty

    };

  }


  const data =
    sh
      .getDataRange()
      .getValues();


  let found =
    null;


  for (
    let i = 1;
    i < data.length;
    i++
  ) {

    if (

      key_(data[i][0]) ===
        key_(khachHang)

      &&

      key_(data[i][1]) ===
        key_(duAn)

      &&

      key_(data[i][2]) ===
        key_(mac)

      &&

      key_(data[i][3]) ===
        key_(doSut)

    ) {

      found =
        data[i];

    }

  }


  if (!found) {

    return {

      found: false,

      values:
        empty

    };

  }


  return {

    found: true,

    values: {

      cat1:
        found[4],

      da1:
        found[5],

      da2:
        found[6],

      cat2:
        found[7],

      xiMang1:
        found[8],

      xiMang2:
        found[9],

      nuoc:
        found[10],

      pg1:
        found[11],

      pg2:
        found[12]

    }

  };

}


// ============================================================
// KỸ THUẬT - THÊM / SỬA CẤP PHỐI
// ============================================================

function laKyThuat_(maNguoiDung) {
  const sh = getSheet_(SHEET_TAI_KHOAN);
  if (!sh) return false;

  const data = sh.getDataRange().getValues();
  const ma = text_(maNguoiDung);

  for (let i = 1; i < data.length; i++) {
    if (
      text_(data[i][0]) === ma &&
      text_(data[i][3]) === "Kỹ Thuật" &&
      text_(data[i][4]) === "Đang hoạt động"
    ) {
      return true;
    }
  }

  return false;
}

// Toàn bộ cấp phối hiện có, để Kỹ Thuật xem lại trước khi thêm/sửa.
function layDanhSachCapPhoi() {
  const sh = ensureCapPhoiSheet_();
  if (sh.getLastRow() < 2) return [];

  const data = sh.getRange(2, 1, sh.getLastRow() - 1, 13).getValues();
  const result = [];

  for (let i = 0; i < data.length; i++) {
    const r = data[i];
    if (!text_(r[0]) || !text_(r[1])) continue;

    result.push({
      row: i + 2,
      khachHang: text_(r[0]),
      duAn: text_(r[1]),
      mac: text_(r[2]),
      doSut: text_(r[3]),
      cat1: r[4],
      da1: r[5],
      da2: r[6],
      cat2: r[7],
      xiMang1: r[8],
      xiMang2: r[9],
      nuoc: r[10],
      pg1: r[11],
      pg2: r[12]
    });
  }

  return result;
}

// Thêm mới, hoặc cập nhật (nếu đã tồn tại đúng khách hàng + dự án + mác +
// độ sụt) 1 dòng cấp phối vào sheet CAP_PHOI.
function themCapPhoi(maNguoiDung, form) {
  if (!laKyThuat_(maNguoiDung)) {
    return {success:false, message:"Bạn không có quyền Kỹ Thuật."};
  }

  form = form || {};

  const khachHang = text_(form.khachHang);
  const duAn = text_(form.duAn);
  const mac = text_(form.mac);
  const doSut = text_(form.doSut);

  if (!khachHang) return {success:false, message:"Vui lòng chọn khách hàng."};
  if (!duAn) return {success:false, message:"Vui lòng chọn dự án."};
  if (!mac) return {success:false, message:"Vui lòng nhập Mác bê tông."};
  if (!doSut) return {success:false, message:"Vui lòng nhập Độ sụt."};

  const vals = [
    num_(form.cat1),
    num_(form.da1),
    num_(form.da2),
    num_(form.cat2),
    num_(form.xiMang1),
    num_(form.xiMang2),
    num_(form.nuoc),
    num_(form.pg1),
    num_(form.pg2)
  ];

  const sh = ensureCapPhoiSheet_();
  const data = sh.getLastRow() >= 2 ? sh.getRange(2, 1, sh.getLastRow() - 1, 4).getValues() : [];

  let row = 0;
  for (let i = 0; i < data.length; i++) {
    if (
      key_(data[i][0]) === key_(khachHang) &&
      key_(data[i][1]) === key_(duAn) &&
      key_(data[i][2]) === key_(mac) &&
      key_(data[i][3]) === key_(doSut)
    ) {
      row = i + 2;
      break;
    }
  }

  if (row) {
    sh.getRange(row, 5, 1, 9).setValues([vals]);
    return {success:true, message:"Đã cập nhật cấp phối."};
  }

  sh.appendRow([khachHang, duAn, mac, doSut].concat(vals));
  return {success:true, message:"Đã thêm cấp phối mới."};
}


// ============================================================
// TÀI XẾ + THỐNG KÊ
// ============================================================

function layDanhSachTaiXe(maNguoiDung) {
  const tx = getSheet_(SHEET_TAI_XE);
  const ph = getSheet_(SHEET_PHIEU);
  if (!tx || tx.getLastRow() < 2) return [];

  const td = tx.getRange(2,1,tx.getLastRow()-1,5).getValues();
  const busy = {};
  if (ph && ph.getLastRow() >= 2) {
    const pd = ph.getRange(2,1,ph.getLastRow()-1,Math.max(14,ph.getLastColumn())).getValues();
    pd.forEach(function(r){
      const st=text_(r[11]);
      if (st === "Đã hoàn thành" || st === "Thành công" || st === "Thất bại" || st === "Đã về đến trạm") return;
      busy[text_(r[12])] = true;
    });
  }

  const grouped = {};
  for (let i=0;i<td.length;i++) {
    const ma=text_(td[i][0]);
    const ten=text_(td[i][1]);
    const bs=text_(td[i][2]);
    const st=text_(td[i][4]);
    if (!ma || !ten || st !== "Đang hoạt động") continue;
    const k=key_(ten);
    if (!grouped[k]) grouped[k]={ma:ma,hoTen:ten,bienSoList:[],dangCoPhieu:false};
    if (bs && grouped[k].bienSoList.indexOf(bs)<0) grouped[k].bienSoList.push(bs);
    if (busy[ma]) grouped[k].dangCoPhieu=true;
  }

  return Object.keys(grouped).map(function(k){
    const x=grouped[k];
    return {
      ma:x.ma,
      hoTen:x.hoTen,
      bienSo:x.bienSoList[0] || "",
      bienSoList:x.bienSoList,
      dangCoPhieu:x.dangCoPhieu,
      lanHoanThanhCuoi:0,
      tongHoanThanh:0,
      tongThatBai:0,
      tongDong:0
    };
  }).sort(function(a,b){ return a.hoTen.localeCompare(b.hoTen,'vi'); });
}

// ============================================================
// TÀI XẾ ĐANG BẬN
// ============================================================

function taiXeDangBan(
  maTaiXe
) {

  const sh =
    getSheet_(
      SHEET_PHIEU
    );


  if (
    !sh ||
    sh.getLastRow() < 2
  ) {

    return false;

  }


  const data =
    sh
      .getRange(
        2,
        1,
        sh.getLastRow() - 1,
        Math.max(
          14,
          sh.getLastColumn()
        )
      )
      .getValues();


  return data.some(
    function(r) {

      const st =
        text_(r[11]);


      return (

        text_(r[12]) ===
        text_(maTaiXe)

        &&

        st !==
        "Đã hoàn thành"

        &&

        st !==
        "Thất bại"

      );

    }
  );

}


// ============================================================
// TẠO SỐ PHIẾU
// ============================================================

function taoMaPhieu() {

  const sh =
    getSheet_(
      SHEET_PHIEU
    );


  if (
    !sh ||
    sh.getLastRow() < 2
  ) {

    return "P0001";

  }


  const data =
    sh
      .getRange(
        2,
        1,
        sh.getLastRow() - 1,
        1
      )
      .getValues();


  let max =
    0;


  data.forEach(
    function(r) {

      const m =
        text_(r[0])
          .match(
            /^P(\d+)$/i
          );


      if (m) {

        max =
          Math.max(
            max,
            Number(
              m[1]
            )
          );

      }

    }
  );


  return (
    "P" +
    String(
      max + 1
    ).padStart(
      4,
      "0"
    )
  );

}


// ============================================================
// LẤY HỌ TÊN TÀI KHOẢN VẬN HÀNH
// ============================================================
function getHoTenNguoiVanHanh_(maNguoiVanHanh) {
  maNguoiVanHanh = text_(maNguoiVanHanh);
  if (!maNguoiVanHanh) return "";

  const ss = getSpreadsheet();
  const sh = ss.getSheetByName(SHEET_TAI_KHOAN);
  if (!sh || sh.getLastRow() < 2) return "";

  const data = sh.getDataRange().getValues();
  for (let i = 1; i < data.length; i++) {
    const ma = text_(data[i][0]);
    const hoTen = text_(data[i][1]);
    const vaiTro = text_(data[i][3]);
    const trangThai = text_(data[i][4]);

    if (ma === maNguoiVanHanh &&
        vaiTro === "Vận hành" &&
        trangThai === "Đang hoạt động") {
      return hoTen;
    }
  }

  return "";
}

// ============================================================
// TẠO PHIẾU
// ============================================================

function taoPhieu(
  form
) {

  const lock =
    LockService
      .getScriptLock();


  try {

    lock.waitLock(
      15000
    );

  } catch (e) {

    return {

      success: false,

      message:
        "Hệ thống đang xử lý phiếu khác."

    };

  }


  try {

    const kh =
      text_(
        form.khachHang
      );

    const duAn =
      text_(
        form.congTrinh
      );

    const kd =
      text_(
        form.kd
      );

    const mac =
      text_(
        form.mac
      );

    const doSut =
      text_(
        form.doSut
      );

    const soLuong =
      Number(
        form.soLuong
      );

    const luyKeCu =
      Number(
        form.luyKe
      );

    const maTaiXe =
      text_(
        form.maTaiXe
      );

    const mauPhieu =
      normalizeMau_(
        form.mauPhieu
      );

    const bienSo = text_(form.bienSo);
    const maNguoiVanHanh = text_(form.maNguoiVanHanh);
    const hoTenNguoiVanHanh = getHoTenNguoiVanHanh_(maNguoiVanHanh);
    const loaiVanHanh = text_(form.loaiVanHanh) || "Vận hành Văn Giang";
    const diaDiemXuatPhieu = text_(form.diaDiemXuatPhieu) || (loaiVanHanh === "Vận hành Yên Lệnh" ? "Yên Lệnh" : "Văn Giang");
    const luyKe = tinhLuyKeTuDong_(kh, duAn) + soLuong;


    if (!kh) {

      return {
        success:false,
        message:
          "Vui lòng chọn khách hàng."
      };

    }


    if (!duAn) {

      return {
        success:false,
        message:
          "Vui lòng chọn dự án."
      };

    }


    const duAnInfo =
      layThongTinDuAn(
        duAn
      );


    if (!duAnInfo) {

      return {
        success:false,
        message:
          "Dự án không tồn tại hoặc đã ngừng hoạt động."
      };

    }


    if (!mac) {

      return {
        success:false,
        message:
          "Vui lòng nhập Mác bê tông."
      };

    }


    if (!doSut) {

      return {
        success:false,
        message:
          "Vui lòng nhập Độ sụt."
      };

    }


    if (
      !Number.isFinite(
        soLuong
      ) ||
      soLuong <= 0
    ) {

      return {
        success:false,
        message:
          "Số lượng không hợp lệ."
      };

    }





    if (!mauPhieu) {

      return {
        success:false,
        message:
          "Vui lòng chọn mẫu phiếu."
      };

    }


    if (!maTaiXe) {

      return {
        success:false,
        message:
          "Vui lòng chọn tài xế."
      };

    }

    if (!maNguoiVanHanh || !hoTenNguoiVanHanh) {
      return {
        success:false,
        message:
          "Không xác định được tài khoản Vận hành đang lập phiếu. Vui lòng đăng nhập lại."
      };
    }

    if (!bienSo || !kiemTraBienSoTaiXe_(maTaiXe, bienSo)) {
      return {success:false,message:"Vui lòng chọn đúng biển số xe của tài xế."};
    }

    if (["Vận hành Văn Giang","Vận hành Yên Lệnh"].indexOf(loaiVanHanh) < 0) {
      return {success:false,message:"Loại vận hành không hợp lệ."};
    }

    if (!diaDiemXuatPhieu) {
      return {success:false,message:"Vui lòng chọn địa điểm xuất phiếu."};
    }


    if (
      taiXeDangBan(
        maTaiXe
      )
    ) {

      return {
        success:false,
        message:
          "Tài xế này đang có phiếu chưa đóng."
      };

    }


    const sh =
      getSheet_(
        SHEET_PHIEU
      );


    if (!sh) {

      return {
        success:false,
        message:
          "Không tìm thấy sheet PHIEU."
      };

    }


    // --------------------------------------------------------
    // CAP PHOI
    // --------------------------------------------------------

    const capResult =
      layCapPhoi(
        kh,
        duAn,
        mac,
        doSut
      );


    const cp =
      capResult.values;


    const maPhieu =
      taoMaPhieu();


    const now =
      new Date();

    // AA = người Vận hành trực tiếp lập phiếu
    if (!text_(sh.getRange(1,27).getValue())) {
      sh.getRange(1,27).setValue("NGƯỜI VẬN HÀNH");
    }


    // --------------------------------------------------------
    // PHIEU A:N
    // --------------------------------------------------------

    sh.appendRow([

      maPhieu,
      kh,
      duAn,
      kd,
      now,
      "",
      mac,
      "m³",
      doSut,
      soLuong,
      luyKe,
      "Đang chờ",
      maTaiXe,
      mauPhieu

    ]);


    const row =
      sh.getLastRow();

    // X:Z = biển số xe, loại vận hành, địa điểm xuất phiếu
    sh.getRange(row,24,1,3).setValues([[bienSo,loaiVanHanh,diaDiemXuatPhieu]]);

    // AA = họ tên tài khoản Vận hành trực tiếp lập phiếu
    sh.getRange(row,27).setValue(hoTenNguoiVanHanh);


    // --------------------------------------------------------
    // CAP PHOI O:W
    // --------------------------------------------------------

    sh
      .getRange(
        row,
        15,
        1,
        9
      )
      .setValues([[
        cp.cat1,
        cp.da1,
        cp.da2,
        cp.cat2,
        cp.xiMang1,
        cp.xiMang2,
        cp.nuoc,
        cp.pg1,
        cp.pg2
      ]]);


    // --------------------------------------------------------
    // NHAT KY:
    // CHỈ TẠO 1 DÒNG DUY NHẤT CHO PHIẾU
    // --------------------------------------------------------

    taoDongNhatKy_(
      maPhieu,
      maTaiXe,
      now,
      "",
      kh,
      duAn,
      kd,
      mac,
      "m³",
      doSut,
      soLuong,
      luyKe,
      "Đang chờ",
      mauPhieu,
      bienSo,
      loaiVanHanh,
      diaDiemXuatPhieu
    );


    return {

      success:true,

      message:
        "Đã tạo phiếu thành công.",

      maPhieu:
        maPhieu,

      mauPhieu:
        mauPhieu,

      bienSo: bienSo,
      loaiVanHanh: loaiVanHanh,
      diaDiemXuatPhieu: diaDiemXuatPhieu,

      khachHang:
        kh,

      congTrinh:
        duAn,

      kd:
        kd,

      mac:
        mac,

      donViTinh:
        "m³",

      doSut:
        doSut,

      soLuong:
        soLuong,

      luyKe:
        luyKe,

      maTaiXe:
        maTaiXe,

      trangThai:
        "Đang chờ",

      diaChiDuAn:
        duAnInfo.diaChi,

      capPhoi:
        cp,

      capPhoiFound:
        capResult.found,

      ngay:
        Utilities.formatDate(
          now,
          Session.getScriptTimeZone(),
          "dd/MM/yyyy HH:mm"
        )

    };

  } finally {

    lock.releaseLock();

  }

}


// ============================================================
// TẠO 1 DÒNG NHẬT KÝ
// ============================================================

function taoDongNhatKy_(
  soPhieu,
  taiXe,
  xuatPhat,
  denCongTrinh,
  khachHang,
  duAn,
  kd,
  mac,
  dvt,
  doSut,
  soLuong,
  luyKe,
  trangThai,
  mauPhieu,
  bienSo,
  loaiVanHanh,
  diaDiemXuatPhieu
) {

  const nk =
    getSheet_(
      SHEET_NHAT_KY
    );


  if (!nk) {
    return;
  }


  // Tìm xem phiếu đã tồn tại chưa.
  // Nếu tồn tại -> cập nhật.
  // Nếu chưa -> tạo mới.

  const row =
    timDongNhatKy_(
      soPhieu
    );


  if (row) {

    nk
      .getRange(
        row,
        2,
        1,
        13
      )
      .setValues([[
        taiXe,
        xuatPhat,
        denCongTrinh,
        khachHang,
        duAn,
        kd,
        mac,
        dvt,
        doSut,
        soLuong,
        luyKe,
        trangThai,
        mauPhieu
      ]]);

    if (bienSo || loaiVanHanh || diaDiemXuatPhieu) {
      nk.getRange(row,15,1,3).setValues([[bienSo || "", loaiVanHanh || "", diaDiemXuatPhieu || ""]]);
    }

    return;

  }


  nk.appendRow([

    soPhieu,
    taiXe,
    xuatPhat,
    denCongTrinh,
    khachHang,
    duAn,
    kd,
    mac,
    dvt,
    doSut,
    soLuong,
    luyKe,
    trangThai,
    mauPhieu,
    bienSo || "",
    loaiVanHanh || "",
    diaDiemXuatPhieu || ""

  ]);

}


// ============================================================
// TÌM DÒNG NHẬT KÝ THEO SỐ PHIẾU
// ============================================================

function timDongNhatKy_(
  soPhieu
) {

  const nk =
    getSheet_(
      SHEET_NHAT_KY
    );


  if (
    !nk ||
    nk.getLastRow() < 2
  ) {

    return 0;

  }


  const data =
    nk
      .getRange(
        2,
        1,
        nk.getLastRow() - 1,
        1
      )
      .getValues();


  const target =
    text_(soPhieu);


  for (
    let i = 0;
    i < data.length;
    i++
  ) {

    if (
      text_(data[i][0]) ===
      target
    ) {

      return i + 2;

    }

  }


  return 0;

}


// ============================================================
// CẬP NHẬT NHẬT KÝ TRÊN CÙNG DÒNG
// ============================================================

function capNhatNhatKy_(
  soPhieu,
  trangThaiMoi,
  thoiGianDen
) {

  const nk =
    getSheet_(
      SHEET_NHAT_KY
    );


  if (!nk) {
    return;
  }


  let row =
    timDongNhatKy_(
      soPhieu
    );


  // Nếu vì dữ liệu cũ chưa có dòng,
  // tự tạo lại 1 dòng từ PHIEU.

  if (!row) {

    const ph =
      getSheet_(
        SHEET_PHIEU
      );


    if (!ph) {
      return;
    }


    const data =
      ph
        .getDataRange()
        .getValues();


    for (
      let i = 1;
      i < data.length;
      i++
    ) {

      if (
        text_(data[i][0]) !==
        text_(soPhieu)
      ) {

        continue;

      }


      taoDongNhatKy_(
        data[i][0],
        data[i][12],
        data[i][4],
        data[i][5],
        data[i][1],
        data[i][2],
        data[i][3],
        data[i][6],
        data[i][7],
        data[i][8],
        data[i][9],
        data[i][10],
        trangThaiMoi,
        normalizeMau_(
          data[i][13]
        ) || "1",
        text_(data[i][23]),
        text_(data[i][24]),
        text_(data[i][25])
      );


      return;

    }


    return;

  }


  // ----------------------------------------------------------
  // CHỈ CẬP NHẬT Ô CẦN THAY
  // ----------------------------------------------------------

  // D = ĐẾN CÔNG TRÌNH

  if (
    thoiGianDen
  ) {

    nk
      .getRange(
        row,
        4
      )
      .setValue(
        thoiGianDen
      );

  }


  // M = TRẠNG THÁI

  nk
    .getRange(
      row,
      13
    )
    .setValue(
      trangThaiMoi
    );

}


// ============================================================
// TÀI XẾ - LẤY PHIẾU
// ============================================================

function layPhieu(
  maTaiXe,
  bienSo
) {

  const sh =
    getSheet_(
      SHEET_PHIEU
    );


  if (
    !sh ||
    sh.getLastRow() < 2
  ) {

    return [];

  }


  const data =
    sh
      .getRange(
        2,
        1,
        sh.getLastRow() - 1,
        Math.max(
          23,
          sh.getLastColumn()
        )
      )
      .getValues();


  const result = [];


  for (
    let i = 0;
    i < data.length;
    i++
  ) {

    const r =
      data[i];


    if (
      text_(r[12]) !== text_(maTaiXe)
    ) {

      continue;

    }


    const st =
      text_(r[11]);

    // Bắt buộc đúng biển số xe đã xác nhận.
    const bienSoPhieu = text_(r[23]);
    if (bienSo && bienSoPhieu !== text_(bienSo)) continue;


    if (
      st === "Đã hoàn thành" ||
      st === "Thành công" ||
      st === "Đã về đến trạm"
    ) {
      continue;
    }


    result.push({

      row:
        i + 2,

      maPhieu:
        r[0],

      khachHang:
        r[1],

      congTrinh:
        r[2],

      kd:
        r[3],

      ngay:
        fmtDate_(
          r[4]
        ),

      thoiGianDen:
        fmtDate_(
          r[5]
        ),

      mac:
        r[6],

      donViTinh:
        r[7],

      doSut:
        r[8],

      soLuong:
        r[9],

      luyKe:
        r[10],

      trangThai:
        st,

      mauPhieu:
        normalizeMau_(
          r[13]
        ) || "1",

      bienSo: bienSoPhieu,
      loaiVanHanh: text_(r[24]),
      diaDiemXuatPhieu: text_(r[25])

    });

  }


  return result;

}


// ============================================================
// ĐÃ ĐẾN CÔNG TRÌNH
// ============================================================

// ============================================================
// CẬP NHẬT TRẠNG THÁI PHIẾU
//
// QUAN TRỌNG:
// PHIEU = cập nhật 1 dòng
// NHAT_KY = cập nhật đúng 1 dòng của SỐ PHIẾU
// KHÔNG append dòng mới khi đổi trạng thái
// ============================================================

function capNhatTrangThaiTaiXe(
  row,
  maTaiXe,
  trangThaiMoi,
  viTri,
  bienSo
) {
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(15000);
  } catch (e) {
    return {success:false,message:"Hệ thống đang xử lý. Vui lòng thử lại."};
  }

  try {
    const sh = getSheet_(SHEET_PHIEU);
    if (!sh) return {success:false,message:"Không tìm thấy sheet PHIEU."};

    row = Number(row);
    if (row < 2 || row > sh.getLastRow()) {
      return {success:false,message:"Phiếu không hợp lệ."};
    }

    const data = sh.getRange(row,1,1,Math.max(27,sh.getLastColumn())).getValues()[0];

    if (text_(data[12]) !== text_(maTaiXe)) {
      return {success:false,message:"Bạn không có quyền cập nhật phiếu này."};
    }

    const current = text_(data[11]);
    const bienSoPhieu = text_(data[23]);
    if (!bienSo || bienSoPhieu !== text_(bienSo)) {
      return {success:false,message:"Phiếu này không thuộc biển số xe bạn đã chọn."};
    }

    if (current === "Thành công" || current === "Đã hoàn thành" || current === "Đã về đến trạm") {
      return {success:false,message:"Phiếu này đã đóng."};
    }

    if (trangThaiMoi === "Đã hoàn thành") trangThaiMoi = "Thành công";

    const trangThaiHopLe = [
      "Đã nhận phiếu",
      "Đã giao hàng xong",
      "Thành công",
      "Thất bại",
      "Đã về đến trạm"
    ];

    if (trangThaiHopLe.indexOf(trangThaiMoi) === -1) {
      return {success:false,message:"Trạng thái không hợp lệ."};
    }

    if (!viTri || !Number.isFinite(Number(viTri.latitude)) || !Number.isFinite(Number(viTri.longitude))) {
      return {success:false,message:"Không nhận được vị trí GPS. Vui lòng bật định vị và thử lại."};
    }

    const latitude = Number(viTri.latitude);
    const longitude = Number(viTri.longitude);
    if (latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
      return {success:false,message:"Tọa độ GPS không hợp lệ. Vui lòng thử lại."};
    }

    const now = new Date();
    const soPhieu = data[0];
    const loaiVanHanh = text_(data[24]) || text_(data[25]);

    // BƯỚC 1: NHẬN PHIẾU
    if (trangThaiMoi === "Đã nhận phiếu") {
      if (current !== "Đang chờ") {
        return {success:false,message:"Chỉ được bấm NHẬN PHIẾU khi phiếu đang ở trạng thái ĐANG CHỜ."};
      }

      sh.getRange(row,12).setValue("Đã nhận phiếu");
      capNhatNhatKy_(soPhieu,"Đã nhận phiếu",null);
      ghiViTriTaiXe_(now,"Đã nhận phiếu",soPhieu,latitude,longitude);

      return {success:true,message:"Đã xác nhận NHẬN PHIẾU và lưu GPS.",trangThai:"Đã nhận phiếu",thoiGian:fmtDate_(now)};
    }

    // BƯỚC 2A: GIAO HÀNG XONG
    if (trangThaiMoi === "Đã giao hàng xong") {
      if (current !== "Đã nhận phiếu") {
        return {success:false,message:"Chỉ được bấm GIAO HÀNG XONG sau khi đã nhận phiếu."};
      }

      sh.getRange(row,12).setValue("Đã giao hàng xong");
      capNhatNhatKy_(soPhieu,"Đã giao hàng xong",null);
      ghiViTriTaiXe_(now,"Đã giao hàng xong",soPhieu,latitude,longitude);

      return {success:true,message:"Đã ghi nhận GIAO HÀNG XONG và GPS.",trangThai:"Đã giao hàng xong",thoiGian:fmtDate_(now)};
    }

    // BƯỚC 2B: THẤT BẠI NGAY SAU KHI NHẬN PHIẾU
    if (trangThaiMoi === "Thất bại" && current === "Đã nhận phiếu") {
      sh.getRange(row,12).setValue("Thất bại");
      capNhatNhatKy_(soPhieu,"Thất bại",null);
      ghiViTriTaiXe_(now,"Thất bại",soPhieu,latitude,longitude);

      // THẤT BẠI: cộng ngay +1 vào SỔ CHUYẾN và +1 vào BẢNG CHẤM CÔNG.
      capNhatSoChuyen_(maTaiXe,"Thất bại");
      capNhatBangChamCong_(maTaiXe,"Thất bại",loaiVanHanh);

      // Giữ phiếu mở cho đến khi tài xế bấm ĐÃ VỀ ĐẾN TRẠM.
      return {
        success:true,
        message:"Đã ghi nhận THẤT BẠI và cộng +1 vào SỔ CHUYẾN, +1 vào BẢNG CHẤM CÔNG. Khi về trạm, hãy bấm ĐÃ VỀ ĐẾN TRẠM để đóng phiếu.",
        trangThai:"Thất bại",
        thoiGian:fmtDate_(now),
        choVeTram:true
      };
    }

    // BƯỚC 3A: HOÀN THÀNH
    if (trangThaiMoi === "Thành công") {
      if (current !== "Đã giao hàng xong") {
        return {success:false,message:"Chỉ được bấm HOÀN THÀNH sau khi đã giao hàng xong."};
      }

      sh.getRange(row,12).setValue("Thành công");
      capNhatNhatKy_(soPhieu,"Thành công",null);
      ghiViTriTaiXe_(now,"Thành công",soPhieu,latitude,longitude);
      capNhatSoChuyen_(maTaiXe,"Thành công");
      capNhatBangChamCong_(maTaiXe,"Thành công",loaiVanHanh);
      xoaPhieuSauKetThuc_(row,soPhieu);

      return {success:true,message:"Đã ghi nhận HOÀN THÀNH và lưu GPS.",trangThai:"Thành công",thoiGian:fmtDate_(now),dongPhieu:true};
    }

    // BƯỚC 3B: THẤT BẠI SAU KHI GIAO HÀNG
    if (trangThaiMoi === "Thất bại" && current === "Đã giao hàng xong") {
      sh.getRange(row,12).setValue("Thất bại");
      capNhatNhatKy_(soPhieu,"Thất bại",null);
      ghiViTriTaiXe_(now,"Thất bại",soPhieu,latitude,longitude);
      capNhatSoChuyen_(maTaiXe,"Thất bại");
      capNhatBangChamCong_(maTaiXe,"Thất bại",loaiVanHanh);

      return {success:true,message:"Đã ghi nhận THẤT BẠI. Khi về đến trạm, hãy bấm ĐÃ VỀ ĐẾN TRẠM để đóng phiếu.",trangThai:"Thất bại",thoiGian:fmtDate_(now),choVeTram:true};
    }

    // BƯỚC 4: VỀ ĐẾN TRẠM -> ĐÓNG PHIẾU
    if (trangThaiMoi === "Đã về đến trạm") {
      if (current !== "Thất bại") {
        return {success:false,message:"Chỉ được bấm ĐÃ VỀ ĐẾN TRẠM sau khi phiếu đã ở trạng thái THẤT BẠI."};
      }

      sh.getRange(row,12).setValue("Đã về đến trạm");
      capNhatNhatKy_(soPhieu,"Đã về đến trạm",null);
      ghiViTriTaiXe_(now,"Đã về đến trạm",soPhieu,latitude,longitude);
      xoaPhieuSauKetThuc_(row,soPhieu);

      return {success:true,message:"Đã ghi nhận ĐÃ VỀ ĐẾN TRẠM và đóng phiếu.",trangThai:"Đã về đến trạm",thoiGian:fmtDate_(now),dongPhieu:true};
    }

    return {success:false,message:"Trạng thái không hợp lệ."};
  } finally {
    lock.releaseLock();
  }
}

// ============================================================
// DỮ LIỆU IN
// ============================================================

function layDuLieuInPhieu(
  maPhieu
) {

  const sh =
    getSheet_(
      SHEET_PHIEU
    );


  if (!sh) {

    return {

      success: false,

      message:
        "Không tìm thấy sheet PHIEU."

    };

  }


  const data =
    sh
      .getDataRange()
      .getValues();


  for (
    let i = 1;
    i < data.length;
    i++
  ) {

    const r =
      data[i];


    if (
      text_(r[0]) !==
      text_(maPhieu)
    ) {
      continue;
    }


    const tx =
      getTaiXeInfo_(
        r[12],
        r[23]
      );


    const duAn =
      layThongTinDuAn(
        r[2]
      );


    const kh =
      getKhachHangInfo_(
        r[1]
      );


    const soLuong =
      num_(
        r[9]
      );


    function calc(
      value
    ) {

      if (
        value === "" ||
        value == null
      ) {

        return "";

      }


      const n =
        Number(
          value
        );


      if (
        !Number.isFinite(n)
      ) {

        return "";

      }


      return (
        n *
        soLuong
      );

    }


    return {

      success:
        true,

      soPhieu:
        r[0],

      donViBanHang:
        "Công ty Cổ phần RITECCONS",

      donViMuaHang:
        r[1],

      duAn:
        r[2],

      kd:
        r[3],

      thoiGianXuatPhat:
        fmtDate_(
          r[4]
        ),

      thoiGianDenCongTrinh:
        fmtDate_(
          r[5]
        ),

      ngay:

        r[4] instanceof Date

          ?

          Utilities.formatDate(
            r[4],
            Session.getScriptTimeZone(),
            "dd/MM/yyyy"
          )

          :

          "",

      mac:
        r[6],

      capDoBeTong:
        r[6],

      donViTinh:
        r[7],

      doSut:
        r[8],

      soLuong:
        r[9],

      luyKe:
        r[10],

      trangThai:
        r[11],

      taiXe:
        r[12],

      hoTenTaiXe:
        tx.hoTen,

      bienSo:
        text_(r[23]) || tx.bienSo,

      loaiVanHanh:
        text_(r[24]) || "Vận hành Văn Giang",

      diaDiemXuatPhieu:
        text_(r[25]) || "Văn Giang",

      hoTenNguoiVanHanh:
        text_(r[26]) || "",

      diaChiGiaoHang:

        duAn

          ?

          duAn.diaChi

          :

          kh.diaChi,

      mauPhieu:
        normalizeMau_(
          r[13]
        ) || "1",

      capPhoi: {

        cat1:
          r[14],

        da1:
          r[15],

        da2:
          r[16],

        cat2:
          r[17],

        xiMang1:
          r[18],

        xiMang2:
          r[19],

        nuoc:
          r[20],

        pg1:
          r[21],

        pg2:
          r[22]

      },

      canThucTe: {

        cat1:
          calc(r[14]),

        da1:
          calc(r[15]),

        da2:
          calc(r[16]),

        cat2:
          calc(r[17]),

        xiMang1:
          calc(r[18]),

        xiMang2:
          calc(r[19]),

        nuoc:
          calc(r[20]),

        pg1:
          calc(r[21]),

        pg2:
          calc(r[22])

      }

    };

  }


  return {

    success: false,

    message:
      "Không tìm thấy phiếu " +
      maPhieu

  };

}


// ============================================================
// THÔNG TIN KHÁCH HÀNG
// ============================================================

function getKhachHangInfo_(
  ten
) {

  const list =
    layKhachHang();


  const found =
    list.find(
      function(x) {

        return (
          key_(x.ten) ===
          key_(ten)
        );

      }
    );


  return found

    ?

    {
      diaChi:
        found.diaChi
    }

    :

    {
      diaChi:
        ""
    };

}


// ============================================================
// TÀI XẾ INFO
// ============================================================

function getTaiXeInfo_(ma, bienSo) {
  const sh = getSheet_(SHEET_TAI_XE);
  if (!sh || sh.getLastRow() < 2) return {hoTen:"",bienSo:"",bienSoList:[]};
  const data = sh.getRange(2,1,sh.getLastRow()-1,5).getValues();
  const target = text_(ma);
  const chosen = text_(bienSo);
  let hoTen = "";
  const bienSoList = [];

  // Tìm tên từ mã tài xế được đăng nhập.
  for (let i=0;i<data.length;i++) {
    if (text_(data[i][0]) === target && text_(data[i][4]) === "Đang hoạt động") {
      hoTen = text_(data[i][1]);
      break;
    }
  }

  // Gộp toàn bộ xe đang hoạt động của tất cả các dòng trùng tên.
  if (hoTen) {
    for (let i=0;i<data.length;i++) {
      if (text_(data[i][4]) !== "Đang hoạt động") continue;
      if (key_(data[i][1]) !== key_(hoTen)) continue;
      const bs = text_(data[i][2]);
      if (bs && bienSoList.indexOf(bs) < 0) bienSoList.push(bs);
    }
  }

  return {
    hoTen: hoTen,
    bienSo: chosen || (bienSoList[0] || ""),
    bienSoList: bienSoList
  };
}

function layBienSoTheoTaiXe(maTaiXe) {
  return getTaiXeInfo_(maTaiXe).bienSoList;
}

function kiemTraBienSoTaiXe_(maTaiXe, bienSo) {
  const bs = text_(bienSo);
  if (!bs) return false;
  const info = getTaiXeInfo_(maTaiXe, bs);
  return info.bienSoList.indexOf(bs) >= 0;
}

// Hàm public để HTML gọi được khi tài xế xác nhận biển số.
function kiemTraBienSoTaiXe(maTaiXe, bienSo) {
  maTaiXe = text_(maTaiXe);
  bienSo = text_(bienSo);
  if (!maTaiXe || !bienSo) return false;
  return kiemTraBienSoTaiXe_(maTaiXe, bienSo);
}

function tinhLuyKeTuDong_(khachHang, duAn) {
  const sh = getSheet_(SHEET_NHAT_KY);
  if (!sh || sh.getLastRow() < 2) return 0;
  const data = sh.getRange(2,1,sh.getLastRow()-1,Math.max(14,sh.getLastColumn())).getValues();
  let total = 0;
  data.forEach(function(r){
    if (text_(r[4]) !== text_(khachHang) || text_(r[5]) !== text_(duAn)) return;
    if (text_(r[12]) === "Thất bại") return;
    const q = Number(r[10]);
    if (Number.isFinite(q)) total += q;
  });
  return total;
}

// ============================================================
// HEADER PHIEU
// ============================================================

function suaHeaderPhieu() {

  const sh =
    getSheet_(
      SHEET_PHIEU
    );


  if (!sh) {

    throw new Error(
      "Không tìm thấy sheet PHIEU."
    );

  }


  sh
    .getRange(
      1,
      1,
      1,
      26
    )
    .setValues([[
      "SỐ PHIẾU",
      "ĐƠN VỊ MUA HÀNG",
      "DỰ ÁN",
      "KD",
      "THỜI GIAN XUẤT PHÁT",
      "THỜI GIAN ĐẾN CÔNG TRÌNH",
      "MÁC BÊ TÔNG",
      "ĐƠN VỊ TÍNH",
      "ĐỘ SỤT",
      "SỐ LƯỢNG",
      "LŨY KẾ",
      "TRẠNG THÁI",
      "TÀI XẾ",
      "MẪU PHIẾU",
      "CÁT 1",
      "ĐÁ 1",
      "ĐÁ 2",
      "CÁT 2",
      "XI MĂNG 1",
      "XI MĂNG 2",
      "NƯỚC",
      "PG1",
      "PG2",
      "BIỂN SỐ XE",
      "LOẠI VẬN HÀNH",
      "ĐỊA ĐIỂM XUẤT PHIẾU"
    ]]);


  return {

    success:true,

    message:
      "Đã sửa header PHIEU."

  };

}


// ============================================================
// HEADER DU_AN
// ============================================================

function suaHeaderDuAn() {

  const sh =
    ensureDuAnSheet_();


  sh
    .getRange(
      1,
      1,
      1,
      4
    )
    .setValues([[
      "MÃ DỰ ÁN",
      "TÊN DỰ ÁN",
      "ĐỊA CHỈ",
      "TRẠNG THÁI"
    ]]);


  return {

    success:true,

    message:
      "Đã sửa header DU_AN."

  };

}


// ============================================================
// HEADER CAP_PHOI
// ============================================================

function suaHeaderCapPhoi() {

  const sh =
    ensureCapPhoiSheet_();


  sh
    .getRange(
      1,
      1,
      1,
      13
    )
    .setValues([[
      "ĐƠN VỊ MUA HÀNG",
      "DỰ ÁN",
      "MÁC BÊ TÔNG (KG/CM3)",
      "ĐỘ SỤT (CM)",
      "CÁT 1",
      "ĐÁ 1",
      "ĐÁ 2",
      "CÁT 2",
      "XI MĂNG 1",
      "XI MĂNG 2",
      "NƯỚC",
      "PG1",
      "PG2"
    ]]);


  return {

    success:true,

    message:
      "Đã sửa header CAP_PHOI."

  };

}


// ============================================================
// HEADER NHAT_KY
// ============================================================

function suaHeaderNhatKy() {

  const sh =
    getSheet_(
      SHEET_NHAT_KY
    );


  if (!sh) {

    throw new Error(
      "Không tìm thấy sheet NHAT_KY."
    );

  }


  sh
    .getRange(
      1,
      1,
      1,
      17
    )
    .setValues([[
      "SỐ PHIẾU",
      "TÀI XẾ",
      "XUẤT PHÁT",
      "ĐẾN CÔNG TRÌNH",
      "ĐƠN VỊ MUA HÀNG",
      "DỰ ÁN",
      "KD",
      "MÁC",
      "ĐVT",
      "ĐỘ SỤT",
      "SỐ LƯỢNG",
      "LŨY KẾ",
      "TRẠNG THÁI",
      "MẪU PHIẾU",
      "BIỂN SỐ XE",
      "LOẠI VẬN HÀNH",
      "ĐỊA ĐIỂM XUẤT PHIẾU"
    ]]);


  return {

    success:true,

    message:
      "Đã sửa header NHAT_KY."

  };

}

// ============================================================
// THÍ NGHIỆM
// Xem phiếu theo khách hàng + dự án, đánh dấu ĐÃ XEM, và KÝ phiếu.
// Ký xong -> ghi 1 dòng vào THONG_KE_PHIEU_TN và phiếu biến mất khỏi
// danh sách (KHÔNG đụng vào cột TRẠNG THÁI vận hành ở PHIEU/NHAT_KY,
// trạng thái Thí nghiệm được lưu riêng ở cột R:T của NHAT_KY).
// ============================================================

function laThiNghiem_(maNguoiDung) {
  const sh = getSheet_(SHEET_TAI_KHOAN);
  if (!sh) return false;

  const data = sh.getDataRange().getValues();
  const ma = text_(maNguoiDung);

  for (let i = 1; i < data.length; i++) {
    if (
      text_(data[i][0]) === ma &&
      text_(data[i][3]) === "Thí nghiệm" &&
      text_(data[i][4]) === "Đang hoạt động"
    ) {
      return true;
    }
  }

  return false;
}

function getHoTenTaiKhoan_(ma) {
  ma = text_(ma);
  if (!ma) return "";

  const sh = getSheet_(SHEET_TAI_KHOAN);
  if (!sh || sh.getLastRow() < 2) return "";

  const data = sh.getDataRange().getValues();
  for (let i = 1; i < data.length; i++) {
    if (text_(data[i][0]) === ma) return text_(data[i][1]);
  }

  return "";
}

// Đảm bảo NHAT_KY có 3 cột R:T dành riêng cho trạng thái Thí nghiệm.
function ensureCotThiNghiemNhatKy_() {
  const nk = getSheet_(SHEET_NHAT_KY);
  if (!nk) return null;

  const neededCols = 20;
  if (nk.getMaxColumns() < neededCols) {
    nk.insertColumnsAfter(nk.getMaxColumns(), neededCols - nk.getMaxColumns());
  }

  if (!text_(nk.getRange(1, 18).getValue())) {
    nk.getRange(1, 18, 1, 3).setValues([[
      "TRẠNG THÁI THÍ NGHIỆM",
      "NGƯỜI KÝ (TN)",
      "THỜI GIAN KÝ (TN)"
    ]]);
  }

  return nk;
}

function ensureThongKePhieuTNSheet_() {
  const ss = getSpreadsheet();
  let sh = ss.getSheetByName(SHEET_THONG_KE_PHIEU_TN);

  if (!sh) {
    sh = ss.insertSheet(SHEET_THONG_KE_PHIEU_TN);

    sh.getRange(1, 1, 1, 17).setValues([[
      "SỐ PHIẾU",
      "ĐƠN VỊ MUA HÀNG",
      "DỰ ÁN",
      "KD",
      "MÁC",
      "ĐỘ SỤT",
      "SỐ LƯỢNG",
      "ĐVT",
      "LŨY KẾ",
      "TÀI XẾ",
      "BIỂN SỐ XE",
      "LOẠI VẬN HÀNH",
      "ĐỊA ĐIỂM XUẤT PHIẾU",
      "TRẠNG THÁI VẬN HÀNH",
      "MÃ NGƯỜI KÝ",
      "HỌ TÊN NGƯỜI KÝ",
      "THỜI GIAN KÝ"
    ]]);

    sh.getRange(1, 1, 1, 17).setFontWeight("bold");
    sh.setFrozenRows(1);
  }

  return sh;
}

// Dự án không gắn cứng với khách hàng ở sheet DU_AN, nên danh sách "dự án
// tương ứng" của 1 khách hàng phải suy ra từ lịch sử phiếu ở NHAT_KY.
function layDuAnTheoKhachHangTN(khachHang) {
  khachHang = text_(khachHang);
  if (!khachHang) return [];

  const nk = getSheet_(SHEET_NHAT_KY);
  if (!nk || nk.getLastRow() < 2) return [];

  const data = nk.getRange(2, 5, nk.getLastRow() - 1, 2).getValues();
  const seen = {};
  const result = [];

  for (let i = 0; i < data.length; i++) {
    const kh = text_(data[i][0]);
    const da = text_(data[i][1]);
    if (kh !== khachHang || !da) continue;

    const k = key_(da);
    if (seen[k]) continue;
    seen[k] = true;

    result.push(da);
  }

  result.sort();
  return result;
}

// Toàn bộ phiếu (mọi trạng thái vận hành) của 1 khách hàng + 1 dự án,
// trừ những phiếu đã được Thí nghiệm bấm KÝ.
function layDanhSachPhieuThiNghiem(khachHang, duAn) {
  khachHang = text_(khachHang);
  duAn = text_(duAn);

  if (!khachHang || !duAn) {
    return {success:false, message:"Vui lòng chọn khách hàng và dự án.", rows:[]};
  }

  const nk = ensureCotThiNghiemNhatKy_();
  if (!nk || nk.getLastRow() < 2) {
    return {success:true, rows:[]};
  }

  const data = nk.getRange(2, 1, nk.getLastRow() - 1, 20).getValues();
  const result = [];

  for (let i = 0; i < data.length; i++) {
    const r = data[i];
    if (text_(r[4]) !== khachHang) continue;
    if (text_(r[5]) !== duAn) continue;

    const trangThaiTN = text_(r[17]) || "Chưa xem";
    if (trangThaiTN === "Đã ký") continue;

    result.push({
      maPhieu: text_(r[0]),
      taiXe: text_(r[1]),
      khachHang: text_(r[4]),
      duAn: text_(r[5]),
      kd: text_(r[6]),
      mac: text_(r[7]),
      dvt: text_(r[8]),
      doSut: text_(r[9]),
      soLuong: r[10],
      luyKe: r[11],
      trangThaiVanHanh: text_(r[12]),
      mauPhieu: normalizeMau_(r[13]) || "1",
      bienSo: text_(r[14]),
      loaiVanHanh: text_(r[15]),
      diaDiemXuatPhieu: text_(r[16]),
      trangThaiTN: trangThaiTN
    });
  }

  return {success:true, rows:result};
}

function danhDauDaXemPhieuTN(maPhieu, maNguoiDung) {
  if (!laThiNghiem_(maNguoiDung)) {
    return {success:false, message:"Bạn không có quyền Thí nghiệm."};
  }

  maPhieu = text_(maPhieu);
  if (!maPhieu) return {success:false, message:"Thiếu số phiếu."};

  const nk = ensureCotThiNghiemNhatKy_();
  const row = timDongNhatKy_(maPhieu);
  if (!row) return {success:false, message:"Không tìm thấy phiếu trong NHẬT KÝ."};

  const current = text_(nk.getRange(row, 18).getValue());
  if (current === "Đã ký") {
    return {success:false, message:"Phiếu này đã được ký, không thể thay đổi."};
  }

  nk.getRange(row, 18).setValue("Đã xem");

  return {success:true, message:"Đã đánh dấu ĐÃ XEM.", trangThaiTN:"Đã xem"};
}

function kyPhieuThiNghiem(maPhieu, maNguoiDung) {
  if (!laThiNghiem_(maNguoiDung)) {
    return {success:false, message:"Bạn không có quyền Thí nghiệm."};
  }

  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(15000);
  } catch (e) {
    return {success:false, message:"Hệ thống đang xử lý. Vui lòng thử lại."};
  }

  try {
    maPhieu = text_(maPhieu);
    maNguoiDung = text_(maNguoiDung);
    if (!maPhieu) return {success:false, message:"Thiếu số phiếu."};

    const nk = ensureCotThiNghiemNhatKy_();
    const row = timDongNhatKy_(maPhieu);
    if (!row) return {success:false, message:"Không tìm thấy phiếu trong NHẬT KÝ."};

    const data = nk.getRange(row, 1, 1, 20).getValues()[0];

    if (text_(data[17]) === "Đã ký") {
      return {success:false, message:"Phiếu này đã được ký trước đó."};
    }

    const now = new Date();
    const hoTenNguoiKy = getHoTenTaiKhoan_(maNguoiDung);

    const tk = ensureThongKePhieuTNSheet_();
    tk.appendRow([
      text_(data[0]),
      text_(data[4]),
      text_(data[5]),
      text_(data[6]),
      text_(data[7]),
      text_(data[9]),
      data[10],
      text_(data[8]),
      data[11],
      text_(data[1]),
      text_(data[14]),
      text_(data[15]),
      text_(data[16]),
      text_(data[12]),
      maNguoiDung,
      hoTenNguoiKy,
      now
    ]);

    nk.getRange(row, 18, 1, 3).setValues([[
      "Đã ký",
      maNguoiDung + (hoTenNguoiKy ? (" - " + hoTenNguoiKy) : ""),
      now
    ]]);

    return {
      success:true,
      message:"Đã ký phiếu và lưu vào THONG_KE_PHIEU_TN.",
      maPhieu:maPhieu
    };

  } finally {
    lock.releaseLock();
  }
}

// ============================================================
// API JSON CHO PHIEN BAN CHAY LOCAL NODE.JS / VS CODE
// ============================================================
function jsonResponse_(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  try {
    const raw = e && e.postData && e.postData.contents ? e.postData.contents : "{}";
    const body = JSON.parse(raw);
    const action = text_(body.action);
    const args = Array.isArray(body.args) ? body.args : [];

    if (!action) {
      return jsonResponse_({success:false,message:"Thiếu action."});
    }

    // Không cho phép gọi các hàm nội bộ theo quy ước tên kết thúc bằng _. 
    if (action.endsWith("_")) {
      return jsonResponse_({success:false,message:"Không được phép gọi API nội bộ."});
    }

    const fn = globalThis[action];
    if (typeof fn !== "function") {
      return jsonResponse_({success:false,message:"Không tìm thấy API: " + action});
    }

    const result = fn.apply(null, args);
    return jsonResponse_(result === undefined ? {success:true} : result);
  } catch (error) {
    return jsonResponse_({
      success:false,
      message:error && error.message ? error.message : String(error)
    });
  }
}
