# M01 — Quản trị hệ thống & Nhân sự (Admin)

> Rules here override `design-system/rmc-ms/MASTER.md`.

## Layout

- Standard `data-table` + modal-CRUD pattern (per MASTER "Admin/CRUD screens" rule), tabs: Người dùng | Chi nhánh | Uỷ quyền | Audit log
- **Người dùng tab:** table (avatar-sm, tên, email/SĐT, vai trò, chi nhánh phụ trách, trạng thái) + "Thêm người dùng" primary button → modal
- **Uỷ quyền tab:** table of active/expired delegations (Người uỷ quyền → Người nhận, phạm vi, từ/đến ngày) + "Tạo uỷ quyền" modal — must show a blocking validation message if the target tries to delegate the delegation forward (BRULE-19: no forward-delegation), matching `design/app-shell-16-modules.html`'s delegate modal copy
- **Audit log tab:** append-only table (thời gian, người thực hiện, hành động, đối tượng, chi nhánh) — filterable by date range + branch + user, no edit/delete actions available on this tab (it's an audit trail)

## Components (Next.js / shadcn)

| Component | Base | Notes |
|---|---|---|
| `<UserTable>` | shadcn `Table` | role + branch shown as `Badge` pairs, multi-branch users show all assigned branches |
| `<AddUserModal>` / `<DelegateModal>` | shadcn `Dialog` | confirm-before-destructive not needed here (creation only); multi-select branch field uses shadcn `Command`/checkbox list, not a bare native `<select multiple>` |
| `<AuditLogTable>` | shadcn `Table`, virtualized if >50 rows (`virtualize-lists`) | read-only, sortable by thời gian desc by default |

## Branch-scope note (ties to code)

- Every list here must respect the caller's `toBranchScope()` — a GĐ CN should never see or edit users/delegations outside their branch in the UI, even though the API already enforces this server-side (`BranchScopeExceptionFilter`). UI-side filtering is a UX convenience only, never the actual security boundary.
