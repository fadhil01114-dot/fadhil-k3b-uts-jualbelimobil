import React from 'react';
import { ShoppingCart, Car, Search, ShieldCheck, UserCheck, LogOut, FileText, User, KeyRound } from 'lucide-react';
import { AdminUser, CustomerUser } from '../types';

interface NavbarProps {
  cartCount: number;
  onOpenCart: () => void;
  onOpenTrackModal: () => void;
  onOpenAuthModal: (role?: 'customer' | 'admin') => void;
  adminUser: AdminUser | null;
  customerUser: CustomerUser | null;
  onAdminLogout: () => void;
  onCustomerLogout: () => void;
  onNavigateHome: () => void;
  activeTab: 'catalog' | 'admin';
  setActiveTab: (tab: 'catalog' | 'admin') => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  cartCount,
  onOpenCart,
  onOpenTrackModal,
  onOpenAuthModal,
  adminUser,
  customerUser,
  onAdminLogout,
  onCustomerLogout,
  onNavigateHome,
  activeTab,
  setActiveTab
}) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Zone 1: Brand Wordmark */}
        <div className="flex items-center gap-3">
          <button 
            onClick={() => { onNavigateHome(); setActiveTab('catalog'); }}
            className="flex items-center gap-2 group text-left"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-400 flex items-center justify-center text-slate-950 font-bold text-xl shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform">
              <Car className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <span className="text-xl font-bold font-syne tracking-tight text-white group-hover:text-amber-400 transition-colors">
                Auto<span className="text-amber-400">Bekas</span>
              </span>
            </div>
          </button>
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
          <button
            onClick={() => { onNavigateHome(); setActiveTab('catalog'); }}
            className={`transition-colors hover:text-amber-400 ${activeTab === 'catalog' ? 'text-amber-400 font-semibold' : ''}`}
          >
            Katalog Mobil
          </button>
          <a
            href="#categories"
            onClick={() => setActiveTab('catalog')}
            className="transition-colors hover:text-amber-400"
          >
            3 Kategori
          </a>
          <button
            onClick={onOpenTrackModal}
            className="flex items-center gap-1.5 hover:text-amber-400 transition-colors"
          >
            <Search className="w-4 h-4 text-amber-400" />
            <span>Cek Status Pesanan</span>
          </button>
          <div className="flex items-center gap-1 text-emerald-400 text-xs font-semibold bg-emerald-950/60 border border-emerald-800/50 px-2.5 py-1 rounded-full">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>175 Titik Inspeksi</span>
          </div>
        </nav>

        {/* Zone 3: Primary Actions */}
        <div className="flex items-center gap-3">
          
          {/* Cart Button */}
          <button
            onClick={onOpenCart}
            className="relative flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-amber-500/50 hover:bg-slate-800/80 text-slate-200 transition-all"
            title="Keranjang Booking"
          >
            <ShoppingCart className="w-4 h-4 text-amber-400" />
            <span className="hidden sm:inline text-xs font-semibold">Keranjang</span>
            {cartCount > 0 && (
              <span className="flex items-center justify-center w-5 h-5 text-xs font-bold text-slate-950 bg-amber-400 rounded-full">
                {cartCount}
              </span>
            )}
          </button>

          {/* User Account / Customer Status */}
          {customerUser ? (
            <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs">
              <User className="w-4 h-4 text-amber-400" />
              <span className="font-bold text-white hidden sm:inline">{customerUser.name}</span>
              <button
                onClick={onCustomerLogout}
                className="text-slate-400 hover:text-red-400 ml-1"
                title="Keluar Pelanggan"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => onOpenAuthModal('customer')}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-400 border border-amber-500/30 text-xs font-bold transition-all shadow-sm"
            >
              <User className="w-4 h-4" />
              <span>Login Pelanggan</span>
            </button>
          )}

          {/* Admin Control */}
          {adminUser ? (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveTab('admin')}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                  activeTab === 'admin' 
                    ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-500/20' 
                    : 'bg-slate-900 text-amber-400 border border-slate-800 hover:bg-slate-800'
                }`}
              >
                <FileText className="w-4 h-4" />
                <span className="hidden sm:inline">Panel Admin</span>
              </button>
              <button
                onClick={onAdminLogout}
                className="p-2 rounded-xl bg-red-950/40 text-red-400 border border-red-900/40 hover:bg-red-900/60 transition-colors"
                title="Keluar Admin"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => onOpenAuthModal('admin')}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 text-xs font-semibold transition-all"
            >
              <UserCheck className="w-4 h-4 text-slate-400" />
              <span className="hidden sm:inline">Admin</span>
            </button>
          )}

        </div>
      </div>
    </header>
  );
};
