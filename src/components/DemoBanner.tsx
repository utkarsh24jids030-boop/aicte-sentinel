'use client';

import React from 'react';
import { AlertTriangle, ShieldCheck } from 'lucide-react';

export default function DemoBanner() {
  return (
    <div className="bg-amber-500/10 border-b border-amber-500/20 px-4 py-2 text-xs md:text-sm text-amber-900 flex items-center justify-between">
      <div className="flex items-center gap-2 mx-auto text-center font-medium">
        <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0" />
        <span>
          <strong className="font-semibold text-amber-950">AICTE Sentinel SIH 2026 Prototype:</strong> Operating in sandbox mode with synthetic data and mock verification adapters. All AI & forensic outputs are advisory decision-support only. Final regulatory scrutiny remains with competent AICTE authorities.
        </span>
      </div>
    </div>
  );
}
