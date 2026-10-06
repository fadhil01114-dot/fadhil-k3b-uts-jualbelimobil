import React, { useState } from 'react';
import { X, Trash2, ShoppingCart, CreditCard, Upload, CheckCircle2, Copy, FileText, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';
import { Car, Order } from '../types';
import { formatRupiah } from '../utils/formatters';
import { api } from '../services/api';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: Car[];
  onRemoveFromCart: (carId: string) => void;
  onClearCart: () => void;
  onOrderCreated: (order: Order) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cartItems,
  onRemoveFromCart,
  onClearCart,
  onOrderCreated
}) => {
  if (!isOpen) return null;

  const [step, setStep] = useState<'cart' | 'checkout' | 'success'>('cart');
  const [paymentType, setPaymentType] = useState<'DP' | 'FULL'>('DP');
  
  // Checkout Form State
  const [buyerName, setBuyerName] = useState('');
  const [buyerEmail, setBuyerEmail] = useState('');
  const [buyerPhone, setBuyerPhone] = useState('');
  const [buyerCity, setBuyerCity] = useState('Jakarta Selatan');
  const [buyerAddress, setBuyerAddress] = useState('');
  const [preferredDate, setPreferredDate] = useState(
    new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0]
  );
  const [paymentMethod, setPaymentMethod] = useState('Bank Transfer BCA');
  const [paymentProofUrl, setPaymentProofUrl] = useState('');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdOrder, setCreatedOrder] = useState<Order | null>(null);
  const [copiedAccount, setCopiedAccount] = useState(false);

  // Total Calculations
  const bookingFeePerCar = 5000000; // Rp 5.000.000
  const totalFullPrice = cartItems.reduce((acc, car) => acc + car.price, 0);
  const totalPayment = paymentType === 'DP' ? cartItems.length * bookingFeePerCar : totalFullPrice;

  // Handle Image Proof File Upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPaymentProofUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Submit Order
  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cartItems.length === 0) return;

    if (!buyerName || !buyerPhone || !buyerAddress) {
      alert('Mohon lengkapi Nama, No. WhatsApp, dan Alamat Anda');
      return;
    }

    setIsSubmitting(true);
    try {
      // Process first car in cart (or iterate for multiple)
      const primaryCar = cartItems[0];
      const newOrder = await api.createOrder({
        carId: primaryCar.id,
        carTitle: primaryCar.title,
        carPrice: primaryCar.price,
        carImage: primaryCar.image,
        buyerName,
        buyerEmail: buyerEmail || 'pelanggan@example.com',
        buyerPhone,
        buyerCity,
        buyerAddress,
        preferredDate,
        paymentType,
        paymentMethod,
        paymentProofUrl: paymentProofUrl || undefined
      });

      setCreatedOrder(newOrder);
      onOrderCreated(newOrder);
      onClearCart();
      setStep('success');
    } catch (err: any) {
      alert('Gagal memproses pesanan: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedAccount(true);
    setTimeout(() => setCopiedAccount(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/80 backdrop-blur-sm">
      <div className="w-full max-w-md bg-slate-900 border-l border-slate-800 h-full flex flex-col shadow-2xl">
        
        {/* Drawer Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/90">
          <div className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-amber-400" />
            <span className="font-bold font-syne text-lg text-white">
              {step === 'cart' && 'Keranjang Booking'}
              {step === 'checkout' && 'Form Pemesanan & DP'}
              {step === 'success' && 'Bukti Pemesanan'}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* STEP 1: CART VIEW */}
          {step === 'cart' && (
            <>
              {cartItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 text-center text-slate-500">
                  <ShoppingCart className="w-16 h-16 text-slate-700 mb-3" />
                  <p className="text-sm font-semibold text-slate-400">Keranjang Booking Kosong</p>
                  <p className="text-xs text-slate-500 mt-1 max-w-xs">
                    Pilih mobil bekas dari katalog dan klik tombol 'Booking Mobil' untuk memproses pemesanan.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {cartItems.map((car) => (
                    <div
                      key={car.id}
                      className="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-950 border border-slate-800"
                    >
                      <img
                        src={car.image}
                        alt={car.title}
                        className="w-20 h-16 object-cover rounded-xl border border-slate-800 shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-semibold text-amber-400 truncate">{car.brand} {car.model}</div>
                        <div className="text-sm font-bold text-white truncate">{car.title}</div>
                        <div className="text-xs text-slate-400 font-medium mt-0.5">{formatRupiah(car.price)}</div>
                      </div>
                      <button
                        onClick={() => onRemoveFromCart(car.id)}
                        className="p-2 text-slate-500 hover:text-red-400 transition-colors shrink-0"
                        title="Hapus"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}

                  {/* Payment Type Selection */}
                  <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
                    <label className="text-xs font-bold text-slate-300 block">Pilihan Pembayaran</label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setPaymentType('DP')}
                        className={`p-3 rounded-xl border text-left transition-all ${
                          paymentType === 'DP'
                            ? 'bg-amber-500/10 border-amber-400 text-amber-400'
                            : 'bg-slate-900 border-slate-800 text-slate-400'
                        }`}
                      >
                        <div className="text-xs font-bold">DP / Tanda Jadi</div>
                        <div className="text-[11px] text-slate-300 mt-0.5">Rp 5.000.000 / unit</div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setPaymentType('FULL')}
                        className={`p-3 rounded-xl border text-left transition-all ${
                          paymentType === 'FULL'
                            ? 'bg-amber-500/10 border-amber-400 text-amber-400'
                            : 'bg-slate-900 border-slate-800 text-slate-400'
                        }`}
                      >
                        <div className="text-xs font-bold">Bayar Lunas</div>
                        <div className="text-[11px] text-slate-300 mt-0.5">Sesuai Harga Mobil</div>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}

          {/* STEP 2: CHECKOUT FORM */}
          {step === 'checkout' && (
            <form id="checkout-form" onSubmit={handleCheckoutSubmit} className="space-y-4">
              
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 shrink-0 text-amber-400" />
                <span>Pemesanan Anda aman dan terikat garansi resmi AutoBekas.</span>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Nama Lengkap Pembeli *</label>
                <input
                  type="text"
                  required
                  placeholder="Misal: Budi Santoso"
                  value={buyerName}
                  onChange={(e) => setBuyerName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">No. WhatsApp *</label>
                  <input
                    type="tel"
                    required
                    placeholder="0812xxxxxxxx"
                    value={buyerPhone}
                    onChange={(e) => setBuyerPhone(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Email</label>
                  <input
                    type="email"
                    placeholder="nama@email.com"
                    value={buyerEmail}
                    onChange={(e) => setBuyerEmail(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Kota Domisili</label>
                  <input
                    type="text"
                    value={buyerCity}
                    onChange={(e) => setBuyerCity(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Tgl Rencana Inspeksi</label>
                  <input
                    type="date"
                    value={preferredDate}
                    onChange={(e) => setPreferredDate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Alamat Pengiriman / Domisili *</label>
                <textarea
                  rows={2}
                  required
                  placeholder="Jl. Raya Utama No. 12, Kelurahan, Kecamatan..."
                  value={buyerAddress}
                  onChange={(e) => setBuyerAddress(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* Payment Method Selection & Bank Details */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                <label className="text-xs font-bold text-slate-200 block">Metode Pembayaran Transfer Bank</label>
                
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                >
                  <option value="Bank Transfer BCA">Bank BCA (Virtual Account / Rekening)</option>
                  <option value="Bank Transfer Mandiri">Bank Mandiri</option>
                  <option value="Bank Transfer BRI">Bank BRI</option>
                  <option value="Bank Transfer BNI">Bank BNI</option>
                  <option value="QRIS AutoBekas">QRIS Instan</option>
                </select>

                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs space-y-1">
                  <div className="text-slate-400">Nomor Rekening Tujuan Transfer:</div>
                  <div className="flex items-center justify-between font-mono font-bold text-amber-400 text-sm">
                    <span>8830-1928-3011 (PT AutoBekas Indonesia)</span>
                    <button
                      type="button"
                      onClick={() => copyToClipboard('883019283011')}
                      className="p-1 text-slate-400 hover:text-white"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  {copiedAccount && <span className="text-[10px] text-emerald-400">Nomor rekening berhasil disalin!</span>}
                </div>

                {/* Upload Payment Proof Section */}
                <div className="pt-2">
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Upload Bukti Pembayaran / Transfer (Opsional / Bisa nanti)
                  </label>
                  <div className="relative border-2 border-dashed border-slate-800 hover:border-amber-500/50 rounded-xl p-3 text-center bg-slate-900/50 cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    {paymentProofUrl ? (
                      <div className="flex items-center justify-center gap-2 text-emerald-400 font-semibold text-xs">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Bukti Pembayaran Terpilih</span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center text-slate-400 text-xs">
                        <Upload className="w-5 h-5 text-amber-400 mb-1" />
                        <span>Klik untuk unggah foto struk / screenshot transfer</span>
                      </div>
                    )}
                  </div>
                </div>

              </div>

            </form>
          )}

          {/* STEP 3: SUCCESS CONFIRMATION */}
          {step === 'success' && createdOrder && (
            <div className="text-center space-y-5">
              <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/30 rounded-full flex items-center justify-center mx-auto text-emerald-400">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div>
                <h3 className="text-xl font-bold font-syne text-white">Pemesanan Berhasil Dibuat!</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Nomor ID Pesanan Anda adalah:
                </p>
                <div className="mt-2 inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 text-amber-400 font-mono font-extrabold text-lg px-4 py-1.5 rounded-xl">
                  <span>{createdOrder.id}</span>
                  <button
                    onClick={() => copyToClipboard(createdOrder.id)}
                    className="hover:text-white"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-left text-xs space-y-2">
                <div className="flex justify-between border-b border-slate-800 pb-2">
                  <span className="text-slate-400">Mobil:</span>
                  <span className="font-bold text-white">{createdOrder.carTitle}</span>
                </div>
                <div className="flex justify-between border-b border-slate-800 pb-2">
                  <span className="text-slate-400">Total Nominal:</span>
                  <span className="font-bold text-amber-400">{formatRupiah(createdOrder.bookingFee)}</span>
                </div>
                <div className="flex justify-between border-b border-slate-800 pb-2">
                  <span className="text-slate-400">Status Pembayaran:</span>
                  <span className="font-bold text-amber-400">
                    {createdOrder.paymentStatus === 'PROOF_UPLOADED' ? 'Bukti Terupload (Menunggu Approval)' : 'Menunggu Transfer'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Pemesan:</span>
                  <span className="text-slate-200">{createdOrder.buyerName} ({createdOrder.buyerPhone})</span>
                </div>
              </div>

              <p className="text-[11px] text-slate-400 leading-relaxed">
                Tim admin AutoBekas akan memverifikasi pembayaran Anda dan menghubungi via WhatsApp dalam 15-30 menit untuk penjadwalan inspeksi unit.
              </p>

              <button
                onClick={onClose}
                className="w-full py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs transition-colors"
              >
                Selesai
              </button>
            </div>
          )}

        </div>

        {/* Drawer Footer Actions */}
        {step !== 'success' && (
          <div className="p-6 border-t border-slate-800 bg-slate-950/90 space-y-3">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="text-slate-400">Total Bayar {paymentType === 'DP' ? '(DP Tanda Jadi)' : '(Pelunasan)'}:</span>
              <span className="text-xl font-extrabold font-syne text-amber-400">{formatRupiah(totalPayment)}</span>
            </div>

            {step === 'cart' ? (
              <button
                onClick={() => setStep('checkout')}
                disabled={cartItems.length === 0}
                className={`w-full py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-lg ${
                  cartItems.length === 0
                    ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                    : 'bg-amber-400 hover:bg-amber-300 text-slate-950 shadow-amber-500/20'
                }`}
              >
                <span>Lanjut Isi Data Pemesan</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setStep('cart')}
                  className="w-1/3 py-3 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 font-semibold text-xs transition-colors"
                >
                  Kembali
                </button>
                <button
                  type="submit"
                  form="checkout-form"
                  disabled={isSubmitting}
                  className="w-2/3 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 transition-colors shadow-lg shadow-emerald-500/20"
                >
                  {isSubmitting ? 'Memproses...' : 'Konfirmasi & Kirim Pesanan'}
                </button>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};
