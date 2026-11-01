"use strict";
/* Pantalla Nosotros: línea de tiempo que se llena al hacer scroll */
(function () {
  const linea = $(".linea"), prog = $(".prog", linea), hitos = $$(".hito", linea);
  function pintar() {
    const r = linea.getBoundingClientRect(), ref = innerHeight * .6;
    prog.style.height = Math.max(0, Math.min(r.height, ref - r.top)) + "px";
    hitos.forEach(h => h.classList.toggle("on", h.getBoundingClientRect().top < ref));
  }
  addEventListener("scroll", pintar, { passive: true });
  addEventListener("resize", pintar);
  pintar();
})();
