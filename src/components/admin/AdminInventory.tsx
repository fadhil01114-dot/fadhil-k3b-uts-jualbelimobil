import React, { useState } from 'react';
import { Plus, Edit3, Trash2, Search, CheckCircle2, AlertCircle, RefreshCw, Car as CarIcon, MapPin } from 'lucide-react';
import { Car, CategoryType, StockStatus, TransmissionType, FuelType } from '../../types';
import { formatRupiah, formatKM } from '../../utils/formatters';
import { api } from '../../services/api';

interface AdminInventoryProps {
  cars: Car[];
  onRefreshCars: () => void;
}

export const AdminInventory: React.FC<AdminInventoryProps> = ({ cars, onRefreshCars }) => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCar, setEditingCar] = useState<Car | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [brand, setBrand] = useState('Toyota');
  const [model, setModel] = useState('');
  const [year, setYear] = useState<number>(2022);
  const [category, setCategory] = useState<CategoryType>('SUV & Crossover');
  const [price, setPrice] = useState<number>(300000000);
  const [mileage, setMileage] = useState<number>(20000);
  const [transmission, setTransmission] = useState<TransmissionType>('Automatic');
  const [fuelType, setFuelType] = useState<FuelType>('Bensin');
  const [location, setLocation] = useState('Jakarta Selatan');
  const [stockStatus, setStockStatus] = useState<StockStatus>('Tersedia');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Filter cars
  const filteredCars = cars.filter(c => {
    const matchSearch = c.title.toLowerCase().includes(search.toLowerCase()) ||
                        c.brand.toLowerCase().includes(search.toLowerCase()) ||
                        c.location.toLowerCase().includes(search.toLowerCase());
    const matchCat = !selectedCategory || c.category === selectedCategory;
    return matchSearch && matchCat;
  });

  const openAddModal = () => {
    setEditingCar(null);
    setTitle('');
    setBrand('Toyota');
    setModel('');
    setYear(2022);
    setCategory('SUV & Crossover');
    setPrice(300000000);
    setMileage(20000);
    setTransmission('Automatic');
    setFuelType('Bensin');
    setLocation('Jakarta Selatan');
    setStockStatus('Tersedia');
    setDescription('Kondisi mulus bebas banjir, servis teratur.');
    setImage('https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80');
    setIsModalOpen(true);
  };

  const openEditModal = (car: Car) => {
    setEditingCar(car);
    setTitle(car.title);
    setBrand(car.brand);
    setModel(car.model);
    setYear(car.year);
    setCategory(car.category);
    setPrice(car.price);
    setMileage(car.mileage);
    setTransmission(car.transmission);
    setFuelType(car.fuelType);
    setLocation(car.location);
    setStockStatus(car.stockStatus);
    setDescription(car.description);
    setImage(car.image);
    setIsModalOpen(true);
  };

  const handleStockStatusChange = async (carId: string, newStatus: StockStatus) => {
    try {
      await api.updateCar(carId, { stockStatus: newStatus });
      onRefreshCars();
    } catch (e: any) {
      alert('Gagal mengupdate stok status');
    }
  };

  const handleDeleteCar = async (carId: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus mobil ini dari sistem stok?')) {
      try {
        await api.deleteCar(carId);
        onRefreshCars();
      } catch (e: any) {
        alert('Gagal menghapus mobil');
      }
    }
  };

  const handleSaveCar = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const carPayload = {
        title,
        brand,
        model,
        year,
        category,
        price,
        mileage,
        transmission,
        fuelType,
        location,
        stockStatus,
        description,
        image
      };

      if (editingCar) {
        await api.updateCar(editingCar.id, carPayload);
      } else {
        await api.createCar(carPayload);
      }

      onRefreshCars();
      setIsModalOpen(false);
    } catch (e: any) {
      alert('Gagal menyimpan data mobil: ' + e.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold font-syne text-white">Kelola Data Produk & Stok Mobil</h2>
          <p className="text-xs text-slate-400">Total {cars.length} unit terdaftar dalam database marketplace.</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onRefreshCars}
            className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
            title="Refresh Data"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          <button
            onClick={openAddModal}
            className="px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-all shadow-lg shadow-amber-500/10"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Mobil Baru</span>
          </button>
        </div>
      </div>

      {/* Filter Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="relative sm:col-span-2">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Cari judul, brand, lokasi..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
          />
        </div>

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
        >
          <option value="">Semua Kategori</option>
          <option value="SUV & Crossover">SUV & Crossover</option>
          <option value="Sedan & Liftback">Sedan & Liftback</option>
          <option value="MPV & City Car">MPV & City Car</option>
        </select>
      </div>

      {/* Inventory Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-x-auto shadow-xl">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-slate-950 text-slate-400 font-semibold border-b border-slate-800">
            <tr>
              <th className="px-4 py-3">Foto & Detail Mobil</th>
              <th className="px-4 py-3">Kategori</th>
              <th className="px-4 py-3">Lokasi</th>
              <th className="px-4 py-3">Harga Tunai</th>
              <th className="px-4 py-3">Status Stok</th>
              <th className="px-4 py-3 text-right">Aksi Kelola</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/80">
            {filteredCars.map((car) => (
              <tr key={car.id} className="hover:bg-slate-800/50 transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={car.image}
                      alt={car.title}
                      className="w-14 h-10 object-cover rounded-lg border border-slate-800 shrink-0"
                    />
                    <div>
                      <div className="font-bold text-white text-xs">{car.title}</div>
                      <div className="text-[11px] text-slate-400">
                        Thn {car.year} · {formatKM(car.mileage)} · {car.transmission}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 font-medium text-slate-200">{car.category}</td>
                <td className="px-4 py-3">
                  <span className="flex items-center gap-1 text-slate-300">
                    <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    {car.location}
                  </span>
                </td>
                <td className="px-4 py-3 font-bold text-amber-400">{formatRupiah(car.price)}</td>
                <td className="px-4 py-3">
                  <select
                    value={car.stockStatus}
                    onChange={(e) => handleStockStatusChange(car.id, e.target.value as StockStatus)}
                    className={`px-2.5 py-1 rounded-lg border text-xs font-bold focus:outline-none cursor-pointer ${
                      car.stockStatus === 'Tersedia'
                        ? 'bg-emerald-950 text-emerald-400 border-emerald-800'
                        : car.stockStatus === 'Booking'
                        ? 'bg-amber-950 text-amber-400 border-amber-800'
                        : 'bg-slate-950 text-slate-500 border-slate-800'
                    }`}
                  >
                    <option value="Tersedia">Tersedia</option>
                    <option value="Booking">Booking</option>
                    <option value="Terjual">Terjual</option>
                  </select>
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    <button
                      onClick={() => openEditModal(car)}
                      className="p-1.5 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 text-amber-400"
                      title="Edit Mobil"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteCar(car.id)}
                      className="p-1.5 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 text-red-400"
                      title="Hapus Mobil"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add / Edit Car Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl my-8">
            <h3 className="text-lg font-bold font-syne text-white mb-4">
              {editingCar ? 'Edit Specs & Data Mobil' : 'Tambah Mobil Baru ke Stok'}
            </h3>

            <form onSubmit={handleSaveCar} className="space-y-4 text-xs">
              <div>
                <label className="text-slate-300 font-semibold block mb-1">Judul Lengkap Mobil *</label>
                <input
                  type="text"
                  required
                  placeholder="Misal: Honda CR-V 1.5 Turbo Prestige"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Merk/Brand</label>
                  <input
                    type="text"
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Model Varian</label>
                  <input
                    type="text"
                    value={model}
                    onChange={(e) => setModel(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Tahun Perakitan</label>
                  <input
                    type="number"
                    value={year}
                    onChange={(e) => setYear(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Kategori</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as CategoryType)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  >
                    <option value="SUV & Crossover">SUV & Crossover</option>
                    <option value="Sedan & Liftback">Sedan & Liftback</option>
                    <option value="MPV & City Car">MPV & City Car</option>
                  </select>
                </div>
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Harga Tunai (Rp) *</label>
                  <input
                    type="number"
                    required
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-amber-400 font-bold"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Kilometer (KM)</label>
                  <input
                    type="number"
                    value={mileage}
                    onChange={(e) => setMileage(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Transmisi</label>
                  <select
                    value={transmission}
                    onChange={(e) => setTransmission(e.target.value as TransmissionType)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  >
                    <option value="Automatic">Automatic</option>
                    <option value="Manual">Manual</option>
                  </select>
                </div>
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Bahan Bakar</label>
                  <select
                    value={fuelType}
                    onChange={(e) => setFuelType(e.target.value as FuelType)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  >
                    <option value="Bensin">Bensin</option>
                    <option value="Diesel">Diesel</option>
                    <option value="Hybrid">Hybrid</option>
                  </select>
                </div>
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Kota Lokasi Penjual</label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">URL Foto Utama Mobil</label>
                <input
                  type="text"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">Deskripsi & Catatan Kondisi</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-950 text-slate-400 hover:text-white"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-6 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold"
                >
                  {isSaving ? 'Menyimpan...' : 'Simpan Mobil'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
