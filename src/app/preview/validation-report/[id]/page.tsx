import React from 'react';
import { notFound } from 'next/navigation';
import { DataStore } from '@/lib/store';
import { RulesEngine } from '@/lib/rules/engine';
import { AuditTrailEngine } from '@/lib/audit/trail';
import ValidationReportView from '@/components/ValidationReportView';

export default async function PreviewValidationReportPage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const app = DataStore.getApplicationById(id);

  if (!app) {
    notFound();
  }

  const institution = DataStore.getInstitutionById(app.institutionId);
  const documents = DataStore.getDocuments(app.id);
  const instRecord = DataStore.getInstitutionalRecord(app.institutionId);
  const { breakdown, ruleFindings } = RulesEngine.evaluateApplication(
    app,
    documents,
    DataStore.getApplications(),
    documents,
    DataStore.getInstitutions(),
    instRecord
  );
  const headHash = AuditTrailEngine.getHeadHash();

  return (
    <div className="space-y-6">
      <ValidationReportView
        application={app}
        institution={institution}
        documents={documents}
        readiness={breakdown}
        findings={ruleFindings}
        instRecord={instRecord}
        backUrl="/preview/institution"
        headHash={headHash}
      />
    </div>
  );
}
