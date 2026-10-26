import React from 'react';
import { DataStore } from '@/lib/store';
import { RulesEngine } from '@/lib/rules/engine';
import { Application, DocumentRecord, Finding } from '@/types';
import { formatSeverity, formatStatus, maskIdentifier, maskPII } from './helpers';

interface CaseFileSectionProps {
  appId?: string;
}

export default function CaseFileSection({ appId }: CaseFileSectionProps) {
  const applications = appId 
    ? [DataStore.getApplicationById(appId)].filter((a): a is Application => Boolean(a))
    : DataStore.getApplications();

  if (applications.length === 0) {
    return (
      <div className="p-8 text-center bg-rose-50 border border-rose-200 rounded-xl text-rose-700 font-semibold">
        Application &ldquo;{appId}&rdquo; was not found in the AICTE Sentinel data store.
      </div>
    );
  }

  return (
    <section id="case-files" className="space-y-12">
      {applications.map((app) => {
        const institution = DataStore.getInstitutionById(app.institutionId);
        const documents = DataStore.getDocuments(app.id);
        const findings = DataStore.getFindings(app.id);
        const { breakdown } = RulesEngine.evaluateApplication(app, documents);

        return (
          <article 
            key={app.id} 
            id={`case-${app.id}`} 
            className="p-6 md:p-8 bg-white border border-slate-200 rounded-2xl shadow-sm space-y-8"
          >
            {/* Header */}
            <div className="border-b border-slate-200 pb-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-blue-700 uppercase tracking-wider">
                    {app.applicationNumber}
                  </span>
                  <span className={`px-2.5 py-0.5 rounded-full border text-xs font-bold ${formatStatus(app.status)}`}>
                    {app.status}
                  </span>
                  <span className={`px-2.5 py-0.5 rounded-full border text-xs font-bold ${formatSeverity(app.riskTier)}`}>
                    {app.riskTier} Risk Tier
                  </span>
                </div>
                <h2 className="text-2xl font-bold text-slate-900 mt-2">
                  {app.institutionName}
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  {institution?.address} • Established: {institution?.establishedYear} • AICTE ID: {institution?.aicteId}
                </p>
              </div>

              <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200 text-center">
                <div>
                  <div className="text-[10px] uppercase font-bold text-slate-500">Readiness Score</div>
                  <div className="text-2xl font-black font-mono text-blue-900">{app.readinessScore}/100</div>
                </div>
                <div className="w-px h-8 bg-slate-200" />
                <div>
                  <div className="text-[10px] uppercase font-bold text-slate-500">Linkage Risk</div>
                  <div className="text-2xl font-black font-mono text-rose-600">{app.linkageRiskScore}%</div>
                </div>
                <div className="w-px h-8 bg-slate-200" />
                <div>
                  <div className="text-[10px] uppercase font-bold text-slate-500">Total Findings</div>
                  <div className="text-2xl font-black font-mono text-amber-700">{findings.length}</div>
                </div>
              </div>
            </div>

            {/* Documented Statutory Readiness Formula Banner (Item 3) */}
            <div className="p-3.5 bg-blue-50/70 border border-blue-200 rounded-xl text-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div>
                <div className="font-bold text-blue-950 flex flex-wrap items-center gap-1.5">
                  <span>Statutory Readiness Formula:</span>
                  <span className="font-mono bg-white px-2 py-0.5 rounded border border-blue-300 text-blue-900 font-bold text-[11px]">
                    Score = max(0, 100 - (25×Crit + 15×High + 8×Med + 3×Low))
                  </span>
                </div>
                <p className="text-[11px] text-blue-800 mt-1">
                  Active Deductions: {breakdown.criticalDeficiencies} Critical (-{breakdown.criticalDeficiencies * 25}), {breakdown.highDeficiencies} High (-{breakdown.highDeficiencies * 15}), {breakdown.mediumDeficiencies} Medium (-{breakdown.mediumDeficiencies * 8}), {breakdown.lowDeficiencies} Low (-{breakdown.lowDeficiencies * 3})
                </p>
              </div>
              <div className="flex items-center gap-2 font-mono text-[11px] whitespace-nowrap self-start md:self-auto">
                <span className="px-2 py-0.5 bg-white rounded border border-slate-200 text-slate-700">
                  {breakdown.passedChecks}/{breakdown.totalChecks} Checks Passed
                </span>
              </div>
            </div>

            {/* Application Overview Definition List */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs">
              <div>
                <span className="font-bold text-slate-500 uppercase block mb-1">Application Type</span>
                <span className="font-semibold text-slate-900">{app.type} (AY {app.academicYear})</span>
              </div>
              <div>
                <span className="font-bold text-slate-500 uppercase block mb-1">Approved Intake</span>
                <span className="font-mono text-slate-900">{app.currentIntake} Seats (Proposed: {app.proposedIntake})</span>
              </div>
              <div>
                <span className="font-bold text-slate-500 uppercase block mb-1">Sponsoring Trust</span>
                <span className="font-semibold text-slate-900">{institution?.trustName || 'N/A'}</span>
              </div>
              <div>
                <span className="font-bold text-slate-500 uppercase block mb-1">Land Area & Survey</span>
                <span className="font-mono text-slate-900">{institution?.landAreaAcres} Acres (Survey No. {institution?.landSurveyNumber})</span>
              </div>
            </div>

            {/* Advisory Findings Stream */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-slate-900 flex items-center justify-between border-b pb-2">
                <span>Advisory Findings Stream ({findings.length})</span>
                <span className="text-xs font-normal text-slate-500">Automated statutory rules & forensic intelligence</span>
              </h3>

              {findings.length === 0 ? (
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-semibold">
                  No automated non-compliance deficiencies or compliance anomalies flagged for this application.
                </div>
              ) : (
                <div className="space-y-4">
                  {findings.map((f: Finding) => (
                    <div key={f.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 space-y-2 text-xs">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-0.5 rounded-sm border text-[10px] font-bold ${formatSeverity(f.severity)}`}>
                            {f.severity}
                          </span>
                          <span className="font-mono font-bold text-slate-700">{f.id}</span>
                          {f.ruleId && <span className="font-mono text-slate-500 bg-slate-200 px-1.5 py-0.5 rounded-sm">{f.ruleId}</span>}
                          <span className="px-1.5 py-0.5 bg-blue-50 text-blue-700 font-semibold rounded-sm text-[10px] border border-blue-200">
                            {f.category}
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-slate-500 font-mono">Confidence: {(f.confidence * 100).toFixed(0)}%</span>
                          <span className="px-2 py-0.5 bg-slate-200 text-slate-700 font-bold rounded-sm text-[10px]">
                            {f.status}
                          </span>
                        </div>
                      </div>

                      <h4 className="font-bold text-sm text-slate-900">{maskPII(f.title)}</h4>
                      <p className="text-slate-700 leading-relaxed">{maskPII(f.explanation)}</p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pt-2 border-t border-slate-200 text-[11px]">
                        <div>
                          <strong className="text-slate-600 block">Evidence Locator:</strong>
                          <span className="font-mono text-indigo-700">{maskPII(f.evidenceLocator)}</span>
                        </div>
                        <div>
                          <strong className="text-slate-600 block">Recommended Action:</strong>
                          <span className="text-slate-800">{maskPII(f.recommendedAction)}</span>
                        </div>
                      </div>

                      {f.officerNotes && (
                        <div className="mt-2 p-2 bg-amber-50 border border-amber-200 rounded-md text-[11px] text-amber-900">
                          <strong>Officer Annotation ({f.reviewedBy || 'Reviewer'}):</strong> {f.officerNotes}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Documents & Verification Passports */}
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-slate-900 border-b pb-2">
                Statutory Documents & Verification Passports ({documents.length})
              </h3>

              <div className="space-y-6">
                {documents.map((doc: DocumentRecord) => {
                  return (
                    <div key={doc.id} className="border border-slate-200 rounded-xl p-5 bg-white space-y-4">
                      {/* Document Overview */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm text-slate-900">{doc.title}</span>
                            <span className="text-xs px-2 py-0.5 rounded-md bg-slate-100 font-semibold text-slate-700">
                              {doc.documentType}
                            </span>
                          </div>
                          <div className="font-mono text-xs text-slate-500 mt-1">
                            Filename: {doc.fileName} • Size: {(doc.fileSize / 1024).toFixed(1)} KB
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className={`px-2.5 py-1 rounded-full border text-xs font-bold ${formatStatus(doc.verificationStatus)}`}>
                            {doc.verificationStatus}
                          </span>
                        </div>
                      </div>

                      {/* Cryptographic Passport & Forensic Metadata */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl text-xs">
                        <div className="space-y-1.5">
                          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                            Cryptographic Verification Passport
                          </div>
                          <div>
                            <span className="text-slate-500 block">SHA-256 Hash Digest:</span>
                            <span className="font-mono text-[11px] text-slate-800 break-all bg-white px-2 py-1 rounded border border-slate-200 block">
                              {doc.sha256Hash}
                            </span>
                          </div>
                          <div>
                            <span className="text-slate-500">Registry Source:</span>{' '}
                            <span className="font-semibold text-slate-800">{doc.verificationSource || 'Internal Validation'}</span>
                          </div>
                          <div>
                            <span className="text-slate-500">Uploaded By:</span>{' '}
                            <span className="font-medium text-slate-800">{doc.versions[0]?.uploadedBy || 'Applicant'} on {new Date(doc.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                            Forensic Engine Analysis
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-[11px]">
                            <div>
                              <span className="text-slate-500">Page Count:</span>{' '}
                              <span className="font-semibold text-slate-800">{doc.forensicMetadata.pageCount}</span>
                            </div>
                            <div>
                              <span className="text-slate-500">Tampering Score:</span>{' '}
                              <span className={`font-mono font-bold ${doc.forensicMetadata.tamperingConfidence > 0.5 ? 'text-rose-600' : 'text-emerald-700'}`}>
                                {(doc.forensicMetadata.tamperingConfidence * 100).toFixed(0)}%
                              </span>
                            </div>
                            <div>
                              <span className="text-slate-500">Incremental Saves:</span>{' '}
                              <span className="font-semibold text-slate-800">{doc.forensicMetadata.incrementalSavesDetected ? 'DETECTED' : 'None'}</span>
                            </div>
                            <div>
                              <span className="text-slate-500">Metadata Anomaly:</span>{' '}
                              <span className="font-semibold text-slate-800">{doc.forensicMetadata.metadataAnomalyDetected ? 'DETECTED' : 'Clean'}</span>
                            </div>
                          </div>
                          {doc.forensicMetadata.pdfProducer && (
                            <div className="text-[11px]">
                              <span className="text-slate-500">PDF Producer:</span>{' '}
                              <span className="font-mono text-slate-700">{doc.forensicMetadata.pdfProducer}</span>
                            </div>
                          )}
                          {doc.forensicMetadata.anomalyIndicators.length > 0 && (
                            <div className="text-[11px] text-rose-700 bg-rose-50 p-1.5 rounded border border-rose-200">
                              <strong>Flags:</strong> {doc.forensicMetadata.anomalyIndicators.join('; ')}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Verification Passport Attempts */}
                      {(() => {
                        const attempts = DataStore.getVerificationAttempts(doc.id);
                        return (
                          <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/50 space-y-3">
                            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                              <div>
                                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                                  Verification Passport History ({attempts.length} {attempts.length === 1 ? 'Attempt' : 'Attempts'})
                                </h4>
                                <p className="text-[11px] text-slate-500">
                                  Cryptographic verification log with external state registries (simulated).
                                </p>
                              </div>
                              <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-white border border-slate-300 text-slate-700">
                                Protocol: Fail-Closed
                              </span>
                            </div>

                            <div className="overflow-x-auto">
                              <table className="w-full text-left text-xs border-collapse bg-white rounded-lg border border-slate-200 overflow-hidden">
                                <thead>
                                  <tr className="bg-slate-100 text-slate-700 border-b font-semibold text-[11px]">
                                    <th className="p-2">Timestamp (UTC)</th>
                                    <th className="p-2">Adapter Used</th>
                                    <th className="p-2">Request / Response Summary</th>
                                    <th className="p-2">Latency</th>
                                    <th className="p-2">Resulting Status</th>
                                    <th className="p-2">Officer Review Status</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 text-[11px]">
                                  {attempts.map((att, idx) => (
                                    <tr key={idx} className="hover:bg-slate-50/80">
                                      <td className="p-2 font-mono text-slate-600 whitespace-nowrap">
                                        {new Date(att.attemptTimestamp).toISOString().replace('T', ' ').substring(0, 19)}
                                      </td>
                                      <td className="p-2 font-medium text-slate-900">
                                        {att.adapterName}
                                      </td>
                                      <td className="p-2 max-w-xs">
                                        <div className="font-mono text-[10px] text-slate-500 truncate" title={att.requestSummary}>
                                          {att.requestSummary || 'Payload submitted to registry'}
                                        </div>
                                        <div className={`font-semibold ${att.responseStatus === 'Source Unavailable' || att.responseStatus === 'Timeout / Degraded' ? 'text-amber-700' : att.responseStatus === 'Mismatch' ? 'text-rose-700' : 'text-slate-700'}`}>
                                          {att.responseSummary || JSON.stringify(att.rawResponse)}
                                        </div>
                                      </td>
                                      <td className="p-2 font-mono">
                                        <span className={`px-1.5 py-0.5 rounded font-bold ${att.latencyMs && att.latencyMs > 2000 ? 'bg-amber-100 text-amber-900 border border-amber-300' : 'bg-slate-100 text-slate-700'}`}>
                                          {att.latencyMs ? `${att.latencyMs}ms` : '280ms'}
                                        </span>
                                      </td>
                                      <td className="p-2">
                                        <span className={`px-2 py-0.5 rounded-full border text-[10px] font-bold ${formatStatus(att.responseStatus === 'Mismatch' ? 'Mismatch Detected' : att.responseStatus)}`}>
                                          {att.responseStatus}
                                        </span>
                                      </td>
                                      <td className="p-2">
                                        <span className="font-medium text-[10px] text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                                          {att.officerReviewStatus || 'Pending Review'}
                                        </span>
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        );
                      })()}

                      {/* Extracted Fields Table */}
                      {doc.extractedFields && doc.extractedFields.length > 0 && (
                        <div>
                          <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                            Extracted Structured Fields ({doc.extractedFields.length})
                          </h4>
                          <div className="overflow-x-auto border border-slate-200 rounded-lg">
                            <table className="w-full text-left text-xs border-collapse">
                              <thead>
                                <tr className="bg-slate-100 text-slate-700 border-b font-semibold">
                                  <th className="p-2">Field Label</th>
                                  <th className="p-2">Field Key</th>
                                  <th className="p-2">Extracted Value</th>
                                  <th className="p-2">Confidence</th>
                                  <th className="p-2">Page</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-200">
                                {doc.extractedFields.map((field) => (
                                  <tr key={field.id} className="hover:bg-slate-50">
                                    <td className="p-2 font-medium text-slate-900">{field.fieldLabel}</td>
                                    <td className="p-2 font-mono text-slate-500">{field.fieldKey}</td>
                                    <td className="p-2 font-mono text-slate-800">
                                      {maskIdentifier(field.fieldValue)}
                                    </td>
                                    <td className="p-2 font-mono text-slate-600">{(field.confidence * 100).toFixed(0)}%</td>
                                    <td className="p-2 text-slate-500">{field.pageNumber || 1}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </article>
        );
      })}
    </section>
  );
}
