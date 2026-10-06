import React, { useState } from 'react';
import { CheckCircle2, XCircle, FileImage, ShieldCheck, Clock, ExternalLink, AlertTriangle } from 'lucide-react';
import { Order } from '../../types';
import { formatRupiah, formatDate } from '../../utils/formatters';
import { api } from '../../services/api';

interface AdminPaymentApprovalsProps {
  orders: Order[];
  onRefreshOrders: () => void;
}

export const AdminPaymentApprovals: React.FC<AdminPaymentApprovalsProps> = ({
  orders,
  onRefreshOrders
}) => {
  const [selectedProofOrder, setSelectedProofOrder] = useState<Order | null>(null);
  const [rejectNote, setRejectNote] = useState('Bukti transfer tidak terbaca / tidak sesuai nominal.');
  const [isProcessing, setIsProcessing] = useState(false);

  // Orders that need verification or have proof uploaded
  const pendingApprovals = orders.filter(o => o.paymentStatus === 'PROOF_UPLOADED' || o.paymentStatus === 'PENDING_PAYMENT');
  const pastApprovals = orders.filter(o => o.paymentStatus === 'APPROVED' || o.paymentStatus === 'REJECTED');

  const handleApprove = async (orderId: string) => {
    setIsProcessing(true);
    try {
      await api.approvePayment(orderId, 'Bukti pembayaran valid dan disetujui admin.');
      onRefreshOrders();
      setSelectedProofOrder(null);
    } catch (e: any) {
      alert('Gagal menyetujui pembayaran');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReject = async (orderId: string) => {
    setIsProcessing(true);
    try {
      await api.rejectPayment(orderId, rejectNote);
      onRefreshOrders();
      setSelectedProofOrder(null);
    } catch (e: any) {
      alert('Gagal menolak pembayaran');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      
      <div>
        <h2 className="text-xl font-bold font-syne text-white">Approval Bukti Pembayaran Pelanggan</h2>
        <p className="text-xs text-slate-400">Verifikasi mutasi rekening dan bukti transfer foto/struk dari pembeli.</p>
      </div>

      {/* Pending Queue */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs font-bold text-amber-400 uppercase tracking-wider">
          <span>Antrean Butuh Verifikasi ({pendingApprovals.length})</span>
        </div>

        {pendingApprovals.length === 0 ? (
          <div className="p-8 rounded-2xl bg-slate-900 border border-slate-800 text-center text-slate-500 text-xs">
            Tidak ada bukti pembayaran yang belum diproses saat ini.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pendingApprovals.map((ord) => (
              <div key={ord.id} className="p-4 rounded-2xl bg-slate-900 border border-amber-500/30 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="font-mono font-bold text-amber-400 text-sm">{ord.id}</span>
                  <span className="text-[11px] text-slate-400">{formatDate(ord.createdAt)}</span>
                </div>

                <div className="text-xs space-y-1">
                  <div className="text-white font-bold">{ord.buyerName} ({ord.buyerPhone})</div>
                  <div className="text-slate-300">Mobil: <span className="font-semibold text-white">{ord.carTitle}</span></div>
                  <div className="text-slate-300">Total Transfer: <span className="font-bold text-amber-400">{formatRupiah(ord.bookingFee)}</span></div>
                  <div className="text-slate-400">Metode: {ord.paymentMethod}</div>
                </div>

                {ord.paymentProofUrl ? (
                  <button
                    onClick={() => setSelectedProofOrder(ord)}
                    className="w-full py-2 rounded-xl bg-slate-950 border border-slate-800 hover:border-amber-500/50 text-amber-400 text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
                  >
                    <FileImage className="w-4 h-4" />
                    <span>Lihat Foto Bukti Pembayaran</span>
                  </button>
                ) : (
                  <div className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-slate-500 text-center">
                    Pelanggan belum mengunggah foto struk
                  </div>
                )}

                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800">
                  <button
                    onClick={() => handleReject(ord.id)}
                    disabled={isProcessing}
                    className="py-2 rounded-xl bg-red-950/60 hover:bg-red-900/80 text-red-400 border border-red-900/80 text-xs font-bold transition-colors"
                  >
                    Tolak Bukti
                  </button>
                  <button
                    onClick={() => handleApprove(ord.id)}
                    disabled={isProcessing}
                    className="py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-colors shadow-lg shadow-emerald-500/20"
                  >
                    Setujui Pembayaran
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Past Verifications */}
      <div className="space-y-4 pt-4 border-t border-slate-800">
        <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
          Riwayat Approval Pembayaran ({pastApprovals.length})
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 font-semibold border-b border-slate-800">
              <tr>
                <th className="px-4 py-3">ID Pesanan</th>
                <th className="px-4 py-3">Pembeli</th>
                <th className="px-4 py-3">Nominal DP</th>
                <th className="px-4 py-3">Status Verification</th>
                <th className="px-4 py-3">Catatan Admin</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {pastApprovals.map((ord) => (
                <tr key={ord.id}>
                  <td className="px-4 py-3 font-mono font-bold text-amber-400">{ord.id}</td>
                  <td className="px-4 py-3 font-medium text-white">{ord.buyerName}</td>
                  <td className="px-4 py-3 font-bold text-emerald-400">{formatRupiah(ord.bookingFee)}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2.5 py-1 rounded-lg text-xs font-bold border ${
                      ord.paymentStatus === 'APPROVED'
                        ? 'bg-emerald-950 text-emerald-400 border-emerald-800'
                        : 'bg-red-950 text-red-400 border-red-800'
                    }`}>
                      {ord.paymentStatus === 'APPROVED' ? 'DISENTUJUI' : 'DITOLAK'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-400">{ord.adminNote || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Preview Payment Proof */}
      {selectedProofOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="font-bold text-white text-sm">Bukti Pembayaran ID: {selectedProofOrder.id}</span>
              <button onClick={() => setSelectedProofOrder(null)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <div className="max-h-[50vh] overflow-y-auto bg-slate-950 p-2 rounded-2xl border border-slate-800">
              <img
                src={selectedProofOrder.paymentProofUrl}
                alt="Bukti Transfer"
                className="w-full object-contain rounded-xl"
              />
            </div>

            <div className="text-xs space-y-1">
              <div className="text-slate-300">Pengirim: <span className="font-bold text-white">{selectedProofOrder.buyerName}</span></div>
              <div className="text-slate-300">Nominal: <span className="font-bold text-amber-400">{formatRupiah(selectedProofOrder.bookingFee)}</span></div>
            </div>

            <div className="space-y-2 pt-2 border-t border-slate-800">
              <label className="text-xs text-slate-400 block">Catatan Penolakan (Jika ditolak):</label>
              <input
                type="text"
                value={rejectNote}
                onChange={(e) => setRejectNote(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                onClick={() => handleReject(selectedProofOrder.id)}
                className="py-2.5 rounded-xl bg-red-950 text-red-400 border border-red-900 font-bold text-xs"
              >
                Tolak Bukti
              </button>
              <button
                onClick={() => handleApprove(selectedProofOrder.id)}
                className="py-2.5 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/20"
              >
                Setujui & Konfirmasi
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
