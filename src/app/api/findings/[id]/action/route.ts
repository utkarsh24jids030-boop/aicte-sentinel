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
