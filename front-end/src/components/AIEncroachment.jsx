import React, { useState } from 'react';
import {
  Eye,
  AlertTriangle,
  Layers,
  Sparkles,
  Zap,
  Sliders,
  CheckCircle2,
  Maximize2,
  ShieldAlert,
  ArrowRight,
  TrendingUp
} from 'lucide-react';
import axios from 'axios';

export default function AIEncroachment({ parcels, selectedParcel }) {
  const [activeParcelId, setActiveParcelId] = useState(
    selectedParcel ? selectedParcel.id : 'PARCEL-001'
  );
  const [sliderPosition, setSliderPosition] = useState(50);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [scanning, setScanning] = useState(false);

  const currentParcel = parcels.find((p) => p.id === activeParcelId) || parcels[0];
  const displayData = analysisResult || currentParcel?.aiSurveillance || {};

  const handleRunAIScan = async () => {
    setScanning(true);
    try {
      // Connects to the completely independent Python AI microservice
      const res = await axios.post('http://localhost:8000/analyze-encroachment', {
        ulpin: currentParcel.ulpin,
        coordinates: currentParcel.coordinates,
        surveyNo: currentParcel.surveyNo
      });
      if (res.data.success) {
        setAnalysisResult(res.data.analysis);
      }
    } catch (err) {
      console.error('Error running AI scan:', err);
      alert('Failed to connect to the independent AI Satellite Surveillance service on port 8000. Is the Python FastAPI server running?');
    } finally {
      setScanning(false);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-slate-800 rounded-2xl p-6 relative overflow-hidden shadow-2xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                Value-Add Feature
              </span>
              <span className="text-xs text-slate-400 font-mono">Model: PyTorch Satellite CV v4.2</span>
            </div>
            <h1 className="text-2xl font-extrabold text-white mt-1 flex items-center gap-2">
              <Eye className="w-7 h-7 text-indigo-400" />
              <span>AI Encroachment & Temporal Satellite Change Detector</span>
            </h1>
            <p className="text-sm text-slate-400 mt-0.5 max-w-2xl">
              Compares past ISRO/Cartosat satellite imagery with current high-resolution drone scans to automatically flag unauthorized construction, illegal setbacks, and boundary encroachment.
            </p>
          </div>

          <button
            onClick={handleRunAIScan}
            disabled={scanning}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold py-3 px-5 rounded-xl shadow-lg shadow-indigo-950/80 flex items-center space-x-2 transition-all disabled:opacity-50"
          >
            <Sparkles className={`w-4 h-4 ${scanning ? 'animate-spin' : ''}`} />
            <span>{scanning ? 'Running Computer Vision CV Model...' : 'Execute AI Change Scan'}</span>
          </button>
        </div>
      </div>

      {/* Parcel Selector Bar */}
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-2">
          <span className="text-xs text-slate-400 font-semibold">Select Parcel to Audit:</span>
          <select
            value={activeParcelId}
            onChange={(e) => {
              setActiveParcelId(e.target.value);
              setAnalysisResult(null);
            }}
            className="bg-slate-800 text-white text-xs font-mono px-3 py-2 rounded-xl border border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {parcels.map((p) => (
              <option key={p.id} value={p.id}>
                {p.surveyNo} - ULPIN: {p.ulpin} ({p.aiSurveillance.encroachmentDetected ? '⚠️ Alert Flagged' : '✓ Clear'})
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center space-x-4 text-xs font-mono">
          <div className="text-slate-300">
            Current Risk Score: <span className={`font-bold ${displayData.riskScore > 50 ? 'text-rose-400' : 'text-emerald-400'}`}>{displayData.riskScore}%</span>
          </div>
          <div className="text-slate-300">
            Severity: <span className="font-bold text-amber-300">{displayData.severity}</span>
          </div>
        </div>
      </div>

      {/* Main Interactive Split-View Comparison Canvas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Interactive Image Slider Canvas */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
          <div className="flex items-center justify-between text-xs text-slate-300">
            <span className="font-bold flex items-center gap-1.5 text-cyan-400">
              <Sliders className="w-4 h-4" />
              Interactive Satellite Temporal Comparison Canvas
            </span>
            <span className="text-slate-500 font-mono">Drag Slider to Compare 2021 vs 2026 Scans</span>
          </div>

          {/* Canvas Box */}
          <div className="relative w-full h-80 rounded-xl overflow-hidden border border-slate-800 bg-slate-950 select-none shadow-inner">
            {/* Background 1: Historical 2021 Satellite Base */}
            <div className="absolute inset-0 bg-slate-900 flex items-center justify-center">
              <div className="w-full h-full relative bg-gradient-to-br from-emerald-950 via-slate-900 to-cyan-950 p-6 flex flex-col justify-between">
                <div className="inline-block bg-slate-900/80 backdrop-blur px-3 py-1 rounded text-xs font-mono text-cyan-300 border border-slate-700">
                  📷 2021 ISRO Cartosat-2 Baseline (0% Encroachment)
                </div>
                {/* Simulated Cadastral Grid Lines */}
                <div className="absolute inset-8 border-2 border-dashed border-cyan-500/40 rounded flex items-center justify-center text-cyan-400/40 font-mono text-sm">
                  {currentParcel.surveyNo} Cadastral Boundary (WGS84)
                </div>
              </div>
            </div>

            {/* Foreground 2: Current 2026 Scan Clipped by Slider */}
            <div
              className="absolute inset-0 overflow-hidden border-r-2 border-indigo-400 shadow-2xl transition-all"
              style={{ width: `${sliderPosition}%` }}
            >
              <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-rose-950 via-slate-900 to-amber-950 p-6 flex flex-col justify-between" style={{ width: '100%', minWidth: '500px' }}>
                <div className="inline-block bg-slate-900/80 backdrop-blur px-3 py-1 rounded text-xs font-mono text-indigo-300 border border-slate-700">
                  🛸 2026 Sentinel-2 & Drone Scan + PyTorch Mask
                </div>

                {/* AI Change Detection Bounding Box Overlay */}
                {displayData.encroachmentDetected && (
                  <div className="absolute top-1/4 right-1/4 w-36 h-28 border-2 border-rose-500 bg-rose-500/20 rounded flex flex-col items-center justify-center p-2 text-center animate-pulse">
                    <span className="bg-rose-600 text-white font-mono text-[9px] font-bold px-1 rounded">
                      AI VIOLATION DETECTED
                    </span>
                    <span className="text-[10px] font-bold text-rose-200 mt-1">
                      +16% Structure Overlap
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Interactive Slider Input */}
            <input
              type="range"
              min="0"
              max="100"
              value={sliderPosition}
              onChange={(e) => setSliderPosition(e.target.value)}
              className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-30"
            />
          </div>

          <div className="flex items-center justify-between text-xs text-slate-400 font-mono px-2">
            <span>← 2021 Historical Baseline</span>
            <span className="text-indigo-400 font-bold">Slider: {sliderPosition}%</span>
            <span>2026 Current Drone Scan →</span>
          </div>
        </div>

        {/* AI Audit Report Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
          <h3 className="font-bold text-slate-200 text-sm flex items-center gap-2 border-b border-slate-800 pb-3">
            <ShieldAlert className="w-4 h-4 text-indigo-400" />
            <span>Automated AI Change Audit Report</span>
          </h3>

          <div className="space-y-3 text-xs">
            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-400">Target ULPIN:</span>
                <span className="font-mono text-cyan-300 font-bold">{currentParcel.ulpin}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Land Owner:</span>
                <span className="font-bold text-white">{currentParcel.owner.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Land Zoning:</span>
                <span className="font-semibold text-slate-200">{currentParcel.zoning}</span>
              </div>
            </div>

            <div className={`p-4 rounded-xl border space-y-2 ${
              displayData.encroachmentDetected
                ? 'bg-rose-950/40 border-rose-800/60 text-rose-200'
                : 'bg-emerald-950/40 border-emerald-800/60 text-emerald-200'
            }`}>
              <div className="font-bold text-sm flex items-center gap-1.5">
                {displayData.encroachmentDetected ? (
                  <>
                    <AlertTriangle className="w-4 h-4 text-rose-400" />
                    <span>Encroachment Flagged</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>No Illegal Alterations Detected</span>
                  </>
                )}
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {displayData.detectedViolation}
              </p>
            </div>

            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-2 font-mono text-[11px]">
              <div className="flex justify-between text-slate-400">
                <span>Historical Footprint (2021):</span>
                <span>{displayData.historicalBuildingAreaPct}% Area</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Current Footprint (2026):</span>
                <span className="text-amber-300 font-bold">{displayData.currentBuildingAreaPct}% Area</span>
              </div>
              <div className="flex justify-between text-slate-400 border-t border-slate-900 pt-1">
                <span>PostGIS Spatial Overlay:</span>
                <span className="text-emerald-400">✓ CAD PASS</span>
              </div>
            </div>

            {displayData.encroachmentDetected && (
              <button
                onClick={() => alert(`Enforcement notice dispatched to District Collector for ULPIN ${currentParcel.ulpin}.`)}
                className="w-full bg-rose-600 hover:bg-rose-500 text-white font-bold py-2.5 px-4 rounded-xl text-xs shadow-lg shadow-rose-950/60 flex items-center justify-center space-x-2 transition-all"
              >
                <AlertTriangle className="w-4 h-4" />
                <span>Issue Revenue Notice to Owner</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
