import React, { useState } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Lock,
  RefreshCw,
  Search,
  Database,
  Cpu,
  Users,
  Eye,
  Layers,
  Sparkles,
  Zap,
  ArrowRight,
  TrendingUp,
  Award
} from 'lucide-react';

export default function RiskMitigation() {
  const fullRiskMatrix = [
    {
      challenge: 'Fragmented Data Sources',
      impact: 'Different departments store data in isolated formats',
      mitigation: 'Use APIs, data integration, cleaning, and standardization into 14-digit ULPIN GeoJSON format',
      status: 'STANDARDIZED'
    },
    {
      challenge: 'Data Inaccuracy',
      impact: 'Old or incorrect records may produce wrong results',
      mitigation: 'Cross-verification and manual review by officials with PyTorch AI double-check',
      status: 'VERIFIED'
    },
    {
      challenge: 'Data Privacy & Security',
      impact: 'Land ownership data is sensitive and prone to tampering',
      mitigation: 'Use AES-256 encryption, JWT authentication, and role-based access control (RBAC)',
      status: 'SECURED'
    },
    {
      challenge: 'Government Data Access',
      impact: 'Official databases may not be easily accessible across departments',
      mitigation: 'Use authorized open DPI APIs and official government collaboration agreements',
      status: 'AUTHORIZED'
    },
    {
      challenge: 'Data Synchronization',
      impact: 'Records from departments may not update at the same time',
      mitigation: 'Use scheduled synchronization and real-time Server-Sent Events (SSE) updates',
      status: 'REALTIME_SYNC'
    },
    {
      challenge: 'AI / OCR Errors',
      impact: 'Documents may be incorrectly scanned or interpreted',
      mitigation: 'Add confidence scores (e.g. 99.4%) and human verification routing for low scores',
      status: 'AUDITED'
    },
    {
      challenge: 'GIS Data Complexity',
      impact: 'Large maps and geospatial datasets can be difficult to manage',
      mitigation: 'Use PostgreSQL / PostGIS spatial database and optimized Leaflet GIS services',
      status: 'OPTIMIZED'
    },
    {
      challenge: 'Scalability',
      impact: 'Large-scale implementation may involve millions of parcel records',
      mitigation: 'Use cloud infrastructure, microservices, and modular architecture (Prototype → District → State → National)',
      status: 'SCALABLE'
    },
    {
      challenge: 'Inter-Department Coordination',
      impact: 'Multiple departments may have different legacy systems and processes',
      mitigation: 'Define common 14-digit ULPIN data standards and open integration protocols',
      status: 'COORDINATED'
    },
    {
      challenge: 'User Adoption',
      impact: 'Some users may find new technology difficult to use',
      mitigation: 'Provide simple, mobile-responsive UI, role-based workflows, training, and technical support',
      status: 'USER_FRIENDLY'
    }
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-rose-950 to-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-500/20 text-rose-300 border border-rose-500/30">
              Risk Management Strategy
            </span>
            <span className="text-xs text-slate-400 font-mono">Framework: Challenge → Impact → Mitigation</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white mt-1 flex items-center gap-2">
            <ShieldAlert className="w-7 h-7 text-rose-400" />
            <span>Comprehensive Risk, Impact & Mitigation Audit Matrix</span>
          </h1>
          <p className="text-sm text-slate-400 mt-0.5 max-w-2xl">
            10-Pillar evaluation matrix mapping land governance challenges and potential risks to technical mitigations.
          </p>
        </div>

        <div className="flex items-center space-x-2 bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs font-mono">
          <Award className="w-5 h-5 text-emerald-400" />
          <div>
            <div className="text-slate-400">Risk Resolution Rate</div>
            <div className="text-emerald-400 font-bold text-sm">10/10 Pillars Mitigated</div>
          </div>
        </div>
      </div>

      {/* FULL 10-ROW RISK, IMPACT & MITIGATION AUDIT TABLE */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="font-bold text-white text-sm flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Complete 10-Pillar Risk Management Audit Matrix</span>
          </h3>
          <span className="text-xs text-slate-400 font-mono">SIH 2026 Strategy Compliance</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono border-collapse">
            <thead>
              <tr className="bg-slate-950 text-slate-400 border-b border-slate-800 uppercase text-[10px] tracking-wider">
                <th className="p-3 w-1/4">Challenge / Risk</th>
                <th className="p-3 w-1/3">Impact Identified</th>
                <th className="p-3 w-1/3">Mitigation Strategy & Solution</th>
                <th className="p-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {fullRiskMatrix.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-950/60 transition-all">
                  <td className="p-3.5 font-bold text-rose-300">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-3.5 h-3.5 text-rose-400 flex-shrink-0" />
                      <span>{item.challenge}</span>
                    </div>
                  </td>
                  <td className="p-3.5 text-slate-400 font-sans leading-relaxed">
                    {item.impact}
                  </td>
                  <td className="p-3.5 text-slate-200 leading-relaxed font-sans">
                    <div className="flex items-center gap-2">
                      <ArrowRight className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                      <span>{item.mitigation}</span>
                    </div>
                  </td>
                  <td className="p-3.5 text-right font-bold">
                    <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px]">
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
