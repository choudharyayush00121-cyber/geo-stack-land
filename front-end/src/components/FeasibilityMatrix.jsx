import React from 'react';
import {
  Cpu,
  Database,
  Users,
  DollarSign,
  TrendingUp,
  CheckCircle2,
  Layers,
  Sparkles,
  Award,
  Globe,
  ShieldCheck
} from 'lucide-react';

export default function FeasibilityMatrix() {
  const feasibilityDimensions = [
    {
      title: '1. Technical Feasibility',
      icon: Cpu,
      color: 'from-blue-600 to-cyan-600',
      badge: 'STACK VERIFIED',
      points: [
        'React.js Modern Frontend Engine',
        'Node.js & Express REST API Gateway',
        'PostgreSQL + PostGIS Spatial Database',
        'Interactive Leaflet GIS Map Canvas',
        'PyTorch AI & Tesseract OCR Verification'
      ]
    },
    {
      title: '2. Data Feasibility',
      icon: Database,
      color: 'from-emerald-600 to-teal-600',
      badge: 'DATA READY',
      points: [
        'Sample & Mock Public Land Records',
        '14-Digit ULPIN GeoJSON Data Format',
        'Government Department Open APIs',
        'Real-time Multi-Agency Data Handshake',
        'MongoDB Unstructured Deed Storage'
      ]
    },
    {
      title: '3. Operational Feasibility',
      icon: Users,
      color: 'from-amber-600 to-orange-600',
      badge: 'RBAC ACTIVE',
      points: [
        'Citizen Self-Service Search & ECs',
        'Government Officer Deed Audit & Mutation',
        'System Administrator DPI Governance',
        'Intuitive Mobile-Responsive Interface',
        'Minimal Training Required for Staff'
      ]
    },
    {
      title: '4. Economic Feasibility',
      icon: DollarSign,
      color: 'from-purple-600 to-indigo-600',
      badge: 'LOW COST',
      points: [
        '100% Open-Source Technology Stack',
        'Zero Proprietary GIS License Fees',
        'Low Infrastructure Maintenance Cost',
        'High ROI via Fraud & Litigation Prevention',
        'Cost Effective National Deployment'
      ]
    },
    {
      title: '5. Scalability Feasibility',
      icon: TrendingUp,
      color: 'from-rose-600 to-pink-600',
      badge: '3-TIER SCALE',
      points: [
        'Working Prototype Level (Current)',
        'District Level Rollout (Phase 1)',
        'State Level Integration (Phase 2)',
        'National DPI Infrastructure (Phase 3)',
        'Microservices Cloud Architecture'
      ]
    }
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-cyan-950 to-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
              SIH 2026 Evaluation Matrix
            </span>
            <span className="text-xs text-slate-400 font-mono">GeoLand Stack Viability</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white mt-1 flex items-center gap-2">
            <Sparkles className="w-7 h-7 text-cyan-400" />
            <span>5-Dimension Feasibility and Viability Framework</span>
          </h1>
          <p className="text-sm text-slate-400 mt-0.5 max-w-2xl">
            Comprehensive breakdown of Technical, Data, Operational, Economic, and Scalability feasibility.
          </p>
        </div>

        <div className="flex items-center space-x-3 bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs font-mono">
          <Award className="w-5 h-5 text-emerald-400" />
          <div>
            <div className="text-slate-400">Feasibility Rating</div>
            <div className="text-emerald-400 font-bold text-sm">100% Viable & Scalable</div>
          </div>
        </div>
      </div>

      {/* 5-Dimension Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {feasibilityDimensions.map((dim, idx) => {
          const Icon = dim.icon;
          return (
            <div
              key={idx}
              className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 space-y-4 shadow-xl transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${dim.color} flex items-center justify-center text-white shadow-md`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded bg-slate-950 text-cyan-300 border border-slate-800">
                    {dim.badge}
                  </span>
                </div>
                <h3 className="font-bold text-white text-sm">{dim.title}</h3>

                <ul className="space-y-2 text-xs text-slate-300 font-mono pt-2 border-t border-slate-800">
                  {dim.points.map((pt, pIdx) => (
                    <li key={pIdx} className="flex items-start gap-1.5 leading-relaxed">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 mt-0.5 flex-shrink-0" />
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          );
        })}
      </div>

      {/* Scalability Progression Tier (Prototype -> District -> State -> National) */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
        <h3 className="font-bold text-white text-sm border-b border-slate-800 pb-3 flex items-center gap-2">
          <Globe className="w-4 h-4 text-rose-400" />
          <span>Scalability Rollout Roadmap (Prototype → District → State → National)</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-center text-xs font-mono">
          <div className="bg-slate-950 p-4 rounded-xl border border-cyan-500/50 space-y-1">
            <div className="text-cyan-300 font-bold">Phase 1: Prototype</div>
            <div className="text-[10px] text-slate-400">Current Full-Stack System</div>
            <div className="text-[10px] text-emerald-400 font-bold">ACTIVE LIVE</div>
          </div>
          <div className="bg-slate-950 p-4 rounded-xl border border-blue-500/40 space-y-1">
            <div className="text-blue-300 font-bold">Phase 2: District Level</div>
            <div className="text-[10px] text-slate-400">Bengaluru Urban District</div>
            <div className="text-[10px] text-blue-400 font-bold">READY FOR PILOT</div>
          </div>
          <div className="bg-slate-950 p-4 rounded-xl border border-purple-500/40 space-y-1">
            <div className="text-purple-300 font-bold">Phase 3: State Level</div>
            <div className="text-[10px] text-slate-400">31 Karnataka Districts</div>
            <div className="text-[10px] text-purple-400 font-bold">PLANNED</div>
          </div>
          <div className="bg-slate-950 p-4 rounded-xl border border-emerald-500/50 space-y-1">
            <div className="text-emerald-300 font-bold">Phase 4: National DPI</div>
            <div className="text-[10px] text-slate-400">All India Bhu-Aadhaar</div>
            <div className="text-[10px] text-emerald-400 font-bold">ULTIMATE GOAL</div>
          </div>
        </div>
      </div>
    </div>
  );
}
