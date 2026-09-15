import React from 'react';
import {
  MapPin,
  Compass,
  Navigation,
  ShieldCheck,
  Lock,
  Building,
  AlertTriangle,
  FileCheck,
  Layers,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  X,
  Target,
  Search
} from 'lucide-react';

export default function SurroundingAreaModal({
  isOpen,
  onClose,
  userGpsPos,
  surroundingScanData,
  onSelectParcel
}) {
  if (!isOpen || !surroundingScanData) return null;

  const { userLocation, scanSummary, nearbyParcels } = surroundingScanData;

  return (
    <div className="fixed inset-0 z-[2800] bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-3xl w-full shadow-2xl overflow-hidden text-white flex flex-col max-h-[90vh] animate-scale-up">
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-blue-950 via-slate-900 to-cyan-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/20 border border-blue-400/40 flex items-center justify-center text-cyan-300 font-bold shadow-lg shadow-blue-500/20">
              <Target className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-lg text-white">
                  {userLocation?.areaName ? `${userLocation.areaName} - Surrounding Audit` : 'Live Location & Surrounding Area Audit'}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold">
                  GPS Active
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5 font-mono">
                {userLocation?.informations ? `${userLocation.informations} • ` : ''} 
                Coordinates: {userLocation?.lat?.toFixed(5)}° N, {userLocation?.lng?.toFixed(5)}° E • Accuracy Radius: ±{userGpsPos?.accuracy ? Math.round(userGpsPos.accuracy) : 15}m
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

        {/* Modal Content Scroll Area */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1 text-xs">
          {/* Summary Key Statistics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 space-y-1">
              <span className="text-[10px] text-slate-400 uppercase font-semibold flex items-center gap-1">
                <Layers className="w-3.5 h-3.5 text-cyan-400" />
                Parcels Found
              </span>
              <p className="font-extrabold text-white text-base">{scanSummary?.totalParcelsFound || 0} Plots</p>
              <p className="text-[9px] text-slate-500 font-mono">Within {scanSummary?.scannedRadiusMeters || 5}m Radius</p>
            </div>

            <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 space-y-1">
              <span className="text-[10px] text-slate-400 uppercase font-semibold flex items-center gap-1">
                <Navigation className="w-3.5 h-3.5 text-blue-400" />
                Nearest Parcel
              </span>
              <p className="font-extrabold text-cyan-300 text-base">{scanSummary?.nearestDistanceMeters || 0} meters</p>
              <p className="text-[9px] text-slate-500 font-mono truncate">ULPIN {scanSummary?.nearestUlpin}</p>
            </div>

            <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 space-y-1">
              <span className="text-[10px] text-slate-400 uppercase font-semibold flex items-center gap-1">
                <Building className="w-3.5 h-3.5 text-amber-400" />
                Avg Circle Rate
              </span>
              <p className="font-extrabold text-amber-400 text-base">₹{scanSummary?.avgCircleRatePerSqFt?.toLocaleString()}/sq.ft</p>
              <p className="text-[9px] text-slate-500">Area Standard</p>
            </div>

            <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 space-y-1">
              <span className="text-[10px] text-slate-400 uppercase font-semibold flex items-center gap-1">
                <Lock className="w-3.5 h-3.5 text-rose-400" />
                Encumbrance Ratio
              </span>
              <p className="font-extrabold text-rose-300 text-base">{scanSummary?.encumberedRatioPct}%</p>
              <p className="text-[9px] text-slate-500">Bank Lien Active</p>
            </div>
          </div>

          {/* Surrounding Area Land Parcels List */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-slate-200 text-xs flex items-center gap-2">
                <MapPin className="w-4 h-4 text-cyan-400" />
                <span>Surrounding Land Parcels (Ordered by Distance from User)</span>
              </h4>
              <span className="text-[10px] text-slate-500 font-mono">5m Proximity Radius</span>
            </div>

            <div className="space-y-2">
              {nearbyParcels && nearbyParcels.map((parcel) => (
                <div
                  key={parcel.id}
                  className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 hover:border-cyan-500/50 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-sm font-mono">{parcel.ulpin}</span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] bg-blue-500/20 text-blue-300 font-bold border border-blue-500/30">
                        {parcel.distanceMeters}m away
                      </span>
                      {parcel.financial.isEncumbered ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] bg-rose-500/20 text-rose-300 font-bold border border-rose-500/30">
                          Lien Active
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                          Clear Title
                        </span>
                      )}
                    </div>
                    <p className="text-slate-400 text-xs">
                      Owner: <span className="font-semibold text-slate-200">{parcel.owner.name}</span> • Survey No: <span className="font-mono text-slate-300">{parcel.surveyNo}</span> ({parcel.areaSqFt.toLocaleString()} sq.ft)
                    </p>
                    <p className="text-[10px] text-slate-500">
                      Zoning: <span className="text-cyan-400">{parcel.zoning}</span> • Village: {parcel.village}, {parcel.district}
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      onSelectParcel(parcel);
                      onClose();
                    }}
                    className="py-2 px-3.5 rounded-xl bg-slate-800 hover:bg-cyan-600 text-white font-bold text-xs flex items-center justify-center space-x-1.5 transition-all shadow shrink-0"
                  >
                    <span>Inspect Parcel</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
          <span className="font-mono text-slate-500">GeoLand Stack Real-Time GPS Spatial Engine</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold text-xs"
          >
            Close Panel
          </button>
        </div>
      </div>
    </div>
  );
}
