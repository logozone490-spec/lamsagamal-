const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(express.json());

// الاتصال بقاعدة البيانات MongoDB
const MONGODB_URI = process.env.MONGODB_URI;

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('✅ بنجاح تم الاتصال بقاعدة البيانات MongoDB!');
  })
  .catch((err) => {
    console.error('❌ خطأ في الاتصال بقاعدة البيانات:', err);
  });

// الصفحة الرئيسية (عشان الرابط يفتح وما يعطيش 502)
app.get('/', (req, res) => {
    res.send('السيرفر شغال وموقع لمسة جمال يعمل بنجاح! 🚀');
});

// تشغيل السيرفر على جميع الواجهات 0.0.0.0 والمنفذ الصحيح
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 السيرفر شغال تمام على المنفذ ${PORT}`);
});
