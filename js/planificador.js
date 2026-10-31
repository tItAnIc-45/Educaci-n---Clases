"use strict";
/* Planificador de estudio: calcula fechas, cuotas y descarga el plan */
(function () {
  const selP = $("#pl-prog"), hrs = $("#pl-horas"), ini = $("#pl-inicio"), cuo = $("#pl-cuotas");
  selP.innerHTML = TP.CURSOS.map(c => `<option value="${c.id}">${c.t}</option>`).join("");
  const pre = params.get("programa") || seguro(() => localStorage.getItem("test"));
  if (pre && TP.curso(pre)) selP.value = pre;

  const iso = d => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  const lunes = new Date(); lunes.setDate(lunes.getDate() + ((8 - lunes.getDay()) % 7 || 7));
  ini.value = iso(lunes); ini.min = iso(new Date());

  const larga = d => d.toLocaleDateString("es-PE", { day: "numeric", month: "long", year: "numeric" });
  const corta = d => d.toLocaleDateString("es-PE", { day: "numeric", month: "short" });
  let plan = null;

  function calcular() {
    const c = TP.curso(selP.value), h = +hrs.value, n = +cuo.value;
    $("#pl-h").textContent = h + (h === 1 ? " hora" : " horas");
    const inicio = new Date(ini.value + "T09:00:00");
    if (isNaN(inicio)) return;
    const sem = Math.ceil(c.h / h), fin = new Date(inicio);
    fin.setDate(fin.getDate() + sem * 7 - 1);
    const cuota = n === 1 ? TP.soles(c.p) : `${n} × ${TP.soles(Math.ceil(c.p / n))}`;
    const filas = [];
    for (let w = 0; w < sem; w++) {
      const d = new Date(inicio); d.setDate(d.getDate() + w * 7);
      const tema = w === sem - 1 ? "Proyecto final y entrega" : c.l[Math.min(Math.floor(w * c.l.length / sem), c.l.length - 1)];
      filas.push({ w: w + 1, d, tema });
    }
    plan = { c, h, n, sem, inicio, fin, cuota, filas };
    $("#pl-sem").textContent = sem;
    $("#pl-fin").textContent = larga(fin);
    $("#pl-cuota").textContent = cuota;
    $("#pl-tot").textContent = c.h + " h";
    $("#pl-lista").innerHTML = filas.map(f => `<li><b>Semana ${f.w}</b> · ${corta(f.d)} — ${esc(f.tema)}</li>`).join("");
    $("#pl-ins").href = `contacto.html?programa=${c.id}`;
  }
  [selP, hrs, ini, cuo].forEach(el => el.addEventListener("input", calcular));

  const texto = () => `MI PLAN DE ESTUDIO · TUPLUSEDUCA
Programa: ${plan.c.t}
Inicio: ${larga(plan.inicio)}
Fin estimado: ${larga(plan.fin)} (${plan.sem} semanas, ${plan.h} h por semana)
Pago: ${plan.cuota}

${plan.filas.map(f => `Semana ${f.w} (${corta(f.d)}): ${f.tema}`).join("\n")}
`;

  $("#pl-copiar").addEventListener("click", () => copiar(texto(), "Plan copiado"));
  $("#pl-txt").addEventListener("click", () => { descargar("mi-plan-tupluseduca.txt", texto(), "text/plain;charset=utf-8"); aviso("Plan descargado"); });
  $("#pl-ics").addEventListener("click", () => {
    const f = d => `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}T190000`;
    const mins = Math.max(30, Math.round(plan.h / 3 * 60 / 15) * 15);
    const ics = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//TUPLUSEDUCA//ES", "BEGIN:VEVENT",
      `UID:${Date.now()}@tupluseduca`, `DTSTAMP:${f(new Date()).replace("T190000", "T000000")}Z`,
      `DTSTART:${f(plan.inicio)}`, `DURATION:PT${mins}M`, `RRULE:FREQ=WEEKLY;BYDAY=MO,WE,FR;COUNT=${plan.sem * 3}`,
      `SUMMARY:Estudiar ${plan.c.t} (TUPLUSEDUCA)`, "END:VEVENT", "END:VCALENDAR"].join("\r\n");
    descargar("estudio-tupluseduca.ics", ics, "text/calendar;charset=utf-8");
    aviso("Calendario descargado: ábrelo para agregarlo");
  });
  calcular();
})();
