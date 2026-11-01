"use strict";
/* Test: ¿qué programa es para ti? */
(function () {
  const PREG = [
    { q: "¿Qué disfrutas más hacer?", o: [["Resolver problemas y armar cosas", "web:2,datos:2"], ["Crear, dibujar o grabar", "diseno:2,video:2"], ["Organizar, vender e imaginar negocios", "marketing:2,emprende:2"]] },
    { q: "¿Qué quieres lograr primero?", o: [["Crear mi sitio o mi portafolio", "web:2,diseno:1"], ["Conseguir un mejor empleo", "datos:2,marketing:1,web:1"], ["Lanzar mi propio proyecto", "emprende:2,marketing:1,video:1"]] },
    { q: "¿Cuánto tiempo tienes cada semana?", o: [["2 a 4 horas", "emprende:1,datos:1"], ["4 a 6 horas", "diseno:1,marketing:1,video:1"], ["6 horas o más", "web:1,video:1"]] }
  ];
  const quiz = $("#quiz");
  let paso = 0, pts = {}, hist = [];

  function pintar() {
    if (paso < PREG.length) {
      const p = PREG[paso];
      quiz.innerHTML = `<div class="barra"><i style="width:${paso / PREG.length * 100}%"></i></div>
        <small>Pregunta ${paso + 1} de ${PREG.length}</small><h3>${p.q}</h3>` +
        p.o.map((o, i) => `<button class="opcion" data-i="${i}">${o[0]}</button>`).join("") +
        (paso ? `<button class="atras" data-atras>‹ Volver</button>` : "");
      return;
    }
    const id = Object.entries(pts).sort((a, b) => b[1] - a[1])[0][0], c = TP.curso(id);
    seguro(() => localStorage.setItem("test", id));
    quiz.innerHTML = `<div class="barra"><i style="width:100%"></i></div><small style="color:var(--dorado);font-weight:700">Tu mejor opción</small><h3>${c.t}</h3>
      <div class="resultado"><p>${c.d} Dura ${c.dur} y cuesta ${TP.soles(c.p)}.</p>
      <a class="boton" href="programas.html?ver=${c.id}">Ver detalles</a>
      <a class="boton sec" href="planificador.html?programa=${c.id}">Planificar mi estudio</a>
      <a class="boton sec" href="contacto.html?programa=${c.id}">Inscribirme</a>
      <button class="boton sec" data-reiniciar>Repetir test</button></div>`;
    chispas(innerWidth / 2, innerHeight / 3, 18, 60);
  }

  quiz.addEventListener("click", e => {
    const b = e.target.closest("button");
    if (!b) return;
    if (b.dataset.i) {
      const sumas = {};
      PREG[paso].o[+b.dataset.i][1].split(",").forEach(x => { const [k, v] = x.split(":"); sumas[k] = +v; });
      hist.push(sumas);
      Object.entries(sumas).forEach(([k, v]) => { pts[k] = (pts[k] || 0) + v; });
      paso++;
    } else if (b.dataset.atras !== undefined) {
      const u = hist.pop(); Object.entries(u).forEach(([k, v]) => { pts[k] -= v; }); paso--;
    } else if (b.dataset.reiniciar !== undefined) { paso = 0; pts = {}; hist = []; }
    else return;
    pintar();
  });
  pintar();
})();
