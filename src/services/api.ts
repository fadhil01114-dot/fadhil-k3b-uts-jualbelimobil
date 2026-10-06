import { Car, Order, Customer, SalesReportSummary } from '../types';

export const api = {
  // Cars API
  async getCars(): Promise<Car[]> {
    try {
      const res = await fetch('/api/cars');
      if (!res.ok) throw new Error('Gagal mengambil data mobil');
      return await res.json();
    } catch (err) {
      console.warn('API fetch failed, returning initial data fallback', err);
      const { INITIAL_CARS } = await import('../data/initialCars');
      return INITIAL_CARS;
    }
  },

  async getCarById(id: string): Promise<Car | null> {
    try {
      const res = await fetch(`/api/cars/${id}`);
      if (!res.ok) return null;
      return await res.json();
    } catch (err) {
      console.warn('API fetch failed for car detail', err);
      const { INITIAL_CARS } = await import('../data/initialCars');
      return INITIAL_CARS.find(c => c.id === id) || null;
    }
  },

  async createCar(carData: Partial<Car>): Promise<Car> {
    const res = await fetch('/api/cars', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(carData)
    });
    if (!res.ok) throw new Error('Gagal menambahkan mobil');
    return await res.json();
  },

  async updateCar(id: string, carData: Partial<Car>): Promise<Car> {
    const res = await fetch(`/api/cars/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(carData)
    });
    if (!res.ok) throw new Error('Gagal memperbarui mobil');
    return await res.json();
  },

  async deleteCar(id: string): Promise<boolean> {
    const res = await fetch(`/api/cars/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Gagal menghapus mobil');
    return true;
  },

  // Orders API
  async getOrders(): Promise<Order[]> {
    try {
      const res = await fetch('/api/orders');
      if (!res.ok) throw new Error('Gagal mengambil pesanan');
      return await res.json();
    } catch (err) {
      const { INITIAL_ORDERS } = await import('../data/initialCars');
      return INITIAL_ORDERS;
    }
  },

  async trackOrder(query: string): Promise<Order[]> {
    const res = await fetch(`/api/orders/track?query=${encodeURIComponent(query)}`);
    if (!res.ok) throw new Error('Pesanan tidak ditemukan');
    return await res.json();
  },

  async createOrder(orderPayload: any): Promise<Order> {
    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderPayload)
    });
    if (!res.ok) throw new Error('Gagal memproses pesanan');
    return await res.json();
  },

  async uploadPaymentProof(orderId: string, proofUrl: string): Promise<Order> {
    const res = await fetch(`/api/orders/${orderId}/proof`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ paymentProofUrl: proofUrl })
    });
    if (!res.ok) throw new Error('Gagal mengunggah bukti pembayaran');
    return await res.json();
  },

  async approvePayment(orderId: string, adminNote?: string): Promise<Order> {
    const res = await fetch(`/api/orders/${orderId}/approve`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ adminNote })
    });
    if (!res.ok) throw new Error('Gagal menyetujui pembayaran');
    return await res.json();
  },

  async rejectPayment(orderId: string, adminNote: string): Promise<Order> {
    const res = await fetch(`/api/orders/${orderId}/reject`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ adminNote })
    });
    if (!res.ok) throw new Error('Gagal menolak pembayaran');
    return await res.json();
  },

  async updateOrderStatus(orderId: string, orderStatus: string, adminNote?: string): Promise<Order> {
    const res = await fetch(`/api/orders/${orderId}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderStatus, adminNote })
    });
    if (!res.ok) throw new Error('Gagal memperbarui status pesanan');
    return await res.json();
  },

  // Customers API
  async getCustomers(): Promise<Customer[]> {
    try {
      const res = await fetch('/api/customers');
      if (!res.ok) throw new Error('Gagal mengambil data pelanggan');
      return await res.json();
    } catch (err) {
      const { INITIAL_CUSTOMERS } = await import('../data/initialCars');
      return INITIAL_CUSTOMERS;
    }
  },

  // Customer Login API
  async customerLogin(email: string, password?: string) {
    const res = await fetch('/api/auth/customer/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    if (!res.ok) {
      const errData = await res.json();
      throw new Error(errData.error || 'Login pelanggan gagal');
    }
    return await res.json();
  },

  // Admin Login API
  async adminLogin(email: string, password: string) {
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    if (!res.ok) {
      const errData = await res.json();
      throw new Error(errData.error || 'Login gagal');
    }
    return await res.json();
  },

  // Sales Report API
  async getSalesReport(): Promise<SalesReportSummary> {
    const res = await fetch('/api/reports/sales');
    if (!res.ok) throw new Error('Gagal memuat laporan sales');
    return await res.json();
  },

  // Seed / Reset API
  async resetDatabase(): Promise<void> {
    await fetch('/api/seed', { method: 'POST' });
  }
};
