import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ShieldCheck, Eye } from 'lucide-react';

export const metadata: Metadata = {
  title: 'AICTE Sentinel — Public Read-Only Preview',
  description: 'Server-rendered public preview for statutory evaluation and automated reviewing. Synthetic data and mock verification adapters.',
  robots: {
    index: false,
    follow: false
  }
};

export default function PreviewLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const previewLinks = [
    { label: 'Preview Index', href: '/preview' },
    { label: 'Complete Single-Page View (/preview/all)', href: '/preview/all' },
    { label: 'Officer Queue', href: '/preview/officer' },
    { label: 'Collusion Radar', href: '/preview/radar' },
    { label: 'EVC Inspections', href: '/preview/evc' },
    { label: 'Institution View', href: '/preview/institution' },
    { label: 'Rule Packs & Adapters', href: '/preview/admin' },
    { label: 'Audit Trail', href: '/preview/audit' }
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
      {/* 1. Mandatory Public Read-Only Banner */}
      <div className="bg-amber-100 border-b border-amber-300 text-amber-950 px-4 py-2.5 text-xs text-center font-bold tracking-wide flex items-center justify-center gap-2">
        <Eye className="w-4 h-4 text-amber-700 flex-shrink-0" />
        <span>Public read-only preview. Synthetic data and mock verification adapters.</span>
      </div>

      {/* 2. Public Preview Navigation Bar */}
      <header className="bg-[#002b66] text-white shadow-md border-b border-[#001f4d] sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between py-3 md:h-16 gap-3">
            <div className="flex items-center gap-3">
              <Link href="/preview" className="flex items-center gap-2 group">
                <div className="w-8 h-8 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center text-amber-400">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <span className="font-bold text-base tracking-tight text-white">AICTE Sentinel Preview</span>
                  <span className="ml-2 bg-emerald-500/20 text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-400/30">
                    SERVER RENDERED
                  </span>
                </div>
              </Link>
            </div>

            <nav className="flex flex-wrap items-center gap-1.5 text-xs">
              {previewLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="px-2.5 py-1 rounded-md text-blue-100 hover:text-white hover:bg-white/10 transition-colors font-medium"
                >
                  {link.label}
                </a>
              ))}
              <a
                href="/"
                className="ml-2 px-2.5 py-1 rounded-md bg-white/15 text-amber-300 hover:bg-white/20 font-semibold"
              >
                Back to Portal
              </a>
            </nav>
          </div>
        </div>
      </header>

      {/* 3. Page Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      {/* 4. Simple Footer */}
      <footer className="bg-slate-900 text-slate-400 py-6 px-4 text-xs text-center border-t border-slate-800 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>AICTE Sentinel • SIH 2026 Problem Statement 26261</span>
          <span>Public Reviewer Surface • Pure HTML Server Components</span>
        </div>
      </footer>
    </div>
  );
}
