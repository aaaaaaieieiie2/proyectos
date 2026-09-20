<?php
require_once __DIR__ . '/../app/bootstrap.php';
// Registrar visita si no es admin
$isAdmin = !empty($_SESSION['admin_logged_in']);
if (!$isAdmin) {
    \App\Controllers\StatsController::logVisit();
}
?>
<!DOCTYPE html>
<!-- public/index.php 🌴 PLANTILLA DINÁMICA FILITOUR (v4 definitiva) -->
<html lang="es">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<meta name="description" content="FiliTour Panamá 🌴 Tours, paquetes turísticos, playas y traslados privados en todo el país." />
<title>FiliTour Panamá Tourism</title>
<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
<link rel="stylesheet" href="assets/css/base.css?v=2" />
<link rel="stylesheet" href="assets/css/components.css?v=2" />
<link rel="stylesheet" href="assets/css/pages.css?v=2" />
<link rel="stylesheet" href="assets/css/responsive.css?v=2" />
<!-- Inyección segura del modo admin para el Javascript -->
<script>
window.IS_ADMIN = <?= $isAdmin ? 'true' : 'false' ?>;
</script>
<!-- 🛠️ PATCH v4 (siempre activo): flotantes fuera de los TOPS + sidebar pulido -->
<style>
@media (min-width: 901px) {
  #explore-toggle, #edit-mode-btn, #toggle-ui-btn { left: 412px; }
  body.no-tops #explore-toggle,
  body.no-tops #edit-mode-btn,
  body.no-tops #toggle-ui-btn { left: 16px; }
  .sidebar-left {
    padding: 10px 12px 24px 10px;
    gap: 14px;
    scrollbar-width: thin;
    scrollbar-color: rgba(14,159,110,.5) transparent;
  }
  .sidebar-left::-webkit-scrollbar { width: 6px; }
  .sidebar-left::-webkit-scrollbar-thumb { background: rgba(14,159,110,.45); border-radius: 6px; }
  .sidebar-left::-webkit-scrollbar-track { background: transparent; }
}
</style>
<?php if ($isAdmin): ?>
<style>
/* 🛠️ PATCH v4: barra de admin ABAJO, compacta, sin tapar menú ni modales */
.admin-bar {
background: #0f172a; color: white; padding: 6px 12px; display: flex; justify-content: center;
align-items: center; flex-wrap: wrap; gap: 4px 10px; position: fixed; bottom: 0; left: 0; right: 0; z-index: 7400;
box-shadow: 0 -2px 12px rgba(0,0,0,.45); border-top: 2px solid #ec4899; font-family: sans-serif;
}
.admin-bar-title { font-weight: bold; font-size: .8rem; }
.admin-bar-btns a {
color: white; text-decoration: none; padding: 4px 10px; margin-left: 6px;
background: rgba(255,255,255,0.1); border-radius: 4px; font-size: .78rem;
}
.admin-bar-btns a:hover { background: rgba(255,255,255,0.2); }
/* Subir los flotantes anclados abajo para que no los tape la barra (PC) */
@media (min-width: 901px) {
  .admin-bar ~ #explore-toggle { bottom: 64px; }
  .admin-bar ~ #edit-mode-btn { bottom: 112px; }
  .admin-bar ~ #toggle-ui-btn { bottom: 166px; }
  .admin-bar ~ .map-cta-transfer { bottom: 70px; }
  .admin-bar ~ #btn-global-add { bottom: 130px; }
}
.admin-bar ~ .ui-container { padding-bottom: 44px; }
.admin-bar ~ #edit-help { bottom: 56px; }
@media (max-width: 900px) {
  .admin-bar { padding: 5px 8px; }
  .admin-bar-title { font-size: .68rem; }
  .admin-bar-btns a { padding: 3px 8px; font-size: .68rem; margin-left: 4px; }
  .admin-bar ~ #edit-help { width: 92vw; margin-left: -46vw; bottom: 52px; }
}
</style>
<div class="admin-bar">
<div class="admin-bar-title">MODO EDICIÓN ACTIVADO</div>
<div class="admin-bar-btns">
<a href="admin.php">Volver al Panel</a>
<a href="logout.php">Cerrar Sesión</a>
</div>
</div>
<?php endif; ?>
</head>
<body>
<!-- INTRO -->
<div id="intro-screen">
<div id="intro-bg"></div>
<canvas id="intro-canvas"></canvas>
<div id="clouds"><div class="cloud c1"></div><div class="cloud c2"></div><div class="cloud c3"></div><div class="cloud c4"></div><div class="cloud c5"></div><div class="cloud c6"></div></div>
<div id="intro-vignette"></div>
<div class="intro-content">
<div class="intro-logo-wrap"><div class="logo-ring"></div><img class="intro-logo js-logo" alt="FiliTour"></div>
<div class="intro-tag" data-txt="intro_tag">PANAMÁ TOURISM</div>
<div class="intro-line"></div>
</div>
</div>
<canvas id="wind-canvas"></canvas>
<canvas id="warp-canvas"></canvas>
<!-- MAPA -->
<div id="map-container"></div>
<div id="map-tint"></div>
<div id="map-vignette"></div>
<!-- NAV -->
<nav class="top-nav glass-panel">
<div class="logo">
<img class="js-logo" alt="logo">
<div><span data-txt="logo_t">FiliTour</span><small data-txt="logo_s">Panamá Tourism</small></div>
</div>
<div class="nav-links" id="main-nav-links">
<a data-page="map" class="nav-map active" data-txt="nav_map">MAPA</a>
<a data-page="tours">PAQUETES</a>
<a data-page="beaches">PLAYAS</a>
<a data-page="services">TRASLADOS</a>
<a data-page="about">QUIÉNES SOMOS</a>
<a data-page="reviews" data-txt="nav_rev">RESEÑAS</a>
<a data-page="contact" data-txt="nav_contact">CONTACTO</a>
</div>
<div class="nav-actions">
<button class="nav-search-btn" id="nav-search-btn" aria-label="Buscar" title="Buscar">🔍</button>
<button class="hamburger-btn" id="mobile-menu-btn" aria-label="Menú"><span></span><span></span><span></span></button>
</div>
</nav>
<!-- 🔍 Barra de búsqueda global (se despliega con la lupita) -->
<div class="global-search-bar" id="global-search-bar">
<input class="glass-input tour-search-input" id="global-search-input" placeholder="🔍 Buscar paquetes, playas, experiencias...">
<button class="gsb-close" id="gsb-close" aria-label="Cerrar búsqueda">✖️</button>
</div>
<!-- REDES SOCIALES -->
<div class="social-dock">
<a data-social="instagram" data-label="Instagram" target="_blank" rel="noopener"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.2" cy="6.8" r="1.2" fill="currentColor" stroke="none"/></svg></a>
<a data-social="facebook" data-label="Facebook" target="_blank" rel="noopener"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M13.5 22v-8h2.7l.4-3.2h-3.1V8.7c0-.9.3-1.6 1.6-1.6h1.7V4.2c-.3 0-1.3-.1-2.5-.1-2.5 0-4.2 1.5-4.2 4.3v2.4H7.4V14h2.7v8z"/></svg></a>
<a data-social="tiktok" data-label="TikTok" target="_blank" rel="noopener"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M16.6 3c.4 2 1.8 3.5 3.9 3.7v3c-1.5 0-2.9-.5-3.9-1.3v6.1a5.9 5.9 0 1 1-5.9-5.9c.3 0 .7 0 1 .1v3.1a2.9 2.9 0 1 0 2 2.8V3z"/></svg></a>
<a data-social="youtube" data-label="YouTube" target="_blank" rel="noopener"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M23 8s-.2-1.6-.9-2.3c-.8-.9-1.7-.9-2.1-1-2.9-.2-8-.2-8-.2s-5.1 0-8 .2c-.4.1-1.3.1-2.1 1C1.2 6.4 1 8 1 8S.8 9.9.8 11.8v1.7C.8 15.4 1 17.3 1 17.3s.2 1.6.9 2.3c.8.9 1.9.8 2.4 1 1.7.2 7.7.2 7.7.2s5.1 0 8-.3c.4-.1 1.3-.1 2.1-1 .7-.7.9-2.3.9-2.3s.2-1.9.2-3.7v-1.7C23.2 9.9 23 8 23 8zM9.7 15.6V8.9l6.3 3.4z"/></svg></a>
<a data-social="whatsapp" data-label="WhatsApp" target="_blank" rel="noopener"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 0A12 12 0 0 0 0 12a11.9 11.9 0 0 0 1.6 6L0 24l6.2-1.6A12 12 0 1 0 12 0zm0 21.8a9.8 9.8 0 0 1-5-1.4l-.4-.2-3.7 1 1-3.6-.2-.4a9.8 9.8 0 1 1 8.3 4.6zm5.4-7.4c-.3-.1-1.8-.9-2-1s-.5-.1-.7.1-.8 1-1 1.2-.4.2-.7.1a8 8 0 0 1-2.4-1.5 9 9 0 0 1-1.6-2c-.2-.3 0-.5.1-.6l.5-.6c.2-.2.2-.3.3-.5s0-.4 0-.5-.7-1.6-.9-2.2-.5-.5-.7-.5h-.6a1.1 1.1 0 0 0-.8.4 3.4 3.4 0 0 0-1 2.5 5.9 5.9 0 0 0 1.2 3.1 13.2 13.2 0 0 0 5 4.4c.7.3 1.2.5 1.6.6a3.9 3.9 0 0 0 1.8.1 2.9 2.9 0 0 0 1.9-1.3 2.3 2.3 0 0 0 .2-1.3c-.1-.1-.3-.2-.6-.4z"/></svg></a>
</div>
<button id="toggle-ui-btn" title="Ocultar interfaz">👁️‍🗨️</button>
<!-- TOPS Y BOTONES FLOTANTES MAPA -->
<div class="ui-container">
<div class="main-content">
<aside class="sidebar-left" id="featured-list"></aside>
</div>
</div>
<button id="explore-toggle">🏕️ Explorar sin TOPS</button>
<button class="map-cta-transfer" id="btn-map-transfer" title="Reserva tu traslado">
<span class="mcta-icon">🚐</span>
<div class="mcta-text">Reserva tu<br><b>Traslado</b></div>
</button>
<!-- PÁGINA: PAQUETES -->
<div class="page-view" id="page-tours"><div class="page-inner">
<div class="page-header"><div>
<h2><span class="t-base" data-txt="paq_h1">Nuestros</span> <span data-txt="paq_h2">Paquetes Turísticos</span></h2>
<p data-txt="desc_paquetes">Descubre la esencia de Panamá con nuestros paquetes diseñados para brindarte momentos inolvidables. Sumérgete en nuestra cultura, relájate en paraísos tropicales y vive la aventura que siempre soñaste con el mejor servicio.</p>
</div></div>
<div id="tours-content"></div>
<div class="tours-carousel-nav">
<button class="tf-nav-btn" id="tours-scroll-left" aria-label="Anterior">⬅️</button>
<div class="tf-dots" id="tours-dots"></div>
<button class="tf-nav-btn" id="tours-scroll-right" aria-label="Siguiente">➡️</button>
</div>
<div class="tf-swipe-hint center tours-hint">👉 Desliza para ver más paquetes</div>
</div></div>
<!-- PÁGINA: PLAYAS -->
<div class="page-view" id="page-beaches"><div class="page-inner">
<div class="page-header"><div>
<h2><span class="t-base" data-txt="playas_h1">Paraísos de</span> <span data-txt="playas_h2">Playa</span></h2>
<p data-txt="playas_p">Te llevamos a las playas más hermosas de Panamá. Arena blanca, aguas turquesas y relajación total.</p>
</div></div>
<div class="beach-section" id="beach-section">
<div class="beach-head">
<h3>🏖️ Playas de Panamá</h3>
<small>Elige tu playa · te cotizamos el traslado por WhatsApp</small>
<div class="tf-dest-nav">
<button class="tf-nav-btn" id="beach-scroll-left" aria-label="Anterior">⬅️</button>
<div class="tf-dots" id="beach-dots"></div>
<button class="tf-nav-btn" id="beach-scroll-right" aria-label="Siguiente">➡️</button>
</div>
</div>
<div class="tf-dest-scroller beach-scroller" id="beaches-scroller"></div>
<div class="tf-swipe-hint center">👉 Desliza o usa ⬅️ ➡️ para ver más playas</div>
</div>
</div></div>
<!-- PÁGINA: TRASLADOS (slides estilo PowerPoint) -->
<div class="page-view" id="page-services"><div class="page-inner">
<div class="page-header"><div>
<h2><span class="t-base" data-txt="trans_h1">Traslados</span> <span data-txt="trans_h2">Privados</span></h2>
<p data-txt="desc_traslados">Transporte privado desde el Aeropuerto de Tocumen a todos los hoteles de Panamá y a cualquier lugar turístico del país. Ida y vuelta. La tarifa se cotiza al reservar y se confirma por WhatsApp.</p>
</div></div>
<div class="tf-dest-section">
<div class="tf-dest-head">
<h3>📍 ¿A dónde te llevamos?</h3>
<div class="tf-dest-nav">
<button class="tf-nav-btn" id="tf-scroll-left" aria-label="Anterior">⬅️</button>
<div class="tf-dots" id="tf-dots"></div>
<button class="tf-nav-btn" id="tf-scroll-right" aria-label="Siguiente">➡️</button>
</div>
</div>
<div class="tf-slide-layout">
<div class="tf-dest-scroller tf-slides" id="transfer-destinations-grid"></div>
<aside class="tf-cta-card">
<span class="tf-cta-emoji">🚐</span>
<h3>Tu traslado privado, sin estrés y con precio cerrado</h3>
<p class="tf-cta-human" data-txt="desc_tf_cta">Te recogemos puntual, te ayudamos con el equipaje y te llevamos directo a tu destino. Tú solo preocúpate por disfrutar Panamá.</p>
<button class="tf-cta-mini pulse" id="book-transfer-btn">🚐 RESERVA TU TRASLADO 🚐</button>
<small>📱 Cotización en minutos por WhatsApp</small>
<span class="tf-swipe-hint">👉 Desliza o usa ⬅️ ️ para ver más rutas</span>
</aside>
</div>
</div>
<div class="transfer-showcase" id="services-content"></div>
</div></div>
<!-- PÁGINA: QUIÉNES SOMOS -->
<div class="page-view" id="page-about"><div class="page-inner">
<div class="page-header"><div><h2><span class="t-base" data-txt="hist_h1">Nuestra</span> <span data-txt="hist_h2">Historia</span></h2><p data-txt="desc_historia">Más que una agencia, tu familia en Panamá.</p></div></div>
<div class="glass-panel about-intro" style="text-align: center;">
<h3 style="margin-top:0; color:var(--primary);" data-txt="desc_historia_titulo">¡Hola! Somos FiliTour 👋</h3>
<p style="margin-bottom:0;" data-txt="desc_historia_texto">Creemos que viajar no debería ser estresante. Nuestra misión es que te sientas como en casa desde el momento en que llegas al aeropuerto hasta que tomas tu vuelo de regreso. Con nosotros, tienes la garantía de un servicio VIP, guías apasionados y logística impecable.</p>
</div>
<div class="about-badges">
<span>✅ +5 años de experiencia</span>
<span>🚐 Flota propia con A/C</span>
<span>🎓 Guías certificados</span>
<span>⭐ Trato familiar</span>
<span>🔒 Reservas seguras</span>
</div>
<div class="transfer-showcase" id="about-blocks-container"></div>
</div></div>
<!-- PÁGINA: RESEÑAS -->
<div class="page-view" id="page-reviews"><div class="page-inner">
<div class="page-header"><div><h2><span class="t-base" data-txt="rev_h1">Lo que dicen</span> <span data-txt="rev_h2">nuestros clientes</span></h2><p data-txt="rev_p">Experiencias reales de viajeros que confiaron en nosotros.</p></div></div>
<div class="reviews-wrap">
<div>
<div class="rev-avg"><span>PROMEDIO GENERAL</span> <b id="rev-avg">⭐ 4.9</b></div>
<div class="rev-stats" id="rev-stats"></div>
<div class="review-form glass-panel">
<h3 data-txt="rev_form">Deja tu reseña ✍️</h3>
<select id="rev-tour" class="glass-input"></select>
<input id="rev-name" class="glass-input" placeholder="Tu nombre">
<div class="stars" id="rev-stars"><span data-v="1">⭐</span><span data-v="2">⭐</span><span data-v="3">⭐</span><span data-v="4">⭐</span><span data-v="5">⭐</span></div>
<textarea id="rev-text" class="glass-input" rows="3" placeholder="Cuéntanos tu experiencia..."></textarea>
<button id="rev-submit" class="btn-primary">PUBLICAR RESEÑA ⭐</button>
</div>
</div>
<div id="review-list"></div>
</div>
</div></div>
<!-- PÁGINA: CONTACTO -->
<div class="page-view" id="page-contact"><div class="page-inner">
<div class="page-header"><div><h2><span class="t-base" data-txt="contact_h1">Contáct</span> <span data-txt="contact_h2">anos</span></h2><p data-txt="contact_p">Escríbenos por el canal que prefieras.</p></div></div>
<div class="contact-grid">
<div class="contact-card glass-panel"><span class="c-emoji">📱</span><b data-txt="c1t">WhatsApp</b><span data-txt="c1v">+507 6000-0000</span><small data-txt="c1n">Respuesta rápida 7/7</small></div>
<div class="contact-card glass-panel"><span class="c-emoji">📧</span><b data-txt="c2t">Email</b><span data-txt="c2v">bookings@panamaluxury.pa</span></div>
<div class="contact-card glass-panel"><span class="c-emoji">📍</span><b data-txt="c3t">Oficina</b><span data-txt="c3v">Costa del Este, Ciudad de Panamá</span></div>
<div class="contact-card glass-panel"><span class="c-emoji">🕒</span><b data-txt="c4t">Horario</b><span data-txt="c4v">Lun-Sáb 8:00-18:00</span></div>
</div>
<div class="review-form glass-panel contact-form">
<h3 data-txt="contact_form">Envíanos un mensaje 📩</h3>
<input id="contact-name" class="glass-input" placeholder="Nombre">
<textarea id="contact-msg" class="glass-input" rows="4" placeholder="Mensaje"></textarea>
<div class="send-btns">
<button id="contact-wa">📱 Enviar WhatsApp</button>
<button id="contact-mail">📧 Enviar Email</button>
<button id="contact-book">📅 Hacer reserva</button>
</div>
</div>
</div></div>
<!-- MODAL MEDIA -->
<div class="modal-overlay" id="media-modal">
<div class="modal-box glass-panel">
<button class="modal-close" data-close="media-modal">✖️</button>
<div class="modal-scroll-area">
<div class="media-stage">
<div class="media-carousel" id="media-carousel">
<div class="media-track" id="media-track"></div>
<button class="gal-nav gal-prev">⬅️</button>
<button class="gal-nav gal-next">➡️</button>
<div class="gal-dots" id="media-dots"></div>
<div class="gal-counter" id="media-counter">1/1</div>
<button class="zoom-hint" id="zoom-hint">🔍 Ampliar</button>
</div>
</div>
<div class="media-info">
<h3 id="media-title"></h3>
<div class="subtitle" id="media-sub"></div>
<div id="media-pkg" class="rel-row"></div>
<div id="media-rel" class="rel-row"></div>
<p id="media-desc"></p>
<div class="media-extra" id="media-includes"></div>
<div class="media-hist" id="media-hist"></div>
<div class="media-meta"><span id="media-rating"></span><span id="media-duration"></span><span class="price" id="media-price"></span></div>
<div class="media-actions">
<button class="btn-primary" id="media-book">RESERVAR 📅</button>
<button class="btn-ghost" id="media-video-btn">🎥 VIDEO</button>
<button class="btn-ghost" id="media-map">🗺️ Mapa</button>
</div>
</div>
</div>
</div>
</div>
<!-- MODAL VIDEO -->
<div class="modal-overlay" id="video-modal">
<div class="modal-box glass-panel">
<button class="modal-close" data-close="video-modal">✖️</button>
<div class="video-stage" id="video-modal-container"></div>
</div>
</div>
<!-- LIGHTBOX -->
<div id="lightbox"><img id="lightbox-img" src="" alt=""></div>
<!-- MODAL RESERVA (paquetes / playas) -->
<div class="modal-overlay" id="booking-modal">
<div class="modal-box glass-panel">
<button class="modal-close" data-close="booking-modal">✖️</button>
<div class="modal-scroll-area">
<div class="booking-stage">
<img id="booking-img" src="" alt="">
<span class="stage-caption" id="booking-stage-caption"></span>
</div>
<div class="booking-info">
<div id="book-form-view">
<h2>Tu Reserva</h2>
<p class="modal-note">Precio automático 💰 En playas y traslados el precio se cotiza por WhatsApp.</p>
<div class="form-row" id="exp-select-row"><label>ELEGIR EXPERIENCIA</label><select id="book-exp-select" class="glass-input"></select></div>
<h3 id="booking-title-display"></h3>
<div class="subtitle" id="booking-sub-display"></div>
<div class="form-grid">
<div class="form-row"><label>ADULTOS ($ <span id="book-price-label">0</span>)</label>
<div class="stepper"><button class="step-btn" data-step="adults,-1">➖</button><span class="step-val" id="book-adults">2</span><button class="step-btn" data-step="adults,1">➕</button></div>
</div>
<div class="form-row"><label>NIÑOS ($ <span id="book-child-label">0</span>)</label>
<div class="stepper"><button class="step-btn" data-step="children,-1">➖</button><span class="step-val" id="book-children">0</span><button class="step-btn" data-step="children,1">➕</button></div>
</div>
<div class="form-row"><label>ADULTOS MAYORES ($ <span id="book-senior-label">0</span>)</label>
<div class="stepper"><button class="step-btn" data-step="seniors,-1">➖</button><span class="step-val" id="book-seniors">0</span><button class="step-btn" data-step="seniors,1">➕</button></div>
</div>
<div class="form-row"><label>FECHA</label><input type="date" id="book-date" class="glass-input"></div>
<div class="form-row"><label>HORA</label><input type="time" id="book-time" class="glass-input"></div>
<div class="form-row full"><label>INTERESES</label>
<div class="tags" id="book-tags"><span class="tag">CULTURA</span><span class="tag">HISTORIA</span><span class="tag">PLAYA</span><span class="tag">NATURALEZA</span><span class="tag">AVENTURA</span><span class="tag">COMIDA</span></div>
</div>
<div class="form-row full"><label>NOMBRE COMPLETO</label><input id="book-name" class="glass-input"></div>
<div class="form-row"><label>EMAIL</label><input id="book-email" type="email" class="glass-input"></div>
<div class="form-row"><label>PAÍS DE ORIGEN</label><input id="book-country" type="text" class="glass-input" placeholder="Ej: Colombia, Estados Unidos..." maxlength="50"></div>
<div class="form-row full"><label>NOTAS / PLAYA O DESTINO DESEADO (OPCIONAL)</label><textarea id="book-notes" class="glass-input" rows="2" placeholder="Ej: playa deseada, vuelo de llegada, solicitudes especiales..."></textarea></div>
</div>
<div class="booking-actions">
<div class="total-bar"><span>TOTAL</span><strong id="book-total">$0</strong></div>
<button id="book-submit" class="btn-primary">CONFIRMAR RESERVA ✅ 📩</button>
</div>
</div>
<div id="book-success">
<div class="check">✅</div>
<h3>¡Reserva Recibida!</h3>
<p id="success-detail"></p>
<div class="send-btns"><button id="send-wa">📱 WhatsApp</button><button id="send-mail">📧 Email</button></div>
</div>
</div>
</div>
</div>
</div>
<!-- MODAL TRASLADO (dirección completa; sin precio) -->
<div class="modal-overlay" id="transfer-modal">
<div class="modal-box glass-panel">
<button class="modal-close" data-close="transfer-modal">✖️</button>
<div class="modal-scroll-area">
<div class="booking-stage tf-stage">
<span class="tf-stage-emoji">🚐</span>
<span class="stage-caption">Traslado privado · Panamá</span>
</div>
<div class="booking-info">
<div id="transfer-form-view">
<h2>Reserva tu Traslado</h2>
<p class="modal-note">Transporte privado · Conductor profesional · Tarifa se cotiza al reservar</p>
<div class="form-grid">
<div class="form-row full"><label>TIPO DE VIAJE</label>
<div class="tf-trip-row">
<button class="btn-ghost trip-type-btn active" data-trip="one_way">➡️ Solo Ida</button>
<button class="btn-ghost trip-type-btn" data-trip="round_trip">🔄 Ida y Vuelta</button>
</div>
</div>
<div class="form-row full"><label>PUNTO DE ORIGEN (dirección completa)</label>
<input id="tf-origin-address" class="glass-input" placeholder="Ej: Aeropuerto de Tocumen, Terminal 1 / Hotel Bristol, Av. Central...">
</div>
<div class="form-row full"><label>PUNTO DE DESTINO (dirección completa)</label>
<input id="tf-dest-address" class="glass-input" placeholder="Ej: Hotel Santa María, Costa del Este / Playa Blanca, Farallón...">
<small class="tf-field-hint">Cualquier hotel o lugar turístico del país, accesible por carretera.</small>
</div>
<div class="form-row"><label>FECHA DE RECOGIDA</label><input type="date" id="tf-date" class="glass-input"></div>
<div class="form-row"><label>HORA DE RECOGIDA</label><input type="time" id="tf-time" class="glass-input" value="08:00"></div>
<div class="form-row full" id="tf-return-row" hidden>
<label>FECHA Y HORA DE RETORNO</label>
<div class="tf-trip-row">
<input type="date" id="tf-return-date" class="glass-input">
<input type="time" id="tf-return-time" class="glass-input" value="18:00">
</div>
</div>
<div class="form-row"><label>ADULTOS</label>
<div class="stepper"><button class="step-btn" data-tfstep="adults,-1">➖</button><span class="step-val" id="tf-adults">2</span><button class="step-btn" data-tfstep="adults,1">➕</button></div>
</div>
<div class="form-row"><label>NIÑOS</label>
<div class="stepper"><button class="step-btn" data-tfstep="kids,-1">➖</button><span class="step-val" id="tf-kids">0</span><button class="step-btn" data-tfstep="kids,1">➕</button></div>
</div>
<div class="form-row"><label>ADULTOS MAYORES</label>
<div class="stepper"><button class="step-btn" data-tfstep="seniors,-1">➖</button><span class="step-val" id="tf-seniors">0</span><button class="step-btn" data-tfstep="seniors,1">➕</button></div>
</div>
<div class="form-row"><label>MALETAS / EQUIPAJE</label>
<div class="stepper"><button class="step-btn" data-tfstep="bags,-1">➖</button><span class="step-val" id="tf-bags">2</span><button class="step-btn" data-tfstep="bags,1">➕</button></div>
</div>
<div class="form-row full"><label>NOMBRE COMPLETO DE QUIEN RESERVA</label><input id="tf-name" class="glass-input"></div>
<div class="form-row"><label>PAÍS DE ORIGEN</label><input id="tf-country" type="text" class="glass-input" placeholder="Ej: Colombia, Estados Unidos..." maxlength="50"></div>
<div class="form-row"><label>EMAIL</label><input id="tf-email" type="email" class="glass-input"></div>
<div class="form-row full"><label>NOTAS ADICIONALES</label><textarea id="tf-notes" class="glass-input" rows="2" placeholder="Vuelo de llegada, instrucciones especiales..."></textarea></div>
</div>
<div class="booking-actions">
<div class="tf-quote-bar"><span>TARIFA</span><strong>Se cotiza al confirmar 📱</strong></div>
<p class="tf-quote-note">Cada traslado tiene una tarifa según distancia y pasajeros. Al reservar, te enviamos el precio exacto por WhatsApp.</p>
<button id="tf-submit" class="btn-primary pulse">CONFIRMAR TRASLADO 🚐</button>
</div>
</div>
<div id="transfer-success">
<div class="check">✅</div>
<h3>¡Traslado Registrado!</h3>
<p id="tf-success-detail"></p>
<div class="send-btns">
<button id="tf-send-wa">📱 WhatsApp</button>
<button id="tf-send-mail">📧 Email</button>
</div>
</div>
</div>
</div>
</div>
</div>
<?php if ($isAdmin): ?>
<!-- ZONA CMS (solo si hay sesión) — NO TOCAR, funciona perfecto -->
<button id="edit-mode-btn">✏️ Editar CMS</button>
<button id="btn-global-add">➕ Añadir Nuevo Contenido</button>
<div id="edit-help"></div>
<div class="modal-overlay" id="admin-modal">
<div class="modal-box glass-panel cms-box">
<button class="modal-close" data-close="admin-modal" onclick="document.getElementById('admin-modal').classList.remove('active');">✖️</button>
<div class="modal-scroll-area cms-scroll">
<h2>⚙️ Editor de Contenido (CMS)</h2>
<div class="form-row"><label>SELECCIONA QUÉ DESEAS EDITAR/AGREGAR:</label>
<select id="cms-module-selector" class="glass-input">
<option value="tours">🗺️ Tours, Destinos y Paquetes</option>
<option value="services">🚐 Traslados (Bloques informativos)</option>
<option value="about">👥 Quiénes Somos (Añadir Bloque)</option>
<option value="transfers">🚐 Traslados - Editar</option>
<option value="transfers_new">➕ Traslados - CREAR NUEVO</option>
<option value="beaches">🏖️ Playas - Editar</option>
<option value="beaches_new">➕ Playas - CREAR NUEVA</option>
</select>
</div>
<div id="cms-module-tours" class="form-grid">
<input type="hidden" id="add-id">
<div class="form-row"><label>NOMBRE</label><input id="add-name" class="glass-input"></div>
<div class="form-row"><label>SUBTÍTULO</label><input id="add-sub" class="glass-input"></div>
<div class="form-row"><label>TIPO</label><select id="add-type" class="glass-input"><option value="lugar">📍 Lugar (parada)</option><option value="package">📦 Paquete</option></select></div>
<div class="form-row" id="row-pin-size"><label>TAMAÑO PIN (px)</label><input id="add-pin-size" type="number" class="glass-input" value="48"></div>
<div class="form-row"><label>ZONA</label><select id="add-zone" class="glass-input"></select>
<div class="inline-create" id="row-new-zone" hidden><input id="new-zone-emoji" class="glass-input" placeholder="Emoji"><input id="new-zone-name" class="glass-input" placeholder="Nombre"><input id="new-zone-desc" class="glass-input" placeholder="Descripción"><button id="btn-create-zone" class="btn-ghost">Crear</button></div>
</div>
<div class="form-row"><label>ESTILO</label><select id="add-style" class="glass-input"></select>
<div class="inline-create" id="row-new-style" hidden><input id="new-style-emoji" class="glass-input" placeholder="Emoji"><input id="new-style-name" class="glass-input" placeholder="Nombre"><button id="btn-create-style" class="btn-ghost">Crear</button></div>
</div>
<div class="form-row"><label>PRECIO ADULTO ($)</label><input id="add-price" type="number" class="glass-input" value="55"></div>
<div class="form-row"><label>PRECIO NIÑO ($)</label><input id="add-price-child" type="number" class="glass-input" value="28"></div>
<div class="form-row"><label>PRECIO ADULTO MAYOR ($)</label><input id="add-price-senior" type="number" class="glass-input" value="28"></div>
<div class="form-row"><label>PRECIO ANTES ($)</label><input id="add-oldprice" type="number" class="glass-input"></div>
<div class="form-row"><label>DURACIÓN</label><input id="add-duration" class="glass-input" placeholder="Ej: 8h"></div>
<div class="form-row"><label>EMOJI</label><input id="add-emoji" class="glass-input" value="🌴"></div>
<div class="form-row full"><label>IMAGEN PRINCIPAL (URL)</label>
<input id="add-img" class="glass-input" placeholder="https://... (URL de la imagen principal)">
</div>
<div class="form-row full" id="row-places" hidden>
<label>LUGARES EN ESTE PAQUETE</label>
<div style="display:flex; gap:10px; margin-bottom:12px;">
<select id="existing-places-select" class="glass-input"></select>
<button type="button" class="btn-ghost" id="btn-add-existing" style="white-space:nowrap;">➕ Añadir lugar</button>
</div>
<div id="add-places-container" class="tags"></div>
</div>
<div class="form-row full"><label>➕ CREAR LUGARES NUEVOS (ilimitado)</label>
<div id="add-places-builder"></div>
<button type="button" class="btn-ghost" id="btn-add-place">➕ Agregar lugar al paquete</button>
</div>
<div class="form-row full"><label>VIDEO (solo URL)</label><input id="add-video" class="glass-input"></div>
<div class="form-row full"><label>MINI DESCRIPCIÓN</label><input id="add-short-desc" class="glass-input"></div>
<div class="form-row full"><label>DESCRIPCIÓN COMPLETA</label><textarea id="add-desc" class="glass-input" rows="3"></textarea></div>
<div class="form-row full"><label>QUÉ INCLUYE (separado por comas)</label><input id="add-includes" class="glass-input"></div>
<div class="form-row full"><label>HISTORIA</label><input id="add-hist" class="glass-input"></div>
<div class="form-row full"><label class="check-label"><input type="checkbox" id="add-featured"> ⭐ Mostrar en TOPS</label></div>
</div>
<div id="cms-module-blocks" class="form-grid" hidden>
<div class="form-row full"><label>TÍTULO</label><input id="cms-block-title" class="glass-input"></div>
<div class="form-row full"><label>SUBTÍTULO (Opcional)</label><input id="cms-block-sub" class="glass-input"></div>
<div class="form-row full"><label>DESCRIPCIÓN</label><textarea id="cms-block-desc" class="glass-input" rows="3"></textarea></div>
<div class="form-row full"><label>🖼️ FOTO (solo URL pública)</label><input id="cms-block-img" class="glass-input" placeholder="https://..."></div>
<div class="form-row"><label>🖼️ POSICIÓN DE LA IMAGEN</label>
<select id="cms-block-img-position" class="glass-input"><option value="center">Centro</option><option value="top">Arriba</option><option value="bottom">Abajo</option><option value="left">Izquierda</option><option value="right">Derecha</option><option value="top left">Arriba-Izq</option><option value="top right">Arriba-Der</option><option value="bottom left">Abajo-Izq</option><option value="bottom right">Abajo-Der</option></select>
</div>
<div class="form-row"><label>🖼️ AJUSTE DE LA IMAGEN</label>
<select id="cms-block-img-fit" class="glass-input"><option value="cover">Cubrir (recorta)</option><option value="contain">Contener (completa)</option><option value="fill">Rellenar (deforma)</option><option value="none">Original</option></select>
</div>
</div>
<div id="cms-module-transfers" class="form-grid" hidden>
<p class="cms-hint full">Selecciona el traslado y actualiza sus datos:</p>
<div class="form-row full"><label>TRASLADO A EDITAR</label><select id="tf-edit-id" class="glass-input"></select></div>
<div class="form-row"><label>NOMBRE</label><input id="tf-edit-name" class="glass-input"></div>
<div class="form-row"><label>EMOJI</label><input id="tf-edit-emoji" class="glass-input"></div>
<div class="form-row full"><label>ORIGEN</label><input id="tf-edit-origin" class="glass-input"></div>
<div class="form-row full"><label>DESTINO</label><input id="tf-edit-dest" class="glass-input"></div>
<div class="form-row"><label>PRECIO SOLO IDA ($)</label><input type="number" id="tf-edit-oneway" class="glass-input" min="0" step="0.01"></div>
<div class="form-row"><label>PRECIO IDA Y VUELTA ($)</label><input type="number" id="tf-edit-roundtrip" class="glass-input" min="0" step="0.01"></div>
<div class="form-row full"><label>DESCRIPCIÓN</label><textarea id="tf-edit-desc" class="glass-input" rows="2"></textarea></div>
</div>
<div id="cms-module-transfers-new" class="form-grid" hidden>
<p class="cms-hint full">Crea una nueva ruta (aparece como slide nueva):</p>
<div class="form-row"><label>NOMBRE</label><input id="tf-new-name" class="glass-input" placeholder="Ej: Traslado a Boquete"></div>
<div class="form-row"><label>EMOJI</label><input id="tf-new-emoji" class="glass-input" value="🚐"></div>
<div class="form-row full"><label>ORIGEN</label><input id="tf-new-origin" class="glass-input" placeholder="Ej: Aeropuerto / Hotel"></div>
<div class="form-row full"><label>DESTINO</label><input id="tf-new-dest" class="glass-input" placeholder="Ej: Boquete, Chiriquí"></div>
<div class="form-row"><label>PRECIO SOLO IDA ($)</label><input type="number" id="tf-new-oneway" class="glass-input" min="0" step="0.01"></div>
<div class="form-row"><label>PRECIO IDA Y VUELTA ($)</label><input type="number" id="tf-new-roundtrip" class="glass-input" min="0" step="0.01"></div>
<div class="form-row full"><label>DESCRIPCIÓN</label><textarea id="tf-new-desc" class="glass-input" rows="2"></textarea></div>
</div>
<div id="cms-module-beaches" class="form-grid" hidden>
<p class="cms-hint full">Selecciona la playa y actualiza sus datos:</p>
<div class="form-row full"><label>PLAYA A EDITAR</label><select id="beach-edit-id" class="glass-input"></select></div>
<div class="form-row"><label>NOMBRE</label><input id="beach-edit-name" class="glass-input"></div>
<div class="form-row"><label>UBICACIÓN</label><input id="beach-edit-zone" class="glass-input"></div>
<div class="form-row"><label>EMOJI</label><input id="beach-edit-emoji" class="glass-input"></div>
<div class="form-row"><label>PRECIO ($)</label><input type="number" id="beach-edit-price" class="glass-input" min="0" step="0.01"></div>
<div class="form-row full"><label>IMAGEN (solo URL)</label><input id="beach-edit-img" class="glass-input" placeholder="https://..."></div>
<div class="form-row full"><label>DESCRIPCIÓN</label><textarea id="beach-edit-desc" class="glass-input" rows="2"></textarea></div>
</div>
<div id="cms-module-beaches-new" class="form-grid" hidden>
<p class="cms-hint full">Agrega una nueva playa:</p>
<div class="form-row"><label>NOMBRE</label><input id="beach-new-name" class="glass-input" placeholder="Ej: Playa Venao"></div>
<div class="form-row"><label>UBICACIÓN</label><input id="beach-new-zone" class="glass-input" placeholder="Ej: Pedasí, Los Santos"></div>
<div class="form-row"><label>EMOJI</label><input id="beach-new-emoji" class="glass-input" value="🏖️"></div>
<div class="form-row"><label>PRECIO ($)</label><input type="number" id="beach-new-price" class="glass-input" min="0" step="0.01" value="0"></div>
<div class="form-row full"><label>IMAGEN (solo URL)</label><input id="beach-new-img" class="glass-input" placeholder="https://..."></div>
<div class="form-row full"><label>DESCRIPCIÓN</label><textarea id="beach-new-desc" class="glass-input" rows="2"></textarea></div>
</div>
<div class="cms-actions">
<button id="btn-save-cms" class="btn-primary">GUARDAR CAMBIOS 💾</button>
<button id="btn-copy-section" class="btn-ghost">📋 Copiar esta sección</button>
</div>
</div>
</div>
</div>
<?php endif; ?>
<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/dompurify/3.0.6/purify.min.js"></script>
<script src="assets/js/api.js"></script>
<script src="assets/js/data.js?v=2"></script>
<script>
<?php
try {
    $db = \App\Config\Database::getInstance();
    $data_tours = $db->query("SELECT setting_value FROM settings WHERE setting_key = 'data_tours'")->fetchColumn();
    $data_beaches = $db->query("SELECT setting_value FROM settings WHERE setting_key = 'data_beaches'")->fetchColumn();
    if ($data_tours) echo "window.BACKEND_TOURS = $data_tours;\n";
    if ($data_beaches) echo "window.BACKEND_BEACHES = $data_beaches;\n";
    $data_transfers = $db->query("SELECT setting_value FROM settings WHERE setting_key = 'data_transfers'")->fetchColumn();
    if ($data_transfers) echo "window.BACKEND_TRANSFERS = $data_transfers;\n";
    $data_texts = $db->query("SELECT setting_value FROM settings WHERE setting_key = 'data_texts'")->fetchColumn();
    if ($data_texts) echo "window.BACKEND_TEXTS = $data_texts;\n";
    $data_services = $db->query("SELECT setting_value FROM settings WHERE setting_key = 'data_services'")->fetchColumn();
    if ($data_services) echo "window.BACKEND_SERVICES = $data_services;\n";
    $data_about = $db->query("SELECT setting_value FROM settings WHERE setting_key = 'data_about'")->fetchColumn();
    if ($data_about) echo "window.BACKEND_ABOUT = $data_about;\n";
    $data_zones = $db->query("SELECT setting_value FROM settings WHERE setting_key = 'data_zones'")->fetchColumn();
    if ($data_zones) echo "window.BACKEND_ZONES = $data_zones;\n";
    $data_styles = $db->query("SELECT setting_value FROM settings WHERE setting_key = 'data_styles'")->fetchColumn();
    if ($data_styles) echo "window.BACKEND_STYLES = $data_styles;\n";
    $data_social = $db->query("SELECT setting_value FROM settings WHERE setting_key = 'data_social'")->fetchColumn();
    if ($data_social) echo "window.BACKEND_SOCIAL = $data_social;\n";
} catch (Exception $e) {}
?>
</script>
<script src="assets/js/map.js"></script>
<script src="assets/js/forms.js"></script>
<?php if ($isAdmin): ?>
<input type="hidden" name="csrf_token" value="<?= \App\Security\Csrf::generate() ?>">
<script src="assets/js/cms.js?v=6"></script>
<?php endif; ?>
<script src="assets/js/app.js?v=7"></script>
<script>
// 🛠️ PATCH v4: restaura el clic en "LUGARES INCLUIDOS" y "EN ESTOS PAQUETES"
document.addEventListener('click', function (e) {
  var b = e.target.closest ? e.target.closest('[data-openplace]') : null;
  if (!b) return;
  e.stopPropagation();
  if (typeof openMedia === 'function') {
    openMedia(b.getAttribute('data-openplace'), b.getAttribute('data-parent') || null);
    var sc = document.querySelector('.media-info');
    if (sc) sc.scrollTop = 0;
  }
});
</script>
</body>
</html>


