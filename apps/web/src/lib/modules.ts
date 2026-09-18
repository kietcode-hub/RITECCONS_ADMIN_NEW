import { UserRole } from '@rmc-ms/shared-types'

export interface ModuleDef {
  code: string
  name: string
  group: string
  path: string
  /** Ten thu muc trong apps/api/src/modules/<folder> (theo bang map M01-M16 trong CLAUDE.md) */
  folder: string
  live: boolean
  desc: string
}

export const MODULES: ModuleDef[] = [
  { code: 'M14', name: 'Báo cáo & Dashboard', group: 'TỔNG QUAN', path: '/dashboard', folder: 'reporting', live: true, desc: 'Dashboard điều hành, báo cáo sản lượng/doanh thu, so sánh 3 chi nhánh.' },
  { code: 'M01', name: 'Quản trị hệ thống & Nhân sự', group: 'QUẢN TRỊ', path: '/admin', folder: 'admin', live: true, desc: 'Cây tổ chức đa chi nhánh, người dùng, vai trò, uỷ quyền, audit log.' },
  { code: 'M02', name: 'Khách hàng – Công trình – Cơ hội', group: 'KINH DOANH', path: '/crm', folder: 'crm', live: false, desc: 'CRM: hồ sơ khách hàng, công trình, pipeline cơ hội bán.' },
  { code: 'M03', name: 'Bảng giá – Báo giá', group: 'KINH DOANH', path: '/pricing', folder: 'pricing', live: true, desc: 'Pricing engine, giá sàn, luồng phê duyệt giá dưới sàn.' },
  { code: 'M04', name: 'Hợp đồng – Hạn mức', group: 'KINH DOANH', path: '/contract', folder: 'contract', live: false, desc: 'Hợp đồng, phụ lục giá, hạn mức công nợ.' },
  { code: 'M05', name: 'Đơn hàng & Yêu cầu cấp bê tông', group: 'KINH DOANH', path: '/orders', folder: 'order', live: true, desc: 'Tiếp nhận đơn, kiểm tra hạn mức công nợ (BRULE-02), cờ đơn gấp.' },
  { code: 'M06', name: 'Cấp phối & Định mức', group: 'KỸ THUẬT', path: '/mixdesign', folder: 'mixdesign', live: false, desc: 'Thư viện cấp phối dùng chung 3 CN, định mức vật tư/m³.' },
  { code: 'M07', name: 'Chất lượng & Thí nghiệm', group: 'KỸ THUẬT', path: '/quality', folder: 'quality', live: false, desc: 'Độ sụt hiện trường, mẫu R7/R28, hồ sơ chất lượng.' },
  { code: 'M08', name: 'Kế hoạch sản xuất ngày/ca', group: 'KẾ HOẠCH', path: '/planning', folder: 'planning', live: false, desc: 'Grid giờ × trạm, cảnh báo vượt công suất, nhu cầu vật tư.' },
  { code: 'M09', name: 'Vật tư – Tồn silo', group: 'KẾ HOẠCH', path: '/material', folder: 'material', live: false, desc: 'Theo dõi tồn, dự báo, đề nghị mua.' },
  { code: 'M10', name: 'Bảng điều phối & Quản lý chuyến', group: 'ĐIỀU HÀNH', path: '/dispatch', folder: 'dispatch', live: false, desc: 'Màn hình trung tâm của Điều hành — realtime, cảnh báo trễ.' },
  { code: 'M11', name: 'Đội xe – Tài xế – Xe bơm', group: 'ĐIỀU HÀNH', path: '/fleet', folder: 'fleet', live: false, desc: 'Hồ sơ xe mixer, xe bơm, tài xế, sản lượng theo xe.' },
  { code: 'M12', name: 'Phiếu giao hàng điện tử', group: 'ĐIỀU HÀNH', path: '/delivery', folder: 'delivery', live: false, desc: 'Ký nhận điện tử, hoạt động offline.' },
  { code: 'M13', name: 'Nghiệm thu – Hóa đơn – Công nợ', group: 'TÀI CHÍNH', path: '/ar', folder: 'ar', live: true, desc: 'Nghiệm thu = Σ phiếu đã ký, đề nghị hóa đơn, công nợ.' },
  { code: 'M16', name: 'Tích hợp', group: 'TÍCH HỢP', path: '/integration', folder: 'integration', live: false, desc: 'Trạm trộn, GPS, hoá đơn điện tử, kế toán, Zalo/SMS.' },
]

export const GROUP_ORDER = [
  'TỔNG QUAN',
  'KINH DOANH',
  'KỸ THUẬT',
  'KẾ HOẠCH',
  'ĐIỀU HÀNH',
  'TÀI CHÍNH',
  'QUẢN TRỊ',
  'TÍCH HỢP',
]

/**
 * Access map theo persona demo that trong AuthService (apps/api/src/modules/auth/auth.service.ts)
 * -- khong phai RBAC that, chi la UX hint o FE; nguon that thuc thi o service layer (BRULE-17).
 */
export const ROLE_ACCESS: Record<UserRole, string[] | 'ALL'> = {
  [UserRole.SALES_REP]: ['M02', 'M03', 'M04', 'M05', 'M14'],
  [UserRole.SALES_MANAGER]: ['M02', 'M03', 'M04', 'M05', 'M14'],
  [UserRole.TECHNICAL_STAFF]: ['M02', 'M05', 'M06', 'M07'],
  [UserRole.TECHNICAL_MANAGER]: ['M02', 'M05', 'M06', 'M07'],
  [UserRole.PLANNING_STAFF]: ['M05', 'M08', 'M09'],
  [UserRole.DISPATCHER]: ['M10', 'M11', 'M12'],
  [UserRole.DISPATCH_MANAGER]: ['M10', 'M11', 'M12'],
  [UserRole.DRIVER]: ['M12'],
  [UserRole.ACCOUNTANT]: ['M02', 'M04', 'M13'],
  [UserRole.BRANCH_MANAGER]: 'ALL',
  [UserRole.EXECUTIVE]: 'ALL',
  [UserRole.ADMIN]: ['M01', 'M16'],
}

export const ROLE_LABEL: Record<UserRole, string> = {
  [UserRole.SALES_REP]: 'Nhân viên Kinh doanh',
  [UserRole.SALES_MANAGER]: 'Trưởng phòng Kinh doanh',
  [UserRole.TECHNICAL_STAFF]: 'Nhân viên Kỹ thuật',
  [UserRole.TECHNICAL_MANAGER]: 'Trưởng Kỹ thuật công ty',
  [UserRole.PLANNING_STAFF]: 'Nhân viên Kế hoạch',
  [UserRole.DISPATCHER]: 'Điều hành (Dispatcher)',
  [UserRole.DISPATCH_MANAGER]: 'Trưởng Điều hành',
  [UserRole.DRIVER]: 'Tài xế',
  [UserRole.ACCOUNTANT]: 'Kế toán',
  [UserRole.BRANCH_MANAGER]: 'Giám đốc chi nhánh',
  [UserRole.EXECUTIVE]: 'Ban lãnh đạo công ty',
  [UserRole.ADMIN]: 'Quản trị hệ thống',
}

export function hasModuleAccess(role: UserRole | undefined, code: string): boolean {
  if (!role) return false
  const access = ROLE_ACCESS[role]
  return access === 'ALL' || access.includes(code)
}
