import { NextResponse } from 'next/server';
import { LinkageRadarEngine } from '@/lib/radar/graph';
import { maskPIIObject } from '@/lib/security/privacy';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const institution = searchParams.get('institution');

  if (institution) {
    const data = LinkageRadarEngine.getRadarForInstitution(institution);
    return NextResponse.json(maskPIIObject(data));
  }

  const allData = LinkageRadarEngine.getGraphData();
  return NextResponse.json(maskPIIObject(allData));
}
