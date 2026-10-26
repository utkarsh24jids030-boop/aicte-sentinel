import React from 'react';
import Link from 'next/link';
import DemoBanner from '@/components/DemoBanner';
import Navbar from '@/components/Navbar';
import { 
  ShieldCheck, 
  Fingerprint, 
  Scale, 
  Radar, 
  ClipboardCheck, 
  ArrowRight, 
  Lock, 
  AlertTriangle,
  Building2,
  CheckCircle2,
  Info
} from 'lucide-react';
import { DataStore } from '@/lib/store';

export default function LandingPage() {
  const applications = DataStore.getApplications();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <DemoBanner />
      <Navbar />

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-[#002b66] via-[#003366] to-[#001f4d] text-white py-16 px-4 sm:px-6 lg:px-8 border-b border-[#00173a]">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30 text-xs font-semibold mb-4">
              <span>Smart India Hackathon 2026</span>
              <span>•</span>
              <span>Problem Statement SIH26261</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight mb-4">
              AICTE Sentinel: Next-Gen Approval Scrutiny & Compliance Intelligence
            </h1>

            <p className="text-base sm:text-lg text-blue-100 mb-8 leading-relaxed">
              An AI-powered decision-support platform for institutional approval validation, document forensic authentication, statutory compliance verification, and cross-institution anomaly detection.
            </p>

            <blockquote className="border-l-4 border-amber-400 pl-4 py-1 text-sm italic text-amber-200/90 mb-8">
              &ldquo;AICTE Sentinel does not replace regulatory judgment — it makes every judgment auditable.&rdquo;
            </blockquote>

            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/officer"
                className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
              >
                <span>Launch Officer Scrutiny Queue</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/officer/radar"
                className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 text-white font-semibold text-sm transition-all flex items-center gap-2"
              >
                <Radar className="w-4 h-4 text-rose-400" />
                <span>Open Linkage Radar</span>
              </Link>
              <Link
                href="/institution"
                className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 text-white font-semibold text-sm transition-all flex items-center gap-2"
              >
                <Building2 className="w-4 h-4 text-blue-300" />
                <span>Institution Portal</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 3 Seeded Demonstration Regulatory Scenarios */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="mb-8">
          <div className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">
            End-to-End Evaluation Dataset
          </div>
          <h2 className="text-2xl font-bold text-slate-900">
            Three Live Demo Institutions & Regulatory Scenarios
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Pre-seeded with synthetic, deliberate compliance anomalies, cross-institution linkages, and forensic challenges.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {applications.map((app) => {
            const institution = DataStore.getInstitutionById(app.institutionId);
            const findings = DataStore.getFindings(app.id);
            const caseLabel = app.type === 'EoA' ? 'Case 1: EoA' : app.type === 'Intake_Increase' ? 'Case 2: Intake Hike' : 'Case 3: New Campus';
            const badgeColor = app.type === 'EoA' ? 'bg-emerald-100 text-emerald-800' : app.type === 'Intake_Increase' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800';
            const isCritical = app.riskTier === 'Critical';

            return (
              <div 
                key={app.id} 
                className={`bg-white rounded-2xl border p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between relative overflow-hidden ${
                  isCritical ? 'border-rose-200' : 'border-slate-200'
                }`}
              >
                {isCritical && (
                  <div className="absolute top-0 right-0 bg-rose-600 text-white text-[10px] font-bold px-3 py-0.5 rounded-bl-lg">
                    HIGH LINKAGE ANOMALY
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${badgeColor}`}>
                      {caseLabel}
                    </span>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded border font-mono ${
                      app.readinessScore >= 70 ? 'text-emerald-700 bg-emerald-50 border-emerald-200' :
                      app.readinessScore >= 40 ? 'text-orange-700 bg-orange-50 border-orange-200' :
                      'text-rose-700 bg-rose-50 border-rose-200'
                    }`}>
                      Readiness: {app.readinessScore}/100
                    </span>
                  </div>

                  <h3 className="font-bold text-slate-900 text-base mb-1">{app.institutionName}</h3>
                  <p className="text-xs text-slate-500 mb-4">
                    {institution ? `${institution.district}, ${institution.state} (Est. ${institution.establishedYear})` : app.institutionId}
                  </p>

                  <div className="space-y-2 text-xs">
                    {/* For complete apps with few deficiencies, show positive credential status */}
                    {app.id === 'app-sunrise-001' && (
                      <div className="flex items-start gap-2 text-slate-700">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                        <span>Mostly complete EoA with valid DigiLocker land deed (4.85 acres).</span>
                      </div>
                    )}

                    {findings.slice(0, 4).map((f) => {
                      const isForensic = f.category === 'FORENSIC_ANOMALY';
                      const isLinkage = f.category === 'CROSS_INSTITUTION_LINKAGE';
                      const isCrit = f.severity === 'Critical';

                      return (
                        <div 
                          key={f.id} 
                          className={`flex items-start gap-2 ${
                            isCrit || isLinkage ? 'text-rose-700' :
                            isForensic ? 'text-purple-700' :
                            f.severity === 'High' ? 'text-amber-800' : 'text-slate-700'
                          }`}
                        >
                          {isForensic ? (
                            <Fingerprint className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
                          ) : isLinkage ? (
                            <Radar className="w-4 h-4 text-rose-600 mt-0.5 flex-shrink-0" />
                          ) : (
                            <AlertTriangle className={`w-4 h-4 mt-0.5 flex-shrink-0 ${
                              isCrit ? 'text-rose-600' : f.severity === 'High' ? 'text-amber-600' : 'text-blue-600'
                            }`} />
                          )}
                          <span>
                            <strong>{f.title}:</strong> {f.explanation}
                          </span>
                        </div>
                      );
                    })}

                    {/* Low OCR confidence field note for Sunrise */}
                    {app.id === 'app-sunrise-001' && (
                      <div className="flex items-start gap-2 text-amber-800">
                        <Info className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                        <span>Low OCR confidence (62%) on Notary stamp field requiring officer review.</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className={`text-[11px] font-bold ${
                    app.riskTier === 'Critical' ? 'text-rose-700' :
                    app.riskTier === 'High' ? 'text-orange-600' : 'text-slate-600'
                  }`}>
                    Risk Tier: {app.riskTier} {app.linkageRiskScore > 50 ? `(${app.linkageRiskScore}%)` : ''}
                  </span>
                  <Link
                    href={`/officer/case/${app.id}`}
                    className={`text-xs font-bold flex items-center gap-1 ${
                      app.riskTier === 'Critical' ? 'text-rose-700 hover:text-rose-900' : 'text-blue-700 hover:text-blue-900'
                    }`}
                  >
                    <span>{app.riskTier === 'Critical' ? 'Inspect Anomaly File' : 'Inspect Case'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Six Pillars of AICTE Sentinel */}
      <section className="bg-white py-14 px-4 sm:px-6 lg:px-8 border-t border-slate-200">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl font-bold text-slate-900">Core Architecture & Defense Modules</h2>
            <p className="text-xs text-slate-600 mt-1">
              Engineered according to SIH26261 statutory requirements with human-in-the-loop integrity.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-5 rounded-xl border border-slate-200 bg-slate-50/50">
              <Fingerprint className="w-8 h-8 text-blue-600 mb-3" />
              <h3 className="font-bold text-sm text-slate-900 mb-1">Document Forensics & Hashing</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                SHA-256 cryptographic hashes for every file, PDF metadata revision detection, Canva/Ghostscript tampering heuristics, and exact/near-duplicate detection.
              </p>
            </div>

            <div className="p-5 rounded-xl border border-slate-200 bg-slate-50/50">
              <ShieldCheck className="w-8 h-8 text-emerald-600 mb-3" />
              <h3 className="font-bold text-sm text-slate-900 mb-1">Verification Passports</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Fail-closed verification model connecting to mock DigiLocker, Certificate Registry, Land Records, and AICTE Faculty Registry. Unverified files never pass autonomously.
              </p>
            </div>

            <div className="p-5 rounded-xl border border-slate-200 bg-slate-50/50">
              <Scale className="w-8 h-8 text-indigo-600 mb-3" />
              <h3 className="font-bold text-sm text-slate-900 mb-1">22+ Compliance Rules Engine</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Versioned rule packs across Land, Building, Fire safety, Faculty, Governance, and Financial norms producing an explainable 0–100 Readiness Score.
              </p>
            </div>

            <div className="p-5 rounded-xl border border-slate-200 bg-slate-50/50">
              <Radar className="w-8 h-8 text-rose-600 mb-3" />
              <h3 className="font-bold text-sm text-slate-900 mb-1">Linkage Radar</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Entity-resolution graph exposing cross-institution linkages: shared land parcels, concurrent faculty declarations, duplicate certificates, and interlocking trusts.
              </p>
            </div>

            <div className="p-5 rounded-xl border border-slate-200 bg-slate-50/50">
              <ClipboardCheck className="w-8 h-8 text-amber-600 mb-3" />
              <h3 className="font-bold text-sm text-slate-900 mb-1">EVC Inspection Copilot</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Automated risk-focused inspection briefs, mobile observation recording, geotagged evidence capture, and pass/fail physical verification status.
              </p>
            </div>

            <div className="p-5 rounded-xl border border-slate-200 bg-slate-50/50">
              <Lock className="w-8 h-8 text-slate-700 mb-3" />
              <h3 className="font-bold text-sm text-slate-900 mb-1">Hash-Chained Audit Trail</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Immutable SHA-256 hash-chained log for all uploads, views, rule evaluations, source responses, and officer decisions, verifiable by CAG/Auditors.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#00173a] text-blue-200 py-8 px-4 text-xs text-center border-t border-blue-900/60 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-amber-400" />
            <span className="font-bold text-white">AICTE Sentinel</span>
            <span>• Smart India Hackathon 2026 PS SIH26261</span>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3 text-blue-300">
            <span>Advisory Decision-Support Platform • Prototype Operating on Synthetic Sandbox Data</span>
            <span>•</span>
            <Link 
              href="/preview" 
              className="text-amber-400 hover:text-amber-300 font-bold underline underline-offset-2 transition-colors"
            >
              Public Preview
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
