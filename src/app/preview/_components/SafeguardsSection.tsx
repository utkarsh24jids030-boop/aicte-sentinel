import React from 'react';
import { 
  ShieldCheck, 
  Lock, 
  UserCheck, 
  Database, 
  FileText, 
  Eye, 
  AlertTriangle, 
  CheckCircle2, 
  Clock,
  Server,
  KeyRound
} from 'lucide-react';

export default function SafeguardsSection() {
  const rbacMatrix = [
    {
      role: 'INSTITUTION',
      description: 'Authorized representative of applying institution',
      canSubmit: 'Yes (Own application only)',
      canRectify: 'Yes (Self-service deficiency rectification)',
      canReviewOfficer: 'No (Read-only status & reports)',
      canInspectEVC: 'No',
      canAuditLedger: 'No',
      canExportSeal: 'Yes (Validation Report prototype)'
    },
    {
      role: 'OFFICER',
      description: 'AICTE Regulation Bureau Scrutiny Officer',
      canSubmit: 'No',
      canRectify: 'No (Reviews rectification submissions)',
      canReviewOfficer: 'Yes (Full scrutiny, clarification, escalation)',
      canInspectEVC: 'Can trigger & recommend EVC brief',
      canAuditLedger: 'Yes (View audit ledger)',
      canExportSeal: 'Yes (Generate sealed Scrutiny Reports)'
    },
    {
      role: 'EVC_INSPECTOR',
      description: 'Expert Visiting Committee field inspection member',
      canSubmit: 'No',
      canRectify: 'No',
      canReviewOfficer: 'Assigned inspection docket only',
      canInspectEVC: 'Yes (Record field observations & geotagged photos)',
      canAuditLedger: 'No',
      canExportSeal: 'No'
    },
    {
      role: 'ADMIN',
      description: 'Platform technical administrator',
      canSubmit: 'No',
      canRectify: 'No',
      canReviewOfficer: 'Read-only configuration oversight',
      canInspectEVC: 'No',
      canAuditLedger: 'Yes (Manage & reset demo benchmarks)',
      canExportSeal: 'No'
    },
    {
      role: 'AUDITOR',
      description: 'Independent Vigilance / Statutory Comptroller Oversight',
      canSubmit: 'No',
      canRectify: 'No',
      canReviewOfficer: 'Read-only audit surveillance across all dockets',
      canInspectEVC: 'Read-only observation trail',
      canAuditLedger: 'Full access to hash-chain & record-view access logs',
      canExportSeal: 'Yes (Verify cryptographic SHA-256 seals)'
    }
  ];

  return (
    <section id="safeguards-handling" className="space-y-8 bg-white border border-slate-200 rounded-2xl p-6 md:p-8 shadow-sm">
      {/* Header */}
      <div className="border-b border-slate-200 pb-5">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-blue-700 uppercase tracking-wider">
            Governance & Compliance Architecture
          </span>
          <span className="bg-blue-100 text-blue-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
            Safeguards & Data Handling Policy
          </span>
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mt-1">
          Safeguards, Data Handling & Regulatory Boundaries
        </h2>
        <p className="text-sm text-slate-600 mt-1 max-w-3xl leading-relaxed">
          Statutory operational guarantees ensuring constitutional due process, robust data governance, role-scoped registry communications, and strict prohibition of automated adverse regulatory outcomes.
        </p>
      </div>

      {/* 1. Human Review Mandate & Code Enforcement Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-[#002b66] text-white space-y-3">
        <div className="flex items-center gap-2.5">
          <UserCheck className="w-6 h-6 text-emerald-400 shrink-0" />
          <h3 className="text-lg font-bold">
            Mandatory Human Review Guarantee: No Adverse Regulatory Action Taken by Machine
          </h3>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed max-w-4xl">
          AICTE Sentinel is designed strictly as an <strong>explainable decision-support instrument</strong> for Regulation Bureau scrutiny officers. In accordance with administrative natural justice and statutory rules, <strong>no application may be rejected, sanctioned, or assigned an adverse regulatory outcome automatically</strong> by algorithm. Scrutiny officers retain sole discretion.
        </p>
        <div className="p-3 bg-white/10 rounded-xl border border-white/20 text-xs font-mono text-emerald-300 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>
            <strong>Enforced in Platform Code:</strong> API route <code>/api/findings/[id]/action</code> and <code>DataStore.updateFindingStatus</code> programmatically reject adverse status mutations (&ldquo;Confirmed by Officer&rdquo; / &ldquo;Escalated for EVC&rdquo;) unless both a written justification and an identifiable named regulatory officer are provided.
          </span>
        </div>
      </div>

      {/* 2. Role-Based Access Control (RBAC) Matrix */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Lock className="w-4 h-4 text-blue-700" />
          <h3 className="text-base font-bold text-slate-900">
            Role-Based Access Control (RBAC) Matrix
          </h3>
        </div>
        <p className="text-xs text-slate-500">
          Enforces strict least-privilege scoping across all institutional, officer, field inspection, and vigilance roles.
        </p>

        <div className="overflow-x-auto border border-slate-200 rounded-xl">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100 text-slate-700 font-bold border-b">
                <th className="p-3">Portal Role</th>
                <th className="p-3">Designation & Description</th>
                <th className="p-3">Application Submission</th>
                <th className="p-3">Deficiency Rectification</th>
                <th className="p-3">Officer Scrutiny & Adjudication</th>
                <th className="p-3">Field Inspection (EVC)</th>
                <th className="p-3">Vigilance Audit Trail</th>
                <th className="p-3">Cryptographic Seal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {rbacMatrix.map((item) => (
                <tr key={item.role} className="hover:bg-slate-50">
                  <td className="p-3 font-mono font-bold text-blue-900">
                    {item.role}
                  </td>
                  <td className="p-3 text-slate-700 font-medium">
                    {item.description}
                  </td>
                  <td className="p-3 text-slate-600">
                    {item.canSubmit}
                  </td>
                  <td className="p-3 text-slate-600">
                    {item.canRectify}
                  </td>
                  <td className="p-3 text-slate-600">
                    {item.canReviewOfficer}
                  </td>
                  <td className="p-3 text-slate-600">
                    {item.canInspectEVC}
                  </td>
                  <td className="p-3 text-slate-600">
                    {item.canAuditLedger}
                  </td>
                  <td className="p-3 text-slate-600">
                    {item.canExportSeal}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 3. Non-Bypass Architecture & Authorized Role-Scoped Credentials */}
      <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
        <div className="flex items-center gap-2">
          <KeyRound className="w-5 h-5 text-indigo-700" />
          <h3 className="text-sm font-bold text-slate-900">
            Non-Bypass Architecture &amp; Authorized Role-Scoped Credentials
          </h3>
        </div>
        <p className="text-xs text-slate-700 leading-relaxed">
          The system <strong>does not bypass access controls or assume access to restricted government databases</strong>. In an operational production deployment:
        </p>
        <ul className="text-xs text-slate-600 space-y-1.5 list-disc pl-5 leading-relaxed">
          <li>
            <strong>External Registry Adapters:</strong> Communications with DigiLocker, State Directorate of Technical Education (DTE), Revenue Land Cadastres, and ICAI UDIN repositories occur exclusively through authorized government gateways utilizing mutual TLS (mTLS 1.3).
          </li>
          <li>
            <strong>Role-Scoped Token Exchange:</strong> API requests utilize official departmental client credentials with time-bound JWT authorization claims. No raw internal database bypass or elevated root privilege is ever granted to client interfaces.
          </li>
          <li>
            <strong>Fail-Closed Gateway Fallback:</strong> If any external authority adapter suffers network degradation or unavailable endpoints, the document status transitions safely to <code className="bg-white px-1.5 py-0.5 rounded border border-slate-300 font-mono text-[11px] font-bold text-amber-800">Source Unavailable</code> or <code className="bg-white px-1.5 py-0.5 rounded border border-slate-300 font-mono text-[11px] font-bold text-blue-800">Verification Pending</code>. Under no circumstances does the engine synthesize a passing clearance.
          </li>
        </ul>
      </div>

      {/* 4. Record-View Access Logging & PII Masking Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Access Logging */}
        <div className="p-5 rounded-2xl border border-slate-200 bg-white space-y-2.5">
          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4 text-emerald-700" />
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Tamper-Evident Record-View Access Logging
            </h4>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Every instance of an officer, inspector, or auditor viewing an institution application dossier or inspecting an uploaded document passport is logged in real-time.
          </p>
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-[11px] font-mono text-slate-700 space-y-1">
            <div>• Recorded parameters: Actor ID, Full Name, Role, Viewed Entity, Timestamp, IP Address.</div>
            <div>• Visible to: Independent Auditor Role on <code>/auditor</code> and <code>/preview/audit</code>.</div>
            <div>• Cryptographically anchored into SHA-256 tamper-evident ledger.</div>
          </div>
        </div>

        {/* PII Masking */}
        <div className="p-5 rounded-2xl border border-slate-200 bg-white space-y-2.5">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-indigo-700" />
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Personally Identifiable Information (PII) Masking
            </h4>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Statutory privacy safeguards implemented across all portal streams, OCR extraction views, and export previews:
          </p>
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-[11px] font-mono text-slate-700 space-y-1">
            <div>• PAN Sanitization: First 5 characters masked (e.g. <code>DEMOPAN9999X</code> &rarr; <code>XXXXX9999X</code>).</div>
            <div>• Aadhaar Prohibition: 12-digit Aadhaar identifiers strictly prohibited; 0 occurrences in codebase.</div>
            <div>• Personal mobile numbers and private email addresses redacted from public previews.</div>
          </div>
        </div>
      </div>

      {/* 5. Configurable Data-Retention Policy */}
      <div className="p-5 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-3">
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-amber-700" />
          <h3 className="text-sm font-bold text-amber-950">
            Configurable Data-Retention Policy
          </h3>
          <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-amber-200 text-amber-900 border border-amber-300 uppercase">
            Placeholder for Official AICTE Policy
          </span>
        </div>
        <p className="text-xs text-amber-900 leading-relaxed">
          The retention schedule is fully configurable through platform environment variables. The defaults configured below represent engineering placeholders pending official Gazette notification by the AICTE Regulation Bureau:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
          <div className="p-3 bg-white rounded-xl border border-amber-200">
            <span className="text-[10px] uppercase font-bold text-slate-500 block">Approved EoA Dockets</span>
            <span className="font-mono font-bold text-slate-900 text-sm">7 Years</span>
            <span className="text-[10px] text-slate-500 block mt-0.5">Placeholder default</span>
          </div>

          <div className="p-3 bg-white rounded-xl border border-amber-200">
            <span className="text-[10px] uppercase font-bold text-slate-500 block">Deficiency &amp; Vigilance Files</span>
            <span className="font-mono font-bold text-slate-900 text-sm">10 Years</span>
            <span className="text-[10px] text-slate-500 block mt-0.5">Placeholder default</span>
          </div>

          <div className="p-3 bg-white rounded-xl border border-amber-200">
            <span className="text-[10px] uppercase font-bold text-slate-500 block">OCR Scratch &amp; Temp Files</span>
            <span className="font-mono font-bold text-slate-900 text-sm">90 Days</span>
            <span className="text-[10px] text-slate-500 block mt-0.5">Purged on schedule</span>
          </div>

          <div className="p-3 bg-white rounded-xl border border-amber-200">
            <span className="text-[10px] uppercase font-bold text-slate-500 block">Cryptographic Audit Ledger</span>
            <span className="font-mono font-bold text-emerald-700 text-sm">Indefinite</span>
            <span className="text-[10px] text-slate-500 block mt-0.5">Permanent tamper-evidence</span>
          </div>
        </div>
      </div>
    </section>
  );
}
