"use client";

import { useEffect, useRef, useState } from "react";
import { defaultData } from "../page";
import "./admin.css";
import "./login.css";

type Lang = "ar" | "en";
type Tab = "home" | "profile" | "experience" | "project" | "education" | "contact" | "files";

const names: Record<Lang, Record<Tab, string>> = {
  en: { home: "Dashboard", profile: "Profile & Skills", experience: "Experience", project: "Project", education: "Education", contact: "Contact", files: "Photo & CV" },
  ar: { home: "الرئيسية", profile: "النبذة والمهارات", experience: "الخبرة", project: "المشروع", education: "التعليم", contact: "التواصل", files: "الصورة والسيرة" },
};

export default function AdminEditor() {
  const [lang, setLang] = useState<Lang>("en");
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
  const isAr = lang === "ar";
  const sectionNames = names[lang];
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
    event.preventDefault(); setMessage(isAr ? "جاري تسجيل الدخول..." : "Signing in...");
    const response = await fetch("/api/admin/session", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ password }) });
    if (response.ok) { setAuthed(true); setPassword(""); setMessage(""); }
    else setMessage(isAr ? "كلمة المرور غير صحيحة" : "Incorrect password");
  };
  const logout = async () => { await fetch("/api/admin/session", { method: "DELETE" }); setAuthed(false); };
  const save = async () => {
    notify(isAr ? "جاري حفظ التعديلات..." : "Saving changes...", "busy");
    const response = await fetch("/api/content", { method: "PUT", headers: { "content-type": "application/json" }, body: JSON.stringify({ content, links }) });
    if (response.status === 401) return setAuthed(false);
    if (response.ok) { setDirty(false); notify(isAr ? "تم الحفظ والنشر بنجاح" : "Changes saved and published successfully"); }
    else notify(isAr ? "تعذر الحفظ، حاول مرة أخرى" : "Could not save changes. Please try again.", "error");
  };

  const upload = async (kind: "photo" | "cv", file?: File) => {
    if (!file) return;
    const isPhoto = kind === "photo";
    const allowed = isPhoto ? ["image/jpeg", "image/png", "image/webp"] : ["application/pdf"];
    if (!allowed.includes(file.type)) return notify(isAr ? (isPhoto ? "اختر صورة JPG أو PNG أو WebP" : "اختر ملف PDF") : (isPhoto ? "Choose a JPG, PNG, or WebP image" : "Choose a PDF file"), "error");
    if (file.size > 900_000) return notify(isAr ? "حجم الملف يجب ألا يتجاوز 900KB" : "File size must not exceed 900KB", "error");
    setUploading(kind); notify(isAr ? (isPhoto ? "جاري رفع الصورة إلى GitHub..." : "جاري رفع السيرة إلى GitHub...") : (isPhoto ? "Uploading photo to GitHub..." : "Uploading CV to GitHub..."), "busy");
    const response = await fetch(`/api/media/${kind}`, { method: "PUT", headers: { "content-type": file.type, "content-length": String(file.size) }, body: file });
    setUploading(null);
    if (response.status === 401) return setAuthed(false);
    const data = await response.json().catch(() => ({}));
    if (!response.ok) return notify(data.error || (isAr ? "تعذر رفع الملف" : "Could not upload the file"), "error");
    if (isPhoto) setPhotoVersion(Date.now());
    notify(isAr ? (isPhoto ? "تم تحديث الصورة بنجاح" : "تم تحديث السيرة الذاتية بنجاح") : (isPhoto ? "Photo updated successfully" : "CV updated successfully"));
  };

  if (loading) return <main className="admin-loading">{isAr ? "جاري تحميل لوحة التحكم..." : "Loading dashboard..."}</main>;
  if (!authed) return <main className="admin-login" dir={isAr ? "rtl" : "ltr"}><form onSubmit={login}><a className="admin-logo" href="/">MS</a><h1>{isAr ? "لوحة التحكم" : "Dashboard"}</h1><p>{isAr ? "أدخل كلمة المرور الخاصة بإدارة الموقع." : "Enter your password to manage the website."}</p><input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder={isAr ? "كلمة المرور" : "Password"} required autoFocus/><button>{isAr ? "تسجيل الدخول" : "Sign in"}</button>{message && <span>{message}</span>}</form></main>;

  const menu = (key: Tab, icon: string) => <button className={tab === key ? "active" : ""} onClick={() => setTab(key)}><i>{icon}</i><span>{sectionNames[key]}</span></button>;
  return <main className={`admin-shell ${lang === "en" ? "lang-en" : ""}`} dir={isAr ? "rtl" : "ltr"}>
    <aside>
      <div className="admin-brand"><a className="admin-logo" href="/">MS</a><div><strong>Mohammed Saber</strong><small>{isAr ? "إدارة البورتفوليو" : "Portfolio Manager"}</small></div></div>
      <nav>{menu("home", "⌂")}{menu("profile", "◉")}{menu("experience", "▣")}{menu("project", "◇")}{menu("education", "▤")}{menu("contact", "@")}{menu("files", "▧")}</nav>
      <div className="aside-footer"><a href="/" target="_blank">{isAr ? "فتح الموقع ↗" : "Open website ↗"}</a><button onClick={logout}>{isAr ? "تسجيل الخروج" : "Sign out"}</button></div>
    </aside>

    <section className="admin-workspace">
      <header className="admin-topbar"><div><p>{isAr ? "لوحة التحكم" : "Dashboard"} / {sectionNames[tab]}</p><h1>{sectionNames[tab]}</h1></div><div className="top-actions"><span className={dirty ? "dirty" : "saved"}>{dirty ? (isAr ? "تعديلات غير محفوظة" : "Unsaved changes") : (isAr ? "محفوظ" : "Saved")}</span><a href="/" target="_blank">{isAr ? "معاينة" : "Preview"}</a><button onClick={save} disabled={!dirty}>{isAr ? "حفظ ونشر" : "Save & Publish"}</button></div></header>
      {message && <div className={`notice ${messageType}`}>{messageType === "busy" && <i/>}{message}</div>}
      {tab !== "files" && tab !== "home" && <div className="editor-toolbar"><div><button className={lang === "ar" ? "active" : ""} onClick={() => setLang("ar")}>العربية</button><button className={lang === "en" ? "active" : ""} onClick={() => setLang("en")}>English</button></div><span>{isAr ? "تعديل النسخة العربية" : "Editing the English version"}</span></div>}

      {tab === "home" && <div className="dashboard-grid"><article className="welcome"><div><small>{isAr ? "مرحبًا محمد" : "Welcome, Mohammed"}</small><h2>{isAr ? "إدارة الموقع أصبحت أبسط" : "Website management made simple"}</h2><p>{isAr ? "اختَر القسم المطلوب، عدّل بياناته، ثم اضغط حفظ ونشر." : "Choose a section, update its details, then select Save & Publish."}</p><button onClick={() => setTab("profile")}>{isAr ? "ابدأ التعديل" : "Start editing"}</button></div><strong>MS</strong></article><Quick title={isAr ? "حالة الموقع" : "Website status"} value={isAr ? "● منشور" : "● Published"} action={isAr ? "فتح الموقع" : "Open website"} onClick={() => window.open("/", "_blank")}/><Quick title={isAr ? "لغة التحرير" : "Editing language"} value={isAr ? "العربية" : "English"} action={isAr ? "تغيير اللغة" : "Switch language"} onClick={() => setLang(isAr ? "en" : "ar")}/><Quick title={isAr ? "إدارة الملفات" : "File manager"} value={isAr ? "الصورة والسيرة" : "Photo & CV"} action={isAr ? "فتح الملفات" : "Open files"} onClick={() => setTab("files")}/></div>}

      {tab === "profile" && <><Card title={isAr ? "المقدمة والنبذة" : "Introduction & About"} text={isAr ? "النصوص التي تظهر في بداية الموقع وقسم التعريف." : "Text shown in the hero and About sections."}><div className="form-grid"><Field label={isAr ? "العنوان الرئيسي" : "Main title"} wide><input value={t.title} onChange={e => edit("title", e.target.value)}/></Field><Field label={isAr ? "المقدمة" : "Introduction"} wide><textarea rows={4} value={t.intro} onChange={e => edit("intro", e.target.value)}/></Field><Field label={isAr ? "عنوان النبذة" : "About heading"}><input value={t.aboutTitle} onChange={e => edit("aboutTitle", e.target.value)}/></Field><Field label={isAr ? "النص التعريفي" : "About text"} wide><textarea rows={5} value={t.about} onChange={e => edit("about", e.target.value)}/></Field></div></Card><Card title={isAr ? "المهارات التقنية" : "Technical skills"} text={isAr ? "عدّل اسم كل مجموعة ووصفها." : "Edit the name and description of each skill group."}><div className="repeater">{t.skills.map((skill: string[], i: number) => <div className="repeat-row" key={i}><b>{i + 1}</b><input value={skill[0]} onChange={e => { const a = [...t.skills]; a[i] = [e.target.value, a[i][1]]; edit("skills", a); }}/><textarea rows={2} value={skill[1]} onChange={e => { const a = [...t.skills]; a[i] = [a[i][0], e.target.value]; edit("skills", a); }}/></div>)}</div></Card></>}

      {tab === "experience" && <Card title={isAr ? "الخبرة العملية" : "Work experience"} text={isAr ? "بيانات الوظيفة الحالية وأهم المسؤوليات." : "Current role details and key responsibilities."}><div className="form-grid"><Field label={isAr ? "المسمى الوظيفي" : "Job title"}><input value={t.role} onChange={e => edit("role", e.target.value)}/></Field><Field label={isAr ? "الشركة" : "Company"}><input value={t.company} onChange={e => edit("company", e.target.value)}/></Field><Field label={isAr ? "الفترة" : "Period"} wide><input value={t.period} onChange={e => edit("period", e.target.value)}/></Field></div><h3 className="subheading">{isAr ? "نقاط الخبرة" : "Experience highlights"}</h3><div className="repeater">{t.bullets.map((item: string, i: number) => <div className="repeat-row compact" key={i}><b>{i + 1}</b><textarea rows={2} value={item} onChange={e => { const a = [...t.bullets]; a[i] = e.target.value; edit("bullets", a); }}/></div>)}</div></Card>}
      {tab === "project" && <Card title={isAr ? "المشروع المميز" : "Featured project"} text={isAr ? "اعرض المشروع بصورة مختصرة وواضحة." : "Present the project clearly and concisely."}><div className="form-grid"><Field label={isAr ? "اسم المشروع" : "Project name"} wide><input value={t.projectName} onChange={e => edit("projectName", e.target.value)}/></Field><Field label={isAr ? "تفاصيل المشروع" : "Project details"} wide><textarea rows={6} value={t.project} onChange={e => edit("project", e.target.value)}/></Field><Field label={isAr ? "الكلمات المفتاحية — افصل بفاصلة" : "Keywords — separate with commas"} wide><input value={t.tags.join(", ")} onChange={e => edit("tags", e.target.value.split(",").map(x => x.trim()).filter(Boolean))}/></Field></div></Card>}
      {tab === "education" && <Card title={isAr ? "المؤهل العلمي" : "Education"} text={isAr ? "بيانات الشهادة الجامعية الظاهرة في الموقع." : "University degree details shown on the website."}><div className="form-grid"><Field label={isAr ? "الدرجة الجامعية" : "Degree"}><input value={t.degree} onChange={e => edit("degree", e.target.value)}/></Field><Field label={isAr ? "الجامعة" : "University"}><input value={t.school} onChange={e => edit("school", e.target.value)}/></Field><Field label={isAr ? "سنة التخرج" : "Graduation year"} wide><input value={t.year} onChange={e => edit("year", e.target.value)}/></Field></div></Card>}
      {tab === "contact" && <><Card title={isAr ? "قسم التواصل" : "Contact section"} text={isAr ? "العنوان والوصف في نهاية الموقع." : "Heading and description at the end of the website."}><div className="form-grid"><Field label={isAr ? "العنوان" : "Heading"} wide><input value={t.contactTitle} onChange={e => edit("contactTitle", e.target.value)}/></Field><Field label={isAr ? "الوصف" : "Description"} wide><textarea rows={4} value={t.contactText} onChange={e => edit("contactText", e.target.value)}/></Field></div></Card><Card title={isAr ? "روابط التواصل" : "Contact links"} text={isAr ? "مشتركة بين العربية والإنجليزية." : "Shared by the Arabic and English versions."}><div className="form-grid"><Field label={isAr ? "واتساب" : "WhatsApp"}><input value={links.whatsapp} onChange={e => editLink("whatsapp", e.target.value)}/></Field><Field label={isAr ? "البريد" : "Email"}><input value={links.email} onChange={e => editLink("email", e.target.value)}/></Field><Field label="LinkedIn" wide><input value={links.linkedin} onChange={e => editLink("linkedin", e.target.value)}/></Field></div></Card></>}

      {tab === "files" && <div className="media-grid"><Card title={isAr ? "الصورة الشخصية" : "Profile photo"} text={isAr ? "JPG أو PNG أو WebP، بحد أقصى 900KB." : "JPG, PNG, or WebP, up to 900KB."}><div className="photo-manager"><img src={`/api/media/photo?v=${photoVersion}`} onError={e => { e.currentTarget.onerror = null; e.currentTarget.src = "/mohammed-saber.jpg"; }} alt={isAr ? "الصورة الحالية" : "Current profile photo"}/><div><strong>{isAr ? "الصورة الحالية" : "Current photo"}</strong><p>{isAr ? "يفضل استخدام صورة عمودية واضحة." : "A clear portrait photo is recommended."}</p><input ref={photoInput} hidden type="file" accept="image/jpeg,image/png,image/webp" onChange={e => upload("photo", e.target.files?.[0])}/><button onClick={() => photoInput.current?.click()} disabled={uploading === "photo"}>{uploading === "photo" ? (isAr ? "جاري الرفع..." : "Uploading...") : (isAr ? "اختيار صورة جديدة" : "Choose new photo")}</button></div></div></Card><Card title={isAr ? "السيرة الذاتية" : "Curriculum Vitae"} text={isAr ? "PDF بحد أقصى 900KB." : "PDF, up to 900KB."}><div className="cv-manager"><i>PDF</i><div><strong>Mohammed Saber CV</strong><p>{isAr ? "الملف الجديد سيستبدل النسخة الحالية." : "The new file will replace the current version."}</p><input ref={cvInput} hidden type="file" accept="application/pdf" onChange={e => upload("cv", e.target.files?.[0])}/><div><button onClick={() => cvInput.current?.click()} disabled={uploading === "cv"}>{uploading === "cv" ? (isAr ? "جاري الرفع..." : "Uploading...") : (isAr ? "رفع نسخة جديدة" : "Upload new CV")}</button><a href="/api/media/cv" target="_blank">{isAr ? "عرض الحالية ↗" : "View current ↗"}</a></div></div></div></Card><aside className="github-note"><strong>{isAr ? "تخزين مجاني على GitHub" : "Free GitHub storage"}</strong><p>{isAr ? "رفع الملفات يتم من السيرفر باستخدام صلاحية محدودة للمستودع، ولا يظهر التوكن داخل المتصفح." : "Files are uploaded securely from the server using limited repository access. The token is never exposed in the browser."}</p></aside></div>}
    </section>
  </main>;
}

function Card({ title, text, children }: { title: string; text: string; children: React.ReactNode }) { return <article className="editor-card"><header><h2>{title}</h2><p>{text}</p></header>{children}</article>; }
function Field({ label, wide, children }: { label: string; wide?: boolean; children: React.ReactNode }) { return <label className={wide ? "field wide" : "field"}><span>{label}</span>{children}</label>; }
function Quick({ title, value, action, onClick }: { title: string; value: string; action: string; onClick: () => void }) { return <article className="quick"><span>{title}</span><strong>{value}</strong><button onClick={onClick}>{action}</button></article>; }
