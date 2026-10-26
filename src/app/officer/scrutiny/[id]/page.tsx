'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import StatusChip from '@/components/StatusChip';
import { 
  ShieldCheck, 
  Printer, 
  ArrowLeft, 
  Building2, 
  FileText, 
  AlertTriangle, 
  CheckCircle2, 
  Hash,
  Download
} from 'lucide-react';
import { Application, DocumentRecord, Finding, ReadinessBreakdown } from '@/types';
import VerificationStatusLegend from '@/components/VerificationStatusLegend';

export default function ScrutinyReportPage({
  params
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params);

  const [application, setApplication] = useState<Application | null>(null);
  const [documents, setDocuments] = useState<DocumentRecord[]>([]);
  const [findings, setFindings] = useState<Finding[]>([]);
  const [readiness, setReadiness] = useState<ReadinessBreakdown | null>(null);
  const [officerRecommendation, setOfficerRecommendation] = useState<string>('CONSIDER_EVC_INSPECTION');
  const [sealData, setSealData] = useState<{ seal: string; chainHeadHash: string } | null>(null);
  const [concludingRemarks, setConcludingRemarks] = useState(
    'Based on automated regulatory compliance parsing and cross-institution linkage analysis, case warrants physical on-site verification before regulatory approval decision.'
  );

  const fetchCase = React.useCallback(async () => {
    try {
      const res = await fetch(`/api/applications/${id}`);
      const data = await res.json();
      if (data.application) {
        setApplication(data.application);
        setDocuments(data.documents || []);
        setFindings(data.findings || []);
        setReadiness(data.readiness || null);

        const hasLinkages = data.application.linkageRiskScore >= 70 || (data.findings && data.findings.some((f: Finding) => f.category === 'CROSS_INSTITUTION_LINKAGE'));

        if (data.application.riskTier === 'Critical' || hasLinkages) {
          setOfficerRecommendation('CONSIDER_VIGILANCE_REFERRAL');
          setConcludingRemarks('Potential cross-institution linkages and document discrepancies detected requiring manual verification of sub-division records and physical site claims. Suggested for officer review / EVC inspection / vigilance referral consideration.');
        } else if (data.application.readinessScore >= 70 && data.findings.length === 0) {
          setOfficerRecommendation('CONSIDER_APPROVAL');
          setConcludingRemarks('All submitted declarations and statutory records are verified authentic against simulated state registries with zero unresolved anomalies. Suggested for officer review / approval consideration.');
        } else {
          setOfficerRecommendation('CONSIDER_EVC_INSPECTION');
          setConcludingRemarks('Specific statutory deficiencies identified during automated checks (e.g., document omissions or faculty strength deficit). Suggested for officer review / EVC inspection consideration.');
        }

        // Fetch cryptographic report seal derived from report content and chain head
        try {
          const sealRes = await fetch('/api/reports/verify-seal', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ applicationId: id })
          });
          const sealJson = await sealRes.json();
          if (sealJson.success) {
            setSealData({ seal: sealJson.seal, chainHeadHash: sealJson.chainHeadHash });
          }
        } catch (e) {
          console.error('Error fetching report seal:', e);
        }
      }
    } catch (e) {
      console.error(e);
    }
  }, [id]);

  useEffect(() => {
    fetchCase();
  }, [fetchCase]);

  const handlePrint = () => {
    window.print();
  };

  if (!application) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center font-sans">
        <span className="text-xs text-slate-500">Compiling Scrutiny Report Dossier...</span>
      </div>
    );
  }

  // Summary counts
  const verifiedCount = documents.filter(d => d.verificationStatus === 'Verified').length;
  const mismatchCount = documents.filter(d => d.verificationStatus === 'Mismatch Detected').length;
  const expiredCount = documents.filter(d => d.verificationStatus === 'Expired').length;
  const pendingCount = documents.filter(d => d.verificationStatus === 'Verification Pending').length;
  const unavailableCount = documents.filter(d => d.verificationStatus === 'Source Unavailable').length;
  const manualCount = documents.filter(d => d.verificationStatus === 'Manual Review Required').length;

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans print:bg-white">
      <div className="print:hidden">
        <Navbar />
      </div>

      <main className="max-w-4xl mx-auto w-full px-4 sm:px-6 py-8">
        
        {/* Print / Navigation Action Bar */}
        <div className="mb-6 flex items-center justify-between print:hidden">
          <Link
            href={`/officer/case/${application.id}`}
            className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Case File</span>
          </Link>

          <button
            onClick={handlePrint}
            className="px-4 py-2 bg-[#002b66] hover:bg-[#001f4d] text-white rounded-xl text-xs font-bold shadow-2xs flex items-center gap-1.5 transition-colors"
          >
            <Printer className="w-4 h-4" />
            <span>Print Official Scrutiny Report</span>
          </button>
        </div>

        {/* Printable Official Government Scrutiny Document */}
        <div className="relative bg-white rounded-2xl border border-slate-300 p-8 sm:p-12 shadow-md print:shadow-none print:border-none print:p-0 overflow-hidden">
          
          {/* Diagonal Background Watermark */}
          <div 
            aria-hidden="true" 
            className="pointer-events-none select-none absolute inset-0 flex items-center justify-center overflow-hidden z-0 opacity-[0.03] print:opacity-[0.07]"
          >
            <span className="text-4xl sm:text-6xl font-black uppercase tracking-widest text-slate-900 -rotate-45 whitespace-nowrap">
              PROTOTYPE - NOT AN OFFICIAL AICTE DOCUMENT
            </span>
          </div>

          {/* Prototype Watermark Banner (Screen & Print) */}
          <div className="relative z-10 mb-6 p-2 text-center rounded-lg border-2 border-dashed border-amber-500 bg-amber-50 text-amber-900 font-extrabold text-xs tracking-wider uppercase print:border-black print:bg-slate-100 print:text-black">
            PROTOTYPE - NOT AN OFFICIAL AICTE DOCUMENT • SYNTHETIC DATA FOR DEMONSTRATION ONLY
          </div>

          {/* AICTE Header */}
          <div className="relative z-10 text-center border-b-2 border-slate-900 pb-6 mb-6">
            <div className="text-xs font-bold tracking-widest text-slate-600 uppercase mb-1">
              Government of India • Ministry of Education
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-950 tracking-tight">
              ALL INDIA COUNCIL FOR TECHNICAL EDUCATION
            </h1>
            <div className="text-xs font-semibold text-slate-700 mt-1">
              Regulation Bureau • Nelson Mandela Marg, Vasant Kunj, New Delhi - 110070
            </div>
            <div className="inline-block mt-3 px-4 py-1 rounded-full bg-slate-100 border border-slate-300 text-xs font-bold text-slate-900">
              FORMAL REGULATORY SCRUTINY & DEFICIENCY REPORT (2026-2027)
            </div>
          </div>

          {/* Docket Metadata */}
          <div className="grid grid-cols-2 gap-4 text-xs mb-6 border-b pb-6">
            <div>
              <span className="text-slate-500 font-semibold block">Application Docket No:</span>
              <span className="font-mono font-bold text-slate-900 text-sm">{application.applicationNumber}</span>
            </div>
            <div>
              <span className="text-slate-500 font-semibold block">AICTE Permanent ID:</span>
              <span className="font-mono font-bold text-slate-900 text-sm">1-10928371</span>
            </div>
            <div>
              <span className="text-slate-500 font-semibold block">Institution Name:</span>
              <span className="font-bold text-slate-900">{application.institutionName}</span>
            </div>
            <div>
              <span className="text-slate-500 font-semibold block">Approval Category:</span>
              <span className="font-bold text-slate-900">{application.type.replace('_', ' ')}</span>
            </div>
            <div>
              <span className="text-slate-500 font-semibold block">Current / Proposed Intake:</span>
              <span className="font-semibold text-slate-800">{application.currentIntake} / {application.proposedIntake} Seats</span>
            </div>
            <div>
              <span className="text-slate-500 font-semibold block">Scrutiny Date & Time:</span>
              <span className="font-semibold text-slate-800">{new Date().toLocaleDateString()} (Sentinel Verified)</span>
            </div>
          </div>

          {/* Verification Passports Summary Table */}
          <div className="mb-6">
            <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
              1. Document Authentication & Verification Summary
            </h2>
            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 border-b text-slate-700 font-bold">
                  <tr>
                    <th className="px-3 py-2">Total Uploaded</th>
                    <th className="px-3 py-2 text-emerald-700">Verified</th>
                    <th className="px-3 py-2 text-rose-700">Mismatch</th>
                    <th className="px-3 py-2 text-amber-700">Expired</th>
                    <th className="px-3 py-2 text-blue-700">Pending</th>
                    <th className="px-3 py-2 text-zinc-700">Unavailable</th>
                    <th className="px-3 py-2 text-orange-700">Manual Review</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="font-bold">
                    <td className="px-3 py-2.5">{documents.length} Documents</td>
                    <td className="px-3 py-2.5 text-emerald-700">{verifiedCount}</td>
                    <td className="px-3 py-2.5 text-rose-700">{mismatchCount}</td>
                    <td className="px-3 py-2.5 text-amber-700">{expiredCount}</td>
                    <td className="px-3 py-2.5 text-blue-700">{pendingCount}</td>
                    <td className="px-3 py-2.5 text-zinc-700">{unavailableCount}</td>
                    <td className="px-3 py-2.5 text-orange-700">{manualCount}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <VerificationStatusLegend compact className="mt-3" />
          </div>

          {/* Itemized Adverse Findings Table */}
          <div className="mb-6">
            <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
              2. Itemized Findings & Statutory Non-Compliances ({findings.length})
            </h2>
            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <table className="w-full text-xs text-left divide-y divide-slate-200">
                <thead className="bg-slate-50 text-slate-700 font-bold">
                  <tr>
                    <th className="px-3 py-2">Finding ID & Severity</th>
                    <th className="px-3 py-2">Description & Statutory Rule</th>
                    <th className="px-3 py-2">Evidence Locator</th>
                    <th className="px-3 py-2">Review Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {findings.map((f) => (
                    <tr key={f.id} className="align-top">
                      <td className="px-3 py-2 font-mono text-[11px]">
                        <strong>{f.id}</strong>
                        <div className="mt-0.5">
                          <StatusChip status={f.severity} size="sm" />
                        </div>
                      </td>
                      <td className="px-3 py-2">
                        <strong className="text-slate-900 block">{f.title}</strong>
                        <p className="text-slate-600 text-[11px] mt-0.5">{f.explanation}</p>
                      </td>
                      <td className="px-3 py-2 font-mono text-[10px] text-slate-700">
                        {f.evidenceLocator}
                      </td>
                      <td className="px-3 py-2">
                        <StatusChip status={f.status} size="sm" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Official Officer Recommendation Box */}
          <div className="bg-slate-50 border-2 border-slate-300 rounded-xl p-5 mb-6 text-xs">
            <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
              3. Scrutiny Officer Formal Recommendation
            </h2>

            <div className="mb-3">
              <span className="font-semibold text-slate-700 block mb-1">Recommended Regulatory Disposition:</span>
              <div className="font-bold text-sm text-[#002b66]">
                {officerRecommendation.replace(/_/g, ' ')}
              </div>
            </div>

            <div>
              <span className="font-semibold text-slate-700 block mb-1">Concluding Regulatory Remarks:</span>
              <p className="text-slate-800 leading-relaxed bg-white p-3 rounded-lg border border-slate-200">
                {concludingRemarks}
              </p>
            </div>
          </div>

          {/* Signature & Audit Hash Stamp */}
          <div className="border-t pt-6 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6 text-xs">
            <div>
              <div className="flex items-center gap-2 text-slate-700 font-bold mb-1">
                <Hash className="w-4 h-4 text-slate-500" />
                <span>Cryptographic Audit Trail Stamp & Seal</span>
              </div>
              <code className="text-[10px] text-emerald-800 font-mono block break-all max-w-sm bg-slate-50 p-1.5 rounded border border-slate-200">
                SEAL: {sealData?.seal || 'COMPUTING-SEAL-SHA256...'}
              </code>
              <span className="text-[10px] text-slate-500 mt-1 block font-mono">
                Chain Head: {sealData?.chainHeadHash ? `${sealData.chainHeadHash.substring(0, 16)}...` : '00000000...'} • Tamper-evident record sealed under AICTE Sentinel Ledger.
              </span>
            </div>

            <div className="text-right">
              <div className="font-bold text-slate-900 text-sm">Smt. Priyadarshini Rao</div>
              <div className="text-slate-600">Senior Scrutiny Officer</div>
              <div className="text-[11px] text-slate-400">Regulation Bureau, AICTE New Delhi</div>
            </div>
          </div>

          {/* Footer Prototype Notice */}
          <div className="relative z-10 text-center text-[10px] text-slate-500 font-bold uppercase mt-6 pt-4 border-t border-slate-200 print:block">
            AICTE SENTINEL PROTOTYPE DEMONSTRATOR • NOT AN OFFICIAL AICTE DOCUMENT • ALL COMPLIANCE OUTPUTS ADVISORY ONLY
          </div>

        </div>
      </main>
    </div>
  );
}
