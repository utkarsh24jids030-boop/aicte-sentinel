# AICTE Sentinel — Implementation Plan

> **Branch:** `fixes-review`  
> **Status:** Phase 1 Complete (Commits `4fb0f97`..`707680f`). **Phase 2 Pending User Approval.**  
> **Target Problem Statement:** SIH26261 (Smart India Hackathon 2026)  
> **Regulatory Integrity Protocol:** No invented regulations, clauses, table numbers, or handbook editions. All placeholder citations marked `SOURCE: TO BE VERIFIED` and tracked in `VERIFY_BEFORE_SUBMISSION.md`. All data remains synthetic; mock integrations labeled simulated; advisory decision-support only.

---

## Phase 1 Status: One Source of Truth (COMPLETED)

All 8 items of Phase 1 were successfully implemented, verified (`npm test`, `npx tsc --noEmit`, `npm run lint`, `npm run build`), and committed:
- `4fb0f97`: `feat(item-1): centralize all findings, readiness scores, and deficiencies in rule engine`
- `45bac20`: `feat(item-2): unify officer, institution, scrutiny, landing, and preview screens to single computed truth`
- `995115a`: `feat(item-3): display documented readiness score formula and deduction breakdown in UI`
- `d7a7603`: `feat(item-4): document cross-institution collusion risk calculation and display weights in UI`
- `1342613`: `feat(item-6): display evaluation as-of date badge in officer queue and case headers`
- `707680f`: `test(items-4-6-7): add unit tests for filename neutrality, collusion weights, and as-of date anchor`

---

## Phase 2: Rule Engine Correctness (PROPOSED PLAN)

### Item 1: Fix `CONSIST-NAME-001` (Strict Entity-Type Consistency)
- **Problem:** Currently `CONSIST-NAME-001` compares the institution name declared in Affidavit against the land deed purchaser. On land deeds, the purchaser is the sponsoring Trust/Society, causing an erroneous type-mismatch finding or false equality when comparing an institution with a trust.
- **Exact Changes:**
  1. `src/lib/store.ts`:
     - On Land Deed extracted fields (`doc-sun-land`, `doc-nova-land`, etc.), rename `fieldKey: 'institution_name'` to `fieldKey: 'grantee_name'` (with label `Purchaser / Grantee Name`).
  2. `src/lib/rules/packs.json`:
     - Update `CONSIST-NAME-001` logic:
       `extracted('Affidavit', 'institution_name') == application.institution_name && extracted('Trust Deed', 'trust_name') == application.trust_name`
     - Update evidence fields to `["affidavit.institution_name", "application.institution_name", "trust_deed.trust_name", "application.trust_name"]`.
  3. `src/lib/rules/engine.ts`:
     - In `CONSIST-NAME-001`: compare institution name strictly to institution name (`Affidavit.institution_name` vs `app.institutionName`).
     - Compare trust name strictly to trust name (`Trust Deed.trust_name` vs `institution.trustName`).
     - Verify land deed grantee matches sponsoring trust or registered owning body; never compare institution name with grantee/trust name.

---

### Item 2: `LAND-AREA-002` (Location-Type Driven Minimum Acreage)
- **Problem:** `LAND-AREA-002` currently hardcodes `area < 2.5` acres in `engine.ts` regardless of region, while the message mentions semi-urban vs metro. Location types are not tracked on institutions.
- **Exact Changes:**
  1. `src/types/index.ts`:
     - Add `locationType: 'metro' | 'urban' | 'semi-urban' | 'rural'` to `Institution` interface.
  2. `prisma/schema.prisma` & `prisma/seed.ts`:
     - Add `locationType` column (default `"semi-urban"`) to Prisma schema and seed script.
  3. `src/lib/config/norms.ts` (new configuration file):
     - Export `MINIMUM_LAND_AREA_ACRES: Record<LocationType, number>`:
       - `metro`: 1.5 acres `[SOURCE: TO BE VERIFIED]`
       - `urban`: 2.5 acres `[SOURCE: TO BE VERIFIED]`
       - `semi-urban`: 2.5 acres `[SOURCE: TO BE VERIFIED]`
       - `rural`: 4.0 acres `[SOURCE: TO BE VERIFIED]`
  4. `src/lib/store.ts`:
     - Add `locationType` to `DEMO_INSTITUTIONS`:
       - Sunrise (`Bengaluru Urban`): `'urban'`
       - Nova (`Hinjawadi Pune`): `'semi-urban'`
       - Apex (`Hinjawadi Pune`): `'semi-urban'`
  5. `src/lib/rules/packs.json`:
     - Update `LAND-AREA-002` failure message and description to dynamically reflect the required threshold for the institution's regional tier.
  6. `src/lib/rules/engine.ts`:
     - In `LAND-AREA-002`: fetch institution `locationType`, query `MINIMUM_LAND_AREA_ACRES[locationType]`, compare declared acreage, and format failure message so logic and message agree.

---

### Item 3: `FACULTY-COUNT-001` (Configurable Ratio by Programme Level & Student Basis)
- **Problem:** `FACULTY-COUNT-001` hardcodes ratio 1:20 against proposed intake in `engine.ts`. The ratio should vary by programme level (e.g. Diploma vs UG vs PG), and the calculation basis (annual intake vs total multi-year enrolment) must be an explicit, configurable setting.
- **Exact Changes:**
  1. `src/lib/config/norms.ts`:
     - Export `STUDENT_FACULTY_RATIOS`:
       - `ENGINEERING_UG`: 20 `[SOURCE: TO BE VERIFIED]`
       - `POLYTECHNIC_DIPLOMA`: 25 `[SOURCE: TO BE VERIFIED]`
       - `POSTGRADUATE`: 15 `[SOURCE: TO BE VERIFIED]`
     - Export `FACULTY_CALCULATION_BASIS: 'ANNUAL_INTAKE' | 'TOTAL_ENROLMENT_ALL_YEARS' = 'ANNUAL_INTAKE'` `[SOURCE: TO BE VERIFIED]`.
     - Export helper `computeRequiredFaculty(app: Application): { required: number; ratio: number; level: string; basis: string }`.
  2. `src/lib/rules/packs.json`:
     - Update `FACULTY-COUNT-001` failure message:
       `"Total qualified faculty strength is below statutory AICTE Student-Faculty Ratio for declared programme level [SOURCE: TO BE VERIFIED]."`
  3. `src/lib/rules/engine.ts`:
     - In `FACULTY-COUNT-001`: compute required faculty using `computeRequiredFaculty(app)`, evaluate against declared faculty count from faculty documents/summary, and ensure the explanation text matches the applied ratio and calculation basis.

---

### Item 4: Remove Every Unverified Citation & Add `source_reference`
- **Problem:** Specific unverified citations exist across rules, actions, and messages: `"Clause 4.1"`, `"Table 2.1"`, `"2026 Approval Process Handbook"`, `"7th CPC"`, the NBA 50% expansion rule, and the 30-year lease minimum.
- **Exact Changes:**
  1. `src/lib/rules/packs.json`:
     - Replace 30-year lease mention in `LAND-DEED-001` with `"statutory lease duration [SOURCE: TO BE VERIFIED]"`.
     - Replace 7th CPC mention in `FACULTY-APPT-002` with `"statutory pay-scale norms [SOURCE: TO BE VERIFIED]"`.
     - Replace 50% NBA expansion rule in `ACAD-INTAKE-001` with `"statutory expansion threshold [SOURCE: TO BE VERIFIED]"`.
     - Add `"source_reference": "SOURCE: TO BE VERIFIED"` to all rules.
     - Reword all recommended actions to remove specific legal/handbook clause numbers.
  2. `src/lib/rules/engine.ts`:
     - Audit all finding titles, explanations, and recommended actions to ensure zero unverified clauses or table citations remain.
  3. `src/app/preview/_components/InstitutionSection.tsx` & `src/app/admin/page.tsx`:
     - Replace `"adhering to the 2026 Approval Process Handbook"` with `"adhering to statutory AICTE norms [SOURCE: TO BE VERIFIED]"`.
  4. `VERIFY_BEFORE_SUBMISSION.md`:
     - Catalog every single citation, threshold, and clause placeholder marked `"SOURCE: TO BE VERIFIED"`.

---

### Item 5: Per-Rule Version, Changelog, and Source Reference in Rule Schema
- **Problem:** The `ComplianceRule` schema lacks explicit changelog history and source reference fields.
- **Exact Changes:**
  1. `src/types/index.ts`:
     - Update `ComplianceRule`:
       ```ts
       export interface RuleChangelogEntry {
         version: string;
         effective_date: string;
         summary: string;
       }

       export interface ComplianceRule {
         rule_id: string;
         version: string;
         source_reference: string;
         changelog: RuleChangelogEntry[];
         // ... remaining fields
       }
       ```
  2. `src/lib/rules/packs.json`:
     - Populate `version`, `source_reference: "SOURCE: TO BE VERIFIED"`, and `changelog` (initial release `2026.1` and current `2026.3`) for every rule.
  3. `src/app/admin/page.tsx` & `src/app/preview/_components/AdminSection.tsx`:
     - Render rule version badges, source reference status (`SOURCE: TO BE VERIFIED`), and changelog history in the Rule Management table.

---

### Item 6: Safe Expression Evaluator (No `eval`) for Logic Strings
- **Problem:** The `logic` strings in `packs.json` are currently decorative; `engine.ts` uses a switch-statement. They must be parsed and evaluated for real without `eval()` or `new Function()`.
- **Exact Changes:**
  1. `src/lib/rules/evaluator.ts` (new file):
     - Implement a safe, sandboxed expression tokenizer and AST evaluator:
       - **Grammar:** Supports logical (`&&`, `||`, `!`), comparison (`==`, `!=`, `<`, `<=`, `>`, `>=`), arithmetic (`+`, `-`, `*`, `/`), parentheses, string/number/boolean/null literals.
       - **Functions:**
         - `has_document(type: string): boolean`
         - `extracted(type: string, key: string): string | null`
         - `extracted_number(type: string, key: string): number`
         - `extracted_bool(type: string, key: string): boolean`
         - `is_expired(type: string): boolean` (evaluates against `getAsOfDate()`)
         - `is_recent(type: string, key: string, maxDays: number): boolean`
         - `verification_status(type: string): string`
         - `date_diff(fieldPath: string, targetDate: string): number`
       - **Context Variables:**
         - `proposed_intake`, `current_intake`, `approved_intake`, `faculty_count`, `current_date`
     - **Security:** 100% pure TypeScript recursive-descent parser. Throws on syntax error; never executes raw JS code.
  2. `src/lib/rules/engine.ts`:
     - Use `RuleEvaluator.evaluate(rule.logic, evaluationContext)` to evaluate statutory rules.
  3. `src/lib/rules/packs.json`:
     - Validate all rule logic strings against the parser grammar to ensure complete syntactical and runtime correctness.

---

### Item 7: New Rules (Infrastructure, Cadre Mix, Cross-App Duplicate Cert & Faculty)
- **Problem:** Missing statutory checks for infrastructure evidence (labs, library, equipment), faculty cadre mix, and cross-application duplicate certificate numbers and faculty IDs in the main rule findings table.
- **Exact Changes:**
  1. `src/types/index.ts`:
     - Expand `RuleCategory` to include `'Infrastructure'` and `'Cross-Application'`.
  2. `src/lib/rules/packs.json`:
     - Add `INFRA-LAB-001` (Infrastructure Evidence: Declared labs/equipment vs proof).
     - Add `FACULTY-CADRE-001` (Faculty Cadre Mix: Professor : Associate : Assistant ratio [SOURCE: TO BE VERIFIED]).
     - Add `CROSS-CERT-DUP-001` (Cross-Application Certificate Duplicate Detection).
     - Add `CROSS-FACULTY-DUP-001` (Cross-Application Concurrent Faculty Employment).
  3. `src/lib/config/norms.ts`:
     - Define `FACULTY_CADRE_RATIO: { professor: 1, associate: 2, assistant: 6 }` `[SOURCE: TO BE VERIFIED]`.
  4. `src/lib/rules/engine.ts`:
     - Implement evaluation for the 4 new rules, outputting findings directly to the application's unified `Finding[]` table.

---

### Item 8: Fail-Closed on Low Extraction Confidence (< 75%)
- **Problem:** When an OCR/extracted field has low confidence, approving or relying on it blindly risks false compliance. Under fail-closed protocol, any extracted field used by a rule with confidence below threshold must trigger manual review.
- **Exact Changes:**
  1. `src/lib/config/norms.ts`:
     - Export `MIN_EXTRACTION_CONFIDENCE_THRESHOLD = 0.75` `[SOURCE: TO BE VERIFIED]`.
  2. `src/lib/rules/engine.ts`:
     - In `RulesEngine.evaluateApplication()`, inspect every extracted field utilized by statutory rules.
     - If `field.confidence < MIN_EXTRACTION_CONFIDENCE_THRESHOLD`:
       - Flag a `VERIFICATION_MISMATCH` finding:
         `"Low OCR / Extraction Confidence on field "${field.fieldLabel}" (${Math.round(field.confidence * 100)}% < 75%). Requires manual officer verification."`
       - Transition parent document's `verificationStatus` to `'Manual Review Required'`.
  3. `src/lib/store.ts`:
     - In `DataStore.getDocuments(appId)`: dynamically reflect `'Manual Review Required'` for documents with low-confidence fields.
     - Sunrise's `doc-sun-affidavit` (field `notary_registration_no` with confidence 0.62) automatically transitions from `Verified` to `Manual Review Required`.
  4. `src/app/page.tsx` & Preview routes:
     - Verify Sunrise dashboard displays `Manual Review Required` on the affidavit.

---

### Item 9: Comprehensive Unit Test Suite
- **Problem:** Need complete regression coverage verifying every rule (pass, fail, boundary), the safe expression evaluator, fail-closed low confidence behavior, and the readiness-score mathematical formula.
- **Exact Changes:**
  1. `tests/evaluator.test.mjs` (new file):
     - Test parser with complex logic expressions, operator precedence, function calls, missing values, syntax error safety.
  2. `tests/rules.test.mjs` (new file):
     - Test all 24+ statutory compliance rules under:
       - **Pass** conditions
       - **Fail** conditions
       - **Boundary** conditions (e.g., land area exactly 2.5 vs 2.49 acres; intake ratio thresholds; 90-day date expiration boundary).
  3. `tests/confidence.test.mjs` (new file):
     - Test fail-closed transition to `Manual Review Required` when field confidence is 0.62 (< 0.75).
  4. `package.json`:
     - Update `"test"` script to run `node --test tests/*.test.mjs`.

---

## Step-by-Step Implementation Sequence (One Item at a Time)

| Step | Action | Verification | Git Commit Message |
|---|---|---|---|
| **Step 1** | Implement Item 1 (Fix `CONSIST-NAME-001` & rename land deed grantee field) | Tests pass | `fix(item-1): enforce strict type consistency in CONSIST-NAME-001 and rename land deed grantee field` |
| **Step 2** | Implement Item 2 (`LAND-AREA-002` location types & config-driven acreage) | Tests pass | `feat(item-2): add location-type driven minimum land area with verified source placeholders` |
| **Step 3** | Implement Item 3 (`FACULTY-COUNT-001` configurable ratio & student basis setting) | Tests pass | `feat(item-3): make faculty ratio configurable by programme level with student basis setting` |
| **Step 4** | Implement Item 4 (Remove unverified citations & add `source_reference`) | Tests pass | `refactor(item-4): remove unverified regulatory citations and add source_reference to all rules` |
| **Step 5** | Implement Item 5 (Per-rule version, changelog, and source_reference in schema) | Typecheck & UI | `feat(item-5): add per-rule version, changelog, and source_reference to rule schema` |
| **Step 6** | Implement Item 6 (Safe expression evaluator for rule logic strings) | Unit tests pass | `feat(item-6): implement safe sandboxed expression evaluator for rule logic strings` |
| **Step 7** | Implement Item 7 (Add infrastructure, cadre mix, cross-app duplicate cert & faculty rules) | Engine tests | `feat(item-7): add statutory rules for infrastructure, faculty cadre mix, and cross-application duplicates` |
| **Step 8** | Implement Item 8 (Fail-closed on low extraction confidence < 75%) | Sunrise affidavit check | `feat(item-8): implement fail-closed manual review on low extraction confidence` |
| **Step 9** | Implement Item 9 (Full unit test suite for all rules, boundaries, and evaluator) | `npm test` 100% pass | `test(item-9): add comprehensive unit test suite for all statutory rules, boundaries, and evaluator` |
| **Step 10** | Update `VERIFY_BEFORE_SUBMISSION.md` with complete placeholder catalogue | Documentation | `docs: update VERIFY_BEFORE_SUBMISSION.md with complete catalogue of placeholder citations` |