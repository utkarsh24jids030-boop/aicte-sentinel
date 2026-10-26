import React from 'react';
import SafeguardsSection from '../_components/SafeguardsSection';

export const metadata = {
  title: 'Safeguards & Data Handling Preview — AICTE Sentinel',
  description: 'Public read-only preview of AICTE Sentinel safeguards, RBAC matrix, access logs, and data retention policy.'
};

export default function PreviewSafeguardsPage() {
  return (
    <div className="space-y-6">
      <SafeguardsSection />
    </div>
  );
}
