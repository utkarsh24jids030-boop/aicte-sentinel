import React from 'react';
import { DataStore } from '@/lib/store';
import { InspectionTask, InspectionObservation } from '@/types';
import { formatStatus } from './helpers';

export default function EvcInspectionSection() {
  const tasks = DataStore.getInspectionTasks();

  return (
    <section id="evc-inspections" className="space-y-8 bg-white border border-slate-200 rounded-2xl p-6 md:p-8 shadow-sm">
      <div className="border-b border-slate-200 pb-4">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">
            Field Verification
          </span>
          <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
            Expert Visiting Committee (EVC)
          </span>
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mt-1">
          EVC Inspection Briefs & On-Site Observation Checklist
        </h2>
        <p className="text-sm text-slate-600 mt-1">
          Empowers surprise and scheduled inspection teams with geotagged physical verification checklists, targeting discrepancies flagged during automated document scrutiny.
        </p>
      </div>

      <div className="space-y-8">
        {tasks.map((task: InspectionTask) => (
          <article key={task.id} className="border border-slate-200 rounded-xl p-6 bg-slate-50/50 space-y-6">
            {/* Task Meta */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded border border-amber-200">
                    {task.id}
                  </span>
                  <span className={`px-2 py-0.5 rounded-full border text-xs font-semibold ${formatStatus(task.status)}`}>
                    Status: {task.status}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 mt-2">
                  {task.institutionName}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Inspection Address: {task.siteAddress} • Scheduled Date: {task.scheduledDate}
                </p>
              </div>

              <div className="flex items-center gap-4 bg-white p-3 rounded-xl border border-slate-200 text-center text-xs">
                <div>
                  <div className="text-[10px] font-bold text-slate-500 uppercase">Lead Inspector</div>
                  <div className="font-bold text-slate-900">{task.inspectorName}</div>
                </div>
                <div className="w-px h-8 bg-slate-200" />
                <div>
                  <div className="text-[10px] font-bold text-slate-500 uppercase">High Risk Claims</div>
                  <div className="font-mono font-bold text-rose-600 text-base">{task.highRiskClaimsCount}</div>
                </div>
                <div className="w-px h-8 bg-slate-200" />
                <div>
                  <div className="text-[10px] font-bold text-slate-500 uppercase">Unresolved Gaps</div>
                  <div className="font-mono font-bold text-amber-600 text-base">{task.unresolvedGapsCount}</div>
                </div>
              </div>
            </div>

            {/* Brief Summary Box */}
            <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-200 text-xs">
              <strong className="text-blue-900 block uppercase tracking-wider mb-1">
                Scrutiny Committee Inspection Brief:
              </strong>
              <p className="text-blue-950 leading-relaxed">{task.briefSummary}</p>
            </div>

            {/* Checklist / Observations Table */}
            <div>
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3">
                Field Inspection Checklist & Recorded Observations ({task.observations.length})
              </h4>

              <div className="overflow-x-auto border border-slate-200 rounded-xl bg-white">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-100 text-slate-700 font-bold border-b">
                      <th className="p-2.5">Category</th>
                      <th className="p-2.5">Institutional Statutory Claim</th>
                      <th className="p-2.5">Verification Status</th>
                      <th className="p-2.5">Inspector Findings & Notes</th>
                      <th className="p-2.5">Geotag Coordinates</th>
                      <th className="p-2.5">Timestamp</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {task.observations.map((obs: InspectionObservation) => (
                      <tr key={obs.id} className="hover:bg-slate-50">
                        <td className="p-2.5 font-bold text-slate-900 whitespace-nowrap">
                          {obs.category}
                          <div className="text-[10px] font-mono text-slate-400">{obs.id}</div>
                        </td>
                        <td className="p-2.5 text-slate-800 max-w-xs">{obs.claimText}</td>
                        <td className="p-2.5">
                          <span className={`px-2 py-0.5 rounded-sm border text-[11px] font-bold whitespace-nowrap ${
                            obs.physicalVerificationStatus === 'Verified' ? 'bg-emerald-100 text-emerald-800 border-emerald-300' :
                            obs.physicalVerificationStatus === 'Deficient' ? 'bg-amber-100 text-amber-800 border-amber-300' :
                            obs.physicalVerificationStatus === 'Discrepant' ? 'bg-rose-100 text-rose-800 border-rose-300 font-black' :
                            'bg-slate-100 text-slate-800 border-slate-300'
                          }`}>
                            {obs.physicalVerificationStatus}
                          </span>
                        </td>
                        <td className="p-2.5 text-slate-700 max-w-sm">{obs.observationNotes}</td>
                        <td className="p-2.5 font-mono text-slate-600 whitespace-nowrap">
                          {obs.latitude && obs.longitude ? (
                            <span>{obs.latitude.toFixed(6)}, {obs.longitude.toFixed(6)}</span>
                          ) : (
                            <span className="text-slate-400">Not recorded</span>
                          )}
                        </td>
                        <td className="p-2.5 text-slate-500 whitespace-nowrap">
                          {new Date(obs.capturedAt).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
