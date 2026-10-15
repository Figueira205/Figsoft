// Interfaz de Figsoft: idioma, navegación, animaciones de entrada, efectos de cursor y formulario.
const doc = document, root = doc.documentElement;
const $ = (s, r = doc) => r.querySelector(s);
const $$ = (s, r = doc) => [...r.querySelectorAll(s)];
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
const fine = matchMedia("(hover: hover) and (pointer: fine)").matches;

const SECTORS = {
  es: ["Administración pública", "Banca y finanzas", "Construcción", "Consultoría", "e-Commerce", "Educación", "Farma y salud", "Industria", "Joyería", "Retail", "Seguros", "Servicios", "Software", "Tecnología", "Textil", "Transporte y logística"],
  en: ["Public administration", "Banking & finance", "Construction", "Consulting", "e-Commerce", "Education", "Pharma & health", "Industry", "Jewelry", "Retail", "Insurance", "Services", "Software", "Technology", "Textile", "Transport & logistics"],
};
const STACK = ["n8n", "Make", "Odoo", "Python", "TypeScript", "React", "Vue", "Angular", "Node.js", "PostgreSQL", "Docker", "Gemini API", "WooCommerce", "Supabase", "Stripe", "RabbitMQ", "Django", "Unity"];

const EN = {
  skip: "Skip to content",
  "nav.services": "Services", "nav.method": "Method", "nav.projects": "Projects", "nav.team": "Team", "nav.contact": "Contact", "nav.cta": "Let's talk",
  "hero.eyebrow": "IT consulting · Madrid", "hero.l1": "Software, AI and", "hero.l2": "automation", "hero.l3": "tailored to your business.",
  "hero.lead": "We build websites, automate processes and connect your tools with artificial intelligence, so your team can spend its time on what matters.",
  "hero.cta1": "Request a quote", "hero.cta2": "See services",
  "stats.projects": "projects delivered", "stats.sectors": "sectors served", "stats.lang": "support in two languages",
  "svc.kicker": "What we do", "svc.title": "Everything your company needs to work better with technology",
  "svc.1t": "Process automation", "svc.1d": "We connect your tools with n8n, Make and APIs to remove repetitive work: invoices, alerts, onboarding, reports.",
  "svc.2t": "Artificial intelligence", "svc.2d": "Agents and language models inside your workflows: classify documents, answer queries and support decisions.",
  "svc.3t": "Web development & e-commerce", "svc.3d": "Corporate sites, online stores and platforms with payments: fast, accessible and ready to rank.",
  "svc.4t": "Custom software", "svc.4d": "Internal apps, dashboards and services that fit the way you work, on a technical base you can maintain.",
  "svc.5t": "Odoo & ERP", "svc.5d": "Custom modules, themes and integrations so the ERP reflects your processes, not the other way around.",
  "svc.6t": "IT consulting", "svc.6d": "Technical and strategic assessment to organize your infrastructure, prioritize investment and modernize without stopping the business.",
  "met.kicker": "How we work", "met.title": "A simple method, from the first conversation to continuous improvement",
  "met.lead": "No jargon, no vague promises: every phase ends with something you can see, test and measure.",
  "met.1t": "Discovery", "met.1d": "We listen to your case, review your tools and find where the most time is lost. Free initial assessment.",
  "met.2t": "Solution design", "met.2d": "We propose a concrete solution with scope, timeline and a fixed quote before writing a single line.",
  "met.3t": "Delivery in increments", "met.3d": "Short, working deliveries. You see real progress every week and we adjust along the way.",
  "met.4t": "Launch and improvement", "met.4d": "We deploy, train your team and keep measuring to improve what already works.",
  "prj.kicker": "Use cases", "prj.title": "Innovation applied to real scenarios",
  "prj.t1": "Legal · AI", "prj.1t": "Automated legal validation", "prj.1d": "A system for law firms that classifies, reads and validates legal documents automatically, leaving the lawyer only what needs judgment.",
  "prj.t2": "Logistics · AI", "prj.2t": "Logistics CRM with AI", "prj.2d": "Fleet management that anticipates maintenance and optimizes routes with machine learning.",
  "prj.t3": "Public administration", "prj.3t": "Citizen support chatbot", "prj.3d": "A virtual assistant that manages appointments and answers questions about procedures.",
  "prj.t4": "Pharma · Computer vision", "prj.4t": "Pharma stock control", "prj.4d": "Computer vision to track inventory and expiry dates in large warehouses.",
  "prj.t5": "Fintech · Data", "prj.5t": "Real-time fraud detection", "prj.5d": "A transaction analysis engine that spots anomalous patterns in digital banking as they happen.",
  "stk.kicker": "Technology", "stk.title": "Tools we master",
  "team.kicker": "Team", "team.title": "A close-knit startup passionate about technology", "team.lead": "Over 40 projects behind us and direct contact with the people building your solution.",
  "team.ceo": "Founder & CEO", "team.cvo": "Chief Visionary Officer",
  "ct.kicker": "Contact", "ct.title": "Tell us about your project", "ct.lead": "We reply with a free assessment and a clear proposal.",
  "ct.mail": "Email", "ct.phone": "Phone", "ct.place": "Location", "ct.name": "Name", "ct.email": "Email address", "ct.msg": "Message",
  "ct.err": "Fill in all three fields with a valid email.", "ct.send": "Send message", "ct.note": "Your email app will open with the message ready.",
  "foot.t": "Smart technology. Real solutions. Results that matter.",
};
const ES = {};
$$("[data-i18n]").forEach((el) => (ES[el.dataset.i18n] = el.textContent));

function renderSectors(lang) {
  const items = SECTORS[lang].map((s) => `<span>${s}</span>`).join("");
  $("#sectors").innerHTML = items + items; // duplicado para el bucle continuo
}
function setLang(lang) {
  const dict = lang === "en" ? EN : ES;
  $$("[data-i18n]").forEach((el) => { el.textContent = dict[el.dataset.i18n]; });
  $$("#lang [data-l]").forEach((s) => s.classList.toggle("is-on", s.dataset.l === lang));
  root.lang = lang;
  renderSectors(lang);
  try { localStorage.setItem("fs-lang", lang); } catch {}
}
let lang = "es";
try { lang = localStorage.getItem("fs-lang") || (navigator.language.startsWith("en") ? "en" : "es"); } catch {}
$("#lang").addEventListener("click", () => setLang(root.lang === "es" ? "en" : "es"));
setLang(lang);

$("#chips").innerHTML = STACK.map((s) => `<li>${s}</li>`).join("");
$("#year").textContent = new Date().getFullYear();

// Barra de navegación: cristal al bajar
const nav = $("#nav");
new IntersectionObserver(([e]) => nav.classList.toggle("is-solid", !e.isIntersecting)).observe(Object.assign(doc.body.appendChild(doc.createElement("div")), { style: "position:absolute;top:0;height:60px;width:1px;pointer-events:none" }));

// Menú móvil
const burger = $("#burger"), menu = $("#menu");
const setMenu = (open) => { menu.classList.toggle("is-open", open); burger.setAttribute("aria-expanded", open); burger.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú"); };
burger.addEventListener("click", () => setMenu(burger.getAttribute("aria-expanded") !== "true"));
$$("a", menu).forEach((a) => a.addEventListener("click", () => setMenu(false)));
doc.addEventListener("keydown", (e) => e.key === "Escape" && setMenu(false));

// Entrada al desplazarse. Si el JS falla, el CSS deja todo visible (la clase .js solo se pone aquí).
$$(".card, .project, .person, .sec__head, .form, .reach, .chips li, .steps li").forEach((el, i) => { el.classList.add("rv"); el.style.setProperty("--d", `${(i % 6) * 0.06}s`); });
root.classList.add("js");
const io = new IntersectionObserver((entries) => entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("is-in"); io.unobserve(e.target); } }), { rootMargin: "0px 0px -8% 0px", threshold: 0.05 });
$$(".rv").forEach((el) => io.observe(el));
requestAnimationFrame(() => $(".hero").classList.add("is-in"));

// Contadores del hero
$$("[data-count]").forEach((el) => {
  if (reduce) return;
  const end = +el.dataset.count, suf = el.dataset.suffix || "", t0 = performance.now();
  const tick = (t) => { const p = Math.min(1, (t - t0) / 1600); el.textContent = Math.round(end * (1 - Math.pow(1 - p, 3))) + suf; if (p < 1) requestAnimationFrame(tick); };
  requestAnimationFrame(tick);
});

// Línea de progreso del método
const steps = $("#steps"), stepItems = $$("li", steps);
function stepProgress() {
  const r = steps.getBoundingClientRect(), h = innerHeight;
  const p = Math.min(1, Math.max(0, (h * 0.62 - r.top) / r.height));
  steps.style.setProperty("--p", p.toFixed(3));
  stepItems.forEach((li) => li.classList.toggle("is-on", li.getBoundingClientRect().top < h * 0.62));
}
addEventListener("scroll", stepProgress, { passive: true }); stepProgress();

// Efectos de cursor (solo con ratón y sin movimiento reducido)
if (fine && !reduce) {
  $$("[data-magnetic]").forEach((b) => {
    b.addEventListener("pointermove", (e) => { const r = b.getBoundingClientRect(); b.style.setProperty("--bx", `${(e.clientX - r.left - r.width / 2) * 0.22}px`); b.style.setProperty("--by", `${(e.clientY - r.top - r.height / 2) * 0.3}px`); });
    b.addEventListener("pointerleave", () => { b.style.setProperty("--bx", "0px"); b.style.setProperty("--by", "0px"); });
  });
  $$("[data-tilt]").forEach((c) => {
    c.addEventListener("pointermove", (e) => {
      const r = c.getBoundingClientRect(), x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
      c.style.setProperty("--ry", `${(x - 0.5) * 8}deg`); c.style.setProperty("--rx", `${(0.5 - y) * 8}deg`);
      c.style.setProperty("--mx", `${x * 100}%`); c.style.setProperty("--my", `${y * 100}%`);
    });
    c.addEventListener("pointerleave", () => { c.style.setProperty("--rx", "0deg"); c.style.setProperty("--ry", "0deg"); });
  });
}
$$("[data-spot]").forEach((c) => c.addEventListener("pointermove", (e) => { const r = c.getBoundingClientRect(); c.style.setProperty("--mx", `${e.clientX - r.left}px`); c.style.setProperty("--my", `${e.clientY - r.top}px`); }));

// Formulario: valida y abre el correo con el mensaje preparado (no hay servidor)
$("#form").addEventListener("submit", (e) => {
  e.preventDefault();
  const f = e.target, v = (n) => f.elements[n].value.trim();
  const ok = { name: !!v("name"), email: /^\S+@\S+\.\S+$/.test(v("email")), msg: !!v("msg") };
  Object.entries(ok).forEach(([k, good]) => f.elements[k].classList.toggle("is-bad", !good));
  $("#err").hidden = Object.values(ok).every(Boolean);
  if (!$("#err").hidden) return;
  const body = `${v("msg")}\n\n— ${v("name")} (${v("email")})`;
  location.href = `mailto:figueira205@proton.me?subject=${encodeURIComponent("Consulta desde la web de Figsoft")}&body=${encodeURIComponent(body)}`;
});

// Escena 3D: carga aparte para que la web funcione aunque WebGL o la CDN fallen
(async () => {
  try {
    const c = $("#stage");
    if (!doc.createElement("canvas").getContext("webgl2")) return;
    const { initScene } = await import("./scene.js");
    initScene(c, { reduced: reduce });
  } catch (err) { console.warn("Escena 3D no disponible:", err); }
})();
