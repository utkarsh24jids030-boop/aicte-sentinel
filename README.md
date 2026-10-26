# AICTE Sentinel — Regulatory Scrutiny & Compliance Intelligence Platform

> **Smart India Hackathon 2026 — Problem Statement SIH26261**  
> **Core positioning:** *"AICTE Sentinel does not replace regulatory judgment — it makes every judgment auditable."*

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-16%2B-blue)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38bdf8)](https://tailwindcss.com)
[![Prisma ORM](https://img.shields.io/badge/Prisma-PostgreSQL-indigo)](https://prisma.io)

AICTE Sentinel is a decision-support and compliance-intelligence web application engineered for Smart India Hackathon 2026. It assists the All India Council for Technical Education (AICTE) Regulation Bureau in validating institutional approval applications, authenticating legal and academic documents, enforcing versioned compliance rules, and detecting multi-institution linkages (such as shared land parcels, reused faculty credentials, and duplicate municipal certificates). Complete technical design and module specifications are documented in [docs/DESIGN.md](docs/DESIGN.md).

---

## 1. Demo Credentials & Quick Roles

AICTE Sentinel includes a **1-Click Quick Role Switcher** in the top navigation bar and on `/login`. All demo accounts use the standard password: `Password@123`.

| Role | Name | Email | Focus Area |
|---|---|---|---|
| **AICTE Scrutiny Officer** | Smt. Priyadarshini Rao | `officer@sentinel-demo.example` | Risk-ranked queue, case files, finding review, scrutiny report |
| **Institution User** | Dr. Anand Kumar | `institution@sunrise-demo.example` | Application wizard, document upload, readiness gauge, deficiency rectification |
| **EVC Inspector** | Prof. Harish Chandran | `inspector@sentinel-demo.example` | Mobile inspection brief, GPS verification, photo/observation capture |
| **Admin** | Vikramaditya Singh | `admin@sentinel-demo.example` | Rule packs, mock verification adapters, user RBAC |
| **Auditor** | Meenakshi Sundaram | `auditor@sentinel-demo.example` | Read-only vigilance view, SHA-256 hash-chain integrity verification |

> [!NOTE]
> **Authentication & Deployment Reality Disclosures:**
> - **What is used for authentication:** The active demonstration build uses client-side state in `AuthContext.tsx` with an optional Google Firebase Auth SDK fallback for email/password handling.
> - **Role switching is NOT production authentication:** The 1-click role switcher is provided strictly for Hackathon evaluators to inspect different user perspectives. In a real-world production system, role switching without credentials cannot exist; authentications must flow through official AICTE Single Sign-On (SSO) via Jan Parichay, DigiLocker, or SAML 2.0 with hardware security token MFA.
> - **What is used for data storage:** The active demo build uses an in-memory JavaScript data store (`src/lib/store.ts`).
> - **State ephemerality on serverless hosting:** Because data is held in-memory, demo state is ephemeral on serverless hosting (e.g., Vercel, Netlify, or serverless containers) and resets to default seed data on container cold starts, server restarts, or redeployments.
> - **Production database requirements:** Production deployment requires a durable database (PostgreSQL / CockroachDB managed via Prisma ORM; schema available in `prisma/schema.sql`) and cloud object storage (S3 / GCS) for uploaded regulatory documents.
> - **NextAuth / Auth.js:** NextAuth is **NOT** used in this project. All session handling is done via `AuthContext.tsx` and `AuthService.ts`.

---

## 2. Seeded Compliance Demonstration Scenarios

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
  4. **Cross-Institution Reused Faculty:** Dr. Vikram Malhotra (`XXXXX9999X`, `VTU-PHD-MECH-4412`) declared as Professor at Nova while simultaneously listed as Principal at Apex Polytechnic College.

### Case 3: Apex Polytechnic College (`APP-2026-APX-003`) — Readiness: 25/100 (Risk: Critical, Linkage: 92)
- **Type:** New Institution Campus
- **Features:**
  1. **Possible Overlapping Land Claim:** Claims Survey No. 289/1A (2.1 acres) in Hinjawadi Pune, which is already claimed by Nova Engineering College (3.2 acres) on the same undivided partition (verify sub-division records).
  2. **Duplicate Document:** Reused municipal occupancy certificate (`OCC-PUNE-2021-DUP-01`) previously filed for Western Horizon campus in 2021.
  3. **Fail-Closed Verification:** Maharashtra DTE NOC API endpoint returned timeout/offline; system fail-closed to `Source Unavailable` (never marks unverified files as verified).

---

## 3. Architecture & AICTE Portal Integration Overview

The following diagram illustrates how AICTE Sentinel integrates with the AICTE National Approval Ecosystem, Single Sign-On (SSO), and external verification registries:

```
┌─────────────────────────────────────────────────────────────────────────────────────────────┐
│                          AICTE NATIONAL APPROVAL ECOSYSTEM                                   │
└──────────────────────────────────────────────┬──────────────────────────────────────────────┘
                                               │
                                 ┌─────────────┴─────────────┐
                                 │   Jan Parichay / SSO      │ (Production Target)
                                 │  [Simulated in Demo Mode] │
                                 └─────────────┬─────────────┘
                                               │
                                               ▼
┌─────────────────────────────────────────────────────────────────────────────────────────────┐
│                                 AICTE SENTINEL PLATFORM                                     │
│                         (Next.js 16 App Router + TypeScript)                                │
├─────────────────────────────────────────────────────────────────────────────────────────────┤
│  USER ACCESS PORTALS                                                                        │
│  ┌───────────────────────┐   ┌───────────────────────────┐   ┌───────────────────────────┐  │
│  │  Institution Portal   │   │   AICTE Officer Scrutiny  │   │   EVC Inspection Mobile   │  │
│  │ - 5-Step Application  │   │ - Risk-Prioritized Queue  │   │ - On-Site Mobile Checklist│  │
│  │ - Document Locker     │   │ - Case File Adjudication  │   │ - Geotagged Observations  │  │
│  │ - Readiness Index     │   │ - Scrutiny Reports & Seal │   │ - Physical ground truth   │  │
│  └───────────┬───────────┘   └─────────────┬─────────────┘   └─────────────┬─────────────┘  │
│              └─────────────────────────────┼───────────────────────────────┘                │
│                                            ▼                                                │
│  REGULATORY DECISION-SUPPORT INTELLIGENCE CORE                                              │
│  ┌───────────────────────────────────────────────────────────────────────────────────────┐  │
│  │ • Document Text Extractor (pdf-parse v2 + Keyword Classification + Optional LLM)      │  │
│  │ • Forensics Engine (Tamper Score formula + SHA-256 Hashes + Revisions)               │  │
│  │ • Statutory Compliance Rules Engine (26 APH Norms: Land, Faculty, Fire, Carpet Area)  │  │
│  │ • Linkage Radar (Entity Graph Resolution: Shared Land, Reused Faculty, Duplicate Cert)│  │
│  │ • Tamper-Evident Audit Ledger (SHA-256 Hash Chaining + Report Seals)                  │  │
│  └─────────────────────────────────────────┬─────────────────────────────────────────────┘  │
└────────────────────────────────────────────┼────────────────────────────────────────────────┘
                                             │ REST Adapters (Fail-Closed Architecture)
             ┌───────────────────────────────┼───────────────────────────────┐
             ▼                               ▼                               ▼
┌─────────────────────────┐     ┌─────────────────────────┐     ┌─────────────────────────┐
│  DigiLocker REST        │     │  Land Cadastre (Bhoomi) │     │  State DTE NOC Adapter  │
│  Adapter (SIMULATED)    │     │  Adapter (SIMULATED)    │     │  Adapter (SIMULATED)    │
│  Target: National       │     │  Target: State Revenue  │     │  Target: State Higher & │
│  DigiLocker API         │     │  & Land Records APIs    │     │  Technical Education    │
└─────────────────────────┘     └─────────────────────────┘     └─────────────────────────┘
             │                               │                               │
             ▼                               ▼                               ▼
┌─────────────────────────┐     ┌─────────────────────────┐     ┌─────────────────────────┐
│  National Faculty Reg.  │     │  Durable DB / Storage   │     │  Audit Trail Integrity  │
│  Adapter (SIMULATED)    │     │  [In-Memory in Demo;    │     │  Live SHA-256 Validator │
│  Target: AICTE Faculty  │     │   PostgreSQL / S3       │     │  Zero-Tampering Proof   │
│  Database / APAAR       │     │   for Production]       │     │  for Vigilance Auditors │
└─────────────────────────┘     └─────────────────────────┘     └─────────────────────────┘
```

> [!NOTE]
> **Simulation Boundary Transparency:** As labelled throughout the UI with `(simulated)`, all external verification adapters (DigiLocker, Land Cadastre, State DTE, Faculty Registry) and SSO authentications in this demonstration operate via controlled synthetic mock responders that model real-world government API latency, success responses, and fail-closed timeout degradation. For complete architectural details, see [docs/DESIGN.md](docs/DESIGN.md).

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

### Module 6: Linkage Radar
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
git clone https://github.com/utkarsh24jids030-boop/aicte-sentinel.git
cd aicte-sentinel

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
5. **Linkage Radar (`/officer/radar`):**
   - Click on the central conflict node **LINKAGE: Survey No. 289/1A** or **Dr. Vikram Malhotra**.
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
| `GET` | `/api/radar` | Get cross-institution linkage nodes and edges |
| `POST` | `/api/evc/observations` | Record EVC on-site inspection observation |
| `GET` | `/api/audit` | Fetch hash-chained audit events and test chain integrity |
| `POST` | `/api/admin/reset` | Restore demo applications, documents, and audit logs to baseline |
| `POST` | `/api/auth/register` | Register institution account (strictly unprivileged role) |

---

## 8. Responsible AI & Fail-Closed Principles

- **Human-in-the-Loop:** The system never autonomously approves or rejects an institution. All adverse findings are advisory decision-support.
- **Fail-Closed Verification:** If an authorized registry is offline or inconclusive, the document is routed to manual officer review and is never marked as verified.
- **Evidence-Linked Findings:** Every alert specifies the finding ID, rule ID, confidence rating, exact evidence locator, and recommended action.
- **Tamper-Evident Ledger:** All document versions, extracted values, source responses, and officer decisions are tamper-evident and cryptographically hash-chained.

---

## 9. Demo State & Ephemerality Notice

> [!IMPORTANT]
> **Ephemeral In-Memory Prototype Storage & Production Requirements Notice**
> The current demonstration build uses an in-memory datastore (`src/lib/store.ts`) with best-effort in-memory rate limiting (`src/lib/security/rateLimit.ts`).
> - **Active Storage Mechanism:** What is used for data storage in this prototype is an in-memory JavaScript data store (`src/lib/store.ts`).
> - **State Ephemerality on Serverless Hosting:** Demo state is ephemeral on serverless hosting (e.g. Vercel, Netlify, or serverless function containers). Application data, uploaded documents, manual corrections, and audit events reside purely in process memory and reset to baseline seed data upon container recycling, cold starts, or redeployments.
> - **Role Switching is NOT Production Authentication:** The 1-click role switcher in the UI is provided strictly for review and evaluation convenience. It is not production authentication. Production systems require official AICTE Single Sign-On (SSO) via Jan Parichay, DigiLocker, or SAML 2.0 with hardware MFA.
> - **Production Needs a Durable Database:** Production readiness requires a durable relational database (PostgreSQL / CockroachDB managed via Prisma ORM; schema prepared in `prisma/schema.sql`), cloud object storage (S3 / GCS) for uploaded regulatory files, and distributed Redis-based rate limiting.
> - **Reset Demo Action:** Evaluators can restore baseline test data at any time via the "Reset Demo Data" action on `/admin` and `/auditor` or by calling `POST /api/admin/reset`.

---

## 10. Synthetic Benchmark & Evaluation Methodology

AICTE Sentinel includes an automated benchmark evaluation suite that assesses the system's text extraction fidelity, compliance rule precision/recall, duplicate detection accuracy, adapter fail-closed robustness, and end-to-end processing throughput.

- **Synthetic Benchmark Dataset (`public/synthetic-eval-dataset.json`):**
  - **Scale:** 120 complete synthetic institutional approval applications containing 480 regulatory documents.
  - **Deterministic Generation:** Generated via `scripts/generate-synthetic-dataset.ts` using a linear congruential pseudorandom number generator (PRNG) initialized with fixed seed `20260201` (evaluation date: `2026-02-01`).
  - **Seeded Defect Scenarios:** Carefully labelled adverse compliance conditions including land acreage deficits, expired fire safety NOCs, faculty-to-student ratio deficits, instructional carpet area shortages, duplicate municipal certificates, shared undivided land parcels, and concurrently declared faculty credentials.
- **Evaluation Pipeline (`scripts/evaluate.ts`):**
  - **Document Extraction:** Parses real synthetic PDF sample files in `public/samples/` using vector text streams (`pdf-parse`) and regex rule extractors.
  - **Anomaly Detection:** Evaluates all 120 applications against statutory compliance rules, computing a complete confusion matrix (TP, FP, TN, FN), precision, recall, and F1-score.
  - **Source Adapters:** Evaluates simulated external verification adapters across 360 calls, verifying fail-closed timeout protection (`DEGRADED (TIMEOUT)`).
- **Execution Commands:**
  ```bash
  # 1. Regenerate 120 synthetic applications with deterministic seed
  npm run generate:dataset

  # 2. Run extraction and anomaly detection benchmarks; write public/metrics.json
  npm run evaluate
  ```
- **Live Metrics Dashboard:**
  - Authenticated/Portal route: `/metrics`
  - Public Server-Rendered HTML Preview: `/preview/metrics`
  - All figures are dynamically loaded from `public/metrics.json` without hardcoded constants.


