"use strict";
/* Pantalla de inicio */
(function () {
  /* Programas destacados */
  const dest = $("#destacados");
  dest.innerHTML = ["web", "diseno", "marketing"].map(id => TP.tarjeta(TP.curso(id), false)).join("");
  dest.addEventListener("click", e => {
    const b = e.target.closest("button[data-id]");
    if (b) TP.ir(ruta("pages/programas.html") + "?ver=" + b.dataset.id);
  });

  /* Colibrí del hero: saludo e inclinación con el mouse */
  $("#saludo").addEventListener("click", () => volar("¡Los colibríes nunca dejan de aprender!"));
  const visual = $("#visual");
  if (!mov && matchMedia("(hover:hover)").matches) {
    visual.parentElement.addEventListener("mousemove", e => {
      const r = visual.getBoundingClientRect();
      visual.style.setProperty("--ry", ((e.clientX - r.left) / r.width - .5) * 22 + "deg");
      visual.style.setProperty("--rx", ((e.clientY - r.top) / r.height - .5) * -22 + "deg");
    });
  }

  /* Cuenta regresiva a la próxima cohorte (cambia la fecha aquí) */
  const INICIO = new Date("2026-12-01T09:00:00");
  function reloj() {
    let d = INICIO - Date.now();
    while (d < 0) { INICIO.setDate(INICIO.getDate() + 30); d = INICIO - Date.now(); }
    const s = Math.floor(d / 1000);
    [["d", Math.floor(s / 86400)], ["h", Math.floor(s % 86400 / 3600)], ["m", Math.floor(s % 3600 / 60)], ["s", s % 60]]
      .forEach(([k, v]) => { $("#cd-" + k).textContent = v; });
  }
  reloj(); setInterval(reloj, 1000);

  /* Palabras que se escriben solas */
  const PAL = TP.CURSOS.map(c => c.t.toLowerCase());
  const rota = $("#rota");
  if (mov) rota.textContent = PAL[0];
  else {
    let p = 0, k = 0, borrar = false;
    (function tecla() {
      const w = PAL[p];
      k += borrar ? -1 : 1;
      rota.textContent = w.slice(0, k);
      let t = borrar ? 40 : 90;
      if (!borrar && k === w.length) { borrar = true; t = 1400; }
      else if (borrar && k === 0) { borrar = false; p = (p + 1) % PAL.length; t = 300; }
      setTimeout(tecla, t);
    })();
  }

  /* Carrusel de testimonios */
  const pista = $("#pista"), puntos = $("#puntos"), total = pista.children.length;
  let idx = 0, auto;
  puntos.innerHTML = [...pista.children].map((_, i) => `<button aria-label="Ir al testimonio ${i + 1}"></button>`).join("");
  function ir(k) {
    idx = (k + total) % total;
    pista.style.transform = `translateX(-${idx * 100}%)`;
    [...puntos.children].forEach((d, i) => d.setAttribute("aria-current", i === idx));
  }
  const iniciarAuto = () => { clearInterval(auto); if (!mov) auto = setInterval(() => ir(idx + 1), 6000); };
  $("#prev").addEventListener("click", () => { ir(idx - 1); iniciarAuto(); });
  $("#next").addEventListener("click", () => { ir(idx + 1); iniciarAuto(); });
  puntos.addEventListener("click", e => { const i = [...puntos.children].indexOf(e.target); if (i > -1) { ir(i); iniciarAuto(); } });
  $(".carrusel").addEventListener("mouseenter", () => clearInterval(auto));
  $(".carrusel").addEventListener("mouseleave", iniciarAuto);
  ir(0); iniciarAuto();
})();
