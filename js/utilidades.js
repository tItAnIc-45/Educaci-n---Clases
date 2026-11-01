"use strict";
/* Funciones de ayuda usadas en todo el sitio */
const $ = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => [...c.querySelectorAll(s)];
const seguro = fn => { try { return fn(); } catch { return null; } };
const mov = matchMedia("(prefers-reduced-motion: reduce)").matches;
const raiz = document.body.dataset.raiz || "";
const ruta = u => raiz + u;
const params = new URLSearchParams(location.search);
const esc = s => String(s).replace(/[&<>"']/g, m => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[m]));
const sin = s => String(s).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

let _aviso;
function aviso(msg) {
  let t = $("#toast");
  if (!t) { t = document.createElement("div"); t.id = "toast"; t.setAttribute("role", "status"); document.body.append(t); }
  t.textContent = msg;
  t.classList.add("ver");
  clearTimeout(_aviso);
  _aviso = setTimeout(() => t.classList.remove("ver"), 3500);
}

async function copiar(texto, ok = "Copiado") {
  try { await navigator.clipboard.writeText(texto); aviso(ok); }
  catch { aviso("No se pudo copiar"); }
}

function descargar(nombre, contenido, tipo) {
  const url = URL.createObjectURL(new Blob([contenido], { type: tipo }));
  const a = document.createElement("a");
  a.href = url; a.download = nombre;
  document.body.append(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
