const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const Product = require('./models/Product'); // استدعاء نموذج المنتج

const app = express();

app.use(cors());
app.use(express.json());

// قراءة رابط قاعدة البيانات من متغيرات البيئة بأمان
const MONGO_URI = process.env.MONGODB_URI;

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
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: 'خطأ في جلب المنتجات', details: err.message });
  }
});

// 2. مسار جلب منتج واحد بالتفصيل عبر الـ ID
app.get('/api/products/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'المنتج غير موجود' });
    }
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: 'خطأ في جلب تفاصيل المنتج', details: err.message });
  }
});

// 3. مسار إضافة منتج جديد (POST)
app.post('/api/products', async (req, res) => {
  try {
    const { name, description, price, image, category, stock } = req.body;

    if (!name || !price || !category || !image) {
      return res.status(400).json({ error: 'يرجى إدخال الحقول الأساسية: الاسم، السعر، التصنيف، ورابط الصورة' });
    }

    const newProduct = new Product({
      name,
      description,
      price,
      image,
      category,
      stock: stock || 10
    });

    const savedProduct = await newProduct.save();
    res.status(201).json({ 
      message: '✅ تم إضافة المنتج بنجاح!', 
      savedProduct 
    });
  } catch (err) {
    res.status(400).json({ error: 'خطأ في إضافة المنتج', details: err.message });
  }
});

// 4. مسار حذف منتج (DELETE)
app.delete('/api/products/:id', async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct) {
      return res.status(404).json({ error: 'المنتج المراد حذفه غير موجود' });
    }
    res.json({ message: '🗑️ تم حذف المنتج بنجاح!' });
  } catch (err) {
    res.status(500).json({ error: 'خطأ أثناء حذف المنتج', details: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 السيرفر شغال تمام على المنفذ ${PORT}`);
});
