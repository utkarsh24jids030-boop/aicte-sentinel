'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import DemoBanner from '@/components/DemoBanner';
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
  const [officerRecommendation, setOfficerRecommendation] = useState<string>('RECOMMEND_EVC_INSPECTION');
  const [concludingRemarks, setConcludingRemarks] = useState(
    'Based on automated regulatory compliance parsing and cross-institution collusion detection, case warrants physical on-site verification before regulatory approval decision.'
  );

  useEffect(() => {
    fetchCase();
  }, [id]);

  const fetchCase = async () => {
    try {
      const res = await fetch(`/api/applications/${id}`);
      const data = await res.json();
      if (data.application) {
        setApplication(data.application);
        setDocuments(data.documents || []);
        setFindings(data.findings || []);
        setReadiness(data.readiness || null);

        if (data.application.riskTier === 'Critical') {
          setOfficerRecommendation('REFER_TO_VIGILANCE_COMMITTEE');
          setConcludingRemarks('Severe cross-institutional fraud identified (overlapping land survey parcel & duplicate certificates). Recommended for immediate vigilance inquiry.');
        } else if (data.application.readinessScore >= 70 && data.findings.length === 0) {
          setOfficerRecommendation('RECOMMEND_APPROVAL');
          setConcludingRemarks('All statutory norms, fire safety, and land deeds verified authentic against state registries. Recommended for grant of Extension of Approval (EoA).');
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

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
  const manualCount = documents.filter(d => ['Manual Review Required', 'Source Unavailable', 'Not Verified'].includes(d.verificationStatus)).length;

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans print:bg-white">
      <div className="print:hidden">
        <DemoBanner />
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
        <div className="bg-white rounded-2xl border border-slate-300 p-8 sm:p-12 shadow-md print:shadow-none print:border-none print:p-0">
          
          {/* AICTE Header */}
          <div className="text-center border-b-2 border-slate-900 pb-6 mb-6">
            <div className="text-xs font-bold tracking-widest text-slate-600 uppercase mb-1">
              Government of India • Ministry of Education
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-950 tracking-tight">
              ALL INDIA COUNCIL FOR TECHNICAL EDUCATION
            </h1>
            <div className="text-xs font-semibold text-slate-700 mt-1">
              Bureau of Approvals • Nelson Mandela Marg, Vasant Kunj, New Delhi - 110070
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
                    <th className="px-3 py-2 text-emerald-700">Verified Authentic</th>
                    <th className="px-3 py-2 text-rose-700">Mismatch Detected</th>
                    <th className="px-3 py-2 text-amber-700">Expired</th>
                    <th className="px-3 py-2 text-slate-700">Manual / Unavailable</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="font-bold">
                    <td className="px-3 py-2.5">{documents.length} Documents</td>
                    <td className="px-3 py-2.5 text-emerald-700">{verifiedCount}</td>
                    <td className="px-3 py-2.5 text-rose-700">{mismatchCount}</td>
                    <td className="px-3 py-2.5 text-amber-700">{expiredCount}</td>
                    <td className="px-3 py-2.5 text-slate-700">{manualCount}</td>
                  </tr>
                </tbody>
              </table>
            </div>
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
                <span>Cryptographic Audit Trail Stamp</span>
              </div>
              <code className="text-[10px] text-slate-500 font-mono block break-all max-w-sm">
                SHA-CHAIN: 4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f
              </code>
              <span className="text-[10px] text-slate-400 mt-0.5 block">
                Tamper-evident record sealed under AICTE Sentinel Ledger.
              </span>
            </div>

            <div className="text-right">
              <div className="font-bold text-slate-900 text-sm">Smt. Priyadarshini Rao</div>
              <div className="text-slate-600">Senior Scrutiny Officer</div>
              <div className="text-[11px] text-slate-400">Bureau of Approvals, AICTE New Delhi</div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
