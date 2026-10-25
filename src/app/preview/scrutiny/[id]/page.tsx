import React from 'react';
import ScrutinyReportSection from '../../_components/ScrutinyReportSection';

export default async function PreviewScrutinyPage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div className="space-y-6">
      <ScrutinyReportSection appId={id} />
    </div>
  );
}
