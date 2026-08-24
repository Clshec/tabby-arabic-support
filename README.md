# Tabby Arabic Support 🌐 (tabby-arabic-support)

> **إضافة دعم اللغة العربية والنصوص من اليمين لليسار (RTL) لبرنامج Tabby Terminal**  
> **Native Arabic, Persian, Urdu & RTL Language Support Plugin for Tabby Terminal**
> 
> 👤 **تطوير وبرمجة:** **عبدالرحمن سعد هاشم (Abdulrahman Saad Hashem)**  
> 📄 **الترخيص:** MIT License  

---

## 📖 نبذة عن الإضافة (About)

إضافة متطورة وشاملة تم تصميمها لتمكين برنامج **[Tabby Terminal](https://github.com/Eugeny/tabby)** من دعم اللغة العربية ولغات اليمين لليسار (RTL) بشكل أصيل ومتكامل 100%، سواء في الجلسات المحلية (PowerShell, CMD, WSL) أو جلسات الاتصال عن بُعد (SSH Linux Sessions)، بالإضافة إلى الدعم الكامل للأدوات التفاعلية وسطر الأوامر (مثل `agy` و `bash` و `nano`).

---

## ✨ المميزات الرئيسية (Key Features)

* **تشبيك الحروف العربية بانسيابية تامة (Contextual Arabic Shaping):**
  * ربط الحروف العربية المتصلة (بداية، وسط، نهاية، منفصلة) بدون أي تقطيع أو فواصل.
  * دعم كامل لكافة الحركات والتنوين وتراكيب اللام ألف (`لا`، `لأ`، `لإ`، `لآ`).

* **خوارزمية ثنائية الاتجاه المتقدمة (Unicode BiDi - UAX #9):**
  * عرض الكلمات العربية بالترتيب الطبيعي من اليمين لليسار.
  * معالجة ذكية للنصوص المختلطة (عربي + إنجليزي، أرقام، روابط URLs، ومسارات الملفات).

* **دعم كامل لجلسات السيرفر والأدوات التفاعلية (Full SSH & Interactive CLI Support):**
  * متوافق 100% مع جلسات **SSH Linux** وسطور الأوامر (`bash`, `zsh`, `fish`).
  * دعم كامل لتطبيقات سطر الأوامر التفاعلية والشاشات البديلة مثل **`agy` (Antigravity CLI)** و **`nano`** و **`python`**.

* **محرك الـ DOM Overlay عالي الأداء (Zero Stream Corruption):**
  * لا يقوم بتعديل أو تشويه تدفق بيانات الـ PTY الخام، مما يحافظ على دقة إحداثيات المؤشر (Cursor) وعمليات الحذف (`Backspace`) والتنقل بالأسهم بنسبة 100%.
  * يمتد النص ليملأ **عرض الشاشة بالكامل (100% Full Width)** بالاعتماد على خطوط الطرفيات الأحادية المسافة الحديثة (`Cascadia Mono`, `Cascadia Code`, `Consolas`).

* **لوحة تحكم واختصارات سريعة (Settings & Hotkeys):**
  * لوحة إعدادات مدمجة داخل إعدادات Tabby للتحكم في تفعيل/تعطيل الإضافة أو ضبط الوضع التلقائي (`Auto` / `On` / `Off`).
  * مفتاح اختصار للتبديل السريع في أي وقت (`toggle-arabic-rtl`).

---

## 🚀 طريقة التثبيت (Installation)

### 1. التثبيت اليدوي على ويندوز (Windows):

1. قم ببناء المشروع:
   ```bash
   npm install
   npm run build
   ```

2. انسخ مجلد المشروع أو مجلد `dist` مع `package.json` إلى مسار إضافات Tabby:
   ```powershell
   $target = "$env:APPDATA\tabby\plugins\node_modules\tabby-arabic-support"
   New-Item -ItemType Directory -Force -Path $target
   Copy-Item -Path "dist", "package.json" -Destination $target -Recurse -Force
   ```

3. أعد تشغيل برنامج **Tabby Terminal**.

### 2. التثبيت على أنظمة لينكس وماك (Linux & macOS):
* **Linux:** `~/.config/tabby/plugins/node_modules/tabby-arabic-support`
* **macOS:** `~/Library/Application Support/tabby/plugins/node_modules/tabby-arabic-support`

---

## 📜 الترخيص (License)

هذا المشروع مرخص تحت رخصة **[MIT License](LICENSE)** — مفتوح المصدر ومتاح للاستخدام والتطوير.
