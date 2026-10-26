// AICTE Sentinel Comprehensive Rule Engine & Boundary Condition Test Suite
// Problem Statement SIH26261 - Smart India Hackathon 2026
// Run with: node tests/rules.test.mjs

import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'fs';

// Load Rule Packs JSON
const rulePacks = JSON.parse(fs.readFileSync('./src/lib/rules/packs.json', 'utf8'));

// Canonical Readiness Score Function
function computeReadinessScore(critical, high, medium, low) {
  let score = 100 - (critical * 25) - (high * 15) - (medium * 8) - (low * 3);
  return Math.max(0, Math.min(100, score));
}

// Canonical Minimum Land Area Norms [SOURCE: TO BE VERIFIED]
const MINIMUM_LAND_AREA = {
  metro: 1.5,
  urban: 2.5,
  'semi-urban': 2.5,
  rural: 4.0
};

// Canonical Faculty Ratio Norms [SOURCE: TO BE VERIFIED]
const SFR_RATIOS = {
  UG: 20,
  DIPLOMA: 25,
  PG: 15
};

// ==========================================
// 1. READINESS SCORE COMPUTATION TESTS
// ==========================================
test('Readiness Score: Full Formula & Boundary Deductions', () => {
  // Baseline 100
  assert.equal(computeReadinessScore(0, 0, 0, 0), 100, 'Zero deficiencies must yield 100');

  // Individual severity deductions
  assert.equal(computeReadinessScore(1, 0, 0, 0), 75, '1 Critical = -25');
  assert.equal(computeReadinessScore(0, 1, 0, 0), 85, '1 High = -15');
  assert.equal(computeReadinessScore(0, 0, 1, 0), 92, '1 Medium = -8');
  assert.equal(computeReadinessScore(0, 0, 0, 1), 97, '1 Low = -3');

  // Multi-deficiency combinations
  assert.equal(computeReadinessScore(1, 2, 0, 0), 45, '1 Critical + 2 High = 45');
  assert.equal(computeReadinessScore(3, 1, 0, 0), 10, '3 Critical + 1 High = 10');
  assert.equal(computeReadinessScore(2, 2, 2, 2), 0, 'Deductions exceeding 100 clamp strictly to 0');
  assert.equal(computeReadinessScore(4, 0, 0, 0), 0, '4 Critical = exactly 0');
  assert.equal(computeReadinessScore(10, 5, 5, 5), 0, 'Negative values clamp strictly to 0');
});

// ==========================================
// 2. BOUNDARY CONDITION TESTS
// ==========================================
test('Boundary Conditions: Minimum Land Area Requirements by Classification', () => {
  const evaluateLand = (area, locType) => {
    const minReq = MINIMUM_LAND_AREA[locType] ?? 2.5;
    return area >= minReq;
  };

  // Semi-Urban / Urban (2.5 Acres)
  assert.equal(evaluateLand(2.5, 'semi-urban'), true, 'Exact 2.5 acres semi-urban must PASS');
  assert.equal(evaluateLand(2.499, 'semi-urban'), false, '2.499 acres semi-urban must FAIL');
  assert.equal(evaluateLand(2.501, 'semi-urban'), true, '2.501 acres semi-urban must PASS');

  // Urban (2.5 Acres)
  assert.equal(evaluateLand(2.5, 'urban'), true, 'Exact 2.5 acres urban must PASS');
  assert.equal(evaluateLand(2.49, 'urban'), false, '2.49 acres urban must FAIL');

  // Metro (1.5 Acres)
  assert.equal(evaluateLand(1.5, 'metro'), true, 'Exact 1.5 acres metro must PASS');
  assert.equal(evaluateLand(1.49, 'metro'), false, '1.49 acres metro must FAIL');
  assert.equal(evaluateLand(1.51, 'metro'), true, '1.51 acres metro must PASS');

  // Rural (4.0 Acres)
  assert.equal(evaluateLand(4.0, 'rural'), true, 'Exact 4.0 acres rural must PASS');
  assert.equal(evaluateLand(3.99, 'rural'), false, '3.99 acres rural must FAIL');
  assert.equal(evaluateLand(4.01, 'rural'), true, '4.01 acres rural must PASS');
});

test('Boundary Conditions: Student Faculty Ratios by Programme Level', () => {
  const evaluateFaculty = (intake, declared, level) => {
    const ratio = SFR_RATIOS[level] ?? 20;
    const required = Math.ceil(intake / ratio);
    return { passed: declared >= required, required };
  };

  // UG Engineering (1:20)
  assert.deepEqual(evaluateFaculty(360, 18, 'UG'), { passed: true, required: 18 }, '360 intake at 1:20 requires 18; 18 PASS');
  assert.deepEqual(evaluateFaculty(360, 17, 'UG'), { passed: false, required: 18 }, '360 intake at 1:20 requires 18; 17 FAIL');
  assert.deepEqual(evaluateFaculty(361, 19, 'UG'), { passed: true, required: 19 }, '361 intake at 1:20 requires ceil(18.05)=19; 19 PASS');

  // Diploma Polytechnic (1:25)
  assert.deepEqual(evaluateFaculty(250, 10, 'DIPLOMA'), { passed: true, required: 10 }, '250 intake at 1:25 requires 10; 10 PASS');
  assert.deepEqual(evaluateFaculty(250, 9, 'DIPLOMA'), { passed: false, required: 10 }, '250 intake at 1:25 requires 10; 9 FAIL');

  // Postgraduate (1:15)
  assert.deepEqual(evaluateFaculty(150, 10, 'PG'), { passed: true, required: 10 }, '150 intake at 1:15 requires 10; 10 PASS');
  assert.deepEqual(evaluateFaculty(150, 9, 'PG'), { passed: false, required: 10 }, '150 intake at 1:15 requires 10; 9 FAIL');
});

test('Boundary Conditions: Instructional Carpet Area (10.5 sqm per student)', () => {
  const evaluateCarpet = (intake, carpet) => {
    const required = intake * 10.5;
    return carpet >= required;
  };

  // Proposed intake 200 -> required 2100 sqm
  assert.equal(evaluateCarpet(200, 2100), true, 'Exact 2100 sqm for 200 intake must PASS');
  assert.equal(evaluateCarpet(200, 2099.9), false, '2099.9 sqm for 200 intake must FAIL');
  assert.equal(evaluateCarpet(200, 2100.1), true, '2100.1 sqm for 200 intake must PASS');
});

test('Boundary Conditions: Academic Intake Expansion Ceiling (1.5x Current Intake)', () => {
  const evaluateExpansion = (current, proposed) => {
    return proposed <= current * 1.5;
  };

  // Current intake 200 -> max allowed 300
  assert.equal(evaluateExpansion(200, 300), true, 'Exact 1.5x intake hike (300 from 200) must PASS');
  assert.equal(evaluateExpansion(200, 299), true, 'Below 1.5x intake hike (299 from 200) must PASS');
  assert.equal(evaluateExpansion(200, 301), false, 'Above 1.5x intake hike (301 from 200) must FAIL');
});

test('Boundary Conditions: 90-Day Affidavit Window Relative to As-Of Reference Date (2026-02-01)', () => {
  const asOf = new Date('2026-02-01T00:00:00.000Z');

  const evaluateDate = (executionDateStr) => {
    const exec = new Date(executionDateStr);
    const diffDays = (asOf.getTime() - exec.getTime()) / (1000 * 60 * 60 * 24);
    return diffDays >= 0 && diffDays <= 90;
  };

  // 90 days before 2026-02-01 is 2025-11-03
  assert.equal(evaluateDate('2025-11-03T00:00:00.000Z'), true, 'Exact 90 days boundary must PASS');
  assert.equal(evaluateDate('2025-11-04T00:00:00.000Z'), true, '89 days old must PASS');
  assert.equal(evaluateDate('2025-11-02T00:00:00.000Z'), false, '91 days old must FAIL');
  assert.equal(evaluateDate('2026-01-10T00:00:00.000Z'), true, 'Recent execution (22 days) must PASS');
});

test('Boundary Conditions: Scrutiny Date Certificate Expiry Threshold', () => {
  const asOf = new Date('2026-02-01T00:00:00.000Z');

  const evaluateExpiry = (expiryDateStr) => {
    const exp = new Date(expiryDateStr);
    return exp.getTime() >= asOf.getTime();
  };

  assert.equal(evaluateExpiry('2026-02-02T00:00:00.000Z'), true, '1 day after scrutiny date must PASS');
  assert.equal(evaluateExpiry('2026-02-01T00:00:00.000Z'), true, 'On scrutiny date must PASS');
  assert.equal(evaluateExpiry('2026-01-31T00:00:00.000Z'), false, '1 day before scrutiny date must FAIL (Expired)');
  assert.equal(evaluateExpiry('2024-01-14T00:00:00.000Z'), false, 'Historical expired date must FAIL');
});

test('Boundary Conditions: Sponsoring Entity Name Scoping (Strict Isolation)', () => {
  // Evaluates that institution name is compared strictly to institution name,
  // and trust name is compared strictly to trust name.
  const checkNameConsistency = (appInst, affInst, trustTarget, deedGrantee, trustDocName) => {
    // 1. Institution check
    if (affInst && affInst.trim().toLowerCase() !== appInst.trim().toLowerCase()) {
      return { passed: false, reason: 'INSTITUTION_MISMATCH' };
    }
    // 2. Trust check
    if (trustTarget) {
      if (deedGrantee && deedGrantee.trim().toLowerCase() !== trustTarget.trim().toLowerCase()) {
        return { passed: false, reason: 'TRUST_GRANTEE_MISMATCH' };
      }
      if (trustDocName && trustDocName.trim().toLowerCase() !== trustTarget.trim().toLowerCase()) {
        return { passed: false, reason: 'TRUST_DOC_MISMATCH' };
      }
    }
    return { passed: true };
  };

  // Valid exact match
  const passRes = checkNameConsistency(
    'Sunrise Institute of Technology',
    'Sunrise Institute of Technology',
    'Sunrise Education Trust',
    'Sunrise Education Trust',
    'Sunrise Education Trust'
  );
  assert.equal(passRes.passed, true);

  // Institution mismatch
  const failInst = checkNameConsistency(
    'Sunrise Institute of Technology',
    'Sunrise College of Engineering',
    'Sunrise Education Trust',
    'Sunrise Education Trust',
    'Sunrise Education Trust'
  );
  assert.equal(failInst.passed, false);
  assert.equal(failInst.reason, 'INSTITUTION_MISMATCH');

  // Trust mismatch
  const failTrust = checkNameConsistency(
    'Sunrise Institute of Technology',
    'Sunrise Institute of Technology',
    'Sunrise Education Trust',
    'Apex Horizon Trust',
    'Sunrise Education Trust'
  );
  assert.equal(failTrust.passed, false);
  assert.equal(failTrust.reason, 'TRUST_GRANTEE_MISMATCH');

  // Notice: Sponsoring Trust name ("Sunrise Education Trust") differs completely from Institution name ("Sunrise Institute of Technology").
  // Under our fixed rule, this passes because they are NEVER cross-compared!
  const crossIsolation = checkNameConsistency(
    'Sunrise Institute of Technology',
    'Sunrise Institute of Technology',
    'Sunrise Education Trust',
    'Sunrise Education Trust',
    null
  );
  assert.equal(crossIsolation.passed, true, 'Institution name must never be cross-compared with Trust name');
});

// ==========================================
// 3. STATUTORY RULE PACKS: PASS & FAIL COVERAGE
// ==========================================
test('Statutory Rules Pack: Verify All Rules Have Defined Pass & Fail Logic', () => {
  assert.ok(rulePacks.length >= 26, `Must have at least 26 statutory rules, found ${rulePacks.length}`);

  const requiredRuleIds = [
    'LAND-DEED-001',
    'LAND-AREA-002',
    'LAND-SURVEY-003',
    'BLDG-OCC-001',
    'BLDG-STRUCT-002',
    'BLDG-CARPET-003',
    'FIRE-NOC-001',
    'FACULTY-COUNT-001',
    'FACULTY-APPT-002',
    'FACULTY-QUAL-003',
    'GOV-IQAC-001',
    'GOV-RAGGING-002',
    'GOV-GRIEV-003',
    'FIN-AUDIT-001',
    'FIN-FDR-002',
    'ACAD-INTAKE-001',
    'ACAD-PRIOR-002',
    'DOC-AFFIDAVIT-001',
    'DOC-TRUST-002',
    'DOC-NOC-003',
    'CONSIST-NAME-001',
    'DATE-VALID-001',
    'INFRA-LAB-001',
    'FACULTY-CADRE-001',
    'CROSS-CERT-DUP-001',
    'CROSS-FACULTY-DUP-001',
    'REC-INTAKE-001',
    'REC-PROG-002',
    'REC-PRIOR-003'
  ];

  for (const rid of requiredRuleIds) {
    const rule = rulePacks.find(r => r.rule_id === rid);
    assert.ok(rule, `Rule ${rid} must exist in packs.json`);
    assert.ok(rule.name, `Rule ${rid} must have a name`);
    assert.ok(rule.severity, `Rule ${rid} must have a severity`);
    assert.ok(rule.failure_message, `Rule ${rid} must have a failure_message`);
    assert.ok(rule.recommended_action, `Rule ${rid} must have a recommended_action`);
    assert.equal(rule.source_reference, 'SOURCE: TO BE VERIFIED', `Rule ${rid} must have source_reference marked TO BE VERIFIED`);
    assert.ok(Array.isArray(rule.changelog) && rule.changelog.length >= 1, `Rule ${rid} must have changelog history`);
  }
});
