<?php
require_once __DIR__ . '/../app/bootstrap.php';
\App\Security\Headers::apply();

header('Content-Type: application/json');

// Obtener acción primero para verificar si es pública
$action = $_GET['action'] ?? '';
if (empty($action)) {
 $input = json_decode(file_get_contents('php://input'), true) ?? [];
 $action = $input['action'] ?? '';
}

// 🔒 Solo admin puede escribir (excepto para 'visit' que es público)
$isPublicAction = ($action === 'visit');
if (!$isPublicAction && !isset($_SESSION['admin_logged_in'])) {
 http_response_code(403);
 echo json_encode(['status' => 'error', 'message' => 'Acceso denegado']);
 exit;
}

$input = json_decode(file_get_contents('php://input'), true) ?? [];

// 🛡️ Verificar token CSRF en TODAS las peticiones POST (excepto visit)
if ($_SERVER['REQUEST_METHOD'] === 'POST' && !$isPublicAction) {
 $csrf_token = $input['csrf_token'] ?? ($_GET['csrf_token'] ?? '');
 try {
 \App\Security\Csrf::verify($csrf_token);
 } catch (\Exception $e) {
 http_response_code(403);
 echo json_encode(['status' => 'error', 'message' => 'Token CSRF inválido o expirado. Recarga la página.']);
 exit;
 }
}

try {
 $response = \App\Controllers\ApiController::handle($action, $input);
 echo json_encode($response);
} catch (\Exception $e) {
 http_response_code(500);
 error_log("API Error: " . $e->getMessage());
 echo json_encode(['status' => 'error', 'message' => 'Error interno del servidor']);
}
