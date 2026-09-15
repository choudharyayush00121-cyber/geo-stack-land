import React, { useState, useEffect } from 'react';
import {
  Search,
  Map,
  Scan,
  FileCheck,
  Calculator,
  Eye,
  Network,
  Briefcase,
  Award,
  ShieldAlert,
  ArrowRight,
  Sparkles,
  Command,
  User
} from 'lucide-react';

export default function CommandPalette({ isOpen, onClose, parcels, onSelectParcel, setActiveView, showToast }) {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else onClose(false); // toggle trigger via parent
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filteredParcels = query.trim()
    ? parcels.filter(
        (p) =>
          p.ulpin.toLowerCase().includes(query.toLowerCase()) ||
          p.owner.name.toLowerCase().includes(query.toLowerCase()) ||
          p.surveyNo.toLowerCase().includes(query.toLowerCase()) ||
          p.village.toLowerCase().includes(query.toLowerCase())
      )
    : parcels.slice(0, 4);

  const quickActions = [
    { label: 'GIS Interactive Map Engine', icon: Map, view: 'map', desc: '14-digit ULPIN spatial canvas' },
    { label: 'AI & OCR Document Verification', icon: Scan, view: 'ocr', desc: 'Cross-check deed OCR text' },
    { label: 'National Land Acquisition', icon: Briefcase, view: 'acquisition', desc: 'Real-time project tracking' },
    { label: 'Instant Encumbrance Certificate (EC)', icon: FileCheck, view: 'ec', desc: 'Generate Form 15 EC' },
    { label: 'AI Satellite Encroachment Scan', icon: Eye, view: 'ai', desc: 'Temporal building change CV' },
    { label: 'Stamp Duty & Valuation Engine', icon: Calculator, view: 'tax', desc: 'Dynamic tax evaluation' },
    { label: 'DPI Open API Gateway', icon: Network, view: 'dpi', desc: 'Multi-agency sync status' },
    { label: '5-Dimension Feasibility Matrix', icon: Award, view: 'feasibility', desc: 'Technical & Economic analysis' }
  ];

  const filteredActions = query.trim()
    ? quickActions.filter(
        (a) => a.label.toLowerCase().includes(query.toLowerCase()) || a.desc.toLowerCase().includes(query.toLowerCase())
      )
    : quickActions;

  return (
    <div className="fixed inset-0 z-[3000] bg-slate-950/80 backdrop-blur-md flex items-start justify-center pt-20 px-4">
      <div className="bg-slate-900 border border-slate-700/80 rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden text-white animate-scale-up">
        {/* Search Bar Input */}
        <div className="p-4 border-b border-slate-800 flex items-center gap-3 bg-slate-900/90">
          <Search className="w-5 h-5 text-cyan-400 shrink-0" />
          <input
            type="text"
            autoFocus
            placeholder="Type a ULPIN, Owner Name, Village, or Command (e.g. 'EC', 'Lien', '14829304812901')..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent text-sm text-white placeholder-slate-400 focus:outline-none font-mono"
          />
          <kbd className="hidden sm:inline-flex items-center gap-1 bg-slate-800 border border-slate-700 px-2 py-0.5 rounded-lg text-[10px] text-slate-400 font-mono">
            ESC
          </kbd>
        </div>

        {/* Search Results list */}
        <div className="max-h-[60vh] overflow-y-auto p-4 space-y-4 text-xs">
          {/* Matching Land Parcels */}
          {filteredParcels.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2">
                <span>Land Parcels ({filteredParcels.length})</span>
                <span>Bhu-Aadhaar Records</span>
              </div>
              <div className="space-y-1.5">
                {filteredParcels.map((parcel) => (
                  <div
                    key={parcel.id}
                    onClick={() => {
                      onSelectParcel(parcel);
                      setActiveView('map');
                      onClose();
                      if (showToast) showToast(`Selected ULPIN ${parcel.ulpin} (${parcel.owner.name})`, 'info');
                    }}
                    className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800 hover:border-cyan-500/50 hover:bg-slate-800/80 cursor-pointer transition-all flex items-center justify-between group"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                        <Map className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white font-mono">{parcel.ulpin}</span>
                          <span className="px-2 py-0.5 rounded-full text-[10px] bg-slate-800 text-slate-300 border border-slate-700">
                            {parcel.surveyNo}
                          </span>
                          {parcel.financial.isEncumbered && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] bg-rose-500/20 text-rose-300 border border-rose-500/30 font-bold">
                              Lien Active
                            </span>
                          )}
                        </div>
                        <p className="text-slate-400 text-[11px]">
                          Owner: <span className="text-slate-200">{parcel.owner.name}</span> • {parcel.village}, {parcel.district} ({parcel.areaSqFt.toLocaleString()} sq.ft)
                        </p>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-0.5 transition-all" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Quick Navigation Commands */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2">
              <span>Quick Commands & Modules</span>
              <span>DPI Engine</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {filteredActions.map((action, idx) => {
                const Icon = action.icon;
                return (
                  <div
                    key={idx}
                    onClick={() => {
                      setActiveView(action.view);
                      onClose();
                      if (showToast) showToast(`Navigated to ${action.label}`, 'success');
                    }}
                    className="p-3 rounded-2xl bg-slate-950/40 border border-slate-800/80 hover:border-blue-500/50 hover:bg-slate-800/60 cursor-pointer transition-all flex items-center space-x-3 group"
                  >
                    <div className="w-8 h-8 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-slate-200 text-xs truncate group-hover:text-white">{action.label}</p>
                      <p className="text-slate-400 text-[10px] truncate">{action.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer Hint Bar */}
        <div className="p-3 border-t border-slate-800 bg-slate-950 text-[10px] text-slate-500 flex items-center justify-between px-4">
          <span className="flex items-center gap-1.5 font-mono">
            <Command className="w-3.5 h-3.5 text-cyan-400" />
            <span>Search ULPIN or navigate anywhere in 1-click</span>
          </span>
          <span className="font-mono text-cyan-400 font-bold">SIH 2026 • Quantam Coders</span>
        </div>
      </div>
    </div>
  );
}
