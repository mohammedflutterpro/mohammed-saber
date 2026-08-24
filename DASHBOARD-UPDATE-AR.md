# تحديث لوحة التحكم وتفعيل رفع الملفات عبر GitHub

هذا التحديث يعيد تصميم لوحة التحكم ويضيف رفع الصورة الشخصية والسيرة الذاتية إلى مستودع GitHub بدون استخدام R2.

## رفع التحديث

1. افتح مستودع `mohammedflutterpro/mohammed-saber-it` في GitHub.
2. اختر **Add file → Upload files**.
3. اسحب كل محتويات مجلد التحديث إلى صفحة الرفع.
4. اضغط **Commit changes**.
5. انتظر انتهاء نشر Cloudflare التلقائي.

## إنشاء GitHub Token محدود الصلاحية

1. افتح GitHub ثم **Settings → Developer settings**.
2. افتح **Personal access tokens → Fine-grained tokens**.
3. اضغط **Generate new token**.
4. اكتب اسمًا مثل `portfolio-dashboard` وحدد مدة انتهاء مناسبة.
5. في **Repository access** اختر **Only select repositories** وحدد `mohammed-saber-it` فقط.
6. في **Repository permissions** اجعل **Contents** بقيمة **Read and write**.
7. أنشئ التوكن وانسخه مرة واحدة.

## إضافة التوكن إلى Cloudflare

1. افتح Worker باسم `mohammed-saber-it`.
2. افتح **Settings → Variables and Secrets**.
3. أضف Secret جديدًا باسم `GITHUB_TOKEN`.
4. ضع التوكن كقيمة، ثم احفظ وانشر التغيير.

لا تضع التوكن في ملفات GitHub، ولا ترسله لأي شخص.

## الاستخدام

افتح `/admin` ثم قسم **الصورة والسيرة**. الحد الأقصى لكل ملف 900KB، والصيغ المدعومة هي JPG وPNG وWebP للصورة وPDF للسيرة.
