import React from 'react';
import ConformanceSection from '../_components/ConformanceSection';

export const metadata = {
  title: 'PS 26261 Conformance Matrix Preview — AICTE Sentinel',
  description: 'Public read-only preview of AICTE Sentinel Problem Statement 26261 conformance matrix and audit evaluation.'
};

export default function PreviewConformancePage() {
  return (
    <div className="space-y-6">
      <ConformanceSection />
    </div>
  );
}
