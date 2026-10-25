// Statutory Land and Faculty Norms Configuration
// AICTE Sentinel Regulatory Engine (Problem Statement SIH26261)
//
// GROUND RULE SAFEGUARD:
// All regulatory thresholds and baselines that await official gazette verification
// must be explicitly tagged "[SOURCE: TO BE VERIFIED]".
// Real statutory values must be reconciled against the official AICTE Approval Process Handbook (APH)
// before production deployment.

export type LocationType = 'metro' | 'urban' | 'semi-urban' | 'rural';

/**
 * Minimum Land Area Requirement by Location Classification (in Acres)
 * [SOURCE: TO BE VERIFIED]
 * Refer to AICTE Approval Process Handbook (Land Norms chapter) for official baseline acreage.
 */
export const MINIMUM_LAND_AREA_ACRES: Record<LocationType, number> = {
  metro: 1.5,        // [SOURCE: TO BE VERIFIED] (Megacities / Tier 1 Urban Agglomerations)
  urban: 2.5,        // [SOURCE: TO BE VERIFIED] (State Capitals / Tier 2 Cities)
  'semi-urban': 2.5,  // [SOURCE: TO BE VERIFIED] (District Headquarters / Town Municipalities)
  rural: 4.0         // [SOURCE: TO BE VERIFIED] (Non-urban / Gram Panchayat jurisdictions)
};

export const MINIMUM_LAND_AREA_SOURCE = 'SOURCE: TO BE VERIFIED';

/**
 * Helper to resolve the minimum required contiguous land area for a given location type
 */
export function getMinimumLandArea(locationType: LocationType = 'semi-urban'): number {
  return MINIMUM_LAND_AREA_ACRES[locationType] ?? 2.5;
}

export type ProgrammeLevel = 'UG' | 'PG' | 'DIPLOMA';

/**
 * Statutory Student-Faculty Ratio (SFR) by Programme Level
 * [SOURCE: TO BE VERIFIED]
 * Refer to AICTE Approval Process Handbook (Faculty Norms chapter / Cadre Ratio).
 */
export const STUDENT_FACULTY_RATIOS: Record<ProgrammeLevel, number> = {
  UG: 20,       // 1:20 [SOURCE: TO BE VERIFIED] (Undergraduate Engineering / Tech)
  DIPLOMA: 25,  // 1:25 [SOURCE: TO BE VERIFIED] (Diploma / Polytechnic programmes)
  PG: 15        // 1:15 [SOURCE: TO BE VERIFIED] (Postgraduate Engineering / MBA / MCA)
};

/**
 * Basis for Faculty Calculation:
 * - 'ANNUAL_INTAKE': Applied to approved annual intake capacity for new intake / expansion.
 * - 'TOTAL_ENROLMENT_ALL_YEARS': Applied across all enrolled cohorts (intake * duration in years).
 * Default value: 'ANNUAL_INTAKE' [SOURCE: TO BE VERIFIED]
 */
export type FacultyCalculationBasis = 'ANNUAL_INTAKE' | 'TOTAL_ENROLMENT_ALL_YEARS';

export const FACULTY_CALCULATION_BASIS: FacultyCalculationBasis = 'ANNUAL_INTAKE'; // [SOURCE: TO BE VERIFIED]

export const PROGRAMME_DURATION_YEARS: Record<ProgrammeLevel, number> = {
  UG: 4,       // 4 years [SOURCE: TO BE VERIFIED]
  DIPLOMA: 3,  // 3 years [SOURCE: TO BE VERIFIED]
  PG: 2        // 2 years [SOURCE: TO BE VERIFIED]
};

export function resolveProgrammeLevel(programmes?: string[]): ProgrammeLevel {
  if (!programmes || programmes.length === 0) return 'UG';
  const text = programmes.join(' ').toLowerCase();
  if (text.includes('diploma') || text.includes('polytechnic')) return 'DIPLOMA';
  if (text.includes('pg') || text.includes('m.tech') || text.includes('mba') || text.includes('mca')) return 'PG';
  return 'UG';
}

export function computeRequiredFaculty(
  intake: number,
  level: ProgrammeLevel = 'UG',
  basis: FacultyCalculationBasis = FACULTY_CALCULATION_BASIS
): { requiredFaculty: number; studentBase: number; ratio: number; basisDescription: string } {
  const ratio = STUDENT_FACULTY_RATIOS[level] ?? 20;
  const duration = PROGRAMME_DURATION_YEARS[level] ?? 4;
  const studentBase = basis === 'TOTAL_ENROLMENT_ALL_YEARS' ? intake * duration : intake;
  const requiredFaculty = Math.ceil(studentBase / ratio);
  const basisDescription = basis === 'ANNUAL_INTAKE'
    ? `annual intake of ${intake}`
    : `total multi-year enrolment of ${studentBase} (${intake} x ${duration} yrs)`;

  return { requiredFaculty, studentBase, ratio, basisDescription };
}

