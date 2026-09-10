# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository state

This is a monorepo (npm workspaces) implementing **RMC-MS** (Hệ thống Quản trị Sản xuất – Kinh doanh Bê tông Thương phẩm — a ready-mix concrete production/sales management system for a 3-branch company), built from the specification set in `files/`. The system is early-stage: a backbone (`business-rules`, `shared-types`, a NestJS API skeleton with one fully-wired module) exists; most feature modules are still placeholders. `apps/web` and `apps/mobile` are not yet scaffolded — see `README.md` "Trạng thái hiện tại" for the current checklist before assuming a module is implemented.

## Commands

Run from repo root unless noted.

```bash
npm install                                    # install all workspaces
npm run build:packages                         # build shared-types + business-rules to dist/ - REQUIRED before running/building apps/api
npm run test:business-rules                    # all 22 BRULE unit tests (packages/business-rules)
npm run test -w packages/business-rules -- creditLimit.test.ts   # single test file
npm run test -w apps/api                       # apps/api unit tests (e.g. OrderService)
npm run test -w apps/api -- order.service.spec.ts                # single test file
npm run dev:api                                # apps/api in watch mode, http://localhost:3000
```

Inside `apps/api/`: `npx nest build` (production build → `dist/`), `node dist/main.js` (run built server), `npx prisma generate` / `npx prisma migrate dev` (once `DATABASE_URL` is set — copy `.env.example` to `.env` first; no DB is configured yet).

There is no linter configured yet. No `apps/web` or `apps/mobile` commands exist yet — those apps are not scaffolded.

## Architecture — the big picture

**Three-layer split, and where each kind of logic goes:**

1. `packages/shared-types` — enums (state machines, e.g. `OrderStatus`, `TripStatus`) and entity interfaces shared across API/web/mobile. Pure types, no logic.
2. `packages/business-rules` — the 22 business rules (`BRULE-01`…`22` from `files/04_SRS_...md` §5) implemented as **pure functions**, unit-tested in isolation from any framework. Anything that is "a rule the spec defines" (credit-limit checks, floor-price approval routing, vehicle-assignment conflicts, cut-off/urgent-order logic, branch-scope enforcement, capacity/material/debt formulas) belongs here, not inline in a NestJS service or controller. See `packages/business-rules/src/` for the pattern — one file per rule domain (`creditLimit.ts`, `pricing.ts`, `planning.ts`, `dispatch.ts`, `order.ts`, `branchScope.ts`, `finance.ts`).
3. `apps/api` — a NestJS **modular monolith**. `src/modules/<name>/` maps 1:1 to the M01–M16 module map from the PRD/SRS (`admin`=M01, `crm`=M02, `pricing`=M03, `contract`=M04, `order`=M05, `mixdesign`=M06, `quality`=M07, `planning`=M08, `material`=M09, `dispatch`=M10, `fleet`=M11, `delivery`=M12, `ar`=M13, `reporting`=M14, `integration`=M16 — M15 "Mobile App" is a client, not an API module). Most of these are currently empty `@Module({})` placeholders; **`src/modules/order` is the fully-wired reference implementation** — read `order.service.ts` to see the intended pattern: call into `@rmc-ms/business-rules` for every rule check, throw `BadRequestException` with the BRULE code in the message when a rule blocks the operation, keep an in-memory store for now (to be replaced by Prisma once each module needs real persistence). Follow this same pattern when fleshing out another module — don't reimplement rule logic inside the module.

**Cross-cutting rule that applies to every module, not just `order`:** every business entity carries a `branchId` and must be scoped to the caller's permitted branches **in the service layer** (`packages/business-rules/src/branchScope.ts` → `assertBranchScope`/`isInBranchScope`), not by filtering on the client or trusting a client-supplied branch filter. This is BRULE-17 and is treated as a security boundary, not a UX convenience.

**Data model:** `apps/api/prisma/schema.prisma` covers only the "core flow" entities (Customer/Site → Order → ProductionPlan/PlanLine → Trip → DeliveryNote, plus CreditLimit, MixDesign, Vehicle/Driver, AuditLog) needed for the first vertical slice. It is *not* the full 48-entity model from SRS §3.1 — extend it entity-by-entity as each module moves from placeholder to real implementation, cross-checking against the SRS entity table so field names/relations stay consistent with the spec.

**Why a "core flow" first instead of building modules in M01…M16 order:** the roadmap (see `files/05_System_Documentation_RMC-MS.md` §6, and the brainstorm that produced this scaffold) prioritizes one thin end-to-end slice — org/branch/RBAC foundation → Customer/Site → Order → Plan → Dispatch → DeliveryNote — before breadth across all 16 modules, because that slice is the system's "one m³ flows through end to end" backbone (BRD success criterion SC-01) and exercises the branch-scoping + audit-log foundation every other module depends on.

## Document structure and traceability chain (`files/`)

The five documents in `files/` are the source of truth for requirements; code should trace back to them, not the other way around.

1. `01_BRD_He_thong_quan_tri_be_tong.md` — **Business Requirements**: business context, AS-IS pain points (`PP-nn`), business objectives with KPIs (`BO-nn`), scope, stakeholders, business requirements (`BR-nn`), risks (`RI-nn`), rollout phases.
2. `02_PRD_He_thong_quan_tri_be_tong.md` — **Product Requirements**: product vision, personas, the M01–M16 module map, product features per module (`PR-Mxx-nn`), release plan (R1/R2/R3), product metrics.
3. `03_URD_He_thong_quan_tri_be_tong.md` — **User Requirements**: user classes (`UC-nn`), per-department user stories with acceptance criteria (`UR-<dept>-nn`), the RACI permission matrix, user journeys (`UJ-nn`), UAT acceptance criteria (`UA-nn`).
4. `04_SRS_He_thong_quan_tri_be_tong.md` — **Software Requirements Specification** (IEEE 830 / ISO 29148 style): proposed architecture, data model (entities `E-nn`, state machines), functional requirements (`FR-Mxx-nn`), business rules (`BRULE-nn`), non-functional requirements (`NFR-<area>-nn`), integrations (`INT-nn`), reports (`RPT-nn`), standard calculation formulas, test cases (`TC-nn`). This is the primary reference when implementing code — entity shapes, state machines, and BRULE behavior should match it exactly.
5. `05_System_Documentation_RMC-MS.md` — a **navigation/summary layer** written on top of the four docs above. Most sections cross-reference source sections like `(→ BRD §3)` rather than duplicating; the 22 business rules (§8), glossary (§17), and standard formulas (§18) are reproduced in full since they're small, self-contained, and directly useful when writing code (`packages/business-rules` implements §8 and §18 as functions).

When editing any of the four source documents, requirement codes (`BR-nn`, `PR-Mxx-nn`, `UR-<dept>-nn`, `FR-Mxx-nn`, etc.) are cross-referenced both within each document and in the SRS §9 traceability matrix — update references elsewhere if you add/renumber/remove one, including in doc 05.

## Conventions

- **Docs** (`files/*.md`, `README.md`): Vietnamese with diacritics, matching existing tables/headings exactly — requirement codes are referenced by ID across documents.
- **Code comments**: Vietnamese **without diacritics** (plain ASCII) — this is the convention already used throughout `packages/business-rules` and `apps/api/src` to avoid source-encoding issues; follow it for new code comments rather than switching to diacritics or English.
- **Requirement code prefixes** (SRS §1.4): `FR-<Mxx>-<nn>` functional requirement, `NFR-<area>-<nn>` non-functional, `BRULE-<nn>` business rule, `INT-<nn>` integration, `RPT-<nn>` report, `E-<nn>` data entity. BRD/PRD/URD use their own prefixes (`BR-`, `PR-M`, `UR-`, `UC-`, `UJ-`, `UA-`, `PP-`, `BO-`, `RI-`, `OQ-`). When a service throws for a blocked business rule, include the BRULE code in the error message (see `order.service.ts`) so failures are traceable back to the spec.
- **Module numbering** M01–M16 is the backbone reused across the PRD, SRS, the release plan, and `apps/api/src/modules/*` folder names — keep a given module's Mxx number and folder name consistent everywhere.
- **Units/locale**: m³, tấn, km, VNĐ; dates as `dd/MM/yyyy` in UI-facing docs, ISO datetimes in code; timezone Asia/Ho_Chi_Minh.
