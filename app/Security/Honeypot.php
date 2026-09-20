<?php
namespace App\Security;

class Honeypot {
    private static $banFile = __DIR__ . '/../../storage/logs/banned_ips.json';

    public static function checkAndTrap() {
        $ip = Waf::getClientIp();
        
        // 1. Verificar si la IP ya está baneada
        if (file_exists(self::$banFile)) {
            $f = fopen(self::$banFile, 'r');
            flock($f, LOCK_SH);
            $content = stream_get_contents($f);
            flock($f, LOCK_UN);
            fclose($f);
            
            $banned = json_decode($content, true) ?: [];
            if (isset($banned[$ip])) {
                http_response_code(403);
                die("Access Denied (Honeypot Trap).");
            }
        }

        // 2. Verificar si la URL solicitada es una trampa (Honeypot URLs)
        $uri = $_SERVER['REQUEST_URI'] ?? '';
        
        // Archivos comunes que buscan los hackers/bots y que en nuestra app no existen o son trampa
        $trapUrls = [
            '/.env', 
            '/wp-login.php', 
            '/wp-admin', 
            '/config.php', 
            '/database.sql',
            '/admin-panel-secret' // Nuestra trampa personalizada
        ];

        foreach ($trapUrls as $trap) {
            if (strpos($uri, $trap) !== false) {
                self::banIp($ip, "Hit trap URL: $trap");
                http_response_code(403);
                die("Access Denied.");
            }
        }
    }

    private static function banIp($ip, $reason) {
        if (!file_exists(dirname(self::$banFile))) {
            mkdir(dirname(self::$banFile), 0777, true);
        }

        $f = fopen(self::$banFile, 'c+');
        if (flock($f, LOCK_EX)) {
            $content = stream_get_contents($f);
            $banned = json_decode($content ?: '[]', true) ?: [];
            
            if (!isset($banned[$ip])) {
                $banned[$ip] = [
                    'time' => time(),
                    'reason' => $reason
                ];
                ftruncate($f, 0);
                rewind($f);
                fwrite($f, json_encode($banned));
            }
            flock($f, LOCK_UN);
        }
        fclose($f);
    }
}

