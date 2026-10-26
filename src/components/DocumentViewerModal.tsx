'use client';

import React, { useState } from 'react';
import { DocumentRecord, ExtractedField, VerificationStatus } from '@/types';
import StatusChip from './StatusChip';
import { 
  X, 
  FileText, 
  ShieldCheck, 
  Fingerprint, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  RefreshCw, 
  Edit2, 
  Check, 
  Download,
  AlertOctagon,
  Eye,
  Hash,
  Database
} from 'lucide-react';

interface DocumentViewerModalProps {
  document: DocumentRecord;
  onClose: () => void;
  onTriggerVerify?: (docId: string) => Promise<void>;
  onSaveFieldCorrection?: (docId: string, fieldId: string, newValue: string) => Promise<void>;
}

export default function DocumentViewerModal({
  document,
  onClose,
  onTriggerVerify,
  onSaveFieldCorrection
}: DocumentViewerModalProps) {
  const [activeTab, setActiveTab] = useState<'passport' | 'forensics' | 'fields' | 'preview'>('passport');
  const [editingFieldId, setEditingFieldId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  const handleStartEdit = (field: ExtractedField) => {
    setEditingFieldId(field.id);
    setEditValue(field.fieldValue);
  };

  const handleSaveEdit = async (fieldId: string) => {
    if (!onSaveFieldCorrection) return;
    await onSaveFieldCorrection(document.id, fieldId, editValue);
    setEditingFieldId(null);
  };

  const handleVerify = async () => {
    if (!onTriggerVerify) return;
    setIsVerifying(true);
    try {
      await onTriggerVerify(document.id);
    } finally {
      setIsVerifying(false);
    }
  };

  const forensic = document.forensicMetadata;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-5xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="px-6 py-4 bg-[#002b66] text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center text-amber-400">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base text-white">{document.title}</h3>
                <span className="text-[11px] px-2 py-0.5 rounded bg-white/15 text-blue-200 font-mono">
                  {document.documentType}
                </span>
              </div>
              <p className="text-xs text-blue-200 flex items-center gap-2 mt-0.5">
                <span>{document.fileName}</span>
                <span>•</span>
                <span>{(document.fileSize / 1024 / 1024).toFixed(2)} MB</span>
                <span>•</span>
                <span>Version {document.versions.length}</span>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center border-b border-slate-200 px-6 bg-slate-50 gap-2 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('passport')}
            className={`py-3 px-3 border-b-2 flex items-center gap-2 transition-all ${
              activeTab === 'passport' 
                ? 'border-[#002b66] text-[#002b66]' 
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Verification Passport</span>
            <StatusChip status={document.verificationStatus} size="sm" />
          </button>

          <button
            onClick={() => setActiveTab('forensics')}
            className={`py-3 px-3 border-b-2 flex items-center gap-2 transition-all ${
              activeTab === 'forensics' 
                ? 'border-[#002b66] text-[#002b66]' 
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Fingerprint className="w-4 h-4" />
            <span>Document Forensics</span>
            {forensic.anomalyIndicators.length > 0 && (
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('fields')}
            className={`py-3 px-3 border-b-2 flex items-center gap-2 transition-all ${
              activeTab === 'fields' 
                ? 'border-[#002b66] text-[#002b66]' 
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Database className="w-4 h-4" />
            <span>Extracted Fields & OCR ({document.extractedFields.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('preview')}
            className={`py-3 px-3 border-b-2 flex items-center gap-2 transition-all ${
              activeTab === 'preview' 
                ? 'border-[#002b66] text-[#002b66]' 
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Eye className="w-4 h-4" />
            <span>Document Preview</span>
          </button>
        </div>

        {/* Tab Contents */}
        <div className="p-6 overflow-y-auto flex-1">
          {/* 1. VERIFICATION PASSPORT TAB */}
          {activeTab === 'passport' && (
            <div className="space-y-6">
              <div className="bg-slate-50 rounded-xl p-5 border border-slate-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                  <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                    Official Verification Status
                  </div>
                  <div className="flex items-center gap-3">
                    <StatusChip status={document.verificationStatus} size="lg" />
                    <span className="text-xs text-slate-600 font-medium">
                      Source: {document.verificationSource || 'Pending Verification'}
                    </span>
                  </div>
                </div>

                {onTriggerVerify && (
                  <button
                    onClick={handleVerify}
                    disabled={isVerifying}
                    className="px-4 py-2 bg-[#002b66] hover:bg-[#001f4d] text-white rounded-lg text-xs font-semibold flex items-center gap-2 shadow-2xs transition-all disabled:opacity-50"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isVerifying ? 'animate-spin' : ''}`} />
                    <span>{isVerifying ? 'Querying Source...' : 'Query Government Mock Adapter'}</span>
                  </button>
                )}
              </div>

              {/* Passport Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border border-slate-200 rounded-xl p-4 bg-white space-y-3 text-xs">
                  <div className="font-bold text-slate-900 border-b pb-2 flex items-center gap-2">
                    <Hash className="w-4 h-4 text-blue-600" />
                    <span>Cryptographic Identity</span>
                  </div>
                  <div>
                    <div className="text-[11px] font-semibold text-slate-500">SHA-256 Digest</div>
                    <code className="text-xs font-mono text-slate-800 bg-slate-100 p-1.5 rounded block mt-0.5 break-all">
                      {document.sha256Hash}
                    </code>
                  </div>
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <div>
                      <div className="text-[11px] font-semibold text-slate-500">Document ID</div>
                      <span className="font-mono text-slate-700">{document.id}</span>
                    </div>
                    <div>
                      <div className="text-[11px] font-semibold text-slate-500">Page Count</div>
                      <span className="font-semibold text-slate-700">{forensic.pageCount} Pages</span>
                    </div>
                  </div>
                </div>

                <div className="border border-slate-200 rounded-xl p-4 bg-white space-y-3 text-xs">
                  <div className="font-bold text-slate-900 border-b pb-2 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>Fail-Closed Governance Protocol</span>
                  </div>
                  <p className="text-slate-600 leading-relaxed">
                    AICTE Sentinel operates on an absolute <strong>fail-closed model</strong>. Documents without affirmative digital cryptographic confirmation from authorized source registries are routed strictly to human officer scrutiny.
                  </p>
                  <div className="bg-amber-50 rounded-lg p-2.5 border border-amber-200 text-amber-900 text-[11px]">
                    <strong>Statutory Rule:</strong> System will never autonomously approve or reject an institutional claim.
                  </div>
                </div>
              </div>

              {/* Verification Attempts Ledger */}
              <div className="border border-slate-200 rounded-xl p-5 bg-white space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                      <Clock className="w-4 h-4 text-blue-600" />
                      <span>Verification Attempts & Protocol History</span>
                    </h4>
                    <p className="text-slate-500 text-xs">
                      Cryptographic attempt history against external registries and simulated clearinghouses.
                    </p>
                  </div>
                  <span className="text-xs font-mono bg-slate-100 text-slate-700 px-2.5 py-1 rounded-full font-semibold">
                    {(document.verificationAttempts?.length || 1)} Attempt Logged
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-50 text-slate-700 border-b border-slate-200 font-semibold">
                        <th className="py-2.5 px-3">Timestamp (UTC)</th>
                        <th className="py-2.5 px-3">Adapter Used</th>
                        <th className="py-2.5 px-3">Request / Response Summary</th>
                        <th className="py-2.5 px-3">Latency</th>
                        <th className="py-2.5 px-3">Resulting Status</th>
                        <th className="py-2.5 px-3">Officer Review Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {(document.verificationAttempts && document.verificationAttempts.length > 0
                        ? document.verificationAttempts
                        : [
                            {
                              id: `ATT-${document.id}`,
                              documentId: document.id,
                              adapterName: document.verificationSource || 'DigiLocker Mock Adapter (simulated)',
                              attemptTimestamp: document.updatedAt || document.createdAt,
                              requestPayload: { docId: document.id, type: document.documentType },
                              requestSummary: `QUERY ${document.verificationSource || 'DigiLocker'} [${document.documentType}]`,
                              responseSummary: `Source Status: ${document.verificationStatus === 'Verified' ? 'AUTHENTIC' : document.verificationStatus}`,
                              latencyMs: document.verificationStatus === 'Source Unavailable' ? 5240 : 280,
                              responseStatus: document.verificationStatus === 'Verified' ? 'Verified' : document.verificationStatus === 'Expired' ? 'Expired' : document.verificationStatus === 'Mismatch Detected' ? 'Mismatch' : 'Source Unavailable',
                              rawResponse: { status: document.verificationStatus },
                              officerReviewStatus: document.verificationStatus === 'Verified' ? 'Accepted (Automated Pass)' : 'Pending Officer Review (Fail-Closed)'
                            }
                          ]
                      ).map((att, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-2.5 px-3 font-mono text-[11px] text-slate-600 whitespace-nowrap">
                            {new Date(att.attemptTimestamp).toISOString().replace('T', ' ').substring(0, 19)}
                          </td>
                          <td className="py-2.5 px-3 font-medium text-slate-900">
                            {att.adapterName}
                          </td>
                          <td className="py-2.5 px-3 max-w-xs">
                            <div className="font-mono text-[10px] text-slate-500 truncate" title={att.requestSummary}>
                              {att.requestSummary || 'Payload submitted to registry gateway'}
                            </div>
                            <div className={`text-[11px] font-semibold ${att.responseStatus === 'Source Unavailable' || att.responseStatus === 'Timeout / Degraded' ? 'text-amber-700' : att.responseStatus === 'Mismatch' ? 'text-rose-700' : 'text-slate-700'}`}>
                              {att.responseSummary || JSON.stringify(att.rawResponse)}
                            </div>
                          </td>
                          <td className="py-2.5 px-3 font-mono text-[11px]">
                            <span className={`px-2 py-0.5 rounded font-bold ${att.latencyMs && att.latencyMs > 2000 ? 'bg-amber-100 text-amber-900 border border-amber-300' : 'bg-slate-100 text-slate-700'}`}>
                              {att.latencyMs ? `${att.latencyMs}ms` : '280ms'}
                            </span>
                          </td>
                          <td className="py-2.5 px-3">
                            <StatusChip status={att.responseStatus === 'Mismatch' ? 'Mismatch Detected' : (att.responseStatus as VerificationStatus)} size="sm" />
                          </td>
                          <td className="py-2.5 px-3">
                            <span className="font-medium text-[11px] text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                              {att.officerReviewStatus || 'Pending Officer Review'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* 2. FORENSICS TAB */}
          {activeTab === 'forensics' && (
            <div className="space-y-6">
              {/* Alert Banner if Anomalies Found */}
              {forensic.anomalyIndicators.length > 0 ? (
                <div className="bg-rose-50 border border-rose-300 rounded-xl p-4 flex items-start gap-3">
                  <AlertOctagon className="w-5 h-5 text-rose-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="text-sm font-bold text-rose-950">Forensic Anomaly Detected in PDF Structure</h4>
                    <ul className="mt-1 list-disc list-inside text-xs text-rose-800 space-y-1">
                      {forensic.anomalyIndicators.map((item, idx) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ) : (
                <div className="bg-emerald-50 border border-emerald-300 rounded-xl p-4 flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                  <div>
                    <h4 className="text-sm font-bold text-emerald-950">No Structural or Metadata Anomaly Detected</h4>
                    <p className="text-xs text-emerald-800 mt-0.5">
                      PDF binary structure, font streams, and metadata signatures conform to authentic issuing system specifications.
                    </p>
                  </div>
                </div>
              )}

              {/* Metadata Attributes */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                <div className="bg-slate-50 rounded-xl p-3 border border-slate-200 text-xs">
                  <span className="text-[11px] font-semibold text-slate-500 block mb-1">PDF Producer</span>
                  <span className="font-semibold text-slate-800">{forensic.pdfProducer || 'N/A'}</span>
                </div>

                <div className="bg-slate-50 rounded-xl p-3 border border-slate-200 text-xs">
                  <span className="text-[11px] font-semibold text-slate-500 block mb-1">Creation Date</span>
                  <span className="font-semibold text-slate-800">{forensic.creationDate || 'Not declared'}</span>
                </div>

                <div className="bg-slate-50 rounded-xl p-3 border border-slate-200 text-xs">
                  <span className="text-[11px] font-semibold text-slate-500 block mb-1">Modification Date</span>
                  <span className="font-semibold text-slate-800">{forensic.modificationDate || 'Unmodified'}</span>
                </div>

                <div className="bg-slate-50 rounded-xl p-3 border border-slate-200 text-xs">
                  <span className="text-[11px] font-semibold text-slate-500 block mb-1">Incremental Updates</span>
                  <span className={`font-semibold ${forensic.incrementalSavesDetected ? 'text-rose-600 font-bold' : 'text-slate-800'}`}>
                    {forensic.incrementalSavesDetected ? 'Yes (Post-Signature Edits)' : 'None (Single Generation)'}
                  </span>
                </div>

                <div className="bg-slate-50 rounded-xl p-3 border border-slate-200 text-xs">
                  <span className="text-[11px] font-semibold text-slate-500 block mb-1">Perceptual Fingerprint</span>
                  <span className="font-mono text-slate-800">{forensic.nearDuplicateHash || 'FP-00000000'}</span>
                </div>

                <div className="bg-slate-50 rounded-xl p-3 border border-slate-200 text-xs">
                  <span className="text-[11px] font-semibold text-slate-500 block mb-1">Tampering Risk Score</span>
                  <span className={`font-bold ${forensic.tamperingConfidence > 0.5 ? 'text-rose-600' : 'text-emerald-600'}`}>
                    {Math.round(forensic.tamperingConfidence * 100)}% Confidence
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* 3. EXTRACTED FIELDS TAB */}
          {activeTab === 'fields' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-slate-600">
                <span>Extracted via AI OCR & regex parser. Review and correct any misrecognized characters.</span>
                <span className="font-semibold text-slate-800">Confidence Threshold: 80%</span>
              </div>

              <div className="border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                    <tr>
                      <th className="px-4 py-3">Field Label</th>
                      <th className="px-4 py-3">Extracted Value</th>
                      <th className="px-4 py-3 text-center">Confidence</th>
                      <th className="px-4 py-3 text-center">Page</th>
                      <th className="px-4 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {document.extractedFields.map((field) => (
                      <tr key={field.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="px-4 py-3 font-semibold text-slate-900">
                          {field.fieldLabel}
                          <span className="block font-mono text-[10px] text-slate-400 font-normal">
                            {field.fieldKey}
                          </span>
                        </td>
                        <td className="px-4 py-3 font-medium text-slate-800">
                          {editingFieldId === field.id ? (
                            <div className="flex items-center gap-2">
                              <input
                                type="text"
                                value={editValue}
                                onChange={(e) => setEditValue(e.target.value)}
                                className="px-2 py-1 rounded border border-blue-500 text-xs w-full text-slate-900"
                                autoFocus
                              />
                              <button
                                onClick={() => handleSaveEdit(field.id)}
                                className="p-1 rounded bg-emerald-600 text-white hover:bg-emerald-700"
                              >
                                <Check className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2">
                              <span>{field.fieldValue}</span>
                              {field.isManuallyCorrected && (
                                <span className="text-[10px] bg-blue-100 text-blue-800 px-1.5 py-0.2 rounded font-semibold">
                                  Manually Verified
                                </span>
                              )}
                            </div>
                          )}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className={`font-semibold ${field.confidence < 0.7 ? 'text-rose-600' : 'text-slate-700'}`}>
                            {Math.round(field.confidence * 100)}%
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center text-slate-500">
                          p. {field.pageNumber || 1}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <button
                            onClick={() => handleStartEdit(field)}
                            className="text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1 ml-auto"
                          >
                            <Edit2 className="w-3 h-3" />
                            <span>Edit</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 4. DOCUMENT PREVIEW TAB */}
          {activeTab === 'preview' && (
            <div className="space-y-4">
              <div className="bg-slate-100 rounded-xl p-8 border border-slate-200 min-h-[360px] flex flex-col items-center justify-center text-center">
                <FileText className="w-16 h-16 text-slate-400 mb-3" />
                <h4 className="font-bold text-slate-800 text-sm">{document.fileName}</h4>
                <p className="text-xs text-slate-500 max-w-md mt-1 mb-4">
                  Simulated secure PDF document viewer rendered with AICTE forensic overlay watermark.
                </p>
                <div className="flex items-center gap-3">
                  <a
                    href="#"
                    onClick={(e) => { e.preventDefault(); alert(`Simulated downloading ${document.fileName} with SHA-256 seal.`); }}
                    className="px-4 py-2 bg-[#002b66] text-white rounded-lg text-xs font-semibold flex items-center gap-2 shadow-2xs hover:bg-[#001f4d]"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download Signed Copy</span>
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>AICTE Sentinel Evidence Locker • Tamper-Evident Document Version {document.versions.length}</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
