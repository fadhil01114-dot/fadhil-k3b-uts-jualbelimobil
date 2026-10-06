import React, { useState, useEffect, useMemo } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { FilterBar } from './components/FilterBar';
import { CarCard } from './components/CarCard';
import { CarDetailModal } from './components/CarDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { OrderTrackModal } from './components/OrderTrackModal';
import { AuthModal } from './components/auth/AuthModal';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { Footer } from './components/Footer';

import { Car, Order, Customer, FilterState, AdminUser, CustomerUser } from './types';
import { api } from './services/api';

const DEFAULT_FILTERS: FilterState = {
  search: '',
  category: '',
  city: '',
  minPrice: 0,
  maxPrice: 700000000,
  transmission: '',
  fuelType: '',
  minYear: 2015,
  maxYear: 2026,
  sortBy: 'popular'
};

export default function App() {
  const [cars, setCars] = useState<Car[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Cart State
  const [cart, setCart] = useState<Car[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Modals
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);
  const [isTrackModalOpen, setIsTrackModalOpen] = useState(false);
  
  // Auth Modal State
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalRole, setAuthModalRole] = useState<'customer' | 'admin'>('customer');
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [customerUser, setCustomerUser] = useState<CustomerUser | null>(null);

  // App Navigation
  const [activeTab, setActiveTab] = useState<'catalog' | 'admin'>('catalog');

  // Filters State
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);

  // Fetch initial data from backend API
  const loadData = async () => {
    setIsLoading(true);
    try {
      const [fetchedCars, fetchedOrders, fetchedCustomers] = await Promise.all([
        api.getCars(),
        api.getOrders(),
        api.getCustomers()
      ]);
      setCars(fetchedCars);
      setOrders(fetchedOrders);
      setCustomers(fetchedCustomers);
    } catch (err) {
      console.error('Error loading app data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Extract available unique cities for filters
  const availableCities = useMemo(() => {
    const set = new Set<string>();
    cars.forEach(c => { if (c.location) set.add(c.location); });
    return Array.from(set).sort();
  }, [cars]);

  // Cart Handlers
  const handleAddToCart = (car: Car) => {
    if (!cart.some(item => item.id === car.id)) {
      setCart([...cart, car]);
    }
    setIsCartOpen(true);
  };

  const handleRemoveFromCart = (carId: string) => {
    setCart(cart.filter(c => c.id !== carId));
  };

  const handleClearCart = () => {
    setCart([]);
  };

  const handleOrderCreated = (newOrder: Order) => {
    loadData(); // Refresh cars and orders list
  };

  // Reset Filters
  const handleResetFilters = () => {
    setFilters(DEFAULT_FILTERS);
  };

  const handleOpenAuthModal = (role: 'customer' | 'admin' = 'customer') => {
    setAuthModalRole(role);
    setIsAuthModalOpen(true);
  };

  // Filter & Sort Logic
  const filteredCars = useMemo(() => {
    return cars.filter(car => {
      if (filters.search) {
        const q = filters.search.toLowerCase();
        const matchTitle = car.title.toLowerCase().includes(q);
        const matchBrand = car.brand.toLowerCase().includes(q);
        const matchModel = car.model.toLowerCase().includes(q);
        const matchCity = car.location.toLowerCase().includes(q);
        if (!matchTitle && !matchBrand && !matchModel && !matchCity) return false;
      }

      if (filters.category && car.category !== filters.category) return false;
      if (filters.city && car.location !== filters.city) return false;
      if (filters.maxPrice && car.price > filters.maxPrice) return false;
      if (filters.transmission && car.transmission !== filters.transmission) return false;
      if (filters.fuelType && car.fuelType !== filters.fuelType) return false;

      return true;
    }).sort((a, b) => {
      if (filters.sortBy === 'price-asc') return a.price - b.price;
      if (filters.sortBy === 'price-desc') return b.price - a.price;
      if (filters.sortBy === 'year-desc') return b.year - a.year;
      if (filters.sortBy === 'mileage-asc') return a.mileage - b.mileage;
      return (b.viewsCount || 0) - (a.viewsCount || 0);
    });
  }, [cars, filters]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      
      {/* Top Bar Navigation */}
      <Navbar
        cartCount={cart.length}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenTrackModal={() => setIsTrackModalOpen(true)}
        onOpenAuthModal={handleOpenAuthModal}
        adminUser={adminUser}
        customerUser={customerUser}
        onAdminLogout={() => {
          setAdminUser(null);
          setActiveTab('catalog');
        }}
        onCustomerLogout={() => {
          setCustomerUser(null);
        }}
        onNavigateHome={() => {
          handleResetFilters();
          setActiveTab('catalog');
        }}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Main View Switching */}
      <main className="flex-1">
        {activeTab === 'catalog' ? (
          <>
            {/* Hero Section */}
            <Hero
              searchQuery={filters.search}
              setSearchQuery={(q) => setFilters(prev => ({ ...prev, search: q }))}
              selectedCity={filters.city}
              setSelectedCity={(city) => setFilters(prev => ({ ...prev, city }))}
              availableCities={availableCities}
              onSearchSubmit={() => {
                const catalogEl = document.getElementById('catalog-grid');
                if (catalogEl) catalogEl.scrollIntoView({ behavior: 'smooth' });
              }}
              totalCarsCount={cars.length}
            />

            {/* Filter Controls */}
            <FilterBar
              filters={filters}
              setFilters={setFilters}
              availableCities={availableCities}
              totalResults={filteredCars.length}
              onResetFilters={handleResetFilters}
            />

            {/* Catalog Grid Section */}
            <section id="catalog-grid" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-20 text-slate-400 space-y-3">
                  <div className="w-8 h-8 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
                  <span className="text-xs font-semibold">Memuat katalog mobil bekas...</span>
                </div>
              ) : filteredCars.length === 0 ? (
                <div className="p-12 rounded-3xl bg-slate-900 border border-slate-800 text-center space-y-4 max-w-md mx-auto my-8">
                  <div className="text-3xl">🚗</div>
                  <h3 className="text-base font-bold text-white font-syne">Mobil Tidak Ditemukan</h3>
                  <p className="text-xs text-slate-400">
                    Tidak ada mobil bekas yang cocok dengan kriteria filter pencarian Anda. Coba sesuaikan harga atau lokasi.
                  </p>
                  <button
                    onClick={handleResetFilters}
                    className="px-5 py-2.5 rounded-xl bg-amber-400 text-slate-950 font-bold text-xs shadow-md shadow-amber-500/10"
                  >
                    Reset Semua Filter
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredCars.map((car) => (
                    <CarCard
                      key={car.id}
                      car={car}
                      onSelectCar={(c) => setSelectedCar(c)}
                      onAddToCart={handleAddToCart}
                      isInCart={cart.some(i => i.id === car.id)}
                    />
                  ))}
                </div>
              )}
            </section>
          </>
        ) : (
          /* Admin View */
          <AdminDashboard
            cars={cars}
            orders={orders}
            customers={customers}
            onRefreshAll={loadData}
          />
        )}
      </main>

      {/* Modals & Drawers */}
      <CarDetailModal
        car={selectedCar}
        onClose={() => setSelectedCar(null)}
        onAddToCart={handleAddToCart}
        isInCart={selectedCar ? cart.some(i => i.id === selectedCar.id) : false}
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cart}
        onRemoveFromCart={handleRemoveFromCart}
        onClearCart={handleClearCart}
        onOrderCreated={handleOrderCreated}
      />

      <OrderTrackModal
        isOpen={isTrackModalOpen}
        onClose={() => setIsTrackModalOpen(false)}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialRole={authModalRole}
        onCustomerLoginSuccess={(user) => {
          setCustomerUser(user);
        }}
        onAdminLoginSuccess={(user) => {
          setAdminUser(user);
          setActiveTab('admin');
        }}
      />

      {/* Footer */}
      <Footer
        onNavigateHome={() => {
          handleResetFilters();
          setActiveTab('catalog');
        }}
        onOpenTrackModal={() => setIsTrackModalOpen(true)}
        onOpenAdminLogin={() => handleOpenAuthModal('admin')}
      />

    </div>
  );
}
