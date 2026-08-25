import { a as require_react, o as __toESM, t as require_jsx_runtime } from "../index.js";
import { defaultData } from "./page-CGY53xrC.js";
//#region app/admin/admin.css
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
//#endregion
//#region app/admin/AdminEditor.tsx
var import_jsx_runtime = require_jsx_runtime();
var names = {
	home: "الرئيسية",
	profile: "النبذة والمهارات",
	experience: "الخبرة",
	project: "المشروع",
	education: "التعليم",
	contact: "التواصل",
	files: "الصورة والسيرة"
};
function AdminEditor() {
	const [lang, setLang] = (0, import_react.useState)("ar");
	const [tab, setTab] = (0, import_react.useState)("home");
	const [content, setContent] = (0, import_react.useState)(defaultData);
	const [links, setLinks] = (0, import_react.useState)({
		whatsapp: "966510565165",
		email: "mohammed.saber.dev@gmail.com",
		linkedin: "https://linkedin.com/in/mohammed-saber-it"
	});
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
			if (data?.content) setContent(data.content);
			if (data?.links) setLinks(data.links);
		}).finally(() => setLoading(false));
	}, []);
	const t = content[lang];
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
	const editLink = (key, value) => {
		setDirty(true);
		setLinks((old) => ({
			...old,
			[key]: value
		}));
	};
	const login = async (event) => {
		event.preventDefault();
		setMessage("جاري تسجيل الدخول...");
		if ((await fetch("/api/admin/session", {
			method: "POST",
			headers: { "content-type": "application/json" },
			body: JSON.stringify({ password })
		})).ok) {
			setAuthed(true);
			setPassword("");
			setMessage("");
		} else setMessage("كلمة المرور غير صحيحة");
	};
	const logout = async () => {
		await fetch("/api/admin/session", { method: "DELETE" });
		setAuthed(false);
	};
	const save = async () => {
		notify("جاري حفظ التعديلات...", "busy");
		const response = await fetch("/api/content", {
			method: "PUT",
			headers: { "content-type": "application/json" },
			body: JSON.stringify({
				content,
				links
			})
		});
		if (response.status === 401) return setAuthed(false);
		if (response.ok) {
			setDirty(false);
			notify("تم الحفظ والنشر بنجاح");
		} else notify("تعذر الحفظ، حاول مرة أخرى", "error");
	};
	const upload = async (kind, file) => {
		if (!file) return;
		const isPhoto = kind === "photo";
		if (!(isPhoto ? [
			"image/jpeg",
			"image/png",
			"image/webp"
		] : ["application/pdf"]).includes(file.type)) return notify(isPhoto ? "اختر صورة JPG أو PNG أو WebP" : "اختر ملف PDF", "error");
		if (file.size > 9e5) return notify("حجم الملف يجب ألا يتجاوز 900KB", "error");
		setUploading(kind);
		notify(isPhoto ? "جاري رفع الصورة إلى GitHub..." : "جاري رفع السيرة إلى GitHub...", "busy");
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
		if (!response.ok) return notify(data.error || "تعذر رفع الملف", "error");
		if (isPhoto) setPhotoVersion(Date.now());
		notify(isPhoto ? "تم تحديث الصورة بنجاح" : "تم تحديث السيرة الذاتية بنجاح");
	};
	if (loading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
		className: "admin-loading",
		children: "جاري تحميل لوحة التحكم..."
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
					required: true,
					autoFocus: true
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { children: "تسجيل الدخول" }),
				message && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: message })
			]
		})
	});
	const menu = (key, icon) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		className: tab === key ? "active" : "",
		onClick: () => setTab(key),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { children: icon }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: names[key] })]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: `admin-shell ${lang === "en" ? "lang-en" : ""}`,
		dir: "rtl",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "admin-brand",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
					className: "admin-logo",
					href: "/",
					children: "MS"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Mohammed Saber" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "Portfolio Manager" })] })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", { children: [
				menu("home", "⌂"),
				menu("profile", "◉"),
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
					children: "فتح الموقع ↗"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: logout,
					children: "تسجيل الخروج"
				})]
			})
		] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "admin-workspace",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
					className: "admin-topbar",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: ["لوحة التحكم / ", names[tab]] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", { children: names[tab] })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "top-actions",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: dirty ? "dirty" : "saved",
								children: dirty ? "تعديلات غير محفوظة" : "محفوظ"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
								href: "/",
								target: "_blank",
								children: "معاينة"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: save,
								disabled: !dirty,
								children: "حفظ ونشر"
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
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["تعديل النسخة ", lang === "ar" ? "العربية" : "الإنجليزية"] })]
				}),
				tab === "home" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "dashboard-grid",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
							className: "welcome",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "مرحبًا محمد" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "إدارة الموقع أصبحت أبسط" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "اختَر القسم المطلوب، عدّل بياناته، ثم اضغط حفظ ونشر." }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => setTab("profile"),
									children: "ابدأ التعديل"
								})
							] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "MS" })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Quick, {
							title: "حالة الموقع",
							value: "● منشور",
							action: "فتح الموقع",
							onClick: () => window.open("/", "_blank")
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Quick, {
							title: "لغة التحرير",
							value: lang === "ar" ? "العربية" : "English",
							action: "تغيير اللغة",
							onClick: () => setLang(lang === "ar" ? "en" : "ar")
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Quick, {
							title: "إدارة الملفات",
							value: "الصورة والسيرة",
							action: "فتح الملفات",
							onClick: () => setTab("files")
						})
					]
				}),
				tab === "profile" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
					title: "المقدمة والنبذة",
					text: "النصوص التي تظهر في بداية الموقع وقسم التعريف.",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "form-grid",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: lang === "ar" ? "العنوان الرئيسي" : "Main title",
								wide: true,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									value: t.title,
									onChange: (e) => edit("title", e.target.value)
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: lang === "ar" ? "المقدمة" : "Introduction",
								wide: true,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
									rows: 4,
									value: t.intro,
									onChange: (e) => edit("intro", e.target.value)
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: lang === "ar" ? "عنوان النبذة" : "About heading",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									value: t.aboutTitle,
									onChange: (e) => edit("aboutTitle", e.target.value)
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: lang === "ar" ? "النص التعريفي" : "About text",
								wide: true,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
									rows: 5,
									value: t.about,
									onChange: (e) => edit("about", e.target.value)
								})
							})
						]
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
					title: "المهارات التقنية",
					text: "عدّل اسم كل مجموعة ووصفها.",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "repeater",
						children: t.skills.map((skill, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "repeat-row",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: i + 1 }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									value: skill[0],
									onChange: (e) => {
										const a = [...t.skills];
										a[i] = [e.target.value, a[i][1]];
										edit("skills", a);
									}
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
									rows: 2,
									value: skill[1],
									onChange: (e) => {
										const a = [...t.skills];
										a[i] = [a[i][0], e.target.value];
										edit("skills", a);
									}
								})
							]
						}, i))
					})
				})] }),
				tab === "experience" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					title: "الخبرة العملية",
					text: "بيانات الوظيفة الحالية وأهم المسؤوليات.",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "form-grid",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "المسمى الوظيفي",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										value: t.role,
										onChange: (e) => edit("role", e.target.value)
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "الشركة",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										value: t.company,
										onChange: (e) => edit("company", e.target.value)
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "الفترة",
									wide: true,
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										value: t.period,
										onChange: (e) => edit("period", e.target.value)
									})
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "subheading",
							children: "نقاط الخبرة"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "repeater",
							children: t.bullets.map((item, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "repeat-row compact",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: i + 1 }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
									rows: 2,
									value: item,
									onChange: (e) => {
										const a = [...t.bullets];
										a[i] = e.target.value;
										edit("bullets", a);
									}
								})]
							}, i))
						})
					]
				}),
				tab === "project" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
					title: "المشروع المميز",
					text: "اعرض المشروع بصورة مختصرة وواضحة.",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "form-grid",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "اسم المشروع",
								wide: true,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									value: t.projectName,
									onChange: (e) => edit("projectName", e.target.value)
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "تفاصيل المشروع",
								wide: true,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
									rows: 6,
									value: t.project,
									onChange: (e) => edit("project", e.target.value)
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "الكلمات المفتاحية — افصل بفاصلة",
								wide: true,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									value: t.tags.join(", "),
									onChange: (e) => edit("tags", e.target.value.split(",").map((x) => x.trim()).filter(Boolean))
								})
							})
						]
					})
				}),
				tab === "education" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
					title: "المؤهل العلمي",
					text: "بيانات الشهادة الجامعية الظاهرة في الموقع.",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "form-grid",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "الدرجة الجامعية",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									value: t.degree,
									onChange: (e) => edit("degree", e.target.value)
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "الجامعة",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									value: t.school,
									onChange: (e) => edit("school", e.target.value)
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "سنة التخرج",
								wide: true,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									value: t.year,
									onChange: (e) => edit("year", e.target.value)
								})
							})
						]
					})
				}),
				tab === "contact" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
					title: "قسم التواصل",
					text: "العنوان والوصف في نهاية الموقع.",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "form-grid",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "العنوان",
							wide: true,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								value: t.contactTitle,
								onChange: (e) => edit("contactTitle", e.target.value)
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "الوصف",
							wide: true,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
								rows: 4,
								value: t.contactText,
								onChange: (e) => edit("contactText", e.target.value)
							})
						})]
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
					title: "روابط التواصل",
					text: "مشتركة بين العربية والإنجليزية.",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "form-grid",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "واتساب",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									value: links.whatsapp,
									onChange: (e) => editLink("whatsapp", e.target.value)
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "البريد",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									value: links.email,
									onChange: (e) => editLink("email", e.target.value)
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "LinkedIn",
								wide: true,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									value: links.linkedin,
									onChange: (e) => editLink("linkedin", e.target.value)
								})
							})
						]
					})
				})] }),
				tab === "files" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "media-grid",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
							title: "الصورة الشخصية",
							text: "JPG أو PNG أو WebP، بحد أقصى 900KB.",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "photo-manager",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: `/api/media/photo?v=${photoVersion}`,
									onError: (e) => {
										e.currentTarget.onerror = null;
										e.currentTarget.src = "/mohammed-saber.jpg";
									},
									alt: "الصورة الحالية"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "الصورة الحالية" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "يفضل استخدام صورة عمودية واضحة." }),
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
										children: uploading === "photo" ? "جاري الرفع..." : "اختيار صورة جديدة"
									})
								] })]
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
							title: "السيرة الذاتية",
							text: "PDF بحد أقصى 900KB.",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "cv-manager",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { children: "PDF" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Mohammed Saber CV" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "الملف الجديد سيستبدل النسخة الحالية." }),
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
										children: uploading === "cv" ? "جاري الرفع..." : "رفع نسخة جديدة"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
										href: "/api/media/cv",
										target: "_blank",
										children: "عرض الحالية ↗"
									})] })
								] })]
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
							className: "github-note",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "تخزين مجاني على GitHub" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "رفع الملفات يتم من السيرفر باستخدام صلاحية محدودة للمستودع، ولا يظهر التوكن داخل المتصفح." })]
						})
					]
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
//#endregion
export { AdminEditor as default };
