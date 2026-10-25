import { NextResponse } from 'next/server';
import { CollusionRadarEngine } from '@/lib/radar/graph';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const institution = searchParams.get('institution');

  if (institution) {
    const data = CollusionRadarEngine.getRadarForInstitution(institution);
    return NextResponse.json(data);
  }

  const allData = CollusionRadarEngine.getGraphData();
  return NextResponse.json(allData);
}
