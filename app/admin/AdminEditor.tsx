"use client";

import { useEffect, useRef, useState } from "react";
import { defaultData } from "../page";
import "./admin.css";
import "./login.css";

type Lang = "ar" | "en";
type Tab = "home" | "profile" | "experience" | "project" | "education" | "contact" | "files";

const names: Record<Tab, string> = {
  home: "الرئيسية",
  profile: "النبذة والمهارات",
  experience: "الخبرة",
  project: "المشروع",
  education: "التعليم",
  contact: "التواصل",
  files: "الصورة والسيرة",
};

export default function AdminEditor() {
  const [lang, setLang] = useState<Lang>("ar");
  const [tab, setTab] = useState<Tab>("home");
  const [content, setContent] = useState<any>(defaultData);
  const [links, setLinks] = useState({ whatsapp: "966510565165", email: "mohammed.saber.dev@gmail.com", linkedin: "https://linkedin.com/in/mohammed-saber-it" });
  const [loading, setLoading] = useState(true);
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"ok" | "error" | "busy">("ok");
  const [dirty, setDirty] = useState(false);
  const [uploading, setUploading] = useState<"photo" | "cv" | null>(null);
  const [photoVersion, setPhotoVersion] = useState(Date.now());
  const photoInput = useRef<HTMLInputElement>(null);
  const cvInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch("/api/admin/session").then(r => setAuthed(r.ok));
    fetch("/api/content").then(r => r.json()).then(data => {
      if (data?.content) setContent(data.content);
      if (data?.links) setLinks(data.links);
    }).finally(() => setLoading(false));
  }, []);

  const t = content[lang];
  const notify = (text: string, type: "ok" | "error" | "busy" = "ok") => {
    setMessage(text); setMessageType(type);
    if (type !== "busy") window.setTimeout(() => setMessage(""), 4500);
  };
  const edit = (key: string, value: any) => {
    setDirty(true);
    setContent((old: any) => ({ ...old, [lang]: { ...old[lang], [key]: value } }));
  };
  const editLink = (key: keyof typeof links, value: string) => {
    setDirty(true); setLinks(old => ({ ...old, [key]: value }));
  };

  const login = async (event: React.FormEvent) => {
    event.preventDefault(); setMessage("جاري تسجيل الدخول...");
    const response = await fetch("/api/admin/session", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ password }) });
    if (response.ok) { setAuthed(true); setPassword(""); setMessage(""); }
    else setMessage("كلمة المرور غير صحيحة");
  };
  const logout = async () => { await fetch("/api/admin/session", { method: "DELETE" }); setAuthed(false); };
  const save = async () => {
    notify("جاري حفظ التعديلات...", "busy");
    const response = await fetch("/api/content", { method: "PUT", headers: { "content-type": "application/json" }, body: JSON.stringify({ content, links }) });
    if (response.status === 401) return setAuthed(false);
    if (response.ok) { setDirty(false); notify("تم الحفظ والنشر بنجاح"); }
    else notify("تعذر الحفظ، حاول مرة أخرى", "error");
  };

  const upload = async (kind: "photo" | "cv", file?: File) => {
    if (!file) return;
    const isPhoto = kind === "photo";
    const allowed = isPhoto ? ["image/jpeg", "image/png", "image/webp"] : ["application/pdf"];
    if (!allowed.includes(file.type)) return notify(isPhoto ? "اختر صورة JPG أو PNG أو WebP" : "اختر ملف PDF", "error");
    if (file.size > 900_000) return notify("حجم الملف يجب ألا يتجاوز 900KB", "error");
    setUploading(kind); notify(isPhoto ? "جاري رفع الصورة إلى GitHub..." : "جاري رفع السيرة إلى GitHub...", "busy");
    const response = await fetch(`/api/media/${kind}`, { method: "PUT", headers: { "content-type": file.type, "content-length": String(file.size) }, body: file });
    setUploading(null);
    if (response.status === 401) return setAuthed(false);
    const data = await response.json().catch(() => ({}));
    if (!response.ok) return notify(data.error || "تعذر رفع الملف", "error");
    if (isPhoto) setPhotoVersion(Date.now());
    notify(isPhoto ? "تم تحديث الصورة بنجاح" : "تم تحديث السيرة الذاتية بنجاح");
  };

  if (loading) return <main className="admin-loading">جاري تحميل لوحة التحكم...</main>;
  if (!authed) return <main className="admin-login" dir="rtl"><form onSubmit={login}><a className="admin-logo" href="/">MS</a><h1>لوحة التحكم</h1><p>أدخل كلمة المرور الخاصة بإدارة الموقع.</p><input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="كلمة المرور" required autoFocus/><button>تسجيل الدخول</button>{message && <span>{message}</span>}</form></main>;

  const menu = (key: Tab, icon: string) => <button className={tab === key ? "active" : ""} onClick={() => setTab(key)}><i>{icon}</i><span>{names[key]}</span></button>;
  return <main className="admin-shell" dir="rtl">
    <aside>
      <div className="admin-brand"><a className="admin-logo" href="/">MS</a><div><strong>Mohammed Saber</strong><small>Portfolio Manager</small></div></div>
      <nav>{menu("home", "⌂")}{menu("profile", "◉")}{menu("experience", "▣")}{menu("project", "◇")}{menu("education", "▤")}{menu("contact", "@")}{menu("files", "▧")}</nav>
      <div className="aside-footer"><a href="/" target="_blank">فتح الموقع ↗</a><button onClick={logout}>تسجيل الخروج</button></div>
    </aside>

    <section className="admin-workspace">
      <header className="admin-topbar"><div><p>لوحة التحكم / {names[tab]}</p><h1>{names[tab]}</h1></div><div className="top-actions"><span className={dirty ? "dirty" : "saved"}>{dirty ? "تعديلات غير محفوظة" : "محفوظ"}</span><a href="/" target="_blank">معاينة</a><button onClick={save} disabled={!dirty}>حفظ ونشر</button></div></header>
      {message && <div className={`notice ${messageType}`}>{messageType === "busy" && <i/>}{message}</div>}
      {tab !== "files" && <div className="editor-toolbar"><div><button className={lang === "ar" ? "active" : ""} onClick={() => setLang("ar")}>العربية</button><button className={lang === "en" ? "active" : ""} onClick={() => setLang("en")}>English</button></div><span>تعديل النسخة {lang === "ar" ? "العربية" : "الإنجليزية"}</span></div>}

      {tab === "home" && <div className="dashboard-grid"><article className="welcome"><div><small>مرحبًا محمد</small><h2>إدارة الموقع أصبحت أبسط</h2><p>اختَر القسم المطلوب، عدّل بياناته، ثم اضغط حفظ ونشر.</p><button onClick={() => setTab("profile")}>ابدأ التعديل</button></div><strong>MS</strong></article><Quick title="حالة الموقع" value="● منشور" action="فتح الموقع" onClick={() => window.open("/", "_blank")}/><Quick title="لغة التحرير" value={lang === "ar" ? "العربية" : "English"} action="تغيير اللغة" onClick={() => setLang(lang === "ar" ? "en" : "ar")}/><Quick title="إدارة الملفات" value="الصورة والسيرة" action="فتح الملفات" onClick={() => setTab("files")}/></div>}

      {tab === "profile" && <><Card title="المقدمة والنبذة" text="النصوص التي تظهر في بداية الموقع وقسم التعريف."><div className="form-grid"><Field label={lang === "ar" ? "العنوان الرئيسي" : "Main title"} wide><input value={t.title} onChange={e => edit("title", e.target.value)}/></Field><Field label={lang === "ar" ? "المقدمة" : "Introduction"} wide><textarea rows={4} value={t.intro} onChange={e => edit("intro", e.target.value)}/></Field><Field label={lang === "ar" ? "عنوان النبذة" : "About heading"}><input value={t.aboutTitle} onChange={e => edit("aboutTitle", e.target.value)}/></Field><Field label={lang === "ar" ? "النص التعريفي" : "About text"} wide><textarea rows={5} value={t.about} onChange={e => edit("about", e.target.value)}/></Field></div></Card><Card title="المهارات التقنية" text="عدّل اسم كل مجموعة ووصفها."><div className="repeater">{t.skills.map((skill: string[], i: number) => <div className="repeat-row" key={i}><b>{i + 1}</b><input value={skill[0]} onChange={e => { const a = [...t.skills]; a[i] = [e.target.value, a[i][1]]; edit("skills", a); }}/><textarea rows={2} value={skill[1]} onChange={e => { const a = [...t.skills]; a[i] = [a[i][0], e.target.value]; edit("skills", a); }}/></div>)}</div></Card></>}

      {tab === "experience" && <Card title="الخبرة العملية" text="بيانات الوظيفة الحالية وأهم المسؤوليات."><div className="form-grid"><Field label="المسمى الوظيفي"><input value={t.role} onChange={e => edit("role", e.target.value)}/></Field><Field label="الشركة"><input value={t.company} onChange={e => edit("company", e.target.value)}/></Field><Field label="الفترة" wide><input value={t.period} onChange={e => edit("period", e.target.value)}/></Field></div><h3 className="subheading">نقاط الخبرة</h3><div className="repeater">{t.bullets.map((item: string, i: number) => <div className="repeat-row compact" key={i}><b>{i + 1}</b><textarea rows={2} value={item} onChange={e => { const a = [...t.bullets]; a[i] = e.target.value; edit("bullets", a); }}/></div>)}</div></Card>}
      {tab === "project" && <Card title="المشروع المميز" text="اعرض المشروع بصورة مختصرة وواضحة."><div className="form-grid"><Field label="اسم المشروع" wide><input value={t.projectName} onChange={e => edit("projectName", e.target.value)}/></Field><Field label="تفاصيل المشروع" wide><textarea rows={6} value={t.project} onChange={e => edit("project", e.target.value)}/></Field><Field label="الكلمات المفتاحية — افصل بفاصلة" wide><input value={t.tags.join(", ")} onChange={e => edit("tags", e.target.value.split(",").map(x => x.trim()).filter(Boolean))}/></Field></div></Card>}
      {tab === "education" && <Card title="المؤهل العلمي" text="بيانات الشهادة الجامعية الظاهرة في الموقع."><div className="form-grid"><Field label="الدرجة الجامعية"><input value={t.degree} onChange={e => edit("degree", e.target.value)}/></Field><Field label="الجامعة"><input value={t.school} onChange={e => edit("school", e.target.value)}/></Field><Field label="سنة التخرج" wide><input value={t.year} onChange={e => edit("year", e.target.value)}/></Field></div></Card>}
      {tab === "contact" && <><Card title="قسم التواصل" text="العنوان والوصف في نهاية الموقع."><div className="form-grid"><Field label="العنوان" wide><input value={t.contactTitle} onChange={e => edit("contactTitle", e.target.value)}/></Field><Field label="الوصف" wide><textarea rows={4} value={t.contactText} onChange={e => edit("contactText", e.target.value)}/></Field></div></Card><Card title="روابط التواصل" text="مشتركة بين العربية والإنجليزية."><div className="form-grid"><Field label="واتساب"><input value={links.whatsapp} onChange={e => editLink("whatsapp", e.target.value)}/></Field><Field label="البريد"><input value={links.email} onChange={e => editLink("email", e.target.value)}/></Field><Field label="LinkedIn" wide><input value={links.linkedin} onChange={e => editLink("linkedin", e.target.value)}/></Field></div></Card></>}

      {tab === "files" && <div className="media-grid"><Card title="الصورة الشخصية" text="JPG أو PNG أو WebP، بحد أقصى 900KB."><div className="photo-manager"><img src={`/api/media/photo?v=${photoVersion}`} alt="الصورة الحالية"/><div><strong>الصورة الحالية</strong><p>يفضل استخدام صورة عمودية واضحة.</p><input ref={photoInput} hidden type="file" accept="image/jpeg,image/png,image/webp" onChange={e => upload("photo", e.target.files?.[0])}/><button onClick={() => photoInput.current?.click()} disabled={uploading === "photo"}>{uploading === "photo" ? "جاري الرفع..." : "اختيار صورة جديدة"}</button></div></div></Card><Card title="السيرة الذاتية" text="PDF بحد أقصى 900KB."><div className="cv-manager"><i>PDF</i><div><strong>Mohammed Saber CV</strong><p>الملف الجديد سيستبدل النسخة الحالية.</p><input ref={cvInput} hidden type="file" accept="application/pdf" onChange={e => upload("cv", e.target.files?.[0])}/><div><button onClick={() => cvInput.current?.click()} disabled={uploading === "cv"}>{uploading === "cv" ? "جاري الرفع..." : "رفع نسخة جديدة"}</button><a href="/api/media/cv" target="_blank">عرض الحالية ↗</a></div></div></div></Card><aside className="github-note"><strong>تخزين مجاني على GitHub</strong><p>رفع الملفات يتم من السيرفر باستخدام صلاحية محدودة للمستودع، ولا يظهر التوكن داخل المتصفح.</p></aside></div>}
    </section>
  </main>;
}

function Card({ title, text, children }: { title: string; text: string; children: React.ReactNode }) { return <article className="editor-card"><header><h2>{title}</h2><p>{text}</p></header>{children}</article>; }
function Field({ label, wide, children }: { label: string; wide?: boolean; children: React.ReactNode }) { return <label className={wide ? "field wide" : "field"}><span>{label}</span>{children}</label>; }
function Quick({ title, value, action, onClick }: { title: string; value: string; action: string; onClick: () => void }) { return <article className="quick"><span>{title}</span><strong>{value}</strong><button onClick={onClick}>{action}</button></article>; }
