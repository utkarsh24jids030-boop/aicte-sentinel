// AICTE Sentinel - Prisma Database Seeding Script
// Generates PostgreSQL demo dataset for SIH 2026 Problem Statement SIH26261
// Run with: npx prisma db seed

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('--- Seeding AICTE Sentinel PostgreSQL Database ---');

  // 1. Seed Institutions
  const sunrise = await prisma.institution.upsert({
    where: { aicteId: '1-10928371' },
    update: {},
    create: {
      id: 'inst-sunrise',
      aicteId: '1-10928371',
      name: 'Sunrise Institute of Technology',
      trustName: 'Sunrise Education Trust',
      state: 'Karnataka',
      district: 'Bengaluru Urban',
      address: 'Survey No. 144/2, Sarjapur Outer Ring Road, Bengaluru - 560035',
      landSurveyNumber: '144/2',
      landAreaAcres: 4.85,
      locationType: 'urban',
      contactEmail: 'admissions@sunrise.edu',
      contactPhone: '+91 80 2844 9100',
      establishedYear: 2012,
      status: 'SCRUTINY_PENDING'
    }
  });

  const nova = await prisma.institution.upsert({
    where: { aicteId: '1-28371940' },
    update: {},
    create: {
      id: 'inst-nova',
      aicteId: '1-28371940',
      name: 'Nova Engineering College',
      trustName: 'Nova Horizon Charitable Trust',
      state: 'Maharashtra',
      district: 'Pune',
      address: 'Survey No. 289/1A, Phase-3 Hinjawadi Infotech Park, Pune - 411057',
      landSurveyNumber: '289/1A',
      landAreaAcres: 3.2,
      locationType: 'semi-urban',
      contactEmail: 'contact@novaengg.ac.in',
      contactPhone: '+91 20 6711 4400',
      establishedYear: 2016,
      status: 'DEFICIENT'
    }
  });

  const apex = await prisma.institution.upsert({
    where: { aicteId: '1-94820194' },
    update: {},
    create: {
      id: 'inst-apex',
      aicteId: '1-94820194',
      name: 'Apex Polytechnic College',
      trustName: 'Apex Technical Society',
      state: 'Maharashtra',
      district: 'Pune',
      address: 'Survey No. 289/1A (Plot-B), Hinjawadi Phase-3, Pune - 411057',
      landSurveyNumber: '289/1A',
      landAreaAcres: 2.1,
      locationType: 'semi-urban',
      contactEmail: 'office@apexpolytechnic.edu.in',
      contactPhone: '+91 20 8920 1199',
      establishedYear: 2025,
      status: 'DEFICIENT'
    }
  });

  // 2. Seed Demo Users
  await prisma.user.upsert({
    where: { email: 'institution@sunrise.edu' },
    update: {},
    create: {
      id: 'user-inst-sunrise',
      email: 'institution@sunrise.edu',
      name: 'Dr. Anand Kumar',
      role: 'INSTITUTION',
      designation: 'Principal & Authorized Representative',
      institutionId: sunrise.id
    }
  });

  await prisma.user.upsert({
    where: { email: 'officer@aicte-india.org' },
    update: {},
    create: {
      id: 'user-officer-rao',
      email: 'officer@aicte-india.org',
      name: 'Smt. Priyadarshini Rao',
      role: 'OFFICER',
      designation: 'Senior Scrutiny Officer (Bureau of Approvals)'
    }
  });

  await prisma.user.upsert({
    where: { email: 'inspector@aicte-evc.gov.in' },
    update: {},
    create: {
      id: 'user-evc-chandran',
      email: 'inspector@aicte-evc.gov.in',
      name: 'Prof. Harish Chandran',
      role: 'EVC_INSPECTOR',
      designation: 'EVC Expert Committee Lead & Senior Assessor'
    }
  });

  await prisma.user.upsert({
    where: { email: 'admin@aicte-india.org' },
    update: {},
    create: {
      id: 'user-admin-singh',
      email: 'admin@aicte-india.org',
      name: 'Vikramaditya Singh',
      role: 'ADMIN',
      designation: 'AICTE Sentinel Lead System Administrator'
    }
  });

  await prisma.user.upsert({
    where: { email: 'auditor@cag.gov.in' },
    update: {},
    create: {
      id: 'user-auditor-sundaram',
      email: 'auditor@cag.gov.in',
      name: 'Meenakshi Sundaram',
      role: 'AUDITOR',
      designation: 'Independent Regulatory & Vigilance Auditor'
    }
  });

  // 3. Seed Applications
  await prisma.application.upsert({
    where: { applicationNumber: 'AICTE/2026/SUN-8812' },
    update: {},
    create: {
      id: 'app-sunrise-001',
      applicationNumber: 'AICTE/2026/SUN-8812',
      institutionId: sunrise.id,
      type: 'EoA',
      academicYear: '2026-2027',
      status: 'Under_Scrutiny',
      readinessScore: 75,
      linkageRiskScore: 15,
      riskTier: 'Medium',
      programmes: JSON.stringify(['Computer Science & Engg (180)', 'Electronics & Comm (120)', 'Mechanical Engg (60)']),
      currentIntake: 360,
      proposedIntake: 360,
      submittedAt: new Date('2026-01-20T11:45:00Z')
    }
  });

  await prisma.application.upsert({
    where: { applicationNumber: 'AICTE/2026/NOV-9014' },
    update: {},
    create: {
      id: 'app-nova-002',
      applicationNumber: 'AICTE/2026/NOV-9014',
      institutionId: nova.id,
      type: 'Intake_Increase',
      academicYear: '2026-2027',
      status: 'Deficiency_Communicated',
      readinessScore: 45,
      linkageRiskScore: 68,
      riskTier: 'High',
      programmes: JSON.stringify(['Computer Science & Engg (240)', 'AI & Data Science (120)', 'Civil Engg (60)']),
      currentIntake: 360,
      proposedIntake: 480,
      submittedAt: new Date('2026-01-22T16:20:00Z')
    }
  });

  await prisma.application.upsert({
    where: { applicationNumber: 'AICTE/2026/APX-1044' },
    update: {},
    create: {
      id: 'app-apex-003',
      applicationNumber: 'AICTE/2026/APX-1044',
      institutionId: apex.id,
      type: 'New_Institution',
      academicYear: '2026-2027',
      status: 'EVC_Inspection_Recommended',
      readinessScore: 25,
      linkageRiskScore: 92,
      riskTier: 'Critical',
      programmes: JSON.stringify(['Diploma in Computer Tech (120)', 'Diploma in Mechanical (60)']),
      currentIntake: 0,
      proposedIntake: 240,
      submittedAt: new Date('2026-01-25T10:15:00Z')
    }
  });

  console.log('✓ Database seeded successfully with 3 institutions and 3 demo scrutiny cases.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
