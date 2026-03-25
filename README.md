# ✈️ فرسان السعودية — حاسبة النقاط والترقية

تطبيق ويب لمتابعة برنامج فرسان الخطوط السعودية، يتضمن:

- 🏆 **مراحل الترقية** — عرض المستويات الثلاثة ومزايا كل مستوى
- 🎫 **استبدال الأميال** — جدول تذاكر المكافآت (مكافأة / مكافأة بلس) حسب الوجهة والدرجة
- ⬆️ **ترقية الدرجة** — حاسبة تفاعلية لأميال الترقية من/إلى بناءً على نوع التذكرة
- 👤 **عضويتي** — أدخل أميالك ورحلاتك لمعرفة مستواك والتقدم نحو الترقية
- 🧮 **حاسبة الأميال** — احسب قيمة أميالك بالريال ومقارنتها بسعر التذكرة كاش

---

## 🚀 تشغيل المشروع محلياً

### المتطلبات
- Node.js 18 أو أحدث
- npm أو yarn أو pnpm

### الخطوات

```bash
# 1. تثبيت التبعيات
npm install

# 2. تشغيل بيئة التطوير
npm run dev
```

ثم افتح المتصفح على `http://localhost:5173`

---

## 🏗️ البناء للإنتاج

```bash
npm run build
```

يتم إنشاء مجلد `dist/` جاهز للرفع على أي استضافة ثابتة.

---

## 🌐 النشر على GitHub Pages

### الطريقة الأولى: يدوياً

```bash
# بناء المشروع
npm run build

# رفع مجلد dist على فرع gh-pages
npm install -g gh-pages
gh-pages -d dist
```

### الطريقة الثانية: GitHub Actions (تلقائي)

أنشئ ملف `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm install
      - run: npm run build
      - uses: peaceiris/actions-gh-pages@v4
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

> **ملاحظة:** تأكد من تفعيل GitHub Pages من إعدادات الـ repo وتحديد فرع `gh-pages`.

---

## 🌐 النشر على Vercel أو Netlify

### Vercel
```bash
npm install -g vercel
vercel --prod
```

### Netlify
```bash
npm run build
# ارفع مجلد dist على netlify.com أو:
npm install -g netlify-cli
netlify deploy --prod --dir=dist
```

---

## 📁 هيكل الملفات

```
alfursan-tracker/
├── public/
│   └── favicon.svg
├── src/
│   ├── main.jsx          # نقطة الدخول
│   └── App.jsx           # التطبيق الكامل
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

---

## 🛠️ التقنيات المستخدمة

- **React 18** — واجهة المستخدم
- **Vite 5** — أداة البناء
- **CSS-in-JS** — التنسيق (بدون مكتبات خارجية)

---

## ⚠️ تنبيه

البيانات المعروضة مأخوذة من الجداول الرسمية لموقع الخطوط السعودية وهي للتوجيه العام فقط.  
للتفاصيل الرسمية والمحدّثة، تفضل بزيارة [saudia.com](https://www.saudia.com)

---

## 📄 الترخيص

MIT License — حر الاستخدام والتعديل.
