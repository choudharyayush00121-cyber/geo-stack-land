import React from 'react';
import {
  Map,
  ShieldCheck,
  Lock,
  Building,
  FileCheck,
  Eye,
  Calculator,
  Copy,
  Printer,
  X,
  Sparkles,
  ExternalLink,
  Award,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';

export default function ParcelInspectorModal({
  parcel,
  onClose,
  onGenerateEC,
  onToggleLien,
  onRunAIScan,
  showToast
}) {
  if (!parcel) return null;

  const handleCopyUlpin = () => {
    navigator.clipboard.writeText(parcel.ulpin);
    if (showToast) showToast(`ULPIN ${parcel.ulpin} copied to clipboard!`, 'success');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-[2500] bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden text-white space-y-6 max-h-[90vh] flex flex-col animate-scale-up">
        {/* Modal Header */}
        <div className="p-6 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 font-bold shadow-lg shadow-cyan-500/10">
              <Map className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-mono font-extrabold text-base text-white tracking-wider">
                  ULPIN {parcel.ulpin}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-bold">
                  Verified Bhu-Aadhaar
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                {parcel.surveyNo} • {parcel.village}, {parcel.district}, {parcel.state}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center font-bold transition-all"
          >
            ✕
          </button>
        </div>

        {/* Modal Body Scroll Area */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1 text-xs">
          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 space-y-1">
              <p className="text-[10px] text-slate-400 uppercase font-semibold">Land Area</p>
              <p className="font-extrabold text-white text-sm">{parcel.areaSqFt.toLocaleString()} sq.ft</p>
              <p className="text-[9px] text-slate-500 font-mono">({(parcel.areaSqFt / 43560).toFixed(2)} Acres)</p>
            </div>
            <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 space-y-1">
              <p className="text-[10px] text-slate-400 uppercase font-semibold">Circle Rate</p>
              <p className="font-extrabold text-amber-400 text-sm">₹{parcel.circleRatePerSqFt.toLocaleString()}/sq.ft</p>
              <p className="text-[9px] text-slate-500">Government Standard</p>
            </div>
            <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 space-y-1">
              <p className="text-[10px] text-slate-400 uppercase font-semibold">Zoning Classification</p>
              <p className="font-extrabold text-cyan-400 text-sm">{parcel.zoning}</p>
              <p className="text-[9px] text-slate-500">Masterplan Approved</p>
            </div>
            <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 space-y-1">
              <p className="text-[10px] text-slate-400 uppercase font-semibold">Mortgage Status</p>
              <p className={`font-extrabold text-sm ${parcel.financial.isEncumbered ? 'text-rose-400' : 'text-emerald-400'}`}>
                {parcel.financial.isEncumbered ? 'Lien Active' : 'Clear Title'}
              </p>
              <p className="text-[9px] text-slate-500 font-mono">{parcel.financial.bankLien || 'No Bank Encumbrance'}</p>
            </div>
          </div>

          {/* Owner & Legal Records Section */}
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-3">
            <h4 className="font-bold text-slate-200 text-xs border-b border-slate-800 pb-2 flex items-center justify-between">
              <span>Land Title & Registration Details</span>
              <button
                onClick={handleCopyUlpin}
                className="text-cyan-400 hover:text-cyan-300 text-[10px] flex items-center gap-1 font-mono"
              >
                <Copy className="w-3 h-3" />
                <span>Copy ULPIN</span>
              </button>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-slate-500 block text-[10px]">Registered Owner Name:</span>
                <span className="font-bold text-white text-sm">{parcel.owner.name}</span>
                <p className="text-[10px] text-slate-400">UID: {parcel.owner.aadhaarMasked || 'XXXX-XXXX-8912'}</p>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">Sale Deed Document No:</span>
                <span className="font-mono font-bold text-slate-200">{parcel.owner.deedNo}</span>
                <p className="text-[10px] text-slate-400">Sub-Registrar Office: {parcel.district}</p>
              </div>
            </div>
          </div>

          {/* AI Surveillance & Discrepancy Status */}
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-3">
            <h4 className="font-bold text-slate-200 text-xs border-b border-slate-800 pb-2 flex items-center gap-2">
              <Eye className="w-4 h-4 text-indigo-400" />
              <span>ISRO Satellite & Drone Change Scan</span>
            </h4>

            <div className="flex items-center justify-between text-xs">
              <div className="space-y-1">
                <p className="text-slate-300 font-semibold">{parcel.aiSurveillance.detectedViolation}</p>
                <p className="text-[10px] text-slate-400">
                  Risk Assessment Score: <span className="font-mono font-bold text-amber-400">{parcel.aiSurveillance.riskScore}/100</span>
                </p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                parcel.aiSurveillance.encroachmentDetected
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                  : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
              }`}>
                {parcel.aiSurveillance.encroachmentDetected ? 'Encroachment Flagged' : 'Normal Cadastral Pass'}
              </span>
            </div>
          </div>

          {/* Quick Action Button Group */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <button
              onClick={() => {
                onGenerateEC(parcel);
                onClose();
              }}
              className="py-3 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold flex items-center justify-center gap-2 transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg shadow-emerald-600/30 hover:shadow-emerald-500/50"
            >
              <FileCheck className="w-4 h-4" />
              <span>Generate Form 15 EC</span>
            </button>

            <button
              onClick={() => {
                onToggleLien(parcel);
              }}
              className={`py-3 px-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg ${
                parcel.financial.isEncumbered
                  ? 'bg-slate-800 hover:bg-slate-700 text-rose-300 border border-rose-500/40 hover:shadow-rose-500/30'
                  : 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-600/30 hover:shadow-rose-500/50'
              }`}
            >
              <Lock className="w-4 h-4" />
              <span>{parcel.financial.isEncumbered ? 'Release Mortgage Lien' : 'Apply Bank Lien Lock'}</span>
            </button>

            <button
              onClick={() => {
                onRunAIScan(parcel);
                onClose();
              }}
              className="py-3 px-4 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold flex items-center justify-center gap-2 transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg shadow-indigo-600/30 hover:shadow-indigo-500/50"
            >
              <Eye className="w-4 h-4" />
              <span>Run AI Temporal CV Scan</span>
            </button>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
          <button
            onClick={handlePrint}
            className="text-slate-300 hover:text-white flex items-center gap-1.5 font-semibold"
          >
            <Printer className="w-3.5 h-3.5 text-cyan-400" />
            <span>Print Official Parcel Card</span>
          </button>
          <span className="font-mono text-cyan-400">GeoLand DPI Cryptographic Proof</span>
        </div>
      </div>
    </div>
  );
}
