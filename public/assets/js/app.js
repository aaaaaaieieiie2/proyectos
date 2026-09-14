// ============================================================================
// public/assets/js/app.js — MOTOR DE LA WEB (Fase 1: plantilla estática)
// Funciona con data.js (datos) y styles.css (diseño). Sin BD (BACKEND_ENABLED=false).
// ============================================================================
'use strict';
// ── Utilidades base ─────────────────────────────────────────────────────────
// $ y on ya están declaradas en api.js (carga primero)
// LOGO_URL, COMPANY_WA, COMPANY_MAIL, BACKEND_ENABLED están definidas en data.js (carga primero)
document.querySelectorAll('.js-logo').forEach(im => { im.src = LOGO_URL; });
const esc = (s) => {
    if (!s) return '';
    const clean = (typeof DOMPurify !== 'undefined') ? DOMPurify.sanitize(String(s)) : String(s);
    return clean.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
};
const CSRF_TOKEN = (document.querySelector('input[name="csrf_token"]') || {}).value || '';
async function apiPost(action, payloadKey, payloadData) {
    if (!BACKEND_ENABLED) { console.log('[plantilla] guardado en memoria:', action); return true; }
    if (!CSRF_TOKEN && document.body.classList.contains('edit-mode')) { alert('Error crítico: sesión inválida (sin CSRF).'); return false; }
    try {
        const body = { action: action }; body[payloadKey] = payloadData;
        const response = await fetch('api.php', { method: 'POST', headers: { 'Content-Type': 'application/json', 'X-CSRF-Token': CSRF_TOKEN }, body: JSON.stringify(body) });
        let result = null;
        try { result = await response.json(); } catch (jsonErr) { console.error('Respuesta no JSON:', jsonErr); }
        if (!response.ok || !result || result.status === 'error') { alert('⚠️ Error al sincronizar: ' + ((result && result.message) || response.status)); return false; }
        return true;
    } catch (e) { console.error('Error de conexión:', e); alert('⚠️ Error de conexión con el servidor.'); return false; }
}
// ── Estado (con guards por si data.js aún no está) ──────────────────────────
const DEFAULT_BEACHES = [
    { id: 'playa-bocas', name: 'Bocas del Toro — Playa Estrella', zone: 'Bocas del Toro', emoji: '⭐', price: 120, duration: '🕒 Día completo (vuelo + lancha)', img: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1200&auto=format&fit=crop', desc: 'Mar turquesa, cayos de arena blanca y las famosas estrellas de mar. El Caribe panameño en su máxima expresión.' },
    { id: 'playa-islagrande', name: 'Isla Grande — Portobelo', zone: 'Colón', emoji: '🏝️', price: 65, duration: '🕒 Día completo', img: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?q=80&w=1200&auto=format&fit=crop', desc: 'Isla caribeña de aguas cálidas, arrecifes para snorkel y atardeceres dorados a poca distancia de la ciudad.' },
    { id: 'playa-blanca', name: 'Playa Blanca — Farallón', zone: 'Coclé', emoji: '🤍', price: 55, duration: '🕒 Día completo', img: 'https://images.unsplash.com/photo-1506929562872-bb421503ef21?q=80&w=1200&auto=format&fit=crop', desc: 'La playa de arena blanca más famosa del Pacífico: 3 km de arena finísima y mar calmado, ideal para familias.' },
    { id: 'playa-contadora', name: 'Isla Contadora', zone: 'Archipiélago de las Perlas', emoji: '🛥️', price: 95, duration: '🕒 Día completo (ferry)', img: 'https://images.unsplash.com/photo-1476673160081-cf065607f449?q=80&w=1200&auto=format&fit=crop', desc: 'La joya de las Perlas: 13 playas de arena perlada, aguas calmas y atardeceros de postal a 45 min en ferry.' },
    { id: 'playa-venao', name: 'Playa Venao', zone: 'Pedasí, Los Santos', emoji: '🏄', price: 75, duration: '🕒 Día completo', img: 'https://images.unsplash.com/photo-1471922694854-ff1b63b20054?q=80&w=1200&auto=format&fit=crop', desc: 'El paraíso del surf en Panamá: ola constante todo el año, ambiente joven y atardeceres dorados.' }
]; // Estado Global Editable (Clones profundos para no mutar las constantes base)
let TOURS = (typeof window.BACKEND_TOURS !== 'undefined' && window.BACKEND_TOURS) ? window.BACKEND_TOURS : (typeof INITIAL_TOURS !== 'undefined' ? INITIAL_TOURS : []).map(t => Object.assign({}, t));
let TRANSFERS = (typeof window.BACKEND_TRANSFERS !== 'undefined' && window.BACKEND_TRANSFERS) ? window.BACKEND_TRANSFERS : (typeof INITIAL_TRANSFERS !== 'undefined' ? INITIAL_TRANSFERS : []).map(t => Object.assign({}, t));
let BEACHES = (typeof window.BACKEND_BEACHES !== 'undefined' && window.BACKEND_BEACHES) ? window.BACKEND_BEACHES : (typeof INITIAL_BEACHES !== 'undefined' && INITIAL_BEACHES.length ? INITIAL_BEACHES : DEFAULT_BEACHES).map(b => Object.assign({}, b));
let SERVICES = (typeof window.BACKEND_SERVICES !== 'undefined' && window.BACKEND_SERVICES) ? window.BACKEND_SERVICES : (typeof INITIAL_SERVICES !== 'undefined' ? INITIAL_SERVICES : []).map(s => Object.assign({}, s));
let ABOUT_BLOCKS = (typeof window.BACKEND_ABOUT !== 'undefined' && window.BACKEND_ABOUT) ? window.BACKEND_ABOUT : (typeof INITIAL_ABOUT_BLOCKS !== 'undefined' ? INITIAL_ABOUT_BLOCKS : []).map(b => Object.assign({}, b));
let ZONES = (typeof window.BACKEND_ZONES !== 'undefined' && window.BACKEND_ZONES) ? window.BACKEND_ZONES : ((typeof INITIAL_ZONES !== 'undefined') ? INITIAL_ZONES : []);
let STYLES = (typeof window.BACKEND_STYLES !== 'undefined' && window.BACKEND_STYLES) ? window.BACKEND_STYLES : ((typeof INITIAL_STYLES !== 'undefined') ? INITIAL_STYLES : [['all', '🌟 Todos']]);
let SOCIAL = (typeof window.BACKEND_SOCIAL !== 'undefined' && window.BACKEND_SOCIAL) ? window.BACKEND_SOCIAL : ((typeof INITIAL_SOCIAL !== 'undefined') ? INITIAL_SOCIAL : {});
let SITE_TEXTS = (typeof window.BACKEND_TEXTS !== 'undefined' && window.BACKEND_TEXTS) ? window.BACKEND_TEXTS : ((typeof INITIAL_SITE_TEXTS !== 'undefined') ? INITIAL_SITE_TEXTS : {});
const SEED_REVIEWS = (typeof window.BACKEND_REVIEWS !== 'undefined' && window.BACKEND_REVIEWS) ? window.BACKEND_REVIEWS : ((typeof INITIAL_SEED_REVIEWS !== 'undefined') ? INITIAL_SEED_REVIEWS : []);
let userReviews = [];
const byId = id => TOURS.find(t => t.id === id);
const byTransferId = id => TRANSFERS.find(t => t.id === id);
const byBeachId = id => BEACHES.find(b => b.id === id);
const saveTours = async () => apiPost('sync_tours', 'tours', TOURS);
const saveTransfers = async () => apiPost('sync_transfers', 'data', TRANSFERS);
const saveBeaches = async () => apiPost('sync_beaches', 'beaches', BEACHES);
const saveServices = async () => apiPost('sync_services', 'data', SERVICES);
const saveAboutBlocks = async () => apiPost('sync_about', 'data', ABOUT_BLOCKS);
const saveZones = async () => apiPost('sync_zones', 'data', ZONES);
const saveStyles = async () => apiPost('sync_styles', 'data', STYLES);
const saveTexts = async () => apiPost('sync_texts', 'data', TEXTS);
const saveSocial = async () => apiPost('sync_social', 'data', SOCIAL);
function moveItemInArray(arr, idx, dir) { if (idx < 0 || idx >= arr.length) return false; const n = idx + dir; if (n < 0 || n >= arr.length) return false; const t = arr[idx]; arr[idx] = arr[n]; arr[n] = t; return true; }
// ── Menú móvil ──────────────────────────────────────────────────────────────
const mobileBtn = $('mobile-menu-btn'), navLinksObj = $('main-nav-links');
if (mobileBtn && navLinksObj) {
    on(mobileBtn, 'click', e => { e.stopPropagation(); mobileBtn.classList.toggle('active'); navLinksObj.classList.toggle('active'); });
    document.addEventListener('click', e => { if (!navLinksObj.contains(e.target) && !mobileBtn.contains(e.target)) { mobileBtn.classList.remove('active'); navLinksObj.classList.remove('active'); } });
}
// ── Textos editables ────────────────────────────────────────────────────────
const baseTexts = {};
document.querySelectorAll('[data-txt]').forEach(el => { baseTexts[el.dataset.txt] = el.textContent; });
let TEXTS = Object.assign({}, baseTexts, SITE_TEXTS);
function applyTexts() { document.querySelectorAll('[data-txt]').forEach(el => { const k = el.dataset.txt; if (TEXTS[k] != null) el.textContent = TEXTS[k]; }); }
function setEditable(onn) { document.querySelectorAll('[data-txt]').forEach(el => { if (el.closest('.nav-links') || el.closest('.btn-primary')) return; onn ? el.setAttribute('contenteditable', 'true') : el.removeAttribute('contenteditable'); }); }
applyTexts();
// ── Redes sociales ──────────────────────────────────────────────────────────
function applySocialLinks() { document.querySelectorAll('[data-social]').forEach(a => { const v = SOCIAL[a.dataset.social]; if (v) { a.href = v.trim().toLowerCase().startsWith('javascript:') ? '#' : v; } }); }
applySocialLinks();
document.querySelectorAll('.social-dock a[data-social]').forEach(a => a.addEventListener('click', e => {
    if (document.body.classList.contains('edit-mode')) { e.preventDefault(); const k = a.dataset.social; const u = prompt('✏️ Editar enlace ' + a.dataset.label + ':', SOCIAL[k] || ''); if (u !== null) { const cleanUrl = u.trim().toLowerCase().startsWith('javascript:') ? '#' : u; SOCIAL[k] = cleanUrl; a.href = cleanUrl; saveSocial(); } }
}));
// ── Video (solo URL) ────────────────────────────────────────────────────────
// ── Video (solo URL) ────────────────────────────────────────────────────────
function parseVideoUrl(url) {
    if (!url) return null;
    let m = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]+)/);
    if (m) return { type: 'iframe', embed: 'https://www.youtube.com/embed/' + m[1] + '?rel=0' };
    m = url.match(/vimeo\.com\/(\d+)/); if (m) return { type: 'iframe', embed: 'https://player.vimeo.com/video/' + m[1] };
    m = url.match(/instagram\.com\/(?:p|reel|tv)\/([\w-]+)/); if (m) return { type: 'iframe', embed: 'https://www.instagram.com/p/' + m[1] + '/embed' };
    if (/\.(mp4|webm|ogg)($|\?)/i.test(url)) return { type: 'direct', url: url };
    return { type: 'link', url: url };
}
// ── Dots para scrollers (slides) ────────────────────────────────────────────
function buildDots(container, count) { if (!container) return; container.innerHTML = Array.from({ length: count }, (_, i) => '<i class="' + (i === 0 ? 'on' : '') + '"></i>').join(''); }
function bindScrollerDots(scroller, dotsEl, cardSel) {
    if (!scroller || !dotsEl) return;
    const upd = () => {
        const cards = scroller.querySelectorAll(cardSel); if (!cards.length) return;
        const sl = scroller.scrollLeft; let best = 0, bd = 1e9;
        cards.forEach((c, i) => { const d = Math.abs(c.offsetLeft - sl); if (d < bd) { bd = d; best = i; } });
        dotsEl.querySelectorAll('i').forEach((d, i) => d.classList.toggle('on', i === best));
    };
    scroller.addEventListener('scroll', () => requestAnimationFrame(upd), { passive: true });
    upd();
}
// ── Render: bloques zig-zag ─────────────────────────────────────────────────
function renderServices() {
    const w = $('services-content'); if (!w) return;
    if (!SERVICES.length) { w.innerHTML = ''; return; }
    w.innerHTML = SERVICES.map((s, i) =>
        '<div class="transfer-block ' + (i % 2 !== 0 ? 'reverse' : '') + ' reveal active">' +
        '<div class="transfer-img-wrap"><button class="btn-delete-tour" data-del-service="' + i + '" style="z-index:20;position:absolute;top:10px;right:10px;">🗑️</button>' +
        '<img src="' + esc(s.img) + '" class="transfer-img" data-service-img="' + i + '" style="object-position:' + esc(s.imgPosition || 'center') + ';object-fit:' + esc(s.imgFit || 'cover') + ';" onerror="this.style.display=\'none\'"><div class="transfer-img-fallback">🚐</div></div>' +
        '<div class="transfer-text glass-panel"><h3 style="color:' + (i % 2 !== 0 ? 'var(--primary-dark)' : 'var(--teal)') + ';margin-bottom:8px;">' + esc(s.title) + '</h3>' +
        (s.subtitle ? '<h4 style="color:var(--teal);margin-bottom:5px;">' + esc(s.subtitle) + '</h4>' : '') + '<p>' + esc(s.desc) + '</p></div></div>').join('');
}
function renderAbout() {
    const w = $('about-blocks-container'); if (!w) return;
    if (!ABOUT_BLOCKS.length) { w.innerHTML = '<div class="empty-note">Aún no has añadido bloques. Usa ➕ Añadir Nuevo Contenido.</div>'; return; }
    w.innerHTML = ABOUT_BLOCKS.map((s, i) =>
        '<div class="transfer-block ' + (i % 2 !== 0 ? 'reverse' : '') + ' reveal active">' +
        '<div class="transfer-img-wrap"><button class="btn-delete-tour" data-del-about="' + i + '" style="z-index:20;position:absolute;top:10px;right:10px;">🗑️</button>' +
        '<img src="' + esc(s.img) + '" class="transfer-img" data-about-img="' + i + '" style="object-position:' + esc(s.imgPosition || 'center') + ';object-fit:' + esc(s.imgFit || 'cover') + ';" onerror="this.style.display=\'none\'"><div class="transfer-img-fallback">📸</div></div>' +
        '<div class="transfer-text glass-panel"><h3 style="color:' + (i % 2 !== 0 ? 'var(--primary-dark)' : 'var(--teal)') + ';margin-bottom:8px;">' + esc(s.title) + '</h3>' +
        (s.subtitle ? '<h4 style="color:var(--teal);margin-bottom:5px;">' + esc(s.subtitle) + '</h4>' : '') + '<p>' + esc(s.desc) + '</p></div></div>').join('');
}
// ── 🏖️ Render: catálogo de playas (scroll + dots + reserva/cotización) ──────
function renderBeaches() {
    const w = $('beaches-scroller'); if (!w) return;
    const isEdit = document.body.classList.contains('edit-mode');
    let html = BEACHES.map((b, i) =>
        '<div class="beach-card reveal active" data-beach-id="' + b.id + '" style="cursor:pointer;">' +
        (isEdit ? '<button class="btn-delete-tour" data-del-beach="' + i + '">🗑️</button><button class="btn-edit-tour" data-edit-beach="' + i + '">✏️</button>' : '') +
        '<div class="beach-img"><div class="beach-fallback">' + (b.emoji || '🏖️') + '</div><img src="' + esc(b.img) + '" alt="' + esc(b.name) + '" onerror="this.style.display=\'none\'"></div>' +
        '<div class="beach-body"><h3>' + esc(b.name) + '</h3><div class="beach-zone">📍 ' + esc(b.zone) + (b.duration ? ' · ' + esc(b.duration) : '') + '</div><p>' + esc(b.desc) + '</p></div>' +
        '<div class="beach-foot"><div class="beach-price">Reserva<small>por WhatsApp</small></div>' +
        '<button class="beach-book" data-beach-book="' + b.id + '">Reservar →</button></div></div>').join('');
    html += '<div class="beach-card beach-custom" style="cursor:pointer;"><span class="beach-custom-emoji">🗺️</span><h3>¿No ves tu playa?</h3><p>Te llevamos a cualquier playa del país. Escríbenos cuál y la reservamos para ti.</p><button class="beach-book pulse" id="beach-custom-btn">Reservar mi playa →</button></div>';
    w.innerHTML = html;
    w.querySelectorAll('[data-beach-book]').forEach(btn => btn.addEventListener('click', e => { e.stopPropagation(); openBooking(byBeachId(btn.dataset.beachBook)); }));
    const cb = $('beach-custom-btn');
    const customCard = w.querySelector('.beach-custom');
    const openCustom = () => openBooking({ id: 'playa-custom', name: 'Otra playa del país (a reservar)', sub: 'Traslado/tour personalizado · tarifa se confirma por WhatsApp', price: 0, emoji: '🗺️', imgs: [], duration: '🕒 A coordinar' });
    if (cb) cb.addEventListener('click', (e) => { e.stopPropagation(); openCustom(); });
    if (customCard) customCard.addEventListener('click', openCustom);
    w.querySelectorAll('.beach-card:not(.beach-custom)').forEach(card => card.addEventListener('click', e => { 
        if (e.target.closest('.btn-delete-tour,.btn-edit-tour,.beach-book')) return; 
        openMedia(card.dataset.beachId); 
    }));
    buildDots($('beach-dots'), BEACHES.length + 1);
    bindScrollerDots(w, $('beach-dots'), '.beach-card');
    observeCards();
}
function initBeachScroller() {
    const s = $('beaches-scroller'), l = $('beach-scroll-left'), r = $('beach-scroll-right');
    if (!s || !l || !r) return;
    on(l, 'click', () => s.scrollBy({ left: -320, behavior: 'smooth' }));
    on(r, 'click', () => s.scrollBy({ left: 320, behavior: 'smooth' }));
}
on($('jump-beaches'), 'click', () => { const s = $('beach-section'); if (s) s.scrollIntoView({ behavior: 'smooth', block: 'start' }); });
// ── 🚐 Render: carrusel de traslados (slides + dots + banner anclado) ───────
function renderTransferDestinations() {
    const w = $('transfer-destinations-grid'); if (!w) return;
    if (!TRANSFERS.length) { w.innerHTML = '<div class="empty-note">Aún no hay traslados configurados. Usa el CMS ➕</div>'; return; }
    const isEdit = document.body.classList.contains('edit-mode');
    w.innerHTML = TRANSFERS.map((tf, i) =>
        '<div class="tf-slide reveal active" data-transfer-id="' + tf.id + '">' +
        (isEdit ? '<button class="btn-delete-tour" data-del-transfer="' + i + '">🗑️</button><button class="btn-edit-tour" data-edit-transfer="' + i + '">✏️</button>' : '') +
        '<div class="tf-slide-visual"><div class="tf-emoji-bg">' + (tf.emoji || '🚐') + '</div></div>' +
        '<div class="tf-slide-content"><h3>' + esc(tf.name) + '</h3><div class="tf-dest-route">' + esc(tf.origin) + ' <span class="tf-arrow">→</span> ' + esc(tf.destination) + '</div><p>' + esc(tf.desc) + '</p>' +
        '<ul class="tf-trust-list"><li>✅ Vehículo Privado</li><li>✅ Aire Acondicionado</li><li>✅ Recogida puntual en tu puerta</li><li>✅ Conductor profesional</li></ul>' +
        '<div class="tf-slide-foot"><span class="tf-quote-mini">Tarifa a confirmar<br>al reservar 💬</span><button class="tf-book-mini btn-primary pulse" data-tf-id="' + tf.id + '">Reservar →</button></div></div></div>').join('');
    w.querySelectorAll('.tf-book-mini').forEach(btn => btn.addEventListener('click', e => { e.stopPropagation(); openTransferModal(btn.dataset.tfId); }));
    w.querySelectorAll('.tf-slide').forEach(card => card.addEventListener('click', e => { if (e.target.closest('.btn-delete-tour,.btn-edit-tour,.tf-book-mini')) return; openTransferModal(card.dataset.transferId); }));
    buildDots($('tf-dots'), TRANSFERS.length);
    bindScrollerDots(w, $('tf-dots'), '.tf-slide');
    observeCards();
}
function initTransferScroller() {
    const s = $('transfer-destinations-grid'), l = $('tf-scroll-left'), r = $('tf-scroll-right');
    if (!s || !l || !r) return;
    on(l, 'click', () => s.scrollBy({ left: -320, behavior: 'smooth' }));
    on(r, 'click', () => s.scrollBy({ left: 320, behavior: 'smooth' }));
}
// ── Tarjetas y grids ────────────────────────────────────────────────────────
function generateTags(t, max, withDur) { max = max || 3; withDur = withDur !== false; const c = []; c.push('<span class="chip chip-cat ' + (t.type === 'package' ? 'tours' : 'destinations') + '">' + (t.type === 'package' ? '📦 Paquete' : '📍 Destino') + '</span>'); if (t.rating >= 4.8) c.push('<span class="chip chip-badge">⭐ Top</span>'); if (withDur && t.duration) c.push('<span class="chip chip-dur">' + esc(t.duration) + '</span>'); return c.slice(0, max).join(''); }
function renderFeatured() {
    const f = $('featured-list'); if (!f) return; f.innerHTML = '';
    TOURS.filter(t => t.featured).forEach(t => {
        const el = document.createElement('div'); el.className = 'destination-card glass-panel glow reveal active';
        const mi = (t.imgs && t.imgs.length) ? t.imgs[0] : t.img;
        el.innerHTML = '<button class="btn-move-left" data-move-tour="' + esc(t.id) + '" data-dir="-1">◀</button><button class="btn-move-right" data-move-tour="' + esc(t.id) + '" data-dir="1">▶</button><button class="btn-delete-tour" data-delete-id="' + esc(t.id) + '">🗑️</button><button class="btn-edit-tour" data-edit-id="' + esc(t.id) + '">✏️</button><div class="dc-top"><div class="card-media"><div class="card-fallback cf-' + esc(t.id.indexOf('custom') !== -1 ? 'custom' : t.id) + '">' + esc(t.emoji) + '</div><img src="' + esc(mi) + '" alt="' + esc(t.name) + '" onerror="this.classList.add(\'missing\')"><button class="card-play">▶</button><span class="card-badge">' + (t.type === 'package' ? '📦 PKG' : '🔥 TOP') + '</span></div><div class="dc-head"><h3>' + esc(t.name) + '<small>' + esc(t.sub) + '</small></h3><div class="chips-row">' + generateTags(t, 2, false) + '</div><div class="card-meta"><span data-rate="' + esc(t.id) + '">⭐ ' + t.rating.toFixed(1) + '</span><span>' + esc(t.duration) + '</span><span>📍 Panamá</span></div></div></div><div class="card-short-desc"><p>' + esc(t.desc) + '</p></div><div class="dc-foot"><span class="price">$' + t.price.toLocaleString() + '<small>/pers</small></span><div><button class="btn-mini info">＋ Info</button><button class="btn-mini book">Reservar</button></div></div>';
        el.addEventListener('click', e => { if (e.target.closest('.btn-delete-tour,.btn-edit-tour,.btn-move-left,.btn-move-right,.btn-mini.book')) return; t.type !== 'package' ? travelTo(t.id) : openMedia(t.id); });
        el.querySelector('.book').addEventListener('click', e => { e.stopPropagation(); openBooking(t.id); });
        f.appendChild(el);
    });
}
function openAdminEmpty() {
    $('add-id').value = '';
    ['add-name', 'add-sub', 'add-oldprice', 'add-duration', 'add-emoji', 'add-img-1', 'add-img-2', 'add-img-3', 'add-img-4', 'add-video', 'add-desc', 'add-short-desc', 'add-includes', 'add-hist'].forEach(id => { const e = $(id); if (e) e.value = ''; });
    if ($('add-price')) $('add-price').value = '100'; if ($('add-price-adult')) $('add-price-adult').value = ''; if ($('add-price-child')) $('add-price-child').value = ''; if ($('add-price-senior')) $('add-price-senior').value = '';
    $('add-pin-size').value = '48'; $('add-featured').checked = false; $('add-type').value = 'lugar';
    const hb = $('add-places-builder'); if (hb) hb.innerHTML = '';
    refreshAdminSelects(); populatePlacesSelector([]); togglePkgRows(); $('admin-modal').classList.add('active');
    if (typeof cmsSelector !== "undefined" && cmsSelector) { cmsSelector.value = 'tours'; cmsSelector.dispatchEvent(new Event('change')); }
}
if ($('btn-global-add')) $('btn-global-add').addEventListener('click', openAdminEmpty);
function gridCard(t) { const mi = (t.imgs && t.imgs.length) ? t.imgs[0] : t.img; return '<div class="grid-card" data-id="' + esc(t.id) + '"><button class="btn-move-left" data-move-tour="' + esc(t.id) + '" data-dir="-1">◀</button><button class="btn-move-right" data-move-tour="' + esc(t.id) + '" data-dir="1">▶</button><button class="btn-delete-tour" data-delete-id="' + esc(t.id) + '">🗑️</button><button class="btn-edit-tour" data-edit-id="' + esc(t.id) + '">✏️</button><div class="grid-card-img cf-' + esc(t.id.indexOf('custom') !== -1 ? 'custom' : t.id) + '">' + esc(t.emoji) + '<img src="' + esc(mi) + '" alt="" onerror="this.classList.add(\'missing\')"></div><div class="grid-card-body"><h3>' + esc(t.name) + '</h3><div class="subtitle">' + esc(t.sub) + '</div><div class="chips-row">' + generateTags(t, 3, true) + '</div><p>' + esc(t.desc) + '</p><div class="grid-card-footer"><span class="price">$' + t.price.toLocaleString() + '<small>/pers</small></span><span class="rate" data-rate="' + esc(t.id) + '">⭐ ' + t.rating.toFixed(1) + '</span></div></div></div>'; }
function packageCard(t) { const pl = (t.places || []).map(byId).filter(Boolean); const sv = t.oldPrice ? Math.round((1 - t.price / t.oldPrice) * 100) : 0; const mi = (t.imgs && t.imgs.length) ? t.imgs[0] : t.img; return '<div class="grid-card pkg-card" data-id="' + esc(t.id) + '"><button class="btn-move-left" data-move-tour="' + esc(t.id) + '" data-dir="-1">◀</button><button class="btn-move-right" data-move-tour="' + esc(t.id) + '" data-dir="1">▶</button><button class="btn-delete-tour" data-delete-id="' + esc(t.id) + '">🗑️</button><button class="btn-edit-tour" data-edit-id="' + esc(t.id) + '">✏️</button><div class="grid-card-img cf-custom">' + esc(t.emoji) + '<img src="' + esc(mi) + '" alt="" onerror="this.classList.add(\'missing\')"><span class="pkg-ribbon">📦 PAQUETE' + (sv ? ' · -' + sv + '%' : '') + '</span></div><div class="grid-card-body"><h3>' + esc(t.name) + '</h3><div class="subtitle">' + esc(t.sub) + '</div><div class="chips-row">' + generateTags(t, 3, true) + '</div><div class="pkg-places">' + pl.map(p => '<span class="pkg-place">' + esc(p.emoji) + ' ' + esc(p.name) + '</span>').join('<i>·</i>') + '</div><p>' + esc(t.desc) + '</p><div class="grid-card-footer"><span class="price">$' + t.price.toLocaleString() + '<small>/pers</small></span><span class="rate">⭐ ' + t.rating.toFixed(1) + '</span></div>' + (t.oldPrice ? '<div class="pkg-old">Antes <s>$' + t.oldPrice.toLocaleString() + '</s> · Ahorras $' + (t.oldPrice - t.price).toLocaleString() + '</div>' : '') + '</div></div>'; }
function bindGridCards(r) { r.querySelectorAll('.grid-card').forEach(c => c.addEventListener('click', e => { if (!e.target.closest('.btn-delete-tour,.btn-edit-tour,.btn-move-left,.btn-move-right')) openMedia(c.dataset.id); })); }
let globalSearchQuery = '';
document.querySelectorAll('.tour-search-input').forEach(i => i.addEventListener('input', e => { globalSearchQuery = e.target.value.toLowerCase(); document.querySelectorAll('.tour-search-input').forEach(x => { if (x !== e.target) x.value = e.target.value; }); renderToursPage(); }));
function renderToursPage() { const w = $('tours-content'); if (!w) return; const p = TOURS.filter(t => t.type === 'package' && t.name.toLowerCase().indexOf(globalSearchQuery) !== -1); w.innerHTML = '<div class="card-grid">' + (p.map(packageCard).join('') || '<div class="empty-note">Aún no hay paquetes disponibles.</div>') + '</div>'; bindGridCards(w); const sc = w.querySelector('.card-grid'); buildDots($('tours-dots'), sc ? sc.querySelectorAll('.grid-card').length : 0); bindScrollerDots(sc, $('tours-dots'), '.grid-card'); }
function renderGrids() { renderToursPage(); applyTexts(); }
const observer = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) e.target.classList.add('active'); }), { threshold: .1 });
function observeCards() { document.querySelectorAll('.grid-card,.destination-card,.review-card,.contact-card,.transfer-block,.tf-dest-card,.beach-card').forEach(el => { if (!el.classList.contains('active')) { el.classList.add('reveal'); observer.observe(el); } }); }
function refreshAll() { renderFeatured(); renderGrids(); renderMapMarkers(); if (typeof refreshSelects !== 'undefined') refreshSelects(); refreshRatings(); renderServices(); renderAbout(); renderTransferDestinations(); renderBeaches(); if (typeof refreshTransferSelects !== 'undefined') refreshTransferSelects(); if (typeof refreshBeachSelects !== 'undefined') refreshBeachSelects(); applyTexts(); observeCards(); }
function updateNav(a) { document.querySelectorAll('.nav-links a[data-page]').forEach(x => x.classList.toggle('active', x.dataset.page === a)); }
function openPage(n) { closeAllPages(); if (n === 'map') { updateNav('map'); setTimeout(() => map.invalidateSize(), 300); return; } hidePlacePins(); const p = $('page-' + n); if (p) p.classList.add('active'); updateNav(n); if (n === 'reviews') renderReviews(); if (n === 'services') { renderServices(); renderTransferDestinations(); } if (n === 'about') renderAbout(); if (n === 'beaches') renderBeaches(); applyTexts(); observeCards(); if (mobileBtn && mobileBtn.classList.contains('active')) { mobileBtn.classList.remove('active'); navLinksObj.classList.remove('active'); } }
function closeAllPages() { document.querySelectorAll('.page-view').forEach(p => p.classList.remove('active')); }
document.querySelectorAll('.nav-links a[data-page]').forEach(a => a.addEventListener('click', () => openPage(a.dataset.page)));
on($('contact-wa'), 'click', () => window.open('https://wa.me/' + COMPANY_WA + '?text=' + encodeURIComponent('CONSULTA FILITOUR\n👤 ' + ($('contact-name').value || '—') + '\n' + ($('contact-msg').value || '—')), '_blank'));
on($('contact-mail'), 'click', () => { const a = document.createElement('a'); a.href = 'mailto:' + COMPANY_MAIL + '?subject=' + encodeURIComponent('Consulta: ' + ($('contact-name').value || '')) + '&body=' + encodeURIComponent($('contact-msg').value || ''); a.click(); });
on($('contact-book'), 'click', () => { closeAllPages(); updateNav('map'); openBooking(null); });
const bookTfBtn = $('book-transfer-btn'); if (bookTfBtn) on(bookTfBtn, 'click', () => openTransferModal(null));
on($('explore-toggle'), 'click', () => { const o = document.body.classList.toggle('no-tops'); $('explore-toggle').textContent = o ? '👀 Ver TOPS' : '🧭 Explorar sin TOPS'; setTimeout(() => map.invalidateSize(), 80); setTimeout(() => map.invalidateSize(), 400); });
on($('btn-map-transfer'), 'click', () => openPage('services'));
// ── Modal media (detalle) ───────────────────────────────────────────────────
let currentTour = null, galIdx = 0, galCount = 1, currentGallery = [];
const mTrack = $('media-track'), mDots = $('media-dots'), mCounter = $('media-counter'), mCarousel = $('media-carousel');
function goSlide(i) { galIdx = (i + galCount) % galCount; mTrack.style.transform = 'translateX(-' + (galIdx * 100) + '%)'; mDots.querySelectorAll('i').forEach((d, j) => d.classList.toggle('on', j === galIdx)); mCounter.textContent = (galIdx + 1) + '/' + galCount; }
function getGallery(t) { let g = [], c = []; if (t.type === 'package' && t.places) { if (t.imgs) t.imgs.forEach((im, i) => { if (im) { g.push(im); c.push('📷 ' + t.name + ' · Foto ' + (i + 1)); } }); t.places.forEach(pid => { const p = byId(pid); if (!p) return; const im = (p.imgs && p.imgs[0]) ? p.imgs[0] : p.img; if (im && g.indexOf(im) === -1) { g.push(im); c.push('📷 ' + p.emoji + ' ' + p.name); } }); } else { if (t.imgs && t.imgs.length) t.imgs.forEach((im, i) => { if (im) { g.push(im); c.push('📷 ' + t.name + ' · Foto ' + (i + 1)); } }); else if (t.img) { g.push(t.img); c.push('📷 ' + t.name); } } if (!g.length) { g.push('assets/img/' + t.id + '-1.jpg'); c.push('📷 ' + t.name); } return { g, c }; }
const lightbox = $('lightbox'), lightboxImg = $('lightbox-img');
if (lightbox && lightboxImg) lightbox.addEventListener('click', () => { lightbox.classList.remove('active'); lightboxImg.src = ''; });
on($('zoom-hint'), 'click', () => { if (currentGallery[galIdx]) openLightbox(currentGallery[galIdx]); });
function openLightbox(s) { if (!lightbox || !lightboxImg) return; lightboxImg.src = s; lightbox.classList.add('active'); }
function openMedia(id, parentPkgId) {
    let t = byId(id);
    if (!t) t = typeof byBeachId === 'function' ? byBeachId(id) : null;
    if (!t) return;
    currentTour = t;
    
    // Asignar tipo 'beach' si no tiene para poder mostrar botón de reservar
    if (!t.type && t.id.startsWith('playa-')) t.type = 'beach';
    
    const gg = getGallery(t); galCount = gg.g.length; currentGallery = gg.g;
    mTrack.innerHTML = gg.g.map((s, i) => '<div class="media-slide cf-' + (t.id.indexOf('custom') !== -1 ? 'custom' : t.id) + '"><div class="card-fallback" style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;z-index:0;">' + (t.emoji || '🏖️') + '</div><img src="' + s + '" alt="' + esc(gg.c[i]) + '" style="position:relative;z-index:1;" onload="this.previousElementSibling.style.display=\'none\'" onerror="this.classList.add(\'missing\');this.previousElementSibling.style.display=\'flex\'"><div class="ph-cap" style="z-index:2;">' + esc(gg.c[i]) + '</div></div>').join('');
    mDots.innerHTML = gg.g.map((_, i) => '<i class="' + (i === 0 ? 'on' : '') + '"></i>').join(''); goSlide(0);
    const pb = $('media-pkg'); if (pb) { if (t.type === 'package' && t.places) { pb.style.display = 'flex'; pb.innerHTML = '<span class="rel-label">LUGARES INCLUIDOS:</span>' + t.places.map(pid => { const p = byId(pid); return p ? '<button class="pkg-place big" data-openplace="' + pid + '" data-parent="' + t.id + '">' + p.emoji + ' ' + esc(p.name) + '</button>' : ''; }).join(''); } else pb.style.display = 'none'; }
    const rb = $('media-rel'); if (rb) { if (t.type !== 'package' && t.type !== 'beach') { const rp = TOURS.filter(x => x.type === 'package' && (x.places || []).indexOf(t.id) !== -1); if (rp.length) { rb.style.display = 'flex'; rb.innerHTML = '<span class="rel-label">📦 EN ESTOS PAQUETES:</span>' + rp.map(r => '<button class="pkg-place big" data-openplace="' + r.id + '" data-parent="' + t.id + '">' + r.emoji + ' ' + esc(r.name) + '</button>').join(''); } else rb.style.display = 'none'; } else rb.style.display = 'none'; }
    $('media-title').textContent = t.name; $('media-sub').textContent = t.sub || ''; $('media-desc').textContent = t.long || t.desc || '';
    const ib = $('media-includes'); if (ib) { if (t.includes && t.includes.length && t.includes[0] !== '') { ib.style.display = 'block'; ib.innerHTML = '<b>✨ Qué incluye</b>' + t.includes.map(i => '<span>' + esc(i) + '</span>').join(''); } else ib.style.display = 'none'; }
    const hb = $('media-hist'); if (hb) { if (t.hist) { hb.style.display = 'block'; hb.innerHTML = '<b>📜 Un poco de historia:</b> ' + esc(t.hist); } else hb.style.display = 'none'; }
    const pe = $('media-price'), bb = $('media-book'), vb = $('media-video-btn'), mb = $('media-map');
    if (vb) vb.style.display = t.video ? 'inline-block' : 'none';
    if (t.type === 'package' || t.type === 'beach') { 
        if (pe) { 
            if (t.price) { pe.textContent = '$' + t.price.toLocaleString(); pe.style.display = 'inline-block'; }
            else { pe.style.display = 'none'; }
        } 
        const mr = $('media-rating'); if (mr) { if (t.rating) { mr.textContent = '⭐ ' + t.rating.toFixed(1); mr.style.display = 'inline-block'; } else mr.style.display = 'none'; } 
        const md = $('media-duration'); if (md) { md.textContent = t.duration; md.style.display = 'inline-block'; } 
        if (bb) { bb.style.display = 'inline-block'; bb.textContent = 'RESERVAR →'; bb.onclick = () => { closeModal('media-modal'); openBooking(currentTour.id); }; } 
    }
    else { if (pe) pe.style.display = 'none'; const mr = $('media-rating'); if (mr) mr.style.display = 'none'; const md = $('media-duration'); if (md) md.style.display = 'none'; if (bb) bb.style.display = 'none'; }
    if (mb) { if (parentPkgId) { mb.textContent = '← VOLVER AL PAQUETE'; mb.onclick = () => { openMedia(parentPkgId); showPlacePins(parentPkgId); }; } else { mb.textContent = '🗺️ Ver en Mapa'; mb.onclick = () => { closeModal('media-modal'); if (t.type === 'package') showPlacePins(t.id); travelTo(currentTour.id); }; } }
    $('media-modal').classList.add('active');
    const sc = document.querySelector('.media-info'); if (sc) sc.scrollTop = 0;
}
if (mCarousel) mCarousel.addEventListener('click', e => { const im = e.target.closest('.media-slide img'); if (im && !im.classList.contains('missing')) openLightbox(im.src); });
function openVideoModal() { const t = currentTour; if (!t || !t.video) { alert('Este tour aún no tiene video.'); return; } const p = parseVideoUrl(t.video); const vc = $('video-modal-container'); const safeVideoUrl = t.video.trim().toLowerCase().startsWith('javascript:') ? '#' : esc(t.video); if (p && p.type === 'iframe') vc.innerHTML = '<iframe src="' + p.embed + '" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen></iframe>'; else if (p && p.type === 'direct') vc.innerHTML = '<video src="' + p.url + '" controls autoplay></video>'; else vc.innerHTML = '<div class="video-fallback"><div style="font-size:3rem">🎥</div><p>No se puede incrustar este video.</p><a class="btn-primary" target="_blank" href="' + safeVideoUrl + '">Ver en la red social ↗</a></div>'; $('video-modal').classList.add('active'); }
function stopVideoModal() { const vc = $('video-modal-container'); if (vc) vc.innerHTML = ''; }
on($('media-video-btn'), 'click', openVideoModal);
const galNext = mCarousel ? mCarousel.querySelector('.gal-next') : null, galPrev = mCarousel ? mCarousel.querySelector('.gal-prev') : null;
on(galNext, 'click', () => goSlide(galIdx + 1)); on(galPrev, 'click', () => goSlide(galIdx - 1));
let tx0 = null;
if (mCarousel) { mCarousel.addEventListener('touchstart', e => { tx0 = e.touches[0].clientX; }, { passive: true }); mCarousel.addEventListener('touchend', e => { if (tx0 === null) return; const d = e.changedTouches[0].clientX - tx0; if (d < -40) goSlide(galIdx + 1); else if (d > 40) goSlide(galIdx - 1); tx0 = null; }, { passive: true }); }
// ── Resize ──────────────────────────────────────────────────────────────────
window.addEventListener('resize', () => { if (wc) { wc.width = innerWidth; wc.height = innerHeight; } initIntro(); lockZoom(); map.invalidateSize(); });
// ── Inicialización ──────────────────────────────────────────────────────────
async function initAppFromServer() {
    try {
        const r = await fetch('api.php?t=' + Date.now());
        if (r.ok) { const d = await r.json(); if (d.status === 'success') { if (d.zones && d.zones.length) ZONES = d.zones; if (d.styles && d.styles.length) STYLES = d.styles; if (d.tours && d.tours.length) TOURS = d.tours; if (d.services && d.services.length) SERVICES = d.services; if (d.about_blocks && d.about_blocks.length) ABOUT_BLOCKS = d.about_blocks; if (d.transfers && d.transfers.length) TRANSFERS = d.transfers; if (d.beaches && d.beaches.length) BEACHES = d.beaches; } }
    } catch (e) { console.warn('Modo local (sin BD). Cargando data.js.'); }
    finally { refreshAll(); initTransferScroller(); initBeachScroller(); }
}
window.addEventListener('load', () => {
    updateNav('map');
    if (BACKEND_ENABLED) initAppFromServer(); else { refreshAll(); initTransferScroller(); initBeachScroller(); }
});
// ── 🔍 Búsqueda global (lupita del nav) — ✅ CORREGIDO con clase search-open ──
(function () {
    const btn = $('nav-search-btn'), bar = $('global-search-bar'), inp = $('global-search-input'), closeBtn = $('gsb-close');
    if (!btn || !bar) return;
    const setOpen = (open) => {
        bar.classList.toggle('open', open);
        document.body.classList.toggle('search-open', open);
        if (open && inp) setTimeout(() => inp.focus(), 180);
    };
    btn.addEventListener('click', (e) => { e.stopPropagation(); setOpen(!bar.classList.contains('open')); });
    if (closeBtn) closeBtn.addEventListener('click', () => { setOpen(false); if (inp) { inp.value = ''; inp.dispatchEvent(new Event('input')); } });
    document.addEventListener('click', (e) => { if (bar.classList.contains('open') && !bar.contains(e.target) && e.target !== btn) setOpen(false); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setOpen(false); });
})();
// ── 📱 PASO 4: flechas del carrusel de paquetes (móvil) ─────────────────────
on($('tours-scroll-left'), 'click', () => { const s = document.querySelector('#tours-content .card-grid'); if (s) s.scrollBy({ left: -s.offsetWidth * 0.8, behavior: 'smooth' }); });
on($('tours-scroll-right'), 'click', () => { const s = document.querySelector('#tours-content .card-grid'); if (s) s.scrollBy({ left: s.offsetWidth * 0.8, behavior: 'smooth' }); });
if (document.body.classList.contains('edit-mode')) { setEditable(true); }
