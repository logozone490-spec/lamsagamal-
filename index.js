const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 8080;

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// تشغيل الملفات الثابتة (CSS, JS, الصور)
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(__dirname));

// الاتصال بقاعدة البيانات
const MONGODB_URI = process.env.MONGODB_URI;

if (MONGODB_URI) {
    mongoose.connect(MONGODB_URI)
        .then(() => console.log('✅ تم الاتصال بقاعدة البيانات MongoDB بنجاح!'))
        .catch((err) => console.error('❌ خطأ في الاتصال بقاعدة البيانات:', err.message));
}

// عرض الصفحة الرئيسية للموقع
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
                <h1 style="color: #4A90E2;">🚀 موقع لمسة جمال يعمل بنجاح!</h1>
                <p>السيرفر متصل بقاعدة البيانات وقائم على Railway.</p>
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
