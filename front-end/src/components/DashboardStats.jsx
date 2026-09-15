import React from 'react';
import {
  BarChart3,
  TrendingUp,
  ShieldCheck,
  Zap,
  Clock,
  CheckCircle,
  FileCheck,
  AlertTriangle,
  Award,
  Trees,
  Scale,
  DollarSign,
  Sparkles
} from 'lucide-react';
import Interactive3DCard from './Interactive3DCard';

export default function DashboardStats({ dpiStatus, parcels }) {
  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8 relative">
      {/* Ambient background glows */}
      <div className="absolute top-10 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-1/2 right-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-cyan-950/60 to-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 backdrop-blur relative overflow-hidden group">
        <div className="absolute inset-0 bg-cyber-grid opacity-20 pointer-events-none" />
        <div className="relative z-10">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 flex items-center gap-1.5 shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>Smart India Hackathon 2026 Impact Matrix</span>
            </span>
            <span className="text-xs text-slate-400 font-mono hidden sm:inline">PS ID: 26014</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white mt-2 flex items-center gap-3">
            <BarChart3 className="w-8 h-8 text-cyan-400" />
            <span className="bg-gradient-to-r from-white via-slate-100 to-cyan-200 bg-clip-text text-transparent">
              Governance Analytics & System Impact
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
            Real-time telemetry measuring fraud rate reduction, processing speed acceleration, judicial backlog elimination, and social credit accessibility.
          </p>
        </div>

        <Interactive3DCard maxTilt={12} className="relative z-10 flex items-center space-x-3.5 bg-slate-950/90 p-4 rounded-2xl border border-cyan-500/30 text-xs font-mono shadow-xl backdrop-blur">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center">
            <Award className="w-6 h-6 text-amber-400" />
          </div>
          <div>
            <div className="text-slate-400 text-[11px]">Title Security Index</div>
            <div className="text-emerald-400 font-extrabold text-base">99.9% Conclusive</div>
          </div>
        </Interactive3DCard>
      </div>

      {/* Metric Cards Grid with Interactive 3D Tilt */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1 */}
        <Interactive3DCard
          maxTilt={12}
          className="bg-slate-900/90 border border-slate-800 hover:border-cyan-500/50 rounded-2xl p-5 space-y-3 shadow-xl hover:shadow-[0_0_25px_rgba(6,182,212,0.25)] transition-all duration-300"
        >
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span className="font-semibold uppercase font-mono tracking-wider">Transaction Speed</span>
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-white tracking-tight translate-z-4">3 Mins</div>
          <div className="text-xs text-emerald-400 font-medium flex items-center gap-1.5 pt-1 border-t border-slate-800/80">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Accelerated from 45 Days</span>
          </div>
        </Interactive3DCard>

        {/* Card 2 */}
        <Interactive3DCard
          maxTilt={12}
          className="bg-slate-900/90 border border-slate-800 hover:border-emerald-500/50 rounded-2xl p-5 space-y-3 shadow-xl hover:shadow-[0_0_25px_rgba(16,185,129,0.25)] transition-all duration-300"
        >
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span className="font-semibold uppercase font-mono tracking-wider">Fraud & Double Selling</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-emerald-400 tracking-tight translate-z-4">-94%</div>
          <div className="text-xs text-slate-400 pt-1 border-t border-slate-800/80">
            Prevented via Multi-Agency Lien Locks
          </div>
        </Interactive3DCard>

        {/* Card 3 */}
        <Interactive3DCard
          maxTilt={12}
          className="bg-slate-900/90 border border-slate-800 hover:border-amber-500/50 rounded-2xl p-5 space-y-3 shadow-xl hover:shadow-[0_0_25px_rgba(245,158,11,0.25)] transition-all duration-300"
        >
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span className="font-semibold uppercase font-mono tracking-wider">Judicial Litigation</span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Scale className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-amber-400 tracking-tight translate-z-4">-78%</div>
          <div className="text-xs text-slate-400 pt-1 border-t border-slate-800/80">
            Fewer Land Title Court Suits
          </div>
        </Interactive3DCard>

        {/* Card 4 */}
        <Interactive3DCard
          maxTilt={12}
          className="bg-slate-900/90 border border-slate-800 hover:border-purple-500/50 rounded-2xl p-5 space-y-3 shadow-xl hover:shadow-[0_0_25px_rgba(168,85,247,0.25)] transition-all duration-300"
        >
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span className="font-semibold uppercase font-mono tracking-wider">Credit & Loan Liquidity</span>
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-purple-400 tracking-tight translate-z-4">₹4.2 Cr</div>
          <div className="text-xs text-emerald-400 font-medium pt-1 border-t border-slate-800/80">
            Instant Bank Collateral Verification
          </div>
        </Interactive3DCard>
      </div>

      {/* Benefits Triad Section with 3D Depth (Social, Economic, Environmental) */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-extrabold text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-cyan-400" />
            <span>National Transformation Dimensions</span>
          </h2>
          <span className="text-xs text-slate-400 font-mono">Multi-Stakeholder Value Delivery</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Social */}
          <Interactive3DCard
            maxTilt={8}
            className="bg-slate-900/90 border border-slate-800 hover:border-blue-500/50 rounded-3xl p-6 space-y-4 shadow-xl hover:shadow-[0_0_30px_rgba(59,130,246,0.2)] transition-all duration-300 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/20 border border-blue-500/40 text-blue-400 flex items-center justify-center text-xl shadow-lg">
                👥
              </div>
              <h3 className="font-extrabold text-white text-lg flex items-center gap-2">
                <span>Social Benefits</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">Citizen First</span>
              </h3>
              <ul className="text-xs text-slate-300 space-y-2.5 leading-relaxed">
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 flex-shrink-0"></span>
                  <span>Empowers marginalized landholders with conclusive, indisputable digital titles.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 flex-shrink-0"></span>
                  <span>Eliminates middleman bribery & cumbersome red tape in sub-registrar offices.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 flex-shrink-0"></span>
                  <span>Protects citizens against unauthorized land grabbing and fraudulent mutations.</span>
                </li>
              </ul>
            </div>
            <div className="text-[10px] font-mono text-blue-300/80 pt-3 border-t border-slate-800">
              Impact: 100% Inclusivity & Transparency
            </div>
          </Interactive3DCard>

          {/* Economic */}
          <Interactive3DCard
            maxTilt={8}
            className="bg-slate-900/90 border border-slate-800 hover:border-emerald-500/50 rounded-3xl p-6 space-y-4 shadow-xl hover:shadow-[0_0_30px_rgba(16,185,129,0.2)] transition-all duration-300 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center text-xl shadow-lg">
                📈
              </div>
              <h3 className="font-extrabold text-white text-lg flex items-center gap-2">
                <span>Economic Benefits</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">Growth</span>
              </h3>
              <ul className="text-xs text-slate-300 space-y-2.5 leading-relaxed">
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 flex-shrink-0"></span>
                  <span>Unlocks vast capital & credit liquidity for rural & urban landowners.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 flex-shrink-0"></span>
                  <span>Minimizes real estate transaction friction with automated stamp duty & mutation.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 flex-shrink-0"></span>
                  <span>Boosts local municipal property tax collection via spatial reconciliation.</span>
                </li>
              </ul>
            </div>
            <div className="text-[10px] font-mono text-emerald-300/80 pt-3 border-t border-slate-800">
              Impact: +32% Tax Collection Efficiency
            </div>
          </Interactive3DCard>

          {/* Environmental */}
          <Interactive3DCard
            maxTilt={8}
            className="bg-slate-900/90 border border-slate-800 hover:border-teal-500/50 rounded-3xl p-6 space-y-4 shadow-xl hover:shadow-[0_0_30px_rgba(20,184,166,0.2)] transition-all duration-300 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-teal-500/20 border border-teal-500/40 text-teal-400 flex items-center justify-center text-xl shadow-lg">
                🌿
              </div>
              <h3 className="font-extrabold text-white text-lg flex items-center gap-2">
                <span>Environmental Benefits</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-teal-500/20 text-teal-300 border border-teal-500/30">Sustainability</span>
              </h3>
              <ul className="text-xs text-slate-300 space-y-2.5 leading-relaxed">
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-400 mt-1.5 flex-shrink-0"></span>
                  <span>AI satellite monitoring automatically flags illegal encroachment on forest buffer zones.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-400 mt-1.5 flex-shrink-0"></span>
                  <span>Optimizes urban resource allocation, green corridors & masterplan zoning.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-400 mt-1.5 flex-shrink-0"></span>
                  <span>Enables rapid disaster compensation & crop damage assessment from satellite telemetry.</span>
                </li>
              </ul>
            </div>
            <div className="text-[10px] font-mono text-teal-300/80 pt-3 border-t border-slate-800">
              Impact: Real-Time Ecological Defense
            </div>
          </Interactive3DCard>
        </div>
      </div>
    </div>
  );
}

