import React from 'react';
import Link from 'next/link';
import DemoBanner from '@/components/DemoBanner';
import Navbar from '@/components/Navbar';
import { 
  ShieldCheck, 
  Fingerprint, 
  Scale, 
  Radar, 
  FileCheck2, 
  ClipboardCheck, 
  ArrowRight, 
  Lock, 
  AlertTriangle,
  Building2,
  FileSearch,
  CheckCircle2,
  Database
} from 'lucide-react';
import { DEMO_INSTITUTIONS, DEMO_APPLICATIONS } from '@/lib/store';

export default function LandingPage() {
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
              AICTE Sentinel: Next-Gen Approval Scrutiny & Fraud Intelligence
            </h1>

            <p className="text-base sm:text-lg text-blue-100 mb-8 leading-relaxed">
              An AI-powered decision-support platform for institutional approval validation, document forensic authentication, statutory compliance verification, and cross-institution fraud detection.
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
                <span>Open Collusion Radar</span>
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

      {/* 3 Seeded Demonstration Fraud Scenarios */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="mb-8">
          <div className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">
            End-to-End Evaluation Dataset
          </div>
          <h2 className="text-2xl font-bold text-slate-900">
            Three Live Demo Institutions & Regulatory Scenarios
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Pre-seeded with synthetic, deliberate compliance anomalies, cross-institution collusions, and forensic challenges.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* 1. Sunrise Institute */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                  Case 1: EoA
                </span>
                <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                  Readiness: 75/100
                </span>
              </div>
              <h3 className="font-bold text-slate-900 text-base mb-1">Sunrise Institute of Technology</h3>
              <p className="text-xs text-slate-500 mb-4">Sarjapur Rd, Bengaluru, Karnataka (Established 2012)</p>

              <div className="space-y-2 text-xs">
                <div className="flex items-start gap-2 text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                  <span>Mostly complete EoA with valid DigiLocker land deed (4.85 acres).</span>
                </div>
                <div className="flex items-start gap-2 text-rose-700">
                  <AlertTriangle className="w-4 h-4 text-rose-600 mt-0.5 flex-shrink-0" />
                  <span><strong>Expired Fire NOC:</strong> Certificate FS-BLR-2023-9941 expired Jan 2024.</span>
                </div>
                <div className="flex items-start gap-2 text-amber-700">
                  <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                  <span>Low OCR confidence (62%) on Notary stamp field requiring review.</span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] font-semibold text-slate-500">Risk Tier: Medium</span>
              <Link
                href="/officer/case/app-sunrise-001"
                className="text-xs font-bold text-blue-700 hover:text-blue-900 flex items-center gap-1"
              >
                <span>Inspect Case</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* 2. Nova Engineering College */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                  Case 2: Intake Hike
                </span>
                <span className="text-xs font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded border border-orange-200">
                  Readiness: 45/100
                </span>
              </div>
              <h3 className="font-bold text-slate-900 text-base mb-1">Nova Engineering College</h3>
              <p className="text-xs text-slate-500 mb-4">Hinjawadi Phase-3, Pune, Maharashtra</p>

              <div className="space-y-2 text-xs">
                <div className="flex items-start gap-2 text-rose-700">
                  <AlertTriangle className="w-4 h-4 text-rose-600 mt-0.5 flex-shrink-0" />
                  <span><strong>Structural Stability Missing:</strong> Required certificate absent.</span>
                </div>
                <div className="flex items-start gap-2 text-rose-700">
                  <AlertTriangle className="w-4 h-4 text-rose-600 mt-0.5 flex-shrink-0" />
                  <span><strong>Faculty Deficit:</strong> 22 declared vs 24 required for 480 intake.</span>
                </div>
                <div className="flex items-start gap-2 text-purple-700">
                  <Fingerprint className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
                  <span><strong>Metadata Anomaly:</strong> PDF edited with Canva/Nitro; 3 incremental saves.</span>
                </div>
                <div className="flex items-start gap-2 text-rose-700">
                  <Radar className="w-4 h-4 text-rose-600 mt-0.5 flex-shrink-0" />
                  <span>Faculty member Dr. Vikram Malhotra <strong>reused by Apex</strong>.</span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] font-semibold text-rose-600 font-bold">Risk Tier: High</span>
              <Link
                href="/officer/case/app-nova-002"
                className="text-xs font-bold text-blue-700 hover:text-blue-900 flex items-center gap-1"
              >
                <span>Inspect Case</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* 3. Apex Polytechnic College */}
          <div className="bg-white rounded-2xl border border-rose-200 p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-rose-600 text-white text-[10px] font-bold px-3 py-0.5 rounded-bl-lg">
              CRITICAL FRAUD ALERT
            </div>

            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-purple-100 text-purple-800">
                  Case 3: New Campus
                </span>
                <span className="text-xs font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                  Readiness: 25/100
                </span>
              </div>
              <h3 className="font-bold text-slate-900 text-base mb-1">Apex Polytechnic College</h3>
              <p className="text-xs text-slate-500 mb-4">Hinjawadi Phase-3, Pune, Maharashtra</p>

              <div className="space-y-2 text-xs">
                <div className="flex items-start gap-2 text-rose-700">
                  <AlertTriangle className="w-4 h-4 text-rose-600 mt-0.5 flex-shrink-0" />
                  <span><strong>Land Conflict:</strong> Claims Survey 289/1A already pledged by Nova!</span>
                </div>
                <div className="flex items-start gap-2 text-rose-700">
                  <AlertTriangle className="w-4 h-4 text-rose-600 mt-0.5 flex-shrink-0" />
                  <span><strong>Duplicate Certificate:</strong> Reused 2021 Western Horizon cert.</span>
                </div>
                <div className="flex items-start gap-2 text-amber-700">
                  <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                  <span><strong>Source Unavailable:</strong> State DTE API timeout; fail-closed triggered.</span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] font-semibold text-rose-700 font-bold">Risk Tier: Critical (92)</span>
              <Link
                href="/officer/case/app-apex-003"
                className="text-xs font-bold text-rose-700 hover:text-rose-900 flex items-center gap-1"
              >
                <span>Inspect Fraud File</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
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
              <h3 className="font-bold text-sm text-slate-900 mb-1">Collusion Radar</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Entity-resolution graph exposing cross-institution collusion: shared land parcels, reused faculty credentials, duplicate certificates, and interlocking trusts.
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
          <div className="text-blue-300">
            Advisory Decision-Support Platform • Prototype Operating on Synthetic Sandbox Data
          </div>
        </div>
      </footer>
    </div>
  );
}
