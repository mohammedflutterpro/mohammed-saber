import { a as require_react, o as __toESM, t as require_jsx_runtime } from "../index.js";
import { defaultData } from "./page-CGY53xrC.js";
//#region app/admin/admin.css
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
//#endregion
//#region app/admin/AdminEditor.tsx
var import_jsx_runtime = require_jsx_runtime();
var names = {
	en: {
		home: "Dashboard",
		profile: "Profile & Skills",
		experience: "Experience",
		project: "Project",
		education: "Education",
		contact: "Contact",
		files: "Photo & CV"
	},
	ar: {
		home: "الرئيسية",
		profile: "النبذة والمهارات",
		experience: "الخبرة",
		project: "المشروع",
		education: "التعليم",
		contact: "التواصل",
		files: "الصورة والسيرة"
	}
};
function AdminEditor() {
	const [lang, setLang] = (0, import_react.useState)("en");
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
	const isAr = lang === "ar";
	const sectionNames = names[lang];
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
		setMessage(isAr ? "جاري تسجيل الدخول..." : "Signing in...");
		if ((await fetch("/api/admin/session", {
			method: "POST",
			headers: { "content-type": "application/json" },
			body: JSON.stringify({ password })
		})).ok) {
			setAuthed(true);
			setPassword("");
			setMessage("");
		} else setMessage(isAr ? "كلمة المرور غير صحيحة" : "Incorrect password");
	};
	const logout = async () => {
		await fetch("/api/admin/session", { method: "DELETE" });
		setAuthed(false);
	};
	const save = async () => {
		notify(isAr ? "جاري حفظ التعديلات..." : "Saving changes...", "busy");
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
			notify(isAr ? "تم الحفظ والنشر بنجاح" : "Changes saved and published successfully");
		} else notify(isAr ? "تعذر الحفظ، حاول مرة أخرى" : "Could not save changes. Please try again.", "error");
	};
	const upload = async (kind, file) => {
		if (!file) return;
		const isPhoto = kind === "photo";
		if (!(isPhoto ? [
			"image/jpeg",
			"image/png",
			"image/webp"
		] : ["application/pdf"]).includes(file.type)) return notify(isAr ? isPhoto ? "اختر صورة JPG أو PNG أو WebP" : "اختر ملف PDF" : isPhoto ? "Choose a JPG, PNG, or WebP image" : "Choose a PDF file", "error");
		if (file.size > 9e5) return notify(isAr ? "حجم الملف يجب ألا يتجاوز 900KB" : "File size must not exceed 900KB", "error");
		setUploading(kind);
		notify(isAr ? isPhoto ? "جاري رفع الصورة إلى GitHub..." : "جاري رفع السيرة إلى GitHub..." : isPhoto ? "Uploading photo to GitHub..." : "Uploading CV to GitHub...", "busy");
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
		if (!response.ok) return notify(data.error || (isAr ? "تعذر رفع الملف" : "Could not upload the file"), "error");
		if (isPhoto) setPhotoVersion(Date.now());
		notify(isAr ? isPhoto ? "تم تحديث الصورة بنجاح" : "تم تحديث السيرة الذاتية بنجاح" : isPhoto ? "Photo updated successfully" : "CV updated successfully");
	};
	if (loading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
		className: "admin-loading",
		children: isAr ? "جاري تحميل لوحة التحكم..." : "Loading dashboard..."
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
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", { children: isAr ? "لوحة التحكم" : "Dashboard" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: isAr ? "أدخل كلمة المرور الخاصة بإدارة الموقع." : "Enter your password to manage the website." }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					type: "password",
					value: password,
					onChange: (e) => setPassword(e.target.value),
					placeholder: isAr ? "كلمة المرور" : "Password",
					required: true,
					autoFocus: true
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { children: isAr ? "تسجيل الدخول" : "Sign in" }),
				message && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: message })
			]
		})
	});
	const menu = (key, icon) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		className: tab === key ? "active" : "",
		onClick: () => setTab(key),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { children: icon }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: sectionNames[key] })]
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
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Mohammed Saber" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: isAr ? "إدارة البورتفوليو" : "Portfolio Manager" })] })]
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
					children: isAr ? "فتح الموقع ↗" : "Open website ↗"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: logout,
					children: isAr ? "تسجيل الخروج" : "Sign out"
				})]
			})
		] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "admin-workspace",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
					className: "admin-topbar",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
						isAr ? "لوحة التحكم" : "Dashboard",
						" / ",
						sectionNames[tab]
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", { children: sectionNames[tab] })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "top-actions",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: dirty ? "dirty" : "saved",
								children: dirty ? isAr ? "تعديلات غير محفوظة" : "Unsaved changes" : isAr ? "محفوظ" : "Saved"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
								href: "/",
								target: "_blank",
								children: isAr ? "معاينة" : "Preview"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: save,
								disabled: !dirty,
								children: isAr ? "حفظ ونشر" : "Save & Publish"
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
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isAr ? "تعديل النسخة العربية" : "Editing the English version" })]
				}),
				tab === "home" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "dashboard-grid",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
							className: "welcome",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: isAr ? "مرحبًا محمد" : "Welcome, Mohammed" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: isAr ? "إدارة الموقع أصبحت أبسط" : "Website management made simple" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: isAr ? "اختَر القسم المطلوب، عدّل بياناته، ثم اضغط حفظ ونشر." : "Choose a section, update its details, then select Save & Publish." }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => setTab("profile"),
									children: isAr ? "ابدأ التعديل" : "Start editing"
								})
							] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "MS" })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Quick, {
							title: isAr ? "حالة الموقع" : "Website status",
							value: isAr ? "● منشور" : "● Published",
							action: isAr ? "فتح الموقع" : "Open website",
							onClick: () => window.open("/", "_blank")
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Quick, {
							title: isAr ? "لغة التحرير" : "Editing language",
							value: isAr ? "العربية" : "English",
							action: isAr ? "تغيير اللغة" : "Switch language",
							onClick: () => setLang(isAr ? "en" : "ar")
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Quick, {
							title: isAr ? "إدارة الملفات" : "File manager",
							value: isAr ? "الصورة والسيرة" : "Photo & CV",
							action: isAr ? "فتح الملفات" : "Open files",
							onClick: () => setTab("files")
						})
					]
				}),
				tab === "profile" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
					title: isAr ? "المقدمة والنبذة" : "Introduction & About",
					text: isAr ? "النصوص التي تظهر في بداية الموقع وقسم التعريف." : "Text shown in the hero and About sections.",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "form-grid",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: isAr ? "العنوان الرئيسي" : "Main title",
								wide: true,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									value: t.title,
									onChange: (e) => edit("title", e.target.value)
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: isAr ? "المقدمة" : "Introduction",
								wide: true,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
									rows: 4,
									value: t.intro,
									onChange: (e) => edit("intro", e.target.value)
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: isAr ? "عنوان النبذة" : "About heading",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									value: t.aboutTitle,
									onChange: (e) => edit("aboutTitle", e.target.value)
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: isAr ? "النص التعريفي" : "About text",
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
					title: isAr ? "المهارات التقنية" : "Technical skills",
					text: isAr ? "عدّل اسم كل مجموعة ووصفها." : "Edit the name and description of each skill group.",
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
					title: isAr ? "الخبرة العملية" : "Work experience",
					text: isAr ? "بيانات الوظيفة الحالية وأهم المسؤوليات." : "Current role details and key responsibilities.",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "form-grid",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: isAr ? "المسمى الوظيفي" : "Job title",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										value: t.role,
										onChange: (e) => edit("role", e.target.value)
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: isAr ? "الشركة" : "Company",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										value: t.company,
										onChange: (e) => edit("company", e.target.value)
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: isAr ? "الفترة" : "Period",
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
							children: isAr ? "نقاط الخبرة" : "Experience highlights"
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
					title: isAr ? "المشروع المميز" : "Featured project",
					text: isAr ? "اعرض المشروع بصورة مختصرة وواضحة." : "Present the project clearly and concisely.",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "form-grid",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: isAr ? "اسم المشروع" : "Project name",
								wide: true,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									value: t.projectName,
									onChange: (e) => edit("projectName", e.target.value)
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: isAr ? "تفاصيل المشروع" : "Project details",
								wide: true,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
									rows: 6,
									value: t.project,
									onChange: (e) => edit("project", e.target.value)
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: isAr ? "الكلمات المفتاحية — افصل بفاصلة" : "Keywords — separate with commas",
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
					title: isAr ? "المؤهل العلمي" : "Education",
					text: isAr ? "بيانات الشهادة الجامعية الظاهرة في الموقع." : "University degree details shown on the website.",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "form-grid",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: isAr ? "الدرجة الجامعية" : "Degree",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									value: t.degree,
									onChange: (e) => edit("degree", e.target.value)
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: isAr ? "الجامعة" : "University",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									value: t.school,
									onChange: (e) => edit("school", e.target.value)
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: isAr ? "سنة التخرج" : "Graduation year",
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
					title: isAr ? "قسم التواصل" : "Contact section",
					text: isAr ? "العنوان والوصف في نهاية الموقع." : "Heading and description at the end of the website.",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "form-grid",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: isAr ? "العنوان" : "Heading",
							wide: true,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								value: t.contactTitle,
								onChange: (e) => edit("contactTitle", e.target.value)
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: isAr ? "الوصف" : "Description",
							wide: true,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
								rows: 4,
								value: t.contactText,
								onChange: (e) => edit("contactText", e.target.value)
							})
						})]
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
					title: isAr ? "روابط التواصل" : "Contact links",
					text: isAr ? "مشتركة بين العربية والإنجليزية." : "Shared by the Arabic and English versions.",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "form-grid",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: isAr ? "واتساب" : "WhatsApp",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									value: links.whatsapp,
									onChange: (e) => editLink("whatsapp", e.target.value)
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: isAr ? "البريد" : "Email",
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
							title: isAr ? "الصورة الشخصية" : "Profile photo",
							text: isAr ? "JPG أو PNG أو WebP، بحد أقصى 900KB." : "JPG, PNG, or WebP, up to 900KB.",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "photo-manager",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: `/api/media/photo?v=${photoVersion}`,
									onError: (e) => {
										e.currentTarget.onerror = null;
										e.currentTarget.src = "/mohammed-saber.jpg";
									},
									alt: isAr ? "الصورة الحالية" : "Current profile photo"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: isAr ? "الصورة الحالية" : "Current photo" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: isAr ? "يفضل استخدام صورة عمودية واضحة." : "A clear portrait photo is recommended." }),
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
										children: uploading === "photo" ? isAr ? "جاري الرفع..." : "Uploading..." : isAr ? "اختيار صورة جديدة" : "Choose new photo"
									})
								] })]
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
							title: isAr ? "السيرة الذاتية" : "Curriculum Vitae",
							text: isAr ? "PDF بحد أقصى 900KB." : "PDF, up to 900KB.",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "cv-manager",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { children: "PDF" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Mohammed Saber CV" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: isAr ? "الملف الجديد سيستبدل النسخة الحالية." : "The new file will replace the current version." }),
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
										children: uploading === "cv" ? isAr ? "جاري الرفع..." : "Uploading..." : isAr ? "رفع نسخة جديدة" : "Upload new CV"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
										href: "/api/media/cv",
										target: "_blank",
										children: isAr ? "عرض الحالية ↗" : "View current ↗"
									})] })
								] })]
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
							className: "github-note",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: isAr ? "تخزين مجاني على GitHub" : "Free GitHub storage" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: isAr ? "رفع الملفات يتم من السيرفر باستخدام صلاحية محدودة للمستودع، ولا يظهر التوكن داخل المتصفح." : "Files are uploaded securely from the server using limited repository access. The token is never exposed in the browser." })]
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
