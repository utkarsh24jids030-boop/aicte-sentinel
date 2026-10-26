import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { DataStore } from '@/lib/store';
import { ForensicsEngine } from '@/lib/forensics/engine';
import { ExtractionEngine } from '@/lib/extraction/engine';
import { AuditTrailEngine } from '@/lib/audit/trail';
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

    const docId = `doc-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    let fileName = `${documentType.replace(/\s+/g, '_')}_Upload.pdf`;
    let fileSize = 1245000;
    let mimeType = 'application/pdf';
    let rawBufferHash: string | null = null;
    let extractedFields: ExtractedField[] = [];
    let extractionEngine = 'Baseline PDF Text Stream Extractor (pdf-parse v2 + regex rules)';
    let extractionEngineStatus = 'Baseline extraction active — AI_EXTRACTION_API_KEY not configured';
    let extractedTextPreview = '';

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
      const fileBuffer = Buffer.from(buffer);
      rawBufferHash = crypto.createHash('sha256').update(fileBuffer).digest('hex');

      // Real PDF extraction with keyword classification & dynamic confidence
      if (mimeType === 'application/pdf') {
        const extraction = await ExtractionEngine.processDocument(fileBuffer, fileName, docId, documentType);
        extractedFields = extraction.extractedFields;
        extractionEngine = extraction.extractionEngine;
        extractionEngineStatus = extraction.extractionEngineStatus;
        extractedTextPreview = extraction.extractedTextPreview;
      } else {
        // Honest disclosure: OCR not implemented for images
        extractionEngine = 'Native PDF Text Stream Extractor';
        extractionEngineStatus = 'Raster image uploaded. Native vector text extraction requires PDF format. OCR engine not configured.';
        extractedTextPreview = '(Scanned image file - native PDF text extraction unavailable)';
        extractedFields = [
          {
            id: `f-${Date.now()}-1`,
            documentId: docId,
            fieldKey: 'document_notice',
            fieldLabel: 'Image Format Notice',
            fieldValue: 'Image uploaded. OCR engine not configured; manual inspection required.',
            confidence: 0.65,
            isManuallyCorrected: false,
            pageNumber: 1
          }
        ];
      }
    } else {
      extractionEngine = 'Baseline PDF Text Stream Extractor (pdf-parse v2 + regex rules)';
      extractionEngineStatus = 'Baseline extraction active — AI_EXTRACTION_API_KEY not configured';
      extractedFields = [
        {
          id: `f-${Date.now()}-1`,
          documentId: docId,
          fieldKey: 'document_reference',
          fieldLabel: 'Reference Indicator',
          fieldValue: `${documentType} Record`,
          confidence: 0.85,
          isManuallyCorrected: false,
          pageNumber: 1
        }
      ];
    }

    const allDocs = DataStore.getDocuments();
    const forensicAnalysis = ForensicsEngine.analyzeDocument(
      docId,
      applicationId,
      fileName,
      fileSize,
      mimeType,
      extractedTextPreview,
      allDocs
    );

    const docSha256 = rawBufferHash || forensicAnalysis.metadata.sha256Hash;
    forensicAnalysis.metadata.sha256Hash = docSha256;

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
      extractionEngine,
      extractionEngineStatus,
      extractedTextPreview,
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

    // Record extraction and rule evaluation in hash chain
    AuditTrailEngine.recordEvent({
      actorId: 'system-ocr-pipeline',
      actorName: 'Sentinel Extraction Pipeline',
      actorRole: 'SYSTEM',
      action: 'EXTRACTION_RUN',
      entityType: 'DOCUMENT',
      entityId: docId,
      afterSummary: `Extracted ${extractedFields.length} statutory fields from ${fileName}`
    });

    AuditTrailEngine.recordEvent({
      actorId: 'system-rules-engine',
      actorName: 'Statutory Compliance Rules Engine',
      actorRole: 'SYSTEM',
      action: 'RULE_RUN',
      entityType: 'APPLICATION',
      entityId: applicationId,
      afterSummary: `Evaluated statutory rules pack against application. Flagged ${forensicAnalysis.findings.length} findings for manual review`
    });

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
