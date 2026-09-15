import React, { useState, useEffect } from 'react';
import {
  Network,
  Database,
  Building2,
  Landmark,
  ShieldCheck,
  Zap,
  CheckCircle,
  RefreshCw,
  ArrowRight,
  Lock,
  Radio,
  Code2,
  AlertOctagon,
  ShieldAlert,
  FileX,
  FileCheck2,
  Sparkles,
  ChevronRight,
  Fingerprint
} from 'lucide-react';
import axios from 'axios';
import Interactive3DCard from './Interactive3DCard';
import {
  playClickSound,
  playAlertBuzzer,
  playSuccessChime,
  playLockSound
} from '../utils/audioEffects';

export default function DPIGateway({ dpiStatus, fetchDPIStatus }) {
  const [simulatingSync, setSimulatingSync] = useState(false);
  const [selectedNode, setSelectedNode] = useState('bankingLienGateway');
  const [activeLog, setActiveLog] = useState([
    { id: 1, time: '21:18:02', source: 'State Bank of India', action: 'LIEN_LOCK_PROPAGATED', ulpin: '14829304812901', status: 'SUCCESS' },
    { id: 2, time: '21:18:14', source: 'Sub-Registrar Office', action: 'MUTATION_RECORD_SYNC', ulpin: '14829304812902', status: 'SUCCESS' },
    { id: 3, time: '21:18:25', source: 'PostGIS Spatial Engine', action: 'ULPIN_GEOJSON_OVERLAY', ulpin: '14829304812905', status: 'SUCCESS' }
  ]);

  // Fraud Simulator State
  const [simUlpin, setSimUlpin] = useState('14829304812901');
  const [simulatingFraud, setSimulatingFraud] = useState(false);
  const [fraudResult, setFraudResult] = useState(null);

  const sampleParcels = [
    { ulpin: '14829304812901', label: 'ULPIN 14829304812901 - Sy. 42/1A (SBI Lien: ₹4.5 Cr) [Shimla]' },
    { ulpin: '29104892019401', label: 'ULPIN 29104892019401 - Sy. 104/1A (HDFC Lien: ₹65 Cr) [Bengaluru]' },
    { ulpin: '29104892019402', label: 'ULPIN 29104892019402 - Sy. 104/1B (Lake Buffer Stay Order) [Bengaluru]' },
    { ulpin: '14829304812902', label: 'ULPIN 14829304812902 - Sy. 42/1B (100% Clear Title) [Shimla]' },
    { ulpin: '27084920194801', label: 'ULPIN 27084920194801 - Sy. 88/1 (Bank of Baroda Lien) [Pune]' }
  ];

  const handleSimulateSync = async () => {
    playClickSound();
    setSimulatingSync(true);
    await new Promise((r) => setTimeout(r, 1000));

    const newLogItem = {
      id: Date.now(),
      time: new Date().toLocaleTimeString(),
      source: 'DPI Open Gateway Bridge',
      action: 'REALTIME_MULTI_AGENCY_HANDSHAKE',
      ulpin: `1482930481290${Math.floor(Math.random() * 5 + 1)}`,
      status: 'VERIFIED'
    };

    setActiveLog((prev) => [newLogItem, ...prev.slice(0, 7)]);
    if (fetchDPIStatus) fetchDPIStatus();
    setSimulatingSync(false);
    playSuccessChime();
  };

  const handleTestFraudPrevention = async () => {
    playClickSound();
    setSimulatingFraud(true);
    setFraudResult(null);

    try {
      const res = await axios.post('/api/dpi/simulate-fraud', {
        ulpin: simUlpin,
        attemptType: 'UNAUTHORIZED_CONVEYANCE_REGISTRATION'
      });

      if (res.data) {
        setFraudResult(res.data);
        if (res.data.fraudPrevented) {
          playAlertBuzzer();
          const newLogItem = {
            id: Date.now(),
            time: new Date().toLocaleTimeString(),
            source: 'SRO Stamper Gateway Interceptor',
            action: '🚨 FRAUD_ATTEMPT_BLOCKED',
            ulpin: simUlpin,
            status: 'BLOCKED_BY_DPI_LOCK'
          };
          setActiveLog((prev) => [newLogItem, ...prev.slice(0, 7)]);
        } else {
          playSuccessChime();
          const newLogItem = {
            id: Date.now(),
            time: new Date().toLocaleTimeString(),
            source: 'Sub-Registrar Office',
            action: 'REGISTRATION_APPROVED_CLEAR_TITLE',
            ulpin: simUlpin,
            status: 'CONCLUSIVE_DEED_ISSUED'
          };
          setActiveLog((prev) => [newLogItem, ...prev.slice(0, 7)]);
        }
      }
    } catch (err) {
      console.error('Error simulating fraud attempt:', err);
    } finally {
      setSimulatingFraud(false);
    }
  };

  const nodes = [
    {
      id: 'landRevenueDept',
      title: 'Land Revenue Dept',
      role: 'Ownership & Mutation Registry',
      icon: Landmark,
      color: 'from-blue-600 to-cyan-600',
      apiEndpoint: '/api/v2/revenue/mutation-sync',
      protocol: 'JSON-RPC 2.0 / REST'
    },
    {
      id: 'subRegistrarOffice',
      title: 'Sub-Registrar Office (SRO)',
      role: 'Title Deed & Registration',
      icon: Building2,
      color: 'from-cyan-600 to-emerald-600',
      apiEndpoint: '/api/v2/sro/title-deed-lock',
      protocol: 'OpenAPI 3.0 / WGS84'
    },
    {
      id: 'bankingLienGateway',
      title: 'Banking Lien Gateway',
      role: 'Mortgage & Loan Encumbrance',
      icon: Lock,
      color: 'from-amber-600 to-rose-600',
      apiEndpoint: '/api/v2/bank/lien-lock-push',
      protocol: 'ISO 20022 / DPI Lock'
    },
    {
      id: 'municipalTaxEngine',
      title: 'Municipal Corporation',
      role: 'Property Tax & Building Plan',
      icon: Database,
      color: 'from-purple-600 to-indigo-600',
      apiEndpoint: '/api/v2/municipal/tax-dues',
      protocol: 'GraphQL / GeoJSON'
    }
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-cyan-950 to-slate-900 border border-slate-800 rounded-2xl p-6 relative overflow-hidden shadow-2xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                UPI-Style Land Infrastructure
              </span>
              <span className="text-xs text-slate-400 font-mono">Protocol: ULPIN-DPI-v2.6</span>
            </div>
            <h1 className="text-2xl font-extrabold text-white mt-2 flex items-center gap-2">
              <Network className="w-7 h-7 text-cyan-400" />
              <span>Interoperable DPI Open API Gateway</span>
            </h1>
            <p className="text-sm text-slate-400 mt-1 max-w-2xl">
              Eliminating isolated departmental silos. GeoLand Stack acts as a unified digital backbone connecting Revenue, Registration, Banking, Municipal, and Spatial databases in real-time.
            </p>
          </div>

          <button
            onClick={handleSimulateSync}
            disabled={simulatingSync}
            className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold py-3 px-5 rounded-xl shadow-lg shadow-cyan-950/80 flex items-center space-x-2 transition-all disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${simulatingSync ? 'animate-spin' : ''}`} />
            <span>{simulatingSync ? 'Syncing DPI Gateway...' : 'Trigger Multi-Agency Sync'}</span>
          </button>
        </div>
      </div>

      {/* Interactive Node Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {nodes.map((node) => {
          const Icon = node.icon;
          const isSelected = selectedNode === node.id;
          return (
            <Interactive3DCard
              key={node.id}
              maxTilt={10}
              onClick={() => {
                playClickSound();
                setSelectedNode(node.id);
              }}
              className={`p-5 rounded-2xl border transition-all cursor-pointer relative ${
                isSelected
                  ? 'bg-slate-800/95 border-cyan-500/80 ring-2 ring-cyan-500/30 shadow-[0_0_25px_rgba(6,182,212,0.35)]'
                  : 'bg-slate-900/70 border-slate-800 hover:border-slate-700 shadow-lg'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${node.color} flex items-center justify-center shadow-md translate-z-4`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <span className="flex items-center gap-1 text-[11px] text-emerald-400 font-mono font-medium">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  ONLINE (14ms)
                </span>
              </div>
              <h3 className="font-bold text-slate-100 text-base mt-3 translate-z-4">{node.title}</h3>
              <p className="text-xs text-slate-400 mt-0.5">{node.role}</p>
              <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-400">
                <span>{node.protocol}</span>
                <ArrowRight className="w-3.5 h-3.5 text-cyan-400" />
              </div>
            </Interactive3DCard>
          );
        })}
      </div>

      {/* CORE SIH DEMO: Live Interactive Multi-Agency Fraud Prevention Simulator */}
      <div className="bg-slate-900 border border-cyan-500/40 rounded-2xl p-6 shadow-2xl space-y-5 relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40 flex items-center gap-1">
                <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
                Core SIH Problem Statement 26014 Demonstration
              </span>
            </div>
            <h2 className="text-xl font-extrabold text-white mt-1 flex items-center gap-2">
              <span>Interactive Fraudulent Sale Prevention Simulator</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Simulate an illegal attempt by a borrower/seller to register a sale deed for land currently encumbered under a bank loan. Watch how the Sub-Registrar interceptor halts the deed in &lt;50ms.
            </p>
          </div>

          {/* Parcel Selection & Action Trigger */}
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
            <select
              value={simUlpin}
              onChange={(e) => {
                playClickSound();
                setSimUlpin(e.target.value);
                setFraudResult(null);
              }}
              className="bg-slate-800 text-white text-xs px-3.5 py-2.5 rounded-xl border border-slate-700 font-mono focus:outline-none focus:ring-2 focus:ring-cyan-500 w-full sm:w-auto"
            >
              {sampleParcels.map((sp) => (
                <option key={sp.ulpin} value={sp.ulpin}>
                  {sp.label}
                </option>
              ))}
            </select>

            <button
              onClick={handleTestFraudPrevention}
              disabled={simulatingFraud}
              className="bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white font-extrabold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center space-x-2 shadow-lg shadow-rose-950/60 transition-all w-full sm:w-auto whitespace-nowrap"
            >
              <AlertOctagon className="w-4 h-4" />
              <span>{simulatingFraud ? 'Querying DPI Interceptor...' : 'Attempt Sale Deed Registration'}</span>
            </button>
          </div>
        </div>

        {/* Live Fraud Simulation Result Card */}
        {fraudResult && (
          <div className="animate-in fade-in slide-in-from-top-3 duration-300">
            {fraudResult.fraudPrevented ? (
              <div className="p-5 rounded-2xl bg-gradient-to-r from-rose-950/80 via-slate-900 to-rose-950/80 border-2 border-rose-500/70 shadow-[0_0_30px_rgba(244,63,94,0.3)] space-y-3 font-mono">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-rose-400 font-extrabold text-sm">
                    <FileX className="w-5 h-5 text-rose-400 animate-pulse" />
                    <span>TRANSACTION REJECTED: MULTI-AGENCY ENCUMBRANCE DETECTED</span>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-500 text-slate-950">
                    FRAUD BLOCKED
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs text-slate-300 pt-2 border-t border-rose-900/50">
                  <div>
                    <span className="text-slate-400 block text-[10px]">TARGET ULPIN:</span>
                    <span className="text-white font-bold">{fraudResult.data.ulpin} ({fraudResult.data.surveyNo})</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">BLOCK REASON:</span>
                    <span className="text-amber-300 font-bold">{fraudResult.data.blockReason}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">ENCUMBERED AMOUNT:</span>
                    <span className="text-rose-300 font-bold">₹{fraudResult.data.loanAmountEncumbered ? fraudResult.data.loanAmountEncumbered.toLocaleString() : 'N/A'}</span>
                  </div>
                </div>

                <div className="bg-slate-950/80 p-3 rounded-xl border border-rose-900/40 text-[11px] text-slate-300 space-y-1">
                  <div className="flex items-center justify-between">
                    <span><strong>Statutory Barrier:</strong> {fraudResult.data.legalStatute}</span>
                    <span className="text-emerald-400 font-bold">⚡ Intercept Latency: 22ms</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-400">
                    <span><strong>Incident Token:</strong> {fraudResult.data.incidentId}</span>
                    <span className="font-mono text-cyan-300 text-[10px]">Audit: {fraudResult.data.auditSignature}</span>
                  </div>
                  <div className="text-[10px] text-amber-400 flex items-center gap-1.5 pt-1">
                    <Fingerprint className="w-3.5 h-3.5 text-amber-400" />
                    <span>{fraudResult.data.alertBroadcast}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-950/80 via-slate-900 to-emerald-950/80 border-2 border-emerald-500/70 shadow-[0_0_30px_rgba(16,185,129,0.3)] space-y-3 font-mono">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-emerald-400 font-extrabold text-sm">
                    <FileCheck2 className="w-5 h-5 text-emerald-400" />
                    <span>TRANSACTION APPROVED: 100% CONCLUSIVE TITLE VERIFIED</span>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500 text-slate-950">
                    CLEAR TITLE
                  </span>
                </div>

                <div className="text-xs text-slate-300 space-y-1">
                  <p>{fraudResult.message}</p>
                  <div className="flex items-center justify-between text-[11px] pt-2 border-t border-emerald-900/50">
                    <span><strong>Clearance Stamp:</strong> {fraudResult.clearanceToken}</span>
                    <span className="text-cyan-300">Automated Mutation Queued in Revenue RTC</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Real-time Architecture & API Inspector Split View */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Architecture Visualizer Box */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-200 text-sm flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" />
              <span>Real-Time Multi-Agency Lien Lock Architecture</span>
            </h3>
            <span className="text-xs text-slate-400 font-mono">14-Digit ULPIN Key Standard</span>
          </div>

          {/* Interactive Visual Gateway Schema */}
          <div className="bg-slate-950 rounded-xl p-6 border border-slate-800/80 flex flex-col items-center justify-center space-y-6 relative overflow-hidden">
            {/* Center GeoLand DPI Engine */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-cyan-900/80 to-blue-900/80 border border-cyan-500/40 text-center shadow-xl shadow-cyan-950/60 max-w-sm w-full z-10">
              <span className="text-[10px] font-mono uppercase bg-cyan-500/20 text-cyan-300 px-2 py-0.5 rounded border border-cyan-500/30">
                Central DPI Layer
              </span>
              <h4 className="font-extrabold text-white text-lg mt-1">GeoLand Open API Gateway</h4>
              <p className="text-xs text-slate-300 mt-0.5">Automated Encumbrance Verification & Lien Lock Engine</p>
            </div>

            {/* Connecting Bridges */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 w-full text-center text-xs">
              <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 text-slate-300 space-y-1">
                <div className="font-bold text-cyan-400">Revenue Dept</div>
                <div className="text-[11px] text-slate-500">Record of Rights (RTC)</div>
                <div className="text-[10px] text-emerald-400 font-mono">✓ Auto-Sync</div>
              </div>
              <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 text-slate-300 space-y-1">
                <div className="font-bold text-rose-400">Banking Consortium</div>
                <div className="text-[11px] text-slate-500">Instant Loan Lien</div>
                <div className="text-[10px] text-rose-400 font-mono">🔒 Auto Lien Lock</div>
              </div>
              <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 text-slate-300 space-y-1">
                <div className="font-bold text-amber-400">Sub-Registrar (SRO)</div>
                <div className="text-[11px] text-slate-500">Stamper & Deeds</div>
                <div className="text-[10px] text-emerald-400 font-mono">✓ Conclusive Title</div>
              </div>
              <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 text-slate-300 space-y-1">
                <div className="font-bold text-purple-400">Municipal Board</div>
                <div className="text-[11px] text-slate-500">Zoning & Taxes</div>
                <div className="text-[10px] text-emerald-400 font-mono">✓ Tax Ledger</div>
              </div>
            </div>
          </div>
        </div>

        {/* Live Payload Log Inspector */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-200 text-sm flex items-center gap-2">
              <Code2 className="w-4 h-4 text-cyan-400" />
              <span>Live DPI Gateway Log</span>
            </h3>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
          </div>

          <div className="space-y-2 font-mono text-xs max-h-[360px] overflow-y-auto">
            {activeLog.map((log) => (
              <div key={log.id} className="bg-slate-950 p-3 rounded-xl border border-slate-800/80 space-y-1">
                <div className="flex items-center justify-between text-slate-400 text-[11px]">
                  <span>{log.time}</span>
                  <span className="text-cyan-400">{log.source}</span>
                </div>
                <div className="text-slate-200 font-bold text-xs">{log.action}</div>
                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-900">
                  <span>ULPIN: {log.ulpin}</span>
                  <span className="text-emerald-400 font-bold">{log.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
