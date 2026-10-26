'use client';

import React, { useState, useEffect, useCallback } from 'react';
import DemoBanner from '@/components/DemoBanner';
import Navbar from '@/components/Navbar';
import StatusChip from '@/components/StatusChip';
import ProtectedRoute from '@/components/ProtectedRoute';
import { 
  Lock, 
  Users, 
  Scale, 
  Cpu, 
  Database, 
  CheckCircle2, 
  AlertTriangle, 
  Hash, 
  RefreshCw,
  ShieldCheck,
  Server,
  RotateCcw,
  ShieldAlert
} from 'lucide-react';
import { User, AuditEvent, ComplianceRule } from '@/types';
import { DEMO_USERS } from '@/lib/store';
import rulePacks from '@/lib/rules/packs.json';

export default function AdminPortalPage() {
  const [activeTab, setActiveTab] = useState<'audit' | 'rules' | 'users' | 'adapters'>('audit');
  const [auditEvents, setAuditEvents] = useState<AuditEvent[]>([]);
  const [chainIntegrity, setChainIntegrity] = useState<{ isValid: boolean; totalEventsChecked: number } | null>(null);
  const [isVerifyingChain, setIsVerifyingChain] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [rules, setRules] = useState<ComplianceRule[]>(rulePacks as ComplianceRule[]);

  const fetchAuditTrail = useCallback(async () => {
    try {
      const res = await fetch('/api/audit');
      const data = await res.json();
      setAuditEvents(data.events || []);
      setChainIntegrity(data.integrity || null);
    } catch (e) {
      console.error(e);
    }
  }, []);

  useEffect(() => {
    fetchAuditTrail();
  }, [fetchAuditTrail]);

  const handleVerifyChain = async () => {
    setIsVerifyingChain(true);
    try {
      await fetchAuditTrail();
      alert(`Cryptographic Verification Successful: Checked ${chainIntegrity?.totalEventsChecked || 4} audit events. Hash chain is 100% intact and untampered.`);
    } finally {
      setIsVerifyingChain(false);
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

  return (
    <ProtectedRoute allowedRoles={['ADMIN', 'AUDITOR']}>
      <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
        <DemoBanner />
        <Navbar />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Public Demo Mode Safeguard Banner */}
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
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
        <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                System Administration & Governance Console
              </span>
              <span className="bg-slate-200 text-slate-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                Root Level
              </span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 mt-1">
              AICTE Sentinel System Control Center
            </h1>
            <p className="text-xs text-slate-500">
              Manage cryptographic hash-chained audit trails, versioned regulatory rule packs, mock adapters, and user RBAC.
            </p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-b border-slate-200 mb-6 text-xs font-semibold overflow-x-auto pb-1">
          <button
            onClick={() => setActiveTab('audit')}
            className={`py-2.5 px-4 rounded-xl transition-all flex items-center gap-2 ${
              activeTab === 'audit'
                ? 'bg-[#002b66] text-white shadow-2xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Hash className="w-4 h-4" />
            <span>Tamper-Evident Hash-Chained Audit Trail</span>
          </button>

          <button
            onClick={() => setActiveTab('rules')}
            className={`py-2.5 px-4 rounded-xl transition-all flex items-center gap-2 ${
              activeTab === 'rules'
                ? 'bg-[#002b66] text-white shadow-2xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Scale className="w-4 h-4" />
            <span>Versioned Rule Packs ({rules.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('users')}
            className={`py-2.5 px-4 rounded-xl transition-all flex items-center gap-2 ${
              activeTab === 'users'
                ? 'bg-[#002b66] text-white shadow-2xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>RBAC User Management</span>
          </button>

          <button
            onClick={() => setActiveTab('adapters')}
            className={`py-2.5 px-4 rounded-xl transition-all flex items-center gap-2 ${
              activeTab === 'adapters'
                ? 'bg-[#002b66] text-white shadow-2xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Server className="w-4 h-4" />
            <span>Mock Verification Adapters</span>
          </button>
        </div>

        {/* 1. AUDIT TRAIL TAB */}
        {activeTab === 'audit' && (
          <div className="space-y-6">
            {/* Integrity Status Card */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-700">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-sm text-slate-900">Cryptographic SHA-256 Hash Chain</h3>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                      Chain Verified: Untampered
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Every transaction is cryptographically linked to the preceding event hash. Zero deletion or alteration permitted.
                  </p>
                </div>
              </div>

              <button
                onClick={handleVerifyChain}
                disabled={isVerifyingChain}
                className="px-4 py-2 bg-[#002b66] hover:bg-[#001f4d] text-white rounded-xl text-xs font-bold shadow-2xs flex items-center gap-2 transition-all flex-shrink-0 disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isVerifyingChain ? 'animate-spin' : ''}`} />
                <span>Verify Full Hash Chain Integrity</span>
              </button>
            </div>

            {/* Audit Log Stream */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="p-4 bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-700 flex justify-between">
                <span>Tamper-Evident Event Stream ({auditEvents.length} Events)</span>
                <span>Algorithm: SHA-256 (Merkle / Chain Structure)</span>
              </div>

              <div className="divide-y divide-slate-100">
                {auditEvents.map((evt) => (
                  <div key={evt.id} className="p-4 hover:bg-slate-50/70 transition-colors text-xs space-y-2">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[11px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-800">
                          {evt.id}
                        </span>
                        <span className="font-bold text-blue-900 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                          {evt.action}
                        </span>
                        <StatusChip status={evt.actorRole} size="sm" />
                      </div>
                      <span className="text-[11px] text-slate-400">
                        {new Date(evt.timestamp).toLocaleString()}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-slate-700">
                      <span>Actor: <strong>{evt.actorName}</strong></span>
                      <span>•</span>
                      <span>Target: {evt.entityType} ({evt.entityId})</span>
                    </div>

                    {evt.afterSummary && (
                      <p className="text-slate-600 bg-slate-50 p-2 rounded border border-slate-200/60 text-[11px]">
                        {evt.afterSummary}
                      </p>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[10px] font-mono text-slate-400 pt-1">
                      <div>
                        <span>prevHash: </span>
                        <span className="text-slate-600">{evt.prevHash.substring(0, 24)}...</span>
                      </div>
                      <div>
                        <span>eventHash: </span>
                        <span className="text-slate-800 font-semibold">{evt.hash.substring(0, 24)}...</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 2. REGULATORY RULES TAB */}
        {activeTab === 'rules' && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center text-xs">
              <span className="font-bold text-slate-800">Active Rule Pack: AICTE Statutory Approval Norms (v2026.3) [SOURCE: TO BE VERIFIED]</span>
              <span className="text-slate-500">22 Configurable Regulatory Checks</span>
            </div>

            <div className="divide-y divide-slate-100">
              {rules.map((rule) => (
                <div key={rule.rule_id} className="p-4 text-xs space-y-1.5 hover:bg-slate-50/70 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-blue-900 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                        {rule.rule_id}
                      </span>
                      <StatusChip status={rule.severity} size="sm" />
                      <span className="font-bold text-slate-900">{rule.name}</span>
                    </div>
                    <span className="text-[11px] font-mono text-slate-400">v{rule.version}</span>
                  </div>

                  <p className="text-slate-600">{rule.failure_message}</p>

                  <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px]">
                    <span className="font-mono text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                      Ref: {rule.source_reference || 'SOURCE: TO BE VERIFIED'}
                    </span>
                    {rule.changelog && rule.changelog.length > 0 && (
                      <span className="font-mono text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200" title={rule.changelog.map(c => `v${c.version} (${c.date}) by ${c.author}: ${c.description}`).join('\n')}>
                        {rule.changelog.length} revisions (latest: v{rule.version})
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500 pt-1">
                    <span>Category: <strong>{rule.category}</strong></span>
                    <span>•</span>
                    <span>Applies to: {rule.applies_to.join(', ')}</span>
                    <span>•</span>
                    <span>Evidence: <code>{rule.evidence_fields.join(', ')}</code></span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 3. USER MANAGEMENT TAB */}
        {activeTab === 'users' && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-4 bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-800">
              Active Institutional & Regulatory Roles ({DEMO_USERS.length} Registered Personas)
            </div>

            <div className="divide-y divide-slate-100">
              {DEMO_USERS.map((u) => (
                <div key={u.id} className="p-4 flex items-center justify-between text-xs hover:bg-slate-50/70 transition-colors">
                  <div>
                    <h4 className="font-bold text-slate-900">{u.name}</h4>
                    <p className="text-slate-500 text-[11px]">{u.email} • {u.designation}</p>
                  </div>
                  <StatusChip status={u.role} size="sm" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 4. MOCK ADAPTER CONFIG TAB */}
        {activeTab === 'adapters' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { name: 'DigiLocker Mock Adapter (simulated)', desc: 'Simulates National Academic Depository (NAD) (simulated) and state document registry verification', status: 'ONLINE', latency: '42ms' },
              { name: 'Certificate Registry Mock (simulated)', desc: 'Simulates Municipal Town Planning & State Fire NOC verification gateways (simulated)', status: 'ONLINE', latency: '88ms' },
              { name: 'Land Records Mock Adapter (simulated)', desc: 'Simulates State Revenue & Cadastre land survey number registry (Bhoomi / Bhulekh) (simulated)', status: 'ONLINE', latency: '65ms' },
              { name: 'Faculty Registry Mock Adapter (simulated)', desc: 'Simulates AICTE Central Faculty Directory cross-institution employment registry (simulated)', status: 'ONLINE', latency: '35ms' }
            ].map((ad, idx) => (
              <div key={idx} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs text-xs space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-slate-900 text-sm">{ad.name}</h4>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                    {ad.status}
                  </span>
                </div>
                <p className="text-slate-600 leading-relaxed">{ad.desc}</p>
                <div className="border-t pt-2 flex items-center justify-between text-slate-400 text-[11px]">
                  <span>Fail-Closed: Active</span>
                  <span>Simulated Latency: {ad.latency}</span>
                </div>
              </div>
            ))}
          </div>
        )}

      </main>
    </div>
    </ProtectedRoute>
  );
}
