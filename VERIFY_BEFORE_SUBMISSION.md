# AICTE Sentinel — Statutory Verification Checklist (VERIFY_BEFORE_SUBMISSION)

> **Regulatory Integrity Protocol:** Under the SIH26261 evaluation rules, AICTE regulation numbers, clause numbers, table numbers, and statutory thresholds must never be invented or hallucinated. Where an exact authoritative citation from the official AICTE Approval Process Handbook (APH) is pending confirmation, the placeholder `"SOURCE: TO BE VERIFIED"` is strictly used.

The table below catalogs every location in the codebase requiring authoritative source verification prior to production submission to AICTE officials:

| Item # | Component / File | Code Location | Current Text / Placeholder | Required Official AICTE Verification |
|---|---|---|---|---|
| 1 | `src/lib/rules/packs.json` | Rule `BLDG-CARPET-003` (line 72) | `meeting AICTE Norms [SOURCE: TO BE VERIFIED]` | Verify exact Table number in AICTE Approval Process Handbook (Instructional & Administrative Area Norms). |
| 2 | `src/lib/store.ts` | Finding `FIND-APX-002` | `AICTE Approval Process Handbook Regulations [SOURCE: TO BE VERIFIED]` | Verify exact Clause number for Show-Cause notice / duplicate document submission penalties. |
| 3 | `src/lib/rules/packs.json` | Rule `FACULTY-COUNT-001` (line 95) | `statutory AICTE Student-Faculty Ratio (1:20 for Engineering / 1:25 for Polytechnic) [SOURCE: TO BE VERIFIED]` | Verify exact APH Annexure / Notification regarding Cadre Ratio and SFR. |
| 4 | `src/lib/rules/packs.json` | Rule `LAND-AREA-002` (line 23) | `minimum 2.5 acres in semi-urban / 1.5 acres in metro [SOURCE: TO BE VERIFIED]` | Verify exact Land Requirement Table in AICTE APH Chapter I. |
| 5 | `src/lib/rules/packs.json` | Rule `DATE-VALID-001` (line 261) | `90-day affidavit notarization window [SOURCE: TO BE VERIFIED]` | Verify statutory validity window for non-judicial stamp paper affidavit prior to application closing date. |

---

### Advisory Notice
All compliance decisions output by AICTE Sentinel are decision-support advisories only. Final regulatory determinations rest exclusively with the AICTE Bureau of Approvals, the Executive Committee, and authorized Appellate Bodies.
