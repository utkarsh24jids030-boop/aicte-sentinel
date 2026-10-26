import React from 'react';
import { DataStore } from '@/lib/store';
import { Application } from '@/types';
import { formatSeverity, maskPII } from './helpers';

interface ScrutinyReportSectionProps {
  appId?: string;
}

export default function ScrutinyReportSection({ appId }: ScrutinyReportSectionProps) {
  const applications = appId 
    ? [DataStore.getApplicationById(appId)].filter((a): a is Application => Boolean(a))
    : DataStore.getApplications();

  if (applications.length === 0) {
    return (
      <div className="p-8 text-center bg-rose-50 border border-rose-200 rounded-xl text-rose-700 font-semibold">
        Application &ldquo;{appId}&rdquo; was not found in the AICTE Sentinel data store.
      </div>
    );
  }

  return (
    <section id="scrutiny-reports" className="space-y-12">
      {applications.map((app) => {
        const institution = DataStore.getInstitutionById(app.institutionId);
        const documents = DataStore.getDocuments(app.id);
        const findings = DataStore.getFindings(app.id);

        // Verification matrix counts
        const totalDocs = documents.length;
        const verifiedDocs = documents.filter(d => d.verificationStatus === 'Verified').length;
        const mismatchDocs = documents.filter(d => d.verificationStatus === 'Mismatch Detected').length;
        const expiredDocs = documents.filter(d => d.verificationStatus === 'Expired').length;
        const manualDocs = documents.filter(d => d.verificationStatus === 'Manual Review Required' || d.verificationStatus === 'Not Verified').length;
        const unavailableDocs = documents.filter(d => d.verificationStatus === 'Source Unavailable').length;

        // Recommendation logic
        let recommendation = 'CONSIDER_EVC_INSPECTION';
        let recommendationLabel = 'Suggested for officer review: Consider Physical EVC Inspection';
        let recommendationClass = 'bg-amber-100 text-amber-900 border-amber-300';
        let concludingRemarks = 'Statutory compliance gaps identified during automated checks. Suggested for officer review / EVC inspection consideration.';

        const hasLinkages = app.linkageRiskScore >= 70 || findings.some(f => f.category === 'CROSS_INSTITUTION_LINKAGE');

        if (app.riskTier === 'Critical' || hasLinkages) {
          recommendation = 'CONSIDER_VIGILANCE_REFERRAL';
          recommendationLabel = 'Suggested for officer review: Consider Vigilance Referral / Physical Inspection';
          recommendationClass = 'bg-rose-100 text-rose-900 border-rose-300';
          concludingRemarks = 'Potential cross-institution linkages and document discrepancies detected requiring manual verification of sub-division records and physical site claims. Suggested for officer review / EVC inspection / vigilance referral consideration.';
        } else if (app.readinessScore >= 70 && findings.length === 0) {
          recommendation = 'CONSIDER_APPROVAL';
          recommendationLabel = 'Suggested for officer review: Approval Consideration';
          recommendationClass = 'bg-emerald-100 text-emerald-900 border-emerald-300';
          concludingRemarks = 'All submitted declarations and statutory records are verified authentic against simulated state registries with zero unresolved anomalies. Suggested for officer review / approval consideration.';
        } else {
          recommendation = 'CONSIDER_EVC_INSPECTION';
          recommendationLabel = 'Suggested for officer review: Consider EVC Inspection / Clarification';
          recommendationClass = 'bg-amber-100 text-amber-900 border-amber-300';
          concludingRemarks = 'Specific statutory deficiencies identified during automated checks (e.g., document omissions or faculty strength deficit). Suggested for officer review / EVC inspection consideration.';
        }

        const reportId = `REP-SCRUTINY-2026-${app.id.toUpperCase()}`;
        const hashStamp = `STAMP-SHA256-${app.id}-98a7bc6d5e4f3a2b1c0d9e8f7a6b5c4d`;

        return (
          <article 
            key={app.id} 
            id={`scrutiny-${app.id}`} 
            className="relative p-6 md:p-8 bg-white border border-slate-200 rounded-2xl shadow-sm space-y-6 overflow-hidden"
          >
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
            <div className="relative z-10 p-2 text-center rounded-lg border-2 border-dashed border-amber-500 bg-amber-50 text-amber-900 font-extrabold text-xs tracking-wider uppercase print:border-black print:bg-slate-100 print:text-black">
              PROTOTYPE - NOT AN OFFICIAL AICTE DOCUMENT • SYNTHETIC DATA FOR DEMONSTRATION ONLY
            </div>

            {/* Header Stamp */}
            <div className="relative z-10 border-b-2 border-slate-900 pb-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="text-[11px] font-bold text-blue-900 uppercase tracking-widest">
                  All India Council for Technical Education (AICTE) • Bureau of Approvals
                </div>
                <h2 className="text-xl md:text-2xl font-black text-slate-900 mt-1">
                  Statutory Scrutiny Evaluation Report
                </h2>
                <div className="text-xs text-slate-500 font-mono mt-1">
                  Report ID: {reportId} • Date: 2026-01-25 • Officer: Smt. Priyadarshini Rao (Senior Scrutiny Officer)
                </div>
              </div>

              <div className="text-right">
                <span className="font-mono text-xs font-bold text-slate-700 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200 block">
                  Application: {app.applicationNumber}
                </span>
                <span className="text-[10px] text-slate-400 font-mono mt-1 block">
                  AICTE Permanent ID: {institution?.aicteId || '1-99882233'}
                </span>
              </div>
            </div>

            {/* Institution & Application Meta Table */}
            <div className="overflow-x-auto border border-slate-200 rounded-xl">
              <table className="w-full text-left text-xs border-collapse">
                <tbody>
                  <tr className="border-b bg-slate-50">
                    <th className="p-3 w-1/4 text-slate-600 font-bold uppercase">Institution Name</th>
                    <td className="p-3 w-1/4 font-bold text-slate-900">{app.institutionName}</td>
                    <th className="p-3 w-1/4 text-slate-600 font-bold uppercase">Sponsoring Trust</th>
                    <td className="p-3 w-1/4 font-semibold text-slate-900">{institution?.trustName}</td>
                  </tr>
                  <tr className="border-b">
                    <th className="p-3 text-slate-600 font-bold uppercase">Campus Location</th>
                    <td className="p-3 text-slate-800">{institution?.address}</td>
                    <th className="p-3 text-slate-600 font-bold uppercase">Land Survey No.</th>
                    <td className="p-3 font-mono text-slate-800">{institution?.landSurveyNumber} ({institution?.landAreaAcres} Acres)</td>
                  </tr>
                  <tr className="border-b bg-slate-50">
                    <th className="p-3 text-slate-600 font-bold uppercase">Application Type</th>
                    <td className="p-3 font-semibold text-slate-900">{app.type} (Academic Year {app.academicYear})</td>
                    <th className="p-3 text-slate-600 font-bold uppercase">Intake Sanction</th>
                    <td className="p-3 font-mono text-slate-900">Current: {app.currentIntake} | Proposed: {app.proposedIntake}</td>
                  </tr>
                  <tr>
                    <th className="p-3 text-slate-600 font-bold uppercase">Readiness Score</th>
                    <td className="p-3 font-mono font-bold text-blue-900 text-sm">{app.readinessScore} / 100</td>
                    <th className="p-3 text-slate-600 font-bold uppercase">Linkage Risk Score</th>
                    <td className="p-3 font-mono font-bold text-rose-600 text-sm">{app.linkageRiskScore}% ({app.riskTier} Tier)</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Verification Summary Matrix */}
            <div>
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-2">
                1. Fail-Closed Verification Summary Matrix
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 text-center text-xs">
                <div className="p-3 rounded-xl bg-slate-100 border border-slate-200">
                  <div className="text-slate-500 font-bold">Total Documents</div>
                  <div className="text-xl font-bold font-mono text-slate-900 mt-1">{totalDocs}</div>
                </div>
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200">
                  <div className="text-emerald-700 font-bold">Verified Authentic</div>
                  <div className="text-xl font-bold font-mono text-emerald-800 mt-1">{verifiedDocs}</div>
                </div>
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200">
                  <div className="text-rose-700 font-bold">Mismatch Detected</div>
                  <div className="text-xl font-bold font-mono text-rose-800 mt-1">{mismatchDocs}</div>
                </div>
                <div className="p-3 rounded-xl bg-amber-50 border border-amber-200">
                  <div className="text-amber-700 font-bold">Expired NOCs</div>
                  <div className="text-xl font-bold font-mono text-amber-800 mt-1">{expiredDocs}</div>
                </div>
                <div className="p-3 rounded-xl bg-purple-50 border border-purple-200">
                  <div className="text-purple-700 font-bold">Source Unavailable</div>
                  <div className="text-xl font-bold font-mono text-purple-800 mt-1">{unavailableDocs}</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="text-slate-600 font-bold">Manual Review</div>
                  <div className="text-xl font-bold font-mono text-slate-800 mt-1">{manualDocs}</div>
                </div>
              </div>
            </div>

            {/* Key Deficiencies & Findings */}
            <div>
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-2">
                2. Automated Statutory Non-Compliance & Anomaly Findings ({findings.length})
              </h3>
              {findings.length === 0 ? (
                <div className="p-3 bg-emerald-50 text-emerald-800 rounded-lg text-xs font-medium">
                  Zero statutory deficiencies recorded.
                </div>
              ) : (
                <div className="overflow-x-auto border border-slate-200 rounded-xl">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-100 text-slate-700 font-bold border-b">
                        <th className="p-2.5">Severity</th>
                        <th className="p-2.5">Finding ID / Rule</th>
                        <th className="p-2.5">Category</th>
                        <th className="p-2.5">Title & Defect Description</th>
                        <th className="p-2.5">Evidence Locator</th>
                        <th className="p-2.5">Recommended Statutory Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {findings.map((f) => (
                        <tr key={f.id} className="hover:bg-slate-50">
                          <td className="p-2.5">
                            <span className={`px-2 py-0.5 rounded-sm border text-[10px] font-bold ${formatSeverity(f.severity)}`}>
                              {f.severity}
                            </span>
                          </td>
                          <td className="p-2.5 font-mono text-slate-700">
                            {f.id}
                            <div className="text-[10px] text-slate-400">{f.ruleId}</div>
                          </td>
                          <td className="p-2.5 font-semibold text-slate-700">{f.category}</td>
                          <td className="p-2.5">
                            <div className="font-bold text-slate-900">{maskPII(f.title)}</div>
                            <div className="text-slate-600 mt-0.5">{maskPII(f.explanation)}</div>
                          </td>
                          <td className="p-2.5 font-mono text-indigo-700">{maskPII(f.evidenceLocator)}</td>
                          <td className="p-2.5 text-slate-800">{maskPII(f.recommendedAction)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Officer Final Recommendation Card */}
            <div className={`p-5 rounded-xl border ${recommendationClass} space-y-3`}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-black/10 pb-2">
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-600">
                    3. Scrutiny Officer Formal Recommendation
                  </div>
                  <div className="text-base font-black mt-0.5">{recommendationLabel}</div>
                </div>
                <div className="font-mono text-xs font-bold uppercase bg-white/80 px-2.5 py-1 rounded border border-black/10">
                  CODE: {recommendation}
                </div>
              </div>

              <div>
                <strong className="text-xs font-bold uppercase tracking-wider block mb-1">
                  Concluding Regulatory Remarks:
                </strong>
                <p className="text-xs leading-relaxed italic">{concludingRemarks}</p>
              </div>
            </div>

            {/* Cryptographic Hash Chain Seal */}
            <div className="relative z-10 p-3 rounded-lg bg-slate-900 text-slate-300 font-mono text-[11px] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-pulse" />
                <span>AICTE Cryptographic Hash-Chain Seal: {hashStamp}</span>
              </div>
              <span className="text-slate-400">Untampered • Verifiable via Tamper-Evident SHA-256 Ledger</span>
            </div>

            {/* Footer Prototype Notice */}
            <div className="relative z-10 text-center text-[10px] text-slate-500 font-bold uppercase pt-4 border-t border-slate-200 print:block">
              AICTE SENTINEL PROTOTYPE DEMONSTRATOR • NOT AN OFFICIAL AICTE DOCUMENT • ALL COMPLIANCE OUTPUTS ADVISORY ONLY
            </div>
          </article>
        );
      })}
    </section>
  );
}
