<?php
namespace App\Security;

class Waf {
    public static function check() {
        $uri = $_SERVER['REQUEST_URI'] ?? '';
        // Capturamos POST, GET y Body JSON
        $payload = file_get_contents('php://input') . json_encode($_GET) . json_encode($_POST);
        
        // Patrones avanzados (SQLi, XSS, LFI/RCE, Command Injection)
        $patterns = [
            // SQL Injection (Unión, subconsultas, comandos estructurados)
            '/(?:union\s+all\s+select|union\s+select|select\s+.*\s+from|insert\s+into\s+.*\s+values|update\s+.*\s+set|delete\s+from|drop\s+(?:table|database)|truncate\s+table|alter\s+table)/i',
            // SQL Injection (Evasión, Time-based, Boolean, comentarios)
            '/(?:waitfor\s+delay|pg_sleep|sleep\(|benchmark\(|@@version|information_schema|sysobjects)/i',
            '/(?:--\s|\/\*|\*\/|;.*?--)/', 
            // Cross-Site Scripting (XSS) y ejecución en cliente
            '/(?:<script.*?>|<\/script>|javascript:|onerror=|onload=|onmouseover=|document\.cookie|alert\()/i',
            // Local File Inclusion (LFI) y Directory Traversal
            '/(?:\.\.\/|\.\.\\\\|\/etc\/passwd|\/etc\/shadow|\/bin\/bash|\/bin\/sh|cmd\.exe|powershell)/i', 
            // Inyección de Comandos PHP y RCE
            '/(?:base64_decode\s*\(|eval\s*\(|system\s*\(|exec\s*\(|shell_exec\s*\(|passthru\s*\(|phpinfo\s*\()/i',
            // Caracteres nulos (evasión C-style)
            '/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/'
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
        if (!empty($_SERVER['HTTP_CF_CONNECTING_IP'])) {
            return $_SERVER['HTTP_CF_CONNECTING_IP'];
        }
        if (!empty($_SERVER['HTTP_X_FORWARDED_FOR'])) {
            $ips = explode(',', $_SERVER['HTTP_X_FORWARDED_FOR']);
            return trim($ips[0]);
        }
        return $_SERVER['REMOTE_ADDR'] ?? '0.0.0.0';
    }
}


