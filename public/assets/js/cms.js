// ── Modo edición ────────────────────────────────────────────────────────────
function enterEdit(onn) {
    document.body.classList.toggle('edit-mode', onn);
    const emb = $('edit-mode-btn'); if (emb) emb.innerHTML = onn ? '✅ Terminar' : '✏️ Editar CMS';
    setEditable(onn); renderMapMarkers(); renderTransferDestinations(); renderBeaches();
    const eh = $('edit-help');
    if (eh) eh.innerHTML = onn ? '<b>✏️ MODO EDICIÓN</b> · Arrastra pines · Dblclic pin=tamaño · Clic imagen Zig-Zag=posición · ◀ ▶ ordenar <button id="edit-copy">📋 Copiar TODO</button> <button id="edit-download">⬇️ Descargar</button> <button id="edit-clear-cache" style="background:#888;color:#fff">🧹 Recargar</button> <button id="edit-done">✅ Listo</button>' : '';
    if (onn) bindEditHelp();
}
if ($('edit-mode-btn')) $('edit-mode-btn').addEventListener('click', () => enterEdit(!document.body.classList.contains('edit-mode')));
function bindEditHelp() {
    on($('edit-done'), 'click', () => enterEdit(false));
    on($('edit-clear-cache'), 'click', () => { if (confirm('¿Recargar página?')) location.href = location.href.split('?')[0] + '?v=' + Date.now(); });
    on($('edit-download'), 'click', async () => { const c = exportCode(); try { const h = await showSaveFilePicker({ types: [{ description: 'JS', accept: { 'text/javascript': ['.js'] } }] }); const w = await h.createWritable(); await w.write(c); await w.close(); alert('✅ Guardado.'); } catch (e) { const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([c], { type: 'text/javascript' })); a.download = 'datos.js'; a.click(); } });
    on($('edit-copy'), 'click', () => copyText(exportCode(), '✅ TODO copiado.'));
}
on($('btn-copy-section'), 'click', () => { const t = byId($('add-id').value); if (!t) { alert('⚠️ Pulsa GUARDAR primero.'); return; } copyText(JSON.stringify(t) + ',', '✅ Sección "' + t.name + '" copiada.'); });
on($('toggle-ui-btn'), 'click', () => { document.body.classList.toggle('hide-ui'); $('toggle-ui-btn').textContent = document.body.classList.contains('hide-ui') ? '🙈' : '👁️'; });
const editHelp = $('edit-help'); let isDrag = false, dx0 = 0, dy0 = 0, iL = 0, iT = 0;
const startD = e => { if (e.target.tagName === 'BUTTON' || e.target.tagName === 'B') return; isDrag = true; const c = e.type.includes('mouse') ? e : e.touches[0]; dx0 = c.clientX; dy0 = c.clientY; const r = editHelp.getBoundingClientRect(); iL = r.left; iT = r.top; editHelp.style.margin = '0'; editHelp.style.bottom = 'auto'; editHelp.style.left = iL + 'px'; editHelp.style.top = iT + 'px'; editHelp.style.transition = 'none'; };
const doD = e => { if (!isDrag) return; e.preventDefault(); const c = e.type.includes('mouse') ? e : e.touches[0]; editHelp.style.left = (iL + c.clientX - dx0) + 'px'; editHelp.style.top = (iT + c.clientY - dy0) + 'px'; };
const endD = () => { isDrag = false; };
if (editHelp) { editHelp.addEventListener('mousedown', startD); editHelp.addEventListener('touchstart', startD, { passive: false }); }
document.addEventListener('mousemove', doD); document.addEventListener('touchmove', doD, { passive: false });
document.addEventListener('mouseup', endD); document.addEventListener('touchend', endD);
document.addEventListener('input', e => { const k = e.target.dataset ? e.target.dataset.txt : null; if (k) { TEXTS[k] = e.target.textContent; saveTexts(); } });
document.addEventListener('click', e => { if (document.body.classList.contains('edit-mode') && e.target.closest('[data-txt]') && !e.target.closest('.nav-links') && !e.target.closest('.btn-primary')) { e.preventDefault(); e.stopPropagation(); } }, true);

// ── Borrado / edición en modo edición ───────────────────────────────────────
document.addEventListener('click', e => {
    if (!document.body.classList.contains('edit-mode')) return;
    if (e.target.dataset.delService != null) { e.stopPropagation(); e.preventDefault(); if (confirm('¿Borrar este bloque?')) { SERVICES.splice(+e.target.dataset.delService, 1); saveServices(); renderServices(); } }
    if (e.target.dataset.delAbout != null) { e.stopPropagation(); e.preventDefault(); if (confirm('¿Borrar este bloque?')) { ABOUT_BLOCKS.splice(+e.target.dataset.delAbout, 1); saveAboutBlocks(); renderAbout(); } }
    if (e.target.dataset.delTransfer != null) { e.stopPropagation(); e.preventDefault(); if (confirm('¿Borrar este traslado?')) { TRANSFERS.splice(+e.target.dataset.delTransfer, 1); saveTransfers(); renderTransferDestinations(); refreshTransferSelects(); } }
    if (e.target.dataset.editTransfer != null) { e.stopPropagation(); e.preventDefault(); const tf = TRANSFERS[+e.target.dataset.editTransfer]; if (!tf) return; const cs = $('cms-module-selector'); if (cs) { cs.value = 'transfers'; cs.dispatchEvent(new Event('change')); if ($('tf-edit-id')) $('tf-edit-id').value = tf.id; $('admin-modal').classList.add('active'); } }
    if (e.target.dataset.delBeach != null) { e.stopPropagation(); e.preventDefault(); if (confirm('¿Borrar esta playa?')) { BEACHES.splice(+e.target.dataset.delBeach, 1); saveBeaches(); renderBeaches(); refreshBeachSelects(); } }
    if (e.target.dataset.editBeach != null) { e.stopPropagation(); e.preventDefault(); const b = BEACHES[+e.target.dataset.editBeach]; if (!b) return; const cs = $('cms-module-selector'); if (cs) { cs.value = 'beaches'; cs.dispatchEvent(new Event('change')); if ($('beach-edit-id')) $('beach-edit-id').value = b.id; $('admin-modal').classList.add('active'); } }
});
document.addEventListener('click', e => {
    if (!document.body.classList.contains('edit-mode')) return;
    const img = e.target.closest('img.transfer-img'); if (!img) return;
    e.stopPropagation(); e.preventDefault();
    let obj = null, fn = null;
    if (img.dataset.serviceImg != null) { obj = SERVICES[+img.dataset.serviceImg]; fn = saveServices; }
    else if (img.dataset.aboutImg != null) { obj = ABOUT_BLOCKS[+img.dataset.aboutImg]; fn = saveAboutBlocks; }
    if (!obj || !fn) return;
    const pos = prompt('📍 Posición de la imagen:', obj.imgPosition || 'center'); if (pos === null) return;
    const fit = prompt('🔲 Ajuste (cover/contain/fill/none):', obj.imgFit || 'cover'); if (fit === null) return;
    obj.imgPosition = pos.trim() || 'center'; obj.imgFit = fit.trim() || 'cover';
    img.style.objectPosition = obj.imgPosition; img.style.objectFit = obj.imgFit; fn();
});
document.addEventListener('click', e => {
    const rel = e.target.closest('[data-openplace]');
    if (rel && !e.target.closest('.btn-delete-tour,.btn-edit-tour,.btn-move-left,.btn-move-right')) { openMedia(rel.dataset.openplace, rel.dataset.parent); return; }
    if (e.target.classList.contains('btn-delete-tour') && e.target.dataset.deleteId) { e.stopPropagation(); if (confirm('¿Eliminar este lugar?')) { TOURS = TOURS.filter(t => t.id !== e.target.dataset.deleteId); saveTours(); refreshAll(); } }
    if (e.target.classList.contains('btn-edit-tour') && e.target.dataset.editId) {
        e.stopPropagation(); const t = byId(e.target.dataset.editId); if (!t) return;
        $('add-id').value = t.id; $('add-name').value = t.name; $('add-sub').value = t.sub || ''; $('add-type').value = t.type; $('add-pin-size').value = t.pinSize || 48;
        if ($('add-price')) $('add-price').value = t.price || 0;
        if ($('add-price-adult')) $('add-price-adult').value = t.price_adult != null ? t.price_adult : (t.price || 0);
        if ($('add-price-child')) $('add-price-child').value = t.price_child != null ? t.price_child : '';
        if ($('add-price-senior')) $('add-price-senior').value = t.price_senior != null ? t.price_senior : '';
        if ($('add-oldprice')) $('add-oldprice').value = t.oldPrice || '';
        $('add-duration').value = t.duration ? t.duration.replace('🕒 ', '') : ''; $('add-emoji').value = t.emoji || '';
        $('add-img').value = (t.imgs && t.imgs[0]) || t.img || '';
        $('add-video').value = t.video || ''; $('add-short-desc').value = t.desc || ''; $('add-desc').value = t.long || t.desc || '';
        $('add-includes').value = (t.includes || []).join(', '); $('add-hist').value = t.hist || ''; $('add-featured').checked = !!t.featured;
        refreshAdminSelects(); $('add-zone').value = t.zone || 'ciudad'; $('add-style').value = t.style || 'culture';
        populatePlacesSelector(t.places || []); togglePkgRows(); $('admin-modal').classList.add('active');
        const cs = $('cms-module-selector'); if (cs) { cs.value = 'tours'; cs.dispatchEvent(new Event('change')); }
    }
});
document.addEventListener('click', e => {
    if (!document.body.classList.contains('edit-mode')) return;
    const b = e.target.closest('[data-move-tour]');
    if (b) { e.stopPropagation(); e.preventDefault(); const i = TOURS.findIndex(t => t.id === b.dataset.moveTour); if (moveItemInArray(TOURS, i, +b.dataset.dir)) { saveTours(); refreshAll(); } }
});

// ── Selects del CMS ─────────────────────────────────────────────────────────
function refreshAdminSelects() {
    const z = $('add-zone'); if (z) { const c = z.value; z.innerHTML = ZONES.map(x => '<option value="' + esc(x.id) + '">' + esc(x.emoji) + ' ' + esc(x.name) + '</option>').join('') + '<option value="__new__">➕ Crear nueva zona...</option>'; if (c && z.querySelector('option[value="' + c + '"]')) z.value = c; }
    const s = $('add-style'); if (s) { const c = s.value; s.innerHTML = STYLES.filter(x => x[0] !== 'all').map(x => '<option value="' + x[0] + '">' + esc(x[1]) + '</option>').join('') + '<option value="__new__">➕ Crear nuevo estilo...</option>'; if (c && s.querySelector('option[value="' + c + '"]')) s.value = c; }
}
on($('add-zone'), 'change', () => { const r = $('row-new-zone'); if (r) r.style.display = $('add-zone').value === '__new__' ? 'block' : 'none'; });
on($('add-style'), 'change', () => { const r = $('row-new-style'); if (r) r.style.display = $('add-style').value === '__new__' ? 'block' : 'none'; });
on($('btn-create-zone'), 'click', () => { const e = $('new-zone-emoji').value.trim() || '📍', n = $('new-zone-name').value.trim(), d = $('new-zone-desc').value.trim(); if (!n) { alert('Escribe un nombre'); return; } const id = n.toLowerCase().replace(/[^a-z0-9]/g, '_').substring(0, 20); if (ZONES.find(z => z.id === id)) { alert('Ya existe'); return; } ZONES.push({ id, name: n, emoji: e, desc: d }); saveZones(); refreshAdminSelects(); $('add-zone').value = id; const r = $('row-new-zone'); if (r) r.style.display = 'none'; });
on($('btn-create-style'), 'click', () => { const e = $('new-style-emoji').value.trim() || '🎭', n = $('new-style-name').value.trim(); if (!n) { alert('Escribe un nombre'); return; } const id = n.toLowerCase().replace(/[^a-z0-9]/g, '_').substring(0, 20); if (STYLES.find(s => s[0] === id)) { alert('Ya existe'); return; } STYLES.push([id, e + ' ' + n]); saveStyles(); refreshAdminSelects(); $('add-style').value = id; const r = $('row-new-style'); if (r) r.style.display = 'none'; });
function populatePlacesSelector(sel) { 
    sel = sel || []; 
    const c = $('add-places-container'); 
    const selDropdown = $('existing-places-select');
    if (!c || !selDropdown) return; 
    
    // Populate dropdown
    const lugares = TOURS.filter(t => t.type === 'lugar');
    selDropdown.innerHTML = lugares.map(t => '<option value="' + esc(t.id) + '">' + esc(t.emoji) + ' ' + esc(t.name) + '</option>').join('');
    
    // Populate existing active chips
    c.innerHTML = '';
    sel.forEach(id => {
        const t = lugares.find(x => x.id === id);
        if (t) addPlaceChip(t);
    });
}

function addPlaceChip(t) {
    const c = $('add-places-container');
    if (!c || c.querySelector('[data-place-id="' + t.id + '"]')) return; // Avoid duplicates
    const span = document.createElement('span');
    span.className = 'tag active';
    span.dataset.placeId = t.id;
    span.innerHTML = esc(t.emoji) + ' ' + esc(t.name) + ' <span>✕</span>';
    span.addEventListener('click', function() { this.remove(); });
    c.appendChild(span);
}

on($('btn-add-existing'), 'click', () => {
    const sel = $('existing-places-select');
    if (!sel || !sel.value) return;
    const t = TOURS.find(x => x.id === sel.value);
    if (t) addPlaceChip(t);
});

function refreshSelects() {
    const b = $('book-exp-select'); if (b) { const c = b.value; const p = TOURS.filter(t => t.type === 'package'); b.innerHTML = p.map(t => '<option value="' + esc(t.id) + '">' + esc(t.emoji) + ' ' + esc(t.name) + ' - $' + t.price + '</option>').join(''); if (c && p.find(t => t.id === c)) b.value = c; }
    const r = $('rev-tour'); if (r) r.innerHTML = TOURS.map(t => '<option value="' + esc(t.id) + '">' + (t.type === 'package' ? '📦 ' : '') + esc(t.name) + '</option>').join('');
}
function refreshTransferSelects() {
    const d = $('tf-destination'); if (d) { const c = d.value; d.innerHTML = TRANSFERS.map(t => '<option value="' + esc(t.id) + '">' + esc(t.emoji) + ' ' + esc(t.name) + '</option>').join('') + '<option value="custom">📍 Destino personalizado</option>'; if (c && d.querySelector('option[value="' + c + '"]')) d.value = c; }
    const e = $('tf-edit-id'); if (e) e.innerHTML = TRANSFERS.map(t => '<option value="' + esc(t.id) + '">' + esc(t.emoji) + ' ' + esc(t.name) + '</option>').join('');
}
function refreshBeachSelects() { const e = $('beach-edit-id'); if (e) e.innerHTML = BEACHES.map(b => '<option value="' + esc(b.id) + '">' + (esc(b.emoji) || '🏖️') + ' ' + esc(b.name) + '</option>').join(''); }
on($('tf-edit-id'), 'change', () => { const tf = byTransferId($('tf-edit-id').value); if (!tf) return; if ($('tf-edit-name')) $('tf-edit-name').value = tf.name || ''; if ($('tf-edit-emoji')) $('tf-edit-emoji').value = tf.emoji || ''; if ($('tf-edit-origin')) $('tf-edit-origin').value = tf.origin || ''; if ($('tf-edit-dest')) $('tf-edit-dest').value = tf.destination || ''; if ($('tf-edit-oneway')) $('tf-edit-oneway').value = tf.price_one_way || 0; if ($('tf-edit-roundtrip')) $('tf-edit-roundtrip').value = tf.price_round_trip || 0; if ($('tf-edit-desc')) $('tf-edit-desc').value = tf.desc || ''; if ($('tf-edit-basis')) $('tf-edit-basis').value = tf.price_basis || 'per_vehicle'; });
on($('beach-edit-id'), 'change', () => { const b = byBeachId($('beach-edit-id').value); if (!b) return; if ($('beach-edit-name')) $('beach-edit-name').value = b.name || ''; if ($('beach-edit-zone')) $('beach-edit-zone').value = b.zone || ''; if ($('beach-edit-emoji')) $('beach-edit-emoji').value = b.emoji || ''; if ($('beach-edit-price')) $('beach-edit-price').value = b.price || 0; if ($('beach-edit-img')) $('beach-edit-img').value = b.img || ''; if ($('beach-edit-desc')) $('beach-edit-desc').value = b.desc || ''; });
function togglePkgRows(resetPlaces = false) { 
    const p = $('add-type').value === 'package'; 
    const rp = $('row-places'); 
    if (rp) rp.style.display = p ? 'block' : 'none'; 
    const rs = $('row-pin-size'); 
    if (rs) rs.style.display = p ? 'none' : 'block'; 
    if (p && resetPlaces) populatePlacesSelector([]); 
}
on($('add-type'), 'change', () => togglePkgRows(true));
on($('btn-add-place'), 'click', () => {
    const h = $('add-places-builder'); if (!h) return;
    const w = document.createElement('div'); w.className = 'place-builder'; w.style.cssText = 'border:1px dashed #ccc;border-radius:10px;padding:10px;margin-bottom:10px;';
    w.innerHTML = '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;"><b style="font-size:.75rem;color:#666;">📍 Nuevo lugar</b><button type="button" class="btn-ghost" data-remove-place style="padding:4px 10px;font-size:.7rem;">✕ Quitar</button></div>' +
        '<input class="glass-input" data-pf="name" placeholder="Nombre del lugar" style="margin-bottom:6px;">' +
        '<input class="glass-input" data-pf="emoji" placeholder="Emoji (ej: 🏝️)" style="margin-bottom:6px;">' +
        '<input class="glass-input" data-pf="img" placeholder="URL de la foto" style="margin-bottom:6px;">' +
        '<input class="glass-input" data-pf="desc" placeholder="Mini descripción" style="margin-bottom:6px;">' +
        '<input class="glass-input" data-pf="long" placeholder="Descripción completa" style="margin-bottom:6px;">' +
        '<input class="glass-input" data-pf="hist" placeholder="Historia (opcional)">';
    h.appendChild(w);
    w.querySelector('[data-remove-place]').addEventListener('click', () => w.remove());
});
const cmsSelector = $('cms-module-selector');
if (cmsSelector) on(cmsSelector, 'change', () => {
    const m = cmsSelector.value;
    const t = $('cms-module-tours'); if (t) t.style.display = m === 'tours' ? 'grid' : 'none';
    const b = $('cms-module-blocks'); if (b) b.style.display = (m === 'services' || m === 'about') ? 'grid' : 'none';
    const tr = $('cms-module-transfers'); if (tr) tr.style.display = m === 'transfers' ? 'grid' : 'none';
    const tn = $('cms-module-transfers-new'); if (tn) tn.style.display = m === 'transfers_new' ? 'grid' : 'none';
    const be = $('cms-module-beaches'); if (be) be.style.display = m === 'beaches' ? 'grid' : 'none';
    const bn = $('cms-module-beaches-new'); if (bn) bn.style.display = m === 'beaches_new' ? 'grid' : 'none';
    if (m === 'transfers') refreshTransferSelects();
    if (m === 'beaches') refreshBeachSelects();
});
on($('btn-save-cms'), 'click', () => {
    const m = cmsSelector ? cmsSelector.value : 'tours';
    if (m === 'tours') {
        const name = $('add-name').value.trim(); if (!name) { alert('Nombre requerido'); return; }
        const mainImg = $('add-img').value.trim();
        const imgs = mainImg ? [mainImg] : [];
    if (m === 'transfers') { refreshTransferSelects(); if($('tf-edit-id')) $('tf-edit-id').dispatchEvent(new Event('change')); }
    if (m === 'beaches') { refreshBeachSelects(); if($('beach-edit-id')) $('beach-edit-id').dispatchEvent(new Event('change')); }
        let d = $('add-duration').value.trim(); if (d && /^\d+$/.test(d)) d += 'h'; if (d && d.indexOf('🕒') !== 0) d = '🕒 ' + d; if (!d || d === '🕒 ') d = '🕒 A coordinar';
        const pA = $('add-price-adult') ? (parseFloat($('add-price-adult').value) || 0) : (parseFloat($('add-price').value) || 0);
        const pC = $('add-price-child') ? (parseFloat($('add-price-child').value) || 0) : Math.round(pA * .5);
        const pS = $('add-price-senior') ? (parseFloat($('add-price-senior').value) || 0) : Math.round(pA * .8);
        const common = { name, sub: $('add-sub').value.trim(), zone: $('add-zone').value === '__new__' ? 'ciudad' : $('add-zone').value, style: $('add-style').value === '__new__' ? 'culture' : $('add-style').value, pinSize: parseInt($('add-pin-size').value, 10) || 48, price: pA, price_adult: pA, price_child: pC, price_senior: pS, oldPrice: parseInt($('add-oldprice').value, 10) || null, duration: d, emoji: $('add-emoji').value.trim() || '', img: imgs[0] || '', imgs, video: $('add-video').value.trim(), desc: $('add-short-desc').value.trim() || $('add-desc').value.trim(), long: $('add-desc').value.trim(), includes: $('add-includes').value.split(',').map(s => s.trim()).filter(Boolean), hist: $('add-hist').value.trim(), featured: $('add-featured').checked, type: isPkg ? 'package' : 'lugar', places: isPkg ? activePlaces.slice() : [] };
        document.querySelectorAll('#add-places-builder .place-builder').forEach(pb => {
            const pn = pb.querySelector('[data-pf="name"]').value.trim(); if (!pn) return;
            const pid = 'lugar-' + Date.now() + '-' + Math.random().toString(36).slice(2, 7); const c = map.getCenter();
            const img = pb.querySelector('[data-pf="img"]').value.trim();
            TOURS.push({ id: pid, type: 'lugar', zone: common.zone, style: common.style, name: pn, sub: '', emoji: pb.querySelector('[data-pf="emoji"]').value.trim() || '📍', img, imgs: img ? [img] : [], pinSize: 22, video: '', coords: [+c.lat.toFixed(5), +c.lng.toFixed(5)], desc: pb.querySelector('[data-pf="desc"]').value.trim() || pn, long: pb.querySelector('[data-pf="long"]').value.trim() || pb.querySelector('[data-pf="desc"]').value.trim() || pn, hist: pb.querySelector('[data-pf="hist"]').value.trim() || '', includes: [] });
            if (isPkg) common.places.push(pid);
        });
        const eid = $('add-id').value;
        if (eid) Object.assign(byId(eid), common);
        else { const c = map.getCenter(); common.id = 'custom_' + Date.now(); common.rating = 5; common.votes = 1; common.coords = [+c.lat.toFixed(5), +c.lng.toFixed(5)]; TOURS.push(common); }
        saveTours(); $('admin-modal').classList.remove('active'); $('add-id').value = ''; const hb = $('add-places-builder'); if (hb) hb.innerHTML = ''; refreshAll();
    } else if (m === 'services' || m === 'about') {
        const title = $('cms-block-title').value.trim(), desc = $('cms-block-desc').value.trim(), img = $('cms-block-img').value.trim(), sub = $('cms-block-sub').value.trim();
        const ip = $('cms-block-img-position') ? $('cms-block-img-position').value : 'center', fit = $('cms-block-img-fit') ? $('cms-block-img-fit').value : 'cover';
        if (!title || !desc || !img) { alert('Llena Título, Descripción y URL de imagen'); return; }
        const nb = { title, desc, img, subtitle: sub, imgPosition: ip, imgFit: fit };
        if (m === 'services') { SERVICES.push(nb); saveServices(); renderServices(); } else { ABOUT_BLOCKS.push(nb); saveAboutBlocks(); renderAbout(); }
        $('admin-modal').classList.remove('active'); $('cms-block-title').value = ''; $('cms-block-desc').value = ''; $('cms-block-img').value = ''; $('cms-block-sub').value = '';
    } else if (m === 'transfers') {
        const id = $('tf-edit-id') ? $('tf-edit-id').value : null; if (!id) { alert('Selecciona un traslado'); return; }
        const tf = byTransferId(id); if (!tf) return;
        if ($('tf-edit-name')) tf.name = $('tf-edit-name').value.trim() || tf.name;
        if ($('tf-edit-emoji')) tf.emoji = $('tf-edit-emoji').value.trim() || tf.emoji;
        if ($('tf-edit-origin')) tf.origin = $('tf-edit-origin').value.trim() || tf.origin;
        if ($('tf-edit-dest')) tf.destination = $('tf-edit-dest').value.trim() || tf.destination;
        if ($('tf-edit-oneway')) tf.price_one_way = parseFloat($('tf-edit-oneway').value) || tf.price_one_way;
        if ($('tf-edit-roundtrip')) tf.price_round_trip = parseFloat($('tf-edit-roundtrip').value) || tf.price_round_trip;
        if ($('tf-edit-desc')) tf.desc = $('tf-edit-desc').value || tf.desc;
        if ($('tf-edit-basis')) tf.price_basis = $('tf-edit-basis').value || tf.price_basis;
        saveTransfers(); renderTransferDestinations(); refreshTransferSelects(); $('admin-modal').classList.remove('active'); alert('✅ Traslado actualizado.');
    } else if (m === 'transfers_new') {
        const name = $('tf-new-name').value.trim(), dest = $('tf-new-dest').value.trim();
        if (!name || !dest) { alert('Nombre y destino obligatorios'); return; }
        TRANSFERS.push({ id: 'tf-custom-' + Date.now(), name, origin: $('tf-new-origin').value.trim() || 'Aeropuerto / Hotel', destination: dest, price_one_way: parseFloat($('tf-new-oneway').value) || 0, price_round_trip: parseFloat($('tf-new-roundtrip').value) || 0, max_passengers: parseInt($('tf-new-maxpax').value, 10) || 8, emoji: $('tf-new-emoji').value.trim() || '🚐', price_basis: $('tf-new-basis') ? $('tf-new-basis').value : 'per_vehicle', desc: $('tf-new-desc').value.trim() || '', coords: [] });
        saveTransfers(); renderTransferDestinations(); refreshTransferSelects(); $('admin-modal').classList.remove('active');
        ['tf-new-name', 'tf-new-dest', 'tf-new-origin', 'tf-new-desc'].forEach(id => { const e = $(id); if (e) e.value = ''; }); alert('✅ Traslado creado.');
    } else if (m === 'beaches') {
        const id = $('beach-edit-id') ? $('beach-edit-id').value : null; if (!id) { alert('Selecciona una playa'); return; }
        const b = byBeachId(id); if (!b) return;
        if ($('beach-edit-name')) b.name = $('beach-edit-name').value.trim() || b.name;
        if ($('beach-edit-zone')) b.zone = $('beach-edit-zone').value.trim() || b.zone;
        if ($('beach-edit-emoji')) b.emoji = $('beach-edit-emoji').value.trim() || b.emoji;
        if ($('beach-edit-price')) b.price = parseFloat($('beach-edit-price').value) || 0;
        if ($('beach-edit-img')) b.img = $('beach-edit-img').value.trim() || b.img;
        if ($('beach-edit-desc')) b.desc = $('beach-edit-desc').value.trim() || b.desc;
        saveBeaches(); renderBeaches(); refreshBeachSelects(); $('admin-modal').classList.remove('active'); alert('✅ Playa actualizada.');
    } else if (m === 'beaches_new') {
        const name = $('beach-new-name').value.trim(); if (!name) { alert('Nombre de playa obligatorio'); return; }
        BEACHES.push({ id: 'playa-' + Date.now(), name, zone: $('beach-new-zone').value.trim() || 'Panamá', emoji: $('beach-new-emoji').value.trim() || '🏖️', price: parseFloat($('beach-new-price').value) || 0, duration: '🕒 Día completo', img: $('beach-new-img').value.trim() || '', desc: $('beach-new-desc').value.trim() || '' });
        saveBeaches(); renderBeaches(); refreshBeachSelects(); $('admin-modal').classList.remove('active');
        ['beach-new-name', 'beach-new-zone', 'beach-new-img', 'beach-new-desc'].forEach(id => { const e = $(id); if (e) e.value = ''; }); alert('✅ Playa agregada.');
    }
});

