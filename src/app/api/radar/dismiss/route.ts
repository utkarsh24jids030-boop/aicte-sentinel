import { NextResponse } from 'next/server';
import { LinkageRadarEngine } from '@/lib/radar/graph';
import { maskPIIObject } from '@/lib/security/privacy';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { edgeId, reason, officerId, officerName } = body;

    if (!edgeId || typeof edgeId !== 'string') {
      return NextResponse.json(
        { error: 'Edge ID is required.' },
        { status: 400 }
      );
    }

    if (!reason || typeof reason !== 'string' || reason.trim().length === 0) {
      return NextResponse.json(
        { error: 'A regulatory justification reason is required to dismiss a linkage.' },
        { status: 400 }
      );
    }

    const result = LinkageRadarEngine.dismissEdge({
      edgeId,
      reason,
      officerId: officerId || 'officer-01',
      officerName: officerName || 'Rajesh Sharma (Scrutiny Officer)'
    });

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Failed to dismiss linkage edge.' },
        { status: 400 }
      );
    }

    return NextResponse.json(maskPIIObject({
      success: true,
      edge: result.edge,
      event: result.event
    }));
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error processing linkage dismissal.' },
      { status: 500 }
    );
  }
}
