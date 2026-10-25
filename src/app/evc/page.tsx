'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import DemoBanner from '@/components/DemoBanner';
import Navbar from '@/components/Navbar';
import StatusChip from '@/components/StatusChip';
import ProtectedRoute from '@/components/ProtectedRoute';
import { 
  ClipboardCheck, 
  MapPin, 
  Calendar, 
  AlertTriangle, 
  ArrowRight, 
  ShieldAlert, 
  CheckCircle2, 
  Building2,
  Camera,
  Compass
} from 'lucide-react';
import { InspectionTask } from '@/types';
import { DEMO_INSPECTION_TASKS } from '@/lib/store';

export default function EvcDashboardPage() {
  const [tasks, setTasks] = useState<InspectionTask[]>(DEMO_INSPECTION_TASKS);

  return (
    <ProtectedRoute allowedRoles={['EVC_INSPECTOR', 'OFFICER', 'ADMIN']}>
      <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
        <DemoBanner />
        <Navbar />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Top Header */}
        <div className="mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">
                Expert Visiting Committee (EVC) Portal
              </span>
              <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                Field Inspection Copilot
              </span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 mt-1">
              Assigned On-Site Physical Inspections
            </h1>
            <p className="text-xs text-slate-500">
              Inspection briefs tailored to unverified claims, land overlaps, and high-risk faculty declarations.
            </p>
          </div>
        </div>

        {/* Assigned Inspection Tasks Cards */}
        <div className="space-y-6">
          {tasks.map((task) => (
            <div
              key={task.id}
              className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs hover:shadow-md transition-all flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6"
            >
              <div className="space-y-3 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-800">
                    {task.id}
                  </span>
                  <StatusChip status={task.status} size="sm" />
                  <span className="text-xs text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200 font-semibold flex items-center gap-1">
                    <ShieldAlert className="w-3 h-3" />
                    <span>{task.highRiskClaimsCount} High-Risk Targets</span>
                  </span>
                </div>

                <h3 className="text-lg font-bold text-slate-900">
                  {task.institutionName}
                </h3>

                <div className="flex items-center gap-2 text-xs text-slate-600">
                  <MapPin className="w-4 h-4 text-slate-400 flex-shrink-0" />
                  <span>{task.siteAddress}</span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <strong>Inspection Brief:</strong> {task.briefSummary}
                </p>

                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-1">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-slate-400" />
                    <span>Scheduled: <strong>{new Date(task.scheduledDate).toLocaleDateString()}</strong></span>
                  </div>
                  <div>
                    <span>Lead Inspector: <strong>{task.inspectorName}</strong></span>
                  </div>
                  <div>
                    <span>Observations Recorded: <strong>{task.observations.length}</strong></span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="flex flex-col sm:flex-row lg:flex-col items-stretch gap-2 w-full lg:w-auto flex-shrink-0">
                <Link
                  href={`/evc/inspect/${task.id}`}
                  className="px-5 py-3 bg-[#002b66] hover:bg-[#001f4d] text-white rounded-xl text-xs font-bold shadow-2xs hover:shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <Compass className="w-4 h-4 text-amber-400" />
                  <span>Open Mobile Inspection Form</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>

      </main>
    </div>
    </ProtectedRoute>
  );
}
