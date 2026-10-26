'use client';

import React, { useState } from 'react';
import { InfrastructureEvidence, InfrastructureCategory } from '@/types';
import { 
  Camera, 
  MapPin, 
  Layers, 
  AlertTriangle, 
  CheckCircle2, 
  Upload, 
  Info, 
  Cpu, 
  FileCheck,
  Maximize2,
  EyeOff
} from 'lucide-react';

interface InfrastructureEvidencePanelProps {
  applicationId: string;
  evidence: InfrastructureEvidence[];
  canUpload?: boolean;
  onEvidenceUploaded?: () => void;
}

export default function InfrastructureEvidencePanel({
  applicationId,
  evidence,
  canUpload = false,
  onEvidenceUploaded
}: InfrastructureEvidencePanelProps) {
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [category, setCategory] = useState<InfrastructureCategory>('Computer Center / Lab');
  const [evidenceType, setEvidenceType] = useState<'PHOTOGRAPH' | 'FLOOR_PLAN'>('PHOTOGRAPH');
  const [title, setTitle] = useState('');
  const [fileName, setFileName] = useState('');
  const [declaredAreaSqm, setDeclaredAreaSqm] = useState('180');
  const [planExtractedAreaSqm, setPlanExtractedAreaSqm] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fileName.trim()) {
      setUploadError('Please specify a simulated image or plan file name (e.g. Computer_Lab_Interior.jpg)');
      return;
    }
    setUploadError(null);
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/infrastructure/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          applicationId,
          category,
          evidenceType,
          title: title || `${category} Evidence`,
          fileName,
          declaredAreaSqm: Number(declaredAreaSqm) || 150,
          planExtractedAreaSqm: planExtractedAreaSqm ? Number(planExtractedAreaSqm) : undefined
        })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setShowUploadModal(false);
        setTitle('');
        setFileName('');
        if (onEvidenceUploaded) {
          onEvidenceUploaded();
        }
      } else {
        setUploadError(data.error || 'Failed to upload infrastructure evidence.');
      }
    } catch (err) {
      setUploadError((err as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-gradient-to-r from-slate-900 to-indigo-950 text-white rounded-2xl shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Camera className="w-5 h-5 text-indigo-400" />
            <h3 className="font-bold text-base tracking-wide">
              Infrastructure Photographic & Floor Plan Evidence
            </h3>
            <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-indigo-500/30 text-indigo-200 border border-indigo-400/30 uppercase">
              Vision-Lite Screening
            </span>
          </div>
          <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
            Statutory screening via EXIF metadata, GPS coordinates, camera hardware signatures, perceptual hash duplicate matching (dHash), and blur analysis. Advisory findings are generated for scrutiny officers.
          </p>
        </div>

        {canUpload && (
          <button
            onClick={() => setShowUploadModal(true)}
            className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold flex items-center gap-2 transition-colors self-start sm:self-auto shrink-0 shadow-sm"
          >
            <Upload className="w-4 h-4" />
            <span>Upload Photo / Plan</span>
          </button>
        )}
      </div>

      {/* Honest Disclosure Statement Banner */}
      <div className="p-4 bg-amber-50/80 border border-amber-200/90 rounded-xl text-xs text-amber-900 flex items-start gap-3">
        <Info className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <div className="font-bold text-amber-950">
            Automated Screening Transparency & Regulatory Boundary Notice
          </div>
          <p className="text-[11px] text-amber-800 leading-relaxed">
            The platform executes deterministic metadata analysis (EXIF, resolution, edge variance) and perceptual cross-application hashing. It <strong>does NOT perform deep object recognition, live terminal tallying, or biometric identification</strong> without an on-site hardware model. All outputs are strictly advisory recommendations for scrutiny officers and Expert Visiting Committees (EVC).
          </p>
        </div>
      </div>

      {/* Evidence Cards */}
      {evidence.length === 0 ? (
        <div className="p-8 text-center bg-slate-50 border border-slate-200 rounded-2xl text-slate-500 text-xs">
          No photographic or floor plan evidence has been registered for this application yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {evidence.map((item) => {
            const { checks } = item;
            const isPhysical = item.advisoryRecommendation === 'PHYSICAL_INSPECTION_SUGGESTED';
            const isAdditional = item.advisoryRecommendation === 'ADDITIONAL_EVIDENCE_SUGGESTED';

            return (
              <div 
                key={item.id} 
                className={`border rounded-2xl p-5 bg-white shadow-xs space-y-4 transition-all ${
                  isPhysical ? 'border-rose-300 ring-1 ring-rose-200' : isAdditional ? 'border-amber-300 ring-1 ring-amber-200' : 'border-slate-200'
                }`}
              >
                {/* Evidence Item Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-slate-900">{item.title}</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700 uppercase">
                        {item.category}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono text-indigo-700 bg-indigo-50 border border-indigo-200">
                        {item.evidenceType}
                      </span>
                    </div>
                    <div className="text-[11px] font-mono text-slate-500">
                      File: {item.fileName} • Declared Area: <strong className="text-slate-700">{item.declaredAreaSqm} sqm</strong> • Uploaded: {new Date(item.uploadedAt).toLocaleDateString()}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                      isPhysical
                        ? 'bg-rose-50 text-rose-700 border-rose-300'
                        : isAdditional
                        ? 'bg-amber-50 text-amber-700 border-amber-300'
                        : 'bg-emerald-50 text-emerald-700 border-emerald-300'
                    }`}>
                      {isPhysical ? 'Physical Inspection Suggested' : isAdditional ? 'Additional Evidence Suggested' : 'Clear Evidence'}
                    </span>
                  </div>
                </div>

                {/* Automated Forensic Checks Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                  {/* EXIF & Geotag */}
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                    <div className="flex items-center gap-1.5 text-slate-700 font-bold text-[11px] uppercase tracking-wider">
                      <MapPin className="w-3.5 h-3.5 text-blue-600" />
                      <span>EXIF & Geolocation</span>
                    </div>
                    {checks.exifExtracted ? (
                      <div className="space-y-1 text-[11px] text-slate-600">
                        <div><strong className="text-slate-800">Device:</strong> {checks.captureDevice || 'Unknown'}</div>
                        <div><strong className="text-slate-800">Timestamp:</strong> {checks.exifDate ? new Date(checks.exifDate).toLocaleString() : 'N/A'}</div>
                        {checks.exifGpsCoordinates && (
                          <div className="font-mono text-[10px] text-blue-700 bg-blue-50/60 p-1 rounded border border-blue-100">
                            GPS: {checks.exifGpsCoordinates.latitude.toFixed(4)}°N, {checks.exifGpsCoordinates.longitude.toFixed(4)}°E (Alt: {checks.exifGpsCoordinates.altitudeMeters || 0}m)
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-[11px] text-amber-700 bg-amber-50 p-2 rounded border border-amber-200">
                        EXIF metadata missing or stripped from source file.
                      </div>
                    )}
                  </div>

                  {/* Resolution, Sharpness & Perceptual Hash */}
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                    <div className="flex items-center gap-1.5 text-slate-700 font-bold text-[11px] uppercase tracking-wider">
                      <Cpu className="w-3.5 h-3.5 text-indigo-600" />
                      <span>Resolution & Hash</span>
                    </div>
                    <div className="space-y-1 text-[11px] text-slate-600">
                      <div>
                        <strong className="text-slate-800">Resolution:</strong> {checks.resolutionWidth}x{checks.resolutionHeight} ({checks.resolutionMegapixels} MP)
                      </div>
                      <div>
                        <strong className="text-slate-800">Sharpness / Blur:</strong>{' '}
                        <span className={`font-bold ${checks.isBlurry ? 'text-rose-600' : 'text-emerald-700'}`}>
                          {checks.blurScore}/100 ({checks.isBlurry ? 'Blurry / Inadequate' : 'Sharp / Verified'})
                        </span>
                      </div>
                      <div>
                        <strong className="text-slate-800">Perceptual Hash:</strong>
                        <span className="font-mono text-[10px] text-slate-700 block bg-white px-1.5 py-0.5 rounded border border-slate-200 mt-0.5 truncate">
                          {checks.perceptualHash}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Cross-Application Duplicate & Area Consistency */}
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                    <div className="flex items-center gap-1.5 text-slate-700 font-bold text-[11px] uppercase tracking-wider">
                      <Layers className="w-3.5 h-3.5 text-purple-600" />
                      <span>Cross-App & Area Check</span>
                    </div>
                    <div className="space-y-1 text-[11px]">
                      {checks.duplicateMatchFound ? (
                        <div className="p-2 rounded bg-rose-50 border border-rose-200 text-rose-800">
                          <strong>Near-Duplicate Hash Match:</strong> Matches image submitted in application{' '}
                          <span className="font-mono font-bold text-rose-900">{checks.duplicateMatchedAppId}</span>.
                        </div>
                      ) : (
                        <div className="text-emerald-700 flex items-center gap-1 text-[11px]">
                          <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                          <span>No cross-application image reuse detected.</span>
                        </div>
                      )}

                      {checks.areaConsistencyChecked && checks.planExtractedAreaSqm ? (
                        <div className="text-slate-600 pt-1 text-[11px]">
                          <div><strong>Plan Area:</strong> {checks.planExtractedAreaSqm} sqm</div>
                          <div>
                            <strong>Variance:</strong>{' '}
                            <span className={`font-bold ${checks.areaDiscrepancyPercentage && checks.areaDiscrepancyPercentage > 15 ? 'text-rose-600' : 'text-emerald-700'}`}>
                              {checks.areaDiscrepancyPercentage}% divergence
                            </span>
                          </div>
                        </div>
                      ) : (
                        <div className="text-slate-500 text-[10px] italic">
                          Architectural plan CAD overlay not supplied.
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Advisory Reason Banner */}
                {item.advisoryReason && (
                  <div className={`p-3 rounded-xl text-xs flex items-start gap-2.5 ${
                    isPhysical
                      ? 'bg-rose-50 border border-rose-200 text-rose-900'
                      : isAdditional
                      ? 'bg-amber-50 border border-amber-200 text-amber-900'
                      : 'bg-emerald-50 border border-emerald-200 text-emerald-900'
                  }`}>
                    <AlertTriangle className={`w-4 h-4 shrink-0 mt-0.5 ${isPhysical ? 'text-rose-600' : isAdditional ? 'text-amber-600' : 'text-emerald-600'}`} />
                    <div>
                      <strong className="block text-[11px] uppercase tracking-wide">
                        Advisory Scrutiny Guidance:
                      </strong>
                      <span className="text-[11px] leading-relaxed">{item.advisoryReason}</span>
                    </div>
                  </div>
                )}

                {/* Optional Vision Model Caption (strictly labeled AI-generated and unverified) */}
                {checks.optionalVisionCaption && (
                  <div className="p-3 bg-purple-50/70 border border-purple-200 rounded-xl text-xs text-purple-950 space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-[10px] uppercase tracking-wider text-purple-800">
                        Optional Vision Model Caption
                      </span>
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-extrabold bg-purple-200 text-purple-900 border border-purple-300 uppercase">
                        AI-generated & unverified
                      </span>
                    </div>
                    <p className="text-[11px] text-purple-900 italic leading-relaxed">
                      {checks.optionalVisionCaption}
                    </p>
                  </div>
                )}

                {/* Honest Disclosure of Ran vs Not Performed Checks */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-slate-100 text-[10px]">
                  <div>
                    <span className="font-bold text-slate-500 uppercase block mb-1">Checks Executed:</span>
                    <ul className="space-y-0.5 text-slate-700">
                      {checks.checksRan.map((c, idx) => (
                        <li key={idx} className="flex items-center gap-1.5">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                          <span>{c}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <span className="font-bold text-slate-500 uppercase block mb-1">Checks Not Performed:</span>
                    <ul className="space-y-0.5 text-slate-500">
                      {checks.checksNotPerformed.map((c, idx) => (
                        <li key={idx} className="flex items-center gap-1.5">
                          <EyeOff className="w-3 h-3 text-slate-400 shrink-0" />
                          <span>{c}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center gap-2">
                <Upload className="w-5 h-5 text-indigo-600" />
                <h4 className="font-bold text-slate-900 text-sm">Upload Infrastructure Photographic Evidence</h4>
              </div>
              <button 
                onClick={() => setShowUploadModal(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            {uploadError && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl">
                {uploadError}
              </div>
            )}

            <form onSubmit={handleUploadSubmit} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Infrastructure Claim Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as InfrastructureCategory)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 bg-white text-slate-800"
                >
                  <option value="Computer Center / Lab">Computer Center / Lab</option>
                  <option value="Central Library">Central Library</option>
                  <option value="Chemistry / Physics Lab">Chemistry / Physics Lab</option>
                  <option value="Seminar Hall / Auditorium">Seminar Hall / Auditorium</option>
                  <option value="Workshop / Mechanical Lab">Workshop / Mechanical Lab</option>
                  <option value="Administrative Area">Administrative Area</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Evidence Type</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-1.5 text-slate-700">
                    <input
                      type="radio"
                      name="evidenceType"
                      value="PHOTOGRAPH"
                      checked={evidenceType === 'PHOTOGRAPH'}
                      onChange={() => setEvidenceType('PHOTOGRAPH')}
                    />
                    <span>Photograph</span>
                  </label>
                  <label className="flex items-center gap-1.5 text-slate-700">
                    <input
                      type="radio"
                      name="evidenceType"
                      value="FLOOR_PLAN"
                      checked={evidenceType === 'FLOOR_PLAN'}
                      onChange={() => setEvidenceType('FLOOR_PLAN')}
                    />
                    <span>Floor Plan CAD / Layout</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Evidence Title</label>
                <input
                  type="text"
                  placeholder="e.g. Central Computing Facility Workstation Row"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 bg-white text-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Declared Area (sqm) *</label>
                  <input
                    type="number"
                    value={declaredAreaSqm}
                    onChange={(e) => setDeclaredAreaSqm(e.target.value)}
                    required
                    className="w-full p-2.5 rounded-xl border border-slate-300 bg-white text-slate-800 font-mono"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Plan Area (sqm, optional)</label>
                  <input
                    type="number"
                    placeholder="From architectural plan"
                    value={planExtractedAreaSqm}
                    onChange={(e) => setPlanExtractedAreaSqm(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 bg-white text-slate-800 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Simulated File Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Apex_Computer_Lab_Room102.jpg or Sunrise_Lab_Photo.jpg"
                  value={fileName}
                  onChange={(e) => setFileName(e.target.value)}
                  required
                  className="w-full p-2.5 rounded-xl border border-slate-300 bg-white text-slate-800 font-mono"
                />
                <span className="text-[10px] text-slate-500 mt-1 block">
                  Tip: filenames containing &ldquo;lowres&rdquo; or &ldquo;duplicate&rdquo; trigger specific advisory checks.
                </span>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2 border rounded-xl text-slate-600 hover:bg-slate-50 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold disabled:opacity-50 flex items-center gap-2"
                >
                  {isSubmitting ? 'Analyzing Metadata...' : 'Run Automated Screening'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
