import React from 'react';
import { Car, ShieldCheck, MapPin, Phone, Mail, Award, CheckCircle2 } from 'lucide-react';

interface FooterProps {
  onNavigateHome: () => void;
  onOpenTrackModal: () => void;
  onOpenAdminLogin: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onNavigateHome,
  onOpenTrackModal,
  onOpenAdminLogin
}) => {
  return (
    <footer className="bg-slate-950 border-t border-slate-800 text-slate-400 text-xs">
      {/* Top Value Bar */}
      <div className="border-b border-slate-800/80 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="flex items-center gap-3 p-4 rounded-2xl bg-slate-900/50 border border-slate-800">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-white text-sm">Inspeksi 175 Titik</div>
              <div className="text-slate-400 mt-0.5">Seluruh mobil telah ditest profesional lulus standar kelaikan.</div>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 rounded-2xl bg-slate-900/50 border border-slate-800">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-white text-sm">Garansi 1 Tahun</div>
              <div className="text-slate-400 mt-0.5">Jaminan perlindungan mesin & transmisi resmi AutoBekas.</div>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 rounded-2xl bg-slate-900/50 border border-slate-800">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-white text-sm">Bebas Banjir & Tabrakan</div>
              <div className="text-slate-400 mt-0.5">Jaminan uang kembali 100% apabila unit terbukti bekas banjir.</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* Col 1: Brand */}
        <div className="space-y-4">
          <button onClick={onNavigateHome} className="flex items-center gap-2 text-left">
            <div className="w-9 h-9 rounded-xl bg-amber-400 flex items-center justify-center text-slate-950 font-bold text-lg">
              <Car className="w-5 h-5" />
            </div>
            <span className="text-xl font-bold font-syne text-white">
              Auto<span className="text-amber-400">Bekas</span>
            </span>
          </button>
          <p className="text-slate-400 leading-relaxed">
            Marketplace mobil bekas berkualitas tinggi dengan sistem booking online, inspeksi teruji, dan laporan penjualan transparan.
          </p>
        </div>

        {/* Col 2: Categories */}
        <div className="space-y-3">
          <div className="font-bold font-syne text-white text-sm">3 Kategori Pilihan</div>
          <ul className="space-y-2 text-slate-400">
            <li><a href="#categories" className="hover:text-amber-400 transition-colors">SUV & Crossover Premium</a></li>
            <li><a href="#categories" className="hover:text-amber-400 transition-colors">Sedan & Liftback Sporty</a></li>
            <li><a href="#categories" className="hover:text-amber-400 transition-colors">MPV & City Car Keluarga</a></li>
          </ul>
        </div>

        {/* Col 3: Network Locations */}
        <div className="space-y-3">
          <div className="font-bold font-syne text-white text-sm">Lokasi Penjual Tersebar</div>
          <div className="grid grid-cols-2 gap-2 text-slate-400">
            <span className="flex items-center gap-1"><MapPin className="w-3 h-3 text-amber-400" /> Jakarta</span>
            <span className="flex items-center gap-1"><MapPin className="w-3 h-3 text-amber-400" /> Surabaya</span>
            <span className="flex items-center gap-1"><MapPin className="w-3 h-3 text-amber-400" /> Bandung</span>
            <span className="flex items-center gap-1"><MapPin className="w-3 h-3 text-amber-400" /> Semarang</span>
            <span className="flex items-center gap-1"><MapPin className="w-3 h-3 text-amber-400" /> Yogyakarta</span>
            <span className="flex items-center gap-1"><MapPin className="w-3 h-3 text-amber-400" /> Bali</span>
          </div>
        </div>

        {/* Col 4: Quick Actions */}
        <div className="space-y-3">
          <div className="font-bold font-syne text-white text-sm">Akses & Bantuan</div>
          <ul className="space-y-2">
            <li>
              <button onClick={onOpenTrackModal} className="text-amber-400 hover:underline">
                Cek Status & Approval Pembayaran
              </button>
            </li>
            <li>
              <button onClick={onOpenAdminLogin} className="text-slate-400 hover:text-white">
                Login Panel Kelola (Admin)
              </button>
            </li>
          </ul>
        </div>

      </div>

      {/* Bottom Bar */}
      <div className="border-t border-slate-800 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-400">
          <div>© 2026 AutoBekas Marketplace Indonesia. Hak Cipta Dilindungi.</div>
          <div className="flex gap-4">
            <a href="#" className="hover:text-amber-400">Syarat & Ketentuan</a>
            <a href="#" className="hover:text-amber-400">Kebijakan Privasi</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
