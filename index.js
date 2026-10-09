const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 8080;

// 1. إعدادات CORS وتمرير البيانات
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    if (req.method === 'OPTIONS') return res.sendStatus(200);
    next();
});

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// 2. تشغيل الملفات الثابتة (الصور و CSS و JS)
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(__dirname));

// 3. الاتصال بقاعدة البيانات
const MONGODB_URI = process.env.MONGODB_URI;
if (MONGODB_URI) {
    mongoose.connect(MONGODB_URI)
        .then(() => console.log('✅ تم الاتصال بقاعدة البيانات MongoDB بنجاح!'))
        .catch((err) => console.error('❌ خطأ في الاتصال بقاعدة البيانات:', err.message));
}

// 4. نموذج البيانات للمنتجات
const productSchema = new mongoose.Schema({
    title: String,
    category: String,
    price: Number,
    description: String,
    image: String,
    createdAt: { type: Date, default: Date.now }
}, { strict: false });

const Product = mongoose.models.Product || mongoose.model('Product', productSchema);

// 5. مسارات الـ API (جلب المنتجات وحفظها)
app.get(['/api/products', '/products'], async (req, res) => {
    try {
        const products = await Product.find().sort({ createdAt: -1 });
        res.json(products);
    } catch (err) {
        res.status(500).json({ error: 'حدث خطأ أثناء جلب المنتجات' });
    }
});

app.post(['/api/products', '/products', '/add-product'], async (req, res) => {
    try {
        const newProduct = new Product(req.body);
        await newProduct.save();
        res.status(201).json({ success: true, product: newProduct });
    } catch (err) {
        res.status(500).json({ error: 'حدث خطأ أثناء حفظ المنتج' });
    }
});

// 6. عرض الواجهة الرئيسية
app.get('/', (req, res) => {
    const publicIndex = path.join(__dirname, 'public', 'index.html');
    const rootIndex = path.join(__dirname, 'index.html');

    if (fs.existsSync(publicIndex)) {
        return res.sendFile(publicIndex);
    } else if (fs.existsSync(rootIndex)) {
        return res.sendFile(rootIndex);
    } else {
        return res.send(`
            <div style="font-family: system-ui, sans-serif; text-align: center; margin-top: 80px; color: #333;">
                <h1 style="color: #4A90E2;">🚀 السيرفر شغال تمام ومتصل بـ MongoDB!</h1>
                <p style="font-size: 1.1rem; margin-top:10px;">يرجى التأكد من وجود ملف <b>index.html</b> في المجلد الرئيسي على GitHub لتعرض واجهة المتجر.</p>
            </div>
        `);
    }
});

// منع الانهيار المفاجئ
process.on('uncaughtException', (err) => console.error('Uncaught Exception:', err));
process.on('unhandledRejection', (reason) => console.error('Unhandled Rejection:', reason));

// تشغيل السيرفر
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 السيرفر شغال تمام على المنفذ ${PORT}`);
});
