import React, { useState, useEffect } from 'react';
import {
  Calculator,
  IndianRupee,
  Building,
  TrendingUp,
  Percent,
  CheckCircle2,
  Receipt,
  FileText
} from 'lucide-react';
import axios from 'axios';

export default function TaxCalculator({ selectedParcel }) {
  const [areaSqFt, setAreaSqFt] = useState(selectedParcel ? selectedParcel.areaSqFt : 2400);
  const [circleRate, setCircleRate] = useState(selectedParcel ? selectedParcel.circleRatePerSqFt : 4800);
  const [zoning, setZoning] = useState(selectedParcel ? selectedParcel.zoning : 'Residential');
  const [considerationValue, setConsiderationValue] = useState(12000000);
  const [taxResult, setTaxResult] = useState(null);
  const [calculating, setCalculating] = useState(false);

  const calculateTax = async () => {
    setCalculating(true);
    try {
      const res = await axios.post('/api/parcels/calculate-tax', {
        areaSqFt,
        circleRatePerSqFt: circleRate,
        zoning,
        considerationValue
      });
      if (res.data.success) {
        setTaxResult(res.data.calculation);
      }
    } catch (err) {
      console.error('Error calculating tax:', err);
    } finally {
      setCalculating(false);
    }
  };

  useEffect(() => {
    calculateTax();
  }, [areaSqFt, circleRate, zoning, considerationValue]);

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30">
            Real-Time Revenue Engine
          </span>
          <h1 className="text-2xl font-extrabold text-white mt-1 flex items-center gap-2">
            <Calculator className="w-7 h-7 text-amber-400" />
            <span>Dynamic Land Valuation & Stamp Duty Calculator</span>
          </h1>
          <p className="text-sm text-slate-400 mt-0.5">
            Automates land circle rate evaluation, stamp duty calculation, registration fees, and annual property taxes with zero manual discretionary variance.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Input Controls */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
          <h3 className="font-bold text-slate-200 text-sm border-b border-slate-800 pb-2">
            Property Parameters
          </h3>

          <div className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Land Area (Sq. Ft.):</label>
              <input
                type="number"
                value={areaSqFt}
                onChange={(e) => setAreaSqFt(Number(e.target.value))}
                className="w-full bg-slate-800 text-white p-3 rounded-xl border border-slate-700 focus:ring-2 focus:ring-amber-500 focus:outline-none font-mono"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-semibold mb-1">Government Circle Rate (₹ / Sq. Ft.):</label>
              <input
                type="number"
                value={circleRate}
                onChange={(e) => setCircleRate(Number(e.target.value))}
                className="w-full bg-slate-800 text-white p-3 rounded-xl border border-slate-700 focus:ring-2 focus:ring-amber-500 focus:outline-none font-mono"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-semibold mb-1">Masterplan Zoning Class:</label>
              <select
                value={zoning}
                onChange={(e) => setZoning(e.target.value)}
                className="w-full bg-slate-800 text-white p-3 rounded-xl border border-slate-700 focus:ring-2 focus:ring-amber-500 focus:outline-none"
              >
                <option value="Residential">Residential (R-3)</option>
                <option value="Commercial">Commercial (C-2)</option>
                <option value="Industrial">Industrial (IND-1)</option>
                <option value="Agricultural">Agricultural (AG-1)</option>
                <option value="Eco-Sensitive / Buffer">Eco-Sensitive Buffer Zone</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-400 font-semibold mb-1">Agreement Consideration Value (₹):</label>
              <input
                type="number"
                value={considerationValue}
                onChange={(e) => setConsiderationValue(Number(e.target.value))}
                className="w-full bg-slate-800 text-white p-3 rounded-xl border border-slate-700 focus:ring-2 focus:ring-amber-500 focus:outline-none font-mono"
              />
            </div>
          </div>
        </div>

        {/* Real-time Calculation Breakdown Sheet */}
        {taxResult && (
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 space-y-5 shadow-2xl flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <span className="font-bold text-slate-200 text-sm flex items-center gap-1.5">
                  <Receipt className="w-4 h-4 text-amber-400" />
                  Statutory Duty Breakdown
                </span>
                <span className="text-xs font-mono bg-amber-500/20 text-amber-300 px-2.5 py-0.5 rounded border border-amber-500/30">
                  DPI Instant Audit
                </span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="bg-slate-900 p-3.5 rounded-xl border border-slate-800 space-y-1.5">
                  <div className="flex justify-between text-slate-400">
                    <span>Government Guideline Valuation:</span>
                    <span className="font-mono text-slate-200 font-semibold">₹{taxResult.guidelineValuation.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Taxable Consideration Base:</span>
                    <span className="font-mono text-cyan-300 font-bold">₹{taxResult.transactionValuation.toLocaleString()}</span>
                  </div>
                </div>

                <div className="bg-slate-900 p-3.5 rounded-xl border border-slate-800 space-y-2 font-mono">
                  <div className="flex justify-between text-slate-300">
                    <span>Stamp Duty ({taxResult.stampDutyPct}%):</span>
                    <span className="font-bold text-slate-100">₹{taxResult.stampDutyAmount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>Registration Fee ({taxResult.registrationFeePct}%):</span>
                    <span className="font-bold text-slate-100">₹{taxResult.registrationFeeAmount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>Infrastructure Surcharge ({taxResult.surchargePct}%):</span>
                    <span className="font-bold text-slate-100">₹{taxResult.surchargeAmount.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Total Payable Box */}
              <div className="bg-gradient-to-r from-amber-950/80 to-slate-900 p-4 rounded-xl border border-amber-500/40 space-y-1">
                <div className="text-xs text-amber-300 font-semibold uppercase tracking-wider">Total Payable Government Duties</div>
                <div className="text-2xl font-black text-amber-400 font-mono">
                  ₹{taxResult.totalGovernmentFee.toLocaleString()}
                </div>
                <div className="text-[11px] text-emerald-400 font-medium">
                  ✓ Estimated Processing Time Saved: 14 Days → 3 Minutes
                </div>
              </div>
            </div>

            <button
              onClick={() => alert(`Payment Gateway initiated for ₹${taxResult.totalGovernmentFee.toLocaleString()}`)}
              className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-black py-3 px-4 rounded-xl shadow-lg transition-all text-xs uppercase tracking-wider"
            >
              Pay Stamp Duty Online via Treasury Portal
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
