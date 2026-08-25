"use client";

import { useEffect, useRef, useState } from "react";
import { defaultContacts, defaultData, normalizePortfolio, type ContactItem, type Lang, type PortfolioData } from "../lib/portfolio-data";
import "./admin.css";
import "./login.css";

type Tab = "home" | "general" | "profile" | "skills" | "experience" | "project" | "education" | "contact" | "files";

const names: Record<Lang, Record<Tab, string>> = {
  en: { home: "Dashboard", general: "General", profile: "About", skills: "Skills", experience: "Experience", project: "Projects", education: "Education", contact: "Contact", files: "Photo & CV" },
  ar: { home: "الرئيسية", general: "الإعدادات العامة", profile: "النبذة", skills: "المهارات", experience: "الخبرة", project: "المشاريع", education: "التعليم", contact: "التواصل", files: "الصورة والسيرة" },
};

export default function AdminEditor() {
  const [lang, setLang] = useState<Lang>("en");
  const [tab, setTab] = useState<Tab>("home");
  const [content, setContent] = useState<PortfolioData>(defaultData);
  const [contacts, setContacts] = useState<ContactItem[]>(defaultContacts);
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
      const normalized = normalizePortfolio(data);
      setContent(normalized.content);
      setContacts(normalized.contacts);
    }).finally(() => setLoading(false));
  }, []);

  const t = content[lang];
  const isAr = lang === "ar";
  const sectionNames = names[lang];
  const tr = (ar: string, en: string) => isAr ? ar : en;
  const notify = (text: string, type: "ok" | "error" | "busy" = "ok") => {
    setMessage(text); setMessageType(type);
    if (type !== "busy") window.setTimeout(() => setMessage(""), 4500);
  };
  const edit = (key: string, value: any) => {
    setDirty(true);
    setContent(old => ({ ...old, [lang]: { ...old[lang], [key]: value } }));
  };
  const updateList = (key: string, index: number, value: any) => {
    const list = [...((t as any)[key] || [])]; list[index] = value; edit(key, list);
  };
  const addList = (key: string, value: any) => edit(key, [...((t as any)[key] || []), value]);
  const removeList = (key: string, index: number) => edit(key, ((t as any)[key] || []).filter((_: any, i: number) => i !== index));
  const moveList = (key: string, index: number, direction: -1 | 1) => {
    const list = [...((t as any)[key] || [])];
    const target = index + direction;
    if (target < 0 || target >= list.length) return;
    [list[index], list[target]] = [list[target], list[index]]; edit(key, list);
  };
  const editContact = (index: number, patch: Partial<ContactItem>) => {
    setDirty(true); setContacts(old => old.map((item, i) => i === index ? { ...item, ...patch } : item));
  };
  const addContact = () => {
    setDirty(true); setContacts(old => [...old, { id: `contact-${Date.now()}`, kind: "link", labelEn: "New link", labelAr: "رابط جديد", value: "https://" }]);
  };
  const removeContact = (index: number) => { setDirty(true); setContacts(old => old.filter((_, i) => i !== index)); };
  const moveContact = (index: number, direction: -1 | 1) => {
    setContacts(old => { const list = [...old]; const target = index + direction; if (target < 0 || target >= list.length) return old; [list[index], list[target]] = [list[target], list[index]]; setDirty(true); return list; });
  };

  const login = async (event: React.FormEvent) => {
    event.preventDefault(); setMessage(tr("جاري تسجيل الدخول...", "Signing in..."));
    const response = await fetch("/api/admin/session", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ password }) });
    if (response.ok) { setAuthed(true); setPassword(""); setMessage(""); }
    else setMessage(tr("كلمة المرور غير صحيحة", "Incorrect password"));
  };
  const logout = async () => { await fetch("/api/admin/session", { method: "DELETE" }); setAuthed(false); };
  const save = async () => {
    notify(tr("جاري حفظ التعديلات...", "Saving changes..."), "busy");
    const response = await fetch("/api/content", { method: "PUT", headers: { "content-type": "application/json" }, body: JSON.stringify({ content, contacts }) });
    if (response.status === 401) return setAuthed(false);
    if (response.ok) { setDirty(false); notify(tr("تم الحفظ والنشر بنجاح", "Changes saved and published successfully")); }
    else notify(tr("تعذر الحفظ، حاول مرة أخرى", "Could not save changes. Please try again."), "error");
  };
  const upload = async (kind: "photo" | "cv", file?: File) => {
    if (!file) return;
    const isPhoto = kind === "photo";
    const allowed = isPhoto ? ["image/jpeg", "image/png", "image/webp"] : ["application/pdf"];
    if (!allowed.includes(file.type)) return notify(tr(isPhoto ? "اختر صورة JPG أو PNG أو WebP" : "اختر ملف PDF", isPhoto ? "Choose a JPG, PNG, or WebP image" : "Choose a PDF file"), "error");
    if (file.size > 900_000) return notify(tr("حجم الملف يجب ألا يتجاوز 900KB", "File size must not exceed 900KB"), "error");
    setUploading(kind); notify(tr(isPhoto ? "جاري رفع الصورة..." : "جاري رفع السيرة...", isPhoto ? "Uploading photo..." : "Uploading CV..."), "busy");
    const response = await fetch(`/api/media/${kind}`, { method: "PUT", headers: { "content-type": file.type, "content-length": String(file.size) }, body: file });
    setUploading(null);
    if (response.status === 401) return setAuthed(false);
    const data = await response.json().catch(() => ({}));
    if (!response.ok) return notify(data.error || tr("تعذر رفع الملف", "Could not upload the file"), "error");
    if (isPhoto) setPhotoVersion(Date.now());
    notify(tr(isPhoto ? "تم تحديث الصورة بنجاح" : "تم تحديث السيرة الذاتية بنجاح", isPhoto ? "Photo updated successfully" : "CV updated successfully"));
  };

  if (loading) return <main className="admin-loading">{tr("جاري تحميل لوحة التحكم...", "Loading dashboard...")}</main>;
  if (!authed) return <main className="admin-login" dir={isAr ? "rtl" : "ltr"}><form onSubmit={login}><a className="admin-logo" href="/">MS</a><h1>{tr("لوحة التحكم", "Dashboard")}</h1><p>{tr("أدخل كلمة المرور الخاصة بإدارة الموقع.", "Enter your password to manage the website.")}</p><input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder={tr("كلمة المرور", "Password")} required autoFocus/><button>{tr("تسجيل الدخول", "Sign in")}</button>{message && <span>{message}</span>}</form></main>;

  const menu = (key: Tab, icon: string) => <button className={tab === key ? "active" : ""} onClick={() => setTab(key)}><i>{icon}</i><span>{sectionNames[key]}</span></button>;
  const actions = (key: string, index: number, count: number) => <ItemActions isAr={isAr} index={index} count={count} onUp={() => moveList(key, index, -1)} onDown={() => moveList(key, index, 1)} onRemove={() => removeList(key, index)}/>;

  return <main className={`admin-shell ${lang === "en" ? "lang-en" : ""}`} dir={isAr ? "rtl" : "ltr"}>
    <aside>
      <div className="admin-brand"><a className="admin-logo" href="/">MS</a><div><strong>Mohammed Saber</strong><small>{tr("إدارة البورتفوليو", "Portfolio Manager")}</small></div></div>
      <nav>{menu("home", "⌂")}{menu("general", "⚙")}{menu("profile", "◉")}{menu("skills", "✦")}{menu("experience", "▣")}{menu("project", "◇")}{menu("education", "▤")}{menu("contact", "@")}{menu("files", "▧")}</nav>
      <div className="aside-footer"><a href="/" target="_blank">{tr("فتح الموقع ↗", "Open website ↗")}</a><button onClick={logout}>{tr("تسجيل الخروج", "Sign out")}</button></div>
    </aside>

    <section className="admin-workspace">
      <header className="admin-topbar"><div><p>{tr("لوحة التحكم", "Dashboard")} / {sectionNames[tab]}</p><h1>{sectionNames[tab]}</h1></div><div className="top-actions"><span className={dirty ? "dirty" : "saved"}>{dirty ? tr("تعديلات غير محفوظة", "Unsaved changes") : tr("محفوظ", "Saved")}</span><a href="/" target="_blank">{tr("معاينة", "Preview")}</a><button onClick={save} disabled={!dirty}>{tr("حفظ ونشر", "Save & Publish")}</button></div></header>
      {message && <div className={`notice ${messageType}`}>{messageType === "busy" && <i/>}{message}</div>}
      {tab !== "files" && tab !== "home" && <div className="editor-toolbar"><div><button className={lang === "ar" ? "active" : ""} onClick={() => setLang("ar")}>العربية</button><button className={lang === "en" ? "active" : ""} onClick={() => setLang("en")}>English</button></div><span>{tr("تعديل النسخة العربية", "Editing the English version")}</span></div>}

      {tab === "home" && <div className="dashboard-grid"><article className="welcome"><div><small>{tr("مرحبًا محمد", "Welcome, Mohammed")}</small><h2>{tr("كل محتوى موقعك قابل للتعديل", "Your complete portfolio editor")}</h2><p>{tr("عدّل النصوص، وأضف أو احذف الخبرات والمشاريع والمهارات ووسائل التواصل.", "Edit every field and add, remove, or reorder experience, projects, skills, education, and contact links.")}</p><button onClick={() => setTab("general")}>{tr("ابدأ التعديل", "Start editing")}</button></div><strong>MS</strong></article><Quick title={tr("الخبرات", "Experience entries")} value={String(t.experiences.length)} action={tr("إدارة", "Manage")} onClick={() => setTab("experience")}/><Quick title={tr("المشاريع", "Projects")} value={String(t.projects.length)} action={tr("إدارة", "Manage")} onClick={() => setTab("project")}/><Quick title={tr("وسائل التواصل", "Contact methods")} value={String(contacts.length)} action={tr("إدارة", "Manage")} onClick={() => setTab("contact")}/></div>}

      {tab === "general" && <>
        <Card title={tr("القسم الرئيسي", "Hero section")} text={tr("كل النصوص والأزرار التي تظهر في بداية الموقع.", "Every heading, button, and detail shown at the top of the website.")}><div className="form-grid"><Field label={tr("السطر التعريفي", "Eyebrow")} wide><input value={t.kicker} onChange={e => edit("kicker", e.target.value)}/></Field><Field label={tr("العنوان الرئيسي", "Main title")} wide><textarea rows={3} value={t.title} onChange={e => edit("title", e.target.value)}/></Field><Field label={tr("المقدمة", "Introduction")} wide><textarea rows={4} value={t.intro} onChange={e => edit("intro", e.target.value)}/></Field><Field label={tr("زر التواصل", "Contact button")}><input value={t.cta} onChange={e => edit("cta", e.target.value)}/></Field><Field label={tr("زر السيرة", "CV button")}><input value={t.cv} onChange={e => edit("cv", e.target.value)}/></Field><Field label={tr("الموقع", "Location")}><input value={t.loc} onChange={e => edit("loc", e.target.value)}/></Field><Field label={tr("حالة التوفر", "Availability text")}><input value={t.availability} onChange={e => edit("availability", e.target.value)}/></Field></div></Card>
        <Card title={tr("قائمة الموقع", "Navigation menu")} text={tr("عدّل أسماء الروابط الستة في الهيدر.", "Edit the six navigation labels in the header.")}><div className="repeater">{t.nav.slice(0, 6).map((item, i) => <div className="repeat-row compact" key={i}><b>{i + 1}</b><input value={item} onChange={e => { const list = [...t.nav]; list[i] = e.target.value; edit("nav", list); }}/></div>)}</div></Card>
        <Card title={tr("عناوين الأقسام الصغيرة", "Section labels")} text={tr("النص الصغير المرقم أعلى كل قسم.", "The small numbered label above each section.")}><div className="repeater">{t.sectionLabels.slice(0, 6).map((item, i) => <div className="repeat-row compact" key={i}><b>{i + 1}</b><input value={item} onChange={e => { const list = [...t.sectionLabels]; list[i] = e.target.value; edit("sectionLabels", list); }}/></div>)}</div></Card>
        <Card title={tr("تذييل الموقع", "Footer")} text={tr("النص الموجود في أسفل الموقع.", "Text shown at the bottom of the website.")}><Field label={tr("نص التذييل", "Footer text")} wide><input value={t.footer} onChange={e => edit("footer", e.target.value)}/></Field></Card>
      </>}

      {tab === "profile" && <>
        <Card title={tr("النبذة", "About section")} text={tr("العنوان والوصف التعريفي.", "About heading and description.")}><div className="form-grid"><Field label={tr("عنوان النبذة", "About heading")} wide><input value={t.aboutTitle} onChange={e => edit("aboutTitle", e.target.value)}/></Field><Field label={tr("النص التعريفي", "About text")} wide><textarea rows={6} value={t.about} onChange={e => edit("about", e.target.value)}/></Field></div></Card>
        <Card title={tr("الإحصائيات", "Statistics")} text={tr("أضف أو احذف أو غيّر ترتيب الأرقام المختصرة.", "Add, remove, or reorder the summary statistics.")}><div className="collection-toolbar"><button className="add-item" onClick={() => addList("stats", ["0", tr("وصف جديد", "New statistic")])}>＋ {tr("إضافة إحصائية", "Add statistic")}</button></div><div className="repeater">{t.stats.map((item, i) => <div className="repeat-row with-actions" key={i}><b>{i + 1}</b><input value={item[0]} onChange={e => updateList("stats", i, [e.target.value, item[1]])}/><input value={item[1]} onChange={e => updateList("stats", i, [item[0], e.target.value])}/>{actions("stats", i, t.stats.length)}</div>)}</div></Card>
      </>}

      {tab === "skills" && <Card title={tr("المهارات", "Skills")} text={tr("عدّل عنوان القسم وأضف أي عدد من مجموعات المهارات.", "Edit the section heading and manage any number of skill groups.")}><Field label={tr("عنوان القسم", "Section heading")} wide><input value={t.skillsTitle} onChange={e => edit("skillsTitle", e.target.value)}/></Field><div className="collection-toolbar"><button className="add-item" onClick={() => addList("skills", [tr("مهارة جديدة", "New skill"), tr("وصف المهارة", "Skill description")])}>＋ {tr("إضافة مهارة", "Add skill")}</button></div><div className="repeater">{t.skills.map((item, i) => <div className="repeat-row with-actions" key={i}><b>{i + 1}</b><input value={item[0]} onChange={e => updateList("skills", i, [e.target.value, item[1]])}/><textarea rows={2} value={item[1]} onChange={e => updateList("skills", i, [item[0], e.target.value])}/>{actions("skills", i, t.skills.length)}</div>)}</div></Card>}

      {tab === "experience" && <Card title={tr("الخبرات العملية", "Work experience")} text={tr("يمكنك إضافة وظائف متعددة ونقاط مسؤوليات لكل وظيفة.", "Add multiple roles and manage the responsibilities for each one.")}><Field label={tr("عنوان القسم", "Section heading")} wide><input value={t.expTitle} onChange={e => edit("expTitle", e.target.value)}/></Field><div className="collection-toolbar"><button className="add-item" onClick={() => addList("experiences", { role: tr("مسمى وظيفي جديد", "New job title"), company: tr("اسم الشركة", "Company name"), period: tr("الفترة", "Period"), bullets: [] })}>＋ {tr("إضافة خبرة", "Add experience")}</button></div><div className="collection-list">{t.experiences.map((item, i) => <article className="collection-item" key={i}><div className="collection-head"><strong>{tr(`خبرة ${i + 1}`, `Experience ${i + 1}`)}</strong>{actions("experiences", i, t.experiences.length)}</div><div className="form-grid"><Field label={tr("المسمى الوظيفي", "Job title")}><input value={item.role} onChange={e => updateList("experiences", i, { ...item, role: e.target.value })}/></Field><Field label={tr("الشركة", "Company")}><input value={item.company} onChange={e => updateList("experiences", i, { ...item, company: e.target.value })}/></Field><Field label={tr("الفترة", "Period")} wide><input value={item.period} onChange={e => updateList("experiences", i, { ...item, period: e.target.value })}/></Field></div><h3 className="subheading">{tr("نقاط الخبرة", "Experience highlights")}</h3><div className="repeater">{item.bullets.map((bullet, j) => <div className="repeat-row bullet-row" key={j}><b>{j + 1}</b><textarea rows={2} value={bullet} onChange={e => { const bullets = [...item.bullets]; bullets[j] = e.target.value; updateList("experiences", i, { ...item, bullets }); }}/><button className="remove-line" onClick={() => updateList("experiences", i, { ...item, bullets: item.bullets.filter((_, x) => x !== j) })}>×</button></div>)}</div><button className="add-line" onClick={() => updateList("experiences", i, { ...item, bullets: [...item.bullets, tr("مسؤولية جديدة", "New responsibility")] })}>＋ {tr("إضافة نقطة", "Add highlight")}</button></article>)}</div></Card>}

      {tab === "project" && <Card title={tr("المشاريع", "Projects")} text={tr("أضف مشاريع متعددة مع وصف وكلمات مفتاحية.", "Add multiple projects with descriptions and tags.")}><Field label={tr("عنوان القسم", "Section heading")} wide><input value={t.projectTitle} onChange={e => edit("projectTitle", e.target.value)}/></Field><div className="collection-toolbar"><button className="add-item" onClick={() => addList("projects", { name: tr("مشروع جديد", "New project"), description: tr("وصف المشروع", "Project description"), tags: [] })}>＋ {tr("إضافة مشروع", "Add project")}</button></div><div className="collection-list">{t.projects.map((item, i) => <article className="collection-item" key={i}><div className="collection-head"><strong>{tr(`مشروع ${i + 1}`, `Project ${i + 1}`)}</strong>{actions("projects", i, t.projects.length)}</div><div className="form-grid"><Field label={tr("اسم المشروع", "Project name")} wide><input value={item.name} onChange={e => updateList("projects", i, { ...item, name: e.target.value })}/></Field><Field label={tr("الوصف", "Description")} wide><textarea rows={5} value={item.description} onChange={e => updateList("projects", i, { ...item, description: e.target.value })}/></Field><Field label={tr("الكلمات المفتاحية — افصل بفاصلة", "Tags — separate with commas")} wide><input value={item.tags.join(", ")} onChange={e => updateList("projects", i, { ...item, tags: e.target.value.split(",").map(x => x.trim()).filter(Boolean) })}/></Field></div></article>)}</div></Card>}

      {tab === "education" && <Card title={tr("التعليم", "Education")} text={tr("أضف شهادات ومؤهلات متعددة.", "Add multiple degrees and qualifications.")}><Field label={tr("عنوان القسم", "Section heading")} wide><input value={t.eduTitle} onChange={e => edit("eduTitle", e.target.value)}/></Field><div className="collection-toolbar"><button className="add-item" onClick={() => addList("education", { degree: tr("مؤهل جديد", "New qualification"), school: tr("الجهة التعليمية", "Institution"), year: tr("سنة التخرج", "Graduation year"), badge: String(new Date().getFullYear()) })}>＋ {tr("إضافة مؤهل", "Add education")}</button></div><div className="collection-list">{t.education.map((item, i) => <article className="collection-item" key={i}><div className="collection-head"><strong>{tr(`مؤهل ${i + 1}`, `Education ${i + 1}`)}</strong>{actions("education", i, t.education.length)}</div><div className="form-grid"><Field label={tr("الدرجة أو الشهادة", "Degree or certificate")}><input value={item.degree} onChange={e => updateList("education", i, { ...item, degree: e.target.value })}/></Field><Field label={tr("الجامعة أو الجهة", "University or institution")}><input value={item.school} onChange={e => updateList("education", i, { ...item, school: e.target.value })}/></Field><Field label={tr("الفترة أو سنة التخرج", "Period or graduation year")}><input value={item.year} onChange={e => updateList("education", i, { ...item, year: e.target.value })}/></Field><Field label={tr("الرقم المختصر", "Year badge")}><input value={item.badge} onChange={e => updateList("education", i, { ...item, badge: e.target.value })}/></Field></div></article>)}</div></Card>}

      {tab === "contact" && <><Card title={tr("قسم التواصل", "Contact section")} text={tr("العنوان والوصف الظاهرين في نهاية الموقع.", "Heading and description shown at the end of the website.")}><div className="form-grid"><Field label={tr("العنوان", "Heading")} wide><input value={t.contactTitle} onChange={e => edit("contactTitle", e.target.value)}/></Field><Field label={tr("الوصف", "Description")} wide><textarea rows={4} value={t.contactText} onChange={e => edit("contactText", e.target.value)}/></Field></div></Card><Card title={tr("وسائل التواصل", "Contact methods")} text={tr("القائمة مشتركة بين اللغتين، ويمكن تغيير اسم كل زر بالعربية والإنجليزية.", "Shared between both languages, with a separate Arabic and English label for each button.")}><div className="collection-toolbar"><button className="add-item" onClick={addContact}>＋ {tr("إضافة وسيلة تواصل", "Add contact method")}</button></div><div className="collection-list">{contacts.map((item, i) => <article className="collection-item" key={item.id}><div className="collection-head"><strong>{tr(`وسيلة ${i + 1}`, `Contact ${i + 1}`)}</strong><ItemActions isAr={isAr} index={i} count={contacts.length} onUp={() => moveContact(i, -1)} onDown={() => moveContact(i, 1)} onRemove={() => removeContact(i)}/></div><div className="form-grid"><Field label={tr("النوع", "Type")}><select value={item.kind} onChange={e => editContact(i, { kind: e.target.value as ContactItem["kind"] })}><option value="whatsapp">WhatsApp</option><option value="email">Email</option><option value="link">Link</option></select></Field><Field label={tr("القيمة أو الرابط", "Value or URL")}><input value={item.value} onChange={e => editContact(i, { value: e.target.value })}/></Field><Field label={tr("الاسم بالعربية", "Arabic label")}><input dir="rtl" value={item.labelAr} onChange={e => editContact(i, { labelAr: e.target.value })}/></Field><Field label={tr("الاسم بالإنجليزية", "English label")}><input dir="ltr" value={item.labelEn} onChange={e => editContact(i, { labelEn: e.target.value })}/></Field></div></article>)}</div></Card></>}

      {tab === "files" && <div className="media-grid"><Card title={tr("الصورة الشخصية", "Profile photo")} text={tr("JPG أو PNG أو WebP، بحد أقصى 900KB.", "JPG, PNG, or WebP, up to 900KB.")}><div className="photo-manager"><img src={`/api/media/photo?v=${photoVersion}`} onError={e => { e.currentTarget.onerror = null; e.currentTarget.src = "/mohammed-saber.jpg"; }} alt={tr("الصورة الحالية", "Current profile photo")}/><div><strong>{tr("الصورة الحالية", "Current photo")}</strong><p>{tr("يفضل استخدام صورة عمودية واضحة.", "A clear portrait photo is recommended.")}</p><input ref={photoInput} hidden type="file" accept="image/jpeg,image/png,image/webp" onChange={e => upload("photo", e.target.files?.[0])}/><button onClick={() => photoInput.current?.click()} disabled={uploading === "photo"}>{uploading === "photo" ? tr("جاري الرفع...", "Uploading...") : tr("اختيار صورة جديدة", "Choose new photo")}</button></div></div></Card><Card title={tr("السيرة الذاتية", "Curriculum Vitae")} text={tr("PDF بحد أقصى 900KB.", "PDF, up to 900KB.")}><div className="cv-manager"><i>PDF</i><div><strong>Mohammed Saber CV</strong><p>{tr("الملف الجديد سيستبدل النسخة الحالية.", "The new file will replace the current version.")}</p><input ref={cvInput} hidden type="file" accept="application/pdf" onChange={e => upload("cv", e.target.files?.[0])}/><div><button onClick={() => cvInput.current?.click()} disabled={uploading === "cv"}>{uploading === "cv" ? tr("جاري الرفع...", "Uploading...") : tr("رفع نسخة جديدة", "Upload new CV")}</button><a href="/api/media/cv" target="_blank">{tr("عرض الحالية ↗", "View current ↗")}</a></div></div></div></Card></div>}
    </section>
  </main>;
}

function Card({ title, text, children }: { title: string; text: string; children: React.ReactNode }) { return <article className="editor-card"><header><h2>{title}</h2><p>{text}</p></header>{children}</article>; }
function Field({ label, wide, children }: { label: string; wide?: boolean; children: React.ReactNode }) { return <label className={wide ? "field wide" : "field"}><span>{label}</span>{children}</label>; }
function Quick({ title, value, action, onClick }: { title: string; value: string; action: string; onClick: () => void }) { return <article className="quick"><span>{title}</span><strong>{value}</strong><button onClick={onClick}>{action}</button></article>; }
function ItemActions({ isAr, index, count, onUp, onDown, onRemove }: { isAr: boolean; index: number; count: number; onUp: () => void; onDown: () => void; onRemove: () => void }) { return <div className="item-actions"><button onClick={onUp} disabled={index === 0} title={isAr ? "تحريك لأعلى" : "Move up"}>↑</button><button onClick={onDown} disabled={index === count - 1} title={isAr ? "تحريك لأسفل" : "Move down"}>↓</button><button className="danger" onClick={onRemove} title={isAr ? "حذف" : "Delete"}>×</button></div>; }
