import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { DataStore } from '@/lib/store';
import { ForensicsEngine } from '@/lib/forensics/engine';
import { checkRateLimit, getClientIp } from '@/lib/security/rateLimit';
import { DocumentRecord, DocumentType, ExtractedField } from '@/types';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_MIME_TYPES = ['application/pdf', 'image/png', 'image/jpeg'];

export async function POST(request: Request) {
  try {
    // 1. Sliding-window rate limit (10 uploads per minute per IP)
    const ip = getClientIp(request);
    const rateCheck = checkRateLimit('document-upload', ip, 10, 60000);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Maximum 10 document uploads per minute permitted. Please try again shortly.' },
        { 
          status: 429,
          headers: { 'Retry-After': Math.ceil(rateCheck.resetMs / 1000).toString() }
        }
      );
    }

    const formData = await request.formData();
    const applicationId = formData.get('applicationId') as string;
    const documentType = formData.get('documentType') as DocumentType;
    const title = formData.get('title') as string;
    const file = formData.get('file') as File | null;

    if (!applicationId || !documentType) {
      return NextResponse.json({ error: 'applicationId and documentType are required' }, { status: 400 });
    }

    const app = DataStore.getApplicationById(applicationId);
    if (!app) {
      return NextResponse.json({ error: 'Application not found' }, { status: 404 });
    }

    let fileName = `${documentType.replace(/\s+/g, '_')}_Upload.pdf`;
    let fileSize = 1245000;
    let mimeType = 'application/pdf';
    let rawBufferHash: string | null = null;

    // 2. Upload file security validations (Size, MIME, Magic Bytes)
    if (file && typeof file === 'object' && 'size' in file && file.size > 0) {
      // 2a. File size check (<= 10MB)
      if (file.size > MAX_FILE_SIZE) {
        return NextResponse.json(
          { error: 'File size exceeds maximum permitted limit of 10 MB.' },
          { status: 400 }
        );
      }

      // 2b. MIME type whitelist check
      if (!ALLOWED_MIME_TYPES.includes(file.type)) {
        return NextResponse.json(
          { error: 'Invalid file type. Only authentic PDF, PNG, and JPEG documents are permitted.' },
          { status: 400 }
        );
      }

      // 2c. Magic bytes / file signature validation
      const buffer = await file.arrayBuffer();
      const bytes = new Uint8Array(buffer.slice(0, 8));

      const isPdf = bytes.length >= 4 && bytes[0] === 0x25 && bytes[1] === 0x50 && bytes[2] === 0x44 && bytes[3] === 0x46; // %PDF
      const isPng = bytes.length >= 4 && bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4E && bytes[3] === 0x47; // .PNG
      const isJpeg = bytes.length >= 3 && bytes[0] === 0xFF && bytes[1] === 0xD8 && bytes[2] === 0xFF; // JPEG SOI

      if (!isPdf && !isPng && !isJpeg) {
        return NextResponse.json(
          { error: 'Invalid file signature. Only authentic PDF, PNG, and JPEG documents are permitted.' },
          { status: 400 }
        );
      }

      // Cross-check claimed MIME against detected magic bytes
      if (
        (file.type === 'application/pdf' && !isPdf) ||
        (file.type === 'image/png' && !isPng) ||
        ((file.type === 'image/jpeg' || file.type === 'image/jpg') && !isJpeg)
      ) {
        return NextResponse.json(
          { error: 'Invalid file signature. Only authentic PDF, PNG, and JPEG documents are permitted.' },
          { status: 400 }
        );
      }

      fileName = file.name;
      fileSize = file.size;
      mimeType = file.type;
      rawBufferHash = crypto.createHash('sha256').update(Buffer.from(buffer)).digest('hex');
    }

    // Mock content extraction simulation
    const simulatedContent = `DOCUMENT_CONTENT: ${documentType} for ${app.institutionName}. Application No: ${app.applicationNumber}. Created: ${new Date().toISOString()}`;
    const docId = `doc-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    const allDocs = DataStore.getDocuments();
    const forensicAnalysis = ForensicsEngine.analyzeDocument(
      docId,
      applicationId,
      fileName,
      fileSize,
      mimeType,
      simulatedContent,
      allDocs
    );

    const docSha256 = rawBufferHash || forensicAnalysis.metadata.sha256Hash;
    forensicAnalysis.metadata.sha256Hash = docSha256;

    // Mock OCR Extracted fields depending on documentType
    const extractedFields: ExtractedField[] = [];
    if (documentType === 'Land Deed') {
      extractedFields.push(
        { id: `f-${Date.now()}-1`, documentId: docId, fieldKey: 'survey_number', fieldLabel: 'Survey / Khasra Number', fieldValue: '144/2', confidence: 0.97, isManuallyCorrected: false, pageNumber: 2 },
        { id: `f-${Date.now()}-2`, documentId: docId, fieldKey: 'area_acres', fieldLabel: 'Contiguous Land Area (Acres)', fieldValue: '4.85', confidence: 0.95, isManuallyCorrected: false, pageNumber: 3 },
        { id: `f-${Date.now()}-3`, documentId: docId, fieldKey: 'deed_number', fieldLabel: 'Registered Deed Number', fieldValue: 'DEED-2026-9912', confidence: 0.99, isManuallyCorrected: false, pageNumber: 1 },
        { id: `f-${Date.now()}-4`, documentId: docId, fieldKey: 'grantee_name', fieldLabel: 'Purchaser / Grantee Name', fieldValue: 'Sunrise Education Trust', confidence: 0.98, isManuallyCorrected: false, pageNumber: 1 }
      );
    } else if (documentType === 'Fire Safety Certificate') {
      extractedFields.push(
        { id: `f-${Date.now()}-1`, documentId: docId, fieldKey: 'certificate_number', fieldLabel: 'Fire NOC Certificate Number', fieldValue: 'FS-RENEWED-2026', confidence: 0.94, isManuallyCorrected: false, pageNumber: 1 },
        { id: `f-${Date.now()}-2`, documentId: docId, fieldKey: 'issue_date', fieldLabel: 'Issue Date', fieldValue: '2026-01-20', confidence: 0.93, isManuallyCorrected: false, pageNumber: 1 },
        { id: `f-${Date.now()}-3`, documentId: docId, fieldKey: 'expiry_date', fieldLabel: 'Expiry Date', fieldValue: '2027-01-19', confidence: 0.95, isManuallyCorrected: false, pageNumber: 1 }
      );
    } else if (documentType === 'Affidavit') {
      extractedFields.push(
        { id: `f-${Date.now()}-1`, documentId: docId, fieldKey: 'survey_number', fieldLabel: 'Survey Number Declared', fieldValue: '144/2', confidence: 0.96, isManuallyCorrected: false, pageNumber: 2 },
        { id: `f-${Date.now()}-2`, documentId: docId, fieldKey: 'institution_name', fieldLabel: 'Institution Name Declared', fieldValue: app.institutionName, confidence: 0.99, isManuallyCorrected: false, pageNumber: 1 },
        { id: `f-${Date.now()}-3`, documentId: docId, fieldKey: 'notary_registration_no', fieldLabel: 'Notary Bar Council Reg No', fieldValue: 'NOTARY-DL-98214', confidence: 0.92, isManuallyCorrected: false, pageNumber: 8 },
        { id: `f-${Date.now()}-4`, documentId: docId, fieldKey: 'execution_date', fieldLabel: 'Affidavit Execution Date', fieldValue: '2026-01-10', confidence: 0.96, isManuallyCorrected: false, pageNumber: 8 }
      );
    } else {
      extractedFields.push(
        { id: `f-${Date.now()}-1`, documentId: docId, fieldKey: 'certificate_number', fieldLabel: 'Document Reference Number', fieldValue: `REF-${Math.floor(10000 + Math.random() * 90000)}`, confidence: 0.91, isManuallyCorrected: false, pageNumber: 1 },
        { id: `f-${Date.now()}-2`, documentId: docId, fieldKey: 'institution_name', fieldLabel: 'Declared Body', fieldValue: app.institutionName, confidence: 0.97, isManuallyCorrected: false, pageNumber: 1 }
      );
    }

    const docRecord: DocumentRecord = {
      id: docId,
      applicationId,
      institutionId: app.institutionId,
      documentType,
      title: title || `${documentType} Submission`,
      fileName,
      filePath: `/uploads/${app.institutionId}/${fileName}`,
      fileSize,
      mimeType,
      sha256Hash: docSha256,
      verificationStatus: forensicAnalysis.isSuspicious ? 'Manual Review Required' : 'Not Verified',
      verificationSource: 'Initial Upload Processing',
      forensicMetadata: forensicAnalysis.metadata,
      extractedFields,
      versions: [
        {
          id: `v-${Date.now()}`,
          documentId: docId,
          versionNumber: 1,
          fileName,
          filePath: `/uploads/${app.institutionId}/${fileName}`,
          fileSize,
          sha256Hash: docSha256,
          uploadedAt: new Date().toISOString(),
          uploadedBy: 'Authorized Representative'
        }
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const savedDoc = DataStore.addDocument(docRecord);

    // Save any findings flagged by forensics
    for (const finding of forensicAnalysis.findings) {
      DataStore.getFindings().push(finding);
    }

    return NextResponse.json({
      success: true,
      document: savedDoc,
      forensicFindings: forensicAnalysis.findings
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}
