import { a as require_react, o as __toESM, t as require_jsx_runtime } from "../index.js";
import { i as normalizePortfolio, n as defaultContacts, r as defaultData } from "./portfolio-data-BBGtGP0r.js";
//#region app/admin/admin.css
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
//#endregion
//#region app/admin/AdminEditor.tsx
var import_jsx_runtime = require_jsx_runtime();
var names = {
	en: {
		home: "Dashboard",
		general: "General",
		profile: "About",
		skills: "Skills",
		experience: "Experience",
		project: "Projects",
		education: "Education",
		contact: "Contact",
		files: "Photo & CV"
	},
	ar: {
		home: "الرئيسية",
		general: "الإعدادات العامة",
		profile: "النبذة",
		skills: "المهارات",
		experience: "الخبرة",
		project: "المشاريع",
		education: "التعليم",
		contact: "التواصل",
		files: "الصورة والسيرة"
	}
};
function AdminEditor() {
	const [lang, setLang] = (0, import_react.useState)("en");
	const [tab, setTab] = (0, import_react.useState)("home");
	const [content, setContent] = (0, import_react.useState)(defaultData);
	const [contacts, setContacts] = (0, import_react.useState)(defaultContacts);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [authed, setAuthed] = (0, import_react.useState)(false);
	const [password, setPassword] = (0, import_react.useState)("");
	const [message, setMessage] = (0, import_react.useState)("");
	const [messageType, setMessageType] = (0, import_react.useState)("ok");
	const [dirty, setDirty] = (0, import_react.useState)(false);
	const [uploading, setUploading] = (0, import_react.useState)(null);
	const [photoVersion, setPhotoVersion] = (0, import_react.useState)(Date.now());
	const photoInput = (0, import_react.useRef)(null);
	const cvInput = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		fetch("/api/admin/session").then((r) => setAuthed(r.ok));
		fetch("/api/content").then((r) => r.json()).then((data) => {
			const normalized = normalizePortfolio(data);
			setContent(normalized.content);
			setContacts(normalized.contacts);
		}).finally(() => setLoading(false));
	}, []);
	const t = content[lang];
	const isAr = lang === "ar";
	const sectionNames = names[lang];
	const tr = (ar, en) => isAr ? ar : en;
	const notify = (text, type = "ok") => {
		setMessage(text);
		setMessageType(type);
		if (type !== "busy") window.setTimeout(() => setMessage(""), 4500);
	};
	const edit = (key, value) => {
		setDirty(true);
		setContent((old) => ({
			...old,
			[lang]: {
				...old[lang],
				[key]: value
			}
		}));
	};
	const updateList = (key, index, value) => {
		const list = [...t[key] || []];
		list[index] = value;
		edit(key, list);
	};
	const addList = (key, value) => edit(key, [...t[key] || [], value]);
	const removeList = (key, index) => edit(key, (t[key] || []).filter((_, i) => i !== index));
	const moveList = (key, index, direction) => {
		const list = [...t[key] || []];
		const target = index + direction;
		if (target < 0 || target >= list.length) return;
		[list[index], list[target]] = [list[target], list[index]];
		edit(key, list);
	};
	const editContact = (index, patch) => {
		setDirty(true);
		setContacts((old) => old.map((item, i) => i === index ? {
			...item,
			...patch
		} : item));
	};
	const addContact = () => {
		setDirty(true);
		setContacts((old) => [...old, {
			id: `contact-${Date.now()}`,
			kind: "link",
			labelEn: "New link",
			labelAr: "رابط جديد",
			value: "https://"
		}]);
	};
	const removeContact = (index) => {
		setDirty(true);
		setContacts((old) => old.filter((_, i) => i !== index));
	};
	const moveContact = (index, direction) => {
		setContacts((old) => {
			const list = [...old];
			const target = index + direction;
			if (target < 0 || target >= list.length) return old;
			[list[index], list[target]] = [list[target], list[index]];
			setDirty(true);
			return list;
		});
	};
	const login = async (event) => {
		event.preventDefault();
		setMessage(tr("جاري تسجيل الدخول...", "Signing in..."));
		if ((await fetch("/api/admin/session", {
			method: "POST",
			headers: { "content-type": "application/json" },
			body: JSON.stringify({ password })
		})).ok) {
			setAuthed(true);
			setPassword("");
			setMessage("");
		} else setMessage(tr("كلمة المرور غير صحيحة", "Incorrect password"));
	};
	const logout = async () => {
		await fetch("/api/admin/session", { method: "DELETE" });
		setAuthed(false);
	};
	const save = async () => {
		notify(tr("جاري حفظ التعديلات...", "Saving changes..."), "busy");
		const response = await fetch("/api/content", {
			method: "PUT",
			headers: { "content-type": "application/json" },
			body: JSON.stringify({
				content,
				contacts
			})
		});
		if (response.status === 401) return setAuthed(false);
		if (response.ok) {
			setDirty(false);
			notify(tr("تم الحفظ والنشر بنجاح", "Changes saved and published successfully"));
		} else notify(tr("تعذر الحفظ، حاول مرة أخرى", "Could not save changes. Please try again."), "error");
	};
	const upload = async (kind, file) => {
		if (!file) return;
		const isPhoto = kind === "photo";
		if (!(isPhoto ? [
			"image/jpeg",
			"image/png",
			"image/webp"
		] : ["application/pdf"]).includes(file.type)) return notify(tr(isPhoto ? "اختر صورة JPG أو PNG أو WebP" : "اختر ملف PDF", isPhoto ? "Choose a JPG, PNG, or WebP image" : "Choose a PDF file"), "error");
		if (file.size > 9e5) return notify(tr("حجم الملف يجب ألا يتجاوز 900KB", "File size must not exceed 900KB"), "error");
		setUploading(kind);
		notify(tr(isPhoto ? "جاري رفع الصورة..." : "جاري رفع السيرة...", isPhoto ? "Uploading photo..." : "Uploading CV..."), "busy");
		const response = await fetch(`/api/media/${kind}`, {
			method: "PUT",
			headers: {
				"content-type": file.type,
				"content-length": String(file.size)
			},
			body: file
		});
		setUploading(null);
		if (response.status === 401) return setAuthed(false);
		const data = await response.json().catch(() => ({}));
		if (!response.ok) return notify(data.error || tr("تعذر رفع الملف", "Could not upload the file"), "error");
		if (isPhoto) setPhotoVersion(Date.now());
		notify(tr(isPhoto ? "تم تحديث الصورة بنجاح" : "تم تحديث السيرة الذاتية بنجاح", isPhoto ? "Photo updated successfully" : "CV updated successfully"));
	};
	if (loading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
		className: "admin-loading",
		children: tr("جاري تحميل لوحة التحكم...", "Loading dashboard...")
	});
	if (!authed) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
		className: "admin-login",
		dir: isAr ? "rtl" : "ltr",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			onSubmit: login,
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
					className: "admin-logo",
					href: "/",
					children: "MS"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", { children: tr("لوحة التحكم", "Dashboard") }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: tr("أدخل كلمة المرور الخاصة بإدارة الموقع.", "Enter your password to manage the website.") }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					type: "password",
					value: password,
					onChange: (e) => setPassword(e.target.value),
					placeholder: tr("كلمة المرور", "Password"),
					required: true,
					autoFocus: true
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { children: tr("تسجيل الدخول", "Sign in") }),
				message && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: message })
			]
		})
	});
	const menu = (key, icon) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		className: tab === key ? "active" : "",
		onClick: () => setTab(key),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { children: icon }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: sectionNames[key] })]
	});
	const actions = (key, index, count) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ItemActions, {
		isAr,
		index,
		count,
		onUp: () => moveList(key, index, -1),
		onDown: () => moveList(key, index, 1),
		onRemove: () => removeList(key, index)
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: `admin-shell ${lang === "en" ? "lang-en" : ""}`,
		dir: isAr ? "rtl" : "ltr",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "admin-brand",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
					className: "admin-logo",
					href: "/",
					children: "MS"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Mohammed Saber" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: tr("إدارة البورتفوليو", "Portfolio Manager") })] })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", { children: [
				menu("home", "⌂"),
				menu("general", "⚙"),
				menu("profile", "◉"),
				menu("skills", "✦"),
				menu("experience", "▣"),
				menu("project", "◇"),
				menu("education", "▤"),
				menu("contact", "@"),
				menu("files", "▧")
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "aside-footer",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
					href: "/",
					target: "_blank",
					children: tr("فتح الموقع ↗", "Open website ↗")
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: logout,
					children: tr("تسجيل الخروج", "Sign out")
				})]
			})
		] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "admin-workspace",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
					className: "admin-topbar",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
						tr("لوحة التحكم", "Dashboard"),
						" / ",
						sectionNames[tab]
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", { children: sectionNames[tab] })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "top-actions",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: dirty ? "dirty" : "saved",
								children: dirty ? tr("تعديلات غير محفوظة", "Unsaved changes") : tr("محفوظ", "Saved")
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
								href: "/",
								target: "_blank",
								children: tr("معاينة", "Preview")
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: save,
								disabled: !dirty,
								children: tr("حفظ ونشر", "Save & Publish")
							})
						]
					})]
				}),
				message && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: `notice ${messageType}`,
					children: [messageType === "busy" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", {}), message]
				}),
				tab !== "files" && tab !== "home" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "editor-toolbar",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						className: lang === "ar" ? "active" : "",
						onClick: () => setLang("ar"),
						children: "العربية"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						className: lang === "en" ? "active" : "",
						onClick: () => setLang("en"),
						children: "English"
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: tr("تعديل النسخة العربية", "Editing the English version") })]
				}),
				tab === "home" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "dashboard-grid",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
							className: "welcome",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: tr("مرحبًا محمد", "Welcome, Mohammed") }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: tr("كل محتوى موقعك قابل للتعديل", "Your complete portfolio editor") }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: tr("عدّل النصوص، وأضف أو احذف الخبرات والمشاريع والمهارات ووسائل التواصل.", "Edit every field and add, remove, or reorder experience, projects, skills, education, and contact links.") }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => setTab("general"),
									children: tr("ابدأ التعديل", "Start editing")
								})
							] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "MS" })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Quick, {
							title: tr("الخبرات", "Experience entries"),
							value: String(t.experiences.length),
							action: tr("إدارة", "Manage"),
							onClick: () => setTab("experience")
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Quick, {
							title: tr("المشاريع", "Projects"),
							value: String(t.projects.length),
							action: tr("إدارة", "Manage"),
							onClick: () => setTab("project")
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Quick, {
							title: tr("وسائل التواصل", "Contact methods"),
							value: String(contacts.length),
							action: tr("إدارة", "Manage"),
							onClick: () => setTab("contact")
						})
					]
				}),
				tab === "general" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
						title: tr("القسم الرئيسي", "Hero section"),
						text: tr("كل النصوص والأزرار التي تظهر في بداية الموقع.", "Every heading, button, and detail shown at the top of the website."),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "form-grid",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: tr("السطر التعريفي", "Eyebrow"),
									wide: true,
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										value: t.kicker,
										onChange: (e) => edit("kicker", e.target.value)
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: tr("العنوان الرئيسي", "Main title"),
									wide: true,
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
										rows: 3,
										value: t.title,
										onChange: (e) => edit("title", e.target.value)
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: tr("المقدمة", "Introduction"),
									wide: true,
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
										rows: 4,
										value: t.intro,
										onChange: (e) => edit("intro", e.target.value)
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: tr("زر التواصل", "Contact button"),
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										value: t.cta,
										onChange: (e) => edit("cta", e.target.value)
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: tr("زر السيرة", "CV button"),
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										value: t.cv,
										onChange: (e) => edit("cv", e.target.value)
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: tr("الموقع", "Location"),
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										value: t.loc,
										onChange: (e) => edit("loc", e.target.value)
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: tr("حالة التوفر", "Availability text"),
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										value: t.availability,
										onChange: (e) => edit("availability", e.target.value)
									})
								})
							]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
						title: tr("قائمة الموقع", "Navigation menu"),
						text: tr("عدّل أسماء الروابط الستة في الهيدر.", "Edit the six navigation labels in the header."),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "repeater",
							children: t.nav.slice(0, 6).map((item, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "repeat-row compact",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: i + 1 }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									value: item,
									onChange: (e) => {
										const list = [...t.nav];
										list[i] = e.target.value;
										edit("nav", list);
									}
								})]
							}, i))
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
						title: tr("عناوين الأقسام الصغيرة", "Section labels"),
						text: tr("النص الصغير المرقم أعلى كل قسم.", "The small numbered label above each section."),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "repeater",
							children: t.sectionLabels.slice(0, 6).map((item, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "repeat-row compact",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: i + 1 }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									value: item,
									onChange: (e) => {
										const list = [...t.sectionLabels];
										list[i] = e.target.value;
										edit("sectionLabels", list);
									}
								})]
							}, i))
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
						title: tr("تذييل الموقع", "Footer"),
						text: tr("النص الموجود في أسفل الموقع.", "Text shown at the bottom of the website."),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: tr("نص التذييل", "Footer text"),
							wide: true,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								value: t.footer,
								onChange: (e) => edit("footer", e.target.value)
							})
						})
					})
				] }),
				tab === "profile" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
					title: tr("النبذة", "About section"),
					text: tr("العنوان والوصف التعريفي.", "About heading and description."),
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "form-grid",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: tr("عنوان النبذة", "About heading"),
							wide: true,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								value: t.aboutTitle,
								onChange: (e) => edit("aboutTitle", e.target.value)
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: tr("النص التعريفي", "About text"),
							wide: true,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
								rows: 6,
								value: t.about,
								onChange: (e) => edit("about", e.target.value)
							})
						})]
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					title: tr("الإحصائيات", "Statistics"),
					text: tr("أضف أو احذف أو غيّر ترتيب الأرقام المختصرة.", "Add, remove, or reorder the summary statistics."),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "collection-toolbar",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							className: "add-item",
							onClick: () => addList("stats", ["0", tr("وصف جديد", "New statistic")]),
							children: ["＋ ", tr("إضافة إحصائية", "Add statistic")]
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "repeater",
						children: t.stats.map((item, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "repeat-row with-actions",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: i + 1 }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									value: item[0],
									onChange: (e) => updateList("stats", i, [e.target.value, item[1]])
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									value: item[1],
									onChange: (e) => updateList("stats", i, [item[0], e.target.value])
								}),
								actions("stats", i, t.stats.length)
							]
						}, i))
					})]
				})] }),
				tab === "skills" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					title: tr("المهارات", "Skills"),
					text: tr("عدّل عنوان القسم وأضف أي عدد من مجموعات المهارات.", "Edit the section heading and manage any number of skill groups."),
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: tr("عنوان القسم", "Section heading"),
							wide: true,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								value: t.skillsTitle,
								onChange: (e) => edit("skillsTitle", e.target.value)
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "collection-toolbar",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								className: "add-item",
								onClick: () => addList("skills", [tr("مهارة جديدة", "New skill"), tr("وصف المهارة", "Skill description")]),
								children: ["＋ ", tr("إضافة مهارة", "Add skill")]
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "repeater",
							children: t.skills.map((item, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "repeat-row with-actions",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: i + 1 }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										value: item[0],
										onChange: (e) => updateList("skills", i, [e.target.value, item[1]])
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
										rows: 2,
										value: item[1],
										onChange: (e) => updateList("skills", i, [item[0], e.target.value])
									}),
									actions("skills", i, t.skills.length)
								]
							}, i))
						})
					]
				}),
				tab === "experience" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					title: tr("الخبرات العملية", "Work experience"),
					text: tr("يمكنك إضافة وظائف متعددة ونقاط مسؤوليات لكل وظيفة.", "Add multiple roles and manage the responsibilities for each one."),
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: tr("عنوان القسم", "Section heading"),
							wide: true,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								value: t.expTitle,
								onChange: (e) => edit("expTitle", e.target.value)
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "collection-toolbar",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								className: "add-item",
								onClick: () => addList("experiences", {
									role: tr("مسمى وظيفي جديد", "New job title"),
									company: tr("اسم الشركة", "Company name"),
									period: tr("الفترة", "Period"),
									bullets: []
								}),
								children: ["＋ ", tr("إضافة خبرة", "Add experience")]
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "collection-list",
							children: t.experiences.map((item, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
								className: "collection-item",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "collection-head",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: tr(`خبرة ${i + 1}`, `Experience ${i + 1}`) }), actions("experiences", i, t.experiences.length)]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "form-grid",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
												label: tr("المسمى الوظيفي", "Job title"),
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
													value: item.role,
													onChange: (e) => updateList("experiences", i, {
														...item,
														role: e.target.value
													})
												})
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
												label: tr("الشركة", "Company"),
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
													value: item.company,
													onChange: (e) => updateList("experiences", i, {
														...item,
														company: e.target.value
													})
												})
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
												label: tr("الفترة", "Period"),
												wide: true,
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
													value: item.period,
													onChange: (e) => updateList("experiences", i, {
														...item,
														period: e.target.value
													})
												})
											})
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
										className: "subheading",
										children: tr("نقاط الخبرة", "Experience highlights")
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "repeater",
										children: item.bullets.map((bullet, j) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "repeat-row bullet-row",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: j + 1 }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
													rows: 2,
													value: bullet,
													onChange: (e) => {
														const bullets = [...item.bullets];
														bullets[j] = e.target.value;
														updateList("experiences", i, {
															...item,
															bullets
														});
													}
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
													className: "remove-line",
													onClick: () => updateList("experiences", i, {
														...item,
														bullets: item.bullets.filter((_, x) => x !== j)
													}),
													children: "×"
												})
											]
										}, j))
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										className: "add-line",
										onClick: () => updateList("experiences", i, {
											...item,
											bullets: [...item.bullets, tr("مسؤولية جديدة", "New responsibility")]
										}),
										children: ["＋ ", tr("إضافة نقطة", "Add highlight")]
									})
								]
							}, i))
						})
					]
				}),
				tab === "project" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					title: tr("المشاريع", "Projects"),
					text: tr("أضف مشاريع متعددة مع وصف وكلمات مفتاحية.", "Add multiple projects with descriptions and tags."),
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: tr("عنوان القسم", "Section heading"),
							wide: true,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								value: t.projectTitle,
								onChange: (e) => edit("projectTitle", e.target.value)
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "collection-toolbar",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								className: "add-item",
								onClick: () => addList("projects", {
									name: tr("مشروع جديد", "New project"),
									description: tr("وصف المشروع", "Project description"),
									tags: []
								}),
								children: ["＋ ", tr("إضافة مشروع", "Add project")]
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "collection-list",
							children: t.projects.map((item, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
								className: "collection-item",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "collection-head",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: tr(`مشروع ${i + 1}`, `Project ${i + 1}`) }), actions("projects", i, t.projects.length)]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "form-grid",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
											label: tr("اسم المشروع", "Project name"),
											wide: true,
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												value: item.name,
												onChange: (e) => updateList("projects", i, {
													...item,
													name: e.target.value
												})
											})
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
											label: tr("الوصف", "Description"),
											wide: true,
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
												rows: 5,
												value: item.description,
												onChange: (e) => updateList("projects", i, {
													...item,
													description: e.target.value
												})
											})
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
											label: tr("الكلمات المفتاحية — افصل بفاصلة", "Tags — separate with commas"),
											wide: true,
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												value: item.tags.join(", "),
												onChange: (e) => updateList("projects", i, {
													...item,
													tags: e.target.value.split(",").map((x) => x.trim()).filter(Boolean)
												})
											})
										})
									]
								})]
							}, i))
						})
					]
				}),
				tab === "education" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					title: tr("التعليم", "Education"),
					text: tr("أضف شهادات ومؤهلات متعددة.", "Add multiple degrees and qualifications."),
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: tr("عنوان القسم", "Section heading"),
							wide: true,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								value: t.eduTitle,
								onChange: (e) => edit("eduTitle", e.target.value)
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "collection-toolbar",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								className: "add-item",
								onClick: () => addList("education", {
									degree: tr("مؤهل جديد", "New qualification"),
									school: tr("الجهة التعليمية", "Institution"),
									year: tr("سنة التخرج", "Graduation year"),
									badge: String((/* @__PURE__ */ new Date()).getFullYear())
								}),
								children: ["＋ ", tr("إضافة مؤهل", "Add education")]
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "collection-list",
							children: t.education.map((item, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
								className: "collection-item",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "collection-head",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: tr(`مؤهل ${i + 1}`, `Education ${i + 1}`) }), actions("education", i, t.education.length)]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "form-grid",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
											label: tr("الدرجة أو الشهادة", "Degree or certificate"),
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												value: item.degree,
												onChange: (e) => updateList("education", i, {
													...item,
													degree: e.target.value
												})
											})
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
											label: tr("الجامعة أو الجهة", "University or institution"),
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												value: item.school,
												onChange: (e) => updateList("education", i, {
													...item,
													school: e.target.value
												})
											})
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
											label: tr("الفترة أو سنة التخرج", "Period or graduation year"),
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												value: item.year,
												onChange: (e) => updateList("education", i, {
													...item,
													year: e.target.value
												})
											})
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
											label: tr("الرقم المختصر", "Year badge"),
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												value: item.badge,
												onChange: (e) => updateList("education", i, {
													...item,
													badge: e.target.value
												})
											})
										})
									]
								})]
							}, i))
						})
					]
				}),
				tab === "contact" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
					title: tr("قسم التواصل", "Contact section"),
					text: tr("العنوان والوصف الظاهرين في نهاية الموقع.", "Heading and description shown at the end of the website."),
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "form-grid",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: tr("العنوان", "Heading"),
							wide: true,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								value: t.contactTitle,
								onChange: (e) => edit("contactTitle", e.target.value)
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: tr("الوصف", "Description"),
							wide: true,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
								rows: 4,
								value: t.contactText,
								onChange: (e) => edit("contactText", e.target.value)
							})
						})]
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					title: tr("وسائل التواصل", "Contact methods"),
					text: tr("القائمة مشتركة بين اللغتين، ويمكن تغيير اسم كل زر بالعربية والإنجليزية.", "Shared between both languages, with a separate Arabic and English label for each button."),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "collection-toolbar",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							className: "add-item",
							onClick: addContact,
							children: ["＋ ", tr("إضافة وسيلة تواصل", "Add contact method")]
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "collection-list",
						children: contacts.map((item, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
							className: "collection-item",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "collection-head",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: tr(`وسيلة ${i + 1}`, `Contact ${i + 1}`) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ItemActions, {
									isAr,
									index: i,
									count: contacts.length,
									onUp: () => moveContact(i, -1),
									onDown: () => moveContact(i, 1),
									onRemove: () => removeContact(i)
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "form-grid",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
										label: tr("النوع", "Type"),
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
											value: item.kind,
											onChange: (e) => editContact(i, { kind: e.target.value }),
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: "whatsapp",
													children: "WhatsApp"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: "email",
													children: "Email"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: "link",
													children: "Link"
												})
											]
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
										label: tr("القيمة أو الرابط", "Value or URL"),
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											value: item.value,
											onChange: (e) => editContact(i, { value: e.target.value })
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
										label: tr("الاسم بالعربية", "Arabic label"),
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											dir: "rtl",
											value: item.labelAr,
											onChange: (e) => editContact(i, { labelAr: e.target.value })
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
										label: tr("الاسم بالإنجليزية", "English label"),
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											dir: "ltr",
											value: item.labelEn,
											onChange: (e) => editContact(i, { labelEn: e.target.value })
										})
									})
								]
							})]
						}, item.id))
					})]
				})] }),
				tab === "files" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "media-grid",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
						title: tr("الصورة الشخصية", "Profile photo"),
						text: tr("JPG أو PNG أو WebP، بحد أقصى 900KB.", "JPG, PNG, or WebP, up to 900KB."),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "photo-manager",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: `/api/media/photo?v=${photoVersion}`,
								onError: (e) => {
									e.currentTarget.onerror = null;
									e.currentTarget.src = "/mohammed-saber.jpg";
								},
								alt: tr("الصورة الحالية", "Current profile photo")
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: tr("الصورة الحالية", "Current photo") }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: tr("يفضل استخدام صورة عمودية واضحة.", "A clear portrait photo is recommended.") }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									ref: photoInput,
									hidden: true,
									type: "file",
									accept: "image/jpeg,image/png,image/webp",
									onChange: (e) => upload("photo", e.target.files?.[0])
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => photoInput.current?.click(),
									disabled: uploading === "photo",
									children: uploading === "photo" ? tr("جاري الرفع...", "Uploading...") : tr("اختيار صورة جديدة", "Choose new photo")
								})
							] })]
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
						title: tr("السيرة الذاتية", "Curriculum Vitae"),
						text: tr("PDF بحد أقصى 900KB.", "PDF, up to 900KB."),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "cv-manager",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { children: "PDF" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Mohammed Saber CV" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: tr("الملف الجديد سيستبدل النسخة الحالية.", "The new file will replace the current version.") }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									ref: cvInput,
									hidden: true,
									type: "file",
									accept: "application/pdf",
									onChange: (e) => upload("cv", e.target.files?.[0])
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => cvInput.current?.click(),
									disabled: uploading === "cv",
									children: uploading === "cv" ? tr("جاري الرفع...", "Uploading...") : tr("رفع نسخة جديدة", "Upload new CV")
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
									href: "/api/media/cv",
									target: "_blank",
									children: tr("عرض الحالية ↗", "View current ↗")
								})] })
							] })]
						})
					})]
				})
			]
		})]
	});
}
function Card({ title, text, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
		className: "editor-card",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: title }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: text })] }), children]
	});
}
function Field({ label, wide, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
		className: wide ? "field wide" : "field",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: label }), children]
	});
}
function Quick({ title, value, action, onClick }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
		className: "quick",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: title }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: value }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				onClick,
				children: action
			})
		]
	});
}
function ItemActions({ isAr, index, count, onUp, onDown, onRemove }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "item-actions",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				onClick: onUp,
				disabled: index === 0,
				title: isAr ? "تحريك لأعلى" : "Move up",
				children: "↑"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				onClick: onDown,
				disabled: index === count - 1,
				title: isAr ? "تحريك لأسفل" : "Move down",
				children: "↓"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				className: "danger",
				onClick: onRemove,
				title: isAr ? "حذف" : "Delete",
				children: "×"
			})
		]
	});
}
//#endregion
export { AdminEditor as default };
