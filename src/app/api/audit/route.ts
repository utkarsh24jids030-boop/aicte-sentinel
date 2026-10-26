import { NextResponse } from 'next/server';
import { AuditTrailEngine } from '@/lib/audit/trail';

export async function GET() {
  const events = AuditTrailEngine.getEvents(200);
  const accessEvents = AuditTrailEngine.getAccessEvents(100);
  const integrity = AuditTrailEngine.verifyChainIntegrity();

  return NextResponse.json({
    events,
    accessEvents,
    integrity
  });
}
