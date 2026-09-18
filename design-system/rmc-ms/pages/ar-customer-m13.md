# M13 — Nghiệm thu, Hoá đơn & Công nợ khách hàng

> Rules here override `design-system/rmc-ms/MASTER.md`. This is the screen the original plan called "dashboard khách (wallet, subscriptions)" — renamed to match RMC-MS's real domain: there is no wallet/subscription concept here, only credit limit, invoicing and AR aging against contracts.

## Layout

- Customer detail page, not a generic wallet UI:
  1. Header: tên khách hàng, mã KH, chi nhánh phụ trách, NVKD
  2. KPI row (reuse `<KpiCard>` from M14): Hạn mức tín dụng, Dư nợ hiện tại, Khả dụng (hạn mức − dư nợ), DSO (ngày)
  3. "Nghiệm thu" table: Σ phiếu giao đã ký theo công trình/kỳ, trạng thái đã xuất hoá đơn / chưa
  4. "Công nợ" table: hoá đơn, ngày phát hành, hạn thanh toán, số ngày quá hạn (color-coded pill, paired with text, not color alone), đã thu/chưa thu
  5. Lịch sử thanh toán (timeline hoặc table, không phải chart) — % đúng hạn hiển thị dạng số + label, không chỉ progress bar

## Components (Next.js / shadcn)

| Component | Base | Notes |
|---|---|---|
| `<CreditLimitKpi>` | reuses `<KpiCard>` | khả dụng < 10% hạn mức → warning state (icon + label, not color alone) |
| `<InvoiceTable>` | shadcn `Table` | quá hạn rows sortable by "số ngày quá hạn" descending by default |
| `<DeliveryNoteRollup>` | shadcn `Table` + row-click → detail sheet | "Σ phiếu đã ký" ties directly to M12 delivery-note signing, per CLAUDE.md core-flow (Order → Plan → Trip → DeliveryNote) |
| `<PaymentHistoryList>` | plain list | on-time badge uses check icon + "Đúng hạn", not just green text |

## Do NOT

- Do not use "Ví" (wallet) or "Gói/Subscription" terminology or UI patterns (top-up balance, recurring plan cards) — RMC-MS customers operate on contracts + credit limit + invoicing, a fundamentally different mental model from a prepaid wallet
