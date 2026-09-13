<?php
// Cargar siempre el núcleo del sistema y su seguridad
require_once __DIR__ . '/../app/bootstrap.php';

// Si ya está logueado, patada al panel de administración (No tiene por qué ver el login)
if (!empty($_SESSION['admin_logged_in'])) {
    header("Location: admin.php");
    exit;
}

$error = '';
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $user = trim($_POST['username'] ?? '');
    $pass = $_POST['password'] ?? '';
    $csrf = $_POST['csrf_token'] ?? '';
    
    if ($user && $pass) {
        // Enviar al controlador. Solo devolverá un string si hay error.
        $error = \App\Controllers\AuthController::login($user, $pass, $csrf);
    } else {
        $error = "Credenciales incorrectas.";
    }
}

// Generar token fresco para el formulario
$csrf_token = \App\Security\Csrf::generate();
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Filitour - Admin Login</title>
    <style>
        body { 
            box-sizing: border-box;
            font-family: system-ui, -apple-system, sans-serif; 
            background: linear-gradient(135deg, #f0f4f8 0%, #ffffff 50%, #fdf5e6 100%); 
            color: #334155; 
            display: flex; 
            align-items: center; 
            justify-content: center; 
            height: 100vh; 
            margin: 0; 
            padding: 1rem;
        }
        *, *::before, *::after { box-sizing: inherit; }
        .login-box { 
            background: #ffffff; 
            padding: 2.5rem; 
            border-radius: 12px; 
            /* Sombra neutra/fuerte, borde superior azul marino para darle peso */
            box-shadow: 0 10px 30px rgba(15, 23, 42, 0.1); 
            width: 100%; 
            max-width: 380px; 
            border-top: 5px solid #0f172a;
            border-bottom: 5px solid #ec4899; /* Toque estético rosa en la base */
        }
        .login-box h2 { 
            margin-top: 0; 
            text-align: center; 
            color: #0f172a; /* Azul marino intenso */
            margin-bottom: 2rem;
            letter-spacing: -0.5px;
        }
        .form-group { margin-bottom: 1.2rem; }
        label { display: block; margin-bottom: 0.5rem; font-size: 0.9rem; color: #475569; font-weight: 600;}
        input { 
            width: 100%; 
            padding: 0.75rem; 
            border: 1px solid #cbd5e1; 
            border-radius: 6px; 
            background: #f8fafc; 
            color: #1e293b; 
            box-sizing: border-box; 
            transition: all 0.3s;
        }
        input:focus { outline: none; border-color: #0284c7; box-shadow: 0 0 8px rgba(2, 132, 199, 0.2); background: #ffffff;}
        button { 
            width: 100%; 
            padding: 0.85rem; 
            /* Botón fuerte y varonil (Azul Océano) */
            background: linear-gradient(to right, #0369a1, #0284c7); 
            color: white; 
            border: none; 
            border-radius: 6px; 
            font-weight: bold; 
            cursor: pointer; 
            transition: 0.3s; 
            margin-top: 10px;
            box-shadow: 0 4px 15px rgba(2, 132, 199, 0.3);
        }
        button:hover { 
            background: linear-gradient(to right, #0f172a, #1e293b); 
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(15, 23, 42, 0.3);
        }
        .error { 
            background: #fef2f2; 
            color: #b91c1c; 
            padding: 0.75rem; 
            border-radius: 6px; 
            margin-bottom: 1.2rem; 
            font-size: 0.85rem; 
            text-align: center; 
            border: 1px solid #fca5a5; 
        }
    </style>
</head>
<body>
    <div class="login-box">
        <h2>🔐 Filitour Admin</h2>
        
        <?php if ($error): ?>
            <div class="error"><?= htmlspecialchars($error) ?></div>
        <?php endif; ?>
        
        <form method="POST" action="login.php">
            <!-- 🛡️ Token CSRF Oculto Obligatorio -->
            <input type="hidden" name="csrf_token" value="<?= htmlspecialchars($csrf_token) ?>">
            
            <div class="form-group">
                <label>Usuario</label>
                <input type="text" name="username" required autocomplete="off" placeholder="Ingresa tu usuario">
            </div>
            
            <div class="form-group">
                <label>Contraseña</label>
                <input type="password" name="password" required placeholder="••••••••">
            </div>
            
            <button type="submit">Ingresar al Panel</button>
        </form>
    </div>
</body>
</html>
