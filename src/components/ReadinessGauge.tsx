import React from 'react';
import { ReadinessBreakdown } from '@/types';
import { ShieldCheck, AlertOctagon, AlertCircle, AlertTriangle, CheckCircle } from 'lucide-react';

interface ReadinessGaugeProps {
  readiness: ReadinessBreakdown;
  size?: 'sm' | 'md' | 'lg';
}

export default function ReadinessGauge({ readiness, size = 'md' }: ReadinessGaugeProps) {
  const { score, criticalDeficiencies, highDeficiencies, mediumDeficiencies, lowDeficiencies, passedChecks, totalChecks } = readiness;

  let scoreColor = 'text-emerald-600';
  let strokeColor = '#059669'; // emerald-600
  let badgeText = 'High Readiness - Ready for Scrutiny';
  let badgeBg = 'bg-emerald-50 text-emerald-800 border-emerald-200';

  if (score < 40) {
    scoreColor = 'text-rose-600';
    strokeColor = '#e11d48'; // rose-600
    badgeText = 'Critical Deficiencies Detected - Not Ready';
    badgeBg = 'bg-rose-50 text-rose-800 border-rose-200';
  } else if (score < 70) {
    scoreColor = 'text-amber-600';
    strokeColor = '#d97706'; // amber-600
    badgeText = 'Rectification Required Before Submission';
    badgeBg = 'bg-amber-50 text-amber-800 border-amber-200';
  }

  // Circular gauge calculations
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Left Circular Gauge */}
        <div className="flex items-center gap-6">
          <div className="relative w-36 h-36 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 128 128">
              <circle
                cx="64"
                cy="64"
                r={radius}
                className="text-slate-100"
                strokeWidth="12"
                stroke="currentColor"
                fill="transparent"
              />
              <circle
                cx="64"
                cy="64"
                r={radius}
                stroke={strokeColor}
                strokeWidth="12"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="transparent"
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center text-center">
              <span className={`text-3xl font-extrabold ${scoreColor}`}>{score}</span>
              <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">out of 100</span>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-base font-bold text-slate-900">Application Readiness Score</span>
            </div>
            <p className="text-xs text-slate-600 max-w-sm mb-3">
              Automated AICTE statutory compliance assessment based on 22 versioned regulatory checks.
            </p>
            <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${badgeBg}`}>
              {score >= 70 ? <CheckCircle className="w-3.5 h-3.5 text-emerald-600" /> : <AlertTriangle className="w-3.5 h-3.5" />}
              <span>{badgeText}</span>
            </div>
          </div>
        </div>

        {/* Right Severity Deficiencies Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full md:w-auto">
          <div className="bg-rose-50/70 border border-rose-200 rounded-xl p-3 text-center min-w-[90px]">
            <div className="text-rose-600 flex justify-center mb-1">
              <AlertOctagon className="w-4 h-4" />
            </div>
            <div className="text-xl font-bold text-rose-700">{criticalDeficiencies}</div>
            <div className="text-[11px] font-semibold text-rose-900">Critical</div>
            <div className="text-[10px] text-rose-600 mt-0.5">-25 pts each</div>
          </div>

          <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-3 text-center min-w-[90px]">
            <div className="text-amber-600 flex justify-center mb-1">
              <AlertCircle className="w-4 h-4" />
            </div>
            <div className="text-xl font-bold text-amber-700">{highDeficiencies}</div>
            <div className="text-[11px] font-semibold text-amber-900">High</div>
            <div className="text-[10px] text-amber-600 mt-0.5">-15 pts each</div>
          </div>

          <div className="bg-orange-50/70 border border-orange-200 rounded-xl p-3 text-center min-w-[90px]">
            <div className="text-orange-600 flex justify-center mb-1">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div className="text-xl font-bold text-orange-700">{mediumDeficiencies}</div>
            <div className="text-[11px] font-semibold text-orange-900">Medium</div>
            <div className="text-[10px] text-orange-600 mt-0.5">-8 pts each</div>
          </div>

          <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-3 text-center min-w-[90px]">
            <div className="text-emerald-600 flex justify-center mb-1">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div className="text-xl font-bold text-emerald-700">{passedChecks}/{totalChecks}</div>
            <div className="text-[11px] font-semibold text-emerald-900">Passed</div>
            <div className="text-[10px] text-emerald-600 mt-0.5">Compliant</div>
          </div>
        </div>
      </div>
    </div>
  );
}
