'use client';

import React, { useState, useMemo, use } from 'react';
import Link from 'next/link';
import DemoBanner from '@/components/DemoBanner';
import Navbar from '@/components/Navbar';
import StatusChip from '@/components/StatusChip';
import { 
  ClipboardCheck, 
  MapPin, 
  Camera, 
  Compass, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowLeft, 
  Upload, 
  ShieldAlert, 
  UserCheck, 
  FileText,
  Clock,
  Plus
} from 'lucide-react';
import { InspectionTask, InspectionObservation } from '@/types';
import { DataStore, DEMO_APPLICATIONS, DEMO_DOCUMENTS } from '@/lib/store';
import { EvcCopilotEngine, InspectionBrief } from '@/lib/evc/copilot';

export default function MobileInspectionFormPage({
  params
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params);

  const initialTask = useMemo(() => DataStore.getInspectionTaskById(id) || DataStore.getInspectionTasks()[0] || null, [id]);
  const initialApp = useMemo(() => initialTask ? (DataStore.getApplicationById(initialTask.applicationId) || DEMO_APPLICATIONS[2]) : null, [initialTask]);
  const initialBrief = useMemo(() => {
    if (!initialTask || !initialApp) return null;
    const docs = DataStore.getDocuments(initialTask.applicationId);
    const finds = DataStore.getFindings(initialTask.applicationId);
    return EvcCopilotEngine.generateBrief(initialTask, initialApp, docs, finds);
  }, [initialTask, initialApp]);

  const [task, setTask] = useState<InspectionTask | null>(initialTask);
  const [brief, setBrief] = useState<InspectionBrief | null>(initialBrief);
  const [observations, setObservations] = useState<InspectionObservation[]>(() => initialTask?.observations || []);

  // Form State
  const [category, setCategory] = useState<InspectionObservation['category']>('Land & Boundary');
  const [claimText, setClaimText] = useState('Physical demarcation of land boundary and perimeter wall');
  const [status, setStatus] = useState<InspectionObservation['physicalVerificationStatus']>('Verified');
  const [notes, setNotes] = useState('');
  const [isCapturingGeo, setIsCapturingGeo] = useState(false);
  const [coords, setCoords] = useState<{ lat: number; lng: number }>({ lat: 18.591244, lng: 73.738912 });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCaptureLocation = () => {
    setIsCapturingGeo(true);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
          setIsCapturingGeo(false);
        },
        () => {
          // Fallback demo coordinates
          setCoords({ lat: 18.591244, lng: 73.738912 });
          setIsCapturingGeo(false);
        }
      );
    } else {
      setIsCapturingGeo(false);
    }
  };

  const handleRecordObservation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!task) return;
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/evc/observations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          taskId: task.id,
          category,
          claimText,
          physicalVerificationStatus: status,
          observationNotes: notes,
          photoUrls: ['https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?auto=format&fit=crop&w=600&q=80'],
          latitude: coords.lat,
          longitude: coords.lng
        })
      });

      const data = await res.json();
      if (data.success && data.observation) {
        setObservations([data.observation, ...observations]);
        setNotes('');
        alert('Observation recorded and hash-sealed into AICTE immutable audit trail.');
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!task || !brief) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center font-sans">
        <span className="text-xs text-slate-500">Loading Inspection Brief...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans">
      <DemoBanner />
      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto w-full px-3 sm:px-6 py-6 space-y-6">
        
        {/* Navigation & Header */}
        <div>
          <Link
            href="/evc"
            className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to EVC Tasks</span>
          </Link>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900">
              Mobile Physical Verification Form
            </h1>
            <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
              Live Field Session
            </span>
          </div>
          <p className="text-xs text-slate-600 mt-0.5">
            Campus: <strong>{task.institutionName}</strong> • Docket: {brief.applicationNumber}
          </p>
        </div>

        {/* 1. INSPECTION BRIEF (High-Risk Target Claims) */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b pb-3">
            <ShieldAlert className="w-5 h-5 text-rose-600" />
            <h2 className="text-sm font-bold text-slate-900">
              High-Risk Inspection Brief (AICTE Sentinel Advisory)
            </h2>
          </div>

          <div className="space-y-3">
            {brief.highRiskClaims.map((claim, idx) => (
              <div key={idx} className="bg-rose-50/70 border border-rose-200 rounded-xl p-3.5 text-xs text-rose-950">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-rose-900 uppercase text-[10px]">{claim.category}</span>
                  <StatusChip status={claim.severity} size="sm" />
                </div>
                <p className="font-semibold text-slate-900 mb-1">{claim.description}</p>
                <p className="text-[11px] text-rose-800">
                  <strong>Inspector Directive:</strong> {claim.targetCheck}
                </p>
              </div>
            ))}
          </div>

          {/* Flagged Faculty to Interview */}
          {brief.flaggedFacultyToInterview.length > 0 && (
            <div className="pt-2">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block mb-2 flex items-center gap-1.5">
                <UserCheck className="w-4 h-4 text-purple-600" />
                <span>Mandatory Physical Identity Verification:</span>
              </span>
              {brief.flaggedFacultyToInterview.map((fac, idx) => (
                <div key={idx} className="bg-purple-50 border border-purple-200 rounded-xl p-3 text-xs text-purple-950">
                  <div className="flex items-center justify-between font-bold">
                    <span>{fac.name} ({fac.declaredDesignation})</span>
                    <span className="font-mono text-[10px]">PAN: {fac.pan}</span>
                  </div>
                  <p className="text-[11px] text-purple-900 mt-1">{fac.redFlagReason}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 2. MOBILE OBSERVATION RECORDER FORM */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center gap-2 border-b pb-3 mb-4">
            <Compass className="w-5 h-5 text-amber-600" />
            <h2 className="text-sm font-bold text-slate-900">
              Record Physical Field Observation
            </h2>
          </div>

          <form onSubmit={handleRecordObservation} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Infrastructure / Faculty Verification Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as InspectionObservation['category'])}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-300 text-slate-900 font-semibold"
              >
                <option value="Land & Boundary">Land & Boundary (Demarcation / Boundary Wall)</option>
                <option value="Building & Labs">Building & Labs (Carpet Area & Equipment)</option>
                <option value="Fire Safety & NOC">Fire Safety & NOC (Live Pressure & Hydrants)</option>
                <option value="Faculty Physical Verification">Faculty Physical Verification (Biometric & Roster)</option>
                <option value="General Infrastructure">General Infrastructure (Disabled Ramps & Toilets)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Specific Claim Inspected
              </label>
              <input
                type="text"
                value={claimText}
                onChange={(e) => setClaimText(e.target.value)}
                placeholder="e.g. Survey 289/1A boundary wall between Nova and Apex campuses"
                className="w-full text-xs p-2.5 rounded-xl border border-slate-300 text-slate-900"
              />
            </div>

            {/* Physical Status Choice */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Physical Verification Status <span className="text-rose-500">*</span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { val: 'Verified', label: 'Verified Satisfactory', color: 'bg-emerald-600 text-white' },
                  { val: 'Deficient', label: 'Deficient / Non-compliant', color: 'bg-amber-600 text-white' },
                  { val: 'Fraudulent', label: 'Severe Discrepancy / Disputed Claim', color: 'bg-rose-600 text-white' },
                  { val: 'Inconclusive', label: 'Inconclusive / Pending', color: 'bg-slate-700 text-white' }
                ].map((item) => (
                  <button
                    key={item.val}
                    type="button"
                    onClick={() => setStatus(item.val as InspectionObservation['physicalVerificationStatus'])}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all text-center ${
                      status === item.val
                        ? `${item.color} shadow-xs border-transparent`
                        : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Geotag & Photo Upload Bar */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-rose-600" />
                <span className="font-semibold text-slate-800">
                  GPS Coordinates: {coords.lat.toFixed(6)}, {coords.lng.toFixed(6)}
                </span>
              </div>
              <button
                type="button"
                onClick={handleCaptureLocation}
                disabled={isCapturingGeo}
                className="px-3 py-1 bg-white border border-slate-300 rounded-lg text-slate-700 font-semibold hover:bg-slate-100 flex items-center gap-1"
              >
                <Compass className="w-3.5 h-3.5 text-blue-600" />
                <span>{isCapturingGeo ? 'Acquiring GPS...' : 'Refresh Location'}</span>
              </button>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Detailed Inspector Notes & Physical Findings <span className="text-rose-500">*</span>
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                required
                rows={3}
                placeholder="State physical measurements, missing machinery, faculty interview statements, or perimeter observations..."
                className="w-full text-xs p-3 rounded-xl border border-slate-300 text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting || !notes.trim()}
              className="w-full py-3 bg-[#002b66] hover:bg-[#001f4d] text-white rounded-xl text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isSubmitting ? 'Recording Sealed Observation...' : 'Submit Sealed Field Observation'}
              <Plus className="w-4 h-4" />
            </button>
          </form>
        </div>

        {/* 3. LOG OF RECORDED OBSERVATIONS */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2 border-b pb-3">
            <ClipboardCheck className="w-4 h-4 text-emerald-600" />
            <span>Field Observations Recorded for this Docket ({observations.length})</span>
          </h2>

          <div className="space-y-3">
            {observations.map((obs) => (
              <div key={obs.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">{obs.category}</span>
                  <StatusChip status={obs.physicalVerificationStatus} size="sm" />
                </div>
                <p className="font-semibold text-slate-700">{obs.claimText}</p>
                <p className="text-slate-600 leading-relaxed bg-white p-2.5 rounded-lg border border-slate-200">
                  {obs.observationNotes}
                </p>
                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                  <span>GPS: {obs.latitude?.toFixed(4)}, {obs.longitude?.toFixed(4)}</span>
                  <span>{new Date(obs.capturedAt).toLocaleTimeString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </main>
    </div>
  );
}
