<?php
require_once __DIR__ . '/../app/bootstrap.php';

// Llamar al destructor de sesión del AuthController
\App\Controllers\AuthController::logout();
