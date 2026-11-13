import React, { useState } from 'react';
import { X, LogIn, UserPlus, Shield, AlertCircle, CheckCircle, Database } from 'lucide-react';
import { isSupabaseConfigured, signInWithEmail, signUpWithEmail } from '../../services/supabase';

export default function AuthModal({ isOpen, onClose, onAuthSuccess }) {
  const [mode, setMode] = useState('signin'); // 'signin' or 'signup'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!isSupabaseConfigured) {
      setErrorMsg(
        'Supabase is currently unconfigured (Demo Mode). Please configure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in frontend/.env to enable authentication.'
      );
      return;
    }

    if (!email || !password) {
      setErrorMsg('Please enter both email and password.');
      return;
    }

    setLoading(true);
    try {
      if (mode === 'signin') {
        const data = await signInWithEmail(email, password);
        if (data.user) {
          setSuccessMsg('Signed in successfully!');
          setTimeout(() => {
            onAuthSuccess(data.user);
            onClose();
          }, 800);
        }
      } else {
        const data = await signUpWithEmail(email, password, fullName);
        if (data.user) {
          setSuccessMsg('Account created! Please check your email for verification link if configured.');
          setTimeout(() => {
            onAuthSuccess(data.user);
            onClose();
          }, 1200);
        }
      }
    } catch (err) {
      console.error('Auth error:', err);
      setErrorMsg(err.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-[32px] border border-[#def1f5] shadow-2xl w-full max-w-md p-6 sm:p-8 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-[#def1f5]/60 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-[#def1f5] text-[#189ab4] flex items-center justify-center mx-auto mb-3 shadow-xs">
            <Shield className="w-6 h-6" />
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-[#11323c]">
            {mode === 'signin' ? 'Sign In to ReportSaathi' : 'Create an Account'}
          </h2>
          <p className="text-xs text-[#558694] mt-1">
            Access your private, encrypted report history with Row Level Security.
          </p>
        </div>

        {/* Demo Mode Notice if Supabase is unconfigured */}
        {!isSupabaseConfigured && (
          <div className="mb-5 p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-2.5">
            <Database className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-amber-900">Demo Mode Active</p>
              <p className="text-[11px] leading-relaxed text-amber-800 mt-0.5">
                Supabase credentials are not detected. Add <code className="bg-amber-100 px-1 py-0.5 rounded font-mono">VITE_SUPABASE_URL</code> and <code className="bg-amber-100 px-1 py-0.5 rounded font-mono">VITE_SUPABASE_ANON_KEY</code> to enable sign-in.
              </p>
            </div>
          </div>
        )}

        {/* Tab Switcher */}
        <div className="flex bg-[#f1f8fa] p-1 rounded-full mb-6 border border-[#def1f5]">
          <button
            type="button"
            onClick={() => { setMode('signin'); setErrorMsg(null); setSuccessMsg(null); }}
            className={`flex-1 py-2 text-xs font-bold rounded-full transition ${
              mode === 'signin' ? 'bg-white text-[#189ab4] shadow-xs' : 'text-[#558694] hover:text-[#11323c]'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => { setMode('signup'); setErrorMsg(null); setSuccessMsg(null); }}
            className={`flex-1 py-2 text-xs font-bold rounded-full transition ${
              mode === 'signup' ? 'bg-white text-[#189ab4] shadow-xs' : 'text-[#558694] hover:text-[#11323c]'
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Error / Success Feedback */}
        {errorMsg && (
          <div className="mb-4 p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <span className="leading-snug">{errorMsg}</span>
          </div>
        )}
        {successMsg && (
          <div className="mb-4 p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-start gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span className="leading-snug">{successMsg}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'signup' && (
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#558694] mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Dr. / Patient Name"
                className="w-full px-4 py-2.5 rounded-2xl border border-[#def1f5] text-sm text-[#11323c] focus:outline-hidden focus:border-[#189ab4] bg-[#f8fcfe]"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#558694] mb-1.5">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full px-4 py-2.5 rounded-2xl border border-[#def1f5] text-sm text-[#11323c] focus:outline-hidden focus:border-[#189ab4] bg-[#f8fcfe]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#558694] mb-1.5">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              minLength={6}
              className="w-full px-4 py-2.5 rounded-2xl border border-[#def1f5] text-sm text-[#11323c] focus:outline-hidden focus:border-[#189ab4] bg-[#f8fcfe]"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 rounded-full bg-[#189ab4] hover:bg-[#137d94] text-white font-bold text-sm shadow-md shadow-[#189ab4]/25 transition flex items-center justify-center gap-2 mt-2 disabled:opacity-50"
          >
            {loading ? (
              <span className="inline-flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                <span>Processing...</span>
              </span>
            ) : mode === 'signin' ? (
              <>
                <LogIn className="w-4 h-4" />
                <span>Sign In</span>
              </>
            ) : (
              <>
                <UserPlus className="w-4 h-4" />
                <span>Create Account</span>
              </>
            )}
          </button>
        </form>

        {/* Footer Note */}
        <p className="text-[11px] text-[#558694] text-center mt-5 leading-relaxed">
          ReportSaathi protects your privacy. Original files and raw documents are never stored.
        </p>
      </div>
    </div>
  );
}
