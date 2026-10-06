import React, { useEffect, useState } from 'react';
import { DollarSign, TrendingUp, Car, Users, Download, Printer, PieChart, MapPin, Award, CheckCircle2 } from 'lucide-react';
import { SalesReportSummary } from '../../types';
import { formatRupiah } from '../../utils/formatters';
import { api } from '../../services/api';

export const AdminSalesReport: React.FC = () => {
  const [report, setReport] = useState<SalesReportSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchReport = async () => {
    setIsLoading(true);
    try {
      const data = await api.getSalesReport();
      setReport(data);
    } catch (e: any) {
      console.error('Gagal mengambil laporan sales', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, []);

  const handlePrint = () => {
    window.print();
  };

  const exportCSV = () => {
    if (!report) return;
    let csv = 'Laporan Penjualan AutoBekas Marketplace\n';
    csv += `Total Omset Terkonfirmasi,${report.totalOmset}\n`;
    csv += `Total Penerimaan DP,${report.totalBookingDP}\n`;
    csv += `Total Mobil Terjual,${report.totalMobilTerjual}\n`;
    csv += `Total Order Dibuat,${report.totalOrders}\n\n`;

    csv += 'Kategori,Jumlah Order,Total Omset\n';
    report.categoryStats.forEach(c => {
      csv += `"${c.category}",${c.count},${c.totalRevenue}\n`;
    });

    const encodedUri = encodeURI('data:text/csv;charset=utf-8,' + csv);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `laporan_sales_autobekas_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (isLoading || !report) {
    return <div className="p-8 text-center text-slate-400 text-xs">Memuat laporan analisis sales...</div>;
  }

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold font-syne text-white">Laporan Sales & Analisis Performa Marketplace</h2>
          <p className="text-xs text-slate-400">Ringkasan real-time pendapatan omset, penjualan per kategori, dan performa lokasi.</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 font-semibold text-xs flex items-center gap-1.5 transition-colors"
          >
            <Printer className="w-4 h-4" />
            <span>Cetak Laporan</span>
          </button>
          <button
            onClick={exportCSV}
            className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-colors shadow-lg shadow-amber-500/10"
          >
            <Download className="w-4 h-4" />
            <span>Ekspor CSV</span>
          </button>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Total Omset Nilai Mobil</span>
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400"><DollarSign className="w-4 h-4" /></div>
          </div>
          <div className="text-2xl font-extrabold font-syne text-amber-400">
            {formatRupiah(report.totalOmset)}
          </div>
          <div className="text-[11px] text-emerald-400 font-medium">✓ Dari pesanan disetujui & selesai</div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Penerimaan DP Tanda Jadi</span>
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400"><TrendingUp className="w-4 h-4" /></div>
          </div>
          <div className="text-2xl font-extrabold font-syne text-white">
            {formatRupiah(report.totalBookingDP)}
          </div>
          <div className="text-[11px] text-slate-400">Kas DP masuk dari booking</div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Total Mobil Terjual/Booking</span>
            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400"><Car className="w-4 h-4" /></div>
          </div>
          <div className="text-2xl font-extrabold font-syne text-white">
            {report.totalMobilTerjual} Unit
          </div>
          <div className="text-[11px] text-slate-400">Dari total {report.totalOrders} order</div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Database Pelanggan</span>
            <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400"><Users className="w-4 h-4" /></div>
          </div>
          <div className="text-2xl font-extrabold font-syne text-white">
            {report.totalCustomers} Pembeli
          </div>
          <div className="text-[11px] text-slate-400">Antrean bukti belum verified: <span className="text-amber-400 font-bold">{report.pendingProofCount}</span></div>
        </div>

      </div>

      {/* Detailed Analysis Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Category Breakdown */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2 text-sm font-bold font-syne text-white">
              <PieChart className="w-4 h-4 text-amber-400" />
              <span>Penjualan per Kategori Mobil</span>
            </div>
          </div>

          <div className="space-y-3">
            {report.categoryStats.map((cat) => {
              const pct = report.totalOmset > 0 ? Math.round((cat.totalRevenue / report.totalOmset) * 100) : 0;
              return (
                <div key={cat.category} className="space-y-1 text-xs">
                  <div className="flex justify-between text-slate-300">
                    <span className="font-semibold text-white">{cat.category} ({cat.count} order)</span>
                    <span className="font-bold text-amber-400">{formatRupiah(cat.totalRevenue)} ({pct}%)</span>
                  </div>
                  <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden border border-slate-800">
                    <div
                      className="bg-gradient-to-r from-amber-500 to-amber-300 h-full rounded-full transition-all duration-500"
                      style={{ width: `${Math.max(pct, 5)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top Brands Breakdown */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2 text-sm font-bold font-syne text-white">
              <Award className="w-4 h-4 text-amber-400" />
              <span>Merk / Brand Mobil Paling Diminati</span>
            </div>
          </div>

          <div className="space-y-2.5 text-xs">
            {report.topBrands.map((b) => (
              <div key={b.brand} className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="font-bold text-white">{b.brand}</span>
                <span className="px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-400 font-bold border border-amber-500/20">
                  {b.count} Unit Dipesan
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
