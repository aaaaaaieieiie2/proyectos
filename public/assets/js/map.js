// ── Intro + viento (canvas) ─────────────────────────────────────────────────
const ic = $('intro-canvas'), ictx = ic ? ic.getContext('2d') : null;
let iparts = [], isparks = [];
function initIntro() {
    if (!ic || !ictx) return;
    ic.width = innerWidth; ic.height = innerHeight;
    const off = document.createElement('canvas'); const fs = Math.floor(Math.min(150, innerWidth / 5.2));
    off.width = innerWidth; off.height = fs * 2;
    const octx = off.getContext('2d');
    octx.font = '900 ' + fs + "px 'Segoe UI', sans-serif"; octx.textAlign = 'center'; octx.textBaseline = 'middle'; octx.fillStyle = '#fff';
    octx.fillText('FiliTour', off.width / 2, off.height / 2);
    if (off.width === 0 || off.height === 0) return;
  const gap = innerWidth < 700 ? 5 : (fs > 90 ? 4 : 3), data = octx.getImageData(0, 0, off.width, off.height).data;
    // ✅ CAMBIO: paleta NUEVA (atardecer + selva, CERO rosa)
    const pal = ['#f77f00', '#ffb703', '#ff8c42', '#0e9f6e', '#25c98a', '#ffffff']; iparts = [];
    for (let y = 0; y < off.height; y += gap) for (let x = 0; x < off.width; x += gap)
        if (data[(y * off.width + x) * 4 + 3] > 140) iparts.push({ tx: x - off.width / 2, ty: y - off.height / 2, x: Math.random() * ic.width, y: Math.random() * ic.height, c: pal[(Math.random() * pal.length) | 0], d: Math.random() * 600, tw: Math.random() * 6.28 });
    // ✅ CAMBIO: chispas ambientales en naranja/verde (antes rosadas)
       isparks = Array.from({ length: innerWidth < 700 ? 22 : 40 }, () => ({ x: Math.random() * ic.width, y: Math.random() * ic.height, r: Math.random() * 2 + .8, vx: (Math.random() - .5) * .3, vy: (Math.random() - .5) * .3, tw: Math.random() * 6.28, c: Math.random() > .5 ? '247,127,0' : '14,159,110' }));
}
initIntro();
const t0 = performance.now();
(function introFrame(t) {
    const el = $('intro-screen'); if (!el || el.classList.contains('done') || !ictx) return;
    ictx.clearRect(0, 0, ic.width, ic.height);
    isparks.forEach(s => { s.x += s.vx; s.y += s.vy; if (s.x < 0 || s.x > ic.width) s.vx *= -1; if (s.y < 0 || s.y > ic.height) s.vy *= -1; ictx.beginPath(); ictx.arc(s.x, s.y, s.r, 0, 7); ictx.fillStyle = 'rgba(' + s.c + ',' + (.2 + Math.abs(Math.sin(t * .002 + s.tw)) * .35) + ')'; ictx.fill(); });
    const cx = ic.width / 2, cy = ic.height / 2 + 10, size = ic.width > 700 ? 3 : 2;
    iparts.forEach(p => { const k = Math.min(1, Math.max(0, (t - t0 - p.d) / 1100)), e = 1 - Math.pow(1 - k, 3); ictx.globalAlpha = k >= 1 ? .8 + Math.sin(t * .004 + p.tw) * .2 : .9; ictx.fillStyle = p.c; ictx.fillRect(p.x + (cx + p.tx - p.x) * e, p.y + (cy + p.ty - p.y) * e, size, size); });
    ictx.globalAlpha = 1;
    const sk = (t - t0 - 1400) / 700;
    if (sk > 0 && sk < 1) { const bx = ic.width * (.15 + sk * .7); const g = ictx.createLinearGradient(bx - 90, 0, bx + 90, 0); g.addColorStop(0, 'rgba(255,255,255,0)'); g.addColorStop(.5, 'rgba(255,255,255,.85)'); g.addColorStop(1, 'rgba(255,255,255,0)'); ictx.save(); ictx.globalCompositeOperation = 'source-atop'; ictx.fillStyle = g; ictx.fillRect(bx - 90, 0, 180, ic.height); ictx.restore(); }
    requestAnimationFrame(introFrame);
})(t0);
const introEl = $('intro-screen');
if (introEl) introEl.addEventListener('click', () => { introEl.classList.add('done'); setTimeout(() => introEl.remove(), 300); });
setTimeout(() => { if (introEl) introEl.classList.add('clouds'); }, 2000);
setTimeout(() => { if (introEl) introEl.classList.add('clear'); }, 2500);
setTimeout(() => { if (introEl) { introEl.classList.add('done'); setTimeout(() => introEl.remove(), 700); } }, 3600);
setTimeout(() => { const r = $('intro-screen'); if (r) r.remove(); }, 5000);
const wc = $('wind-canvas'), wctx = wc ? wc.getContext('2d') : null;
if (wc) { wc.width = innerWidth; wc.height = innerHeight; }
// ✅ OPTIMIZACIÓN: menos partículas en móvil (ahorra CPU/memoria)
const winds = Array.from({ length: innerWidth < 700 ? 28 : 60 }, () => ({ x: Math.random() * innerWidth, y: Math.random() * innerHeight, s: Math.random() * 1.6 + .8, px: 0, py: 0, pink: Math.random() > .7 }));
winds.forEach(p => { p.px = p.x; p.py = p.y; });
function windLoop() {
    if (!wc || !wctx) return;
    requestAnimationFrame(windLoop);
    // ✅ OPTIMIZACIÓN: no dibuja si la pestaña está oculta o si hay página/modal encima
    if (document.hidden || document.body.classList.contains('wind-paused')) return;
    wctx.clearRect(0, 0, wc.width, wc.height);
    const t = performance.now();
    winds.forEach(p => { p.px = p.x; p.py = p.y; const a = Math.sin(p.y * .0016 + t * .00035) * .9 + Math.cos(p.x * .0012 - t * .00028) * .6; p.x += Math.cos(a) * p.s * 1.6; p.y += Math.sin(a) * p.s * 1.1; if (p.x > wc.width + 30 || p.x < -30 || p.y > wc.height + 30 || p.y < -30) { p.x = Math.random() * wc.width; p.y = Math.random() * wc.height; p.px = p.x; p.py = p.y; } wctx.beginPath(); wctx.moveTo(p.px, p.py); wctx.quadraticCurveTo(p.px + 6, p.py - 4, p.x, p.y); wctx.strokeStyle = p.pink ? 'rgba(37,197,154,0.35)' : 'rgba(255,255,255,0.4)'; wctx.lineWidth = 1.4; wctx.lineCap = 'round'; wctx.stroke(); });
}
if (wctx) requestAnimationFrame(windLoop);
// ✅ OPTIMIZACIÓN: pausa el viento cuando una página o modal tapa el mapa
const windGate = new MutationObserver(() => {
    const blocked = document.querySelector('.modal-overlay.active') || document.querySelector('.page-view.active');
    document.body.classList.toggle('wind-paused', !!blocked);
});
windGate.observe(document.body, { attributes: true, attributeFilter: ['class'], subtree: true });

// ── Mapa Leaflet ────────────────────────────────────────────────────────────
// ✅ PASO 1: límites SOLO Panamá (sin Colombia ni Costa Rica)
const MAX_BOUNDS = [[7.0, -83.5], [9.8, -77.0]];
const INITIAL_BOUNDS = [[7.2, -83.2], [9.6, -77.2]];
const map = L.map('map-container', { zoomControl: false, maxBounds: MAX_BOUNDS, maxBoundsViscosity: 1, zoomSnap: 0, minZoom: 7, maxZoom: 16 });
const grayBase = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}', { attribution: '© Esri', maxZoom: 16 });
const grayRef = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Reference/MapServer/tile/{z}/{y}/{x}', { maxZoom: 16 });
const sat = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', { attribution: '© Esri', maxZoom: 16 });
const osm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '© OSM', maxZoom: 16 });
map.fitBounds(INITIAL_BOUNDS, { animate: false });
grayBase.addTo(map); grayRef.addTo(map);
L.control.layers({ 'Pastel': grayBase, 'Satélite': sat, 'OSM': osm }, { 'Etiquetas': grayRef }, { position: 'topright' }).addTo(map);
map.on('drag', () => map.panInsideBounds(MAX_BOUNDS, { animate: false }));
function lockZoom() { const z = map.getBoundsZoom(INITIAL_BOUNDS, false); map.setMinZoom(z); if (map.getZoom() < z) map.setZoom(z); }
lockZoom();
let markers = {}, placeMarkers = {}, transferMarkers = {}, activePackageId = null;
function renderMapMarkers() {
    Object.values(markers).forEach(m => map.removeLayer(m)); markers = {};
    Object.values(placeMarkers).forEach(m => map.removeLayer(m)); placeMarkers = {};
    Object.values(transferMarkers).forEach(m => map.removeLayer(m)); transferMarkers = {};
    const isEdit = document.body.classList.contains('edit-mode');
    TOURS.filter(t => t.type === 'package').forEach(t => {
        const size = t.pinSize || 52, anchor = size / 2, fSize = Math.max(14, size * .38);
        const mainImg = (t.imgs && t.imgs.length) ? t.imgs[0] : t.img;
        const icon = L.divIcon({ className: 'custom-pin pkg-pin', iconSize: [size, size], iconAnchor: [anchor, anchor], html: '<div style="width:' + size + 'px;height:' + size + 'px;border-radius:50%;border:3px solid #fff;box-shadow:0 0 18px rgba(0,180,160,.6),0 4px 12px rgba(0,0,0,.35);overflow:hidden;background:linear-gradient(135deg,var(--teal),var(--primary-dark));display:flex;align-items:center;justify-content:center;font-size:' + fSize + 'px;cursor:pointer;transition:transform .3s" onmouseover="this.style.transform=\'scale(1.18)\'" onmouseout="this.style.transform=\'scale(1)\'">' + (mainImg ? '<img src="' + esc(mainImg) + '" onerror="this.style.display=\'none\'; this.nextSibling.style.display=\'block\'" style="width:100%;height:100%;object-fit:cover"><span style="display:none">' + esc(t.emoji) + '</span>' : esc(t.emoji)) + '</div>' });
        markers[t.id] = L.marker(t.coords, { icon, draggable: isEdit, zIndexOffset: isEdit ? 1000 : 500 }).addTo(map);
        if (isEdit) {
            markers[t.id].on('dragend', e => { const p = e.target.getLatLng(); t.coords = [+p.lat.toFixed(5), +p.lng.toFixed(5)]; saveTours(); });
            markers[t.id].on('dblclick', () => { const s = prompt('Tamaño del pin "' + t.name + '" (px):', t.pinSize || 52); if (s && !isNaN(s)) { t.pinSize = parseInt(s, 10); saveTours(); renderMapMarkers(); } });
        } else markers[t.id].on('click', () => { showPlacePins(t.id); travelTo(t.id); });
    });
    TRANSFERS.forEach(tf => {
        if (!tf.coords || tf.coords.length < 2) return;
        const icon = L.divIcon({ className: 'custom-pin tf-pin', iconSize: [44, 44], iconAnchor: [22, 22], html: '<div style="width:44px;height:44px;border-radius:50%;border:3px solid #fff;box-shadow:0 0 14px rgba(41,128,185,.6);background:linear-gradient(135deg,#2980b9,#1a5f7a);display:flex;align-items:center;justify-content:center;font-size:20px;cursor:pointer;">' + esc(tf.emoji || '🚐') + '</div>' });
        transferMarkers[tf.id] = L.marker(tf.coords, { icon, zIndexOffset: 300 }).addTo(map);
        transferMarkers[tf.id].on('click', () => openTransferModal(tf.id));
    });
}
function showPlacePins(pkgId) {
    hidePlacePins(); activePackageId = pkgId;
    const pkg = byId(pkgId); if (!pkg || !pkg.places) return;
    pkg.places.forEach(pid => {
        const p = byId(pid); if (!p || !p.coords) return;
        const mainImg = (p.imgs && p.imgs[0]) ? p.imgs[0] : p.img;
        const icon = L.divIcon({ className: 'custom-pin place-pin', iconSize: [34, 34], iconAnchor: [17, 17], html: '<div style="width:34px;height:34px;border-radius:50%;border:2px solid rgba(255,255,255,.9);box-shadow:0 0 10px rgba(255,160,80,.7);overflow:hidden;background:linear-gradient(135deg,#f4a261,#e76f51);display:flex;align-items:center;justify-content:center;font-size:14px;cursor:pointer;">' + (mainImg ? '<img src="' + esc(mainImg) + '" onerror="this.style.display=\'none\'; this.nextSibling.style.display=\'block\'" style="width:100%;height:100%;object-fit:cover"><span style="display:none">' + esc(p.emoji) + '</span>' : esc(p.emoji)) + '</div>' });
        placeMarkers[pid] = L.marker(p.coords, { icon, zIndexOffset: 200 }).addTo(map);
        placeMarkers[pid].on('click', () => openMedia(pid, pkgId));
    });
}
function hidePlacePins() { Object.values(placeMarkers).forEach(m => map.removeLayer(m)); placeMarkers = {}; activePackageId = null; }
const wpc = $('warp-canvas'), wptx = wpc ? wpc.getContext('2d') : null;
function warp(duration) {
    duration = duration || 2500; if (!wpc || !wptx) return;
    wpc.width = innerWidth; wpc.height = innerHeight;
    const cx = wpc.width / 2, cy = wpc.height / 2;
    const parts = Array.from({ length: 150 }, () => ({ x: (Math.random() - .5) * innerWidth * 2, y: (Math.random() - .5) * innerHeight * 2, z: Math.random() * 800 + 100, type: Math.random() > .8 ? 'debris' : 'wind' }));
    const s0 = performance.now(); document.body.classList.add('warping');
    (function frame(t) {
        const k = (t - s0) / duration;
        if (k >= 1) { document.body.classList.remove('warping'); wptx.clearRect(0, 0, wpc.width, wpc.height); return; }
        wptx.clearRect(0, 0, wpc.width, wpc.height); wptx.save(); wptx.translate(cx + (Math.random() - .5) * k * 20, cy + (Math.random() - .5) * k * 20);
        const sp = 15 + k * 60;
        parts.forEach(p => { p.z -= sp; if (p.z <= 1) { p.z = 800; p.x = (Math.random() - .5) * innerWidth * 2; p.y = (Math.random() - .5) * innerHeight * 2; } const sc = 500 / p.z, px = p.x * sc, py = p.y * sc, psc = 500 / (p.z + sp), ppx = p.x * psc, ppy = p.y * psc; if (p.type === 'wind') { wptx.beginPath(); wptx.moveTo(ppx, ppy); wptx.lineTo(px, py); wptx.strokeStyle = 'rgba(255,255,255,' + (1 - p.z / 800) + ')'; wptx.lineWidth = sc * 1.5; wptx.stroke(); } else { wptx.beginPath(); wptx.arc(px, py, sc * 3, 0, Math.PI * 2); wptx.fillStyle = 'rgba(180,180,180,' + (1 - p.z / 800) + ')'; wptx.fill(); } });
        wptx.restore(); requestAnimationFrame(frame);
    })(s0);
}
function travelTo(id) { closeAllPages(); updateNav('map'); const t = byId(id); if (!t) return; warp(2500); map.flyTo(t.coords, 14, { animate: true, duration: 2.5, paddingTopLeft: [0, 110] }); map.once('moveend', () => openMedia(id)); }
function exportCode() {
    return 'const INITIAL_TOURS=' + JSON.stringify(TOURS) + ';\nconst INITIAL_TRANSFERS=' + JSON.stringify(TRANSFERS) + ';\nconst INITIAL_BEACHES=' + JSON.stringify(BEACHES) + ';\nconst INITIAL_SITE_TEXTS=' + JSON.stringify(SITE_TEXTS) + ';\nconst INITIAL_ZONES=' + JSON.stringify(ZONES) + ';\nconst INITIAL_STYLES=' + JSON.stringify(STYLES) + ';\nconst INITIAL_SOCIAL=' + JSON.stringify(SOCIAL) + ';';
}
async function copyText(code, msg) { try { await navigator.clipboard.writeText(code); alert(msg); } catch (e) { prompt('Copia manualmente (Ctrl+C):', code); } }