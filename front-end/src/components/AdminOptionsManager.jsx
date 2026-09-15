import React from 'react';
import { Shield, Eye, EyeOff } from 'lucide-react';

export default function AdminOptionsManager({ disabledForUsers, setDisabledForUsers, allOptions }) {
  const toggleOption = (id) => {
    if (disabledForUsers.includes(id)) {
      setDisabledForUsers(disabledForUsers.filter(opt => opt !== id));
    } else {
      setDisabledForUsers([...disabledForUsers, id]);
    }
  };

  return (
    <div className="p-8 h-full overflow-y-auto">
      <div className="flex items-center gap-3 mb-6">
        <Shield className="w-8 h-8 text-cyan-400" />
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Manage User Options</h2>
          <p className="text-sm text-slate-400">Enable or disable specific features for non-admin users (Citizens & Officials).</p>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Available Modules</h3>
        <div className="space-y-3">
          {allOptions.map((opt) => {
            const isDisabled = disabledForUsers.includes(opt.id);
            return (
              <div key={opt.id} className="flex items-center justify-between p-4 bg-slate-950 border border-slate-800 rounded-lg">
                <div className="flex items-center gap-4">
                  <div className={`p-2 rounded-lg ${isDisabled ? 'bg-slate-800 text-slate-500' : 'bg-cyan-950 text-cyan-400'}`}>
                    {isDisabled ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </div>
                  <div>
                    <h4 className={`font-semibold ${isDisabled ? 'text-slate-500' : 'text-slate-200'}`}>{opt.label}</h4>
                    <p className="text-xs text-slate-400">{opt.description}</p>
                  </div>
                </div>
                <button
                  onClick={() => toggleOption(opt.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                    isDisabled
                      ? 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30'
                      : 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
                  }`}
                >
                  {isDisabled ? 'Enable for Users' : 'Disable for Users'}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
