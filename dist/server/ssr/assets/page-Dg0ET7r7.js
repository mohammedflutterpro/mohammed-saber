import { a as require_react, o as __toESM, t as require_jsx_runtime } from "../index.js";
import { i as normalizePortfolio, n as defaultContacts, r as defaultData, t as contactHref } from "./portfolio-data-BBGtGP0r.js";
//#region app/page.tsx
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = require_jsx_runtime();
var ids = [
	"about",
	"skills",
	"experience",
	"project",
	"education",
	"contact"
];
function Home() {
	const [lang, setLang] = (0, import_react.useState)("en");
	const [content, setContent] = (0, import_react.useState)(defaultData);
	const [contacts, setContacts] = (0, import_react.useState)(defaultContacts);
	(0, import_react.useEffect)(() => {
		fetch("/api/content").then((r) => r.json()).then((data) => {
			const normalized = normalizePortfolio(data);
			setContent(normalized.content);
			setContacts(normalized.contacts);
		}).catch(() => {});
		try {
			if (!sessionStorage.getItem("portfolio_visit_counted")) {
				sessionStorage.setItem("portfolio_visit_counted", "1");
				const source = new URLSearchParams(location.search).get("utm_source") || document.referrer;
				fetch("/api/analytics/visit", {
					method: "POST",
					headers: { "content-type": "application/json" },
					body: JSON.stringify({ source }),
					keepalive: true
				}).catch(() => {
					sessionStorage.removeItem("portfolio_visit_counted");
				});
			}
		} catch {
			const source = new URLSearchParams(location.search).get("utm_source") || document.referrer;
			fetch("/api/analytics/visit", {
				method: "POST",
				headers: { "content-type": "application/json" },
				body: JSON.stringify({ source }),
				keepalive: true
			}).catch(() => {});
		}
	}, []);
	const t = content[lang];
	const rtl = lang === "ar";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		dir: rtl ? "rtl" : "ltr",
		className: rtl ? "rtl" : "",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
					className: "brand",
					href: "#top",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { children: "MS" }), " Mohammed Saber"]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", { children: t.nav.slice(0, ids.length).map((label, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
					href: `#${ids[i]}`,
					children: label
				}, `${label}-${i}`)) }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: () => setLang(rtl ? "en" : "ar"),
					children: rtl ? "EN" : "عربي"
				})
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				id: "top",
				className: "wrap hero",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "eyebrow",
						children: t.kicker
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", { children: t.title }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "lead",
						children: t.intro
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "actions",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							className: "primary",
							href: "#contact",
							children: t.cta
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
							className: "secondary",
							href: "/api/media/cv",
							download: true,
							children: [t.cv, " ↓"]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("small", { children: ["⌖ ", t.loc] })
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "portrait",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: "/api/media/photo",
							onError: (e) => {
								e.currentTarget.onerror = null;
								e.currentTarget.src = "/mohammed-saber.jpg";
							},
							alt: "Mohammed Saber"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("b", { children: ["● ", t.availability] })
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				id: "about",
				className: "wrap split",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "label",
					children: t.sectionLabels[0]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: t.aboutTitle })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "copy",
					children: t.about
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "stats",
					children: t.stats.map(([number, label], i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: number }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: label })] }, `${label}-${i}`))
				})] })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				id: "skills",
				className: "wrap",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "label",
						children: t.sectionLabels[1]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: t.skillsTitle }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "skills",
						children: t.skills.map(([name, description], i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: String(i + 1).padStart(2, "0") }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { children: name }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: description })
						] }, `${name}-${i}`))
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				id: "experience",
				className: "wrap",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "label",
						children: t.sectionLabels[2]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: t.expTitle }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "experience-list",
						children: t.experiences.map((item, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
							className: "experience",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { children: item.role }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: item.company })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: item.period })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", { children: item.bullets.map((bullet, j) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: bullet }, `${bullet}-${j}`)) })]
						}, `${item.company}-${i}`))
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				id: "project",
				className: "dark",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "wrap split",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "label",
						children: t.sectionLabels[3]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: t.projectTitle })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "project-list",
						children: t.projects.map((item, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
							className: "project",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { children: String(i + 1).padStart(2, "0") }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { children: item.name }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: item.description }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: item.tags.map((tag, j) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: tag }, `${tag}-${j}`)) })
							]
						}, `${item.name}-${i}`))
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				id: "education",
				className: "wrap",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "label",
						children: t.sectionLabels[4]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: t.eduTitle }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "education-list",
						children: t.education.map((item, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
							className: "education",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: item.badge }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { children: item.degree }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: item.school })] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: item.year })
							]
						}, `${item.school}-${i}`))
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				id: "contact",
				className: "dark contact",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "wrap",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "label",
							children: t.sectionLabels[5]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: t.contactTitle }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: t.contactText }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: contacts.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
							href: contactHref(item),
							target: item.kind === "email" ? void 0 : "_blank",
							children: [rtl ? item.labelAr : item.labelEn, " ↗"]
						}, item.id)) })
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("footer", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "© 2026 Mohammed Saber" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: t.footer })] })
		]
	});
}
//#endregion
export { Home as default };
