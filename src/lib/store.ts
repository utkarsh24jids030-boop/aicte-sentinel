// AICTE Sentinel Master In-Memory & Persistent Demo Store
// Problem Statement SIH26261 - Smart India Hackathon 2026

import {
  User,
  Institution,
  Application,
  DocumentRecord,
  Finding,
  FindingStatus,
  InspectionTask,
  OfficerActionRecord,
  AuditEvent,
  VerificationAttempt,
  AICTEInstitutionalRecord,
  InfrastructureEvidence
} from '@/types';
import { AuditTrailEngine } from './audit/trail';
import { RulesEngine } from './rules/engine';
import { LinkageRadarEngine } from './radar/graph';

// MASTER DEMO USERS
export const DEMO_USERS: User[] = [
  {
    id: 'user-inst-sunrise',
    email: 'institution@sunrise-demo.example',
    name: 'Dr. Anand Kumar',
    role: 'INSTITUTION',
    designation: 'Principal & Authorized Representative',
    institutionId: 'inst-sunrise',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    createdAt: '2026-01-01T00:00:00Z'
  },
  {
    id: 'user-officer-rao',
    email: 'officer@sentinel-demo.example',
    name: 'Smt. Priyadarshini Rao',
    role: 'OFFICER',
    designation: 'Senior Scrutiny Officer (Regulation Bureau)',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80',
    createdAt: '2026-01-01T00:00:00Z'
  },
  {
    id: 'user-evc-chandran',
    email: 'inspector@sentinel-demo.example',
    name: 'Prof. Harish Chandran',
    role: 'EVC_INSPECTOR',
    designation: 'EVC Expert Committee Lead & Senior Assessor',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    createdAt: '2026-01-01T00:00:00Z'
  },
  {
    id: 'user-admin-singh',
    email: 'admin@sentinel-demo.example',
    name: 'Vikramaditya Singh',
    role: 'ADMIN',
    designation: 'AICTE Sentinel Lead System Administrator',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
    createdAt: '2026-01-01T00:00:00Z'
  },
  {
    id: 'user-auditor-sundaram',
    email: 'auditor@sentinel-demo.example',
    name: 'Meenakshi Sundaram',
    role: 'AUDITOR',
    designation: 'Independent Regulatory & Vigilance Auditor',
    avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=150&q=80',
    createdAt: '2026-01-01T00:00:00Z'
  }
];

// 3 DEMO INSTITUTIONS
export const DEMO_INSTITUTIONS: Institution[] = [
  {
    id: 'inst-sunrise',
    aicteId: '1-10928371',
    name: 'Sunrise Institute of Technology',
    trustName: 'Sunrise Education Trust',
    locationType: 'urban',
    state: 'Karnataka',
    district: 'Bengaluru Urban',
    address: 'Survey No. 144/2, Sarjapur Outer Ring Road, Bengaluru - 560035',
    landSurveyNumber: '144/2',
    landAreaAcres: 4.85,
    contactEmail: 'admissions@sunrise-demo.example',
    contactPhone: '+91 80 2844 9100',
    establishedYear: 2012,
    status: 'SCRUTINY_PENDING',
    createdAt: '2026-01-10T09:00:00Z'
  },
  {
    id: 'inst-nova',
    aicteId: '1-28371940',
    name: 'Nova Engineering College',
    trustName: 'Nova Horizon Charitable Trust',
    locationType: 'semi-urban',
    state: 'Maharashtra',
    district: 'Pune',
    address: 'Survey No. 289/1A, Phase-3 Hinjawadi Infotech Park, Pune - 411057',
    landSurveyNumber: '289/1A',
    landAreaAcres: 3.2,
    contactEmail: 'contact@nova-demo.example',
    contactPhone: '+91 20 6711 4400',
    establishedYear: 2016,
    status: 'DEFICIENT',
    createdAt: '2026-01-12T11:30:00Z'
  },
  {
    id: 'inst-apex',
    aicteId: '1-94820194',
    name: 'Apex Polytechnic College',
    trustName: 'Apex Technical Society',
    locationType: 'semi-urban',
    state: 'Maharashtra',
    district: 'Pune',
    address: 'Survey No. 289/1A (Plot-B), Hinjawadi Phase-3, Pune - 411057',
    landSurveyNumber: '289/1A',
    landAreaAcres: 2.1,
    contactEmail: 'office@apex-demo.example',
    contactPhone: '+91 20 8920 1199',
    establishedYear: 2025,
    status: 'DEFICIENT',
    createdAt: '2026-01-15T14:15:00Z'
  },
  {
    id: 'inst-western-horizon',
    aicteId: '1-14092811',
    name: 'Western Horizon Institute of Technology',
    trustName: 'Western Horizon Educational Trust',
    locationType: 'semi-urban',
    state: 'Maharashtra',
    district: 'Pune',
    address: 'Survey No. 287/2, Phase-3 Hinjawadi, Pune - 411057',
    landSurveyNumber: '287/2',
    landAreaAcres: 5.0,
    contactEmail: 'admin@westernhorizon-demo.example',
    contactPhone: '+91 20 7820 1100',
    establishedYear: 2018,
    status: 'SCRUTINY_PENDING',
    createdAt: '2021-03-01T09:00:00Z'
  }
];

// SIMULATED AICTE INSTITUTIONAL MASTER RECORDS
// Internal records source for regulatory verification against historical sanctions
export const DEMO_INSTITUTIONAL_RECORDS: Record<string, AICTEInstitutionalRecord> = {
  'inst-sunrise': {
    institutionId: 'inst-sunrise',
    institutionName: 'Sunrise Institute of Technology',
    aictePermanentId: '1-10928371',
    priorEoAStatus: 'APPROVED',
    priorEoAYear: '2025-2026',
    approvedProgrammes: [
      { programme: 'Computer Science & Engg', level: 'UG', approvedIntake: 180 },
      { programme: 'Electronics & Comm', level: 'UG', approvedIntake: 120 },
      { programme: 'Mechanical Engg', level: 'UG', approvedIntake: 60 }
    ],
    approvedTotalIntake: 360,
    facultyRecords: [
      { facultyId: 'FAC-SUN-001', name: 'Dr. Anand Kumar', designation: 'Principal & Professor', department: 'Computer Science & Engineering', panLast4: '1092', status: 'ACTIVE' },
      { facultyId: 'FAC-SUN-002', name: 'Dr. Meera Nambiar', designation: 'Associate Professor', department: 'Electronics & Communication', panLast4: '4821', status: 'ACTIVE' },
      { facultyId: 'FAC-SUN-003', name: 'Prof. Rajesh Sharma', designation: 'Assistant Professor', department: 'Mechanical Engineering', panLast4: '3319', status: 'ACTIVE' }
    ],
    deficiencyHistory: [
      { academicYear: '2024-2025', deficiencyType: 'FIRE_SAFETY_RENEWAL', description: 'Fire NOC renewal certificate delay; compliance affidavit accepted by Hearing Committee.', rectificationStatus: 'RESOLVED' }
    ],
    terPaymentStatus: 'PAID',
    terTransactionReference: 'TER-2026-SUN-99214',
    applicationHistory: [
      { applicationNumber: 'AICTE/2025/SUN-8819', academicYear: '2025-2026', type: 'EoA', outcome: 'APPROVED', orderDate: '2025-04-30' },
      { applicationNumber: 'AICTE/2024/SUN-7712', academicYear: '2024-2025', type: 'EoA', outcome: 'APPROVED', orderDate: '2024-05-15' }
    ],
    isSimulated: true
  },
  'inst-nova': {
    institutionId: 'inst-nova',
    institutionName: 'Nova Engineering College',
    aictePermanentId: '1-90142851',
    priorEoAStatus: 'APPROVED',
    priorEoAYear: '2025-2026',
    approvedProgrammes: [
      { programme: 'Computer Science & Engg', level: 'UG', approvedIntake: 180 },
      { programme: 'Information Technology', level: 'UG', approvedIntake: 60 },
      { programme: 'Mechanical Engg', level: 'UG', approvedIntake: 60 },
      { programme: 'Civil Engg', level: 'UG', approvedIntake: 60 }
    ],
    approvedTotalIntake: 360,
    facultyRecords: [
      { facultyId: 'FAC-NOV-001', name: 'Dr. Suresh Varma', designation: 'Principal', department: 'Civil Engineering', panLast4: '7712', status: 'ACTIVE' },
      { facultyId: 'FAC-NOV-002', name: 'Dr. Vikram Malhotra', designation: 'Professor', department: 'Mechanical Engineering', panLast4: '9999', status: 'ACTIVE' }
    ],
    deficiencyHistory: [
      { academicYear: '2023-2024', deficiencyType: 'CAD_LAB_EQUIPMENT', description: 'Deficiency in workstation count in CAD center.', rectificationStatus: 'RESOLVED' }
    ],
    terPaymentStatus: 'PAID',
    terTransactionReference: 'TER-2026-NOV-88123',
    applicationHistory: [
      { applicationNumber: 'AICTE/2025/NOV-8120', academicYear: '2025-2026', type: 'EoA', outcome: 'APPROVED', orderDate: '2025-05-02' }
    ],
    isSimulated: true
  },
  'inst-apex': {
    institutionId: 'inst-apex',
    institutionName: 'Apex Polytechnic College',
    aictePermanentId: '1-88419201',
    priorEoAStatus: 'NOT_APPLICABLE',
    approvedProgrammes: [],
    approvedTotalIntake: 0,
    facultyRecords: [],
    deficiencyHistory: [],
    terPaymentStatus: 'PENDING',
    applicationHistory: [],
    isSimulated: true
  },
  'inst-western-horizon': {
    institutionId: 'inst-western-horizon',
    institutionName: 'Western Horizon Institute of Technology',
    aictePermanentId: '1-14092811',
    priorEoAStatus: 'APPROVED',
    priorEoAYear: '2024-2025',
    approvedProgrammes: [
      { programme: 'Civil Engineering', level: 'UG', approvedIntake: 60 }
    ],
    approvedTotalIntake: 60,
    facultyRecords: [],
    deficiencyHistory: [],
    terPaymentStatus: 'PAID',
    applicationHistory: [],
    isSimulated: true
  }
};

// 3 DEMO APPLICATIONS (Base Data - Scores and Tiers are computed dynamically by RulesEngine)
export const DEMO_APPLICATIONS: Application[] = [
  {
    id: 'app-sunrise-001',
    applicationNumber: 'AICTE/2026/SUN-8812',
    institutionId: 'inst-sunrise',
    institutionName: 'Sunrise Institute of Technology',
    type: 'EoA',
    academicYear: '2026-2027',
    status: 'Under Scrutiny',
    readinessScore: 75,
    linkageRiskScore: 15,
    riskTier: 'Medium',
    programmes: ['Computer Science & Engg (180)', 'Electronics & Comm (120)', 'Mechanical Engg (60)'],
    currentIntake: 360,
    proposedIntake: 360,
    submittedAt: '2026-01-20T11:45:00Z',
    createdAt: '2026-01-10T10:00:00Z',
    updatedAt: '2026-01-21T08:30:00Z'
  },
  {
    id: 'app-nova-002',
    applicationNumber: 'AICTE/2026/NOV-9014',
    institutionId: 'inst-nova',
    institutionName: 'Nova Engineering College',
    type: 'Intake_Increase',
    academicYear: '2026-2027',
    status: 'Deficiency Communicated',
    readinessScore: 45,
    linkageRiskScore: 68,
    riskTier: 'High',
    programmes: ['Computer Science & Engg (240)', 'AI & Data Science (120)', 'Robotics & Automation (60)', 'Civil Engg (60)'],
    currentIntake: 360,
    proposedIntake: 480,
    submittedAt: '2026-01-22T16:20:00Z',
    createdAt: '2026-01-12T12:00:00Z',
    updatedAt: '2026-01-23T14:00:00Z'
  },
  {
    id: 'app-apex-003',
    applicationNumber: 'AICTE/2026/APX-1044',
    institutionId: 'inst-apex',
    institutionName: 'Apex Polytechnic College',
    type: 'New_Institution',
    academicYear: '2026-2027',
    status: 'EVC Inspection Recommended',
    readinessScore: 10,
    linkageRiskScore: 92,
    riskTier: 'Critical',
    programmes: ['Diploma in Computer Technology (120)', 'Diploma in Mechanical (60)', 'Diploma in Electrical (60)'],
    currentIntake: 0,
    proposedIntake: 240,
    submittedAt: '2026-01-25T10:15:00Z',
    createdAt: '2026-01-15T15:00:00Z',
    updatedAt: '2026-01-26T09:45:00Z'
  }
];

// PRE-POPULATED INTENTIONAL DOCUMENTS
export const DEMO_DOCUMENTS: DocumentRecord[] = [
  // ==================== SUNRISE INSTITUTE OF TECHNOLOGY ====================
  // Complete application with verified DigiLocker deeds; 1 expired fire NOC; 1 low-confidence field
  {
    id: 'doc-sun-land',
    applicationId: 'app-sunrise-001',
    institutionId: 'inst-sunrise',
    documentType: 'Land Deed',
    title: 'Registered Sale Deed for Institutional Campus',
    fileName: 'Sunrise_Land_Sale_Deed.pdf',
    filePath: '/samples/Sunrise_Land_Sale_Deed.pdf',
    fileSize: 1125,
    mimeType: 'application/pdf',
    sha256Hash: '19cbc54d24ebf1b001d986484fd02ab70131fdc661fc8f040f9d646597422b01',
    verificationStatus: 'Verified',
    verificationSource: 'Bhoomi Karnataka State Cadastre Registry (simulated)',
    forensicMetadata: {
      fileSize: 1125,
      mimeType: 'application/pdf',
      sha256Hash: '19cbc54d24ebf1b001d986484fd02ab70131fdc661fc8f040f9d646597422b01',
      pageCount: 18,
      pdfProducer: 'Adobe PDF Library 15.0',
      pdfCreator: 'Acrobat PDFMaker 15 for Windows',
      creationDate: '2015-08-14T11:20:00Z',
      modificationDate: '2015-08-14T11:20:00Z',
      incrementalSavesDetected: false,
      metadataAnomalyDetected: false,
      tamperingConfidence: 0.02,
      anomalyIndicators: []
    },
    extractedFields: [
      { id: 'f-sun-1', documentId: 'doc-sun-land', fieldKey: 'survey_number', fieldLabel: 'Survey / Khasra Number', fieldValue: '144/2', confidence: 0.98, isManuallyCorrected: false, pageNumber: 2 },
      { id: 'f-sun-2', documentId: 'doc-sun-land', fieldKey: 'area_acres', fieldLabel: 'Contiguous Land Area (Acres)', fieldValue: '4.85', confidence: 0.96, isManuallyCorrected: false, pageNumber: 3 },
      { id: 'f-sun-3', documentId: 'doc-sun-land', fieldKey: 'deed_number', fieldLabel: 'Registered Deed Number', fieldValue: 'REG-BLR-2015-8891', confidence: 0.99, isManuallyCorrected: false, pageNumber: 1 },
      { id: 'f-sun-4', documentId: 'doc-sun-land', fieldKey: 'grantee_name', fieldLabel: 'Purchaser / Grantee Name', fieldValue: 'Sunrise Education Trust', confidence: 0.97, isManuallyCorrected: false, pageNumber: 1 }
    ],
    versions: [
      { id: 'v-sun-1', documentId: 'doc-sun-land', versionNumber: 1, fileName: 'Sunrise_Land_Sale_Deed.pdf', filePath: '/samples/Sunrise_Land_Sale_Deed.pdf', fileSize: 1125, sha256Hash: '19cbc54d24ebf1b001d986484fd02ab70131fdc661fc8f040f9d646597422b01', uploadedAt: '2026-01-18T10:00:00Z', uploadedBy: 'Dr. Anand Kumar' }
    ],
    createdAt: '2026-01-18T10:00:00Z',
    updatedAt: '2026-01-18T10:00:00Z'
  },
  {
    id: 'doc-sun-fire',
    applicationId: 'app-sunrise-001',
    institutionId: 'inst-sunrise',
    documentType: 'Fire Safety Certificate',
    title: 'Fire and Emergency Services Clearance Certificate',
    fileName: 'Sunrise_Fire_Safety_NOC.pdf',
    filePath: '/samples/Sunrise_Fire_Safety_NOC.pdf',
    fileSize: 1082,
    mimeType: 'application/pdf',
    sha256Hash: '982f7c02390ae4ea3b60f350adcf3265178049782c26ff9a948ac7e243ecd8ab',
    verificationStatus: 'Expired',
    verificationSource: 'Karnataka State Fire and Emergency Services (simulated)',
    forensicMetadata: {
      fileSize: 1082,
      mimeType: 'application/pdf',
      sha256Hash: '982f7c02390ae4ea3b60f350adcf3265178049782c26ff9a948ac7e243ecd8ab',
      pageCount: 3,
      pdfProducer: 'Kyocera Scan to PDF',
      creationDate: '2023-01-16T14:00:00Z',
      incrementalSavesDetected: false,
      metadataAnomalyDetected: false,
      tamperingConfidence: 0.05,
      anomalyIndicators: []
    },
    extractedFields: [
      { id: 'f-sun-5', documentId: 'doc-sun-fire', fieldKey: 'certificate_number', fieldLabel: 'Fire NOC Certificate Number', fieldValue: 'FS-BLR-2023-9941', confidence: 0.95, isManuallyCorrected: false, pageNumber: 1 },
      { id: 'f-sun-6', documentId: 'doc-sun-fire', fieldKey: 'issue_date', fieldLabel: 'Issue Date', fieldValue: '2023-01-15', confidence: 0.92, isManuallyCorrected: false, pageNumber: 1 },
      { id: 'f-sun-7', documentId: 'doc-sun-fire', fieldKey: 'expiry_date', fieldLabel: 'Expiry Date', fieldValue: '2024-01-14', confidence: 0.94, isManuallyCorrected: false, pageNumber: 1 },
      { id: 'f-sun-8', documentId: 'doc-sun-fire', fieldKey: 'issuing_station', fieldLabel: 'Issuing Fire Station', fieldValue: 'Sarjapur Fire Station', confidence: 0.91, isManuallyCorrected: false, pageNumber: 2 }
    ],
    versions: [
      { id: 'v-sun-2', documentId: 'doc-sun-fire', versionNumber: 1, fileName: 'Sunrise_Fire_Safety_NOC.pdf', filePath: '/samples/Sunrise_Fire_Safety_NOC.pdf', fileSize: 1082, sha256Hash: '982f7c02390ae4ea3b60f350adcf3265178049782c26ff9a948ac7e243ecd8ab', uploadedAt: '2026-01-18T10:10:00Z', uploadedBy: 'Dr. Anand Kumar' }
    ],
    createdAt: '2026-01-18T10:10:00Z',
    updatedAt: '2026-01-18T10:10:00Z'
  },
  {
    id: 'doc-sun-affidavit',
    applicationId: 'app-sunrise-001',
    institutionId: 'inst-sunrise',
    documentType: 'Affidavit',
    title: 'Statutory Composite Notarized Affidavit on Stamp Paper',
    fileName: 'Sunrise_Statutory_Affidavit.pdf',
    filePath: '/uploads/sunrise/affidavit.pdf',
    fileSize: 1120400,
    mimeType: 'application/pdf',
    sha256Hash: 'f490128374901823740192837401928374019283740192837401928374019283',
    verificationStatus: 'Manual Review Required',
    verificationSource: 'DigiLocker Mock Adapter (simulated)',
    forensicMetadata: {
      fileSize: 1120400,
      mimeType: 'application/pdf',
      sha256Hash: 'f490128374901823740192837401928374019283740192837401928374019283',
      pageCount: 8,
      pdfProducer: 'Adobe Acrobat Pro DC',
      creationDate: '2026-01-10T12:00:00Z',
      incrementalSavesDetected: false,
      metadataAnomalyDetected: false,
      tamperingConfidence: 0.04,
      anomalyIndicators: []
    },
    extractedFields: [
      { id: 'f-sun-9', documentId: 'doc-sun-affidavit', fieldKey: 'survey_number', fieldLabel: 'Survey Number Declared', fieldValue: '144/2', confidence: 0.96, isManuallyCorrected: false, pageNumber: 2 },
      { id: 'f-sun-10', documentId: 'doc-sun-affidavit', fieldKey: 'institution_name', fieldLabel: 'Institution Name Declared', fieldValue: 'Sunrise Institute of Technology', confidence: 0.99, isManuallyCorrected: false, pageNumber: 1 },
      { id: 'f-sun-11', documentId: 'doc-sun-affidavit', fieldKey: 'notary_registration_no', fieldLabel: 'Notary Bar Council Reg No', fieldValue: 'NOTARY-DL-98214', confidence: 0.62, isManuallyCorrected: false, pageNumber: 8 },
      { id: 'f-sun-12', documentId: 'doc-sun-affidavit', fieldKey: 'execution_date', fieldLabel: 'Affidavit Execution Date', fieldValue: '2026-01-10', confidence: 0.94, isManuallyCorrected: false, pageNumber: 8 },
      { id: 'f-sun-13', documentId: 'doc-sun-affidavit', fieldKey: 'iqac_constituted', fieldLabel: 'IQAC Constituted', fieldValue: 'true', confidence: 0.99, isManuallyCorrected: false, pageNumber: 4 },
      { id: 'f-sun-14', documentId: 'doc-sun-affidavit', fieldKey: 'anti_ragging_committee_constituted', fieldLabel: 'Anti-Ragging Squad Active', fieldValue: 'true', confidence: 0.99, isManuallyCorrected: false, pageNumber: 5 },
      { id: 'f-sun-15', documentId: 'doc-sun-affidavit', fieldKey: 'sgrc_ombudsperson_appointed', fieldLabel: 'SGRC Ombudsperson Appointed', fieldValue: 'true', confidence: 0.99, isManuallyCorrected: false, pageNumber: 6 }
    ],
    versions: [
      { id: 'v-sun-3', documentId: 'doc-sun-affidavit', versionNumber: 1, fileName: 'Sunrise_Statutory_Affidavit.pdf', filePath: '/uploads/sunrise/affidavit.pdf', fileSize: 1120400, sha256Hash: 'f490128374901823740192837401928374019283740192837401928374019283', uploadedAt: '2026-01-18T10:15:00Z', uploadedBy: 'Dr. Anand Kumar' }
    ],
    createdAt: '2026-01-18T10:15:00Z',
    updatedAt: '2026-01-18T10:15:00Z'
  },
  {
    id: 'doc-sun-bldg',
    applicationId: 'app-sunrise-001',
    institutionId: 'inst-sunrise',
    documentType: 'Building Plan',
    title: 'BBMP Sanctioned Architectural Building Plan',
    fileName: 'Sunrise_Building_Plan.pdf',
    filePath: '/uploads/sunrise/bldg_plan.pdf',
    fileSize: 4200100,
    mimeType: 'application/pdf',
    sha256Hash: '5a4b3c2d1e0f9a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b9c8d7e6f5a4b',
    verificationStatus: 'Verified',
    verificationSource: 'BBMP Town Planning Portal (simulated)',
    forensicMetadata: {
      fileSize: 4200100,
      mimeType: 'application/pdf',
      sha256Hash: '5a4b3c2d1e0f9a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b9c8d7e6f5a4b',
      pageCount: 14,
      pdfProducer: 'Autodesk AutoCAD 2024',
      creationDate: '2020-03-12T10:00:00Z',
      incrementalSavesDetected: false,
      metadataAnomalyDetected: false,
      tamperingConfidence: 0.03,
      anomalyIndicators: []
    },
    extractedFields: [
      { id: 'f-sun-16', documentId: 'doc-sun-bldg', fieldKey: 'carpet_area_sqm', fieldLabel: 'Instructional Carpet Area', fieldValue: '14200', confidence: 0.98, isManuallyCorrected: false, pageNumber: 2 },
      { id: 'f-sun-17', documentId: 'doc-sun-bldg', fieldKey: 'survey_number', fieldLabel: 'Survey Number', fieldValue: '144/2', confidence: 0.97, isManuallyCorrected: false, pageNumber: 1 }
    ],
    versions: [
      { id: 'v-sun-4', documentId: 'doc-sun-bldg', versionNumber: 1, fileName: 'Sunrise_Building_Plan.pdf', filePath: '/uploads/sunrise/bldg_plan.pdf', fileSize: 4200100, sha256Hash: '5a4b3c2d1e0f9a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b9c8d7e6f5a4b', uploadedAt: '2026-01-18T10:20:00Z', uploadedBy: 'Dr. Anand Kumar' }
    ],
    createdAt: '2026-01-18T10:20:00Z',
    updatedAt: '2026-01-18T10:20:00Z'
  },
  {
    id: 'doc-sun-struct',
    applicationId: 'app-sunrise-001',
    institutionId: 'inst-sunrise',
    documentType: 'Structural Stability Certificate',
    title: 'Certified Structural Stability & Safety Assessment',
    fileName: 'Sunrise_Structural_Stability_Certificate.pdf',
    filePath: '/uploads/sunrise/structural_cert.pdf',
    fileSize: 980000,
    mimeType: 'application/pdf',
    sha256Hash: '9a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b9c8d7e6f5a4b3c2d1e0f9a8c',
    verificationStatus: 'Verified',
    verificationSource: 'Karnataka Empanelled Engineers Board (simulated)',
    forensicMetadata: {
      fileSize: 980000,
      mimeType: 'application/pdf',
      sha256Hash: '9a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b9c8d7e6f5a4b3c2d1e0f9a8c',
      pageCount: 4,
      pdfProducer: 'Adobe PDF Library 15.0',
      creationDate: '2025-10-15T11:00:00Z',
      incrementalSavesDetected: false,
      metadataAnomalyDetected: false,
      tamperingConfidence: 0.02,
      anomalyIndicators: []
    },
    extractedFields: [
      { id: 'f-sun-18', documentId: 'doc-sun-struct', fieldKey: 'engineer_registration_no', fieldLabel: 'Structural Engineer Reg No', fieldValue: 'STR-KAR-4820', confidence: 0.98, isManuallyCorrected: false, pageNumber: 1 },
      { id: 'f-sun-19', documentId: 'doc-sun-struct', fieldKey: 'issue_date', fieldLabel: 'Assessment Issue Date', fieldValue: '2025-10-15', confidence: 0.97, isManuallyCorrected: false, pageNumber: 1 }
    ],
    versions: [
      { id: 'v-sun-5', documentId: 'doc-sun-struct', versionNumber: 1, fileName: 'Sunrise_Structural_Stability_Certificate.pdf', filePath: '/uploads/sunrise/structural_cert.pdf', fileSize: 980000, sha256Hash: '9a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b9c8d7e6f5a4b3c2d1e0f9a8c', uploadedAt: '2026-01-18T10:25:00Z', uploadedBy: 'Dr. Anand Kumar' }
    ],
    createdAt: '2026-01-18T10:25:00Z',
    updatedAt: '2026-01-18T10:25:00Z'
  },
  {
    id: 'doc-sun-occ',
    applicationId: 'app-sunrise-001',
    institutionId: 'inst-sunrise',
    documentType: 'Occupancy Certificate',
    title: 'BBMP Municipal Occupancy Certificate',
    fileName: 'Sunrise_Occupancy_Certificate.pdf',
    filePath: '/uploads/sunrise/occ_cert.pdf',
    fileSize: 1240000,
    mimeType: 'application/pdf',
    sha256Hash: '1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2c',
    verificationStatus: 'Verified',
    verificationSource: 'Certificate Registry Mock (simulated)',
    forensicMetadata: {
      fileSize: 1240000,
      mimeType: 'application/pdf',
      sha256Hash: '1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2c',
      pageCount: 3,
      pdfProducer: 'Canon iR-ADV C5535',
      creationDate: '2020-04-10T14:00:00Z',
      incrementalSavesDetected: false,
      metadataAnomalyDetected: false,
      tamperingConfidence: 0.04,
      anomalyIndicators: []
    },
    extractedFields: [
      { id: 'f-sun-20', documentId: 'doc-sun-occ', fieldKey: 'certificate_number', fieldLabel: 'Sanction Number', fieldValue: 'OCC-BBMP-2020-118', confidence: 0.98, isManuallyCorrected: false, pageNumber: 1 },
      { id: 'f-sun-21', documentId: 'doc-sun-occ', fieldKey: 'issuing_authority', fieldLabel: 'Issuing Body', fieldValue: 'Bruhat Bengaluru Mahanagara Palike', confidence: 0.96, isManuallyCorrected: false, pageNumber: 1 }
    ],
    versions: [
      { id: 'v-sun-6', documentId: 'doc-sun-occ', versionNumber: 1, fileName: 'Sunrise_Occupancy_Certificate.pdf', filePath: '/uploads/sunrise/occ_cert.pdf', fileSize: 1240000, sha256Hash: '1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2c', uploadedAt: '2026-01-18T10:30:00Z', uploadedBy: 'Dr. Anand Kumar' }
    ],
    createdAt: '2026-01-18T10:30:00Z',
    updatedAt: '2026-01-18T10:30:00Z'
  },
  {
    id: 'doc-sun-fac-appt',
    applicationId: 'app-sunrise-001',
    institutionId: 'inst-sunrise',
    documentType: 'Faculty Appointment Letter',
    title: 'Selection Committee Ratification & Faculty Orders',
    fileName: 'Sunrise_Faculty_Appointment_Orders.pdf',
    filePath: '/uploads/sunrise/fac_appt.pdf',
    fileSize: 1850000,
    mimeType: 'application/pdf',
    sha256Hash: '3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4d',
    verificationStatus: 'Verified',
    verificationSource: 'AICTE Faculty Portal (simulated)',
    forensicMetadata: {
      fileSize: 1850000,
      mimeType: 'application/pdf',
      sha256Hash: '3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4d',
      pageCount: 12,
      pdfProducer: 'Adobe Acrobat 2020',
      creationDate: '2020-07-02T10:00:00Z',
      incrementalSavesDetected: false,
      metadataAnomalyDetected: false,
      tamperingConfidence: 0.03,
      anomalyIndicators: []
    },
    extractedFields: [
      { id: 'f-sun-22', documentId: 'doc-sun-fac-appt', fieldKey: 'appointment_date', fieldLabel: 'Ratification Date', fieldValue: '2020-07-01', confidence: 0.98, isManuallyCorrected: false, pageNumber: 1 },
      { id: 'f-sun-23', documentId: 'doc-sun-fac-appt', fieldKey: 'declared_faculty_count', fieldLabel: 'Total Regular Faculty Count', fieldValue: '25', confidence: 0.99, isManuallyCorrected: false, pageNumber: 1 }
    ],
    versions: [
      { id: 'v-sun-7', documentId: 'doc-sun-fac-appt', versionNumber: 1, fileName: 'Sunrise_Faculty_Appointment_Orders.pdf', filePath: '/uploads/sunrise/fac_appt.pdf', fileSize: 1850000, sha256Hash: '3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4d', uploadedAt: '2026-01-18T10:35:00Z', uploadedBy: 'Dr. Anand Kumar' }
    ],
    createdAt: '2026-01-18T10:35:00Z',
    updatedAt: '2026-01-18T10:35:00Z'
  },
  {
    id: 'doc-sun-fac-qual',
    applicationId: 'app-sunrise-001',
    institutionId: 'inst-sunrise',
    documentType: 'Faculty Qualification Certificate',
    title: 'Ph.D. Degree Authentication - Dr. Ramesh Sundaram',
    fileName: 'Sunrise_Faculty_Qualification_Ramesh.pdf',
    filePath: '/uploads/sunrise/fac_qual.pdf',
    fileSize: 890000,
    mimeType: 'application/pdf',
    sha256Hash: '4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5e',
    verificationStatus: 'Verified',
    verificationSource: 'DigiLocker Mock Adapter (simulated)',
    forensicMetadata: {
      fileSize: 890000,
      mimeType: 'application/pdf',
      sha256Hash: '4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5e',
      pageCount: 2,
      pdfProducer: 'Anna University NAD Depository',
      creationDate: '2015-06-20T10:00:00Z',
      incrementalSavesDetected: false,
      metadataAnomalyDetected: false,
      tamperingConfidence: 0.02,
      anomalyIndicators: []
    },
    extractedFields: [
      { id: 'f-sun-24', documentId: 'doc-sun-fac-qual', fieldKey: 'degree_certificate_no', fieldLabel: 'NAD Certificate No', fieldValue: 'AU-DOC-PHD-2015-884', confidence: 0.99, isManuallyCorrected: false, pageNumber: 1 },
      { id: 'f-sun-25', documentId: 'doc-sun-fac-qual', fieldKey: 'faculty_name', fieldLabel: 'Faculty Name', fieldValue: 'Dr. Ramesh Sundaram', confidence: 0.98, isManuallyCorrected: false, pageNumber: 1 }
    ],
    versions: [
      { id: 'v-sun-8', documentId: 'doc-sun-fac-qual', versionNumber: 1, fileName: 'Sunrise_Faculty_Qualification_Ramesh.pdf', filePath: '/uploads/sunrise/fac_qual.pdf', fileSize: 890000, sha256Hash: '4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5e', uploadedAt: '2026-01-18T10:40:00Z', uploadedBy: 'Dr. Anand Kumar' }
    ],
    createdAt: '2026-01-18T10:40:00Z',
    updatedAt: '2026-01-18T10:40:00Z'
  },
  {
    id: 'doc-sun-audit',
    applicationId: 'app-sunrise-001',
    institutionId: 'inst-sunrise',
    documentType: 'Audited Financial Statement',
    title: 'Audited Financial Statements with ICAI UDIN',
    fileName: 'Sunrise_Audited_Financial_Statement.pdf',
    filePath: '/uploads/sunrise/financials.pdf',
    fileSize: 2100000,
    mimeType: 'application/pdf',
    sha256Hash: '5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f',
    verificationStatus: 'Verified',
    verificationSource: 'ICAI UDIN Verification Portal (simulated)',
    forensicMetadata: {
      fileSize: 2100000,
      mimeType: 'application/pdf',
      sha256Hash: '5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f',
      pageCount: 16,
      pdfProducer: 'Adobe PDF Library 15.0',
      creationDate: '2025-09-28T16:00:00Z',
      incrementalSavesDetected: false,
      metadataAnomalyDetected: false,
      tamperingConfidence: 0.02,
      anomalyIndicators: []
    },
    extractedFields: [
      { id: 'f-sun-26', documentId: 'doc-sun-audit', fieldKey: 'ca_membership_no', fieldLabel: 'CA Membership No', fieldValue: 'ICAI-FCA-088192', confidence: 0.98, isManuallyCorrected: false, pageNumber: 1 },
      { id: 'f-sun-27', documentId: 'doc-sun-audit', fieldKey: 'udin_number', fieldLabel: 'ICAI UDIN', fieldValue: '25088192AAAAA1124', confidence: 0.99, isManuallyCorrected: false, pageNumber: 1 }
    ],
    versions: [
      { id: 'v-sun-9', documentId: 'doc-sun-audit', versionNumber: 1, fileName: 'Sunrise_Audited_Financial_Statement.pdf', filePath: '/uploads/sunrise/financials.pdf', fileSize: 2100000, sha256Hash: '5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f', uploadedAt: '2026-01-18T10:45:00Z', uploadedBy: 'Dr. Anand Kumar' }
    ],
    createdAt: '2026-01-18T10:45:00Z',
    updatedAt: '2026-01-18T10:45:00Z'
  },
  {
    id: 'doc-sun-prior-eoa',
    applicationId: 'app-sunrise-001',
    institutionId: 'inst-sunrise',
    documentType: 'Prior EoA',
    title: 'Preceding Academic Year AICTE Approval Order (2025-2026)',
    fileName: 'Sunrise_Prior_EoA_2025.pdf',
    filePath: '/uploads/sunrise/prior_eoa.pdf',
    fileSize: 560000,
    mimeType: 'application/pdf',
    sha256Hash: '6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a',
    verificationStatus: 'Verification Pending',
    verificationSource: 'AICTE Central Document Repository (simulated) - Awaiting issuing authority confirmation',
    forensicMetadata: {
      fileSize: 560000,
      mimeType: 'application/pdf',
      sha256Hash: '6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a',
      pageCount: 3,
      pdfProducer: 'AICTE Approval Engine',
      creationDate: '2025-05-15T12:00:00Z',
      incrementalSavesDetected: false,
      metadataAnomalyDetected: false,
      tamperingConfidence: 0.01,
      anomalyIndicators: []
    },
    extractedFields: [
      { id: 'f-sun-28', documentId: 'doc-sun-prior-eoa', fieldKey: 'academic_year', fieldLabel: 'Academic Session', fieldValue: '2025-2026', confidence: 0.99, isManuallyCorrected: false, pageNumber: 1 }
    ],
    versions: [
      { id: 'v-sun-10', documentId: 'doc-sun-prior-eoa', versionNumber: 1, fileName: 'Sunrise_Prior_EoA_2025.pdf', filePath: '/uploads/sunrise/prior_eoa.pdf', fileSize: 560000, sha256Hash: '6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a', uploadedAt: '2026-01-18T10:50:00Z', uploadedBy: 'Dr. Anand Kumar' }
    ],
    verificationAttempts: [
      {
        id: 'att-sun-eoa-001',
        documentId: 'doc-sun-prior-eoa',
        adapterName: 'AICTE Approval Engine Mock Adapter (simulated)',
        attemptTimestamp: '2026-01-20T11:50:00Z',
        requestPayload: { aicteId: '1-14092811', academicYear: '2025-2026' },
        responseStatus: 'Pending',
        rawResponse: { status: 'QUEUED', message: 'Verification request queued; awaiting batch confirmation from Regional Office' },
        latencyMs: 140,
        requestSummary: 'GET /api/v2/approvals/1-14092811/2025-2026',
        responseSummary: 'HTTP 202 Accepted (140ms) - Verification request queued; awaiting batch confirmation from Regional Office',
        officerReviewStatus: 'Pending Review'
      }
    ],
    createdAt: '2026-01-18T10:50:00Z',
    updatedAt: '2026-01-18T10:50:00Z'
  },
  {
    id: 'doc-sun-trust',
    applicationId: 'app-sunrise-001',
    institutionId: 'inst-sunrise',
    documentType: 'Trust Deed',
    title: 'Registered Sponsoring Society / Trust Deed',
    fileName: 'Sunrise_Trust_Registration_Deed.pdf',
    filePath: '/uploads/sunrise/trust_deed.pdf',
    fileSize: 1750000,
    mimeType: 'application/pdf',
    sha256Hash: '7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b',
    verificationStatus: 'Verified',
    verificationSource: 'Karnataka Sub-Registrar Records (simulated)',
    forensicMetadata: {
      fileSize: 1750000,
      mimeType: 'application/pdf',
      sha256Hash: '7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b',
      pageCount: 10,
      pdfProducer: 'Adobe PDF Library 15.0',
      creationDate: '2012-04-12T10:00:00Z',
      incrementalSavesDetected: false,
      metadataAnomalyDetected: false,
      tamperingConfidence: 0.02,
      anomalyIndicators: []
    },
    extractedFields: [
      { id: 'f-sun-29', documentId: 'doc-sun-trust', fieldKey: 'registration_number', fieldLabel: 'Trust Registration No', fieldValue: 'BLR-TRUST-4491/2012', confidence: 0.98, isManuallyCorrected: false, pageNumber: 1 },
      { id: 'f-sun-30', documentId: 'doc-sun-trust', fieldKey: 'trust_name', fieldLabel: 'Trust Name', fieldValue: 'Sunrise Education Trust', confidence: 0.99, isManuallyCorrected: false, pageNumber: 1 }
    ],
    versions: [
      { id: 'v-sun-11', documentId: 'doc-sun-trust', versionNumber: 1, fileName: 'Sunrise_Trust_Registration_Deed.pdf', filePath: '/uploads/sunrise/trust_deed.pdf', fileSize: 1750000, sha256Hash: '7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b', uploadedAt: '2026-01-18T10:55:00Z', uploadedBy: 'Dr. Anand Kumar' }
    ],
    createdAt: '2026-01-18T10:55:00Z',
    updatedAt: '2026-01-18T10:55:00Z'
  },

  // ==================== NOVA ENGINEERING COLLEGE ====================
  // Missing structural stability cert; faculty deficit (22 vs 24); PDF post-signature edits; faculty reused with Apex
  {
    id: 'doc-nova-tampered',
    applicationId: 'app-nova-002',
    institutionId: 'inst-nova',
    documentType: 'Building Plan',
    title: 'Architectural Built-up Schedule & Structural Undertaking',
    fileName: 'Nova_Building_Plan_Rev2.pdf',
    filePath: '/samples/Nova_Building_Plan_Rev2.pdf',
    fileSize: 1132,
    mimeType: 'application/pdf',
    sha256Hash: 'b8129d8d5d1f598ad8133ef0bd8b28f45862ce55e87b7e8346a4785482ecfe35',
    verificationStatus: 'Manual Review Required',
    verificationSource: 'Document Forensics Engine (simulated)',
    forensicMetadata: {
      fileSize: 1132,
      mimeType: 'application/pdf',
      sha256Hash: 'b8129d8d5d1f598ad8133ef0bd8b28f45862ce55e87b7e8346a4785482ecfe35',
      pageCount: 12,
      pdfProducer: 'Canva / Ghostscript 9.53 (Hex Modified)',
      pdfCreator: 'Modified with Nitro Pro v13.70',
      creationDate: '2025-06-10T08:00:00Z',
      modificationDate: '2026-02-14T03:12:00Z',
      incrementalSavesDetected: true,
      metadataAnomalyDetected: true,
      tamperingConfidence: 0.88,
      duplicateConfidence: 0.00,
      isDuplicateMatch: false,
      tamperScoreFormula: 'TamperScore = 0.40*saves + 0.30*producer + 0.16*font + 0.10*date + 0.02',
      tamperScoreInputs: {
        incrementalSaves: 1,
        producerAnomaly: 1,
        fontDiscrepancies: 1,
        modDateDiscrepancy: 0
      },
      anomalyIndicators: [
        'PDF Producer header indicates post-creation editing with Canva / Nitro Pro',
        '3 incremental xref tables detected: document was edited after digital signing',
        'Embedded font subsets do not match original government seal font stream'
      ]
    },
    extractedFields: [
      { id: 'f-nov-1', documentId: 'doc-nova-tampered', fieldKey: 'carpet_area_sqm', fieldLabel: 'Declared Carpet Area (Sqm)', fieldValue: '4200', confidence: 0.85, isManuallyCorrected: false, pageNumber: 4 },
      { id: 'f-nov-2', documentId: 'doc-nova-tampered', fieldKey: 'survey_number', fieldLabel: 'Survey Number', fieldValue: '289/1A', confidence: 0.94, isManuallyCorrected: false, pageNumber: 1 }
    ],
    versions: [
      { id: 'v-nov-1', documentId: 'doc-nova-tampered', versionNumber: 1, fileName: 'Nova_Building_Plan_Rev2.pdf', filePath: '/samples/Nova_Building_Plan_Rev2.pdf', fileSize: 1132, sha256Hash: 'b8129d8d5d1f598ad8133ef0bd8b28f45862ce55e87b7e8346a4785482ecfe35', uploadedAt: '2026-01-20T14:00:00Z', uploadedBy: 'Rajesh Deshmukh' }
    ],
    createdAt: '2026-01-20T14:00:00Z',
    updatedAt: '2026-01-20T14:00:00Z'
  },
  {
    id: 'doc-nova-fac-reused',
    applicationId: 'app-nova-002',
    institutionId: 'inst-nova',
    documentType: 'Faculty Qualification Certificate',
    title: 'Ph.D. Degree Certificate - Dr. Vikram Malhotra',
    fileName: 'Nova_Faculty_Qualification_Malhotra.pdf',
    filePath: '/samples/Nova_Faculty_Qualification_Malhotra.pdf',
    fileSize: 1134,
    mimeType: 'application/pdf',
    sha256Hash: '548fc5336f720e4268d2040ebf370a0c3618c099d59e725a9c7f7b2edbbecab1',
    verificationStatus: 'Mismatch Detected',
    verificationSource: 'Faculty Registry Mock Adapter (simulated)',
    forensicMetadata: {
      fileSize: 1134,
      mimeType: 'application/pdf',
      sha256Hash: '548fc5336f720e4268d2040ebf370a0c3618c099d59e725a9c7f7b2edbbecab1',
      pageCount: 2,
      pdfProducer: 'VTU Digital Depository Engine',
      creationDate: '2018-08-14T10:00:00Z',
      incrementalSavesDetected: false,
      metadataAnomalyDetected: false,
      tamperingConfidence: 0.15,
      anomalyIndicators: []
    },
    extractedFields: [
      { id: 'f-nov-3', documentId: 'doc-nova-fac-reused', fieldKey: 'pan', fieldLabel: 'Faculty PAN', fieldValue: 'DEMOPAN9999X', confidence: 0.99, isManuallyCorrected: false, pageNumber: 1 },
      { id: 'f-nov-4', documentId: 'doc-nova-fac-reused', fieldKey: 'faculty_name', fieldLabel: 'Faculty Name', fieldValue: 'Dr. Vikram Malhotra', confidence: 0.98, isManuallyCorrected: false, pageNumber: 1 },
      { id: 'f-nov-5', documentId: 'doc-nova-fac-reused', fieldKey: 'certificate_number', fieldLabel: 'Degree Registration No', fieldValue: 'VTU-PHD-MECH-4412', confidence: 0.97, isManuallyCorrected: false, pageNumber: 1 }
    ],
    versions: [
      { id: 'v-nov-2', documentId: 'doc-nova-fac-reused', versionNumber: 1, fileName: 'Nova_Faculty_Qualification_Malhotra.pdf', filePath: '/samples/Nova_Faculty_Qualification_Malhotra.pdf', fileSize: 1134, sha256Hash: '548fc5336f720e4268d2040ebf370a0c3618c099d59e725a9c7f7b2edbbecab1', uploadedAt: '2026-01-20T14:30:00Z', uploadedBy: 'Rajesh Deshmukh' }
    ],
    createdAt: '2026-01-20T14:30:00Z',
    updatedAt: '2026-01-20T14:30:00Z'
  },
  {
    id: 'doc-nova-land',
    applicationId: 'app-nova-002',
    institutionId: 'inst-nova',
    documentType: 'Land Deed',
    title: 'Registered Sale Deed for Pune Campus',
    fileName: 'Nova_Land_Sale_Deed.pdf',
    filePath: '/uploads/nova/land_deed.pdf',
    fileSize: 2100000,
    mimeType: 'application/pdf',
    sha256Hash: '8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b9c8d7e6f5a4b3c2d1e0f9a8b7c',
    verificationStatus: 'Verified',
    verificationSource: 'Maharashtra Land Records Registry (simulated)',
    forensicMetadata: {
      fileSize: 2100000,
      mimeType: 'application/pdf',
      sha256Hash: '8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b9c8d7e6f5a4b3c2d1e0f9a8b7c',
      pageCount: 15,
      pdfProducer: 'Adobe PDF Library 15.0',
      creationDate: '2016-03-10T10:00:00Z',
      incrementalSavesDetected: false,
      metadataAnomalyDetected: false,
      tamperingConfidence: 0.03,
      anomalyIndicators: []
    },
    extractedFields: [
      { id: 'f-nov-6', documentId: 'doc-nova-land', fieldKey: 'survey_number', fieldLabel: 'Survey Number', fieldValue: '289/1A', confidence: 0.98, isManuallyCorrected: false, pageNumber: 2 },
      { id: 'f-nov-7', documentId: 'doc-nova-land', fieldKey: 'area_acres', fieldLabel: 'Contiguous Land Area', fieldValue: '3.2', confidence: 0.96, isManuallyCorrected: false, pageNumber: 3 },
      { id: 'f-nov-8', documentId: 'doc-nova-land', fieldKey: 'deed_number', fieldLabel: 'Deed Number', fieldValue: 'PUNE-REG-2016-4410', confidence: 0.98, isManuallyCorrected: false, pageNumber: 1 },
      { id: 'f-nov-9', documentId: 'doc-nova-land', fieldKey: 'grantee_name', fieldLabel: 'Purchaser / Grantee Name', fieldValue: 'Nova Horizon Charitable Trust', confidence: 0.99, isManuallyCorrected: false, pageNumber: 1 }
    ],
    versions: [
      { id: 'v-nov-3', documentId: 'doc-nova-land', versionNumber: 1, fileName: 'Nova_Land_Sale_Deed.pdf', filePath: '/uploads/nova/land_deed.pdf', fileSize: 2100000, sha256Hash: '8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b9c8d7e6f5a4b3c2d1e0f9a8b7c', uploadedAt: '2026-01-20T14:40:00Z', uploadedBy: 'Rajesh Deshmukh' }
    ],
    createdAt: '2026-01-20T14:40:00Z',
    updatedAt: '2026-01-20T14:40:00Z'
  },
  {
    id: 'doc-nova-affidavit',
    applicationId: 'app-nova-002',
    institutionId: 'inst-nova',
    documentType: 'Affidavit',
    title: 'Statutory Notarized Affidavit for Intake Expansion',
    fileName: 'Nova_Statutory_Affidavit.pdf',
    filePath: '/uploads/nova/affidavit.pdf',
    fileSize: 1050000,
    mimeType: 'application/pdf',
    sha256Hash: '9c8d7e6f5a4b3c2d1e0f9a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b9c8d',
    verificationStatus: 'Verified',
    verificationSource: 'DigiLocker Mock Adapter (simulated)',
    forensicMetadata: {
      fileSize: 1050000,
      mimeType: 'application/pdf',
      sha256Hash: '9c8d7e6f5a4b3c2d1e0f9a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b9c8d',
      pageCount: 7,
      pdfProducer: 'Adobe Acrobat Pro DC',
      creationDate: '2026-01-12T10:00:00Z',
      incrementalSavesDetected: false,
      metadataAnomalyDetected: false,
      tamperingConfidence: 0.03,
      anomalyIndicators: []
    },
    extractedFields: [
      { id: 'f-nov-10', documentId: 'doc-nova-affidavit', fieldKey: 'survey_number', fieldLabel: 'Survey Number', fieldValue: '289/1A', confidence: 0.98, isManuallyCorrected: false, pageNumber: 2 },
      { id: 'f-nov-11', documentId: 'doc-nova-affidavit', fieldKey: 'institution_name', fieldLabel: 'Institution Name Declared', fieldValue: 'Nova Institute of Technology', confidence: 0.99, isManuallyCorrected: false, pageNumber: 1 },
      { id: 'f-nov-11b', documentId: 'doc-nova-affidavit', fieldKey: 'trust_name', fieldLabel: 'Sponsoring Trust Name', fieldValue: 'Nova Horizon Charitable Trust', confidence: 0.99, isManuallyCorrected: false, pageNumber: 1 },
      { id: 'f-nov-12', documentId: 'doc-nova-affidavit', fieldKey: 'execution_date', fieldLabel: 'Execution Date', fieldValue: '2026-01-12', confidence: 0.97, isManuallyCorrected: false, pageNumber: 7 },
      { id: 'f-nov-13', documentId: 'doc-nova-affidavit', fieldKey: 'iqac_constituted', fieldLabel: 'IQAC Constituted', fieldValue: 'true', confidence: 0.98, isManuallyCorrected: false, pageNumber: 4 },
      { id: 'f-nov-14', documentId: 'doc-nova-affidavit', fieldKey: 'anti_ragging_committee_constituted', fieldLabel: 'Anti-Ragging Squad Active', fieldValue: 'true', confidence: 0.98, isManuallyCorrected: false, pageNumber: 5 },
      { id: 'f-nov-15', documentId: 'doc-nova-affidavit', fieldKey: 'sgrc_ombudsperson_appointed', fieldLabel: 'SGRC Ombudsperson Appointed', fieldValue: 'true', confidence: 0.98, isManuallyCorrected: false, pageNumber: 6 }
    ],
    versions: [
      { id: 'v-nov-4', documentId: 'doc-nova-affidavit', versionNumber: 1, fileName: 'Nova_Statutory_Affidavit.pdf', filePath: '/uploads/nova/affidavit.pdf', fileSize: 1050000, sha256Hash: '9c8d7e6f5a4b3c2d1e0f9a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b9c8d', uploadedAt: '2026-01-20T14:45:00Z', uploadedBy: 'Rajesh Deshmukh' }
    ],
    createdAt: '2026-01-20T14:45:00Z',
    updatedAt: '2026-01-20T14:45:00Z'
  },
  {
    id: 'doc-nova-occ',
    applicationId: 'app-nova-002',
    institutionId: 'inst-nova',
    documentType: 'Occupancy Certificate',
    title: 'Pune Municipal Corporation Occupancy Certificate',
    fileName: 'Nova_Occupancy_Certificate.pdf',
    filePath: '/uploads/nova/occ_cert.pdf',
    fileSize: 1350000,
    mimeType: 'application/pdf',
    sha256Hash: '0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e',
    verificationStatus: 'Verified',
    verificationSource: 'Certificate Registry Mock (simulated)',
    forensicMetadata: {
      fileSize: 1350000,
      mimeType: 'application/pdf',
      sha256Hash: '0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e',
      pageCount: 4,
      pdfProducer: 'Xerox WorkCentre 7845',
      creationDate: '2016-05-18T11:00:00Z',
      incrementalSavesDetected: false,
      metadataAnomalyDetected: false,
      tamperingConfidence: 0.03,
      anomalyIndicators: []
    },
    extractedFields: [
      { id: 'f-nov-16', documentId: 'doc-nova-occ', fieldKey: 'certificate_number', fieldLabel: 'Sanction Number', fieldValue: 'OCC-PUNE-2016-992', confidence: 0.98, isManuallyCorrected: false, pageNumber: 1 },
      { id: 'f-nov-17', documentId: 'doc-nova-occ', fieldKey: 'issuing_authority', fieldLabel: 'Issuing Authority', fieldValue: 'Pune Municipal Corporation', confidence: 0.97, isManuallyCorrected: false, pageNumber: 1 }
    ],
    versions: [
      { id: 'v-nov-5', documentId: 'doc-nova-occ', versionNumber: 1, fileName: 'Nova_Occupancy_Certificate.pdf', filePath: '/uploads/nova/occ_cert.pdf', fileSize: 1350000, sha256Hash: '0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e', uploadedAt: '2026-01-20T14:50:00Z', uploadedBy: 'Rajesh Deshmukh' }
    ],
    createdAt: '2026-01-20T14:50:00Z',
    updatedAt: '2026-01-20T14:50:00Z'
  },
  {
    id: 'doc-nova-fac-appt',
    applicationId: 'app-nova-002',
    institutionId: 'inst-nova',
    documentType: 'Faculty Appointment Letter',
    title: 'Selection Committee Regular Faculty Appointment Orders',
    fileName: 'Nova_Faculty_Appointment_Orders.pdf',
    filePath: '/uploads/nova/fac_appt.pdf',
    fileSize: 1650000,
    mimeType: 'application/pdf',
    sha256Hash: '1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f',
    verificationStatus: 'Verified',
    verificationSource: 'AICTE Faculty Portal (simulated)',
    forensicMetadata: {
      fileSize: 1650000,
      mimeType: 'application/pdf',
      sha256Hash: '1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f',
      pageCount: 10,
      pdfProducer: 'Adobe PDF Library 15.0',
      creationDate: '2021-08-01T10:00:00Z',
      incrementalSavesDetected: false,
      metadataAnomalyDetected: false,
      tamperingConfidence: 0.03,
      anomalyIndicators: []
    },
    extractedFields: [
      { id: 'f-nov-18', documentId: 'doc-nova-fac-appt', fieldKey: 'appointment_date', fieldLabel: 'Appointment Order Date', fieldValue: '2021-08-01', confidence: 0.98, isManuallyCorrected: false, pageNumber: 1 },
      { id: 'f-nov-19', documentId: 'doc-nova-fac-appt', fieldKey: 'declared_faculty_count', fieldLabel: 'Declared Faculty Strength', fieldValue: '22', confidence: 0.99, isManuallyCorrected: false, pageNumber: 1 }
    ],
    versions: [
      { id: 'v-nov-6', documentId: 'doc-nova-fac-appt', versionNumber: 1, fileName: 'Nova_Faculty_Appointment_Orders.pdf', filePath: '/uploads/nova/fac_appt.pdf', fileSize: 1650000, sha256Hash: '1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f', uploadedAt: '2026-01-20T14:55:00Z', uploadedBy: 'Rajesh Deshmukh' }
    ],
    createdAt: '2026-01-20T14:55:00Z',
    updatedAt: '2026-01-20T14:55:00Z'
  },
  {
    id: 'doc-nova-prior-eoa',
    applicationId: 'app-nova-002',
    institutionId: 'inst-nova',
    documentType: 'Prior EoA',
    title: 'Preceding Academic Year AICTE Approval Order (2025-2026)',
    fileName: 'Nova_Prior_EoA_2025.pdf',
    filePath: '/uploads/nova/prior_eoa.pdf',
    fileSize: 580000,
    mimeType: 'application/pdf',
    sha256Hash: '2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a',
    verificationStatus: 'Verified',
    verificationSource: 'AICTE Central Document Repository (simulated)',
    forensicMetadata: {
      fileSize: 580000,
      mimeType: 'application/pdf',
      sha256Hash: '2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a',
      pageCount: 3,
      pdfProducer: 'AICTE Approval Engine',
      creationDate: '2025-05-18T14:00:00Z',
      incrementalSavesDetected: false,
      metadataAnomalyDetected: false,
      tamperingConfidence: 0.02,
      anomalyIndicators: []
    },
    extractedFields: [
      { id: 'f-nov-20', documentId: 'doc-nova-prior-eoa', fieldKey: 'academic_year', fieldLabel: 'Academic Session', fieldValue: '2025-2026', confidence: 0.99, isManuallyCorrected: false, pageNumber: 1 }
    ],
    versions: [
      { id: 'v-nov-7', documentId: 'doc-nova-prior-eoa', versionNumber: 1, fileName: 'Nova_Prior_EoA_2025.pdf', filePath: '/uploads/nova/prior_eoa.pdf', fileSize: 580000, sha256Hash: '2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a', uploadedAt: '2026-01-20T15:00:00Z', uploadedBy: 'Rajesh Deshmukh' }
    ],
    createdAt: '2026-01-20T15:00:00Z',
    updatedAt: '2026-01-20T15:00:00Z'
  },
  {
    id: 'doc-nova-trust',
    applicationId: 'app-nova-002',
    institutionId: 'inst-nova',
    documentType: 'Trust Deed',
    title: 'Registered Sponsoring Body Registration Deed',
    fileName: 'Nova_Trust_Registration_Deed.pdf',
    filePath: '/uploads/nova/trust_deed.pdf',
    fileSize: 1820000,
    mimeType: 'application/pdf',
    sha256Hash: '3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a',
    verificationStatus: 'Verified',
    verificationSource: 'Maharashtra Charity Commissioner (simulated)',
    forensicMetadata: {
      fileSize: 1820000,
      mimeType: 'application/pdf',
      sha256Hash: '3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a',
      pageCount: 11,
      pdfProducer: 'Adobe PDF Library 15.0',
      creationDate: '2016-02-10T10:00:00Z',
      incrementalSavesDetected: false,
      metadataAnomalyDetected: false,
      tamperingConfidence: 0.02,
      anomalyIndicators: []
    },
    extractedFields: [
      { id: 'f-nov-21', documentId: 'doc-nova-trust', fieldKey: 'registration_number', fieldLabel: 'Trust Registration No', fieldValue: 'PUNE-CH-8821/2016', confidence: 0.98, isManuallyCorrected: false, pageNumber: 1 },
      { id: 'f-nov-22', documentId: 'doc-nova-trust', fieldKey: 'trust_name', fieldLabel: 'Trust Name', fieldValue: 'Nova Horizon Charitable Trust', confidence: 0.99, isManuallyCorrected: false, pageNumber: 1 }
    ],
    versions: [
      { id: 'v-nov-8', documentId: 'doc-nova-trust', versionNumber: 1, fileName: 'Nova_Trust_Registration_Deed.pdf', filePath: '/uploads/nova/trust_deed.pdf', fileSize: 1820000, sha256Hash: '3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a', uploadedAt: '2026-01-20T15:05:00Z', uploadedBy: 'Rajesh Deshmukh' }
    ],
    createdAt: '2026-01-20T15:05:00Z',
    updatedAt: '2026-01-20T15:05:00Z'
  },
  {
    id: 'doc-nova-audit',
    applicationId: 'app-nova-002',
    institutionId: 'inst-nova',
    documentType: 'Audited Financial Statement',
    title: 'Audited Balance Sheet with UDIN',
    fileName: 'Nova_Audited_Financial_Statement.pdf',
    filePath: '/uploads/nova/financials.pdf',
    fileSize: 1950000,
    mimeType: 'application/pdf',
    sha256Hash: '4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a',
    verificationStatus: 'Verified',
    verificationSource: 'ICAI UDIN Verification Portal (simulated)',
    forensicMetadata: {
      fileSize: 1950000,
      mimeType: 'application/pdf',
      sha256Hash: '4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a',
      pageCount: 14,
      pdfProducer: 'Adobe PDF Library 15.0',
      creationDate: '2025-09-15T11:00:00Z',
      incrementalSavesDetected: false,
      metadataAnomalyDetected: false,
      tamperingConfidence: 0.02,
      anomalyIndicators: []
    },
    extractedFields: [
      { id: 'f-nov-23', documentId: 'doc-nova-audit', fieldKey: 'ca_membership_no', fieldLabel: 'CA Membership No', fieldValue: 'ICAI-FCA-099412', confidence: 0.98, isManuallyCorrected: false, pageNumber: 1 }
    ],
    versions: [
      { id: 'v-nov-9', documentId: 'doc-nova-audit', versionNumber: 1, fileName: 'Nova_Audited_Financial_Statement.pdf', filePath: '/uploads/nova/financials.pdf', fileSize: 1950000, sha256Hash: '4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a', uploadedAt: '2026-01-20T15:10:00Z', uploadedBy: 'Rajesh Deshmukh' }
    ],
    createdAt: '2026-01-20T15:10:00Z',
    updatedAt: '2026-01-20T15:10:00Z'
  },

  // ==================== APEX POLYTECHNIC COLLEGE ====================
  // Overlapping land survey 289/1A; duplicate certificate OCC-PUNE-2021-DUP-01; DTE NOC source unavailable; 2.1 acres vs 2.5 acres
  {
    id: 'doc-apex-land-conflict',
    applicationId: 'app-apex-003',
    institutionId: 'inst-apex',
    documentType: 'Land Deed',
    title: 'Sub-Lease & Land Demarcation Agreement',
    fileName: 'Apex_Land_Lease_Deed.pdf',
    filePath: '/samples/Apex_Land_Lease_Deed.pdf',
    fileSize: 1078,
    mimeType: 'application/pdf',
    sha256Hash: '4998dc89c468c74307bb8566f940b49fb6fc53a67312c21f365ee1d2c3fe4afd',
    verificationStatus: 'Mismatch Detected',
    verificationSource: 'Land Records Mock Adapter (simulated)',
    forensicMetadata: {
      fileSize: 1078,
      mimeType: 'application/pdf',
      sha256Hash: '4998dc89c468c74307bb8566f940b49fb6fc53a67312c21f365ee1d2c3fe4afd',
      pageCount: 14,
      pdfProducer: 'Foxit PhantomPDF 10.1',
      creationDate: '2025-10-10T11:00:00Z',
      incrementalSavesDetected: false,
      metadataAnomalyDetected: false,
      tamperingConfidence: 0.12,
      anomalyIndicators: []
    },
    extractedFields: [
      { id: 'f-apx-1', documentId: 'doc-apex-land-conflict', fieldKey: 'survey_number', fieldLabel: 'Survey Number', fieldValue: '289/1A', confidence: 0.98, isManuallyCorrected: false, pageNumber: 2 },
      { id: 'f-apx-2', documentId: 'doc-apex-land-conflict', fieldKey: 'area_acres', fieldLabel: 'Leased Acreage', fieldValue: '2.1', confidence: 0.95, isManuallyCorrected: false, pageNumber: 3 },
      { id: 'f-apx-3', documentId: 'doc-apex-land-conflict', fieldKey: 'deed_number', fieldLabel: 'Lease Deed Number', fieldValue: 'APEX-LEASE-2025-091', confidence: 0.97, isManuallyCorrected: false, pageNumber: 1 },
      { id: 'f-apx-4', documentId: 'doc-apex-land-conflict', fieldKey: 'lessor_name', fieldLabel: 'Lessor / Grantor', fieldValue: 'Apex Technical Society', confidence: 0.97, isManuallyCorrected: false, pageNumber: 1 },
      { id: 'f-apx-4b', documentId: 'doc-apex-land-conflict', fieldKey: 'grantee_name', fieldLabel: 'Purchaser / Grantee / Lessee Name', fieldValue: 'Apex Technical Society', confidence: 0.97, isManuallyCorrected: false, pageNumber: 1 }
    ],
    versions: [
      { id: 'v-apx-1', documentId: 'doc-apex-land-conflict', versionNumber: 1, fileName: 'Apex_Land_Lease_Deed.pdf', filePath: '/samples/Apex_Land_Lease_Deed.pdf', fileSize: 1078, sha256Hash: '4998dc89c468c74307bb8566f940b49fb6fc53a67312c21f365ee1d2c3fe4afd', uploadedAt: '2026-01-22T09:00:00Z', uploadedBy: 'Sanjay Deshmukh' }
    ],
    createdAt: '2026-01-22T09:00:00Z',
    updatedAt: '2026-01-22T09:00:00Z'
  },
  {
    id: 'doc-wh-occ-2021',
    applicationId: 'app-western-horizon-2021',
    institutionId: 'inst-western-horizon',
    documentType: 'Occupancy Certificate',
    title: 'Original Municipal Occupancy Certificate (2021)',
    fileName: 'Western_Horizon_Occupancy_2021.pdf',
    filePath: '/samples/Western_Horizon_Occupancy_2021.pdf',
    fileSize: 1154,
    mimeType: 'application/pdf',
    sha256Hash: 'a4b4baef10c2ce4e86d71eb867a0d746f5990796a1a48d9881b3c3a5317ec47b',
    verificationStatus: 'Verified',
    verificationSource: 'Certificate Registry Mock (simulated)',
    forensicMetadata: {
      fileSize: 1154,
      mimeType: 'application/pdf',
      sha256Hash: 'a4b4baef10c2ce4e86d71eb867a0d746f5990796a1a48d9881b3c3a5317ec47b',
      pageCount: 2,
      pdfProducer: 'Government Municipal Portal (Archived 2021)',
      creationDate: '2021-03-15T10:00:00Z',
      incrementalSavesDetected: false,
      metadataAnomalyDetected: false,
      tamperingConfidence: 0.02,
      anomalyIndicators: []
    },
    extractedFields: [
      { id: 'f-wh-1', documentId: 'doc-wh-occ-2021', fieldKey: 'certificate_number', fieldLabel: 'Occupancy Sanction No', fieldValue: 'OCC-PUNE-2021-DUP-01', confidence: 0.99, isManuallyCorrected: false, pageNumber: 1 },
      { id: 'f-wh-2', documentId: 'doc-wh-occ-2021', fieldKey: 'issuing_authority', fieldLabel: 'Issuing Body', fieldValue: 'Pune Municipal Corporation', confidence: 0.98, isManuallyCorrected: false, pageNumber: 1 }
    ],
    versions: [
      { id: 'v-wh-1', documentId: 'doc-wh-occ-2021', versionNumber: 1, fileName: 'Western_Horizon_Occupancy_2021.pdf', filePath: '/samples/Western_Horizon_Occupancy_2021.pdf', fileSize: 1154, sha256Hash: 'a4b4baef10c2ce4e86d71eb867a0d746f5990796a1a48d9881b3c3a5317ec47b', uploadedAt: '2021-03-15T10:00:00Z', uploadedBy: 'Western Horizon Registrar' }
    ],
    createdAt: '2021-03-15T10:00:00Z',
    updatedAt: '2021-03-15T10:00:00Z'
  },
  {
    id: 'doc-apex-dup-cert',
    applicationId: 'app-apex-003',
    institutionId: 'inst-apex',
    documentType: 'Occupancy Certificate',
    title: 'Municipal Building Occupancy Certificate',
    fileName: 'Apex_Occupancy_Certificate_2021.pdf',
    filePath: '/samples/Apex_Occupancy_Certificate_2021.pdf',
    fileSize: 1154,
    mimeType: 'application/pdf',
    sha256Hash: 'a4b4baef10c2ce4e86d71eb867a0d746f5990796a1a48d9881b3c3a5317ec47b',
    verificationStatus: 'Mismatch Detected',
    verificationSource: 'Certificate Registry Mock (simulated)',
    forensicMetadata: {
      fileSize: 1154,
      mimeType: 'application/pdf',
      sha256Hash: 'a4b4baef10c2ce4e86d71eb867a0d746f5990796a1a48d9881b3c3a5317ec47b',
      pageCount: 4,
      pdfProducer: 'Ricoh Aficio MP C3002',
      creationDate: '2021-03-22T16:00:00Z',
      incrementalSavesDetected: false,
      metadataAnomalyDetected: false,
      tamperingConfidence: 0.02,
      duplicateConfidence: 0.99,
      isDuplicateMatch: true,
      duplicateMatchedDocId: 'doc-wh-occ-2021',
      duplicateMatchedFileName: 'Western_Horizon_Occupancy_2021.pdf',
      tamperScoreFormula: 'TamperScore = 0.40*saves + 0.30*producer + 0.16*font + 0.10*date + 0.02',
      tamperScoreInputs: {
        incrementalSaves: 0,
        producerAnomaly: 0,
        fontDiscrepancies: 0,
        modDateDiscrepancy: 0
      },
      anomalyIndicators: [
        'Exact cryptographic SHA-256 duplicate of archived certificate doc-wh-occ-2021 originally issued to Western Horizon in 2021',
        'Date timestamp in binary stream older than declared institution founding date'
      ]
    },
    extractedFields: [
      { id: 'f-apx-5', documentId: 'doc-apex-dup-cert', fieldKey: 'certificate_number', fieldLabel: 'Occupancy Sanction No', fieldValue: 'OCC-PUNE-2021-DUP-01', confidence: 0.96, isManuallyCorrected: false, pageNumber: 1 },
      { id: 'f-apx-6', documentId: 'doc-apex-dup-cert', fieldKey: 'issuing_authority', fieldLabel: 'Issuing Body', fieldValue: 'Pune Municipal Corporation', confidence: 0.93, isManuallyCorrected: false, pageNumber: 1 }
    ],
    versions: [
      { id: 'v-apx-2', documentId: 'doc-apex-dup-cert', versionNumber: 1, fileName: 'Apex_Occupancy_Certificate_2021.pdf', filePath: '/samples/Apex_Occupancy_Certificate_2021.pdf', fileSize: 1154, sha256Hash: 'a4b4baef10c2ce4e86d71eb867a0d746f5990796a1a48d9881b3c3a5317ec47b', uploadedAt: '2026-01-22T09:15:00Z', uploadedBy: 'Sanjay Deshmukh' }
    ],
    createdAt: '2026-01-22T09:15:00Z',
    updatedAt: '2026-01-22T09:15:00Z'
  },
  {
    id: 'doc-apex-noc-unavailable',
    applicationId: 'app-apex-003',
    institutionId: 'inst-apex',
    documentType: 'NOC',
    title: 'State Directorate of Technical Education NOC',
    fileName: 'Apex_State_Government_NOC.pdf',
    filePath: '/uploads/apex/dte_noc.pdf',
    fileSize: 760000,
    mimeType: 'application/pdf',
    sha256Hash: '9840192830491820394810293840192830491820394810293840192830491820',
    verificationStatus: 'Source Unavailable',
    verificationSource: 'State Directorate of Technical Education (simulated)',
    forensicMetadata: {
      fileSize: 760000,
      mimeType: 'application/pdf',
      sha256Hash: '9840192830491820394810293840192830491820394810293840192830491820',
      pageCount: 2,
      pdfProducer: 'PDFCreator 4.2',
      creationDate: '2025-11-01T15:00:00Z',
      incrementalSavesDetected: false,
      metadataAnomalyDetected: false,
      tamperingConfidence: 0.1,
      anomalyIndicators: []
    },
    extractedFields: [
      { id: 'f-apx-7', documentId: 'doc-apex-noc-unavailable', fieldKey: 'noc_number', fieldLabel: 'DTE NOC Reference', fieldValue: 'DTE-APEX-NOC-990', confidence: 0.91, isManuallyCorrected: false, pageNumber: 1 },
      { id: 'f-apx-8', documentId: 'doc-apex-noc-unavailable', fieldKey: 'issuing_department', fieldLabel: 'Issuing Department', fieldValue: 'Higher & Technical Education Dept Maharashtra', confidence: 0.89, isManuallyCorrected: false, pageNumber: 1 }
    ],
    versions: [
      { id: 'v-apx-3', documentId: 'doc-apex-noc-unavailable', versionNumber: 1, fileName: 'Apex_State_Government_NOC.pdf', filePath: '/uploads/apex/dte_noc.pdf', fileSize: 760000, sha256Hash: '9840192830491820394810293840192830491820394810293840192830491820', uploadedAt: '2026-01-22T09:30:00Z', uploadedBy: 'Sanjay Deshmukh' }
    ],
    createdAt: '2026-01-22T09:30:00Z',
    updatedAt: '2026-01-22T09:30:00Z'
  },
  {
    id: 'doc-apex-affidavit',
    applicationId: 'app-apex-003',
    institutionId: 'inst-apex',
    documentType: 'Affidavit',
    title: 'Statutory Notarized Composite Affidavit',
    fileName: 'Apex_Statutory_Affidavit.pdf',
    filePath: '/uploads/apex/affidavit.pdf',
    fileSize: 990000,
    mimeType: 'application/pdf',
    sha256Hash: 'a9b8c7d6e5f4a3b2c1d0e9f8a7b6c5d4e3f2a1b0c9d8e7f6a5b4c3d2e1f0a9b8',
    verificationStatus: 'Verified',
    verificationSource: 'DigiLocker Mock Adapter (simulated)',
    forensicMetadata: {
      fileSize: 990000,
      mimeType: 'application/pdf',
      sha256Hash: 'a9b8c7d6e5f4a3b2c1d0e9f8a7b6c5d4e3f2a1b0c9d8e7f6a5b4c3d2e1f0a9b8',
      pageCount: 8,
      pdfProducer: 'Adobe Acrobat Pro DC',
      creationDate: '2026-01-15T11:00:00Z',
      incrementalSavesDetected: false,
      metadataAnomalyDetected: false,
      tamperingConfidence: 0.04,
      anomalyIndicators: []
    },
    extractedFields: [
      { id: 'f-apx-9', documentId: 'doc-apex-affidavit', fieldKey: 'survey_number', fieldLabel: 'Survey Number', fieldValue: '289/1A', confidence: 0.98, isManuallyCorrected: false, pageNumber: 2 },
      { id: 'f-apx-10', documentId: 'doc-apex-affidavit', fieldKey: 'institution_name', fieldLabel: 'Institution Name Declared', fieldValue: 'Apex Institute of Technology & Management', confidence: 0.99, isManuallyCorrected: false, pageNumber: 1 },
      { id: 'f-apx-10b', documentId: 'doc-apex-affidavit', fieldKey: 'trust_name', fieldLabel: 'Sponsoring Society Name', fieldValue: 'Apex Technical Society', confidence: 0.99, isManuallyCorrected: false, pageNumber: 1 },
      { id: 'f-apx-11', documentId: 'doc-apex-affidavit', fieldKey: 'declared_land_acres', fieldLabel: 'Declared Campus Land', fieldValue: '2.1', confidence: 0.97, isManuallyCorrected: false, pageNumber: 2 },
      { id: 'f-apx-12', documentId: 'doc-apex-affidavit', fieldKey: 'execution_date', fieldLabel: 'Execution Date', fieldValue: '2026-01-15', confidence: 0.96, isManuallyCorrected: false, pageNumber: 8 },
      { id: 'f-apx-13', documentId: 'doc-apex-affidavit', fieldKey: 'joint_fdr_deposited', fieldLabel: 'Joint FDR Corpus Deposited', fieldValue: 'true', confidence: 0.98, isManuallyCorrected: false, pageNumber: 5 }
    ],
    versions: [
      { id: 'v-apx-4', documentId: 'doc-apex-affidavit', versionNumber: 1, fileName: 'Apex_Statutory_Affidavit.pdf', filePath: '/uploads/apex/affidavit.pdf', fileSize: 990000, sha256Hash: 'a9b8c7d6e5f4a3b2c1d0e9f8a7b6c5d4e3f2a1b0c9d8e7f6a5b4c3d2e1f0a9b8', uploadedAt: '2026-01-22T09:35:00Z', uploadedBy: 'Sanjay Deshmukh' }
    ],
    createdAt: '2026-01-22T09:35:00Z',
    updatedAt: '2026-01-22T09:35:00Z'
  },
  {
    id: 'doc-apex-trust',
    applicationId: 'app-apex-003',
    institutionId: 'inst-apex',
    documentType: 'Trust Deed',
    title: 'Registered Technical Society Deed',
    fileName: 'Apex_Trust_Registration_Deed.pdf',
    filePath: '/uploads/apex/trust_deed.pdf',
    fileSize: 1450000,
    mimeType: 'application/pdf',
    sha256Hash: 'b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1',
    verificationStatus: 'Verified',
    verificationSource: 'Maharashtra Societies Registration Office (simulated)',
    forensicMetadata: {
      fileSize: 1450000,
      mimeType: 'application/pdf',
      sha256Hash: 'b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1',
      pageCount: 9,
      pdfProducer: 'Adobe PDF Library 15.0',
      creationDate: '2024-06-10T10:00:00Z',
      incrementalSavesDetected: false,
      metadataAnomalyDetected: false,
      tamperingConfidence: 0.03,
      anomalyIndicators: []
    },
    extractedFields: [
      { id: 'f-apx-14', documentId: 'doc-apex-trust', fieldKey: 'registration_number', fieldLabel: 'Society Registration No', fieldValue: 'PUNE-SOC-1029/2024', confidence: 0.98, isManuallyCorrected: false, pageNumber: 1 },
      { id: 'f-apx-15', documentId: 'doc-apex-trust', fieldKey: 'trust_name', fieldLabel: 'Society Name', fieldValue: 'Apex Technical Society', confidence: 0.99, isManuallyCorrected: false, pageNumber: 1 }
    ],
    versions: [
      { id: 'v-apx-5', documentId: 'doc-apex-trust', versionNumber: 1, fileName: 'Apex_Trust_Registration_Deed.pdf', filePath: '/uploads/apex/trust_deed.pdf', fileSize: 1450000, sha256Hash: 'b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1', uploadedAt: '2026-01-22T09:40:00Z', uploadedBy: 'Sanjay Deshmukh' }
    ],
    createdAt: '2026-01-22T09:40:00Z',
    updatedAt: '2026-01-22T09:40:00Z'
  },
  {
    id: 'doc-apex-bldg',
    applicationId: 'app-apex-003',
    institutionId: 'inst-apex',
    documentType: 'Building Plan',
    title: 'Proposed Polytechnic Academic Complex Building Plan',
    fileName: 'Apex_Building_Plan.pdf',
    filePath: '/uploads/apex/bldg_plan.pdf',
    fileSize: 3200000,
    mimeType: 'application/pdf',
    sha256Hash: 'c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2',
    verificationStatus: 'Verified',
    verificationSource: 'Pune Metropolitan Regional Development Authority (simulated)',
    forensicMetadata: {
      fileSize: 3200000,
      mimeType: 'application/pdf',
      sha256Hash: 'c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2',
      pageCount: 11,
      pdfProducer: 'Autodesk AutoCAD 2025',
      creationDate: '2025-08-14T10:00:00Z',
      incrementalSavesDetected: false,
      metadataAnomalyDetected: false,
      tamperingConfidence: 0.03,
      anomalyIndicators: []
    },
    extractedFields: [
      { id: 'f-apx-15', documentId: 'doc-apex-bldg', fieldKey: 'carpet_area_sqm', fieldLabel: 'Instructional Carpet Area', fieldValue: '3100', confidence: 0.98, isManuallyCorrected: false, pageNumber: 2 },
      { id: 'f-apx-16', documentId: 'doc-apex-bldg', fieldKey: 'survey_number', fieldLabel: 'Survey Number', fieldValue: '289/1A', confidence: 0.97, isManuallyCorrected: false, pageNumber: 1 }
    ],
    versions: [
      { id: 'v-apx-6', documentId: 'doc-apex-bldg', versionNumber: 1, fileName: 'Apex_Building_Plan.pdf', filePath: '/uploads/apex/bldg_plan.pdf', fileSize: 3200000, sha256Hash: 'c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2', uploadedAt: '2026-01-22T09:45:00Z', uploadedBy: 'Sanjay Deshmukh' }
    ],
    createdAt: '2026-01-22T09:45:00Z',
    updatedAt: '2026-01-22T09:45:00Z'
  },
  {
    id: 'doc-apex-struct',
    applicationId: 'app-apex-003',
    institutionId: 'inst-apex',
    documentType: 'Structural Stability Certificate',
    title: 'Certified Structural Stability Undertaking',
    fileName: 'Apex_Structural_Stability_Certificate.pdf',
    filePath: '/uploads/apex/structural_cert.pdf',
    fileSize: 850000,
    mimeType: 'application/pdf',
    sha256Hash: 'd2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3',
    verificationStatus: 'Verified',
    verificationSource: 'Maharashtra Empanelled Structural Engineers (simulated)',
    forensicMetadata: {
      fileSize: 850000,
      mimeType: 'application/pdf',
      sha256Hash: 'd2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3',
      pageCount: 3,
      pdfProducer: 'Adobe PDF Library 15.0',
      creationDate: '2025-11-20T11:00:00Z',
      incrementalSavesDetected: false,
      metadataAnomalyDetected: false,
      tamperingConfidence: 0.02,
      anomalyIndicators: []
    },
    extractedFields: [
      { id: 'f-apx-17', documentId: 'doc-apex-struct', fieldKey: 'engineer_registration_no', fieldLabel: 'Structural Engineer Reg No', fieldValue: 'STR-MAH-1192', confidence: 0.98, isManuallyCorrected: false, pageNumber: 1 },
      { id: 'f-apx-18', documentId: 'doc-apex-struct', fieldKey: 'issue_date', fieldLabel: 'Issue Date', fieldValue: '2025-11-20', confidence: 0.97, isManuallyCorrected: false, pageNumber: 1 }
    ],
    versions: [
      { id: 'v-apx-7', documentId: 'doc-apex-struct', versionNumber: 1, fileName: 'Apex_Structural_Stability_Certificate.pdf', filePath: '/uploads/apex/structural_cert.pdf', fileSize: 850000, sha256Hash: 'd2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3', uploadedAt: '2026-01-22T09:50:00Z', uploadedBy: 'Sanjay Deshmukh' }
    ],
    createdAt: '2026-01-22T09:50:00Z',
    updatedAt: '2026-01-22T09:50:00Z'
  },
  {
    id: 'doc-apex-fac-appt',
    applicationId: 'app-apex-003',
    institutionId: 'inst-apex',
    documentType: 'Faculty Appointment Letter',
    title: 'Faculty Appointment Orders and Board Resolutions',
    fileName: 'Apex_Faculty_Appointment_Orders.pdf',
    filePath: '/uploads/apex/fac_appt.pdf',
    fileSize: 1450000,
    mimeType: 'application/pdf',
    sha256Hash: 'e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4',
    verificationStatus: 'Verified',
    verificationSource: 'AICTE Faculty Portal (simulated)',
    forensicMetadata: {
      fileSize: 1450000,
      mimeType: 'application/pdf',
      sha256Hash: 'e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4',
      pageCount: 8,
      pdfProducer: 'Adobe PDF Library 15.0',
      creationDate: '2025-12-01T10:00:00Z',
      incrementalSavesDetected: false,
      metadataAnomalyDetected: false,
      tamperingConfidence: 0.03,
      anomalyIndicators: []
    },
    extractedFields: [
      { id: 'f-apx-19', documentId: 'doc-apex-fac-appt', fieldKey: 'appointment_date', fieldLabel: 'Appointment Date', fieldValue: '2025-12-01', confidence: 0.98, isManuallyCorrected: false, pageNumber: 1 },
      { id: 'f-apx-20', documentId: 'doc-apex-fac-appt', fieldKey: 'declared_faculty_count', fieldLabel: 'Declared Faculty Strength', fieldValue: '16', confidence: 0.99, isManuallyCorrected: false, pageNumber: 1 }
    ],
    versions: [
      { id: 'v-apx-8', documentId: 'doc-apex-fac-appt', versionNumber: 1, fileName: 'Apex_Faculty_Appointment_Orders.pdf', filePath: '/uploads/apex/fac_appt.pdf', fileSize: 1450000, sha256Hash: 'e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4', uploadedAt: '2026-01-22T09:55:00Z', uploadedBy: 'Sanjay Deshmukh' }
    ],
    createdAt: '2026-01-22T09:55:00Z',
    updatedAt: '2026-01-22T09:55:00Z'
  }
];

// INITIAL EVC INSPECTION TASKS
export const DEMO_INSPECTION_TASKS: InspectionTask[] = [
  {
    id: 'task-evc-001',
    applicationId: 'app-apex-003',
    institutionId: 'inst-apex',
    institutionName: 'Apex Polytechnic College',
    inspectorId: 'user-evc-chandran',
    inspectorName: 'Prof. Harish Chandran',
    status: 'In Progress',
    scheduledDate: '2026-02-05T09:00:00Z',
    siteAddress: 'Survey No. 289/1A (Plot-B), Hinjawadi Phase-3, Pune - 411057',
    highRiskClaimsCount: 3,
    unresolvedGapsCount: 2,
    briefSummary: 'Urgent priority inspection to verify physical land demarcation of Survey 289/1A against Nova Engineering, interview Dr. Vikram Malhotra in-person, and inspect computer laboratories.',
    observations: [
      {
        id: 'obs-001',
        taskId: 'task-evc-001',
        category: 'Land & Boundary',
        claimText: 'Declared 2.1 acres exclusive land contiguous with dedicated boundary wall',
        physicalVerificationStatus: 'Deficient',
        observationNotes: 'On-site GPS survey reveals no dividing boundary wall between Nova Engineering and Apex Polytechnic. Land appears as a single shared campus with no separate demarcation.',
        photoUrls: ['https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?auto=format&fit=crop&w=600&q=80'],
        latitude: 18.591244,
        longitude: 73.738912,
        capturedAt: '2026-02-05T10:30:00Z'
      }
    ],
    createdAt: '2026-01-26T14:00:00Z'
  }
];

// SEEDED INFRASTRUCTURE PHOTOGRAPHIC & FLOOR PLAN EVIDENCE
// Evaluated using computer-vision-lite automated screening
export const DEMO_INFRASTRUCTURE_EVIDENCE: InfrastructureEvidence[] = [
  {
    id: 'infra-sun-001',
    applicationId: 'app-sunrise-001',
    institutionId: 'inst-sunrise',
    category: 'Computer Center / Lab',
    title: 'Central Computing Facility - Main Terminal Hall',
    evidenceType: 'PHOTOGRAPH',
    fileName: 'Sunrise_Computer_Center_Geotagged.jpg',
    filePath: '/uploads/app-sunrise-001/Sunrise_Computer_Center_Geotagged.jpg',
    fileSize: 1024 * 1024 * 3.2,
    mimeType: 'image/jpeg',
    sha256Hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    declaredAreaSqm: 180,
    uploadedAt: '2026-01-20T11:46:00Z',
    checks: {
      exifExtracted: true,
      exifDate: '2026-01-15T11:22:10Z',
      exifGpsCoordinates: { latitude: 12.9716, longitude: 77.5946, altitudeMeters: 920 },
      captureDevice: 'Apple iPhone 14 Pro (f/1.78, 24mm equivalent)',
      resolutionWidth: 3840,
      resolutionHeight: 2160,
      resolutionMegapixels: 8.29,
      blurScore: 88,
      isBlurry: false,
      perceptualHash: 'dhash:9a8b7c6d5e4f3a2b',
      duplicateMatchFound: false,
      areaConsistencyChecked: true,
      declaredAreaSqm: 180,
      planExtractedAreaSqm: 180,
      areaDiscrepancyPercentage: 0,
      checksRan: [
        'EXIF Metadata & Geotag Verification',
        'Perceptual Hash Duplicate Screening',
        'Image Resolution & Edge Sharpness Estimation',
        'Declared vs Plan Area Metric Comparison'
      ],
      checksNotPerformed: [
        'Deep Learning Object Recognition (Local GPU Model Not Wired)',
        'Automated Computer Workstation / Terminal Tally',
        'Automated Fire Safety Equipment Visual Recognition',
        'Crowd Density / Real-time Biometric Analysis'
      ],
      optionalVisionCaption: '[AI-generated and unverified description]: High-density academic computing laboratory with row workstation configuration and central networking switchboard.',
      isVisionCaptionUnverified: true
    },
    advisoryRecommendation: 'CLEAR_EVIDENCE',
    advisoryReason: 'High-resolution geotagged photographic evidence with verified EXIF capture metadata matching declared campus location and architectural plan.'
  },
  {
    id: 'infra-sun-002',
    applicationId: 'app-sunrise-001',
    institutionId: 'inst-sunrise',
    category: 'Central Library',
    title: 'Central Reference Library & Reading Hall',
    evidenceType: 'PHOTOGRAPH',
    fileName: 'Sunrise_Central_Library_Geotagged.jpg',
    filePath: '/uploads/app-sunrise-001/Sunrise_Central_Library_Geotagged.jpg',
    fileSize: 1024 * 1024 * 4.1,
    mimeType: 'image/jpeg',
    sha256Hash: 'a1b2c3d4e5f67890123456789abcdef0123456789abcdef0123456789abcdef0',
    declaredAreaSqm: 420,
    uploadedAt: '2026-01-20T11:47:00Z',
    checks: {
      exifExtracted: true,
      exifDate: '2026-01-15T11:35:00Z',
      exifGpsCoordinates: { latitude: 12.9718, longitude: 77.5949, altitudeMeters: 922 },
      captureDevice: 'Sony Alpha A7 IV (FE 24-70mm F2.8 GM)',
      resolutionWidth: 4000,
      resolutionHeight: 3000,
      resolutionMegapixels: 12.0,
      blurScore: 92,
      isBlurry: false,
      perceptualHash: 'dhash:1a2b3c4d5e6f7a8b',
      duplicateMatchFound: false,
      areaConsistencyChecked: true,
      declaredAreaSqm: 420,
      planExtractedAreaSqm: 420,
      areaDiscrepancyPercentage: 0,
      checksRan: [
        'EXIF Metadata & Geotag Verification',
        'Perceptual Hash Duplicate Screening',
        'Image Resolution & Edge Sharpness Estimation',
        'Declared vs Plan Area Metric Comparison'
      ],
      checksNotPerformed: [
        'Deep Learning Object Recognition (Local GPU Model Not Wired)',
        'Automated Computer Workstation / Terminal Tally',
        'Automated Fire Safety Equipment Visual Recognition',
        'Crowd Density / Real-time Biometric Analysis'
      ],
      optionalVisionCaption: '[AI-generated and unverified description]: Multi-tier institutional reading facility with book stack shelving and study cubicles.',
      isVisionCaptionUnverified: true
    },
    advisoryRecommendation: 'CLEAR_EVIDENCE',
    advisoryReason: 'High-resolution geotagged photographic evidence with verified EXIF capture metadata matching declared campus location and architectural plan.'
  },
  {
    id: 'infra-nov-001',
    applicationId: 'app-nova-002',
    institutionId: 'inst-nova',
    category: 'Computer Center / Lab',
    title: 'Advanced CAD/CAM Computing Center',
    evidenceType: 'PHOTOGRAPH',
    fileName: 'Nova_CAD_Lab_Interior.jpg',
    filePath: '/uploads/app-nova-002/Nova_CAD_Lab_Interior.jpg',
    fileSize: 1024 * 340,
    mimeType: 'image/jpeg',
    sha256Hash: '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8',
    declaredAreaSqm: 220,
    uploadedAt: '2026-01-22T16:21:00Z',
    checks: {
      exifExtracted: false,
      resolutionWidth: 800,
      resolutionHeight: 600,
      resolutionMegapixels: 0.48,
      blurScore: 22,
      isBlurry: true,
      perceptualHash: 'dhash:7f3a8c1e2b4d9a0f',
      duplicateMatchFound: false,
      areaConsistencyChecked: true,
      declaredAreaSqm: 220,
      planExtractedAreaSqm: 220,
      areaDiscrepancyPercentage: 0,
      checksRan: [
        'EXIF Metadata & Geotag Verification',
        'Perceptual Hash Duplicate Screening',
        'Image Resolution & Edge Sharpness Estimation',
        'Declared vs Plan Area Metric Comparison'
      ],
      checksNotPerformed: [
        'Deep Learning Object Recognition (Local GPU Model Not Wired)',
        'Automated Computer Workstation / Terminal Tally',
        'Automated Fire Safety Equipment Visual Recognition',
        'Crowd Density / Real-time Biometric Analysis'
      ],
      optionalVisionCaption: '[AI-generated and unverified description]: Indoor lab room with monitors. Image resolution is low; details unverified.',
      isVisionCaptionUnverified: true
    },
    advisoryRecommendation: 'ADDITIONAL_EVIDENCE_SUGGESTED',
    advisoryReason: 'Additional evidence suggested: Image blur score (22/100) and low resolution (800x600) do not allow clear verification of CAD workstation tally. Original geotagged image requested.'
  },
  {
    id: 'infra-apx-001',
    applicationId: 'app-apex-003',
    institutionId: 'inst-apex',
    category: 'Computer Center / Lab',
    title: 'Polytechnic Central Computer Laboratory',
    evidenceType: 'PHOTOGRAPH',
    fileName: 'Apex_Computer_Lab_Room102.jpg',
    filePath: '/uploads/app-apex-003/Apex_Computer_Lab_Room102.jpg',
    fileSize: 1024 * 340,
    mimeType: 'image/jpeg',
    sha256Hash: '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8',
    declaredAreaSqm: 150,
    uploadedAt: '2026-01-25T10:16:00Z',
    checks: {
      exifExtracted: false,
      resolutionWidth: 800,
      resolutionHeight: 600,
      resolutionMegapixels: 0.48,
      blurScore: 22,
      isBlurry: true,
      perceptualHash: 'dhash:7f3a8c1e2b4d9a0f',
      duplicateMatchFound: true,
      duplicateMatchedAppId: 'AICTE/2026/NOV-9014',
      duplicateMatchedCategory: 'Computer Center / Lab',
      areaConsistencyChecked: true,
      declaredAreaSqm: 150,
      planExtractedAreaSqm: 110,
      areaDiscrepancyPercentage: 27,
      checksRan: [
        'EXIF Metadata & Geotag Verification',
        'Perceptual Hash Duplicate Screening',
        'Image Resolution & Edge Sharpness Estimation',
        'Declared vs Plan Area Metric Comparison'
      ],
      checksNotPerformed: [
        'Deep Learning Object Recognition (Local GPU Model Not Wired)',
        'Automated Computer Workstation / Terminal Tally',
        'Automated Fire Safety Equipment Visual Recognition',
        'Crowd Density / Real-time Biometric Analysis'
      ],
      optionalVisionCaption: '[AI-generated and unverified description]: Photographic perspective identical to CAD lab record in application NOV-9014.',
      isVisionCaptionUnverified: true
    },
    advisoryRecommendation: 'PHYSICAL_INSPECTION_SUGGESTED',
    advisoryReason: 'Physical inspection suggested: Perceptual hash (dhash:7f3a8c1e2b4d9a0f) matches photograph submitted by Nova Engineering (AICTE/2026/NOV-9014). Declared area also diverges by 27% from floor plan. Cross-verification required during on-site EVC inspection.'
  }
];

// INITIAL AUDIT TRAIL LOGS
export const INITIAL_AUDIT_EVENTS: AuditEvent[] = [
  {
    id: 'EVT-001',
    timestamp: '2026-01-18T10:00:00Z',
    actorId: 'user-inst-sunrise',
    actorName: 'Dr. Anand Kumar',
    actorRole: 'INSTITUTION',
    action: 'DOCUMENT_UPLOAD',
    entityType: 'DOCUMENT',
    entityId: 'doc-sun-land',
    beforeSummary: 'No document present',
    afterSummary: 'Uploaded Sunrise_Land_Sale_Deed.pdf (SHA: 19cbc54d2...)',
    ipAddress: '106.51.78.22',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0',
    prevHash: '0000000000000000000000000000000000000000000000000000000000000000',
    hash: '8f7e6d5c4b3a2109876543210fedcba9876543210abcdef0123456789abcdef0'
  },
  {
    id: 'EVT-002',
    timestamp: '2026-01-18T10:05:00Z',
    actorId: 'system-forensics-worker',
    actorName: 'Sentinel Forensics Engine',
    actorRole: 'SYSTEM',
    action: 'FORENSIC_ANALYSIS_COMPLETED',
    entityType: 'DOCUMENT',
    entityId: 'doc-sun-land',
    beforeSummary: 'Unverified SHA-256',
    afterSummary: 'Forensic integrity confirmed: No anomaly, 0 incremental updates, confidence 0.98',
    ipAddress: '127.0.0.1 (Worker)',
    userAgent: 'AICTE-Forensics-Daemon/2026.3',
    prevHash: '8f7e6d5c4b3a2109876543210fedcba9876543210abcdef0123456789abcdef0',
    hash: '1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b'
  },
  {
    id: 'EVT-003',
    timestamp: '2026-01-18T10:12:00Z',
    actorId: 'system-adapter-worker',
    actorName: 'Certificate Registry Adapter',
    actorRole: 'SYSTEM',
    action: 'VERIFICATION_ATTEMPT',
    entityType: 'ADAPTER',
    entityId: 'doc-sun-fire',
    beforeSummary: 'Status: Verification Pending',
    afterSummary: 'Source status: RECORD_EXPIRED (Expired on 2024-01-14). Fail-closed status: Expired',
    ipAddress: '127.0.0.1 (Worker)',
    userAgent: 'AICTE-Adapter-Daemon/2026.3',
    prevHash: '1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b',
    hash: '4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f'
  },
  {
    id: 'EVT-004',
    timestamp: '2026-01-21T09:30:00Z',
    actorId: 'user-officer-rao',
    actorName: 'Smt. Priyadarshini Rao',
    actorRole: 'OFFICER',
    action: 'OFFICER_ACTION_CLARIFICATION',
    entityType: 'FINDING',
    entityId: 'FIND-SUN-001',
    beforeSummary: 'Status: Open',
    afterSummary: 'Status changed to Clarification Requested. Note: Submit renewed Fire Safety NOC.',
    ipAddress: '14.139.112.5 (AICTE HQ Delhi)',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Edge/120.0',
    prevHash: '4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f',
    hash: '9a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b9c8d7e6f5a4b3c2d1e0f9a8b'
  },
  {
    id: 'EVT-005',
    timestamp: '2026-01-23T11:00:00Z',
    actorId: 'user-officer-rao',
    actorName: 'Smt. Priyadarshini Rao',
    actorRole: 'OFFICER',
    action: 'OFFICER_ACTION_CONFIRM',
    entityType: 'FINDING',
    entityId: 'FIND-NOV-001',
    beforeSummary: 'Status: Open',
    afterSummary: 'Status changed to Confirmed by Officer. Notes: Flagged for scrutiny review. Potential discrepancy in declared carpet area schedule.',
    ipAddress: '14.139.112.5 (AICTE HQ Delhi)',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Edge/120.0',
    prevHash: '',
    hash: ''
  },
  {
    id: 'EVT-006',
    timestamp: '2026-01-23T12:30:00Z',
    actorId: 'user-officer-rao',
    actorName: 'Smt. Priyadarshini Rao',
    actorRole: 'OFFICER',
    action: 'OFFICER_ACTION_ESCALATE',
    entityType: 'FINDING',
    entityId: 'FIND-NOV-003',
    beforeSummary: 'Status: Open',
    afterSummary: 'Status changed to Escalated for EVC. Notes: Requires physical verification. Possible cross-institution faculty linkage for Dr. Malhotra.',
    ipAddress: '14.139.112.5 (AICTE HQ Delhi)',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Edge/120.0',
    prevHash: '',
    hash: ''
  },
  {
    id: 'EVT-007',
    timestamp: '2026-01-26T09:30:00Z',
    actorId: 'user-officer-rao',
    actorName: 'Smt. Priyadarshini Rao',
    actorRole: 'OFFICER',
    action: 'OFFICER_ACTION_ESCALATE',
    entityType: 'FINDING',
    entityId: 'FIND-APX-001',
    beforeSummary: 'Status: Open',
    afterSummary: 'Status changed to Escalated for EVC. Notes: Possible overlapping land claim across two related institutions (verify sub-division records).',
    ipAddress: '14.139.112.5 (AICTE HQ Delhi)',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Edge/120.0',
    prevHash: '',
    hash: ''
  },
  {
    id: 'EVT-008',
    timestamp: '2026-01-26T10:00:00Z',
    actorId: 'user-officer-rao',
    actorName: 'Smt. Priyadarshini Rao',
    actorRole: 'OFFICER',
    action: 'OFFICER_ACTION_CONFIRM',
    entityType: 'FINDING',
    entityId: 'FIND-APX-002',
    beforeSummary: 'Status: Open',
    afterSummary: 'Status changed to Confirmed by Officer. Notes: Potential duplicate document submission detected against historical records. Officer confirmed adverse finding.',
    ipAddress: '14.139.112.5 (AICTE HQ Delhi)',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Edge/120.0',
    prevHash: '',
    hash: ''
  },
  {
    id: 'EVT-009',
    timestamp: '2026-01-26T10:05:00Z',
    actorId: 'system-rules-engine',
    actorName: 'Rules Execution Engine',
    actorRole: 'SYSTEM',
    action: 'RULE_APPLIED',
    entityType: 'RULE_ENGINE',
    entityId: 'REC-INTAKE-001',
    ruleId: 'REC-INTAKE-001',
    ruleVersion: '2026.1',
    sourceChecked: 'AICTE Institutional Records Source (simulated)',
    sourceResponseStatus: 'RECORD_AUTHENTIC',
    afterSummary: 'Rule REC-INTAKE-001 v2026.1 applied: Evaluated declared total intake (420 seats) against master approved intake baseline (420 seats). Status: Compliant.',
    ipAddress: '127.0.0.1 (Internal Loopback)',
    userAgent: 'AICTE-RulesEngine/2026.1',
    prevHash: '',
    hash: ''
  },
  {
    id: 'EVT-010',
    timestamp: '2026-01-26T10:06:00Z',
    actorId: 'system-rules-engine',
    actorName: 'Rules Execution Engine',
    actorRole: 'SYSTEM',
    action: 'RULE_APPLIED',
    entityType: 'RULE_ENGINE',
    entityId: 'FEE-TER-001',
    ruleId: 'FEE-TER-001',
    ruleVersion: '2026.1',
    sourceChecked: 'AICTE Institutional Records Source (simulated)',
    sourceResponseStatus: 'PAYMENT_PENDING',
    afterSummary: 'Rule FEE-TER-001 v2026.1 applied: Apex Polytechnic Institute TER payment status is PENDING. Critical statutory deficiency flagged.',
    ipAddress: '127.0.0.1 (Internal Loopback)',
    userAgent: 'AICTE-RulesEngine/2026.1',
    prevHash: '',
    hash: ''
  },
  {
    id: 'EVT-011',
    timestamp: '2026-01-26T10:08:00Z',
    actorId: 'system-alert-engine',
    actorName: 'Regulatory Alert Service',
    actorRole: 'SYSTEM',
    action: 'ALERT_RAISED',
    entityType: 'FINDING',
    entityId: 'alt-006',
    alertRaisedId: 'alt-006',
    afterSummary: 'Regulatory alert alt-006 raised for unresolved_items: Technical Education Regulatory (TER) fee payment status is PENDING for Apex Polytechnic Institute.',
    ipAddress: '127.0.0.1 (Notification Daemon)',
    userAgent: 'AICTE-AlertService/2026.1',
    prevHash: '',
    hash: ''
  },
  {
    id: 'EVT-012',
    timestamp: '2026-01-26T10:15:00Z',
    actorId: 'user-inspector-1',
    actorName: 'Prof. Harish Chandra',
    actorRole: 'EVC_INSPECTOR',
    action: 'INSPECTION_OBSERVATION_RECORDED',
    entityType: 'INSPECTION',
    entityId: 'insp-001',
    afterSummary: 'Physical inspection observation recorded for Land & Boundary: Verified. Concrete boundary demarcated with barbed fence; GPS survey coordinates consistent with revenue plan.',
    ipAddress: '10.0.18.5 (EVC Field Client)',
    userAgent: 'AICTE-EVC-Mobile/2026.2',
    prevHash: '',
    hash: ''
  },
  {
    id: 'EVT-013',
    timestamp: '2026-01-26T10:20:00Z',
    actorId: 'user-auditor-1',
    actorName: 'Dr. K. S. Subramanian',
    actorRole: 'AUDITOR',
    action: 'RECORD_VIEW_ACCESS',
    entityType: 'RECORD_ACCESS',
    entityId: 'app-apex-003',
    afterSummary: 'AUDITOR Dr. K. S. Subramanian viewed APPLICATION "AICTE/2026/APX-4421 (Apex Polytechnic)"',
    ipAddress: '10.0.4.10 (Auditor Workstation)',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/121.0',
    prevHash: '',
    hash: ''
  }
];

// Initialize Audit Chain in Memory
AuditTrailEngine.seedInitialEvents(INITIAL_AUDIT_EVENTS);

// Master Data Repository Store class — Single Source of Truth
export class DataStore {
  private static users = [...DEMO_USERS];
  private static institutions = [...DEMO_INSTITUTIONS];
  private static applications = [...DEMO_APPLICATIONS];
  private static documents = [...DEMO_DOCUMENTS];
  private static inspectionTasks = [...DEMO_INSPECTION_TASKS];
  private static officerActions: OfficerActionRecord[] = [];
  private static institutionalRecords: Record<string, AICTEInstitutionalRecord> = { ...DEMO_INSTITUTIONAL_RECORDS };
  private static infrastructureEvidence: InfrastructureEvidence[] = [...DEMO_INFRASTRUCTURE_EVIDENCE];

  // Seeded officer action overrides layered onto computed findings
  private static findingOverrides = new Map<string, {
    status: FindingStatus;
    officerNotes?: string;
    reviewedBy?: string;
    reviewedAt?: string;
  }>([
    [
      'FIND-SUN-001',
      {
        status: 'Clarification Requested',
        officerNotes: 'Clarification issued to institution on 2026-01-21 to upload valid renewal receipt before EVC.',
        reviewedBy: 'Smt. Priyadarshini Rao',
        reviewedAt: '2026-01-21T09:30:00Z'
      }
    ],
    [
      'FIND-NOV-001',
      {
        status: 'Confirmed by Officer',
        officerNotes: 'Flagged for scrutiny review. Potential discrepancy in declared carpet area schedule.',
        reviewedBy: 'Smt. Priyadarshini Rao',
        reviewedAt: '2026-01-23T11:00:00Z'
      }
    ],
    [
      'FIND-NOV-003',
      {
        status: 'Escalated for EVC',
        officerNotes: 'Requires physical verification. Possible cross-institution faculty linkage for Dr. Malhotra.',
        reviewedBy: 'Smt. Priyadarshini Rao',
        reviewedAt: '2026-01-23T12:30:00Z'
      }
    ],
    [
      'FIND-APX-001',
      {
        status: 'Escalated for EVC',
        officerNotes: 'Possible overlapping land claim across two related institutions (verify sub-division records).',
        reviewedBy: 'Smt. Priyadarshini Rao',
        reviewedAt: '2026-01-26T09:30:00Z'
      }
    ],
    [
      'FIND-APX-002',
      {
        status: 'Confirmed by Officer',
        officerNotes: 'Potential duplicate document submission detected against historical records. Officer confirmed adverse finding.',
        reviewedBy: 'Smt. Priyadarshini Rao',
        reviewedAt: '2026-01-26T10:00:00Z'
      }
    ]
  ]);

  // USERS
  static getUsers(): User[] {
    return this.users;
  }

  static getUserById(id: string): User | undefined {
    return this.users.find(u => u.id === id);
  }

  static getUserByEmail(email: string): User | undefined {
    return this.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  }

  static createUser(user: User): User {
    const existing = this.getUserByEmail(user.email);
    if (existing) {
      return existing;
    }
    // Privilege escalation safeguard: non-preconfigured users are strictly INSTITUTION role
    const safeUser: User = {
      ...user,
      role: 'INSTITUTION'
    };
    this.users.push(safeUser);
    AuditTrailEngine.recordEvent({
      actorId: safeUser.id,
      actorName: safeUser.name,
      actorRole: safeUser.role,
      action: 'USER_REGISTERED',
      entityType: 'AUTH',
      entityId: safeUser.id,
      afterSummary: `User registered ${safeUser.name} with role ${safeUser.role}`
    });
    return safeUser;
  }

  // INSTITUTIONS
  static getInstitutions(): Institution[] {
    return this.institutions;
  }

  static getInstitutionById(id: string): Institution | undefined {
    return this.institutions.find(i => i.id === id);
  }

  // AICTE INSTITUTIONAL RECORDS SOURCE (SIMULATED)
  static getInstitutionalRecord(institutionId: string): AICTEInstitutionalRecord | undefined {
    return this.institutionalRecords[institutionId];
  }

  static getAllInstitutionalRecords(): AICTEInstitutionalRecord[] {
    return Object.values(this.institutionalRecords);
  }

  // APPLICATIONS — ALWAYS COMPUTED VIA RULES ENGINE & RADAR GRAPH
  static getApplications(): Application[] {
    return this.applications.map(app => {
      const docs = this.getDocuments(app.id);
      const instRecord = this.getInstitutionalRecord(app.institutionId);
      const { breakdown } = RulesEngine.evaluateApplication(app, docs, this.applications, this.documents, this.institutions, instRecord);
      const riskData = LinkageRadarEngine.getRadarForInstitution(app.institutionName);
      const linkageRiskScore = riskData.overallLinkageRiskScore;

      let riskTier: Application['riskTier'] = 'Low';
      if (linkageRiskScore >= 80 || breakdown.criticalDeficiencies >= 2) {
        riskTier = 'Critical';
      } else if (linkageRiskScore >= 50 || breakdown.criticalDeficiencies >= 1 || breakdown.highDeficiencies >= 2) {
        riskTier = 'High';
      } else if (breakdown.score < 70 || breakdown.highDeficiencies >= 1) {
        riskTier = 'Medium';
      }

      return {
        ...app,
        readinessScore: breakdown.score,
        linkageRiskScore,
        riskTier
      };
    });
  }

  static getApplicationById(id: string): Application | undefined {
    const app = this.applications.find(a => a.id === id);
    if (!app) return undefined;
    const docs = this.getDocuments(app.id);
    const instRecord = this.getInstitutionalRecord(app.institutionId);
    const { breakdown } = RulesEngine.evaluateApplication(app, docs, this.applications, this.documents, this.institutions, instRecord);
    const riskData = LinkageRadarEngine.getRadarForInstitution(app.institutionName);
    const linkageRiskScore = riskData.overallLinkageRiskScore;

    let riskTier: Application['riskTier'] = 'Low';
    if (linkageRiskScore >= 80 || breakdown.criticalDeficiencies >= 2) {
      riskTier = 'Critical';
    } else if (linkageRiskScore >= 50 || breakdown.criticalDeficiencies >= 1 || breakdown.highDeficiencies >= 2) {
      riskTier = 'High';
    } else if (breakdown.score < 70 || breakdown.highDeficiencies >= 1) {
      riskTier = 'Medium';
    }

    return {
      ...app,
      readinessScore: breakdown.score,
      linkageRiskScore,
      riskTier
    };
  }

  static createApplication(app: Application): Application {
    this.applications.push(app);
    AuditTrailEngine.recordEvent({
      actorId: 'system',
      actorName: app.institutionName,
      actorRole: 'INSTITUTION',
      action: 'APPLICATION_CREATED',
      entityType: 'APPLICATION',
      entityId: app.id,
      afterSummary: `Created new ${app.type} application ${app.applicationNumber}`
    });
    return app;
  }

  static updateApplication(id: string, updates: Partial<Application>): Application | undefined {
    const app = this.applications.find(a => a.id === id);
    if (!app) return undefined;
    const oldStatus = app.status;
    Object.assign(app, updates, { updatedAt: new Date().toISOString() });

    if (updates.status && updates.status !== oldStatus) {
      AuditTrailEngine.recordEvent({
        actorId: 'officer-action',
        actorName: 'AICTE Scrutiny System',
        actorRole: 'OFFICER',
        action: 'APPLICATION_STATUS_UPDATED',
        entityType: 'APPLICATION',
        entityId: app.id,
        beforeSummary: `Status was "${oldStatus}"`,
        afterSummary: `Status updated to "${updates.status}"`
      });
    }

    return this.getApplicationById(id);
  }

  // DOCUMENTS
  static getDocuments(applicationId?: string): DocumentRecord[] {
    if (applicationId) {
      return this.documents.filter(d => d.applicationId === applicationId);
    }
    return this.documents;
  }

  static getDocumentById(id: string): DocumentRecord | undefined {
    return this.documents.find(d => d.id === id);
  }

  static addDocument(doc: DocumentRecord): DocumentRecord {
    this.documents.push(doc);
    AuditTrailEngine.recordEvent({
      actorId: doc.versions[0]?.uploadedBy || 'user',
      actorName: 'Institution Representative',
      actorRole: 'INSTITUTION',
      action: 'DOCUMENT_UPLOAD',
      entityType: 'DOCUMENT',
      entityId: doc.id,
      afterSummary: `Uploaded "${doc.fileName}" (${doc.documentType}) SHA: ${doc.sha256Hash.substring(0, 12)}...`
    });
    return doc;
  }

  static updateDocumentStatus(
    id: string, 
    status: DocumentRecord['verificationStatus'], 
    source?: string,
    attempt?: VerificationAttempt
  ): DocumentRecord | undefined {
    const doc = this.getDocumentById(id);
    if (!doc) return undefined;
    doc.verificationStatus = status;
    if (source) doc.verificationSource = source;
    if (attempt) {
      if (!doc.verificationAttempts) doc.verificationAttempts = [];
      doc.verificationAttempts.unshift(attempt);
    }
    doc.updatedAt = new Date().toISOString();
    return doc;
  }

  static getVerificationAttempts(documentId: string): VerificationAttempt[] {
    const doc = this.getDocumentById(documentId);
    if (doc?.verificationAttempts && doc.verificationAttempts.length > 0) {
      return doc.verificationAttempts;
    }
    return this.getInitialVerificationAttempts(doc);
  }

  static getInitialVerificationAttempts(doc?: DocumentRecord): VerificationAttempt[] {
    if (!doc) return [];
    
    // Custom tailored historical attempt records matching seeded outcomes
    if (doc.id === 'doc-apex-noc-unavailable') {
      return [
        {
          id: 'ATT-DTE-APEX-001',
          documentId: doc.id,
          adapterName: 'State Directorate of Technical Education Mock Adapter (simulated)',
          attemptTimestamp: '2026-01-22T09:30:15Z',
          requestPayload: { nocNumber: 'DTE-APEX-NOC-990', state: 'Maharashtra', institutionName: 'Apex Polytechnic College' },
          requestSummary: 'GET /api/v1/dte/noc/validate?ref=DTE-APEX-NOC-990&state=Maharashtra',
          responseSummary: 'HTTP 504 Gateway Timeout (5240ms) - Upstream connection timed out',
          latencyMs: 5240,
          responseStatus: 'Source Unavailable',
          rawResponse: { sourceStatus: 'SERVICE_OFFLINE', timeoutMs: 5240 },
          officerReviewStatus: 'Pending Officer Review (Fail-Closed)'
        }
      ];
    }

    if (doc.id === 'doc-sun-land') {
      return [
        {
          id: 'ATT-LR-SUN-001',
          documentId: doc.id,
          adapterName: 'Land Records Mock Adapter',
          attemptTimestamp: '2026-01-18T10:02:10Z',
          requestPayload: { surveyNumber: '144/2', state: 'Karnataka', declaredAcres: 4.85 },
          requestSummary: 'POST /cadastre/karnataka/parcels { survey: "144/2", acres: 4.85 }',
          responseSummary: 'HTTP 200 OK (310ms) - Cadastre Status: AUTHENTIC (Unencumbered 4.85 Acres)',
          latencyMs: 310,
          responseStatus: 'Verified',
          rawResponse: { sourceStatus: 'AUTHENTIC', acreage: 4.85, owner: 'Sunrise Education Trust' },
          officerReviewStatus: 'Accepted (Automated Pass)'
        }
      ];
    }

    if (doc.id === 'doc-sun-fire') {
      return [
        {
          id: 'ATT-CR-SUN-001',
          documentId: doc.id,
          adapterName: 'Certificate Registry Mock',
          attemptTimestamp: '2026-01-18T10:12:00Z',
          requestPayload: { certNumber: 'FS-BLR-2023-9941', claimedInstitution: 'Sunrise Institute of Technology' },
          requestSummary: 'GET /api/v1/municipal/certs/FS-BLR-2023-9941',
          responseSummary: 'HTTP 200 OK (410ms) - Record: RECORD_EXPIRED (Expired on 2024-01-14)',
          latencyMs: 410,
          responseStatus: 'Expired',
          rawResponse: { sourceStatus: 'RECORD_EXPIRED', expiryDate: '2024-01-14' },
          officerReviewStatus: 'Clarification Requested'
        }
      ];
    }

    if (doc.id === 'doc-nova-fac-reused') {
      return [
        {
          id: 'ATT-FAC-NOV-001',
          documentId: doc.id,
          adapterName: 'Faculty Registry Mock Adapter',
          attemptTimestamp: '2026-01-20T14:32:00Z',
          requestPayload: { panOrId: 'DEMOPAN9999X', facultyName: 'Dr. Vikram Malhotra' },
          requestSummary: 'GET /nfd/faculty/check?pan=DEMOPAN9999X',
          responseSummary: 'HTTP 200 OK (180ms) - Registry Status: MISMATCH (Dual Active Claims)',
          latencyMs: 180,
          responseStatus: 'Mismatch',
          rawResponse: { sourceStatus: 'MISMATCH', institutions: ['Nova', 'Apex'] },
          officerReviewStatus: 'Escalated for EVC'
        }
      ];
    }

    if (doc.id === 'doc-apex-dup-cert') {
      return [
        {
          id: 'ATT-CR-APX-001',
          documentId: doc.id,
          adapterName: 'Certificate Registry Mock',
          attemptTimestamp: '2026-01-22T09:17:00Z',
          requestPayload: { certNumber: 'OCC-PUNE-2021-DUP-01', claimedInstitution: 'Apex Polytechnic College' },
          requestSummary: 'GET /api/v1/municipal/certs/OCC-PUNE-2021-DUP-01',
          responseSummary: 'HTTP 200 OK (410ms) - Cryptographic duplicate of Western Horizon archived docket',
          latencyMs: 410,
          responseStatus: 'Mismatch',
          rawResponse: { sourceStatus: 'MISMATCH', duplicateOf: 'doc-wh-occ-2021' },
          officerReviewStatus: 'Confirmed by Officer'
        }
      ];
    }

    if (doc.id === 'doc-apex-land-conflict') {
      return [
        {
          id: 'ATT-LR-APX-001',
          documentId: doc.id,
          adapterName: 'Land Records Mock Adapter',
          attemptTimestamp: '2026-01-22T09:05:00Z',
          requestPayload: { surveyNumber: '289/1A', declaredAcres: 2.1, state: 'Maharashtra' },
          requestSummary: 'POST /cadastre/maharashtra/parcels { survey: "289/1A", acres: 2.1 }',
          responseSummary: 'HTTP 409 Conflict (310ms) - Cadastre Status: MISMATCH (Overlapping Claim)',
          latencyMs: 310,
          responseStatus: 'Mismatch',
          rawResponse: { sourceStatus: 'MISMATCH', conflictWith: 'Nova Engineering College' },
          officerReviewStatus: 'Escalated for EVC'
        }
      ];
    }

    // Default attempt for other verified / unverified documents
    return [
      {
        id: `ATT-GEN-${doc.id}`,
        documentId: doc.id,
        adapterName: doc.verificationSource || 'DigiLocker Mock Adapter',
        attemptTimestamp: doc.createdAt,
        requestPayload: { documentId: doc.id, fileName: doc.fileName },
        requestSummary: `QUERY ${doc.verificationSource || 'DigiLocker'} [${doc.documentType}]`,
        responseSummary: `HTTP 200 OK (220ms) - Verification Status: ${doc.verificationStatus}`,
        latencyMs: 220,
        responseStatus: doc.verificationStatus === 'Verified' ? 'Verified' : 'Pending',
        rawResponse: { status: doc.verificationStatus },
        officerReviewStatus: doc.verificationStatus === 'Verified' ? 'Accepted (Automated Pass)' : 'Pending Review'
      }
    ];
  }

  static updateExtractedField(documentId: string, fieldId: string, newValue: string): boolean {
    const doc = this.getDocumentById(documentId);
    if (!doc) return false;
    const field = doc.extractedFields.find(f => f.id === fieldId);
    if (!field) return false;
    field.originalValue = field.originalValue || field.fieldValue;
    field.fieldValue = newValue;
    field.isManuallyCorrected = true;
    field.confidence = 1.0;

    AuditTrailEngine.recordEvent({
      actorId: 'user-institution',
      actorName: 'Institution Officer',
      actorRole: 'INSTITUTION',
      action: 'EXTRACTED_FIELD_MANUAL_CORRECTION',
      entityType: 'DOCUMENT',
      entityId: documentId,
      beforeSummary: `${field.fieldLabel} was "${field.originalValue}"`,
      afterSummary: `Manually corrected to "${newValue}"`
    });

    return true;
  }

  // FINDINGS — ALWAYS COMPUTED DYNAMICALLY VIA RULE ENGINE (SINGLE SOURCE OF TRUTH)
  static getFindings(applicationId?: string): Finding[] {
    const targetApps = applicationId
      ? [this.applications.find(a => a.id === applicationId)].filter(Boolean) as Application[]
      : this.applications;

    const resultFindings: Finding[] = [];

    for (const app of targetApps) {
      const docs = this.getDocuments(app.id);
      const instRecord = this.getInstitutionalRecord(app.institutionId);
      const { ruleFindings } = RulesEngine.evaluateApplication(app, docs, this.applications, this.documents, this.institutions, instRecord);

      for (const f of ruleFindings) {
        // Overlay officer review action state if present
        const override = this.findingOverrides.get(f.id);
        if (override) {
          f.status = override.status;
          if (override.officerNotes) f.officerNotes = override.officerNotes;
          if (override.reviewedBy) f.reviewedBy = override.reviewedBy;
          if (override.reviewedAt) f.reviewedAt = override.reviewedAt;
        }
        resultFindings.push(f);
      }
    }

    return resultFindings;
  }

  static getFindingById(id: string): Finding | undefined {
    return this.getFindings().find(f => f.id === id);
  }

  static updateFindingStatus(id: string, status: Finding['status'], officerNotes?: string, officerName?: string): Finding | undefined {
    const finding = this.getFindingById(id);
    if (!finding) return undefined;

    // Statutory Safeguard Enforcement (Item 9):
    // Officer actions that record an adverse outcome strictly require a justification and a named officer.
    const isAdverse = status === 'Confirmed by Officer' || status === 'Escalated for EVC';
    if (isAdverse) {
      if (!officerNotes || !officerNotes.trim()) {
        throw new Error('Statutory Safeguard Violation: Adverse regulatory actions (Confirmed by Officer / Escalated for EVC) strictly require a written justification.');
      }
      if (!officerName || !officerName.trim()) {
        throw new Error('Statutory Safeguard Violation: Adverse regulatory actions strictly require an identifiable named officer.');
      }
    }

    const prevStatus = finding.status;

    this.findingOverrides.set(id, {
      status,
      officerNotes: officerNotes || finding.officerNotes,
      reviewedBy: officerName || 'Smt. Priyadarshini Rao',
      reviewedAt: new Date().toISOString()
    });

    finding.status = status;
    if (officerNotes) finding.officerNotes = officerNotes;
    if (officerName) finding.reviewedBy = officerName;
    finding.reviewedAt = new Date().toISOString();

    AuditTrailEngine.recordEvent({
      actorId: officerName || 'officer',
      actorName: officerName || 'Scrutiny Officer',
      actorRole: 'OFFICER',
      action: 'FINDING_STATUS_CHANGED',
      entityType: 'FINDING',
      entityId: id,
      beforeSummary: `Status was "${prevStatus}"`,
      afterSummary: `Status changed to "${status}". Notes: ${officerNotes || 'None'}`
    });

    return finding;
  }

  // INSPECTION TASKS
  static getInspectionTasks(inspectorId?: string): InspectionTask[] {
    if (inspectorId) {
      return this.inspectionTasks.filter(t => t.inspectorId === inspectorId);
    }
    return this.inspectionTasks;
  }

  static getInspectionTaskById(id: string): InspectionTask | undefined {
    return this.inspectionTasks.find(t => t.id === id);
  }

  static addInspectionObservation(taskId: string, obs: InspectionTask['observations'][0]): boolean {
    const task = this.getInspectionTaskById(taskId);
    if (!task) return false;
    task.observations.push(obs);
    task.status = 'In Progress';

    AuditTrailEngine.recordEvent({
      actorId: task.inspectorId,
      actorName: task.inspectorName,
      actorRole: 'EVC_INSPECTOR',
      action: 'INSPECTION_OBSERVATION_RECORDED',
      entityType: 'INSPECTION',
      entityId: taskId,
      afterSummary: `Recorded observation on "${obs.category}": ${obs.physicalVerificationStatus}. Notes: ${obs.observationNotes}`
    });

    return true;
  }

  // INFRASTRUCTURE EVIDENCE (COMPUTER-VISION-LITE)
  static getInfrastructureEvidence(applicationId?: string): InfrastructureEvidence[] {
    if (applicationId) {
      return this.infrastructureEvidence.filter(e => e.applicationId === applicationId);
    }
    return this.infrastructureEvidence;
  }

  static getInfrastructureEvidenceById(id: string): InfrastructureEvidence | undefined {
    return this.infrastructureEvidence.find(e => e.id === id);
  }

  static addInfrastructureEvidence(evidence: InfrastructureEvidence): InfrastructureEvidence {
    this.infrastructureEvidence.push(evidence);
    AuditTrailEngine.recordEvent({
      actorId: 'institution-rep',
      actorName: 'Institution Representative',
      actorRole: 'INSTITUTION',
      action: 'INFRASTRUCTURE_EVIDENCE_UPLOADED',
      entityType: 'DOCUMENT',
      entityId: evidence.id,
      afterSummary: `Uploaded ${evidence.evidenceType} for "${evidence.category}": ${evidence.fileName} (${evidence.checks.resolutionMegapixels}MP, Blur: ${evidence.checks.blurScore}/100). Advisory: ${evidence.advisoryRecommendation}`
    });
    return evidence;
  }

  // OFFICER ACTIONS
  static addOfficerAction(action: OfficerActionRecord): void {
    this.officerActions.push(action);
  }

  static getOfficerActions(applicationId: string): OfficerActionRecord[] {
    return this.officerActions.filter(a => a.applicationId === applicationId);
  }

  static resetDemoData(): void {
    this.users = [...DEMO_USERS];
    this.institutions = [...DEMO_INSTITUTIONS];
    this.applications = [...DEMO_APPLICATIONS];
    this.documents = [...DEMO_DOCUMENTS];
    this.inspectionTasks = [...DEMO_INSPECTION_TASKS];
    this.officerActions = [];
    this.institutionalRecords = { ...DEMO_INSTITUTIONAL_RECORDS };
    this.infrastructureEvidence = [...DEMO_INFRASTRUCTURE_EVIDENCE];
    this.findingOverrides = new Map<string, {
      status: FindingStatus;
      officerNotes?: string;
      reviewedBy?: string;
      reviewedAt?: string;
    }>([
      ['FIND-SUN-001', { status: 'Clarification Requested', officerNotes: 'Clarification issued to institution on 2026-01-21 to upload valid renewal receipt before EVC.', reviewedBy: 'Smt. Priyadarshini Rao', reviewedAt: '2026-01-21T09:30:00Z' }],
      ['FIND-NOV-001', { status: 'Confirmed by Officer', officerNotes: 'Flagged for scrutiny review. Potential discrepancy in declared carpet area schedule.', reviewedBy: 'Smt. Priyadarshini Rao', reviewedAt: '2026-01-23T11:00:00Z' }],
      ['FIND-NOV-003', { status: 'Escalated for EVC', officerNotes: 'Requires physical verification. Possible cross-institution faculty linkage for Dr. Malhotra.', reviewedBy: 'Smt. Priyadarshini Rao', reviewedAt: '2026-01-23T12:30:00Z' }],
      ['FIND-APX-001', { status: 'Escalated for EVC', officerNotes: 'Possible overlapping land claim across two related institutions (verify sub-division records).', reviewedBy: 'Smt. Priyadarshini Rao', reviewedAt: '2026-01-26T09:30:00Z' }],
      ['FIND-APX-002', { status: 'Confirmed by Officer', officerNotes: 'Potential duplicate document submission detected against historical records. Officer confirmed adverse finding.', reviewedBy: 'Smt. Priyadarshini Rao', reviewedAt: '2026-01-26T10:00:00Z' }]
    ]);
    AuditTrailEngine.seedInitialEvents(INITIAL_AUDIT_EVENTS);
  }
}
