// AICTE Sentinel Synthetic Dataset Generator
// Generates at least 100 synthetic applications with labelled seeded defects using a fixed PRNG seed.
// Run with: npx tsx scripts/generate-synthetic-dataset.ts

import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

export interface SeededDefect {
  defectType: 
    | 'LAND_AREA_DEFICIT'
    | 'EXPIRED_FIRE_NOC'
    | 'FACULTY_DEFICIT'
    | 'CARPET_AREA_DEFICIT'
    | 'DUPLICATE_DOCUMENT'
    | 'SHARED_LAND_PARCEL'
    | 'REUSED_FACULTY';
  severity: 'Critical' | 'High' | 'Medium';
  description: string;
  expectedRuleId: string;
}

export interface SyntheticApplicationRecord {
  id: string;
  applicationNumber: string;
  institutionId: string;
  institutionName: string;
  applicationType: 'EoA' | 'New_Institution' | 'Intake_Increase' | 'Closure';
  academicYear: string;
  state: string;
  declaredLandAcres: number;
  requiredLandAcres: number;
  studentIntake: number;
  facultyCount: number;
  instructionalCarpetAreaSqm: number;
  fireNocExpiryDate: string;
  seededDefects: SeededDefect[];
  isDeficient: boolean;
  hasDuplicateCert: boolean;
  hasOverlappingLand: boolean;
  hasReusedFaculty: boolean;
  documentSha256Hashes: Record<string, string>;
}

export interface SyntheticDataset {
  metadata: {
    datasetName: string;
    isSynthetic: boolean;
    seed: number;
    generationDate: string;
    totalApplications: number;
    cleanCount: number;
    deficientCount: number;
  };
  applications: SyntheticApplicationRecord[];
}

// Deterministic Pseudo-Random Number Generator (Mulberry32)
function createPrng(seed: number) {
  let s = seed >>> 0;
  return function() {
    s = (s + 0x6D2B79F5) >>> 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const FIXED_SEED = 20260201;
const prng = createPrng(FIXED_SEED);

const STATES = ['Karnataka', 'Maharashtra', 'Tamil Nadu', 'Telangana', 'Uttar Pradesh', 'Gujarat', 'Rajasthan', 'Kerala'];
const APP_TYPES: ('EoA' | 'New_Institution' | 'Intake_Increase' | 'Closure')[] = [
  'EoA', 'EoA', 'New_Institution', 'Intake_Increase', 'EoA'
];

const INSTITUTION_PREFIXES = [
  'Apex', 'Sunrise', 'Nova', 'Horizon', 'Vanguard', 'Zenith', 'Heritage', 'Pinnacle',
  'Imperial', 'Silicon', 'Beacon', 'Radiant', 'Starlight', 'Olympus', 'Galaxy'
];

const INSTITUTION_SUFFIXES = [
  'Institute of Technology', 'College of Engineering', 'Polytechnic Institute', 'Institute of Higher Learning',
  'Technical University Campus', 'School of Computing & Engineering'
];

export function generateSyntheticDataset(count: number = 120): SyntheticDataset {
  const applications: SyntheticApplicationRecord[] = [];
  let cleanCount = 0;
  let deficientCount = 0;

  // Shared entity pools to simulate cross-application linkages
  const sharedSurveyNumber = '289/1A';
  const sharedDuplicateCertHash = 'a4b4baef10c2ce4e86d71eb867a0d746f5990796a1a48d9881b3c3a5317ec47b'; // Western Horizon original

  for (let i = 1; i <= count; i++) {
    const id = `app-eval-${String(i).padStart(3, '0')}`;
    const appNum = `AICTE/2026/SYN-${1000 + i}`;
    const prefix = INSTITUTION_PREFIXES[Math.floor(prng() * INSTITUTION_PREFIXES.length)];
    const suffix = INSTITUTION_SUFFIXES[Math.floor(prng() * INSTITUTION_SUFFIXES.length)];
    const instName = `${prefix} ${suffix} (${i})`;
    const instId = `inst-eval-${String(i).padStart(3, '0')}`;
    const appType = APP_TYPES[Math.floor(prng() * APP_TYPES.length)];
    const state = STATES[Math.floor(prng() * STATES.length)];

    // Standard baseline compliant attributes
    let declaredLand = Number((2.5 + prng() * 4.0).toFixed(2));
    const requiredLand = appType === 'New_Institution' ? 2.5 : 1.5;
    const intake = (Math.floor(prng() * 6) + 3) * 60; // 180 to 480 students
    let faculty = Math.ceil(intake / 15) + Math.floor(prng() * 4); // Compliant 1:15 ratio + buffer
    let carpetArea = Math.ceil(intake * 11.5); // Compliant > 10.5 sqm/student
    let fireExpiry = '2027-01-15'; // Compliant future expiry

    const seededDefects: SeededDefect[] = [];
    let hasDuplicateCert = false;
    let hasOverlappingLand = false;
    let hasReusedFaculty = false;

    // Determine defect assignment using deterministic probability buckets
    const roll = prng();

    if (roll < 0.40) {
      // 40% Completely clean compliant applications
      cleanCount++;
    } else {
      // 60% Seeded with realistic regulatory defects
      deficientCount++;

      if (roll < 0.52) {
        // Land area deficit
        declaredLand = Number((requiredLand - (0.3 + prng() * 0.8)).toFixed(2));
        seededDefects.push({
          defectType: 'LAND_AREA_DEFICIT',
          severity: 'Critical',
          description: `Declared land (${declaredLand} acres) below statutory minimum (${requiredLand} acres).`,
          expectedRuleId: 'LAND-MIN-001'
        });
      } else if (roll < 0.64) {
        // Expired fire safety certificate
        fireExpiry = '2024-01-14'; // Past date relative to 2026-02-01 anchor
        seededDefects.push({
          defectType: 'EXPIRED_FIRE_NOC',
          severity: 'Critical',
          description: 'Fire safety certificate expired on 2024-01-14.',
          expectedRuleId: 'FIRE-NOC-001'
        });
      } else if (roll < 0.74) {
        // Faculty cadre deficit
        faculty = Math.floor(intake / 25); // Severe deficit (1:25 instead of 1:15/1:20)
        seededDefects.push({
          defectType: 'FACULTY_DEFICIT',
          severity: 'Critical',
          description: `Faculty count (${faculty}) insufficient for intake (${intake}).`,
          expectedRuleId: 'FACULTY-CADRE-001'
        });
      } else if (roll < 0.82) {
        // Instructional carpet area deficit
        carpetArea = Math.floor(intake * 8.0); // Deficit (< 10.5 sqm)
        seededDefects.push({
          defectType: 'CARPET_AREA_DEFICIT',
          severity: 'High',
          description: `Carpet area (${carpetArea} sqm) below 10.5 sqm/student requirement.`,
          expectedRuleId: 'INFRA-CARPET-001'
        });
      } else if (roll < 0.88) {
        // Duplicate certificate recycled from prior approval
        hasDuplicateCert = true;
        seededDefects.push({
          defectType: 'DUPLICATE_DOCUMENT',
          severity: 'Critical',
          description: 'Occupancy certificate matches identical hash of archived certificate.',
          expectedRuleId: 'CROSS-CERT-DUP-001'
        });
      } else if (roll < 0.94) {
        // Overlapping land survey parcel
        hasOverlappingLand = true;
        seededDefects.push({
          defectType: 'SHARED_LAND_PARCEL',
          severity: 'Critical',
          description: `Simultaneous partition claim on shared cadastral survey ${sharedSurveyNumber}.`,
          expectedRuleId: 'CROSS-LAND-SHARED-001'
        });
      } else {
        // Reused faculty member declared across campuses
        hasReusedFaculty = true;
        seededDefects.push({
          defectType: 'REUSED_FACULTY',
          severity: 'Critical',
          description: 'Faculty PAN declared simultaneously across distinct institutions.',
          expectedRuleId: 'CROSS-FACULTY-DUP-001'
        });
      }
    }

    const docHashes: Record<string, string> = {
      landDeed: crypto.createHash('sha256').update(`LAND_${id}_${declaredLand}`).digest('hex'),
      fireNoc: crypto.createHash('sha256').update(`FIRE_${id}_${fireExpiry}`).digest('hex'),
      buildingPlan: crypto.createHash('sha256').update(`PLAN_${id}_${carpetArea}`).digest('hex'),
      occupancyCert: hasDuplicateCert
        ? sharedDuplicateCertHash
        : crypto.createHash('sha256').update(`OCC_${id}`).digest('hex')
    };

    applications.push({
      id,
      applicationNumber: appNum,
      institutionId: instId,
      institutionName: instName,
      applicationType: appType,
      academicYear: '2026-27',
      state,
      declaredLandAcres: declaredLand,
      requiredLandAcres: requiredLand,
      studentIntake: intake,
      facultyCount: faculty,
      instructionalCarpetAreaSqm: carpetArea,
      fireNocExpiryDate: fireExpiry,
      seededDefects,
      isDeficient: seededDefects.length > 0,
      hasDuplicateCert,
      hasOverlappingLand,
      hasReusedFaculty,
      documentSha256Hashes: docHashes
    });
  }

  return {
    metadata: {
      datasetName: 'Synthetic Scrutiny Regulatory Benchmark Dataset',
      isSynthetic: true,
      seed: FIXED_SEED,
      generationDate: '2026-02-01',
      totalApplications: count,
      cleanCount,
      deficientCount
    },
    applications
  };
}

// Self-executing script entrypoint
const outputPath = path.resolve('./public/synthetic-eval-dataset.json');
const dataset = generateSyntheticDataset(120);

fs.writeFileSync(outputPath, JSON.stringify(dataset, null, 2), 'utf8');
console.log(`[DATASET GENERATOR] Generated ${dataset.applications.length} synthetic applications (Seed: ${dataset.metadata.seed}).`);
console.log(`[DATASET GENERATOR] Saved to ${outputPath} (Clean: ${dataset.metadata.cleanCount}, Deficient: ${dataset.metadata.deficientCount}).`);
