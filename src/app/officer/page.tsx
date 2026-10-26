'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import DemoBanner from '@/components/DemoBanner';
import Navbar from '@/components/Navbar';
import StatusChip from '@/components/StatusChip';
import ProtectedRoute from '@/components/ProtectedRoute';
import { 
  FileSearch, 
  AlertOctagon, 
  ShieldAlert, 
  Radar, 
  ArrowRight, 
  Filter, 
  Search, 
  Building2,
  Clock,
  ClipboardCheck,
  CheckCircle2,
  Scale
} from 'lucide-react';
import { Application, RiskTier } from '@/types';

export default function OfficerDashboard() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [filterRisk, setFilterRisk] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const fetchApplications = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/applications');
      const data = await res.json();
      setApplications(data.applications || []);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  // Filtered applications
  const filteredApps = applications.filter(app => {
    const matchesRisk = filterRisk === 'ALL' || app.riskTier.toUpperCase() === filterRisk;
    const matchesSearch = app.institutionName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          app.applicationNumber.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesRisk && matchesSearch;
  });

  // KPI calculations
  const totalApps = applications.length;
  const criticalApps = applications.filter(a => a.riskTier === 'Critical').length;
  const highApps = applications.filter(a => a.riskTier === 'High').length;
  const evcRecommended = applications.filter(a => a.status === 'EVC Inspection Recommended').length;

  return (
    <ProtectedRoute allowedRoles={['OFFICER', 'ADMIN']}>
      <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
        <DemoBanner />
        <Navbar />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Top Header */}
        <div className="mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                Regulation Bureau • Central Scrutiny Desk
              </span>
              <span className="bg-blue-100 text-blue-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                AICTE HQ New Delhi
              </span>
              <span className="bg-slate-100 text-slate-700 text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border border-slate-300">
                Evaluation As-Of: 01 Feb 2026
              </span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 mt-1">
              Risk-Ranked Approval Scrutiny Queue
            </h1>
            <p className="text-xs text-slate-500">
              Applications ranked by forensic anomaly likelihood, cross-institution linkage proximity, and regulatory deficiency score.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/officer/radar"
              className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold shadow-2xs flex items-center gap-1.5 transition-colors"
            >
              <Radar className="w-4 h-4" />
              <span>Open Linkage Radar</span>
            </Link>
          </div>
        </div>

        {/* Risk KPI Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs">
            <div className="text-xs font-semibold text-slate-500 flex items-center justify-between">
              <span>Total Applications</span>
              <FileSearch className="w-4 h-4 text-slate-400" />
            </div>
            <div className="text-2xl font-extrabold text-slate-900 mt-1">{totalApps}</div>
            <div className="text-[11px] text-slate-400 mt-0.5">Session 2026-2027</div>
          </div>

          <div className="bg-white rounded-2xl border border-rose-200 p-4 shadow-xs">
            <div className="text-xs font-semibold text-rose-700 flex items-center justify-between">
              <span>Critical Risk Dockets</span>
              <AlertOctagon className="w-4 h-4 text-rose-600" />
            </div>
            <div className="text-2xl font-extrabold text-rose-600 mt-1">{criticalApps}</div>
            <div className="text-[11px] text-rose-500 mt-0.5">Urgent vigilance action</div>
          </div>

          <div className="bg-white rounded-2xl border border-amber-200 p-4 shadow-xs">
            <div className="text-xs font-semibold text-amber-700 flex items-center justify-between">
              <span>High Risk Scrutiny</span>
              <ShieldAlert className="w-4 h-4 text-amber-600" />
            </div>
            <div className="text-2xl font-extrabold text-amber-600 mt-1">{highApps}</div>
            <div className="text-[11px] text-amber-600 mt-0.5">Deficiencies flagged</div>
          </div>

          <div className="bg-white rounded-2xl border border-blue-200 p-4 shadow-xs">
            <div className="text-xs font-semibold text-blue-700 flex items-center justify-between">
              <span>EVC Recommended</span>
              <ClipboardCheck className="w-4 h-4 text-blue-600" />
            </div>
            <div className="text-2xl font-extrabold text-blue-800 mt-1">{evcRecommended}</div>
            <div className="text-[11px] text-blue-500 mt-0.5">On-site team assigned</div>
          </div>
        </div>

        {/* Search & Filter Toolbar */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search by institution name or AICTE docket #..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs pl-9 pr-3 py-2 rounded-xl border border-slate-300 text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
            <span className="text-xs font-semibold text-slate-500 mr-1 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" />
              <span>Risk Tier:</span>
            </span>
            {['ALL', 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW'].map((tier) => (
              <button
                key={tier}
                onClick={() => setFilterRisk(tier)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                  filterRisk === tier
                    ? 'bg-[#002b66] text-white shadow-2xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {tier}
              </button>
            ))}
          </div>
        </div>

        {/* Risk-Ranked Queue Table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="divide-y divide-slate-100">
            {filteredApps.map((app) => (
              <div
                key={app.id}
                className="p-6 hover:bg-slate-50/70 transition-colors flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6"
              >
                {/* Left Docket Info */}
                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-800">
                      {app.applicationNumber}
                    </span>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded bg-blue-50 text-blue-800">
                      {app.type.replace('_', ' ')}
                    </span>
                    <StatusChip status={app.status} size="sm" />
                    <StatusChip status={app.riskTier} size="sm" />
                  </div>

                  <h3 className="text-base font-bold text-slate-900 truncate">
                    {app.institutionName}
                  </h3>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                    <span>Intake: <strong>{app.proposedIntake} Seats</strong></span>
                    <span>•</span>
                    <span>Programmes: <strong>{app.programmes.length} Claimed</strong></span>
                    <span>•</span>
                    <span>Submitted: {app.submittedAt ? new Date(app.submittedAt).toLocaleDateString() : 'Draft'}</span>
                  </div>
                </div>

                {/* Center Scores */}
                <div className="flex items-center gap-6 w-full lg:w-auto justify-between lg:justify-end border-t lg:border-t-0 pt-3 lg:pt-0">
                  <div className="text-center min-w-[90px]">
                    <div className="text-xs text-slate-400 font-medium mb-0.5">Readiness</div>
                    <div className={`text-xl font-extrabold ${app.readinessScore < 40 ? 'text-rose-600' : app.readinessScore < 70 ? 'text-amber-600' : 'text-emerald-600'}`}>
                      {app.readinessScore}<span className="text-xs font-normal text-slate-400">/100</span>
                    </div>
                  </div>

                  <div className="text-center min-w-[90px]">
                    <div className="text-xs text-slate-400 font-medium mb-0.5">Linkage Risk</div>
                    <div className={`text-xl font-extrabold ${app.linkageRiskScore > 70 ? 'text-rose-600' : app.linkageRiskScore > 40 ? 'text-amber-600' : 'text-slate-600'}`}>
                      {app.linkageRiskScore}<span className="text-xs font-normal text-slate-400">/100</span>
                    </div>
                  </div>

                  {/* Action Link to Case File */}
                  <Link
                    href={`/officer/case/${app.id}`}
                    className="px-4 py-2.5 bg-[#002b66] hover:bg-[#001f4d] text-white rounded-xl text-xs font-bold shadow-2xs hover:shadow-md transition-all flex items-center gap-1.5 flex-shrink-0"
                  >
                    <span>Open Case File</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

      </main>
    </div>
    </ProtectedRoute>
  );
}
