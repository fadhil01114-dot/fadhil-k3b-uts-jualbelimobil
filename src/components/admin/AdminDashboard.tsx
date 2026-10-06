import React, { useState } from 'react';
import { Package, ShoppingBag, CheckSquare, Users, BarChart3, RotateCcw, ShieldCheck } from 'lucide-react';
import { AdminInventory } from './AdminInventory';
import { AdminOrders } from './AdminOrders';
import { AdminPaymentApprovals } from './AdminPaymentApprovals';
import { AdminCustomers } from './AdminCustomers';
import { AdminSalesReport } from './AdminSalesReport';
import { Car, Order, Customer } from '../../types';
import { api } from '../../services/api';

interface AdminDashboardProps {
  cars: Car[];
  orders: Order[];
  customers: Customer[];
  onRefreshAll: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  cars,
  orders,
  customers,
  onRefreshAll
}) => {
  const [activeTab, setActiveTab] = useState<'stok' | 'order' | 'pembayaran' | 'pelanggan' | 'laporan'>('stok');

  const pendingProofsCount = orders.filter(o => o.paymentStatus === 'PROOF_UPLOADED').length;

  const handleResetDemoData = async () => {
    if (confirm('Apakah Anda ingin mereset seluruh database marketplace ke 12 mobil awal?')) {
      await api.resetDatabase();
      onRefreshAll();
      alert('Database berhasil direset.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Admin Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-400 text-slate-950 font-bold flex items-center justify-center shadow-lg shadow-amber-500/20">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-2xl font-bold font-syne text-white">Panel Kelola Admin AutoBekas</h1>
            <p className="text-xs text-slate-400">Sistem manajemen stok mobil bekas, verifikasi bukti pembayaran, dan analisis sales.</p>
          </div>
        </div>

        <button
          onClick={handleResetDemoData}
          className="px-3.5 py-2 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-amber-400 text-xs font-semibold flex items-center gap-1.5 transition-colors shrink-0"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Demo Data (12 Mobil)</span>
        </button>
      </div>

      {/* Admin Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-slate-800">
        <button
          onClick={() => setActiveTab('stok')}
          className={`flex items-center gap-2 px-4 py-3 rounded-xl text-xs font-bold transition-all shrink-0 ${
            activeTab === 'stok'
              ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-500/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>1. Data Produk & Stok ({cars.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('order')}
          className={`flex items-center gap-2 px-4 py-3 rounded-xl text-xs font-bold transition-all shrink-0 ${
            activeTab === 'order'
              ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-500/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <ShoppingBag className="w-4 h-4" />
          <span>2. Data Order & Riwayat ({orders.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('pembayaran')}
          className={`relative flex items-center gap-2 px-4 py-3 rounded-xl text-xs font-bold transition-all shrink-0 ${
            activeTab === 'pembayaran'
              ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-500/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <CheckSquare className="w-4 h-4" />
          <span>3. Approval Bukti Pembayaran</span>
          {pendingProofsCount > 0 && (
            <span className="ml-1 px-1.5 py-0.5 rounded-full text-[10px] font-extrabold bg-red-500 text-white">
              {pendingProofsCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('pelanggan')}
          className={`flex items-center gap-2 px-4 py-3 rounded-xl text-xs font-bold transition-all shrink-0 ${
            activeTab === 'pelanggan'
              ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-500/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>4. Data Pelanggan ({customers.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('laporan')}
          className={`flex items-center gap-2 px-4 py-3 rounded-xl text-xs font-bold transition-all shrink-0 ${
            activeTab === 'laporan'
              ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-500/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>5. Laporan Sales</span>
        </button>
      </div>

      {/* Tab Content Display */}
      <div className="pt-2">
        {activeTab === 'stok' && <AdminInventory cars={cars} onRefreshCars={onRefreshAll} />}
        {activeTab === 'order' && <AdminOrders orders={orders} onRefreshOrders={onRefreshAll} />}
        {activeTab === 'pembayaran' && <AdminPaymentApprovals orders={orders} onRefreshOrders={onRefreshAll} />}
        {activeTab === 'pelanggan' && <AdminCustomers customers={customers} />}
        {activeTab === 'laporan' && <AdminSalesReport />}
      </div>

    </div>
  );
};
