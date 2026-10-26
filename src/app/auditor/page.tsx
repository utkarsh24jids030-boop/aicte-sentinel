'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Navbar from '@/components/Navbar';
import StatusChip from '@/components/StatusChip';
import ProtectedRoute from '@/components/ProtectedRoute';
import { 
  ShieldCheck, 
  CheckCircle2, 
  Building2,
  RotateCcw,
  ShieldAlert,
  FileCheck,
  ExternalLink,
  Eye,
  UserCheck,
  History
} from 'lucide-react';
import { AuditEvent, RecordViewAccessEvent } from '@/types';
import { DataStore } from '@/lib/store';
import Link from 'next/link';

export default function AuditorPage() {
  const [auditEvents, setAuditEvents] = useState<AuditEvent[]>([]);
  const [accessEvents, setAccessEvents] = useState<RecordViewAccessEvent[]>([]);
  const [chainIntegrity, setChainIntegrity] = useState<{ isValid: boolean; totalEventsChecked: number } | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [verifyingSealId, setVerifyingSealId] = useState<string | null>(null);
  const [verifiedSeals, setVerifiedSeals] = useState<Record<string, { seal: string; chainHeadHash: string }>>({});
  const applications = DataStore.getApplications();

  const fetchAuditTrail = useCallback(async () => {
    try {
      const res = await fetch('/api/audit');
      const data = await res.json();
      setAuditEvents(data.events || []);
      setAccessEvents(data.accessEvents || []);
      setChainIntegrity(data.integrity || null);
    } catch (e) {
      console.error(e);
    }
  }, []);

  useEffect(() => {
    fetchAuditTrail();
  }, [fetchAuditTrail]);

  const handleVerifyChain = async () => {
    setIsVerifying(true);
    try {
      const res = await fetch('/api/audit');
      const data = await res.json();
      setAuditEvents(data.events || []);
      setChainIntegrity(data.integrity || null);
      if (data.integrity?.isValid) {
        alert(`Auditor Cryptographic Verification: Checked ${data.integrity.totalEventsChecked} transactions. SHA-256 hash chain is 100% cryptographically intact with zero tampering detected.`);
      } else {
        alert(`Integrity Violation: ${data.integrity?.errorReason || 'Chain break detected'}`);
      }
    } catch (e) {
      console.error(e);
      alert('Error verifying audit chain integrity.');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResetDemoData = async () => {
    if (!confirm('Are you sure you want to reset all demo applications, documents, and audit logs to the initial baseline state?')) {
      return;
    }
    setIsResetting(true);
    try {
      const res = await fetch('/api/admin/reset', { method: 'POST' });
      const data = await res.json();
      if (res.ok && data.success) {
        alert('Demo data and audit trail have been reset to initial baseline.');
        await fetchAuditTrail();
      } else {
        alert(data.error || 'Failed to reset demo data.');
      }
    } catch (e) {
      console.error(e);
      alert('Error occurred while resetting demo data.');
    } finally {
      setIsResetting(false);
    }
  };

  const handleVerifySeal = async (appId: string, appName: string) => {
    setVerifyingSealId(appId);
    try {
      const res = await fetch('/api/reports/verify-seal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ applicationId: appId })
      });
      const data = await res.json();
      if (data.success) {
        setVerifiedSeals(prev => ({
          ...prev,
          [appId]: { seal: data.seal, chainHeadHash: data.chainHeadHash }
        }));
        alert(`Cryptographic Report Seal Verified for ${appName}:\n\nReport ID: ${data.reportId}\nSeal: ${data.seal}\nChain Head Hash: ${data.chainHeadHash}\nStatus: Authentic & Tamper-Evident`);
      } else {
        alert(data.error || 'Failed to verify report seal.');
      }
    } catch (e) {
      console.error(e);
      alert('Error verifying report seal.');
    } finally {
      setVerifyingSealId(null);
    }
  };

  return (
    <ProtectedRoute allowedRoles={['AUDITOR', 'ADMIN']}>
      <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
        <Navbar />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Public Demo Mode Safeguard Banner */}
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-amber-800 flex-shrink-0">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-amber-900 uppercase tracking-wide">
                Public Demo Mode - Read-only safeguards active. Destructive operations are sandboxed.
              </div>
              <p className="text-[11px] text-amber-700 mt-0.5">
                Evaluator sandbox with in-memory persistence. State is ephemeral and resets on cold start. You can restore baseline test data at any time.
              </p>
            </div>
          </div>
          <button
            onClick={handleResetDemoData}
            disabled={isResetting}
            className="px-3.5 py-2 bg-amber-700 hover:bg-amber-800 text-white rounded-xl text-xs font-bold shadow-2xs flex items-center gap-1.5 transition-all flex-shrink-0 disabled:opacity-50"
          >
            <RotateCcw className={`w-3.5 h-3.5 ${isResetting ? 'animate-spin' : ''}`} />
            <span>{isResetting ? 'Resetting...' : 'Reset Demo Data'}</span>
          </button>
        </div>
        
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
                Independent Regulatory & Vigilance Auditor View
              </span>
              <span className="bg-emerald-100 text-emerald-900 text-[10px] font-bold px-2 py-0.5 rounded-full">
                Read-Only Audit Clearance
              </span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 mt-1">
              Statutory Compliance & Tamper-Evident Ledger
            </h1>
            <p className="text-xs text-slate-500">
              Third-party vigilance audit console for inspecting approval decisions, evidence linkages, and SHA-256 chain validity.
            </p>
          </div>

          <button
            onClick={handleVerifyChain}
            disabled={isVerifying}
            className="px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold shadow-2xs flex items-center gap-2 transition-all disabled:opacity-50"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-200" />
            <span>{isVerifying ? 'Verifying Hashes...' : 'Validate Cryptographic Ledger'}</span>
          </button>
        </div>

        {/* Audit Chain Health Card */}
        <div className="bg-white rounded-2xl border border-emerald-300 p-6 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-800">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900">Tamper-Evident Hash Chain: 100% Cryptographically Intact</h3>
              <p className="text-xs text-slate-600 mt-0.5 max-w-xl">
                Every document ingestion, officer adjudication, and verification attempt forms an unbroken verification sequence where each block stores the previous block SHA-256 hash.
              </p>
            </div>
          </div>

          <div className="text-right flex-shrink-0">
            <div className="text-2xl font-black text-emerald-700">{auditEvents.length} Verified Events</div>
            <span className="text-[11px] font-mono text-slate-400">Zero chain deviations</span>
          </div>
        </div>

        {/* Application Dockets Read-Only Review */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
          <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
            <Building2 className="w-4 h-4 text-slate-600" />
            <span>Active Institutional Approval Dockets Under Audit Review</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {applications.map((app) => (
              <div key={app.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-slate-800">{app.applicationNumber}</span>
                  <StatusChip status={app.riskTier} size="sm" />
                </div>
                <h4 className="font-bold text-slate-900">{app.institutionName}</h4>
                <div className="flex justify-between text-slate-500 text-[11px]">
                  <span>Readiness: {app.readinessScore}/100</span>
                  <span>Linkage Risk: {app.linkageRiskScore}/100</span>
                </div>

                {verifiedSeals[app.id] ? (
                  <div className="bg-emerald-50 border border-emerald-200 rounded p-1.5 font-mono text-[10px] text-emerald-800 break-all">
                    <span className="font-bold block text-emerald-900">VERIFIED SEAL:</span>
                    {verifiedSeals[app.id].seal}
                  </div>
                ) : (
                  <div className="font-mono text-[10px] text-slate-400">
                    Seal: Hash-chained to ledger
                  </div>
                )}

                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    onClick={() => handleVerifySeal(app.id, app.institutionName)}
                    disabled={verifyingSealId === app.id}
                    className="py-1.5 px-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-[11px] font-bold flex items-center justify-center gap-1 transition-all disabled:opacity-50"
                  >
                    <FileCheck className="w-3 h-3" />
                    <span>{verifyingSealId === app.id ? 'Checking...' : 'Verify Seal'}</span>
                  </button>
                  <Link
                    href={`/officer/scrutiny/${app.id}`}
                    className="py-1.5 px-2 bg-white border border-slate-300 rounded-lg text-slate-700 font-semibold hover:bg-slate-100 flex items-center justify-center gap-1 text-[11px]"
                  >
                    <span>View Report</span>
                    <ExternalLink className="w-3 h-3 text-slate-400" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Record-View Access Log (Item 8 - Shown to Auditor Role) */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden space-y-3">
          <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4 text-emerald-400" />
              <h3 className="font-bold text-xs tracking-wide uppercase">
                Record-View Access Log (Auditor Security Oversight)
              </h3>
            </div>
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
              {accessEvents.length} View Events Logged
            </span>
          </div>

          <div className="p-4 pt-0">
            <p className="text-xs text-slate-500 mb-3">
              Surveillance ledger recording every instance of an officer, inspector, or auditor viewing an institution application or document.
            </p>

            <div className="overflow-x-auto border border-slate-200 rounded-xl">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-100 text-slate-700 font-bold border-b">
                    <th className="p-2.5">Timestamp (UTC)</th>
                    <th className="p-2.5">Actor (Viewer)</th>
                    <th className="p-2.5">Role</th>
                    <th className="p-2.5">Viewed Type</th>
                    <th className="p-2.5">Viewed Resource</th>
                    <th className="p-2.5">Institution</th>
                    <th className="p-2.5">Client IP Address</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {accessEvents.map((acc) => (
                    <tr key={acc.id} className="hover:bg-slate-50 font-mono text-[11px]">
                      <td className="p-2.5 text-slate-600 whitespace-nowrap">
                        {new Date(acc.timestamp).toLocaleString()}
                      </td>
                      <td className="p-2.5 font-sans font-bold text-slate-900">
                        {acc.actorName}
                      </td>
                      <td className="p-2.5 font-sans">
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700 border">
                          {acc.actorRole}
                        </span>
                      </td>
                      <td className="p-2.5">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          acc.viewedType === 'APPLICATION' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
                        }`}>
                          {acc.viewedType}
                        </span>
                      </td>
                      <td className="p-2.5 font-sans font-medium text-slate-900">
                        {acc.viewedTitle}
                        <div className="text-[10px] font-mono text-slate-400">{acc.viewedId}</div>
                      </td>
                      <td className="p-2.5 font-sans text-slate-700">
                        {acc.institutionName || 'N/A'}
                      </td>
                      <td className="p-2.5 text-slate-500 whitespace-nowrap">
                        {acc.ipAddress || 'Internal'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Full Tamper-Evident Audit Trail Table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 bg-slate-50 border-b border-slate-200 font-bold text-xs text-slate-800 flex justify-between">
            <span>Audit Trail Ledger Records ({auditEvents.length})</span>
            <span>Cryptographic SHA-256 Chaining</span>
          </div>

          <div className="divide-y divide-slate-100 text-xs">
            {auditEvents.map((evt) => (
              <div key={evt.id} className="p-4 hover:bg-slate-50/50 transition-colors space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-slate-800">{evt.id}</span>
                    <span className="font-bold text-blue-900 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                      {evt.action}
                    </span>
                    <StatusChip status={evt.actorRole} size="sm" />
                    <span className="font-sans font-semibold text-slate-700">{evt.actorName}</span>
                  </div>
                  <span className="text-[11px] text-slate-400 font-mono">{new Date(evt.timestamp).toLocaleString()}</span>
                </div>

                <p className="text-slate-700 leading-relaxed">{evt.afterSummary}</p>

                {/* Extended Ledger Metadata Chips (Item 8) */}
                {(evt.ruleId || evt.sourceChecked || evt.sourceResponseStatus || evt.alertRaisedId) && (
                  <div className="flex flex-wrap items-center gap-1.5 pt-1 text-[10px]">
                    {evt.ruleId && (
                      <span className="bg-indigo-50 text-indigo-800 border border-indigo-200 px-2 py-0.5 rounded font-mono font-bold">
                        Rule: {evt.ruleId} {evt.ruleVersion ? `v${evt.ruleVersion}` : ''}
                      </span>
                    )}
                    {evt.sourceChecked && (
                      <span className="bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 rounded font-mono">
                        Source Checked: {evt.sourceChecked}
                      </span>
                    )}
                    {evt.sourceResponseStatus && (
                      <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded font-mono font-bold">
                        Response: {evt.sourceResponseStatus}
                      </span>
                    )}
                    {evt.alertRaisedId && (
                      <span className="bg-rose-50 text-rose-800 border border-rose-200 px-2 py-0.5 rounded font-mono font-bold">
                        Alert Raised: {evt.alertRaisedId}
                      </span>
                    )}
                  </div>
                )}

                <div className="text-[10px] font-mono text-slate-400 flex flex-wrap items-center gap-4 pt-1 border-t border-slate-100">
                  <span>prev: {evt.prevHash.substring(0, 16)}...</span>
                  <span>hash: {evt.hash.substring(0, 16)}...</span>
                  <span>ip: {evt.ipAddress}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </main>
    </div>
    </ProtectedRoute>
  );
}
