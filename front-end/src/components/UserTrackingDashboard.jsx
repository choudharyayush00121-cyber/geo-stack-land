import React, { useState, useEffect } from 'react';
import { Users, Activity, Shield, Clock, MapPin, Search } from 'lucide-react';

export default function UserTrackingDashboard({ currentUser }) {
  const [activeSessions, setActiveSessions] = useState([
    // Mock data for now, since real DB requires Postgres running
    { id: 1, name: 'Ayush Choudhary', role: 'ADMIN', lastSeen: 'Just now', ip: '192.168.1.5', location: 'Bengaluru' },
    { id: 2, name: 'Ramesh (Tehsildar)', role: 'OFFICIAL', lastSeen: '2 mins ago', ip: '192.168.1.12', location: 'Mysuru' },
    { id: 3, name: 'Suresh Kumar', role: 'CITIZEN', lastSeen: '15 mins ago', ip: '192.168.1.8', location: 'Bengaluru' }
  ]);

  const [auditLogs, setAuditLogs] = useState([
    { id: 1, user: 'Ayush Choudhary', action: 'Accessed Admin Controls', time: 'Just now', type: 'ADMIN' },
    { id: 2, user: 'Ramesh (Tehsildar)', action: 'Viewed GIS Map Engine', time: '5 mins ago', type: 'VIEW' },
    { id: 3, user: 'Suresh Kumar', action: 'Requested Encumbrance Cert', time: '18 mins ago', type: 'ACTION' }
  ]);

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6 h-full overflow-y-auto">
      <div className="flex items-center gap-3 mb-6">
        <Activity className="w-8 h-8 text-indigo-400" />
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">System & User Tracking Analytics</h2>
          <p className="text-sm text-slate-400">Real-time surveillance of user sessions and system audit logs.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Sessions Panel */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="font-bold text-slate-200 flex items-center gap-2">
              <Users className="w-5 h-5 text-cyan-400" />
              Live Connected Sessions
            </h3>
            <span className="bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full text-xs font-bold border border-emerald-500/30 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              {activeSessions.length} Online
            </span>
          </div>

          <div className="space-y-3">
            {activeSessions.map(session => (
              <div key={session.id} className="p-4 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between group hover:border-cyan-500/50 transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center font-bold text-slate-300">
                    {session.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-200 text-sm flex items-center gap-2">
                      {session.name}
                      {session.role === 'ADMIN' && <Shield className="w-3.5 h-3.5 text-indigo-400" />}
                    </h4>
                    <div className="flex items-center gap-3 text-xs text-slate-500 mt-1 font-mono">
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {session.lastSeen}</span>
                      <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {session.ip} ({session.location})</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`text-[10px] px-2 py-1 rounded font-bold ${
                    session.role === 'ADMIN' ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30' :
                    session.role === 'OFFICIAL' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                    'bg-slate-800 text-slate-400 border border-slate-700'
                  }`}>
                    {session.role}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Audit Logs */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <h3 className="font-bold text-slate-200 flex items-center gap-2 border-b border-slate-800 pb-3">
            <Search className="w-5 h-5 text-purple-400" />
            Recent Activity Log
          </h3>
          <div className="space-y-4 relative before:absolute before:inset-0 before:ml-2 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-800 before:to-transparent">
            {auditLogs.map((log, idx) => (
              <div key={log.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                <div className="flex items-center justify-center w-5 h-5 rounded-full border border-slate-700 bg-slate-900 text-slate-500 group-[.is-active]:text-emerald-500 group-[.is-active]:border-emerald-500 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                  <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
                </div>
                <div className="w-[calc(100%-2.5rem)] md:w-[calc(50%-1.25rem)] p-3 rounded border border-slate-800 bg-slate-950 shadow">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-slate-300 text-xs">{log.user}</span>
                    <span className="font-mono text-[9px] text-slate-500">{log.time}</span>
                  </div>
                  <div className="text-slate-400 text-[11px]">{log.action}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
