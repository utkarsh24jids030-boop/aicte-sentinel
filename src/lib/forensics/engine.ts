// AICTE Sentinel Document Forensics Engine
// SHA-256, PDF metadata anomaly, near-duplicate detection, and cross-application reuse
// Problem Statement SIH26261 - Smart India Hackathon 2026

import crypto from 'crypto';
import { ForensicMetadata, Finding, DocumentRecord } from '@/types';

export interface ForensicsAnalysisResult {
  metadata: ForensicMetadata;
  findings: Finding[];
  isSuspicious: boolean;
}

export class ForensicsEngine {
  /**
   * Compute cryptographic SHA-256 hash
   */
  static computeSHA256(content: string | Buffer): string {
    return crypto.createHash('sha256').update(content).digest('hex');
  }

  /**
   * Generate simple perceptual text/structure fingerprint for near-duplicate detection
   */
  static generateFingerprint(text: string): string {
    const cleaned = text.toLowerCase().replace(/[^a-z0-9]/g, '');
    let hash = 0;
    for (let i = 0; i < cleaned.length; i++) {
      hash = ((hash << 5) - hash) + cleaned.charCodeAt(i);
      hash |= 0;
    }
    return `FP-${Math.abs(hash).toString(16).padStart(8, '0')}`;
  }

  /**
   * Inspect file buffer or mock file data for PDF metadata anomalies and tampering heuristics
   */
  static analyzeDocument(
    documentId: string,
    applicationId: string,
    fileName: string,
    fileSize: number,
    mimeType: string,
    simulatedContent: string,
    knownDocuments: DocumentRecord[] = []
  ): ForensicsAnalysisResult {
    const sha256 = this.computeSHA256(simulatedContent + fileName);
    const fingerprint = this.generateFingerprint(simulatedContent);
    const isPdf = mimeType.includes('pdf') || fileName.toLowerCase().endsWith('.pdf');

    const anomalyIndicators: string[] = [];
    let incrementalSavesDetected = false;
    let metadataAnomalyDetected = false;
    let tamperingConfidence = 0.05;

    // Simulated PDF metadata analysis
    let pdfProducer = 'Adobe PDF Library 21.1.84';
    let pdfCreator = 'Acrobat PDFMaker 21 for Windows';
    let creationDate = '2025-11-12T10:30:00Z';
    let modificationDate = '2025-11-12T10:30:00Z';

    // Deliberate anomaly triggers for demo cases
    if (fileName.includes('nova') && fileName.includes('alter')) {
      metadataAnomalyDetected = true;
      incrementalSavesDetected = true;
      pdfProducer = 'Canva / Ghostscript 9.53 (Hex Modified)';
      pdfCreator = 'Modified with Nitro Pro v13.70';
      modificationDate = '2026-02-14T03:12:00Z';
      tamperingConfidence = 0.88;
      anomalyIndicators.push('PDF Producer header indicates post-creation editing with Canva / Nitro Pro');
      anomalyIndicators.push('3 incremental xref tables detected: document was edited after digital signing');
      anomalyIndicators.push('Embedded font subsets do not match original government seal font stream');
    }

    if (fileName.includes('apex') && fileName.includes('dup')) {
      tamperingConfidence = 0.94;
      anomalyIndicators.push('Exact SHA-256 duplicate of certificate filed under Western Horizon in 2021');
      anomalyIndicators.push('Date timestamp in binary stream older than declared institution founding date');
    }

    const metadata: ForensicMetadata = {
      fileSize,
      mimeType,
      sha256Hash: sha256,
      pageCount: isPdf ? Math.max(1, Math.ceil(fileSize / 150000)) : 1,
      pdfProducer: isPdf ? pdfProducer : undefined,
      pdfCreator: isPdf ? pdfCreator : undefined,
      creationDate,
      modificationDate,
      incrementalSavesDetected,
      metadataAnomalyDetected,
      nearDuplicateHash: fingerprint,
      tamperingConfidence,
      anomalyIndicators
    };

    const findings: Finding[] = [];

    // 1. Check for Exact Duplicate Detection
    const duplicateMatch = knownDocuments.find(d => d.sha256Hash === sha256 && d.id !== documentId);
    if (duplicateMatch) {
      findings.push({
        id: `FIND-DUP-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        applicationId,
        documentId,
        category: 'FORENSIC_ANOMALY',
        severity: 'Critical',
        confidence: 0.99,
        title: 'Exact Duplicate Document Hash Detected',
        explanation: `This file SHA-256 checksum (${sha256.substring(0, 16)}...) matches existing document "${duplicateMatch.title}" (${duplicateMatch.fileName}) uploaded previously.`,
        evidenceLocator: `SHA256: ${sha256}`,
        recommendedAction: 'Verify document chain of custody and require re-submission of original notarized artifact.',
        status: 'Open',
        createdAt: new Date().toISOString()
      });
    }

    // 2. Check for Metadata Anomalies
    if (metadataAnomalyDetected) {
      findings.push({
        id: `FIND-META-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        applicationId,
        documentId,
        category: 'FORENSIC_ANOMALY',
        severity: 'High',
        confidence: tamperingConfidence,
        title: 'PDF Structure & Metadata Inconsistency Detected',
        explanation: `Forensic inspection reveals multiple incremental updates (${anomalyIndicators.join('; ')}). The document has been post-processed after issuance.`,
        evidenceLocator: `Producer: ${pdfProducer} | ModDate: ${modificationDate}`,
        recommendedAction: 'Scrutiny Officer must mandate physical original document verification by EVC team.',
        status: 'Open',
        createdAt: new Date().toISOString()
      });
    }

    return {
      metadata,
      findings,
      isSuspicious: findings.length > 0
    };
  }

  /**
   * Cross-Application Entity Reuse Detection
   */
  static detectCrossApplicationReuse(
    currentAppId: string,
    currentDocs: DocumentRecord[],
    allKnownDocs: DocumentRecord[]
  ): Finding[] {
    const reuseFindings: Finding[] = [];

    for (const doc of currentDocs) {
      for (const field of doc.extractedFields) {
        // Cross-check certificate numbers, land survey numbers, faculty PANs
        if (['certificate_number', 'deed_number', 'survey_number', 'pan', 'faculty_pan'].includes(field.fieldKey)) {
          const matchingDoc = allKnownDocs.find(
            d => d.applicationId !== currentAppId &&
                 d.extractedFields.some(f => f.fieldKey === field.fieldKey && f.fieldValue.toLowerCase() === field.fieldValue.toLowerCase())
          );

          if (matchingDoc) {
            const matchingField = matchingDoc.extractedFields.find(f => f.fieldKey === field.fieldKey);
            reuseFindings.push({
              id: `FIND-REUSE-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
              applicationId: currentAppId,
              documentId: doc.id,
              category: 'CROSS_INSTITUTION_COLLUSION',
              severity: 'Critical',
              confidence: 0.95,
              title: `Cross-Institution Collusion: Reused ${field.fieldLabel}`,
              explanation: `The declared ${field.fieldLabel} "${field.fieldValue}" is concurrently active in Application ID "${matchingDoc.applicationId}" for document "${matchingDoc.title}". Dual institutional claim identified.`,
              evidenceLocator: `Field: ${field.fieldKey} = ${field.fieldValue} (Also present in Doc ID ${matchingDoc.id})`,
              recommendedAction: 'Trigger Collusion Radar investigation and notify AICTE Vigilance & EVC Teams for simultaneous surprise inspection.',
              status: 'Open',
              createdAt: new Date().toISOString()
            });
          }
        }
      }
    }

    return reuseFindings;
  }
}
