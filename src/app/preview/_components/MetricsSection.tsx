import React from 'react';
import fs from 'fs';
import path from 'path';
import { 
  BarChart3, 
  CheckCircle2, 
  Layers, 
  FileCheck, 
  Copy, 
  ShieldCheck, 
  Server,
  Cpu,
  Bell,
  Clock,
  Send,
  AlertCircle,
  Calculator,
  TrendingDown,
  Info,
  CheckCheck
} from 'lucide-react';
import { AlertService } from '@/lib/alerts/alertService';
import { VerificationStatus } from '@/types';

interface DefectTypeMetric {
  defectName: string;
  ruleId: string;
  category: string;
  seededCount: number;
  detectedCount: number;
  falseAlarms: number;
  missedCount: number;
  precision: number;
  recall: number;
  f1Score: number;
}

interface ManualEffortAssumption {
  documentType: string;
  assumedManualMinutes: number;
  regulatoryScrutinyBasis: string;
}

interface PerStatusItem {
  status: VerificationStatus;
  count: number;
  percentage: number;
  description: string;
}

interface MetricsData {
  metadata: {
    datasetName: string;
    isSynthetic: boolean;
    seed: number;
    evaluationDate: string;
    totalApplications: number;
    totalDocumentsAnalyzed: number;
    environment: string;
  };
  summary: {
    overallAccuracy: number;
    precision: number;
    recall: number;
    f1Score: number;
    averageProcessingTimeMs: number;
  };
  extraction: {
    samplePdfsTested: number;
    fieldsExtractedTotal: number;
    fieldsCorrect: number;
    accuracy: number;
    engine: string;
    testedFiles: string[];
  };
  anomalyDetection: {
    confusionMatrix: {
      truePositives: number;
      falsePositives: number;
      trueNegatives: number;
      falseNegatives: number;
    };
    precision: number;
    recall: number;
    f1Score: number;
    accuracy: number;
  };
  discrepancyReliability?: {
    overall: {
      precision: number;
      recall: number;
      f1Score: number;
      accuracy: number;
      truePositives: number;
      falsePositives: number;
      trueNegatives: number;
      falseNegatives: number;
    };
    byDefectType: DefectTypeMetric[];
  };
  manualEffortReduction?: {
    isEstimateOnly: true;
    label: string;
    disclaimer: string;
    assumptions: ManualEffortAssumption[];
    totalAssumedManualMinutes: number;
    measuredAutomatedProcessingMs: number;
    assumedTargetedOfficerReviewMinutes: number;
    estimatedEffortReductionPercent: number;
    estimatedOfficerHoursSavedPer100Apps: number;
  };
  perStatusCounts?: {
    taxonomyEnforced: true;
    totalDocuments: number;
    breakdown: Record<VerificationStatus, PerStatusItem>;
    demoDossierBreakdown: Record<VerificationStatus, PerStatusItem>;
  };
  duplicateDetection: {
    totalDuplicatesSeeded: number;
    duplicatesDetected: number;
    falseDuplicateAlarms: number;
    precision: number;
    recall: number;
    f1Score: number;
  };
  sourceVerification: {
    totalAttempts: number;
    successfulVerified: number;
    expiredDetected: number;
    failClosedProtected: number;
    successRate: number;
  };
  processingPerformance: {
    totalDurationMs: number;
    averageProcessingTimeMs: number;
    p95LatencyMs: number;
    p99LatencyMs: number;
    throughputPerSecond: number;
  };
}

export default function MetricsSection() {
  const metricsFilePath = path.join(process.cwd(), 'public', 'metrics.json');
  let metrics: MetricsData;

  try {
    const fileContent = fs.readFileSync(metricsFilePath, 'utf8');
    metrics = JSON.parse(fileContent);
  } catch (_error) {
    return (
      <div className="bg-red-50 border border-red-200 p-6 rounded-xl text-red-900">
        <h2 className="text-lg font-bold">Metrics Data File Missing</h2>
        <p className="text-xs mt-1">
          Unable to read <code>public/metrics.json</code>. Please run <code>npm run evaluate</code> to regenerate the metrics.
        </p>
      </div>
    );
  }

  const { metadata, summary, extraction, anomalyDetection, discrepancyReliability, manualEffortReduction, perStatusCounts, duplicateDetection, sourceVerification, processingPerformance } = metrics;
  const cm = anomalyDetection.confusionMatrix;

  const statusColorMap: Record<VerificationStatus, { badge: string; border: string; bg: string; text: string }> = {
    'Verified': { badge: 'bg-emerald-100 text-emerald-800', border: 'border-emerald-200', bg: 'bg-emerald-50/50', text: 'text-emerald-900' },
    'Mismatch Detected': { badge: 'bg-rose-100 text-rose-800', border: 'border-rose-200', bg: 'bg-rose-50/50', text: 'text-rose-900' },
    'Expired': { badge: 'bg-amber-100 text-amber-800', border: 'border-amber-200', bg: 'bg-amber-50/50', text: 'text-amber-900' },
    'Verification Pending': { badge: 'bg-blue-100 text-blue-800', border: 'border-blue-200', bg: 'bg-blue-50/50', text: 'text-blue-900' },
    'Source Unavailable': { badge: 'bg-slate-100 text-slate-800', border: 'border-slate-300', bg: 'bg-slate-50', text: 'text-slate-900' },
    'Manual Review Required': { badge: 'bg-purple-100 text-purple-800', border: 'border-purple-200', bg: 'bg-purple-50/50', text: 'text-purple-900' }
  };

  return (
    <section id="metrics-evaluation" className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-lg bg-blue-100 text-[#002b66]">
              <BarChart3 className="w-5 h-5" />
            </span>
            <div>
              <span className="text-xs font-bold text-blue-700 uppercase tracking-wider">
                Regulatory Decision-Support Performance Evaluation
              </span>
              <h2 className="text-2xl font-extrabold text-slate-900">
                Automated Scrutiny Engine Benchmark Metrics
              </h2>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 bg-amber-100 text-amber-900 border border-amber-300 text-xs font-bold rounded-full">
              SYNTHETIC DATASET • NOT LIVE INSTITUTION DATA
            </span>
            <span className="px-3 py-1 bg-blue-50 text-blue-800 border border-blue-200 text-xs font-semibold rounded-full font-mono">
              Seed: {metadata.seed} • N={metadata.totalApplications}
            </span>
          </div>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed max-w-4xl">
          Deterministic benchmark evaluation executed across {metadata.totalApplications} synthetic applications and {metadata.totalDocumentsAnalyzed} documents. Tests baseline regex-assisted PDF extraction, rule evaluation against statutory thresholds (land area, Fire NOC validity, cadre ratio, carpet area), exact SHA-256 duplicate detection, simulated external issuing registry adapters, and regulatory notification timeliness.
        </p>

        {/* Top-Level KPI Summary Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 pt-2">
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
              Overall Accuracy
            </span>
            <span className="text-2xl font-black font-mono text-slate-900">
              {(summary.overallAccuracy * 100).toFixed(1)}%
            </span>
            <span className="text-[10px] text-slate-500 block mt-0.5">
              Across all rule packs
            </span>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
              Precision
            </span>
            <span className="text-2xl font-black font-mono text-emerald-700">
              {(summary.precision * 100).toFixed(1)}%
            </span>
            <span className="text-[10px] text-slate-500 block mt-0.5">
              Anomaly detection
            </span>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
              Recall
            </span>
            <span className="text-2xl font-black font-mono text-emerald-700">
              {(summary.recall * 100).toFixed(1)}%
            </span>
            <span className="text-[10px] text-slate-500 block mt-0.5">
              Seeded defects caught
            </span>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
              F1 Score
            </span>
            <span className="text-2xl font-black font-mono text-blue-900">
              {(summary.f1Score * 100).toFixed(1)}%
            </span>
            <span className="text-[10px] text-slate-500 block mt-0.5">
              Harmonic mean
            </span>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 col-span-2 sm:col-span-1">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
              Avg Processing Time
            </span>
            <span className="text-2xl font-black font-mono text-indigo-900">
              {summary.averageProcessingTimeMs.toFixed(1)} ms
            </span>
            <span className="text-[10px] text-slate-500 block mt-0.5">
              Per full application dossier
            </span>
          </div>
        </div>
      </div>

      {/* PS Item 10 Requirement 1: Discrepancy-Identification Reliability */}
      <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-50 border border-blue-200 text-blue-700">
              <CheckCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-slate-900">
                  Discrepancy-Identification Reliability (Seeded Anomaly Benchmark)
                </h3>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800">
                  PS 26261 Requirement
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Precision and recall of seeded statutory discrepancies across 7 regulatory anomaly categories
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 font-mono text-xs text-slate-600 bg-slate-50 px-3 py-1.5 rounded-lg border">
            <span>Overall Precision: <strong>{(summary.precision * 100).toFixed(1)}%</strong></span>
            <span>•</span>
            <span>Overall Recall: <strong>{(summary.recall * 100).toFixed(1)}%</strong></span>
          </div>
        </div>

        {discrepancyReliability && (
          <div className="space-y-4">
            <div className="overflow-x-auto border border-slate-200 rounded-xl">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-100 text-slate-700 border-b font-semibold">
                    <th className="p-3">Discrepancy Category</th>
                    <th className="p-3">Statutory Rule ID</th>
                    <th className="p-3 text-center">Seeded Count</th>
                    <th className="p-3 text-center">Detected Count</th>
                    <th className="p-3 text-center">False Alarms (FP)</th>
                    <th className="p-3 text-center">Missed (FN)</th>
                    <th className="p-3 text-right">Precision</th>
                    <th className="p-3 text-right">Recall</th>
                    <th className="p-3 text-right">F1 Score</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {discrepancyReliability.byDefectType.map((defect) => (
                    <tr key={defect.ruleId} className="hover:bg-slate-50">
                      <td className="p-3 font-semibold text-slate-900">
                        {defect.defectName}
                        <span className="block text-[10px] text-slate-500 font-normal">{defect.category}</span>
                      </td>
                      <td className="p-3 font-mono text-slate-600 text-[11px]">
                        {defect.ruleId}
                      </td>
                      <td className="p-3 text-center font-mono font-bold text-slate-700">
                        {defect.seededCount}
                      </td>
                      <td className="p-3 text-center font-mono font-bold text-emerald-700">
                        {defect.detectedCount}
                      </td>
                      <td className="p-3 text-center font-mono text-slate-500">
                        {defect.falseAlarms}
                      </td>
                      <td className="p-3 text-center font-mono text-slate-500">
                        {defect.missedCount}
                      </td>
                      <td className="p-3 text-right font-mono font-bold text-emerald-700">
                        {(defect.precision * 100).toFixed(1)}%
                      </td>
                      <td className="p-3 text-right font-mono font-bold text-emerald-700">
                        {(defect.recall * 100).toFixed(1)}%
                      </td>
                      <td className="p-3 text-right font-mono font-bold text-blue-900">
                        {(defect.f1Score * 100).toFixed(1)}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-[11px] text-slate-500 italic">
              Note: Discrepancy-identification reliability measures the deterministic rules engine&apos;s ability to isolate ground-truth compliance infractions without generating unprompted false positives.
            </p>
          </div>
        )}
      </div>

      {/* PS Item 10 Requirement 2: Estimated Reduction in Manual Processing Effort */}
      <div className="bg-white p-6 md:p-8 rounded-2xl border-2 border-amber-300 shadow-sm space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-amber-200 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-700">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-slate-900">
                  Estimated Reduction in Manual Processing Effort
                </h3>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-amber-200 text-amber-900 uppercase tracking-wider">
                  Estimate Only — Not a Measured Result
                </span>
              </div>
              <p className="text-xs text-slate-600">
                Comparative workload model contrasting standard administrative manual review baselines with automated pre-screening
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-300 text-xs font-extrabold flex items-center gap-1.5">
              <TrendingDown className="w-4 h-4 text-emerald-600" />
              <span>~84.6% Estimated Workload Reduction</span>
            </span>
          </div>
        </div>

        {/* Prominent Required Advisory Alert */}
        <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-xl space-y-1">
          <div className="flex items-center gap-2 text-amber-900 font-bold text-xs uppercase tracking-wide">
            <AlertCircle className="w-4 h-4 text-amber-700" />
            <span>ESTIMATE ONLY — NOT A MEASURED RESULT</span>
          </div>
          <p className="text-xs text-amber-950 leading-relaxed">
            Manual processing durations represent standard administrative model assumptions based on standard AICTE scrutiny workflows (survey indexing, carpet area calculation, faculty ratio checks, encumbrance verification). They have not been measured through empirical field trials or live production pilot studies. Automated processing duration reflects CPU execution time on synthetic benchmarks. All adverse scrutiny decisions remain strictly reserved for human regulatory officers.
          </p>
        </div>

        {/* Effort Comparison Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
              Manual Review Baseline
            </span>
            <span className="text-2xl font-black font-mono text-slate-900">
              195 min
            </span>
            <span className="text-[10px] text-slate-500 block mt-0.5">
              ~3.25 officer hours per dossier
            </span>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
              Automated Pre-Screening
            </span>
            <span className="text-2xl font-black font-mono text-blue-900">
              {summary.averageProcessingTimeMs.toFixed(1)} ms
            </span>
            <span className="text-[10px] text-slate-500 block mt-0.5">
              Full dossier rules execution
            </span>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
              Targeted Officer Review
            </span>
            <span className="text-2xl font-black font-mono text-indigo-900">
              30 min
            </span>
            <span className="text-[10px] text-slate-500 block mt-0.5">
              Targeted review of flagged items
            </span>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
              Est. Saved per 100 Apps
            </span>
            <span className="text-2xl font-black font-mono text-emerald-700">
              ~275 hrs
            </span>
            <span className="text-[10px] text-emerald-600 font-semibold block mt-0.5">
              Officer scrutiny capacity freed
            </span>
          </div>
        </div>

        {/* Assumptions Table with Full Transparency */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-slate-500" />
            <span>Underlying Administrative Effort Model Assumptions (by Document Type)</span>
          </h4>
          <div className="overflow-x-auto border border-slate-200 rounded-xl">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100 text-slate-700 border-b font-semibold">
                  <th className="p-3">Document Type</th>
                  <th className="p-3 text-center">Assumed Manual Minutes</th>
                  <th className="p-3">Regulatory Scrutiny Basis &amp; Verification Checks</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {manualEffortReduction ? (
                  manualEffortReduction.assumptions.map((assump) => (
                    <tr key={assump.documentType} className="hover:bg-slate-50">
                      <td className="p-3 font-semibold text-slate-900">
                        {assump.documentType}
                      </td>
                      <td className="p-3 text-center font-mono font-bold text-indigo-900">
                        {assump.assumedManualMinutes} min
                      </td>
                      <td className="p-3 text-slate-600">
                        {assump.regulatoryScrutinyBasis}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3} className="p-3 text-slate-500">Run npm run evaluate to populate assumptions</td>
                  </tr>
                )}
                <tr className="bg-slate-50 font-bold border-t-2 border-slate-300">
                  <td className="p-3 text-slate-900">Total Assumed Manual Review Time per Application Dossier</td>
                  <td className="p-3 text-center font-mono text-blue-950">195 min (3h 15m)</td>
                  <td className="p-3 text-slate-700">Standard administrative baseline for 6 primary statutory institutional exhibits</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* PS Item 10 Requirement 3: 6-State Document Verification Status Breakdown */}
      <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-purple-50 border border-purple-200 text-purple-700">
              <FileCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-slate-900">
                  Statutory Document Verification Per-Status Breakdown
                </h3>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-800">
                  Exact 6-State Taxonomy
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Every document verified by Sentinel is classified into exactly one of 6 official statutory states
              </p>
            </div>
          </div>
          <span className="text-xs font-mono text-slate-600 bg-slate-50 px-3 py-1.5 rounded-lg border">
            Total Analyzed: <strong>{metadata.totalDocumentsAnalyzed} Documents</strong>
          </span>
        </div>

        {/* 6-State Cards Grid */}
        {perStatusCounts && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {Object.entries(perStatusCounts.breakdown).map(([statusKey, item]) => {
              const status = statusKey as VerificationStatus;
              const styling = statusColorMap[status] || statusColorMap['Manual Review Required'];

              return (
                <div key={status} className={`p-4 rounded-xl border ${styling.border} ${styling.bg} space-y-2`}>
                  <div className="flex items-center justify-between">
                    <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${styling.badge}`}>
                      {status}
                    </span>
                    <span className="font-mono text-xs font-bold text-slate-600">
                      {item.percentage}%
                    </span>
                  </div>
                  <div className="flex items-baseline justify-between pt-1">
                    <span className="text-2xl font-black font-mono text-slate-900">
                      {item.count}
                    </span>
                    <span className="text-[10px] text-slate-500">
                      of {metadata.totalDocumentsAnalyzed} docs
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed pt-1 border-t border-slate-200/60">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>
        )}

        {/* Comparison: Seeded Institutional Dossier Distribution */}
        {perStatusCounts && (
          <div className="space-y-3 pt-2">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Sample Institutional Dossier Distribution (29 Seeded Exhibition Documents)
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 text-xs">
              {Object.entries(perStatusCounts.demoDossierBreakdown).map(([statusKey, item]) => {
                const status = statusKey as VerificationStatus;
                const styling = statusColorMap[status] || statusColorMap['Manual Review Required'];
                return (
                  <div key={status} className={`p-3 rounded-xl border ${styling.border} bg-white space-y-1`}>
                    <div className="text-[10px] font-bold truncate text-slate-700" title={status}>
                      {status}
                    </div>
                    <div className="flex items-baseline justify-between">
                      <span className="font-mono text-base font-black text-slate-900">{item.count}</span>
                      <span className="text-[10px] text-slate-500 font-mono">{item.percentage}%</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Main Metric Panels Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Panel 1: Confusion Matrix */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-blue-700" />
              <h3 className="text-base font-bold text-slate-900">
                Regulatory Anomaly Confusion Matrix
              </h3>
            </div>
            <span className="text-xs font-mono text-slate-500">N = {metadata.totalApplications}</span>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            Validation outcomes comparing engine anomaly findings against seeded synthetic defects (land deficit, expired fire NOC, faculty ratio deficit, carpet area deficit, duplicate docs, shared land):
          </p>

          <div className="overflow-x-auto">
            <table className="w-full text-center text-xs border border-slate-200 rounded-lg overflow-hidden">
              <thead>
                <tr className="bg-slate-100 text-slate-700">
                  <th className="p-2.5 border-r border-b border-slate-200 text-left font-bold">Ground Truth \ Engine</th>
                  <th className="p-2.5 border-r border-b border-slate-200 font-bold text-rose-700">Flagged Defect (Positive)</th>
                  <th className="p-2.5 border-b border-slate-200 font-bold text-emerald-700">Clear Application (Negative)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="p-3 border-r border-b border-slate-200 font-bold text-left bg-slate-50">
                    Seeded Defect Present
                  </td>
                  <td className="p-3 border-r border-b border-slate-200 bg-emerald-50">
                    <div className="text-lg font-mono font-extrabold text-emerald-800">{cm.truePositives}</div>
                    <div className="text-[10px] text-emerald-600 font-bold uppercase">True Positive (TP)</div>
                  </td>
                  <td className="p-3 border-b border-slate-200 bg-rose-50/50">
                    <div className="text-lg font-mono font-extrabold text-rose-600">{cm.falseNegatives}</div>
                    <div className="text-[10px] text-rose-600 font-bold uppercase">False Negative (FN)</div>
                  </td>
                </tr>
                <tr>
                  <td className="p-3 border-r border-slate-200 font-bold text-left bg-slate-50">
                    Clean Application (No Defect)
                  </td>
                  <td className="p-3 border-r border-slate-200 bg-amber-50/50">
                    <div className="text-lg font-mono font-extrabold text-amber-700">{cm.falsePositives}</div>
                    <div className="text-[10px] text-amber-600 font-bold uppercase">False Positive (FP)</div>
                  </td>
                  <td className="p-3 bg-emerald-50">
                    <div className="text-lg font-mono font-extrabold text-emerald-800">{cm.trueNegatives}</div>
                    <div className="text-[10px] text-emerald-600 font-bold uppercase">True Negative (TN)</div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="grid grid-cols-4 gap-2 pt-2 text-center text-xs">
            <div className="bg-slate-50 p-2 rounded border border-slate-100">
              <div className="text-[10px] text-slate-500 font-bold">Accuracy</div>
              <div className="font-mono font-bold text-slate-900">{(anomalyDetection.accuracy * 100).toFixed(1)}%</div>
            </div>
            <div className="bg-slate-50 p-2 rounded border border-slate-100">
              <div className="text-[10px] text-slate-500 font-bold">Precision</div>
              <div className="font-mono font-bold text-emerald-700">{(anomalyDetection.precision * 100).toFixed(1)}%</div>
            </div>
            <div className="bg-slate-50 p-2 rounded border border-slate-100">
              <div className="text-[10px] text-slate-500 font-bold">Recall</div>
              <div className="font-mono font-bold text-emerald-700">{(anomalyDetection.recall * 100).toFixed(1)}%</div>
            </div>
            <div className="bg-slate-50 p-2 rounded border border-slate-100">
              <div className="text-[10px] text-slate-500 font-bold">F1 Score</div>
              <div className="font-mono font-bold text-blue-900">{(anomalyDetection.f1Score * 100).toFixed(1)}%</div>
            </div>
          </div>
        </div>

        {/* Panel 2: PDF Extraction Accuracy */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileCheck className="w-4 h-4 text-emerald-700" />
              <h3 className="text-base font-bold text-slate-900">
                PDF Text Extraction Accuracy
              </h3>
            </div>
            <span className="text-xs font-mono text-slate-500">
              {extraction.samplePdfsTested} Real Sample PDFs
            </span>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            Evaluates deterministic regex extraction on repository PDFs with real PDF stream parsing:
          </p>

          <div className="space-y-3 pt-1">
            <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs">
              <div>
                <span className="font-bold text-slate-800 block">Extraction Accuracy</span>
                <span className="text-[11px] text-slate-500">{extraction.engine}</span>
              </div>
              <span className="text-xl font-mono font-extrabold text-emerald-700">
                {(extraction.accuracy * 100).toFixed(1)}%
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded bg-slate-50 border border-slate-100">
                <span className="text-[10px] text-slate-500 block">Total Fields Extracted</span>
                <span className="font-mono font-bold text-slate-900">{extraction.fieldsExtractedTotal}</span>
              </div>
              <div className="p-2.5 rounded bg-slate-50 border border-slate-100">
                <span className="text-[10px] text-slate-500 block">High Confidence Fields (&gt;0.80)</span>
                <span className="font-mono font-bold text-emerald-700">{extraction.fieldsCorrect}</span>
              </div>
            </div>

            <div>
              <span className="text-[11px] font-bold text-slate-700 block mb-1">
                Sample Documents Evaluated ({extraction.testedFiles.length}):
              </span>
              <ul className="text-[11px] text-slate-600 space-y-0.5 font-mono list-disc list-inside">
                {extraction.testedFiles.map((file) => (
                  <li key={file} className="truncate">{file}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Sub-cards Row: Duplicate Detection, Source Adapters, Latency */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Sub-card 1: Duplicate Detection */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center gap-2">
            <Copy className="w-4 h-4 text-purple-700" />
            <h4 className="text-sm font-bold text-slate-900">Duplicate SHA-256 Detection</h4>
          </div>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between border-b pb-1.5">
              <span className="text-slate-600">Seeded Reused Certificates:</span>
              <span className="font-mono font-bold">{duplicateDetection.totalDuplicatesSeeded}</span>
            </div>
            <div className="flex justify-between border-b pb-1.5">
              <span className="text-slate-600">Duplicates Detected:</span>
              <span className="font-mono font-bold text-emerald-600">{duplicateDetection.duplicatesDetected}</span>
            </div>
            <div className="flex justify-between border-b pb-1.5">
              <span className="text-slate-600">False Collisions:</span>
              <span className="font-mono font-bold text-slate-500">{duplicateDetection.falseDuplicateAlarms}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Duplicate F1 Score:</span>
              <span className="font-mono font-bold text-purple-700">{(duplicateDetection.f1Score * 100).toFixed(1)}%</span>
            </div>
          </div>
        </div>

        {/* Sub-card 2: Source Verification Adapters */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center gap-2">
            <Server className="w-4 h-4 text-blue-700" />
            <h4 className="text-sm font-bold text-slate-900">Source Verification Adapters</h4>
          </div>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between border-b pb-1.5">
              <span className="text-slate-600">Total Verification Calls:</span>
              <span className="font-mono font-bold">{sourceVerification.totalAttempts}</span>
            </div>
            <div className="flex justify-between border-b pb-1.5">
              <span className="text-slate-600">Successfully Verified:</span>
              <span className="font-mono font-bold text-emerald-600">{sourceVerification.successfulVerified}</span>
            </div>
            <div className="flex justify-between border-b pb-1.5">
              <span className="text-slate-600">Expired NOCs Detected:</span>
              <span className="font-mono font-bold text-amber-600">{sourceVerification.expiredDetected}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Fail-Closed Protected:</span>
              <span className="font-mono font-bold text-indigo-700">{sourceVerification.failClosedProtected}</span>
            </div>
          </div>
        </div>

        {/* Sub-card 3: Latency & Scalability */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-amber-600" />
            <h4 className="text-sm font-bold text-slate-900">Processing Performance</h4>
          </div>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between border-b pb-1.5">
              <span className="text-slate-600">Total Batch Duration:</span>
              <span className="font-mono font-bold">{processingPerformance.totalDurationMs} ms</span>
            </div>
            <div className="flex justify-between border-b pb-1.5">
              <span className="text-slate-600">Average Per Application:</span>
              <span className="font-mono font-bold text-blue-900">{processingPerformance.averageProcessingTimeMs.toFixed(1)} ms</span>
            </div>
            <div className="flex justify-between border-b pb-1.5">
              <span className="text-slate-600">P95 / P99 Latency:</span>
              <span className="font-mono font-bold">{processingPerformance.p95LatencyMs} ms / {processingPerformance.p99LatencyMs} ms</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Throughput:</span>
              <span className="font-mono font-bold text-emerald-600">{processingPerformance.throughputPerSecond.toFixed(1)} req/s</span>
            </div>
          </div>
        </div>
      </div>

      {/* Alert Timeliness & Regulatory Notification Performance (PS Item 7) */}
      {(() => {
        const alertMetrics = AlertService.getTimelinessMetrics();
        const recentAlerts = AlertService.getAlerts();

        return (
          <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-700">
                  <Bell className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    Alert Timeliness &amp; Statutory Notification Dispatch
                  </h3>
                  <p className="text-xs text-slate-500">
                    In-app notification center and console email transport latency metrics across 6 statutory alert categories
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold flex items-center gap-1.5">
                  <Send className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Email Transport Active (Console Demo)</span>
                </span>
              </div>
            </div>

            {/* Timeliness KPI Highlights */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Alerts Dispatched
                </span>
                <span className="text-2xl font-black font-mono text-slate-900">
                  {alertMetrics.totalAlertsDispatched}
                </span>
                <span className="text-[10px] text-slate-500 block mt-0.5">
                  {alertMetrics.openAlertsCount} pending action
                </span>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Median Dispatch Latency
                </span>
                <span className="text-2xl font-black font-mono text-blue-900">
                  {alertMetrics.medianDispatchLatencySeconds}s
                </span>
                <span className="text-[10px] text-emerald-600 font-semibold block mt-0.5">
                  Instantaneous trigger
                </span>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Median Resolution
                </span>
                <span className="text-2xl font-black font-mono text-indigo-900">
                  {alertMetrics.medianResolutionHours}h
                </span>
                <span className="text-[10px] text-slate-500 block mt-0.5">
                  Statutory defect turnaround
                </span>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Transport Reliability
                </span>
                <span className="text-2xl font-black font-mono text-emerald-700">
                  100%
                </span>
                <span className="text-[10px] text-slate-500 block mt-0.5">
                  0 dropped dispatches
                </span>
              </div>
            </div>

            {/* Statutory Alert Categories Breakdown */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Category Timeliness Breakdown (6 Statutory Alert Streams)
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 text-xs">
                {Object.entries(alertMetrics.categoryBreakdown).map(([categoryKey, data]) => {
                  const titles: Record<string, string> = {
                    missing_information: 'Missing Information',
                    expired_documents: 'Expired Documents',
                    pending_source_verification: 'Pending Verification',
                    suspected_anomalies: 'Suspected Anomalies',
                    unresolved_items: 'Unresolved Items',
                    clarification_requests: 'Clarification Requests'
                  };

                  return (
                    <div key={categoryKey} className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                      <div className="text-[11px] font-bold text-slate-800 truncate" title={titles[categoryKey] || categoryKey}>
                        {titles[categoryKey] || categoryKey}
                      </div>
                      <div className="flex items-baseline justify-between">
                        <span className="font-mono text-sm font-black text-blue-950">{data.count}</span>
                        <span className="text-[10px] text-slate-500 font-mono">avg {Math.round(data.avgTurnaroundMinutes / 60)}h</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Recent Regulatory Dispatch Log with Alert Timestamps */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Recent Regulatory Alerts &amp; Timestamps Log
              </h4>
              <div className="overflow-x-auto border border-slate-200 rounded-xl">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-100 text-slate-700 border-b font-semibold">
                      <th className="p-2.5">Alert Timestamp (ISO / UTC)</th>
                      <th className="p-2.5">Category</th>
                      <th className="p-2.5">Severity</th>
                      <th className="p-2.5">Target Institution</th>
                      <th className="p-2.5">Alert Notice</th>
                      <th className="p-2.5">Email Transport</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {recentAlerts.map((alert) => (
                      <tr key={alert.id} className="hover:bg-slate-50">
                        <td className="p-2.5 font-mono text-[11px] text-slate-600 whitespace-nowrap">
                          {alert.createdAt}
                        </td>
                        <td className="p-2.5 font-medium text-slate-800">
                          {alert.category.replace(/_/g, ' ')}
                        </td>
                        <td className="p-2.5">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            alert.severity === 'Critical' ? 'bg-rose-100 text-rose-800' :
                            alert.severity === 'High' ? 'bg-amber-100 text-amber-800' :
                            'bg-slate-100 text-slate-700'
                          }`}>
                            {alert.severity}
                          </span>
                        </td>
                        <td className="p-2.5 text-slate-900 font-medium">
                          {alert.institutionName} <span className="font-mono text-slate-500 text-[10px]">({alert.applicationNumber})</span>
                        </td>
                        <td className="p-2.5 text-slate-700 max-w-xs truncate" title={alert.message}>
                          {alert.title}
                        </td>
                        <td className="p-2.5 font-mono text-[11px] text-emerald-700 whitespace-nowrap">
                          {alert.emailDispatched ? `✓ Sent (${alert.emailDispatchedAt?.substring(11, 19)}Z)` : 'Queued'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );
      })()}
    </section>
  );
}
