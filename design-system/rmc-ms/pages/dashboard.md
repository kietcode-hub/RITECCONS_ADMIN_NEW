# Dashboard Page Overrides (M14 — Báo cáo & Dashboard, also applies to M08 planning grid / M10 dispatch board)

> **PROJECT:** RMC-MS
> **Page Type:** Data-dense dashboard (internal, behind login)

> ⚠️ Rules here override `design-system/rmc-ms/MASTER.md`. Only deviations are documented.

> **Override note:** the raw search injected a marketing "Hero (Video/Mission) > Solutions by Industry > Client Logos > Contact Sales" section order and a "Contact Sales" CTA — both are SaaS-marketing-page artifacts that do not apply to an authenticated internal dashboard. Replaced below with the actual section order already validated in the existing mock `design/dashboard-hop-nhat-3CN.html`, which this design system formalizes into Next.js components.

---

## Layout

- **Max width:** full-width content area (sidebar-offset), inner content capped at 1180px for readability of KPI/table rows
- **Grid:** 12-column, `--grid-gap: 8px`, `--card-padding: 12px` (from `data-dense-dashboard` style)
- **Section order (top to bottom):**
  1. Scope/period selector — segmented control: "Toàn công ty / CN1 / CN2 / CN3" × "Hôm qua / Tháng này"
  2. KPI hero row — 5-6 stat cards (sản lượng m³, doanh thu, giá bán BQ/m³, công nợ quá hạn, biên LN gộp)
  3. So sánh chi nhánh — 3 expandable branch cards (status pill ok/warn, progress bar vs KH, click to expand root-cause note)
  4. Xu hướng giá bán bình quân/m³ — line chart, 3 series (CN1/CN2/CN3), filter by mác bê tông + range (7/30/90 ngày)
  5. Chờ duyệt — approval cards (giá dưới sàn, hạn mức công nợ) with approve/reject + note modal
  6. Nguồn lực đội xe — table per branch (mixer/pump availability) + "Điều chuyển →" action
  7. Cảnh báo vận hành — alert list (branch tag + message, severity dot)
- **No hero video, no client logos, no "Contact Sales" CTA** — this is an internal ops screen, not a marketing page

## Density & Spacing

- Content density: high (`--space-md: 8px` between KPI cards, `--space-lg: 12px` card padding)
- Sticky section headers on scroll for long tables (fleet table)

## Color Strategy

- Corporate navy/grey base (Master palette), conservative accents — confirmed correct, no override
- KPI cards use decorative gradient accents (orange/green/teal/pink/purple) **only** on the card's icon chip + footer bar, never as the only signal of good/bad — status pills and arrows (▲▼) carry the actual meaning (`color-not-only`)
- Branch status: `ok` → left border `--color-accent`-adjacent green; `warn` → `--color-destructive` — always paired with a text pill ("Đạt KH" / "Thấp hơn KH 18%"), never color alone

## Components (Next.js / shadcn)

| Component | Base | Notes |
|---|---|---|
| `<KpiCard>` | shadcn `Card` | icon chip (Phosphor, 20px) + value (tabular-nums, JetBrains Mono) + delta pill (▲/▼ + %) |
| `<BranchCompareCard>` | shadcn `Card` (collapsible) | click/tap toggles `<BranchDetail>`; keyboard: `Enter`/`Space` toggles, `aria-expanded` |
| `<TrendChart>` | Recharts `LineChart` | 3 series solid/dashed/dotted line styles (not hue-only, per `color-guidance`), legend above chart, tooltip on hover+focus |
| `<ApprovalCard>` | shadcn `Card` + `Dialog` for decision note | approve = success button, reject = ghost/outline; decided state replaces actions with a banner, never removes the card |
| `<FleetAvailabilityTable>` | shadcn `Table` | sortable, `aria-sort`; availability bar = track + filled bar + numeric label (not bar alone) |
| `<OpsAlertList>` | plain list | severity dot + branch tag + message; dot color paired with an icon (⚠ vs ℹ) not color alone |

## Effects

- Hover tooltips on chart points and table rows
- Row highlight on hover (background only, no transform — avoids CLS in dense tables)
- Data loading: skeleton rows/cards, not a full-page spinner
- Chart zoom on click optional (not required for MVP)

## Accessibility

- Chart has a visually-hidden data table fallback (`sr-only` `<table>`) summarizing the same series
- KPI delta arrows have `aria-label` ("tăng 6,2% so hôm trước"), not just a visual glyph
- Approval decision buttons are real `<button>` elements with accessible names ("Duyệt đề nghị giá dưới sàn — Công ty TNHH Xây dựng ABC")
