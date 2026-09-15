import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  Bot,
  X,
  Send,
  Volume2,
  VolumeX,
  Layers,
  ShieldCheck,
  FileCheck,
  AlertTriangle,
  ChevronRight,
  Maximize2,
  Minimize2,
  CornerDownRight,
  Calculator,
  Eye,
  Lock,
  ArrowUpRight
} from 'lucide-react';
import { playClickSound, playSuccessChime, playAlertBuzzer } from '../utils/audioEffects';

export default function BhuMitraCopilot({
  selectedParcel,
  parcels = [],
  onSelectParcel,
  setActiveView,
  showToast
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState([
    {
      id: 'msg-init-1',
      sender: 'bot',
      time: 'Just now',
      text: "Namaste! I am **Bhu-Mitra**, your AI Land Governance & Cadastral Copilot. I can audit conclusive titles, explain banking lien locks, compute guideline valuations, and detect zoning buffer breaches across India's Digital Public Infrastructure (DPI).",
      actions: [
        { label: 'Audit Selected Parcel', query: 'Audit the title deed, encumbrances, and zoning for the currently selected parcel.' },
        { label: 'How DPI Prevents Fraud', query: 'How does the DPI Gateway prevent fraudulent double registration of mortgaged land?' },
        { label: 'Explain 14-Digit ULPIN', query: 'How is the 14-digit Bhu-Aadhaar ULPIN generated and why is it conclusive?' }
      ]
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  // Handle Text-to-Speech
  const speakText = (text) => {
    if (!voiceEnabled || typeof window === 'undefined' || !window.speechSynthesis) return;

    window.speechSynthesis.cancel();
    const cleanText = text.replace(/[*_#`[\]()]/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    // Prefer an English (Indian) or standard English voice if available
    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(v => v.lang.includes('en-IN')) || voices.find(v => v.lang.includes('en-US')) || voices[0];
    if (preferredVoice) utterance.voice = preferredVoice;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  // Generate Smart Contextual Response
  const generateAIResponse = (query) => {
    const q = query.toLowerCase();
    const current = selectedParcel || parcels[0] || {};

    // 1. Audit / Selected Parcel Query
    if (q.includes('audit') || q.includes('selected parcel') || q.includes('check title') || (selectedParcel && q.includes(selectedParcel.ulpin.toLowerCase()))) {
      const isEncumbered = current.financial?.isEncumbered;
      const hasDispute = current.financial?.courtDispute;
      const isEncroached = current.aiSurveillance?.encroachmentDetected;

      return {
        text: `### 📋 Cadastral & Legal Audit for ULPIN: **${current.ulpin}**\n\n` +
          `• **Owner:** ${current.owner?.name} (${current.owner?.mutationStatus})\n` +
          `• **Location:** Sy. No. ${current.surveyNo}, ${current.village}, ${current.taluk}, ${current.district}\n` +
          `• **Zoning:** ${current.zoning} (${current.zoningCode}) | Area: ${current.areaSqFt?.toLocaleString()} sq.ft (${current.areaAcres} Acres)\n` +
          `• **Market Valuation:** ₹${(current.marketValue / 10000000).toFixed(2)} Cr (@ Circle Rate ₹${current.circleRatePerSqFt}/sq.ft)\n` +
          `• **Banking Lien Status:** ${isEncumbered ? `🚨 **ENCUMBERED** to ${current.financial?.bankLien} for ₹${(current.financial?.loanAmount / 100000).toFixed(1)} Lakhs` : '✅ **UNENCUMBERED (CLEAR TITLE)**'}\n` +
          `• **AI Satellite Surveillance:** ${isEncroached ? `⚠️ **ALERT:** ${current.aiSurveillance?.detectedViolation} (Risk Score: ${current.aiSurveillance?.riskScore}/100)` : '✅ Boundary verified with 0% encroachment.'}\n\n` +
          `**Legal Conclusiveness:** Title is backed by Section 17 Registration Act and DILRMP spatial anchoring.`,
        actionButtons: [
          { label: 'View 3D Cadastral Twin', view: 'twin-3d' },
          { label: 'Generate Official EC', view: 'ec' },
          { label: 'AI Encroachment Scan', view: 'ai' }
        ]
      };
    }

    // 2. How DPI Prevents Fraud
    if (q.includes('fraud') || q.includes('double registration') || q.includes('mortgage') || q.includes('dpi prevent')) {
      return {
        text: `### 🛡️ How GeoLand DPI Eliminates Land Fraud:\n\n` +
          `1. **Real-Time Cross-Departmental Locking:** When a bank mortgages land, an immutable **Encumbrance Lock** is propagated instantly via API to the Sub-Registrar's Office (SRO).\n` +
          `2. **Automated Gateway Interception:** If a fraudulent seller attempts to execute a Sale Deed, the SRO system automatically queries the central DPI gateway in <50ms. If a lien is detected, registration is **strictly halted**.\n` +
          `3. **Conclusive Bhu-Aadhaar Anchor:** Eliminates duplicate survey numbers and outdated paper deeds by anchoring every title to immutable GIS polygon vertices (WGS84).`,
        actionButtons: [
          { label: 'Test Live Fraud Simulation', view: 'dpi' },
          { label: 'View Multi-Agency Flow', view: 'solution' }
        ]
      };
    }

    // 3. ULPIN Generation
    if (q.includes('ulpin') || q.includes('bhu-aadhaar') || q.includes('14-digit') || q.includes('format')) {
      return {
        text: `### 📍 Bhu-Aadhaar: The 14-Digit Spatial ULPIN Standard\n\n` +
          `• **Definition:** Unique Land Parcel Identification Number (ULPIN) is the **Aadhaar of Land** under DILRMP.\n` +
          `• **Generation Algorithm:** Derived from the exact latitude-longitude vertices of the parcel boundary using the WGS-84 datum.\n` +
          `• **Interoperability:** Connects Cadastral Maps (Bhu-Naksha), Land Records (RoR), Registration Deeds (Stamper), and PM-KISAN subsidy engines seamlessly without spatial discrepancy.`,
        actionButtons: [
          { label: 'Inspect GIS Coordinates', view: 'map' },
          { label: 'Read Govt Policy Research', view: 'research' }
        ]
      };
    }

    // 4. Stamp Duty & Valuation
    if (q.includes('stamp duty') || q.includes('tax') || q.includes('valuation') || q.includes('circle rate')) {
      const dutyPct = current.stampDutyRatePct || 5.6;
      const estimatedDuty = Math.round((current.marketValue * dutyPct) / 100);
      return {
        text: `### 📊 Automated Stamp Duty & Valuation for ${current.surveyNo || 'Active Parcel'}:\n\n` +
          `• **Circle Rate (Guideline Value):** ₹${current.circleRatePerSqFt || 5000} / sq.ft\n` +
          `• **Total Property Valuation:** ₹${(current.marketValue / 10000000).toFixed(2)} Crore\n` +
          `• **Applicable Stamp Duty:** ${dutyPct}% (₹${(estimatedDuty / 100000).toFixed(2)} Lakhs)\n` +
          `• **Registration Fee:** 1.0% + Municipal Surcharge\n` +
          `*Note: Commercial & Industrial zonings incur a 1.0% state infrastructure surcharge under State Land Revenue Acts.*`,
        actionButtons: [
          { label: 'Open Tax Calculator', view: 'tax' }
        ]
      };
    }

    // 5. Lake Buffer / Encroachment rules
    if (q.includes('lake buffer') || q.includes('buffer zone') || q.includes('encroachment') || q.includes('rajakaluve')) {
      return {
        text: `### 🌊 Ecological & Waterbody Buffer Zone Directives\n\n` +
          `• **National Green Tribunal (NGT) Mandate:** 30m buffer from lake boundaries & primary storm drains (Rajakaluve) are **strictly non-buildable**.\n` +
          `• **AI Detection Mechanism:** Compares historical ISRO Cartosat multispectral scans with live Sentinel-2 / Drone imagery. Changes in Normalized Difference Built-Up Index (NDBI) trigger immediate automatic notices to the Town Planning Authority.`,
        actionButtons: [
          { label: 'Launch AI Surveillance', view: 'ai' },
          { label: 'View 3D Strata Mesh', view: 'twin-3d' }
        ]
      };
    }

    // 6. Supreme Court Precedent (Suraj Lamp)
    if (q.includes('suraj lamp') || q.includes('precedent') || q.includes('court') || q.includes('gpa')) {
      return {
        text: `### ⚖️ Supreme Court Landmark Precedent: Suraj Lamp & Industries (2012)\n\n` +
          `• **Ruling:** Transactions done via General Power of Attorney (GPA), Agreement to Sell (ATS), or Will do **NOT** confer legal ownership title.\n` +
          `• **DPI Enforcement:** GeoLand strictly rejects mutation requests lacking a registered conveyance deed under Section 17 of the Registration Act 1908, ensuring 100% conclusive land ownership.`,
        actionButtons: [
          { label: 'Review Legal Precedents', view: 'agent-cockpit' }
        ]
      };
    }

    // Default Fallback
    return {
      text: `### 🤖 Bhu-Mitra Cadastral Response:\n\n` +
        `Regarding "${query}":\n` +
        `The GeoLand Stack operates as a real-time Digital Public Infrastructure connecting **14 digitized parcels** across Himachal Pradesh, Karnataka, and Maharashtra.\n\n` +
        `Current active parcel is **ULPIN ${current.ulpin || '14829304812901'}** (Sy. No. ${current.surveyNo || '42/1A'}). Would you like to inspect its conclusive title certificate, verify banking encumbrances, or simulate a multi-agency transaction?`,
      actionButtons: [
        { label: 'View on GIS Map', view: 'map' },
        { label: 'Open DPI Gateway', view: 'dpi' },
        { label: 'Verify EC Certificate', view: 'ec' }
      ]
    };
  };

  const handleSendMessage = (textToSend = inputText) => {
    if (!textToSend.trim()) return;

    playClickSound();
    const userMsg = {
      id: `user-${Date.now()}`,
      sender: 'user',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: textToSend
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    setTimeout(() => {
      const responseData = generateAIResponse(textToSend);
      const botMsg = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        text: responseData.text,
        actionButtons: responseData.actionButtons
      };
      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
      playSuccessChime();

      if (voiceEnabled) {
        speakText(responseData.text);
      }
    }, 550);
  };

  return (
    <>
      {/* Floating Widget Launcher Button */}
      {!isOpen && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center space-x-3">
          <button
            onClick={() => {
              playClickSound();
              setIsOpen(true);
            }}
            className="group relative flex items-center space-x-2.5 bg-gradient-to-r from-cyan-600 via-sky-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold px-4 py-3 rounded-2xl shadow-[0_0_30px_rgba(6,182,212,0.4)] border border-cyan-400/40 hover:scale-105 active:scale-95 transition-all duration-300"
          >
            <div className="relative">
              <Sparkles className="w-5 h-5 text-cyan-200 animate-spin" style={{ animationDuration: '4s' }} />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full animate-ping"></span>
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full"></span>
            </div>
            <div className="text-left">
              <span className="block text-xs font-extrabold tracking-wide uppercase">Ask Bhu-Mitra</span>
              <span className="block text-[10px] text-cyan-100 font-normal">Land Governance AI</span>
            </div>
          </button>
        </div>
      )}

      {/* Floating AI Chat Window Modal */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-[92vw] sm:w-[460px] h-[600px] max-h-[85vh] bg-slate-950/95 backdrop-blur-xl border border-cyan-500/40 rounded-3xl shadow-[0_15px_50px_rgba(0,0,0,0.8),0_0_35px_rgba(6,182,212,0.25)] flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-300">
          {/* Header Bar */}
          <div className="bg-gradient-to-r from-slate-900 via-cyan-950 to-slate-900 border-b border-cyan-500/30 p-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/30 text-white">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-extrabold text-sm text-white tracking-tight">Bhu-Mitra AI Copilot</span>
                  <span className="bg-cyan-500/20 text-cyan-300 text-[10px] px-2 py-0.5 rounded-full border border-cyan-500/30 font-mono">
                    DPI v2.6
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 flex items-center gap-1.5 font-mono">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  Multi-Agency Legal & Cadastral Reasoning
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-1.5">
              {/* Voice Speech Toggle */}
              <button
                type="button"
                onClick={() => {
                  playClickSound();
                  if (voiceEnabled) stopSpeaking();
                  setVoiceEnabled(!voiceEnabled);
                  if (showToast) {
                    showToast(!voiceEnabled ? 'Voice readout enabled 🔊' : 'Voice readout muted 🔇', 'info');
                  }
                }}
                className={`p-2 rounded-xl transition-all ${
                  voiceEnabled
                    ? 'bg-cyan-500 text-slate-950 font-bold shadow-[0_0_12px_rgba(6,182,212,0.6)]'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
                title={voiceEnabled ? 'Voice Readout Active' : 'Enable Voice Readout'}
              >
                {voiceEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </button>

              {/* Close Button */}
              <button
                type="button"
                onClick={() => {
                  playClickSound();
                  stopSpeaking();
                  setIsOpen(false);
                }}
                className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-all"
                title="Close Copilot"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Active Context Banner */}
          {selectedParcel && (
            <div className="bg-slate-900/90 px-4 py-2 border-b border-slate-800 flex items-center justify-between text-[11px] font-mono text-slate-300">
              <span className="flex items-center gap-1.5 truncate">
                <Layers className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
                <span className="text-cyan-300 font-bold truncate">ULPIN {selectedParcel.ulpin}</span>
                <span className="text-slate-500">•</span>
                <span className="truncate">{selectedParcel.surveyNo} ({selectedParcel.owner?.name})</span>
              </span>
              <span className={`px-1.5 py-0.2 rounded text-[9px] font-bold ${
                selectedParcel.financial?.isEncumbered ? 'bg-amber-500/20 text-amber-300' : 'bg-emerald-500/20 text-emerald-300'
              }`}>
                {selectedParcel.financial?.isEncumbered ? 'Lien Locked' : 'Clear Title'}
              </span>
            </div>
          )}

          {/* Messages Scroll Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs font-sans">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'} space-y-1.5`}
              >
                <div className="flex items-center space-x-1.5 px-1 text-[10px] text-slate-500 font-mono">
                  <span>{m.sender === 'user' ? 'You' : 'Bhu-Mitra'}</span>
                  <span>•</span>
                  <span>{m.time}</span>
                </div>

                <div
                  className={`p-3.5 rounded-2xl max-w-[90%] leading-relaxed ${
                    m.sender === 'user'
                      ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-br-none shadow-md'
                      : 'bg-slate-900 text-slate-200 border border-slate-800 rounded-bl-none shadow-lg'
                  }`}
                >
                  <div className="whitespace-pre-line prose prose-invert prose-xs">
                    {m.text}
                  </div>

                  {/* Embedded AI Action Pills */}
                  {m.actions && (
                    <div className="mt-3 pt-2 border-t border-slate-800 flex flex-wrap gap-1.5">
                      {m.actions.map((act, i) => (
                        <button
                          key={i}
                          onClick={() => handleSendMessage(act.query)}
                          className="bg-slate-800 hover:bg-cyan-950 text-cyan-300 hover:text-cyan-200 border border-cyan-500/30 hover:border-cyan-400 px-2.5 py-1 rounded-lg text-[10px] font-medium transition-all text-left flex items-center gap-1"
                        >
                          <CornerDownRight className="w-2.5 h-2.5 text-cyan-400 flex-shrink-0" />
                          <span>{act.label}</span>
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Response Navigation Buttons */}
                  {m.actionButtons && (
                    <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex flex-wrap gap-2">
                      {m.actionButtons.map((btn, i) => (
                        <button
                          key={i}
                          onClick={() => {
                            playClickSound();
                            if (setActiveView) setActiveView(btn.view);
                            if (showToast) showToast(`Navigated to ${btn.label}`, 'info');
                          }}
                          className="bg-gradient-to-r from-cyan-900/80 to-blue-900/80 hover:from-cyan-800 hover:to-blue-800 text-cyan-200 px-2.5 py-1.5 rounded-lg text-[10px] font-bold border border-cyan-500/40 flex items-center gap-1 shadow-sm transition-all hover:scale-105 active:scale-95"
                        >
                          <span>{btn.label}</span>
                          <ArrowUpRight className="w-3 h-3 text-cyan-300" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center space-x-2 text-slate-400 p-2 text-xs font-mono">
                <Bot className="w-4 h-4 text-cyan-400 animate-bounce" />
                <span>Bhu-Mitra is synthesizing legal & cadastral graph...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input & Prompt Bar */}
          <div className="p-3 bg-slate-900/90 border-t border-slate-800 space-y-2">
            {/* Quick Suggestions Chips */}
            <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 text-[10px] font-mono no-scrollbar">
              <button
                onClick={() => handleSendMessage('Check title validity & liens for selected parcel')}
                className="whitespace-nowrap bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-cyan-300 px-2.5 py-1 rounded-lg border border-slate-700 transition-all"
              >
                🔍 Audit Title
              </button>
              <button
                onClick={() => handleSendMessage('How does DPI prevent fraudulent double registrations?')}
                className="whitespace-nowrap bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-cyan-300 px-2.5 py-1 rounded-lg border border-slate-700 transition-all"
              >
                🛡️ Fraud Prevention
              </button>
              <button
                onClick={() => handleSendMessage('Explain the 30m lake buffer zone encroachment rule')}
                className="whitespace-nowrap bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-cyan-300 px-2.5 py-1 rounded-lg border border-slate-700 transition-all"
              >
                🌊 Lake Buffer Rule
              </button>
              <button
                onClick={() => handleSendMessage('Calculate stamp duty & guideline valuation for selected parcel')}
                className="whitespace-nowrap bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-cyan-300 px-2.5 py-1 rounded-lg border border-slate-700 transition-all"
              >
                💰 Stamp Duty
              </button>
            </div>

            {/* Message Input Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center space-x-2"
            >
              <input
                type="text"
                placeholder="Ask about ULPIN, court precedents, lien lock, stamp duty..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="flex-1 bg-slate-800 text-xs text-white placeholder-slate-400 px-3.5 py-2.5 rounded-xl border border-slate-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 font-sans"
              />
              <button
                type="submit"
                disabled={!inputText.trim()}
                className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:opacity-40 text-white p-2.5 rounded-xl transition-all shadow-md flex-shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
