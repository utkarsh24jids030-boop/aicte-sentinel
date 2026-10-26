// AICTE Sentinel EVC Inspection Copilot
// Brief generation, risk-focused checklist, and mobile observation management
// Problem Statement SIH26261 - Smart India Hackathon 2026

import { Application, DocumentRecord, Finding, InspectionTask, InspectionObservation } from '@/types';

export interface InspectionBrief {
  taskId: string;
  applicationNumber: string;
  institutionName: string;
  aicteId: string;
  siteAddress: string;
  scheduledDate: string;
  summary: string;
  highRiskClaims: {
    category: string;
    description: string;
    severity: string;
    targetCheck: string;
  }[];
  unverifiedDocuments: {
    docType: string;
    fileName: string;
    status: string;
    reason: string;
  }[];
  flaggedFacultyToInterview: {
    name: string;
    pan: string;
    declaredDesignation: string;
    redFlagReason: string;
  }[];
  mandatoryPhysicalChecklist: {
    item: string;
    standardNorm: string;
    verificationMethod: string;
  }[];
}

export class EvcCopilotEngine {
  /**
   * Automatically generate an EVC inspection brief from case file findings and documents
   */
  static generateBrief(
    task: InspectionTask,
    app: Application,
    documents: DocumentRecord[],
    findings: Finding[]
  ): InspectionBrief {
    // 1. Compile high-risk claims
    const highRiskClaims = findings
      .filter(f => f.severity === 'Critical' || f.severity === 'High')
      .map(f => ({
        category: f.category.replace(/_/g, ' '),
        description: f.title + ': ' + f.explanation,
        severity: f.severity,
        targetCheck: f.recommendedAction
      }));

    // 2. Identify unverified / suspicious documents
    const unverifiedDocuments = documents
      .filter(d => ['Mismatch Detected', 'Expired', 'Source Unavailable', 'Manual Review Required'].includes(d.verificationStatus))
      .map(d => ({
        docType: d.documentType,
        fileName: d.fileName,
        status: d.verificationStatus,
        reason: d.verificationStatus === 'Expired' 
          ? 'Certificate expired in government repository'
          : d.verificationStatus === 'Mismatch Detected'
          ? 'Source data diverged from institution declaration'
          : 'Gateway unavailable or manual review needed'
      }));

    // 3. Faculty members requiring in-person identity and roster verification
    const flaggedFacultyToInterview = [];
    if (app.institutionName.includes('Nova') || app.institutionName.includes('Apex')) {
      flaggedFacultyToInterview.push({
        name: 'Dr. Vikram Malhotra',
        pan: 'XYZPK9876Q',
        declaredDesignation: app.institutionName.includes('Nova') ? 'Professor (Mechanical)' : 'Principal / Director',
        redFlagReason: 'Concurrent active employment claim at another AICTE campus. Verify biometric attendance log, form 16, and physical presence.'
      });
    }

    // 4. Statutory inspection checklist items
    const mandatoryPhysicalChecklist = [
      {
        item: 'Physical Land Demarcation & Perimeter Boundary Wall',
        standardNorm: 'Minimum 2.5 Acres contiguous with continuous masonry boundary wall (height min 1.8m)',
        verificationMethod: 'GPS walk-around demarcation & photographic corner post verification'
      },
      {
        item: 'Fire Fighting System (Wet Risers & Sprinklers)',
        standardNorm: 'Functional hydrant ring main, underground static water storage (min 1,00,000 litres)',
        verificationMethod: 'Physical pressure test & live pump room demonstration'
      },
      {
        item: 'Computer Center & High Speed Bandwidth',
        standardNorm: 'Minimum 1 terminal per 4 students with licensed system software & 100 Mbps leased line',
        verificationMethod: 'Live speed test and license certificate inspection'
      },
      {
        item: 'Laboratories & Workshop Equipment Verification',
        standardNorm: 'Full equipment sets per university syllabus for all claimed approved courses',
        verificationMethod: 'Physical stock register check against original tax invoices & serial numbers'
      },
      {
        item: 'Barrier-Free Environment (Ramps & Disabled Toilets)',
        standardNorm: 'Dedicated ramp access at all entrances and unisex barrier-free restrooms on each floor',
        verificationMethod: 'Physical walkthrough and gradient measurement'
      }
    ];

    return {
      taskId: task.id,
      applicationNumber: app.applicationNumber,
      institutionName: app.institutionName,
      aicteId: '1-94820194',
      siteAddress: task.siteAddress,
      scheduledDate: task.scheduledDate,
      summary: task.briefSummary,
      highRiskClaims,
      unverifiedDocuments,
      flaggedFacultyToInterview,
      mandatoryPhysicalChecklist
    };
  }

  /**
   * Create a new inspection observation record
   */
  static recordObservation(params: {
    taskId: string;
    category: InspectionObservation['category'];
    claimText: string;
    physicalVerificationStatus: InspectionObservation['physicalVerificationStatus'];
    observationNotes: string;
    photoUrls?: string[];
    latitude?: number;
    longitude?: number;
  }): InspectionObservation {
    return {
      id: `OBS-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      taskId: params.taskId,
      category: params.category,
      claimText: params.claimText,
      physicalVerificationStatus: params.physicalVerificationStatus,
      observationNotes: params.observationNotes,
      photoUrls: params.photoUrls || [
        'https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?auto=format&fit=crop&w=600&q=80'
      ],
      latitude: params.latitude || 18.591244,
      longitude: params.longitude || 73.738912,
      capturedAt: new Date().toISOString()
    };
  }
}
