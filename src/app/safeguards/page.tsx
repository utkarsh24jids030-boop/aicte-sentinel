import React from 'react';
import Navbar from '@/components/Navbar';
import SafeguardsSection from '@/app/preview/_components/SafeguardsSection';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export const metadata = {
  title: 'Safeguards & Data Handling — AICTE Sentinel',
  description: 'Role-based access matrix, non-bypass database guarantees, access logging, PII masking, and human review safeguards.'
};

export default function SafeguardsPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Link href="/" className="hover:text-blue-600 transition-colors">Portal Home</Link>
            <span>/</span>
            <span className="font-semibold text-slate-800">Safeguards &amp; Data Handling</span>
          </div>
          <Link
            href="/preview/safeguards"
            className="flex items-center gap-1.5 text-xs font-semibold text-blue-700 bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-200 hover:bg-blue-100 transition-colors"
          >
            <span>Open Public Read-Only Preview</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Server-Rendered Safeguards Core */}
        <SafeguardsSection />
      </main>

      <footer className="bg-slate-900 text-slate-400 py-6 px-4 text-xs text-center border-t border-slate-800 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>AICTE Sentinel • SIH 2026 Problem Statement 26261</span>
          <span>Regulation Bureau Statutory Compliance &amp; Privacy Safeguards</span>
        </div>
      </footer>
    </div>
  );
}
