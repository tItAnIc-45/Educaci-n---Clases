"use strict";
/* Comportamientos comunes: tema, acento, menú, scroll, buscador, boletín */
const raizDoc = document.documentElement;

/* Tema claro / oscuro */
const btnTema = $("#tema");
function pintarTema() {
  const claro = raizDoc.dataset.tema === "claro";
  btnTema.textContent = claro ? "☀" : "☾";
  btnTema.setAttribute("aria-label", claro ? "Cambiar a modo oscuro" : "Cambiar a modo claro");
}
btnTema.addEventListener("click", () => {
  raizDoc.dataset.tema = raizDoc.dataset.tema === "claro" ? "oscuro" : "claro";
  seguro(() => localStorage.setItem("tema", raizDoc.dataset.tema));
  pintarTema();
});
pintarTema();

/* Color de acento */
function acento(b) {
  const s = raizDoc.style;
  b.dataset.c ? (s.setProperty("--dorado", b.dataset.c), s.setProperty("--dorado2", b.dataset.c2)) : (s.removeProperty("--dorado"), s.removeProperty("--dorado2"));
  $$(".punto").forEach(x => x.setAttribute("aria-pressed", x === b));
}
$$(".punto").forEach(b => b.addEventListener("click", () => { acento(b); seguro(() => localStorage.setItem("acento", b.dataset.c)); }));
const _ac = seguro(() => localStorage.getItem("acento"));
if (_ac) acento($(`.punto[data-c="${_ac}"]`) || $(".punto"));

/* Menú móvil */
const menu = $("#menu"), ham = $("#hamburguesa");
function menuAbierto(abrir) {
  menu.classList.toggle("abierto", abrir);
  ham.setAttribute("aria-expanded", abrir);
  ham.textContent = abrir ? "✕" : "☰";
}
ham.addEventListener("click", () => menuAbierto(!menu.classList.contains("abierto")));
menu.addEventListener("click", e => { if (e.target.closest("a")) menuAbierto(false); });

/* Scroll: progreso, sombra, volver arriba */
const subir = $("#subir");
function alScroll() {
  const max = document.documentElement.scrollHeight - innerHeight;
  $("#progreso").style.width = (max > 0 ? scrollY / max * 100 : 0) + "%";
  $("#header").classList.toggle("sombra", scrollY > 10);
  subir.hidden = scrollY < 600;
}
addEventListener("scroll", alScroll, { passive: true });
alScroll();
subir.addEventListener("click", () => scrollTo({ top: 0, behavior: mov ? "auto" : "smooth" }));

/* Contadores y aparición suave */
const contar = el => {
  const n = +el.dataset.n, s = el.dataset.s || "", t0 = performance.now();
  const paso = t => {
    const p = Math.min((t - t0) / 1400, 1);
    el.textContent = Math.round(n * (1 - Math.pow(1 - p, 3))).toLocaleString("es-PE") + (p === 1 ? s : "");
    if (p < 1) requestAnimationFrame(paso);
  };
  requestAnimationFrame(paso);
};
const obs = new IntersectionObserver(es => es.forEach(e => {
  if (!e.isIntersecting) return;
  e.target.classList.add("ok");
  $$("[data-n]", e.target).forEach(mov ? el => { el.textContent = (+el.dataset.n).toLocaleString("es-PE") + (el.dataset.s || ""); } : contar);
  obs.unobserve(e.target);
}), { threshold: 0.12 });
$$("main > section:not(.hero)").forEach(s => { s.classList.add("reveal"); obs.observe(s); });

/* Buscador rápido (Ctrl+K) */
const paleta = $("#paleta"), pq = $("#pq"), pl = $("#pl");
const ITEMS = [
  ...TP.PAGINAS.map(p => ({ t: "Ir a " + p.t, s: "Página", u: ruta(p.u) })),
  ...TP.CURSOS.map(c => ({ t: c.t, s: c.cat, u: ruta("pages/programas.html") + "?ver=" + c.id }))
];
let lista = ITEMS, sel = 0;
function pintarPaleta() {
  const q = sin(pq.value.trim());
  lista = ITEMS.filter(i => sin(i.t + " " + i.s).includes(q));
  sel = Math.min(sel, Math.max(lista.length - 1, 0));
  pl.innerHTML = lista.length
    ? lista.map((i, k) => `<li role="option" data-k="${k}" aria-selected="${k === sel}"><span>${esc(i.t)}</span><small>${esc(i.s)}</small></li>`).join("")
    : `<li><small>No encontramos nada con esa búsqueda.</small></li>`;
}
function abrirPaleta() { pq.value = ""; sel = 0; pintarPaleta(); paleta.showModal(); pq.focus(); }
function irPaleta(k) { const i = lista[k]; if (!i) return; paleta.close(); TP.ir(i.u); }
$("#abrirPaleta").addEventListener("click", abrirPaleta);
pq.addEventListener("input", () => { sel = 0; pintarPaleta(); });
pq.addEventListener("keydown", e => {
  if (e.key === "ArrowDown" || e.key === "ArrowUp") {
    e.preventDefault();
    sel = (sel + (e.key === "ArrowDown" ? 1 : -1) + lista.length) % Math.max(lista.length, 1);
    pintarPaleta(); $('[aria-selected="true"]', pl)?.scrollIntoView({ block: "nearest" });
  } else if (e.key === "Enter") { e.preventDefault(); irPaleta(sel); }
});
pl.addEventListener("click", e => { const li = e.target.closest("[data-k]"); if (li) irPaleta(+li.dataset.k); });
paleta.addEventListener("click", e => { if (e.target === paleta) paleta.close(); });
document.addEventListener("keydown", e => {
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") { e.preventDefault(); paleta.open ? paleta.close() : abrirPaleta(); }
  else if (e.key === "Escape") menuAbierto(false);
});

/* Boletín del pie de página */
$("#boletin").addEventListener("submit", e => {
  e.preventDefault();
  const c = $("#bcorreo"), ok = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(c.value.trim());
  $("#berr").textContent = ok ? "" : "Escribe un correo válido, por ejemplo nombre@correo.com.";
  c.setAttribute("aria-invalid", !ok);
  if (!ok) return c.focus();
  c.value = "";
  aviso("¡Listo! Te avisaremos de las novedades.");
  volar();
});

$("#anio").textContent = new Date().getFullYear();
