import { NextResponse } from 'next/server';
import { LinkageRadarEngine } from '@/lib/radar/graph';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const institution = searchParams.get('institution');

  if (institution) {
    const data = LinkageRadarEngine.getRadarForInstitution(institution);
    return NextResponse.json(data);
  }

  const allData = LinkageRadarEngine.getGraphData();
  return NextResponse.json(allData);
}
