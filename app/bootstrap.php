<?php
// =====================================================================
// BOOTSTRAP: El núcleo de la aplicación.
// Este archivo se cargará antes que cualquier otra cosa en tus scripts.
// =====================================================================

// 1. Autocargador ligero de clases (Así no necesitas incluir archivo por archivo manual)
spl_autoload_register(function ($class) {
 $prefix = 'App\\';
 $base_dir = __DIR__ . '/';
 $len = strlen($prefix);
 if (strncmp($prefix, $class, $len) !== 0) return;
 $relative_class = substr($class, $len);
 $file = $base_dir . str_replace('\\', '/', $relative_class) . '.php';
 if (file_exists($file)) require $file;
});

// 2. Cargar contraseñas ocultas
\App\Config\Env::load(__DIR__ . '/../.env');

// 3. 🛡️ ACTIVAR LA MURALLA DE SEGURIDAD OBLIGATORIA
// Todo script que inicie pasará por el filtro del WAF
\App\Security\Waf::check();
\App\Security\Headers::apply();
\App\Security\RateLimiter::check(100, 60); // Anti DoS Global (100 peticiones / minuto)

// 4. Iniciar Sesión de forma super estricta
if (session_status() === PHP_SESSION_NONE) {
 session_name('FILITOUR_SESSION');
 session_start([
 'cookie_httponly' => true, // JS no puede robar la sesión
 'cookie_samesite' => 'Strict', // Protege de CSRF pasivo
 'use_strict_mode' => true
 ]);
}

