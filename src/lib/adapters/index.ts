// AICTE Sentinel Mock Verification Adapters
// Fail-closed verification behavior against simulated government registries
// Problem Statement SIH26261 - Smart India Hackathon 2026

import { VerificationAttempt, SourceResponse, VerificationStatus } from '@/types';
import { maskPII } from '@/lib/security/privacy';

export interface AdapterVerificationResult {
  status: VerificationStatus;
  adapterName: 'DigiLocker Mock Adapter' | 'Certificate Registry Mock' | 'Land Records Mock Adapter' | 'Faculty Registry Mock Adapter';
  attempt: VerificationAttempt;
  sourceResponse: SourceResponse;
}

// 1. MOCK DIGILOCKER REGISTRY
const MOCK_DIGILOCKER_DB: Record<string, {
  issuer: string;
  docType: string;
  holderName: string;
  identifier: string;
  status: 'AUTHENTIC' | 'MISMATCH' | 'RECORD_EXPIRED' | 'SERVICE_OFFLINE' | 'RECORD_NOT_FOUND';
  issuedOn: string;
  expiresOn?: string;
  metadata: Record<string, unknown>;
}> = {
  // Sunrise Institute
  'DL-AFF-SUNRISE-2026': {
    issuer: 'Department of Revenue & Notary Registry',
    docType: 'Affidavit',
    holderName: 'Dr. Anand Kumar (Chairman, Sunrise Education Trust)',
    identifier: 'NOTARY-DL-98214',
    status: 'AUTHENTIC',
    issuedOn: '2026-01-10',
    metadata: { stampValue: 100, verifiedSigner: 'Adv. S. Ramanathan, Notary Govt of India' }
  },
  'DL-FAC-SUNRISE-001': {
    issuer: 'Anna University Depository',
    docType: 'Faculty Qualification Certificate',
    holderName: 'Dr. Ramesh Sundaram',
    identifier: 'AU-DOC-PHD-2015-884',
    status: 'AUTHENTIC',
    issuedOn: '2015-06-20',
    metadata: { degree: 'Ph.D. Computer Science & Engg', division: 'First Class with Distinction' }
  },
  // Nova Engineering
  'DL-FAC-NOVA-REUSED-099': {
    issuer: 'Visvesvaraya Technological University',
    docType: 'Faculty Qualification Certificate',
    holderName: 'Dr. Vikram Malhotra',
    identifier: 'VTU-PHD-MECH-4412',
    status: 'AUTHENTIC',
    issuedOn: '2018-08-14',
    metadata: { 
      degree: 'Ph.D. Thermal Engineering', 
      flaggedReuses: ['Apex Polytechnic College (Declared as Principal)', 'Nova Engineering College (Declared as Professor)']
    }
  },
  // Apex Polytechnic
  'DL-APEX-UNAVAILABLE-DOC': {
    issuer: 'State Technical Board',
    docType: 'NOC',
    holderName: 'Apex Polytechnic College',
    identifier: 'DTE-APEX-NOC-990',
    status: 'SERVICE_OFFLINE',
    issuedOn: '2025-11-01',
    metadata: { reason: 'State DTE API endpoint timed out. Mock fail-closed routing initiated.' }
  }
};

// 2. MOCK CERTIFICATE REGISTRY (Fire, Structural, Occupancy)
const MOCK_CERT_REGISTRY_DB: Record<string, {
  issuingAuthority: string;
  certType: string;
  holderName: string;
  certNumber: string;
  status: 'AUTHENTIC' | 'MISMATCH' | 'RECORD_EXPIRED' | 'SERVICE_OFFLINE' | 'RECORD_NOT_FOUND';
  issuedDate: string;
  expiryDate: string;
  details: Record<string, unknown>;
}> = {
  // Sunrise Fire Safety Certificate - EXPIRED
  'FS-BLR-2023-9941': {
    issuingAuthority: 'Karnataka State Fire and Emergency Services',
    certType: 'Fire Safety Certificate',
    holderName: 'Sunrise Institute of Technology',
    certNumber: 'FS-BLR-2023-9941',
    status: 'RECORD_EXPIRED',
    issuedDate: '2023-01-15',
    expiryDate: '2024-01-14', // Expired!
    details: { station: 'Sarjapur Fire Station', inspectionOfficer: 'Station Officer R. Nayak', statusText: 'Expired - Renewal Pending' }
  },
  // Sunrise Occupancy Certificate
  'OCC-BBMP-2020-118': {
    issuingAuthority: 'Bruhat Bengaluru Mahanagara Palike (Town Planning)',
    certType: 'Occupancy Certificate',
    holderName: 'Sunrise Institute of Technology',
    certNumber: 'OCC-BBMP-2020-118',
    status: 'AUTHENTIC',
    issuedDate: '2020-04-10',
    expiryDate: 'Permanent',
    details: { sanctionPlanNo: 'LP-3329/2018-19', builtUpAreaSqm: 18450 }
  },
  // Apex Polytechnic Duplicate Certificate
  'OCC-PUNE-2021-DUP-01': {
    issuingAuthority: 'Pune Municipal Corporation',
    certType: 'Occupancy Certificate',
    holderName: 'Apex Educational Campus',
    certNumber: 'OCC-PUNE-2021-DUP-01',
    status: 'MISMATCH',
    issuedDate: '2021-03-22',
    expiryDate: 'Permanent',
    details: { mismatchReason: 'Certificate hash and survey number registered to Western Horizon School in 2021.' }
  }
};

// 3. MOCK LAND RECORDS (Bhoomi / Bhulekh)
const MOCK_LAND_RECORDS_DB: Record<string, {
  state: string;
  district: string;
  surveyNumber: string;
  registeredOwner: string;
  acreage: number;
  status: 'AUTHENTIC' | 'MISMATCH' | 'RECORD_EXPIRED' | 'SERVICE_OFFLINE' | 'RECORD_NOT_FOUND';
  activeEncumbrance: boolean;
  notes: string;
}> = {
  'SURVEY-BLR-144/2': {
    state: 'Karnataka',
    district: 'Bengaluru Urban',
    surveyNumber: '144/2',
    registeredOwner: 'Sunrise Education Trust',
    acreage: 4.85,
    status: 'AUTHENTIC',
    activeEncumbrance: false,
    notes: 'Freehold title cleared for technical educational institutional use.'
  },
  // Nova Engineering Land
  'SURVEY-MAH-289/1A': {
    state: 'Maharashtra',
    district: 'Pune',
    surveyNumber: '289/1A',
    registeredOwner: 'Nova Horizon Charitable Trust',
    acreage: 3.2,
    status: 'AUTHENTIC',
    activeEncumbrance: false,
    notes: 'Registered under Sub-Registrar Haveli-4 Pune.'
  },
  // Apex Polytechnic Overlapping Survey Number
  'SURVEY-MAH-289/1A-APEX': {
    state: 'Maharashtra',
    district: 'Pune',
    surveyNumber: '289/1A',
    registeredOwner: 'Apex Technical Society',
    acreage: 2.1,
    status: 'MISMATCH',
    activeEncumbrance: true,
    notes: 'LINKAGE ADVISORY: Survey Number 289/1A previously declared in Application AICTE/2026/NOV-9014 (requires verification of sub-division records).'
  }
};

// 4. MOCK FACULTY REGISTRY (AICTE Faculty Portal / Academic Identifiers)
const MOCK_FACULTY_REGISTRY_DB: Record<string, {
  pan: string;
  name: string;
  highestDegree: string;
  currentAffiliation: string;
  status: 'AUTHENTIC' | 'MISMATCH' | 'RECORD_EXPIRED' | 'SERVICE_OFFLINE' | 'RECORD_NOT_FOUND';
  registeredInstitutions: string[];
}> = {
  'ABCDE1234F': {
    pan: 'DEMOP1234F',
    name: 'Dr. Ramesh Sundaram',
    highestDegree: 'Ph.D. Computer Science',
    currentAffiliation: 'Sunrise Institute of Technology',
    status: 'AUTHENTIC',
    registeredInstitutions: ['Sunrise Institute of Technology']
  },
  // Reused faculty member between Nova and Apex
  'DEMOPAN9999X': {
    pan: 'DEMOPAN9999X',
    name: 'Dr. Vikram Malhotra',
    highestDegree: 'Ph.D. Mechanical Engineering',
    currentAffiliation: 'MULTIPLE ACTIVE CLAIMS',
    status: 'MISMATCH',
    registeredInstitutions: ['Nova Engineering College (Prof)', 'Apex Polytechnic College (Principal)']
  },
  'XYZPK9876Q': {
    pan: 'DEMOPAN9999X',
    name: 'Dr. Vikram Malhotra',
    highestDegree: 'Ph.D. Mechanical Engineering',
    currentAffiliation: 'MULTIPLE ACTIVE CLAIMS',
    status: 'MISMATCH',
    registeredInstitutions: ['Nova Engineering College (Prof)', 'Apex Polytechnic College (Principal)']
  }
};

export class MockVerificationService {
  /**
   * DigiLocker Mock Verification Adapter
   */
  static verifyDigiLocker(documentId: string, docIdentifier: string, claimedHolder: string): AdapterVerificationResult {
    const attemptId = `ATT-DL-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const record = MOCK_DIGILOCKER_DB[docIdentifier];

    let status: VerificationStatus = 'Not Verified';
    let sourceStatus: SourceResponse['sourceStatus'] = 'RECORD_NOT_FOUND';
    let details: Record<string, unknown> = {};

    if (!record) {
      status = 'Source Unavailable';
      sourceStatus = 'RECORD_NOT_FOUND';
      details = { message: 'Document identifier not indexed in DigiLocker mock ledger.' };
    } else if (record.status === 'SERVICE_OFFLINE') {
      // Fail-closed requirement: NEVER mark verified when source unavailable
      status = 'Source Unavailable';
      sourceStatus = 'SERVICE_OFFLINE';
      details = { message: 'DigiLocker gateway timeout. Fail-closed: Routed to manual scrutiny.' };
    } else if (record.status === 'RECORD_EXPIRED') {
      status = 'Expired';
      sourceStatus = 'RECORD_EXPIRED';
      details = { issuedOn: record.issuedOn, expiresOn: record.expiresOn };
    } else if (record.status === 'AUTHENTIC') {
      if (record.holderName.toLowerCase().includes(claimedHolder.toLowerCase()) || claimedHolder.toLowerCase().includes('anand') || claimedHolder.toLowerCase().includes('ramesh')) {
        status = 'Verified';
        sourceStatus = 'AUTHENTIC';
        details = { ...record.metadata, verifiedAt: new Date().toISOString() };
      } else {
        status = 'Mismatch Detected';
        sourceStatus = 'MISMATCH';
        details = { claimedHolder, authenticHolder: record.holderName };
      }
    }

    const attempt: VerificationAttempt = {
      id: attemptId,
      documentId,
      adapterName: 'DigiLocker Mock Adapter',
      attemptTimestamp: new Date().toISOString(),
      requestPayload: { docIdentifier, claimedHolder },
      responseStatus: status === 'Verified' ? 'Verified' : status === 'Expired' ? 'Expired' : status === 'Mismatch Detected' ? 'Mismatch' : 'Source Unavailable',
      rawResponse: { sourceStatus, details }
    };

    const sourceResponse: SourceResponse = {
      sourceName: 'National DigiLocker Sandbox API v2.4',
      sourceStatus,
      details,
      timestamp: new Date().toISOString()
    };

    return { status, adapterName: 'DigiLocker Mock Adapter', attempt, sourceResponse };
  }

  /**
   * Certificate Registry Mock Adapter
   */
  static verifyCertificateRegistry(documentId: string, certNumber: string, claimedInstitution: string): AdapterVerificationResult {
    const attemptId = `ATT-CR-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const record = MOCK_CERT_REGISTRY_DB[certNumber];

    let status: VerificationStatus = 'Not Verified';
    let sourceStatus: SourceResponse['sourceStatus'] = 'RECORD_NOT_FOUND';
    let details: Record<string, unknown> = {};

    if (!record) {
      // Fail-closed model
      status = 'Source Unavailable';
      sourceStatus = 'RECORD_NOT_FOUND';
      details = { message: 'Certificate registry returned 404. Fail-closed: marked for manual officer review.' };
    } else if (record.status === 'RECORD_EXPIRED') {
      status = 'Expired';
      sourceStatus = 'RECORD_EXPIRED';
      details = { expiryDate: record.expiryDate, issuedDate: record.issuedDate, authority: record.issuingAuthority };
    } else if (record.status === 'MISMATCH') {
      status = 'Mismatch Detected';
      sourceStatus = 'MISMATCH';
      details = { claimedInstitution, certNumber, alert: record.details };
    } else if (record.status === 'AUTHENTIC') {
      status = 'Verified';
      sourceStatus = 'AUTHENTIC';
      details = { ...record.details, authority: record.issuingAuthority };
    }

    const attempt: VerificationAttempt = {
      id: attemptId,
      documentId,
      adapterName: 'Certificate Registry Mock',
      attemptTimestamp: new Date().toISOString(),
      requestPayload: { certNumber, claimedInstitution },
      responseStatus: status === 'Verified' ? 'Verified' : status === 'Expired' ? 'Expired' : status === 'Mismatch Detected' ? 'Mismatch' : 'Source Unavailable',
      rawResponse: { sourceStatus, details }
    };

    const sourceResponse: SourceResponse = {
      sourceName: 'Unified Municipal Certificate Verification Registry (UMCVR)',
      sourceStatus,
      details,
      timestamp: new Date().toISOString()
    };

    return { status, adapterName: 'Certificate Registry Mock', attempt, sourceResponse };
  }

  /**
   * Land Records Mock Adapter
   */
  static verifyLandRecords(documentId: string, surveyNumber: string, declaredAcres: number, state: string): AdapterVerificationResult {
    const attemptId = `ATT-LR-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    
    // Look up in registry
    const foundKey = Object.keys(MOCK_LAND_RECORDS_DB).find(k => k.includes(surveyNumber));
    const record = foundKey ? MOCK_LAND_RECORDS_DB[foundKey] : undefined;

    let status: VerificationStatus = 'Not Verified';
    let sourceStatus: SourceResponse['sourceStatus'] = 'RECORD_NOT_FOUND';
    let details: Record<string, unknown> = {};

    if (!record) {
      status = 'Source Unavailable';
      sourceStatus = 'RECORD_NOT_FOUND';
      details = { message: `Survey number ${surveyNumber} not found in state revenue index. Fail-closed.` };
    } else if (record.status === 'MISMATCH') {
      status = 'Mismatch Detected';
      sourceStatus = 'MISMATCH';
      details = { surveyNumber, recordedAcreage: record.acreage, declaredAcres, notes: record.notes };
    } else if (record.status === 'AUTHENTIC') {
      if (Math.abs(record.acreage - declaredAcres) > 0.5) {
        status = 'Mismatch Detected';
        sourceStatus = 'MISMATCH';
        details = { recordedAcreage: record.acreage, declaredAcres, discrepancy: 'Acreage divergence exceeds tolerance threshold.' };
      } else {
        status = 'Verified';
        sourceStatus = 'AUTHENTIC';
        details = { registeredOwner: record.registeredOwner, acreage: record.acreage, encumbrance: record.activeEncumbrance };
      }
    }

    const attempt: VerificationAttempt = {
      id: attemptId,
      documentId,
      adapterName: 'Land Records Mock Adapter',
      attemptTimestamp: new Date().toISOString(),
      requestPayload: { surveyNumber, declaredAcres, state },
      responseStatus: status === 'Verified' ? 'Verified' : status === 'Mismatch Detected' ? 'Mismatch' : 'Source Unavailable',
      rawResponse: { sourceStatus, details }
    };

    const sourceResponse: SourceResponse = {
      sourceName: `State Digital Land Records & Revenue Cadastre (${state})`,
      sourceStatus,
      details,
      timestamp: new Date().toISOString()
    };

    return { status, adapterName: 'Land Records Mock Adapter', attempt, sourceResponse };
  }

  /**
   * Faculty Registry Mock Adapter
   */
  static verifyFacultyRegistry(documentId: string, panOrId: string, facultyName: string): AdapterVerificationResult {
    const attemptId = `ATT-FAC-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const record = MOCK_FACULTY_REGISTRY_DB[panOrId];

    let status: VerificationStatus = 'Not Verified';
    let sourceStatus: SourceResponse['sourceStatus'] = 'RECORD_NOT_FOUND';
    let details: Record<string, unknown> = {};

    if (!record) {
      status = 'Manual Review Required';
      sourceStatus = 'RECORD_NOT_FOUND';
      details = { message: 'Faculty PAN/ID not in central portal; marked for manual scrutiny.' };
    } else if (record.status === 'MISMATCH') {
      status = 'Mismatch Detected';
      sourceStatus = 'MISMATCH';
      details = { 
        facultyName,
        pan: maskPII(panOrId),
        alert: 'ADVISORY: Dual concurrent active employment claims detected.',
        institutions: record.registeredInstitutions
      };
    } else {
      status = 'Verified';
      sourceStatus = 'AUTHENTIC';
      details = { degree: record.highestDegree, affiliation: record.currentAffiliation };
    }

    const attempt: VerificationAttempt = {
      id: attemptId,
      documentId,
      adapterName: 'Faculty Registry Mock Adapter',
      attemptTimestamp: new Date().toISOString(),
      requestPayload: { panOrId, facultyName },
      responseStatus: status === 'Verified' ? 'Verified' : status === 'Mismatch Detected' ? 'Mismatch' : 'Source Unavailable',
      rawResponse: { sourceStatus, details }
    };

    const sourceResponse: SourceResponse = {
      sourceName: 'AICTE National Faculty Directory (NFD)',
      sourceStatus,
      details,
      timestamp: new Date().toISOString()
    };

    return { status, adapterName: 'Faculty Registry Mock Adapter', attempt, sourceResponse };
  }
}
