/*  DHARMA · configuración y generación de metadatos SEO
 *
 *  Todo lo que Google necesita vive aquí: el dominio, los metadatos de cada
 *  página, los datos estructurados y las fichas estáticas de producto.
 *  `build.js` consume este módulo; no se edita nada a mano en los .html.
 *
 *  AJUSTAR ANTES DE PUBLICAR:
 *    · SITE.origin       → el dominio definitivo (hoy es un placeholder)
 *    · SITE.sameAs       → las URLs reales de redes sociales
 *    · SITE.envio        → tarifas y tiempos reales (hoy coinciden con envios.html,
 *                          que también está marcado como pendiente de ajustar)
 */

const SITE = {
  // Único lugar donde vive el dominio: cámbialo aquí y corre `node build.js`.
  // Hoy el sitio se sirve desde GitHub Pages en un subdirectorio. Cuando
  // dharma.mx apunte aquí, basta con sustituir esta línea por
  // 'https://dharma.mx' y volver a construir.
  origin: 'https://kinvitalgroup.com/dharma-site',
  nombre: 'DHARMA',
  nombreLargo: 'DHARMA — Wear Mexico',
  lang: 'es-MX',
  locale: 'es_MX',
  moneda: 'MXN',
  email: 'hola@dharma.mx',
  whatsapp: '5215512345678',
  ciudad: 'Ciudad de México',
  pais: 'MX',
  logo: 'img/imagotipo.png',
  imagen: 'img/editorial-caballero.jpg',
  descripcion:
    'Playeras de autor que reinterpretan símbolos de la cultura mexicana, ' +
    'impresas a mano en la Ciudad de México con once técnicas de serigrafía.',
  // Perfiles reales de la marca. En cuanto existan, entran solos al JSON-LD.
  sameAs: [],
  // Datos de envío y devolución declarados en envios.html.
  envio: { costo: 150, gratisDesde: 1500, preparacionDias: [1, 2], transitoDias: [2, 6], devolucionDias: 30 },
  // Token de caché de styles.css y script.js. Súbelo al tocar cualquiera de los
  // dos y vuelve a construir: build.js lo reescribe en todas las páginas y así
  // nadie se queda con una versión vieja guardada en el navegador. Si se te
  // olvida, los cambios están en el archivo pero nadie los ve.
  assetVersion: '20260816-suaje-redondo'
};

const abs = ruta =>
  /^https?:/.test(ruta) ? ruta : `${SITE.origin}/${String(ruta).replace(/^\/+/, '')}`;

const esc = texto =>
  String(texto)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

// Recorta sin partir palabras, para que los snippets no queden a media frase.
const clamp = (texto, max) => {
  const limpio = String(texto).replace(/\s+/g, ' ').trim();
  if (limpio.length <= max) return limpio;
  const corte = limpio.slice(0, max - 1);
  return `${corte.slice(0, corte.lastIndexOf(' '))}…`;
};

// `</` dentro de un <script> cerraría la etiqueta antes de tiempo.
const jsonld = datos =>
  `  <script type="application/ld+json">\n${JSON.stringify(datos, null, 2)
    .replace(/</g, '\\u003c')
    .split('\n')
    .map(l => `  ${l}`)
    .join('\n')}\n  </script>`;

const ID_ORG = `${SITE.origin}/#organization`;
const ID_WEB = `${SITE.origin}/#website`;

/* ——————————————————— metadatos por página ———————————————————
 * `url` vacío es la portada. `crumbs` son los ancestros y `crumb` es el nombre
 * de la propia página, que se añade sola al final de la miga de pan.
 * `priority` es la del sitemap.
 */
const PAGES = {
  index: {
    url: '',
    crumb: 'Inicio',
    priority: '1.0',
    title: 'Playeras Mexicanas de Autor Hechas a Mano | DHARMA',
    desc: '51 playeras de autor con símbolos de la cultura mexicana, impresas a mano en CDMX con once técnicas de serigrafía. Envíos a todo México y al mundo.',
    img: 'img/editorial-caballero.jpg',
    imgAlt: 'Modelo con playera de la colección DHARMA impresa a mano en México',
    preload: 'img/editorial-caballero.jpg',
    crumbs: []
  },
  colecciones: {
    url: 'colecciones.html',
    crumb: 'Colecciones',
    priority: '0.9',
    title: 'Colecciones de Playeras: Caballero, Dama y 2026 | DHARMA',
    desc: 'Cuatro líneas de playeras mexicanas: nueva colección 2026, caballero, dama y liquidación. Algodón de calidad con serigrafía artesanal hecha en CDMX.',
    img: 'img/editorial-dama.jpg',
    imgAlt: 'Playera de la línea dama DHARMA con acabado de pedrería',
    crumbs: [['Inicio', '']]
  },
  catalogo: {
    url: 'catalogo.html',
    crumb: 'Catálogo',
    priority: '0.9',
    title: 'Catálogo: 51 Playeras Mexicanas Serigrafiadas | DHARMA',
    desc: 'Explora las 51 piezas DHARMA y filtra por línea, tema y técnica de serigrafía. Playeras de algodón impresas a mano en México desde $490 MXN.',
    img: 'img/editorial-caballero.jpg',
    imgAlt: 'Catálogo de playeras DHARMA impresas a mano',
    crumbs: [['Inicio', '']]
  },
  tecnicas: {
    url: 'tecnicas.html',
    crumb: 'Técnicas',
    priority: '0.8',
    title: '11 Técnicas de Serigrafía Textil Artesanal | DHARMA',
    desc: 'Flock, corrosión, alta densidad, tinta puff, pedrería y más: cómo imprimimos a mano cada playera cuadro por cuadro en nuestro taller de la CDMX.',
    img: 'img/mockup-neon.jpg',
    imgAlt: 'Playera DHARMA impresa con tintas neón bajo luz negra',
    crumbs: [['Inicio', '']]
  },
  manifiesto: {
    url: 'manifiesto.html',
    crumb: 'Manifiesto',
    priority: '0.7',
    title: 'Manifiesto: No Hacemos Souvenirs, Creamos Símbolos | DHARMA',
    desc: 'Por qué reinterpretamos la cultura mexicana en vez de reproducirla. La postura detrás de cada playera de autor DHARMA, diseñada e impresa en México.',
    img: 'img/cinematic-workshop.jpg',
    imgAlt: 'Taller de serigrafía DHARMA en la Ciudad de México',
    crumbs: [['Inicio', '']]
  },
  destinos: {
    url: 'destinos.html',
    crumb: 'Destinos',
    priority: '0.8',
    title: 'Playeras Mexicanas en Los Cabos, Vallarta y Cozumel | DHARMA',
    desc: 'DHARMA en los destinos donde México recibe al mundo: Los Cabos, Puerto Vallarta, Cozumel y Pueblos Mágicos. Colecciones y mayoreo para tiendas de destino.',
    img: 'img/dest-cabo.jpg',
    imgAlt: 'Los Cabos, Baja California Sur',
    crumbs: [['Inicio', '']]
  },
  contacto: {
    url: 'contacto.html',
    crumb: 'Contacto',
    priority: '0.6',
    title: 'Contacto y Mayoreo de Playeras Mexicanas | DHARMA',
    desc: 'Habla con DHARMA: pedidos, mayoreo para tiendas y destinos turísticos, prensa y colaboraciones. Escríbenos a hola@dharma.mx o por WhatsApp.',
    img: 'img/contacto-hero-bg.png',
    imgAlt: 'Contacto DHARMA',
    crumbs: [['Inicio', '']]
  },
  tallas: {
    url: 'tallas.html',
    crumb: 'Guía de tallas',
    priority: '0.5',
    title: 'Guía de Tallas de Playeras: Pecho, Largo y Hombro | DHARMA',
    desc: 'Mide pecho, largo y hombro para elegir tu talla DHARMA. Equivalencias de CH a XXL, qué hacer entre dos tallas y cuidados según la técnica de impresión.',
    img: 'img/editorial-pareja.jpg',
    imgAlt: 'Guía de tallas de playeras DHARMA',
    crumbs: [['Inicio', '']]
  },
  envios: {
    url: 'envios.html',
    crumb: 'Envíos y devoluciones',
    priority: '0.5',
    title: 'Envíos y Devoluciones a Todo México | DHARMA',
    desc: 'Zonas, tiempos y costos de envío DHARMA. Envío gratis desde $1,500 MXN, cambio de talla sin costo y 30 días naturales para cambios y devoluciones.',
    img: 'img/editorial-caballero.jpg',
    imgAlt: 'Envíos y devoluciones DHARMA',
    crumbs: [['Inicio', '']]
  },
  legal: {
    url: 'legal.html',
    crumb: 'Avisos legales',
    priority: '0.3',
    title: 'Aviso de Privacidad y Términos y Condiciones | DHARMA',
    desc: 'Aviso de privacidad, términos y condiciones y política de cookies de DHARMA, conforme a la legislación mexicana de protección de datos personales.',
    img: 'img/editorial-caballero.jpg',
    imgAlt: 'Avisos legales DHARMA',
    crumbs: [['Inicio', '']]
  },
  carrito: {
    url: 'carrito.html',
    title: 'Tu bolsa — DHARMA',
    desc: 'Revisa tus piezas, captura tus datos de envío y cierra tu pedido DHARMA.',
    img: 'img/editorial-caballero.jpg',
    noindex: true
  },
  404: {
    url: '404.html',
    title: 'Página no encontrada — DHARMA',
    desc: 'La página que buscas no existe. Vuelve al catálogo de playeras DHARMA.',
    img: 'img/editorial-caballero.jpg',
    noindex: true
  },
  pieza: {
    url: 'pieza.html',
    title: 'Pieza — DHARMA',
    desc: 'Ficha de pieza DHARMA.',
    img: 'img/editorial-caballero.jpg',
    noindex: true
  }
};

// Ruta pública de cada ficha de producto. Se usa en enlaces, canonical y sitemap.
const productUrl = p => `pieza/${p.id}.html`;

const productTitle = p => `Playera ${p.name} · ${p.tecnicaNombre} | ${SITE.nombre}`;

const productDesc = p => {
  const base = p.desc;
  const extra = ` ${p.material}. $${p.price.toLocaleString('es-MX')} MXN con envío a todo México.`;
  return clamp(base.length < 100 ? base + extra : base, 158);
};

/* ——————————————————— datos estructurados ——————————————————— */

const orgNode = () => {
  const org = {
    '@type': 'Organization',
    '@id': ID_ORG,
    name: SITE.nombre,
    alternateName: SITE.nombreLargo,
    url: `${SITE.origin}/`,
    logo: { '@type': 'ImageObject', url: abs(SITE.logo) },
    image: abs(SITE.imagen),
    description: SITE.descripcion,
    address: {
      '@type': 'PostalAddress',
      addressLocality: SITE.ciudad,
      addressCountry: SITE.pais
    },
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      email: SITE.email,
      telephone: `+${SITE.whatsapp}`,
      availableLanguage: ['es', 'en'],
      areaServed: 'MX'
    }
  };
  if (SITE.sameAs.length) org.sameAs = SITE.sameAs;
  return org;
};

const webSiteNode = () => ({
  '@type': 'WebSite',
  '@id': ID_WEB,
  name: SITE.nombreLargo,
  url: `${SITE.origin}/`,
  inLanguage: SITE.lang,
  publisher: { '@id': ID_ORG }
});

const breadcrumbNode = (crumbs, actual) => ({
  '@type': 'BreadcrumbList',
  itemListElement: [...crumbs, actual].map(([name, url], i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name,
    item: abs(url)
  }))
});

const productNode = (p, colores = {}) => {
  const agotable = p.linea === 'liquidacion';
  const nombresColor = (p.colores || [])
    .map(c => colores[c]?.nombre)
    .filter(Boolean);
  return {
    '@type': 'Product',
    '@id': `${abs(productUrl(p))}#product`,
    name: p.name,
    sku: p.id,
    description: p.desc,
    image: [abs(p.img)],
    url: abs(productUrl(p)),
    brand: { '@id': ID_ORG },
    material: p.material,
    category: `Ropa > Playeras > ${p.lineaNombre}`,
    countryOfOrigin: { '@type': 'Country', name: 'México' },
    ...(nombresColor.length ? { color: nombresColor.join(', ') } : {}),
    additionalProperty: [
      { '@type': 'PropertyValue', name: 'Técnica de impresión', value: p.tecnicaNombre },
      { '@type': 'PropertyValue', name: 'Tema', value: p.tema },
      { '@type': 'PropertyValue', name: 'Tallas', value: p.tallas.join(', ') },
      ...(nombresColor.length
        ? [{ '@type': 'PropertyValue', name: 'Colores', value: nombresColor.join(', ') }]
        : [])
    ],
    offers: {
      '@type': 'Offer',
      url: abs(productUrl(p)),
      priceCurrency: SITE.moneda,
      price: p.price,
      availability: agotable
        ? 'https://schema.org/LimitedAvailability'
        : 'https://schema.org/InStock',
      itemCondition: 'https://schema.org/NewCondition',
      seller: { '@id': ID_ORG },
      shippingDetails: {
        '@type': 'OfferShippingDetails',
        shippingRate: {
          '@type': 'MonetaryAmount',
          value: SITE.envio.costo,
          currency: SITE.moneda
        },
        shippingDestination: { '@type': 'DefinedRegion', addressCountry: 'MX' },
        deliveryTime: {
          '@type': 'ShippingDeliveryTime',
          handlingTime: {
            '@type': 'QuantitativeValue',
            minValue: SITE.envio.preparacionDias[0],
            maxValue: SITE.envio.preparacionDias[1],
            unitCode: 'DAY'
          },
          transitTime: {
            '@type': 'QuantitativeValue',
            minValue: SITE.envio.transitoDias[0],
            maxValue: SITE.envio.transitoDias[1],
            unitCode: 'DAY'
          }
        }
      },
      hasMerchantReturnPolicy: {
        '@type': 'MerchantReturnPolicy',
        applicableCountry: 'MX',
        returnPolicyCategory: 'https://schema.org/MerchantReturnFiniteReturnWindow',
        merchantReturnDays: SITE.envio.devolucionDias
      }
    }
  };
};

const itemListNode = (nombre, items) => ({
  '@type': 'ItemList',
  name: nombre,
  numberOfItems: items.length,
  itemListElement: items.map((it, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name: it.name,
    url: abs(it.url)
  }))
});

// Lee las preguntas de un <div class="faq-list"> con <details><summary>.
const faqNode = html => {
  const bloque = html.match(/<div class="faq-list">([\s\S]*?)<\/div>/);
  if (!bloque) return null;
  const pares = [...bloque[1].matchAll(/<summary>([\s\S]*?)<\/summary>\s*<p>([\s\S]*?)<\/p>/g)];
  if (!pares.length) return null;
  const texto = s => s.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
  return {
    '@type': 'FAQPage',
    mainEntity: pares.map(([, q, a]) => ({
      '@type': 'Question',
      name: texto(q),
      acceptedAnswer: { '@type': 'Answer', text: texto(a) }
    }))
  };
};

/* ——————————————————— bloque <head> ———————————————————
 * Devuelve title, description, canonical, Open Graph, Twitter y JSON-LD.
 * `extra` recibe los nodos de datos estructurados propios de cada página.
 */
const seoHead = (meta, extra = []) => {
  const canonical = abs(meta.url);
  const imagen = abs(meta.img || SITE.imagen);
  const robots = meta.noindex
    ? 'noindex,follow'
    : 'index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1';

  const lineas = [
    `  <title>${esc(meta.title)}</title>`,
    `  <meta name="description" content="${esc(meta.desc)}">`,
    `  <meta name="robots" content="${robots}">`,
    `  <link rel="canonical" href="${canonical}">`,
    `  <meta property="og:type" content="${meta.ogType || 'website'}">`,
    `  <meta property="og:site_name" content="${esc(SITE.nombreLargo)}">`,
    `  <meta property="og:locale" content="${SITE.locale}">`,
    `  <meta property="og:title" content="${esc(meta.ogTitle || meta.title)}">`,
    `  <meta property="og:description" content="${esc(meta.desc)}">`,
    `  <meta property="og:image" content="${imagen}">`,
    `  <meta property="og:image:alt" content="${esc(meta.imgAlt || SITE.nombreLargo)}">`,
    `  <meta property="og:url" content="${canonical}">`,
    `  <meta name="twitter:card" content="summary_large_image">`,
    `  <meta name="twitter:title" content="${esc(meta.ogTitle || meta.title)}">`,
    `  <meta name="twitter:description" content="${esc(meta.desc)}">`,
    `  <meta name="twitter:image" content="${imagen}">`
  ];

  if (meta.preload) {
    lineas.push(
      `  <link rel="preload" as="image" href="${meta.preload}" fetchpriority="high">`
    );
  }

  const nodos = extra.filter(Boolean);
  if (nodos.length) {
    lineas.push(jsonld({ '@context': 'https://schema.org', '@graph': nodos }));
  }

  return lineas.join('\n');
};

/* ——————————————————— ficha estática de producto ———————————————————
 * Renderiza en HTML lo que antes solo existía tras ejecutar JavaScript:
 * cada pieza tiene su propia URL, su <h1>, su precio y sus piezas hermanas.
 */
const productPage = (p, { linea, tecnicas, colores, imagenes, header, footer, relacionadas }) => {
  const meta = {
    url: productUrl(p),
    title: productTitle(p),
    desc: productDesc(p),
    img: p.img,
    imgAlt: `Playera ${p.name} — ${SITE.nombre}`,
    ogType: 'product'
  };

  const crumbs = [
    ['Inicio', ''],
    ['Catálogo', 'catalogo.html'],
    [`${linea.nombre} · ${linea.año}`, `colecciones.html#${linea.id}`]
  ];

  const head = seoHead(meta, [
    orgNode(),
    productNode(p, colores),
    breadcrumbNode(crumbs, [p.name, productUrl(p)])
  ]);

  const specs = [
    ['TÉCNICA', p.tecnicas.map(t => `${tecnicas[t].nombre} <i>(${tecnicas[t].claim.toLowerCase()})</i>`).join('<br>')],
    ['MATERIAL', p.material],
    ['LÍNEA', `${linea.nombre} · ${linea.año}`],
    ['TEMA', p.tema]
  ].map(([k, v]) => `          <li><span>${k}</span><b>${v}</b></li>`).join('\n');

  const tallaPorDefecto = p.tallas[Math.min(1, p.tallas.length - 1)];
  const sizes = p.tallas
    .map(t => `<button type="button" data-size="${t}"${t === tallaPorDefecto ? ' class="selected"' : ''}>${t}</button>`)
    .join('');

  // El primer color de la lista es el que viene seleccionado.
  const colorPorDefecto = colores[p.colores[0]];
  const swatches = p.colores
    .map(c => {
      const col = colores[c];
      const activo = c === p.colores[0];
      return `<button type="button" data-color="${c}" class="swatch${activo ? ' selected' : ''}" aria-pressed="${activo}" title="${esc(col.nombre)}"><span style="background:${col.hex}"></span><i class="sr-only">${esc(col.nombre)}</i></button>`;
    })
    .join('');

  const hermanas = relacionadas
    .map(r => `        <article class="product" data-linea="${r.linea}" data-tema="${r.tema}" data-tecnica="${r.tecnicas.join(' ')}">
          <a class="product-media" href="../${productUrl(r)}">
            <img src="../${r.img}" alt="Playera ${r.name} — DHARMA" loading="lazy" decoding="async">
            <span class="product-badge">${r.lineaNombre}</span>
          </a>
          <small>${r.tecnicaNombre}</small>
          <h3><a href="../${productUrl(r)}">${r.name}</a></h3>
          <p>${r.tagline}</p>
          <div class="product-foot"><b>$${r.price.toLocaleString('es-MX')} MXN</b><span class="product-link">VER PIEZA +</span></div>
        </article>`)
    .join('\n');

  return `<!doctype html>
<html lang="${SITE.lang}">

<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
${head}
  <meta name="theme-color" content="#0b0b0b">
  <link rel="icon" href="../favicon.svg" type="image/svg+xml">
  <link rel="icon" href="../img/favicon.png" sizes="64x64">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Anton&family=Cormorant+Garamond:ital,wght@0,600;1,600&family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="../styles.css?v=${SITE.assetVersion}">
</head>

<body data-page="pieza" data-base="../">
${header}
  <main id="contenido">
    <div class="product-detail" id="product-detail" data-product="${p.id}">
      <div class="detail-media">
        <img class="detail-img" id="detail-img" src="../${imagenes[p.colores[0]] || p.img}" alt="Playera ${p.name} en ${esc(colorPorDefecto.nombre.toLowerCase())} — DHARMA" fetchpriority="high" decoding="async" data-imagenes="${esc(JSON.stringify(imagenes))}" style="view-transition-name:pieza-activa">
      </div>
      <div class="detail-copy">
        <nav class="crumbs" aria-label="Ruta de navegación">
          <a href="../catalogo.html">CATÁLOGO</a><i>/</i><a href="../colecciones.html#${linea.id}" id="detail-linea">${linea.nombre} · ${linea.año}</a>
        </nav>
        <p class="kicker" id="detail-tecnica">${p.tecnicaNombre}</p>
        <h1 id="detail-name">${p.name}</h1>
        <p class="detail-tagline" id="detail-tagline">${p.tagline}</p>
        <p class="detail-desc" id="detail-desc">${p.desc}</p>
        <ul class="detail-specs" id="detail-specs">
${specs}
        </ul>
        <div class="detail-price" id="detail-price">$${p.price.toLocaleString('es-MX')} MXN</div>
        <p class="detail-field-label">COLOR <i id="detail-color-nombre">${esc(colorPorDefecto.nombre)}</i></p>
        <div class="detail-colors" id="detail-colors" role="group" aria-label="Color de la prenda">${swatches}</div>
        <p class="detail-field-label">TALLA <i id="detail-tallas-nota">${p.linea === 'liquidacion' ? '· SUJETO A EXISTENCIA' : ''}</i></p>
        <div class="detail-sizes" id="detail-sizes">${sizes}</div>
        <a class="detail-size-link" href="../tallas.html">¿QUÉ TALLA SOY? VER GUÍA DE TALLAS →</a>
        <button class="button gold detail-add" id="add-to-cart">AGREGAR A LA BOLSA +</button>
        <button class="whatsapp-order" id="buy-whatsapp"><svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>COMPRAR POR WHATSAPP</button>
        <ul class="detail-meta">
          <li>Envío a México desde $${SITE.envio.costo} MXN · gratis desde $${SITE.envio.gratisDesde.toLocaleString('es-MX')}</li>
          <li>Cambio de talla sin costo dentro de México</li>
          <li>${SITE.envio.devolucionDias} días para cambios y devoluciones · <a href="../envios.html">ver detalles</a></li>
        </ul>
      </div>
    </div>
    <section class="related section" id="related"${hermanas ? '' : ' hidden'}>
      <div class="section-head">
        <div>
          <p class="kicker">SIGUE EXPLORANDO</p>
          <h2>PIEZAS<br>HERMANAS.</h2>
        </div>
        <a class="text-link" href="../catalogo.html">VER TODO EL CATÁLOGO →</a>
      </div>
      <div class="products grid-4" id="related-grid">
${hermanas}
      </div>
    </section>
  </main>
${footer}
  <script src="../products.js"></script>
  <script src="../script.js?v=${SITE.assetVersion}"></script>
</body>

</html>
`;
};

module.exports = {
  SITE, PAGES, abs, esc, clamp, jsonld,
  productUrl, productTitle, productDesc,
  orgNode, webSiteNode, breadcrumbNode, productNode, itemListNode, faqNode,
  seoHead, productPage
};
