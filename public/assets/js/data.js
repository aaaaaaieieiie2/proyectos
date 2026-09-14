// ============================================================================
// public/assets/js/data.js
// FASE 1 (PLANTILLA ESTÁTICA): TODOS LOS DATOS DE LA WEB
// Regla de oro: si el cliente pide cambiar textos, precios o rutas,
// se toca SOLO este archivo. La lógica vive en app.js.
// ============================================================================
'use strict';

// ── Interruptor de backend ───────────────────────────────────────────────────
// false = plantilla estática (doble clic, sin PHP ni BD). Guardados en memoria.
// true = conectado a api.php (Fase 2: BD + sesión + CSRF).
const BACKEND_ENABLED = true;

// ── Datos de contacto globales ───────────────────────────────────────────────
const COMPANY_WA = '50760000000'; // solo números, sin + ni espacios
const COMPANY_MAIL = 'bookings@panamaluxury.pa';
const LOGO_URL = 'assets/img/logo.png';

// ============================================================================
// [ BLOQUE 1 ] TOURS (lugar = parada interna | package = producto vendible)
// 📷 IMÁGENES: URLs públicas. 🎥 VIDEO: solo URL (YouTube/Vimeo/.mp4 público).
// ============================================================================
const INITIAL_TOURS = [
// ─── LUGARES (paradas) ───
{ "id": "lugar-canal", "type": "lugar", "zone": "ciudad", "style": "culture", "name": "Canal de Panamá", "sub": "ESCLUSAS DE MIRAFLORES", "emoji": "🚢", "img": "assets/img/canal.png", "imgs": ["assets/img/canal.png", "assets/img/mirador1.jpg", "assets/img/mirador.jpeg", "assets/img/miraflores.jpg"], "pinSize": 24, "video": "", "coords": [8.99369, -79.58839], "desc": "Una de las 7 maravillas del mundo moderno: barcos gigantes elevándose 26 metros en las esclusas de Miraflores.", "long": "Presencia el impresionante paso de barcos gigantes mientras se elevan y descienden 26 metros a través de las esclusas de Miraflores. Conocerás el funcionamiento de este coloso moderno y disfrutarás de una vista privilegiada de la operación.", "hist": "Inaugurado en 1914, acortó el viaje entre océanos de meses a horas.", "includes": [] },
{ "id": "lugar-casco", "type": "lugar", "zone": "ciudad", "style": "culture", "name": "Casco Viejo", "sub": "PATRIMONIO MUNDIAL UNESCO", "emoji": "🏛️", "img": "assets/img/casco.png", "imgs": ["assets/img/casco.png", "assets/img/casco1.jpeg", "assets/img/casco3.jpeg", "assets/img/casco4.jpeg"], "pinSize": 22, "video": "", "coords": [8.95034, -79.54659], "desc": "Explora el colonial Casco Antiguo y sus calles empedradas, balcones con flores e iglesias con siglos de historia.", "long": "Sumérgete en el encanto del histórico Casco Antiguo. Camina entre calles del siglo XVII, balcones llenos de flores e iglesias llenas de leyenda.", "hist": "Fundado en 1673, Patrimonio Mundial UNESCO desde 1997.", "includes": [] },
{ "id": "lugar-amador", "type": "lugar", "zone": "ciudad", "style": "culture", "name": "Calzada de Amador", "sub": "VISTA AL CANAL Y AL SKYLINE", "emoji": "🏝", "img": "assets/img/Amador.jpeg", "imgs": ["assets/img/Amador.jpeg"], "pinSize": 22, "video": "", "coords": [8.90786, -79.52265], "desc": "Bulevar costero que une cuatro islas con panorámicas del skyline panameño, el Puente de las Américas y el Canal.", "long": "Disfruta de un paseo único por la Calzada de Amador. Contempla los barcos que esperan para transitar por el canal y admira la colorida arquitectura del Biomuseo.", "hist": "Construida en 1913 con roca extraída durante las excavaciones del Canal de Panamá.", "includes": [] },
{ "id": "lugar-tornillo", "type": "lugar", "zone": "ciudad", "style": "culture", "name": "El Tornillo (F&F Tower)", "sub": "ÍCONO DE LA ARQUITECTURA PANAMEÑA", "emoji": "🏢", "img": "assets/img/tornillo.jpeg", "imgs": ["assets/img/tornillo.jpeg", "assets/img/tornillo2.jpeg", "assets/img/tornillo3.jpeg", "assets/img/tornillo4.jpg"], "pinSize": 22, "video": "", "coords": [8.95623, -79.53845], "desc": "El icónico rascacielos en espiral de 236 metros, símbolo del dinamismo y progreso de Panamá.", "long": "Descubre el centro financiero y admira El Tornillo, un ícono de 236 metros en espiral. Conoce sus secretos de diseño y captura las mejores fotos de la ciudad.", "hist": "Inaugurado en 2011, diseñado por Pinzón Lozano & Asociados. Reconocido entre los rascacielos más impactantes del mundo.", "includes": [] },
{ "id": "lugar-piscinas", "type": "lugar", "zone": "caribe", "style": "nature", "name": "Piscinas Naturales", "sub": "AGUAS CRISTALINAS DEL CARIBE", "emoji": "🏊", "img": "", "imgs": [], "pinSize": 22, "video": "", "coords": [9.54, -79.65], "desc": "Pozas naturales de agua cristalina formadas entre las rocas del litoral caribeño, perfectas para nadar y descansar.", "long": "Las piscinas naturales de la costa caribeña de Portobelo son refugios de agua tranquila rodeados de vegetación tropical. Un paraíso natural para disfrutar del Caribe en su estado más puro.", "hist": "Formaciones rocosas naturales que crean piscinas de aguas calmadas en la costa de Portobelo.", "includes": [] },
{ "id": "lugar-tunel", "type": "lugar", "zone": "caribe", "style": "culture", "name": "Túnel del Amor", "sub": "CANAL DEL AMOR — PORTOBELO", "emoji": "💚", "img": "", "imgs": [], "pinSize": 22, "video": "", "coords": [9.556, -79.655], "desc": "Paso secreto y mágico entre vegetación exuberante en las costas de Portobelo, conocido como el Túnel del Amor.", "long": "Un estrecho canal natural entre la vegetación selvática que crea un túnel de luz y sombra. Uno de los lugares más fotogénicos de la costa caribeña de Panamá.", "hist": "Formación natural en los manglares y vegetación costera de la bahía de Portobelo.", "includes": [] },
{ "id": "lugar-portobelo", "type": "lugar", "zone": "caribe", "style": "culture", "name": "Ruinas de Portobelo", "sub": "PATRIMONIO DE LA HUMANIDAD", "emoji": "⚓", "img": "", "imgs": [], "pinSize": 22, "video": "", "coords": [9.55427, -79.65103], "desc": "Fortalezas coloniales del siglo XVII declaradas Patrimonio de la Humanidad por la UNESCO. Historia viva del Caribe panameño.", "long": "Las ruinas de Portobelo son vestigios impresionantes de las fortalezas españolas construidas en el siglo XVII para proteger el Caribe. Declaradas Patrimonio de la Humanidad junto con San Lorenzo.", "hist": "Puerto colonial clave de la era española. Sus fortalezas y castillos fueron declarados Patrimonio de la Humanidad por la UNESCO en 1980.", "includes": [] },
{ "id": "lugar-monos", "type": "lugar", "zone": "caribe", "style": "nature", "name": "Isla de los Monos", "sub": "NATURALEZA Y VIDA SILVESTRE", "emoji": "🐒", "img": "", "imgs": [], "pinSize": 22, "video": "", "coords": [9.41, -79.80], "desc": "Pequeña isla habitada por monos capuchinos y tití en libertad. Una experiencia única de contacto con la naturaleza panameña.", "long": "Visita esta pintoresca isla donde monos capuchinos y tití viven en libertad. Una experiencia de contacto directo con la vida silvestre tropical del Caribe panameño.", "hist": "Isla natural del archipiélago del Caribe panameño, refugio de primates silvestres.", "includes": [] },
// ─── PAQUETES (productos vendibles) ───
{ "id": "pkg-citytour", "type": "package", "zone": "ciudad", "style": "culture", "name": "City Tour Panamá", "sub": "Los lugares más emblemáticos de la Ciudad de Panamá", "featured": true, "price": 3900, "oldPrice": 4300, "rating": 4.9, "votes": 45, "duration": "🕒 4h", "emoji": "📦", "img": "https://images.unsplash.com/photo-1540610410855-b4c8877b761c?q=80&w=1048&auto=format&fit=crop", "imgs": ["https://images.unsplash.com/photo-1540610410855-b4c8877b761c?q=80&w=1048&auto=format&fit=crop"], "pinSize": 52, "video": "", "coords": [8.97, -79.56], "places": ["lugar-canal", "lugar-casco", "lugar-amador", "lugar-tornillo"], "desc": "Visita el Canal de Panamá, recorre el Casco Viejo, disfruta la Calzada de Amador y captura El Tornillo. Todo en un solo día. 📸🇵🇦", "long": "Descubre los lugares más icónicos de la Ciudad de Panamá en un recorrido guiado y cómodo. Desde la maravilla de ingeniería del Canal hasta las calles coloniales del Casco Viejo, la brisa marina de la Calzada de Amador y la impresionante arquitectura de El Tornillo. Precio único por persona — transporte e ida y vuelta incluido.", "hist": "", "includes": ["Transporte privado con A/C", "Guía turístico certificado", "Almuerzo y frutas", "Bebidas", "Entradas incluidas", "Fotos de recuerdo"] },
{ "id": "pkg-embera", "type": "package", "zone": "montana", "style": "culture", "name": "Comarca Emberá-Wounaan", "sub": "Vive la magia ancestral en la selva del Darién", "featured": false, "price": 8500, "oldPrice": null, "rating": 5, "votes": 1, "duration": "🕒 Día completo", "emoji": "🌿", "img": "", "imgs": [], "pinSize": 52, "video": "", "coords": [9.41878, -79.01325], "places": [], "desc": "Navega en piragua por ríos selváticos, vive la cultura Emberá-Wounaan, degusta su gastronomía y lleva en tu piel la pintura de jagua. Una experiencia ancestral única.", "long": "Navega en piragua tradicional por ríos selváticos hasta el corazón de la comunidad Emberá-Wounaan. Disfruta de un caluroso recibimiento con música y danzas autóctonas, aprende el arte de sus artesanías en chunga y madera de cocobolo, degusta un almuerzo típico y decora tu piel con la tradicional pintura natural de jagua. Una inmersión cultural auténtica e inolvidable en plena naturaleza.", "hist": "Moldeados por la deidad Caragabí según la leyenda, los Emberá-Wounaan son los guardianes eternos de la selva del Darién. Cada trazo de jagua en su piel y cada ritmo de sus tambores rinden tributo a la naturaleza y a los espíritus del río, manteniendo viva una herencia ancestral que hoy comparten con el mundo.", "includes": ["Transporte terrestre y fluvial en piragua", "Guía turístico y comunitario", "Almuerzo tradicional", "Frutas frescas", "Presentación de danza ancestral", "Taller de artesanías", "Pintura corporal de jagua", "Entradas a la comarca", "Aportes a la comunidad"] },
{ "id": "pkg-portobelo", "type": "package", "zone": "caribe", "style": "nature", "name": "Portobelo & Caribe Mágico", "sub": "Piscinas Naturales · Túnel del Amor · Ruinas · Isla de los Monos", "featured": false, "price": 6500, "oldPrice": null, "rating": 4.8, "votes": 12, "duration": "🕒 Día completo", "emoji": "⚓", "img": "", "imgs": [], "pinSize": 52, "video": "", "coords": [9.555, -79.652], "places": ["lugar-piscinas", "lugar-tunel", "lugar-portobelo", "lugar-monos"], "desc": "Un día en el Caribe panameño: nada en piscinas naturales, cruza el Túnel del Amor, explora las Ruinas de Portobelo y conoce la Isla de los Monos.", "long": "Embárcate en un día completo por el Caribe más auténtico de Panamá. Comienza con las cristalinas Piscinas Naturales, cruza el mágico Túnel del Amor entre la vegetación, maravíllate con las Ruinas de Portobelo (Patrimonio UNESCO) y termina en la Isla de los Monos con primates silvestres. Todo con transporte privado y guía experto.", "hist": "", "includes": ["Transporte privado con A/C", "Guía turístico certificado", "Almuerzo", "Bebidas", "Entrada a Portobelo", "Seguro de viaje básico"] }
];

// ============================================================================
// [ BLOQUE 1B ] TRANSFERS — TRASLADO ÚNICO NACIONAL
// ✅ SIN Canal ni Valle como tarjetas separadas (pedido del cliente).
// ✅ SIN precio público: la tarifa se cotiza al reservar por WhatsApp.
// (price_one_way/round_trip quedan solo como referencia interna del CMS.)
// ============================================================================
const INITIAL_TRANSFERS = [
{ "id": "tf-nacional", "name": "Aeropuerto ↔ Hoteles en Ciudad de Panamá", "origin": "Aeropuerto de Tocumen", "destination": "Cualquier hotel en la ciudad", "price_one_way": 35, "price_round_trip": 65, "max_passengers": 8, "emoji": "🛬", "price_basis": "per_vehicle", "desc": "Traslado privado desde el Aeropuerto Internacional de Tocumen hasta la puerta de tu hotel en la ciudad. Sin esperas y con conductor profesional." },
{ "id": "tf-playas", "name": "Ciudad ↔ Playas y Resorts del Pacífico", "origin": "Ciudad de Panamá o Aeropuerto", "destination": "Playa Blanca, Coronado, Venao...", "price_one_way": 120, "price_round_trip": 200, "max_passengers": 8, "emoji": "🌴", "price_basis": "per_vehicle", "desc": "Te llevamos directo a tu resort o playa favorita en el Pacífico. Vehículos cómodos para ti y tu familia con todo el equipaje." },
{ "id": "tf-interior", "name": "Ciudad ↔ Provincias del Interior", "origin": "Ciudad de Panamá", "destination": "Boquete, Boca Chica, Santiago...", "price_one_way": 250, "price_round_trip": 450, "max_passengers": 8, "emoji": "🛣️", "price_basis": "per_vehicle", "desc": "Viajes largos al interior del país. Disfruta del paisaje mientras nosotros nos encargamos de conducir con total seguridad y confort." }
];

// ============================================================================
// [ BLOQUE 1C ] PLAYAS — LAS 5 MÁS VISITADAS DE PANAMÁ
// ============================================================================
const INITIAL_BEACHES = [
{ "id": "playa-bocas", "name": "Bocas del Toro — Playa Estrella", "zone": "Bocas del Toro", "emoji": "⭐", "duration": "🕒 Día completo (vuelo + lancha)", "img": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1200&auto=format&fit=crop", "desc": "Mar turquesa, cayos de arena blanca y las famosas estrellas de mar. El Caribe panameño en su máxima expresión." },
{ "id": "playa-islagrande", "name": "Isla Grande — Portobelo", "zone": "Colón", "emoji": "🏝️", "duration": "🕒 Día completo", "img": "https://images.unsplash.com/photo-1519046904884-53103b34b206?q=80&w=1200&auto=format&fit=crop", "desc": "Isla caribeña de aguas cálidas, arrecifes para snorkel y atardeceres dorados a poca distancia de la ciudad." },
{ "id": "playa-blanca", "name": "Playa Blanca — Farallón", "zone": "Coclé", "emoji": "🤍", "duration": "🕒 Día completo", "img": "https://images.unsplash.com/photo-1506929562872-bb421503ef21?q=80&w=1200&auto=format&fit=crop", "desc": "La playa de arena blanca más famosa del Pacífico: 3 km de arena finísima y mar calmado, ideal para familias." },
{ "id": "playa-contadora", "name": "Isla Contadora", "zone": "Archipiélago de las Perlas", "emoji": "🛥️", "duration": "🕒 Día completo (ferry)", "img": "https://images.unsplash.com/photo-1476673160081-cf065607f449?q=80&w=1200&auto=format&fit=crop", "desc": "La joya de las Perlas: 13 playas de arena perlada, aguas calmas y atardeceros de postal a 45 min en ferry." },
{ "id": "playa-venao", "name": "Playa Venao", "zone": "Pedasí, Los Santos", "emoji": "🏄", "duration": "🕒 Día completo", "img": "https://images.unsplash.com/photo-1471922694854-ff1b63b20054?q=80&w=1200&auto=format&fit=crop", "desc": "El paraíso del surf en Panamá: ola constante todo el año, ambiente joven y atardeceres dorados." }
];

// ============================================================================
// [ BLOQUE 2 ] TEXTOS EDITABLES (elementos con data-txt en el HTML)
// ============================================================================
const INITIAL_SITE_TEXTS = {
"intro_tag": "PANAMÁ TOURISM", "logo_t": "FiliTour", "logo_s": "Panamá Tourism",
"nav_map": "🗺️ MAPA", "nav_rev": "RESEÑAS", "nav_contact": "CONTACT",
"rev_h1": "Client", "rev_h2": "Reviews", "rev_form": "Deja tu reseña ✍️", "rev_avg": "PROMEDIO GENERAL",
"contact_h1": "Contact", "contact_h2": "Us", "contact_p": "Escríbenos por el canal que prefieras.", "contact_form": "Envíanos un mensaje 💌",
"c1t": "WhatsApp", "c1v": "+507 6000-0000", "c1n": "Respuesta rápida 7/7",
"c2t": "Email", "c2v": "bookings@panamaluxury.pa",
"c3t": "Oficina", "c3v": "Costa del Este, Ciudad de Panamá",
"c4t": "Horario", "c4v": "Lun–Sáb 8:00–18:00"
};

// ============================================================================
// [ BLOQUE 3 ] ZONAS DEL MAPA
// ============================================================================
const INITIAL_ZONES = [
{ "id": "ciudad", "name": "Ciudad y Canal", "emoji": "🏙️", "desc": "Historia, skyline y la maravilla del canal." },
{ "id": "caribe", "name": "Caribe", "emoji": "🏝️", "desc": "Aguas cristalinas, arena blanca y cultura viva." },
{ "id": "pacifico", "name": "Pacífico", "emoji": "🌊", "desc": "Islas, buceo y surf de clase mundial." },
{ "id": "montana", "name": "Selva y Montaña", "emoji": "⛰️", "desc": "Bosques nubosos, volcán y naturaleza pura." }
];

// ============================================================================
// [ BLOQUE 4 ] ESTILOS / CATEGORÍAS DE EXPERIENCIA
// ============================================================================
const INITIAL_STYLES = [
["all", "🌟 Todos"],
["beach", "🏖️ Playas e Islas"],
["nature", "🌿 Naturaleza"],
["culture", "🏛️ Cultura"],
["adventure", "⚡ Aventura"]
];

// ============================================================================
// [ BLOQUE 5 ] REDES SOCIALES (editables en modo edición haciendo clic)
// ============================================================================
const INITIAL_SOCIAL = {
"instagram": "https://instagram.com",
"facebook": "https://facebook.com",
"tiktok": "https://tiktok.com",
"youtube": "https://youtube.com",
"whatsapp": "https://wa.me/50760000000"
};

// ============================================================================
// [ BLOQUE 6 ] BLOQUES ZIG-ZAG DE TRASLADOS
// ✅ Vacíos por decisión del cliente: la información vieja se eliminó.
// Se agregan nuevos bloques desde el CMS (módulo "Traslados"), solo con URL.
// ============================================================================
const INITIAL_SERVICES = [];

// ============================================================================
// [ BLOQUE 7 ] BLOQUES DE QUIÉNES SOMOS
// ============================================================================
const INITIAL_ABOUT_BLOCKS = [
{ "title": "¿Quiénes Somos?", "subtitle": "Tu familia en Panamá", "desc": "Somos una agencia de turismo 100% panameña con más de 5 años de experiencia. Nacimos con una misión clara: que cada visitante no solo vea Panamá, sino que lo sienta, lo saboree y se enamore de él. Nos enorgullece ofrecer un trato cálido, casi familiar, donde tú solo te preocupas por disfrutar mientras nosotros nos encargamos de toda la logística.", "img": "assets/img/foto.jpeg", "imgPosition": "center", "imgFit": "cover" },
{ "title": "Nuestro Compromiso", "subtitle": "Seguridad, puntualidad y cero estrés", "desc": "Sabemos que tu tiempo de vacaciones es invaluable. Por eso, nuestros pilares son la puntualidad británica y la calidez latina. Todos nuestros vehículos cuentan con aire acondicionado, mantenimiento al día y conductores profesionales capacitados. Tu seguridad y confort son nuestra máxima prioridad desde que aterrizas hasta que regresas a casa.", "img": "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?q=80&w=1200&auto=format&fit=crop", "imgPosition": "center", "imgFit": "cover" },
{ "title": "¿Por qué elegir FiliTour?", "subtitle": "Experiencias a tu medida", "desc": "No hacemos tours aburridos ni rígidos. Adaptamos nuestras rutas a tu ritmo, ya sea que viajes en pareja, con niños pequeños o en un grupo grande de amigos. Conocemos los rincones secretos que no salen en las guías tradicionales y te llevamos a vivir experiencias auténticas, comiendo donde comen los locales y disfrutando sin aglomeraciones.", "img": "https://images.unsplash.com/photo-1533050487297-09b450131914?q=80&w=1200&auto=format&fit=crop", "imgPosition": "center", "imgFit": "cover" }
];

// ============================================================================
// [ BLOQUE 8 ] RESEÑAS SEMILLA (demostración)
// ============================================================================
const INITIAL_SEED_REVIEWS = [
{ "tour": "tf-nacional", "name": "Carlos M.", "stars": 5, "text": "Increíble servicio. Nos estaban esperando en el aeropuerto con un cartel, nos ayudaron con las maletas y el auto estaba súper frío. Nos dieron muchos tips para nuestro viaje.", "when": "Hace 2 días" },
{ "tour": "pkg-citytour", "name": "Ana R.", "stars": 5, "text": "Hicimos el City Tour con ellos y fue la mejor decisión. Nos llevaron al Canal justo cuando pasaba un barco inmenso. El guía sabe muchísimo de historia y fue muy paciente.", "when": "Hace 5 días" },
{ "tour": "pkg-portobelo", "name": "Luis G.", "stars": 5, "text": "El tour a Portobelo y las piscinas naturales superó mis expectativas. Todo muy bien organizado, el almuerzo delicioso y los paisajes de revista. 100% recomendados.", "when": "Hace 1 semana" },
{ "tour": "pkg-embera", "name": "María P.", "stars": 5, "text": "Una experiencia mágica e inolvidable con la tribu Emberá. Se nota que FiliTour trabaja de la mano con la comunidad con mucho respeto. Lloré al despedirme.", "when": "Hace 2 semanas" },
{ "tour": "playa-bocas", "name": "Sofía V.", "stars": 5, "text": "Fuimos a Playa Estrella y no tuvimos que preocuparnos por nada. Ellos armaron toda la logística de vuelos internos y lanchas. Cero estrés.", "when": "Hace 3 semanas" },
{ "tour": "lugar-casco", "name": "José T.", "stars": 4, "text": "Excelente trato. Son muy puntuales y los vehículos huelen súper bien. Te hacen sentir seguro en todo momento en una ciudad que no conoces.", "when": "Hace 1 mes" }
];