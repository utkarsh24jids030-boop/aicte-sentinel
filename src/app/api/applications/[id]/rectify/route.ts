import { NextRequest, NextResponse } from 'next/server';
import { DataStore } from '@/lib/store';
import { RulesEngine } from '@/lib/rules/engine';
import { AuditTrailEngine } from '@/lib/audit/trail';
import { DocumentVersion } from '@/types';
import crypto from 'crypto';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const app = DataStore.getApplicationById(id);

    if (!app) {
      return NextResponse.json(
        { error: `Application "${id}" not found.` },
        { status: 404 }
      );
    }

    const body = await request.json();
    const { ruleId, explanation, documentType, replacementFileName } = body;

    if (!explanation || typeof explanation !== 'string' || explanation.trim().length === 0) {
      return NextResponse.json(
        { error: 'An explanation is required to rectify a statutory deficiency.' },
        { status: 400 }
      );
    }

    const targetDocType = documentType || 'Fire Safety Certificate';
    const documents = DataStore.getDocuments(id);
    let doc = documents.find(d => d.documentType === targetDocType);

    const instRecord = DataStore.getInstitutionalRecord(app.institutionId);
    const beforeBreakdown = RulesEngine.evaluateApplication(
      app,
      documents,
      DataStore.getApplications(),
      documents,
      DataStore.getInstitutions(),
      instRecord
    ).breakdown;

    const beforeStatus = doc ? doc.verificationStatus : 'Missing Document';
    const beforeReadiness = beforeBreakdown.score;
    const newVersionNumber = doc ? (doc.versions?.length || 1) + 1 : 1;

    // Generate replacement cryptographic hash
    const replacementHash = crypto
      .createHash('sha256')
      .update(`${id}-${targetDocType}-${Date.now()}-${explanation}`)
      .digest('hex');

    const fileName = replacementFileName || `${targetDocType.replace(/\s+/g, '_')}_Rectified_v${newVersionNumber}.pdf`;

    if (doc) {
      // Archive current version into history
      const archivedVersion: DocumentVersion = {
        id: `ver-${doc.id}-${doc.versions.length + 1}`,
        documentId: doc.id,
        versionNumber: doc.versions.length + 1,
        fileName: doc.fileName,
        filePath: doc.filePath,
        fileSize: doc.fileSize,
        sha256Hash: doc.sha256Hash,
        uploadedAt: doc.updatedAt || doc.createdAt,
        uploadedBy: 'Dr. Anand Kumar (Authorized Representative)',
        changeNote: `Superseded by rectification v${newVersionNumber}`
      };

      if (!doc.versions) {
        doc.versions = [];
      }
      doc.versions.push(archivedVersion);

      // Update current document with replacement artifact
      doc.fileName = fileName;
      doc.sha256Hash = replacementHash;
      doc.verificationStatus = 'Verification Pending';
      doc.updatedAt = new Date().toISOString();
      doc.fileSize = 1024 * 420; // 420 KB
    } else {
      // Create new document record if it was previously missing
      doc = {
        id: `doc-${app.id.substring(4, 7)}-${Date.now()}`,
        applicationId: app.id,
        institutionId: app.institutionId,
        documentType: targetDocType,
        title: `${targetDocType} (Rectified Submission)`,
        fileName,
        filePath: `/uploads/${app.id}/${fileName}`,
        fileSize: 1024 * 420,
        mimeType: 'application/pdf',
        sha256Hash: replacementHash,
        verificationStatus: 'Verification Pending',
        forensicMetadata: {
          fileSize: 1024 * 420,
          mimeType: 'application/pdf',
          sha256Hash: replacementHash,
          pageCount: 3,
          incrementalSavesDetected: false,
          metadataAnomalyDetected: false,
          tamperingConfidence: 0.05,
          anomalyIndicators: []
        },
        extractedFields: [],
        versions: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      DataStore.addDocument(doc);
    }

    // Update application state
    app.status = 'Resubmitted';
    app.updatedAt = new Date().toISOString();

    // Re-run validation rules engine
    const updatedDocs = DataStore.getDocuments(id);
    const afterEvaluation = RulesEngine.evaluateApplication(
      app,
      updatedDocs,
      DataStore.getApplications(),
      updatedDocs,
      DataStore.getInstitutions(),
      instRecord
    );

    const afterStatus = doc.verificationStatus;
    const afterReadiness = afterEvaluation.breakdown.score;

    // Log complete step in tamper-evident audit trail
    AuditTrailEngine.recordEvent({
      actorId: 'user-inst-sunrise',
      actorName: 'Dr. Anand Kumar',
      actorRole: 'INSTITUTION',
      action: 'DEFICIENCY_RECTIFICATION_SUBMITTED',
      entityType: 'APPLICATION',
      entityId: app.id,
      beforeSummary: `Before: Status ${app.status}, ${targetDocType} status: ${beforeStatus}, Readiness Score: ${beforeReadiness}/100.`,
      afterSummary: `After: Replacement uploaded "${fileName}" (v${newVersionNumber}, Hash: ${replacementHash.substring(0, 12)}...). Status: Verification Pending, Re-evaluated Readiness Score: ${afterReadiness}/100. Explanation: "${explanation}".`
    });

    return NextResponse.json({
      success: true,
      message: 'Rectification successfully submitted. Validation rules re-executed.',
      beforeAfter: {
        beforeStatus,
        afterStatus,
        beforeReadiness,
        afterReadiness
      },
      document: doc,
      readiness: afterEvaluation.breakdown,
      ruleFindings: afterEvaluation.ruleFindings
    });
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : 'Unknown rectification error';
    return NextResponse.json({ error: errMessage }, { status: 500 });
  }
}
