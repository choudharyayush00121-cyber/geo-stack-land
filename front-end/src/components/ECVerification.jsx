import React, { useState } from 'react';
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
  Calendar
} from 'lucide-react';
import axios from 'axios';

export default function ECVerification({ selectedParcel, parcels, onSelectParcel }) {
  const [targetUlpin, setTargetUlpin] = useState(selectedParcel ? selectedParcel.ulpin : '14829304812902');
  const [loading, setLoading] = useState(false);
  const [certificateData, setCertificateData] = useState(null);

  const fetchCertificate = async (ulpinToFetch) => {
    setLoading(true);
    try {
      const res = await axios.get(`/api/verify/ec/${ulpinToFetch}`);
      if (res.data.success) {
        setCertificateData(res.data.certificate);
      }
    } catch (err) {
      console.error('Error fetching EC certificate:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (targetUlpin) {
      fetchCertificate(targetUlpin);
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      {/* Search Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              Automated Encumbrance Verification
            </span>
            <h1 className="text-2xl font-extrabold text-white mt-1 flex items-center gap-2">
              <FileCheck className="w-7 h-7 text-emerald-400" />
              <span>Instant Digital Encumbrance Certificate (EC)</span>
            </h1>
            <p className="text-sm text-slate-400 mt-0.5">
              Generates cryptographic proof of non-encumbrance or active bank lien status within 3 seconds using the 14-digit ULPIN.
            </p>
          </div>

          {/* Quick Parcel Selector Dropdown */}
          <div className="flex items-center space-x-2 w-full md:w-auto">
            <select
              value={targetUlpin}
              onChange={(e) => {
                setTargetUlpin(e.target.value);
                fetchCertificate(e.target.value);
              }}
              className="bg-slate-800 text-white text-sm px-4 py-2.5 rounded-xl border border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
            >
              {parcels.map((p) => (
                <option key={p.id} value={p.ulpin}>
                  ULPIN: {p.ulpin} ({p.owner.name.substring(0, 16)}...)
                </option>
              ))}
            </select>
            <button
              onClick={() => fetchCertificate(targetUlpin)}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-4 py-2.5 rounded-xl text-sm transition-all"
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
          <p>Generating cryptographically signed Encumbrance Certificate via DPI Gateway...</p>
        </div>
      ) : certificateData ? (
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-8 space-y-6 shadow-2xl relative">
          {/* Certificate Print Actions */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center font-bold">
                EC
              </div>
              <div>
                <h3 className="font-bold text-white text-base">Government of Karnataka • Land Governance DPI</h3>
                <p className="text-xs text-slate-400">Department of Stamps & Registration (Bhu-Aadhaar Protocol)</p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => window.print()}
                className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 border border-slate-700"
              >
                <Printer className="w-4 h-4" />
                <span>Print Official Copy</span>
              </button>
              <button
                onClick={() => alert(`Certificate ${certificateData.certificateNumber} exported as encrypted PDF.`)}
                className="bg-emerald-600 hover:bg-emerald-500 text-white px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow"
              >
                <Download className="w-4 h-4" />
                <span>Download Signed PDF</span>
              </button>
            </div>
          </div>

          {/* Certificate Body Sheet */}
          <div className="bg-slate-900 rounded-xl p-6 border border-slate-800 space-y-6 text-sm">
            {/* Title Badge */}
            <div className="text-center space-y-1">
              <span className="text-xs uppercase font-mono font-bold tracking-widest text-cyan-400">
                Form No. 15 • Statutory Certificate
              </span>
              <h2 className="text-2xl font-black text-white uppercase tracking-tight">
                Certificate of Encumbrance on Property
              </h2>
              <p className="text-xs text-slate-400">Issued under Rule 148 of Karnataka Registration Rules, 1965</p>
            </div>

            {/* Official Badge */}
            <div className="flex justify-center">
              <span className={`px-4 py-1.5 rounded-full font-bold text-xs flex items-center gap-2 border shadow-lg ${
                certificateData.isClearTitle
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                  : 'bg-rose-500/20 text-rose-300 border-rose-500/40'
              }`}>
                {certificateData.isClearTitle ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>STATUS: NIL ENCUMBRANCE (TITLE IS FREE & CLEAR)</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4 text-rose-400" />
                    <span>STATUS: ENCUMBERED / ACTIVE BANK LIEN ATTACHED</span>
                  </>
                )}
              </span>
            </div>

            {/* Details Table */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-slate-800">
              <div className="space-y-2 bg-slate-950 p-4 rounded-xl border border-slate-800/80 text-xs">
                <div className="text-slate-400 font-semibold border-b border-slate-800 pb-1">PROPERTY IDENTIFICATION</div>
                <div className="flex justify-between"><span className="text-slate-400">14-Digit ULPIN:</span> <span className="font-mono text-cyan-300 font-bold">{certificateData.ulpin}</span></div>
                <div className="flex justify-between"><span className="text-slate-400">Survey / Hissa No:</span> <span className="font-bold text-white">{certificateData.surveyNo}</span></div>
                <div className="flex justify-between"><span className="text-slate-400">District / Village:</span> <span className="text-slate-200">{certificateData.village}, {certificateData.district}</span></div>
                <div className="flex justify-between"><span className="text-slate-400">Total Land Area:</span> <span className="text-slate-200">{certificateData.areaSqFt.toLocaleString()} sq.ft</span></div>
              </div>

              <div className="space-y-2 bg-slate-950 p-4 rounded-xl border border-slate-800/80 text-xs">
                <div className="text-slate-400 font-semibold border-b border-slate-800 pb-1">CERTIFICATE AUDIT META</div>
                <div className="flex justify-between"><span className="text-slate-400">Certificate No:</span> <span className="font-mono text-amber-300 font-bold">{certificateData.certificateNumber}</span></div>
                <div className="flex justify-between"><span className="text-slate-400">Registered Owner:</span> <span className="font-bold text-white">{certificateData.ownerName}</span></div>
                <div className="flex justify-between"><span className="text-slate-400">Deed Registration No:</span> <span className="font-mono text-slate-200">{certificateData.deedNo}</span></div>
                <div className="flex justify-between"><span className="text-slate-400">Issue Timestamp:</span> <span className="text-slate-300">{new Date(certificateData.issuedDate).toLocaleDateString()}</span></div>
              </div>
            </div>

            {/* Financial Lien Details Box */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs space-y-2">
              <div className="font-bold text-slate-300 flex items-center gap-1.5">
                <Building className="w-4 h-4 text-cyan-400" />
                <span>Financial & Judicial Encumbrance Audit Ledger</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2 border-t border-slate-800">
                <div>
                  <div className="text-slate-400 text-[11px]">Bank Lien / Charge</div>
                  <div className="font-semibold text-slate-200">{certificateData.financialSummary.bankLien}</div>
                </div>
                <div>
                  <div className="text-slate-400 text-[11px]">Mortgage Loan Amount</div>
                  <div className="font-semibold text-amber-300">
                    {certificateData.financialSummary.loanAmount > 0
                      ? `₹${certificateData.financialSummary.loanAmount.toLocaleString()}`
                      : '₹0 (Nil)'}
                  </div>
                </div>
                <div>
                  <div className="text-slate-400 text-[11px]">Court Dispute Stay</div>
                  <div className={`font-bold ${certificateData.financialSummary.courtDispute ? 'text-rose-400' : 'text-emerald-400'}`}>
                    {certificateData.financialSummary.courtDispute ? 'YES (STAY ORDER)' : 'NO DISPUTES'}
                  </div>
                </div>
              </div>
            </div>

            {/* Digital Signature & Verification Hash Footer */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-800 text-xs">
              <div className="flex items-center space-x-3">
                <div className="w-14 h-14 bg-white p-1 rounded border border-slate-700 flex items-center justify-center">
                  <QrCode className="w-12 h-12 text-slate-900" />
                </div>
                <div>
                  <div className="text-slate-400 font-mono text-[10px]">Cryptographic SHA256 Verification Hash:</div>
                  <div className="font-mono text-cyan-400 font-semibold">{certificateData.verificationHash}</div>
                  <div className="text-slate-500 text-[10px] mt-0.5">{certificateData.digitalSignature}</div>
                </div>
              </div>

              <div className="text-right text-slate-400 text-xs">
                <div className="font-bold text-slate-200">Digitally Verified by GeoLand DPI</div>
                <div className="text-[10px] text-slate-500">Stamper Engine • No Physical Seal Required</div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
