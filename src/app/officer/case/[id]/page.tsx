'use client';

import React, { useState, useEffect, useCallback, use } from 'react';
import Link from 'next/link';
import DemoBanner from '@/components/DemoBanner';
import Navbar from '@/components/Navbar';
import ReadinessGauge from '@/components/ReadinessGauge';
import StatusChip from '@/components/StatusChip';
import FindingCard from '@/components/FindingCard';
import DocumentViewerModal from '@/components/DocumentViewerModal';
import { 
  Application, 
  DocumentRecord, 
  Finding, 
  ReadinessBreakdown, 
  FindingStatus 
} from '@/types';
import { 
  FileSearch, 
  Radar, 
  FileText, 
  ShieldCheck, 
  AlertTriangle, 
  ClipboardCheck, 
  ArrowLeft, 
  Download, 
  RefreshCw, 
  Send,
  Eye,
  CheckCircle2,
  Clock,
  Printer
} from 'lucide-react';

export default function OfficerCaseFilePage({
  params
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params);

  const [application, setApplication] = useState<Application | null>(null);
  const [documents, setDocuments] = useState<DocumentRecord[]>([]);
  const [findings, setFindings] = useState<Finding[]>([]);
  const [readiness, setReadiness] = useState<ReadinessBreakdown | null>(null);
  const [selectedDoc, setSelectedDoc] = useState<DocumentRecord | null>(null);
  const [activeTab, setActiveTab] = useState<'findings' | 'documents' | 'summary'>('findings');
  const [isLoading, setIsLoading] = useState(true);

  const loadCaseData = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/applications/${id}`);
      const data = await res.json();
      if (data.application) {
        setApplication(data.application);
        setDocuments(data.documents || []);
        setFindings(data.findings || []);
        setReadiness(data.readiness || null);
      }
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadCaseData();
  }, [loadCaseData]);

  const handleFindingAction = async (findingId: string, action: FindingStatus, notes?: string) => {
    try {
      const res = await fetch(`/api/findings/${findingId}/action`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: action,
          officerNotes: notes,
          officerName: 'Smt. Priyadarshini Rao'
        })
      });

      const data = await res.json();
      if (data.success) {
        await loadCaseData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleTriggerVerify = async (docId: string) => {
    try {
      const res = await fetch(`/api/documents/${docId}/verify`, { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        await loadCaseData();
        if (selectedDoc?.id === docId) {
          setSelectedDoc(data.updatedDocument);
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  if (isLoading || !application) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center font-sans">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 text-[#002b66] animate-spin mx-auto mb-2" />
          <span className="text-xs text-slate-500 font-semibold">Decrypting Approval Case File...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <DemoBanner />
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Navigation & Case Action Bar */}
        <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <Link
              href="/officer"
              className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 mb-2"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Scrutiny Queue</span>
            </Link>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-slate-900">{application.applicationNumber}</h1>
              <StatusChip status={application.status} size="md" />
              <StatusChip status={application.riskTier} size="md" />
              <span className="bg-slate-100 text-slate-700 text-[10px] font-mono font-bold px-2.5 py-1 rounded-full border border-slate-300">
                Evaluation As-Of: 01 Feb 2026
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Case Docket: <strong>{application.institutionName}</strong> • {application.type.replace('_', ' ')} • Session {application.academicYear}
            </p>
          </div>

          {/* Officer Primary Action Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <Link
              href={`/officer/radar?institution=${encodeURIComponent(application.institutionName)}`}
              className="px-3.5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold shadow-2xs flex items-center gap-1.5 transition-colors"
            >
              <Radar className="w-4 h-4" />
              <span>View in Collusion Radar</span>
            </Link>

            <Link
              href={`/officer/scrutiny/${application.id}`}
              className="px-3.5 py-2 bg-[#002b66] hover:bg-[#001f4d] text-white rounded-xl text-xs font-bold shadow-2xs flex items-center gap-1.5 transition-colors"
            >
              <Printer className="w-4 h-4" />
              <span>Generate Scrutiny Report</span>
            </Link>

            <Link
              href="/evc"
              className="px-3.5 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold shadow-2xs flex items-center gap-1.5 transition-colors"
            >
              <ClipboardCheck className="w-4 h-4" />
              <span>Trigger EVC Brief</span>
            </Link>
          </div>
        </div>

        {/* Case Metrics Bar */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs">
            <span className="text-[11px] font-semibold text-slate-400 block mb-0.5">Readiness Score</span>
            <div className={`text-2xl font-extrabold ${application.readinessScore < 40 ? 'text-rose-600' : application.readinessScore < 70 ? 'text-amber-600' : 'text-emerald-600'}`}>
              {application.readinessScore}<span className="text-xs font-normal text-slate-400">/100</span>
            </div>
            <span className="text-[11px] text-slate-500">Statutory AICTE rules passed</span>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs">
            <span className="text-[11px] font-semibold text-slate-400 block mb-0.5">Collusion Risk Score</span>
            <div className={`text-2xl font-extrabold ${application.collusionRiskScore > 70 ? 'text-rose-600' : application.collusionRiskScore > 40 ? 'text-amber-600' : 'text-slate-600'}`}>
              {application.collusionRiskScore}<span className="text-xs font-normal text-slate-400">/100</span>
            </div>
            <span className="text-[11px] text-slate-500">Cross-institution fraud proximity</span>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs">
            <span className="text-[11px] font-semibold text-slate-400 block mb-0.5">Advisory Findings</span>
            <div className="text-2xl font-extrabold text-slate-800">
              {findings.length} <span className="text-xs font-normal text-slate-400">Alerts</span>
            </div>
            <span className="text-[11px] text-slate-500">{findings.filter(f => f.status === 'Open').length} Open / Requiring Action</span>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs">
            <span className="text-[11px] font-semibold text-slate-400 block mb-0.5">Verified Documents</span>
            <div className="text-2xl font-extrabold text-slate-800">
              {documents.filter(d => d.verificationStatus === 'Verified').length}/{documents.length}
            </div>
            <span className="text-[11px] text-slate-500">Passports cryptographically verified</span>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-b border-slate-200 mb-6 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('findings')}
            className={`py-3 px-4 border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'findings'
                ? 'border-[#002b66] text-[#002b66] font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Advisory Findings Stream ({findings.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('documents')}
            className={`py-3 px-4 border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'documents'
                ? 'border-[#002b66] text-[#002b66] font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Evidence Locker & Passports ({documents.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('summary')}
            className={`py-3 px-4 border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'summary'
                ? 'border-[#002b66] text-[#002b66] font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>Readiness Evaluation Breakdown</span>
          </button>
        </div>

        {/* 1. FINDINGS STREAM TAB */}
        {activeTab === 'findings' && (
          <div className="space-y-4">
            <div className="bg-blue-50/80 border border-blue-200 rounded-xl p-3.5 text-xs text-blue-900 flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-blue-700 mt-0.5 flex-shrink-0" />
              <div>
                <strong>Human-in-the-Loop AI Scrutiny Protocol:</strong> AICTE Sentinel findings are explainable advisory recommendations. Every finding cites an exact evidence locator and rule ID. Use the action buttons to Confirm, Dismiss with justification, Request Clarification, or Escalate to EVC inspection.
              </div>
            </div>

            {findings.length > 0 ? (
              <div className="space-y-4">
                {findings.map((finding) => (
                  <FindingCard
                    key={finding.id}
                    finding={finding}
                    isOfficer={true}
                    onAction={handleFindingAction}
                    onInspectDocument={(docId) => {
                      const doc = documents.find(d => d.id === docId);
                      if (doc) setSelectedDoc(doc);
                    }}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-500">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto mb-2" />
                <h4 className="font-bold text-slate-800 text-sm">No Adverse Findings</h4>
                <p className="text-xs text-slate-500 mt-1">Application passes all forensic and regulatory checks.</p>
              </div>
            )}
          </div>
        )}

        {/* 2. DOCUMENTS & VERIFICATION PASSPORTS TAB */}
        {activeTab === 'documents' && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
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
                      </div>
                      <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-500 mt-1">
                        <span>{doc.fileName}</span>
                        <span>•</span>
                        <span>{(doc.fileSize / 1024 / 1024).toFixed(2)} MB</span>
                        <span>•</span>
                        <span className="font-mono text-slate-400">SHA: {doc.sha256Hash.substring(0, 14)}...</span>
                        <span>•</span>
                        <span>{doc.extractedFields.length} Extracted OCR Fields</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <StatusChip status={doc.verificationStatus} size="sm" />
                    <button
                      onClick={() => setSelectedDoc(doc)}
                      className="px-3 py-1.5 bg-[#002b66] hover:bg-[#001f4d] text-white rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Inspect Passport</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 3. READINESS BREAKDOWN TAB */}
        {activeTab === 'summary' && readiness && (
          <div className="space-y-6">
            <ReadinessGauge readiness={readiness} />
          </div>
        )}

      </main>

      {/* Document Viewer Modal */}
      {selectedDoc && (
        <DocumentViewerModal
          document={selectedDoc}
          onClose={() => setSelectedDoc(null)}
          onTriggerVerify={handleTriggerVerify}
        />
      )}
    </div>
  );
}
