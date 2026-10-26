'use client';

import React, { useState, useEffect, useCallback, use } from 'react';
import Link from 'next/link';
import DemoBanner from '@/components/DemoBanner';
import Navbar from '@/components/Navbar';
import ReadinessGauge from '@/components/ReadinessGauge';
import StatusChip from '@/components/StatusChip';
import DocumentViewerModal from '@/components/DocumentViewerModal';
import InfrastructureEvidencePanel from '@/components/InfrastructureEvidencePanel';
import { 
  Application, 
  DocumentRecord, 
  DocumentType, 
  ReadinessBreakdown, 
  Finding,
  InfrastructureEvidence
} from '@/types';
import { 
  Building2, 
  FileText, 
  Upload, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  Eye, 
  RefreshCw, 
  Send, 
  ArrowLeft,
  XCircle,
  Clock,
  Fingerprint
} from 'lucide-react';

export default function InstitutionApplicationDetailPage({
  params
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params);

  const [application, setApplication] = useState<Application | null>(null);
  const [documents, setDocuments] = useState<DocumentRecord[]>([]);
  const [readiness, setReadiness] = useState<ReadinessBreakdown | null>(null);
  const [findings, setFindings] = useState<Finding[]>([]);
  const [infrastructureEvidence, setInfrastructureEvidence] = useState<InfrastructureEvidence[]>([]);
  const [selectedDoc, setSelectedDoc] = useState<DocumentRecord | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Upload Form State
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadDocType, setUploadDocType] = useState<DocumentType>('Fire Safety Certificate');
  const [uploadTitle, setUploadTitle] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  // Rectification Flow State (Item 5)
  const [showRectifyModal, setShowRectifyModal] = useState(false);
  const [rectifyRuleId, setRectifyRuleId] = useState('');
  const [rectifyRuleName, setRectifyRuleName] = useState('');
  const [rectifyDocType, setRectifyDocType] = useState<DocumentType>('Fire Safety Certificate');
  const [rectifyExplanation, setRectifyExplanation] = useState('');
  const [rectifyFileName, setRectifyFileName] = useState('');
  const [isRectifying, setIsRectifying] = useState(false);
  const [rectificationFeedback, setRectificationFeedback] = useState<{
    beforeStatus: string;
    afterStatus: string;
    beforeReadiness: number;
    afterReadiness: number;
  } | null>(null);

  const handleRectifySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rectifyExplanation.trim()) {
      alert('Formal explanation is required to rectify deficiency.');
      return;
    }
    setIsRectifying(true);
    try {
      const res = await fetch(`/api/applications/${id}/rectify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ruleId: rectifyRuleId,
          documentType: rectifyDocType,
          explanation: rectifyExplanation,
          replacementFileName: rectifyFileName || `${rectifyDocType.replace(/\s+/g, '_')}_Renewal_2026.pdf`
        })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setShowRectifyModal(false);
        setRectifyExplanation('');
        setRectifyFileName('');
        setRectificationFeedback(data.beforeAfter);
        await loadData();
      } else {
        alert(data.error || 'Failed to submit rectification.');
      }
    } catch (e) {
      console.error(e);
      alert('Error submitting rectification.');
    } finally {
      setIsRectifying(false);
    }
  };

  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/applications/${id}`);
      const data = await res.json();
      if (data.application) {
        setApplication(data.application);
        setDocuments(data.documents || []);
        setReadiness(data.readiness || null);
        setFindings(data.findings || []);
        setInfrastructureEvidence(data.infrastructureEvidence || []);
      }
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleUploadDocument = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append('applicationId', id);
      formData.append('documentType', uploadDocType);
      formData.append('title', uploadTitle || `${uploadDocType} Rectification`);
      if (selectedFile) {
        formData.append('file', selectedFile);
      }

      const res = await fetch('/api/documents/upload', {
        method: 'POST',
        body: formData
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setShowUploadModal(false);
        setSelectedFile(null);
        setUploadTitle('');
        await loadData();
      } else {
        alert(data.error || 'Document upload failed. Please verify format and size.');
      }
    } catch (e) {
      console.error(e);
      alert('Network or server error during upload.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleTriggerVerify = async (docId: string) => {
    try {
      const res = await fetch(`/api/documents/${docId}/verify`, { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        await loadData();
        if (selectedDoc?.id === docId) {
          setSelectedDoc(data.updatedDocument);
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleSaveFieldCorrection = async (docId: string, fieldId: string, newValue: string) => {
    // Simulated field correction API
    alert(`Extracted field updated to "${newValue}". Document marked manually corrected and logged in audit trail.`);
    await loadData();
  };

  const handleResubmit = async () => {
    try {
      const res = await fetch(`/api/applications/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'Resubmitted' })
      });
      const data = await res.json();
      if (data.success) {
        alert('Application has been resubmitted with rectified documents for AICTE scrutiny.');
        await loadData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  if (isLoading || !application) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 text-[#002b66] animate-spin mx-auto mb-2" />
          <span className="text-xs text-slate-500 font-semibold">Loading Application Dossier...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <DemoBanner />
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Top Header Card */}
        <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <Link
              href="/institution"
              className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 mb-2"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Dashboard</span>
            </Link>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-slate-900">{application.applicationNumber}</h1>
              <StatusChip status={application.status} size="md" />
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              {application.institutionName} • Type: <strong>{application.type}</strong> • Session {application.academicYear}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Link
              href={`/institution/applications/${application.id}/validation-report`}
              className="px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold border border-slate-300 shadow-2xs flex items-center gap-1.5 transition-colors"
            >
              <FileText className="w-4 h-4 text-blue-700" />
              <span>Validation Report (Printable)</span>
            </Link>

            <button
              onClick={() => setShowUploadModal(true)}
              className="px-4 py-2.5 bg-[#002b66] hover:bg-[#001f4d] text-white rounded-xl text-xs font-bold shadow-2xs hover:shadow-md transition-all flex items-center gap-1.5"
            >
              <Upload className="w-4 h-4" />
              <span>Upload Document</span>
            </button>

            {application.status === 'Deficiency Communicated' && (
              <button
                onClick={handleResubmit}
                className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-2xs hover:shadow-md transition-all flex items-center gap-1.5"
              >
                <Send className="w-4 h-4" />
                <span>Resubmit Rectified Application</span>
              </button>
            )}
          </div>
        </div>

        {/* Rectification Feedback Banner (Item 5) */}
        {rectificationFeedback && (
          <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-300 text-xs text-emerald-950 flex items-start justify-between gap-3 shadow-xs">
            <div>
              <div className="font-bold flex items-center gap-1.5 text-emerald-900 mb-1">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Deficiency Rectification Submitted & Validation Re-evaluated</span>
              </div>
              <p className="text-emerald-800">
                Document status: <span className="font-bold line-through">{rectificationFeedback.beforeStatus}</span> &rarr; <span className="font-bold text-emerald-900">{rectificationFeedback.afterStatus}</span>.
                Readiness score: <span className="font-mono font-bold">{rectificationFeedback.beforeReadiness}/100</span> &rarr; <span className="font-mono font-bold text-emerald-900">{rectificationFeedback.afterReadiness}/100</span>.
                Logged in audit trail.
              </p>
            </div>
            <button 
              onClick={() => setRectificationFeedback(null)}
              className="text-emerald-700 hover:text-emerald-900 font-bold text-base leading-none"
            >
              &times;
            </button>
          </div>
        )}

        {/* Readiness Score Component */}
        {readiness && (
          <div className="mb-8">
            <ReadinessGauge readiness={readiness} />
          </div>
        )}

        {/* Deficiency & Rectification Workflow Banner */}
        {readiness && readiness.deficiencies.length > 0 && (
          <div className="bg-amber-50 border border-amber-300 rounded-2xl p-5 mb-8 shadow-xs">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-5 h-5 text-amber-700" />
              <h3 className="font-bold text-sm text-amber-950">
                Action Required: {readiness.deficiencies.length} Statutory Deficiency Found
              </h3>
            </div>
            <p className="text-xs text-amber-900 mb-4">
              To achieve approval readiness, address each deficiency by uploading updated regulatory artifacts or updating extracted declarations:
            </p>

            <div className="space-y-2.5">
              {readiness.deficiencies.map((def, idx) => (
                <div key={idx} className="bg-white rounded-xl p-3.5 border border-amber-200 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-800">
                        {def.ruleId}
                      </span>
                      <StatusChip status={def.severity} size="sm" />
                      <span className="font-bold text-slate-900">{def.ruleName}</span>
                    </div>
                    <p className="text-slate-700">{def.message}</p>
                    <p className="text-[11px] text-blue-700 mt-1 font-medium">Guide: {def.recommendedAction}</p>
                  </div>

                  <button
                    onClick={() => {
                      setRectifyRuleId(def.ruleId);
                      setRectifyRuleName(def.ruleName);
                      if (def.documentType) setRectifyDocType(def.documentType);
                      setRectifyFileName(`${(def.documentType || 'Document').replace(/\s+/g, '_')}_Rectified_Renewal.pdf`);
                      setShowRectifyModal(true);
                    }}
                    className="px-3.5 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 flex-shrink-0 shadow-2xs hover:shadow-sm transition-all"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Provide Explanation & Rectify</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Document Ingestion & Verification Locker */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden mb-8">
          <div className="p-5 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-600" />
                <span>Uploaded Documents & Verification Passports ({documents.length})</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Every document is hashed with SHA-256 and subjected to fail-closed government verification.
              </p>
            </div>
            <button
              onClick={() => setShowUploadModal(true)}
              className="text-xs font-bold text-blue-700 hover:text-blue-900 flex items-center gap-1"
            >
              <span>+ Add Document</span>
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {documents.map((doc) => (
              <div
                key={doc.id}
                className="p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hover:bg-slate-50/70 transition-colors"
              >
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600 mt-0.5 flex-shrink-0 border border-slate-200">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-bold text-slate-900">{doc.title}</h4>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">
                        {doc.documentType}
                      </span>
                      {doc.versions && doc.versions.length > 0 && (
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-blue-100 text-blue-800 font-bold border border-blue-200">
                          v{doc.versions.length + 1} (Rectified)
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-500 mt-1">
                      <span>{doc.fileName}</span>
                      <span>•</span>
                      <span>{(doc.fileSize / 1024 / 1024).toFixed(2)} MB</span>
                      <span>•</span>
                      <span className="font-mono text-slate-400">SHA: {doc.sha256Hash.substring(0, 14)}...</span>
                      <span>•</span>
                      <span>{doc.extractedFields.length} OCR Fields</span>
                    </div>

                    {/* Forensic anomaly flag */}
                    {doc.forensicMetadata.anomalyIndicators.length > 0 && (
                      <div className="mt-2 text-[11px] text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200 inline-flex items-center gap-1">
                        <Fingerprint className="w-3.5 h-3.5" />
                        <span>Forensic Anomaly: {doc.forensicMetadata.anomalyIndicators[0]}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
                  <StatusChip status={doc.verificationStatus} size="sm" />

                  <button
                    onClick={() => setSelectedDoc(doc)}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Inspect Passport</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Infrastructure Evidence & Vision-Lite Automated Checks (PS Item 6) */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
          <InfrastructureEvidencePanel
            applicationId={id}
            evidence={infrastructureEvidence}
            canUpload={true}
            onEvidenceUploaded={loadData}
          />
        </div>

      </main>

      {/* Document Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <h3 className="text-base font-bold text-slate-900 mb-1">Upload Regulatory Document</h3>
            <p className="text-xs text-slate-500 mb-4">
              File will be assigned a tamper-evident SHA-256 hash, extracted with OCR, and checked for forensic integrity.
            </p>

            <form onSubmit={handleUploadDocument} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Document Type
                </label>
                <select
                  value={uploadDocType}
                  onChange={(e) => setUploadDocType(e.target.value as DocumentType)}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 text-slate-900 font-semibold"
                >
                  <option value="Fire Safety Certificate">Fire Safety Certificate (NOC)</option>
                  <option value="Land Deed">Land Ownership or Lease Deed</option>
                  <option value="Affidavit">Composite Notarized Affidavit</option>
                  <option value="Occupancy Certificate">Occupancy / Completion Certificate</option>
                  <option value="Structural Stability Certificate">Structural Stability Certificate</option>
                  <option value="Building Plan">Building Master Plan</option>
                  <option value="Faculty Appointment Letter">Faculty Appointment Orders</option>
                  <option value="Faculty Qualification Certificate">Faculty Degree / Ph.D. Certificate</option>
                  <option value="Audited Financial Statement">Audited Accounts & Balance Sheet</option>
                  <option value="Trust Deed">Trust / Society Registration Deed</option>
                  <option value="NOC">State Govt / University NOC</option>
                  <option value="Prior EoA">Prior Academic Year AICTE EoA</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Document Title / Description
                </label>
                <input
                  type="text"
                  value={uploadTitle}
                  onChange={(e) => setUploadTitle(e.target.value)}
                  placeholder="e.g. Renewed Fire Safety NOC 2026-2027"
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Select PDF / Image File
                </label>
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) => setSelectedFile(e.target.files ? e.target.files[0] : null)}
                  className="w-full text-xs p-2 rounded-xl border border-dashed border-slate-300 text-slate-700 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
                <span className="text-[11px] text-slate-400 mt-1 block">Supported formats: PDF, JPG, PNG (Max 10 MB)</span>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUploading}
                  className="px-5 py-2 rounded-lg text-xs font-bold bg-[#002b66] hover:bg-[#001f4d] text-white shadow-2xs flex items-center gap-1.5 disabled:opacity-50"
                >
                  {isUploading ? 'Ingesting & Hashing...' : 'Upload & Compute Hash'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Rectification Modal (Item 5) */}
      {showRectifyModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-800">
                {rectifyRuleId}
              </span>
              <h3 className="text-base font-bold text-slate-900">Deficiency Rectification Submission</h3>
            </div>
            <p className="text-xs text-slate-500 mb-4">
              Submit your formal institutional explanation and upload a replacement document. All versions, re-evaluated readiness, and before/after statuses will be recorded in the audit trail.
            </p>

            <form onSubmit={handleRectifySubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Target Statutory Requirement
                </label>
                <div className="text-xs font-semibold text-slate-800 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                  {rectifyRuleName} ({rectifyDocType})
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Institutional Explanation & Justification <span className="text-rose-500">*</span>
                </label>
                <textarea
                  required
                  rows={3}
                  value={rectifyExplanation}
                  onChange={(e) => setRectifyExplanation(e.target.value)}
                  placeholder="Provide detailed statutory explanation (e.g. Chief Fire Officer renewed certificate on 2026-01-28; inspection compliance fulfilled)..."
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 text-slate-900 leading-relaxed focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Replacement Document Artifact Name / Scan
                </label>
                <input
                  type="text"
                  value={rectifyFileName}
                  onChange={(e) => setRectifyFileName(e.target.value)}
                  placeholder="e.g. Sunrise_Fire_Safety_NOC_Renewal_2026.pdf"
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 text-slate-900"
                />
                <span className="text-[11px] text-slate-400 mt-1 block">
                  A replacement cryptographic SHA-256 hash will be generated and archived as a new version.
                </span>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setShowRectifyModal(false)}
                  className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isRectifying}
                  className="px-5 py-2 rounded-lg text-xs font-bold bg-amber-600 hover:bg-amber-700 text-white shadow-2xs flex items-center gap-1.5 disabled:opacity-50"
                >
                  {isRectifying ? 'Submitting & Re-validating...' : 'Submit Rectification & Re-validate'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Deep Document Viewer Modal */}
      {selectedDoc && (
        <DocumentViewerModal
          document={selectedDoc}
          onClose={() => setSelectedDoc(null)}
          onTriggerVerify={handleTriggerVerify}
          onSaveFieldCorrection={handleSaveFieldCorrection}
        />
      )}
    </div>
  );
}
