import React, { useState } from 'react';
import {
  User,
  Lock,
  Mail,
  Phone,
  Building,
  Shield,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ArrowRight,
  UserPlus,
  LogIn
} from 'lucide-react';
import axios from 'axios';

export default function AuthModal({ isOpen, onClose, onAuthSuccess, initialTab = 'login' }) {
  const [isLoginTab, setIsLoginTab] = useState(initialTab === 'login');

  // Form Fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('CITIZEN');
  const [mobile, setMobile] = useState('');
  const [organization, setOrganization] = useState('');
  const [district, setDistrict] = useState('Bengaluru Urban');
  const [state, setState] = useState('Karnataka');

  // UI state
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState(null);

  if (!isOpen) return null;

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setFeedback(null);
    try {
      const res = await axios.post('/api/auth/login', {
        email,
        password
      });
      if (res.data.success) {
        setFeedback({ type: 'success', text: res.data.message });
        setTimeout(() => {
          onAuthSuccess(res.data.user, res.data.token);
          onClose();
        }, 1000);
      }
    } catch (err) {
      setFeedback({
        type: 'error',
        text: err.response?.data?.message || 'Login failed. Please verify credentials.'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setFeedback(null);
    try {
      const res = await axios.post('/api/auth/register', {
        name,
        email,
        password,
        role,
        mobile,
        organization,
        district,
        state
      });
      if (res.data.success) {
        setFeedback({ type: 'success', text: res.data.message });
        setTimeout(() => {
          onAuthSuccess(res.data.user, res.data.token);
          onClose();
        }, 1200);
      }
    } catch (err) {
      setFeedback({
        type: 'error',
        text: err.response?.data?.message || 'Registration failed. Please try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[1000] bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl relative overflow-hidden text-white space-y-6">
        {/* Glow accent */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>

        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-lg tracking-tight text-white">
                GeoLand Stack Authentication
              </h3>
              <p className="text-xs text-slate-400">DPI Security & Role-Based Access</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center font-bold text-sm transition-all"
          >
            ✕
          </button>
        </div>

        {/* Tab Switcher: Login vs Create Account */}
        <div className="grid grid-cols-2 p-1 bg-slate-950 rounded-2xl border border-slate-800 text-xs font-semibold">
          <button
            type="button"
            onClick={() => {
              setIsLoginTab(true);
              setFeedback(null);
            }}
            className={`py-2.5 rounded-xl flex items-center justify-center gap-2 transition-all ${
              isLoginTab
                ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-lg shadow-cyan-500/20 font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>User Login</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setIsLoginTab(false);
              setFeedback(null);
            }}
            className={`py-2.5 rounded-xl flex items-center justify-center gap-2 transition-all ${
              !isLoginTab
                ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-lg shadow-cyan-500/20 font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Create Account</span>
          </button>
        </div>

        {/* Feedback Alert Banner */}
        {feedback && (
          <div
            className={`p-3.5 rounded-2xl text-xs flex items-center gap-2.5 border ${
              feedback.type === 'success'
                ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                : 'bg-rose-500/10 text-rose-300 border-rose-500/30'
            }`}
          >
            {feedback.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            )}
            <span>{feedback.text}</span>
          </div>
        )}

        {/* User Login Form */}
        {isLoginTab ? (
          <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Email / Mobile Number:</label>
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder="e.g., ayush@geoland.gov.in"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-950 text-white p-3 pl-10 rounded-xl border border-slate-800 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
                <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3.5" />
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Password:</label>
              <div className="relative">
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-950 text-white p-3 pl-10 rounded-xl border border-slate-800 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
                <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3.5" />
              </div>
            </div>

            {/* Quick Credentials Helper */}
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/80 space-y-1.5 text-[11px] text-slate-400">
              <p className="font-semibold text-cyan-400 flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> Sample Quick Login Credentials:
              </p>
              <div className="grid grid-cols-2 gap-1 text-[10px] font-mono">
                <button
                  type="button"
                  onClick={() => {
                    setEmail('ayush@geoland.gov.in');
                    setPassword('password123');
                  }}
                  className="text-left bg-slate-900 p-1.5 rounded border border-slate-800 hover:border-cyan-500/50 hover:text-cyan-300"
                >
                  👑 Admin Login
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setEmail('rajesh.official@karnataka.gov.in');
                    setPassword('password123');
                  }}
                  className="text-left bg-slate-900 p-1.5 rounded border border-slate-800 hover:border-amber-500/50 hover:text-amber-300"
                >
                  🏛 Officer Login
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold shadow-lg shadow-cyan-500/25 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <span>Login to GeoLand DPI</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        ) : (
          /* Create Account Form */
          <form onSubmit={handleRegisterSubmit} className="space-y-3.5 text-xs max-h-[65vh] overflow-y-auto pr-1">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Full Name:</label>
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder="e.g., Ayush Choudhary"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-950 text-white p-2.5 pl-9 rounded-xl border border-slate-800 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
                <User className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Email Address:</label>
              <div className="relative">
                <input
                  type="email"
                  required
                  placeholder="name@domain.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-950 text-white p-2.5 pl-9 rounded-xl border border-slate-800 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
                <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Password:</label>
              <div className="relative">
                <input
                  type="password"
                  required
                  placeholder="Set account password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-950 text-white p-2.5 pl-9 rounded-xl border border-slate-800 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
                <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Account Role:</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full bg-slate-950 text-white p-2.5 rounded-xl border border-slate-800 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                >
                  <option value="CITIZEN">Citizen / Property Owner</option>
                  <option value="OFFICIAL">Government Officer</option>
                  <option value="ADMIN">System Administrator</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Mobile Number:</label>
                <input
                  type="text"
                  placeholder="+91 98765 43210"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  className="w-full bg-slate-950 text-white p-2.5 rounded-xl border border-slate-800 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Department / Organization:</label>
              <input
                type="text"
                placeholder="e.g., Revenue Dept / Individual Owner"
                value={organization}
                onChange={(e) => setOrganization(e.target.value)}
                className="w-full bg-slate-950 text-white p-2.5 rounded-xl border border-slate-800 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold shadow-lg shadow-cyan-500/25 flex items-center justify-center gap-2 transition-all disabled:opacity-50 mt-2"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <span>Create Account</span>
                  <UserPlus className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
