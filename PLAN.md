# AICTE Sentinel — Phase 1: One Source of Truth Implementation Plan

> **Branch:** `fixes-review`  
> **Status:** Pending User Approval (Ground Rules: Wait for user OK before modifying code)  
> **Target Problem Statement:** SIH26261 (Smart India Hackathon 2026)  
> **Regulatory Integrity Protocol:** No invented regulations, clauses, table numbers, or handbook editions. All placeholder citations marked `SOURCE: TO BE VERIFIED` and tracked in `VERIFY_BEFORE_SUBMISSION.md`. All data remains synthetic; mock integrations labeled simulated; advisory decision-support only.

---

## Executive Summary

An external review of AICTE Sentinel identified data divergences across screens:
- **Sunrise:** Readiness displayed as 75/100 in the officer queue but 0/100 in the institution dashboard; officer sees 1 finding while institution dashboard computes 11 deficiencies due to unseeded required documents.
- **Nova:** Case file lacks the "Structural Stability Missing" finding advertised on the landing page cards.
- **Apex:** Declared 2.1 acres in Hinjawadi but has no land-area deficiency finding even though `LAND-AREA-002` mandates $\ge 2.5$ acres.
- **Collusion Risk Score:** Inconsistently displayed as 88% on the radar graph header vs. 15% (Sunrise), 68% (Nova), and 92% (Apex) in application dockets.
- **Dates & Staleness:** Date rules evaluate against volatile `Date.now()`, which shifts validity over time.
- **Document Naming & Text:** File names telegraph verdicts (e.g. `nova_altered_structure_plan.pdf`, `apex_duplicate_occ_cert.pdf`), and grammatical bugs like "1 findings" appear.

This plan details the exact files and exact architectural changes required to resolve all 8 items of Phase 1 under a unified **Single Source of Truth** model.

---

## Detailed Item-by-Item Plan

### Item 1: Rule Engine as the ONLY Producer of Findings, Readiness Scores, and Deficiency Lists

**Problem:** `src/lib/store.ts` hardcodes static `readinessScore` and `collusionRiskScore` values in `DEMO_APPLICATIONS`, and seeds a separate static `DEMO_FINDINGS` array (7 findings) that differs from the 22 compliance rules evaluated dynamically by `RulesEngine.evaluateApplication()`.

**Exact Files to Change:**
1. `src/lib/rules/engine.ts`:
   - Expand `RulesEngine` to be the single central engine generating all findings:
     - Statutory compliance findings from `packs.json` (land, building, fire, faculty, academic, financial, governance, documentation, consistency, dates).
     - Forensic anomaly findings (evaluating `doc.forensicMetadata`: incremental saves, post-signature revision producer heuristics, duplicate hashes).
     - Cross-institution collusion findings (evaluating cross-application entity graphs: shared survey numbers, duplicate certificates, and shared faculty PANs).
     - Verification passport findings (evaluating `doc.verificationStatus`: expired, mismatch, source unavailable).
   - Export helper `RulesEngine.evaluateApplication(app, documents, allApps, allDocs)` that produces:
     - `breakdown: ReadinessBreakdown` (with score clamped 0–100, itemized penalty breakdown).
     - `findings: Finding[]` (all unified evidence-linked findings for this application).
   - Export `RulesEngine.computeReadinessScore(findings, rulePacks)` as the canonical scoring formula.
2. `src/lib/store.ts`:
   - Remove hardcoded `DEMO_FINDINGS` array.
   - In `DEMO_APPLICATIONS`, remove hardcoded `readinessScore` and `collusionRiskScore` literals (or initialize them dynamically at runtime via `RulesEngine`).
   - Update `DataStore.getFindings(applicationId)` to compute findings directly from `RulesEngine` for the requested application (or all applications), preserving officer annotations and action state (`Confirm`, `Dismiss`, `Clarification`, `Escalate`) keyed by stable finding ID.
   - Update `DataStore.getApplications()` and `DataStore.getApplicationById(id)` to return applications with engine-computed `readinessScore`, `collusionRiskScore`, and `riskTier`.
3. `prisma/seed.ts`:
   - Clean seed script so it seeds only base institutional profiles, application metadata (intake, type, programmes), uploaded documents, and extracted fields. Remove hardcoded scores from seed payloads.

---

### Item 2: Unified Computed Results Across All Screens & Dynamic Landing-Page Cards

**Problem:** Different pages query different endpoints or render hardcoded markup (landing-page cards have manually typed JSX copy; officer queue and preview pages read static store properties, while institution dashboard calls `/api/applications/[id]`).

**Exact Files to Change:**
1. `src/app/page.tsx` (Landing Page):
   - Replace the hardcoded JSX cards for Sunrise, Nova, and Apex with dynamic rendering driven by `DataStore.getApplications()` and `RulesEngine.evaluateApplication()`.
   - Generate card findings bullet points dynamically from real computed findings (`finding.title` and `finding.explanation`).
   - Display computed readiness score and risk tier directly from the engine output.
2. `src/app/officer/page.tsx` (Officer Scrutiny Queue):
   - Ensure the queue displays the exact engine-computed readiness score, collusion risk score, risk tier, and active findings count.
3. `src/app/officer/case/[id]/page.tsx` (Approval Case File):
   - Ensure case header metrics (Readiness, Collusion Risk, Advisory Findings count, Verified Documents) and the *Advisory Findings Stream* read exclusively from the engine evaluation.
4. `src/app/officer/scrutiny/[id]/page.tsx` (Scrutiny Report):
   - Ensure docket summary, verification summary matrix, and itemized findings table consume the exact engine findings and readiness score.
5. `src/app/institution/page.tsx` (Institution Dashboard):
   - Ensure the readiness gauge, score breakdown, and immediate deficiency rectification cards consume the exact same engine output as the officer view.
6. `src/app/api/applications/route.ts` & `src/app/api/applications/[id]/route.ts`:
   - Ensure JSON responses return engine-computed `readinessScore`, `collusionRiskScore`, `findings`, and `readiness` breakdown.
7. `src/app/preview/_components/OfficerQueueSection.tsx`:
   - Read computed scores and engine findings count for each application.
8. `src/app/preview/_components/CaseFileSection.tsx`:
   - Render engine-computed readiness score, collusion score, and findings.
9. `src/app/preview/_components/InstitutionSection.tsx`:
   - Render engine-computed readiness score and deficiencies.
10. `src/app/preview/_components/ScrutinyReportSection.tsx`:
    - Render engine-computed readiness score and findings table.

---

### Item 3: Documented Readiness-Score Formula & UI Display

**Problem:** Readiness score calculation is opaque to evaluators and missing formula explanations on several screens.

**Exact Files to Change:**
1. `src/lib/rules/engine.ts`:
   - Implement and export `computeReadinessScore(criticalCount: number, highCount: number, mediumCount: number, lowCount: number): number`:
     $$\text{Readiness Score} = \max(0, \min(100, 100 - (25 \times N_{\text{critical}} + 15 \times N_{\text{high}} + 8 \times N_{\text{medium}} + 3 \times N_{\text{low}})))$$
   - Document the formula with clear JSDoc, referencing statutory deficiency weights:
     - Critical Deficiencies: $-25\text{ pts}$ (Direct statutory bars, e.g. unrenewed fire NOC, fraudulent overlap)
     - High Deficiencies: $-15\text{ pts}$ (Major structural or faculty deficits, e.g. missing structural stability certificate, SFR deficit)
     - Medium Deficiencies: $-8\text{ pts}$ (Governance or committee notification omissions, e.g. IQAC, SGRC)
     - Low Deficiencies: $-3\text{ pts}$ (Minor procedural or documentation omissions)
2. `src/components/ReadinessGauge.tsx`:
   - Add a visible mathematical formula banner and breakdown explainer:
     `Readiness Score = 100 - (25 × Critical + 15 × High + 8 × Medium + 3 × Low) [Clamped 0–100]`
   - Display active penalty calculation for the current application.
3. `src/app/preview/_components/InstitutionSection.tsx` & `src/app/preview/_components/CaseFileSection.tsx`:
   - Include the exact documented formula and penalty weight legend in the static HTML preview so external evaluators can verify the calculation without running client JavaScript.

---

### Item 4: Documented Cross-Institution Risk Score Function & Single Consistent Value Everywhere

**Problem:** Radar graph header displays 88% overall risk while application cards and dockets show 15%, 68%, and 92%. The mathematical relationship between entity conflicts, weights, and institutional risk is undocumented.

**Exact Files to Change:**
1. `src/lib/radar/graph.ts`:
   - Implement and export `computeCrossInstitutionRiskScore(institutionId: string, graphData: CollusionRadarData): { score: number; weights: Record<string, number>; factors: Record<string, number> }`.
   - Explicitly document the transparent scoring formula:
     $$\text{Collusion Risk Score} = \min(100, W_{\text{land}} \times F_{\text{land}} + W_{\text{fac}} \times F_{\text{fac}} + W_{\text{cert}} \times F_{\text{cert}} + W_{\text{trust}} \times F_{\text{trust}})$$
     - **Overlapping Land Parcel Conflict ($W_{\text{land}} = 40\%$):** 40 pts if institution is enmeshed in a contested cadastral survey partition.
     - **Reused / Dual Faculty Biometrics ($W_{\text{fac}} = 35\%$):** 35 pts if declared faculty member has concurrent active employment claims.
     - **Duplicate / Reused Municipal Certificate ($W_{\text{cert}} = 25\%$):** 25 pts if exact SHA-256 duplicate certificate from a prior approval filing is reused.
     - **Interlocking Sponsoring Trust Network ($W_{\text{trust}} = 10\%$):** 10 pts for overlapping trustees/office bearers.
   - For global network radar view: document the aggregate network risk score calculation (maximum institutional risk or weighted network density) and display the exact same institution-level score (15% for Sunrise, 68% for Nova, 92% for Apex) everywhere.
2. `src/components/CollusionRadarGraph.tsx`:
   - Render a collapsible "Formula & Weights Inspector" badge displaying inputs and weights ($W_{\text{land}}=40\%$, $W_{\text{fac}}=35\%$, $W_{\text{cert}}=25\%$, $W_{\text{trust}}=10\%$).
3. `src/app/preview/_components/CollusionRadarSection.tsx`:
   - Render the risk formula and weights table in pure server-rendered HTML.
4. `src/app/officer/page.tsx`, `src/app/officer/case/[id]/page.tsx`, `src/app/officer/scrutiny/[id]/page.tsx`, `src/app/preview/_components/OfficerQueueSection.tsx`:
   - Read the single computed value from `CollusionRadarEngine` / `DataStore`.

---

### Item 5: Intentional Demo Data Stories Across All Screens

**Problem:** Incomplete document seeding in `src/lib/store.ts` caused Sunrise to fail 9 additional unseeded rules (collapsing its score to 0/100). Nova lacked the structural stability document and finding. Apex lacked the land area deficit finding.

**Exact Files to Change:**
1. `src/lib/store.ts`:
   - **Sunrise Institute of Technology (`app-sunrise-001`):** Complete document locker so only intentional dilemmas trigger:
     - Add verified `Building Plan` (BBMP approved, carpet area 14,200 sqm).
     - Add verified `Structural Stability Certificate` (issued by empanelled structural engineer).
     - Add verified `Occupancy Certificate` (`OCC-BBMP-2020-118`).
     - Add verified `Faculty Appointment Letter` & regular faculty roster.
     - Add verified `Faculty Qualification Certificate` (Dr. Ramesh Sundaram Ph.D. Anna University).
     - Add verified `Audited Financial Statement` (with valid ICAI UDIN).
     - Add verified `Prior EoA` (Approval letter for Academic Year 2025-2026).
     - Add verified `Trust Deed` (Sunrise Education Trust).
     - Keep existing verified `Land Deed` (4.85 acres, Survey 144/2).
     - Keep existing verified `Affidavit` with **one low-confidence field:** `notary_registration_no` confidence = 0.62.
     - Keep existing expired `Fire Safety Certificate` (`FS-BLR-2023-9941`, expired 2024-01-14).
     - *Result:* 1 Critical deficiency (Fire NOC expired) $\rightarrow$ Readiness Score = $100 - 25 = 75/100$. Exactly 1 adverse finding + 1 low-confidence field warning. Consistent on all screens.
   - **Nova Engineering College (`app-nova-002`):**
     - Omit `Structural Stability Certificate` entirely $\rightarrow$ triggers `BLDG-STRUCT-002` (High deficiency, -15 pts).
     - Faculty strength declared: 22 faculty vs statutory requirement of 24 for 480 intake $\rightarrow$ triggers `FACULTY-COUNT-001` (Critical deficiency, -25 pts).
     - PDF with post-signature edits: `Nova_Building_Plan_Rev2.pdf` (Canva / Ghostscript with 3 incremental xref saves) $\rightarrow$ triggers Forensic Anomaly finding (High deficiency, -15 pts).
     - Faculty member Dr. Vikram Malhotra (`XYZPK9876Q`) declared as Full-Time Professor at Nova while simultaneously listed as Principal at Apex $\rightarrow$ triggers Cross-Institution Collusion finding.
     - Add verified `Land Deed` (3.2 acres, Survey 289/1A), `Occupancy Certificate`, `Affidavit`, `Trust Deed`, `Prior EoA`, `Audited Financial Statement`.
     - *Result:* Exact intentional findings and score appear consistently across all screens.
   - **Apex Polytechnic College (`app-apex-003`):**
     - Land Survey overlap: `Apex_Land_Lease_Deed.pdf` claiming Survey 289/1A (2.1 acres), overlapping Nova $\rightarrow$ triggers `LAND-SURVEY-003` & Cross-Institution Collusion finding (Critical).
     - Land area requirement: Declared 2.1 acres vs statutory minimum 2.5 acres $\rightarrow$ triggers `LAND-AREA-002` (High deficiency, -15 pts).
     - Duplicate certificate: `Apex_Occupancy_Certificate_2021.pdf` (`OCC-PUNE-2021-DUP-01`) reused from Western Horizon 2021 filing $\rightarrow$ triggers Forensic Anomaly / Duplicate Certificate finding (Critical).
     - Source unavailable: `Apex_State_Government_NOC.pdf` gateway timeout / offline $\rightarrow$ fail-closed to `Source Unavailable` finding (High).
     - *Result:* All 4 intentional findings appear consistently across all screens.
2. `src/lib/adapters/index.ts`:
   - Align mock databases (`MOCK_DIGILOCKER_DB`, `MOCK_CERT_REGISTRY_DB`, `MOCK_LAND_RECORDS_DB`, `MOCK_FACULTY_REGISTRY_DB`) with the complete document IDs and neutral file names.

---

### Item 6: Configurable As-Of Reference Date Setting

**Problem:** Rules evaluating chronological age (`DATE-VALID-001` 90-day affidavit limit, `FIRE-NOC-001` fire safety expiry, `BLDG-STRUCT-002` 365-day structural validity) compare against `Date.now()`. As calendar time advances, seeded compliance statuses shift unpredictably.

**Exact Files to Change:**
1. `src/lib/config/env.ts` (or `src/lib/rules/constants.ts`):
   - Export `AS_OF_DATE`: defaults to fixed seed evaluation anchor `2026-02-01T00:00:00Z` (configurable via `process.env.NEXT_PUBLIC_AS_OF_DATE`).
   - Export helper `getAsOfDate(): Date`.
2. `src/lib/rules/engine.ts`:
   - Replace all `Date.now()` or `new Date()` comparisons in `FIRE-NOC-001`, `BLDG-STRUCT-002`, and `DATE-VALID-001` with `getAsOfDate()`.
3. `src/components/DemoBanner.tsx`:
   - Display the active As-Of Date badge: "Scrutiny As-Of Reference Date: 01 Feb 2026 (Deterministic Evaluation Anchor)".
4. `src/app/preview/_components/OfficerQueueSection.tsx`, `CaseFileSection.tsx`, `ScrutinyReportSection.tsx`:
   - Display the Scrutiny As-Of Date in the header metadata block.

---

### Item 7: Neutral, Canonical Document Filenames Across All Screens

**Problem:** Filenames currently announce verdicts (e.g., `nova_altered_structure_plan.pdf`, `apex_duplicate_occ_cert.pdf`, `Sunrise_Fire_Safety_NOC_2023.pdf`), which is unrealistic for an intake locker and diverges across views.

**Exact Files to Change:**
1. `src/lib/store.ts`:
   - Rename to neutral, canonical names:
     - `Sunrise_Registered_Land_Deed_2015.pdf` $\rightarrow$ `Sunrise_Land_Sale_Deed.pdf`
     - `Sunrise_Fire_Safety_NOC_2023.pdf` $\rightarrow$ `Sunrise_Fire_Safety_NOC.pdf`
     - `Sunrise_AICTE_Affidavit_2026.pdf` $\rightarrow$ `Sunrise_Statutory_Affidavit.pdf`
     - `nova_altered_structure_plan.pdf` $\rightarrow$ `Nova_Building_Plan_Rev2.pdf`
     - `Malhotra_VTU_PhD_Degree.pdf` $\rightarrow$ `Nova_Faculty_Qualification_Malhotra.pdf`
     - `Apex_Lease_Deed_Hinjawadi.pdf` $\rightarrow$ `Apex_Land_Lease_Deed.pdf`
     - `apex_duplicate_occ_cert.pdf` $\rightarrow$ `Apex_Occupancy_Certificate.pdf`
     - `Apex_DTE_State_NOC.pdf` $\rightarrow$ `Apex_State_Government_NOC.pdf`
2. `src/lib/radar/graph.ts`:
   - Update node labels and evidence details to use the canonical neutral filenames.
3. `src/lib/adapters/index.ts`:
   - Update document references and IDs.
4. `tests/sentinel.test.mjs` & `tests/verify-preview.mjs`:
   - Update filename string assertions.
5. `README.md`:
   - Update walkthrough text to match neutral filenames.

---

### Item 8: Fix Grammar and Text Bugs

**Problem:** Strings display grammatical errors such as "1 findings", "1 deficiencies", or inconsistent plurals.

**Exact Files to Change:**
1. `src/lib/utils.ts` (or `src/app/preview/_components/helpers.ts`):
   - Implement `pluralize(count: number, singular: string, plural?: string): string`.
2. `src/app/officer/page.tsx`:
   - Replace any `${count} findings` with `pluralize(count, 'finding', 'findings')`.
3. `src/app/officer/case/[id]/page.tsx`:
   - Update findings count badge: `${findings.length} ${pluralize(findings.length, 'Advisory Finding', 'Advisory Findings')}`.
4. `src/app/preview/_components/OfficerQueueSection.tsx`:
   - Line 90: Change `{findings.length} findings` to `{findings.length} {findings.length === 1 ? 'finding' : 'findings'}`.
5. `src/app/preview/_components/CaseFileSection.tsx`:
   - Replace `{findings.length} findings` with proper pluralization.
6. `src/app/preview/_components/ScrutinyReportSection.tsx`:
   - Ensure proper pluralization in findings headers and summaries.

---

### Regulatory Integrity & Citation Safeguard

To satisfy the ground rule:
> "NEVER invent AICTE regulations, clause numbers, table numbers, handbook editions or thresholds. Where a real source is needed use 'SOURCE: TO BE VERIFIED' and list each place in VERIFY_BEFORE_SUBMISSION.md."

1. Create `VERIFY_BEFORE_SUBMISSION.md` at project root.
2. In `src/lib/rules/packs.json`:
   - Audit all rules; replace any invented clause or table numbers (e.g. `AICTE Norms Table 2.1`, `Clause 4.1`) with `"SOURCE: TO BE VERIFIED"`.
   - Catalogue every instance in `VERIFY_BEFORE_SUBMISSION.md` with:
     - Rule ID
     - Location (file, line)
     - Current placeholder text
     - Official AICTE document needed for verification (e.g., AICTE Approval Process Handbook Chapter/Clause).

---

## Step-by-Step Implementation Sequence (After User Approval)

Each numbered item will be implemented individually, followed by verification (`npm test`, `npx tsc --noEmit`, `npm run lint`, `npm run build`) and a dedicated git commit on branch `fixes-review`:

| Step | Action | Verification | Git Commit Message |
|---|---|---|---|
| **Step 0** | Create `VERIFY_BEFORE_SUBMISSION.md` and audit existing clause/table citations | Search for invented clauses | `chore: create VERIFY_BEFORE_SUBMISSION.md and flag regulatory citations` |
| **Step 1** | Implement Item 6 (As-Of Date setting & display) | Node test + UI render | `feat: add configurable as-of reference date for deterministic rule evaluation` |
| **Step 7** | Implement Item 7 (Canonical neutral document filenames) | Tests pass | `refactor: standardize canonical neutral document filenames across all modules` |
| **Step 8** | Implement Item 8 (Grammar & text bug fixes) | Text review | `fix: resolve grammar bugs and pluralize finding and deficiency counters` |
| **Step 3** | Implement Item 3 (Readiness score formula function & UI display) | Mathematical unit test | `feat: unify readiness-score formula into documented function with UI explainer` |
| **Step 4** | Implement Item 4 (Cross-institution risk score function & weights display) | Weight calculations | `feat: unify cross-institution collusion risk calculation and weights display` |
| **Step 5** | Implement Item 5 (Intentional demo data for Sunrise, Nova, Apex) | Store inspection | `data: populate complete intentional demo datasets for Sunrise, Nova, and Apex` |
| **Step 1** | Implement Item 1 (Rule engine as sole producer of findings and scores) | Engine tests | `feat: centralize all findings, readiness scores, and deficiencies in rule engine` |
| **Step 2** | Implement Item 2 (Connect all screens, landing cards, and preview routes) | Full app preview | `feat: unify officer, institution, scrutiny, landing, and preview screens to rule engine` |
| **Final** | Full validation suite: `npm test`, `npm run lint`, `npx tsc --noEmit`, `npm run build`, and `curl` test of all `/preview/*` routes | All 12 preview routes verified | Final Phase 1 milestone verification |

---

## Verification Criteria for Phase 1 Sign-Off

When all 8 items are complete:
1. `npm test` passes 100%.
2. `npx tsc --noEmit` returns zero TypeScript errors.
3. `npm run lint` returns zero errors.
4. `npm run build` succeeds cleanly.
5. Running `curl` against all preview routes confirms identical metrics:
   - **Sunrise (`app-sunrise-001`):** Readiness = 75/100, Findings = 1, Collusion Risk = 15% across `/preview/officer`, `/preview/case/app-sunrise-001`, `/preview/institution`, `/preview/scrutiny/app-sunrise-001`, and `/`.
   - **Nova (`app-nova-002`):** Identical computed readiness score, structural stability finding present on case file, and reused faculty finding present across `/preview/officer`, `/preview/case/app-nova-002`, `/preview/scrutiny/app-nova-002`, and `/`.
   - **Apex (`app-apex-003`):** Identical computed readiness score, land area deficit finding present (`2.1 < 2.5` acres), overlapping survey finding present, duplicate certificate finding present, and source unavailable finding present across all screens.