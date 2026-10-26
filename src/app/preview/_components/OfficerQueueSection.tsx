import React from 'react';
import { DataStore } from '@/lib/store';
import { formatSeverity, formatStatus } from './helpers';

export default function OfficerQueueSection() {
  const applications = DataStore.getApplications();

  return (
    <section id="officer-queue" className="space-y-6">
      <div className="border-b border-slate-200 pb-4">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-blue-700 uppercase tracking-wider">
            Bureau of Approvals
          </span>
          <span className="bg-blue-100 text-blue-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
            Officer Scrutiny Queue
          </span>
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mt-1">
          Risk-Ranked Institutional Approval Applications
        </h2>
        <p className="text-sm text-slate-600 mt-1">
          Automated multi-factor risk triage ordering applications by statutory deficiency severity and cross-institutional linkage risk.
        </p>
      </div>

      <div className="overflow-x-auto border border-slate-200 rounded-xl bg-white shadow-xs">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-100 border-b border-slate-200 text-slate-700 font-bold uppercase tracking-wider">
              <th className="p-3">Application No.</th>
              <th className="p-3">Institution & Location</th>
              <th className="p-3">Type</th>
              <th className="p-3">Intake (Cur / Prop)</th>
              <th className="p-3">Readiness Score</th>
              <th className="p-3">Linkage Risk</th>
              <th className="p-3">Risk Tier</th>
              <th className="p-3">Status</th>
              <th className="p-3">Findings</th>
              <th className="p-3 text-right">Preview Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {applications.map((app) => {
              const findings = DataStore.getFindings(app.id);
              const criticalCount = findings.filter(f => f.severity === 'Critical').length;
              const institution = DataStore.getInstitutionById(app.institutionId);

              return (
                <tr key={app.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-3 font-mono font-bold text-slate-900">
                    {app.applicationNumber}
                    <div className="text-[10px] font-mono text-slate-400">ID: {app.id}</div>
                  </td>
                  <td className="p-3">
                    <div className="font-bold text-slate-900">{app.institutionName}</div>
                    <div className="text-[11px] text-slate-500">
                      {institution ? `${institution.district}, ${institution.state} • AICTE ID: ${institution.aicteId}` : app.institutionId}
                    </div>
                  </td>
                  <td className="p-3 font-semibold text-slate-700">{app.type}</td>
                  <td className="p-3 font-mono text-slate-700">
                    {app.currentIntake} &rarr; {app.proposedIntake}
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded-md font-bold font-mono text-xs ${
                        app.readinessScore >= 70 ? 'bg-emerald-100 text-emerald-800' :
                        app.readinessScore >= 40 ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-800'
                      }`}>
                        {app.readinessScore}/100
                      </span>
                    </div>
                  </td>
                  <td className="p-3 font-mono font-bold text-slate-800">
                    {app.linkageRiskScore}%
                  </td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded-full border text-[11px] font-bold ${formatSeverity(app.riskTier)}`}>
                      {app.riskTier}
                    </span>
                  </td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded-full border text-[11px] font-semibold ${formatStatus(app.status)}`}>
                      {app.status}
                    </span>
                  </td>
                  <td className="p-3">
                    <div className="font-semibold text-slate-800">
                      {findings.length} {findings.length === 1 ? 'finding' : 'findings'}
                    </div>
                    {criticalCount > 0 && (
                      <div className="text-[11px] font-bold text-rose-600">
                        {criticalCount} Critical
                      </div>
                    )}
                  </td>
                  <td className="p-3 text-right space-x-2 whitespace-nowrap">
                    <a
                      href={`/preview/case/${app.id}`}
                      className="inline-block px-2.5 py-1 bg-[#002b66] hover:bg-[#001f4d] text-white rounded-md font-semibold text-[11px] shadow-xs"
                    >
                      Case File
                    </a>
                    <a
                      href={`/preview/scrutiny/${app.id}`}
                      className="inline-block px-2.5 py-1 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-md font-semibold text-[11px]"
                    >
                      Scrutiny Report
                    </a>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
