const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const Product = require('./models/Product'); // استدعاء نموذج المنتج

const app = express();

app.use(cors());
app.use(express.json());

// رابط قاعدة البيانات مع كلمة المرور
const MONGO_URI = 'mongodb+srv://logozone490_db_user:rUjP5HMsRbKxlIYP@cluster0.tuz726e.mongodb.net/?appName=Cluster0';

mongoose.connect(MONGO_URI)
  .then(() => console.log('✅ تم الاتصال بقاعدة البيانات MongoDB بنجاح!'))
  .catch((err) => console.error('❌ خطأ في الاتصال بقاعدة البيانات:', err));

// مسار تجريبي للتأكد من عمل السيرفر
app.get('/', (req, res) => {
  res.send('🚀 سيرفر لمسة مغربية يعمل وقاعدة البيانات متصلة!');
});

// 1. مسار جلب جميع المنتجات (GET)
app.get('/api/products', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: 'خطأ في جلب المنتجات' });
  }
});

// 2. مسار إضافة منتج جديد (POST)
app.post('/api/products', async (req, res) => {
  try {
    const newProduct = new Product(req.body);
    const savedProduct = await newProduct.save();
    res.status(201).json({ message: '✅ تم إضافة المنتج بنجاح!', savedProduct });
  } catch (err) {
    res.status(400).json({ error: 'خطأ في إضافة المنتج', details: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 السيرفر شغال تمام على المنفذ ${PORT}`);
});