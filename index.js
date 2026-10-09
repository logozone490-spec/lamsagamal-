const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');

// تحميل متغيرات البيئة بأمان
try {
    require('dotenv').config();
} catch (e) {
    console.log('dotenv is not loaded');
}

const app = express();
const PORT = process.env.PORT || 8080;

// 1. إعدادات CORS المباشرة للتوافق التام مع الفرونت إند
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    next();
});

// 2. معالجة البيانات القادمة من الواجهة
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// 3. تشغيل الملفات الثابتة (CSS, JS, الصور)
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(__dirname));

// 4. الاتصال بقاعدة البيانات MongoDB
const MONGODB_URI = process.env.MONGODB_URI;
if (MONGODB_URI) {
    mongoose.connect(MONGODB_URI)
        .then(() => console.log('✅ تم الاتصال بقاعدة البيانات MongoDB بنجاح!'))
        .catch((err) => console.error('❌ خطأ في الاتصال بقاعدة البيانات:', err.message));
}

// 5. نموذج المنتجات
const productSchema = new mongoose.Schema({
    title: String,
    category: String,
    price: Number,
    description: String,
    image: String,
    createdAt: { type: Date, default: Date.now }
}, { strict: false });

const Product = mongoose.models.Product || mongoose.model('Product', productSchema);

// 6. مسارات الـ API لاستقبال المنتجات وإرسالها
const handleAddProduct = async (req, res) => {
    try {
        const newProduct = new Product(req.body);
        await newProduct.save();
        res.status(201).json({ success: true, message: 'تم نشر المنتج بنجاح!', product: newProduct });
    } catch (error) {
        res.status(500).json({ success: false, message: 'حدث خطأ أثناء حفظ المنتج', error: error.message });
    }
};

const handleGetProducts = async (req, res) => {
    try {
        const products = await Product.find().sort({ createdAt: -1 });
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ success: false, message: 'حدث خطأ أثناء جلب المنتجات' });
    }
};

app.post('/api/products', handleAddProduct);
app.post('/products', handleAddProduct);
app.post('/add-product', handleAddProduct);

app.get('/api/products', handleGetProducts);
app.get('/products', handleGetProducts);

// 7. عرض الصفحة الرئيسية
app.get('/', (req, res) => {
    const publicIndex = path.join(__dirname, 'public', 'index.html');
    const rootIndex = path.join(__dirname, 'index.html');

    if (fs.existsSync(publicIndex)) {
        return res.sendFile(publicIndex);
    } else if (fs.existsSync(rootIndex)) {
        return res.sendFile(rootIndex);
    } else {
        return res.send('<h1 style="text-align:center; margin-top:50px;">🚀 موقع لمسة جمال يعمل بنجاح!</h1>');
    }
});

// منع انهيار السيرفر
process.on('uncaughtException', (err) => console.error('Uncaught Exception:', err));
process.on('unhandledRejection', (reason) => console.error('Unhandled Rejection:', reason));

// تشغيل السيرفر
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 السيرفر شغال تمام على المنفذ ${PORT}`);
});
