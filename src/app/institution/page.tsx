'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import DemoBanner from '@/components/DemoBanner';
import Navbar from '@/components/Navbar';
import ReadinessGauge from '@/components/ReadinessGauge';
import StatusChip from '@/components/StatusChip';
import ProtectedRoute from '@/components/ProtectedRoute';
import { 
  Building2, 
  FilePlus, 
  Clock, 
  FileText, 
  AlertTriangle, 
  CheckCircle, 
  ArrowRight, 
  Upload, 
  ShieldAlert,
  ChevronRight,
  RefreshCw
} from 'lucide-react';
import { Application, ReadinessBreakdown } from '@/types';
import { DEMO_INSTITUTIONS } from '@/lib/store';

export default function InstitutionDashboard() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [readiness, setReadiness] = useState<ReadinessBreakdown | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const institution = DEMO_INSTITUTIONS[0]; // Sunrise Institute of Technology

  const fetchAppDetail = useCallback(async (appId: string) => {
    try {
      const res = await fetch(`/api/applications/${appId}`);
      const data = await res.json();
      if (data.readiness) {
        setReadiness(data.readiness);
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const fetchApplications = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/applications?institutionId=${institution.id}`);
      const data = await res.json();
      const apps: Application[] = data.applications || [];
      setApplications(apps);

      if (apps.length > 0) {
        setSelectedApp(apps[0]);
        fetchAppDetail(apps[0].id);
      }
    } finally {
      setIsLoading(false);
    }
  }, [institution.id, fetchAppDetail]);

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  return (
    <ProtectedRoute allowedRoles={['INSTITUTION', 'ADMIN']}>
      <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
        <DemoBanner />
        <Navbar />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Top Header Card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-[#002b66]">
              <Building2 className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-slate-900">{institution.name}</h1>
                <span className="text-xs px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-mono font-semibold">
                  AICTE ID: {institution.aicteId}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                {institution.address} • Sponsoring Body: {institution.trustName}
              </p>
            </div>
          </div>

          <Link
            href="/institution/new-application"
            className="px-4 py-2.5 bg-[#002b66] hover:bg-[#001f4d] text-white rounded-xl text-xs font-bold shadow-xs hover:shadow-md transition-all flex items-center gap-2 flex-shrink-0"
          >
            <FilePlus className="w-4 h-4" />
            <span>Create New Application</span>
          </Link>
        </div>

        {/* Readiness Gauge for Current Application */}
        {readiness && (
          <div className="mb-8">
            <ReadinessGauge readiness={readiness} />
          </div>
        )}

        {/* Applications List & Deficiency Rectification Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Applications List */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-base font-bold text-slate-900">
                Institutional Applications ({applications.length})
              </h2>
              <span className="text-xs text-slate-500">Academic Session 2026-2027</span>
            </div>

            {applications.map((app) => (
              <div
                key={app.id}
                className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs hover:border-blue-400 transition-all"
              >
                <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-900 border border-blue-200">
                      {app.applicationNumber}
                    </span>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                      Type: {app.type}
                    </span>
                  </div>
                  <StatusChip status={app.status} size="sm" />
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4 text-xs">
                  <div>
                    <span className="text-[11px] text-slate-400 block font-medium">Academic Year</span>
                    <span className="font-semibold text-slate-800">{app.academicYear}</span>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-400 block font-medium">Current Intake</span>
                    <span className="font-semibold text-slate-800">{app.currentIntake} Seats</span>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-400 block font-medium">Proposed Intake</span>
                    <span className="font-semibold text-slate-800">{app.proposedIntake} Seats</span>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-400 block font-medium">Readiness Score</span>
                    <span className="font-bold text-emerald-600">{app.readinessScore}/100</span>
                  </div>
                </div>

                {/* Programmes tags */}
                <div className="mb-4">
                  <span className="text-[11px] text-slate-400 block font-medium mb-1.5">Approved Programmes:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {app.programmes.map((p, i) => (
                      <span key={i} className="text-[11px] px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                        {p}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Footer Buttons */}
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-slate-500">
                    Last updated: {new Date(app.updatedAt).toLocaleDateString()}
                  </span>
                  <Link
                    href={`/institution/applications/${app.id}`}
                    className="px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-800 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5"
                  >
                    <span>Manage Documents & Rectify Deficiencies</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* Right Column: Rectification Guidance & Statutory Timeline */}
          <div className="space-y-6">
            {/* Deficiencies to Rectify */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
              <div className="flex items-center gap-2 mb-3">
                <ShieldAlert className="w-5 h-5 text-amber-600" />
                <h3 className="text-sm font-bold text-slate-900">Immediate Action Required</h3>
              </div>

              {readiness && readiness.deficiencies.length > 0 ? (
                <div className="space-y-3">
                  {readiness.deficiencies.map((def, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-amber-50/70 border border-amber-200 text-xs">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-mono text-[10px] font-bold text-amber-900">{def.ruleId}</span>
                        <StatusChip status={def.severity} size="sm" />
                      </div>
                      <p className="font-semibold text-slate-900 mb-1">{def.message}</p>
                      <p className="text-[11px] text-amber-800">{def.recommendedAction}</p>
                    </div>
                  ))}
                  {selectedApp && (
                    <Link
                      href={`/institution/applications/${selectedApp.id}`}
                      className="w-full py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 mt-2 transition-colors"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>Upload Corrected Document</span>
                    </Link>
                  )}
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>No critical regulatory deficiencies outstanding.</span>
                </div>
              )}
            </div>

            {/* Approval Process Workflow Timeline */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
              <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                <Clock className="w-4 h-4 text-slate-500" />
                <span>Approval Process Lifecycle</span>
              </h3>

              <div className="space-y-3 text-xs relative pl-6 border-l-2 border-slate-200 ml-2">
                <div className="relative">
                  <span className="absolute -left-[31px] top-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 ring-4 ring-white" />
                  <div className="font-bold text-slate-900">1. Online Ingestion & Readiness</div>
                  <p className="text-[11px] text-slate-500">Document upload, automated OCR & forensic hashing.</p>
                </div>

                <div className="relative">
                  <span className="absolute -left-[31px] top-0.5 w-3.5 h-3.5 rounded-full bg-blue-500 ring-4 ring-white" />
                  <div className="font-bold text-slate-900">2. Bureau of Approvals Scrutiny</div>
                  <p className="text-[11px] text-slate-500">Officer reviews evidence-linked findings and verification passports.</p>
                </div>

                <div className="relative">
                  <span className="absolute -left-[31px] top-0.5 w-3.5 h-3.5 rounded-full bg-slate-300 ring-4 ring-white" />
                  <div className="font-bold text-slate-700">3. EVC Physical Verification</div>
                  <p className="text-[11px] text-slate-500">Expert Visiting Committee site inspection of high-risk claims.</p>
                </div>

                <div className="relative">
                  <span className="absolute -left-[31px] top-0.5 w-3.5 h-3.5 rounded-full bg-slate-300 ring-4 ring-white" />
                  <div className="font-bold text-slate-700">4. Executive Committee Decision</div>
                  <p className="text-[11px] text-slate-500">Final regulatory grant of Extension of Approval (EoA).</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
    </ProtectedRoute>
  );
}
