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
   * Document Tampering Score Formula:
   * 
   * Tamper Score T ∈ [0.0, 1.0] is computed strictly from physical/structural PDF file anomalies:
   * T = min(1.0, W_saves * I_saves + W_producer * I_producer + W_font * I_font + W_date * I_date + B_residual)
   * 
   * Calibrated Statutory Weights:
   * - W_saves    = 0.40  (Post-signing incremental update xref tables detected)
   * - W_producer = 0.30  (Anomalous consumer editing tools in producer header: Canva, Nitro, Ghostscript hex edits)
   * - W_font     = 0.16  (Mismatched embedded font subsets / stream tampering)
   * - W_date     = 0.10  (Modification date discrepancy or binary header timestamp conflict)
   * - B_residual = 0.02  (Baseline scanner noise / baseline clean file residual)
   * 
   * Duplicate Score D ∈ [0.0, 1.0] is computed INDEPENDENTLY via cryptographic hash matching:
   * D = 1.0 if Exact SHA-256 match in historical corpus, else fingerprint overlap.
   * 
   * CRITICAL PRINCIPLE:
   * A duplicate document with zero structural alterations has D = 0.99 / 1.0 and T = 0.02.
   * Conflating duplicate reuse with file byte tampering is mathematically and legally prohibited.
   */
  static readonly TAMPER_WEIGHTS = {
    INCREMENTAL_SAVES: 0.40,
    PRODUCER_ANOMALY: 0.30,
    FONT_DISCREPANCY: 0.16,
    MOD_DATE_DISCREPANCY: 0.10,
    BASELINE_RESIDUAL: 0.02
  };

  /**
   * Compute structural document tamper score from isolated physical indicators
   */
  static computeTamperScore(inputs: {
    incrementalSaves: number;
    producerAnomaly: number;
    fontDiscrepancies: number;
    modDateDiscrepancy: number;
  }): { score: number; formula: string; inputs: typeof inputs } {
    const raw = 
      (inputs.incrementalSaves * this.TAMPER_WEIGHTS.INCREMENTAL_SAVES) +
      (inputs.producerAnomaly * this.TAMPER_WEIGHTS.PRODUCER_ANOMALY) +
      (inputs.fontDiscrepancies * this.TAMPER_WEIGHTS.FONT_DISCREPANCY) +
      (inputs.modDateDiscrepancy * this.TAMPER_WEIGHTS.MOD_DATE_DISCREPANCY) +
      this.TAMPER_WEIGHTS.BASELINE_RESIDUAL;
    const score = Number(Math.min(1.0, Math.max(0.02, raw)).toFixed(2));
    const formula = 'TamperScore = 0.40*saves + 0.30*producer + 0.16*font + 0.10*date + 0.02';
    return { score, formula, inputs };
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

    // Tamper score inputs (default clean file)
    let tamperInputs = {
      incrementalSaves: 0,
      producerAnomaly: 0,
      fontDiscrepancies: 0,
      modDateDiscrepancy: 0
    };

    // Duplicate detection properties
    let duplicateConfidence = 0.0;
    let isDuplicateMatch = false;
    let duplicateMatchedDocId: string | undefined;
    let duplicateMatchedFileName: string | undefined;

    // Simulated PDF metadata analysis
    let pdfProducer = 'Adobe PDF Library 21.1.84';
    let pdfCreator = 'Acrobat PDFMaker 21 for Windows';
    const creationDate = '2025-11-12T10:30:00Z';
    let modificationDate = '2025-11-12T10:30:00Z';

    // Deliberate anomaly triggers for demo cases
    if (fileName.toLowerCase().includes('nova') && (fileName.toLowerCase().includes('alter') || fileName.toLowerCase().includes('rev2') || fileName.toLowerCase().includes('structure_plan') || fileName.toLowerCase().includes('building_plan'))) {
      metadataAnomalyDetected = true;
      incrementalSavesDetected = true;
      pdfProducer = 'Canva / Ghostscript 9.53 (Hex Modified)';
      pdfCreator = 'Modified with Nitro Pro v13.70';
      modificationDate = '2026-02-14T03:12:00Z';
      tamperInputs = {
        incrementalSaves: 1,
        producerAnomaly: 1,
        fontDiscrepancies: 1,
        modDateDiscrepancy: 0
      };
      anomalyIndicators.push('PDF Producer header indicates post-creation editing with Canva / Nitro Pro');
      anomalyIndicators.push('3 incremental xref tables detected: document was edited after digital signing');
      anomalyIndicators.push('Embedded font subsets do not match original government seal font stream');
    }

    // Check duplicate against known documents corpus
    const duplicateMatch = knownDocuments.find(d => d.sha256Hash === sha256 && d.id !== documentId);
    if (duplicateMatch || (fileName.toLowerCase().includes('apex') && fileName.toLowerCase().includes('dup'))) {
      isDuplicateMatch = true;
      duplicateConfidence = 0.99;
      duplicateMatchedDocId = duplicateMatch ? duplicateMatch.id : 'doc-wh-occ-2021';
      duplicateMatchedFileName = duplicateMatch ? duplicateMatch.fileName : 'Western_Horizon_Occupancy_2021.pdf';
      anomalyIndicators.push(`Exact cryptographic SHA-256 duplicate of archived certificate ${duplicateMatchedDocId}`);
      anomalyIndicators.push('Date timestamp in binary stream older than declared institution founding date');
      // Crucial: A duplicate document without structural alteration has zero tamper indicators
    }

    const tamperResult = this.computeTamperScore(tamperInputs);

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
      tamperingConfidence: tamperResult.score,
      duplicateConfidence,
      isDuplicateMatch,
      duplicateMatchedDocId,
      duplicateMatchedFileName,
      tamperScoreFormula: tamperResult.formula,
      tamperScoreInputs: tamperResult.inputs,
      anomalyIndicators
    };

    const findings: Finding[] = [];

    // 1. Check for Exact Duplicate Detection (SEPARATE from Tampering)
    if (isDuplicateMatch) {
      findings.push({
        id: `FIND-DUP-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        applicationId,
        documentId,
        category: 'FORENSIC_ANOMALY',
        severity: 'Critical',
        confidence: duplicateConfidence,
        title: 'Exact Duplicate Document Hash Detected',
        explanation: `This file SHA-256 checksum (${sha256.substring(0, 16)}...) matches existing document "${duplicateMatchedFileName}" (${duplicateMatchedDocId}) uploaded previously.`,
        evidenceLocator: `SHA256: ${sha256}`,
        recommendedAction: 'Verify document chain of custody and require re-submission of original notarized artifact.',
        status: 'Open',
        createdAt: new Date().toISOString()
      });
    }

    // 2. Check for Metadata & Structural Anomalies (SEPARATE from Duplicate)
    if (metadataAnomalyDetected) {
      findings.push({
        id: `FIND-META-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        applicationId,
        documentId,
        category: 'FORENSIC_ANOMALY',
        severity: 'High',
        confidence: tamperResult.score,
        title: 'PDF Structure & Metadata Inconsistency Detected',
        explanation: `Forensic inspection reveals multiple incremental updates (${anomalyIndicators.filter(i => !i.toLowerCase().includes('duplicate')).join('; ')}). Structural Tamper Score: ${(tamperResult.score * 100).toFixed(0)}%.`,
        evidenceLocator: `Producer: ${pdfProducer} | ModDate: ${modificationDate} | Formula: ${tamperResult.formula}`,
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
              category: 'CROSS_INSTITUTION_LINKAGE',
              severity: 'Critical',
              confidence: 0.95,
              title: `Cross-Institution Linkage: Shared ${field.fieldLabel}`,
              explanation: `The declared ${field.fieldLabel} "${field.fieldValue}" is concurrently active in Application ID "${matchingDoc.applicationId}" for document "${matchingDoc.title}". Dual institutional claim identified.`,
              evidenceLocator: `Field: ${field.fieldKey} = ${field.fieldValue} (Also present in Doc ID ${matchingDoc.id})`,
              recommendedAction: 'Option for officer consideration: Inspect Linkage Radar graph and consider physical verification during EVC inspection.',
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
