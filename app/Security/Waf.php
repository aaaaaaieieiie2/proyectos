<?php
namespace App\Security;

class Waf {
    public static function check() {
        $uri = $_SERVER['REQUEST_URI'] ?? '';
        // Capturamos POST, GET y Body JSON
        $payload = file_get_contents('php://input') . json_encode($_GET) . json_encode($_POST);
        
        // Patrones maliciosos (SQLi plana, XSS, Directory Traversal, Ejecución)
        $patterns = [
            '/(?:union\s+all\s+select|union\s+select)/i',
            '/(?:<script>|<\/script>)/i',
            '/(?:\.\.\/|\.\.\\\\)/', 
            '/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/', // Null bytes
            '/(?:base64_decode|eval\()/i'
        ];
        
        foreach ($patterns as $pattern) {
            if (preg_match($pattern, $uri) || preg_match($pattern, $payload)) {
                http_response_code(403);
                die("Bloqueado por política de seguridad."); // Mensaje genérico sin pistas
            }
        }
    }
    
    // Lee IP real (preparado para WAF externo)
    public static function getClientIp() {
        if (!empty($_SERVER['HTTP_X_FORWARDED_FOR'])) {
            $ips = explode(',', $_SERVER['HTTP_X_FORWARDED_FOR']);
            return trim($ips[0]);
        }
        return $_SERVER['REMOTE_ADDR'] ?? '0.0.0.0';
    }
}

