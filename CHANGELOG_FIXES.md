# AICTE Sentinel — Implementation & Quality Review Changelog (`fixes-review`)

> **Branch:** `fixes-review`  
> **Evaluation Reference Date:** `2026-02-01`  
> **Problem Statement:** Smart India Hackathon 2026 — Problem Statement SIH26261  
> **Governance Ground Rules:**
> - Never invent AICTE regulations, clauses, or thresholds (`SOURCE: TO BE VERIFIED` strictly maintained).
> - 100% synthetic data; all external verification adapters explicitly labelled `(simulated)`.
> - Advisory-only outputs (`CONSIDER_VIGILANCE_REFERRAL`, options for officer consideration, zero automated approvals/rejections).
> - All `/preview/*` routes remain 100% server-rendered and readable without browser JavaScript.
> - Exclamation marks (`!`) completely eliminated from visible UI text strings.

---

## 1. Summary of Completed Improvements

Every numbered item requested by the review protocol has been implemented, validated through automated unit and regression tests, checked for TypeScript and lint compliance, built under Next.js 16 production mode, and committed to git branch `fixes-review`.

| Item # | Area | Scope & Description | Status | Commit |
|---|---|---|---|---|
| **Banner** | Demo Banner | Removed permanent demo banner from top Navbar and Linkage Radar page | **FIXED** | `5b9bd37` |
| **Item 1** | Wording / Safety | Eliminated all prohibited inflammatory terms (`fraud`, `collusion`, `syndicate`, `blatant`, `clandestine`, `double-pledg`, `immutable`, `CAG Audit Node`); standardized advisory codes (`CONSIDER_VIGILANCE_REFERRAL`); enforced automated regression test | **FIXED** | `5b9bd37` |
| **Item 2** | Audit Trail Completeness | Hash-chained audit event written for every state change; seeded officer events for Nova and Apex; live chain recomputation in Auditor view and `/preview/audit`; autonomous actors use `SYSTEM` role | **FIXED** | `0859b54` |
| **Item 3** | Report Seals & Hashes | Dynamic scrutiny report seals computed from canonical JSON + audit chain head hash; live seal verification endpoint (`/api/reports/verify-seal`); real synthetic sample PDFs in `public/samples/` with matching SHA-256 digests; seeded Western Horizon 2021 original certificate | **FIXED** | `443e695` |
| **Item 4** | Verification Passport | Detailed verification attempts ledger (timestamp, adapter, latency, summary, status, review); State Directorate of Technical Education (`verifyStateDTE`) adapter; real adapter health outcomes (`DEGRADED (TIMEOUT)`) | **FIXED** | `28b49bc` |
| **Item 5** | Radar Edge Types | Algorithmic relation detection (`SOLE_OWNERSHIP`, `EXPIRED_CLEARANCE`, `METADATA_DISCREPANCY`); numerical confidence and plain-language reasons on every edge; officer "Dismiss Link with Reason" action with audit trail logging | **FIXED** | `07a3e08` |
| **Item 6** | Tamper vs Duplicate Scores | Decoupled tamper score from duplicate detection; documented linear tamper score formula; transparent formula breakdown in UI; duplicate document does not inflate tamper score | **FIXED** | `7f59951` |
| **Item 7** | Real PDF Extraction | Vector text stream extraction using `pdf-parse`; keyword rules classification; dynamic extraction confidence; active engine indicator in UI; optional LLM fallback behind `AI_EXTRACTION_API_KEY`; honest OCR disclosure | **FIXED** | `b9c0b5d` |
| **Item 8** | Synthetic Metrics Page | 120 synthetic applications generated deterministically (`seed: 20260201`); evaluation script (`scripts/evaluate.ts`) generating `public/metrics.json`; server-rendered `/metrics` and `/preview/metrics`; confusion matrix & latency breakdown; README methodology section | **FIXED** | `2487ce4` |
| **Item 9** | Honest Deployment Notes | Explicit truthful disclosures on `/login` and in `README.md`: in-memory storage, ephemerality on serverless hosting, role switching is prototype-only, production requires durable database & Jan Parichay SSO | **FIXED** | `afb760c` |
| **Item 10** | Repo Hygiene & Specs | Fixed clone URL and folder name; removed fake static build badge; added MIT `LICENSE`; added AICTE Portal integration architecture diagram; converted specification to formal `docs/DESIGN.md` | **FIXED** | `63e495e` |

---

## 2. Detailed Breakdown of Fixes

### Permanent Demo Banner Removal
- **Change:** Removed `<DemoBanner />` invocation from `src/components/Navbar.tsx` and `src/app/officer/radar/page.tsx`.
- **Rationale:** Banner was cluttering administrative evaluation views. Public preview views continue to display the mandatory `Public read-only preview` banner required for unauthenticated review.

### Item 1: Wording & Safety Protocol
- **Prohibited Term Elimination:** Scrubbed user-facing UI copy, mock data, API routes, README, and types of all occurrences of `fraud`, `collusion`, `syndicate`, `blatant`, `clandestine`, `double-pledg`, `immutable`, and `CAG Audit Node`.
- **Neutral Statutory Terminology:** Substituted with `regulatory non-compliance`, `multi-institution linkage`, `cross-institutional coordination`, `metadata discrepancy`, `undivided parcel claim`, `tamper-evident`, and `Vigilance & Oversight Audit Ledger`.
- **Exclamation Mark Elimination:** Removed all visible exclamation marks (`!`) in UI copy (e.g., changed `Failed!` to `Verification Inconclusive`). Preserved code logical NOT operators (`!`).
- **Advisory Recommendations:** Action codes standardized as `CONSIDER_VIGILANCE_REFERRAL`, `SCHEDULE_EVC_PHYSICAL_INSPECTION`, `REQUEST_CADASTRAL_DEMARCATION`, and `REQUEST_MUNICIPAL_OCCUPANCY_REVALIDATION`.
- **Regression Guard:** Added automated test in `tests/sentinel.test.mjs` scanning all TypeScript and JSON files (excluding changelogs, node_modules, and PLAN.md) to guarantee zero regressions.

### Item 2: Audit Trail Completeness
- **Hash-Chained State Transitions:** Audit trail covers: document upload, text extraction, compliance rule execution, external verification attempt, finding creation, officer action (Confirm / Dismiss / Clarify / Escalate), EVC inspection observation, application status change, and user sign-in.
- **Seeded Officer Events:** In `src/lib/store.ts`, initialized ledger with events `EVT-005` through `EVT-008` representing Smt. Priyadarshini Rao confirming findings on Nova and Apex.
- **Autonomous Role Separation:** Engine workers (Forensics Engine, Verification Adapters) log events using `SYSTEM` role rather than administrative credentials.
- **Live Integrity Recomputation:** Implemented `verifyIntegrity()` in `src/lib/audit/trail.ts` that recomputes `SHA256(prevHash | payload)` sequentially; verified live in `/admin`, `/auditor`, and `/preview/audit`.

### Item 3: Report Seals & Cryptographic Document Hashes
- **Dynamic Report Seals:** `src/lib/security/reportSeal.ts` computes SHA-256 seal from canonical report JSON concatenated with the current audit chain head hash.
- **Seal Verification Endpoint:** Created `POST /api/reports/verify-seal` and UI modal button allowing auditors to verify report seal authenticity against the current ledger state.
- **Real Sample Documents:** Created 6 real sample PDF files in `public/samples/` (`Sunrise_Land_Sale_Deed.pdf`, `Sunrise_Fire_Safety_NOC.pdf`, `Nova_Faculty_Qualification_Malhotra.pdf`, `Apex_Land_Lease_Deed.pdf`, `Apex_Occupancy_Certificate_2021.pdf`, `Western Horizon_Occupancy_2021.pdf`) with verified SHA-256 digests.
- **Seeded Western Horizon Original:** Seeded `inst-western-horizon` and `doc-wh-occ-2021` in `src/lib/store.ts`; finding `FIND-APX-002` explicitly references this original document, visible on Linkage Radar.

### Item 4: Verification Passport History & State DTE Adapter
- **Attempts History Ledger:** Enhanced `DocumentRecord.verificationAttempts` with timestamp, adapter name, request payload summary, response body summary, execution latency (ms), resulting verification status, and officer review state.
- **State DTE Mock Adapter:** Implemented `verifyStateDTE` in `src/lib/adapters/mockAdapters.ts` and connected it to Apex Polytechnic College NOC (`doc-apex-noc-unavailable`).
- **Adapter Degradation Display:** Timed-out requests reflect degraded health in the Admin Portal adapter monitor (`DEGRADED (TIMEOUT)` with latency 5,240ms).

### Item 5: Radar Edge Types & Officer Dismiss Action
- **Algorithmic Edge Detection:** Replaced static edge type assignments with `detectRelation(source, target)` in `src/lib/radar/graph.ts`. An expired certificate is categorized as `EXPIRED_CLEARANCE`, a clean land parcel is `SOLE_OWNERSHIP`, and PDF metadata modifications are `METADATA_DISCREPANCY`.
- **Numerical Confidence & Plain-Language Reasons:** Every generated edge carries a confidence score (0.88–0.99) and an evidentiary reason string.
- **Officer Link Dismissal:** Implemented `LinkageRadarEngine.dismissEdge(...)` and `POST /api/radar/dismiss` allowing officers to dismiss linkages with mandatory written justifications, logged to the audit trail.

### Item 6: Tamper vs Duplicate Score Decoupling
- **Formula Documentation:** Documented the linear tamper scoring model:
  $$\text{TamperScore} = 0.40 \cdot \min(1, \frac{\text{incrementalSaves}}{3}) + 0.30 \cdot \text{isDiscrepantProducer} + 0.16 \cdot \text{hasFontSubstitution} + 0.10 \cdot \text{isDateAnomalous} + 0.02$$
- **Score Isolation:** `Apex_Occupancy_Certificate_2021.pdf` (`doc-apex-dup-cert`) has `tamperingConfidence: 0.02` (clean structure) and `duplicateConfidence: 0.99`. Structural tampering does not inflate duplicate scores, and vice versa.
- **UI Breakdown:** Document viewer and Case File preview render separate cards for Tampering Score and Duplicate Detection with clear mathematical factor breakdowns.

### Item 7: Real Document Extraction & Optional LLM Fallback
- **Vector Stream Parser:** Integrated `pdf-parse` in `src/lib/extraction/engine.ts` (`ExtractionEngine.processDocument`).
- **Dynamic Field Classification:** Automatically classifies documents (`Land Deed`, `Fire Safety Certificate`, `Faculty Qualification Certificate`, etc.) based on keyword frequency analysis, with confidence derived from extraction depth.
- **Optional LLM Fallback:** Supports optional LLM-assisted extraction enabled via `AI_EXTRACTION_API_KEY`. When absent, gracefully falls back to `Baseline PDF Text Stream Extractor (pdf-parse v2 + regex rules)` with clear UI disclosure: `"Baseline extraction active — AI_EXTRACTION_API_KEY not configured"`.
- **Honest OCR Disclosure:** Explicitly discloses that scanned raster images require vector text streams or a dedicated OCR engine; no false claims of OCR capability.

### Item 8: Synthetic Benchmark Dataset & Server-Rendered Metrics
- **Dataset Generator (`scripts/generate-synthetic-dataset.ts`):** Deterministically generates 120 applications (480 documents) using a linear congruential PRNG with fixed seed `20260201` (date: `2026-02-01`).
- **Benchmark Evaluation Script (`scripts/evaluate.ts`):** Evaluates real PDF extraction across repository sample files and tests statutory rules across all 120 applications. Outputs `public/metrics.json`.
- **Server-Rendered Dashboards:** Created `/metrics` and `/preview/metrics` reading `public/metrics.json` directly from disk with zero hardcoded numbers. Includes Confusion Matrix (TP: 77, FP: 0, TN: 43, FN: 0), Precision (100%), Recall (100%), F1 (1.000), and Latency (7.6 ms/app).
- **README Section 10:** Added detailed methodology notes explaining reproducibility commands: `npm run generate:dataset` and `npm run evaluate`.

### Item 9: Honest Deployment & Storage Disclosures
- **Login Page Notice:** Enhanced prototype disclosure modal on `src/app/login/page.tsx` explicitly stating client-side role switching reality, in-memory storage, serverless ephemerality, and production requirements for Jan Parichay SSO and durable PostgreSQL storage.
- **README Section 1 & Section 9:** Explicitly documented that active prototype storage is in-memory (`src/lib/store.ts`), demo state is ephemeral on serverless hosting (e.g. Vercel), role switching is strictly for reviewer convenience, and production deployment requires a durable database.

### Item 10: Repo Hygiene, License & Technical Specification
- **Clone Instructions:** Corrected clone URL in `README.md` to `https://github.com/utkarsh24jids030-boop/aicte-sentinel.git` and folder to `aicte-sentinel`.
- **Fake Badge Removal:** Removed static `[![Build Status](https://img.shields.io/badge/build-passing-brightgreen)](http://localhost:3000)` badge and added official `[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)` badge.
- **Architecture Diagram:** Added an end-to-end integration diagram illustrating AICTE National Approval Ecosystem connectivity, Jan Parichay SSO, REST adapters, and clearly identifying simulated components.
- **Design Document Conversion:** Renamed `AICTE_Sentinel_SIH_2026_Specification.md` to `docs/DESIGN.md` and rewritten opening lines as a formal engineering specification document.
- **License File:** Created standard MIT `LICENSE` file in repository root.

---

## 3. What Was NOT Fixed / Intentionally Deferred

The following items are intentionally deferred for production cloud deployment and do not block Hackathon evaluation:

1. **Live Government Registry Integration:**
   - *Status:* Deferred to Production Deployment.
   - *Rationale:* Real-world integration with DigiLocker, State Revenue (Bhoomi / Mahabhulekh), and AICTE Faculty Database requires formal government Memorandums of Understanding (MoUs), IP-whitelisted production API credentials, and hardware security modules (HSMs).
   - *Mitigation:* Realistic simulated mock adapters (`mockAdapters.ts`) model real-world payloads, latency, and fail-closed timeout degradation.

2. **Jan Parichay National Single Sign-On (NSSO):**
   - *Status:* Deferred to Production Deployment.
   - *Rationale:* Jan Parichay SSO requires NIC server onboarding and production domain registration.
   - *Mitigation:* Rapid client-side 1-click role switcher provided for Hackathon evaluators with transparent disclosures.

3. **Durable Distributed PostgreSQL Database:**
   - *Status:* Database schema fully authored in `prisma/schema.sql`; runtime currently operates with an in-memory datastore (`src/lib/store.ts`).
   - *Rationale:* Eliminates local database setup prerequisites for Hackathon evaluators reviewing the standalone code repository.

---

## 4. Verification & Testing Evidence

All automated verification commands executed with zero errors:
- `npm test`: **40/40 tests passing** across `tests/sentinel.test.mjs`, `tests/evaluator.test.mjs`, and `tests/rules.test.mjs`.
- `npx tsc --noEmit`: **0 TypeScript errors**.
- `npx eslint --quiet`: **0 ESLint errors**.
- `npm run build`: **Compiled successfully** in Next.js 16 (Turbopack) with all 33 routes static/dynamic.
