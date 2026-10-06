import React, { useState } from 'react';
import { X, Lock, Mail, User, KeyRound, ShieldCheck, ArrowRight, UserCheck } from 'lucide-react';
import { api } from '../../services/api';
import { AdminUser, CustomerUser } from '../../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCustomerLoginSuccess: (user: CustomerUser) => void;
  onAdminLoginSuccess: (user: AdminUser) => void;
  initialRole?: 'customer' | 'admin';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onCustomerLoginSuccess,
  onAdminLoginSuccess,
  initialRole = 'customer'
}) => {
  if (!isOpen) return null;

  const [roleTab, setRoleTab] = useState<'customer' | 'admin'>(initialRole);
  
  // Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleTabChange = (newRole: 'customer' | 'admin') => {
    setRoleTab(newRole);
    setErrorMsg('');
    if (newRole === 'admin') {
      setEmail('admin@autobekas.com');
      setPassword('admin123');
    } else {
      setEmail('budi.santoso@example.com');
      setPassword('pembeli123');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');

    try {
      if (roleTab === 'admin') {
        const res = await api.adminLogin(email, password);
        onAdminLoginSuccess(res.user);
      } else {
        const res = await api.customerLogin(email || 'budi.santoso@example.com', password);
        onCustomerLoginSuccess(res.user);
      }
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Login gagal.');
    } finally {
      setIsLoading(false);
    }
  };

  const fillCustomerDemo = () => {
    setEmail('budi.santoso@example.com');
    setPassword('pembeli123');
  };

  const fillAdminDemo = () => {
    setEmail('admin@autobekas.com');
    setPassword('admin123');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden p-6 space-y-6">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-amber-400 flex items-center justify-center text-slate-950 font-bold">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold font-syne text-lg text-white">Form Login AutoBekas</span>
              <p className="text-[11px] text-slate-400">Masuk untuk transaksi & kelola stok</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Role Tabs */}
        <div className="grid grid-cols-2 gap-2 p-1 bg-slate-950 rounded-xl border border-slate-800 text-xs font-bold">
          <button
            type="button"
            onClick={() => handleTabChange('customer')}
            className={`py-2 rounded-lg transition-all ${
              roleTab === 'customer'
                ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Pelanggan / Pembeli
          </button>
          <button
            type="button"
            onClick={() => handleTabChange('admin')}
            className={`py-2 rounded-lg transition-all ${
              roleTab === 'admin'
                ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Kelola (Admin)
          </button>
        </div>

        {errorMsg && (
          <div className="p-3 rounded-xl bg-red-950/60 border border-red-900/60 text-red-400 text-xs">
            {errorMsg}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="text-slate-300 font-semibold block mb-1">
              {roleTab === 'admin' ? 'Email Administrator' : 'Email Pelanggan'}
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="email"
                required
                placeholder={roleTab === 'admin' ? 'admin@autobekas.com' : 'nama@email.com'}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-white focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div>
            <label className="text-slate-300 font-semibold block mb-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-white focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          {/* Quick Demo Pre-fill helper */}
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-slate-400 space-y-2">
            <div className="font-semibold text-amber-400 flex items-center justify-between">
              <span>💡 Akun Demo Siap Pakai:</span>
              <button
                type="button"
                onClick={roleTab === 'admin' ? fillAdminDemo : fillCustomerDemo}
                className="text-amber-300 underline hover:text-amber-200"
              >
                Isi Otomatis
              </button>
            </div>
            {roleTab === 'admin' ? (
              <div>Email: <code className="text-white">admin@autobekas.com</code> | Pass: <code className="text-white">admin123</code></div>
            ) : (
              <div>Email: <code className="text-white">budi.santoso@example.com</code> | Pass: <code className="text-white">pembeli123</code></div>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs transition-colors shadow-lg shadow-amber-500/10 flex items-center justify-center gap-2"
          >
            <span>{isLoading ? 'Memverifikasi...' : roleTab === 'admin' ? 'Masuk Panel Admin' : 'Masuk sebagai Pelanggan'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

      </div>
    </div>
  );
};
