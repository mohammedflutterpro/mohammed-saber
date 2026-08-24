import { a as require_react, o as __toESM, t as require_jsx_runtime } from "../index.js";
import { defaultData } from "./page-6OPkhSvo.js";
//#region app/admin/admin.css
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
//#endregion
//#region app/admin/AdminEditor.tsx
var import_jsx_runtime = require_jsx_runtime();
var fields = [
	[
		"title",
		"العنوان الرئيسي",
		"Main title"
	],
	[
		"intro",
		"النبذة الرئيسية",
		"Main introduction"
	],
	[
		"aboutTitle",
		"عنوان النبذة",
		"About heading"
	],
	[
		"about",
		"النص التعريفي",
		"About text"
	],
	[
		"role",
		"المسمى الوظيفي",
		"Job title"
	],
	[
		"company",
		"الشركة",
		"Company"
	],
	[
		"period",
		"الفترة",
		"Period"
	],
	[
		"projectName",
		"اسم المشروع",
		"Project name"
	],
	[
		"project",
		"تفاصيل المشروع",
		"Project details"
	],
	[
		"degree",
		"الدرجة الجامعية",
		"Degree"
	],
	[
		"school",
		"الجامعة",
		"University"
	],
	[
		"contactTitle",
		"عنوان التواصل",
		"Contact heading"
	],
	[
		"contactText",
		"نص التواصل",
		"Contact text"
	]
];
function AdminEditor() {
	const [lang, setLang] = (0, import_react.useState)("ar"), [content, setContent] = (0, import_react.useState)(defaultData), [links, setLinks] = (0, import_react.useState)({
		whatsapp: "966510565165",
		email: "mohammed.saber.dev@gmail.com",
		linkedin: "https://linkedin.com/in/mohammed-saber-it"
	}), [status, setStatus] = (0, import_react.useState)(""), [loading, setLoading] = (0, import_react.useState)(true), [authed, setAuthed] = (0, import_react.useState)(false), [password, setPassword] = (0, import_react.useState)("");
	(0, import_react.useEffect)(() => {
		fetch("/api/admin/session").then((r) => setAuthed(r.ok));
		fetch("/api/content").then((r) => r.json()).then((x) => {
			if (x?.content) {
				setContent(x.content);
				if (x.links) setLinks(x.links);
			}
		}).finally(() => setLoading(false));
	}, []);
	const set = (key, value) => setContent((old) => ({
		...old,
		[lang]: {
			...old[lang],
			[key]: value
		}
	}));
	const login = async (e) => {
		e.preventDefault();
		setStatus("جاري تسجيل الدخول...");
		if ((await fetch("/api/admin/session", {
			method: "POST",
			headers: { "content-type": "application/json" },
			body: JSON.stringify({ password })
		})).ok) {
			setAuthed(true);
			setPassword("");
			setStatus("");
		} else setStatus("كلمة المرور غير صحيحة");
	};
	const logout = async () => {
		await fetch("/api/admin/session", { method: "DELETE" });
		setAuthed(false);
	};
	const save = async () => {
		setStatus("جاري الحفظ...");
		const r = await fetch("/api/content", {
			method: "PUT",
			headers: { "content-type": "application/json" },
			body: JSON.stringify({
				content,
				links
			})
		});
		if (r.status === 401) setAuthed(false);
		setStatus(r.ok ? "تم حفظ التعديلات ونشرها بنجاح ✓" : "تعذر الحفظ، حاول مرة أخرى");
	};
	if (loading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
		className: "admin-loading",
		children: "جاري تحميل الداشبورد..."
	});
	if (!authed) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
		className: "admin-login",
		dir: "rtl",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			onSubmit: login,
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
					className: "admin-logo",
					href: "/",
					children: "MS"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", { children: "لوحة التحكم" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "أدخل كلمة المرور الخاصة بإدارة الموقع." }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					type: "password",
					value: password,
					onChange: (e) => setPassword(e.target.value),
					placeholder: "كلمة المرور",
					required: true
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { children: "تسجيل الدخول" }),
				status && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: status })
			]
		})
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "admin-shell",
		dir: "rtl",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
				className: "admin-logo",
				href: "/",
				children: "MS"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "لوحة التحكم" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "تعديل محتوى البورتفوليو" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				className: "active",
				children: "المحتوى"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
				href: "/",
				target: "_blank",
				children: "معاينة الموقع ↗"
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				className: "signout",
				onClick: logout,
				children: "تسجيل الخروج"
			})
		] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", { children: "محتوى الموقع" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "عدّل البيانات ثم اضغط حفظ ونشر." })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				className: "save",
				onClick: save,
				children: "حفظ ونشر"
			})] }),
			status && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "notice",
				children: status
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "lang-tabs",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					className: lang === "ar" ? "active" : "",
					onClick: () => setLang("ar"),
					children: "العربية"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					className: lang === "en" ? "active" : "",
					onClick: () => setLang("en"),
					children: "English"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "panel",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { children: "النصوص الأساسية" }), fields.map(([key, ar, en]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: lang === "ar" ? ar : en }), [
					"intro",
					"about",
					"project",
					"contactText"
				].includes(key) ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
					rows: 4,
					value: content[lang][key],
					onChange: (e) => set(key, e.target.value)
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					value: content[lang][key],
					onChange: (e) => set(key, e.target.value)
				})] }, key))]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "panel",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { children: lang === "ar" ? "المهارات" : "Skills" }), content[lang].skills.map((s, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "pair",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						value: s[0],
						onChange: (e) => {
							const a = [...content[lang].skills];
							a[i] = [e.target.value, a[i][1]];
							set("skills", a);
						}
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
						rows: 2,
						value: s[1],
						onChange: (e) => {
							const a = [...content[lang].skills];
							a[i] = [a[i][0], e.target.value];
							set("skills", a);
						}
					})]
				}, i))]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "panel",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { children: lang === "ar" ? "نقاط الخبرة" : "Experience points" }), content[lang].bullets.map((x, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
					rows: 2,
					value: x,
					onChange: (e) => {
						const a = [...content[lang].bullets];
						a[i] = e.target.value;
						set("bullets", a);
					}
				}, i))]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "panel",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { children: "بيانات التواصل" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "واتساب" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						value: links.whatsapp,
						onChange: (e) => setLinks({
							...links,
							whatsapp: e.target.value
						})
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "البريد الإلكتروني" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						value: links.email,
						onChange: (e) => setLinks({
							...links,
							email: e.target.value
						})
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "LinkedIn" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						value: links.linkedin,
						onChange: (e) => setLinks({
							...links,
							linkedin: e.target.value
						})
					})] })
				]
			})
		] })]
	});
}
//#endregion
export { AdminEditor as default };
