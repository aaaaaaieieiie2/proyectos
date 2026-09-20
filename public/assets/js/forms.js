// ── Reseñas ─────────────────────────────────────────────────────────────────
function applyReview(t, s) { t.rating = (t.rating * t.votes + s) / (t.votes + 1); t.votes++; }
function refreshRatings() {
    document.querySelectorAll('[data-rate]').forEach(el => { const t = byId(el.dataset.rate); if (t) el.textContent = '⭐ ' + t.rating.toFixed(1); });
    if (TOURS.length) { const el = $('rev-avg'); if (el) el.textContent = '★ ' + (TOURS.reduce((s, t) => s + (t.rating || 0), 0) / TOURS.length).toFixed(1); }
}
function renderReviewStats() {
    const b = $('rev-stats'); if (!b) return;
    const all = userReviews.concat(SEED_REVIEWS); const c = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    all.forEach(r => { c[r.stars] = (c[r.stars] || 0) + 1; }); const t = all.length || 1;
    b.innerHTML = [5, 4, 3, 2, 1].map(s => '<div class="rev-bar-row"><span class="rev-bar-label">' + s + '★</span><div class="rev-bar"><i style="width:' + Math.round((c[s] || 0) / t * 100) + '%"></i></div><span class="rev-bar-num">' + (c[s] || 0) + '</span></div>').join('');
}
function renderReviews() {
    const l = $('review-list'); if (!l) return;
    const all = userReviews.slice().reverse().concat(SEED_REVIEWS);
    l.innerHTML = all.map(r => { const t = byId(r.tour); return '<div class="review-card"><div class="review-head"><span class="who">' + esc(r.name) + '</span><span class="review-tour">' + (t ? esc(t.name) : 'Tour') + '</span><span class="when">' + esc(r.when || 'Hoy') + '</span></div><div class="review-stars">' + '★'.repeat(r.stars) + '☆'.repeat(5 - r.stars) + '</div><div class="review-text">' + esc(r.text) + '</div></div>'; }).join('');
    renderReviewStats(); refreshRatings();
}
document.querySelectorAll('#rev-stars span').forEach(s => s.addEventListener('click', () => { const v = parseInt(s.dataset.v, 10); document.querySelectorAll('#rev-stars span').forEach((ss, i) => ss.classList.toggle('on', i < v)); }));
on($('rev-submit'), 'click', () => {
    const tid = $('rev-tour').value, stars = document.querySelectorAll('#rev-stars .on').length, name = $('rev-name').value.trim(), text = $('rev-text').value.trim();
    if (!name || !text || !stars) { alert('Completa todos los campos y selecciona estrellas ⭐'); return; }
    const r = { tour: tid, name, stars, text, when: 'Ahora' }; const t = byId(tid); if (t) applyReview(t, r.stars);
    userReviews.push(r); saveTours(); renderReviews();
    $('rev-name').value = ''; $('rev-text').value = '';
    document.querySelectorAll('#rev-stars span').forEach(s => s.classList.remove('on'));
});

// ── Reserva de paquetes / playas (acepta id u objeto; adultos/niños/ancianos) ─
const bsel = $('book-exp-select'); let adults = 2, children = 0, seniors = 0;
function openBooking(param) {
    let obj = null;
    if (param && typeof param === 'object') obj = param; else if (typeof param === 'string') obj = byId(param) || byBeachId(param);
    const show = !obj; const esr = $('exp-select-row'); if (esr) esr.style.display = show ? 'block' : 'none';
    if (show) obj = bsel ? byId(bsel.value) : null;
    if (!obj) return;
    adults = 2; children = 0; seniors = 0;
    const ba = $('book-adults'); if (ba) ba.textContent = adults; const bc = $('book-children'); if (bc) bc.textContent = children; const bs = $('book-seniors'); if (bs) bs.textContent = seniors;
    setBookingTour(obj);
    const fv = $('book-form-view'); if (fv) fv.style.display = 'flex'; const su = $('book-success'); if (su) su.style.display = 'none';
    $('booking-modal').classList.add('active');
    const sc = document.querySelector('.booking-info'); if (sc) sc.scrollTop = 0;
}
function setBookingTour(t) {
    if (!t) return; currentTour = t;
    const pa = t.price_adult != null ? t.price_adult : (t.price || 0), pc = t.price_child != null ? t.price_child : Math.round(pa * .5), ps = t.price_senior != null ? t.price_senior : Math.round(pa * .8);
    const pl = $('book-price-label'); if (pl) pl.textContent = pa ? pa.toLocaleString() : '—';
    const cl = $('book-child-label'); if (cl) cl.textContent = pa ? pc.toLocaleString() : '—';
    const sl = $('book-senior-label'); if (sl) sl.textContent = pa ? ps.toLocaleString() : '—';
    const mi = (t.imgs && t.imgs.length) ? t.imgs[0] : (t.img || ''); const bi = $('booking-img'); if (bi) { if (mi) { bi.src = mi; bi.style.display = 'block'; } else bi.style.display = 'none'; }
    const td = $('booking-title-display'); if (td) td.textContent = t.name; const sd = $('booking-sub-display'); if (sd) sd.textContent = t.sub || '';
    updateTotal();
}
function updateTotal() {
    if (!currentTour) return;
    const el = $('book-total'), note = $('book-quote-note');
    const pa = currentTour.price_adult != null ? currentTour.price_adult : (currentTour.price || 0);
    const pc = currentTour.price_child != null ? currentTour.price_child : Math.round(pa * .5);
    const ps = currentTour.price_senior != null ? currentTour.price_senior : Math.round(pa * .8);
    if (!pa) { if (el) el.textContent = 'A confirmar 💬'; if (note) note.hidden = false; return; }
    if (note) note.hidden = true;
    if (el) el.textContent = '$' + (adults * pa + children * pc + seniors * ps).toLocaleString();
}
if (bsel) bsel.addEventListener('change', () => setBookingTour(byId(bsel.value)));
document.querySelectorAll('.step-btn').forEach(b => b.addEventListener('click', () => { const p = b.dataset.step.split(','); const f = p[0], d = parseInt(p[1], 10); if (f === 'adults') adults = Math.min(10, Math.max(1, adults + d)); else if (f === 'children') children = Math.min(10, Math.max(0, children + d)); else if (f === 'seniors') seniors = Math.min(10, Math.max(0, seniors + d)); const ba = $('book-adults'); if (ba) ba.textContent = adults; const bc = $('book-children'); if (bc) bc.textContent = children; const bs = $('book-seniors'); if (bs) bs.textContent = seniors; updateTotal(); }));
document.querySelectorAll('#book-tags .tag').forEach(t => t.addEventListener('click', () => t.classList.toggle('active')));
const bookDate = $('book-date'); if (bookDate) bookDate.min = new Date().toISOString().split('T')[0];
function bookingDetails() { const ints = Array.from(document.querySelectorAll('#book-tags .tag.active')).map(t => t.textContent).join(', '); const notes = $('book-notes') ? $('book-notes').value.trim() : ''; return 'RESERVA FILITOUR\n👤 ' + $('book-name').value + '\n📧 ' + $('book-email').value + ' · 🌎 ' + ($('book-country') ? $('book-country').value : '') + '\n🎯 ' + currentTour.name + '\n👥 ' + adults + ' adultos · ' + children + ' niños · ' + seniors + ' adultos mayores' + '\n📅 ' + ($('book-date').value || '—') + ' · ' + ($('book-time').value || '—') + '\n💡 ' + ints + (notes ? '\n📝 Notas: ' + notes : '') + '\n💰 ' + $('book-total').textContent; }
on($('book-submit'), 'click', () => { 
    const name = $('book-name').value.trim();
    const email = $('book-email').value.trim();
    const country = $('book-country') ? $('book-country').value.trim() : '';
    const date = $('book-date').value;
    const time = $('book-time').value;

    if (!name || !email || !country || !date || !time) { 
        alert('Por favor, completa todos los campos obligatorios:\n- Nombre\n- Email\n- País de origen\n- Fecha\n- Hora'); 
        return; 
    } 
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { alert('Por favor ingresa un correo electrónico válido 📧'); return; }
    
    if (typeof BACKEND_ENABLED !== 'undefined' && BACKEND_ENABLED && typeof apiPost !== 'undefined') {
        const payload = {
            booking_type: currentTour ? currentTour.type : 'custom',
            reference_id: currentTour ? currentTour.id : '',
            client_name: $('book-name').value,
            client_email: $('book-email').value,
            client_phone: $('book-country') ? $('book-country').value : '',
            travel_date: $('book-date').value,
            pax_adults: adults,
            pax_kids: children + seniors,
            total_price: $('book-total').textContent.replace(/[^0-9.]/g, ''),
            client_notes: $('book-notes') ? $('book-notes').value.trim() : ''
        };
        apiPost('book', 'booking', payload);
    }
    $('book-form-view').style.display = 'none'; 
    $('book-success').style.display = 'block'; 
    $('success-detail').textContent = 'Abriendo WhatsApp automáticamente...'; 
    
    // REDIRECCIÓN AUTOMÁTICA A WHATSAPP
    setTimeout(() => {
        window.location.href = 'https://wa.me/' + COMPANY_WA + '?text=' + encodeURIComponent(bookingDetails());
    }, 1000);
});
function closeModal(id) { const m = $(id); if (m) m.classList.remove('active'); if (id === 'video-modal') stopVideoModal(); }
document.querySelectorAll('.modal-close').forEach(b => b.addEventListener('click', () => closeModal(b.dataset.close)));
document.querySelectorAll('.modal-overlay').forEach(m => m.addEventListener('click', e => { if (e.target === m) { m.classList.remove('active'); if (m.id === 'video-modal') stopVideoModal(); } }));

// ── 🚐 Modal de traslado (sin precio; direcciones completas; adultos/niños/abuelos) ──
let currentTransfer = null, tfTripType = 'one_way', tfCounts = { adults: 2, kids: 0, seniors: 0, bags: 2 };
function syncTfSpans() { const a = $('tf-adults'); if (a) a.textContent = tfCounts.adults; const k = $('tf-kids'); if (k) k.textContent = tfCounts.kids; const s = $('tf-seniors'); if (s) s.textContent = tfCounts.seniors; const b = $('tf-bags'); if (b) b.textContent = tfCounts.bags; }
function openTransferModal(tfId) {
    if (typeof refreshTransferSelects !== 'undefined') if (typeof refreshTransferSelects !== 'undefined') refreshTransferSelects();
    currentTransfer = tfId ? (byTransferId(tfId) || TRANSFERS[0]) : TRANSFERS[0];
    const ds = $('tf-destination'); if (ds && tfId) { const o = ds.querySelector('option[value="' + tfId + '"]'); if (o) ds.value = tfId; }
    tfTripType = 'one_way'; tfCounts = { adults: 2, kids: 0, seniors: 0, bags: 2 }; syncTfSpans();
    const oi = $('tf-origin-address'); if (oi) oi.value = ''; const di = $('tf-dest-address'); if (di) di.value = '';
    const rr = $('tf-return-row'); if (rr) rr.hidden = true;
    const odr = $('tf-origin-detail-row'); if (odr) odr.style.display = 'none';
    const ddr = $('tf-dest-detail-row'); if (ddr) ddr.style.display = 'none';
    const fv = $('transfer-form-view'); if (fv) fv.style.display = 'block';
    const su = $('transfer-success'); if (su) su.style.display = 'none';
    document.querySelectorAll('.trip-type-btn').forEach(b => b.classList.toggle('active', b.dataset.trip === 'one_way'));
    updateTransferTotal();
    $('transfer-modal').classList.add('active');
}
function updateTransferTotal() { const te = $('tf-total'); if (te) te.textContent = 'A confirmar 💬'; const n = $('tf-price-note'); if (n) n.textContent = 'Cada traslado tiene una tarifa según distancia y pasajeros. Al confirmar, te enviamos el precio exacto por WhatsApp.'; }
document.addEventListener('click', e => { const b = e.target.closest('[data-tfstep]'); if (!b) return; const p = b.dataset.tfstep.split(','); const f = p[0], d = parseInt(p[1], 10); const lim = { adults: [1, 15], kids: [0, 15], seniors: [0, 15], bags: [0, 20] }; if (lim[f]) { tfCounts[f] = Math.max(lim[f][0], Math.min(lim[f][1], tfCounts[f] + d)); syncTfSpans(); updateTransferTotal(); } });
document.addEventListener('click', e => { const b = e.target.closest('.trip-type-btn'); if (!b) return; tfTripType = b.dataset.trip; document.querySelectorAll('.trip-type-btn').forEach(x => x.classList.toggle('active', x === b)); const rr = $('tf-return-row'); if (rr) rr.hidden = tfTripType !== 'round_trip'; });
const tfOriginSel = $('tf-origin'); if (tfOriginSel) tfOriginSel.addEventListener('change', () => { const r = $('tf-origin-detail-row'); if (r) r.style.display = tfOriginSel.value !== 'airport' ? 'block' : 'none'; });
const tfDestSel = $('tf-destination'); if (tfDestSel) tfDestSel.addEventListener('change', () => { const r = $('tf-dest-detail-row'); if (r) r.style.display = tfDestSel.value === 'custom' ? 'block' : 'none'; updateTransferTotal(); });
const tfSubmitBtn = $('tf-submit');
if (tfSubmitBtn) tfSubmitBtn.addEventListener('click', () => {
    const name = $('tf-name') ? $('tf-name').value.trim() : '';
    const email = $('tf-email') ? $('tf-email').value.trim() : '';
    const country = $('tf-country') ? $('tf-country').value.trim() : '';
    const date = $('tf-date') ? $('tf-date').value : '';
    const time = $('tf-time') ? $('tf-time').value : '';
    
    if (!name || !email || !country || !date || !time) { 
        alert('Por favor, completa todos los campos obligatorios:\n- Nombre\n- Email\n- País de origen\n- Fecha\n- Hora'); 
        return; 
    } 
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { alert('Por favor ingresa un correo electrónico válido 📧'); return; }
    const oi = $('tf-origin-address'), os = $('tf-origin');
    let origin = '';
    if (oi && oi.value.trim()) origin = oi.value.trim();
    else if (os) { if (os.value === 'airport') origin = 'Aeropuerto Internacional de Tocumen'; else { const d = $('tf-origin-detail'); origin = (d && d.value.trim()) ? d.value.trim() : (os.value === 'hotel' ? 'Hotel' : 'Otra dirección'); } }
    const di = $('tf-dest-address'), ds = $('tf-destination');
    let dest = '';
    if (di && di.value.trim()) dest = di.value.trim();
    else if (ds) { if (ds.value === 'custom') { const d = $('tf-dest-detail'); dest = (d && d.value.trim()) ? d.value.trim() : 'Personalizado'; } else { const t0 = byTransferId(ds.value); dest = t0 ? t0.destination : ds.value; } }
    if (!name) { alert('Por favor ingresa tu nombre completo 🙏'); return; }
    if (!origin) { alert('Escribe tu punto de ORIGEN con dirección completa 📍'); return; }
    if (!dest) { alert('Escribe tu punto de DESTINO con dirección completa 🏁'); return; }
    const df = $('tf-date'); if (!df || !df.value) { alert('Por favor selecciona la fecha de recogida 📅'); return; }
    if (typeof BACKEND_ENABLED !== 'undefined' && BACKEND_ENABLED && typeof apiPost !== 'undefined') {
        const payload = {
            type: 'transfer',
            reference_id: ds && ds.value ? ds.value : 'custom',
            client_name: name,
            client_email: $('tf-email') ? $('tf-email').value.trim() : '',
            client_phone: country,
            travel_date: df.value,
            pax_adults: tfCounts.adults,
            pax_kids: tfCounts.kids + tfCounts.seniors,
            total_price: 0,
            client_notes: 'Origen: ' + origin + ' -> Destino: ' + dest + 
                          '\nTrip: ' + tfTripType + 
                          '\nReturn Date: ' + ($('tf-return-date') ? $('tf-return-date').value : '') + 
                          '\nReturn Time: ' + ($('tf-return-time') ? $('tf-return-time').value : '') + 
                          '\nBags: ' + tfCounts.bags + 
                          '\nUser Notes: ' + ($('tf-notes') ? $('tf-notes').value : '')
        };
        apiPost('book', 'booking', payload);
    }
    const trip = tfTripType === 'round_trip' ? 'Ida y Vuelta' : 'Solo Ida';
    const pax = tfCounts.adults + ' adultos · ' + tfCounts.kids + ' niños · ' + tfCounts.seniors + ' adultos mayores';
    const detail = '🚐 RESERVA DE TRASLADO — FiliTour\n\n👤 Nombre: ' + name + '\n🌎 País: ' + (country || '—') + '\n📧 Email: ' + ($('tf-email') ? $('tf-email').value : '—') + '\n\n🗺️ Tipo: ' + trip + '\n📍 Origen: ' + origin + '\n🏁 Destino: ' + dest + '\n📅 Fecha: ' + df.value + ' · ' + ($('tf-time') ? $('tf-time').value : '') + '\n' + (tfTripType === 'round_trip' ? '🔄 Retorno: ' + ($('tf-return-date') ? $('tf-return-date').value : '—') + ' · ' + ($('tf-return-time') ? $('tf-return-time').value : '') + '\n' : '') + '👥 Pasajeros: ' + pax + '\n🧳 Maletas: ' + tfCounts.bags + '\n💵 Tarifa: A CONFIRMAR (se confirma por WhatsApp)\n\n📝 Notas: ' + ($('tf-notes') ? $('tf-notes').value : '—');
    const fv = $('transfer-form-view'); if (fv) fv.style.display = 'none';
    const su = $('transfer-success'); if (su) su.style.display = 'block';
    const sd = $('tf-success-detail'); if (sd) sd.textContent = 'Abriendo WhatsApp automáticamente...';
    
    // REDIRECCIÓN AUTOMÁTICA A WHATSAPP
    setTimeout(() => {
        window.location.href = 'https://wa.me/' + COMPANY_WA + '?text=' + encodeURIComponent(detail);
    }, 1000);
});
