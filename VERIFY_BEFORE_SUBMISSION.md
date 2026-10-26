# AICTE Sentinel — Statutory Verification Checklist (VERIFY_BEFORE_SUBMISSION)

> **Regulatory Integrity Protocol:** Under Smart India Hackathon 2026 (Problem Statement SIH26261) evaluation ground rules, AICTE regulation numbers, clause numbers, table numbers, and statutory thresholds must never be invented or hallucinated. Where an exact authoritative citation from the official AICTE Approval Process Handbook (APH) is pending gazette verification, the placeholder `"SOURCE: TO BE VERIFIED"` is strictly used.

The table below catalogs every location in the codebase requiring authoritative source verification prior to submission or production deployment:

| Item # | Category | Component / File | Code Location | Current Text / Parameter | Required Official AICTE Handbook Verification |
|---|---|---|---|---|---|
| 1 | **Land Area** | `src/lib/config/norms.ts` | `MINIMUM_LAND_AREA_ACRES` | `metro: 1.5, urban: 2.5, semi-urban: 2.5, rural: 4.0` | Verify baseline contiguous land acreage norms by location agglomeration in AICTE APH Land Norms chapter. |
| 2 | **Land Lease Tenure** | `src/lib/rules/packs.json` | Rule `LAND-DEED-001` | `continuous lease deed [SOURCE: TO BE VERIFIED]` | Verify minimum registered lease duration (e.g., 30 years vs state government concessions) in AICTE APH Land Norms. |
| 3 | **Student Faculty Ratio** | `src/lib/config/norms.ts` | `STUDENT_FACULTY_RATIOS` | `UG: 20 (1:20), DIPLOMA: 25 (1:25), PG: 15 (1:15)` | Verify statutory Student-to-Faculty Ratios (SFR) across technical programmes in AICTE APH Faculty Norms. |
| 4 | **Faculty Enrolment Basis** | `src/lib/config/norms.ts` | `FACULTY_CALCULATION_BASIS` | `ANNUAL_INTAKE` vs `TOTAL_ENROLMENT_ALL_YEARS` | Verify whether SFR applies to single-year approved annual intake or multi-year aggregate student enrolment across all cohorts. |
| 5 | **Faculty Cadre Ratio** | `src/lib/config/norms.ts` | `FACULTY_CADRE_RATIO` | `1 Professor : 2 Associate Professors : 6 Assistant Professors` | Verify cadre distribution ratio (1:2:6 for UG Engineering / Tech) in AICTE APH Faculty Cadre chapter. |
| 6 | **Faculty Pay Scales** | `src/lib/rules/packs.json` | Rule `FACULTY-APPT-002` | `statutory pay-scale norms [SOURCE: TO BE VERIFIED]` | Verify applicable central/state 7th CPC / AICTE pay scales and service rules for regular teaching faculty. |
| 7 | **Carpet Area per Student** | `src/lib/rules/packs.json` | Rule `BLDG-CARPET-003` | `carpet_area_sqm >= proposedIntake * 10.5` | Verify instructional and administrative carpet area schedule (sqm per student multiplier) in AICTE APH Building Norms. |
| 8 | **Intake Expansion Ceiling** | `src/lib/rules/packs.json` | Rule `ACAD-INTAKE-001` | `proposedIntake <= currentIntake * 1.5` | Verify NBA accreditation eligibility threshold and percentage ceiling for expansion (e.g. 50% increase) in AICTE APH Chapter II. |
| 9 | **Affidavit Window** | `src/lib/rules/packs.json` | Rule `DATE-VALID-001` | `date_diff <= 90 days` | Verify allowable chronological window for execution/notarization of non-judicial stamp paper affidavit prior to application closing date. |
| 10 | **Extraction Confidence** | `src/lib/config/norms.ts` | `MIN_EXTRACTION_CONFIDENCE_THRESHOLD` | `0.75 (75%)` | Verify statutory administrative threshold under fail-closed protocol below which extracted OCR claims mandate manual officer review. |
| 11 | **Laboratory & Equipment** | `src/lib/rules/packs.json` | Rule `INFRA-LAB-001` | `Specialized instructional laboratories declared vs evidenced` | Verify required equipment master register and laboratory layout schedule in AICTE APH Infrastructure chapter. |
| 12 | **Duplicate Certificate Finding** | `src/lib/rules/packs.json` & `store.ts` | Rule `CROSS-CERT-DUP-001` & `FIND-APX-002` | `Show-Cause notice under statutory regulations` | Verify exact statutory clause under AICTE Regulations for penal proceedings / Show-Cause issuance on duplicate document filing. |
| 13 | **Reused Faculty Finding** | `src/lib/rules/packs.json` & `store.ts` | Rule `CROSS-FACULTY-DUP-001` & `FIND-NOV-003` | `AICTE Vigilance Committee referral` | Verify statutory procedure for simultaneous multi-institutional faculty deployment / ghost faculty referral to AICTE Vigilance. |
| 14 | **Rule Citations** | `src/lib/rules/packs.json` | All 26 Rules (`source_reference`) | `"source_reference": "SOURCE: TO BE VERIFIED"` | Audit and replace placeholder with official Approval Process Handbook section / sub-clause citations for all 26 compliance rules. |

---

### Advisory Notice
All compliance decisions output by AICTE Sentinel are decision-support advisories only. Final regulatory determinations rest exclusively with the AICTE Regulation Bureau, the Executive Committee, and authorized Appellate Bodies.
