import React from 'react';
import { DataStore, DEMO_INSTITUTIONS } from '@/lib/store';
import { RulesEngine } from '@/lib/rules/engine';
import { formatSeverity, formatStatus } from './helpers';

export default function InstitutionSection() {
  const institution = DEMO_INSTITUTIONS[0]; // Sunrise Institute of Technology
  const app = DataStore.getApplicationById('app-sunrise-001') || DataStore.getApplications()[0];
  const documents = DataStore.getDocuments(app.id);
  const { breakdown } = RulesEngine.evaluateApplication(app, documents);

  const wizardSteps = [
    { step: 1, title: 'Institutional Profile', status: 'COMPLETED', desc: 'Trust deed, cadastral survey, campus acreage verification' },
    { step: 2, title: 'Academic Programmes & Intake', status: 'COMPLETED', desc: 'Sanctioned programmes (CSE, ECE, ME) and faculty quota balance' },
    { step: 3, title: 'Statutory Document Vault', status: 'COMPLETED', desc: 'SHA-256 hashed PDFs linked to DigiLocker & land registries' },
    { step: 4, title: 'Compliance Self-Assessment', status: 'ACTIVE', desc: 'Real-time rule engine scoring and deficiency rectification preview' },
    { step: 5, title: 'Final AICTE Submission', status: 'PENDING', desc: 'Digital signature seal and hash-chained audit logging' }
  ];

  const checklistItems = [
    { doc: 'Registered Land Deed', mandatory: true, status: 'Verified', note: 'Survey 144/2 (4.85 Acres) verified on Bhoomi Registry' },
    { doc: 'Fire Safety NOC', mandatory: true, status: 'Expired', note: 'Certificate expired on 2024-01-14. Renewal NOC required immediately' },
    { doc: 'Approved Building Plan', mandatory: true, status: 'Verified', note: 'BBMP sanctioned plan (14,200 sq.m built-up area)' },
    { doc: 'Faculty Ph.D. Certificates', mandatory: true, status: 'Verified', note: 'Anna University repository verified for HoDs' },
    { doc: 'Audited Financial Statements', mandatory: true, status: 'Verified', note: 'FY 2024-25 balance sheet verified with ICAI UDIN' }
  ];

  return (
    <section id="institution-portal" className="space-y-8 bg-white border border-slate-200 rounded-2xl p-6 md:p-8 shadow-sm">
      <div className="border-b border-slate-200 pb-4">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-blue-700 uppercase tracking-wider">
            Applicant Portal
          </span>
          <span className="bg-blue-100 text-blue-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
            Institution Self-Assessment & Scrutiny Readiness
          </span>
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mt-1">
          {institution.name} — Approval Application Dashboard
        </h2>
        <p className="text-sm text-slate-600 mt-1">
          Self-service approval workbench with predictive readiness scoring, preventing surprise deficiencies before formal committee submission.
        </p>
      </div>

      {/* Institution Details Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs">
        <div>
          <span className="font-bold text-slate-500 uppercase block mb-1">AICTE Permanent ID</span>
          <span className="font-mono font-bold text-slate-900">{institution.aicteId}</span>
        </div>
        <div>
          <span className="font-bold text-slate-500 uppercase block mb-1">Sponsoring Trust</span>
          <span className="font-semibold text-slate-900">{institution.trustName}</span>
        </div>
        <div>
          <span className="font-bold text-slate-500 uppercase block mb-1">Campus Land Area</span>
          <span className="font-mono text-slate-900">{institution.landAreaAcres} Acres (Survey {institution.landSurveyNumber})</span>
        </div>
        <div>
          <span className="font-bold text-slate-500 uppercase block mb-1">Application Reference</span>
          <span className="font-mono text-blue-700 font-bold">{app.applicationNumber}</span>
        </div>
      </div>

      {/* Readiness Gauge & Breakdown (Rendered as Plain HTML Text & Numbers) */}
      <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 to-[#002b66] text-white space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="text-xs font-bold text-amber-400 uppercase tracking-wider">Statutory Readiness Index</div>
            <h3 className="text-3xl font-black font-mono text-white mt-1">
              {breakdown.score} / {breakdown.maxScore} Points
            </h3>
            <p className="text-xs text-blue-200 mt-1">
              Passed {breakdown.passedChecks} of {breakdown.totalChecks} statutory checks adhering to the 2026 Approval Process Handbook.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            <div className="bg-white/10 px-3 py-2 rounded-xl border border-white/20">
              <div className="text-[10px] text-rose-300 font-bold uppercase">Critical (-25 pts)</div>
              <div className="text-xl font-bold font-mono text-white mt-0.5">{breakdown.criticalDeficiencies}</div>
            </div>
            <div className="bg-white/10 px-3 py-2 rounded-xl border border-white/20">
              <div className="text-[10px] text-amber-300 font-bold uppercase">High (-15 pts)</div>
              <div className="text-xl font-bold font-mono text-white mt-0.5">{breakdown.highDeficiencies}</div>
            </div>
            <div className="bg-white/10 px-3 py-2 rounded-xl border border-white/20">
              <div className="text-[10px] text-yellow-300 font-bold uppercase">Medium (-8 pts)</div>
              <div className="text-xl font-bold font-mono text-white mt-0.5">{breakdown.mediumDeficiencies}</div>
            </div>
            <div className="bg-white/10 px-3 py-2 rounded-xl border border-white/20">
              <div className="text-[10px] text-blue-300 font-bold uppercase">Low (-3 pts)</div>
              <div className="text-xl font-bold font-mono text-white mt-0.5">{breakdown.lowDeficiencies}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Application Wizard Steps */}
      <div>
        <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-3">
          Application Submission Progress
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          {wizardSteps.map((w) => (
            <div key={w.step} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 space-y-1 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-400">Step {w.step}</span>
                <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                  w.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-800' :
                  w.status === 'ACTIVE' ? 'bg-blue-100 text-blue-800' : 'bg-slate-200 text-slate-600'
                }`}>
                  {w.status}
                </span>
              </div>
              <div className="font-bold text-slate-900">{w.title}</div>
              <p className="text-[11px] text-slate-500 leading-snug">{w.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Statutory Document Checklist */}
      <div>
        <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-3">
          Statutory Document Vault Checklist
        </h3>
        <div className="overflow-x-auto border border-slate-200 rounded-xl">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100 text-slate-700 font-bold border-b">
                <th className="p-2.5">Document Requirement</th>
                <th className="p-2.5">Mandatory</th>
                <th className="p-2.5">Registry Status</th>
                <th className="p-2.5">Verification Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {checklistItems.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-50">
                  <td className="p-2.5 font-bold text-slate-900">{item.doc}</td>
                  <td className="p-2.5 text-slate-600">{item.mandatory ? 'Yes' : 'Optional'}</td>
                  <td className="p-2.5">
                    <span className={`px-2 py-0.5 rounded-sm border text-[11px] font-bold ${formatStatus(item.status)}`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="p-2.5 text-slate-700">{item.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Actionable Deficiency List & Rectification Guidance */}
      <div>
        <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-3">
          Active Statutory Deficiencies & Rectification Instructions ({breakdown.deficiencies.length})
        </h3>
        <div className="space-y-3">
          {breakdown.deficiencies.map((d, idx) => (
            <div key={idx} className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 space-y-2 text-xs">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded-sm border text-[10px] font-bold ${formatSeverity(d.severity)}`}>
                    {d.severity}
                  </span>
                  <span className="font-mono text-slate-500 bg-slate-200 px-1.5 py-0.5 rounded-sm">{d.ruleId}</span>
                  <span className="font-bold text-slate-900">{d.ruleName}</span>
                </div>
              </div>

              <div className="text-rose-800 font-semibold bg-rose-50 p-2 rounded border border-rose-200">
                Statutory Non-Compliance: {d.message}
              </div>

              <div className="text-slate-800 bg-white p-3 rounded-lg border border-slate-200">
                <strong className="text-blue-900 block mb-1 uppercase tracking-wider text-[11px]">
                  Prescribed Rectification Guidance:
                </strong>
                <p className="text-slate-700 leading-relaxed">{d.recommendedAction}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
