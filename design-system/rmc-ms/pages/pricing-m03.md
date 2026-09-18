# M03 — Bảng giá & Báo giá (thay cho khái niệm "catalog")

> Rules here override `design-system/rmc-ms/MASTER.md`.

## Layout

- `data-dense-dashboard` style applies here too (this is a data table + approval workflow, not a product catalog grid)
- **Tab or segmented view:** "Bảng giá theo mác bê tông" | "Báo giá đang chờ duyệt"
- **Bảng giá tab:** sortable `data-table` — Mác bê tông, Giá sàn (VNĐ/m³), Giá niêm yết, Hiệu lực từ/đến, chi nhánh áp dụng, trạng thái (Đang áp dụng/Hết hạn)
- **Chờ duyệt tab:** approval cards identical in structure to the M14 dashboard's approval cards (reuse `<ApprovalCard>`) — filtered to "giá dưới sàn" requests only, so the pattern and the component are shared, not reinvented per module
- Row click on a bảng giá entry opens a detail drawer (shadcn `Sheet`), not a full page navigation, since the record set is small and users compare rows frequently

## Components (Next.js / shadcn)

| Component | Base | Notes |
|---|---|---|
| `<PriceTable>` | shadcn `Table` | numeric columns right-aligned, tabular-nums; giá dưới sàn rows get a `warn` left border, not just red text |
| `<ApprovalCard>` | reused from M14 dashboard spec | same component, filtered dataset |
| `<PriceDetailSheet>` | shadcn `Sheet` | shows lịch sử thay đổi giá (audit trail) — every price change is logged per CLAUDE.md audit-log requirement |

## Business-rule surfacing

- Any quote below giá sàn must show the % chênh lệch and route to the approval flow — mirror the wording already used in `design/dashboard-hop-nhat-3CN.html`'s approval card ("Giá đề xuất / Giá sàn / Chênh lệch") so NVKD and GĐ CN see identical numbers in both screens
- Do not let the UI silently allow submission below floor price — the disabled/blocked state must name the rule (matches `order-m05.md`'s BRULE surfacing pattern)
