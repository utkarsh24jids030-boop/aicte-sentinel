'use client';

import React, { useState } from 'react';
import { LinkageRadarData, RiskGraphNode, RiskGraphEdge } from '@/types';
import StatusChip from './StatusChip';
import { 
  Building2, 
  ShieldAlert, 
  Share2, 
  Info,
  ExternalLink
} from 'lucide-react';

interface LinkageRadarGraphProps {
  data: LinkageRadarData;
  onSelectInstitution?: (institutionName: string) => void;
}

export default function LinkageRadarGraph({ data, onSelectInstitution }: LinkageRadarGraphProps) {
  const [selectedNode, setSelectedNode] = useState<RiskGraphNode | null>(data.nodes[1]); // Default to Nova
  const [selectedEdge, setSelectedEdge] = useState<RiskGraphEdge | null>(data.edges[4]); // Default to Land conflict edge
  const [filterType, setFilterType] = useState<string>('ALL');

  // Filter nodes & edges
  const filteredEdges = data.edges.filter(edge => {
    if (filterType === 'CRITICAL') return edge.riskLevel === 'CRITICAL';
    if (filterType === 'LAND') return edge.relationType === 'SHARED_LAND';
    if (filterType === 'FACULTY') return edge.relationType === 'REUSED_FACULTY';
    if (filterType === 'CERTS') return edge.relationType === 'DUPLICATE_CERTIFICATE';
    return true;
  });

  const visibleNodeIds = new Set<string>();
  if (filterType === 'ALL') {
    data.nodes.forEach(n => visibleNodeIds.add(n.id));
  } else {
    filteredEdges.forEach(e => {
      visibleNodeIds.add(e.source);
      visibleNodeIds.add(e.target);
    });
  }

  const filteredNodes = data.nodes.filter(n => visibleNodeIds.has(n.id));

  // Helper to get node coordinates
  const getNode = (id: string) => data.nodes.find(n => n.id === id);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden flex flex-col">
      {/* Top Bar with Linkage Risk Metrics & Filters */}
      <div className="p-4 sm:p-5 border-b border-slate-200 bg-slate-50 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <Share2 className="w-5 h-5 text-rose-600" />
              <span>Cross-Institution Linkage Radar</span>
            </h3>
            <span className="bg-rose-100 text-rose-800 text-xs font-bold px-2 py-0.5 rounded-full border border-rose-300">
              Peak Network Linkage Risk: {data.overallLinkageRiskScore}%
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Automated entity-resolution graph identifying possible cross-institutional land parcel overlaps, concurrent faculty claims, and shared documents.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            onClick={() => setFilterType('ALL')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
              filterType === 'ALL' ? 'bg-[#002b66] text-white shadow-2xs' : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
            }`}
          >
            All Entities ({data.nodes.length})
          </button>
          <button
            onClick={() => setFilterType('CRITICAL')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
              filterType === 'CRITICAL' ? 'bg-rose-600 text-white shadow-2xs' : 'bg-white text-rose-700 border border-rose-200 hover:bg-rose-50'
            }`}
          >
            Critical Conflicts Only
          </button>
          <button
            onClick={() => setFilterType('LAND')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
              filterType === 'LAND' ? 'bg-amber-600 text-white shadow-2xs' : 'bg-white text-amber-700 border border-amber-200 hover:bg-amber-50'
            }`}
          >
            Land Conflicts
          </button>
          <button
            onClick={() => setFilterType('FACULTY')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
              filterType === 'FACULTY' ? 'bg-purple-600 text-white shadow-2xs' : 'bg-white text-purple-700 border border-purple-200 hover:bg-purple-50'
            }`}
          >
            Reused Faculty
          </button>
        </div>
      </div>

      {/* Main Canvas + Sidebar Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 min-h-[520px]">
        {/* Interactive SVG Graph Area */}
        <div className="lg:col-span-2 bg-slate-900 relative overflow-hidden flex items-center justify-center p-4">
          {/* Subtle grid background */}
          <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:16px_16px]" />

          <svg className="w-full h-[480px] max-w-[850px] z-10" viewBox="0 0 1000 480">
            {/* Draw Edges */}
            {filteredEdges.map(edge => {
              const src = getNode(edge.source);
              const tgt = getNode(edge.target);
              if (!src || !tgt) return null;

              const isSelected = selectedEdge?.id === edge.id;
              const isCritical = edge.riskLevel === 'CRITICAL';
              const strokeColor = isCritical ? '#f43f5e' : edge.riskLevel === 'HIGH' ? '#f59e0b' : '#38bdf8';

              return (
                <g key={edge.id} className="cursor-pointer group" onClick={() => { setSelectedEdge(edge); setSelectedNode(null); }}>
                  <line
                    x1={src.x || 200}
                    y1={src.y || 200}
                    x2={tgt.x || 400}
                    y2={tgt.y || 200}
                    stroke={strokeColor}
                    strokeWidth={isSelected ? 4 : isCritical ? 2.5 : 1.5}
                    strokeDasharray={isCritical ? '6,4' : undefined}
                    className={isCritical ? 'animate-pulse' : ''}
                    opacity={isSelected ? 1 : 0.8}
                  />
                  {/* Midpoint Label pill */}
                  <rect
                    x={((src.x || 200) + (tgt.x || 400)) / 2 - 40}
                    y={((src.y || 200) + (tgt.y || 200)) / 2 - 10}
                    width="80"
                    height="20"
                    rx="10"
                    fill="#0f172a"
                    stroke={strokeColor}
                    strokeWidth="1"
                    className="group-hover:scale-110 transition-transform origin-center"
                  />
                  <text
                    x={((src.x || 200) + (tgt.x || 400)) / 2}
                    y={((src.y || 200) + (tgt.y || 200)) / 2 + 4}
                    fill={strokeColor}
                    fontSize="9"
                    fontWeight="bold"
                    textAnchor="middle"
                  >
                    {edge.relationType.replace(/_/g, ' ')}
                  </text>
                </g>
              );
            })}

            {/* Draw Nodes */}
            {filteredNodes.map(node => {
              const isSelected = selectedNode?.id === node.id;
              const isInst = node.type === 'INSTITUTION';
              const isCritical = node.riskLevel === 'CRITICAL';
              const isHigh = node.riskLevel === 'HIGH';

              const ringColor = isCritical ? '#f43f5e' : isHigh ? '#f59e0b' : isInst ? '#3b82f6' : '#10b981';
              const nodeRadius = isInst ? 32 : 24;

              return (
                <g 
                  key={node.id} 
                  transform={`translate(${node.x || 300}, ${node.y || 200})`}
                  className="cursor-pointer group"
                  onClick={() => { setSelectedNode(node); setSelectedEdge(null); }}
                >
                  {/* Outer Pulsing Halo for Critical */}
                  {isCritical && (
                    <circle
                      r={nodeRadius + 10}
                      fill="none"
                      stroke="#f43f5e"
                      strokeWidth="2"
                      opacity="0.4"
                      className="animate-ping"
                    />
                  )}

                  {/* Main Node Circle */}
                  <circle
                    r={nodeRadius}
                    fill="#1e293b"
                    stroke={isSelected ? '#ffffff' : ringColor}
                    strokeWidth={isSelected ? 3.5 : 2}
                    className="transition-all group-hover:scale-110 origin-center drop-shadow-md"
                  />

                  {/* Text inside node */}
                  <text
                    y="-4"
                    fill="#ffffff"
                    fontSize={isInst ? "10" : "8"}
                    fontWeight="bold"
                    textAnchor="middle"
                  >
                    {node.type === 'INSTITUTION' ? 'CAMPUS' : node.type}
                  </text>

                  {/* Subtext label */}
                  <text
                    y="12"
                    fill={ringColor}
                    fontSize="9"
                    fontWeight="bold"
                    textAnchor="middle"
                  >
                    {node.label.length > 14 ? node.label.substring(0, 14) + '...' : node.label}
                  </text>

                  {/* Label below node */}
                  <text
                    y={nodeRadius + 16}
                    fill="#94a3b8"
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

          {/* Canvas Bottom Legend */}
          <div className="absolute bottom-3 left-4 bg-slate-900/80 backdrop-blur-xs border border-slate-800 rounded-lg p-2 text-[10px] text-slate-300 flex items-center gap-4 z-20">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
              <span>Critical Linkage Edge</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              <span>High Risk Shared Asset</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
              <span>Verified Single Institution</span>
            </div>
          </div>
        </div>

        {/* Right Detail Inspector Panel */}
        <div className="p-5 border-l border-slate-200 bg-white flex flex-col justify-between overflow-y-auto">
          {selectedEdge ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-rose-600 uppercase tracking-wider flex items-center gap-1">
                  <ShieldAlert className="w-3.5 h-3.5" />
                  <span>Linkage Edge Inspector</span>
                </span>
                <StatusChip status={selectedEdge.riskLevel} size="sm" />
              </div>

              <h4 className="text-base font-bold text-slate-900 leading-snug">
                {selectedEdge.label}
              </h4>

              <div className="bg-rose-50 border border-rose-200 rounded-xl p-3.5 text-xs text-rose-950 space-y-1.5">
                <div className="font-semibold text-rose-900">Evidence Details:</div>
                <p className="leading-relaxed">{selectedEdge.evidenceDetails}</p>
              </div>

              <div className="text-xs space-y-2 border-t pt-3">
                <span className="text-slate-500 font-semibold block">Institutions Enmeshed in Conflict:</span>
                <div className="space-y-1.5">
                  {selectedEdge.institutionsInvolved.map((inst, idx) => (
                    <div key={idx} className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 border border-slate-200">
                      <Building2 className="w-4 h-4 text-blue-600 flex-shrink-0" />
                      <span className="font-semibold text-slate-800 text-xs">{inst}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-amber-50 rounded-xl p-3 border border-amber-200 text-xs text-amber-900">
                <strong className="block mb-1 font-semibold">Regulatory Recommendation:</strong>
                Simultaneous surprise EVC inspection must be dispatched to prevent shifting of movable lab assets or temporary faculty transfers between campuses.
              </div>
            </div>
          ) : selectedNode ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-blue-600 uppercase tracking-wider flex items-center gap-1">
                  <Info className="w-3.5 h-3.5" />
                  <span>Entity Node Inspector</span>
                </span>
                <StatusChip status={selectedNode.riskLevel} size="sm" />
              </div>

              <div>
                <h4 className="text-base font-bold text-slate-900">{selectedNode.label}</h4>
                <p className="text-xs text-slate-500 mt-0.5">{selectedNode.subLabel}</p>
              </div>

              <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200 text-xs space-y-2">
                <div className="font-semibold text-slate-700">Entity Metadata:</div>
                {Object.entries(selectedNode.metadata).map(([key, val]) => (
                  <div key={key} className="flex justify-between py-1 border-b border-slate-200/60 last:border-0">
                    <span className="text-slate-500 capitalize">{key.replace(/([A-Z])/g, ' $1')}:</span>
                    <span className="font-medium text-slate-800 text-right max-w-[180px] truncate">
                      {Array.isArray(val) ? val.join(', ') : String(val)}
                    </span>
                  </div>
                ))}
              </div>

              {selectedNode.type === 'INSTITUTION' && onSelectInstitution && (
                <button
                  onClick={() => onSelectInstitution(selectedNode.label)}
                  className="w-full py-2 bg-[#002b66] hover:bg-[#001f4d] text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 shadow-2xs transition-all"
                >
                  <span>Filter Linkages to this Campus</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center text-slate-400 py-12">
              <Share2 className="w-10 h-10 mb-2 stroke-1" />
              <p className="text-xs">Click any node or link in the radar to inspect entity relationships.</p>
            </div>
          )}

          <div className="mt-6 pt-3 border-t border-slate-100 text-[11px] text-slate-400 text-center">
            AICTE Cross-Institutional Compliance Intelligence Engine v2026.3
          </div>
        </div>
      </div>
    </div>
  );
}
