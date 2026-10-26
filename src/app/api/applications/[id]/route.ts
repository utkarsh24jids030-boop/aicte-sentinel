import { NextResponse } from 'next/server';
import { DataStore } from '@/lib/store';
import { RulesEngine } from '@/lib/rules/engine';
import { maskPIIObject } from '@/lib/security/privacy';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const app = DataStore.getApplicationById(id);
  if (!app) {
    return NextResponse.json({ error: 'Application not found' }, { status: 404 });
  }

  const documents = DataStore.getDocuments(id);
  const findings = DataStore.getFindings(id);
  const { breakdown } = RulesEngine.evaluateApplication(app, documents);

  return NextResponse.json({
    application: app,
    documents: maskPIIObject(documents),
    findings: maskPIIObject(findings),
    readiness: breakdown
  });
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const updated = DataStore.updateApplication(id, body);
    if (!updated) {
      return NextResponse.json({ error: 'Application not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, application: updated });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}
