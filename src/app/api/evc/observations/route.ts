import { NextResponse } from 'next/server';
import { DataStore } from '@/lib/store';
import { EvcCopilotEngine } from '@/lib/evc/copilot';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { taskId, category, claimText, physicalVerificationStatus, observationNotes, photoUrls, latitude, longitude } = body;

    const obs = EvcCopilotEngine.recordObservation({
      taskId,
      category,
      claimText,
      physicalVerificationStatus,
      observationNotes,
      photoUrls,
      latitude,
      longitude
    });

    const success = DataStore.addInspectionObservation(taskId, obs);
    if (!success) {
      return NextResponse.json({ error: 'Inspection task not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, observation: obs });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}
