import React, { useState, useEffect, useRef } from 'react';
import {
  Layers,
  Box,
  Compass,
  RotateCw,
  Eye,
  Activity,
  ShieldCheck,
  Radio,
  Zap,
  Maximize2,
  Minimize2,
  RefreshCw,
  Cpu,
  Scan,
  AlertTriangle,
  FileCheck,
  ChevronRight,
  TrendingUp,
  MapPin,
  Sparkles
} from 'lucide-react';
import Interactive3DCard from './Interactive3DCard';

export default function DigitalTwin3DViewer({ parcels = [], selectedParcel, onSelectParcel }) {
  const [pitch, setPitch] = useState(55); // rotateX
  const [yaw, setYaw] = useState(-32);   // rotateZ
  const [zoom, setZoom] = useState(1);
  const [layerExplosion, setLayerExplosion] = useState(36); // px layer separation
  const [autoRotate, setAutoRotate] = useState(true);
  const [viewMode, setViewMode] = useState('twin'); // 'twin' | 'lidar' | 'thermal'
  const [activeLayer, setActiveLayer] = useState('all');
  const [isScanning, setIsScanning] = useState(true);
  const [activeParcelState, setActiveParcelState] = useState(
    selectedParcel || (parcels.length > 0 ? parcels[0] : null)
  );

  // Sync selected parcel prop
  useEffect(() => {
    if (selectedParcel) {
      setActiveParcelState(selectedParcel);
    } else if (parcels.length > 0 && !activeParcelState) {
      setActiveParcelState(parcels[0]);
    }
  }, [selectedParcel, parcels]);

  // Auto-rotation effect
  useEffect(() => {
    if (!autoRotate) return;
    const interval = setInterval(() => {
      setYaw((prev) => (prev + 0.4) % 360);
    }, 50);
    return () => clearInterval(interval);
  }, [autoRotate]);

  const p = activeParcelState || {
    ulpin: '14829304812901',
    plotNo: 'PLOT-742',
    surveyNumber: 'SY-104/2B',
    owner: { name: 'Dr. Vikramaditya Sharma', aadharHash: 'a89c...4f91' },
    areaSqMeters: 4850,
    zoning: 'Mixed Residential / Commercial (R-2)',
    financial: { isEncumbered: false, bankName: 'SBI - DPI Locked' },
    disputes: []
  };

  const getThemeColors = () => {
    if (viewMode === 'lidar') {
      return {
        accent: 'text-amber-400',
        bg: 'from-slate-950 via-amber-950/20 to-slate-950',
        border: 'border-amber-500/30',
        glow: 'glow-cyan-sm'
      };
    }
    if (viewMode === 'thermal') {
      return {
        accent: 'text-rose-400',
        bg: 'from-slate-950 via-rose-950/20 to-slate-950',
        border: 'border-rose-500/30',
        glow: 'glow-purple-sm'
      };
    }
    return {
      accent: 'text-cyan-400',
      bg: 'from-slate-950 via-cyan-950/20 to-slate-950',
      border: 'border-cyan-500/30',
      glow: 'glow-cyan-lg'
    };
  };

  const theme = getThemeColors();

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* 3D Visualizer Top Header */}
      <div className="bg-slate-900/90 border border-slate-800 backdrop-blur rounded-2xl p-5 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-cyan-400" />
              <span>3D Digital Twin Engine v3.0</span>
            </span>
            <span className="text-xs text-slate-400 font-mono">Bhu-Aadhaar Spatial Core</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white mt-1 flex items-center gap-2">
            <Box className="w-6 h-6 text-cyan-400 animate-pulse" />
            <span>Volumetric 3D Cadastre & Digital Twin</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Exploded strata multi-layer inspection: Subsurface Aquifer, 14-Digit ULPIN Ground Mesh, Extruded Structure Twin & Drone Telemetry.
          </p>
        </div>

        {/* View Mode & Auto Rotate Controls */}
        <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
          <div className="bg-slate-950 p-1 rounded-xl border border-slate-800 flex items-center gap-1">
            <button
              onClick={() => setViewMode('twin')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                viewMode === 'twin'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Digital Twin
            </button>
            <button
              onClick={() => setViewMode('lidar')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                viewMode === 'lidar'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              LiDAR Cloud
            </button>
            <button
              onClick={() => setViewMode('thermal')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                viewMode === 'thermal'
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Thermal IR
            </button>
          </div>

          <button
            onClick={() => setAutoRotate(!autoRotate)}
            className={`px-3 py-2 rounded-xl border flex items-center gap-1.5 transition-all ${
              autoRotate
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 font-bold'
                : 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700'
            }`}
          >
            <RotateCw className={`w-3.5 h-3.5 ${autoRotate ? 'animate-spin' : ''}`} />
            <span>{autoRotate ? 'Orbit Active' : 'Orbit Paused'}</span>
          </button>
        </div>
      </div>

      {/* Main 3D Stage & Telemetry Split View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* 3D Viewport Canvas */}
        <div className="lg:col-span-8 bg-slate-950 border border-slate-800 rounded-2xl p-6 relative overflow-hidden min-h-[560px] flex flex-col justify-between shadow-2xl group">
          {/* Cyber Background Grid & Subtle Ambient Glow */}
          <div className="absolute inset-0 bg-cyber-grid opacity-30 pointer-events-none" />
          <div className="absolute -top-24 -left-24 w-80 h-80 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-80 h-80 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />

          {/* Top Stage Overlay HUD Controls */}
          <div className="relative z-20 flex items-center justify-between gap-2">
            <div className="flex items-center space-x-2">
              <span className="bg-slate-900/90 text-cyan-300 border border-cyan-500/30 px-3 py-1 rounded-xl text-xs font-mono flex items-center gap-2 backdrop-blur shadow-lg">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
                <span>3D STRATA PERSPECTIVE</span>
              </span>
              <button
                onClick={() => setIsScanning(!isScanning)}
                className={`px-2.5 py-1 rounded-xl border text-[11px] font-mono transition-all backdrop-blur ${
                  isScanning
                    ? 'bg-cyan-900/40 text-cyan-300 border-cyan-500/40'
                    : 'bg-slate-900/80 text-slate-400 border-slate-800'
                }`}
              >
                {isScanning ? '⚡ LiDAR Laser ON' : 'Laser OFF'}
              </button>
            </div>

            {/* Quick Presets */}
            <div className="flex items-center gap-1.5 text-[10px] font-mono">
              <button
                onClick={() => {
                  setPitch(55);
                  setYaw(-35);
                  setLayerExplosion(36);
                }}
                className="bg-slate-900/80 hover:bg-slate-800 text-slate-300 px-2 py-1 rounded-lg border border-slate-700 transition-all"
              >
                Isometric 45°
              </button>
              <button
                onClick={() => {
                  setPitch(0);
                  setYaw(0);
                  setLayerExplosion(0);
                }}
                className="bg-slate-900/80 hover:bg-slate-800 text-slate-300 px-2 py-1 rounded-lg border border-slate-700 transition-all"
              >
                Top-Down 2D
              </button>
              <button
                onClick={() => {
                  setPitch(65);
                  setYaw(-45);
                  setLayerExplosion(70);
                }}
                className="bg-slate-900/80 hover:bg-cyan-900/50 text-cyan-300 px-2 py-1 rounded-lg border border-cyan-500/30 transition-all"
              >
                Exploded 3D
              </button>
            </div>
          </div>

          {/* Central 3D Spatial Canvas Stage */}
          <div className="relative z-10 my-auto py-12 flex items-center justify-center perspective-1000 select-none">
            {/* The 3D Rotating Pivot Container */}
            <div
              style={{
                transform: `rotateX(${pitch}deg) rotateZ(${yaw}deg) scale(${zoom})`,
                transformStyle: 'preserve-3d',
                transition: autoRotate ? 'transform 0.05s linear' : 'transform 0.2s ease-out'
              }}
              className="relative w-80 h-80 sm:w-96 sm:h-96 preserve-3d"
            >
              {/* LAYER 0: Subsurface Aquifer & Seismic Bedrock (Lowest Layer) */}
              <div
                style={{
                  transform: `translateZ(-${layerExplosion * 1.5}px)`,
                  transformStyle: 'preserve-3d'
                }}
                className="absolute inset-0 rounded-2xl border-2 border-indigo-500/30 bg-gradient-to-tr from-indigo-950/70 via-slate-950/80 to-purple-950/60 backdrop-blur-sm shadow-2xl p-4 flex flex-col justify-between"
              >
                <div className="flex justify-between items-center text-[10px] font-mono text-indigo-400">
                  <span className="flex items-center gap-1 font-bold">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-400"></span>
                    STRATA-0: SUBSURFACE AQUIFER
                  </span>
                  <span>-18.5m Depth</span>
                </div>
                {/* Geological Grid Lines */}
                <div className="grid grid-cols-4 gap-2 h-32 opacity-40">
                  <div className="border border-indigo-500/40 rounded-lg flex items-center justify-center text-[9px] text-indigo-300 font-mono">Basalt</div>
                  <div className="border border-indigo-500/40 rounded-lg flex items-center justify-center text-[9px] text-indigo-300 font-mono">Aquifer</div>
                  <div className="border border-indigo-500/40 rounded-lg flex items-center justify-center text-[9px] text-indigo-300 font-mono">Clay</div>
                  <div className="border border-indigo-500/40 rounded-lg flex items-center justify-center text-[9px] text-indigo-300 font-mono">Silt</div>
                </div>
                <div className="text-[10px] text-indigo-300 font-mono flex justify-between">
                  <span>Soil Stability: 94.8%</span>
                  <span>Groundwater: Normal</span>
                </div>
              </div>

              {/* LAYER 1: Ground Cadastral Cadastre Mesh (Surface) */}
              <div
                style={{
                  transform: 'translateZ(0px)',
                  transformStyle: 'preserve-3d'
                }}
                className={`absolute inset-0 rounded-2xl border-2 ${
                  viewMode === 'lidar'
                    ? 'border-amber-500/60 bg-amber-950/30'
                    : viewMode === 'thermal'
                    ? 'border-rose-500/60 bg-rose-950/30'
                    : 'border-cyan-400/60 bg-slate-900/80'
                } backdrop-blur shadow-2xl p-4 flex flex-col justify-between relative overflow-hidden`}
              >
                {/* Cadastral Polygon Boundaries & Grid */}
                <div className="absolute inset-0 bg-cyber-grid opacity-50" />
                {isScanning && (
                  <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_15px_#22d3ee] animate-laser-scan" />
                )}

                <div className="relative z-10 flex justify-between items-center text-[10px] font-mono text-cyan-300">
                  <span className="font-extrabold flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
                    STRATA-1: 14-DIGIT ULPIN SURFACE
                  </span>
                  <span className="bg-cyan-500/20 px-2 py-0.5 rounded border border-cyan-500/40 font-bold">
                    {p.plotNo}
                  </span>
                </div>

                {/* Simulated Boundary Coordinates Markers */}
                <div className="relative z-10 my-auto grid grid-cols-2 gap-4 text-[10px] font-mono">
                  <div className="bg-slate-950/70 p-2 rounded-lg border border-slate-800">
                    <span className="text-slate-400">ULPIN:</span>
                    <p className="text-cyan-300 font-bold truncate">{p.ulpin}</p>
                  </div>
                  <div className="bg-slate-950/70 p-2 rounded-lg border border-slate-800">
                    <span className="text-slate-400">Area:</span>
                    <p className="text-emerald-300 font-bold">{p.areaSqMeters} m²</p>
                  </div>
                </div>

                <div className="relative z-10 flex justify-between items-center text-[9px] font-mono text-slate-400 border-t border-slate-800/80 pt-2">
                  <span>WGS-84 Cadastre Active</span>
                  <span className="text-emerald-400 font-bold">Bhu-Aadhaar Verified</span>
                </div>
              </div>

              {/* LAYER 2: 3D Extruded Built Structures (Building Digital Twin) */}
              <div
                style={{
                  transform: `translateZ(${layerExplosion}px)`,
                  transformStyle: 'preserve-3d'
                }}
                className="absolute inset-6 rounded-xl border border-dashed border-cyan-500/40 bg-cyan-950/20 backdrop-blur-sm pointer-events-none flex items-center justify-center"
              >
                {/* 3D Extruded Box simulation */}
                <div
                  style={{
                    transform: 'translateZ(25px)',
                    transformStyle: 'preserve-3d'
                  }}
                  className="w-32 h-32 rounded-xl bg-gradient-to-tr from-cyan-600/40 to-blue-600/30 border-2 border-cyan-400/80 shadow-[0_0_30px_rgba(6,182,212,0.3)] flex flex-col items-center justify-center text-center p-2"
                >
                  <Box className="w-8 h-8 text-cyan-300 mb-1" />
                  <span className="text-[10px] font-mono font-bold text-white">G+2 Structure</span>
                  <span className="text-[8px] font-mono text-cyan-200">Ht: 9.8m • FAR: 1.75</span>
                </div>
              </div>

              {/* LAYER 3: Drone Flight Path & Telemetry Vector Cone (Airspace) */}
              <div
                style={{
                  transform: `translateZ(${layerExplosion * 2.2}px)`,
                  transformStyle: 'preserve-3d'
                }}
                className="absolute inset-0 rounded-full border border-dashed border-cyan-400/30 pointer-events-none flex items-center justify-center"
              >
                {/* Radar Sweep Ring */}
                <div className="w-48 h-48 rounded-full border-2 border-cyan-500/20 relative animate-radar-sweep">
                  <div className="absolute top-0 left-1/2 w-0.5 h-24 bg-gradient-to-t from-cyan-400 to-transparent"></div>
                </div>

                {/* Floating VTOL Drone Marker */}
                <div
                  style={{ transform: 'translateZ(20px)' }}
                  className="absolute top-4 right-8 bg-slate-900 border border-cyan-400 px-2.5 py-1 rounded-xl shadow-xl flex items-center gap-1.5 text-[10px] font-mono text-cyan-300"
                >
                  <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                  <span>DRONE-VTOL #04 (45m)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Interactive Transform Controls Panel */}
          <div className="relative z-20 bg-slate-900/90 border border-slate-800 backdrop-blur-md rounded-xl p-3 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono">
            <div>
              <div className="flex justify-between text-slate-400 mb-1">
                <span>Pitch (Tilt)</span>
                <span className="text-cyan-400">{pitch}°</span>
              </div>
              <input
                type="range"
                min="0"
                max="85"
                value={pitch}
                onChange={(e) => setPitch(Number(e.target.value))}
                className="w-full h-1 bg-slate-800 rounded-lg accent-cyan-400 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-slate-400 mb-1">
                <span>Yaw (Rotate)</span>
                <span className="text-cyan-400">{Math.round(yaw)}°</span>
              </div>
              <input
                type="range"
                min="0"
                max="360"
                value={yaw}
                onChange={(e) => setYaw(Number(e.target.value))}
                className="w-full h-1 bg-slate-800 rounded-lg accent-cyan-400 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-slate-400 mb-1">
                <span>Strata Explode</span>
                <span className="text-cyan-400">{layerExplosion}px</span>
              </div>
              <input
                type="range"
                min="0"
                max="80"
                value={layerExplosion}
                onChange={(e) => setLayerExplosion(Number(e.target.value))}
                className="w-full h-1 bg-slate-800 rounded-lg accent-cyan-400 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-slate-400 mb-1">
                <span>Zoom Scale</span>
                <span className="text-cyan-400">{zoom.toFixed(1)}x</span>
              </div>
              <input
                type="range"
                min="0.7"
                max="1.5"
                step="0.1"
                value={zoom}
                onChange={(e) => setZoom(Number(e.target.value))}
                className="w-full h-1 bg-slate-800 rounded-lg accent-cyan-400 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Right Telemetry & Parcel Inspector Sidebar */}
        <div className="lg:col-span-4 space-y-4">
          {/* Active 3D Parcel Card */}
          <Interactive3DCard maxTilt={10} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase">Cadastral Digital Twin</span>
                <h3 className="text-base font-extrabold text-white">{p.plotNo} • {p.surveyNumber}</h3>
              </div>
              <span className={`text-[10px] px-2 py-0.5 rounded font-mono font-bold ${
                p.financial?.isEncumbered
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                  : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
              }`}>
                {p.financial?.isEncumbered ? 'Lien Locked' : 'Free Title'}
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between items-center py-1 border-b border-slate-800/60">
                <span className="text-slate-400">14-Digit ULPIN</span>
                <span className="font-mono text-cyan-300 font-bold">{p.ulpin}</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Primary Holder</span>
                <span className="text-white font-medium">{p.owner?.name || 'Verified Citizen'}</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Calculated Area</span>
                <span className="font-mono text-white">{p.areaSqMeters} sq.m (~{(p.areaSqMeters / 4046.86).toFixed(2)} Acres)</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Permitted Zoning</span>
                <span className="text-purple-300">{p.zoning}</span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-slate-400">Subsurface Permeability</span>
                <span className="text-emerald-400 font-mono font-bold">Class A (Stable)</span>
              </div>
            </div>

            {/* Quick Action Badges */}
            <div className="grid grid-cols-2 gap-2 pt-2 text-[11px] font-mono">
              <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 text-center">
                <span className="text-slate-400 text-[10px]">Title Health</span>
                <div className="text-emerald-400 font-bold mt-0.5">99.8% Perfect</div>
              </div>
              <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 text-center">
                <span className="text-slate-400 text-[10px]">Encroachment</span>
                <div className="text-cyan-300 font-bold mt-0.5">0.00% Zero Drift</div>
              </div>
            </div>
          </Interactive3DCard>

          {/* Quick Parcel Selector Switcher */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
            <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
              <span>Select Parcel Model</span>
              <span className="text-cyan-400">{parcels.length} Available</span>
            </span>

            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
              {parcels.map((parcel) => (
                <div
                  key={parcel.ulpin}
                  onClick={() => {
                    setActiveParcelState(parcel);
                    if (onSelectParcel) onSelectParcel(parcel);
                  }}
                  className={`p-2.5 rounded-xl cursor-pointer transition-all flex items-center justify-between border ${
                    activeParcelState?.ulpin === parcel.ulpin
                      ? 'bg-cyan-950/40 border-cyan-500/40 text-cyan-300 shadow-md'
                      : 'bg-slate-950/60 border-slate-800/80 text-slate-400 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <div className="min-w-0">
                    <p className="text-xs font-bold truncate text-white">{parcel.plotNo} • {parcel.surveyNumber}</p>
                    <p className="text-[10px] font-mono truncate text-slate-400">{parcel.owner?.name}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-500 flex-shrink-0" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
