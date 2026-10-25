import React from 'react';
import CaseFileSection from '../../_components/CaseFileSection';

export default async function PreviewCasePage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div className="space-y-6">
      <CaseFileSection appId={id} />
    </div>
  );
}
