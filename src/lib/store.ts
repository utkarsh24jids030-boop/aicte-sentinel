// AICTE Sentinel Master In-Memory & Persistent Demo Store
// Problem Statement SIH26261 - Smart India Hackathon 2026

import {
  User,
  Institution,
  Application,
  DocumentRecord,
  Finding,
  InspectionTask,
  VerificationPassport,
  OfficerActionRecord,
  AuditEvent
} from '@/types';
import { AuditTrailEngine } from './audit/trail';

// MASTER DEMO USERS
export const DEMO_USERS: User[] = [
  {
    id: 'user-inst-sunrise',
    email: 'institution@sunrise.edu',
    name: 'Dr. Anand Kumar',
    role: 'INSTITUTION',
    designation: 'Principal & Authorized Representative',
    institutionId: 'inst-sunrise',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    createdAt: '2026-01-01T00:00:00Z'
  },
  {
    id: 'user-officer-rao',
    email: 'officer@aicte-india.org',
    name: 'Smt. Priyadarshini Rao',
    role: 'OFFICER',
    designation: 'Senior Scrutiny Officer (Bureau of Approvals)',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80',
    createdAt: '2026-01-01T00:00:00Z'
  },
  {
    id: 'user-evc-chandran',
    email: 'inspector@aicte-evc.gov.in',
    name: 'Prof. Harish Chandran',
    role: 'EVC_INSPECTOR',
    designation: 'EVC Expert Committee Lead & Senior Assessor',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    createdAt: '2026-01-01T00:00:00Z'
  },
  {
    id: 'user-admin-singh',
    email: 'admin@aicte-india.org',
    name: 'Vikramaditya Singh',
    role: 'ADMIN',
    designation: 'AICTE Sentinel Lead System Administrator',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
    createdAt: '2026-01-01T00:00:00Z'
  },
  {
    id: 'user-auditor-sundaram',
    email: 'auditor@cag.gov.in',
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
    state: 'Karnataka',
    district: 'Bengaluru Urban',
    address: 'Survey No. 144/2, Sarjapur Outer Ring Road, Bengaluru - 560035',
    landSurveyNumber: '144/2',
    landAreaAcres: 4.85,
    contactEmail: 'admissions@sunrise.edu',
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
    state: 'Maharashtra',
    district: 'Pune',
    address: 'Survey No. 289/1A, Phase-3 Hinjawadi Infotech Park, Pune - 411057',
    landSurveyNumber: '289/1A',
    landAreaAcres: 3.2,
    contactEmail: 'contact@novaengg.ac.in',
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
    state: 'Maharashtra',
    district: 'Pune',
    address: 'Survey No. 289/1A (Plot-B), Hinjawadi Phase-3, Pune - 411057',
    landSurveyNumber: '289/1A',
    landAreaAcres: 2.1,
    contactEmail: 'office@apexpolytechnic.edu.in',
    contactPhone: '+91 20 8920 1199',
    establishedYear: 2025,
    status: 'DEFICIENT',
    createdAt: '2026-01-15T14:15:00Z'
  }
];

// 3 DEMO APPLICATIONS
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
    collusionRiskScore: 15,
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
    collusionRiskScore: 68,
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
    readinessScore: 25,
    collusionRiskScore: 92,
    riskTier: 'Critical',
    programmes: ['Diploma in Computer Technology (120)', 'Diploma in Mechanical (60)', 'Diploma in Electrical (60)'],
    currentIntake: 0,
    proposedIntake: 240,
    submittedAt: '2026-01-25T10:15:00Z',
    createdAt: '2026-01-15T15:00:00Z',
    updatedAt: '2026-01-26T09:45:00Z'
  }
];

// PRE-POPULATED DOCUMENTS
export const DEMO_DOCUMENTS: DocumentRecord[] = [
  // Sunrise Institute Documents
  {
    id: 'doc-sun-land',
    applicationId: 'app-sunrise-001',
    institutionId: 'inst-sunrise',
    documentType: 'Land Deed',
    title: 'Registered Sale Deed for Institutional Campus',
    fileName: 'Sunrise_Registered_Land_Deed_2015.pdf',
    filePath: '/uploads/sunrise/land_deed.pdf',
    fileSize: 2450120,
    mimeType: 'application/pdf',
    sha256Hash: 'a1f893e3d489b0128cf7e9124401bbcd87234918237461829374012938471a2b',
    verificationStatus: 'Verified',
    verificationSource: 'Bhoomi Karnataka State Cadastre Registry',
    forensicMetadata: {
      fileSize: 2450120,
      mimeType: 'application/pdf',
      sha256Hash: 'a1f893e3d489b0128cf7e9124401bbcd87234918237461829374012938471a2b',
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
      { id: 'f-1', documentId: 'doc-sun-land', fieldKey: 'survey_number', fieldLabel: 'Survey / Khasra Number', fieldValue: '144/2', confidence: 0.98, isManuallyCorrected: false, pageNumber: 2 },
      { id: 'f-2', documentId: 'doc-sun-land', fieldKey: 'area_acres', fieldLabel: 'Contiguous Land Area (Acres)', fieldValue: '4.85', confidence: 0.96, isManuallyCorrected: false, pageNumber: 3 },
      { id: 'f-3', documentId: 'doc-sun-land', fieldKey: 'deed_number', fieldLabel: 'Registered Deed Number', fieldValue: 'REG-BLR-2015-8891', confidence: 0.99, isManuallyCorrected: false, pageNumber: 1 },
      { id: 'f-4', documentId: 'doc-sun-land', fieldKey: 'institution_name', fieldLabel: 'Purchaser / Grantee Name', fieldValue: 'Sunrise Education Trust', confidence: 0.97, isManuallyCorrected: false, pageNumber: 1 }
    ],
    versions: [
      { id: 'v-1', documentId: 'doc-sun-land', versionNumber: 1, fileName: 'Sunrise_Registered_Land_Deed_2015.pdf', filePath: '/uploads/sunrise/land_deed.pdf', fileSize: 2450120, sha256Hash: 'a1f893e3d489b0128cf7e9124401bbcd87234918237461829374012938471a2b', uploadedAt: '2026-01-18T10:00:00Z', uploadedBy: 'Dr. Anand Kumar' }
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
    fileName: 'Sunrise_Fire_Safety_NOC_2023.pdf',
    filePath: '/uploads/sunrise/fire_noc.pdf',
    fileSize: 840200,
    mimeType: 'application/pdf',
    sha256Hash: 'c772b19284fa98012bcefa901248019284719283740192837491029384712034',
    verificationStatus: 'Expired',
    verificationSource: 'Karnataka State Fire and Emergency Services',
    forensicMetadata: {
      fileSize: 840200,
      mimeType: 'application/pdf',
      sha256Hash: 'c772b19284fa98012bcefa901248019284719283740192837491029384712034',
      pageCount: 3,
      pdfProducer: 'Kyocera Scan to PDF',
      creationDate: '2023-01-16T14:00:00Z',
      incrementalSavesDetected: false,
      metadataAnomalyDetected: false,
      tamperingConfidence: 0.05,
      anomalyIndicators: []
    },
    extractedFields: [
      { id: 'f-5', documentId: 'doc-sun-fire', fieldKey: 'certificate_number', fieldLabel: 'Fire NOC Certificate Number', fieldValue: 'FS-BLR-2023-9941', confidence: 0.95, isManuallyCorrected: false, pageNumber: 1 },
      { id: 'f-6', documentId: 'doc-sun-fire', fieldKey: 'issue_date', fieldLabel: 'Issue Date', fieldValue: '2023-01-15', confidence: 0.92, isManuallyCorrected: false, pageNumber: 1 },
      { id: 'f-7', documentId: 'doc-sun-fire', fieldKey: 'expiry_date', fieldLabel: 'Expiry Date', fieldValue: '2024-01-14', confidence: 0.94, isManuallyCorrected: false, pageNumber: 1 },
      { id: 'f-8', documentId: 'doc-sun-fire', fieldKey: 'issuing_station', fieldLabel: 'Issuing Fire Station', fieldValue: 'Sarjapur Fire Station', confidence: 0.91, isManuallyCorrected: false, pageNumber: 2 }
    ],
    versions: [
      { id: 'v-2', documentId: 'doc-sun-fire', versionNumber: 1, fileName: 'Sunrise_Fire_Safety_NOC_2023.pdf', filePath: '/uploads/sunrise/fire_noc.pdf', fileSize: 840200, sha256Hash: 'c772b19284fa98012bcefa901248019284719283740192837491029384712034', uploadedAt: '2026-01-18T10:10:00Z', uploadedBy: 'Dr. Anand Kumar' }
    ],
    createdAt: '2026-01-18T10:10:00Z',
    updatedAt: '2026-01-18T10:10:00Z'
  },
  {
    id: 'doc-sun-affidavit',
    applicationId: 'app-sunrise-001',
    institutionId: 'inst-sunrise',
    documentType: 'Affidavit',
    title: 'Statutory Composite Notarized Affidavit on Rs. 100 Stamp Paper',
    fileName: 'Sunrise_AICTE_Affidavit_2026.pdf',
    filePath: '/uploads/sunrise/affidavit.pdf',
    fileSize: 1120400,
    mimeType: 'application/pdf',
    sha256Hash: 'f490128374901823740192837401928374019283740192837401928374019283',
    verificationStatus: 'Verified',
    verificationSource: 'DigiLocker Mock Adapter',
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
      { id: 'f-9', documentId: 'doc-sun-affidavit', fieldKey: 'survey_number', fieldLabel: 'Survey Number Declared', fieldValue: '144/2', confidence: 0.96, isManuallyCorrected: false, pageNumber: 2 },
      { id: 'f-10', documentId: 'doc-sun-affidavit', fieldKey: 'institution_name', fieldLabel: 'Institution Name Declared', fieldValue: 'Sunrise Institute of Technology', confidence: 0.99, isManuallyCorrected: false, pageNumber: 1 },
      { id: 'f-11', documentId: 'doc-sun-affidavit', fieldKey: 'notary_registration_no', fieldLabel: 'Notary Bar Council Reg No', fieldValue: 'NOTARY-DL-98214', confidence: 0.62, isManuallyCorrected: false, pageNumber: 8 }, // Low confidence field!
      { id: 'f-12', documentId: 'doc-sun-affidavit', fieldKey: 'execution_date', fieldLabel: 'Affidavit Execution Date', fieldValue: '2026-01-10', confidence: 0.94, isManuallyCorrected: false, pageNumber: 8 }
    ],
    versions: [
      { id: 'v-3', documentId: 'doc-sun-affidavit', versionNumber: 1, fileName: 'Sunrise_AICTE_Affidavit_2026.pdf', filePath: '/uploads/sunrise/affidavit.pdf', fileSize: 1120400, sha256Hash: 'f490128374901823740192837401928374019283740192837401928374019283', uploadedAt: '2026-01-18T10:15:00Z', uploadedBy: 'Dr. Anand Kumar' }
    ],
    createdAt: '2026-01-18T10:15:00Z',
    updatedAt: '2026-01-18T10:15:00Z'
  },

  // Nova Engineering Documents (Anomalies + Reused faculty)
  {
    id: 'doc-nova-tampered',
    applicationId: 'app-nova-002',
    institutionId: 'inst-nova',
    documentType: 'Building Plan',
    title: 'Architectural Built-up Schedule & Structural Undertaking',
    fileName: 'nova_altered_structure_plan.pdf',
    filePath: '/uploads/nova/structure_plan.pdf',
    fileSize: 3120000,
    mimeType: 'application/pdf',
    sha256Hash: 'b982401928374019283740192837401928374019283740192837401928374019',
    verificationStatus: 'Manual Review Required',
    verificationSource: 'Document Forensics Engine',
    forensicMetadata: {
      fileSize: 3120000,
      mimeType: 'application/pdf',
      sha256Hash: 'b982401928374019283740192837401928374019283740192837401928374019',
      pageCount: 12,
      pdfProducer: 'Canva / Ghostscript 9.53 (Hex Modified)',
      pdfCreator: 'Modified with Nitro Pro v13.70',
      creationDate: '2025-06-10T08:00:00Z',
      modificationDate: '2026-02-14T03:12:00Z',
      incrementalSavesDetected: true,
      metadataAnomalyDetected: true,
      tamperingConfidence: 0.88,
      anomalyIndicators: [
        'PDF Producer header indicates post-creation editing with Canva / Nitro Pro',
        '3 incremental xref tables detected: document was edited after digital signing',
        'Embedded font subsets do not match original government seal font stream'
      ]
    },
    extractedFields: [
      { id: 'f-13', documentId: 'doc-nova-tampered', fieldKey: 'carpet_area_sqm', fieldLabel: 'Declared Carpet Area (Sqm)', fieldValue: '4200', confidence: 0.85, isManuallyCorrected: false, pageNumber: 4 },
      { id: 'f-14', documentId: 'doc-nova-tampered', fieldKey: 'survey_number', fieldLabel: 'Survey Number', fieldValue: '289/1A', confidence: 0.94, isManuallyCorrected: false, pageNumber: 1 }
    ],
    versions: [
      { id: 'v-4', documentId: 'doc-nova-tampered', versionNumber: 1, fileName: 'nova_altered_structure_plan.pdf', filePath: '/uploads/nova/structure_plan.pdf', fileSize: 3120000, sha256Hash: 'b982401928374019283740192837401928374019283740192837401928374019', uploadedAt: '2026-01-20T14:00:00Z', uploadedBy: 'Rajesh Deshmukh' }
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
    fileName: 'Malhotra_VTU_PhD_Degree.pdf',
    filePath: '/uploads/nova/fac_phd.pdf',
    fileSize: 920400,
    mimeType: 'application/pdf',
    sha256Hash: 'd382910481203948120394812039481203948120394812039481203948120394',
    verificationStatus: 'Mismatch Detected',
    verificationSource: 'Faculty Registry Mock Adapter',
    forensicMetadata: {
      fileSize: 920400,
      mimeType: 'application/pdf',
      sha256Hash: 'd382910481203948120394812039481203948120394812039481203948120394',
      pageCount: 2,
      pdfProducer: 'VTU Digital Depository Engine',
      creationDate: '2018-08-14T10:00:00Z',
      incrementalSavesDetected: false,
      metadataAnomalyDetected: false,
      tamperingConfidence: 0.15,
      anomalyIndicators: []
    },
    extractedFields: [
      { id: 'f-15', documentId: 'doc-nova-fac-reused', fieldKey: 'pan', fieldLabel: 'Faculty PAN', fieldValue: 'XYZPK9876Q', confidence: 0.99, isManuallyCorrected: false, pageNumber: 1 },
      { id: 'f-16', documentId: 'doc-nova-fac-reused', fieldKey: 'faculty_name', fieldLabel: 'Faculty Name', fieldValue: 'Dr. Vikram Malhotra', confidence: 0.98, isManuallyCorrected: false, pageNumber: 1 },
      { id: 'f-17', documentId: 'doc-nova-fac-reused', fieldKey: 'certificate_number', fieldLabel: 'Degree Registration No', fieldValue: 'VTU-PHD-MECH-4412', confidence: 0.97, isManuallyCorrected: false, pageNumber: 1 }
    ],
    versions: [
      { id: 'v-5', documentId: 'doc-nova-fac-reused', versionNumber: 1, fileName: 'Malhotra_VTU_PhD_Degree.pdf', filePath: '/uploads/nova/fac_phd.pdf', fileSize: 920400, sha256Hash: 'd382910481203948120394812039481203948120394812039481203948120394', uploadedAt: '2026-01-20T14:30:00Z', uploadedBy: 'Rajesh Deshmukh' }
    ],
    createdAt: '2026-01-20T14:30:00Z',
    updatedAt: '2026-01-20T14:30:00Z'
  },

  // Apex Polytechnic Documents (Overlapping land, duplicate cert, source unavailable)
  {
    id: 'doc-apex-land-conflict',
    applicationId: 'app-apex-003',
    institutionId: 'inst-apex',
    documentType: 'Land Deed',
    title: 'Sub-Lease & Land Demarcation Agreement',
    fileName: 'Apex_Lease_Deed_Hinjawadi.pdf',
    filePath: '/uploads/apex/lease_deed.pdf',
    fileSize: 1840000,
    mimeType: 'application/pdf',
    sha256Hash: 'e492019481029384019283049182039481029384019283049182039481029384',
    verificationStatus: 'Mismatch Detected',
    verificationSource: 'Land Records Mock Adapter',
    forensicMetadata: {
      fileSize: 1840000,
      mimeType: 'application/pdf',
      sha256Hash: 'e492019481029384019283049182039481029384019283049182039481029384',
      pageCount: 14,
      pdfProducer: 'Foxit PhantomPDF 10.1',
      creationDate: '2025-10-10T11:00:00Z',
      incrementalSavesDetected: false,
      metadataAnomalyDetected: false,
      tamperingConfidence: 0.12,
      anomalyIndicators: []
    },
    extractedFields: [
      { id: 'f-18', documentId: 'doc-apex-land-conflict', fieldKey: 'survey_number', fieldLabel: 'Survey Number', fieldValue: '289/1A', confidence: 0.98, isManuallyCorrected: false, pageNumber: 2 },
      { id: 'f-19', documentId: 'doc-apex-land-conflict', fieldKey: 'area_acres', fieldLabel: 'Leased Acreage', fieldValue: '2.1', confidence: 0.95, isManuallyCorrected: false, pageNumber: 3 },
      { id: 'f-20', documentId: 'doc-apex-land-conflict', fieldKey: 'lessor_name', fieldLabel: 'Lessor / Grantor', fieldValue: 'Apex Technical Society', confidence: 0.97, isManuallyCorrected: false, pageNumber: 1 }
    ],
    versions: [
      { id: 'v-6', documentId: 'doc-apex-land-conflict', versionNumber: 1, fileName: 'Apex_Lease_Deed_Hinjawadi.pdf', filePath: '/uploads/apex/lease_deed.pdf', fileSize: 1840000, sha256Hash: 'e492019481029384019283049182039481029384019283049182039481029384', uploadedAt: '2026-01-22T09:00:00Z', uploadedBy: 'Sanjay Deshmukh' }
    ],
    createdAt: '2026-01-22T09:00:00Z',
    updatedAt: '2026-01-22T09:00:00Z'
  },
  {
    id: 'doc-apex-dup-cert',
    applicationId: 'app-apex-003',
    institutionId: 'inst-apex',
    documentType: 'Occupancy Certificate',
    title: 'Municipal Building Occupancy Certificate',
    fileName: 'apex_duplicate_occ_cert.pdf',
    filePath: '/uploads/apex/occ_cert.pdf',
    fileSize: 1420000,
    mimeType: 'application/pdf',
    sha256Hash: 'e89c44ab012f9810293847192837401928374019283740192837401928374019',
    verificationStatus: 'Mismatch Detected',
    verificationSource: 'Certificate Registry Mock',
    forensicMetadata: {
      fileSize: 1420000,
      mimeType: 'application/pdf',
      sha256Hash: 'e89c44ab012f9810293847192837401928374019283740192837401928374019',
      pageCount: 4,
      pdfProducer: 'Ricoh Aficio MP C3002',
      creationDate: '2021-03-22T16:00:00Z',
      incrementalSavesDetected: false,
      metadataAnomalyDetected: false,
      tamperingConfidence: 0.94,
      anomalyIndicators: [
        'Exact SHA-256 duplicate of certificate filed under Western Horizon in 2021',
        'Date timestamp in binary stream older than declared institution founding date'
      ]
    },
    extractedFields: [
      { id: 'f-21', documentId: 'doc-apex-dup-cert', fieldKey: 'certificate_number', fieldLabel: 'Occupancy Sanction No', fieldValue: 'OCC-PUNE-2021-DUP-01', confidence: 0.96, isManuallyCorrected: false, pageNumber: 1 },
      { id: 'f-22', documentId: 'doc-apex-dup-cert', fieldKey: 'issuing_authority', fieldLabel: 'Issuing Body', fieldValue: 'Pune Municipal Corporation', confidence: 0.93, isManuallyCorrected: false, pageNumber: 1 }
    ],
    versions: [
      { id: 'v-7', documentId: 'doc-apex-dup-cert', versionNumber: 1, fileName: 'apex_duplicate_occ_cert.pdf', filePath: '/uploads/apex/occ_cert.pdf', fileSize: 1420000, sha256Hash: 'e89c44ab012f9810293847192837401928374019283740192837401928374019', uploadedAt: '2026-01-22T09:15:00Z', uploadedBy: 'Sanjay Deshmukh' }
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
    fileName: 'Apex_DTE_State_NOC.pdf',
    filePath: '/uploads/apex/dte_noc.pdf',
    fileSize: 760000,
    mimeType: 'application/pdf',
    sha256Hash: '9840192830491820394810293840192830491820394810293840192830491820',
    verificationStatus: 'Source Unavailable',
    verificationSource: 'DigiLocker Mock Adapter',
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
      { id: 'f-23', documentId: 'doc-apex-noc-unavailable', fieldKey: 'noc_number', fieldLabel: 'DTE NOC Reference', fieldValue: 'DTE-APEX-NOC-990', confidence: 0.91, isManuallyCorrected: false, pageNumber: 1 },
      { id: 'f-24', documentId: 'doc-apex-noc-unavailable', fieldKey: 'issuing_department', fieldLabel: 'Issuing Department', fieldValue: 'Higher & Technical Education Dept Maharashtra', confidence: 0.89, isManuallyCorrected: false, pageNumber: 1 }
    ],
    versions: [
      { id: 'v-8', documentId: 'doc-apex-noc-unavailable', versionNumber: 1, fileName: 'Apex_DTE_State_NOC.pdf', filePath: '/uploads/apex/dte_noc.pdf', fileSize: 760000, sha256Hash: '9840192830491820394810293840192830491820394810293840192830491820', uploadedAt: '2026-01-22T09:30:00Z', uploadedBy: 'Sanjay Deshmukh' }
    ],
    createdAt: '2026-01-22T09:30:00Z',
    updatedAt: '2026-01-22T09:30:00Z'
  }
];

// PRE-POPULATED ADVISORY FINDINGS
export const DEMO_FINDINGS: Finding[] = [
  // Sunrise Finding
  {
    id: 'FIND-SUN-001',
    applicationId: 'app-sunrise-001',
    documentId: 'doc-sun-fire',
    ruleId: 'FIRE-NOC-001',
    category: 'COMPLIANCE_BREACH',
    severity: 'Critical',
    confidence: 0.99,
    title: 'Fire Safety Certificate Has Expired',
    explanation: 'Clearance Certificate FS-BLR-2023-9941 issued by Sarjapur Fire Station expired on 2024-01-14. Renewal NOC not submitted.',
    evidenceLocator: 'Doc: Sunrise_Fire_Safety_NOC_2023.pdf | Field: expiry_date = 2024-01-14',
    recommendedAction: 'Upload renewed Fire Safety Certificate issued by Chief Fire Officer / District Fire Authority.',
    status: 'Clarification Requested',
    officerNotes: 'Clarification issued to institution on 2026-01-21 to upload valid renewal receipt before EVC.',
    reviewedBy: 'Smt. Priyadarshini Rao',
    reviewedAt: '2026-01-21T09:30:00Z',
    createdAt: '2026-01-20T12:00:00Z'
  },

  // Nova Findings
  {
    id: 'FIND-NOV-001',
    applicationId: 'app-nova-002',
    documentId: 'doc-nova-tampered',
    category: 'FORENSIC_ANOMALY',
    severity: 'High',
    confidence: 0.88,
    title: 'PDF Metadata Inconsistency & Post-Signature Revision Detected',
    explanation: 'Forensic analyzer detected 3 incremental cross-reference updates and producer tag "Canva / Nitro Pro". Document was modified after digital signature.',
    evidenceLocator: 'Doc: nova_altered_structure_plan.pdf | Producer: Canva / Ghostscript 9.53',
    recommendedAction: 'Mandate submission of original wet-ink signed architectural blue prints during on-site EVC inspection.',
    status: 'Confirmed by Officer',
    officerNotes: 'Flagged for surprise scrutiny. High probability of fabricated carpet area schedule.',
    reviewedBy: 'Smt. Priyadarshini Rao',
    reviewedAt: '2026-01-23T11:00:00Z',
    createdAt: '2026-01-22T16:30:00Z'
  },
  {
    id: 'FIND-NOV-002',
    applicationId: 'app-nova-002',
    ruleId: 'FACULTY-COUNT-001',
    category: 'COMPLIANCE_BREACH',
    severity: 'Critical',
    confidence: 0.98,
    title: 'Core Faculty Strength Deficit for Proposed Intake',
    explanation: 'Proposed intake of 480 students requires statutory minimum of 24 core regular faculty. Declared strength is only 22.',
    evidenceLocator: 'Application Intake: 480 | Declared Faculty: 22 | AICTE Norm: 1:20 SFR',
    recommendedAction: 'Complete recruitment of designated faculty cadre and furnish selection committee ratifications.',
    status: 'Open',
    createdAt: '2026-01-22T16:35:00Z'
  },
  {
    id: 'FIND-NOV-003',
    applicationId: 'app-nova-002',
    documentId: 'doc-nova-fac-reused',
    category: 'CROSS_INSTITUTION_COLLUSION',
    severity: 'Critical',
    confidence: 0.99,
    title: 'Cross-Institution Collusion: Faculty Reused across Institutions',
    explanation: 'Dr. Vikram Malhotra (PAN: XYZPK9876Q) declared as Full-Time Professor at Nova Engineering College is concurrently listed as Principal at Apex Polytechnic College (Application AICTE/2026/APX-1044).',
    evidenceLocator: 'PAN: XYZPK9876Q | Degree: VTU-PHD-MECH-4412 | Active in Nova & Apex',
    recommendedAction: 'Refer to AICTE Vigilance Committee and dispatch simultaneous surprise inspection to both campuses.',
    status: 'Escalated for EVC',
    officerNotes: 'High severity collusion. Dr. Malhotra must be physically interviewed with biometric verification.',
    reviewedBy: 'Smt. Priyadarshini Rao',
    reviewedAt: '2026-01-23T12:30:00Z',
    createdAt: '2026-01-22T16:40:00Z'
  },

  // Apex Findings
  {
    id: 'FIND-APX-001',
    applicationId: 'app-apex-003',
    documentId: 'doc-apex-land-conflict',
    ruleId: 'LAND-SURVEY-003',
    category: 'CROSS_INSTITUTION_COLLUSION',
    severity: 'Critical',
    confidence: 0.99,
    title: 'Severe Land Survey Conflict: Overlapping Survey No. 289/1A',
    explanation: 'Land Survey Number 289/1A in Hinjawadi Pune claimed by Apex Polytechnic (2.1 Acres) is concurrently claimed by Nova Engineering College (3.2 Acres). Total physical parcel is only 3.2 acres.',
    evidenceLocator: 'Survey: 289/1A Hinjawadi Pune | Overlapping in AICTE/2026/NOV-9014 & AICTE/2026/APX-1044',
    recommendedAction: 'Order District Revenue Collector verification to survey physical boundaries and verify title deeds.',
    status: 'Escalated for EVC',
    officerNotes: 'Clear double-pledging of educational land parcel between two related institutions.',
    reviewedBy: 'Smt. Priyadarshini Rao',
    reviewedAt: '2026-01-26T09:30:00Z',
    createdAt: '2026-01-25T11:00:00Z'
  },
  {
    id: 'FIND-APX-002',
    applicationId: 'app-apex-003',
    documentId: 'doc-apex-dup-cert',
    category: 'FORENSIC_ANOMALY',
    severity: 'Critical',
    confidence: 0.94,
    title: 'Duplicate Occupancy Certificate Reused from Prior Approval',
    explanation: 'Municipal Occupancy Certificate OCC-PUNE-2021-DUP-01 is an exact SHA-256 duplicate of a certificate previously issued to Western Horizon School in 2021.',
    evidenceLocator: 'SHA256: e89c44ab012f9810293847192837401928374019283740192837401928374019',
    recommendedAction: 'Issue immediate Show-Cause notice under AICTE Approval Process Handbook Regulations Clause 4.1.',
    status: 'Confirmed by Officer',
    officerNotes: 'Blatant document recycling. Officer confirmed adverse finding.',
    reviewedBy: 'Smt. Priyadarshini Rao',
    reviewedAt: '2026-01-26T10:00:00Z',
    createdAt: '2026-01-25T11:15:00Z'
  },
  {
    id: 'FIND-APX-003',
    applicationId: 'app-apex-003',
    documentId: 'doc-apex-noc-unavailable',
    category: 'VERIFICATION_MISMATCH',
    severity: 'High',
    confidence: 0.85,
    title: 'Fail-Closed: State DTE NOC Verification Source Unavailable',
    explanation: 'State Technical Education gateway timed out during automated handshake. Under fail-closed protocol, document is NOT marked verified.',
    evidenceLocator: 'Doc: Apex_DTE_State_NOC.pdf | DTE Reference: DTE-APEX-NOC-990',
    recommendedAction: 'Officer must issue manual letter to Maharashtra DTE or inspect physical NOC register.',
    status: 'Open',
    createdAt: '2026-01-25T11:30:00Z'
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
    afterSummary: 'Uploaded Sunrise_Registered_Land_Deed_2015.pdf (SHA: a1f893e3d...)',
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
    actorRole: 'ADMIN',
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
    actorRole: 'ADMIN',
    action: 'VERIFICATION_ATTEMPT',
    entityType: 'ADAPTER',
    entityId: 'doc-sun-fire',
    beforeSummary: 'Status: Not Verified',
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
  }
];

// Initialize Audit Chain in Memory
AuditTrailEngine.seedInitialEvents(INITIAL_AUDIT_EVENTS);

// Master Data Repository Store class
export class DataStore {
  private static users = [...DEMO_USERS];
  private static institutions = [...DEMO_INSTITUTIONS];
  private static applications = [...DEMO_APPLICATIONS];
  private static documents = [...DEMO_DOCUMENTS];
  private static findings = [...DEMO_FINDINGS];
  private static inspectionTasks = [...DEMO_INSPECTION_TASKS];
  private static officerActions: OfficerActionRecord[] = [];

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
    this.users.push(user);
    AuditTrailEngine.recordEvent({
      actorId: user.id,
      actorName: user.name,
      actorRole: user.role,
      action: 'USER_REGISTERED',
      entityType: 'AUTH',
      entityId: user.id,
      afterSummary: `User registered ${user.name} with role ${user.role}`
    });
    return user;
  }

  // INSTITUTIONS
  static getInstitutions(): Institution[] {
    return this.institutions;
  }

  static getInstitutionById(id: string): Institution | undefined {
    return this.institutions.find(i => i.id === id);
  }

  // APPLICATIONS
  static getApplications(): Application[] {
    return this.applications;
  }

  static getApplicationById(id: string): Application | undefined {
    return this.applications.find(a => a.id === id);
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
    const app = this.getApplicationById(id);
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

    return app;
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

  static updateDocumentStatus(id: string, status: DocumentRecord['verificationStatus'], source?: string): DocumentRecord | undefined {
    const doc = this.getDocumentById(id);
    if (!doc) return undefined;
    doc.verificationStatus = status;
    if (source) doc.verificationSource = source;
    doc.updatedAt = new Date().toISOString();
    return doc;
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

  // FINDINGS
  static getFindings(applicationId?: string): Finding[] {
    if (applicationId) {
      return this.findings.filter(f => f.applicationId === applicationId);
    }
    return this.findings;
  }

  static getFindingById(id: string): Finding | undefined {
    return this.findings.find(f => f.id === id);
  }

  static updateFindingStatus(id: string, status: Finding['status'], officerNotes?: string, officerName?: string): Finding | undefined {
    const finding = this.getFindingById(id);
    if (!finding) return undefined;
    const prevStatus = finding.status;
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

  // OFFICER ACTIONS
  static addOfficerAction(action: OfficerActionRecord): void {
    this.officerActions.push(action);
  }

  static getOfficerActions(applicationId: string): OfficerActionRecord[] {
    return this.officerActions.filter(a => a.applicationId === applicationId);
  }
}
