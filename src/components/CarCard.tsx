import React, { useState } from 'react';
import { MapPin, Calendar, Gauge, ShieldCheck, Eye, ShoppingCart, Info, CheckCircle2 } from 'lucide-react';
import { Car } from '../types';
import { formatRupiah, formatKM } from '../utils/formatters';

interface CarCardProps {
  car: Car;
  onSelectCar: (car: Car) => void;
  onAddToCart: (car: Car) => void;
  isInCart: boolean;
}

export const CarCard: React.FC<CarCardProps> = ({
  car,
  onSelectCar,
  onAddToCart,
  isInCart
}) => {
  const [imgError, setImgError] = useState(false);

  // Stock status styles
  const getStatusBadge = () => {
    switch (car.stockStatus) {
      case 'Tersedia':
        return 'bg-emerald-950/80 text-emerald-400 border-emerald-800/80';
      case 'Booking':
        return 'bg-amber-950/80 text-amber-400 border-amber-800/80';
      case 'Terjual':
        return 'bg-slate-900 text-slate-400 border-slate-700';
      default:
        return 'bg-slate-900 text-slate-300 border-slate-800';
    }
  };

  return (
    <div className="group rounded-2xl bg-slate-900/80 border border-slate-800/90 overflow-hidden hover:border-amber-500/40 hover:shadow-xl hover:shadow-amber-500/5 transition-all duration-300 flex flex-col justify-between">
      <div>
        {/* Card Header Media */}
        <div className="relative aspect-[16/10] bg-slate-950 overflow-hidden">
          {!imgError ? (
            <img
              src={car.image}
              alt={car.title}
              referrerPolicy="no-referrer"
              onError={() => setImgError(true)}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-slate-900 to-slate-950 flex flex-col items-center justify-center text-slate-500 p-4 text-center">
              <ShieldCheck className="w-10 h-10 text-amber-400/50 mb-2" />
              <span className="text-xs font-semibold text-slate-300">{car.brand} {car.model}</span>
              <span className="text-[10px] text-slate-500 mt-1">Lulus Inspeksi AutoBekas</span>
            </div>
          )}

          {/* Stock Status Badge Overlay */}
          <div className="absolute top-3 left-3 flex items-center gap-2">
            <span className={`text-[11px] font-bold px-2.5 py-1 rounded-lg border backdrop-blur-md ${getStatusBadge()}`}>
              {car.stockStatus}
            </span>
          </div>

          {/* Location Badge */}
          <div className="absolute bottom-3 right-3 bg-slate-950/80 backdrop-blur-md border border-slate-800 text-slate-200 text-xs px-2.5 py-1 rounded-lg flex items-center gap-1.5 font-medium">
            <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>{car.location}</span>
          </div>
        </div>

        {/* Card Body */}
        <div className="p-5">
          {/* Price Header */}
          <div className="flex items-baseline justify-between mb-2">
            <div className="text-xl font-bold font-syne text-amber-400">
              {formatRupiah(car.price)}
            </div>
            <div className="text-[11px] text-slate-400 font-medium">
              DP Muka <span className="text-slate-200 font-semibold">Rp 5 Jt</span>
            </div>
          </div>

          {/* Title */}
          <h3 className="text-base font-bold text-white mb-2 line-clamp-1 group-hover:text-amber-300 transition-colors">
            {car.title}
          </h3>

          {/* Unboxed Metadata Line with typographic separators (Zero-Pill Rule) */}
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-4 flex-wrap">
            <span>Tahun {car.year}</span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span>{formatKM(car.mileage)}</span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span>{car.transmission}</span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span>{car.fuelType}</span>
          </div>

          {/* Inspection & Features snippet */}
          <div className="bg-slate-950/60 rounded-xl p-3 border border-slate-800/80 mb-4 space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                Score Inspeksi
              </span>
              <span className="text-emerald-400 font-bold">{car.inspectionScore}/175 Lulus</span>
            </div>
            <div className="text-[11px] text-slate-400 line-clamp-1">
              ✓ {car.features[0] || 'Servis Resmi'} · ✓ {car.features[1] || 'Bebas Banjir'}
            </div>
          </div>
        </div>
      </div>

      {/* Card Actions Footer */}
      <div className="p-5 pt-0 grid grid-cols-2 gap-2">
        <button
          onClick={() => onSelectCar(car)}
          className="py-2.5 px-3 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
        >
          <Info className="w-3.5 h-3.5 text-slate-400" />
          <span>Detail Specs</span>
        </button>

        <button
          onClick={() => onAddToCart(car)}
          disabled={car.stockStatus === 'Terjual'}
          className={`py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
            car.stockStatus === 'Terjual'
              ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
              : isInCart
              ? 'bg-emerald-500 text-slate-950 hover:bg-emerald-400'
              : 'bg-amber-400 hover:bg-amber-300 text-slate-950 shadow-md shadow-amber-500/10'
          }`}
        >
          {car.stockStatus === 'Terjual' ? (
            <span>Terjual</span>
          ) : isInCart ? (
            <>
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Di Cart</span>
            </>
          ) : (
            <>
              <ShoppingCart className="w-3.5 h-3.5" />
              <span>Booking Mobil</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
