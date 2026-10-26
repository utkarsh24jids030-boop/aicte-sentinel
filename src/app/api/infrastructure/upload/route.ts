import { NextRequest, NextResponse } from 'next/server';
import { DataStore } from '@/lib/store';
import { analyzeInfrastructureEvidence } from '@/lib/forensics/imageAnalysis';
import { InfrastructureCategory, InfrastructureEvidence } from '@/types';
import crypto from 'crypto';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const applicationId = searchParams.get('applicationId');
    const evidence = DataStore.getInfrastructureEvidence(applicationId || undefined);
    return NextResponse.json({ success: true, count: evidence.length, data: evidence });
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      applicationId,
      institutionId = 'inst-generic',
      category,
      title,
      evidenceType = 'PHOTOGRAPH',
      fileName,
      declaredAreaSqm,
      planExtractedAreaSqm
    } = body;

    if (!applicationId || !category || !fileName || !declaredAreaSqm) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: applicationId, category, fileName, declaredAreaSqm' },
        { status: 400 }
      );
    }

    const existingEvidence = DataStore.getInfrastructureEvidence();

    const { checks, advisoryRecommendation, advisoryReason } = analyzeInfrastructureEvidence({
      fileName,
      declaredAreaSqm: Number(declaredAreaSqm),
      planExtractedAreaSqm: planExtractedAreaSqm ? Number(planExtractedAreaSqm) : undefined,
      category: category as InfrastructureCategory,
      applicationId,
      existingEvidence
    });

    const newEvidence: InfrastructureEvidence = {
      id: `infra-${Date.now().toString(36)}`,
      applicationId,
      institutionId,
      category: category as InfrastructureCategory,
      title: title || `${category} Evidence`,
      evidenceType,
      fileName,
      filePath: `/uploads/${applicationId}/${fileName}`,
      fileSize: 1024 * 1024 * 2.5, // simulated 2.5 MB
      mimeType: fileName.endsWith('.png') ? 'image/png' : 'image/jpeg',
      sha256Hash: crypto.createHash('sha256').update(`${fileName}-${Date.now()}`).digest('hex'),
      declaredAreaSqm: Number(declaredAreaSqm),
      uploadedAt: new Date().toISOString(),
      checks,
      advisoryRecommendation,
      advisoryReason
    };

    DataStore.addInfrastructureEvidence(newEvidence);

    return NextResponse.json({
      success: true,
      message: 'Infrastructure evidence processed and registered with honest automated checks.',
      data: newEvidence
    }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}
