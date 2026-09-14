<?php
namespace App\Security;

class Csrf {
 public static function generate() {
 if (session_status() === PHP_SESSION_NONE) session_start();
 if (empty($_SESSION['csrf_token'])) {
 $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
 }
 return $_SESSION['csrf_token'];
 }
 
 public static function verify($token) {
 if (session_status() === PHP_SESSION_NONE) session_start();
 if (empty($_SESSION['csrf_token']) || !hash_equals($_SESSION['csrf_token'], $token)) {
 http_response_code(403);
 die("Error de validación (CSRF).");
 }
 }
}

