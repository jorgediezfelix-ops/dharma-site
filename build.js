#!/usr/bin/env node
// Genera las partes repetidas del sitio a partir de una sola fuente.
// Uso: node build.js
//
// En cada .html el bloque a sustituir se marca así:
//   <!--#include header--> ... <!--/include-->
//
// Bloques disponibles:
//   header, footer          → parciales _header.html y _footer.html
//   filtros                 → chips de filtrado del catálogo (desde products.js)
//   productos               → las 51 piezas
//   productos:<linea>       → piezas de una línea (2026, caballero, dama, liquidacion)
//   destacados              → selección para la portada
//   tecnicas                → fichas de técnicas de impresión
//   lineas                  → tarjetas de las cuatro líneas
//
// Edita el parcial o products.js y vuelve a correr el script.

const fs = require('fs');
const path = require('path');
const { PRODUCTS, LINEAS, TECNICAS, DESTINOS } = require('./products.js');

const dir = __dirname;
const read = f => fs.readFileSync(path.join(dir, f), 'utf8').trim();

const DESTACADOS = ['jaguar-azteca', 'the-frida', 'storm-huichol', 'xolo-flock', 'mariachi', 'craneo-de-yute'];

const card = (p, { badge = true } = {}) => `        <article class="product" data-linea="${p.linea}" data-tema="${p.tema}" data-tecnica="${p.tecnicas.join(' ')}">
          <a class="product-media" href="pieza.html?p=${p.id}">
            <img src="${p.img}" alt="Playera ${p.name} — DHARMA" loading="lazy" decoding="async">
            ${badge ? `<span class="product-badge">${p.lineaNombre}</span>` : ''}
          </a>
          <small>${p.tecnicaNombre}</small>
          <h3><a href="pieza.html?p=${p.id}">${p.name}</a></h3>
          <p>${p.tagline}</p>
          <div class="product-foot"><b>$${p.price} MXN</b><span class="product-link">VER PIEZA +</span></div>
        </article>`;

const grid = (list, opts) => `      <div class="products grid-4">\n${list.map(p => card(p, opts)).join('\n')}\n      </div>`;

const all = Object.values(PRODUCTS);
const byLinea = id => all.filter(p => p.linea === id);

const chips = (label, name, values) => `        <div class="filter-group">
          <span>${label}</span>
          <button class="chip on" data-filter="${name}" data-value="">TODO</button>
${values.map(v => `          <button class="chip" data-filter="${name}" data-value="${v.value}">${v.label}</button>`).join('\n')}
        </div>`;

const filtros = () => {
  const temas = [...new Set(all.map(p => p.tema))].sort();
  const tecnicas = [...new Set(all.flatMap(p => p.tecnicas))]
    .sort((a, b) => TECNICAS[a].nombre.localeCompare(TECNICAS[b].nombre));
  return `      <div class="filters" data-filters>
${chips('LÍNEA', 'linea', Object.values(LINEAS).map(l => ({ value: l.id, label: `${l.nombre} · ${l.año}` })))}
${chips('TEMA', 'tema', temas.map(t => ({ value: t, label: t })))}
${chips('TÉCNICA', 'tecnica', tecnicas.map(t => ({ value: t, label: TECNICAS[t].nombre })))}
        <p class="filter-count"><b>${all.length}</b> piezas a la vista</p>
      </div>`;
};

const tecnicasBlock = () => {
  const orden = ['SERIGRAFIA', 'FLOCK', 'DENSIDAD', 'CORROSION', 'DESCARGA', 'GEL', 'PLASTISOL', 'PEDRERIA', 'NEON', 'SHIMMER', 'PUFF'];
  return `      <div class="tech-grid">
${orden.map((key, i) => {
    const t = TECNICAS[key];
    const piezas = all.filter(p => p.tecnicas.includes(key));
    const muestra = piezas[0];
    return `        <article class="tech-card" id="${key.toLowerCase()}">
          <span>${String(i + 1).padStart(2, '0')}</span>
          <a class="tech-shot" href="catalogo.html?tecnica=${key}">
            <img src="${muestra.img}" alt="${t.nombre} — ${muestra.name}" loading="lazy" decoding="async">
          </a>
          <h3>${t.nombre}</h3>
          <b>${t.claim}</b>
          <p>${t.desc}</p>
          <a class="text-link" href="catalogo.html?tecnica=${key}">VER ${piezas.length} PIEZA${piezas.length > 1 ? 'S' : ''} →</a>
        </article>`;
  }).join('\n')}
      </div>`;
};

const lineasBlock = () => `      <div class="card-grid">
${Object.values(LINEAS).map(l => `        <a class="world-card" style="background-image:url('${l.img}')" href="colecciones.html#${l.id}">
          <span>${l.numero} / ${l.nombre}</span>
          <h3>${l.titulo}</h3>
          <i>${byLinea(l.id).length} PIEZAS · ${l.año} ↗</i>
        </a>`).join('\n')}
      </div>`;

// Explorador de destinos: lista + escenario de imagen + piezas curadas.
const destinosBlock = () => {
  const entries = Object.entries(DESTINOS);
  const rows = entries.map(([id, d], i) => `          <li class="dest-row${i === 0 ? ' is-active' : ''}" data-dest="${id}" style="--dest-img:url('${d.img}')">
            <a href="destinos.html#${id}">
              <b>${d.numero}</b>
              <span class="dest-name">${d.nombre}</span>
              <small>${d.estado}</small>
              <i>${d.coord}</i>
              <em aria-hidden="true">↗</em>
              <span class="dest-wipe" aria-hidden="true"></span>
            </a>
          </li>`).join('\n');

  const stages = entries.map(([id, d], i) => `          <figure class="dest-frame${i === 0 ? ' is-active' : ''}" data-dest="${id}">
            <img src="${d.img}" alt="${d.nombre}, ${d.estado}" loading="lazy" decoding="async">
            <figcaption>
              <span>${d.numero} / ${d.estado}</span>
              <b>${d.claim}</b>
            </figcaption>
          </figure>`).join('\n');

  const picks = entries.map(([id, d], i) => `          <div class="dest-picks${i === 0 ? ' is-active' : ''}" data-dest="${id}">
            <p class="dest-picks-label">PIEZAS PARA ${d.nombre}</p>
            <div class="dest-picks-row">
${d.picks.map(pid => {
    const p = PRODUCTS[pid];
    return `              <a class="dest-pick" href="pieza.html?p=${p.id}">
                <img src="${p.img}" alt="${p.name}" loading="lazy" decoding="async">
                <span><b>${p.name}</b><i>$${p.price.toLocaleString('es-MX')} MXN</i></span>
              </a>`;
  }).join('\n')}
            </div>
          </div>`).join('\n');

  return `      <div class="dest-explorer" data-destinos>
        <ul class="dest-list">
${rows}
        </ul>
        <div class="dest-stage">
          <div class="dest-frames">
${stages}
          </div>
${picks}
        </div>
      </div>`;
};

const blocks = {
  header: () => read('_header.html'),
  footer: () => read('_footer.html'),
  filtros,
  productos: () => grid(all),
  destacados: () => grid(DESTACADOS.map(id => PRODUCTS[id])),
  tecnicas: tecnicasBlock,
  lineas: lineasBlock,
  destinos: destinosBlock
};
for (const l of Object.values(LINEAS)) {
  blocks[`productos:${l.id}`] = () => grid(byLinea(l.id), { badge: false });
}

const pages = fs.readdirSync(dir).filter(f => f.endsWith('.html') && !f.startsWith('_'));
let touched = 0;

for (const page of pages) {
  const file = path.join(dir, page);
  const original = fs.readFileSync(file, 'utf8');
  const unknown = [];

  const updated = original.replace(
    /<!--#include ([\w:]+)-->[\s\S]*?<!--\/include-->/g,
    (match, name) => {
      if (!blocks[name]) {
        unknown.push(name);
        return match;
      }
      return `<!--#include ${name}-->\n${blocks[name]()}\n<!--/include-->`;
    }
  );

  if (unknown.length) console.warn(`  ! ${page}: bloque desconocido → ${unknown.join(', ')}`);
  if (!/<!--#include /.test(original)) console.warn(`  ! ${page}: sin marcadores <!--#include ...-->`);
  if (updated !== original) {
    fs.writeFileSync(file, updated);
    touched++;
    console.log(`  ✓ ${page}`);
  }
}

console.log(`\n${touched} de ${pages.length} páginas actualizadas · ${all.length} piezas en catálogo.`);
