import React from 'react';
import Navbar from '@/components/Navbar';
import MetricsSection from '@/app/preview/_components/MetricsSection';
import Link from 'next/link';
import { ShieldCheck, ArrowRight } from 'lucide-react';

export const metadata = {
  title: 'Benchmark Metrics — AICTE Sentinel',
  description: 'Deterministic synthetic benchmark metrics for AICTE Sentinel regulatory scrutiny and anomaly-detection engine.'
};

export default function MetricsPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Link href="/" className="hover:text-blue-600 transition-colors">Portal Home</Link>
            <span>/</span>
            <span className="font-semibold text-slate-800">Engine Performance &amp; Evaluation Metrics</span>
          </div>
          <Link
            href="/preview/metrics"
            className="flex items-center gap-1.5 text-xs font-semibold text-blue-700 bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-200 hover:bg-blue-100 transition-colors"
          >
            <span>Open Public Read-Only Preview</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Server Rendered Metrics Core */}
        <MetricsSection />

        {/* Methodology Footer Note */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            Evaluation Methodology &amp; Reproducibility
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            The benchmark dataset is deterministically created with a linear congruential pseudorandom number generator (PRNG) initialized with seed <code className="bg-slate-100 px-1 py-0.5 rounded font-mono text-xs">20260201</code>. To regenerate the dataset and recalculate all evaluation figures from scratch, run:
          </p>
          <div className="bg-slate-900 text-slate-100 p-3 rounded-lg font-mono text-xs overflow-x-auto space-y-1">
            <p className="text-emerald-400"># 1. Regenerate 120 synthetic applications with seeded defects</p>
            <p>npm run generate:dataset</p>
            <p className="text-emerald-400 mt-2"># 2. Execute extraction, anomaly detection, and adapter benchmarks</p>
            <p>npm run evaluate</p>
          </div>
          <p className="text-[11px] text-slate-500 italic">
            Advisory notice: This evaluation suite is constructed strictly for technical decision-support validation. AICTE scrutiny officers retain final statutory discretion.
          </p>
        </div>
      </main>

      <footer className="bg-slate-900 text-slate-400 py-6 px-4 text-xs text-center border-t border-slate-800 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>AICTE Sentinel • SIH 2026 Problem Statement 26261</span>
          <span>Regulatory Decision-Support Performance Evaluation</span>
        </div>
      </footer>
    </div>
  );
}
