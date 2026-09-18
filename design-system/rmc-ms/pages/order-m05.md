# M05 — Đơn hàng & Yêu cầu cấp bê tông

> Rules here override `design-system/rmc-ms/MASTER.md`. Maps to `apps/api/src/modules/order` (fully wired reference module — `order.service.ts` is the source of truth for the 4 rule checks below).

## Layout

- Split view, `lg:` 1.1fr / 0.9fr (per existing `design/app-shell-16-modules.html` `.split` pattern):
  - **Left/top card:** "Đơn hàng hôm nay" — dense list, sorted by giờ đổ, urgent orders flagged with a `danger` pill ("Gấp"), not color alone
  - **Right/bottom card:** "Tạo đơn mới" — form + live rule-check panel
- Form fields: Chi nhánh, Công trình, Ngày giờ đổ, Khối lượng (m³), Mác/độ sụt, Phương thức bơm — grouped in 2-col rows on desktop, 1-col on mobile (`field-grouping`)
- **4 kiểm tra tự động (BRULE-01..04)** rendered as a checklist between the form and the submit buttons, re-evaluated on every relevant field change (khối lượng, chi nhánh, giá trị đơn):
  1. Hợp đồng còn hiệu lực
  2. Hạn mức công nợ khả dụng (BRULE: hạn mức tín dụng — số dư khả dụng hiển thị cạnh trạng thái)
  3. Năng lực trạm & xe trong khung giờ
  4. Cấp phối phù hợp đã được duyệt
- Each check item: icon (pass=CheckCircle green / fail=XCircle red / wait=Clock grey, Phosphor — *no verified icon-dataset match for "truck/delivery" was found; these are general Phosphor picks, not a dataset-backed recommendation*) + label + right-aligned detail text
- Any **fail** state renders a `.banner.danger` directly under the checklist naming the specific BRULE violated and blocks the primary submit button (`disabled`, not hidden) — matches the pattern already in `order.service.ts` (`BadRequestException` with BRULE code)

## Components (Next.js / shadcn)

| Component | Base | Notes |
|---|---|---|
| `<OrderList>` | shadcn `Table`/list rows | urgent = `Badge variant="destructive"` + text "Gấp", never a bare red dot |
| `<OrderForm>` | shadcn `Form` (react-hook-form + zod) | validate on blur (`inline-validation`), each BRULE failure surfaces as a field-level error where it maps to a field (e.g. khối lượng too high → error under Khối lượng) *and* in the checklist |
| `<RuleCheckItem>` | custom, built on shadcn `Badge` | pass/fail/wait states share one component, icon+text pair (`color-not-only`) |
| `<UrgentFlagBadge>` | shadcn `Badge` | applies BRULE cut-off/urgent-order logic surfaced from `packages/business-rules` |

## States & Feedback

- Submit button shows loading spinner during the API call, then success toast ("Đã tạo đơn DH-CN…") or inline error naming the BRULE code, matching backend error strings (traceability requirement in CLAUDE.md)
- "Lưu nháp" is a secondary/ghost action, always enabled (drafts skip rule enforcement)
- Numeric fields (m³, giá trị đơn) use `inputMode="decimal"` / `type="number"` for correct mobile keyboard (`input-type-keyboard`) and tabular-nums (JetBrains Mono, per Master typography) for alignment
