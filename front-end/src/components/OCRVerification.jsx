import React, { useState } from 'react';
import {
  FileText,
  Upload,
  Cpu,
  CheckCircle2,
  AlertTriangle,
  FileCheck,
  Search,
  Scan,
  Database,
  Layers,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import axios from 'axios';

export default function OCRVerification({ parcels }) {
  const [selectedUlpin, setSelectedUlpin] = useState('14829304812901');
  const [docType, setDocType] = useState('SALE_DEED');
  const [ownerNameInput, setOwnerNameInput] = useState('Rajesh Kumar Sharma');
  const [surveyNoInput, setSurveyNoInput] = useState('Sy. No. 42/1A');
  const [areaInput, setAreaInput] = useState(28500);
  const [verifying, setVerifying] = useState(false);
  const [ocrResult, setOcrResult] = useState(null);

  const handleRunOCR = async (e) => {
    e.preventDefault();
    setVerifying(true);
    try {
      const res = await axios.post('/api/ocr/verify-document', {
        documentType: docType,
        targetUlpin: selectedUlpin,
        ownerName: ownerNameInput,
        surveyNo: surveyNoInput,
        areaSqFt: areaInput
      });
      if (res.data.success) {
        setOcrResult(res.data.verification);
      }
    } catch (err) {
      console.error('Error running OCR verification:', err);
    } finally {
      setVerifying(false);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-purple-950 to-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-500/20 text-purple-300 border border-purple-500/30">
              AI Processing
            </span>
            <span className="text-xs text-slate-400 font-mono">Model: Tesseract OCR + PyTorch Cross-Verify</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white mt-1 flex items-center gap-2">
            <Scan className="w-7 h-7 text-purple-400" />
            <span>AI & OCR Document Verification Engine</span>
          </h1>
          <p className="text-sm text-slate-400 mt-0.5 max-w-2xl">
            Extracts text from scanned deeds, survey maps, and paper records. Automatically cross-checks extracted data against central PostGIS & MongoDB records to detect mismatches, duplicate entries, and boundary conflicts.
          </p>
        </div>
      </div>

      {/* Main Grid: Upload & Inspection */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upload & Form Simulation */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
          <h3 className="font-bold text-slate-200 text-sm border-b border-slate-800 pb-2 flex items-center gap-2">
            <Upload className="w-4 h-4 text-purple-400" />
            <span>1. Document Ingestion & Target Record</span>
          </h3>

          <form onSubmit={handleRunOCR} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Target 14-Digit ULPIN Key:</label>
              <select
                value={selectedUlpin}
                onChange={(e) => setSelectedUlpin(e.target.value)}
                className="w-full bg-slate-800 text-white p-3 rounded-xl border border-slate-700 font-mono focus:ring-2 focus:ring-purple-500 focus:outline-none"
              >
                {parcels.map((p) => (
                  <option key={p.id} value={p.ulpin}>
                    ULPIN {p.ulpin} - {p.owner.name} ({p.surveyNo})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-400 font-semibold mb-1">Document Category:</label>
              <select
                value={docType}
                onChange={(e) => setDocType(e.target.value)}
                className="w-full bg-slate-800 text-white p-3 rounded-xl border border-slate-700 focus:ring-2 focus:ring-purple-500 focus:outline-none"
              >
                <option value="SALE_DEED">Registered Sale Deed / Title Transfer</option>
                <option value="SURVEY_MAP">Field Survey Map / Tippani</option>
                <option value="ENCUMBRANCE_CERTIFICATE">Encumbrance Certificate (EC)</option>
                <option value="TOWN_ZONING_PLAN">Town Planning Zoning Clearance</option>
              </select>
            </div>

            {/* Simulated OCR File Drag-Drop Area */}
            <div className="border-2 border-dashed border-slate-700 rounded-xl p-6 text-center space-y-2 bg-slate-950/60 hover:border-purple-500/60 transition-all cursor-pointer">
              <div className="w-10 h-10 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center mx-auto">
                <FileText className="w-5 h-5" />
              </div>
              <div className="text-slate-300 font-semibold">Simulated Scanned Document Upload</div>
              <p className="text-[11px] text-slate-500">Supports PDF, TIFF, PNG scanned deeds up to 25MB</p>
            </div>

            <div className="space-y-3 pt-2 border-t border-slate-800">
              <span className="font-semibold text-slate-300">Scanned Text Fields (OCR Simulation):</span>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Owner Name:</label>
                  <input
                    type="text"
                    value={ownerNameInput}
                    onChange={(e) => setOwnerNameInput(e.target.value)}
                    className="w-full bg-slate-800 text-white p-2.5 rounded-xl border border-slate-700"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Survey No:</label>
                  <input
                    type="text"
                    value={surveyNoInput}
                    onChange={(e) => setSurveyNoInput(e.target.value)}
                    className="w-full bg-slate-800 text-white p-2.5 rounded-xl border border-slate-700 font-mono"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={verifying}
              className="w-full bg-purple-600 hover:bg-purple-500 text-white font-bold py-3 px-4 rounded-xl shadow-lg shadow-purple-950/80 flex items-center justify-center space-x-2 transition-all"
            >
              <Cpu className={`w-4 h-4 ${verifying ? 'animate-spin' : ''}`} />
              <span>{verifying ? 'Running AI & OCR Cross-Verification...' : 'Execute AI Cross-Verification'}</span>
            </button>
          </form>
        </div>

        {/* Verification Results Panel */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="font-bold text-slate-200 text-sm border-b border-slate-800 pb-2 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span>2. AI Verification Results & Mismatch Audit</span>
            </h3>

            {ocrResult ? (
              <div className="space-y-4 text-xs">
                {/* Result Badge */}
                <div className={`p-4 rounded-xl border flex items-center justify-between ${
                  ocrResult.aiVerificationResult.isFullyVerified
                    ? 'bg-emerald-950/40 border-emerald-800/60 text-emerald-200'
                    : 'bg-rose-950/40 border-rose-800/60 text-rose-200'
                }`}>
                  <div className="flex items-center space-x-3">
                    {ocrResult.aiVerificationResult.isFullyVerified ? (
                      <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                    ) : (
                      <AlertTriangle className="w-6 h-6 text-rose-400" />
                    )}
                    <div>
                      <div className="font-bold text-sm">
                        {ocrResult.aiVerificationResult.status}
                      </div>
                      <div className="text-[11px] text-slate-300">
                        {ocrResult.aiVerificationResult.conflictDetails}
                      </div>
                    </div>
                  </div>
                  <span className="font-mono text-xs font-bold px-2.5 py-1 rounded bg-slate-900">
                    Confidence: {ocrResult.aiVerificationResult.confidenceScorePct}%
                  </span>
                </div>

                {/* Extracted Data Audit Table */}
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2 font-mono">
                  <div className="text-slate-400 font-semibold border-b border-slate-800 pb-1 flex justify-between">
                    <span>FIELD NAME</span>
                    <span>EXTRACTED VALUE</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Owner Name:</span>
                    <span className="text-white font-bold">{ocrResult.ocrExtractedData.ownerNameExtracted}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Survey No:</span>
                    <span className="text-cyan-300 font-bold">{ocrResult.ocrExtractedData.surveyNoExtracted}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Target ULPIN:</span>
                    <span className="text-amber-300">{ocrResult.targetUlpin}</span>
                  </div>
                  <div className="flex justify-between border-t border-slate-900 pt-1">
                    <span className="text-slate-400">Registry Doc ID:</span>
                    <span className="text-slate-300">{ocrResult.documentId}</span>
                  </div>
                </div>

                {/* Mismatched Fields Alert */}
                {ocrResult.aiVerificationResult.mismatchFields.length > 0 && (
                  <div className="bg-rose-950/60 p-3 rounded-xl border border-rose-800/80 text-rose-300 space-y-1">
                    <div className="font-bold text-xs flex items-center gap-1">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>Flagged Discrepancies:</span>
                    </div>
                    <ul className="list-disc list-inside text-[11px] space-y-0.5">
                      {ocrResult.aiVerificationResult.mismatchFields.map((field, idx) => (
                        <li key={idx}>{field}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ) : (
              <div className="h-48 flex flex-col items-center justify-center text-center p-6 text-slate-500 space-y-2 border border-slate-800/60 rounded-xl bg-slate-950/40">
                <Scan className="w-8 h-8 text-slate-600 animate-pulse" />
                <div className="text-slate-300 font-semibold text-xs">Awaiting Document Execution</div>
                <p className="text-[11px] text-slate-500 max-w-xs">
                  Fill in the scanned document fields on the left and click "Execute AI Cross-Verification" to run automated OCR comparison.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
