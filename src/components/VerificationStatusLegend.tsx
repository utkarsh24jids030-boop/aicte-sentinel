import React from 'react';
import StatusChip from '@/components/StatusChip';
import { VerificationStatus } from '@/types';
import { ShieldCheck, Info } from 'lucide-react';

export const VERIFICATION_STATUS_DEFINITIONS: {
  status: VerificationStatus;
  title: string;
  description: string;
  actionGuidance: string;
}[] = [
  {
    status: 'Verified',
    title: 'Verified Authentic',
    description: 'Claim corroborated against an authorized digital registry (DigiLocker, State Land Cadastre, State DTE, National Faculty Directory).',
    actionGuidance: 'Automated clearance pass; eligible for statutory approval consideration.'
  },
  {
    status: 'Mismatch Detected',
    title: 'Mismatch Detected',
    description: 'Submitted claim diverges from the official government registry record (e.g. land acreage discrepancy, overlapping survey number, concurrent faculty appointment).',
    actionGuidance: 'Adverse finding generated; requires officer review and institutional clarification.'
  },
  {
    status: 'Expired',
    title: 'Expired Clearance',
    description: 'Document was issued by an authorized source but its statutory validity window has elapsed relative to the regulatory anchor date (2026-02-01).',
    actionGuidance: 'Mandatory deficiency; valid renewal certificate required prior to approval.'
  },
  {
    status: 'Verification Pending',
    title: 'Verification Pending',
    description: 'Verification request is queued, in-flight, or awaiting formal electronic response / batch confirmation from the issuing authority registry.',
    actionGuidance: 'Temporary holding state; re-polled automatically or held for issuing-authority reply.'
  },
  {
    status: 'Source Unavailable',
    title: 'Source Unavailable',
    description: 'Authorized issuing authority endpoint is offline, timed out, or lacks an electronic verification API. System fail-closed prevents unverified pass.',
    actionGuidance: 'Fail-closed protocol routes document to manual officer scrutiny / EVC inspection.'
  },
  {
    status: 'Manual Review Required',
    title: 'Manual Review Required',
    description: 'Automated verification was inconclusive, low OCR confidence was recorded, or forensic structural anomalies (e.g. post-signature edits) were detected.',
    actionGuidance: 'Assigned to AICTE scrutiny officer for forensic adjudication.'
  }
];

interface VerificationStatusLegendProps {
  compact?: boolean;
  className?: string;
}

export default function VerificationStatusLegend({ compact = false, className = '' }: VerificationStatusLegendProps) {
  if (compact) {
    return (
      <div className={`p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs ${className}`}>
        <div className="flex items-center gap-1.5 font-bold text-slate-800">
          <Info className="w-4 h-4 text-blue-700" />
          <span>Statutory Verification Status Legend (6-State Model)</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 pt-1">
          {VERIFICATION_STATUS_DEFINITIONS.map((item) => (
            <div key={item.status} className="p-2 bg-white rounded border border-slate-200 flex flex-col gap-1">
              <StatusChip status={item.status} size="sm" />
              <p className="text-[11px] text-slate-600 leading-snug">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4 ${className}`}>
      <div className="flex items-center justify-between border-b pb-3">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-lg bg-blue-100 text-[#002b66]">
            <ShieldCheck className="w-4 h-4" />
          </span>
          <div>
            <h4 className="text-sm font-bold text-slate-900">
              Statutory Verification Status Reference Legend
            </h4>
            <p className="text-[11px] text-slate-500">
              Official 6-state fail-closed taxonomy enforced across all AICTE Sentinel document passports
            </p>
          </div>
        </div>
        <span className="text-[10px] font-mono font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200">
          PS 26261 Taxon
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {VERIFICATION_STATUS_DEFINITIONS.map((item) => (
          <div key={item.status} className="p-3 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-white hover:border-blue-400 hover:shadow-2xs transition-all space-y-2">
            <div className="flex items-center justify-between">
              <StatusChip status={item.status} size="sm" />
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{item.status}</span>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed font-normal">
              {item.description}
            </p>
            <div className="pt-1 border-t border-slate-200/80 text-[10px] text-blue-900 font-medium">
              <strong className="text-slate-800">Review Protocol:</strong> {item.actionGuidance}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
