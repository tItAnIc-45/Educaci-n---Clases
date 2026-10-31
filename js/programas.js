"use strict";
/* Pantalla de programas: filtros, búsqueda, orden, favoritos y detalle */
(function () {
  const raiz = document.body.dataset.raiz || "";
  const cont = $("#cursos"), modal = $("#modal");
  let cat = "todos", q = "", orden = "", actual = null;
  const favs = new Set(seguro(() => JSON.parse(localStorage.getItem("fav"))) || []);

  cont.innerHTML = TP.CURSOS.map((c, i) => TP.tarjeta(c, true).replace("<article ", `<article data-i="${i}" `)).join("");

  const orden_fn = {
    "": (a, b) => a.dataset.i - b.dataset.i,
    "p-asc": (a, b) => a.dataset.p - b.dataset.p,
    "p-desc": (a, b) => b.dataset.p - a.dataset.p,
    "h-asc": (a, b) => a.dataset.h - b.dataset.h
  };

  function aplicar() {
    let n = 0;
    $$(".curso").sort(orden_fn[orden]).forEach(c => {
      cont.append(c);
      const ok = (cat === "todos" || (cat === "fav" ? favs.has(c.dataset.id) : c.dataset.cat === cat)) && c.dataset.t.includes(q);
      c.hidden = !ok; if (ok) n++;
      const f = $(".fav", c), on = favs.has(c.dataset.id);
      f.setAttribute("aria-pressed", on); f.textContent = on ? "♥" : "♡";
    });
    const v = $("#vacio");
    v.hidden = n > 0;
    v.textContent = cat === "fav" && !q ? "Aún no tienes favoritos. Toca el corazón de un programa para guardarlo." : "No encontramos programas con esa búsqueda.";
    $("#nfav").textContent = favs.size;
    $("#total").textContent = n === 1 ? "1 programa" : n + " programas";
  }

  $$(".filtro").forEach(b => b.addEventListener("click", () => {
    cat = b.dataset.f;
    $$(".filtro").forEach(x => x.classList.toggle("activo", x === b));
    aplicar();
  }));
  $("#buscar").addEventListener("input", e => { q = sin(e.target.value.trim()); aplicar(); });
  $("#orden").addEventListener("change", e => { orden = e.target.value; aplicar(); });

  document.addEventListener("keydown", e => {
    if (e.key !== "/" || /INPUT|SELECT|TEXTAREA/.test(document.activeElement.tagName)) return;
    e.preventDefault(); $("#buscar").focus();
  });

  /* Detalle del programa */
  function abrir(id) {
    actual = TP.curso(id);
    if (!actual) return;
    const img = $("#m-img");
    img.src = raiz + actual.imagen;
    img.alt = actual.t;
    $("#m-cat").textContent = actual.cat;
    $("#m-titulo").textContent = actual.t;
    $("#m-desc").textContent = actual.d;
    $("#m-lista").innerHTML = actual.l.map(i => `<li>${i}</li>`).join("");
    $("#m-dur").textContent = actual.dur + " · " + actual.h + " horas";
    $("#m-niv").textContent = "Nivel " + actual.niv.toLowerCase();
    $("#m-precio").textContent = TP.soles(actual.p);
    $("#m-cuotas").value = "1"; cuota();
    if (!modal.open) modal.showModal();
  }
  function cuota() {
    const n = +$("#m-cuotas").value;
    $("#m-cuota").textContent = n === 1 ? TP.soles(actual.p) : `${n} × ${TP.soles(Math.ceil(actual.p / n))}`;
  }
  $("#m-cuotas").addEventListener("change", cuota);

  cont.addEventListener("click", e => {
    const f = e.target.closest(".fav");
    if (f) {
      const id = f.dataset.fav;
      favs.has(id) ? favs.delete(id) : favs.add(id);
      seguro(() => localStorage.setItem("fav", JSON.stringify([...favs])));
      aplicar();
      return aviso(favs.has(id) ? "Guardado en favoritos ♥" : "Quitado de favoritos");
    }
    const b = e.target.closest("button[data-id]");
    if (b) abrir(b.dataset.id);
  });

  $("#cerrar").addEventListener("click", () => modal.close());
  modal.addEventListener("click", e => { if (e.target === modal) modal.close(); });
  $("#inscribir").addEventListener("click", () => { modal.close(); TP.ir(ruta("pages/contacto.html") + "?programa=" + actual.id); });
  $("#planear").addEventListener("click", () => { modal.close(); TP.ir(ruta("pages/planificador.html") + "?programa=" + actual.id); });
  $("#compartir").addEventListener("click", async () => {
    const texto = `${actual.t} en TUPLUSEDUCA: ${actual.d}`;
    if (navigator.share) { await seguro(() => navigator.share({ title: actual.t, text: texto, url: location.href })); return; }
    copiar(texto + " " + location.href, "Enlace copiado");
  });

  aplicar();
  if (params.get("ver")) abrir(params.get("ver"));
})();
