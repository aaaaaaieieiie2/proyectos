<?php
namespace App\Security;

class Headers {
 public static function apply() {
 header("X-Frame-Options: DENY"); // Evita Clickjacking
 header("X-XSS-Protection: 1; mode=block"); // Anti XSS en navegadores antiguos
 header("X-Content-Type-Options: nosniff"); // Bloquea inyección MIME
 header("Referrer-Policy: strict-origin-when-cross-origin");
 header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
 header("Cache-Control: post-check=0, pre-check=0", false);
 header("Pragma: no-cache");
 // CSP Estricto adaptado a lo que usa tu front-end
 header("Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com https://unpkg.com https://translate.google.com https://translate.googleapis.com; style-src 'self' 'unsafe-inline' https://unpkg.com https://cdnjs.cloudflare.com https://translate.googleapis.com; img-src 'self' data: https:; connect-src 'self' https://cdnjs.cloudflare.com https://unpkg.com https://translate.googleapis.com; font-src 'self' data: https:; frame-src 'self' https://www.youtube.com https://player.vimeo.com https://www.instagram.com;");
 }
}

