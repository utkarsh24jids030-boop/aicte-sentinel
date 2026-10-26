import React from 'react';
import OfficerQueueSection from '../_components/OfficerQueueSection';
import CaseFileSection from '../_components/CaseFileSection';
import LinkageRadarSection from '../_components/LinkageRadarSection';
import ScrutinyReportSection from '../_components/ScrutinyReportSection';
import EvcInspectionSection from '../_components/EvcInspectionSection';
import InstitutionSection from '../_components/InstitutionSection';
import AdminSection from '../_components/AdminSection';
import AuditSection from '../_components/AuditSection';
import MetricsSection from '../_components/MetricsSection';
import SafeguardsSection from '../_components/SafeguardsSection';
import ConformanceSection from '../_components/ConformanceSection';

export default function PreviewAllPage() {
  return (
    <div className="space-y-16">
      {/* Intro Header */}
      <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-3">
        <div className="inline-block px-2.5 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-bold uppercase tracking-wider">
          Complete Public Snapshot
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900">
          AICTE Sentinel — Comprehensive Master System Preview
        </h1>
        <p className="text-sm text-slate-600 max-w-4xl leading-relaxed">
          This continuous single-page view consolidates the entire statutory scrutiny workflow: officer queues, full multi-institutional case files, verification passports, entity resolution linkage graphs, field inspection checklists, applicant readiness breakdowns, compliance rule packs, and tamper-evident audit trails. All rendered directly on the server without client-side authentication gates or lazy scripts.
        </p>

        {/* In-page quick jump navigation */}
        <div className="pt-4 border-t border-slate-200 flex flex-wrap gap-2 text-xs">
          <span className="font-bold text-slate-500 py-1">Quick Jump:</span>
          <a href="#officer-queue" className="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-800 font-medium">1. Officer Queue</a>
          <a href="#case-files" className="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-800 font-medium">2. Case Files &amp; Passports</a>
          <a href="#linkage-radar" className="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-800 font-medium">3. Linkage Radar</a>
          <a href="#scrutiny-reports" className="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-800 font-medium">4. Scrutiny Reports</a>
          <a href="#evc-inspections" className="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-800 font-medium">5. EVC Inspections</a>
          <a href="#institution-portal" className="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-800 font-medium">6. Institution Portal</a>
          <a href="#admin-configuration" className="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-800 font-medium">7. Rule Packs &amp; Adapters</a>
          <a href="#audit-trail" className="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-800 font-medium">8. Audit Trail Ledger</a>
          <a href="#safeguards-handling" className="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-800 font-medium">9. Safeguards &amp; Data Handling</a>
          <a href="#metrics-evaluation" className="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-800 font-medium">10. Benchmark Metrics</a>
          <a href="#conformance-matrix" className="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-800 font-medium">11. Conformance Matrix</a>
        </div>
      </div>

      {/* 1. Officer Queue */}
      <OfficerQueueSection />

      {/* 2. Full Case Files for All Applications */}
      <CaseFileSection />

      {/* 3. Linkage Radar */}
      <LinkageRadarSection />

      {/* 4. Scrutiny Reports */}
      <ScrutinyReportSection />

      {/* 5. EVC Field Inspections */}
      <EvcInspectionSection />

      {/* 6. Institution Dashboard */}
      <InstitutionSection />

      {/* 7. Admin Rule Packs & Adapters */}
      <AdminSection />

      {/* 8. Cryptographic Audit Trail */}
      <AuditSection />

      {/* 9. Safeguards & Data Handling Policy (PS Item 9) */}
      <SafeguardsSection />

      {/* 10. Synthetic Engine Benchmark Metrics */}
      <MetricsSection />

      {/* 11. Problem Statement 26261 Conformance Matrix (PS Item 11) */}
      <ConformanceSection />
    </div>
  );
}
