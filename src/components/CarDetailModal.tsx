import React, { useState } from 'react';
import { X, ShieldCheck, MapPin, Calendar, Gauge, Phone, Share2, Calculator, CheckCircle2, ShoppingCart, User, AlertCircle } from 'lucide-react';
import { Car } from '../types';
import { formatRupiah, formatKM } from '../utils/formatters';

interface CarDetailModalProps {
  car: Car | null;
  onClose: () => void;
  onAddToCart: (car: Car) => void;
  isInCart: boolean;
}

export const CarDetailModal: React.FC<CarDetailModalProps> = ({
  car,
  onClose,
  onAddToCart,
  isInCart
}) => {
  if (!car) return null;

  // Cicilan Simulator State
  const [dpPercentage, setDpPercentage] = useState<number>(20); // 20% DP
  const [tenorYears, setTenorYears] = useState<number>(4); // 4 Tahun (48 bulan)

  const dpAmount = Math.round((car.price * dpPercentage) / 100);
  const loanPrincipal = car.price - dpAmount;
  const annualInterestRate = 0.07; // 7% per tahun
  const totalMonths = tenorYears * 12;
  const totalInterest = loanPrincipal * annualInterestRate * tenorYears;
  const monthlyInstallment = Math.round((loanPrincipal + totalInterest) / totalMonths);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden my-8 max-h-[90vh] flex flex-col">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/80">
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Laporan Inspeksi Verified AutoBekas</span>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body Scrollable */}
        <div className="p-6 overflow-y-auto space-y-8 text-slate-200">
          
          {/* Top Section: Media & Basic Overview */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Image Container */}
            <div className="lg:col-span-7 space-y-3">
              <div className="relative aspect-[16/10] bg-slate-950 rounded-2xl overflow-hidden border border-slate-800">
                <img
                  src={car.image}
                  alt={car.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-md px-3 py-1 rounded-xl text-xs font-bold text-emerald-400 border border-emerald-800/80">
                  {car.stockStatus}
                </div>
              </div>
              <div className="flex items-center justify-between text-xs text-slate-400 px-1">
                <span>Diperbarui: Terbaru</span>
                <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-amber-400" /> {car.sellerAddress}</span>
              </div>
            </div>

            {/* Quick Price & Primary Specs */}
            <div className="lg:col-span-5 space-y-5">
              <div>
                <span className="text-xs font-bold text-amber-400 tracking-wider uppercase">{car.category}</span>
                <h2 className="text-2xl font-extrabold font-syne text-white mt-1 leading-snug">{car.title}</h2>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950/80 border border-amber-500/30">
                <div className="text-xs text-slate-400">Harga Tunai/Cash</div>
                <div className="text-3xl font-extrabold font-syne text-amber-400 mt-1">
                  {formatRupiah(car.price)}
                </div>
                <div className="mt-2 text-xs text-slate-300 flex items-center justify-between border-t border-slate-800 pt-2">
                  <span>Booking Fee / DP Tanda Jadi:</span>
                  <span className="font-bold text-emerald-400">Rp 5.000.000</span>
                </div>
              </div>

              {/* Specs Grid */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-slate-400 block mb-0.5">Tahun</span>
                  <span className="font-bold text-white text-sm">{car.year}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-slate-400 block mb-0.5">Jarak Tempuh</span>
                  <span className="font-bold text-white text-sm">{formatKM(car.mileage)}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-slate-400 block mb-0.5">Transmisi</span>
                  <span className="font-bold text-white text-sm">{car.transmission}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-slate-400 block mb-0.5">Bahan Bakar</span>
                  <span className="font-bold text-white text-sm">{car.fuelType}</span>
                </div>
              </div>

              {/* Seller Contact Card */}
              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
                <div className="text-xs text-slate-400 font-semibold">Penjual / Showroom Partner:</div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-amber-400">
                      <User className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-white">{car.sellerName}</div>
                      <div className="text-xs text-slate-400">{car.location}</div>
                    </div>
                  </div>
                  <a
                    href={`https://wa.me/${car.sellerPhone.replace(/^0/, '62')}?text=Halo%20AutoBekas,%20saya%20tertarik%20dengan%20${encodeURIComponent(car.title)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1 transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>WhatsApp</span>
                  </a>
                </div>
              </div>

            </div>
          </div>

          {/* Detailed Specifications & Inspection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-800">
            {/* Left: Description & Features */}
            <div className="space-y-4">
              <h3 className="text-base font-bold font-syne text-white">Deskripsi & Riwayat Kendaraan</h3>
              <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/50 p-4 rounded-xl border border-slate-800/80">
                {car.description}
              </p>

              <h4 className="text-sm font-bold text-white pt-2">Fitur Unggulan Varian</h4>
              <ul className="grid grid-cols-1 gap-2 text-xs">
                {car.features.map((feat, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-slate-300 bg-slate-950/40 p-2.5 rounded-lg border border-slate-800/50">
                    <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Right: Cicilan Simulator */}
            <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-4">
              <div className="flex items-center gap-2 text-sm font-bold font-syne text-white">
                <Calculator className="w-4 h-4 text-amber-400" />
                <span>Simulasi Cicilan Kredit AutoBekas</span>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <div className="flex justify-between text-slate-400 mb-1">
                    <span>Uang Muka (DP {dpPercentage}%)</span>
                    <span className="font-bold text-white">{formatRupiah(dpAmount)}</span>
                  </div>
                  <input
                    type="range"
                    min={15}
                    max={50}
                    step={5}
                    value={dpPercentage}
                    onChange={(e) => setDpPercentage(Number(e.target.value))}
                    className="w-full accent-amber-400 cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-slate-400 mb-1">
                    <span>Tenor Kredit</span>
                    <span className="font-bold text-white">{tenorYears} Tahun ({tenorYears * 12} Bulan)</span>
                  </div>
                  <div className="grid grid-cols-4 gap-1.5">
                    {[2, 3, 4, 5].map((y) => (
                      <button
                        key={y}
                        onClick={() => setTenorYears(y)}
                        className={`py-1.5 rounded-lg border text-xs font-semibold transition-all ${
                          tenorYears === y
                            ? 'bg-amber-400 text-slate-950 border-amber-400'
                            : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                        }`}
                      >
                        {y} Thn
                      </button>
                    ))}
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 mt-3 text-center">
                  <div className="text-[11px] text-amber-300 font-medium">Estimasi Cicilan Bulanan:</div>
                  <div className="text-2xl font-extrabold font-syne text-amber-400 mt-1">
                    {formatRupiah(monthlyInstallment)} <span className="text-xs font-normal text-slate-400">/ bln</span>
                  </div>
                  <div className="text-[10px] text-slate-500 mt-1">
                    *Estimasi bunga flat 7%/thn. Belum termasuk asuransi & biaya admin leasing.
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Modal Action Footer */}
        <div className="flex items-center justify-between p-6 border-t border-slate-800 bg-slate-950/90">
          <div>
            <div className="text-xs text-slate-400">Harga Mobil</div>
            <div className="text-xl font-bold font-syne text-amber-400">{formatRupiah(car.price)}</div>
          </div>

          <button
            onClick={() => {
              onAddToCart(car);
              onClose();
            }}
            disabled={car.stockStatus === 'Terjual'}
            className={`px-8 py-3 rounded-xl font-bold text-sm flex items-center gap-2 transition-all shadow-lg ${
              car.stockStatus === 'Terjual'
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                : isInCart
                ? 'bg-emerald-500 text-slate-950 hover:bg-emerald-400'
                : 'bg-amber-400 hover:bg-amber-300 text-slate-950 shadow-amber-500/20'
            }`}
          >
            <ShoppingCart className="w-4 h-4" />
            <span>{isInCart ? 'Sudah Ada di Keranjang' : 'Lanjutkan Booking Tanda Jadi'}</span>
          </button>
        </div>

      </div>
    </div>
  );
};
