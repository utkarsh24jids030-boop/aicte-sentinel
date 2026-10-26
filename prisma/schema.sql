-- =====================================================================
-- AICTE Sentinel — SIH 2026 Problem Statement SIH26261
-- Production PostgreSQL DDL Schema Script
-- =====================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. ENUMS
CREATE TYPE user_role AS ENUM ('INSTITUTION', 'OFFICER', 'EVC_INSPECTOR', 'ADMIN', 'AUDITOR');
CREATE TYPE application_type AS ENUM ('EoA', 'New_Institution', 'Intake_Increase', 'Site_Change', 'Closure');
CREATE TYPE application_status AS ENUM ('Draft', 'Submitted', 'Under Scrutiny', 'Deficiency Communicated', 'Resubmitted', 'EVC Inspection Recommended', 'Approved', 'Rejected');
CREATE TYPE risk_tier AS ENUM ('Low', 'Medium', 'High', 'Critical');
CREATE TYPE document_type AS ENUM (
  'Land Deed', 'Affidavit', 'Fire Safety Certificate', 'Occupancy Certificate',
  'Structural Stability Certificate', 'Faculty Appointment Letter',
  'Faculty Qualification Certificate', 'Trust Deed', 'NOC', 'Prior EoA',
  'Building Plan', 'Audited Financial Statement'
);
CREATE TYPE verification_status AS ENUM (
  'Verified', 'Mismatch Detected', 'Expired', 'Verification Pending',
  'Source Unavailable', 'Manual Review Required', 'Not Verified'
);
CREATE TYPE finding_severity AS ENUM ('Critical', 'High', 'Medium', 'Low');
CREATE TYPE finding_status AS ENUM ('Open', 'Confirmed by Officer', 'Dismissed with Justification', 'Clarification Requested', 'Escalated for EVC');
CREATE TYPE finding_category AS ENUM ('FORENSIC_ANOMALY', 'COMPLIANCE_BREACH', 'CROSS_INSTITUTION_LINKAGE', 'VERIFICATION_MISMATCH');

-- 2. INSTITUTIONS
CREATE TABLE institutions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  aicte_id VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  trust_name VARCHAR(255) NOT NULL,
  state VARCHAR(100) NOT NULL,
  district VARCHAR(100) NOT NULL,
  address TEXT NOT NULL,
  land_survey_number VARCHAR(100) NOT NULL,
  land_area_acres NUMERIC(8,2) NOT NULL,
  contact_email VARCHAR(255) NOT NULL,
  contact_phone VARCHAR(50) NOT NULL,
  established_year INT NOT NULL,
  status VARCHAR(50) DEFAULT 'ACTIVE',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. USERS
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role user_role NOT NULL DEFAULT 'INSTITUTION',
  designation VARCHAR(150),
  institution_id UUID REFERENCES institutions(id) ON DELETE SET NULL,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. APPLICATIONS
CREATE TABLE applications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  application_number VARCHAR(100) UNIQUE NOT NULL,
  institution_id UUID NOT NULL REFERENCES institutions(id) ON DELETE CASCADE,
  type application_type NOT NULL,
  academic_year VARCHAR(20) DEFAULT '2026-2027',
  status application_status DEFAULT 'Draft',
  readiness_score INT DEFAULT 0,
  linkage_risk_score INT DEFAULT 0,
  risk_tier risk_tier DEFAULT 'Low',
  programmes JSONB DEFAULT '[]'::jsonb,
  current_intake INT DEFAULT 0,
  proposed_intake INT DEFAULT 0,
  submitted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. DOCUMENTS
CREATE TABLE documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  application_id UUID NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
  institution_id UUID NOT NULL REFERENCES institutions(id) ON DELETE CASCADE,
  document_type document_type NOT NULL,
  title VARCHAR(255) NOT NULL,
  file_name VARCHAR(255) NOT NULL,
  file_path TEXT NOT NULL,
  file_size INT NOT NULL,
  mime_type VARCHAR(100) NOT NULL,
  sha256_hash VARCHAR(64) UNIQUE NOT NULL,
  verification_status verification_status DEFAULT 'Not Verified',
  verification_source VARCHAR(150),
  forensic_metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. DOCUMENT VERSIONS (IMMUTABLE)
CREATE TABLE document_versions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  document_id UUID NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
  version_number INT NOT NULL,
  file_name VARCHAR(255) NOT NULL,
  file_path TEXT NOT NULL,
  file_size INT NOT NULL,
  sha256_hash VARCHAR(64) NOT NULL,
  uploaded_at TIMESTAMPTZ DEFAULT NOW(),
  uploaded_by VARCHAR(255) NOT NULL,
  change_note TEXT
);

-- 7. EXTRACTED FIELDS
CREATE TABLE extracted_fields (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  document_id UUID NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
  field_key VARCHAR(100) NOT NULL,
  field_label VARCHAR(150) NOT NULL,
  field_value TEXT NOT NULL,
  confidence NUMERIC(4,3) NOT NULL,
  is_manually_corrected BOOLEAN DEFAULT FALSE,
  original_value TEXT,
  page_number INT,
  bounding_box JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. COMPLIANCE RULES
CREATE TABLE rules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  rule_id VARCHAR(50) UNIQUE NOT NULL,
  version VARCHAR(20) DEFAULT '2026.3',
  name VARCHAR(255) NOT NULL,
  category VARCHAR(100) NOT NULL,
  applies_to JSONB NOT NULL,
  severity finding_severity NOT NULL,
  logic TEXT NOT NULL,
  evidence_fields JSONB NOT NULL,
  failure_message TEXT NOT NULL,
  recommended_action TEXT NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. FINDINGS
CREATE TABLE findings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  application_id UUID NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
  document_id UUID REFERENCES documents(id) ON DELETE SET NULL,
  rule_id VARCHAR(50),
  category finding_category NOT NULL,
  severity finding_severity NOT NULL,
  confidence NUMERIC(4,3) NOT NULL,
  title VARCHAR(255) NOT NULL,
  explanation TEXT NOT NULL,
  evidence_locator TEXT NOT NULL,
  recommended_action TEXT NOT NULL,
  status finding_status DEFAULT 'Open',
  officer_notes TEXT,
  reviewed_by VARCHAR(255),
  reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. VERIFICATION ATTEMPTS
CREATE TABLE verification_attempts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  document_id UUID NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
  adapter_name VARCHAR(150) NOT NULL,
  attempt_timestamp TIMESTAMPTZ DEFAULT NOW(),
  request_payload JSONB NOT NULL,
  response_status VARCHAR(50) NOT NULL,
  raw_response JSONB NOT NULL
);

-- 11. SOURCE RESPONSES
CREATE TABLE source_responses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  document_id UUID NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
  source_name VARCHAR(150) NOT NULL,
  source_status VARCHAR(50) NOT NULL,
  details JSONB NOT NULL,
  timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- 12. OFFICER ACTIONS
CREATE TABLE officer_actions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  application_id UUID NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
  officer_id UUID NOT NULL REFERENCES users(id),
  officer_name VARCHAR(255) NOT NULL,
  action_type VARCHAR(100) NOT NULL,
  notes TEXT NOT NULL,
  finding_id UUID REFERENCES findings(id),
  timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- 13. EVC INSPECTION TASKS
CREATE TABLE inspection_tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  application_id UUID NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
  institution_id UUID NOT NULL REFERENCES institutions(id) ON DELETE CASCADE,
  inspector_id UUID NOT NULL REFERENCES users(id),
  inspector_name VARCHAR(255) NOT NULL,
  status VARCHAR(50) DEFAULT 'Assigned',
  scheduled_date TIMESTAMPTZ NOT NULL,
  site_address TEXT NOT NULL,
  high_risk_claims_count INT DEFAULT 0,
  unresolved_gaps_count INT DEFAULT 0,
  brief_summary TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 14. EVC INSPECTION OBSERVATIONS
CREATE TABLE inspection_observations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  task_id UUID NOT NULL REFERENCES inspection_tasks(id) ON DELETE CASCADE,
  category VARCHAR(100) NOT NULL,
  claim_text TEXT NOT NULL,
  physical_verification_status VARCHAR(50) NOT NULL,
  observation_notes TEXT NOT NULL,
  photo_urls JSONB DEFAULT '[]'::jsonb,
  latitude NUMERIC(10,7),
  longitude NUMERIC(10,7),
  captured_at TIMESTAMPTZ DEFAULT NOW()
);

-- 15. RISK GRAPH (LINKAGE RADAR)
CREATE TABLE risk_graph_nodes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  node_type VARCHAR(50) NOT NULL,
  entity_id VARCHAR(100) UNIQUE NOT NULL,
  label VARCHAR(255) NOT NULL,
  sub_label VARCHAR(255),
  risk_level VARCHAR(20) NOT NULL,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE risk_graph_edges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  source_node_id VARCHAR(100) NOT NULL,
  target_node_id VARCHAR(100) NOT NULL,
  relation_type VARCHAR(50) NOT NULL,
  label VARCHAR(255) NOT NULL,
  risk_level VARCHAR(20) NOT NULL,
  evidence_details TEXT NOT NULL,
  institutions_involved JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 16. IMMUTABLE AUDIT TRAIL (CRYPTOGRAPHICALLY HASH-CHAINED)
CREATE TABLE audit_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  actor_id VARCHAR(100) NOT NULL,
  actor_name VARCHAR(255) NOT NULL,
  actor_role user_role NOT NULL,
  action VARCHAR(100) NOT NULL,
  entity_type VARCHAR(50) NOT NULL,
  entity_id VARCHAR(100) NOT NULL,
  before_summary TEXT,
  after_summary TEXT,
  ip_address VARCHAR(45),
  user_agent TEXT,
  prev_hash VARCHAR(64) NOT NULL,
  hash VARCHAR(64) NOT NULL
);

-- INDEXES FOR PERFORMANCE
CREATE INDEX idx_applications_institution ON applications(institution_id);
CREATE INDEX idx_applications_status ON applications(status);
CREATE INDEX idx_documents_app ON documents(application_id);
CREATE INDEX idx_documents_hash ON documents(sha256_hash);
CREATE INDEX idx_findings_app ON findings(application_id);
CREATE INDEX idx_findings_status ON findings(status);
CREATE INDEX idx_audit_chain ON audit_events(timestamp DESC);
