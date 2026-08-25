//#region app/lib/portfolio-data.ts
var defaultContacts = [
	{
		id: "whatsapp",
		kind: "whatsapp",
		labelEn: "WhatsApp",
		labelAr: "واتساب",
		value: "966510565165"
	},
	{
		id: "email",
		kind: "email",
		labelEn: "Email",
		labelAr: "البريد الإلكتروني",
		value: "mohammed.saber.dev@gmail.com"
	},
	{
		id: "linkedin",
		kind: "link",
		labelEn: "LinkedIn",
		labelAr: "LinkedIn",
		value: "https://linkedin.com/in/mohammed-saber-it"
	}
];
var defaultData = {
	en: {
		nav: [
			"About",
			"Skills",
			"Experience",
			"Projects",
			"Education",
			"Contact"
		],
		sectionLabels: [
			"01 / ABOUT",
			"02 / SKILLS",
			"03 / EXPERIENCE",
			"04 / PROJECTS",
			"05 / EDUCATION",
			"06 / CONTACT"
		],
		kicker: "IT SUPPORT · SYSTEMS · INFRASTRUCTURE",
		title: "I keep technology reliable, secure, and ready for work.",
		intro: "IT Technical Support Specialist based in Riyadh, with 2+ years of hands-on experience supporting users, cloud services, networks, POS systems, and business-critical operations.",
		cta: "Contact me",
		cv: "Download CV",
		loc: "Riyadh, Saudi Arabia",
		availability: "Available for opportunities",
		aboutTitle: "Practical support. Measurable uptime.",
		about: "I solve the technical issues that slow teams down—from Microsoft 365 administration and endpoint troubleshooting to branch connectivity, POS platforms, and operational integrations. My focus is clear communication, fast diagnosis, and dependable results.",
		stats: [
			["2+", "Years of experience"],
			["100+", "Users supported"],
			["Tier 1/2", "Technical support"]
		],
		skillsTitle: "Technical toolkit",
		skills: [
			["Cloud & identity", "Microsoft 365, Entra ID, Exchange Online, RBAC, user lifecycle"],
			["Networks", "TCP/IP, DNS, DHCP, VPN, VLAN basics, routers, switches, access points"],
			["Business systems", "Odoo Helpdesk & CRM, Foodics POS, self-service kiosks, SQL basics"],
			["Security & support", "Microsoft Defender, CrowdStrike, Windows 10/11, RDP, AnyDesk, RustDesk"]
		],
		expTitle: "Experience",
		experiences: [{
			role: "IT Technical Support Specialist",
			company: "International Dishes Company",
			period: "June 2024 — Present",
			bullets: [
				"Provide Tier 1 and Tier 2 support for 100+ users across multi-branch operations.",
				"Administer Microsoft 365 and Entra ID accounts, groups, licenses, and Exchange policies.",
				"Deploy and maintain Foodics POS, kiosks, payment terminals, printers, and delivery integrations.",
				"Troubleshoot LAN/Wi-Fi, routers, access points, static IPs, and VPN connections."
			]
		}],
		projectTitle: "Featured projects",
		projects: [{
			name: "Customer Service CRM in Odoo",
			description: "Designed and implemented a CRM workflow inside Odoo to help the customer service team organize requests, track follow-ups, clarify ownership, and improve visibility across the support process.",
			tags: [
				"Odoo CRM",
				"Workflow Design",
				"Customer Service",
				"Process Improvement"
			]
		}],
		eduTitle: "Education",
		education: [{
			degree: "Bachelor of Information Technology (BIT)",
			school: "Arab Open University — Riyadh",
			year: "Class of 2025",
			badge: "2025"
		}],
		contactTitle: "Let’s make IT work better.",
		contactText: "Open to IT Support, Helpdesk, Desktop Support, Systems, and Infrastructure opportunities in Riyadh and the Eastern Province.",
		footer: "Built around reliable support and continuous improvement."
	},
	ar: {
		nav: [
			"نبذة",
			"المهارات",
			"الخبرة",
			"المشاريع",
			"التعليم",
			"التواصل"
		],
		sectionLabels: [
			"01 / نبذة",
			"02 / المهارات",
			"03 / الخبرة",
			"04 / المشاريع",
			"05 / التعليم",
			"06 / التواصل"
		],
		kicker: "الدعم التقني · الأنظمة · البنية التحتية",
		title: "أحافظ على التقنية مستقرة وآمنة وجاهزة للعمل.",
		intro: "أخصائي دعم فني في الرياض بخبرة عملية تتجاوز سنتين في دعم المستخدمين والخدمات السحابية والشبكات وأنظمة نقاط البيع والعمليات الحيوية للشركات.",
		cta: "تواصل معي",
		cv: "تحميل السيرة الذاتية",
		loc: "الرياض، السعودية",
		availability: "متاح لفرص عمل",
		aboutTitle: "دعم عملي. واستمرارية يمكن الاعتماد عليها.",
		about: "أحل المشكلات التقنية التي تعطل فرق العمل، بداية من إدارة Microsoft 365 ودعم الأجهزة، وصولًا إلى ربط الفروع وأنظمة نقاط البيع والتكاملات التشغيلية. أركز على التواصل الواضح والتشخيص السريع والنتائج الموثوقة.",
		stats: [
			["+2", "سنوات خبرة"],
			["+100", "مستخدم تم دعمهم"],
			["Tier 1/2", "دعم فني"]
		],
		skillsTitle: "المهارات التقنية",
		skills: [
			["السحابة والهوية", "Microsoft 365 وEntra ID وExchange Online وإدارة الصلاحيات والمستخدمين"],
			["الشبكات", "TCP/IP وDNS وDHCP وVPN وأساسيات VLAN والراوترات والسويتشات ونقاط الوصول"],
			["أنظمة الأعمال", "Odoo Helpdesk وCRM وFoodics POS وأجهزة الخدمة الذاتية وأساسيات SQL"],
			["الأمن والدعم", "Microsoft Defender وCrowdStrike وWindows 10/11 وRDP وAnyDesk وRustDesk"]
		],
		expTitle: "الخبرة العملية",
		experiences: [{
			role: "أخصائي دعم فني لتقنية المعلومات",
			company: "شركة الأطباق العالمية",
			period: "يونيو 2024 — حتى الآن",
			bullets: [
				"تقديم دعم فني من المستوى الأول والثاني لأكثر من 100 مستخدم ضمن عمليات متعددة الفروع.",
				"إدارة حسابات ومجموعات وتراخيص Microsoft 365 وEntra ID وسياسات Exchange.",
				"تركيب وصيانة Foodics POS وأجهزة الخدمة الذاتية وأجهزة الدفع والطابعات وتكاملات التوصيل.",
				"استكشاف مشاكل LAN وWi-Fi والراوترات ونقاط الوصول وعناوين IP الثابتة واتصالات VPN."
			]
		}],
		projectTitle: "المشاريع المميزة",
		projects: [{
			name: "إنشاء نظام CRM لخدمة العملاء داخل Odoo",
			description: "تصميم وتنفيذ مسار عمل لنظام CRM داخل Odoo لمساعدة فريق خدمة العملاء على تنظيم الطلبات ومتابعة الحالات وتحديد المسؤوليات وتحسين وضوح مراحل الدعم.",
			tags: [
				"Odoo CRM",
				"تصميم سير العمل",
				"خدمة العملاء",
				"تحسين العمليات"
			]
		}],
		eduTitle: "التعليم",
		education: [{
			degree: "بكالوريوس تقنية المعلومات (BIT)",
			school: "الجامعة العربية المفتوحة — الرياض",
			year: "دفعة 2025",
			badge: "2025"
		}],
		contactTitle: "معًا نجعل التقنية تعمل بشكل أفضل.",
		contactText: "متاح لفرص الدعم الفني وHelpdesk ودعم أجهزة المستخدمين والأنظمة والبنية التحتية في الرياض والمنطقة الشرقية.",
		footer: "دعم موثوق وتطوير مستمر."
	}
};
function normalizeLanguage(raw, fallback) {
	const experiences = Array.isArray(raw?.experiences) ? raw.experiences : raw?.role ? [{
		role: raw.role,
		company: raw.company || "",
		period: raw.period || "",
		bullets: Array.isArray(raw.bullets) ? raw.bullets : []
	}] : fallback.experiences;
	const projects = Array.isArray(raw?.projects) ? raw.projects : raw?.projectName ? [{
		name: raw.projectName,
		description: raw.project || "",
		tags: Array.isArray(raw.tags) ? raw.tags : []
	}] : fallback.projects;
	const education = Array.isArray(raw?.education) ? raw.education : raw?.degree ? [{
		degree: raw.degree,
		school: raw.school || "",
		year: raw.year || "",
		badge: String(raw.year || "").match(/\d{4}/)?.[0] || ""
	}] : fallback.education;
	return {
		...fallback,
		...raw,
		nav: Array.isArray(raw?.nav) ? raw.nav : fallback.nav,
		sectionLabels: Array.isArray(raw?.sectionLabels) ? raw.sectionLabels : fallback.sectionLabels,
		stats: Array.isArray(raw?.stats) ? raw.stats : fallback.stats,
		skills: Array.isArray(raw?.skills) ? raw.skills : fallback.skills,
		experiences,
		projects,
		education
	};
}
function normalizePortfolio(data) {
	const content = {
		en: normalizeLanguage(data?.content?.en, defaultData.en),
		ar: normalizeLanguage(data?.content?.ar, defaultData.ar)
	};
	let contacts = Array.isArray(data?.contacts) ? data.contacts : null;
	if (!contacts && data?.links) contacts = defaultContacts.map((item) => ({
		...item,
		value: data.links[item.id] || item.value
	}));
	return {
		content,
		contacts: contacts?.length ? contacts : defaultContacts
	};
}
function contactHref(item) {
	if (item.kind === "email") return `mailto:${item.value}`;
	if (item.kind === "whatsapp") return `https://wa.me/${item.value.replace(/\D/g, "")}`;
	return item.value;
}
//#endregion
export { normalizePortfolio as i, defaultContacts as n, defaultData as r, contactHref as t };
