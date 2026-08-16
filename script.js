const WHATSAPP_NUMBER = '5215512345678';

// Endpoint del formulario de contacto (Formspree, Netlify Forms, tu API…).
// Vacío = el mensaje se envía por WhatsApp o correo desde el dispositivo del visitante.
const CONTACT_ENDPOINT = '';

// Costos de envío. Deben coincidir con la tabla de envios.html.
const SHIPPING = {
  MX: { cost: 150, free: 1500, label: 'Envío a México' },
  US: { cost: 390, free: 3000, label: 'Envío a Estados Unidos' },
  XX: { cost: 590, free: 4500, label: 'Envío internacional' }
};

const WHATSAPP_SVG = '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>';

// Las fichas de pieza viven en /pieza/, un nivel más abajo que el resto del sitio.
// build.js marca esas páginas con data-base="../" para que los enlaces y las
// imágenes que arma este script apunten bien desde cualquier nivel.
const BASE = document.body.dataset.base || '';
const asset = ruta => `${BASE}${ruta}`;
const piezaUrl = id => `${BASE}pieza/${id}.html`;

// PRODUCTS, LINEAS, TECNICAS y COLORES se cargan desde products.js
const colorNombre = clave => COLORES[clave]?.nombre || clave;

// Una línea de la bolsa es una combinación de pieza + talla + color.
const mismaLinea = (i, id, size, color) => i.id === id && i.size === size && i.color === color;

const cart = {
  items: JSON.parse(localStorage.getItem('dharma-cart') || '[]')
    // Las bolsas guardadas antes de que existieran los colores no traen color;
    // se les asigna el primero de la pieza para que no queden huérfanas.
    .map(i => ({ ...i, color: i.color || PRODUCTS[i.id]?.colores?.[0] || 'NEGRO' })),

  // Lo asigna initCheckout() para repintar carrito.html junto con el drawer.
  onChange: null,

  // Última cuenta anunciada; undefined hasta la primera pintada.
  anunciado: undefined,

  save() {
    localStorage.setItem('dharma-cart', JSON.stringify(this.items));
  },

  add(id, size, color) {
    const existing = this.items.find(i => mismaLinea(i, id, size, color));
    if (existing) {
      existing.qty += 1;
    } else {
      this.items.push({ id, size, color, qty: 1 });
    }
    this.save();
    this.render();
    openCart();
  },

  remove(id, size, color) {
    this.items = this.items.filter(i => !mismaLinea(i, id, size, color));
    this.save();
    this.render();
  },

  changeQty(id, size, color, delta) {
    const item = this.items.find(i => mismaLinea(i, id, size, color));
    if (!item) return;
    item.qty += delta;
    if (item.qty <= 0) {
      this.remove(id, size, color);
    } else {
      this.save();
      this.render();
    }
  },

  count() {
    return this.items.reduce((sum, i) => sum + i.qty, 0);
  },

  total() {
    return this.items.reduce((sum, i) => sum + i.qty * (PRODUCTS[i.id]?.price || 0), 0);
  },

  render() {
    const n = this.count();
    document.querySelectorAll('.bag-count').forEach(el => {
      el.textContent = n;
    });
    // El número de la burbuja va oculto para lectores de pantalla (es
    // decorativo junto al texto BOLSA), así que la cuenta viaja en la
    // etiqueta del botón y los cambios se anuncian por el status.
    const piezas = n === 1 ? '1 pieza' : `${n} piezas`;
    document.querySelectorAll('.bag-btn').forEach(el => {
      el.setAttribute('aria-label', n
        ? `Abrir bolsa de compra, ${piezas}`
        : 'Abrir bolsa de compra, vacía');
    });
    // En la primera pintada solo dejamos el estado puesto: anunciarlo
    // al cargar sería ruido, porque el usuario no ha hecho nada.
    if (this.anunciado !== undefined && this.anunciado !== n) {
      document.querySelectorAll('[data-bag-status]').forEach(el => {
        el.textContent = n ? `Bolsa actualizada: ${piezas}.` : 'Bolsa vacía.';
      });
    }
    this.anunciado = n;
    if (this.onChange) this.onChange();

    const list = document.querySelector('.cart-items');
    if (!list) return;

    if (!this.items.length) {
      list.innerHTML = '<p class="cart-empty">Tu bolsa está vacía.<br>Explora la colección y agrega tus piezas.</p>';
    } else {
      list.innerHTML = this.items.map(item => {
        const p = PRODUCTS[item.id];
        if (!p) return '';
        return `
          <div class="cart-item">
            <div class="cart-item-img" style="background-image:url('${asset(p.img)}')"></div>
            <div class="cart-item-info">
              <b>${p.name}</b>
              <span>${p.tecnicaNombre} · Talla ${item.size} · ${colorNombre(item.color)}</span>
              <span>$${(p.price * item.qty).toLocaleString('es-MX')} MXN</span>
            </div>
            <div class="cart-item-actions">
              <div class="cart-item-qty">
                <button data-dec data-id="${item.id}" data-size="${item.size}" data-color="${item.color}">−</button>
                <span>${item.qty}</span>
                <button data-inc data-id="${item.id}" data-size="${item.size}" data-color="${item.color}">+</button>
              </div>
              <button class="cart-remove" data-remove data-id="${item.id}" data-size="${item.size}" data-color="${item.color}">ELIMINAR</button>
            </div>
          </div>`;
      }).join('');
    }

    const totalEl = document.querySelector('.cart-total-value');
    if (totalEl) totalEl.textContent = `$${this.total().toLocaleString('es-MX')} MXN`;
  }
};

const injectCart = () => {
  if (document.querySelector('.cart-overlay')) return;

  const overlay = document.createElement('div');
  overlay.className = 'cart-overlay';
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-modal', 'true');
  overlay.setAttribute('aria-label', 'Bolsa de compra');
  overlay.setAttribute('aria-hidden', 'true');
  overlay.inert = true;
  overlay.innerHTML = `
    <div class="cart-panel">
      <div class="cart-head">
        <h3>TU BOLSA</h3>
        <button class="cart-close" aria-label="Cerrar">×</button>
      </div>
      <div class="cart-items"></div>
      <div class="cart-foot">
        <div class="cart-total"><span>TOTAL</span><b class="cart-total-value">$0 MXN</b></div>
        <button class="button gold full cart-checkout">FINALIZAR COMPRA</button>
        <p class="cart-note">Envíos disponibles en México y el mundo.</p>
      </div>
    </div>`;
  document.body.appendChild(overlay);

  const closeCart = () => {
    overlay.classList.remove('open');
    overlay.setAttribute('aria-hidden', 'true');
    overlay.inert = true;
    document.body.classList.remove('overlay-open');
  };

  overlay.querySelector('.cart-close').addEventListener('click', closeCart);
  overlay.addEventListener('click', e => {
    if (e.target === overlay) closeCart();
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && overlay.classList.contains('open')) closeCart();
  });

  overlay.querySelector('.cart-items').addEventListener('click', e => {
    const target = e.target.closest('[data-inc],[data-dec],[data-remove]');
    if (!target) return;
    const { id, size, color } = target.dataset;
    if (target.hasAttribute('data-inc')) cart.changeQty(id, size, color, 1);
    if (target.hasAttribute('data-dec')) cart.changeQty(id, size, color, -1);
    if (target.hasAttribute('data-remove')) cart.remove(id, size, color);
  });

  overlay.querySelector('.cart-checkout').addEventListener('click', () => {
    if (!cart.items.length) return;
    if (document.body.dataset.page === 'carrito') {
      closeCart();
      document.getElementById('checkout-data')?.scrollIntoView({ behavior: 'smooth' });
      return;
    }
    location.href = 'carrito.html';
  });
};

const openCart = () => {
  const overlay = document.querySelector('.cart-overlay');
  if (overlay) {
    overlay.classList.add('open');
    overlay.setAttribute('aria-hidden', 'false');
    overlay.inert = false;
    document.body.classList.add('overlay-open');
    overlay.querySelector('.cart-close')?.focus();
  }
};

const injectSearch = () => {
  if (document.querySelector('.search-overlay')) return;

  const el = document.createElement('div');
  el.className = 'search-overlay';
  el.setAttribute('role', 'dialog');
  el.setAttribute('aria-modal', 'true');
  el.setAttribute('aria-label', 'Buscar en el catálogo');
  el.setAttribute('aria-hidden', 'true');
  el.inert = true;
  el.innerHTML = `
    <div class="search-head">
      <input type="search" class="search-input" aria-label="Nombre, símbolo o técnica" placeholder="BUSCAR PIEZA…" autocomplete="off">
      <button class="search-close" aria-label="Cerrar">×</button>
    </div>
    <div class="search-results"></div>`;
  document.body.appendChild(el);

  const input = el.querySelector('.search-input');
  const results = el.querySelector('.search-results');

  const renderResults = query => {
    const q = query.trim().toLowerCase();
    const list = Object.values(PRODUCTS).filter(p =>
      !q ||
      [p.name, p.tagline, p.tecnicaNombre, p.lineaNombre, p.tema, p.desc]
        .join(' ').toLowerCase().includes(q)
    );
    if (!list.length) {
      results.innerHTML = '<p class="search-empty">Sin resultados. Prueba con "jaguar", "xolo", "frida", "flock"…</p>';
      return;
    }
    results.innerHTML = list.slice(0, 24).map(p => `
      <a class="search-result" href="${piezaUrl(p.id)}">
        <img src="${asset(p.img)}" alt="${p.name}" loading="lazy">
        <div><b>${p.name}</b><span>${p.tecnicaNombre} · ${p.lineaNombre}</span></div>
      </a>`).join('');
  };

  // El botón declara aria-haspopup="dialog"; hay que mantener su estado
  // en sintonía con el overlay o siempre dirá "contraído".
  const marcarBotones = abierto => document.querySelectorAll('.search-btn')
    .forEach(b => b.setAttribute('aria-expanded', String(abierto)));

  const open = () => {
    el.classList.add('open');
    el.setAttribute('aria-hidden', 'false');
    el.inert = false;
    document.body.classList.add('overlay-open');
    marcarBotones(true);
    renderResults('');
    setTimeout(() => input.focus(), 150);
  };
  const close = ({ devolverFoco = false } = {}) => {
    if (!el.classList.contains('open')) return;
    el.classList.remove('open');
    el.setAttribute('aria-hidden', 'true');
    el.inert = true;
    document.body.classList.remove('overlay-open');
    marcarBotones(false);
    // Al cerrar con teclado el foco vuelve al botón, no al principio.
    if (devolverFoco) document.querySelector('.search-btn')?.focus();
  };

  document.addEventListener('click', e => {
    if (e.target.closest('.search-btn')) open();
  });
  el.querySelector('.search-close').addEventListener('click', () => close({ devolverFoco: true }));
  el.addEventListener('click', e => { if (e.target === el) close(); });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') close({ devolverFoco: true });
  });
  input.addEventListener('input', () => renderResults(input.value));
};

const injectToTop = () => {
  const btn = document.createElement('button');
  btn.className = 'to-top';
  btn.setAttribute('aria-label', 'Volver arriba');
  btn.innerHTML = '↑';
  document.body.appendChild(btn);

  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  window.addEventListener('scroll', () => {
    btn.classList.toggle('show', window.scrollY > 400);
  });
};

const initNewsletter = () => {
  document.querySelectorAll('[data-newsletter]').forEach(form => {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const ok = form.parentElement.querySelector('.news-ok');
      if (ok) {
        form.hidden = true;
        ok.hidden = false;
      }
    });
  });
};

const injectWhatsApp = () => {
  if (document.querySelector('.whatsapp-float')) return;

  const msg = 'Hola DHARMA, me gustaría saber más de sus piezas.';
  const a = document.createElement('a');
  a.className = 'whatsapp-float';
  a.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
  a.target = '_blank';
  a.rel = 'noopener';
  a.setAttribute('aria-label', 'Escríbenos por WhatsApp');
  a.innerHTML = WHATSAPP_SVG;
  document.body.appendChild(a);
};

const initCartTriggers = () => {
  document.addEventListener('click', e => {
    const trigger = e.target.closest('.bag-count, .bag-btn');
    if (trigger) openCart();
  });
};

const productCard = p => `
  <article class="product" data-linea="${p.linea}" data-tema="${p.tema}" data-tecnica="${p.tecnicas.join(' ')}">
    <a class="product-media" href="${piezaUrl(p.id)}">
      <img src="${asset(p.img)}" alt="Playera ${p.name} — DHARMA" loading="lazy" decoding="async">
      <span class="product-badge">${p.lineaNombre}</span>
    </a>
    <small>${p.tecnicaNombre}</small>
    <h3><a href="${piezaUrl(p.id)}">${p.name}</a></h3>
    <p>${p.tagline}</p>
    <div class="product-foot"><b>$${p.price.toLocaleString('es-MX')} MXN</b><span class="product-link">VER PIEZA +</span></div>
  </article>`;

const initProductPage = () => {
  const wrap = document.getElementById('product-detail');
  if (!wrap) return;

  // Cada pieza tiene su propia URL estática y trae su id en el HTML.
  // pieza.html?p=<id> es la dirección vieja: sigue llegando de enlaces y
  // marcadores, así que se redirige a la ficha que ya existe.
  const estatica = Boolean(wrap.dataset.product);
  const id = wrap.dataset.product || new URLSearchParams(location.search).get('p');
  const product = PRODUCTS[id];

  if (!estatica && product) {
    location.replace(piezaUrl(id));
    return;
  }

  if (!product) {
    wrap.classList.add('detail-missing');
    wrap.innerHTML = `
      <div class="detail-copy">
        <p class="kicker">PIEZA NO ENCONTRADA</p>
        <h1>ESTA PIEZA<br>NO EXISTE.</h1>
        <p class="detail-desc">Puede que el enlace haya cambiado o que la edición se haya agotado.</p>
        <div class="actions"><a class="button gold" href="${asset('catalogo.html')}">VER EL CATÁLOGO ↗</a><a class="button ghost" href="${asset('colecciones.html')}">VER COLECCIONES</a></div>
      </div>`;
    return;
  }

  const linea = LINEAS[product.linea];

  const img = document.getElementById('detail-img');
  // build.js deja aquí las fotos que sí existen por color. Si un color no
  // tiene la suya, se queda la principal en vez de pedir un archivo ausente.
  const imagenesColor = JSON.parse(img.dataset.imagenes || '{}');
  const mostrarColor = clave => {
    img.src = asset(imagenesColor[clave] || product.img);
    img.alt = `Playera ${product.name} en ${colorNombre(clave).toLowerCase()} — DHARMA`;
  };
  document.getElementById('detail-tecnica').textContent = product.tecnicaNombre;
  document.getElementById('detail-name').textContent = product.name;
  document.getElementById('detail-tagline').textContent = product.tagline;
  document.getElementById('detail-desc').textContent = product.desc;
  document.getElementById('detail-price').textContent = money(product.price);

  const lineaLink = document.getElementById('detail-linea');
  lineaLink.textContent = `${linea.nombre} · ${linea.año}`;
  lineaLink.href = asset(`colecciones.html#${linea.id}`);

  document.getElementById('detail-specs').innerHTML = [
    ['TÉCNICA', product.tecnicas.map(t => `${TECNICAS[t].nombre} <i>(${TECNICAS[t].claim.toLowerCase()})</i>`).join('<br>')],
    ['MATERIAL', product.material],
    ['LÍNEA', `${linea.nombre} · ${linea.año}`],
    ['TEMA', product.tema]
  ].map(([k, v]) => `<li><span>${k}</span><b>${v}</b></li>`).join('');

  // Color: los circulitos ya vienen pintados en el HTML; aquí solo se
  // registra cuál está elegido y se mueve el estado al que se oprime.
  let color = product.colores[0];
  mostrarColor(color);

  const colores = document.getElementById('detail-colors');
  const colorLabel = document.getElementById('detail-color-nombre');
  colores?.addEventListener('click', e => {
    const btn = e.target.closest('button[data-color]');
    if (!btn) return;
    colores.querySelectorAll('button').forEach(b => {
      b.classList.remove('selected');
      b.setAttribute('aria-pressed', 'false');
    });
    btn.classList.add('selected');
    btn.setAttribute('aria-pressed', 'true');
    color = btn.dataset.color;
    if (colorLabel) colorLabel.textContent = colorNombre(color);
    mostrarColor(color);
  });

  let size = product.tallas[Math.min(1, product.tallas.length - 1)];
  const sizes = document.getElementById('detail-sizes');
  sizes.innerHTML = product.tallas
    .map(t => `<button type="button" data-size="${t}"${t === size ? ' class="selected"' : ''}>${t}</button>`)
    .join('');
  document.getElementById('detail-tallas-nota').textContent =
    product.linea === 'liquidacion' ? '· SUJETO A EXISTENCIA' : '';

  sizes.addEventListener('click', e => {
    const btn = e.target.closest('button[data-size]');
    if (!btn) return;
    sizes.querySelectorAll('button').forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
    size = btn.dataset.size;
  });

  document.getElementById('add-to-cart').addEventListener('click', () => cart.add(product.id, size, color));

  document.getElementById('buy-whatsapp').addEventListener('click', () => {
    const msg = `Hola DHARMA, quiero la pieza ${product.name} (${product.tecnicaNombre}) en talla ${size}, color ${colorNombre(color)}.`;
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`, '_blank');
  });

  // Piezas hermanas: mismo tema primero, luego misma técnica.
  const pool = Object.values(PRODUCTS).filter(p => p.id !== product.id);
  const related = [
    ...pool.filter(p => p.tema === product.tema),
    ...pool.filter(p => p.tema !== product.tema && p.tecnicas.some(t => product.tecnicas.includes(t)))
  ].slice(0, 4);
  if (related.length) {
    document.getElementById('related-grid').innerHTML = related.map(productCard).join('');
    document.getElementById('related').hidden = false;
  }
};

// Explorador de destinos: el cursor o el foco cambian la imagen y las piezas curadas.
const initDestinos = () => {
  const explorer = document.querySelector('[data-destinos]');
  if (!explorer) return;

  const rows = [...explorer.querySelectorAll('.dest-row')];
  const frames = [...explorer.querySelectorAll('.dest-frame')];
  const picks = [...explorer.querySelectorAll('.dest-picks')];
  let current = rows[0]?.dataset.dest;

  const activate = id => {
    if (!id || id === current) return;
    current = id;
    [rows, frames, picks].forEach(group => {
      group.forEach(el => el.classList.toggle('is-active', el.dataset.dest === id));
    });
  };

  rows.forEach(row => {
    const id = row.dataset.dest;
    row.addEventListener('mouseenter', () => activate(id));
    row.querySelector('a').addEventListener('focus', () => activate(id));
  });
};

const initFilters = () => {
  const bar = document.querySelector('[data-filters]');
  if (!bar) return;

  const cards = [...document.querySelectorAll('.catalog .product')];
  const count = bar.querySelector('.filter-count b');
  const empty = document.getElementById('catalog-empty');
  const active = { linea: '', tema: '', tecnica: '' };

  const apply = () => {
    let visible = 0;
    cards.forEach(card => {
      const ok = Object.entries(active).every(([key, value]) => {
        if (!value) return true;
        const data = card.dataset[key] || '';
        return key === 'tecnica' ? data.split(' ').includes(value) : data === value;
      });
      card.hidden = !ok;
      if (ok) visible++;
    });
    if (count) count.textContent = visible;
    if (empty) empty.hidden = visible > 0;
  };

  bar.addEventListener('click', e => {
    const chip = e.target.closest('.chip');
    if (!chip) return;
    const { filter, value } = chip.dataset;
    active[filter] = value;
    bar.querySelectorAll(`.chip[data-filter="${filter}"]`)
      .forEach(c => c.classList.toggle('on', c === chip));
    apply();
  });

  document.querySelector('[data-reset-filters]')?.addEventListener('click', () => {
    Object.keys(active).forEach(k => { active[k] = ''; });
    bar.querySelectorAll('.chip').forEach(c => c.classList.toggle('on', !c.dataset.value));
    apply();
  });

  // Permite entrar filtrado desde otra página: catalogo.html?tecnica=FLOCK
  const params = new URLSearchParams(location.search);
  let preset = false;
  ['linea', 'tema', 'tecnica'].forEach(key => {
    const value = params.get(key);
    if (!value) return;
    const chip = bar.querySelector(`.chip[data-filter="${key}"][data-value="${value}"]`);
    if (!chip) return;
    active[key] = value;
    bar.querySelectorAll(`.chip[data-filter="${key}"]`).forEach(c => c.classList.toggle('on', c === chip));
    preset = true;
  });
  apply();
  if (preset) document.getElementById('piezas')?.scrollIntoView({ behavior: 'smooth' });
};

// Marca los campos vacíos o inválidos de un formulario y devuelve el primero que falla.
const checkFields = form => {
  let first = null;
  form.querySelectorAll('[required]').forEach(el => {
    let bad;
    if (el.type === 'checkbox') {
      bad = !el.checked;
    } else if (el.type === 'email') {
      bad = !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(el.value.trim());
    } else {
      bad = !el.value.trim();
    }
    const holder = el.type === 'checkbox' ? el.closest('.check') : el;
    holder?.classList.toggle('invalid', bad);
    if (bad && !first) first = el;
  });
  return first;
};

const clearInvalid = form => {
  form.addEventListener('input', e => {
    const holder = e.target.type === 'checkbox' ? e.target.closest('.check') : e.target;
    holder?.classList.remove('invalid');
  });
};

const initContactForm = () => {
  const form = document.getElementById('contact-form');
  if (!form) return;

  const sent = document.getElementById('contact-sent');
  const error = document.getElementById('contact-error');
  clearInvalid(form);

  const showError = text => {
    error.textContent = text;
    error.hidden = false;
  };

  form.addEventListener('submit', e => {
    e.preventDefault();
    const bad = checkFields(form);
    if (bad) {
      showError(bad.type === 'checkbox'
        ? 'Necesitamos que aceptes el aviso de privacidad.'
        : 'Revisa los campos marcados: falta información o el correo no es válido.');
      bad.focus();
      return;
    }
    error.hidden = true;

    const data = Object.fromEntries(new FormData(form).entries());
    const msg = [
      `Hola DHARMA, soy ${data.nombre}.`,
      `Motivo: ${data.motivo}.`,
      '',
      data.mensaje,
      '',
      `Correo: ${data.correo}`,
      data.telefono ? `Teléfono: ${data.telefono}` : ''
    ].filter(Boolean).join('\n');

    const finish = () => {
      document.getElementById('contact-wa').href =
        `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
      document.getElementById('contact-mail').href =
        `mailto:hola@dharma.mx?subject=${encodeURIComponent(`${data.motivo} — ${data.nombre}`)}&body=${encodeURIComponent(msg)}`;
      form.hidden = true;
      sent.hidden = false;
      sent.scrollIntoView({ behavior: 'smooth', block: 'center' });
    };

    if (!CONTACT_ENDPOINT) {
      finish();
      return;
    }
    fetch(CONTACT_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(data)
    })
      .then(res => res.ok ? finish() : Promise.reject(res.status))
      .catch(() => showError('No pudimos enviar el mensaje. Escríbenos por WhatsApp o a hola@dharma.mx.'));
  });

  document.getElementById('contact-reset').addEventListener('click', () => {
    form.reset();
    form.hidden = false;
    sent.hidden = true;
    form.scrollIntoView({ behavior: 'smooth', block: 'center' });
  });
};

const money = n => `$${n.toLocaleString('es-MX')} MXN`;

const initCheckout = () => {
  const root = document.getElementById('checkout');
  if (!root) return;

  const list = document.getElementById('checkout-items');
  const empty = document.getElementById('checkout-empty');
  const form = document.getElementById('checkout-form');
  const error = document.getElementById('checkout-error');
  const pais = document.getElementById('o-pais');
  const steps = [...document.querySelectorAll('.checkout-steps li')];
  clearInvalid(form);

  const shippingFor = subtotal => {
    const zone = SHIPPING[pais.value] || SHIPPING.MX;
    return { ...zone, amount: subtotal >= zone.free ? 0 : zone.cost };
  };

  const setSteps = current => {
    steps.forEach((li, i) => {
      li.classList.toggle('on', i === current);
      li.classList.toggle('done', i < current);
    });
  };

  const renderSummary = () => {
    const subtotal = cart.total();
    const ship = shippingFor(subtotal);
    document.getElementById('sum-subtotal').textContent = money(subtotal);
    document.getElementById('sum-qty').textContent = cart.count();
    document.getElementById('sum-ship-label').textContent = ship.label;
    document.getElementById('sum-ship').textContent = ship.amount ? money(ship.amount) : 'GRATIS';
    document.getElementById('sum-total').textContent = money(subtotal + ship.amount);
  };

  const renderItems = () => {
    const hasItems = cart.items.length > 0;
    root.classList.toggle('is-empty', !hasItems);
    empty.hidden = hasItems;
    list.hidden = !hasItems;

    list.innerHTML = cart.items.map(item => {
      const p = PRODUCTS[item.id];
      if (!p) return '';
      return `
        <div class="co-item">
          <div class="co-item-img" style="background-image:url('${asset(p.img)}')"></div>
          <div class="co-item-info">
            <b>${p.name}</b>
            <span>${p.tecnica} · TALLA ${item.size} · ${colorNombre(item.color)}</span>
            <a data-remove data-id="${item.id}" data-size="${item.size}" data-color="${item.color}">ELIMINAR</a>
          </div>
          <div class="co-item-right">
            <div class="co-item-price">${money(p.price * item.qty)}</div>
            <div class="co-qty">
              <button type="button" data-dec data-id="${item.id}" data-size="${item.size}" data-color="${item.color}" aria-label="Quitar una">−</button>
              <span>${item.qty}</span>
              <button type="button" data-inc data-id="${item.id}" data-size="${item.size}" data-color="${item.color}" aria-label="Agregar una">+</button>
            </div>
          </div>
        </div>`;
    }).join('');

    if (hasItems) renderSummary();
    setSteps(hasItems ? 1 : 0);
  };

  list.addEventListener('click', e => {
    const target = e.target.closest('[data-inc],[data-dec],[data-remove]');
    if (!target) return;
    const { id, size, color } = target.dataset;
    if (target.hasAttribute('data-inc')) cart.changeQty(id, size, color, 1);
    if (target.hasAttribute('data-dec')) cart.changeQty(id, size, color, -1);
    if (target.hasAttribute('data-remove')) cart.remove(id, size, color);
  });

  pais.addEventListener('change', renderSummary);
  cart.onChange = renderItems;
  renderItems();

  // AJUSTAR: aquí va la pasarela de pago (Stripe, Mercado Pago…).
  // Hoy el pedido se cierra en el navegador y se confirma por WhatsApp.
  document.getElementById('checkout-confirm').addEventListener('click', () => {
    if (!cart.items.length) return;
    const bad = checkFields(form);
    if (bad) {
      error.textContent = bad.type === 'checkbox'
        ? 'Acepta los términos y el aviso de privacidad para continuar.'
        : 'Faltan datos de envío: revisa los campos marcados.';
      error.hidden = false;
      bad.focus();
      bad.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    error.hidden = true;

    const data = Object.fromEntries(new FormData(form).entries());
    const subtotal = cart.total();
    const ship = shippingFor(subtotal);
    const total = subtotal + ship.amount;
    const now = new Date();
    const stamp = [
      String(now.getFullYear()).slice(2),
      String(now.getMonth() + 1).padStart(2, '0'),
      String(now.getDate()).padStart(2, '0')
    ].join('');
    const number = `DH-${stamp}-${Math.floor(1000 + Math.random() * 9000)}`;
    const lines = cart.items.map(i => `${i.qty}× ${PRODUCTS[i.id].name} (talla ${i.size}, ${colorNombre(i.color)})`);
    const address = `${data.calle}${data.colonia ? ', ' + data.colonia : ''}, ${data.ciudad}, ${data.estado}, CP ${data.cp} (${pais.options[pais.selectedIndex].text})`;

    localStorage.setItem('dharma-last-order', JSON.stringify({
      number, items: cart.items, subtotal, envio: ship.amount, total, ...data, fecha: now.toISOString()
    }));

    document.getElementById('order-number').textContent = number;
    document.getElementById('order-recap').innerHTML = `
      ${lines.map(l => `<div><span>${l}</span></div>`).join('')}
      <div><span>Subtotal</span><b>${money(subtotal)}</b></div>
      <div><span>${ship.label}</span><b>${ship.amount ? money(ship.amount) : 'GRATIS'}</b></div>
      <div class="total"><span>Total</span><b>${money(total)}</b></div>
      <p>${data.nombre} · ${data.telefono}<br>${address}</p>`;

    const msg = [
      `Hola DHARMA, quiero confirmar mi pedido ${number}.`,
      '',
      ...lines,
      '',
      `Subtotal: ${money(subtotal)}`,
      `${ship.label}: ${ship.amount ? money(ship.amount) : 'gratis'}`,
      `Total: ${money(total)}`,
      '',
      `Nombre: ${data.nombre}`,
      `Correo: ${data.correo}`,
      `WhatsApp: ${data.telefono}`,
      `Dirección: ${address}`,
      data.notas ? `Notas: ${data.notas}` : ''
    ].filter(Boolean).join('\n');
    document.getElementById('order-wa').href =
      `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;

    cart.onChange = null;
    cart.items = [];
    cart.save();
    cart.render();

    root.classList.add('is-done');
    document.getElementById('order-done').hidden = false;
    setSteps(2);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
};

// Páginas que no están en el menú pero pertenecen a una que sí lo está:
// navegando una pieza, lo que corresponde marcar es Catálogo.
const PAGINA_EN_MENU = { pieza: 'catalogo' };

const initHeader = () => {
  const currentPage = document.body.dataset.page || 'inicio';
  const enMenu = PAGINA_EN_MENU[currentPage] || currentPage;
  // Solo los enlaces de primer nivel: los del desplegable apuntan al mismo
  // archivo con ancla y marcarían Colecciones por error.
  const navLink = [...document.querySelectorAll('.nav > a, .nav-item > a')]
    .find(a => a.getAttribute('href').split('#')[0].endsWith(`${enMenu}.html`));
  navLink?.classList.add('active');
  navLink?.setAttribute('aria-current', 'page');

  const main = document.querySelector('main');
  if (main && !main.id) main.id = 'contenido';

  // Desplegable de Colecciones. El enlace sigue llevando a la página; el
  // botón de al lado solo abre la lista, que es el patrón que esperan los
  // lectores de pantalla. Bajo 980px el CSS la muestra siempre desplegada.
  const submenu = document.querySelector('.nav-item[data-submenu]');
  const submenuBtn = submenu?.querySelector('.nav-toggle');
  const cerrarSubmenu = () => {
    submenu?.classList.remove('open');
    submenuBtn?.setAttribute('aria-expanded', 'false');
  };
  submenuBtn?.addEventListener('click', () => {
    const abierto = !submenu.classList.contains('open');
    submenu.classList.toggle('open', abierto);
    submenuBtn.setAttribute('aria-expanded', String(abierto));
  });
  document.addEventListener('click', e => {
    if (submenu && !submenu.contains(e.target)) cerrarSubmenu();
  });

  const menuBtn = document.querySelector('.menu-btn');
  const nav = document.querySelector('.nav');
  if (menuBtn && nav) {
    // Con el menú cerrado el panel sigue ocupando sitio (solo está oculto),
    // así que offsetParent no basta para saber si algo es enfocable.
    const visible = el => el.offsetParent !== null &&
      getComputedStyle(el).visibility !== 'hidden';
    const foco = () => [...nav.querySelectorAll('a,button')].filter(visible);

    const closeMenu = ({ devolverFoco = false } = {}) => {
      if (!nav.classList.contains('open')) return;
      nav.classList.remove('open');
      menuBtn.classList.remove('open');
      menuBtn.setAttribute('aria-expanded', 'false');
      menuBtn.setAttribute('aria-label', 'Abrir menú');
      document.body.classList.remove('menu-open');
      // Al cerrar con teclado, el foco vuelve al botón que lo abrió;
      // si no, saltaría al principio de la página.
      if (devolverFoco) menuBtn.focus();
    };

    menuBtn.addEventListener('click', () => {
      const open = !nav.classList.contains('open');
      nav.classList.toggle('open', open);
      menuBtn.classList.toggle('open', open);
      menuBtn.setAttribute('aria-expanded', String(open));
      menuBtn.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
      document.body.classList.toggle('menu-open', open);
      // Se espera un fotograma: el panel acaba de dejar de estar oculto y
      // enfocar algo invisible no hace nada.
      if (open) requestAnimationFrame(() => foco()[0]?.focus());
    });

    nav.addEventListener('click', e => { if (e.target.closest('a')) closeMenu(); });

    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') {
        cerrarSubmenu();
        closeMenu({ devolverFoco: true });
        return;
      }
      // Mientras el menú está abierto ocupa toda la pantalla, así que el
      // tabulador tiene que dar la vuelta dentro y no colarse a la página.
      if (e.key !== 'Tab' || !nav.classList.contains('open')) return;
      const items = [menuBtn, ...foco()];
      const i = items.indexOf(document.activeElement);
      if (i === -1) return;
      const siguiente = e.shiftKey
        ? (i === 0 ? items.length - 1 : i - 1)
        : (i === items.length - 1 ? 0 : i + 1);
      e.preventDefault();
      items[siguiente].focus();
    });
  }

  const headerEl = document.querySelector('.site-header');
  if (headerEl) {
    const updateHeader = () => {
      headerEl.classList.toggle('scrolled', window.scrollY > 30);
      const progress = document.querySelector('.scroll-progress');
      if (progress) {
        const doc = document.documentElement;
        const total = doc.scrollHeight - doc.clientHeight;
        progress.style.width = total > 0 ? `${(window.scrollY / total) * 100}%` : '0%';
      }
    };
    window.addEventListener('scroll', updateHeader, { passive: true });
    updateHeader();
  }
};

const initScrollReveal = () => {
  if (!('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const nodes = [...document.querySelectorAll(
    '.proof-band article, .section-head, .catalog-title, .world-card, .product, .tech-card, .process-row article, .pillars article, .place-row a, .contact-method'
  )];
  if (!nodes.length) return;
  document.documentElement.classList.add('motion-ready');
  nodes.forEach((node, i) => {
    node.classList.add('animate-in');
    node.style.setProperty('--reveal-delay', `${Math.min(i % 4, 3) * 70}ms`);
  });
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -5% 0px' });
  nodes.forEach(node => observer.observe(node));
};

// La foto de la pieza se transforma en la foto de la ficha al navegar.
// Solo se bautiza la que se acaba de pulsar: el nombre tiene que ser
// único en la página, y nombrar las 51 de golpe obligaría al navegador
// a capturar 51 capas en cada transición para usar una.
const initTransicionPieza = () => {
  if (!document.startViewTransition) return;
  const MARCA = 'pieza-activa';
  const limpiar = () => document.querySelectorAll(`[style*="${MARCA}"]`)
    .forEach(el => { el.style.viewTransitionName = ''; });

  document.addEventListener('click', e => {
    const media = e.target.closest('.product-media');
    if (!media) return;
    limpiar();
    const img = media.querySelector('img');
    if (img) img.style.viewTransitionName = MARCA;
  });

  // Al volver atrás la página se restaura tal cual la dejamos; sin esto
  // el nombre se quedaría puesto en una foto que ya no toca.
  window.addEventListener('pageshow', e => { if (e.persisted) limpiar(); });

  // Si se pulsa otro enlace antes de que termine la transición, el
  // navegador la cancela y su promesa queda rechazada sin dueño. No es
  // un fallo —la navegación sigue— pero ensucia la consola y taparía
  // errores de verdad.
  const silenciar = e => {
    if (!e.viewTransition) return;
    e.viewTransition.finished.catch(() => {});
    e.viewTransition.ready.catch(() => {});
  };
  window.addEventListener('pageswap', silenciar);
  window.addEventListener('pagereveal', silenciar);
};

const initCinematicScenes = () => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const scenes = [...document.querySelectorAll('.hero, .page-hero, .destination')];
  if (!scenes.length) return;
  let scheduled = false;
  const update = () => {
    const viewport = window.innerHeight;
    scenes.forEach(scene => {
      const rect = scene.getBoundingClientRect();
      if (rect.bottom < -100 || rect.top > viewport + 100) return;
      const distance = viewport / 2 - (rect.top + rect.height / 2);
      const limit = window.innerWidth < 600 ? 12 : 24;
      const shift = Math.max(-limit, Math.min(limit, distance * .035));
      scene.style.setProperty('--scene-shift', `${shift.toFixed(1)}px`);
    });
    scheduled = false;
  };
  const schedule = () => {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(update);
  };
  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', schedule, { passive: true });
  update();
};

document.addEventListener('DOMContentLoaded', () => {
  initHeader();
  injectCart();
  cart.render();
  initCartTriggers();
  injectWhatsApp();
  injectSearch();
  injectToTop();
  initNewsletter();
  initProductPage();
  initFilters();
  initDestinos();
  initContactForm();
  initCheckout();
  initScrollReveal();
  initCinematicScenes();
  initTransicionPieza();
});
