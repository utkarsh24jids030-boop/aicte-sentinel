// AICTE Sentinel Domain Models and Type Definitions
// Problem Statement SIH26261 - Smart India Hackathon 2026

export type UserRole = 
  | 'INSTITUTION'
  | 'OFFICER'
  | 'EVC_INSPECTOR'
  | 'ADMIN'
  | 'AUDITOR'
  | 'SYSTEM';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  designation?: string;
  institutionId?: string;
  avatarUrl?: string;
  createdAt: string;
}

export type LocationType = 'metro' | 'urban' | 'semi-urban' | 'rural';

export interface Institution {
  id: string;
  aicteId: string;
  name: string;
  trustName: string;
  locationType?: LocationType;
  state: string;
  district: string;
  address: string;
  landSurveyNumber: string;
  landAreaAcres: number;
  contactEmail: string;
  contactPhone: string;
  establishedYear: number;
  status: 'ACTIVE' | 'SCRUTINY_PENDING' | 'DEFICIENT' | 'APPROVED' | 'CLOSED';
  createdAt: string;
}

export type ApplicationType = 
  | 'EoA' 
  | 'New_Institution' 
  | 'Intake_Increase' 
  | 'Site_Change' 
  | 'Closure';

export type ApplicationStatus = 
  | 'Draft'
  | 'Submitted'
  | 'Under Scrutiny'
  | 'Deficiency Communicated'
  | 'Resubmitted'
  | 'EVC Inspection Recommended'
  | 'Approved'
  | 'Rejected';

export type RiskTier = 'Low' | 'Medium' | 'High' | 'Critical';

export interface Application {
  id: string;
  applicationNumber: string;
  institutionId: string;
  institutionName: string;
  type: ApplicationType;
  academicYear: string;
  status: ApplicationStatus;
  readinessScore: number;
  linkageRiskScore: number;
  riskTier: RiskTier;
  programmes: string[];
  currentIntake: number;
  proposedIntake: number;
  submittedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export type DocumentType = 
  | 'Land Deed'
  | 'Affidavit'
  | 'Fire Safety Certificate'
  | 'Occupancy Certificate'
  | 'Structural Stability Certificate'
  | 'Faculty Appointment Letter'
  | 'Faculty Qualification Certificate'
  | 'Trust Deed'
  | 'NOC'
  | 'Prior EoA'
  | 'Building Plan'
  | 'Audited Financial Statement';

export type VerificationStatus = 
  | 'Verified'
  | 'Mismatch Detected'
  | 'Expired'
  | 'Verification Pending'
  | 'Source Unavailable'
  | 'Manual Review Required'
  | 'Not Verified';

export interface ExtractedField {
  id: string;
  documentId: string;
  fieldKey: string;
  fieldLabel: string;
  fieldValue: string;
  confidence: number; // 0 - 1.0
  isManuallyCorrected: boolean;
  originalValue?: string;
  pageNumber?: number;
  boundingBox?: { x: number; y: number; w: number; h: number };
}

export interface DocumentVersion {
  id: string;
  documentId: string;
  versionNumber: number;
  fileName: string;
  filePath: string;
  fileSize: number;
  sha256Hash: string;
  uploadedAt: string;
  uploadedBy: string;
  changeNote?: string;
}

export interface ForensicMetadata {
  fileSize: number;
  mimeType: string;
  sha256Hash: string;
  pageCount: number;
  pdfProducer?: string;
  pdfCreator?: string;
  creationDate?: string;
  modificationDate?: string;
  incrementalSavesDetected: boolean;
  metadataAnomalyDetected: boolean;
  nearDuplicateHash?: string;
  tamperingConfidence: number; // 0 - 1.0
  anomalyIndicators: string[];
}

export interface DocumentRecord {
  id: string;
  applicationId: string;
  institutionId: string;
  documentType: DocumentType;
  title: string;
  fileName: string;
  filePath: string;
  fileSize: number;
  mimeType: string;
  sha256Hash: string;
  verificationStatus: VerificationStatus;
  verificationSource?: string;
  forensicMetadata: ForensicMetadata;
  extractedFields: ExtractedField[];
  versions: DocumentVersion[];
  createdAt: string;
  updatedAt: string;
}

export type FindingSeverity = 'Critical' | 'High' | 'Medium' | 'Low';

export type FindingStatus = 
  | 'Open'
  | 'Confirmed by Officer'
  | 'Dismissed with Justification'
  | 'Clarification Requested'
  | 'Escalated for EVC';

export type FindingCategory = 
  | 'FORENSIC_ANOMALY'
  | 'COMPLIANCE_BREACH'
  | 'CROSS_INSTITUTION_LINKAGE'
  | 'VERIFICATION_MISMATCH';

export interface Finding {
  id: string;
  applicationId: string;
  documentId?: string;
  ruleId?: string;
  category: FindingCategory;
  severity: FindingSeverity;
  confidence: number; // 0 - 1.0
  title: string;
  explanation: string;
  evidenceLocator: string;
  recommendedAction: string;
  status: FindingStatus;
  officerNotes?: string;
  reviewedBy?: string;
  reviewedAt?: string;
  createdAt: string;
}

export interface VerificationPassport {
  documentId: string;
  fileName: string;
  sha256Hash: string;
  documentType: DocumentType;
  verificationStatus: VerificationStatus;
  verificationSource: string;
  extractedFields: ExtractedField[];
  attempts: VerificationAttempt[];
  sourceResponse?: SourceResponse;
  lastAttemptAt: string;
  evidenceLocator: string;
  officerReviewStatus: string;
}

export interface VerificationAttempt {
  id: string;
  documentId: string;
  adapterName: 'DigiLocker Mock Adapter' | 'Certificate Registry Mock' | 'Land Records Mock Adapter' | 'Faculty Registry Mock Adapter';
  attemptTimestamp: string;
  requestPayload: Record<string, unknown>;
  responseStatus: 'Verified' | 'Mismatch' | 'Expired' | 'Pending' | 'Source Unavailable';
  rawResponse: Record<string, unknown>;
}

export interface SourceResponse {
  sourceName: string;
  sourceStatus: 'AUTHENTIC' | 'MISMATCH' | 'RECORD_EXPIRED' | 'SERVICE_OFFLINE' | 'RECORD_NOT_FOUND';
  details: Record<string, unknown>;
  timestamp: string;
}

export interface RuleChangelogEntry {
  version: string;
  date: string;
  author: string;
  description: string;
}

export interface ComplianceRule {
  rule_id: string;
  version: string;
  name: string;
  category: 'Land' | 'Building' | 'Fire safety' | 'Faculty' | 'Governance' | 'Financial' | 'Academic' | 'Documents' | 'Consistency' | 'Dates' | 'Infrastructure' | 'Cross-Application' | 'CrossApplication';
  applies_to: ApplicationType[];
  severity: FindingSeverity;
  logic: string;
  evidence_fields: string[];
  failure_message: string;
  recommended_action: string;
  source_reference: string;
  changelog?: RuleChangelogEntry[];
}

export interface ReadinessBreakdown {
  score: number;
  maxScore: number;
  criticalDeficiencies: number;
  highDeficiencies: number;
  mediumDeficiencies: number;
  lowDeficiencies: number;
  passedChecks: number;
  totalChecks: number;
  deficiencies: {
    ruleId: string;
    ruleName: string;
    severity: FindingSeverity;
    message: string;
    recommendedAction: string;
    documentType?: DocumentType;
  }[];
}

export interface OfficerActionRecord {
  id: string;
  applicationId: string;
  officerId: string;
  officerName: string;
  actionType: 
    | 'STATUS_CHANGE'
    | 'CONFIRM_FINDING'
    | 'DISMISS_FINDING'
    | 'ESCALATE_TO_EVC'
    | 'REQUEST_CLARIFICATION'
    | 'GENERATE_SCRUTINY_REPORT'
    | 'GENERATE_INSPECTION_BRIEF';
  notes: string;
  findingId?: string;
  timestamp: string;
}

export interface InspectionTask {
  id: string;
  applicationId: string;
  institutionId: string;
  institutionName: string;
  inspectorId: string;
  inspectorName: string;
  status: 'Assigned' | 'In Progress' | 'Completed';
  scheduledDate: string;
  siteAddress: string;
  highRiskClaimsCount: number;
  unresolvedGapsCount: number;
  briefSummary: string;
  observations: InspectionObservation[];
  createdAt: string;
}

export interface InspectionObservation {
  id: string;
  taskId: string;
  category: 'Land & Boundary' | 'Building & Labs' | 'Fire Safety & NOC' | 'Faculty Physical Verification' | 'General Infrastructure';
  claimText: string;
  physicalVerificationStatus: 'Verified' | 'Deficient' | 'Discrepant' | 'Inconclusive';
  observationNotes: string;
  photoUrls: string[];
  latitude?: number;
  longitude?: number;
  capturedAt: string;
}

export interface RiskGraphNode {
  id: string;
  type: 'INSTITUTION' | 'TRUST' | 'LAND_PARCEL' | 'BUILDING' | 'FACULTY' | 'CERTIFICATE' | 'DOCUMENT';
  label: string;
  subLabel?: string;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  metadata: Record<string, unknown>;
  x?: number;
  y?: number;
}

export interface RiskGraphEdge {
  id: string;
  source: string;
  target: string;
  relationType: 'SHARED_LAND' | 'REUSED_FACULTY' | 'DUPLICATE_CERTIFICATE' | 'SAME_TRUST' | 'SHARED_ADDRESS' | 'IDENTICAL_HASH';
  label: string;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  evidenceDetails: string;
  institutionsInvolved: string[];
}

export interface LinkageRadarData {
  nodes: RiskGraphNode[];
  edges: RiskGraphEdge[];
  overallLinkageRiskScore: number;
  riskSummary: {
    criticalClusters: number;
    crossInstitutionalReuses: number;
    overlappingLandCount: number;
    duplicateFacultyCount: number;
  };
}

export interface AuditEvent {
  id: string;
  timestamp: string;
  actorId: string;
  actorName: string;
  actorRole: UserRole;
  action: string;
  entityType: 'APPLICATION' | 'DOCUMENT' | 'FINDING' | 'RULE_ENGINE' | 'ADAPTER' | 'INSPECTION' | 'AUTH';
  entityId: string;
  beforeSummary?: string;
  afterSummary?: string;
  ipAddress?: string;
  userAgent?: string;
  prevHash: string;
  hash: string;
}

export interface ScrutinyReportData {
  reportId: string;
  applicationNumber: string;
  institutionName: string;
  aicteId: string;
  applicationType: ApplicationType;
  academicYear: string;
  readinessScore: number;
  linkageRiskScore: number;
  scrutinyDate: string;
  officerName: string;
  officerDesignation: string;
  verificationSummary: {
    totalDocuments: number;
    verified: number;
    mismatch: number;
    expired: number;
    manualReview: number;
    sourceUnavailable: number;
  };
  keyFindings: Finding[];
  officerRecommendation: 'CONSIDER_APPROVAL' | 'CONSIDER_EVC_INSPECTION' | 'ISSUE_SHOW_CAUSE_DEFICIENCY' | 'CONSIDER_VIGILANCE_REFERRAL' | 'REFER_TO_SCRUTINY_COMMITTEE';
  officerConcludingRemarks: string;
  hashChainStamp: string;
}
