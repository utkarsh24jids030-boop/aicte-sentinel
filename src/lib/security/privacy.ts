// AICTE Sentinel PII Masking and Data Privacy Engine
// Problem Statement SIH26261 - Smart India Hackathon 2026

/**
 * Mask sensitive identifiers (PAN / identity numbers)
 * Standard PAN pattern: 5 uppercase letters, 4 digits, 1 letter (e.g. ABCDE1234F -> XXXXX1234F)
 * Synthetic demo pattern: DEMOPAN9999X / DEMOP9999X -> XXXXX9999X
 *
 * If unmaskPrivileged is explicitly requested AND actor has OFFICER or AUDITOR role,
 * the raw identifier may be returned. Otherwise, masks by default.
 */
export function maskPII(text: string | null | undefined, userRole?: string, allowUnmask: boolean = false): string {
  if (!text) return '';
  if (typeof text !== 'string') return String(text);

  if (allowUnmask && (userRole === 'OFFICER' || userRole === 'AUDITOR')) {
    return text;
  }

  // Mask synthetic or standard PAN occurrences:
  // e.g. DEMOPAN9999X -> XXXXX9999X
  // e.g. XYZPK9876Q -> XXXXX9876Q
  let masked = text.replace(/\bDEMOPAN([0-9]{4}[A-Z])\b/gi, 'XXXXX$1');
  masked = masked.replace(/\b[A-Z]{5}([0-9]{4}[A-Z])\b/g, 'XXXXX$1');
  
  // Also mask if prefixed with PAN label:
  masked = masked.replace(/PAN:\s*DEMOPAN([0-9]{4}[A-Z])/gi, 'PAN: XXXXX$1');
  masked = masked.replace(/PAN:\s*[A-Z]{5}([0-9]{4}[A-Z])/gi, 'PAN: XXXXX$1');

  return masked;
}

/**
 * Recursively masks PII in objects, arrays, and JSON payloads
 */
export function maskPIIObject<T>(obj: T, userRole?: string, allowUnmask: boolean = false): T {
  if (obj === null || obj === undefined) return obj;

  if (typeof obj === 'string') {
    return maskPII(obj, userRole, allowUnmask) as unknown as T;
  }

  if (Array.isArray(obj)) {
    return obj.map(item => maskPIIObject(item, userRole, allowUnmask)) as unknown as T;
  }

  if (typeof obj === 'object') {
    const copy = { ...(obj as Record<string, unknown>) };
    for (const key of Object.keys(copy)) {
      const val = copy[key];
      if (typeof val === 'string' && (key.toLowerCase().includes('pan') || key.toLowerCase().includes('identity'))) {
        copy[key] = maskPII(val, userRole, allowUnmask);
      } else {
        copy[key] = maskPIIObject(val, userRole, allowUnmask);
      }
    }
    return copy as T;
  }

  return obj;
}

export const maskIdentifier = maskPII;
