// AICTE Sentinel Cryptographic Scrutiny Report Seal Engine
// Computes dynamic, tamper-evident seals derived from report content and current audit chain head.

import crypto from 'crypto';

export interface ReportSealVerification {
  isValid: boolean;
  expectedSeal: string;
  claimedSeal: string;
  verifiedAt: string;
  chainHeadHash: string;
  details: string;
}

/**
 * Compute canonical scrutiny report seal from report payload and the current cryptographic audit chain head
 */
export function computeReportSeal(
  reportId: string,
  applicationId: string,
  readinessScore: number,
  recommendationCode: string,
  chainHeadHash: string
): string {
  const payload = [
    reportId.trim(),
    applicationId.trim(),
    readinessScore.toString(),
    recommendationCode.trim(),
    chainHeadHash.trim()
  ].join('|');

  return crypto.createHash('sha256').update(payload).digest('hex');
}

/**
 * Verify claimed report seal against report content and chain head
 */
export function verifyReportSeal(
  reportId: string,
  applicationId: string,
  readinessScore: number,
  recommendationCode: string,
  chainHeadHash: string,
  claimedSeal: string
): ReportSealVerification {
  const expectedSeal = computeReportSeal(
    reportId,
    applicationId,
    readinessScore,
    recommendationCode,
    chainHeadHash
  );

  const isValid = expectedSeal.toLowerCase() === claimedSeal.trim().toLowerCase();

  return {
    isValid,
    expectedSeal,
    claimedSeal,
    verifiedAt: new Date().toISOString(),
    chainHeadHash,
    details: isValid
      ? `Cryptographic seal verified: SHA-256 matches exact report payload sealed at audit chain leaf ${chainHeadHash.substring(0, 16)}...`
      : `Cryptographic seal mismatch: Claimed seal does not match recalculated signature.`
  };
}
