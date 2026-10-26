# AICTE Sentinel — System Design & Architectural Specification

> **Smart India Hackathon 2026 — Problem Statement SIH26261**  
> **Classification:** Engineering Design Document & Technical Architecture  
> **Status:** Version 2026.3 (Production Blueprint & Decision-Support Specification)

This design document formalizes the technical architecture, domain models, cryptographic audit trail, and regulatory verification pipeline for **AICTE Sentinel**, an automated decision-support and compliance-intelligence system for the All India Council for Technical Education (AICTE) Bureau of Approvals.

---

## 1. Problem Statement Context

AICTE receives statutory approval applications from technical institutions across India for:
- Extension of Approval (EoA)
- New institution establishment approval
- Academic intake expansion or reduction
- Introduction of new programmes and courses
- Campus relocation / site change
- Voluntary closure
- Other statutory regulatory clearances

Each institutional dossier contains diverse statutory documentation and evidentiary declarations:
- Mandatory legal affidavits (prescribed formats)
- Trust / Society / Company registration and bylaws
- Registered land sale or long-term registered lease deeds
- Municipal building sanction plans, occupancy certificates, and completion certificates
- Structural stability certificates signed by certified chartered structural engineers
- Fire safety NOCs from State Fire and Emergency Services
- Faculty appointment orders, joining reports, and qualification degrees
- Enrolled student headcount and admissions data
- Chartered Accountant audited balance sheets and financial statements
- Affiliation orders and State Government Directorate of Technical Education NOCs
- Mandatory institutional committee compositions (Anti-Ragging, Grievance Redressal, IQAC)
- Geotagged campus infrastructure and laboratory evidence

The system provides automated decision-support across eight core architectural capabilities:
1. Preliminary completeness and validity verification
2. Document forensic analysis and structural anomaly detection
3. Fail-closed verification through authorized registry adapters (simulated in demo)
4. Versioned statutory compliance and infrastructure rules enforcement
5. Cross-document and cross-institution entity linkage resolution
6. Fully explainable, evidence-linked adverse findings
7. Human-in-the-loop scrutiny and inspection workflows
8. Cryptographically hash-chained, tamper-evident audit trails

> [!IMPORTANT]
> **Advisory-Only Governance Rule:** The system never autonomously approves or rejects an institution. All engine alerts, findings, and deduction points are advisory decision-support recommendations. Final regulatory decisions remain strictly with competent AICTE authorities.

---

## 2. Product Vision & Architecture Principles

AICTE Sentinel converts complex institutional approval applications into structured, evidence-linked, and auditable **Approval Case Files**.

Key System Goals:
- **For Applicant Institutions:** Provide transparent self-scrutiny readiness indexes, automated deficiency checklists, and clear rectification guidance before final submission.
- **For AICTE Scrutiny Officers:** Surface risk-ranked queues, cross-referenced forensic anomalies, automated evidence pointers, and standard scrutiny evaluation reports.
- **For EVC Field Inspectors:** Deliver mobile-accessible inspection briefs, targeted inquiry pointers (e.g. faculty requiring physical verification), and geotagged field observation logging.
- **For Vigilance & Auditors:** Provide end-to-end mathematical accountability where every document hash, extraction outcome, external check, and officer decision is logged into a SHA-256 hash-chained ledger.

Core Governance Positioning:
> *"AICTE Sentinel does not replace regulatory judgment — it makes every judgment auditable."*

---

## 3. Users and Role-Based Access Control (RBAC)

The system implements strict role separation across five key actors:

### 1. Institution User (`INSTITUTION`)
- Self-registers and logs in to the Institution Portal.
- Creates new approval applications (EoA, New Institution, Intake Increase, etc.).
- Uploads statutory documents in PDF/image formats.
- Reviews extracted attributes with confidence scores and corrects extraction values when necessary.
- Views real-time Statutory Readiness Score (0–100) and grouped deficiency checklists.
- Submits rectified documentation in response to scrutiny queries.

### 2. AICTE Scrutiny Officer (`OFFICER`)
- Accesses the risk-prioritized scrutiny queue.
- Inspects comprehensive case files, document forensic passports, and evidence locators.
- Adjudicates adverse findings with advisory officer actions: **Confirm**, **Dismiss** (with mandatory justification), **Clarification Requested**, or **Escalate for EVC Inspection**.
- Dismisses false-positive entity links on the Linkage Radar with logged audit reasons.
- Exports signed Scrutiny Evaluation Reports with unique cryptographic audit seals.

### 3. EVC Field Inspector (`EVC_INSPECTOR`)
- Reviews automated pre-inspection briefs identifying high-risk claims and unverified submissions.
- Conducts on-site verification with mobile-responsive checklists.
- Submits geotagged inspection observations and marks physical ground truth status.

### 4. System Administrator (`ADMIN`)
- Configures versioned statutory rule packs and threshold parameters.
- Monitors external registry adapter health (DigiLocker, Bhoomi Cadastre, State DTE, Faculty Registry).
- Manages user accounts and administrative controls.

### 5. Vigilance Auditor (`AUDITOR`)
- Read-only oversight access across all applications, case files, scrutiny reports, and audit trails.
- Executes real-time live mathematical re-computation of the SHA-256 hash chain.
- Verifies document cryptographic seals against current ledger state.

---

## 4. Core System Modules

### Module 1: Application Intelligence & Dynamic Checklists
- Generates dynamic statutory document requirements based on application type.
- Detects missing mandatory documents, expired clearances, invalid dates, and cross-field arithmetic inconsistencies.
- Computes the 100-point **Statutory Readiness Index** adhering to formula:
  $$\text{ReadinessScore} = \max(0, 100 - \sum \text{Severity Deductions})$$
  *(Critical = 25 pts, High = 15 pts, Medium = 10 pts, Low = 5 pts)*.

### Module 2: Document Ingestion, Text Extraction & Forensic Passports
- Supports PDF, PNG, and JPEG document uploads with magic-byte verification and MIME whitelisting.
- Stores each submission as a versioned, tamper-evident `DocumentVersion`.
- Computes SHA-256 cryptographic digest directly from uploaded byte streams.
- Extracts vector text streams using `pdf-parse` and keyword pattern classification rules.
- Optional LLM-assisted semantic extraction enabled behind `AI_EXTRACTION_API_KEY`; automatically falls back to baseline extraction with honest UI disclosure when unconfigured.
- Generates a **Verification Passport** tracking timestamp, adapter used, latency, request/response summaries, resulting status, and officer review state.

### Module 3: Document Forensics & Tamper Score Formula
- Computes an isolated **Tamper Confidence Score** derived strictly from structural indicators:
  $$\text{TamperScore} = 0.40 \cdot \min(1, \frac{\text{incrementalSaves}}{3}) + 0.30 \cdot \text{isDiscrepantProducer} + 0.16 \cdot \text{hasFontSubstitution} + 0.10 \cdot \text{isDateAnomalous} + 0.02$$
- Completely decouples duplicate document reuse from structural tampering heuristics.
- Detects identical documents across institutions using SHA-256 hash collisions against repository originals.

### Module 4: Fail-Closed Source Verification Adapters (Simulated)
- External verification adapters for DigiLocker, Bhoomi Land Cadastre, State Directorate of Technical Education (DTE), and National Faculty Database.
- Strict **Fail-Closed Governance**: If an external endpoint times out or is unreachable, the system marks the status as `Source Unavailable` or `Manual Review Required` and marks the adapter as `DEGRADED (TIMEOUT)`. An unverified document is **never** marked verified.

### Module 5: Configurable Statutory Compliance Rules Engine
- Declarative JSON rule packs covering 26+ AICTE Approval Process Handbook (APH) norms:
  - Minimum land area by institutional classification (Mega/Metro: 1.5 acres, Urban: 2.5 acres, Rural: 4.0 acres)
  - Fire safety clearance validity relative to fixed reference anchor date (`2026-02-01`)
  - Student-to-Faculty ratios (1:20 UG, 1:15 PG, 1:25 Diploma)
  - Instructional carpet area standards (10.5 sqm per student)
  - Maximum intake expansion limits (1.5x previous approved intake)
  - 90-day affidavit execution window relative to reference date

### Module 6: Linkage Radar & Cross-Institution Entity Resolution
- Constructs an in-memory entity resolution graph:
  - **Nodes:** Institutions, Land Parcels, Faculty Identities, Trust Entities, Document Hashes.
  - **Dynamic Edge Classification:** `SHARED_LAND`, `REUSED_FACULTY`, `DUPLICATE_CERTIFICATE`, `METADATA_DISCREPANCY`, `EXPIRED_CLEARANCE`, `SOLE_OWNERSHIP`.
- Each edge carries a computed confidence score and human-readable plain-language explanation.
- Provides an officer **Dismiss Link with Reason** action, permanently logged into the cryptographic audit trail.

### Module 7: EVC On-Site Inspection Copilot
- Produces automated inspection briefs synthesizing adverse claims, land partition flags, and unverified credentials.
- Mobile-friendly checklist with simulated GPS geotagging and photo evidence attachment.

### Module 8: Cryptographic Hash-Chained Audit Trail & Report Seals
- Maintains an append-only, tamper-evident audit ledger where every event is linked to its predecessor:
  $$\text{hash}_n = \text{SHA256}(\text{hash}_{n-1} \parallel \text{timestamp} \parallel \text{actorRole} \parallel \text{action} \parallel \text{entityId} \parallel \text{payload})$$
- Autonomous system engines (Forensics, Adapters) log events using the `SYSTEM` role.
- Dynamic Scrutiny Report Seals are generated by combining the canonical report content with the current audit chain head hash:
  $$\text{ReportSeal} = \text{SHA256}(\text{CanonicalReportJSON} \parallel \text{AuditChainHeadHash})$$
- Evaluators can verify seal integrity live on the Auditor portal (`/api/reports/verify-seal`).

---

## 5. Deployment Reality & Production Roadmap

- **Prototype Runtime:** The SIH demonstration runs on Next.js 16 (App Router) with an in-memory data store (`src/lib/store.ts`) and client-side simulated auth context.
- **Serverless Ephemerality:** Because data resides in process memory, demo state is ephemeral on serverless hosting (e.g. Vercel) and resets to baseline seed data on process restarts or container recycling.
- **Production Integration Requirements:**
  - **Authentication:** Enterprise Single Sign-On (SSO) via Jan Parichay (National Single Sign-On), DigiLocker OAuth2, or SAML 2.0 with hardware token MFA.
  - **Persistence:** Relational database storage on PostgreSQL / CockroachDB managed via Prisma ORM (`prisma/schema.sql`).
  - **Document Storage:** S3/GCS encrypted object storage with immutable bucket versioning.
  - **Distributed Rate Limiting:** Redis-backed sliding window rate limiters.
