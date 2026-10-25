import React from 'react';
import { AuditTrailEngine } from '@/lib/audit/trail';
import { AuditEvent } from '@/types';

export default function AuditSection() {
  const events = AuditTrailEngine.getEvents(200);
  const integrity = AuditTrailEngine.verifyChainIntegrity();

  return (
    <section id="audit-trail" className="space-y-8 bg-white border border-slate-200 rounded-2xl p-6 md:p-8 shadow-sm">
      <div className="border-b border-slate-200 pb-4">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
            Vigilance & Oversight
          </span>
          <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
            CAG & Vigilance Audit Node
          </span>
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mt-1">
          Cryptographically Hash-Chained Audit Trail & Ledger
        </h2>
        <p className="text-sm text-slate-600 mt-1">
          Immutable SHA-256 hash-linked ledger recording all document uploads, forensic scans, registry verifications, and regulatory approvals.
        </p>
      </div>

      {/* Cryptographic Integrity Validator Box */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-[#002b66] text-white space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider">
              Cryptographic Integrity Verification Engine
            </div>
            <div className="text-2xl font-bold mt-1 flex items-center gap-3">
              <span className="w-3 h-3 rounded-full bg-emerald-400 inline-block animate-ping" />
              <span>{integrity.isValid ? 'HASH-CHAIN 100% INTACT & UNTAMPERED' : 'CHAIN COMPROMISE DETECTED'}</span>
            </div>
            <p className="text-xs text-slate-300 mt-1">
              Continuously recomputed SHA-256 recursive signature across all {integrity.totalEventsChecked} ledger events.
            </p>
          </div>

          <div className="bg-white/10 p-3 rounded-xl border border-white/20 text-center font-mono text-xs">
            <span className="text-slate-400 block text-[10px] uppercase">Events Checked</span>
            <span className="text-xl font-bold text-emerald-300">{integrity.totalEventsChecked}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-3 border-t border-white/10 font-mono text-[11px]">
          <div className="bg-black/30 p-2.5 rounded-lg">
            <span className="text-slate-400 block text-[10px] uppercase">Genesis Block PrevHash:</span>
            <span className="text-slate-200 break-all">0000000000000000000000000000000000000000000000000000000000000000</span>
          </div>
          <div className="bg-black/30 p-2.5 rounded-lg">
            <span className="text-slate-400 block text-[10px] uppercase">Current Chain Leaf Hash:</span>
            <span className="text-emerald-300 break-all">{events[events.length - 1]?.hash || 'N/A'}</span>
          </div>
        </div>
      </div>

      {/* Audit Event Ledger Table */}
      <div className="space-y-3">
        <h3 className="text-base font-bold text-slate-900">
          Immutable Audit Log Events ({events.length})
        </h3>

        <div className="overflow-x-auto border border-slate-200 rounded-xl">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100 text-slate-700 font-bold border-b">
                <th className="p-2.5">Event ID & Timestamp</th>
                <th className="p-2.5">Actor & Role</th>
                <th className="p-2.5">Action Code</th>
                <th className="p-2.5">Target Entity</th>
                <th className="p-2.5">Event Description & State Mutation</th>
                <th className="p-2.5">SHA-256 Previous & Current Hashes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {events.map((evt: AuditEvent) => (
                <tr key={evt.id} className="hover:bg-slate-50">
                  <td className="p-2.5 font-mono">
                    <span className="font-bold text-slate-900">{evt.id}</span>
                    <div className="text-[10px] text-slate-500">{new Date(evt.timestamp).toLocaleString()}</div>
                  </td>
                  <td className="p-2.5">
                    <div className="font-semibold text-slate-900">{evt.actorName}</div>
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700 border">
                      {evt.actorRole}
                    </span>
                  </td>
                  <td className="p-2.5 font-mono font-bold text-blue-900">
                    {evt.action}
                  </td>
                  <td className="p-2.5 font-mono text-[11px] text-slate-600">
                    <span className="font-semibold text-slate-800">{evt.entityType}</span>
                    <div>{evt.entityId}</div>
                  </td>
                  <td className="p-2.5 max-w-sm text-slate-700">
                    <div className="font-medium text-slate-900">{evt.afterSummary}</div>
                    {evt.beforeSummary && (
                      <div className="text-[10px] text-slate-400 mt-0.5">Prev: {evt.beforeSummary}</div>
                    )}
                  </td>
                  <td className="p-2.5 font-mono text-[10px] text-slate-500 max-w-xs space-y-1">
                    <div className="truncate" title={`prev: ${evt.prevHash}`}>
                      <strong className="text-slate-400">prev:</strong> {evt.prevHash.substring(0, 16)}...
                    </div>
                    <div className="truncate text-emerald-800 font-semibold" title={`hash: ${evt.hash}`}>
                      <strong className="text-slate-400">hash:</strong> {evt.hash.substring(0, 16)}...
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
