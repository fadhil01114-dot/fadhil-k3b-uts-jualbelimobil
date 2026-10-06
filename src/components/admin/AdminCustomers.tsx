import React, { useState } from 'react';
import { Search, Download, Users, Mail, Phone, MapPin } from 'lucide-react';
import { Customer } from '../../types';
import { formatRupiah, formatDate } from '../../utils/formatters';

interface AdminCustomersProps {
  customers: Customer[];
}

export const AdminCustomers: React.FC<AdminCustomersProps> = ({ customers }) => {
  const [search, setSearch] = useState('');

  const filteredCustomers = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      c.city.toLowerCase().includes(search.toLowerCase())
  );

  const exportCSV = () => {
    const headers = ['ID', 'Nama', 'No Phone', 'Email', 'Kota', 'Total Orders', 'Total Spend', 'Last Order Date'];
    const rows = filteredCustomers.map(c => [
      c.id,
      `"${c.name}"`,
      `"${c.phone}"`,
      `"${c.email}"`,
      `"${c.city}"`,
      c.totalOrders,
      c.totalSpend,
      c.lastOrderDate
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `data_pelanggan_autobekas_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold font-syne text-white">Database & Directory Pelanggan</h2>
          <p className="text-xs text-slate-400">Total {customers.length} data pembeli terverifikasi dari riwayat transaksi.</p>
        </div>

        <button
          onClick={exportCSV}
          className="px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-amber-500/50 text-amber-400 font-bold text-xs flex items-center gap-1.5 transition-all shrink-0"
        >
          <Download className="w-4 h-4" />
          <span>Ekspor Data CSV</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
        <input
          type="text"
          placeholder="Cari nama pelanggan, nomor phone, email, kota..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
        />
      </div>

      {/* Customers Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-x-auto shadow-xl">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-slate-950 text-slate-400 font-semibold border-b border-slate-800">
            <tr>
              <th className="px-4 py-3">Nama Pelanggan</th>
              <th className="px-4 py-3">Kontak & Email</th>
              <th className="px-4 py-3">Kota Domisili</th>
              <th className="px-4 py-3">Total Pesanan</th>
              <th className="px-4 py-3">Total Transaksi</th>
              <th className="px-4 py-3">Pemesanan Terakhir</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/80">
            {filteredCustomers.map((cust) => (
              <tr key={cust.id} className="hover:bg-slate-800/50 transition-colors">
                <td className="px-4 py-3 font-bold text-white">{cust.name}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1 text-slate-300 font-medium">
                    <Phone className="w-3 h-3 text-amber-400" />
                    <span>{cust.phone}</span>
                  </div>
                  <div className="text-[11px] text-slate-500">{cust.email}</div>
                </td>
                <td className="px-4 py-3">
                  <span className="flex items-center gap-1 text-slate-300">
                    <MapPin className="w-3 h-3 text-amber-400" />
                    {cust.city}
                  </span>
                </td>
                <td className="px-4 py-3 font-bold text-slate-200">{cust.totalOrders} Unit</td>
                <td className="px-4 py-3 font-bold text-amber-400">{formatRupiah(cust.totalSpend)}</td>
                <td className="px-4 py-3 text-slate-400">{formatDate(cust.lastOrderDate)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
};
