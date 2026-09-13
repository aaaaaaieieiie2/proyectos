<?php
namespace App\Config;

use PDO;
use PDOException;

class Database {
    private static $instance = null;
    
    public static function getInstance() {
        if (self::$instance === null) {
            // Nota: En Docker, el DB_HOST suele ser el nombre del contenedor ('db').
            // Si el código corre directo en XAMPP, el host suele ser '127.0.0.1'.
            $host = $_ENV['DB_HOST'] ?? '127.0.0.1';
            $port = $_ENV['DB_PORT'] ?? '3306';
            $db   = $_ENV['DB_NAME'] ?? 'filitour_db';
            $user = $_ENV['DB_USER'] ?? 'root';
            $pass = $_ENV['DB_PASS'] ?? '';
            
            $dsn = "mysql:host=$host;port=$port;dbname=$db;charset=utf8mb4";
            
            $options = [
                PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION, // Lanza excepciones que capturamos en error_log
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                // 🛡️ ANTI-SQL INJECTION ABSOLUTO: Obliga a MySQL a preparar la consulta real, no emulada.
                PDO::ATTR_EMULATE_PREPARES   => false, 
                // ⚡ OPTIMIZACIÓN DE CUELLO DE BOTELLA: Reusa la conexión a DB para que aguante ráfagas altas de tráfico.
                PDO::ATTR_PERSISTENT         => true   
            ];
            
            try {
                self::$instance = new PDO($dsn, $user, $pass, $options);
            } catch (PDOException $e) {
                // 🛡️ SILENCIO EN PRODUCCIÓN: NUNCA mostramos "Access denied for user", solo guardamos el log.
                error_log("Error DB: " . $e->getMessage());
                http_response_code(500);
                die("Error interno de conexión."); 
            }
        }
        return self::$instance;
    }
}
