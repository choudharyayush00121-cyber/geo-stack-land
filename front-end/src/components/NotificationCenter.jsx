import React from 'react';
import {
  Bell,
  CheckCircle2,
  AlertTriangle,
  Lock,
  Radio,
  FileCheck,
  Zap,
  Trash2,
  Check,
  Sparkles
} from 'lucide-react';

export default function NotificationCenter({
  isOpen,
  onClose,
  notifications,
  onClearAll,
  onMarkRead,
  onNotificationClick
}) {
  if (!isOpen) return null;

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="absolute right-0 top-14 w-80 sm:w-96 bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl z-[1500] text-white overflow-hidden animate-scale-up">
      {/* Header */}
      <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
        <div className="flex items-center space-x-2">
          <Bell className="w-4 h-4 text-cyan-400" />
          <h4 className="font-bold text-xs text-white">Live System Audit Feed</h4>
          {unreadCount > 0 && (
            <span className="bg-cyan-500 text-slate-950 font-bold text-[10px] px-2 py-0.5 rounded-full">
              {unreadCount} New
            </span>
          )}
        </div>
        <div className="flex items-center space-x-2 text-[10px]">
          {notifications.length > 0 && (
            <button
              onClick={onClearAll}
              className="text-slate-400 hover:text-rose-400 flex items-center gap-1 font-semibold transition-colors"
            >
              <Trash2 className="w-3 h-3" />
              <span>Clear</span>
            </button>
          )}
        </div>
      </div>

      {/* Notifications List */}
      <div className="max-h-80 overflow-y-auto p-2 space-y-1.5 text-xs">
        {notifications.length === 0 ? (
          <div className="p-8 text-center space-y-2 text-slate-500">
            <Sparkles className="w-8 h-8 mx-auto text-slate-600 animate-pulse" />
            <p className="text-xs font-semibold text-slate-400">All Notifications Read</p>
            <p className="text-[10px] text-slate-500">Real-time SSE events and audit logs will appear here live.</p>
          </div>
        ) : (
          notifications.map((n) => {
            const getIcon = () => {
              if (n.type === 'LIEN_LOCK') return <Lock className="w-4 h-4 text-rose-400" />;
              if (n.type === 'DRONE') return <Radio className="w-4 h-4 text-cyan-400" />;
              if (n.type === 'EC') return <FileCheck className="w-4 h-4 text-emerald-400" />;
              return <AlertTriangle className="w-4 h-4 text-amber-400" />;
            };

            return (
              <div
                key={n.id}
                onClick={() => onNotificationClick && onNotificationClick(n)}
                className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-start justify-between gap-2 ${
                  n.read
                    ? 'bg-slate-950/40 border-slate-800/60 opacity-75'
                    : 'bg-slate-800/80 border-cyan-500/30 shadow-lg shadow-cyan-500/5'
                }`}
              >
                <div className="flex items-start space-x-3">
                  <div className="mt-0.5 shrink-0">{getIcon()}</div>
                  <div className="space-y-0.5">
                    <p className="font-bold text-white text-[11px] leading-tight">{n.title}</p>
                    <p className="text-slate-400 text-[10px] leading-normal">{n.message}</p>
                    <p className="text-[9px] font-mono text-cyan-400 mt-1">{n.time}</p>
                  </div>
                </div>
                {!n.read && (
                  <span className="w-2 h-2 rounded-full bg-cyan-400 shrink-0 mt-1 animate-pulse"></span>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Footer */}
      <div className="p-2.5 border-t border-slate-800 bg-slate-950 text-center text-[10px] text-slate-500 font-mono">
        GeoLand Stack Real-Time Event Bus • SSE Stream Connected
      </div>
    </div>
  );
}
