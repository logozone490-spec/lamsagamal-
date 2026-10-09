const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 8080;

// 1. Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 2. تشغيل المجلد اللي فيه ملفات موقعك (HTML, CSS, JS, الصور)
// لو ملفات موقعك جوة مجلد اسمه public أو views غير اسمه هنا
app.use(express.static(path.join(__dirname, 'public')));

// 3. الاتصال بقاعدة البيانات MongoDB
const MONGODB_URI = process.env.MONGODB_URI;
mongoose.connect(MONGODB_URI)
  .then(() => console.log('✅ بنجاح تم الاتصال بقاعدة البيانات MongoDB!'))
  .catch((err) => console.error('❌ خطأ في الاتصال بقاعدة البيانات:', err));

// 4. عرض الصفحة الرئيسية لموقعك الحقيقي
app.get('/', (req, res) => {
    // بيفتح ملف index.html الخاص بموقعك من مجلد public
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// 5. استدعاء باقي الـ Routes أو الـ APIs الخاصة بموقعك (إذا كانت في ملفات منفصلة)
// const productRoutes = require('./routes/products');
// app.use('/api/products', productRoutes);

// 6. تشغيل السيرفر بنجاح على Railway
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 السيرفر شغال تمام على المنفذ ${PORT}`);
});
