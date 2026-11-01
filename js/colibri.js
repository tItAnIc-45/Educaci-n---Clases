"use strict";
/* Colibrí: vuelos, seguidor del cursor, chispas y transición entre pantallas */
const clonar = mini => {
  const s = document.createElement("img");
  s.src = ruta(mini ? "assets/colibri-mini.png" : "assets/colibri.png");
  s.alt = ""; s.className = "colibri"; s.draggable = false;
  s.setAttribute("aria-hidden", "true");
  return s;
};

function chispas(x, y, n = 12, r0 = 30) {
  if (mov) return;
  for (let i = 0; i < n; i++) {
    const s = document.createElement("i"), a = Math.PI * 2 * i / n, r = r0 + Math.random() * r0;
    s.className = "chispa"; s.style.left = x + "px"; s.style.top = y + "px";
    document.body.append(s);
    s.animate([{ transform: "translate(0,0) scale(1)", opacity: 1 }, { transform: `translate(${Math.cos(a) * r}px,${Math.sin(a) * r}px) scale(0)`, opacity: 0 }], { duration: 600, easing: "ease-out" }).onfinish = () => s.remove();
  }
}

/* Colibrí que cruza la pantalla */
function volar(msg) {
  if (mov) { if (msg) aviso(msg); return; }
  const v = document.createElement("div"), der = Math.random() < .5, y = 80 + Math.random() * (innerHeight - 260);
  v.className = "vuelo" + (der ? " der" : "");
  v.append(clonar());
  document.body.append(v);
  const a = der ? -120 : innerWidth + 30, b = der ? innerWidth + 30 : -120;
  v.animate([
    { transform: `translate(${a}px,${y}px)` },
    { transform: `translate(${a + (b - a) * .3}px,${y - 70}px)` },
    { transform: `translate(${a + (b - a) * .65}px,${y + 40}px)` },
    { transform: `translate(${b}px,${y - 40}px)` }
  ], { duration: 3800, easing: "ease-in-out" }).onfinish = () => v.remove();
  if (msg) aviso(msg);
}

/* Colibrí pequeño que sigue el cursor (solo con mouse) */
if (!mov && matchMedia("(hover:hover)").matches) {
  const s = document.createElement("div");
  s.id = "seguidor"; s.append(clonar(true)); document.body.append(s);
  let x = 0, y = 0, px = 0, py = 0, activo = false;
  addEventListener("mousemove", e => {
    x = e.clientX + 18; y = e.clientY + 18;
    if (!activo) { activo = true; px = x; py = y; s.classList.add("ver"); requestAnimationFrame(sigue); }
  });
  document.addEventListener("mouseleave", () => s.classList.remove("ver"));
  document.addEventListener("mouseenter", () => { if (activo) s.classList.add("ver"); });
  function sigue() {
    s.classList.toggle("der", x - px > 2 ? true : x - px < -2 ? false : s.classList.contains("der"));
    px += (x - px) * .08; py += (y - py) * .08 + Math.sin(performance.now() / 260) * .5;
    s.style.transform = `translate(${px}px,${py}px)`;
    requestAnimationFrame(sigue);
  }
}

/* ---------- Transición entre pantallas ---------- */
const EASE = "cubic-bezier(.65,0,.35,1)";

function cortina(sale) {
  const c = document.createElement("div"), a = document.createElement("div"), i = document.createElement("div");
  c.className = "cortina" + (sale ? " sale" : "");
  a.className = "ave"; i.className = "ave-in";
  i.append(clonar()); a.append(i); c.append(a);
  document.body.append(c);
  return c;
}
function rastro(c) {
  const id = setInterval(() => {
    const r = c.getBoundingClientRect();
    chispas((c.classList.contains("sale") ? r.left : r.right) - 30, innerHeight * .42 + Math.random() * 120, 2, 40);
  }, 50);
  return () => clearInterval(id);
}

/* Sale la pantalla actual: la cortina cruza con el colibri y se abre la nueva página */
function ir(url) {
  if (mov || TP.yendo) { location.href = url; return; }
  TP.yendo = true;
  seguro(() => sessionStorage.setItem("tp-trans", "1"));
  const c = cortina(false), parar = rastro(c);
  let hecho = false;
  const fin = () => { if (hecho) return; hecho = true; parar(); location.href = url; };
  try { c.animate([{ transform: "translateX(-101%)" }, { transform: "translateX(0)" }], { duration: 900, easing: EASE, fill: "forwards" }).onfinish = fin; }
  catch { fin(); }
  setTimeout(fin, 2500);
}
TP.ir = ir;

/* Entra la pantalla nueva: la cortina se retira y el colibrí sigue su vuelo */
(function llegada() {
  const h = document.documentElement;
  if (!h.classList.contains("llega")) return;
  seguro(() => sessionStorage.removeItem("tp-trans"));
  if (mov) { h.classList.remove("llega"); return; }
  const c = cortina(true), parar = rastro(c);
  c.style.transform = "translateX(0)";
  h.classList.remove("llega");
  const quitar = () => { parar(); c.remove(); };
  requestAnimationFrame(() => {
    try { c.animate([{ transform: "translateX(0)" }, { transform: "translateX(101%)" }], { duration: 950, delay: 120, easing: EASE, fill: "forwards" }).onfinish = quitar; }
    catch { quitar(); }
  });
  setTimeout(quitar, 3000);
})();

addEventListener("pageshow", e => {
  if (e.persisted) { TP.yendo = false; $$(".cortina").forEach(x => x.remove()); }
});

/* Intercepta los enlaces internos para usar la transición */
document.addEventListener("click", e => {
  const a = e.target.closest("a[href]");
  if (!a || e.defaultPrevented || e.button || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || a.target === "_blank" || a.hasAttribute("download")) return;
  const u = new URL(a.href, location.href);
  if (u.protocol !== location.protocol || u.host !== location.host) return;
  if (u.pathname === location.pathname && u.search === location.search) return;
  if (!/\.html?$|\/$/.test(u.pathname)) return;
  e.preventDefault();
  ir(u.href);
});

/* Chispas doradas al pulsar botones */
document.addEventListener("click", e => {
  if (e.target.closest("button,.boton")) chispas(e.clientX, e.clientY);
});
