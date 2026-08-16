#!/usr/bin/env node
// Genera las partes repetidas del sitio a partir de una sola fuente.
// Uso: node build.js
//
// En cada .html el bloque a sustituir se marca así:
//   <!--#include header--> ... <!--/include-->
//
// Bloques disponibles:
//   seo                     → title, description, canonical, Open Graph y JSON-LD
//   header, footer          → parciales _header.html y _footer.html
//   filtros                 → chips de filtrado del catálogo (desde products.js)
//   productos               → las 51 piezas
//   productos:<linea>       → piezas de una línea (2026, caballero, dama, liquidacion)
//   destacados              → selección para la portada
//   tecnicas                → fichas de técnicas de impresión
//   lineas                  → tarjetas de las cuatro líneas
//
// Además escribe, sin marcadores:
//   pieza/<id>.html         → una ficha estática por pieza, con su propia URL
//   sitemap.xml, robots.txt → derivados de SITE.origin en seo.js
//
// Edita el parcial, products.js o seo.js y vuelve a correr el script.

const fs = require('fs');
const path = require('path');
const { PRODUCTS, LINEAS, TECNICAS, COLORES, DESTINOS } = require('./products.js');
const seo = require('./seo.js');
const { SITE, PAGES } = seo;

const dir = __dirname;
const read = f => fs.readFileSync(path.join(dir, f), 'utf8').trim();

const DESTACADOS = ['jaguar-azteca', 'the-frida', 'storm-huichol', 'xolo-flock', 'mariachi', 'craneo-de-yute'];

const card = (p, { badge = true } = {}) => `        <article class="product" data-linea="${p.linea}" data-tema="${p.tema}" data-tecnica="${p.tecnicas.join(' ')}">
          <a class="product-media" href="${seo.productUrl(p)}">
            <img src="${p.img}" alt="Playera ${p.name} — DHARMA" loading="lazy" decoding="async">
            ${badge ? `<span class="product-badge">${p.lineaNombre}</span>` : ''}
          </a>
          <small>${p.tecnicaNombre}</small>
          <h3><a href="${seo.productUrl(p)}">${p.name}</a></h3>
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

const ORDEN_TECNICAS = ['SERIGRAFIA', 'FLOCK', 'DENSIDAD', 'CORROSION', 'DESCARGA', 'GEL', 'PLASTISOL', 'PEDRERIA', 'NEON', 'SHIMMER', 'PUFF'];

const tecnicasBlock = () => `      <div class="tech-grid">
${ORDEN_TECNICAS.map((key, i) => {
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
    return `              <a class="dest-pick" href="${seo.productUrl(p)}">
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

/* ——————————————————— bloque SEO ———————————————————
 * Un solo marcador <!--#include seo--> por página; los metadatos y los datos
 * estructurados salen de seo.js según el nombre del archivo.
 */
const seoBlock = (pageKey, html) => {
  const meta = PAGES[pageKey];
  if (!meta) {
    console.warn(`  ! ${pageKey}.html: sin metadatos en seo.js → se omite el bloque SEO`);
    return '';
  }

  const nodos = [seo.orgNode()];
  if (pageKey === 'index') nodos.push(seo.webSiteNode());
  if (meta.crumbs) nodos.push(seo.breadcrumbNode(meta.crumbs, [meta.crumb, meta.url]));

  if (pageKey === 'catalogo') {
    nodos.push(seo.itemListNode('Catálogo DHARMA', all.map(p => ({ name: p.name, url: seo.productUrl(p) }))));
  }
  if (pageKey === 'colecciones') {
    nodos.push(seo.itemListNode('Colecciones DHARMA', Object.values(LINEAS)
      .map(l => ({ name: `${l.nombre} · ${l.año}`, url: `colecciones.html#${l.id}` }))));
  }
  if (pageKey === 'tecnicas') {
    nodos.push(seo.itemListNode('Técnicas de impresión DHARMA', ORDEN_TECNICAS
      .map(k => ({ name: TECNICAS[k].nombre, url: `tecnicas.html#${k.toLowerCase()}` }))));
  }
  if (pageKey === 'destinos') {
    nodos.push(seo.itemListNode('Destinos DHARMA', Object.entries(DESTINOS)
      .map(([id, d]) => ({ name: d.nombre, url: `destinos.html#${id}` }))));
  }
  if (pageKey === 'contacto') {
    nodos.push({
      '@type': 'ContactPage',
      name: meta.crumb,
      url: seo.abs(meta.url),
      mainEntity: { '@id': `${SITE.origin}/#organization` }
    });
  }
  // Las preguntas frecuentes se leen del propio HTML para que nunca se desfasen.
  nodos.push(seo.faqNode(html));

  return seo.seoHead(meta, nodos);
};

const blocks = {
  seo: seoBlock,
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
  const pageKey = page.replace(/\.html$/, '');
  const unknown = [];

  const updated = original
    .replace(
      /<!--#include ([\w:]+)-->[\s\S]*?<!--\/include-->/g,
      (match, name) => {
        if (!blocks[name]) {
          unknown.push(name);
          return match;
        }
        return `<!--#include ${name}-->\n${blocks[name](pageKey, original)}\n<!--/include-->`;
      }
    )
    // Un solo token de caché para CSS y JS, tomado de seo.js.
    .replace(/(styles\.css|script\.js)\?v=[^"']*/g, `$1?v=${SITE.assetVersion}`);

  if (unknown.length) console.warn(`  ! ${page}: bloque desconocido → ${unknown.join(', ')}`);
  if (!/<!--#include /.test(original)) console.warn(`  ! ${page}: sin marcadores <!--#include ...-->`);
  if (updated !== original) {
    fs.writeFileSync(file, updated);
    touched++;
    console.log(`  ✓ ${page}`);
  }
}

/* ——————————————————— fichas estáticas de producto ———————————————————
 * Viven en pieza/<id>.html, así que los enlaces relativos de los parciales
 * compartidos necesitan un ../ delante. Anclas, mailto y absolutas se quedan.
 */
const rebase = (html, prefijo) =>
  html.replace(
    /\b(href|src)="(?!https?:|\/\/|#|mailto:|tel:|data:)([^"]*)"/g,
    (_, attr, url) => `${attr}="${prefijo}${url}"`
  );

/* Fotos por color.
 *
 * Convención: img/prod/<pieza>-<color>.jpg — por ejemplo
 * img/prod/jaguar-azteca-blanco.jpg. El color es la clave de COLORES en
 * minúsculas (negro, blanco, gris, marino, rojo, arena).
 *
 * Se busca en el disco al construir, así que el navegador nunca pide una
 * foto que no existe. Basta con dejar el archivo en img/prod/ y volver a
 * correr `node build.js` para que el circulito empiece a cambiar la imagen.
 */
const EXTENSIONES = ['jpg', 'jpeg', 'png', 'webp'];

const imagenesPorColor = p => {
  const mapa = {};
  for (const c of p.colores) {
    const base = `img/prod/${p.id}-${c.toLowerCase()}`;
    const ext = EXTENSIONES.find(e => fs.existsSync(path.join(dir, `${base}.${e}`)));
    if (ext) mapa[c] = `${base}.${ext}`;
  }
  // La foto principal hace de color por defecto cuando no tiene la suya.
  if (!mapa[p.colores[0]]) mapa[p.colores[0]] = p.img;
  return mapa;
};

// Piezas hermanas: mismo tema primero, luego misma técnica (igual que en script.js).
const hermanasDe = p => {
  const pool = all.filter(o => o.id !== p.id);
  return [
    ...pool.filter(o => o.tema === p.tema),
    ...pool.filter(o => o.tema !== p.tema && o.tecnicas.some(t => p.tecnicas.includes(t)))
  ].slice(0, 4);
};

const header = rebase(read('_header.html'), '../');
const footer = rebase(read('_footer.html'), '../');
const piezaDir = path.join(dir, 'pieza');
fs.mkdirSync(piezaDir, { recursive: true });

// Borra fichas de piezas que ya no existen en products.js.
for (const f of fs.readdirSync(piezaDir)) {
  if (f.endsWith('.html') && !PRODUCTS[f.replace(/\.html$/, '')]) {
    fs.unlinkSync(path.join(piezaDir, f));
    console.log(`  − pieza/${f} (ya no está en el catálogo)`);
  }
}

let fotosColor = 0;

for (const p of all) {
  const imagenes = imagenesPorColor(p);
  // El color por defecto siempre está; solo cuentan las fotos propias.
  fotosColor += Object.keys(imagenes).length - 1;
  fs.writeFileSync(
    path.join(piezaDir, `${p.id}.html`),
    seo.productPage(p, {
      linea: LINEAS[p.linea],
      tecnicas: TECNICAS,
      colores: COLORES,
      imagenes,
      header,
      footer,
      relacionadas: hermanasDe(p)
    })
  );
}

/* ——————————————————— sitemap.xml y robots.txt ——————————————————— */

const hoy = new Date().toISOString().slice(0, 10);

const urls = [
  ...Object.entries(PAGES)
    .filter(([, m]) => !m.noindex)
    .map(([key, m]) => ({ loc: seo.abs(m.url), priority: key === 'index' ? '1.0' : m.priority || '0.7' })),
  ...all.map(p => ({ loc: seo.abs(seo.productUrl(p)), priority: '0.8' }))
];

fs.writeFileSync(path.join(dir, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>
<!-- Generado por build.js · el dominio sale de SITE.origin en seo.js -->
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(u => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${hoy}</lastmod>
    <priority>${u.priority}</priority>
  </url>`).join('\n')}
</urlset>
`);

fs.writeFileSync(path.join(dir, 'robots.txt'), `# Generado por build.js · el dominio sale de SITE.origin en seo.js
User-agent: *
Allow: /
Disallow: /carrito.html

Sitemap: ${SITE.origin}/sitemap.xml
`);

console.log(`\n${touched} de ${pages.length} páginas actualizadas · ${all.length} fichas en pieza/ · ${urls.length} URLs en sitemap.xml`);
console.log(`Dominio actual: ${SITE.origin} (cámbialo en seo.js → SITE.origin)`);
console.log(
  fotosColor
    ? `Fotos por color: ${fotosColor} detectadas en img/prod/`
    : 'Fotos por color: ninguna todavía. Deja img/prod/<pieza>-<color>.jpg\n' +
      '  (p. ej. img/prod/jaguar-azteca-blanco.jpg) y vuelve a correr este script.'
);
