"use strict";
/* Datos compartidos por todas las pantallas */
const TP = window.TP = {};

TP.soles = n => "S/ " + n;

TP.PAGINAS = [
  { id: "inicio", t: "Inicio", u: "index.html" },
  { id: "programas", t: "Programas", u: "pages/programas.html" },
  { id: "test", t: "Test", u: "pages/test.html" },
  { id: "nosotros", t: "Nosotros", u: "pages/nosotros.html" },
  { id: "planificador", t: "Planificador", u: "pages/planificador.html" },
  { id: "contacto", t: "Contacto", u: "pages/contacto.html" }
];

/* h = horas totales del programa */
TP.CURSOS = [
  { id: "web", cat: "Tecnología", t: "Desarrollo web", s: "</>", g: ["#2b5c72", "#122b40"], imagen: "assets/desarrollo-web.jpg", etiqueta: "Popular", d: "Aprende HTML, CSS y JavaScript desde cero y publica tu propio sitio.", dur: "12 semanas", niv: "Inicial", p: 249, h: 60, l: ["Maquetación con HTML y CSS", "JavaScript e interactividad", "Proyecto final publicado"] },
  { id: "datos", cat: "Tecnología", t: "Excel y análisis de datos", s: "Σ", g: ["#2c6b57", "#10302c"], imagen: "assets/excel-datos.jpg", d: "Ordena, analiza y presenta datos para tomar mejores decisiones.", dur: "8 semanas", niv: "Inicial", p: 189, h: 40, l: ["Fórmulas y tablas dinámicas", "Gráficos y paneles", "Caso práctico con datos reales"] },
  { id: "diseno", cat: "Creatividad", t: "Diseño gráfico", s: "✧", g: ["#6c4d78", "#29233f"], imagen: "assets/diseno-grafico.jpg", etiqueta: "Popular", d: "Transforma tus ideas en diseños atractivos y profesionales.", dur: "10 semanas", niv: "Inicial", p: 219, h: 50, l: ["Color, tipografía y composición", "Identidad de marca", "Portafolio de 3 proyectos"] },
  { id: "video", cat: "Creatividad", t: "Edición de video", s: "▶", g: ["#7a3f4d", "#2b1e2e"], imagen: "assets/edicion-video.jpg", d: "Edita videos para redes y proyectos con un flujo de trabajo ordenado.", dur: "8 semanas", niv: "Intermedio", p: 199, h: 40, l: ["Montaje y ritmo", "Audio y color", "Video final para redes"] },
  { id: "marketing", cat: "Negocios", t: "Marketing digital", s: "↗", g: ["#7a6031", "#2a2b31"], imagen: "assets/marketing.png", d: "Aprende a promocionar marcas y proyectos en redes y buscadores.", dur: "10 semanas", niv: "Inicial", p: 229, h: 50, l: ["Estrategia y contenido", "Publicidad en redes", "Métricas y resultados"] },
  { id: "emprende", cat: "Negocios", t: "Emprendimiento", s: "◆", g: ["#3d5a80", "#1b2a41"], imagen: "assets/emprendimiento.jpg", etiqueta: "Nuevo", d: "Convierte una idea en un negocio con un plan claro y validado.", dur: "6 semanas", niv: "Inicial", p: 169, h: 30, l: ["Validación de la idea", "Modelo de negocio", "Plan de lanzamiento"] }
];

TP.curso = id => TP.CURSOS.find(c => c.id === id);

TP.tarjeta = (c, fav) => {
  const raiz = document.body.dataset.raiz || "";
  return `
  <article class="curso" data-cat="${c.cat}" data-id="${c.id}" data-t="${sin(c.t)}" data-p="${c.p}" data-h="${c.h}">
    ${fav ? `<button class="fav" data-fav="${c.id}" aria-pressed="false" aria-label="Guardar ${c.t} en favoritos">♡</button>` : ""}
    <div class="curso-cabecera" style="background:linear-gradient(135deg,${c.g[0]},${c.g[1]})">
      <img src="${raiz}${c.imagen}" alt="${esc(c.t)}" class="curso-img" loading="lazy" width="640" height="360" />
      ${c.etiqueta ? `<span class="badge badge-${sin(c.etiqueta)}">${c.etiqueta}</span>` : ""}
    </div>
    <div class="curso-cont"><small>${c.cat}</small><h3>${c.t}</h3><p>${c.d}</p>
      <div class="meta">${c.dur} · ${c.niv} · ${TP.soles(c.p)}</div>
      <button data-id="${c.id}">Ver detalles</button></div>
  </article>`;
};
