import React from 'react';
import { DataStore } from '@/lib/store';

export default function PreviewIndexPage() {
  const applications = DataStore.getApplications();

  const previewRoutes = [
    {
      title: 'Complete Single-Page View (/preview/all)',
      href: '/preview/all',
      description: 'One continuous HTML document containing all regulatory views, case files, radar tables, scrutiny reports, and audit logs.',
      badge: 'All-in-One'
    },
    {
      title: 'Risk-Ranked Officer Queue',
      href: '/preview/officer',
      description: 'Prioritized scrutiny queue of applications ordered by readiness score deductions and linkage risk.',
      badge: 'Officer View'
    },
    {
      title: 'Linkage Radar & Entity Graph',
      href: '/preview/radar',
      description: 'Entity resolution graph with plain HTML tables of nodes and edges exposing shared land parcels and concurrent faculty claims.',
      badge: 'Compliance Intelligence'
    },
    {
      title: 'EVC Field Inspection Copilot',
      href: '/preview/evc',
      description: 'Expert Visiting Committee on-site inspection tasks, briefs, geotagged observation checklist, and verification outcomes.',
      badge: 'Inspection'
    },
    {
      title: 'Institution Dashboard & Readiness',
      href: '/preview/institution',
      description: 'Applicant institutional view showcasing the 5-step wizard, document checklist, readiness index, and actionable rectifications.',
      badge: 'Institution'
    },
    {
      title: 'Statutory Rule Packs & Adapters',
      href: '/preview/admin',
      description: 'Full statutory rule engine catalog (22+ rules) and fail-closed government registry integration configurations.',
      badge: 'Admin'
    },
    {
      title: 'Cryptographic Audit Trail',
      href: '/preview/audit',
      description: 'Tamper-evident SHA-256 hash-chained event ledger and live integrity verification result for vigilance reviewers.',
      badge: 'Auditor'
    },
    {
      title: 'Engine Benchmark Metrics',
      href: '/preview/metrics',
      description: 'Deterministic synthetic evaluation dataset (120 applications, 480 docs) measuring extraction accuracy, precision, recall, and latency.',
      badge: 'Evaluation'
    }
  ];

  return (
    <div className="space-y-8">
      <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-3">
        <span className="text-xs font-bold text-blue-700 uppercase tracking-wider">
          External Reviewer & Automated Scrutiny Portal
        </span>
        <h1 className="text-3xl font-extrabold text-slate-900">
          AICTE Sentinel — Public Read-Only Preview Index
        </h1>
        <p className="text-sm text-slate-600 max-w-3xl leading-relaxed">
          This portal provides <strong>100% server-rendered, unauthenticated HTML previews</strong> of the entire AICTE Sentinel platform. Every page below renders its full data payload directly into raw HTML without requiring browser login, client-side JavaScript, or modal interaction.
        </p>
      </div>

      {/* Main Preview Routes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {previewRoutes.map((route) => (
          <a
            key={route.href}
            href={route.href}
            className="block p-5 bg-white rounded-xl border border-slate-200 hover:border-blue-500 hover:shadow-md transition-all group"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold font-mono text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                {route.badge}
              </span>
              <span className="text-xs font-semibold text-slate-400 group-hover:text-blue-600 transition-colors">
                Open &rarr;
              </span>
            </div>
            <h2 className="text-base font-bold text-slate-900 group-hover:text-blue-900 transition-colors">
              {route.title}
            </h2>
            <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
              {route.description}
            </p>
          </a>
        ))}
      </div>

      {/* Seeded Case Files & Scrutiny Reports Links */}
      <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
        <div>
          <h2 className="text-lg font-bold text-slate-900">
            Seeded Application Deep Dives ({applications.length} Cases)
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Direct HTML access to individual case files, verification passports, and official scrutiny reports:
          </p>
        </div>

        <div className="overflow-x-auto border border-slate-200 rounded-xl">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100 text-slate-700 font-bold border-b">
                <th className="p-3">Application No.</th>
                <th className="p-3">Institution Name</th>
                <th className="p-3">Type</th>
                <th className="p-3">Readiness</th>
                <th className="p-3">Linkage Risk</th>
                <th className="p-3 text-right">Direct Preview Links</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {applications.map((app) => (
                <tr key={app.id} className="hover:bg-slate-50">
                  <td className="p-3 font-mono font-bold text-slate-900">{app.applicationNumber}</td>
                  <td className="p-3 font-bold text-slate-800">{app.institutionName}</td>
                  <td className="p-3 text-slate-600">{app.type}</td>
                  <td className="p-3 font-mono font-bold text-blue-900">{app.readinessScore}/100</td>
                  <td className="p-3 font-mono font-bold text-rose-600">{app.linkageRiskScore}%</td>
                  <td className="p-3 text-right space-x-2">
                    <a
                      href={`/preview/case/${app.id}`}
                      className="inline-block px-3 py-1 bg-[#002b66] hover:bg-[#001f4d] text-white rounded-md font-semibold text-xs shadow-xs"
                    >
                      Full Case File
                    </a>
                    <a
                      href={`/preview/scrutiny/${app.id}`}
                      className="inline-block px-3 py-1 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-md font-semibold text-xs"
                    >
                      Scrutiny Report
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
