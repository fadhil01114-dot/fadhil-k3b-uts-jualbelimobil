import express, { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { INITIAL_CARS, INITIAL_ORDERS, INITIAL_CUSTOMERS } from './src/data/initialCars.ts';
import { Car, Order, Customer, SalesReportSummary } from './src/types.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '25mb' }));

// Ensure data directory exists
const DATA_DIR = path.resolve(__dirname, 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

interface DatabaseSchema {
  cars: Car[];
  orders: Order[];
  customers: Customer[];
}

function getDatabase(): DatabaseSchema {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  if (!fs.existsSync(DB_FILE)) {
    const initialDb: DatabaseSchema = {
      cars: INITIAL_CARS,
      orders: INITIAL_ORDERS,
      customers: INITIAL_CUSTOMERS
    };
    fs.writeFileSync(DB_FILE, JSON.stringify(initialDb, null, 2), 'utf-8');
    return initialDb;
  }

  try {
    const data = fs.readFileSync(DB_FILE, 'utf-8');
    const parsed = JSON.parse(data);
    return {
      cars: parsed.cars || INITIAL_CARS,
      orders: parsed.orders || INITIAL_ORDERS,
      customers: parsed.customers || INITIAL_CUSTOMERS
    };
  } catch (err) {
    console.error('Error reading db.json, writing fallback initial data', err);
    const initialDb: DatabaseSchema = {
      cars: INITIAL_CARS,
      orders: INITIAL_ORDERS,
      customers: INITIAL_CUSTOMERS
    };
    fs.writeFileSync(DB_FILE, JSON.stringify(initialDb, null, 2), 'utf-8');
    return initialDb;
  }
}

function saveDatabase(data: DatabaseSchema) {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
}

// Helper to update customers list based on orders
function updateCustomerFromOrder(db: DatabaseSchema, order: Order) {
  const existingIndex = db.customers.findIndex(c => c.phone === order.buyerPhone || c.email === order.buyerEmail);
  const orderAmount = order.paymentType === 'DP' ? order.bookingFee : order.totalAmount;

  if (existingIndex >= 0) {
    const cust = db.customers[existingIndex];
    db.customers[existingIndex] = {
      ...cust,
      name: order.buyerName || cust.name,
      phone: order.buyerPhone || cust.phone,
      email: order.buyerEmail || cust.email,
      city: order.buyerCity || cust.city,
      address: order.buyerAddress || cust.address,
      totalOrders: cust.totalOrders + 1,
      totalSpend: cust.totalSpend + orderAmount,
      lastOrderDate: order.createdAt.split('T')[0]
    };
  } else {
    const newCust: Customer = {
      id: `cust-${Date.now()}`,
      name: order.buyerName,
      phone: order.buyerPhone,
      email: order.buyerEmail,
      city: order.buyerCity,
      address: order.buyerAddress,
      totalOrders: 1,
      totalSpend: orderAmount,
      lastOrderDate: order.createdAt.split('T')[0]
    };
    db.customers.push(newCust);
  }
}

// API ENDPOINTS

// 1. GET /api/cars
app.get('/api/cars', (req: Request, res: Response) => {
  try {
    const db = getDatabase();
    res.json(db.cars);
  } catch (e: any) {
    res.status(500).json({ error: 'Gagal mengambil data mobil' });
  }
});

// 2. GET /api/cars/:id
app.get('/api/cars/:id', (req: Request, res: Response) => {
  try {
    const db = getDatabase();
    const car = db.cars.find(c => c.id === req.params.id);
    if (!car) {
      return res.status(404).json({ error: 'Mobil tidak ditemukan' });
    }
    // Increment view count
    car.viewsCount = (car.viewsCount || 0) + 1;
    saveDatabase(db);
    res.json(car);
  } catch (e: any) {
    res.status(500).json({ error: 'Gagal mengambil detail mobil' });
  }
});

// 3. POST /api/cars (Create Car)
app.post('/api/cars', (req: Request, res: Response) => {
  try {
    const db = getDatabase();
    const newCar: Car = {
      id: `car-${Date.now()}`,
      title: req.body.title || 'Mobil Bekas Premium',
      brand: req.body.brand || 'Toyota',
      model: req.body.model || 'Model',
      year: Number(req.body.year) || 2022,
      category: req.body.category || 'SUV & Crossover',
      price: Number(req.body.price) || 250000000,
      mileage: Number(req.body.mileage) || 20000,
      transmission: req.body.transmission || 'Automatic',
      fuelType: req.body.fuelType || 'Bensin',
      location: req.body.location || 'Jakarta Selatan',
      engineCapacity: req.body.engineCapacity || '1.5L',
      color: req.body.color || 'Hitam',
      stockStatus: req.body.stockStatus || 'Tersedia',
      description: req.body.description || 'Kondisi mulus terawat, service record lengkap.',
      features: Array.isArray(req.body.features) ? req.body.features : ['Airbag', 'ABS', 'Sensor Parkir'],
      sellerName: req.body.sellerName || 'AutoBekas Prime',
      sellerPhone: req.body.sellerPhone || '081234567890',
      sellerAddress: req.body.sellerAddress || 'Jakarta',
      image: req.body.image || 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80',
      inspectionScore: 175,
      viewsCount: 1,
      createdAt: new Date().toISOString()
    };

    db.cars.unshift(newCar);
    saveDatabase(db);
    res.status(201).json(newCar);
  } catch (e: any) {
    res.status(500).json({ error: 'Gagal menambah data mobil' });
  }
});

// 4. PUT /api/cars/:id (Update Car)
app.put('/api/cars/:id', (req: Request, res: Response) => {
  try {
    const db = getDatabase();
    const index = db.cars.findIndex(c => c.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ error: 'Mobil tidak ditemukan' });
    }

    db.cars[index] = {
      ...db.cars[index],
      ...req.body,
      price: Number(req.body.price) || db.cars[index].price,
      year: Number(req.body.year) || db.cars[index].year,
      mileage: Number(req.body.mileage) || db.cars[index].mileage
    };

    saveDatabase(db);
    res.json(db.cars[index]);
  } catch (e: any) {
    res.status(500).json({ error: 'Gagal memperbarui data mobil' });
  }
});

// 5. DELETE /api/cars/:id
app.delete('/api/cars/:id', (req: Request, res: Response) => {
  try {
    const db = getDatabase();
    db.cars = db.cars.filter(c => c.id !== req.params.id);
    saveDatabase(db);
    res.json({ success: true, message: 'Mobil berhasil dihapus' });
  } catch (e: any) {
    res.status(500).json({ error: 'Gagal menghapus mobil' });
  }
});

// 6. GET /api/orders
app.get('/api/orders', (req: Request, res: Response) => {
  try {
    const db = getDatabase();
    res.json(db.orders);
  } catch (e: any) {
    res.status(500).json({ error: 'Gagal mengambil data pemesanan' });
  }
});

// 7. GET /api/orders/track?query=AB-2026-8912
app.get('/api/orders/track', (req: Request, res: Response) => {
  try {
    const query = (req.query.query as string || '').trim().toLowerCase();
    if (!query) {
      return res.status(400).json({ error: 'Kata kunci pencarian tidak boleh kosong' });
    }

    const db = getDatabase();
    const found = db.orders.filter(
      o => o.id.toLowerCase() === query || 
           o.buyerPhone.includes(query) || 
           o.buyerEmail.toLowerCase().includes(query)
    );

    res.json(found);
  } catch (e: any) {
    res.status(500).json({ error: 'Gagal melacak pesanan' });
  }
});

// 8. POST /api/orders (Checkout/Booking)
app.post('/api/orders', (req: Request, res: Response) => {
  try {
    const db = getDatabase();
    const car = db.cars.find(c => c.id === req.body.carId);

    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const newOrderId = `AB-${new Date().getFullYear()}-${randomSuffix}`;

    const newOrder: Order = {
      id: newOrderId,
      carId: req.body.carId,
      carTitle: car ? car.title : (req.body.carTitle || 'Mobil Bekas'),
      carPrice: car ? car.price : (Number(req.body.carPrice) || 200000000),
      carImage: car ? car.image : (req.body.carImage || ''),
      buyerName: req.body.buyerName,
      buyerEmail: req.body.buyerEmail,
      buyerPhone: req.body.buyerPhone,
      buyerCity: req.body.buyerCity || 'Jakarta',
      buyerAddress: req.body.buyerAddress,
      preferredDate: req.body.preferredDate || new Date().toISOString().split('T')[0],
      paymentType: req.body.paymentType === 'FULL' ? 'FULL' : 'DP',
      bookingFee: req.body.paymentType === 'FULL' ? (car ? car.price : 200000000) : 5000000, // DP Rp 5 Jt
      totalAmount: car ? car.price : 200000000,
      paymentMethod: req.body.paymentMethod || 'Bank Transfer BCA',
      paymentProofUrl: req.body.paymentProofUrl || undefined,
      paymentStatus: req.body.paymentProofUrl ? 'PROOF_UPLOADED' : 'PENDING_PAYMENT',
      orderStatus: 'MENUNGGU_VERIFIKASI',
      adminNote: 'Pesanan berhasil dibuat. Silakan lakukan transfer dan upload bukti pembayaran.',
      createdAt: new Date().toISOString()
    };

    // Update car status to 'Booking'
    if (car && car.stockStatus === 'Tersedia') {
      car.stockStatus = 'Booking';
    }

    db.orders.unshift(newOrder);
    updateCustomerFromOrder(db, newOrder);
    saveDatabase(db);

    res.status(201).json(newOrder);
  } catch (e: any) {
    res.status(500).json({ error: 'Gagal membuat pesanan' });
  }
});

// 9. PUT /api/orders/:id/proof (Upload Payment Proof)
app.put('/api/orders/:id/proof', (req: Request, res: Response) => {
  try {
    const db = getDatabase();
    const orderIndex = db.orders.findIndex(o => o.id === req.params.id);
    if (orderIndex === -1) {
      return res.status(404).json({ error: 'Pesanan tidak ditemukan' });
    }

    const order = db.orders[orderIndex];
    order.paymentProofUrl = req.body.paymentProofUrl;
    order.paymentStatus = 'PROOF_UPLOADED';
    order.orderStatus = 'MENUNGGU_VERIFIKASI';
    order.updatedAt = new Date().toISOString();

    saveDatabase(db);
    res.json(order);
  } catch (e: any) {
    res.status(500).json({ error: 'Gagal mengunggah bukti pembayaran' });
  }
});

// 10. PUT /api/orders/:id/approve (Admin Approve Payment)
app.put('/api/orders/:id/approve', (req: Request, res: Response) => {
  try {
    const db = getDatabase();
    const orderIndex = db.orders.findIndex(o => o.id === req.params.id);
    if (orderIndex === -1) {
      return res.status(404).json({ error: 'Pesanan tidak ditemukan' });
    }

    const order = db.orders[orderIndex];
    order.paymentStatus = 'APPROVED';
    order.orderStatus = 'DP_DITERIMA';
    order.adminNote = req.body.adminNote || 'Bukti pembayaran valid dan disetujui admin.';
    order.updatedAt = new Date().toISOString();

    // Mark car stock status
    const carIndex = db.cars.findIndex(c => c.id === order.carId);
    if (carIndex >= 0) {
      db.cars[carIndex].stockStatus = order.paymentType === 'FULL' ? 'Terjual' : 'Booking';
    }

    saveDatabase(db);
    res.json(order);
  } catch (e: any) {
    res.status(500).json({ error: 'Gagal menyetujui pembayaran' });
  }
});

// 11. PUT /api/orders/:id/reject (Admin Reject Payment)
app.put('/api/orders/:id/reject', (req: Request, res: Response) => {
  try {
    const db = getDatabase();
    const orderIndex = db.orders.findIndex(o => o.id === req.params.id);
    if (orderIndex === -1) {
      return res.status(404).json({ error: 'Pesanan tidak ditemukan' });
    }

    const order = db.orders[orderIndex];
    order.paymentStatus = 'REJECTED';
    order.adminNote = req.body.adminNote || 'Bukti pembayaran tidak sesuai atau tidak dapat diverifikasi.';
    order.updatedAt = new Date().toISOString();

    saveDatabase(db);
    res.json(order);
  } catch (e: any) {
    res.status(500).json({ error: 'Gagal menolak pembayaran' });
  }
});

// 12. PUT /api/orders/:id/status (Admin Update Order Status)
app.put('/api/orders/:id/status', (req: Request, res: Response) => {
  try {
    const db = getDatabase();
    const orderIndex = db.orders.findIndex(o => o.id === req.params.id);
    if (orderIndex === -1) {
      return res.status(404).json({ error: 'Pesanan tidak ditemukan' });
    }

    const order = db.orders[orderIndex];
    order.orderStatus = req.body.orderStatus;
    if (req.body.adminNote) {
      order.adminNote = req.body.adminNote;
    }
    order.updatedAt = new Date().toISOString();

    // If order is finished (SELESAI), mark car as Terjual
    if (req.body.orderStatus === 'SELESAI') {
      const carIndex = db.cars.findIndex(c => c.id === order.carId);
      if (carIndex >= 0) {
        db.cars[carIndex].stockStatus = 'Terjual';
      }
    } else if (req.body.orderStatus === 'DIBATALKAN') {
      // Return stock to Tersedia
      const carIndex = db.cars.findIndex(c => c.id === order.carId);
      if (carIndex >= 0) {
        db.cars[carIndex].stockStatus = 'Tersedia';
      }
    }

    saveDatabase(db);
    res.json(order);
  } catch (e: any) {
    res.status(500).json({ error: 'Gagal mengunggah status pesanan' });
  }
});

// 13. GET /api/customers
app.get('/api/customers', (req: Request, res: Response) => {
  try {
    const db = getDatabase();
    res.json(db.customers);
  } catch (e: any) {
    res.status(500).json({ error: 'Gagal mengambil data pelanggan' });
  }
});

// 13.5 POST /api/auth/customer/login
app.post('/api/auth/customer/login', (req: Request, res: Response) => {
  const { email, password } = req.body;
  const db = getDatabase();
  
  // Find customer in customers database
  const customer = db.customers.find(c => c.email.toLowerCase() === (email || '').toLowerCase());
  
  if (customer || email === 'budi.santoso@example.com' || email === 'pembeli@autobekas.com') {
    res.json({
      success: true,
      user: {
        id: customer ? customer.id : 'cust-demo',
        name: customer ? customer.name : 'Budi Santoso',
        email: email || 'budi.santoso@example.com',
        phone: customer ? customer.phone : '081234561122',
        city: customer ? customer.city : 'Jakarta Selatan',
        role: 'customer',
        token: `customer-token-${Date.now()}`
      }
    });
  } else {
    // If new user email, auto register or accept demo login
    const newCust: Customer = {
      id: `cust-${Date.now()}`,
      name: email.split('@')[0] || 'Pelanggan AutoBekas',
      email,
      phone: '0812' + Math.floor(10000000 + Math.random() * 90000000),
      city: 'Jakarta Selatan',
      address: 'Jl. Utama No. 1',
      totalOrders: 0,
      totalSpend: 0,
      lastOrderDate: new Date().toISOString().split('T')[0]
    };
    db.customers.push(newCust);
    saveDatabase(db);

    res.json({
      success: true,
      user: {
        id: newCust.id,
        name: newCust.name,
        email: newCust.email,
        phone: newCust.phone,
        city: newCust.city,
        role: 'customer',
        token: `customer-token-${Date.now()}`
      }
    });
  }
});

// 14. POST /api/admin/login
app.post('/api/admin/login', (req: Request, res: Response) => {
  const { email, password } = req.body;
  if ((email === 'admin@autobekas.com' || email === 'admin') && (password === 'admin123' || password === 'admin')) {
    res.json({
      success: true,
      user: {
        email: 'admin@autobekas.com',
        name: 'Administrator AutoBekas',
        token: `admin-token-${Date.now()}`
      }
    });
  } else {
    res.status(401).json({ error: 'Email atau password admin salah. Gunakan demo: admin@autobekas.com / admin123' });
  }
});

// 15. GET /api/reports/sales
app.get('/api/reports/sales', (req: Request, res: Response) => {
  try {
    const db = getDatabase();
    const approvedOrders = db.orders.filter(o => o.paymentStatus === 'APPROVED' || o.orderStatus === 'SELESAI' || o.orderStatus === 'DP_DITERIMA');

    let totalOmset = 0;
    let totalBookingDP = 0;
    let totalMobilTerjual = 0;

    const categoryMap: { [key: string]: { count: number; totalRevenue: number } } = {};
    const cityMap: { [key: string]: { count: number; totalRevenue: number } } = {};
    const brandMap: { [key: string]: number } = {};

    approvedOrders.forEach(o => {
      const val = o.paymentType === 'FULL' ? o.totalAmount : o.bookingFee;
      totalOmset += o.totalAmount;
      totalBookingDP += val;

      if (o.orderStatus === 'SELESAI' || o.paymentType === 'FULL') {
        totalMobilTerjual += 1;
      }

      // Find car category
      const car = db.cars.find(c => c.id === o.carId);
      const catName = car ? car.category : 'Lainnya';
      const cityName = o.buyerCity || (car ? car.location : 'Lainnya');
      const brandName = car ? car.brand : 'Toyota';

      if (!categoryMap[catName]) categoryMap[catName] = { count: 0, totalRevenue: 0 };
      categoryMap[catName].count += 1;
      categoryMap[catName].totalRevenue += o.totalAmount;

      if (!cityMap[cityName]) cityMap[cityName] = { count: 0, totalRevenue: 0 };
      cityMap[cityName].count += 1;
      cityMap[cityName].totalRevenue += o.totalAmount;

      brandMap[brandName] = (brandMap[brandName] || 0) + 1;
    });

    const report: SalesReportSummary = {
      totalOmset,
      totalBookingDP,
      totalMobilTerjual,
      totalOrders: db.orders.length,
      pendingProofCount: db.orders.filter(o => o.paymentStatus === 'PROOF_UPLOADED').length,
      totalCustomers: db.customers.length,
      categoryStats: Object.keys(categoryMap).map(cat => ({ category: cat, ...categoryMap[cat] })),
      cityStats: Object.keys(cityMap).map(city => ({ city, ...cityMap[city] })),
      topBrands: Object.keys(brandMap).map(brand => ({ brand, count: brandMap[brand] })).sort((a,b) => b.count - a.count)
    };

    res.json(report);
  } catch (e: any) {
    res.status(500).json({ error: 'Gagal membuat laporan penjualan' });
  }
});

// 16. POST /api/seed (Reset Data)
app.post('/api/seed', (req: Request, res: Response) => {
  try {
    const initialDb: DatabaseSchema = {
      cars: INITIAL_CARS,
      orders: INITIAL_ORDERS,
      customers: INITIAL_CUSTOMERS
    };
    saveDatabase(initialDb);
    res.json({ success: true, message: 'Database telah direset ke data 12 mobil awal' });
  } catch (e: any) {
    res.status(500).json({ error: 'Gagal mereset database' });
  }
});


// Configure Vite for development or static serving for production
if (process.env.NODE_ENV !== 'production') {
  const { createServer } = await import('vite');
  const vite = await createServer({
    server: { middlewareMode: true },
    appType: 'custom',
  });
  app.use(vite.middlewares);
  app.use('*', async (req, res, next) => {
    const url = req.originalUrl;
    try {
      let template = fs.readFileSync(path.resolve(__dirname, 'index.html'), 'utf-8');
      template = await vite.transformIndexHtml(url, template);
      res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
    } catch (e: any) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
} else {
  app.use(express.static(path.resolve(__dirname, 'dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'dist/index.html'));
  });
}

app.listen(PORT, '0.0.0.0', () => {
  console.log(`AutoBekas Server running at http://0.0.0.0:${PORT}`);
});
