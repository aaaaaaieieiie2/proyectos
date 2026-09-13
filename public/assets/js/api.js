// ============================================================================
// public/assets/js/api.js
// Utilidades globales y lógica de comunicación con el Backend (Fase 2)
// ============================================================================
'use strict';

// ── Utilidades base (deben estar disponibles antes que map.js, forms.js, cms.js) ──
var $ = function(id) { return document.getElementById(id); };
var on = function(el, ev, fn) { if (el) el.addEventListener(ev, fn); };

const API_BASE = 'api.php';

async function apiFetch(action, payload = {}) {
    if (!BACKEND_ENABLED) return null;
    try {
        const res = await fetch(API_BASE + '?action=' + action, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        return await res.json();
    } catch (e) {
        console.error('API Error:', e);
        return null;
    }
}
