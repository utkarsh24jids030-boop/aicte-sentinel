'use client';

import React, { useState } from 'react';
import { Finding, FindingStatus } from '@/types';
import StatusChip from './StatusChip';
import { 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  MessageSquare, 
  Send, 
  ChevronRight, 
  Eye, 
  ShieldAlert,
  HelpCircle,
  ExternalLink
} from 'lucide-react';

interface FindingCardProps {
  finding: Finding;
  isOfficer?: boolean;
  onAction?: (findingId: string, action: FindingStatus, notes?: string) => Promise<void>;
  onInspectDocument?: (docId: string) => void;
}

export default function FindingCard({ 
  finding, 
  isOfficer = false, 
  onAction,
  onInspectDocument 
}: FindingCardProps) {
  const [showActionModal, setShowActionModal] = useState(false);
  const [selectedAction, setSelectedAction] = useState<FindingStatus>('Confirmed by Officer');
  const [officerNotes, setOfficerNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleExecuteAction = async () => {
    if (!onAction) return;
    setIsSubmitting(true);
    try {
      await onAction(finding.id, selectedAction, officerNotes);
      setShowActionModal(false);
      setOfficerNotes('');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-2xs hover:shadow-xs transition-all overflow-hidden">
      {/* Top Header */}
      <div className="px-5 py-3.5 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3 bg-slate-50/50">
        <div className="flex items-center gap-2.5">
          <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-slate-200/80 text-slate-800">
            {finding.id}
          </span>
          <StatusChip status={finding.severity} size="sm" />
          <span className="text-xs font-medium text-slate-500">
            {finding.category.replace(/_/g, ' ')}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs text-slate-600">
            <span className="text-[11px] font-medium text-slate-400">Confidence:</span>
            <span className="font-bold text-slate-700">{Math.round(finding.confidence * 100)}%</span>
            <div className="w-14 h-1.5 bg-slate-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-blue-600 rounded-full" 
                style={{ width: `${Math.round(finding.confidence * 100)}%` }}
              />
            </div>
          </div>
          <StatusChip status={finding.status} size="sm" />
        </div>
      </div>

      {/* Body */}
      <div className="p-5">
        <h4 className="text-sm font-bold text-slate-900 mb-2 flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-amber-600 flex-shrink-0" />
          <span>{finding.title}</span>
        </h4>

        <p className="text-xs text-slate-700 leading-relaxed mb-4">
          {finding.explanation}
        </p>

        {/* Evidence Locator Box */}
        <div className="bg-slate-50 rounded-lg border border-slate-200 p-3 mb-3 text-xs">
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1 flex items-center justify-between">
            <span>Evidence Locator</span>
            {finding.documentId && onInspectDocument && (
              <button
                onClick={() => onInspectDocument(finding.documentId!)}
                className="text-blue-600 hover:text-blue-800 flex items-center gap-1 font-semibold normal-case"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>View Document</span>
              </button>
            )}
          </div>
          <code className="text-xs text-slate-800 font-mono break-all">
            {finding.evidenceLocator}
          </code>
        </div>

        {/* Recommended Action */}
        <div className="bg-blue-50/60 rounded-lg border border-blue-200/60 p-3 text-xs text-blue-900">
          <strong className="font-semibold block mb-0.5">Recommended Rectification Action:</strong>
          <span>{finding.recommendedAction}</span>
        </div>

        {/* Officer Review History if present */}
        {finding.officerNotes && (
          <div className="mt-3 p-3 bg-amber-50/70 border border-amber-200 rounded-lg text-xs">
            <div className="font-semibold text-amber-950 flex items-center gap-1.5 mb-1">
              <MessageSquare className="w-3.5 h-3.5 text-amber-700" />
              <span>Officer Note ({finding.reviewedBy || 'AICTE Officer'}):</span>
            </div>
            <p className="text-amber-900">{finding.officerNotes}</p>
          </div>
        )}
      </div>

      {/* Officer Decision Toolbar */}
      {isOfficer && onAction && (
        <div className="px-5 py-3 border-t border-slate-100 bg-slate-50/70 flex flex-wrap items-center justify-between gap-3">
          <span className="text-xs text-slate-500 font-medium">
            Human-in-the-Loop Action Required
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={() => { setSelectedAction('Confirmed by Officer'); setShowActionModal(true); }}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-2xs transition-all flex items-center gap-1"
            >
              <CheckCircle className="w-3.5 h-3.5" />
              <span>Confirm Finding</span>
            </button>

            <button
              onClick={() => { setSelectedAction('Clarification Requested'); setShowActionModal(true); }}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-2xs transition-all flex items-center gap-1"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Ask Clarification</span>
            </button>

            <button
              onClick={() => { setSelectedAction('Escalated for EVC'); setShowActionModal(true); }}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-amber-600 hover:bg-amber-700 text-white shadow-2xs transition-all flex items-center gap-1"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Escalate to EVC</span>
            </button>

            <button
              onClick={() => { setSelectedAction('Dismissed with Justification'); setShowActionModal(true); }}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-200 hover:bg-slate-300 text-slate-700 transition-all flex items-center gap-1"
            >
              <XCircle className="w-3.5 h-3.5" />
              <span>Dismiss</span>
            </button>
          </div>
        </div>
      )}

      {/* Action Dialog */}
      {showActionModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <h3 className="text-base font-bold text-slate-900 mb-1">
              Record Regulatory Action: {selectedAction}
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Enter official rationale and instructions for {finding.id}. This action will be cryptographically recorded in the hash-chained audit trail.
            </p>

            <div className="mb-4">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Officer Notes & Justification <span className="text-rose-500">*</span>
              </label>
              <textarea
                value={officerNotes}
                onChange={(e) => setOfficerNotes(e.target.value)}
                placeholder="State regulatory reason, required evidence for institution or instructions for EVC inspection team..."
                rows={4}
                className="w-full text-xs p-3 rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:border-transparent text-slate-800"
              />
            </div>

            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => setShowActionModal(false)}
                className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleExecuteAction}
                disabled={isSubmitting || !officerNotes.trim()}
                className="px-4 py-2 rounded-lg text-xs font-semibold bg-[#002b66] hover:bg-[#001f4d] text-white transition-colors disabled:opacity-50 flex items-center gap-1.5"
              >
                {isSubmitting ? 'Recording...' : 'Commit Regulatory Action'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
