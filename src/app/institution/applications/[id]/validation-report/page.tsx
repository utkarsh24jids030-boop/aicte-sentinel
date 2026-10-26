import React from 'react';
import { notFound } from 'next/navigation';
import { DataStore } from '@/lib/store';
import { RulesEngine } from '@/lib/rules/engine';
import { AuditTrailEngine } from '@/lib/audit/trail';
import Navbar from '@/components/Navbar';
import ValidationReportView from '@/components/ValidationReportView';

export default async function InstitutionValidationReportPage({
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
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans print:bg-white">
      <div className="print:hidden">
        <Navbar />
      </div>
      <main className="flex-1 py-8">
        <ValidationReportView
          application={app}
          institution={institution}
          documents={documents}
          readiness={breakdown}
          findings={ruleFindings}
          instRecord={instRecord}
          backUrl={`/institution/applications/${app.id}`}
          headHash={headHash}
        />
      </main>
    </div>
  );
}
