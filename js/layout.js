"use strict";
/* Cabecera, pie de página y elementos flotantes compartidos */
(function () {
  const pag = document.body.dataset.pagina;
  const enlaces = TP.PAGINAS.map(p => `<a href="${ruta(p.u)}"${p.id === pag ? ' class="activo" aria-current="page"' : ""}>${p.t}</a>`).join("");
  const lista = TP.PAGINAS.map(p => `<li><a href="${ruta(p.u)}">${p.t}</a></li>`).join("");
  const logo = `<a href="${ruta("index.html")}" class="logo"><img class="colibri" src="${ruta("assets/colibri-mini.png")}" alt="" aria-hidden="true">TUPLUS<b>EDUCA</b></a>`;

  document.body.insertAdjacentHTML("afterbegin", `
<div class="progreso" id="progreso"></div>
<header class="header" id="header">
  ${logo}
  <nav id="menu" aria-label="Principal">${enlaces}</nav>
  <div class="acciones">
    <div class="acentos" role="group" aria-label="Color de acento">
      <button class="punto" data-c="" style="--c:#d4af37" aria-label="Dorado" aria-pressed="true"></button>
      <button class="punto" data-c="#35b8a0" data-c2="#7fe0cc" style="--c:#35b8a0" aria-label="Turquesa" aria-pressed="false"></button>
      <button class="punto" data-c="#e0749b" data-c2="#f5a3bf" style="--c:#e0749b" aria-label="Rosa" aria-pressed="false"></button>
      <button class="punto" data-c="#6fa8ff" data-c2="#a9ccff" style="--c:#6fa8ff" aria-label="Azul" aria-pressed="false"></button>
    </div>
    <button class="icono" id="abrirPaleta" aria-label="Buscar en el sitio (Ctrl+K)">⌕</button>
    <button id="tema" class="icono" aria-label="Cambiar tema">☾</button>
    <button id="hamburguesa" class="icono" aria-label="Abrir menú" aria-expanded="false" aria-controls="menu">☰</button>
  </div>
</header>`);

  document.body.insertAdjacentHTML("beforeend", `
<footer>
  <div class="pie">
    <div>${logo}<p>Aprende hoy. Construye tu mañana.</p></div>
    <div><h4>Explora</h4><ul>${lista}</ul></div>
    <div><h4>Recibe novedades</h4><p>Un correo al mes con programas y consejos. Sin spam.</p>
      <form class="boletin" id="boletin" novalidate>
        <input type="email" id="bcorreo" placeholder="tu@correo.com" autocomplete="email" aria-label="Correo para recibir novedades">
        <button class="boton" type="submit">Suscribirme</button>
      </form>
      <small class="error" id="berr"></small></div>
  </div>
  <div class="abajo">© <span id="anio"></span> TUPLUSEDUCA</div>
</footer>
<dialog id="paleta" aria-label="Buscar en el sitio">
  <input id="pq" type="search" placeholder="Busca una página o un programa…" autocomplete="off" aria-label="Buscar">
  <ul id="pl" role="listbox"></ul>
  <small>↑ ↓ para moverte · Enter para abrir · Esc para cerrar</small>
</dialog>
<a class="whatsapp" href="https://wa.me/51999999999?text=Hola%2C%20quiero%20informaci%C3%B3n%20de%20los%20programas" target="_blank" rel="noopener" aria-label="Escribir por WhatsApp">💬</a>
<button id="subir" class="icono" aria-label="Volver arriba" hidden>↑</button>
<div id="toast" role="status" aria-live="polite"></div>`);
})();
