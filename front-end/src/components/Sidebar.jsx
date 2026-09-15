import React, { useState } from 'react';
import {
  Map,
  Network,
  FileCheck,
  Eye,
  Calculator,
  BarChart3,
  Layers,
  Sparkles,
  Scan,
  ShieldAlert,
  ChevronLeft,
  ChevronRight,
  User,
  ShieldCheck,
  Lock,
  Target,
  Satellite,
  Radio,
  FileText,
  Building,
  HelpCircle,
  Briefcase,
  Award,
  BookOpen,
  Box,
  Cpu
} from 'lucide-react';

export const navigationGroups = [
  {
    title: 'GIS & SPATIAL ENGINE',
    items: [
      {
        id: 'map',
        label: 'GIS Map Engine',
        description: '14-Digit ULPIN Spatial Canvas',
        icon: Map,
        badge: 'Spatial'
      },
      {
        id: 'twin-3d',
        label: '3D Digital Twin Engine',
        description: 'Volumetric Strata & 3D Cadastre',
        icon: Box,
        badge: '3D Spatial'
      }
    ]
  },
  {
    title: 'AI VERIFICATION & STRATEGY',
    items: [
      {
        id: 'agent-cockpit',
        label: 'Agent Orchestration & Evals',
        description: 'LangGraph, CrewAI & Mastra',
        icon: Cpu,
        badge: 'Multi-Agent'
      },
      {
        id: 'ocr',
        label: 'AI & OCR Verification',
        description: 'Scanned Deed OCR Audit',
        icon: Scan,
        badge: 'Audit'
      },
      {
        id: 'risk',
        label: 'Risk & Challenge Matrix',
        description: '10-Pillar Mitigation Dashboard',
        icon: ShieldAlert,
        badge: 'Strategy'
      },
      {
        id: 'ec',
        label: 'EC & Title Lock',
        description: 'Instant Encumbrance Certificate',
        icon: FileCheck,
        badge: 'Security'
      }
    ]
  },
  {
    title: 'SURVEILLANCE & ACQUISITION',
    items: [
      {
        id: 'acquisition',
        label: 'National Land Acquisition',
        description: 'End-to-End Digital Monitoring',
        icon: Briefcase,
        badge: 'National'
      },
      {
        id: 'ai',
        label: 'AI Satellite Surveillance',
        description: 'Temporal Satellite Change Scan',
        icon: Eye,
        badge: 'AI CV'
      },
      {
        id: 'tax',
        label: 'Valuation & Duty Engine',
        description: 'Stamp Duty & Tax Calculator',
        icon: Calculator,
        badge: 'Auto'
      },
      {
        id: 'dpi',
        label: 'DPI Open API Gateway',
        description: 'Multi-Agency Real-Time Sync',
        icon: Network,
        badge: 'Sync'
      }
    ]
  },
  {
    title: 'ANALYTICS & REPORTS',
    items: [
      {
        id: 'feasibility',
        label: '5-Dimension Feasibility',
        description: 'Technical, Data & Economic',
        icon: Award,
        badge: 'Viability'
      },
      {
        id: 'dashboard',
        label: 'Governance Analytics',
        description: 'System Impact & Audit Logs',
        icon: BarChart3,
        badge: 'Logs'
      },
      {
        id: 'solution',
        label: 'Problem vs Solution',
        description: 'Core Ingestion Pipeline Flow',
        icon: Sparkles,
        badge: 'Core DPI'
      },
      {
        id: 'research',
        label: 'Govt Research & References',
        description: 'DILRMP, Bhu-Naksha, ULPIN',
        icon: BookOpen,
        badge: 'References'
      }
    ]
  }
];

export default function Sidebar({ activeView, setActiveView, userRole, setUserRole, disabledForUsers = [] }) {
  const [collapsed, setCollapsed] = useState(false);

  // Filter options based on disabledForUsers unless it's an ADMIN
  let filteredGroups = navigationGroups.map(group => ({
    ...group,
    items: group.items.filter(item => {
      if (userRole === 'ADMIN') return true;
      return !disabledForUsers.includes(item.id);
    })
  })).filter(group => group.items.length > 0);

  if (userRole === 'ADMIN') {
    filteredGroups.push({
      title: 'ADMIN CONTROLS',
      items: [
        {
          id: 'admin-options',
          label: 'Manage User Options',
          description: 'Enable/Disable features for users',
          icon: ShieldCheck,
          badge: 'Admin'
        },
        {
          id: 'user-tracking',
          label: 'User Tracking & Audit',
          description: 'Monitor live sessions & actions',
          icon: ShieldCheck,
          badge: 'Security'
        }
      ]
    });
  }

  return (
    <aside
      className={`${
        collapsed ? 'w-20' : 'w-full md:w-80'
      } bg-slate-900 border-r border-slate-800 p-4 flex flex-col justify-between transition-all duration-300 relative z-40 select-none`}
    >
      <div className="space-y-4">
        {/* Header Branding & Collapse Toggle */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          {!collapsed && (
            <div>
              <span className="font-extrabold text-sm text-white tracking-tight flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-cyan-400" />
                <span>UNIFIED LAND STACK</span>
              </span>
              <p className="text-[10px] text-slate-400 font-mono">DPI & Smart Governance</p>
            </div>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-all mx-auto md:mx-0"
            title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Role-Based Access Control Switcher */}
        {!collapsed && (
          <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 space-y-1 text-xs">
            <div className="text-slate-400 font-semibold flex items-center justify-between">
              <span className="flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-cyan-400" />
                Access Role:
              </span>
              <span className="text-[10px] font-mono text-emerald-400 font-bold">RBAC ACTIVE</span>
            </div>
            <select
              value={userRole}
              onChange={(e) => setUserRole(e.target.value)}
              className="w-full bg-slate-800 text-white text-xs font-semibold p-2 rounded-lg border border-slate-700 focus:ring-2 focus:ring-cyan-500 focus:outline-none"
            >
              <option value="CITIZEN">👤 Citizen (Public Search & ECs)</option>
              <option value="OFFICIAL">🏛️ Government Official (OCR & Mutation)</option>
              <option value="ADMIN">🛡️ System Administrator (Full Access)</option>
            </select>
          </div>
        )}

        {/* Navigation Sections */}
        <div className="space-y-4 overflow-y-auto max-h-[calc(100vh-220px)] pr-1">
          {filteredGroups.map((group, idx) => (
            <div key={idx} className="space-y-1">
              {!collapsed && (
                <div className="px-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider font-mono">
                  {group.title}
                </div>
              )}
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive = activeView === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveView(item.id)}
                    className={`w-full text-left px-3 py-2.5 rounded-xl transition-all duration-200 flex items-center space-x-3 group relative transform hover:translate-x-1.5 active:scale-[0.98] ${
                      isActive
                        ? 'bg-gradient-to-r from-cyan-950/80 via-slate-900 to-blue-950/60 text-cyan-300 border border-cyan-500/40 shadow-lg shadow-cyan-950/60'
                        : 'text-slate-400 hover:bg-slate-800/70 hover:text-slate-200 border border-transparent hover:border-slate-800'
                    }`}
                    title={collapsed ? item.label : undefined}
                  >
                    {/* Active Neon Accent Left Bar */}
                    {isActive && (
                      <span className="absolute left-0 top-2 bottom-2 w-1 bg-gradient-to-b from-cyan-400 to-blue-500 rounded-r shadow-[0_0_8px_#22d3ee]"></span>
                    )}

                    <Icon
                      className={`w-5 h-5 flex-shrink-0 transition-transform duration-200 group-hover:scale-110 ${
                        isActive ? 'text-cyan-400 drop-shadow-[0_0_6px_rgba(34,211,238,0.5)]' : 'text-slate-500 group-hover:text-slate-300'
                      }`}
                    />
                    {!collapsed && (
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-xs truncate group-hover:text-white transition-colors">{item.label}</span>
                          <span
                            className={`text-[9px] px-1.5 py-0.5 rounded font-mono transition-transform duration-200 group-hover:scale-105 ${
                              isActive
                                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                                : 'bg-slate-800/80 text-slate-400 group-hover:text-slate-300'
                            }`}
                          >
                            {item.badge}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-500 truncate group-hover:text-slate-400 transition-colors">{item.description}</p>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* SIH Footer Info */}
      {!collapsed && (
        <div className="mt-4 p-3 rounded-xl bg-slate-950 border border-slate-800 text-[11px] space-y-1 font-mono">
          <div className="flex items-center justify-between text-slate-300">
            <span className="font-bold text-cyan-400">Team Quantum Coders</span>
            <span className="text-[9px] bg-cyan-900/60 text-cyan-300 px-1 rounded">SIH 2026</span>
          </div>
          <p className="text-slate-500 text-[10px]">PS 26014 • DPI Land Governance Platform</p>
        </div>
      )}
    </aside>
  );
}
