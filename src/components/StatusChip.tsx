import React from 'react';
import { VerificationStatus, FindingSeverity, RiskTier } from '@/types';
import { CheckCircle2, AlertOctagon, Clock, AlertCircle, HelpCircle, FileQuestion, XCircle } from 'lucide-react';

interface StatusChipProps {
  status: VerificationStatus | FindingSeverity | RiskTier | string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function StatusChip({ status, size = 'sm', className = '' }: StatusChipProps) {
  let bg = 'bg-slate-100 text-slate-700 border-slate-300';
  let icon = <FileQuestion className="w-3.5 h-3.5" />;

  switch (status) {
    case 'Verified':
    case 'Approved':
    case 'Low':
      bg = 'bg-emerald-50 text-emerald-800 border-emerald-300';
      icon = <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />;
      break;

    case 'Mismatch Detected':
    case 'Rejected':
    case 'Critical':
    case 'Fraudulent':
      bg = 'bg-rose-50 text-rose-800 border-rose-300';
      icon = <AlertOctagon className="w-3.5 h-3.5 text-rose-600" />;
      break;

    case 'Expired':
      bg = 'bg-amber-50 text-amber-800 border-amber-300';
      icon = <Clock className="w-3.5 h-3.5 text-amber-600" />;
      break;

    case 'Verification Pending':
    case 'Under Scrutiny':
    case 'Submitted':
      bg = 'bg-blue-50 text-blue-800 border-blue-300';
      icon = <Clock className="w-3.5 h-3.5 text-blue-600" />;
      break;

    case 'Manual Review Required':
    case 'Deficiency Communicated':
    case 'High':
    case 'Deficient':
      bg = 'bg-orange-50 text-orange-800 border-orange-300';
      icon = <AlertCircle className="w-3.5 h-3.5 text-orange-600" />;
      break;

    case 'Source Unavailable':
    case 'Inconclusive':
    case 'Medium':
      bg = 'bg-zinc-100 text-zinc-800 border-zinc-300';
      icon = <HelpCircle className="w-3.5 h-3.5 text-zinc-600" />;
      break;

    case 'Not Verified':
    case 'Draft':
    default:
      bg = 'bg-slate-100 text-slate-700 border-slate-300';
      icon = <XCircle className="w-3.5 h-3.5 text-slate-500" />;
      break;
  }

  const sizeClasses = size === 'sm' 
    ? 'text-xs px-2.5 py-0.5 gap-1' 
    : size === 'md' 
    ? 'text-sm px-3 py-1 gap-1.5' 
    : 'text-base px-4 py-1.5 gap-2 font-medium';

  return (
    <span className={`inline-flex items-center font-medium rounded-full border shadow-2xs ${bg} ${sizeClasses} ${className}`}>
      {icon}
      <span>{status}</span>
    </span>
  );
}
