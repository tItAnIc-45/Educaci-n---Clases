"use strict";
/* Pantalla de contacto: formulario con validación y datos copiables */
(function () {
  const form = $("#formulario"), selP = $("#programa");
  selP.insertAdjacentHTML("beforeend", TP.CURSOS.map(c => `<option value="${c.id}">${c.t}</option>`).join(""));
  if (TP.curso(params.get("programa"))) selP.value = params.get("programa");

  const reglas = {
    nombre: v => v.trim().length >= 3 || "Escribe tu nombre completo.",
    correo: v => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) || "Escribe un correo válido, por ejemplo nombre@correo.com.",
    programa: v => !!v || "Elige un programa."
  };
  function validar(campo) {
    const r = reglas[campo.name](campo.value);
    campo.setAttribute("aria-invalid", r !== true);
    $(`[data-e="${campo.name}"]`).textContent = r === true ? "" : r;
    return r === true;
  }
  $$("input,select", form).forEach(c => c.addEventListener("blur", () => validar(c)));
  form.addEventListener("submit", e => {
    e.preventDefault();
    const campos = $$("input,select", form);
    const ok = campos.map(validar).every(Boolean);
    if (!ok) return campos.find(c => c.getAttribute("aria-invalid") === "true").focus();
    const nombre = form.nombre.value.trim().split(" ")[0];
    form.reset();
    aviso(`¡Gracias, ${nombre}! Te escribiremos pronto.`);
    volar();
  });

  $$("[data-copiar]").forEach(b => b.addEventListener("click", () => copiar(b.dataset.copiar, "Copiado: " + b.dataset.copiar)));
})();
