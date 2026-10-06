import React from 'react';
import { Filter, RotateCcw, SlidersHorizontal, ArrowUpDown } from 'lucide-react';
import { FilterState, CategoryType } from '../types';
import { formatRupiah } from '../utils/formatters';

interface FilterBarProps {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  availableCities: string[];
  totalResults: number;
  onResetFilters: () => void;
}

const CATEGORIES: { label: string; value: string }[] = [
  { label: 'Semua Kategori', value: '' },
  { label: 'SUV & Crossover', value: 'SUV & Crossover' },
  { label: 'Sedan & Liftback', value: 'Sedan & Liftback' },
  { label: 'MPV & City Car', value: 'MPV & City Car' }
];

export const FilterBar: React.FC<FilterBarProps> = ({
  filters,
  setFilters,
  availableCities,
  totalResults,
  onResetFilters
}) => {
  const activeCount = [
    filters.category,
    filters.city,
    filters.transmission,
    filters.fuelType,
    filters.minPrice > 0,
    filters.maxPrice < 1000000000
  ].filter(Boolean).length;

  return (
    <div id="categories" className="bg-slate-900/60 border-y border-slate-800/80 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Category Tabs (Interactive Segmented Control Buttons) */}
        <div className="flex items-center justify-between gap-4 mb-6 overflow-x-auto pb-2 scrollbar-none">
          <div className="flex items-center gap-2 p-1.5 bg-slate-950/80 rounded-2xl border border-slate-800 shrink-0">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setFilters((prev) => ({ ...prev, category: cat.value }))}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap shrink-0 ${
                  filters.category === cat.value
                    ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-500/20'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2 shrink-0">
            <ArrowUpDown className="w-4 h-4 text-amber-400" />
            <select
              value={filters.sortBy}
              onChange={(e) => setFilters((prev) => ({ ...prev, sortBy: e.target.value as any }))}
              className="bg-slate-950/90 border border-slate-800 rounded-xl px-3 py-2 text-xs font-semibold text-slate-200 focus:outline-none focus:border-amber-500 cursor-pointer"
            >
              <option value="popular">Paling Populer</option>
              <option value="price-asc">Harga: Terendah ke Tertinggi</option>
              <option value="price-desc">Harga: Tertinggi ke Terendah</option>
              <option value="year-desc">Tahun: Terbaru</option>
              <option value="mileage-asc">KM: Terendah</option>
            </select>
          </div>
        </div>

        {/* Multi-Filter Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 items-end">
          
          {/* Price Range */}
          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-400">Kisaran Harga Maksimum</label>
            <div className="flex items-center gap-2 bg-slate-950/90 border border-slate-800 rounded-xl px-3 py-2">
              <span className="text-xs text-amber-400 font-bold">Max</span>
              <input
                type="range"
                min={150000000}
                max={700000000}
                step={25000000}
                value={filters.maxPrice}
                onChange={(e) => setFilters((prev) => ({ ...prev, maxPrice: Number(e.target.value) }))}
                className="w-full accent-amber-400 cursor-pointer"
              />
            </div>
            <div className="text-[11px] text-slate-400 text-right font-medium">
              s/d {formatRupiah(filters.maxPrice)}
            </div>
          </div>

          {/* Location Filter */}
          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-400">Lokasi Penjual</label>
            <select
              value={filters.city}
              onChange={(e) => setFilters((prev) => ({ ...prev, city: e.target.value }))}
              className="w-full bg-slate-950/90 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-amber-500 cursor-pointer"
            >
              <option value="">Semua Kota</option>
              {availableCities.map((city) => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
          </div>

          {/* Transmission */}
          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-400">Transmisi</label>
            <select
              value={filters.transmission}
              onChange={(e) => setFilters((prev) => ({ ...prev, transmission: e.target.value }))}
              className="w-full bg-slate-950/90 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-amber-500 cursor-pointer"
            >
              <option value="">Semua Transmisi</option>
              <option value="Automatic">Automatic (AT/CVT)</option>
              <option value="Manual">Manual (MT)</option>
            </select>
          </div>

          {/* Fuel Type */}
          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-400">Bahan Bakar</label>
            <select
              value={filters.fuelType}
              onChange={(e) => setFilters((prev) => ({ ...prev, fuelType: e.target.value }))}
              className="w-full bg-slate-950/90 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-amber-500 cursor-pointer"
            >
              <option value="">Semua Bahan Bakar</option>
              <option value="Bensin">Bensin</option>
              <option value="Diesel">Diesel</option>
              <option value="Hybrid">Hybrid</option>
            </select>
          </div>

          {/* Reset Action */}
          <div className="flex items-center gap-2">
            <button
              onClick={onResetFilters}
              disabled={activeCount === 0}
              className={`w-full py-2.5 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                activeCount > 0
                  ? 'bg-amber-500/10 border-amber-500/30 text-amber-400 hover:bg-amber-500/20'
                  : 'bg-slate-950/40 border-slate-800 text-slate-500 cursor-not-allowed'
              }`}
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Filter ({activeCount})</span>
            </button>
          </div>

        </div>

        {/* Results Counter Bar */}
        <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between text-xs text-slate-400">
          <div>
            Menampilkan <span className="font-bold text-amber-400">{totalResults}</span> unit mobil bekas sesuai kriteria
          </div>
          {filters.category && (
            <div className="text-slate-400">
              Kategori: <span className="text-slate-200 font-semibold">{filters.category}</span>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
