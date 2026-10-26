'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Application, 
  Institution, 
  DocumentRecord, 
  ReadinessBreakdown, 
  Finding, 
  AICTEInstitutionalRecord 
} from '@/types';
import VerificationStatusLegend from '@/components/VerificationStatusLegend';
import { computeReportSeal } from '@/lib/security/reportSeal';
import { Printer, ArrowLeft, ShieldCheck, AlertCircle, FileText, CheckCircle2, AlertTriangle, Clock } from 'lucide-react';

interface ValidationReportViewProps {
  application: Application;
  institution?: Institution;
  documents: DocumentRecord[];
  readiness: ReadinessBreakdown;
  findings: Finding[];
  instRecord?: AICTEInstitutionalRecord;
  backUrl?: string;
  headHash?: string;
}

export default function ValidationReportView({
  application,
  institution,
  documents,
  readiness,
  findings,
  instRecord,
  backUrl = `/institution/applications/${application.id}`,
  headHash = 'a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2'
}: ValidationReportViewProps) {
  const reportId = `VAL-REP-2026-${application.id.toUpperCase()}`;
  const reportSeal = computeReportSeal(
    reportId,
    application.id,
    readiness.score,
    'INSTITUTIONAL_VALIDATION_REPORT',
    headHash
  );

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  // Categorize deficiencies into Missing, Expired, and Inconsistent
  const missingItems = readiness.deficiencies.filter(d => 
    d.message.toLowerCase().includes('missing') || 
    d.message.toLowerCase().includes('absent') ||
    d.message.toLowerCase().includes('not linked')
  );

  const expiredItems = readiness.deficiencies.filter(d => 
    d.message.toLowerCase().includes('expired') || 
    d.message.toLowerCase().includes('renewal')
  );

  const inconsistentItems = readiness.deficiencies.filter(d => 
    !missingItems.includes(d) && !expiredItems.includes(d)
  );

  // Status counts
  const verifiedCount = documents.filter(d => d.verificationStatus === 'Verified').length;
  const mismatchCount = documents.filter(d => d.verificationStatus === 'Mismatch Detected').length;
  const expiredCount = documents.filter(d => d.verificationStatus === 'Expired').length;
  const pendingCount = documents.filter(d => d.verificationStatus === 'Verification Pending').length;
  const unavailableCount = documents.filter(d => d.verificationStatus === 'Source Unavailable').length;
  const manualCount = documents.filter(d => d.verificationStatus === 'Manual Review Required').length;

  return (
    <div className="max-w-4xl mx-auto w-full px-4 sm:px-6 py-8 font-sans print:p-0 print:max-w-none">
      
      {/* Action Bar (Screen Only) */}
      <div className="mb-6 flex items-center justify-between print:hidden">
        <Link
          href={backUrl}
          className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1.5"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Application Dashboard</span>
        </Link>

        <button
          onClick={handlePrint}
          className="px-4 py-2 bg-[#002b66] hover:bg-[#001f4d] text-white rounded-xl text-xs font-bold shadow-2xs flex items-center gap-1.5 transition-colors"
        >
          <Printer className="w-4 h-4" />
          <span>Print Official Validation Report</span>
        </button>
      </div>

      {/* Main Document Container */}
      <article className="relative bg-white rounded-2xl border border-slate-300 p-8 sm:p-12 shadow-md print:shadow-none print:border-none print:p-0 overflow-hidden space-y-8">
        
        {/* Diagonal Background Watermark */}
        <div 
          aria-hidden="true" 
          className="pointer-events-none select-none absolute inset-0 flex items-center justify-center overflow-hidden z-0 opacity-[0.03] print:opacity-[0.06]"
        >
          <span className="text-4xl sm:text-6xl font-black uppercase tracking-widest text-slate-900 -rotate-45 whitespace-nowrap">
            PROTOTYPE - NOT AN OFFICIAL AICTE DOCUMENT
          </span>
        </div>

        {/* Prototype Watermark Banner (Screen & Print) */}
        <div className="relative z-10 p-2.5 text-center rounded-lg border-2 border-dashed border-amber-500 bg-amber-50 text-amber-900 font-extrabold text-xs tracking-wider uppercase print:border-black print:bg-slate-100 print:text-black">
          PROTOTYPE - NOT AN OFFICIAL AICTE DOCUMENT • SYNTHETIC DATA FOR DEMONSTRATION ONLY
        </div>

        {/* Header */}
        <div className="relative z-10 border-b-2 border-slate-900 pb-6 text-center">
          <div className="text-xs font-bold text-slate-600 uppercase tracking-widest mb-1">
            All India Council for Technical Education (AICTE)
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-950 tracking-tight">
            Regulation Bureau • Institutional Validation & Rectification Report
          </h1>
          <div className="text-xs font-semibold text-slate-700 mt-1">
            Nelson Mandela Marg, Vasant Kunj, New Delhi - 110070
          </div>
          <div className="inline-block mt-3 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-900 text-xs font-bold">
            Preliminary Automated Scrutiny & Deficiency Dossier (Academic Year {application.academicYear})
          </div>
        </div>

        {/* Application & Institution Metadata */}
        <div className="relative z-10 border border-slate-200 rounded-xl overflow-hidden text-xs">
          <table className="w-full text-left border-collapse">
            <tbody>
              <tr className="border-b bg-slate-50">
                <th className="p-3 w-1/4 text-slate-600 font-bold uppercase">Application Docket</th>
                <td className="p-3 w-1/4 font-mono font-bold text-slate-900">{application.applicationNumber}</td>
                <th className="p-3 w-1/4 text-slate-600 font-bold uppercase">AICTE Permanent ID</th>
                <td className="p-3 w-1/4 font-mono font-bold text-slate-900">{institution?.aicteId || instRecord?.aictePermanentId || '1-10928371'}</td>
              </tr>
              <tr className="border-b">
                <th className="p-3 text-slate-600 font-bold uppercase">Institution Name</th>
                <td className="p-3 font-bold text-slate-900">{application.institutionName}</td>
                <th className="p-3 text-slate-600 font-bold uppercase">Sponsoring Trust</th>
                <td className="p-3 font-semibold text-slate-800">{institution?.trustName || 'N/A'}</td>
              </tr>
              <tr className="border-b bg-slate-50">
                <th className="p-3 text-slate-600 font-bold uppercase">Application Type</th>
                <td className="p-3 font-semibold text-slate-900">{application.type}</td>
                <th className="p-3 text-slate-600 font-bold uppercase">Approved vs Proposed</th>
                <td className="p-3 font-mono text-slate-900">{application.currentIntake} / {application.proposedIntake} Seats</td>
              </tr>
              <tr>
                <th className="p-3 text-slate-600 font-bold uppercase">TER Payment Status</th>
                <td className="p-3 font-bold text-slate-900">
                  <span className={instRecord?.terPaymentStatus === 'PAID' ? 'text-emerald-700' : 'text-rose-700'}>
                    {instRecord?.terPaymentStatus || 'PENDING'}
                  </span>
                  {instRecord?.terTransactionReference ? ` (${instRecord.terTransactionReference})` : ''}
                </td>
                <th className="p-3 text-slate-600 font-bold uppercase">Readiness Score</th>
                <td className="p-3 font-mono font-bold text-blue-900 text-sm">
                  {readiness.score} / 100
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Verification Status Matrix */}
        <div className="relative z-10 space-y-3">
          <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            1. Document Authentication & Source Verification Matrix
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2.5 text-center text-xs">
            <div className="p-2.5 rounded-xl bg-slate-100 border border-slate-200">
              <div className="text-slate-500 font-bold">Total Docs</div>
              <div className="text-base font-bold font-mono text-slate-900 mt-1">{documents.length}</div>
            </div>
            <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200">
              <div className="text-emerald-700 font-bold">Verified</div>
              <div className="text-base font-bold font-mono text-emerald-800 mt-1">{verifiedCount}</div>
            </div>
            <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200">
              <div className="text-rose-700 font-bold">Mismatch</div>
              <div className="text-base font-bold font-mono text-rose-800 mt-1">{mismatchCount}</div>
            </div>
            <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200">
              <div className="text-amber-700 font-bold">Expired</div>
              <div className="text-base font-bold font-mono text-amber-800 mt-1">{expiredCount}</div>
            </div>
            <div className="p-2.5 rounded-xl bg-blue-50 border border-blue-200">
              <div className="text-blue-700 font-bold">Pending</div>
              <div className="text-base font-bold font-mono text-blue-800 mt-1">{pendingCount}</div>
            </div>
            <div className="p-2.5 rounded-xl bg-purple-50 border border-purple-200">
              <div className="text-purple-700 font-bold">Unavailable</div>
              <div className="text-base font-bold font-mono text-purple-800 mt-1">{unavailableCount}</div>
            </div>
            <div className="p-2.5 rounded-xl bg-orange-50 border border-orange-200">
              <div className="text-orange-700 font-bold">Manual Review</div>
              <div className="text-base font-bold font-mono text-orange-800 mt-1">{manualCount}</div>
            </div>
          </div>
          <VerificationStatusLegend compact />
        </div>

        {/* Section 2: Missing Documents / Information */}
        <div className="relative z-10 space-y-3">
          <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center justify-between">
            <span>2. Missing Documents & Mandatory Information ({missingItems.length})</span>
            <span className="text-[11px] font-normal text-slate-500">Requires fresh upload</span>
          </h2>

          {missingItems.length === 0 ? (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-xs font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>Zero missing mandatory documents. All prescribed baseline filings have been received.</span>
            </div>
          ) : (
            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <table className="w-full text-xs text-left border-collapse">
                <thead className="bg-slate-50 border-b text-slate-700 font-bold">
                  <tr>
                    <th className="p-2.5 w-1/6">Rule ID & Severity</th>
                    <th className="p-2.5 w-1/3">Statutory Deficiency</th>
                    <th className="p-2.5 w-1/2">Prescribed Rectification Guidance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {missingItems.map((item, idx) => (
                    <tr key={idx} className="align-top">
                      <td className="p-2.5 font-mono">
                        <span className="font-bold block text-slate-900">{item.ruleId}</span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-rose-100 text-rose-800 font-bold inline-block mt-1">
                          {item.severity}
                        </span>
                      </td>
                      <td className="p-2.5">
                        <div className="font-bold text-slate-900">{item.ruleName}</div>
                        <p className="text-slate-600 mt-0.5">{item.message}</p>
                      </td>
                      <td className="p-2.5 bg-blue-50/40 text-blue-900 font-medium">
                        {item.recommendedAction}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Section 3: Expired Documents */}
        <div className="relative z-10 space-y-3">
          <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center justify-between">
            <span>3. Expired Certificates & NOC Clearances ({expiredItems.length})</span>
            <span className="text-[11px] font-normal text-slate-500">Requires updated validity certificate</span>
          </h2>

          {expiredItems.length === 0 ? (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-xs font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>All submitted regulatory NOCs and certificates are within statutory validity windows.</span>
            </div>
          ) : (
            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <table className="w-full text-xs text-left border-collapse">
                <thead className="bg-slate-50 border-b text-slate-700 font-bold">
                  <tr>
                    <th className="p-2.5 w-1/6">Rule ID & Severity</th>
                    <th className="p-2.5 w-1/3">Expired Credential</th>
                    <th className="p-2.5 w-1/2">Renewal & Rectification Guidance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {expiredItems.map((item, idx) => (
                    <tr key={idx} className="align-top">
                      <td className="p-2.5 font-mono">
                        <span className="font-bold block text-slate-900">{item.ruleId}</span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-100 text-amber-900 font-bold inline-block mt-1">
                          {item.severity}
                        </span>
                      </td>
                      <td className="p-2.5">
                        <div className="font-bold text-slate-900">{item.ruleName}</div>
                        <p className="text-amber-800 mt-0.5">{item.message}</p>
                      </td>
                      <td className="p-2.5 bg-amber-50/40 text-amber-950 font-medium">
                        {item.recommendedAction}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Section 4: Inconsistent Declarations & Non-Compliances */}
        <div className="relative z-10 space-y-3">
          <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center justify-between">
            <span>4. Inconsistent Declarations & Norm Gaps ({inconsistentItems.length})</span>
            <span className="text-[11px] font-normal text-slate-500">Requires correction or reconciliation</span>
          </h2>

          {inconsistentItems.length === 0 ? (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-xs font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>Zero declaration mismatches detected across cadastral, faculty, and academic claims.</span>
            </div>
          ) : (
            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <table className="w-full text-xs text-left border-collapse">
                <thead className="bg-slate-50 border-b text-slate-700 font-bold">
                  <tr>
                    <th className="p-2.5 w-1/6">Rule ID & Severity</th>
                    <th className="p-2.5 w-1/3">Inconsistency Description</th>
                    <th className="p-2.5 w-1/2">Reconciliation Protocol</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {inconsistentItems.map((item, idx) => (
                    <tr key={idx} className="align-top">
                      <td className="p-2.5 font-mono">
                        <span className="font-bold block text-slate-900">{item.ruleId}</span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-orange-100 text-orange-900 font-bold inline-block mt-1">
                          {item.severity}
                        </span>
                      </td>
                      <td className="p-2.5">
                        <div className="font-bold text-slate-900">{item.ruleName}</div>
                        <p className="text-slate-700 mt-0.5">{item.message}</p>
                      </td>
                      <td className="p-2.5 bg-slate-50 text-slate-800 font-medium">
                        {item.recommendedAction}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Section 5: Official Rectification Submission Protocol */}
        <div className="relative z-10 p-5 rounded-xl border border-slate-200 bg-slate-50 text-xs space-y-2">
          <h3 className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">
            5. Official AICTE Deficiency Rectification Protocol
          </h3>
          <ol className="list-decimal list-inside space-y-1 text-slate-700 leading-relaxed">
            <li>Log into the AICTE Sentinel Institution Portal using your authorized institution credentials.</li>
            <li>Navigate to your application dossier and locate each flagged deficiency in the Action Required stream.</li>
            <li>Provide a formal written explanation addressing the statutory gap and upload the replacement document scan.</li>
            <li>Every resubmitted document is assigned a tamper-evident SHA-256 hash and version-tracked in the ledger.</li>
            <li>Resubmissions undergo automated re-validation before being placed before the Scrutiny Committee.</li>
          </ol>
          <div className="pt-2 text-[11px] text-slate-500 italic">
            Advisory Notice: This validation report is generated by AICTE Sentinel for applicant self-rectification. No adverse statutory sanction or closure order is issued without human officer review and formal opportunity of hearing.
          </div>
        </div>

        {/* Report Footer & Security Seal */}
        <div className="relative z-10 pt-4 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-[11px] text-slate-500 font-mono">
          <div>
            <span className="block font-bold text-slate-700">Digital Seal: {reportSeal.substring(0, 24)}...</span>
            <span>Ledger Head Hash: {headHash.substring(0, 16)}...</span>
          </div>
          <div className="sm:text-right">
            <span>Report ID: {reportId}</span>
            <span className="block text-slate-400">Generated: {new Date().toISOString().split('T')[0]} (AICTE Sentinel)</span>
          </div>
        </div>
      </article>
    </div>
  );
}
