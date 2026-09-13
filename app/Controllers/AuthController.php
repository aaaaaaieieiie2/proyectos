<?php
namespace App\Controllers;

use App\Config\Database;
use App\Security\AntiBruteForce;
use App\Security\Csrf;

class AuthController {
    
    public static function login($username, $password, $csrf_token) {
        // 1. Validar el token CSRF (Protección contra envíos forzados desde otros sitios)
        Csrf::verify($csrf_token);
        
        // 2. Verificar el muro Anti-Fuerza Bruta ANTES de tocar la base de datos
        AntiBruteForce::checkLoginAttempt($username);
        
        // 3. Buscar usuario en la base de datos de manera segura (Prepared Statement)
        $db = Database::getInstance();
        $stmt = $db->prepare("SELECT id, password_hash FROM admins WHERE username = :user LIMIT 1");
        $stmt->execute([':user' => $username]);
        $admin = $stmt->fetch();
        
        // 4. Verificación ciega de credenciales
        if ($admin && password_verify($password, $admin['password_hash'])) {
            // Login exitoso: Limpiamos su historial de fallos
            AntiBruteForce::resetLoginAttempt($username);
            
            // 🛡️ PREVENCIÓN FIJACIÓN DE SESIÓN: Regenerar el ID de sesión
            session_regenerate_id(true);
            
            // Declaramos las variables de sesión del admin
            $_SESSION['admin_id'] = $admin['id'];
            $_SESSION['admin_logged_in'] = true;
            
            // Actualizar su última conexión
            $update = $db->prepare("UPDATE admins SET last_login = CURRENT_TIMESTAMP WHERE id = :id");
            $update->execute([':id' => $admin['id']]);
            
            header("Location: admin.php");
            exit;
        } else {
            // Login fallido: Aplicamos el castigo (Tarpitting y contadores)
            AntiBruteForce::recordFailedAttempt($username);
            
            // Mensaje estricto: Nunca decimos "Usuario no existe"
            return "Credenciales incorrectas.";
        }
    }
    
    // Función guardián para proteger las páginas privadas (admin.php)
    public static function checkAuth() {
        if (empty($_SESSION['admin_logged_in'])) {
            header("Location: login.php");
            exit;
        }
    }
    
    public static function logout() {
        session_unset();
        session_destroy();
        header("Location: login.php");
        exit;
    }
}

