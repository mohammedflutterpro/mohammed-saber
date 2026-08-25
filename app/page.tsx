"use client";

import { useEffect, useState } from "react";
import { contactHref, defaultContacts, defaultData, normalizePortfolio, type ContactItem, type PortfolioData } from "./lib/portfolio-data";

const ids = ["about", "skills", "experience", "project", "education", "contact"];

export default function Home() {
  const [lang, setLang] = useState<"en" | "ar">("en");
  const [content, setContent] = useState<PortfolioData>(defaultData);
  const [contacts, setContacts] = useState<ContactItem[]>(defaultContacts);

  useEffect(() => {
    fetch("/api/content").then(r => r.json()).then(data => {
      const normalized = normalizePortfolio(data);
      setContent(normalized.content);
      setContacts(normalized.contacts);
    }).catch(() => {});

    try {
      if (!sessionStorage.getItem("portfolio_visit_counted")) {
        sessionStorage.setItem("portfolio_visit_counted", "1");
        const source = new URLSearchParams(location.search).get("utm_source") || document.referrer;
        fetch("/api/analytics/visit", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ source }), keepalive: true }).catch(() => {
          sessionStorage.removeItem("portfolio_visit_counted");
        });
      }
    } catch {
      const source = new URLSearchParams(location.search).get("utm_source") || document.referrer;
      fetch("/api/analytics/visit", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ source }), keepalive: true }).catch(() => {});
    }
  }, []);

  const t = content[lang];
  const rtl = lang === "ar";
  return <main dir={rtl ? "rtl" : "ltr"} className={rtl ? "rtl" : ""}>
    <header>
      <a className="brand" href="#top"><i>MS</i> Mohammed Saber</a>
      <nav>{t.nav.slice(0, ids.length).map((label, i) => <a key={`${label}-${i}`} href={`#${ids[i]}`}>{label}</a>)}</nav>
      <button onClick={() => setLang(rtl ? "en" : "ar")}>{rtl ? "EN" : "عربي"}</button>
    </header>

    <section id="top" className="wrap hero">
      <div><p className="eyebrow">{t.kicker}</p><h1>{t.title}</h1><p className="lead">{t.intro}</p><div className="actions"><a className="primary" href="#contact">{t.cta}</a><a className="secondary" href="/api/media/cv" download>{t.cv} ↓</a></div><small>⌖ {t.loc}</small></div>
      <div className="portrait"><span/><img src="/api/media/photo" onError={e => { e.currentTarget.onerror = null; e.currentTarget.src = "/mohammed-saber.jpg"; }} alt="Mohammed Saber"/><b>● {t.availability}</b></div>
    </section>

    <section id="about" className="wrap split">
      <div><p className="label">{t.sectionLabels[0]}</p><h2>{t.aboutTitle}</h2></div>
      <div><p className="copy">{t.about}</p><div className="stats">{t.stats.map(([number, label], i) => <div key={`${label}-${i}`}><strong>{number}</strong><small>{label}</small></div>)}</div></div>
    </section>

    <section id="skills" className="wrap">
      <p className="label">{t.sectionLabels[1]}</p><h2>{t.skillsTitle}</h2>
      <div className="skills">{t.skills.map(([name, description], i) => <article key={`${name}-${i}`}><b>{String(i + 1).padStart(2, "0")}</b><h3>{name}</h3><p>{description}</p></article>)}</div>
    </section>

    <section id="experience" className="wrap">
      <p className="label">{t.sectionLabels[2]}</p><h2>{t.expTitle}</h2>
      <div className="experience-list">{t.experiences.map((item, i) => <article className="experience" key={`${item.company}-${i}`}><div><div><h3>{item.role}</h3><p>{item.company}</p></div><span>{item.period}</span></div><ul>{item.bullets.map((bullet, j) => <li key={`${bullet}-${j}`}>{bullet}</li>)}</ul></article>)}</div>
    </section>

    <section id="project" className="dark"><div className="wrap split">
      <div><p className="label">{t.sectionLabels[3]}</p><h2>{t.projectTitle}</h2></div>
      <div className="project-list">{t.projects.map((item, i) => <article className="project" key={`${item.name}-${i}`}><i>{String(i + 1).padStart(2, "0")}</i><h3>{item.name}</h3><p>{item.description}</p><div>{item.tags.map((tag, j) => <span key={`${tag}-${j}`}>{tag}</span>)}</div></article>)}</div>
    </div></section>

    <section id="education" className="wrap">
      <p className="label">{t.sectionLabels[4]}</p><h2>{t.eduTitle}</h2>
      <div className="education-list">{t.education.map((item, i) => <article className="education" key={`${item.school}-${i}`}><span>{item.badge}</span><div><h3>{item.degree}</h3><p>{item.school}</p></div><b>{item.year}</b></article>)}</div>
    </section>

    <section id="contact" className="dark contact"><div className="wrap">
      <p className="label">{t.sectionLabels[5]}</p><h2>{t.contactTitle}</h2><p>{t.contactText}</p>
      <div>{contacts.map(item => <a key={item.id} href={contactHref(item)} target={item.kind === "email" ? undefined : "_blank"}>{rtl ? item.labelAr : item.labelEn} ↗</a>)}</div>
    </div></section>
    <footer><span>© 2026 Mohammed Saber</span><span>{t.footer}</span></footer>
  </main>;
}
