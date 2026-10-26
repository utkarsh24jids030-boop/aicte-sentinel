import React from 'react';
import rulePacks from '@/lib/rules/packs.json';
import { ComplianceRule } from '@/types';
import { formatSeverity } from './helpers';

export default function AdminSection() {
  const rules = rulePacks as ComplianceRule[];

  const adapters = [
    {
      name: 'DigiLocker Mock Adapter (simulated)',
      target: 'National DigiLocker Repository (MeitY) (simulated)',
      protocol: 'REST / OAuth2 PKCE (simulated)',
      latency: '240ms',
      failClosed: 'Fail-Closed (Source Unavailable on Timeout/Offline)',
      status: 'ONLINE',
      records: '15,000+ Mock Digital Certificates (simulated)'
    },
    {
      name: 'Certificate Registry Mock Adapter (simulated)',
      target: 'State Fire & Safety Clearinghouses (simulated)',
      protocol: 'REST / HTTPS Gateway (simulated)',
      latency: '410ms',
      failClosed: 'Fail-Closed (Unverified / Expired never pass)',
      status: 'ONLINE',
      records: 'Karnataka, Maharashtra, Delhi Fire Depots (simulated)'
    },
    {
      name: 'Land Records Cadastre Mock Adapter (simulated)',
      target: 'State Digital Land Cadastres (Bhoomi / Mahabhulekh) (simulated)',
      protocol: 'REST / HTTPS GeoJSON (simulated)',
      latency: '310ms',
      failClosed: 'Fail-Closed (Manual review required if unindexed)',
      status: 'ONLINE',
      records: 'Cadastral parcel polygons & encumbrance registers (simulated)'
    },
    {
      name: 'AICTE Faculty Directory (NFD) Mock (simulated)',
      target: 'AICTE Central Faculty Portal (simulated)',
      protocol: 'REST / HTTPS (simulated)',
      latency: '180ms',
      failClosed: 'Fail-Closed (Dual affiliation strictly triggers Mismatch)',
      status: 'ONLINE',
      records: 'Faculty PAN concurrent cross-matching (simulated)'
    },
    {
      name: 'State Directorate of Technical Education Mock Adapter (simulated)',
      target: 'State Higher & Technical Education Portals (simulated)',
      protocol: 'REST / HTTPS Gateway (simulated)',
      latency: '5,240ms',
      failClosed: 'Fail-Closed (Gateway timeout triggers Source Unavailable)',
      status: 'DEGRADED (TIMEOUT)',
      records: 'Apex Polytechnic NOC request (DTE-APEX-NOC-990) timed out; fail-closed routed to officer review'
    }
  ];

  return (
    <section id="admin-configuration" className="space-y-8 bg-white border border-slate-200 rounded-2xl p-6 md:p-8 shadow-sm">
      <div className="border-b border-slate-200 pb-4">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            System Administration
          </span>
          <span className="bg-slate-200 text-slate-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
            Rules Engine & Verification Gateway Configuration
          </span>
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mt-1">
          Statutory Compliance Rule Packs & Adapters
        </h2>
        <p className="text-sm text-slate-600 mt-1">
          Versioned compliance rule specifications and fail-closed government registry integration adapters enforcing the 2026 Approval Process Norms.
        </p>
      </div>

      {/* Verification Adapters Table */}
      <div className="space-y-3">
        <h3 className="text-base font-bold text-slate-900">
          1. Simulated Government Registry Adapters ({adapters.length})
        </h3>
        <div className="overflow-x-auto border border-slate-200 rounded-xl">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100 text-slate-700 font-bold border-b">
                <th className="p-2.5">Adapter Name</th>
                <th className="p-2.5">Target Registry</th>
                <th className="p-2.5">Protocol / Interface</th>
                <th className="p-2.5">Fail-Closed Security Policy</th>
                <th className="p-2.5">Simulated Latency</th>
                <th className="p-2.5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {adapters.map((a, idx) => (
                <tr key={idx} className="hover:bg-slate-50">
                  <td className="p-2.5 font-bold text-slate-900">{a.name}</td>
                  <td className="p-2.5 text-slate-700">{a.target}</td>
                  <td className="p-2.5 font-mono text-slate-600">{a.protocol}</td>
                  <td className="p-2.5 font-semibold text-rose-700">{a.failClosed}</td>
                  <td className="p-2.5 font-mono text-slate-600">{a.latency}</td>
                  <td className="p-2.5">
                    <span className={`px-2 py-0.5 rounded-sm border font-bold text-[10px] ${
                      a.status.includes('DEGRADED')
                        ? 'bg-amber-100 text-amber-900 border-amber-300'
                        : 'bg-emerald-100 text-emerald-800 border-emerald-300'
                    }`}>
                      {a.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Compliance Rules Table */}
      <div className="space-y-3">
        <h3 className="text-base font-bold text-slate-900">
          2. Complete Statutory Compliance Rule Pack ({rules.length} Rules)
        </h3>
        <div className="overflow-x-auto border border-slate-200 rounded-xl">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100 text-slate-700 font-bold border-b">
                <th className="p-2.5">Rule ID</th>
                <th className="p-2.5">Version</th>
                <th className="p-2.5">Source Reference</th>
                <th className="p-2.5">Changelog</th>
                <th className="p-2.5">Category</th>
                <th className="p-2.5">Rule Name</th>
                <th className="p-2.5">Severity</th>
                <th className="p-2.5">Applies To</th>
                <th className="p-2.5">Logic Expression</th>
                <th className="p-2.5">Evidence Fields</th>
                <th className="p-2.5">Statutory Defect Message</th>
                <th className="p-2.5">Prescribed Rectification</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {rules.map((rule) => (
                <tr key={rule.rule_id} className="hover:bg-slate-50">
                  <td className="p-2.5 font-mono font-bold text-blue-900">{rule.rule_id}</td>
                  <td className="p-2.5 font-mono text-slate-500">v{rule.version}</td>
                  <td className="p-2.5 font-mono text-[10px] text-amber-800 bg-amber-50/50">{rule.source_reference || 'SOURCE: TO BE VERIFIED'}</td>
                  <td className="p-2.5 font-mono text-[10px] text-slate-600">{rule.changelog?.length ? `${rule.changelog.length} revisions` : '1 revision'}</td>
                  <td className="p-2.5 font-semibold text-slate-800">{rule.category}</td>
                  <td className="p-2.5 font-bold text-slate-900">{rule.name}</td>
                  <td className="p-2.5">
                    <span className={`px-2 py-0.5 rounded-sm border text-[10px] font-bold ${formatSeverity(rule.severity)}`}>
                      {rule.severity}
                    </span>
                  </td>
                  <td className="p-2.5 text-[11px] font-mono text-slate-600">
                    {rule.applies_to.join(', ')}
                  </td>
                  <td className="p-2.5 font-mono text-[11px] text-indigo-700 max-w-xs">{rule.logic}</td>
                  <td className="p-2.5 font-mono text-[11px] text-slate-600">{rule.evidence_fields.join(', ')}</td>
                  <td className="p-2.5 text-rose-800 max-w-xs">{rule.failure_message}</td>
                  <td className="p-2.5 text-slate-700 max-w-xs">{rule.recommended_action}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
