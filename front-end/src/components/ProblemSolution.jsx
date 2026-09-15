import React from 'react';
import {
  AlertOctagon,
  CheckCircle2,
  XCircle,
  ArrowDown,
  ArrowRight,
  Database,
  Scan,
  Map,
  BarChart3,
  Landmark,
  Building2,
  FileText,
  Compass,
  Sparkles,
  Award,
  Layers,
  Search,
  ShieldCheck
} from 'lucide-react';
import Interactive3DCard from './Interactive3DCard';

export default function ProblemSolution() {
  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8 relative">
      {/* Ambient background glows */}
      <div className="absolute top-10 left-10 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-1/2 right-10 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-cyan-950/60 to-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 backdrop-blur relative overflow-hidden">
        <div className="absolute inset-0 bg-cyber-grid opacity-20 pointer-events-none" />
        <div className="relative z-10">
          <div className="flex items-center space-x-2">
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 flex items-center gap-1.5 shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>SIH 2026 Problem Statement 26014</span>
            </span>
            <span className="text-xs text-slate-400 font-mono">GeoLand Stack Architecture</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white mt-2 flex items-center gap-3">
            <Layers className="w-8 h-8 text-cyan-400" />
            <span className="bg-gradient-to-r from-white via-slate-100 to-cyan-200 bg-clip-text text-transparent">
              Problem vs Solution & Data Ingestion Pipeline
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
            Transitioning from fragmented departmental silos to a unified, AI-verified, map-centric Digital Public Infrastructure.
          </p>
        </div>

        <Interactive3DCard maxTilt={10} className="relative z-10 flex items-center space-x-3.5 bg-slate-950/90 p-4 rounded-2xl border border-emerald-500/30 text-xs font-mono shadow-xl backdrop-blur">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center">
            <Award className="w-6 h-6 text-emerald-400" />
          </div>
          <div>
            <div className="text-slate-400 text-[11px]">Governance Transformation</div>
            <div className="text-emerald-400 font-bold text-base">45 Days → 3 Mins</div>
          </div>
        </Interactive3DCard>
      </div>

      {/* CORE PIPELINE FLOW */}
      <div className="bg-slate-900/90 border border-cyan-500/30 rounded-3xl p-6 space-y-5 shadow-2xl backdrop-blur relative overflow-hidden">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <span className="text-xs uppercase font-mono font-bold tracking-wider text-cyan-400 flex items-center gap-2">
            <Layers className="w-4 h-4" />
            Core Data Ingestion & Transformation Pipeline
          </span>
          <span className="text-xs text-slate-400 font-mono bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800">
            Protocol: ULPIN-DPI-v2.6
          </span>
        </div>

        {/* Visual Pipeline Stack with 3D Elevation */}
        <div className="flex flex-col items-center space-y-4 pt-2">
          {/* Level 1: 4 Data Sources */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 w-full text-xs font-mono">
            <Interactive3DCard maxTilt={12} className="bg-slate-950/90 p-4 rounded-2xl border border-slate-800 hover:border-blue-500/40 text-center space-y-2 shadow-lg">
              <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center mx-auto">
                <Landmark className="w-5 h-5" />
              </div>
              <div className="font-bold text-white text-sm">Revenue Records</div>
              <div className="text-[10px] text-slate-400">RTC, Mutation & Owner</div>
            </Interactive3DCard>

            <Interactive3DCard maxTilt={12} className="bg-slate-950/90 p-4 rounded-2xl border border-slate-800 hover:border-emerald-500/40 text-center space-y-2 shadow-lg">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                <Compass className="w-5 h-5" />
              </div>
              <div className="font-bold text-white text-sm">Survey Maps</div>
              <div className="text-[10px] text-slate-400">Tippani & Coordinates</div>
            </Interactive3DCard>

            <Interactive3DCard maxTilt={12} className="bg-slate-950/90 p-4 rounded-2xl border border-slate-800 hover:border-amber-500/40 text-center space-y-2 shadow-lg">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto">
                <FileText className="w-5 h-5" />
              </div>
              <div className="font-bold text-white text-sm">Registration</div>
              <div className="text-[10px] text-slate-400">Deeds & Encumbrance</div>
            </Interactive3DCard>

            <Interactive3DCard maxTilt={12} className="bg-slate-950/90 p-4 rounded-2xl border border-slate-800 hover:border-purple-500/40 text-center space-y-2 shadow-lg">
              <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center mx-auto">
                <Building2 className="w-5 h-5" />
              </div>
              <div className="font-bold text-white text-sm">Land Use Data</div>
              <div className="text-[10px] text-slate-400">Zoning & Masterplan</div>
            </Interactive3DCard>
          </div>

          <ArrowDown className="w-6 h-6 text-cyan-400 animate-bounce" />

          {/* Level 2: Integrated Digital Platform */}
          <Interactive3DCard maxTilt={8} className="bg-slate-950/90 p-5 rounded-2xl border border-cyan-500/50 hover:border-cyan-400 text-center max-w-xl w-full shadow-xl space-y-1.5">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center mx-auto mb-1">
              <Database className="w-5 h-5" />
            </div>
            <div className="font-black text-white text-base">Integrated Digital Platform</div>
            <div className="text-xs text-slate-400 font-mono">Centralized PostgreSQL + PostGIS & MongoDB Cloud Atlas Hub</div>
          </Interactive3DCard>

          <ArrowDown className="w-6 h-6 text-cyan-400 animate-bounce" />

          {/* Level 3: GIS Interactive Map */}
          <Interactive3DCard maxTilt={8} className="bg-slate-950/90 p-5 rounded-2xl border border-indigo-500/50 hover:border-indigo-400 text-center max-w-xl w-full shadow-xl space-y-1.5">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center mx-auto mb-1">
              <Map className="w-5 h-5" />
            </div>
            <div className="font-black text-white text-base">GIS Interactive Map & 3D Twin</div>
            <div className="text-xs text-slate-400 font-mono">14-Digit ULPIN Spatial Canvas with Multi-Layer Volumetric Strata</div>
          </Interactive3DCard>

          <ArrowDown className="w-6 h-6 text-cyan-400 animate-bounce" />

          {/* Level 4: Search + Verify + Analyse */}
          <Interactive3DCard maxTilt={8} className="bg-slate-950/90 p-5 rounded-2xl border border-purple-500/50 hover:border-purple-400 text-center max-w-xl w-full shadow-xl space-y-1.5">
            <div className="flex items-center justify-center space-x-3 text-purple-400 mb-1">
              <Search className="w-5 h-5" />
              <span>+</span>
              <Scan className="w-5 h-5" />
              <span>+</span>
              <BarChart3 className="w-5 h-5" />
            </div>
            <div className="font-black text-white text-base">Search + Verify + Analyse</div>
            <div className="text-xs text-slate-400 font-mono">AI Deed OCR Audit, Instant EC Generation & Stamp Duty Engine</div>
          </Interactive3DCard>

          <ArrowDown className="w-6 h-6 text-emerald-400 animate-bounce" />

          {/* Level 5: Better Land Governance */}
          <Interactive3DCard maxTilt={10} className="bg-gradient-to-r from-emerald-950 via-slate-950 to-emerald-950 p-6 rounded-2xl border border-emerald-500/60 hover:border-emerald-400 text-center max-w-xl w-full shadow-2xl space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-1 shadow-lg">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <div className="font-black text-emerald-300 text-lg uppercase tracking-wide">Better Land Governance</div>
            <div className="text-xs text-slate-200 font-mono">Conclusive Bhu-Aadhaar Titles, Zero Fraud & Instant Public Service</div>
          </Interactive3DCard>
        </div>
      </div>

      {/* SECTION 1: THE PROBLEM vs SECTION 2: OUR SOLUTION */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* THE PROBLEM */}
        <Interactive3DCard maxTilt={8} className="bg-slate-900/90 border border-rose-900/40 hover:border-rose-500/50 rounded-3xl p-6 space-y-4 shadow-xl flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-rose-900/40 pb-3">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center font-bold">
                  <AlertOctagon className="w-6 h-6" />
                </div>
                <h2 className="text-xl font-extrabold text-white">THE PROBLEM</h2>
              </div>
              <span className="bg-rose-500/20 text-rose-300 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold border border-rose-500/30">
                FRAGMENTATION
              </span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Land-related data is fragmented across different departments and records, making it difficult to access, verify, visualize, and analyse land information for effective governance and planning.
            </p>
            <ul className="text-xs text-rose-200/80 space-y-1.5 list-disc list-inside">
              <li>Multiple disparate paper registries</li>
              <li>Double mortgages and fraudulent land sales</li>
              <li>Decade-long land dispute litigation in courts</li>
            </ul>
          </div>
          <div className="text-[10px] font-mono text-rose-400 pt-3 border-t border-slate-800">
            High Transaction Costs • High Vulnerability
          </div>
        </Interactive3DCard>

        {/* OUR SOLUTION */}
        <Interactive3DCard maxTilt={8} className="bg-slate-900/90 border border-emerald-900/40 hover:border-emerald-500/50 rounded-3xl p-6 space-y-4 shadow-xl flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-emerald-900/40 pb-3">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h2 className="text-xl font-extrabold text-white">OUR SOLUTION</h2>
              </div>
              <span className="bg-emerald-500/20 text-emerald-300 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold border border-emerald-500/30">
                UNIFIED DPI
              </span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              A unified Digital Public Infrastructure linking Revenue, Sub-Registrar, Municipal and Banking systems onto a 14-Digit ULPIN spatial map canvas.
            </p>
            <div className="grid grid-cols-2 gap-2 text-xs font-semibold pt-1">
              <span className="flex items-center gap-1 text-emerald-400 bg-slate-950 p-2 rounded-xl border border-slate-800">
                <CheckCircle2 className="w-3.5 h-3.5" /> Easy Access
              </span>
              <span className="flex items-center gap-1 text-emerald-400 bg-slate-950 p-2 rounded-xl border border-slate-800">
                <CheckCircle2 className="w-3.5 h-3.5" /> Verified Info
              </span>
              <span className="flex items-center gap-1 text-emerald-400 bg-slate-950 p-2 rounded-xl border border-slate-800">
                <CheckCircle2 className="w-3.5 h-3.5" /> 3D Spatial Maps
              </span>
              <span className="flex items-center gap-1 text-emerald-400 bg-slate-950 p-2 rounded-xl border border-slate-800">
                <CheckCircle2 className="w-3.5 h-3.5" /> Smarter Policy
              </span>
            </div>
          </div>
          <div className="text-[10px] font-mono text-emerald-400 pt-3 border-t border-slate-800">
            Instant 3-Minute Digital Title Guarantees
          </div>
        </Interactive3DCard>
      </div>
    </div>
  );
}

