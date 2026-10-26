import { NextResponse } from 'next/server';
import { DataStore } from '@/lib/store';
import { Finding } from '@/types';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { status, officerNotes, officerName } = body;

    // Statutory Safeguard Enforcement (Item 9):
    // No adverse regulatory action is taken without human review. Officer actions that record an adverse outcome
    // strictly require a written justification and an identifiable named officer.
    const isAdverse = status === 'Confirmed by Officer' || status === 'Escalated for EVC';
    if (isAdverse) {
      if (!officerNotes || !officerNotes.trim()) {
        return NextResponse.json(
          { error: 'Statutory Safeguard Violation: Adverse regulatory actions (Confirmed by Officer / Escalated for EVC) strictly require a written justification.' },
          { status: 400 }
        );
      }
      if (!officerName || !officerName.trim()) {
        return NextResponse.json(
          { error: 'Statutory Safeguard Violation: Adverse regulatory actions strictly require an identifiable named officer.' },
          { status: 400 }
        );
      }
    }

    const updated = DataStore.updateFindingStatus(id, status as Finding['status'], officerNotes, officerName);
    if (!updated) {
      return NextResponse.json({ error: 'Finding not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, finding: updated });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}
