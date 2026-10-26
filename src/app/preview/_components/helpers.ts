import React from 'react';
import { maskPII } from '@/lib/security/privacy';

export { maskPII };

/**
 * Mask sensitive ID/PAN patterns for public read-only preview
 */
export function maskIdentifier(value: string | undefined | null): string {
  return maskPII(value);
}

export function formatSeverity(severity: string) {
  switch (severity) {
    case 'Critical':
      return 'bg-rose-100 text-rose-800 border-rose-300 font-bold';
    case 'High':
      return 'bg-amber-100 text-amber-800 border-amber-300 font-semibold';
    case 'Medium':
      return 'bg-yellow-100 text-yellow-800 border-yellow-300';
    default:
      return 'bg-blue-100 text-blue-800 border-blue-300';
  }
}

export function formatStatus(status: string) {
  switch (status) {
    case 'Verified':
    case 'AUTHENTIC':
    case 'Approved':
      return 'bg-emerald-100 text-emerald-800 border-emerald-300';
    case 'Mismatch Detected':
    case 'MISMATCH':
    case 'Discrepant':
    case 'Rejected':
    case 'DEFICIENT':
      return 'bg-rose-100 text-rose-800 border-rose-300';
    case 'Expired':
    case 'RECORD_EXPIRED':
    case 'Deficient':
      return 'bg-amber-100 text-amber-800 border-amber-300';
    case 'Source Unavailable':
    case 'SERVICE_OFFLINE':
    case 'RECORD_NOT_FOUND':
      return 'bg-purple-100 text-purple-800 border-purple-300';
    case 'Verification Pending':
      return 'bg-blue-100 text-blue-800 border-blue-300';
    case 'Manual Review Required':
      return 'bg-orange-100 text-orange-800 border-orange-300';
    default:
      return 'bg-slate-100 text-slate-800 border-slate-300';
  }
}
