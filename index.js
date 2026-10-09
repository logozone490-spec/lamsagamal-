const express = mequire('express') || require('express');
const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 8080;

// 1. Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 2. تشغيل الملفات الثابتة (CSS, JS, الصور)
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(__dirname));

// 3. الاتصال بقاعدة البيانات MongoDB
const MONGODB_URI = process.env.MONGODB_URI;
if (MONGODB_URI) {
  mongoose.connect(MONGODB_URI)
    .then(() => console.log('✅ تم الاتصال بقاعدة البيانات MongoDB!'))
    .catch((err) => console.error('❌ خطأ في الاتصال بقاعدة البيانات:', err));
}

// 4. عرض الصفحة الرئيسية تلقائياً
app.get('/', (req, res) => {
    const publicIndex = path.join(__dirname, 'public', 'index.html');
    const rootIndex = path.join(__dirname, 'index.html');

    if (fs.existsSync(publicIndex)) {
        return res.sendFile(publicIndex);
    } else if (fs.existsSync(rootIndex)) {
        return res.sendFile(rootIndex);
    } else {
        return res.send('<h1 style="text-align:center; margin-top:50px;">🚀 السيرفر يعمل بنجاح!</h1><p style="text-align:center;">يرجى التأكد من رفع ملف index.html في مشروعك.</p>');
    }
});

// 5. تشغيل السيرفر
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 السيرفر شغال تمام على المنفذ ${PORT}`);
});
