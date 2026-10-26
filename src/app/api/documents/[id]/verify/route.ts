import { NextResponse } from 'next/server';
import { DataStore } from '@/lib/store';
import { MockVerificationService } from '@/lib/adapters';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const doc = DataStore.getDocumentById(id);
    if (!doc) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 });
    }

    const app = DataStore.getApplicationById(doc.applicationId);
    const institutionName = app?.institutionName || 'Sunrise Institute of Technology';

    let result;

    if (doc.documentType === 'Land Deed') {
      const surveyField = doc.extractedFields.find(f => f.fieldKey === 'survey_number')?.fieldValue || '144/2';
      const acres = parseFloat(doc.extractedFields.find(f => f.fieldKey === 'area_acres')?.fieldValue || '4.85');
      result = MockVerificationService.verifyLandRecords(id, surveyField, acres, 'Karnataka');
    } else if (doc.documentType === 'Fire Safety Certificate' || doc.documentType === 'Occupancy Certificate') {
      const certNo = doc.extractedFields.find(f => f.fieldKey === 'certificate_number')?.fieldValue || 'FS-BLR-2023-9941';
      result = MockVerificationService.verifyCertificateRegistry(id, certNo, institutionName);
    } else if (doc.documentType === 'Faculty Qualification Certificate') {
      const pan = doc.extractedFields.find(f => f.fieldKey === 'pan')?.fieldValue || 'ABCDE1234F';
      const name = doc.extractedFields.find(f => f.fieldKey === 'faculty_name')?.fieldValue || 'Dr. Ramesh Sundaram';
      result = MockVerificationService.verifyFacultyRegistry(id, pan, name);
    } else if (doc.documentType === 'NOC') {
      const nocNo = doc.extractedFields.find(f => f.fieldKey === 'noc_number')?.fieldValue || 'DTE-APEX-NOC-990';
      const inst = app ? DataStore.getInstitutionById(app.institutionId) : undefined;
      result = MockVerificationService.verifyStateDTE(id, nocNo, inst?.state || 'Maharashtra', institutionName);
    } else {
      // DigiLocker default
      const identifier = doc.extractedFields.find(f => f.fieldKey === 'notary_registration_no')?.fieldValue || 'DL-AFF-SUNRISE-2026';
      result = MockVerificationService.verifyDigiLocker(id, identifier, institutionName);
    }

    // Update document status & record verification attempt
    DataStore.updateDocumentStatus(id, result.status, result.adapterName, result.attempt);

    // Record audit event in cryptographic hash-chain
    const { AuditTrailEngine } = await import('@/lib/audit/trail');
    AuditTrailEngine.recordEvent({
      actorId: 'system-adapter-worker',
      actorName: `${result.adapterName} (Simulated)`,
      actorRole: 'SYSTEM',
      action: 'VERIFICATION_ATTEMPT',
      entityType: 'ADAPTER',
      entityId: id,
      beforeSummary: `Document verification status was "${doc.verificationStatus}"`,
      afterSummary: `Adapter returned ${result.status} (Source: ${result.sourceResponse.sourceStatus}). Attempt ID: ${result.attempt.id}`
    });

    return NextResponse.json({
      success: true,
      verificationResult: result,
      updatedDocument: DataStore.getDocumentById(id)
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}
