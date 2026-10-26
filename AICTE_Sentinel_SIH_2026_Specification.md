# AICTE Sentinel — SIH 2026 PS 26261 Web App Specification

Build a production-quality, demo-ready web application called **AICTE Sentinel** for
Smart India Hackathon 2026 Problem Statement **SIH26261**.

## 1. Problem Statement Context

AICTE receives approval applications from technical institutions for:
- Extension of Approval (EoA)
- New institution approval
- Intake increase/decrease
- New programme/course
- Site/location change
- Closure
- Other regulatory approvals

Each application contains many documents and declarations:
- Affidavits
- Trust/Society/Company documents
- Land ownership or lease deeds
- Building plans and occupancy/completion certificates
- Structural stability certificates
- Fire safety certificates
- Faculty appointment letters and qualification certificates
- Student data
- Audited accounts
- NOCs
- Prior AICTE approvals
- Committee/IQAC declarations
- Infrastructure evidence

The platform must support:
1. Preliminary application validation
2. Document authentication and forensic anomaly detection
3. Verification through authorized sources where available
4. Regulatory and infrastructure compliance assistance
5. Cross-document and cross-institution anomaly/collusion detection
6. Explainable, evidence-linked findings
7. Human-in-the-loop review
8. Secure, auditable workflows

IMPORTANT: The system must never autonomously approve or reject an institution.
All adverse findings are advisory. Final scrutiny, inspection, and regulatory
decisions remain with competent AICTE authorities.

## 2. Product Vision

AICTE Sentinel converts an approval application into a structured, evidence-linked,
auditable **Approval Case File**.

It should help:
- Institutions submit complete and compliant applications
- AICTE scrutiny officers review cases faster and more consistently
- EVC/inspection teams focus on high-risk claims
- AICTE detect document manipulation and cross-institution fraud

Core positioning:
> “AICTE Sentinel does not replace regulatory judgment — it makes every judgment auditable.”

## 3. Users and Roles

Implement role-based access control with these roles:

### Institution User
- Register/login
- Create an application
- Upload documents
- View readiness score
- View deficiencies and rectification guidance
- Resubmit corrected documents
- View application status and timeline

### AICTE Scrutiny Officer
- View assigned applications
- View risk-ranked dashboard
- Inspect documents and extracted fields
- Review forensic alerts and verification results
- Confirm, dismiss, escalate, or request clarification for findings
- Generate scrutiny report
- Generate EVC inspection brief

### EVC / Inspector
- View assigned inspection brief
- View high-risk claims and unresolved evidence gaps
- Record inspection observations
- Upload geotagged inspection photos/files
- Mark physical verification status

### Admin
- Manage users and roles
- Manage rule packs
- View audit logs
- Configure verification adapters in demo mode

### Auditor
- Read-only access to case files, findings, and audit trail

## 4. Core Modules

### Module 1: Application Intelligence

- Institution selects application type.
- System generates a dynamic document checklist based on application type.
- System detects:
  - Missing mandatory documents
  - Expired documents
  - Invalid dates
  - Missing mandatory fields
  - Invalid formats
  - Cross-field inconsistencies
- Generate a Readiness Score from 0–100.
- Show deficiency list grouped by severity:
  - Critical
  - High
  - Medium
  - Low

Application types to support in demo:
- EoA
- New Institution
- Intake Increase
- Site Change
- Closure

### Module 2: Document Ingestion and Extraction

- Allow PDF, JPG, PNG uploads.
- Store each upload as an immutable `DocumentVersion`.
- Generate SHA-256 hash for every uploaded file.
- Perform OCR/text extraction.
- Classify documents into types such as:
  - Land Deed
  - Affidavit
  - Fire Safety Certificate
  - Occupancy Certificate
  - Structural Stability Certificate
  - Faculty Appointment Letter
  - Faculty Qualification Certificate
  - Trust Deed
  - NOC
  - Prior EoA
  - Building Plan
  - Audited Financial Statement
- Extract fields where possible:
  - Institution name
  - Trust name
  - Land survey number
  - Land area
  - Building address
  - Carpet/built-up area
  - Certificate number
  - Issue date
  - Expiry date
  - Faculty name
  - PAN
  - Qualification
  - Designation
  - Appointment date
  - Approved intake
  - Programme name

For the hackathon prototype:
- Use mock OCR/extraction where needed.
- Allow manual correction of extracted fields.
- Clearly show extraction confidence.

### Module 3: Document Forensics

For every uploaded document, compute and display:

- SHA-256 hash
- File size
- MIME type
- PDF metadata, if PDF
- Creation/modification timestamps, if available
- PDF producer/creator metadata
- Number of PDF revisions/incremental updates, if detectable
- Duplicate-document detection
- Near-duplicate detection
- Basic image/PDF anomaly indicators

Implement at least these forensic checks:

1. Exact duplicate detection using SHA-256.
2. Near-duplicate detection using perceptual hash or text fingerprint.
3. PDF metadata anomaly detection.
4. PDF incremental-save/update detection.
5. Image tampering indicator using basic heuristics or a lightweight model.
6. Text inconsistency detection:
   - Mismatched dates
   - Mismatched names
   - Mismatched certificate numbers
   - Mismatched land area
   - Mismatched institution name
7. Suspicious reuse detection:
   - Same certificate number across applications
   - Same land survey number across applications
   - Same faculty identifier across applications
   - Same document hash across institutions

Every forensic alert must include:
- Finding ID
- Severity
- Confidence
- Document ID
- Page number, if applicable
- Bounding box or text excerpt, if applicable
- Rule/check ID
- Human-readable explanation
- Recommended action
- Review status

Do not label a document as conclusively fraudulent.
Use statuses such as:
- `Potential anomaly`
- `Requires manual review`
- `Source mismatch`
- `Duplicate detected`
- `No anomaly detected`

### Module 4: Verification Passport

For every document, create a Verification Passport containing:

- Document ID
- File name
- SHA-256 hash
- Document type
- Extracted fields
- Verification attempts
- Source response
- Timestamp
- Verification status
- Evidence locator
- Officer review status

Use these verification statuses:

| Status | Meaning |
|---|---|
| `Verified` | Authorized mock/source confirms claim |
| `Mismatch Detected` | Source response differs from submitted claim |
| `Expired` | Document was valid but has expired |
| `Verification Pending` | Verification request queued |
| `Source Unavailable` | No authorized source available in demo |
| `Manual Review Required` | Automated verification inconclusive |
| `Not Verified` | No verification attempted yet |

Implement a fail-closed model:
- If a source is unavailable or uncertain, the document must NOT become `Verified`.
- It must route to manual review.

For the prototype, create mock verification adapters:
- DigiLocker Mock Adapter
- Certificate Registry Mock Adapter
- Land Records Mock Adapter
- Faculty Registry Mock Adapter

Each adapter should return one of:
- Verified
- Mismatch
- Expired
- Pending
- Source unavailable

### Module 5: Compliance Rules Engine

Use configurable, versioned rule packs stored as JSON or YAML.

Rules must include:
- Rule ID
- Rule name
- Version
- Application types
- Severity
- Logic
- Required evidence fields
- Explanation template
- Recommended action

Implement at least 20 demo rules across:

| Domain | Example checks |
|---|---|
| Land | Land deed present, land area meets requirement, survey number consistency |
| Building | Occupancy certificate present, structural stability certificate present, carpet area declared |
| Fire safety | Fire safety certificate present and not expired |
| Faculty | Minimum faculty count, student-faculty ratio, appointment letters present |
| Governance | IQAC declaration, anti-ragging committee, grievance redressal committee |
| Financial | Audited accounts uploaded, payment/TER status marked |
| Academic | Approved programme details, intake consistency, prior EoA status |
| Documents | Mandatory affidavit, trust deed, NOC, prior approval documents |
| Consistency | Institution name consistency, address consistency, land area consistency |
| Dates | Certificate validity, affidavit date, appointment date logic |

Example rule format:

```json
{
  "rule_id": "LAND-AREA-001",
  "version": "2026.3",
  "name": "Land area sufficiency",
  "applies_to": ["EoA", "New_Institution"],
  "severity": "high",
  "logic": "land_area_acres >= required_land_area_acres",
  "evidence_fields": [
    "land_deed.area_acres",
    "affidavit.total_area_acres"
  ],
  "failure_message": "Declared land area is below the configured requirement.",
  "recommended_action": "Request corrected land deed or schedule site verification."
}
```

### Module 6: Collusion Radar

Build a graph/risk view across institutions.

Graph nodes:
- Institution
- Trust/Society/Company
- Land parcel/survey number
- Building address
- Faculty member
- Certificate
- Document
- Bank account
- Equipment record

Graph edges:
- Same land survey number
- Same building address
- Same faculty PAN/ID
- Same certificate number
- Same document hash
- Same trust name
- Same bank account
- Same equipment invoice/reference

Show:
- Institutions as nodes
- Risk edges in red/orange/yellow
- Clickable node details
- Evidence-linked findings for each edge
- A Collusion Risk Score per application

Seed demo data with at least:
- 3 institutions
- 1 shared land parcel between two institutions
- 1 reused faculty certificate across two institutions
- 1 duplicate certificate document
- 1 expired fire safety certificate
- 1 altered/metadata-anomalous PDF

### Module 7: EVC Inspection Copilot

Generate an inspection brief containing:

- Application summary
- High-risk claims
- Missing/unverified documents
- Faculty requiring identity/employment validation
- Infrastructure claims requiring physical verification
- Land/building claims requiring site verification
- Prior deficiencies
- Inspector checklist

Allow inspector to record:
- Observation
- Geotagged photo upload
- Document upload
- Pass/fail/manual-review status
- Inspector notes

For the prototype, geolocation can be simulated or captured from browser with user permission.

### Module 8: Audit Trail

Maintain an append-only audit log for:

- User login
- Document upload
- Document view/download
- OCR/extraction run
- Rule execution
- Verification attempt
- Source response
- Finding creation
- Officer action
- Inspection update
- Application status change

Each audit event should include:
- Event ID
- Timestamp
- Actor ID and role
- Action
- Entity ID
- Before/after summary where relevant
- IP/device metadata, optional
- Hash of previous audit event to form a simple hash chain

## 5. Key Screens

Build the following screens:

### Public / Auth
1. Landing page explaining AICTE Sentinel
2. Login
3. Register institution
4. Role selection or role-based redirect after login

### Institution Portal
5. Institution dashboard
6. New application wizard
7. Application checklist
8. Document upload screen
9. Extracted-fields review screen
10. Readiness Score screen
11. Deficiency/rectification screen
12. Application timeline/status screen

### AICTE Officer Portal
13. Officer dashboard with application queue
14. Risk-ranked application list
15. Application case file
16. Document viewer
17. Verification Passport
18. Findings and alerts screen
19. Collusion Radar screen
20. Scrutiny report screen
21. EVC inspection brief screen

### EVC Portal
22. Assigned inspections
23. Inspection brief
24. Mobile-friendly inspection form
25. Photo/document upload
26. Inspection submission screen

### Admin / Audit
27. User management
28. Rule pack management
29. Verification adapter configuration
30. Audit log viewer

## 6. UI/UX Requirements

- Clean, professional government-tech aesthetic.
- Use a light theme with accessible contrast.
- Primary color: deep blue.
- Accent colors:
  - Green: verified/compliant
  - Amber: pending/manual review
  - Red: mismatch/high risk
  - Gray: source unavailable/not verified
- Use clear status chips everywhere.
- Every alert must be explainable; avoid unexplained red flags.
- Make the application fully responsive.
- The EVC inspection screens must work well on mobile.
- Use empty states, loading states, and error states.
- Add a demo mode banner:
  “Prototype uses synthetic/mock data and mock verification adapters.”

## 7. Technical Requirements

### Recommended Stack

Use this stack unless there is a strong reason to change it:

- Frontend: Next.js 14+ with TypeScript
- UI: Tailwind CSS + shadcn/ui
- State/data: React Query or SWR
- Backend: Next.js API routes or separate FastAPI backend
- Database: PostgreSQL
- Authentication: Demo role switching with Firebase Auth integration for prototype (NextAuth is NOT used); production targets Jan Parichay / SAML 2.0 / DigiLocker SSO
- Queue: In-memory/BullMQ-compatible queue abstraction
- Graph: PostgreSQL JSONB relationships for prototype; Neo4j optional
- Charts: Recharts
- Graph visualization: React Flow, Cytoscape.js, or vis-network
- PDF processing: pdf-parse/pdfjs-dist
- OCR: Tesseract.js for basic demo OCR; mock extraction allowed
- Validation: Zod
- Testing: Vitest/Playwright where feasible

### Database Entities

Create at least these tables/models:

- User
- Institution
- Application
- ApplicationVersion
- Document
- DocumentVersion
- ExtractedField
- Rule
- RuleVersion
- Finding
- VerificationAttempt
- SourceResponse
- OfficerAction
- InspectionTask
- InspectionObservation
- RiskGraphNode
- RiskGraphEdge
- AuditEvent

Important rule:
Never overwrite uploaded documents, extracted values, source responses, findings,
or officer actions. Create immutable versions/events instead.

## 8. Demo Data Requirements

Create realistic but entirely synthetic demo data.

Include:

- 3 institutions:
  - Sunrise Institute of Technology
  - Nova Engineering College
  - Apex Polytechnic College

- 3 application cases:
  - EoA for Sunrise Institute
  - Intake increase for Nova Engineering College
  - New institution application for Apex Polytechnic College

Include deliberate demo scenarios:

1. Sunrise Institute:
   - Complete application
   - Mostly verified mock documents
   - One expired fire safety certificate
   - One low-confidence OCR field

2. Nova Engineering College:
   - Missing structural stability certificate
   - Faculty count below configured requirement
   - One faculty certificate reused by Apex Polytechnic College
   - One PDF with metadata anomaly

3. Apex Polytechnic College:
   - Land survey number overlapping with Nova Engineering College
   - Duplicate certificate document
   - One manually reviewable document because mock source is unavailable
   - One high-risk collusion finding

The demo should clearly demonstrate:
- Readiness Score
- Missing/expired documents
- Cross-document inconsistency
- Document forensic alert
- Verification Passport
- Collusion Radar
- EVC inspection brief
- Audit trail

## 9. Security and Privacy Requirements

Implement:

- Email/password authentication
- Role-based access control
- Session protection
- Password hashing
- Input validation with Zod
- File-type and file-size validation
- Secure file naming and storage
- Encryption at rest for uploaded files, or clear local-demo encryption strategy
- HTTPS-ready configuration
- Audit logging
- Least-privilege API access
- PII masking for non-authorized roles
- Data-retention configuration placeholder
- No real external government API calls in the prototype

Use mock adapters for:
- DigiLocker
- Certificate registry
- Land records
- Faculty registry

Clearly label all mock integrations in the UI.

## 10. Responsible AI Requirements

- AI/forensic outputs are advisory only.
- Every high-severity finding requires human review.
- Show confidence, evidence, rule ID, and recommended action.
- Never show a bare “fraud detected” label without evidence.
- Preserve rule version and model/check version with every finding.
- Allow officer to:
  - Confirm finding
  - Dismiss finding
  - Request clarification
  - Escalate for inspection
- Maintain a feedback trail for every officer decision.

## 11. Deliverables

Create:

1. Complete Next.js web application.
2. PostgreSQL schema and seed script.
3. Mock verification adapters.
4. Demo dataset with the scenarios above.
5. README with:
   - Setup instructions
   - Environment variables
   - Demo login credentials
   - Demo walkthrough
   - Architecture explanation
6. Basic API documentation.
7. At least a few tests for:
   - Authentication
   - Document upload
   - Rule execution
   - Readiness Score
   - Verification status transitions
   - Audit event creation

## 12. Definition of Done

The app is complete when:

- A user can log in as institution, officer, EVC, admin, and auditor.
- An institution can create an application and upload documents.
- The system generates a checklist and Readiness Score.
- OCR/extraction or mock extraction populates reviewable fields.
- The system detects missing, expired, inconsistent, duplicate, and suspicious documents.
- Each document has a Verification Passport.
- Officers can review findings with evidence and take an action.
- The Collusion Radar shows cross-institution risk links.
- EVC users can view an inspection brief and submit observations.
- All major actions create audit events.
- The demo data tells a clear fraud-detection story.
- The UI is polished, responsive, and demo-ready.
- The application clearly states that final decisions remain with AICTE authorities.