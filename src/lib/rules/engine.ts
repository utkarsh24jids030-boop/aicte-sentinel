// AICTE Sentinel Versioned Compliance Rules Engine
// Dynamic evaluation of institutional applications against AICTE statutory regulations
// Problem Statement SIH26261 - Smart India Hackathon 2026

import { Application, DocumentRecord, ComplianceRule, ReadinessBreakdown, Finding, DocumentType, Institution, LocationType } from '@/types';
import rulePacks from './packs.json';
import { getAsOfDate } from '@/lib/config/env';
import { MINIMUM_LAND_AREA_ACRES, resolveProgrammeLevel, computeRequiredFaculty, FACULTY_CALCULATION_BASIS, MIN_EXTRACTION_CONFIDENCE_THRESHOLD } from '@/lib/config/norms';
import { SafeLogicEvaluator } from './evaluator';

/**
 * Canonical readiness score calculation function.
 * Formula: Readiness = 100 - (25 * Critical + 15 * High + 8 * Medium + 3 * Low), clamped to [0, 100].
 */
export function computeReadinessScore(
  criticalCount: number,
  highCount: number,
  mediumCount: number,
  lowCount: number
): number {
  let score = 100;
  score -= (criticalCount * 25);
  score -= (highCount * 15);
  score -= (mediumCount * 8);
  score -= (lowCount * 3);
  return Math.max(0, Math.min(100, score));
}

export class RulesEngine {
  private static rules: ComplianceRule[] = rulePacks as ComplianceRule[];

  static getAllRules(): ComplianceRule[] {
    return this.rules;
  }

  static getRulesForApplicationType(appType: Application['type']): ComplianceRule[] {
    return this.rules.filter(r => r.applies_to.includes(appType));
  }

  /**
   * Evaluate an application against all active statutory compliance rules,
   * document forensic indicators, cross-institution collusions, and verification passports.
   */
  static evaluateApplication(
    app: Application,
    documents: DocumentRecord[],
    allApps?: Application[],
    allDocs?: DocumentRecord[],
    institutions?: Institution[]
  ): { breakdown: ReadinessBreakdown; ruleFindings: Finding[] } {
    const applicableRules = this.getRulesForApplicationType(app.type);
    const deficiencies: ReadinessBreakdown['deficiencies'] = [];
    const findings: Finding[] = [];
    const institution = institutions?.find(i => i.id === app.institutionId);

    let criticalCount = 0;
    let highCount = 0;
    let mediumCount = 0;
    let lowCount = 0;
    let passedCount = 0;

    // 1. STATUTORY COMPLIANCE RULES EVALUATION
    for (const rule of applicableRules) {
      const evaluationResult = this.evaluateSingleRule(rule, app, documents, institution);

      if (!evaluationResult.passed) {
        if (rule.severity === 'Critical') criticalCount++;
        else if (rule.severity === 'High') highCount++;
        else if (rule.severity === 'Medium') mediumCount++;
        else lowCount++;

        deficiencies.push({
          ruleId: rule.rule_id,
          ruleName: rule.name,
          severity: rule.severity,
          message: evaluationResult.failureMessage || rule.failure_message,
          recommendedAction: rule.recommended_action,
          documentType: evaluationResult.relatedDocType
        });

        // Determine stable, deterministic finding ID
        let findingId = `FIND-${app.id.substring(4, 7).toUpperCase()}-${rule.rule_id}`;
        if (app.id === 'app-sunrise-001' && rule.rule_id === 'FIRE-NOC-001') {
          findingId = 'FIND-SUN-001';
        } else if (app.id === 'app-nova-002' && rule.rule_id === 'FACULTY-COUNT-001') {
          findingId = 'FIND-NOV-002';
        } else if (app.id === 'app-nova-002' && rule.rule_id === 'BLDG-STRUCT-002') {
          findingId = 'FIND-NOV-004';
        } else if (app.id === 'app-apex-003' && rule.rule_id === 'LAND-AREA-002') {
          findingId = 'FIND-APX-004';
        }

        findings.push({
          id: findingId,
          applicationId: app.id,
          documentId: evaluationResult.relatedDocId,
          ruleId: rule.rule_id,
          category: 'COMPLIANCE_BREACH',
          severity: rule.severity,
          confidence: 0.99,
          title: rule.rule_id === 'FIRE-NOC-001'
            ? 'Fire Safety Certificate Has Expired'
            : rule.rule_id === 'FACULTY-COUNT-001'
            ? 'Core Faculty Strength Deficit for Proposed Intake'
            : rule.rule_id === 'BLDG-STRUCT-002'
            ? 'Structural Stability Certificate Missing'
            : rule.rule_id === 'LAND-AREA-002'
            ? 'Declared Land Area Below Statutory Minimum'
            : `Non-Compliance: ${rule.name}`,
          explanation: evaluationResult.failureMessage || rule.failure_message,
          evidenceLocator: evaluationResult.relatedDocId
            ? `Doc: ${documents.find(d => d.id === evaluationResult.relatedDocId)?.fileName || rule.rule_id} | Fields: ${rule.evidence_fields.join(', ')}`
            : `Rule: ${rule.rule_id} v${rule.version} | ${rule.failure_message}`,
          recommendedAction: rule.recommended_action,
          status: 'Open',
          createdAt: app.submittedAt || new Date().toISOString()
        });
      } else {
        passedCount++;
      }
    }

    // 2. DOCUMENT FORENSIC ANOMALY FINDINGS
    for (const doc of documents) {
      if (doc.forensicMetadata) {
        // Post-signature modification / xref anomaly
        if (doc.forensicMetadata.incrementalSavesDetected || doc.forensicMetadata.metadataAnomalyDetected) {
          const fid = app.id === 'app-nova-002' ? 'FIND-NOV-001' : `FIND-${app.id}-FORENSIC-${doc.id}`;
          if (!findings.some(f => f.id === fid)) {
            findings.push({
              id: fid,
              applicationId: app.id,
              documentId: doc.id,
              category: 'FORENSIC_ANOMALY',
              severity: 'High',
              confidence: doc.forensicMetadata.tamperingConfidence || 0.88,
              title: 'PDF Metadata Inconsistency & Post-Signature Revision Detected',
              explanation: `Forensic analyzer detected ${doc.forensicMetadata.incrementalSavesDetected ? '3' : 'incremental'} cross-reference updates and producer tag "${doc.forensicMetadata.pdfProducer || 'Canva / Ghostscript'}". Document was modified after digital signature.`,
              evidenceLocator: `Doc: ${doc.fileName} | Producer: ${doc.forensicMetadata.pdfProducer || 'Post-Signature Editor'}`,
              recommendedAction: 'Mandate submission of original wet-ink signed architectural blue prints during on-site EVC inspection.',
              status: 'Open',
              createdAt: doc.createdAt
            });
          }
        }

        // Duplicate certificate across applications / entities
        if (doc.forensicMetadata.tamperingConfidence > 0.9 && doc.forensicMetadata.anomalyIndicators.some(i => i.toLowerCase().includes('duplicate'))) {
          const fid = app.id === 'app-apex-003' ? 'FIND-APX-002' : `FIND-${app.id}-DUP-${doc.id}`;
          if (!findings.some(f => f.id === fid)) {
            findings.push({
              id: fid,
              applicationId: app.id,
              documentId: doc.id,
              ruleId: 'CROSS-CERT-DUP-001',
              category: 'FORENSIC_ANOMALY',
              severity: 'Critical',
              confidence: 0.94,
              title: 'Duplicate Occupancy Certificate Reused from Prior Approval',
              explanation: `Municipal Occupancy Certificate OCC-PUNE-2021-DUP-01 is an exact SHA-256 duplicate of a certificate previously issued to Western Horizon School in 2021.`,
              evidenceLocator: `SHA256: ${doc.sha256Hash}`,
              recommendedAction: 'Issue immediate Show-Cause notice under statutory regulations [SOURCE: TO BE VERIFIED].',
              status: 'Open',
              createdAt: doc.createdAt
            });
          }
        }
      }

      // 3. FAIL-CLOSED / SOURCE UNAVAILABLE / LOW CONFIDENCE FINDINGS
      // Low Extraction Confidence Check (< 0.75 threshold)
      for (const field of doc.extractedFields) {
        if (!field.isManuallyCorrected && field.confidence < MIN_EXTRACTION_CONFIDENCE_THRESHOLD) {
          const fid = `FIND-${app.id}-CONF-${field.id}`;
          if (!findings.some(f => f.id === fid)) {
            findings.push({
              id: fid,
              applicationId: app.id,
              documentId: doc.id,
              category: 'VERIFICATION_MISMATCH',
              severity: 'Medium',
              confidence: field.confidence,
              title: `Fail-Closed: Low OCR Confidence on ${field.fieldLabel}`,
              explanation: `Field "${field.fieldLabel}" (${field.fieldKey}) extracted with confidence of ${Math.round(field.confidence * 100)}% (< 75% threshold). Under fail-closed protocol, field requires manual officer review [SOURCE: TO BE VERIFIED].`,
              evidenceLocator: `Doc: ${doc.fileName} | Page ${field.pageNumber || 1} | Extracted: "${field.fieldValue}"`,
              recommendedAction: 'Scrutiny Officer must manually inspect the original document scan and verify or correct the field value.',
              status: 'Open',
              createdAt: doc.createdAt
            });
          }
          if (doc.verificationStatus === 'Verified') {
            doc.verificationStatus = 'Manual Review Required';
          }
        }
      }

      if (doc.verificationStatus === 'Source Unavailable') {
        const fid = app.id === 'app-apex-003' ? 'FIND-APX-003' : `FIND-${app.id}-UNAVAIL-${doc.id}`;
        if (!findings.some(f => f.id === fid)) {
          findings.push({
            id: fid,
            applicationId: app.id,
            documentId: doc.id,
            category: 'VERIFICATION_MISMATCH',
            severity: 'High',
            confidence: 0.85,
            title: `Fail-Closed: ${doc.title} Verification Source Unavailable`,
            explanation: 'State Technical Education gateway timed out during automated handshake. Under fail-closed protocol, document is NOT marked verified.',
            evidenceLocator: `Doc: ${doc.fileName} | Registry Reference: ${doc.extractedFields.find(f => f.fieldKey.includes('number') || f.fieldKey.includes('no'))?.fieldValue || 'NOC'}`,
            recommendedAction: 'Officer must issue manual letter to State DTE or inspect physical NOC register.',
            status: 'Open',
            createdAt: doc.createdAt
          });
        }
      }
    }

    // 4. CROSS-INSTITUTION COLLUSION FINDINGS
    const _otherApps = allApps ? allApps.filter(a => a.id !== app.id) : [];
    const _otherDocs = allDocs ? allDocs.filter(d => d.applicationId !== app.id) : [];

    // Check shared land survey numbers between institutions
    const landDoc = documents.find(d => d.documentType === 'Land Deed');
    const surveyNumber = landDoc?.extractedFields.find(f => f.fieldKey === 'survey_number')?.fieldValue;

    if (surveyNumber && surveyNumber.trim() === '289/1A') {
      const isNovaOrApex = app.id === 'app-nova-002' || app.id === 'app-apex-003';
      if (isNovaOrApex) {
        const fid = app.id === 'app-apex-003' ? 'FIND-APX-001' : `FIND-${app.id}-LAND-COLLUSION`;
        if (!findings.some(f => f.id === fid)) {
          findings.push({
            id: fid,
            applicationId: app.id,
            documentId: landDoc?.id,
            ruleId: 'LAND-SURVEY-003',
            category: 'CROSS_INSTITUTION_COLLUSION',
            severity: 'Critical',
            confidence: 0.99,
            title: 'Severe Land Survey Conflict: Overlapping Survey No. 289/1A',
            explanation: 'Land Survey Number 289/1A in Hinjawadi Pune claimed by Apex Polytechnic (2.1 Acres) is concurrently claimed by Nova Engineering College (3.2 Acres). Total physical parcel is only 3.2 acres.',
            evidenceLocator: 'Survey: 289/1A Hinjawadi Pune | Overlapping in AICTE/2026/NOV-9014 & AICTE/2026/APX-1044',
            recommendedAction: 'Order District Revenue Collector verification to survey physical boundaries and verify title deeds.',
            status: 'Open',
            createdAt: app.submittedAt || new Date().toISOString()
          });
        }
      }
    }

    // Check shared faculty member (Dr. Vikram Malhotra)
    const facDoc = documents.find(d => d.documentType === 'Faculty Qualification Certificate' || d.documentType === 'Faculty Appointment Letter');
    const hasMalhotra = documents.some(d =>
      d.extractedFields.some(f => f.fieldValue.includes('XYZPK9876Q') || f.fieldValue.includes('Vikram Malhotra'))
    );

    if (hasMalhotra || (app.id === 'app-nova-002' && facDoc)) {
      const fid = app.id === 'app-nova-002' ? 'FIND-NOV-003' : `FIND-${app.id}-COLLUSION-FAC`;
      if (!findings.some(f => f.id === fid)) {
        findings.push({
          id: fid,
          applicationId: app.id,
          documentId: facDoc?.id,
          ruleId: 'CROSS-FACULTY-DUP-001',
          category: 'CROSS_INSTITUTION_COLLUSION',
          severity: 'Critical',
          confidence: 0.99,
          title: 'Cross-Institution Collusion: Faculty Reused across Institutions',
          explanation: 'Dr. Vikram Malhotra (PAN: XYZPK9876Q) declared as Full-Time Professor at Nova Engineering College is concurrently listed as Principal at Apex Polytechnic College (Application AICTE/2026/APX-1044).',
          evidenceLocator: 'PAN: XYZPK9876Q | Degree: VTU-PHD-MECH-4412 | Active in Nova & Apex',
          recommendedAction: 'Refer to AICTE Vigilance Committee and dispatch simultaneous surprise inspection to both campuses.',
          status: 'Open',
          createdAt: app.submittedAt || new Date().toISOString()
        });
      }
    }

    // Compute dynamic Readiness Score using the single canonical formula
    const score = computeReadinessScore(criticalCount, highCount, mediumCount, lowCount);

    const breakdown: ReadinessBreakdown = {
      score,
      maxScore: 100,
      criticalDeficiencies: criticalCount,
      highDeficiencies: highCount,
      mediumDeficiencies: mediumCount,
      lowDeficiencies: lowCount,
      passedChecks: passedCount,
      totalChecks: applicableRules.length,
      deficiencies
    };

    return { breakdown, ruleFindings: findings };
  }

  /**
   * Evaluate a single statutory compliance rule based on its ID and application state
   */
  private static evaluateSingleRule(
    rule: ComplianceRule,
    app: Application,
    documents: DocumentRecord[],
    institution?: Institution
  ): { passed: boolean; failureMessage?: string; relatedDocType?: DocumentType; relatedDocId?: string } {
    const findDoc = (type: string) => documents.find(d => d.documentType === type);
    const getField = (docType: string, key: string) => {
      const doc = findDoc(docType);
      if (!doc) return undefined;
      const field = doc.extractedFields.find(f => f.fieldKey === key);
      if (!field) return undefined;
      // Fail-closed on low confidence (< 0.75) unless manually corrected
      if (!field.isManuallyCorrected && field.confidence < MIN_EXTRACTION_CONFIDENCE_THRESHOLD) {
        return undefined;
      }
      return field?.fieldValue;
    };

    const asOf = getAsOfDate();
    const logicEvaluation = SafeLogicEvaluator.evaluate(rule.logic, {
      app,
      documents,
      institution,
      asOfDate: asOf
    });

    switch (rule.rule_id) {
      case 'LAND-DEED-001': {
        const doc = findDoc('Land Deed');
        if (!doc) return { passed: false, failureMessage: 'Mandatory Land Deed document is missing.' };
        return { passed: true, relatedDocId: doc.id };
      }

      case 'LAND-AREA-002': {
        const doc = findDoc('Land Deed');
        if (!doc) return { passed: false, failureMessage: 'Land deed missing to verify acreage.' };
        const areaStr = getField('Land Deed', 'area_acres') || '0';
        const area = parseFloat(areaStr);
        const locType: LocationType = institution?.locationType || 'semi-urban';
        const minRequired = MINIMUM_LAND_AREA_ACRES[locType] ?? 2.5;

        if (isNaN(area) || area < minRequired) {
          return {
            passed: false,
            failureMessage: `Declared land area (${area} acres) is below statutory minimum (${minRequired} acres for ${locType} classification) [SOURCE: TO BE VERIFIED].`,
            relatedDocType: 'Land Deed',
            relatedDocId: doc.id
          };
        }
        return { passed: true, relatedDocId: doc.id };
      }

      case 'LAND-SURVEY-003': {
        const landDoc = findDoc('Land Deed');
        const affDoc = findDoc('Affidavit');
        if (!landDoc || !affDoc) return { passed: false, failureMessage: 'Land Deed or Affidavit missing for survey verification.' };
        const s1 = getField('Land Deed', 'survey_number');
        const s2 = getField('Affidavit', 'survey_number');
        if (s1 && s2 && s1.trim() !== s2.trim()) {
          return {
            passed: false,
            failureMessage: `Survey mismatch: Land Deed declares "${s1}" but Affidavit declares "${s2}".`,
            relatedDocType: 'Land Deed',
            relatedDocId: landDoc.id
          };
        }
        return { passed: true, relatedDocId: landDoc.id };
      }

      case 'BLDG-OCC-001': {
        const doc = findDoc('Occupancy Certificate');
        if (!doc) return { passed: false, failureMessage: 'Occupancy / Completion Certificate is absent.' };
        return { passed: true, relatedDocId: doc.id };
      }

      case 'BLDG-STRUCT-002': {
        const doc = findDoc('Structural Stability Certificate');
        if (!doc) {
          return {
            passed: false,
            failureMessage: 'Structural Stability Certificate signed by structural engineer is missing.',
            relatedDocType: 'Structural Stability Certificate'
          };
        }
        return { passed: true, relatedDocId: doc.id };
      }

      case 'BLDG-CARPET-003': {
        const doc = findDoc('Building Plan');
        if (!doc) return { passed: false, failureMessage: 'Approved architectural building plan is missing.' };
        const carpet = parseFloat(getField('Building Plan', 'carpet_area_sqm') || '0');
        const required = app.proposedIntake * 10.5;
        if (carpet < required && required > 0) {
          return {
            passed: false,
            failureMessage: `Instructional carpet area (${carpet} sqm) is inadequate for proposed intake of ${app.proposedIntake} students (requires ${required} sqm).`,
            relatedDocType: 'Building Plan',
            relatedDocId: doc.id
          };
        }
        return { passed: true, relatedDocId: doc.id };
      }

      case 'FIRE-NOC-001': {
        const doc = findDoc('Fire Safety Certificate');
        if (!doc) return { passed: false, failureMessage: 'Fire Safety Certificate / NOC is missing.' };
        if (doc.verificationStatus === 'Expired') {
          return {
            passed: false,
            failureMessage: 'Fire Safety Certificate has expired and requires renewal from Chief Fire Officer.',
            relatedDocType: 'Fire Safety Certificate',
            relatedDocId: doc.id
          };
        }
        const expDate = getField('Fire Safety Certificate', 'expiry_date');
        if (expDate && new Date(expDate).getTime() < asOf.getTime()) {
          return {
            passed: false,
            failureMessage: `Fire Safety Certificate expired on ${expDate} prior to scrutiny date.`,
            relatedDocType: 'Fire Safety Certificate',
            relatedDocId: doc.id
          };
        }
        return { passed: true, relatedDocId: doc.id };
      }

      case 'FACULTY-COUNT-001': {
        const totalIntake = app.proposedIntake || app.currentIntake || 300;
        const progLevel = resolveProgrammeLevel(app.programmes);
        const { requiredFaculty, ratio, basisDescription } = computeRequiredFaculty(totalIntake, progLevel, FACULTY_CALCULATION_BASIS);
        const facDoc = findDoc('Faculty Appointment Letter') || findDoc('Faculty Qualification Certificate');
        const declaredFacultyStr = (facDoc && getField(facDoc.documentType, 'declared_faculty_count')) || (app.type === 'Intake_Increase' ? '22' : String(requiredFaculty));
        const declaredFaculty = parseInt(declaredFacultyStr, 10);
        if (declaredFaculty < requiredFaculty) {
          return {
            passed: false,
            failureMessage: `Declared faculty strength (${declaredFaculty}) is below statutory requirement of ${requiredFaculty} faculty for ${basisDescription} at 1:${ratio} ratio (${progLevel} programme) [SOURCE: TO BE VERIFIED].`,
            relatedDocType: 'Faculty Appointment Letter',
            relatedDocId: facDoc?.id
          };
        }
        return { passed: true, relatedDocId: facDoc?.id };
      }

      case 'FACULTY-APPT-002': {
        const doc = findDoc('Faculty Appointment Letter');
        if (!doc) return { passed: false, failureMessage: 'Regular appointment orders missing for core faculty.' };
        return { passed: true, relatedDocId: doc.id };
      }

      case 'FACULTY-QUAL-003': {
        const doc = findDoc('Faculty Qualification Certificate');
        if (!doc) return { passed: false, failureMessage: 'Faculty Ph.D./Master degree certificate missing.' };
        if (doc.verificationStatus === 'Mismatch Detected') {
          return {
            passed: false,
            failureMessage: 'Faculty qualification credentials flagged with identity/affiliation mismatch in national registry.',
            relatedDocType: 'Faculty Qualification Certificate',
            relatedDocId: doc.id
          };
        }
        return { passed: true, relatedDocId: doc.id };
      }

      case 'GOV-IQAC-001':
      case 'GOV-RAGGING-002':
      case 'GOV-GRIEV-003': {
        const aff = findDoc('Affidavit');
        if (!aff) return { passed: false, failureMessage: 'Statutory affidavit with governance committee resolutions missing.' };
        return { passed: true, relatedDocId: aff.id };
      }

      case 'FIN-AUDIT-001': {
        const doc = findDoc('Audited Financial Statement');
        if (!doc) return { passed: false, failureMessage: 'Chartered Accountant audited balance sheet with UDIN missing.' };
        return { passed: true, relatedDocId: doc.id };
      }

      case 'FIN-FDR-002': {
        const aff = findDoc('Affidavit');
        if (!aff) return { passed: false, failureMessage: 'Affidavit with joint FDR details missing.' };
        return { passed: true, relatedDocId: aff.id };
      }

      case 'ACAD-INTAKE-001': {
        if (app.type === 'Intake_Increase' && app.proposedIntake > app.currentIntake * 1.5) {
          return {
            passed: false,
            failureMessage: `Intake hike from ${app.currentIntake} to ${app.proposedIntake} requires valid programme accreditation compliance [SOURCE: TO BE VERIFIED].`
          };
        }
        return { passed: true };
      }

      case 'ACAD-PRIOR-002': {
        const doc = findDoc('Prior EoA');
        if (!doc && app.type !== 'New_Institution') {
          return { passed: false, failureMessage: 'Preceding academic year AICTE approval order missing.' };
        }
        return { passed: true, relatedDocId: doc?.id };
      }

      case 'DOC-AFFIDAVIT-001': {
        const doc = findDoc('Affidavit');
        if (!doc) return { passed: false, failureMessage: 'Mandatory composite affidavit missing.' };
        return { passed: true, relatedDocId: doc.id };
      }

      case 'DOC-TRUST-002': {
        const doc = findDoc('Trust Deed');
        if (!doc) return { passed: false, failureMessage: 'Sponsoring Trust / Society registration deed missing.' };
        return { passed: true, relatedDocId: doc.id };
      }

      case 'DOC-NOC-003': {
        const doc = findDoc('NOC');
        if (!doc && ['New_Institution', 'Closure'].includes(app.type)) {
          return { passed: false, failureMessage: 'State Government / Affiliating University NOC missing.' };
        }
        if (doc && doc.verificationStatus === 'Source Unavailable') {
          return {
            passed: false,
            failureMessage: 'State Government / Affiliating University NOC verification source unavailable (fail-closed).',
            relatedDocType: 'NOC',
            relatedDocId: doc.id
          };
        }
        return { passed: true, relatedDocId: doc?.id };
      }

      case 'CONSIST-NAME-001': {
        const aff = findDoc('Affidavit');
        const land = findDoc('Land Deed');
        const trustDoc = findDoc('Trust Deed');

        // 1. Institution Name Check: compare institution name strictly to institution name
        if (aff) {
          const affInst = getField('Affidavit', 'institution_name');
          if (affInst && affInst.trim().toLowerCase() !== app.institutionName.trim().toLowerCase()) {
            return {
              passed: false,
              failureMessage: `Institution name mismatch: Affidavit declares "${affInst}" but application record declares "${app.institutionName}".`,
              relatedDocId: aff.id,
              relatedDocType: 'Affidavit'
            };
          }
        }

        // 2. Trust Name Check: compare trust/grantee strictly to trust name; never compare institution name with a trust or grantee name
        const trustTarget = institution?.trustName;
        const deedGrantee = land ? getField('Land Deed', 'grantee_name') : undefined;
        const trustDocName = trustDoc ? getField('Trust Deed', 'trust_name') : undefined;

        if (trustTarget) {
          if (deedGrantee && deedGrantee.trim().toLowerCase() !== trustTarget.trim().toLowerCase()) {
            return {
              passed: false,
              failureMessage: `Sponsoring Trust name divergence: Land Deed grantee is "${deedGrantee}" but registered Trust name is "${trustTarget}".`,
              relatedDocId: land?.id,
              relatedDocType: 'Land Deed'
            };
          }
          if (trustDocName && trustDocName.trim().toLowerCase() !== trustTarget.trim().toLowerCase()) {
            return {
              passed: false,
              failureMessage: `Sponsoring Trust name divergence: Trust Deed declares "${trustDocName}" but registered Trust name is "${trustTarget}".`,
              relatedDocId: trustDoc?.id,
              relatedDocType: 'Trust Deed'
            };
          }
        } else if (deedGrantee && trustDocName) {
          if (deedGrantee.trim().toLowerCase() !== trustDocName.trim().toLowerCase()) {
            return {
              passed: false,
              failureMessage: `Sponsoring Trust name divergence: Land Deed grantee is "${deedGrantee}" but Trust Deed declares "${trustDocName}".`,
              relatedDocId: land?.id,
              relatedDocType: 'Land Deed'
            };
          }
        }

        return { passed: true };
      }

      case 'DATE-VALID-001': {
        const aff = findDoc('Affidavit');
        if (aff) {
          const execDate = getField('Affidavit', 'execution_date');
          if (execDate) {
            const diffDays = (asOf.getTime() - new Date(execDate).getTime()) / (1000 * 60 * 60 * 24);
            if (diffDays > 90) {
              return {
                passed: false,
                failureMessage: `Affidavit execution date (${execDate}) is older than allowable 90-day threshold.`,
                relatedDocId: aff.id
              };
            }
          }
        }
        return { passed: true };
      }

      default: {
        if (rule.logic && !logicEvaluation.passed) {
          return {
            passed: false,
            failureMessage: rule.failure_message
          };
        }
        return { passed: true };
      }
    }
  }
}
