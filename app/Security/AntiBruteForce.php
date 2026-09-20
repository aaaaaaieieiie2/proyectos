<?php
namespace App\Security;

class AntiBruteForce {
    // Configuración ajustada para que no te bloquee tan rápido en desarrollo
    private static $maxAttempts = 10;
    private static $lockoutTime = 300; // 5 minutos de bloqueo total

    /**
     * Verifica si el usuario/IP está bloqueado antes de procesar el login
     */
    public static function checkLoginAttempt($username) {
        $ip = Waf::getClientIp();
        // Generamos un hash único que combina la IP del atacante y el usuario atacado
        $hash = md5($ip . '_' . $username);
        
        $dir = __DIR__ . "/../storage/logs/bruteforce";
        if (!is_dir($dir)) mkdir($dir, 0755, true);
        
        $file = $dir . "/{$hash}.json";
        
        if (file_exists($file)) {
            $data = json_decode(file_get_contents($file), true);
            
            if (!empty($data) && isset($data['attempts']) && $data['attempts'] >= self::$maxAttempts) {
                $timePassed = time() - $data['last_attempt'];
                
                if ($timePassed < self::$lockoutTime) {
                    // Tarpitting: Retraso intencional para frustrar ataques de tiempo
                    sleep(2); 
                    http_response_code(403);
                    // NUNCA decir "Estás bloqueado", siempre mensaje genérico
                    die("Credenciales incorrectas."); 
                } else {
                    // Si ya pasó el tiempo de castigo, perdonamos y reseteamos
                    self::resetLoginAttempt($username);
                }
            }
        }
    }

    /**
     * Registra un intento fallido y penaliza
     */
    public static function recordFailedAttempt($username) {
        // Tarpitting: Penalización de 1 a 3 segundos de retraso por cada fallo.
        // Arruina completamente el rendimiento de herramientas como Hydra o BurpSuite.
        sleep(rand(1, 3)); 

        $ip = Waf::getClientIp();
        $hash = md5($ip . '_' . $username);
        $dir = __DIR__ . "/../storage/logs/bruteforce";
        if (!is_dir($dir)) mkdir($dir, 0755, true);
        
        $file = $dir . "/{$hash}.json";
        
        $data = [];
        if (file_exists($file)) {
            $data = json_decode(file_get_contents($file), true) ?? [];
        }
        if (empty($data)) {
            $data = ['attempts' => 0];
        }
        
        $data['attempts']++;
        $data['last_attempt'] = time();
        
        file_put_contents($file, json_encode($data), LOCK_EX);
    }

    /**
     * Limpia el registro una vez que el login es exitoso
     */
    public static function resetLoginAttempt($username) {
        $ip = Waf::getClientIp();
        $hash = md5($ip . '_' . $username);
        $file = __DIR__ . "/../storage/logs/bruteforce/{$hash}.json";
        
        if (file_exists($file)) {
            unlink($file);
        }
    }
}


