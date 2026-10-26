import { NextResponse } from 'next/server';
import { DataStore } from '@/lib/store';
import { AuditTrailEngine } from '@/lib/audit/trail';
import { computeReportSeal, verifyReportSeal } from '@/lib/security/reportSeal';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { applicationId, claimedSeal } = body;

    if (!applicationId) {
      return NextResponse.json({ error: 'applicationId is required' }, { status: 400 });
    }

    const app = DataStore.getApplicationById(applicationId);
    if (!app) {
      return NextResponse.json({ error: 'Application not found' }, { status: 404 });
    }

    const reportId = `REP-SCRUTINY-2026-${app.id.toUpperCase()}`;
    const headHash = AuditTrailEngine.getHeadHash();
    
    // Derive standard recommendation code based on readiness and findings
    const findings = DataStore.getFindings(app.id);
    let recommendation = 'CONSIDER_EVC_INSPECTION';
    if (app.riskTier === 'Critical' || (app.linkageRiskScore && app.linkageRiskScore >= 80)) {
      recommendation = 'CONSIDER_VIGILANCE_REFERRAL';
    } else if (app.readinessScore >= 70 && findings.length === 0) {
      recommendation = 'CONSIDER_APPROVAL';
    }

    const computedSeal = computeReportSeal(reportId, app.id, app.readinessScore, recommendation, headHash);

    if (claimedSeal) {
      const verification = verifyReportSeal(reportId, app.id, app.readinessScore, recommendation, headHash, claimedSeal);
      return NextResponse.json({
        success: true,
        reportId,
        recommendation,
        ...verification
      });
    }

    return NextResponse.json({
      success: true,
      reportId,
      applicationId: app.id,
      recommendation,
      readinessScore: app.readinessScore,
      chainHeadHash: headHash,
      seal: computedSeal
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Unknown seal verification error';
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}
