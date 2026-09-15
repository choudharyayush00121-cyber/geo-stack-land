import React, { useState } from 'react';
import {
  Building2,
  CheckCircle2,
  Clock,
  DollarSign,
  FileText,
  Landmark,
  Layers,
  MapPin,
  ShieldCheck,
  TrendingUp,
  AlertTriangle,
  ArrowRight,
  Briefcase,
  Award,
  Sparkles,
  Zap,
  MessageSquare,
  Bell,
  FolderCheck,
  Send,
  Search,
  Filter
} from 'lucide-react';
import axios from 'axios';

export default function LandAcquisition({ parcels }) {
  const [selectedProject, setSelectedProject] = useState('PROJ-EXPRESSWAY-01');
  const [activeTab, setActiveTab] = useState('DASHBOARD'); // 'DASHBOARD' | 'TRACKING' | 'LANDOWNER' | 'GRIEVANCES' | 'DOCUMENTS'
  const [disbursing, setDisbursing] = useState(false);
  const [disburseResult, setDisburseResult] = useState(null);

  // Filter dropdown states (Req #1)
  const [selectedState, setSelectedState] = useState('Karnataka');
  const [selectedDistrict, setSelectedDistrict] = useState('Bengaluru Urban');

  // Grievance form state (Req #7)
  const [grievanceText, setGrievanceText] = useState('');
  const [grievanceUlpin, setGrievanceUlpin] = useState('14829304812903');
  const [grievanceType, setGrievanceType] = useState('COMPENSATION_DISCREPANCY');
  const [grievanceList, setGrievanceList] = useState([
    { id: 'GRV-2026-881', ulpin: '14829304812903', type: 'Compensation Valuation Objection', status: 'UNDER_REVIEW', date: '2026-09-02' },
    { id: 'GRV-2026-842', ulpin: '14829304812901', type: 'Boundary Alignment Hearing', status: 'RESOLVED', date: '2026-08-28' }
  ]);

  // Notifications state (Req #8)
  const [notificationChannel, setNotificationChannel] = useState('SMS_EMAIL_APP');
  const [notificationSent, setNotificationSent] = useState(false);

  const acquisitionProjects = [
    {
      id: 'PROJ-EXPRESSWAY-01',
      name: 'Bengaluru-Chennai Industrial Expressway Corridor',
      agency: 'National Highways Authority of India (NHAI)',
      state: 'Karnataka',
      district: 'Bengaluru Urban',
      targetAcquisitionAcres: 450.5,
      acquiredAcres: 380.2,
      progressPct: 84.4,
      totalBudgetCr: 1250.0,
      disbursedCr: 980.5,
      totalParcels: 142,
      acquiredParcelsCount: 120,
      pendingVerificationCount: 14,
      disputedParcelsCount: 8,
      activeStage: 'Compensation & Direct Payment'
    },
    {
      id: 'PROJ-RAILWAY-02',
      name: 'High-Speed Freight Rail Corridor (Devanahalli Link)',
      agency: 'Indian Railways Infrastructure Corporation',
      state: 'Karnataka',
      district: 'Bengaluru Rural',
      targetAcquisitionAcres: 280.0,
      acquiredAcres: 210.0,
      progressPct: 75.0,
      totalBudgetCr: 840.0,
      disbursedCr: 630.0,
      totalParcels: 88,
      acquiredParcelsCount: 66,
      pendingVerificationCount: 17,
      disputedParcelsCount: 5,
      activeStage: 'Notice Issued'
    },
    {
      id: 'PROJ-SMARTCITY-03',
      name: 'Yelahanka IT Tech Park & Smart Logistics Hub',
      agency: 'Karnataka Industrial Areas Development Board (KIADB)',
      state: 'Karnataka',
      district: 'Bengaluru Urban',
      targetAcquisitionAcres: 180.0,
      acquiredAcres: 165.0,
      progressPct: 91.6,
      totalBudgetCr: 560.0,
      disbursedCr: 512.0,
      totalParcels: 54,
      acquiredParcelsCount: 49,
      pendingVerificationCount: 3,
      disputedParcelsCount: 2,
      activeStage: 'Acquired & Possession Handover'
    }
  ];

  const currentProject = acquisitionProjects.find((p) => p.id === selectedProject) || acquisitionProjects[0];

  const handleSubmitGrievance = (e) => {
    e.preventDefault();
    if (!grievanceText) return;
    const newGrv = {
      id: `GRV-2026-${Math.floor(100 + Math.random() * 900)}`,
      ulpin: grievanceUlpin,
      type: grievanceType,
      status: 'SUBMITTED',
      date: new Date().toISOString().split('T')[0]
    };
    setGrievanceList([newGrv, ...grievanceList]);
    setGrievanceText('');
    alert(`Objection/Grievance ${newGrv.id} registered. Confirmation SMS & Email sent to landowner.`);
  };

  const handleSendNotification = () => {
    setNotificationSent(true);
    setTimeout(() => setNotificationSent(false), 4000);
  };

  const handleDisburseCompensation = async (parcel) => {
    setDisbursing(true);
    await new Promise((r) => setTimeout(r, 1200));
    setDisburseResult({
      success: true,
      transactionId: `DBT-PFMS-${Date.now()}`,
      ulpin: parcel.ulpin,
      owner: parcel.owner.name,
      amount: Math.round(parcel.marketValue * 1.5),
      status: 'DISBURSED_DIRECT_BENEFIT_TRANSFER',
      bankRefNo: `SBI-PFMS-2026-${Math.floor(100000 + Math.random() * 900000)}`
    });
    setDisbursing(false);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-300 border border-blue-500/30">
              National Portal
            </span>
            <span className="text-xs text-slate-400 font-mono">RFCTLARR Act 2013 Compliance</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white mt-1 flex items-center gap-2">
            <Landmark className="w-7 h-7 text-blue-400" />
            <span>Centralized Land Acquisition & Management System</span>
          </h1>
          <p className="text-sm text-slate-400 mt-0.5 max-w-2xl">
            End-to-end digital monitoring, parcel tracking, landowner portal, grievance redressal, and multi-channel notifications.
          </p>
        </div>

        {/* Filters for State & District (Req #1) */}
        <div className="flex items-center space-x-2 text-xs">
          <select
            value={selectedState}
            onChange={(e) => setSelectedState(e.target.value)}
            className="bg-slate-800 text-white p-2.5 rounded-xl border border-slate-700 font-semibold"
          >
            <option value="Karnataka">State: Karnataka</option>
            <option value="Maharashtra">State: Maharashtra</option>
            <option value="TamilNadu">State: Tamil Nadu</option>
          </select>
          <select
            value={selectedDistrict}
            onChange={(e) => setSelectedDistrict(e.target.value)}
            className="bg-slate-800 text-white p-2.5 rounded-xl border border-slate-700 font-semibold"
          >
            <option value="Bengaluru Urban">District: Bengaluru Urban</option>
            <option value="Bengaluru Rural">District: Bengaluru Rural</option>
          </select>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="bg-slate-900 p-1.5 rounded-2xl border border-slate-800 flex flex-wrap items-center gap-2 text-xs font-semibold">
        <button
          onClick={() => setActiveTab('DASHBOARD')}
          className={`px-4 py-2 rounded-xl transition-all ${
            activeTab === 'DASHBOARD' ? 'bg-blue-600 text-white font-bold shadow' : 'text-slate-400 hover:bg-slate-800'
          }`}
        >
          1. Acquisition Dashboard
        </button>
        <button
          onClick={() => setActiveTab('TRACKING')}
          className={`px-4 py-2 rounded-xl transition-all ${
            activeTab === 'TRACKING' ? 'bg-blue-600 text-white font-bold shadow' : 'text-slate-400 hover:bg-slate-800'
          }`}
        >
          2. Real-Time Parcel Tracker
        </button>
        <button
          onClick={() => setActiveTab('LANDOWNER')}
          className={`px-4 py-2 rounded-xl transition-all ${
            activeTab === 'LANDOWNER' ? 'bg-blue-600 text-white font-bold shadow' : 'text-slate-400 hover:bg-slate-800'
          }`}
        >
          3. Landowner Portal
        </button>
        <button
          onClick={() => setActiveTab('GRIEVANCES')}
          className={`px-4 py-2 rounded-xl transition-all ${
            activeTab === 'GRIEVANCES' ? 'bg-blue-600 text-white font-bold shadow' : 'text-slate-400 hover:bg-slate-800'
          }`}
        >
          4. Objections & Grievances
        </button>
        <button
          onClick={() => setActiveTab('DOCUMENTS')}
          className={`px-4 py-2 rounded-xl transition-all ${
            activeTab === 'DOCUMENTS' ? 'bg-blue-600 text-white font-bold shadow' : 'text-slate-400 hover:bg-slate-800'
          }`}
        >
          5. Digital Document Vault
        </button>
      </div>

      {/* TAB 1: CENTRALIZED DASHBOARD & ANALYTICS (Req #1, #6, #9) */}
      {activeTab === 'DASHBOARD' && (
        <div className="space-y-6">
          {/* Key Analytics Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-2">
              <div className="text-xs text-slate-400">Total Land Acquired</div>
              <div className="text-3xl font-black text-white">{currentProject.acquiredAcres} Acres</div>
              <div className="text-xs text-emerald-400 font-medium">Target: {currentProject.targetAcquisitionAcres} Acres</div>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-2">
              <div className="text-xs text-slate-400">Compensation Disbursed</div>
              <div className="text-3xl font-black text-emerald-400">₹{currentProject.disbursedCr} Cr</div>
              <div className="text-xs text-slate-400">Total Budget: ₹{currentProject.totalBudgetCr} Cr</div>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-2">
              <div className="text-xs text-slate-400">Pending Verification Cases</div>
              <div className="text-3xl font-black text-amber-400">{currentProject.pendingVerificationCount} Parcels</div>
              <div className="text-xs text-slate-400">Under Review by Collector</div>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-2">
              <div className="text-xs text-slate-400">Disputed / High-Risk Areas</div>
              <div className="text-3xl font-black text-rose-400">{currentProject.disputedParcelsCount} Parcels</div>
              <div className="text-xs text-rose-400 font-medium">Pending Stay Hearings</div>
            </div>
          </div>

          {/* Project Selector List */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {acquisitionProjects.map((proj) => {
              const isSelected = selectedProject === proj.id;
              return (
                <div
                  key={proj.id}
                  onClick={() => setSelectedProject(proj.id)}
                  className={`p-5 rounded-2xl border transition-all cursor-pointer space-y-3 ${
                    isSelected
                      ? 'bg-slate-800/90 border-blue-500/60 ring-2 ring-blue-500/20 shadow-xl'
                      : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
                      {proj.id}
                    </span>
                    <span className="text-xs font-bold text-emerald-400 font-mono">{proj.progressPct}%</span>
                  </div>
                  <h3 className="font-bold text-white text-sm">{proj.name}</h3>
                  <p className="text-xs text-slate-400">{proj.agency}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: REAL-TIME ACQUISITION PARCEL TRACKER (Req #3: Identified -> Under Verification -> Notice Issued -> Compensation -> Payment -> Acquired) */}
      {activeTab === 'TRACKING' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="font-bold text-white text-sm flex items-center gap-2">
              <Zap className="w-4 h-4 text-cyan-400" />
              <span>Real-Time Parcel Acquisition Lifecycle Tracker (6-Stage Pipeline)</span>
            </h3>
            <span className="text-xs text-slate-400 font-mono">Project: {currentProject.id}</span>
          </div>

          {/* 6-Stage Horizontal Flow Diagram */}
          <div className="grid grid-cols-2 md:grid-cols-6 gap-2 text-center text-xs font-mono">
            <div className="bg-slate-950 p-3 rounded-xl border border-blue-500/40 space-y-1">
              <div className="font-bold text-cyan-300">1. Identified</div>
              <div className="text-[9px] text-slate-400">Survey Boundary Tagged</div>
            </div>
            <div className="bg-slate-950 p-3 rounded-xl border border-purple-500/40 space-y-1">
              <div className="font-bold text-purple-300">2. Verification</div>
              <div className="text-[9px] text-slate-400">PostGIS Title Audit</div>
            </div>
            <div className="bg-slate-950 p-3 rounded-xl border border-amber-500/40 space-y-1">
              <div className="font-bold text-amber-300">3. Notice Issued</div>
              <div className="text-[9px] text-slate-400">Sec 11 Gazette Notice</div>
            </div>
            <div className="bg-slate-950 p-3 rounded-xl border border-indigo-500/40 space-y-1">
              <div className="font-bold text-indigo-300">4. Compensation</div>
              <div className="text-[9px] text-slate-400">150% Solatium Award</div>
            </div>
            <div className="bg-slate-950 p-3 rounded-xl border border-cyan-500/40 space-y-1">
              <div className="font-bold text-cyan-300">5. Payment</div>
              <div className="text-[9px] text-slate-400">PFMS Direct Transfer</div>
            </div>
            <div className="bg-slate-950 p-3 rounded-xl border border-emerald-500/40 space-y-1">
              <div className="font-bold text-emerald-400">6. Acquired</div>
              <div className="text-[9px] text-slate-400">Handover to Agency</div>
            </div>
          </div>

          {/* Parcel List */}
          <div className="space-y-3">
            {parcels.map((parcel) => (
              <div key={parcel.id} className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-xs">
                <div>
                  <div className="font-bold text-white flex items-center gap-2">
                    <span className="text-cyan-300 font-mono">ULPIN {parcel.ulpin}</span>
                    <span className="text-slate-400">({parcel.surveyNo})</span>
                  </div>
                  <div className="text-slate-400 mt-0.5">Owner: {parcel.owner.name} • Area: {parcel.areaSqFt.toLocaleString()} sq.ft</div>
                </div>

                <div className="flex items-center space-x-3">
                  <span className={`px-3 py-1 rounded-full font-mono text-[11px] font-bold border ${
                    parcel.financial.isEncumbered ? 'bg-amber-500/20 text-amber-300 border-amber-500/30' : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                  }`}>
                    Status: {parcel.financial.isEncumbered ? 'COMPENSATION_PAYMENT_PENDING' : 'ACQUIRED & TITLE HANDOVER'}
                  </span>
                  <button
                    onClick={() => handleDisburseCompensation(parcel)}
                    className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-3 py-1.5 rounded-lg transition-all"
                  >
                    Disburse Compensation
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: LANDOWNER MANAGEMENT PORTAL (Req #4) */}
      {activeTab === 'LANDOWNER' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-xl">
          <h3 className="font-bold text-white text-sm border-b border-slate-800 pb-3 flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-emerald-400" />
            <span>Landowner Self-Service Portal (Permitted Information View)</span>
          </h3>

          <div className="bg-slate-950 p-6 rounded-xl border border-slate-800 space-y-4 text-xs">
            <div className="flex flex-col md:flex-row justify-between border-b border-slate-800 pb-4 gap-2">
              <div>
                <span className="text-slate-400">Affected Land Parcel:</span>
                <h4 className="font-bold text-white text-base mt-0.5">ULPIN 14829304812901 (Sy. No. 42/1A)</h4>
                <p className="text-slate-400">Registered Owner: Rajesh Kumar Sharma</p>
              </div>
              <div className="text-right">
                <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 rounded-full font-mono font-bold border border-emerald-500/30">
                  Acquisition Status: Solatium Approved
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono">
              <div className="bg-slate-900 p-3.5 rounded-xl border border-slate-800">
                <div className="text-slate-400">Guideline Market Value</div>
                <div className="text-lg font-bold text-white mt-1">₹1.85 Cr</div>
              </div>
              <div className="bg-slate-900 p-3.5 rounded-xl border border-slate-800">
                <div className="text-slate-400">150% Solatium Award</div>
                <div className="text-lg font-bold text-emerald-400 mt-1">₹2.77 Cr</div>
              </div>
              <div className="bg-slate-900 p-3.5 rounded-xl border border-slate-800">
                <div className="text-slate-400">PFMS Payment Status</div>
                <div className="text-lg font-bold text-cyan-300 mt-1">READY FOR DISBURSAL</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: OBJECTION AND GRIEVANCE REDRESSAL SYSTEM (Req #7, #8) */}
      {activeTab === 'GRIEVANCES' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Submit Objection Form */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
            <h3 className="font-bold text-white text-sm border-b border-slate-800 pb-3 flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-amber-400" />
              <span>Submit Landowner Objection or Grievance Online</span>
            </h3>

            <form onSubmit={handleSubmitGrievance} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-400 font-semibold mb-1">Target ULPIN / Survey No:</label>
                <select
                  value={grievanceUlpin}
                  onChange={(e) => setGrievanceUlpin(e.target.value)}
                  className="w-full bg-slate-800 text-white p-3 rounded-xl border border-slate-700 font-mono"
                >
                  {parcels.map((p) => (
                    <option key={p.id} value={p.ulpin}>
                      ULPIN {p.ulpin} ({p.owner.name})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">Grievance Category:</label>
                <select
                  value={grievanceType}
                  onChange={(e) => setGrievanceType(e.target.value)}
                  className="w-full bg-slate-800 text-white p-3 rounded-xl border border-slate-700"
                >
                  <option value="COMPENSATION_DISCREPANCY">Compensation Valuation Discrepancy</option>
                  <option value="BOUNDARY_ALIGNMENT">Cadastral Boundary Alignment Dispute</option>
                  <option value="PAYMENT_DELAY">DBT Payment Delay</option>
                  <option value="MUTATION_RECORD">Record of Rights Correction</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">Grievance Description & Grounds:</label>
                <textarea
                  rows="4"
                  value={grievanceText}
                  onChange={(e) => setGrievanceText(e.target.value)}
                  placeholder="Provide details regarding your objection..."
                  className="w-full bg-slate-800 text-white p-3 rounded-xl border border-slate-700"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold py-3 px-4 rounded-xl shadow transition-all flex items-center justify-center space-x-2"
              >
                <Send className="w-4 h-4" />
                <span>Submit Objection & Notify Collector</span>
              </button>
            </form>
          </div>

          {/* Grievance Tracking List & Notifications */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-white text-sm flex items-center gap-2">
                <Bell className="w-4 h-4 text-cyan-400" />
                <span>Submitted Grievance Tracker & Notification Stream</span>
              </h3>
              <button
                onClick={handleSendNotification}
                className="bg-slate-800 hover:bg-slate-700 text-cyan-300 px-3 py-1.5 rounded-lg text-xs font-semibold border border-slate-700 flex items-center gap-1"
              >
                <Bell className="w-3.5 h-3.5" />
                <span>Broadcast Alert (SMS/Email)</span>
              </button>
            </div>

            {notificationSent && (
              <div className="bg-cyan-950 p-3 rounded-xl border border-cyan-500/40 text-xs text-cyan-200 font-mono animate-bounce">
                ✓ Notification dispatched via SMS (8921), Email (rajesh@domain.com), and Mobile App Push.
              </div>
            )}

            <div className="space-y-3 font-mono text-xs">
              {grievanceList.map((g) => (
                <div key={g.id} className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1">
                  <div className="flex justify-between font-bold text-white">
                    <span className="text-amber-300">{g.id}</span>
                    <span className="text-slate-400 text-[10px]">{g.date}</span>
                  </div>
                  <div className="text-slate-200">{g.type}</div>
                  <div className="flex justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-900">
                    <span>ULPIN: {g.ulpin}</span>
                    <span className="text-cyan-400 font-bold">{g.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: DIGITAL DOCUMENT MANAGEMENT VAULT (Req #5) */}
      {activeTab === 'DOCUMENTS' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-xl">
          <h3 className="font-bold text-white text-sm border-b border-slate-800 pb-3 flex items-center gap-2">
            <FolderCheck className="w-4 h-4 text-purple-400" />
            <span>Digital Document Vault (Ownership, Survey Maps, Notices & Receipts)</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
              <div className="font-bold text-white flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-cyan-400" />
                <span>Section 11 Gazette Notice</span>
              </div>
              <p className="text-[11px] text-slate-400">Official preliminary acquisition notice issued by District Collector.</p>
              <button className="text-cyan-300 underline font-semibold">Download PDF (2.4MB)</button>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
              <div className="font-bold text-white flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-purple-400" />
                <span>Social Impact Survey Report</span>
              </div>
              <p className="text-[11px] text-slate-400">Environmental & SIA hearing clearance by Gram Sabha board.</p>
              <button className="text-cyan-300 underline font-semibold">Download PDF (4.8MB)</button>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
              <div className="font-bold text-white flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-emerald-400" />
                <span>PFMS Compensation Receipt</span>
              </div>
              <p className="text-[11px] text-slate-400">Digitally signed Treasury receipt for 150% solatium transfer.</p>
              <button className="text-cyan-300 underline font-semibold">Download PDF (1.1MB)</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
