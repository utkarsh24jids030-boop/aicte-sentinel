import { NextResponse } from 'next/server';
import { DataStore } from '@/lib/store';

export async function POST() {
  try {
    DataStore.resetDemoData();
    return NextResponse.json({
      success: true,
      message: 'Demo data and cryptographic audit trail reset to baseline initial state.'
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Unknown reset error';
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}
