<?php
namespace App\Security;

class RateLimiter {
 // Sistema simple de rate-limit basado en archivos (luego se puede escalar a Redis)
 public static function check($limit = 60, $seconds = 60) {
 $ip = Waf::getClientIp();
 $hash = md5($ip);
 
 // Crear carpeta si no existe
 $dir = __DIR__ . "/../storage/logs";
 if (!is_dir($dir)) mkdir($dir, 0755, true);
 
 $file = $dir . "/rate_{$hash}.json";
 
 $data = file_exists($file) ? json_decode(file_get_contents($file), true) : ['count' => 0, 'time' => time()];
 
 if (time() - $data['time'] > $seconds) {
 $data = ['count' => 1, 'time' => time()];
 } else {
 $data['count']++;
 if ($data['count'] > $limit) {
 http_response_code(429);
 die("Demasiadas peticiones.");
 }
 }
 file_put_contents($file, json_encode($data));
 }
}

