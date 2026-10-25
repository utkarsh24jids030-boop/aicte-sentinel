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
