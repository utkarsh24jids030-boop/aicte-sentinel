# AICTE Sentinel — Regulatory Scrutiny & Fraud Intelligence Platform

> **Smart India Hackathon 2026 — Problem Statement SIH26261**  
> **Core positioning:** *"AICTE Sentinel does not replace regulatory judgment — it makes every judgment auditable."*

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen)](http://localhost:3000)
[![Next.js](https://img.shields.io/badge/Next.js-16%2B-blue)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38bdf8)](https://tailwindcss.com)
[![Prisma ORM](https://img.shields.io/badge/Prisma-PostgreSQL-indigo)](https://prisma.io)

AICTE Sentinel is a decision-support and fraud-intelligence web application engineered for Smart India Hackathon 2026. It assists the All India Council for Technical Education (AICTE) Bureau of Approvals in validating institutional approval applications, authenticating legal and academic documents, enforcing versioned compliance rules, and detecting multi-institution collusion (such as shared land parcels, reused faculty credentials, and duplicate municipal certificates).

---

## 1. Demo Credentials & Quick Roles

AICTE Sentinel includes a **1-Click Quick Role Switcher** in the top navigation bar and on `/login`. All demo accounts use the standard password: `Password@123`.

| Role | Name | Email | Focus Area |
|---|---|---|---|
| **AICTE Scrutiny Officer** | Smt. Priyadarshini Rao | `officer@aicte-india.org` | Risk-ranked queue, case files, finding review, scrutiny report |
| **Institution User** | Dr. Anand Kumar | `institution@sunrise.edu` | Application wizard, document upload, readiness gauge, deficiency rectification |
| **EVC Inspector** | Prof. Harish Chandran | `inspector@aicte-evc.gov.in` | Mobile inspection brief, GPS verification, photo/observation capture |
| **Admin** | Vikramaditya Singh | `admin@aicte-india.org` | Rule packs, mock verification adapters, user RBAC |
| **Auditor** | Meenakshi Sundaram | `auditor@cag.gov.in` | Read-only vigilance view, SHA-256 hash-chain integrity verification |

---

## 2. Seeded Fraud & Compliance Demonstration Scenarios

The platform comes pre-seeded with three realistic institutional cases illustrating distinct regulatory dilemmas:

### Case 1: Sunrise Institute of Technology (`APP-2026-SUN-001`) — Readiness: 75/100
- **Type:** Extension of Approval (EoA)
- **Features:** Complete application with verified DigiLocker land deeds (4.85 acres unencumbered).
- **Adverse Finding:** **Expired Fire Safety NOC** (`FS-BLR-2023-9941`), expired in Jan 2024.
- **Forensic Check:** Low OCR confidence (62%) on Notary Bar Council registration number flagged for review.

### Case 2: Nova Engineering College (`APP-2026-NOV-002`) — Readiness: 45/100 (Risk: High)
- **Type:** Intake Increase (from 360 to 480 seats)
- **Features:** 
  1. Missing Structural Stability Certificate signed by certified structural engineer.
  2. Faculty deficit: 22 declared faculty vs. statutory requirement of 24 for 480 intake.
  3. **Forensic Anomaly:** PDF metadata indicates post-signature editing via Canva / Nitro Pro with 3 incremental xref saves.
  4. **Cross-Institution Reused Faculty:** Dr. Vikram Malhotra (`XYZPK9876Q`, `VTU-PHD-MECH-4412`) declared as Professor at Nova while simultaneously listed as Principal at Apex Polytechnic College!

### Case 3: Apex Polytechnic College (`APP-2026-APX-003`) — Readiness: 25/100 (Risk: Critical, Collusion: 92)
- **Type:** New Institution Campus
- **Features:**
  1. **Land Double-Pledging Conflict:** Claims Survey No. 289/1A (2.1 acres) in Hinjawadi Pune, which is already claimed by Nova Engineering College (3.2 acres) on the same undivided partition!
  2. **Duplicate Document:** Reused municipal occupancy certificate (`OCC-PUNE-2021-DUP-01`) previously filed for Western Horizon campus in 2021.
  3. **Fail-Closed Verification:** Maharashtra DTE NOC API endpoint returned timeout/offline; system fail-closed to `Source Unavailable` (never marks unverified files as verified).

---

## 3. Architecture Overview

```
                      ┌────────────────────────────────────────┐
                      │          AICTE Sentinel Web UI         │
                      │  Next.js 16 App Router + Tailwind CSS  │
                      └───────────────────┬────────────────────┘
                                          │
            ┌─────────────────────────────┼─────────────────────────────┐
            ▼                             ▼                             ▼
┌───────────────────────┐   ┌───────────────────────────┐   ┌───────────────────────┐
│  Institution Portal   │   │   AICTE Officer Portal    │   │  EVC Inspection View  │
│ - New App Wizard      │   │ - Risk-Ranked Queue       │   │ - Automated Briefs    │
│ - Document Locker     │   │ - Case File Adjudication  │   │ - Mobile Checklists   │
│ - Readiness Gauge     │   │ - Scrutiny Reports        │   │ - Geotagged Evidence  │
└───────────┬───────────┘   └─────────────┬─────────────┘   └───────────┬───────────┘
            │                             │                             │
            └─────────────────────────────┼─────────────────────────────┘
                                          ▼
                      ┌────────────────────────────────────────┐
                      │    Decision-Support Intelligence Core  │
                      ├────────────────────────────────────────┤
                      │ • Forensics: SHA-256, PDF Metadata     │
                      │ • Passports: 6-State Fail-Closed Model │
                      │ • Rules: 22 Statutory Compliance Rules │
                      │ • Collusion Radar: Entity Graph Network│
                      │ • Audit Trail: SHA-256 Hash Chain      │
                      └───────────────────┬────────────────────┘
                                          │
            ┌─────────────────────────────┼─────────────────────────────┐
            ▼                             ▼                             ▼
┌───────────────────────┐   ┌───────────────────────────┐   ┌───────────────────────┐
│ DigiLocker Mock Reg.  │   │ Certificate Registry Mock │   │ Land / Faculty Mock   │
└───────────────────────┘   └───────────────────────────┘   └───────────────────────┘
```

---

## 4. Key Modules & Statutory Capabilities

### Module 1: Application Intelligence & Readiness Score
- Dynamic document checklists configured per application category (`EoA`, `New_Institution`, `Intake_Increase`, `Site_Change`, `Closure`).
- Real-time **Readiness Score (0–100)** with statutory penalties:
  - Critical Deficiency: `-25 pts`
  - High Deficiency: `-15 pts`
  - Medium Deficiency: `-8 pts`
  - Low Deficiency: `-3 pts`

### Module 2 & 3: Document Forensics & Ingestion
- Cryptographic SHA-256 hash generation for every upload.
- PDF metadata inspection detecting post-signature editing (producer discrepancies, incremental xref updates).
- Exact and near-duplicate document detection using perceptual text fingerprints.
- Fail-closed mock OCR field extraction with manual correction and verification audit.

### Module 4: Verification Passports (Fail-Closed)
- Six discrete statuses:
  - `Verified`: Source affirmatively authenticates claim.
  - `Mismatch Detected`: Source record diverges from declared value.
  - `Expired`: Valid credential has passed expiration date.
  - `Verification Pending`: Asynchronous handshake queued.
  - `Source Unavailable`: Gateway offline or unindexed (routes to manual scrutiny).
  - `Manual Review Required`: Automated checks inconclusive.
- Connects to mock adapters:
  - `DigiLocker Mock Adapter`
  - `Certificate Registry Mock`
  - `Land Records Mock Adapter`
  - `Faculty Registry Mock Adapter`

### Module 5: 22 Statutory Versioned Rules
Located in `src/lib/rules/packs.json`:
- **Land:** Land deed presence, minimum 2.5 acres, survey number consistency.
- **Building:** Occupancy certificate, structural stability certificate, carpet area ratios.
- **Fire Safety:** Fire NOC presence and chronological validity.
- **Faculty:** AICTE student-faculty ratio (1:20), appointment orders, qualification registries.
- **Governance:** Mandatory IQAC, Anti-Ragging Committee, Student Grievance Redressal (SGRC).
- **Financial:** CA audited balance sheets with UDIN, Joint FDR compliance.
- **Academic:** Programme intake limits, prior EoA verification.
- **Consistency & Dates:** Name uniformity across deeds and affidavit, 90-day affidavit validity.

### Module 6: Collusion Radar
- Cross-institution interactive SVG graph network:
  - Entities: Institutions, Trusts, Land Parcels, Faculty Members, Certificates, Anomalous PDFs.
  - Conflict Edges: Shared Land (`Survey 289/1A`), Reused Faculty (`Dr. Vikram Malhotra`), Reused Certificate (`OCC-PUNE-2021-DUP-01`).
  - Edge evidence drawer showing exact docket cross-references.

### Module 7: EVC Inspection Copilot
- Automated brief generator highlighting high-risk claims, unverified documents, and faculty requiring biometric interviews.
- Mobile-responsive inspection checklist with GPS geotagging simulation and observation logger.

### Module 8: Cryptographic Hash-Chained Audit Trail
- Every transaction (upload, view, rule run, verification attempt, officer action) stores `prevHash` and computes `hash = SHA256(prevHash | timestamp | actor | action | entity | summary)`.
- CAG / Auditor view with automated chain integrity validator that checks all blocks for zero tampering.

---

## 5. Getting Started & Local Setup

### Prerequisites
- Node.js v20+ or v24+
- npm v10+

### Installation & Execution
```bash
# 1. Clone repository
git clone https://github.com/utkarsh24jids030-boop/Movies_Recommendation.git
cd "AICTE SIH"

# 2. Install dependencies
npm install

# 3. Run Automated Test Suite
npm test

# 4. Start Development Server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 6. End-to-End Demo Walkthrough Guide

1. **Landing Page (`/`):**
   - View SIH 2026 problem statement context and the 3 seeded institutions.
2. **AICTE Officer Queue (`/officer`):**
   - Observe the risk-ranked queue. Notice Apex Polytechnic College ranked as **Critical Risk**.
3. **Approval Case File (`/officer/case/app-apex-003`):**
   - Inspect the **Advisory Findings Stream**.
   - Review the evidence locator for overlapping land survey number `289/1A` and reused certificate `OCC-PUNE-2021-DUP-01`.
   - Take officer action: click **Confirm Finding** or **Escalate for EVC**.
4. **Document Locker & Passports:**
   - Switch to the *Evidence Locker & Passports* tab.
   - Click **Inspect Passport** on `apex_duplicate_occ_cert.pdf`. Inspect the forensic metadata showing Canva/Ghostscript tampering heuristics.
5. **Collusion Radar (`/officer/radar`):**
   - Click on the central conflict node **COLLUSION: Survey No. 289/1A** or **Dr. Vikram Malhotra**.
   - Notice the animated red conflict link connecting Nova Engineering and Apex Polytechnic.
6. **Official Scrutiny Report (`/officer/scrutiny/app-apex-003`):**
   - View the formatted government report ready for print/export with cryptographic audit seal.
7. **EVC Mobile Inspection (`/evc/inspect/task-evc-001`):**
   - View the automated brief highlighting Dr. Malhotra for in-person interview.
   - Submit a live field observation with GPS coordinates.
8. **Auditor View (`/auditor`):**
   - Click **Validate Cryptographic Ledger** to run the SHA-256 mathematical chain verification.

---

## 7. API Documentation

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/applications` | List applications with optional `?institutionId=` filter |
| `POST` | `/api/applications` | Create a new application with dynamic checklist |
| `GET` | `/api/applications/[id]` | Get application detail, documents, findings, and readiness score |
| `PATCH` | `/api/applications/[id]` | Update application status (`Submitted`, `Resubmitted`, etc.) |
| `POST` | `/api/documents/upload` | Upload file, compute SHA-256, run forensics, and extract fields |
| `POST` | `/api/documents/[id]/verify` | Trigger fail-closed mock government adapter verification |
| `POST` | `/api/findings/[id]/action` | Officer action (`Confirm`, `Dismiss`, `Clarification`, `Escalate`) |
| `GET` | `/api/radar` | Get cross-institution collusion nodes and edges |
| `POST` | `/api/evc/observations` | Record EVC on-site inspection observation |
| `GET` | `/api/audit` | Fetch hash-chained audit events and test chain integrity |

---

## 8. Responsible AI & Fail-Closed Principles

- **Human-in-the-Loop:** The system never autonomously approves or rejects an institution. All adverse findings are advisory decision-support.
- **Fail-Closed Verification:** If an authorized registry is offline or inconclusive, the document is routed to manual officer review and is never marked as verified.
- **Evidence-Linked Findings:** Every alert specifies the finding ID, rule ID, confidence rating, exact evidence locator, and recommended action.
- **Immutable Ledger:** All document versions, extracted values, source responses, and officer decisions are immutable and cryptographically hash-chained.
