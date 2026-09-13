<?php
require_once __DIR__ . '/../app/bootstrap.php';
\App\Security\Headers::apply();

header('Content-Type: application/json');

$input = json_decode(file_get_contents('php://input'), true) ?? [];
$action = $_GET['action'] ?? $input['action'] ?? '';

$response = \App\Controllers\ApiController::handle($action, $input);
echo json_encode($response);
