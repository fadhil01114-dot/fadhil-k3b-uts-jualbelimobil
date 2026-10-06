import React, { useState } from 'react';
import { X, Search, CheckCircle2, Clock, AlertCircle, FileText, Upload, Copy, ShieldCheck } from 'lucide-react';
import { Order } from '../types';
import { formatRupiah, formatDate } from '../utils/formatters';
import { api } from '../services/api';

interface OrderTrackModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OrderTrackModal: React.FC<OrderTrackModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const [searchQuery, setSearchQuery] = useState('');
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  
  // Re-upload proof state
  const [uploadingOrderId, setUploadingOrderId] = useState<string | null>(null);
  const [newProofUrl, setNewProofUrl] = useState('');
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsLoading(true);
    setErrorMessage('');
    try {
      const results = await api.trackOrder(searchQuery.trim());
      if (results.length === 0) {
        setErrorMessage('Pesanan tidak ditemukan. Periksa kembali ID Pesanan (misal: AB-2026-8912) atau No. WhatsApp Anda.');
        setOrders(null);
      } else {
        setOrders(results);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Gagal mencari pesanan.');
      setOrders(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewProofUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const submitReuploadProof = async (orderId: string) => {
    if (!newProofUrl) return;
    try {
      const updated = await api.uploadPaymentProof(orderId, newProofUrl);
      setUploadSuccess(true);
      setUploadingOrderId(null);
      // Refresh current search
      const results = await api.trackOrder(searchQuery.trim());
      setOrders(results);
      setTimeout(() => setUploadSuccess(false), 3000);
    } catch (err: any) {
      alert('Gagal mengunggah bukti: ' + err.message);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'APPROVED':
      case 'DP_DITERIMA':
      case 'SELESAI':
        return { label: 'Disetujui / Lunas', bg: 'bg-emerald-950 text-emerald-400 border-emerald-800' };
      case 'PROOF_UPLOADED':
      case 'MENUNGGU_VERIFIKASI':
        return { label: 'Verifikasi Bukti Pembayaran', bg: 'bg-amber-950 text-amber-400 border-amber-800' };
      case 'PENDING_PAYMENT':
        return { label: 'Menunggu Bukti Transfer', bg: 'bg-blue-950 text-blue-400 border-blue-800' };
      case 'REJECTED':
        return { label: 'Bukti Ditolak Admin', bg: 'bg-red-950 text-red-400 border-red-800' };
      default:
        return { label: status, bg: 'bg-slate-900 text-slate-400 border-slate-800' };
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden max-h-[85vh] flex flex-col">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950">
          <div className="flex items-center gap-2">
            <Search className="w-5 h-5 text-amber-400" />
            <span className="font-bold font-syne text-lg text-white">Lacak Status Pesanan & Pembayaran</span>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          
          {/* Search Bar */}
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="text"
                placeholder="Masukkan ID Pesanan (misal: AB-2026-8912) atau No. HP..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs transition-all shrink-0"
            >
              {isLoading ? 'Mencari...' : 'Cari Pesanan'}
            </button>
          </form>

          {uploadSuccess && (
            <div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-800 text-emerald-400 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>Bukti pembayaran berhasil diunggah! Status sedang dalam proses verifikasi admin.</span>
            </div>
          )}

          {errorMessage && (
            <div className="p-3 rounded-xl bg-red-950/60 border border-red-900/60 text-red-400 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Search Results */}
          {orders && orders.length > 0 && (
            <div className="space-y-4">
              <div className="text-xs text-slate-400 font-medium">Ditemukan {orders.length} pesanan:</div>
              
              {orders.map((ord) => {
                const badge = getStatusBadge(ord.paymentStatus);
                return (
                  <div key={ord.id} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                    
                    <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                      <div>
                        <span className="text-[11px] text-slate-500 font-mono">ID PESANAN</span>
                        <div className="text-sm font-extrabold font-mono text-amber-400">{ord.id}</div>
                      </div>
                      <span className={`text-xs font-bold px-3 py-1 rounded-lg border ${badge.bg}`}>
                        {badge.label}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <img src={ord.carImage} alt={ord.carTitle} className="w-16 h-12 object-cover rounded-xl border border-slate-800" />
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-bold text-white truncate">{ord.carTitle}</div>
                        <div className="text-xs text-slate-400">Tgl Pesan: {formatDate(ord.createdAt)}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-slate-400">Total DP/Bayar</div>
                        <div className="text-sm font-bold text-amber-400">{formatRupiah(ord.bookingFee)}</div>
                      </div>
                    </div>

                    {ord.adminNote && (
                      <div className="p-3 rounded-xl bg-slate-900 border border-slate-800/80 text-xs text-slate-300">
                        <span className="font-bold text-amber-400">Catatan Admin:</span> {ord.adminNote}
                      </div>
                    )}

                    {/* Upload / Re-upload Payment Proof Section */}
                    {uploadingOrderId === ord.id ? (
                      <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                        <div className="text-xs font-semibold text-slate-300">Unggah Ulang Struk / Bukti Pembayaran:</div>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileUpload}
                          className="text-xs text-slate-400"
                        />
                        <div className="flex items-center gap-2 pt-2">
                          <button
                            onClick={() => submitReuploadProof(ord.id)}
                            disabled={!newProofUrl}
                            className="px-4 py-1.5 rounded-lg bg-emerald-500 text-slate-950 font-bold text-xs"
                          >
                            Kirim Bukti Pembayaran
                          </button>
                          <button
                            onClick={() => setUploadingOrderId(null)}
                            className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-400 text-xs"
                          >
                            Batal
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between pt-1">
                        <div className="text-[11px] text-slate-400">
                          {ord.paymentProofUrl ? '✓ Bukti Transfer Terupload' : '⚠️ Belum Upload Bukti Pembayaran'}
                        </div>
                        <button
                          onClick={() => setUploadingOrderId(ord.id)}
                          className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-amber-400 border border-slate-800 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                        >
                          <Upload className="w-3.5 h-3.5" />
                          <span>{ord.paymentProofUrl ? 'Ganti Bukti' : 'Upload Bukti Pembayaran'}</span>
                        </button>
                      </div>
                    )}

                  </div>
                );
              })}
            </div>
          )}

          {!orders && !isLoading && !errorMessage && (
            <div className="text-center py-8 text-slate-500 text-xs">
              Masukkan ID Pesanan yang didapat saat checkout untuk mengecek progres verifikasi admin dan jadwal inspeksi.
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
