import React, { useState } from 'react';
import { Search, ShieldCheck, Cpu, Layers, Activity, Lock, Key, Satellite, Check, Sparkles, User, Shield, Bell, Command, Box } from 'lucide-react';
import NotificationCenter from './NotificationCenter';
import axios from 'axios';

export default function Header({
  onSearch,
  activeView,
  setActiveView,
  dpiStatus,
  userRole,
  currentUser,
  onOpenAuthModal,
  onLogout,
  onOpenCommandPalette,
  notifications = [],
  onClearNotifications,
  onNotificationClick
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    onSearch(searchTerm);
  };

  const getRoleBadge = () => {
    if (userRole === 'CITIZEN') {
      return { label: 'Citizen View', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' };
    }
    if (userRole === 'OFFICIAL') {
      return { label: 'Govt Officer View', color: 'bg-amber-500/20 text-amber-300 border-amber-500/40' };
    }
    return { label: 'System Admin', color: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40' };
  };

  const roleBadge = getRoleBadge();

  return (
    <header className="bg-slate-900/95 backdrop-blur border-b border-slate-800 sticky top-0 z-50 px-4 py-3 text-white">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Brand & SIH Logo */}
        <div className="flex items-center space-x-3 cursor-pointer group" onClick={() => setActiveView('map')}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 ring-1 ring-cyan-400/40 group-hover:scale-110 group-hover:rotate-3 group-hover:shadow-cyan-500/40 transition-all duration-300">
            <Layers className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-400 bg-clip-text text-transparent group-hover:brightness-125 transition-all">
                GeoLand Stack
              </span>
              <span className="bg-cyan-500/20 text-cyan-300 text-xs px-2 py-0.5 rounded-full border border-cyan-500/30 font-medium">
                DPI Portal
              </span>
            </div>
            <p className="text-xs text-slate-400 flex items-center gap-1">
              <span>SIH 2026 • PS ID: 26014</span>
              <span className="text-slate-600">•</span>
              <span className="text-emerald-400 font-medium flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                DPI API Active
              </span>
            </p>
          </div>
        </div>

        {/* Global Search & Command Palette & 3D Twin Trigger */}
        <div className="w-full md:w-auto flex-1 max-w-xl relative flex items-center gap-2">
          <form onSubmit={handleSearchSubmit} className="flex-1 relative">
            <input
              type="text"
              placeholder="Search Plot No / Survey No / Owner Name..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                onSearch(e.target.value);
              }}
              className="w-full bg-slate-800/80 hover:bg-slate-800 text-xs text-slate-100 placeholder-slate-400 pl-9 pr-14 py-2.5 rounded-xl border border-slate-700 hover:border-slate-600 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all font-mono shadow-inner"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <button
              type="button"
              onClick={onOpenCommandPalette}
              title="Open Spotlight Search (Ctrl+K)"
              className="absolute right-2 top-2 bg-slate-700/80 hover:bg-slate-600 text-slate-300 px-1.5 py-0.5 rounded text-[10px] font-mono flex items-center gap-0.5 border border-slate-600 transition-all hover:scale-105 active:scale-95"
            >
              <Command className="w-2.5 h-2.5" /> K
            </button>
          </form>

          {/* Quick 3D Digital Twin View Button */}
          <button
            type="button"
            onClick={() => setActiveView(activeView === 'twin-3d' ? 'map' : 'twin-3d')}
            className={`px-3 py-2.5 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 transition-all duration-200 border hover:scale-105 active:scale-95 ${
              activeView === 'twin-3d'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white border-cyan-300 shadow-[0_0_20px_rgba(6,182,212,0.5)]'
                : 'bg-slate-800/90 hover:bg-slate-700 text-cyan-300 border-cyan-500/40 hover:shadow-[0_0_15px_rgba(6,182,212,0.25)]'
            }`}
            title="Switch to 3D Cadastral Digital Twin Mode"
          >
            <Box className="w-4 h-4 text-cyan-300 animate-pulse" />
            <span className="hidden sm:inline">3D Twin</span>
          </button>
        </div>

        {/* User Account, Notifications & Actions */}
        <div className="flex items-center space-x-3 relative">
          {/* Notification Bell Dropdown Button */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 hover:border-slate-600 transition-all hover:scale-105 active:scale-95 shadow-md"
              title="Live Audit Notifications"
            >
              <Bell className="w-4 h-4 text-cyan-300" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-cyan-500 text-slate-950 font-bold text-[9px] flex items-center justify-center animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notification Center Dropdown Panel */}
            <NotificationCenter
              isOpen={showNotifications}
              onClose={() => setShowNotifications(false)}
              notifications={notifications}
              onClearAll={onClearNotifications}
              onNotificationClick={(n) => {
                if (onNotificationClick) onNotificationClick(n);
                setShowNotifications(false);
              }}
            />
          </div>

          {/* User Auth Profile Button / Modal Launcher */}
          {currentUser ? (
            <div className="flex items-center space-x-2 bg-slate-800/80 border border-slate-700 p-1 pl-3 rounded-xl">
              <div className="text-left hidden sm:block">
                <p className="text-xs font-bold text-slate-200 line-clamp-1">{currentUser.name}</p>
                <p className="text-[10px] text-cyan-400 font-mono">{roleBadge.label}</p>
              </div>
              <button
                onClick={onLogout}
                title="Logout"
                className="bg-slate-700 hover:bg-rose-600 text-white text-xs px-2.5 py-1.5 rounded-lg transition-all font-medium"
              >
                Logout
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAuthModal}
              className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold px-3.5 py-2 rounded-xl text-xs flex items-center space-x-2 shadow-lg shadow-cyan-500/20 transition-all border border-cyan-400/30"
            >
              <User className="w-4 h-4" />
              <span>Login / Register</span>
            </button>
          )}

          {/* Active RBAC Badge */}
          <span className={`hidden lg:flex px-2.5 py-1 rounded-full text-xs font-mono font-bold border items-center gap-1 ${roleBadge.color}`}>
            <Shield className="w-3.5 h-3.5" />
            <span>{roleBadge.label}</span>
          </span>
        </div>
      </div>
    </header>
  );
}
