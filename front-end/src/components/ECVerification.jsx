import React, { useState, useEffect } from 'react';
import {
  FileCheck,
  ShieldCheck,
  Printer,
  Download,
  Search,
  Lock,
  AlertTriangle,
  CheckCircle2,
  QrCode,
  Building,
  Calendar,
  Award,
  Sparkles,
  Fingerprint
} from 'lucide-react';
import axios from 'axios';
import { playClickSound, playSuccessChime } from '../utils/audioEffects';

export default function ECVerification({ selectedParcel, parcels = [], onSelectParcel }) {
  const [targetUlpin, setTargetUlpin] = useState(
    selectedParcel ? selectedParcel.ulpin : (parcels.length > 0 ? parcels[0].ulpin : '14829304812901')
  );
  const [loading, setLoading] = useState(false);
  const [certificateData, setCertificateData] = useState(null);

  const fetchCertificate = async (ulpinToFetch) => {
    setLoading(true);
    try {
      const res = await axios.get(`/api/verify/ec/${ulpinToFetch}`);
      if (res.data.success) {
        setCertificateData(res.data.certificate);
        playSuccessChime();
      }
    } catch (err) {
      console.error('Error fetching EC certificate:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedParcel?.ulpin) {
      setTargetUlpin(selectedParcel.ulpin);
      fetchCertificate(selectedParcel.ulpin);
    } else if (parcels.length > 0) {
      fetchCertificate(parcels[0].ulpin);
    }
  }, [selectedParcel]);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (targetUlpin) {
      playClickSound();
      fetchCertificate(targetUlpin);
    }
  };

  const handlePrint = () => {
    playClickSound();
    window.print();
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      {/* Search & Selector Header (hidden during print) */}
      <div className="print:hidden bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              National Bhu-Aadhaar Protocol • DILRMP
            </span>
            <h1 className="text-2xl font-extrabold text-white mt-1 flex items-center gap-2">
              <FileCheck className="w-7 h-7 text-emerald-400" />
              <span>Conclusive Bhu-Aadhaar Title & Encumbrance Certificate</span>
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Instant cryptographically signed Form 15 non-encumbrance proof anchored to immutable WGS-84 GIS cadastral boundaries.
            </p>
          </div>

          {/* Quick Parcel Selector Dropdown */}
          <div className="flex items-center space-x-2 w-full md:w-auto">
            <select
              value={targetUlpin}
              onChange={(e) => {
                playClickSound();
                setTargetUlpin(e.target.value);
                fetchCertificate(e.target.value);
              }}
              className="bg-slate-800 text-white text-xs px-3.5 py-2.5 rounded-xl border border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono w-full md:w-72"
            >
              {parcels.map((p) => (
                <option key={p.id} value={p.ulpin}>
                  {p.ulpin} - {p.surveyNo} ({p.owner?.name?.substring(0, 15)})
                </option>
              ))}
            </select>
            <button
              onClick={() => fetchCertificate(targetUlpin)}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-4 py-2.5 rounded-xl text-xs transition-all whitespace-nowrap shadow-lg shadow-emerald-950"
            >
              Fetch Certificate
            </button>
          </div>
        </div>
      </div>

      {/* Certificate Render Sheet */}
      {loading ? (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center text-slate-400 space-y-3">
          <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-xs font-mono">Generating cryptographically signed Encumbrance Certificate via DPI Gateway...</p>
        </div>
      ) : certificateData ? (
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-8 space-y-6 shadow-2xl relative print:bg-white print:text-black print:border-none print:shadow-none print:p-0">
          {/* Print/Download Toolbar (hidden during print) */}
          <div className="print:hidden flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center font-bold">
                EC
              </div>
              <div>
                <h3 className="font-bold text-white text-sm">Official Government of India • Digital Public Infrastructure</h3>
                <p className="text-xs text-slate-400">Department of Land Governance & Revenue Records</p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={handlePrint}
                className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-emerald-950/60 transition-all hover:scale-105 active:scale-95"
              >
                <Printer className="w-4 h-4" />
                <span>Print Official PDF</span>
              </button>
            </div>
          </div>

          {/* Official Certificate Paper Sheet */}
          <div className="bg-slate-900 rounded-2xl p-8 border border-slate-800 space-y-6 text-sm relative overflow-hidden print:bg-white print:text-slate-900 print:border-2 print:border-slate-400 print:p-8">
            {/* Watermark Emblem in Background */}
            <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none print:opacity-[0.05]">
              <Award className="w-96 h-96 text-white print:text-black" />
            </div>

            {/* Official Header */}
            <div className="text-center space-y-1 relative z-10 border-b border-slate-800 print:border-slate-300 pb-4">
              <div className="flex items-center justify-center space-x-2 text-xs font-mono font-bold text-cyan-400 print:text-blue-800 tracking-widest uppercase">
                <span>सत्यमेव जयते • Government of India</span>
              </div>
              <h2 className="text-xl font-black text-white print:text-black uppercase tracking-wide">
                Certificate of Conclusive Title & Encumbrance on Immovable Property
              </h2>
              <p className="text-xs text-slate-400 print:text-slate-600">
                Issued pursuant to Section 17 & 48 of the Registration Act, 1908 • DILRMP Bhu-Aadhaar National DPI Protocol
              </p>
              <div className="text-[11px] font-mono text-emerald-400 print:text-emerald-700 font-bold pt-1">
                Certificate ID: {certificateData.certificateNumber}
              </div>
            </div>

            {/* Legal Status Banner */}
            <div className="flex justify-center relative z-10">
              <span className={`px-5 py-2 rounded-full font-bold text-xs flex items-center gap-2 border shadow-lg ${
                certificateData.isClearTitle
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50 print:bg-emerald-100 print:text-emerald-900 print:border-emerald-500'
                  : 'bg-rose-500/20 text-rose-300 border-rose-500/50 print:bg-rose-100 print:text-rose-900 print:border-rose-500'
              }`}>
                {certificateData.isClearTitle ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 print:text-emerald-700" />
                    <span>STATUS: 100% NIL ENCUMBRANCE (GUARANTEED CLEAR TITLE)</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4 text-rose-400 print:text-rose-700" />
                    <span>STATUS: ACTIVE ENCUMBRANCE DETECTED (MORTGAGE LIEN ATTACHED)</span>
                  </>
                )}
              </span>
            </div>

            {/* Cadastral & Legal Record Tables */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10">
              <div className="space-y-2 bg-slate-950 print:bg-slate-50 p-4 rounded-xl border border-slate-800 print:border-slate-300 text-xs">
                <div className="text-slate-400 print:text-slate-600 font-bold border-b border-slate-800 print:border-slate-300 pb-1 uppercase font-mono">
                  1. Spatial & Cadastral Identification
                </div>
                <div className="flex justify-between"><span className="text-slate-400 print:text-slate-600">14-Digit ULPIN:</span> <span className="font-mono text-cyan-300 print:text-blue-700 font-bold">{certificateData.ulpin}</span></div>
                <div className="flex justify-between"><span className="text-slate-400 print:text-slate-600">Survey / Plot No:</span> <span className="font-bold text-white print:text-black">{certificateData.surveyNo}</span></div>
                <div className="flex justify-between"><span className="text-slate-400 print:text-slate-600">Location:</span> <span className="text-slate-200 print:text-black">{certificateData.village}, {certificateData.district}</span></div>
                <div className="flex justify-between"><span className="text-slate-400 print:text-slate-600">Total Demarcated Area:</span> <span className="text-slate-200 print:text-black font-semibold">{certificateData.areaSqFt.toLocaleString()} sq.ft</span></div>
              </div>

              <div className="space-y-2 bg-slate-950 print:bg-slate-50 p-4 rounded-xl border border-slate-800 print:border-slate-300 text-xs">
                <div className="text-slate-400 print:text-slate-600 font-bold border-b border-slate-800 print:border-slate-300 pb-1 uppercase font-mono">
                  2. Title Deed & Ownership Ledger
                </div>
                <div className="flex justify-between"><span className="text-slate-400 print:text-slate-600">Primary Holder:</span> <span className="font-bold text-white print:text-black">{certificateData.ownerName}</span></div>
                <div className="flex justify-between"><span className="text-slate-400 print:text-slate-600">Registered Deed:</span> <span className="font-mono text-slate-200 print:text-black">{certificateData.deedNo}</span></div>
                <div className="flex justify-between"><span className="text-slate-400 print:text-slate-600">Date of Issue:</span> <span className="text-slate-200 print:text-black">{new Date(certificateData.issuedDate).toLocaleDateString()}</span></div>
                <div className="flex justify-between"><span className="text-slate-400 print:text-slate-600">Validity Horizon:</span> <span className="text-emerald-400 print:text-emerald-700 font-semibold">{new Date(certificateData.validUntil).toLocaleDateString()} (90 Days)</span></div>
              </div>
            </div>

            {/* Financial Ledger Section */}
            <div className="bg-slate-950 print:bg-slate-50 p-4 rounded-xl border border-slate-800 print:border-slate-300 text-xs space-y-2 relative z-10">
              <div className="font-bold text-slate-300 print:text-black flex items-center gap-1.5 font-mono uppercase">
                <Building className="w-4 h-4 text-cyan-400 print:text-blue-700" />
                <span>3. Multi-Agency Encumbrance & Lien Audit Ledger</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2 border-t border-slate-800 print:border-slate-300">
                <div>
                  <div className="text-slate-400 print:text-slate-600 text-[11px]">Bank Lien Status</div>
                  <div className="font-semibold text-slate-200 print:text-black">{certificateData.financialSummary.bankLien}</div>
                </div>
                <div>
                  <div className="text-slate-400 print:text-slate-600 text-[11px]">Encumbered Loan Value</div>
                  <div className="font-semibold text-amber-300 print:text-amber-800">
                    {certificateData.financialSummary.loanAmount > 0
                      ? `₹${certificateData.financialSummary.loanAmount.toLocaleString()}`
                      : '₹0 (Nil Liability)'}
                  </div>
                </div>
                <div>
                  <div className="text-slate-400 print:text-slate-600 text-[11px]">Judicial Stay / Court Order</div>
                  <div className={`font-bold ${certificateData.financialSummary.courtDispute ? 'text-rose-400 print:text-rose-700' : 'text-emerald-400 print:text-emerald-700'}`}>
                    {certificateData.financialSummary.courtDispute ? 'DISPUTED (COURT STAY)' : 'NO DISPUTES (CLEAR)'}
                  </div>
                </div>
              </div>
            </div>

            {/* Cryptographic Digital Signature & QR Footer */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-800 print:border-slate-300 text-xs relative z-10">
              <div className="flex items-center space-x-3">
                <div className="w-14 h-14 bg-white p-1 rounded border border-slate-700 print:border-slate-400 flex items-center justify-center">
                  <QrCode className="w-12 h-12 text-slate-950" />
                </div>
                <div>
                  <div className="text-slate-400 print:text-slate-600 font-mono text-[10px]">Cryptographic SHA-256 Verification Digest:</div>
                  <div className="font-mono text-cyan-400 print:text-blue-800 font-semibold">{certificateData.verificationHash}</div>
                  <div className="text-slate-500 print:text-slate-600 text-[10px] mt-0.5">{certificateData.digitalSignature}</div>
                </div>
              </div>

              <div className="text-right text-slate-400 print:text-slate-600 text-xs">
                <div className="font-bold text-slate-200 print:text-black flex items-center justify-end gap-1">
                  <Fingerprint className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Stamper Digital Sign v2.6</span>
                </div>
                <div className="text-[10px] text-slate-500 print:text-slate-600">Valid under Information Technology Act, 2000</div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
