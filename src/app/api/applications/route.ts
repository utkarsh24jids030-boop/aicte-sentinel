import { NextResponse } from 'next/server';
import { DataStore } from '@/lib/store';
import { RulesEngine } from '@/lib/rules/engine';
import { Application } from '@/types';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const institutionId = searchParams.get('institutionId');

  let apps = DataStore.getApplications();
  if (institutionId) {
    apps = apps.filter(a => a.institutionId === institutionId);
  }

  return NextResponse.json({ applications: apps });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { institutionId, type, programmes, currentIntake, proposedIntake } = body;

    const institution = DataStore.getInstitutionById(institutionId) || DataStore.getInstitutions()[0];
    const appNumber = `AICTE/2026/${institution.name.substring(0, 3).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const newApp: Application = {
      id: `app-${Date.now()}`,
      applicationNumber: appNumber,
      institutionId: institution.id,
      institutionName: institution.name,
      type: type || 'EoA',
      academicYear: '2026-2027',
      status: 'Draft',
      readinessScore: 10,
      linkageRiskScore: 0,
      collusionRiskScore: 0,
      riskTier: 'Low',
      programmes: programmes || ['Computer Science & Engg (120)', 'Electronics & Comm (60)'],
      currentIntake: currentIntake || 180,
      proposedIntake: proposedIntake || 180,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const created = DataStore.createApplication(newApp);
    return NextResponse.json({ success: true, application: created });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}
