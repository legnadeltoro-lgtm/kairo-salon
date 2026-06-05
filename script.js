/* ══════════════════════════════════════════════
   KAIRO SALON — script.js compartido v3
   Páginas: index.html / tienda.html / reserva.html
   ══════════════════════════════════════════════ */
"use strict";

/* ── Datos ── */
const WHATSAPP = "5363190976";

const SVC_IMGS = [
  "img/alisado.jpg",
  "img/botox.jpg",
  "img/cabello-recuperado.jpg",
  "img/corte.jpg",
];

const servicios = [
  {id:"s1",nombre:"Alisado sin formol",precio:80,descripcion:"Tratamiento alisador profesional libre de formol que reduce frizz, aporta brillo y deja el cabello manejable hasta por 4 meses.",productos:["Keratina vegetal","Mascarilla sellado","Shampoo neutro"]},
  {id:"s2",nombre:"Botox capilar",precio:55,descripcion:"Rejuvenece el cabello: rellena la fibra capilar, suaviza, hidrata profundamente y reduce el volumen sin alisar permanentemente.",productos:["Botox capilar","Ampolla reconstructora"]},
  {id:"s3",nombre:"Recuperación de cabello dañado",precio:45,descripcion:"Protocolo intensivo para cabellos con decoloración, quema o exceso de calor. Devuelve elasticidad y resistencia.",productos:["Plex","Mascarilla proteínas","Ampolla queratina"]},
  {id:"s4",nombre:"Corte y peinado",precio:20,descripcion:"Asesoría de corte según tu rostro y estilo, con lavado y peinado final.",productos:["Spray térmico","Acabado brillo"]}
];

const PROD_IMGS = {
  p1:"img/tratamiento.jpg",
  p2:"img/alisado.jpg",
  p3:"img/botox.jpg",
  p4:"img/cabello-recuperado.jpg",
  p5:"img/diagnostico-capialr.jpg",
  p6:"img/reserva.jpg",
  p7:"img/corte.jpg",
  p8:"img/tratamiento.jpg",
};

const productos = [
  {id:"p1",nombre:"Shampoo neutro pH 5.5",precio:12,tipoCabello:"Todos",ingrediente:"Aloe vera",tipo:"Shampoo",highlight:"Limpieza suave que no reseca."},
  {id:"p2",nombre:"Keratina vegetal sin formol",precio:38,tipoCabello:"Ondulado",ingrediente:"Keratina",tipo:"Keratina",highlight:"Controla frizz y mejora la manejabilidad."},
  {id:"p3",nombre:"Botox capilar premium",precio:32,tipoCabello:"Rizo",ingrediente:"Colágeno",tipo:"Botox",highlight:"Ideal para nutrir y dar cuerpo."},
  {id:"p4",nombre:"Mascarilla reparadora",precio:18,tipoCabello:"Seco/Dañado",ingrediente:"Argán",tipo:"Mascarilla",highlight:"Recuperación intensa y brillo."},
  {id:"p5",nombre:"Ampolla reconstructora",precio:9,tipoCabello:"Dañado",ingrediente:"Queratina",tipo:"Ampolla",highlight:"Apoyo rápido para fibra sensibilizada."},
  {id:"p6",nombre:"Sérum anti-frizz",precio:15,tipoCabello:"Ondulado",ingrediente:"Aceite de coco",tipo:"Sérum",highlight:"Acabado suave y ligero."},
  {id:"p7",nombre:"Shampoo rizos definidos",precio:14,tipoCabello:"Rizo",ingrediente:"Manteca de karité",tipo:"Shampoo",highlight:"Define rizos sin apelmazar."},
  {id:"p8",nombre:"Mascarilla hidratante",precio:16,tipoCabello:"Muy rizo",ingrediente:"Aguacate",tipo:"Mascarilla",highlight:"Hidratación profunda y elasticidad."},
];

const municipios = ["Plaza de la Revolución","Centro Habana","Habana Vieja","Cerro","10 de Octubre","Playa","Marianao","La Lisa","Boyeros","Arroyo Naranjo","Cotorro","Guanabacoa","Regla","San Miguel del Padrón","Habana del Este"];
const SHIPPING_PRICES = [10, 15, 20, 25];
const PRECIO_DOMICILIO = 15;

function getShippingPrice(municipio) {
  if (!municipio) return PRECIO_DOMICILIO;
  const idx = municipios.findIndex(m => m.toLowerCase() === municipio.toLowerCase());
  if (idx === -1) return PRECIO_DOMICILIO;
  const group = Math.floor(idx / 4);
  return SHIPPING_PRICES[group] !== undefined ? SHIPPING_PRICES[group] : SHIPPING_PRICES[SHIPPING_PRICES.length-1] || PRECIO_DOMICILIO;
}
const PRODUCTS_INITIAL_COUNT = 4, PRODUCTS_STEP = 4;

/* ── Helpers ── */
const $  = (s, p=document) => p.querySelector(s);
const $$ = (s, p=document) => Array.from(p.querySelectorAll(s));
const money = n => "$" + Number(n).toFixed(2);
const on = (el, ev, fn) => el && el.addEventListener(ev, fn);
const escapeHTML = value => String(value)
  .replace(/&/g, "&amp;")
  .replace(/</g, "&lt;")
  .replace(/>/g, "&gt;")
  .replace(/\"/g, "&quot;")
  .replace(/'/g, "&#39;");
const openExternal = url => {
  const win = window.open(url, "_blank", "noopener,noreferrer");
  if (win) win.opener = null;
};

/* ── Header scroll shadow ── */
const hdr = $("#siteHeader");
window.addEventListener("scroll", () => hdr && hdr.classList.toggle("scrolled", scrollY > 30), {passive:true});

/* ── Active nav link ── */
(function markActive(){
  const page = location.pathname.split("/").pop() || "index.html";
  $$(".nav a").forEach(a => {
    const href = a.getAttribute("href") || "";
    if (href === page || (page === "index.html" && href === "index.html")) a.classList.add("active");
  });
})();

/* ── Mobile nav ── */
const burger = $("#burger"), nav = $("#nav");
function setNavState(open) {
  if (!nav || !burger) return;
  nav.classList.toggle("open", open);
  nav.hidden = !open;
  burger.setAttribute("aria-expanded", String(open));
  burger.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
  document.body.classList.toggle("nav-open", open);
}
on(burger, "click", () => {
  setNavState(!(nav && nav.classList.contains("open")));
});
$$("[data-nav]").forEach(a => on(a, "click", () => setNavState(false)));
document.addEventListener("keydown", e => { if (e.key === "Escape") setNavState(false); });

/* ── Scroll animations ── */
const animObs = new IntersectionObserver(es => es.forEach(e => {
  if (e.isIntersecting) { e.target.classList.add("visible"); animObs.unobserve(e.target); }
}), {threshold:.08});
$$("[data-anim]").forEach(el => animObs.observe(el));

function autoGrowTextarea(el) {
  if (!el) return;
  const grow = () => {
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  };
  on(el, "input", grow);
  requestAnimationFrame(grow);
}

$$('textarea[data-autogrow]').forEach(autoGrowTextarea);

/* ════════════ CARRITO (shared) ════════════ */
let cart = [];
try { cart = JSON.parse(localStorage.getItem("kairo_cart") || "[]"); } catch(e) { cart = []; }

function saveCart() {
  localStorage.setItem("kairo_cart", JSON.stringify(cart));
  const badge = $("#cartBadge");
  if (badge) badge.textContent = cart.reduce((a,c) => a+c.qty, 0);
  renderCart();
}
function addToCart(id) {
  const p = productos.find(x => x.id === id); if (!p) return;
  const ex = cart.find(c => c.id === id);
  if (ex) ex.qty++; else cart.push({id, qty:1, nombre:p.nombre, precio:p.precio});
  saveCart();
}
function changeQty(id, delta) {
  const ex = cart.find(c => c.id === id); if (!ex) return;
  ex.qty += delta;
  if (ex.qty <= 0) cart = cart.filter(c => c.id !== id);
  saveCart();
}
function removeFromCart(id) {
  cart = cart.filter(c => c.id !== id);
  saveCart();
  if (typeof renderProducts === "function") renderProducts();
}
function cartSubtotal() { return cart.reduce((a,c) => a + c.precio*c.qty, 0); }

function renderCart() {
  const list = $("#cartList"), footer = $("#cartFooter");
  if (!list) return;
  if (!cart.length) {
    list.innerHTML = `<p class="cart__empty">Tu carrito está vacío.</p>`;
    $("#cartTotal") && ($("#cartTotal").textContent = money(0));
    if (footer) footer.hidden = true;
    return;
  }
  list.innerHTML = cart.map(c => `
    <div class="cart__item">
      <div class="cart__item-info">
        <h4>${escapeHTML(c.nombre)}</h4>
        <small>${money(c.precio)} c/u</small>
      </div>
      <div class="cart__item-actions">
        <div class="product__qty">
          <button data-cdec="${c.id}">−</button>
          <span>${c.qty}</span>
          <button data-cinc="${c.id}">+</button>
        </div>
        <strong style="min-width:52px;text-align:right">${money(c.precio*c.qty)}</strong>
        <button class="cart__remove" data-crm="${c.id}" aria-label="Eliminar">Eliminar</button>
      </div>
    </div>`).join("");
  if ($("#cartTotal")) $("#cartTotal").textContent = money(cartSubtotal());
  if (footer) footer.hidden = false;
  $$("[data-cinc]").forEach(b => on(b, "click", () => changeQty(b.dataset.cinc, +1)));
  $$("[data-cdec]").forEach(b => on(b, "click", () => changeQty(b.dataset.cdec, -1)));
  $$("[data-crm]").forEach(b => on(b, "click", () => removeFromCart(b.dataset.crm)));
}

/* ── Update badge on load ── */
(function initBadge(){
  const badge = $("#cartBadge");
  if (badge) badge.textContent = cart.reduce((a,c) => a+c.qty, 0);
})();

/* ════════════ CHECKOUT MODAL ════════════ */
on($("#checkoutBtn"), "click", () => { if (!cart.length) return; updateCheckoutTotals(); openModal("#checkoutModal"); });

$$('input[name="domicilio"]').forEach(r => on(r, "change", updateCheckoutTotals));
on($("#municipio"), "input", updateCheckoutTotals);
on($("#municipio"), "change", updateCheckoutTotals);

function updateCheckoutTotals() {
  const checked = $('input[name="domicilio"]:checked');
  const dom = checked ? checked.value === "Si" : true;
  const domBox = $("#domBox");

  if (domBox) {
    domBox.hidden = !dom;
    $$('input, select, textarea', domBox).forEach(f => {
      f.disabled = !dom;
      f.required = dom;
      if (!dom) f.value = "";
    });
  }

  const sub  = cartSubtotal();
  const municipioVal = ($("#municipio")||{value:""}).value || "";
  const ship = dom ? getShippingPrice(municipioVal) : 0;

  const shipRow = $("#coShippingRow");
  const shipVal = $("#coShipping");
  if (shipRow) { shipRow.hidden = !dom; shipRow.style.display = dom ? "" : "none"; }
  if (shipVal) { shipVal.textContent = dom ? money(ship) : ""; }

  if ($("#coSubtotal")) $("#coSubtotal").textContent = money(sub);
  if ($("#coTotal"))     $("#coTotal").textContent     = money(sub + ship);
}

on($("#sendOrder"), "click", () => {
  const checked = $('input[name="domicilio"]:checked');
  const dom = checked ? checked.value === "Si" : false;
  const sub = cartSubtotal();
  const municipioVal = ($("#municipio")||{value:""}).value || "";
  const ship = dom ? getShippingPrice(municipioVal) : 0;
  const total = sub + ship;
  if (dom) {
    const requiredFields = ["municipio", "direccion", "referencia", "descDom"]
      .map(id => $("#" + id))
      .filter(Boolean);
    const firstInvalid = requiredFields.find(field => !String(field.value || "").trim());
    if (firstInvalid) {
      firstInvalid.focus();
      firstInvalid.reportValidity?.();
      return;
    }
  }
  const lineas = cart.map(c => `• ${c.nombre} x${c.qty} — ${money(c.precio*c.qty)}`).join("\n");
  const parts = [`*Nuevo pedido*`, lineas, ``, `Subtotal: ${money(sub)}`];
  if (dom) parts.push(`Domicilio: ${money(ship)}`);
  parts.push(`*Total: ${money(total)}*`);
  if (dom) {
    parts.push(``, `*Datos de entrega*`,
      `Municipio: ${($("#municipio")||{value:"—"}).value||"—"}`,
      `Dirección: ${($("#direccion")||{value:"—"}).value||"—"}`,
      `Referencia: ${($("#referencia")||{value:"—"}).value||"—"}`,
      `Descripción: ${($("#descDom")||{value:"—"}).value||"—"}`
    );
  }
  parts.push(``, `¿Pueden confirmar el pedido? ¡Gracias!`);
  window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(parts.join("\n"))}`, "_blank");
});

/* ════════════ MODAL genérico ════════════ */
let lastModalTrigger = null;
function openModal(sel) {
  const m = $(sel); if (!m) return;
  lastModalTrigger = document.activeElement instanceof HTMLElement ? document.activeElement : null;
  m.hidden = false; m.classList.add("is-open");
  document.body.style.overflow = "hidden";
  requestAnimationFrame(() => (m.querySelector(".modal__card") || m).focus());
}
function closeModal(sel) {
  const m = $(sel); if (!m) return;
  m.classList.remove("is-open"); m.hidden = true;
  document.body.style.overflow = "";
  lastModalTrigger?.focus?.();
}
function closeAllModals() {
  $$(".modal").forEach(m => { m.classList.remove("is-open"); m.hidden = true; });
  document.body.style.overflow = ""; lastModalTrigger = null;
}
$$(".modal").forEach(m => on(m, "click", e => { if (e.target.matches("[data-close]")) closeModal("#"+m.id); }));
document.addEventListener("keydown", e => { if (e.key === "Escape") closeAllModals(); });
window.addEventListener("pageshow", closeAllModals);

/* ════════════ SERVICIOS (index + modal) ════════════ */
let pendingService = null;
function renderServicios() {
  const grid = $("#serviciosGrid"); if (!grid) return;
  grid.innerHTML = servicios.map((s, i) => `
    <div class="svc-card" data-anim data-delay="${i%4+1}">
      <div class="svc-card__img-wrap">
        <img src="${SVC_IMGS[i]}" alt="${s.nombre}" class="svc-card__img" loading="lazy" decoding="async"/>
      </div>
      <div class="svc-card__body">
        <div class="svc-card__price">${money(s.precio)}</div>
        <h3>${s.nombre}</h3>
        <p style="font-size:.88rem;margin:.4rem 0 .85rem">${s.descripcion}</p>
        <div class="svc-card__tags">${s.productos.map(p => `<span class="tag">${p}</span>`).join("")}</div>
        <button class="btn btn--primary btn--sm" data-book="${s.id}" style="margin-top:.5rem">Reservar cita</button>
      </div>
    </div>`).join("");
  $$("[data-book]").forEach(b => on(b, "click", () => {
    pendingService = b.dataset.book;
    openModal("#serviceModal");
  }));
  $$("[data-anim]:not(.visible)", grid).forEach(el => animObs.observe(el));
}

on($("#modalYes"), "click", () => {
  closeModal("#serviceModal");
  window.location.href = "reserva.html";
});
on($("#modalNo"), "click", () => {
  const s = servicios.find(x => x.id === pendingService);
  if (!s) { closeModal("#serviceModal"); return; }
  const msg = `Hola, quiero reservar: *${s.nombre}* (${money(s.precio)}).`;
  closeModal("#serviceModal");
  window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(msg)}`, "_blank");
});

/* ════════════ PRODUCTOS (tienda.html) ════════════ */
let visibleProductsCount = PRODUCTS_INITIAL_COUNT;
let spotlightProductId = productos[0]?.id || null;

function fillDatalist(id, values) {
  const el = $("#"+id); if (!el) return;
  el.innerHTML = [...new Set(values)].map(v => `<option value="${escapeHTML(v)}">`).join("");
}
function renderFilters() {
  fillDatalist("dl-hair",  productos.map(p => p.tipoCabello));
  fillDatalist("dl-ing",   productos.map(p => p.ingrediente));
  fillDatalist("dl-type",  productos.map(p => p.tipo));
  fillDatalist("dl-municipios-modal", municipios);
}

function renderProducts() {
  const grid = $("#productsGrid"); if (!grid) return;
  const fH = ($("#fHair")||{value:""}).value.trim().toLowerCase();
  const fI = ($("#fIng")||{value:""}).value.trim().toLowerCase();
  const fT = ($("#fType")||{value:""}).value.trim().toLowerCase();
  const filtered = productos.filter(p =>
    (!fH || p.tipoCabello.toLowerCase().includes(fH)) &&
    (!fI || p.ingrediente.toLowerCase().includes(fI)) &&
    (!fT || p.tipo.toLowerCase().includes(fT))
  );
  const list = filtered.slice(0, visibleProductsCount);
  if (!list.length) {
    grid.innerHTML = `<p style="grid-column:1/-1;text-align:center;color:var(--muted)">Sin resultados para ese filtro.</p>`;
    updateLoadMore(filtered.length); return;
  }
  grid.innerHTML = list.map(p => {
    const inCart = cart.find(c => c.id === p.id);
    return `<div class="prod-card">
      <div class="prod-card__img-wrap">
        <img class="prod-card__img" src="${PROD_IMGS[p.id]}" alt="${escapeHTML(p.nombre)}" loading="lazy" decoding="async"/>
        <span class="prod-card__tipo">${escapeHTML(p.tipo)}</span>
      </div>
      <div class="prod-card__body">
        <div class="prod-card__name">${escapeHTML(p.nombre)}</div>
        <div class="prod-card__ing">${escapeHTML(p.ingrediente)} · ${escapeHTML(p.tipoCabello)}</div>
        <div class="prod-card__highlight">${escapeHTML(p.highlight)}</div>
        <div class="prod-card__footer">
          <div class="price-qty-wrapper">
            <span class="prod-card__price">${money(p.precio)}</span>
            ${inCart ? `
            <div class="product__qty">
              <button data-dec="${p.id}">−</button>
              <span id="qty-${p.id}">${inCart.qty}</span>
              <button data-inc="${p.id}">+</button>
            </div>` : ''}
          </div>
          <div class="action-buttons">
            <button class="btn btn--ghost btn--sm" data-feature="${p.id}" title="Ver destacado" aria-label="Ver producto destacado">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:14px;height:14px"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            </button>
            <button class="btn btn--primary btn--sm" data-add="${p.id}">${inCart ? 'Añadir otro' : 'Añadir'}</button>
          </div>
        </div>
      </div>
    </div>`;
  }).join("");
  $$("[data-add]").forEach(b  => on(b,"click",() => { addToCart(b.dataset.add);  renderProducts(); }));
  $$("[data-inc]").forEach(b  => on(b,"click",() => { changeQty(b.dataset.inc,+1); renderProducts(); }));
  $$("[data-dec]").forEach(b  => on(b,"click",() => { changeQty(b.dataset.dec,-1); renderProducts(); }));
  $$("[data-feature]").forEach(b => on(b,"click",() => {
    spotlightProductId = b.dataset.feature;
    renderSpotlight();
    $("#productSpotlight")?.scrollIntoView({behavior:"smooth",block:"start"});
  }));
  updateLoadMore(filtered.length);
}
function renderSpotlight(pid = spotlightProductId) {
  const t = $("#productSpotlight"); if (!t) return;
  const p = productos.find(x => x.id === pid) || productos[0];
  if (!p) return;
  spotlightProductId = p.id;
  const inCart = cart.find(c => c.id === p.id);
  t.innerHTML = `
    <span class="spotlight__badge">Producto destacado</span>
    <div class="spotlight__img-wrap">
      <img class="spotlight__image" src="${PROD_IMGS[p.id]}" alt="${escapeHTML(p.nombre)}" loading="eager" decoding="async"/>
    </div>
    <div class="spotlight__content">
      <span class="spotlight__eyebrow">${escapeHTML(p.tipo)}</span>
      <h3>${escapeHTML(p.nombre)}</h3>
      <p>${escapeHTML(p.highlight)}</p>
      <div class="spotlight__meta">${escapeHTML(p.ingrediente)} · Para cabello ${escapeHTML(p.tipoCabello)}</div>
      <div class="spotlight__price">${money(p.precio)}</div>
      <button class="btn btn--gold" data-spot-add="${p.id}">${inCart ? "Añadir otro" : "Añadir al carrito"}</button>
    </div>`;
  $$("[data-spot-add]").forEach(b => on(b,"click",() => {
    addToCart(b.dataset.spotAdd); renderProducts(); renderSpotlight(b.dataset.spotAdd);
  }));
}

["fHair","fIng","fType"].forEach(id => on($("#"+id),"input",() => { visibleProductsCount=PRODUCTS_INITIAL_COUNT; renderProducts(); }));
on($("#clearFilters"), "click", () => { ["fHair","fIng","fType"].forEach(id => { const el=$("#"+id); if(el) el.value=""; }); visibleProductsCount=PRODUCTS_INITIAL_COUNT; renderProducts(); });
on($("#loadMoreProducts"), "click", () => { visibleProductsCount += PRODUCTS_STEP; renderProducts(); });
function updateLoadMore(total) { const b=$("#loadMoreProducts"); if(b) b.hidden = total <= visibleProductsCount; }

/* ════════════ RESERVA / DIAGNÓSTICO (reserva.html) ════════════ */
function syncToggleGroup(toggleSelector, groupName) {
  const box = $(toggleSelector);
  if (!box) return;
  const checked = $(`input[name="${groupName}"]:checked`);
  const show = checked ? checked.value === "Si" : false;
  box.hidden = !show;
  $$("input, select, textarea", box).forEach(field => {
    field.disabled = !show;
    if (!show) {
      if (field.type === "checkbox" || field.type === "radio") field.checked = false;
      else field.value = "";
    }
  });
}

const toggleTargets = new Map();
$$("input[data-toggle]").forEach(inp => {
  toggleTargets.set(inp.dataset.toggle, inp.name);
  on(inp, "change", () => syncToggleGroup(inp.dataset.toggle, inp.name));
});
toggleTargets.forEach((groupName, toggleSelector) => syncToggleGroup(toggleSelector, groupName));

on($("#diagForm"), "submit", e => {
  e.preventDefault();
  const fd = new FormData(e.target);
  const data = {
    nombre: fd.get("nombre"), tipo: fd.get("tipo"),
    problemas: fd.getAll("problemas"), descripcion: fd.get("descripcion") || "",
    calor: fd.get("calor"), herramienta: fd.get("herramienta") || "",
    frecuenciaCalor: fd.get("frecuenciaCalor") || "", corte: fd.get("corte"),
    tinte: fd.get("tinte"), tipoTinte: fd.get("tipoTinte") || "",
    frecuenciaTinte: fd.get("frecuenciaTinte") || ""
  };
  const box = $("#analysisBox"); if (!box) return;
  box.hidden = false;
  const rec = $("#recommendation"); if (rec) rec.hidden = true;
  const bar = $("#progressBar"); if (bar) bar.style.width = "0%";
  box.scrollIntoView({behavior:"smooth"});
  let pct = 0;
  const it = setInterval(() => {
    pct += 4 + Math.random()*6;
    if (pct >= 100) { pct=100; clearInterval(it); showRecommendation(data); }
    if (bar) bar.style.width = pct + "%";
  }, 90);
});

function recomendar(d) {
  if (d.tinte==="Si" && /Decoloración|Mechas/.test(d.tipoTinte))
    return {titulo:"Recuperación intensiva + Botox capilar",detalle:"Tu cabello presenta procesos químicos. Sugerimos un protocolo reconstructor previo y botox capilar antes de cualquier alisado."};
  if (d.problemas.includes("Con frizz") || d.tipo==="Muy rizo" || d.tipo==="Rizo")
    return {titulo:"Alisado sin formol",detalle:"Ideal para controlar frizz y aportar manejabilidad sin perder la salud del cabello."};
  if (d.problemas.some(p => /Seco|Puntas|Quebradizo|Sin brillo/.test(p)))
    return {titulo:"Botox capilar + tratamiento hidratante",detalle:"Recuperaremos hidratación, brillo y sellaremos puntas."};
  return {titulo:"Tratamiento de mantenimiento",detalle:"Tu cabello está en buen estado. Recomendamos un tratamiento de mantenimiento e hidratación profunda."};
}
function showRecommendation(d) {
  const r = recomendar(d);
  const rec = $("#recommendation"); if (!rec) return;
  rec.innerHTML = `
    <h4>Recomendación: ${escapeHTML(r.titulo)}</h4>
    <p>${escapeHTML(r.detalle)}</p>
    <p><em>El día de la cita evaluamos elasticidad, porosidad y otros aspectos que pueden ajustar el diagnóstico final.</em></p>
    <button class="btn btn--gold btn--block" id="confirmReserve">Confirmar reserva por WhatsApp</button>`;
  rec.hidden = false;
  on($("#confirmReserve"), "click", () => enviarReserva(d, r));
}
function enviarReserva(d, r) {
  const msg = [
    `*Nueva reserva — Diagnóstico capilar*`,
    `Nombre: ${d.nombre}`, `Tipo de cabello: ${d.tipo}`,
    `Problemas: ${d.problemas.join(", ") || "—"}`,
    d.descripcion ? `Descripción: ${d.descripcion}` : null,
    `Herramientas de calor: ${d.calor}${d.calor==="Si"?` (${d.herramienta}, ${d.frecuenciaCalor})`:""}`,
    `Frecuencia de corte: ${d.corte}`,
    `Tintura: ${d.tinte}${d.tinte==="Si"?` (${d.tipoTinte}, ${d.frecuenciaTinte})`:""}`,
    ``, `*Tratamiento recomendado:* ${r.titulo}`, r.detalle,
    ``, `¿Pueden confirmarme la cita? ¡Gracias!`
  ].filter(Boolean).join("\n");
  window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(msg)}`, "_blank");
}

/* ════════════ INIT por página ════════════ */
(function init() {
  closeAllModals();
  const yearEl = $("#year"); if (yearEl) yearEl.textContent = new Date().getFullYear();

  const page = location.pathname.split("/").pop() || "index.html";

  if (page === "index.html" || page === "") {
    renderServicios();
  }
  if (page === "tienda.html") {
    renderFilters();
    renderSpotlight();
    renderProducts();
  }
  renderCart();
})();
