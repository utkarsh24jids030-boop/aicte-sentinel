# AICTE Sentinel — Implementation Plan

> **Branch:** `fixes-review`  
> **Status:** Phase 1 & Phase 2 Complete. **Phases 6 & 7 Proposed Plan Pending User Approval.**  
> **Target Problem Statement:** SIH26261 (Smart India Hackathon 2026)  
> **Regulatory Integrity Protocol:** No invented regulations, clauses, table numbers, or handbook editions. All placeholder citations marked `SOURCE: TO BE VERIFIED` and tracked in `VERIFY_BEFORE_SUBMISSION.md`. All data remains synthetic; mock integrations labeled simulated; advisory decision-support only. Suspected anomalies must never be treated as conclusive proof of forgery.

---

## Completed Phases Summary

### Phase 1: One Source of Truth (COMPLETED)
- `4fb0f97`: Centralize all findings, readiness scores, and deficiencies in rule engine
- `45bac20`: Unify officer, institution, scrutiny, landing, and preview screens to single computed truth
- `995115a`: Display documented readiness score formula and deduction breakdown in UI
- `d7a7603`: Document cross-institution risk calculation and display weights in UI
- `1342613`: Display evaluation as-of date badge in officer queue and case headers
- `707680f`: Unit tests for filename neutrality, linkage weights, and as-of date anchor

### Phase 2: Rule Engine Correctness (COMPLETED)
- `51fb2a3`: Item 1 — Strict type consistency in `CONSIST-NAME-001`, rename grantee field to `grantee_name`
- `ba03f40`: Item 2 — Location-type driven minimum land area with verified source placeholders
- `1abb9c0`: Item 3 — Faculty ratio configurable by programme level with student basis setting
- `5cd0397`: Item 4 — Remove unverified citations, add `source_reference: "SOURCE: TO BE VERIFIED"`
- `df14936`: Item 5 — Add per-rule version, changelog, and source reference in rule schema and admin tables
- `ecc12c6`: Item 6 — Implement safe sandboxed AST expression evaluator (`evaluator.ts`) for rule logic strings
- `f587621`: Item 7 — Add statutory rules for infrastructure, faculty cadre mix, and cross-application duplicates
- `5e66ebd`: Item 8 — Fail-closed manual review on low extraction confidence (< 0.75)
- `5e67d79`: Item 9 — Comprehensive unit test suite (`evaluator.test.mjs`, `rules.test.mjs`, `sentinel.test.mjs` — 24/24 passing)
- `63f2430`: Docs — Updated `VERIFY_BEFORE_SUBMISSION.md` with complete catalog of 14 verified source parameters

---

## Phase 6: Wording and Safeguards (PROPOSED PLAN)

> **Objective:** Ensure suspected anomalies are strictly treated as advisory indicators requiring manual review, never conclusive proof of forgery or fraud. Eliminate all inflammatory terms, exclamation marks, and accusatory language across all UI text, seed data, officer annotations, finding titles, reports, README, and landing page.

### Item 1: Enum, Schema, Type, and File Renaming
- **Problem:** Codebase uses accusatory enum values and column names: `CROSS_INSTITUTION_COLLUSION`, `collusionRiskScore`, `CollusionRadarData`, and `COLLUSION_FACTOR_WEIGHTS`. Component files also use `CollusionRadar*.tsx`.
- **Exact Changes:**
  1. `src/types/index.ts`:
     - Rename enum value in `FindingCategory`: `'CROSS_INSTITUTION_COLLUSION'` -> `'CROSS_INSTITUTION_LINKAGE'`.
     - In `Application`: rename `collusionRiskScore: number` -> `linkageRiskScore: number`.
     - Rename interface `CollusionRadarData` -> `LinkageRadarData` (with `overallLinkageRiskScore: number`).
     - In `InspectionObservation`: rename `physicalVerificationStatus: 'Verified' | 'Deficient' | 'Discrepant' | 'Inconclusive'` (replace `'Fraudulent'`).
  2. File and component renames:
     - Rename `src/components/CollusionRadarGraph.tsx` -> `src/components/LinkageRadarGraph.tsx` (export `LinkageRadarGraph` with backward-compatible alias `CollusionRadarGraph`).
     - Rename `src/app/preview/_components/CollusionRadarSection.tsx` -> `src/app/preview/_components/LinkageRadarSection.tsx` (export `LinkageRadarSection` with alias `CollusionRadarSection`).
  3. `prisma/schema.prisma` & `prisma/schema.sql`:
     - Rename enum value `CROSS_INSTITUTION_COLLUSION` -> `CROSS_INSTITUTION_LINKAGE`.
     - Rename column `collusionRiskScore` -> `linkageRiskScore` on `Application`.
  4. `prisma/seed.ts`:
     - Update references to `linkageRiskScore` and `CROSS_INSTITUTION_LINKAGE`.
  5. `src/lib/radar/graph.ts`:
     - Rename class `CollusionRadarEngine` -> `LinkageRadarEngine` (export alias for backward compatibility).
     - Rename `overallCollusionRiskScore` -> `overallLinkageRiskScore`.
     - Rename `COLLUSION_FACTOR_WEIGHTS` -> `LINKAGE_FACTOR_WEIGHTS` (export alias).
     - Update `computeCrossInstitutionRiskScore`.
  6. `src/lib/store.ts`:
     - Update applications and data store methods to use `linkageRiskScore`.
  7. `src/lib/rules/engine.ts` & `src/lib/forensics/engine.ts`:
     - Update finding category assignments from `CROSS_INSTITUTION_COLLUSION` to `CROSS_INSTITUTION_LINKAGE`.
  8. `src/app/api/applications/route.ts` & `src/app/api/radar/route.ts`:
     - Return `linkageRiskScore` and `LinkageRadarData`.
  9. `tests/sentinel.test.mjs`:
     - Update test assertions for linkage weights and score calculation.

---

### Item 2: Neutral Advisory Phrasing Across UI, Store, Graph, and Documentation
- **Problem:** Inflammatory words exist across the codebase: "Fraud Intelligence", "CRITICAL FRAUD ALERT", "Inspect Fraud File", "High Fraud Affinity", "clandestine multi-college syndicates", "Blatant document recycling", "Clear double-pledging", "High probability of fabricated...", "Critical cross-institutional fraud identified", "Collusion Radar", "Collusion Risk Score".
- **Exact Substitutions:**
  - `"Fraud Intelligence"` -> `"Compliance Intelligence"`
  - `"CRITICAL FRAUD ALERT"` -> `"HIGH LINKAGE ANOMALY"`
  - `"Inspect Fraud File"` -> `"Inspect Case File"`
  - `"High Fraud Affinity"` -> `"Elevated Linkage Affinity"`
  - `"clandestine multi-college syndicates"` -> `"interlocking institutional relationships"`
  - `"Blatant document recycling"` -> `"Potential duplicate document submission"`
  - `"Clear double-pledging"` -> `"Possible overlapping land claim (verify sub-division records)"`
  - `"High probability of fabricated carpet area schedule"` -> `"Potential discrepancy in declared carpet area schedule"`
  - `"Critical cross-institutional fraud identified"` -> `"Potential cross-institution linkage detected"`
  - `"Collusion Radar"` -> `"Linkage Radar"`
  - `"Collusion Risk Score"` -> `"Linkage Risk Score"`
  - `"Land Double-Pledging Conflict"` -> `"Possible Overlapping Land Claim (verify sub-division records)"`
- **Exact Files Changed:**
  1. `src/lib/store.ts`: Update officer annotations (`FIND-NOV-001`, `FIND-NOV-003`, `FIND-APX-001`, `FIND-APX-002`) and institution alert badges.
  2. `src/lib/radar/graph.ts`: Replace node labels (`"COLLUSION: Survey No. 289/1A"` -> `"Possible Overlapping Land: Survey No. 289/1A"`, `"COLLUSION: Dr. Vikram Malhotra"` -> `"Concurrent Faculty Linkage: Dr. Vikram Malhotra"`, and edge labels).
  3. `src/lib/rules/engine.ts`: Replace finding titles and explanations (e.g. `"Cross-Institution Linkage: Concurrent Faculty Declaration"`, `"Possible Overlapping Land Survey No. 289/1A"`).
  4. `src/lib/forensics/engine.ts`: Replace finding titles and descriptions.
  5. `src/lib/adapters/index.ts`: Replace mock notes (`"LINKAGE ALERT: Survey Number 289/1A..."`).
  6. `src/components/CollusionRadarGraph.tsx`: Update UI titles, subtitles, and node inspection drawers to Linkage Radar.
  7. `src/components/Navbar.tsx`: Update navigation link label from `"Collusion Radar"` to `"Linkage Radar"`.
  8. `src/components/StatusChip.tsx`: Update category chips.
  9. `src/app/page.tsx`: Update landing cards, alert badges, and action buttons.
  10. `src/app/officer/page.tsx`: Update queue table headers and risk tier descriptions.
  11. `src/app/officer/radar/page.tsx`: Update page header and tab labels.
  12. `src/app/officer/case/[id]/page.tsx`: Update case file headers and finding cards.
  13. `src/app/officer/scrutiny/[id]/page.tsx`: Update scrutiny findings and remarks.
  14. `src/app/evc/inspect/[id]/page.tsx`: Update field observation status options.
  15. `src/app/preview/layout.tsx`: Update preview nav link to `"Linkage Radar"`.
  16. `src/app/preview/page.tsx`: Update preview index cards.
  17. `src/app/preview/radar/page.tsx`: Update radar page title and description.
  18. `src/app/preview/all/page.tsx`: Update consolidated preview section headers.
  19. `src/app/preview/_components/CollusionRadarSection.tsx`: Update section title, cards, and descriptions.
  20. `src/app/preview/_components/OfficerQueueSection.tsx`: Update queue explanation.
  21. `src/app/preview/_components/CaseFileSection.tsx`: Update finding titles and tags.
  22. `src/app/preview/_components/ScrutinyReportSection.tsx`: Update report findings and concluding remarks.
  23. `README.md`: Update title, problem descriptions, walkthroughs, and architecture diagrams.

---

### Item 3: Dynamic Scrutiny Report Recommendations & Exclamation Mark Removal
- **Problem:** Scrutiny reports currently use generic hardcoded verdicts that state conclusive fraud and recommend vigilance inquiries even for applications without linkages. Furthermore, exclamation marks appear across alerts.
- **Exact Changes:**
  1. `src/app/officer/scrutiny/[id]/page.tsx` & `src/app/preview/_components/ScrutinyReportSection.tsx`:
     - Implement dynamic concluding remarks logic:
       - **Clean / Low-Risk Case (e.g. Sunrise Institute):**
         `"All submitted declarations and statutory records are verified authentic against simulated state registries with zero unresolved anomalies. Suggested for officer review / approval consideration."`
         *(Strict requirement: Zero mention of linkages, land conflicts, or fraud for clean applications)*
       - **Deficiency Case without Cross-App Linkages (e.g. Nova Engineering):**
         `"Specific statutory deficiencies identified during automated checks (e.g., structural certificate omission and faculty strength deficit). Suggested for officer review / EVC inspection consideration."`
       - **Cross-Institution Linkage Case (e.g. Apex Polytechnic):**
         `"Potential cross-institution linkages and document discrepancies detected requiring manual verification of sub-division records and physical site claims. Suggested for officer review / EVC inspection / vigilance referral consideration."`
     - Ensure all concluding recommendations are phrased strictly as *"Suggested for officer review / EVC inspection / vigilance referral consideration"* or *"Suggested for officer review / approval consideration"*, never a definite conclusion of guilt or forgery.
  2. Audit and remove **every single exclamation mark (`!`)** from:
     - `src/lib/store.ts` (alerts, notes, document descriptions)
     - `src/lib/radar/graph.ts` (node metadata alerts)
     - `src/lib/adapters/index.ts` (mock registry notes)
     - `src/lib/rules/engine.ts` (finding explanations)
     - `README.md` (scenario walkthroughs)

---

### Item 4: Automated Grep Verification for Prohibited Inflammatory Terms
- **Problem:** Ensure no forbidden terms remain in user-facing text, comments describing user-facing behavior, seed data, or report templates.
- **Exact Changes:**
  1. Add automated test in `tests/sentinel.test.mjs`:
     - Scans `src/app/`, `src/components/`, `src/lib/store.ts`, `src/lib/radar/graph.ts`, `src/lib/rules/engine.ts`, and `README.md`.
     - Asserts 0 occurrences of prohibited inflammatory words: `fraud`, `collusion`, `syndicate`, `blatant`, `clandestine`, and `double-pledg`.
  2. Run grep verification across the workspace and fix any residual hits.

---

## Phase 7: Security, Privacy, Honesty of Mocks (PROPOSED PLAN)

> **Objective:** Enforce role-based PII protection, honestly label all simulated integrations, watermark prototype reports, sanitize demo email addresses, replace "immutable" claims with "tamper-evident", secure public demo endpoints, and reconcile authentication documentation.

### Item 5: `maskPII()` Utility & Synthetic Demo Identifiers
- **Problem:** Real or realistic-looking PANs, Aadhaar numbers, phone numbers, and emails are displayed in plain text in public views and findings.
- **Exact Changes:**
  1. Create `src/lib/security/privacy.ts`:
     - Export `maskPII(text: string, role?: UserRole | string): string`
     - Export `maskPan(pan: string, isAuthorized: boolean): string`
     - Export `maskAadhaar(aadhaar: string, isAuthorized: boolean): string`
     - Export `maskPhone(phone: string, isAuthorized: boolean): string`
     - Export `maskEmail(email: string, isAuthorized: boolean): string`
     - Rule: Unmasked values only returned if `role === 'OFFICER' || role === 'AUDITOR'`.
     - In all other roles and public preview routes:
       - PAN: `DEMOPAN9999X` / `DEMO***99X`
       - Aadhaar: `DEMO-XXXX-9999`
       - Phone: `+91-XXXXX-99999`
       - Email: `u***r@sentinel-demo.example`
  2. `src/lib/radar/graph.ts` & `src/lib/store.ts`:
     - Replace realistic identifiers in demo seed data with obviously synthetic test values:
       - `XYZPK9876Q` -> `DEMOPAN9999X`
       - `AAATS9812K` -> `DEMOTRUST88K`
       - `AAATN4491M` -> `DEMOTRUST44M`
       - `AAATA7731P` -> `DEMOTRUST77P`
  3. Apply `maskPII()` across:
     - Finding explanations and evidence locators in `src/lib/rules/engine.ts`
     - Radar node metadata and labels in `src/components/CollusionRadarGraph.tsx` and `CollusionRadarSection.tsx`
     - Scrutiny reports in `ScrutinyReportSection.tsx` and `scrutiny/[id]/page.tsx`
     - Document metadata JSON views in `CaseFileSection.tsx` and `DocumentViewerModal.tsx`
  4. Add unit tests for `maskPII()` in `tests/sentinel.test.mjs`.

---

### Item 6: Honest Mock Labeling (`(simulated)`) & Protocol Claim Cleanup
- **Problem:** External registries (DigiLocker, Bhoomi, ICAI UDIN, BBMP) appear without explicit simulation tags, and unimplemented protocols (gRPC, mTLS, SOAP, Aadhaar e-Sign) are claimed.
- **Exact Changes:**
  1. Append `(simulated)` to every mention of real external registries/institutions:
     - `"Bhoomi"` -> `"Bhoomi (simulated)"`
     - `"DigiLocker"` -> `"DigiLocker (simulated)"`
     - `"ICAI UDIN"` -> `"ICAI UDIN (simulated)"`
     - `"BBMP"` -> `"BBMP (simulated)"`
     - `"Mahabhulekh"` -> `"Mahabhulekh (simulated)"`
     - `"National Academic Depository (NAD)"` -> `"National Academic Depository (NAD) (simulated)"`
  2. Remove references to `"Aadhaar e-Sign"` and unimplemented protocols (`gRPC`, `mTLS`, `SOAP`):
     - In `src/app/preview/_components/AdminSection.tsx`:
       - `SOAP / XML & JSON Gateway` -> `REST / HTTPS Gateway (simulated)`
       - `AICTE Central Faculty Portal & Aadhaar e-Sign` -> `AICTE Central Faculty Portal (simulated)`
       - `gRPC / Mutual TLS` -> `REST / HTTPS (simulated)`
     - In `src/app/admin/page.tsx`: Ensure adapter table truthfully displays REST / HTTPS simulation.
     - In `src/lib/adapters/index.ts`: Ensure comments and metadata truthfully state mock HTTP/REST simulation.
     - In `README.md`: Align adapter descriptions.

---

### Item 7: Scrutiny Report Prototype Watermark & Persistent Top Header Banner
- **Problem:** Scrutiny reports and top navigation headers must clearly communicate prototype status and synthetic data to evaluators.
- **Exact Changes:**
  1. Add persistent compact top disclaimer banner to `src/components/Navbar.tsx`:
     ```tsx
     <div className="bg-amber-500/15 border-b border-amber-500/30 text-amber-200 text-[11px] font-semibold py-1 px-4 text-center tracking-wide flex items-center justify-center gap-2">
       <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
       <span>Synthetic data - Simulated integrations • PROTOTYPE - NOT AN OFFICIAL AICTE DOCUMENT</span>
     </div>
     ```
  2. Update public preview banner in `src/app/preview/layout.tsx`:
     Include `"Synthetic data - Simulated integrations • PROTOTYPE - NOT AN OFFICIAL AICTE DOCUMENT"`.
  3. Watermark scrutiny reports in `src/app/officer/scrutiny/[id]/page.tsx` and `src/app/preview/_components/ScrutinyReportSection.tsx`:
     - Add prominent header/diagonal banner watermark: `"PROTOTYPE - NOT AN OFFICIAL AICTE DOCUMENT"`.
     - Ensure watermark persists in print styling (`@media print`).

---

### Item 8: Demo Email Migration to `@sentinel-demo.example`
- **Problem:** Demo emails currently use official government-looking domains (`@aicte-india.org`, `@aicte-evc.gov.in`, `@cag.gov.in`), risking confusion.
- **Exact Changes:**
  1. Replace all demo email addresses:
     - `officer@aicte-india.org` -> `officer@sentinel-demo.example`
     - `inspector@aicte-evc.gov.in` -> `inspector@sentinel-demo.example`
     - `admin@aicte-india.org` -> `admin@sentinel-demo.example`
     - `auditor@cag.gov.in` -> `auditor@sentinel-demo.example`
     - `institution@sunrise.edu` -> `institution@sentinel-demo.example`
  2. Files modified:
     - `src/lib/auth/session.ts` (`DEMO_CREDENTIALS`)
     - `src/lib/store.ts` (`DEMO_USERS`)
     - `src/app/login/page.tsx` (default email state, role switcher cards, input placeholder)
     - `prisma/seed.ts`
     - `README.md` (demo credentials table)
     - `tests/sentinel.test.mjs` (role security tests)

---

### Item 9: Remove "CAG Audit Node" Claims & Replace "Immutable" with "Tamper-Evident"
- **Problem:** Claims of "Verifiable on CAG Audit Node" overstate external blockchain/auditor node infrastructure. Calling ledgers "immutable" is technically inaccurate for application software without write-once hardware; the correct technical term is "tamper-evident".
- **Exact Changes:**
  1. `src/app/preview/_components/ScrutinyReportSection.tsx` & `src/app/officer/scrutiny/[id]/page.tsx`:
     - Replace `"Untampered • Verifiable on CAG Audit Node"` with `"Untampered • Verifiable via Tamper-Evident SHA-256 Ledger"`.
  2. Global replacement of `"immutable"` with `"tamper-evident"`:
     - `src/lib/audit/trail.ts`: Replace "Immutable ledger" comments with "Tamper-evident ledger".
     - `src/app/admin/page.tsx`: Replace "Immutable Hash-Chained Audit Trail" with "Tamper-Evident Hash-Chained Audit Trail".
     - `src/app/auditor/page.tsx`: Replace "Immutable Hash Chain" with "Tamper-Evident Hash Chain".
     - `src/app/evc/inspect/[id]/page.tsx`: Replace "immutable audit trail" with "tamper-evident audit trail".
     - `src/app/institution/applications/[id]/page.tsx`: Replace "immutable SHA-256 hash" with "tamper-evident SHA-256 hash".
     - `src/app/page.tsx`: Replace "Immutable SHA-256 hash-chained log" with "Tamper-evident SHA-256 hash-chained log".
     - `src/app/preview/_components/AdminSection.tsx` & `AuditSection.tsx`: Replace "Immutable" with "Tamper-Evident".
     - `src/app/preview/all/page.tsx` & `page.tsx`: Replace "immutable audit trails" with "tamper-evident audit trails".
     - `src/components/DocumentViewerModal.tsx`: Replace "Immutable Document Version" with "Tamper-Evident Document Version".
     - `prisma/schema.sql`: Update section headers.
     - `README.md`: Update architecture and module descriptions.
     - `tests/sentinel.test.mjs`: Update test descriptions.

---

### Item 10: Public Demo Safety (Read-Only Admin/Auditor, Upload Validation, Vercel Storage Confirmation)
- **Problem:** Public deployments must prevent abuse, reject oversized or invalid files, protect admin/auditor state from arbitrary mutation, and confirm Vercel compatibility.
- **Exact Changes:**
  1. `src/app/api/documents/upload/route.ts`:
     - Enforce file size limit: `file.size <= 10 * 1024 * 1024` (10MB max). Return 400 error if exceeded: `"File size exceeds maximum statutory limit of 10MB."`
     - Validate file MIME type: Allow only `application/pdf`, `image/png`, `image/jpeg`. Return 400 error if invalid: `"Invalid file format. Only PDF, PNG, and JPEG documents are permitted."`
     - Add in-memory sliding window rate-limiter (max 10 uploads per IP/minute).
  2. `src/app/api/auth/login/route.ts`:
     - Add rate limiting (max 20 requests per minute).
  3. `src/app/admin/page.tsx` & `src/app/auditor/page.tsx`:
     - Add visual demo safeguards: display `"Public Demo Environment — Configuration Changes Simulated"` notice banner.
  4. Storage and Database Confirmation:
     - Audit and report: Document uploads calculate SHA-256 in memory and persist metadata records directly to `DataStore` in memory.
     - No binary files are written to local disk (which would crash ephemeral Vercel serverless functions). Storage is 100% Vercel compatible.

---

### Item 11: Reconcile Auth & Database Architecture Truth in Documentation
- **Problem:** Erroneous or outdated mentions of NextAuth and direct Prisma runtime connections cause confusion when the active prototype operates with Firebase Auth SDK / demo switcher + in-memory DataStore.
- **Exact Changes:**
  1. `README.md`:
     - Explicitly describe the dual-layer architecture:
       - **Active Prototype Runtime:** Firebase Auth SDK for client authentication with 1-click role switcher, paired with an in-memory `DataStore` and cryptographic audit trail engine for zero-dependency Vercel serverless deployment.
       - **Production Architecture Schema:** `prisma/schema.prisma` and `prisma/schema.sql` provide the fully modeled PostgreSQL schema ready for enterprise deployment.
       - **Correction:** Explicitly note that NextAuth is NOT used.
  2. `src/app/login/page.tsx`:
     - Ensure UI text clearly describes Firebase Authentication with Quick Role Switcher.

---

### Item 12: Final Automated Testing, Linting, Build, and Verification
- **Exact Actions:**
  1. Update and expand `tests/sentinel.test.mjs`:
     - Verify PII masking for unauthorized roles
     - Verify absence of prohibited inflammatory words
     - Verify upload file type and size validation logic
     - Verify linkage formula and weights
     - Verify tamper-evident hash chaining
  2. Run `npm test` -> ensure all unit tests pass (100%).
  3. Run `npx tsc --noEmit` -> ensure 0 TypeScript errors.
  4. Run `npm run lint` -> ensure 0 lint errors.
  5. Run `npm run build` -> ensure clean production Next.js build.
  6. Verify all `/preview/*` routes render clean server-side HTML.

---

## Step-by-Step Implementation Sequence (One Item at a Time)

| Step | Item | Scope | Verification | Planned Commit Message |
|---|---|---|---|---|
| **Step 1** | Phase 6 Item 1 | Enum, schema, and type renaming (`CROSS_INSTITUTION_COLLUSION` -> `CROSS_INSTITUTION_LINKAGE`, `collusionRiskScore` -> `linkageRiskScore`) | `npm test` & typecheck | `refactor(phase-6): rename collusion enum, fields, and variables to linkage` |
| **Step 2** | Phase 6 Item 2 | Neutral advisory phrasing across UI, store, graph, and documentation | Grep & visual check | `refactor(phase-6): replace inflammatory fraud wording with neutral advisory phrasing` |
| **Step 3** | Phase 6 Item 3 | Dynamic scrutiny report recommendations and remove all exclamation marks | Report test & grep `!` | `fix(phase-6): dynamic scrutiny report recommendations and remove all exclamation marks` |
| **Step 4** | Phase 6 Item 4 | Automated test verifying 0 prohibited inflammatory terms | `npm test` term audit | `test(phase-6): add automated regression test verifying zero prohibited inflammatory words` |
| **Step 5** | Phase 7 Item 5 | `maskPII()` utility in `src/lib/security/privacy.ts` and synthetic demo identifiers | Privacy unit test | `feat(phase-7): implement maskPII utility and adopt synthetic demo identifiers` |
| **Step 6** | Phase 7 Item 6 | Honest mock labeling (`(simulated)`) and protocol cleanup | UI & Admin check | `refactor(phase-7): label external registries simulated and clean up protocol claims` |
| **Step 7** | Phase 7 Item 7 | Scrutiny report prototype watermark and persistent top header banner | Print & Navbar check | `feat(phase-7): add prototype report watermark and persistent header disclaimer badge` |
| **Step 8** | Phase 7 Item 8 | Demo email migration to `@sentinel-demo.example` | Login & auth test | `refactor(phase-7): migrate demo emails to sentinel-demo.example domain` |
| **Step 9** | Phase 7 Item 9 | Remove CAG node claims and replace "immutable" with "tamper-evident" | Grep check & build | `refactor(phase-7): replace immutable claims with tamper-evident and remove CAG node claims` |
| **Step 10** | Phase 7 Item 10 | Public demo safety (upload size/MIME validation, rate limiting, Vercel storage report) | Upload API test | `feat(phase-7): enforce upload validation rate limiting and confirm Vercel compatibility` |
| **Step 11** | Phase 7 Item 11 | Reconcile auth and database documentation truth in README and login | Doc review | `docs(phase-7): align auth and database architecture documentation to actual implementation` |
| **Step 12** | Phase 7 Item 12 | Final full-suite verification (`npm test`, `npx tsc`, `npm run build`, `/preview/all` check) | 100% build & test | `test(phase-7): complete end-to-end verification and preview route validation` |