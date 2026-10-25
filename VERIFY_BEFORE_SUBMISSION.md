# AICTE Sentinel — Statutory Verification Checklist (VERIFY_BEFORE_SUBMISSION)

> **Regulatory Integrity Protocol:** Under the SIH26261 evaluation rules, AICTE regulation numbers, clause numbers, table numbers, and statutory thresholds must never be invented or hallucinated. Where an exact authoritative citation from the official AICTE Approval Process Handbook (APH) is pending confirmation, the placeholder `"SOURCE: TO BE VERIFIED"` is strictly used.

The table below catalogs every location in the codebase requiring authoritative source verification prior to production submission to AICTE officials:

| Item # | Component / File | Code Location | Current Text / Placeholder | Required Official AICTE Verification |
|---|---|---|---|---|
| 1 | `src/lib/rules/packs.json` | Rule `BLDG-CARPET-003` (line 72) | `meeting AICTE Norms [SOURCE: TO BE VERIFIED]` | Verify exact Table number in AICTE Approval Process Handbook (Instructional & Administrative Area Norms). |
| 2 | `src/lib/store.ts` | Finding `FIND-APX-002` | `AICTE Approval Process Handbook Regulations [SOURCE: TO BE VERIFIED]` | Verify exact Clause number for Show-Cause notice / duplicate document submission penalties. |
| 3 | `src/lib/rules/packs.json` | Rule `FACULTY-COUNT-001` (line 95) | `for approved programme level and student basis [SOURCE: TO BE VERIFIED]` | Verify exact APH Annexure / Notification regarding Cadre Ratio and SFR. |
| 4 | `src/lib/config/norms.ts` | `STUDENT_FACULTY_RATIOS` & `FACULTY_CALCULATION_BASIS` | `UG: 20, DIPLOMA: 25, PG: 15; basis: ANNUAL_INTAKE [SOURCE: TO BE VERIFIED]` | Verify statutory Student-Faculty ratios across programmes and whether ratio applies to annual intake vs total student enrolment across all academic years. |
| 5 | `src/lib/rules/packs.json` | Rule `LAND-AREA-002` (line 23) | `based on location classification [SOURCE: TO BE VERIFIED]` | Verify exact Land Requirement Table in AICTE APH Chapter I. |
| 6 | `src/lib/config/norms.ts` | `MINIMUM_LAND_AREA_ACRES` | `metro: 1.5, urban: 2.5, semi-urban: 2.5, rural: 4.0 [SOURCE: TO BE VERIFIED]` | Verify baseline land area requirements by urban/rural agglomeration classification in AICTE APH Land Norms. |
| 7 | `src/lib/rules/packs.json` | Rule `LAND-DEED-001` (lines 11-12) | `continuous lease deed [SOURCE: TO BE VERIFIED]` | Verify minimum lease deed duration (e.g. 30 years vs state-specific concessions) in AICTE APH Land Norms. |
| 8 | `src/lib/rules/packs.json` | Rule `FACULTY-APPT-002` (line 108) | `statutory pay-scale norms [SOURCE: TO BE VERIFIED]` | Verify statutory central/state pay commission orders for core faculty appointments. |
| 9 | `src/lib/rules/packs.json` | Rule `ACAD-INTAKE-001` (lines 191-192) | `programme accreditation eligibility [SOURCE: TO BE VERIFIED]` | Verify NBA accreditation eligibility threshold and percentage cap for expansion in AICTE APH Chapter II. |
| 10 | `src/lib/rules/packs.json` | All Rules (`source_reference`) | `source_reference: "SOURCE: TO BE VERIFIED"` | Audit and replace placeholder with official Approval Process Handbook section / sub-clause citations. |
| 11 | `src/lib/rules/packs.json` | Rule `DATE-VALID-001` (line 261) | `90-day affidavit notarization window [SOURCE: TO BE VERIFIED]` | Verify statutory validity window for non-judicial stamp paper affidavit prior to application closing date. |

---

### Advisory Notice
All compliance decisions output by AICTE Sentinel are decision-support advisories only. Final regulatory determinations rest exclusively with the AICTE Bureau of Approvals, the Executive Committee, and authorized Appellate Bodies.
