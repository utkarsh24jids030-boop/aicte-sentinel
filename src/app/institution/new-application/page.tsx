'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import DemoBanner from '@/components/DemoBanner';
import Navbar from '@/components/Navbar';
import { ApplicationType, DocumentType } from '@/types';
import { 
  Building2, 
  FileCheck2, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle, 
  FileText,
  ShieldCheck,
  Plus,
  Trash2
} from 'lucide-react';
import { DEMO_INSTITUTIONS } from '@/lib/store';

export default function NewApplicationWizard() {
  const router = useRouter();
  const institution = DEMO_INSTITUTIONS[0]; // Sunrise

  const [appType, setAppType] = useState<ApplicationType>('EoA');
  const [academicYear, setAcademicYear] = useState('2026-2027');
  const [currentIntake, setCurrentIntake] = useState(360);
  const [proposedIntake, setProposedIntake] = useState(360);
  const [programmes, setProgrammes] = useState<string[]>([
    'Computer Science & Engineering (180)',
    'Electronics & Communication Engineering (120)',
    'Mechanical Engineering (60)'
  ]);
  const [newProgramme, setNewProgramme] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Dynamic Document Checklist mapping based on application type
  const getDocumentChecklist = (type: ApplicationType): { type: DocumentType; mandatory: boolean; note: string }[] => {
    switch (type) {
      case 'EoA':
        return [
          { type: 'Affidavit', mandatory: true, note: 'Notarized composite affidavit in AICTE format' },
          { type: 'Fire Safety Certificate', mandatory: true, note: 'Valid Fire NOC issued by CFO' },
          { type: 'Occupancy Certificate', mandatory: true, note: 'Municipal completion / occupancy certificate' },
          { type: 'Faculty Appointment Letter', mandatory: true, note: 'Selection committee ratified orders' },
          { type: 'Faculty Qualification Certificate', mandatory: true, note: 'Principal and HoD PhD degrees' },
          { type: 'Audited Financial Statement', mandatory: true, note: 'CA certified balance sheet with UDIN' },
          { type: 'Prior EoA', mandatory: true, note: 'Approval letter for session 2025-2026' }
        ];

      case 'New_Institution':
        return [
          { type: 'Land Deed', mandatory: true, note: 'Registered sale/lease deed (min 30 yrs, min 2.5 acres)' },
          { type: 'Trust Deed', mandatory: true, note: 'Sponsoring Trust/Society registration certificate' },
          { type: 'Affidavit', mandatory: true, note: 'Mandatory Rs. 100 non-judicial notarized affidavit' },
          { type: 'NOC', mandatory: true, note: 'State Government and Affiliating University NOC' },
          { type: 'Building Plan', mandatory: true, note: 'Approved architectural master plan with carpet area' },
          { type: 'Occupancy Certificate', mandatory: true, note: 'Competent municipal town planning certificate' },
          { type: 'Structural Stability Certificate', mandatory: true, note: 'Empanelled structural engineer certificate' },
          { type: 'Fire Safety Certificate', mandatory: true, note: 'District Fire Officer safety clearance' }
        ];

      case 'Intake_Increase':
        return [
          { type: 'Prior EoA', mandatory: true, note: 'Continuous AICTE approval for last 3 years' },
          { type: 'Building Plan', mandatory: true, note: 'Built-up area schedule accommodating increased intake' },
          { type: 'Structural Stability Certificate', mandatory: true, note: 'Recent structural safety audit' },
          { type: 'Faculty Appointment Letter', mandatory: true, note: 'Recruitment orders maintaining 1:20 SFR' },
          { type: 'Audited Financial Statement', mandatory: true, note: 'Audited balance sheet showing corpus' },
          { type: 'Affidavit', mandatory: true, note: 'Affidavit affirming NBA accreditation' }
        ];

      case 'Site_Change':
        return [
          { type: 'Land Deed', mandatory: true, note: 'New campus registered land ownership deed' },
          { type: 'NOC', mandatory: true, note: 'State Govt & Affiliating University site change NOC' },
          { type: 'Building Plan', mandatory: true, note: 'Architectural drawings of proposed premises' },
          { type: 'Occupancy Certificate', mandatory: true, note: 'New premises completion certificate' },
          { type: 'Fire Safety Certificate', mandatory: true, note: 'Fire NOC for new campus' }
        ];

      case 'Closure':
        return [
          { type: 'NOC', mandatory: true, note: 'State Government concurrence for progressive closure' },
          { type: 'Audited Financial Statement', mandatory: true, note: 'Final settlement audit and student transfer NOC' },
          { type: 'Affidavit', mandatory: true, note: 'Undertaking for student relocation & fee refund' }
        ];
    }
  };

  const checklist = getDocumentChecklist(appType);

  const handleAddProgramme = () => {
    if (newProgramme.trim()) {
      setProgrammes([...programmes, newProgramme.trim()]);
      setNewProgramme('');
    }
  };

  const handleRemoveProgramme = (idx: number) => {
    setProgrammes(programmes.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          institutionId: institution.id,
          type: appType,
          academicYear,
          currentIntake: Number(currentIntake),
          proposedIntake: Number(proposedIntake),
          programmes
        })
      });

      const data = await res.json();
      if (data.success && data.application) {
        router.push(`/institution/applications/${data.application.id}`);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <DemoBanner />
      <Navbar />

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Breadcrumb Header */}
        <div className="mb-6">
          <div className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">
            Application Intelligence Wizard
          </div>
          <h1 className="text-2xl font-bold text-slate-900">
            Create AICTE Approval Application (2026-2027)
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Applying as: <strong>{institution.name}</strong> ({institution.aicteId})
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* Step 1: Select Application Type */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
            <h2 className="text-sm font-bold text-slate-900 mb-2 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-[#002b66] text-white text-xs flex items-center justify-center font-bold">1</span>
              <span>Select Approval Category / Application Type</span>
            </h2>
            <p className="text-xs text-slate-500 mb-4">
              The AICTE Sentinel engine will dynamically configure regulatory rules and mandatory document checklists.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {[
                { type: 'EoA', title: 'Extension of Approval (EoA)', desc: 'Annual renewal for existing technical programmes' },
                { type: 'Intake_Increase', title: 'Intake Increase / New Course', desc: 'Seat expansion or introduction of modern emerging tech courses' },
                { type: 'New_Institution', title: 'New Institution Approval', desc: 'Fresh establishment of Engineering, Polytechnic or Management institute' },
                { type: 'Site_Change', title: 'Change of Site / Location', desc: 'Shifting campus to a new permanent location' },
                { type: 'Closure', title: 'Progressive / Complete Closure', desc: 'Formal closure of non-viable institutions or programmes' }
              ].map((item) => (
                <button
                  key={item.type}
                  type="button"
                  onClick={() => setAppType(item.type as ApplicationType)}
                  className={`text-left p-4 rounded-xl border transition-all ${
                    appType === item.type
                      ? 'bg-blue-50/80 border-[#002b66] ring-2 ring-[#002b66]/20 shadow-xs'
                      : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/50'
                  }`}
                >
                  <div className="font-bold text-xs text-slate-900 mb-1">{item.title}</div>
                  <div className="text-[11px] text-slate-500 leading-snug">{item.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Step 2: Intake & Academic Programmes */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
            <h2 className="text-sm font-bold text-slate-900 mb-2 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-[#002b66] text-white text-xs flex items-center justify-center font-bold">2</span>
              <span>Intake Capacity & Programme Offerings</span>
            </h2>
            <p className="text-xs text-slate-500 mb-4">
              Enter declared student intake to calculate required faculty cadre and carpet area ratios.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Academic Year
                </label>
                <input
                  type="text"
                  value={academicYear}
                  onChange={(e) => setAcademicYear(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 text-slate-900 font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Current Approved Intake
                </label>
                <input
                  type="number"
                  value={currentIntake}
                  onChange={(e) => setCurrentIntake(Number(e.target.value))}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 text-slate-900 font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Proposed Approved Intake
                </label>
                <input
                  type="number"
                  value={proposedIntake}
                  onChange={(e) => setProposedIntake(Number(e.target.value))}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 text-slate-900 font-semibold"
                />
              </div>
            </div>

            {/* Programmes List */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Declared Academic Programmes
              </label>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={newProgramme}
                  onChange={(e) => setNewProgramme(e.target.value)}
                  placeholder="e.g. Artificial Intelligence & Machine Learning (60)"
                  className="flex-1 text-xs p-2.5 rounded-xl border border-slate-300 text-slate-900"
                />
                <button
                  type="button"
                  onClick={handleAddProgramme}
                  className="px-4 py-2.5 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Course</span>
                </button>
              </div>

              <div className="flex flex-wrap gap-2 pt-2">
                {programmes.map((p, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-blue-50 border border-blue-200 text-blue-900 text-xs font-medium"
                  >
                    <span>{p}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveProgramme(idx)}
                      className="text-blue-600 hover:text-rose-600 ml-1"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Step 3: Dynamic Document Checklist Preview */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
            <h2 className="text-sm font-bold text-slate-900 mb-2 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-[#002b66] text-white text-xs flex items-center justify-center font-bold">3</span>
              <span>Generated Statutory Document Checklist ({checklist.length} Documents)</span>
            </h2>
            <p className="text-xs text-slate-500 mb-4">
              These documents will be required in the upload and verification locker upon application creation:
            </p>

            <div className="border border-slate-200 rounded-xl divide-y divide-slate-100 overflow-hidden text-xs">
              {checklist.map((item, idx) => (
                <div key={idx} className="p-3.5 flex items-center justify-between hover:bg-slate-50/70 transition-colors">
                  <div className="flex items-center gap-3">
                    <FileText className="w-4 h-4 text-blue-600" />
                    <div>
                      <span className="font-bold text-slate-900">{item.type}</span>
                      <span className="text-[11px] text-slate-500 block">{item.note}</span>
                    </div>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                    item.mandatory ? 'bg-rose-50 text-rose-700 border border-rose-200' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {item.mandatory ? 'Mandatory' : 'Optional'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Submit Action */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={() => router.push('/institution')}
              className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 bg-[#002b66] hover:bg-[#001f4d] text-white rounded-xl text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-2 disabled:opacity-50"
            >
              {isSubmitting ? 'Creating Application Case...' : 'Initialize Application & Document Locker'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </form>
      </main>
    </div>
  );
}
