import React, { useState } from 'react';
import { Search, Clock, CheckCircle2, XCircle, FileText, Calendar, MapPin, Eye, MessageSquare } from 'lucide-react';
import { Order, OrderStatus } from '../../types';
import { formatRupiah, formatDate } from '../../utils/formatters';
import { api } from '../../services/api';

interface AdminOrdersProps {
  orders: Order[];
  onRefreshOrders: () => void;
}

export const AdminOrders: React.FC<AdminOrdersProps> = ({ orders, onRefreshOrders }) => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const filteredOrders = orders.filter((ord) => {
    const matchSearch =
      ord.id.toLowerCase().includes(search.toLowerCase()) ||
      ord.buyerName.toLowerCase().includes(search.toLowerCase()) ||
      ord.buyerPhone.includes(search) ||
      ord.carTitle.toLowerCase().includes(search.toLowerCase());
    const matchStatus = !statusFilter || ord.orderStatus === statusFilter;
    return matchSearch && matchStatus;
  });

  const handleUpdateStatus = async (orderId: string, newStatus: OrderStatus) => {
    try {
      await api.updateOrderStatus(orderId, newStatus);
      onRefreshOrders();
    } catch (e: any) {
      alert('Gagal mengupdate status pesanan');
    }
  };

  const getOrderStatusBadge = (st: OrderStatus) => {
    switch (st) {
      case 'DP_DITERIMA':
      case 'SELESAI':
        return 'bg-emerald-950 text-emerald-400 border-emerald-800';
      case 'SIAP_INSPEKSI':
        return 'bg-blue-950 text-blue-400 border-blue-800';
      case 'MENUNGGU_VERIFIKASI':
        return 'bg-amber-950 text-amber-400 border-amber-800';
      case 'DIBATALKAN':
        return 'bg-red-950 text-red-400 border-red-800';
      default:
        return 'bg-slate-900 text-slate-400 border-slate-800';
    }
  };

  return (
    <div className="space-y-6">
      
      <div>
        <h2 className="text-xl font-bold font-syne text-white">Kelola Data Pemesanan & Riwayat Transaksi</h2>
        <p className="text-xs text-slate-400">Total {orders.length} transaksi booking/pembelian tersimpan.</p>
      </div>

      {/* Filter Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="relative sm:col-span-2">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Cari ID Pesanan (AB-...), Nama Pembeli, No HP..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
        >
          <option value="">Semua Status Pesanan</option>
          <option value="MENUNGGU_VERIFIKASI">Menunggu Verifikasi</option>
          <option value="DP_DITERIMA">DP Diterima</option>
          <option value="SIAP_INSPEKSI">Siap Inspeksi</option>
          <option value="SELESAI">Selesai</option>
          <option value="DIBATALKAN">Dibatalkan</option>
        </select>
      </div>

      {/* Orders List Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-x-auto shadow-xl">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-slate-950 text-slate-400 font-semibold border-b border-slate-800">
            <tr>
              <th className="px-4 py-3">ID & Tgl Pesan</th>
              <th className="px-4 py-3">Pembeli / kontak</th>
              <th className="px-4 py-3">Mobil Dipesan</th>
              <th className="px-4 py-3">Nominal DP / Lunas</th>
              <th className="px-4 py-3">Status Pesanan</th>
              <th className="px-4 py-3 text-right">Ubah Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/80">
            {filteredOrders.map((ord) => (
              <tr key={ord.id} className="hover:bg-slate-800/50 transition-colors">
                <td className="px-4 py-3">
                  <div className="font-mono font-bold text-amber-400">{ord.id}</div>
                  <div className="text-[11px] text-slate-500">{formatDate(ord.createdAt)}</div>
                </td>
                <td className="px-4 py-3">
                  <div className="font-bold text-white">{ord.buyerName}</div>
                  <div className="text-[11px] text-slate-400">{ord.buyerPhone} ({ord.buyerCity})</div>
                </td>
                <td className="px-4 py-3">
                  <div className="font-semibold text-slate-200">{ord.carTitle}</div>
                  <div className="text-[11px] text-slate-500">Tgl Inspeksi: {ord.preferredDate}</div>
                </td>
                <td className="px-4 py-3">
                  <div className="font-bold text-amber-400">{formatRupiah(ord.bookingFee)}</div>
                  <div className="text-[10px] text-slate-500">{ord.paymentType === 'DP' ? 'DP Tanda Jadi' : 'Pelunasan'}</div>
                </td>
                <td className="px-4 py-3">
                  <span className={`text-[11px] font-bold px-2.5 py-1 rounded-lg border ${getOrderStatusBadge(ord.orderStatus)}`}>
                    {ord.orderStatus}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <select
                    value={ord.orderStatus}
                    onChange={(e) => handleUpdateStatus(ord.id, e.target.value as OrderStatus)}
                    className="bg-slate-950 border border-slate-800 rounded-lg px-2 py-1 text-xs text-slate-200 focus:outline-none focus:border-amber-500 cursor-pointer"
                  >
                    <option value="MENUNGGU_VERIFIKASI">Menunggu Verifikasi</option>
                    <option value="DP_DITERIMA">DP Diterima</option>
                    <option value="SIAP_INSPEKSI">Siap Inspeksi</option>
                    <option value="SELESAI">Selesai</option>
                    <option value="DIBATALKAN">Dibatalkan</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
};
