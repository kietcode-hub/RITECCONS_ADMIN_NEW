# Design System Master File

> **LOGIC:** When building a specific page, first check `design-system/pages/[page-name].md`.
> If that file exists, its rules **override** this Master file.
> If not, strictly follow the rules below.

---

**Project:** RMC-MS
**Generated:** 2026-09-18 14:09:58
**Category:** B2B Service
**Design Dials:** Variance 3/10 (Centered / Minimal) | Motion 3/10 (Subtle) | Density 8/10 (Dense / Dashboard)

---

## Global Rules

### Color Palette

| Role | Hex | CSS Variable |
|------|-----|--------------|
| Primary | `#0F172A` | `--color-primary` |
| On Primary | `#FFFFFF` | `--color-on-primary` |
| Secondary | `#334155` | `--color-secondary` |
| On Secondary | `#FFFFFF` | `--color-on-secondary` |
| Accent/CTA | `#0369A1` | `--color-accent` |
| On Accent/CTA | `#FFFFFF` | `--color-on-accent` |
| Background | `#F8FAFC` | `--color-background` |
| Foreground | `#020617` | `--color-foreground` |
| Card | `#FFFFFF` | `--color-card` |
| Card Foreground | `#020617` | `--color-card-foreground` |
| Muted | `#E8ECF1` | `--color-muted` |
| Muted Foreground | `#475569` | `--color-muted-foreground` |
| Border | `#E2E8F0` | `--color-border` |
| Destructive | `#DC2626` | `--color-destructive` |
| On Destructive | `#FFFFFF` | `--color-on-destructive` |
| Ring | `#0F172A` | `--color-ring` |

**Color Notes:** Professional navy + blue CTA

### Typography

> **Override note:** the raw search picked "Calistoga / Inter" (mood: boutique, warm, editorial) — that pairing targets SaaS marketing sites, not a dense internal B2B tool, and Calistoga is a display serif with weak Vietnamese diacritic coverage. Overridden below with a verified `typography --domain` match ("Dashboard Data") that fits RMC-MS's actual screens (data tables, KPI cards, dispatch board) and keeps continuity with the existing `design/*.html` mocks, which already use Inter.

- **Heading/Body Font:** Inter (single family — headings via weight 600–700, body 400–500; excellent Vietnamese diacritic support, matches existing `design/` mocks)
- **Tabular/Numeric Font:** JetBrains Mono — use only for numeric columns that must align (m³, VNĐ, order codes, dates) per `number-tabular` guideline, not for prose
- **Mood:** clean, precise, professional, data-first, operations
- **Google Fonts:** [Inter + JetBrains Mono](https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap)

**CSS Import:**
```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap');
```

**Tailwind config:**
```js
fontFamily: {
  sans: ['Inter', 'sans-serif'],
  mono: ['JetBrains Mono', 'monospace'],
}
```

### Spacing Variables

*Density: 8/10 — Dense / Dashboard*

| Token | Value | Usage |
|-------|-------|-------|
| `--space-xs` | `2px` / `0.125rem` | Tight gaps |
| `--space-sm` | `4px` / `0.25rem` | Icon gaps, inline spacing |
| `--space-md` | `8px` / `0.5rem` | Standard padding |
| `--space-lg` | `12px` / `0.75rem` | Section padding |
| `--space-xl` | `16px` / `1rem` | Large gaps |
| `--space-2xl` | `24px` / `1.5rem` | Section margins |
| `--space-3xl` | `32px` / `2rem` | Hero padding |

### Shadow Depths

| Level | Value | Usage |
|-------|-------|-------|
| `--shadow-sm` | `0 1px 2px rgba(0,0,0,0.05)` | Subtle lift |
| `--shadow-md` | `0 4px 6px rgba(0,0,0,0.1)` | Cards, buttons |
| `--shadow-lg` | `0 10px 15px rgba(0,0,0,0.1)` | Modals, dropdowns |
| `--shadow-xl` | `0 20px 25px rgba(0,0,0,0.15)` | Hero images, featured cards |

---

## Component Specs

### Buttons

```css
/* Primary Button */
.btn-primary {
  background: #0369A1;
  color: white;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  transition: all 200ms ease;
  cursor: pointer;
}

.btn-primary:hover {
  opacity: 0.9;
  transform: translateY(-1px);
}

/* Secondary Button */
.btn-secondary {
  background: transparent;
  color: #0F172A;
  border: 2px solid #0F172A;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  transition: all 200ms ease;
  cursor: pointer;
}
```

### Cards

```css
.card {
  background: #F8FAFC;
  border-radius: 12px;
  padding: 24px;
  box-shadow: var(--shadow-md);
  transition: all 200ms ease;
  cursor: pointer;
}

.card:hover {
  box-shadow: var(--shadow-lg);
  transform: translateY(-2px);
}
```

### Inputs

```css
.input {
  padding: 12px 16px;
  border: 1px solid #E2E8F0;
  border-radius: 8px;
  font-size: 16px;
  transition: border-color 200ms ease;
}

.input:focus {
  border-color: #0F172A;
  outline: none;
  box-shadow: 0 0 0 3px #0F172A20;
}
```

### Modals

```css
.modal-overlay {
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
}

.modal {
  background: white;
  border-radius: 16px;
  padding: 32px;
  box-shadow: var(--shadow-xl);
  max-width: 500px;
  width: 90%;
}
```

---

## Style Guidelines

**Style:** Minimalism & Swiss Style

**Keywords:** Clean, simple, spacious, functional, white space, high contrast, geometric, sans-serif, grid-based, essential

**Best For:** Enterprise apps, dashboards, documentation sites, SaaS platforms, professional tools

**Key Effects:** Subtle hover (200-250ms), smooth transitions, sharp shadows if any, clear type hierarchy, fast loading

### Page Pattern

> **Override note:** the raw search returned "Trust & Authority + Conversion" — a marketing-landing pattern (hero, proof/logos, CTA) meant to convert an anonymous visitor. RMC-MS has no public landing page; every screen sits behind login for 8 known internal roles. Replaced with the app-shell pattern for internal tools, confirmed against the `data-dense-dashboard` style match (`--domain style`, styles.csv) for the data-heavy screens (M08/M10/M14).

**Pattern Name:** Authenticated App Shell (internal ops tool)

- **Shell:** Persistent dark sidebar (module nav, role-scoped — locked items show 🔒) + light content area + topbar (branch/role context, notifications, search)
- **Screen Pattern by page type:**
  - Data-dense screens (M08 planning grid, M10 dispatch board, M14 dashboard) → apply `data-dense-dashboard` style: 12-col grid, 8-12px padding, sticky headers, KPI card row, sortable tables
  - Record + validation screens (M05 order, M03 pricing approval) → split layout: list/table left or top, form + live rule-check panel right
  - Admin/CRUD screens (M01 users, M04 contracts) → standard `data-table` + row-click detail, modal for create/edit
- **No public landing/marketing page** — first screen after `/` is the login screen (role-based demo login, see existing `design/app-shell-16-modules.html`)

---

## Motion

> **Override note:** the raw "Scroll Reveal" snippet targets marketing pages with below-the-fold content entering on scroll. RMC-MS pages are dashboards/tables viewed in full on load, not scrolled narrative content — GSAP/ScrollTrigger is unnecessary overhead here. Use plain CSS transitions instead.

- **Data load:** skeleton/shimmer placeholder → fade in content (150-200ms opacity transition), never a spinner blocking the whole page for >1s
- **Row/card hover:** background color transition only (150-200ms), no transform/scale (avoids layout jitter in dense tables)
- **Modal/sheet open-close:** scale(0.98→1) + fade, 200ms, respecting `prefers-reduced-motion`
- **Toast/notification:** slide+fade in 200ms, auto-dismiss 3-5s
- All transitions respect `prefers-reduced-motion: reduce` (skip to end state)

---

## Anti-Patterns (Do NOT Use)

- ❌ Playful design
- ❌ Hidden credentials
- ❌ AI purple/pink gradients

### Additional Forbidden Patterns

- ❌ **Emojis as icons** — Use SVG icons (Heroicons, Lucide, Simple Icons)
- ❌ **Missing cursor:pointer** — All clickable elements must have cursor:pointer
- ❌ **Layout-shifting hovers** — Avoid scale transforms that shift layout
- ❌ **Low contrast text** — Maintain 4.5:1 minimum contrast ratio
- ❌ **Instant state changes** — Always use transitions (150-300ms)
- ❌ **Invisible focus states** — Focus states must be visible for a11y

---

## Pre-Delivery Checklist

Before delivering any UI code, verify:

- [ ] No emojis used as icons (use SVG instead)
- [ ] All icons from consistent icon set (Heroicons/Lucide)
- [ ] `cursor-pointer` on all clickable elements
- [ ] Hover states with smooth transitions (150-300ms)
- [ ] Light mode: text contrast 4.5:1 minimum
- [ ] Focus states visible for keyboard navigation
- [ ] `prefers-reduced-motion` respected
- [ ] Responsive: 375px, 768px, 1024px, 1440px
- [ ] No content hidden behind fixed navbars
- [ ] No horizontal scroll on mobile
