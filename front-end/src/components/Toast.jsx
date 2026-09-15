import React, { useEffect } from 'react';
import { CheckCircle2, AlertTriangle, Info, X, Sparkles } from 'lucide-react';

export default function Toast({ message, type = 'info', onClose, duration = 4000 }) {
  useEffect(() => {
    if (duration) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const getToastStyles = () => {
    switch (type) {
      case 'success':
        return {
          bg: 'bg-slate-900/95 border-emerald-500/50 text-emerald-200 shadow-emerald-500/10',
          icon: <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
        };
      case 'warning':
        return {
          bg: 'bg-slate-900/95 border-amber-500/50 text-amber-200 shadow-amber-500/10',
          icon: <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
        };
      case 'error':
        return {
          bg: 'bg-slate-900/95 border-rose-500/50 text-rose-200 shadow-rose-500/10',
          icon: <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0" />
        };
      default:
        return {
          bg: 'bg-slate-900/95 border-cyan-500/50 text-cyan-200 shadow-cyan-500/10',
          icon: <Sparkles className="w-5 h-5 text-cyan-400 shrink-0" />
        };
    }
  };

  const style = getToastStyles();

  return (
    <div className="fixed bottom-6 right-6 z-[2000] animate-bounce-in max-w-sm w-full">
      <div
        className={`p-4 rounded-2xl border backdrop-blur-xl shadow-2xl flex items-center justify-between gap-3 text-xs font-medium ${style.bg}`}
      >
        <div className="flex items-center gap-3">
          {style.icon}
          <span className="leading-snug">{message}</span>
        </div>
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
