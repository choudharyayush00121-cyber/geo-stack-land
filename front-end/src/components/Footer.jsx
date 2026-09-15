import React from 'react';
import { Layers, ShieldCheck, Heart, Code2, Globe, Cpu, Award } from 'lucide-react';

export default function Footer({ setActiveView }) {
  return (
    <footer className="bg-slate-950 border-t border-slate-900 text-slate-400 text-xs mt-auto relative z-30 select-none">
      {/* Top Footer Banner */}
      <div className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Brand Column */}
        <div className="space-y-3 md:col-span-1">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-600 flex items-center justify-center text-white shadow-md">
              <Layers className="w-4 h-4 text-white" />
            </div>
            <span className="font-extrabold text-base text-white tracking-tight">
              GeoLand Stack
            </span>
          </div>
          <p className="text-slate-400 text-[11px] leading-relaxed">
            Integrated GIS-based Digital Public Infrastructure (DPI) for Land Governance. Connecting Revenue Records, Survey Maps, Registration Data, and Land-Use Zones under 14-digit ULPIN Bhu-Aadhaar.
          </p>
          <div className="flex items-center space-x-2 text-[10px] text-cyan-400 font-mono">
            <span className="px-2 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/30">
              SIH 2026 PS ID: 26014
            </span>
          </div>
        </div>

        {/* Quick Links */}
        <div className="space-y-2">
          <h4 className="font-bold text-slate-200 uppercase tracking-wider text-[11px]">Core Features</h4>
          <ul className="space-y-1.5 text-[11px]">
            <li>
              <button onClick={() => setActiveView && setActiveView('map')} className="hover:text-cyan-400 transition-colors">
                GIS Interactive Map Engine
              </button>
            </li>
            <li>
              <button onClick={() => setActiveView && setActiveView('ocr')} className="hover:text-cyan-400 transition-colors">
                AI & OCR Deed Verification
              </button>
            </li>
            <li>
              <button onClick={() => setActiveView && setActiveView('acquisition')} className="hover:text-cyan-400 transition-colors">
                National Land Acquisition
              </button>
            </li>
            <li>
              <button onClick={() => setActiveView && setActiveView('ec')} className="hover:text-cyan-400 transition-colors">
                Encumbrance Certificate (EC)
              </button>
            </li>
          </ul>
        </div>

        {/* Technical Architecture */}
        <div className="space-y-2">
          <h4 className="font-bold text-slate-200 uppercase tracking-wider text-[11px]">Architecture & Tech Stack</h4>
          <ul className="space-y-1.5 text-[11px]">
            <li className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              <span>Node.js / Express REST API</span>
            </li>
            <li className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
              <span>PostgreSQL / PostGIS & MongoDB Atlas</span>
            </li>
            <li className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
              <span>Sentinel-2 Satellite & Drone Telemetry</span>
            </li>
            <li className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-400"></span>
              <span>14-Digit ULPIN Standard (Bhu-Aadhaar)</span>
            </li>
          </ul>
        </div>

        {/* Team & Developer Credits */}
        <div className="space-y-2">
          <h4 className="font-bold text-slate-200 uppercase tracking-wider text-[11px]">Innovation Team</h4>
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 space-y-2">
            <div className="flex items-center space-x-2">
              <Award className="w-4 h-4 text-amber-400 shrink-0" />
              <span className="font-bold text-white text-[11px]">Quantam Coders</span>
            </div>
            <p className="text-[10px] text-slate-400 leading-normal">
              Smart India Hackathon 2026 Team building digital public infrastructure for unified land governance.
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Copyright Bar */}
      <div className="border-t border-slate-900/80 bg-slate-950 py-4 px-6 text-center text-[11px] text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>© 2026 GeoLand Stack. All rights reserved. Developed and maintained by <span className="font-bold text-cyan-400">Quantam Coders</span>.</p>
          <div className="flex items-center space-x-4 text-[10px] text-slate-500 font-mono">
            <span>DPI API v2.6</span>
            <span>•</span>
            <span>Strict Role Security Active</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
