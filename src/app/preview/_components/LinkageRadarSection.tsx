import React from 'react';
import { LinkageRadarEngine } from '@/lib/radar/graph';
import { formatSeverity } from './helpers';

export default function LinkageRadarSection() {
  const radarData = LinkageRadarEngine.getGraphData();
  const { nodes, edges, overallLinkageRiskScore, riskSummary } = radarData;

  return (
    <section id="linkage-radar" className="space-y-8 bg-white border border-slate-200 rounded-2xl p-6 md:p-8 shadow-sm">
      <div className="border-b border-slate-200 pb-4">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-rose-700 uppercase tracking-wider">
            Compliance Intelligence
          </span>
          <span className="bg-rose-100 text-rose-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
            Entity Resolution Graph
          </span>
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mt-1">
          Linkage Radar: Cross-Institutional Linkage Analysis
        </h2>
        <p className="text-sm text-slate-600 mt-1">
          Identifies possible cross-institution linkages such as overlapping land survey claims, shared certificate numbers, and concurrent faculty declarations across institutions.
        </p>
      </div>

      {/* Summary Score Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center">
          <div className="text-[10px] font-bold text-slate-500 uppercase">Linkage Risk Score</div>
          <div className="text-3xl font-black font-mono text-rose-600 mt-1">{overallLinkageRiskScore}%</div>
          <span className="text-[10px] text-slate-400">Elevated Linkage Affinity</span>
        </div>
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center">
          <div className="text-[10px] font-bold text-slate-500 uppercase">Critical Clusters</div>
          <div className="text-3xl font-black font-mono text-slate-900 mt-1">{riskSummary.criticalClusters}</div>
          <span className="text-[10px] text-slate-400">Interlocking Entities</span>
        </div>
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center">
          <div className="text-[10px] font-bold text-slate-500 uppercase">Cross-Inst. Reuses</div>
          <div className="text-3xl font-black font-mono text-amber-600 mt-1">{riskSummary.crossInstitutionalReuses}</div>
          <span className="text-[10px] text-slate-400">Shared Credentials</span>
        </div>
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center">
          <div className="text-[10px] font-bold text-slate-500 uppercase">Shared Land Parcels</div>
          <div className="text-3xl font-black font-mono text-rose-700 mt-1">{riskSummary.overlappingLandCount}</div>
          <span className="text-[10px] text-slate-400">Survey No. 289/1A</span>
        </div>
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center">
          <div className="text-[10px] font-bold text-slate-500 uppercase">Duplicate Faculty</div>
          <div className="text-3xl font-black font-mono text-indigo-600 mt-1">{riskSummary.duplicateFacultyCount}</div>
          <span className="text-[10px] text-slate-400">Concurrent Declarations</span>
        </div>
      </div>

      {/* SVG Topology Representation for Visual Render */}
      <div>
        <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-2">
          Visual Relationship Topology (SVG)
        </h3>
        <div className="w-full overflow-x-auto border border-slate-200 rounded-xl bg-slate-950 p-4">
          <svg viewBox="0 0 800 380" className="w-full h-auto min-w-[650px]">
            {/* Draw Edges */}
            {edges.map((edge) => {
              const src = nodes.find(n => n.id === edge.source);
              const tgt = nodes.find(n => n.id === edge.target);
              if (!src || !tgt || src.x === undefined || src.y === undefined || tgt.x === undefined || tgt.y === undefined) return null;
              
              const isCrit = edge.riskLevel === 'CRITICAL';
              const strokeColor = isCrit ? '#f43f5e' : '#f59e0b';

              return (
                <g key={edge.id}>
                  <line 
                    x1={src.x} 
                    y1={src.y} 
                    x2={tgt.x} 
                    y2={tgt.y} 
                    stroke={strokeColor} 
                    strokeWidth={isCrit ? 2.5 : 1.5}
                    strokeDasharray={isCrit ? '4,4' : undefined}
                  />
                  <text 
                    x={(src.x + tgt.x) / 2} 
                    y={(src.y + tgt.y) / 2 - 6} 
                    fill="#94a3b8" 
                    fontSize="9" 
                    textAnchor="middle"
                    className="font-mono"
                  >
                    {edge.label}
                  </text>
                </g>
              );
            })}

            {/* Draw Nodes */}
            {nodes.map((node) => {
              if (node.x === undefined || node.y === undefined) return null;
              const isInst = node.type === 'INSTITUTION';
              const isCrit = node.riskLevel === 'CRITICAL';
              const fillColor = isInst ? '#1e3a8a' : isCrit ? '#881337' : '#334155';

              return (
                <g key={node.id}>
                  <circle 
                    cx={node.x} 
                    cy={node.y} 
                    r={isInst ? 24 : 16} 
                    fill={fillColor} 
                    stroke={isCrit ? '#f43f5e' : '#38bdf8'} 
                    strokeWidth="2" 
                  />
                  <text 
                    x={node.x} 
                    y={node.y + 4} 
                    fill="#ffffff" 
                    fontSize={isInst ? 10 : 8} 
                    fontWeight="bold" 
                    textAnchor="middle"
                  >
                    {node.type.substring(0, 4)}
                  </text>
                  <text 
                    x={node.x} 
                    y={node.y + (isInst ? 36 : 28)} 
                    fill="#e2e8f0" 
                    fontSize="10" 
                    fontWeight="600" 
                    textAnchor="middle"
                  >
                    {node.label}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
      </div>

      {/* Node Table (Requirements: Readable without JS) */}
      <div className="space-y-3">
        <h3 className="text-base font-bold text-slate-900">
          Resolved Graph Entities ({nodes.length} Nodes)
        </h3>
        <div className="overflow-x-auto border border-slate-200 rounded-xl">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100 text-slate-700 font-bold border-b">
                <th className="p-2.5">Node ID</th>
                <th className="p-2.5">Entity Type</th>
                <th className="p-2.5">Entity Label</th>
                <th className="p-2.5">Sub-Label / Key Identifier</th>
                <th className="p-2.5">Risk Level</th>
                <th className="p-2.5">Metadata Attributes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {nodes.map((node) => (
                <tr key={node.id} className="hover:bg-slate-50">
                  <td className="p-2.5 font-mono text-slate-500">{node.id}</td>
                  <td className="p-2.5 font-semibold text-slate-800">{node.type}</td>
                  <td className="p-2.5 font-bold text-slate-900">{node.label}</td>
                  <td className="p-2.5 font-mono text-slate-600">{node.subLabel || '-'}</td>
                  <td className="p-2.5">
                    <span className={`px-2 py-0.5 rounded-sm border text-[10px] font-bold ${formatSeverity(node.riskLevel)}`}>
                      {node.riskLevel}
                    </span>
                  </td>
                  <td className="p-2.5 text-[11px] font-mono text-slate-600">
                    {JSON.stringify(node.metadata)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edge Table (Requirements: Readable without JS) */}
      <div className="space-y-3">
        <h3 className="text-base font-bold text-slate-900">
          Cross-Institution Linkages ({edges.length} Edges)
        </h3>
        <div className="overflow-x-auto border border-slate-200 rounded-xl">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100 text-slate-700 font-bold border-b">
                <th className="p-2.5">Edge ID</th>
                <th className="p-2.5">Relation Type</th>
                <th className="p-2.5">Source Entity</th>
                <th className="p-2.5">Target Entity</th>
                <th className="p-2.5">Risk Level</th>
                <th className="p-2.5">Evidence Details</th>
                <th className="p-2.5">Institutions Involved</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {edges.map((edge) => (
                <tr key={edge.id} className="hover:bg-slate-50">
                  <td className="p-2.5 font-mono text-slate-500">{edge.id}</td>
                  <td className="p-2.5 font-semibold text-slate-800">{edge.relationType}</td>
                  <td className="p-2.5 font-mono text-blue-700">{edge.source}</td>
                  <td className="p-2.5 font-mono text-indigo-700">{edge.target}</td>
                  <td className="p-2.5">
                    <span className={`px-2 py-0.5 rounded-sm border text-[10px] font-bold ${formatSeverity(edge.riskLevel)}`}>
                      {edge.riskLevel}
                    </span>
                  </td>
                  <td className="p-2.5 text-slate-700">{edge.evidenceDetails}</td>
                  <td className="p-2.5 text-[11px] font-semibold text-slate-800">
                    {edge.institutionsInvolved.join(', ')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

export const CollusionRadarSection = LinkageRadarSection;
