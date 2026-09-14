// ============================================================================
// public/assets/js/api.js
// Utilidades globales y lógica de comunicación con el Backend (Fase 2)
// ============================================================================
'use strict';

// ── Utilidades base (deben estar disponibles antes que map.js, forms.js, cms.js) ──
var $ = function(id) { return document.getElementById(id); };
var on = function(el, ev, fn) { if (el) el.addEventListener(ev, fn); };

const API_BASE = 'api.php';

/**
 * Obtiene token CSRF desde el meta tag en el HTML
 */
function getCsrfToken() {
 const meta = document.querySelector('meta[name="csrf-token"]');
 return meta ? meta.getAttribute('content') : '';
}

/**
 * Llamada segura a la API con token CSRF incluido
 */
async function apiFetch(action, payload = {}) {
 if (!BACKEND_ENABLED) return null;
 
 // Agregar token CSRF a todas las peticiones POST
 if (payload && typeof payload === 'object') {
 payload.csrf_token = getCsrfToken();
 }
 
 try {
 const res = await fetch(API_BASE + '?action=' + action, {
 method: 'POST',
 headers: { 'Content-Type': 'application/json' },
 body: JSON.stringify(payload)
 });
 
 const data = await res.json();
 
 // Manejar errores de autenticación/CSRF
 if (res.status === 403) {
 console.error('❌ CSRF o acceso denegado:', data.message);
 if (window.IS_ADMIN) {
 alert('⚠️ Tu sesión expiró. Por seguridad, recarga la página.');
 location.reload();
 }
 throw new Error(data.message || 'Acceso denegado');
 }
 
 return data;
 } catch (e) {
 console.error('API Error:', e);
 throw e;
 }
}

/**
 * Exporta todos los datos actuales del CMS como objeto JSON
 */
function exportCode() {
 const data = {
 tours: TOURS,
 beaches: BEACHES,
 transfers: TRANSFERS,
 services: SERVICES,
 about_blocks: ABOUT_BLOCKS,
 zones: ZONES,
 styles: STYLES,
 texts: TEXTS,
 social: SOCIAL
 };
 return '// Datos exportados desde FiliTour CMS - ' + new Date().toISOString() + '\\n' +
 'const EXPORTED_DATA = ' + JSON.stringify(data, null, 2) + ';';
}

/**
 * Copia texto al portapapeles
 */
async function copyText(text, successMsg) {
 try {
 await navigator.clipboard.writeText(text);
 if (successMsg) alert(successMsg);
 } catch (e) {
 // Fallback para navegadores antiguos
 const ta = document.createElement('textarea');
 ta.value = text;
 ta.style.position = 'fixed';
 ta.style.opacity = '0';
 document.body.appendChild(ta);
 ta.select();
 document.execCommand('copy');
 document.body.removeChild(ta);
 if (successMsg) alert(successMsg);
 }
}

/**
 * Escapa HTML para prevenir XSS
 */
function esc(str) {
 if (!str) return '';
 return String(str)
 .replace(/&/g, '&amp;')
 .replace(/</g, '&lt;')
 .replace(/>/g, '&gt;')
 .replace(/"/g, '&quot;')
 .replace(/'/g, '&#039;');
}
