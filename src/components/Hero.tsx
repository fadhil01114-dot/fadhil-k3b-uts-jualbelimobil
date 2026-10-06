import React from 'react';
import { Search, MapPin, Filter, Shield, Award, CheckCircle2, Car } from 'lucide-react';

interface HeroProps {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedCity: string;
  setSelectedCity: (city: string) => void;
  availableCities: string[];
  onSearchSubmit: () => void;
  totalCarsCount: number;
}

export const Hero: React.FC<HeroProps> = ({
  searchQuery,
  setSearchQuery,
  selectedCity,
  setSelectedCity,
  availableCities,
  onSearchSubmit,
  totalCarsCount
}) => {
  return (
    <div className="relative overflow-hidden bg-slate-950 border-b border-slate-800/80 pt-10 pb-14 sm:pt-14 sm:pb-20">
      {/* Subtle Background Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-amber-500/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute top-10 right-10 w-72 h-72 bg-blue-500/5 blur-[90px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          {/* Tagline */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold mb-6">
            <Award className="w-4 h-4" />
            <span>Marketplace Mobil Bekas Terverifikasi & Bergaransi</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold font-syne text-white tracking-tight leading-tight mb-6">
            Cari & Booking <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500">Mobil Bekas Impian</span> Anda
          </h1>

          <p className="text-slate-400 text-base sm:text-lg leading-relaxed mb-8 max-w-2xl mx-auto">
            100% Bebas Banjir & Bebas Tabrakan Besar. Lulus inspeksi 175 titik dengan riwayat service lengkap dan garansi mesin 1 tahun.
          </p>

          {/* Integrated Search & Location Bar */}
          <div className="p-2 sm:p-2.5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-2xl backdrop-blur-xl mb-10 max-w-2xl mx-auto">
            <div className="flex flex-col sm:flex-row items-center gap-2">
              {/* Search Input */}
              <div className="relative flex-1 w-full">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Cari merk, model, misal: CR-V, Fortuner, Civic..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && onSearchSubmit()}
                  className="w-full bg-slate-950/80 border border-slate-800 rounded-xl pl-10 pr-4 py-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-colors"
                />
              </div>

              {/* Location Selector */}
              <div className="relative w-full sm:w-48 shrink-0">
                <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-400" />
                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="w-full bg-slate-950/80 border border-slate-800 rounded-xl pl-10 pr-8 py-3 text-sm text-slate-200 focus:outline-none focus:border-amber-500 transition-colors appearance-none cursor-pointer"
                >
                  <option value="">Semua Lokasi</option>
                  {availableCities.map((city) => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500 text-xs">▼</div>
              </div>

              {/* Search Button */}
              <button
                onClick={onSearchSubmit}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-sm transition-all shadow-lg shadow-amber-500/20 shrink-0 flex items-center justify-center gap-2"
              >
                <span>Cari Mobil</span>
              </button>
            </div>
          </div>

          {/* Key Value Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-left border-t border-slate-800/80 pt-8">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-900/40 border border-slate-800/50">
              <div className="w-9 h-9 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0">
                <Car className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs text-slate-400 font-medium">Stok Terverifikasi</div>
                <div className="text-sm font-bold text-white">{totalCarsCount} Unit Siap Pakai</div>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-900/40 border border-slate-800/50">
              <div className="w-9 h-9 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs text-slate-400 font-medium">Inspeksi Ketat</div>
                <div className="text-sm font-bold text-white">175 Titik Check</div>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-900/40 border border-slate-800/50">
              <div className="w-9 h-9 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs text-slate-400 font-medium">Garansi Mesin</div>
                <div className="text-sm font-bold text-white">1 Tahun Penuh</div>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-900/40 border border-slate-800/50">
              <div className="w-9 h-9 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs text-slate-400 font-medium">Penjual Tersebar</div>
                <div className="text-sm font-bold text-white">Kota-Kota Besar</div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
