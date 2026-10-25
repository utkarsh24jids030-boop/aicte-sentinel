'use client';

import React, { useState, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import DemoBanner from '@/components/DemoBanner';
import Navbar from '@/components/Navbar';
import CollusionRadarGraph from '@/components/CollusionRadarGraph';
import { CollusionRadarData } from '@/types';
import { Radar, RefreshCw, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import ProtectedRoute from '@/components/ProtectedRoute';

function RadarContent() {
  const searchParams = useSearchParams();
  const instQuery = searchParams.get('institution') || '';

  const [radarData, setRadarData] = useState<CollusionRadarData | null>(null);
  const [selectedInst, setSelectedInst] = useState<string>(instQuery);
  const [isLoading, setIsLoading] = useState(true);

  const fetchRadarData = useCallback(async (inst: string) => {
    setIsLoading(true);
    try {
      const url = inst ? `/api/radar?institution=${encodeURIComponent(inst)}` : '/api/radar';
      const res = await fetch(url);
      const data = await res.json();
      setRadarData(data);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRadarData(selectedInst);
  }, [selectedInst, fetchRadarData]);

  return (
    <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
      {/* Top Header */}
      <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <Link
            href="/officer"
            className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Scrutiny Queue</span>
          </Link>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              <Radar className="w-6 h-6 text-rose-600" />
              <span>Cross-Institution Collusion & Fraud Radar</span>
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Visualizing multi-entity overlaps: Land parcel survey numbers, faculty identities, duplicate certificates, and interlocking trusts.
          </p>
        </div>

        {selectedInst && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500">Filtered by: <strong>{selectedInst}</strong></span>
            <button
              onClick={() => setSelectedInst('')}
              className="text-xs text-rose-600 hover:text-rose-800 font-semibold underline"
            >
              Clear Filter
            </button>
          </div>
        )}
      </div>

      {isLoading || !radarData ? (
        <div className="min-h-[400px] flex items-center justify-center bg-white rounded-2xl border border-slate-200">
          <div className="text-center">
            <RefreshCw className="w-8 h-8 text-[#002b66] animate-spin mx-auto mb-2" />
            <span className="text-xs text-slate-500 font-semibold">Traversing Cross-Institution Entity Graph...</span>
          </div>
        </div>
      ) : (
        <CollusionRadarGraph
          data={radarData}
          onSelectInstitution={(instName) => setSelectedInst(instName)}
        />
      )}
    </div>
  );
}

export default function CollusionRadarPage() {
  return (
    <ProtectedRoute allowedRoles={['OFFICER', 'ADMIN', 'AUDITOR']}>
      <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
        <DemoBanner />
        <Navbar />
        <Suspense fallback={
          <div className="flex-1 flex items-center justify-center">
            <RefreshCw className="w-8 h-8 text-[#002b66] animate-spin" />
          </div>
        }>
          <RadarContent />
        </Suspense>
      </div>
    </ProtectedRoute>
  );
}
