// AICTE Sentinel Synthetic Sample PDF Generator
// Generates minimal valid PDF files with authentic structure, metadata, and text streams.
// Run with: node scripts/generate-sample-pdfs.mjs

import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

const outputDir = path.resolve('./public/samples');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

function buildMinimalPdf(title, textLines, producer = 'AICTE Sentinel Synthetic Doc Engine') {
  const contentStream = [
    'BT',
    '/F1 12 Tf',
    '50 750 Td',
    `(${title}) Tj`,
    '0 -20 Td',
    ...textLines.map(line => `(${line.replace(/[()\\]/g, '\\$&')}) Tj\n0 -15 Td`),
    'ET'
  ].join('\n');

  const streamLength = Buffer.byteLength(contentStream);

  const objects = [
    // 1: Catalog
    '1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n',
    // 2: Pages
    '2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n',
    // 3: Page
    '3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>\nendobj\n',
    // 4: Contents Stream
    `4 0 obj\n<< /Length ${streamLength} >>\nstream\n${contentStream}\nendstream\nendobj\n`,
    // 5: Font
    '5 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\n',
    // 6: Info
    `6 0 obj\n<< /Title (${title}) /Producer (${producer}) /CreationDate (D:20260115100000Z) >>\nendobj\n`
  ];

  let header = '%PDF-1.4\n';
  let body = '';
  const xref = ['xref\n0 7\n0000000000 65535 f \n'];

  let offset = header.length;
  for (let i = 0; i < objects.length; i++) {
    xref.push(String(offset).padStart(10, '0') + ' 00000 n \n');
    body += objects[i];
    offset = header.length + body.length;
  }

  const xrefOffset = header.length + body.length;
  const trailer = `trailer\n<< /Size 7 /Root 1 0 R /Info 6 0 R >>\nstartxref\n${xrefOffset}\n%%EOF\n`;

  return Buffer.from(header + body + xref.join('') + trailer);
}

const sampleSpecs = [
  {
    fileName: 'Sunrise_Land_Sale_Deed.pdf',
    title: 'GOVERNMENT OF KARNATAKA - REGISTERED SALE DEED',
    lines: [
      'Deed Registration No: DEED-2026-9912',
      'Survey Number: 144/2, Sarjapur Hobli, Anekal Taluk',
      'Contiguous Land Area: 4.85 Acres (Unencumbered)',
      'Grantee: Sunrise Education Trust, Bengaluru',
      'Sub-Registrar Office: Anekal Registration District'
    ]
  },
  {
    fileName: 'Sunrise_Fire_Safety_NOC.pdf',
    title: 'KARNATAKA FIRE AND EMERGENCY SERVICES - NOC',
    lines: [
      'Certificate No: FS-BLR-2023-9941',
      'Issued To: Sunrise Institute of Technology',
      'Issue Date: 2023-01-15 | Validity: 1 Year',
      'Expiry Date: 2024-01-14 (RECORD EXPIRED)',
      'Station: Sarjapur Sub-Fire Station'
    ]
  },
  {
    fileName: 'Nova_Faculty_Qualification_Malhotra.pdf',
    title: 'FACULTY QUALIFICATION & SERVICE UNDERTAKING',
    lines: [
      'Faculty Name: Dr. Vikram Malhotra',
      'Permanent Account Number: DEMOPAN9999X',
      'Highest Qualification: Ph.D. Mechanical Engineering (VTU-PHD-MECH-4412)',
      'Declared Designation: Full-Time Professor at Nova Engineering College',
      'AICTE Faculty ID: 1-FAC-991204'
    ]
  },
  {
    fileName: 'Nova_Building_Plan_Rev2.pdf',
    title: 'PUNE METROPOLITAN REGION - ARCHITECTURAL BUILT-UP SCHEDULE',
    lines: [
      'Sanction Reference: PMC-BLD-2024-8841',
      'Declared Built-up Area: 14200.00 Sq. Meters',
      'Instructional Carpet Area: 8100.00 Sq. Meters',
      'Administrative Carpet Area: 1650.00 Sq. Meters',
      'Status: Structural Undertaking Submitted'
    ]
  },
  {
    fileName: 'Western_Horizon_Occupancy_2021.pdf',
    title: 'PUNE MUNICIPAL CORPORATION - OCCUPANCY CERTIFICATE (2021)',
    lines: [
      'Sanction Certificate No: OCC-PUNE-2021-DUP-01',
      'Building Name: Western Horizon Academic Block A & B',
      'Applicant Institution: Western Horizon Institute of Technology',
      'Survey Reference: Sector 14, Hinjawadi Pune',
      'Date of Final Sanction: 2021-03-15'
    ]
  },
  {
    fileName: 'Apex_Occupancy_Certificate_2021.pdf',
    title: 'PUNE MUNICIPAL CORPORATION - OCCUPANCY CERTIFICATE (2021)',
    lines: [
      'Sanction Certificate No: OCC-PUNE-2021-DUP-01',
      'Building Name: Western Horizon Academic Block A & B',
      'Applicant Institution: Western Horizon Institute of Technology',
      'Survey Reference: Sector 14, Hinjawadi Pune',
      'Date of Final Sanction: 2021-03-15'
    ]
  },
  {
    fileName: 'Apex_Occupancy_Certificate_Reused.pdf',
    title: 'PUNE MUNICIPAL CORPORATION - OCCUPANCY CERTIFICATE (2021)',
    lines: [
      'Sanction Certificate No: OCC-PUNE-2021-DUP-01',
      'Building Name: Western Horizon Academic Block A & B',
      'Applicant Institution: Western Horizon Institute of Technology',
      'Survey Reference: Sector 14, Hinjawadi Pune',
      'Date of Final Sanction: 2021-03-15'
    ]
  },
  {
    fileName: 'Apex_Land_Lease_Deed.pdf',
    title: 'REGISTERED INDENTURE OF LEASE DEED',
    lines: [
      'Lease Document No: LEASE-PUNE-2026-1049',
      'Survey / Khasra No: 289/1A (2.1 Acres)',
      'Lessor: Deshmukh Land Developers LLP',
      'Lessee: Apex Technical Society',
      'Note: Overlapping partition claim on undivided Survey 289/1A'
    ]
  }
];

const computedHashes = {};

for (const spec of sampleSpecs) {
  const filePath = path.join(outputDir, spec.fileName);
  const pdfBuffer = buildMinimalPdf(spec.title, spec.lines);
  fs.writeFileSync(filePath, pdfBuffer);
  const hash = crypto.createHash('sha256').update(pdfBuffer).digest('hex');
  computedHashes[spec.fileName] = {
    hash,
    size: pdfBuffer.length,
    path: `/samples/${spec.fileName}`
  };
  console.log(`Generated ${spec.fileName}: SHA-256=${hash} (${pdfBuffer.length} bytes)`);
}

const manifestPath = path.join(outputDir, 'manifest.json');
fs.writeFileSync(manifestPath, JSON.stringify(computedHashes, null, 2));
console.log(`Saved sample manifest to ${manifestPath}`);
