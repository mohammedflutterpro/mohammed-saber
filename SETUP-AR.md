# خطوات نشر بورتفوليو محمد صابر على Cloudflare

الملفات جاهزة للعمل على Cloudflare Workers، وتشمل الموقع العربي والإنجليزي، الصورة، السيرة الذاتية، قاعدة بيانات D1، ولوحة التحكم على `/admin`.

## 1) ارفع الملفات إلى GitHub

1. فك ضغط ملف ZIP على الكمبيوتر.
2. افتح GitHub واضغط **New repository**.
3. اكتب اسم المستودع: `mohammed-saber-it`.
4. اختر **Private** أو **Public**، ثم اضغط **Create repository**.
5. اختر **Add file → Upload files**.
6. اسحب كل الملفات الموجودة داخل مجلد `cloudflare-portfolio` إلى الصفحة، ثم اضغط **Commit changes**.

مهم: ارفع محتويات المجلد، وليس ملف ZIP نفسه.

## 2) أنشئ قاعدة البيانات في Cloudflare

1. من لوحة Cloudflare افتح **Storage & databases → D1 SQL database**.
2. اضغط **Create database**.
3. سمّها: `mohammed-saber-portfolio-db`.
4. بعد إنشائها انسخ **Database ID**.
5. ارجع إلى GitHub وافتح ملف `wrangler.jsonc` واضغط علامة القلم.
6. استبدل الرقم `00000000-0000-4000-8000-000000000000` بالـ Database ID الذي نسخته، ثم احفظ التعديل عبر **Commit changes**.
7. ارجع إلى قاعدة D1 في Cloudflare، وافتح **Console**، ثم شغّل هذا الأمر:

```sql
CREATE TABLE `portfolio_content` (
  `id` integer PRIMARY KEY NOT NULL,
  `content` text NOT NULL,
  `updated_at` text NOT NULL
);
```

## 3) اربط GitHub وانشر الموقع

1. افتح **Workers & Pages → Create application → Connect GitHub**.
2. اختر مستودع `mohammed-saber-it`.
3. اكتب الإعدادات التالية:
   - **Build command:** `npm run build`
   - **Deploy command:** `npx wrangler deploy`
   - **Root directory:** اتركها فارغة أو `/`
   - **Production branch:** `main`
4. اضغط **Deploy**.
5. إذا طلب منك Cloudflare اختيار جزء رابط `workers.dev`، اختر اسمًا محايدًا مثل `msaber` أو `mohammedsaber`.

## 4) فعّل كلمة سر لوحة التحكم

1. بعد نجاح النشر افتح التطبيق في Cloudflare.
2. ادخل إلى **Settings → Variables and Secrets**.
3. أضف Secret باسم `ADMIN_PASSWORD`، وضع كلمة سر قوية خاصة بك.
4. أضف Secret باسم `SESSION_SECRET`، وضع نصًا عشوائيًا طويلًا لا يقل عن 32 حرفًا.
5. احفظ التغييرات، ثم أعد النشر إذا طلب Cloudflare ذلك.

لا تضع القيمتين داخل GitHub ولا ترسلهما لأي شخص.

## 5) افتح الموقع والداشبورد

- الموقع: رابط Cloudflare الذي ينتهي بـ `.workers.dev`
- لوحة التحكم: أضف `/admin` في نهاية رابط الموقع.

من لوحة التحكم يمكنك تعديل النصوص والروابط وحفظها في قاعدة D1.
