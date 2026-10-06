export type CategoryType = 'SUV & Crossover' | 'Sedan & Liftback' | 'MPV & City Car';

export type StockStatus = 'Tersedia' | 'Booking' | 'Terjual';

export type TransmissionType = 'Automatic' | 'Manual';

export type FuelType = 'Bensin' | 'Diesel' | 'Hybrid' | 'Listrik';

export interface Car {
  id: string;
  title: string;
  brand: string;
  model: string;
  year: number;
  category: CategoryType;
  price: number; // in IDR Rupiah
  mileage: number; // in KM
  transmission: TransmissionType;
  fuelType: FuelType;
  location: string; // e.g., 'Jakarta Selatan', 'Bandung', 'Surabaya'
  engineCapacity: string; // e.g., '2.0L (1998 cc)'
  color: string;
  stockStatus: StockStatus;
  description: string;
  features: string[];
  sellerName: string;
  sellerPhone: string;
  sellerAddress: string;
  image: string;
  inspectionScore: number; // e.g. 175 points inspection score
  viewsCount?: number;
  createdAt: string;
}

export type PaymentStatus = 
  | 'PENDING_PAYMENT'      // Menunggu Bukti Pembayaran
  | 'PROOF_UPLOADED'       // Bukti Terupload, Menunggu Approval Admin
  | 'APPROVED'             // Pembayaran/DP Disetujui
  | 'REJECTED'             // Bukti Pembayaran Ditolak
  | 'CANCELLED';           // Dibatalkan

export type OrderStatus =
  | 'MENUNGGU_VERIFIKASI'
  | 'DP_DITERIMA'
  | 'SIAP_INSPEKSI'
  | 'SELESAI'
  | 'DIBATALKAN';

export interface Order {
  id: string; // e.g., AB-2026-8912
  carId: string;
  carTitle: string;
  carPrice: number;
  carImage: string;
  buyerName: string;
  buyerEmail: string;
  buyerPhone: string;
  buyerCity: string;
  buyerAddress: string;
  preferredDate: string;
  paymentType: 'DP' | 'FULL';
  bookingFee: number; // e.g., Rp 5.000.000 for DP
  totalAmount: number;
  paymentMethod: string; // BCA Transfer, Mandiri, QRIS
  paymentProofUrl?: string;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  adminNote?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string;
  city: string;
  address: string;
  totalOrders: number;
  totalSpend: number;
  lastOrderDate: string;
}

export interface FilterState {
  search: string;
  category: string;
  city: string;
  minPrice: number;
  maxPrice: number;
  transmission: string;
  fuelType: string;
  minYear: number;
  maxYear: number;
  sortBy: 'price-asc' | 'price-desc' | 'year-desc' | 'mileage-asc' | 'popular';
}

export interface AdminUser {
  email: string;
  name: string;
  token: string;
}

export interface CustomerUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  role: 'customer';
  token: string;
}

export interface SalesReportSummary {
  totalOmset: number; // Approved orders total value
  totalBookingDP: number; // Approved DP total value
  totalMobilTerjual: number;
  totalOrders: number;
  pendingProofCount: number;
  totalCustomers: number;
  categoryStats: { category: string; count: number; totalRevenue: number }[];
  cityStats: { city: string; count: number; totalRevenue: number }[];
  topBrands: { brand: string; count: number }[];
}
