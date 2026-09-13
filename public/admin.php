<?php
require_once __DIR__ . '/../app/bootstrap.php';
\App\Controllers\AuthController::checkAuth();

// Lógica para archivar (Finalizar) tour
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action'])) {
    $action = $_POST['action'];
    $tour_id = (int)($_POST['tour_id'] ?? 0);
    $db = \App\Config\Database::getInstance();
    
    if ($action === 'complete_tour') {
        $stmt = $db->prepare("UPDATE bookings SET status = 'completed' WHERE id = ?");
        $stmt->execute([$tour_id]);
        header("Location: admin.php?msg=tour_archived");
        exit;
    } elseif ($action === 'confirm_tour') {
        $total = (float)($_POST['total_price'] ?? 0);
        $stmt = $db->prepare("UPDATE bookings SET status = 'confirmed', total_price = ? WHERE id = ?");
        $stmt->execute([$total, $tour_id]);
        header("Location: admin.php?msg=tour_confirmed");
        exit;
    } elseif ($action === 'cancel_tour') {
        $stmt = $db->prepare("UPDATE bookings SET status = 'cancelled' WHERE id = ?");
        $stmt->execute([$tour_id]);
        header("Location: admin.php?msg=tour_cancelled");
        exit;
    }
}

// Extraer métricas reales de la base de datos
$db = \App\Config\Database::getInstance();
$stats = \App\Controllers\StatsController::getDashboardStats();
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dashboard - Filitour</title>
    <style>
        *, *::before, *::after { box-sizing: border-box; }
        body { 
            font-family: system-ui, -apple-system, sans-serif; 
            background: #f1f5f9; 
            color: #334155; 
            margin: 0; 
        }
        .navbar {
            background: #0f172a; 
            padding: 1.2rem 2rem;
            color: white;
            display: flex;
            justify-content: space-between;
            align-items: center;
            box-shadow: 0 4px 15px rgba(0,0,0,0.1);
            border-bottom: 4px solid #ec4899; 
        }
        .navbar h1 { margin: 0; font-size: 1.5rem; letter-spacing: -0.5px; }
        .logout-btn {
            background: rgba(255, 255, 255, 0.1);
            color: #fdf5e6;
            padding: 0.5rem 1.2rem;
            text-decoration: none;
            border-radius: 6px;
            font-weight: 600;
            transition: 0.3s;
            border: 1px solid rgba(255,255,255,0.2);
        }
        .logout-btn:hover { background: #b91c1c; color: white; border-color: #b91c1c;}
        .container {
            padding: 2.5rem;
            max-width: 1200px;
            margin: 0 auto;
        }
        .grid-stats {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 1.5rem;
            margin-top: 2rem;
        }
        .stat-card {
            background: white;
            padding: 2rem;
            border-radius: 12px;
            box-shadow: 0 4px 6px rgba(15, 23, 42, 0.05);
            border-top: 5px solid #0284c7; 
            text-align: center;
        }
        .stat-card h3 { margin: 0; color: #64748b; font-size: 1rem; text-transform: uppercase; letter-spacing: 1px;}
        .stat-card .number { font-size: 2.5rem; color: #0f172a; font-weight: bold; margin: 10px 0; }
        
        .table-container {
            background: white;
            padding: 2rem;
            border-radius: 12px;
            box-shadow: 0 4px 6px rgba(15, 23, 42, 0.05);
            margin-top: 2rem;
        }
        .table-container h3 { color: #0f172a; margin-top: 0; }
        table { width: 100%; border-collapse: collapse; }
        th, td { padding: 1rem; text-align: left; border-bottom: 1px solid #e2e8f0; }
        th { background: #f8fafc; color: #475569; font-weight: 600; }
        tr:hover { background: #f1f5f9; }
        .badge { padding: 0.25rem 0.75rem; border-radius: 999px; font-size: 0.85rem; font-weight: 600; }
        .status-pending { background: #fef3c7; color: #92400e; }
        .status-confirmed { background: #dcfce3; color: #166534; }

        .table-responsive { overflow-x: auto; width: 100%; }
        @media (max-width: 768px) {
            .navbar { flex-direction: column; gap: 1rem; text-align: center; }
            .navbar div { display: flex; flex-direction: column; gap: 0.5rem; width: 100%; }
            .logout-btn { margin: 0 !important; text-align: center; width: 100%; box-sizing: border-box; }
            .stat-card { padding: 1.5rem; }
            .container { padding: 1rem; }
            th, td { padding: 0.75rem 0.5rem; font-size: 0.9rem; }
        }
    </style>
    <script>
    function submitAction(action, id, extra = {}) {
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = 'admin.php';
        
        const actionInput = document.createElement('input');
        actionInput.type = 'hidden';
        actionInput.name = 'action';
        actionInput.value = action;
        form.appendChild(actionInput);
        
        const idInput = document.createElement('input');
        idInput.type = 'hidden';
        idInput.name = 'tour_id';
        idInput.value = id;
        form.appendChild(idInput);
        
        for (const [key, value] of Object.entries(extra)) {
            const extraInput = document.createElement('input');
            extraInput.type = 'hidden';
            extraInput.name = key;
            extraInput.value = value;
            form.appendChild(extraInput);
        }
        
        document.body.appendChild(form);
        form.submit();
    }

    function confirmarReserva(id) {
        const priceInput = document.getElementById('price_' + id);
        const price = priceInput ? priceInput.value : 0;
        if(confirm("¿Confirmar esta reserva por $" + price + "? Se agendará para los próximos días.")) {
            submitAction('confirm_tour', id, { total_price: price });
        }
    }

    function eliminarReserva(id) {
        if(confirm("¿Estás seguro de eliminar/no confirmar esta reserva? Se cancelará permanentemente.")) {
            submitAction('cancel_tour', id);
        }
    }

    function finalizarTour(id) {
        if(confirm("¿Estás seguro de marcar este tour como Finalizado? Se archivará para no consumir espacio en los agendados.")) {
            submitAction('complete_tour', id);
        }
    }
    
    window.addEventListener('load', () => {
        if (window.location.search.includes('msg=tour_')) {
            let msg = "Operación realizada con éxito.";
            if(window.location.search.includes('archived')) msg = "Tour finalizado y archivado con éxito.";
            if(window.location.search.includes('confirmed')) msg = "Reserva confirmada y agendada.";
            if(window.location.search.includes('cancelled')) msg = "Reserva eliminada.";
            alert(msg);
            window.history.replaceState({}, document.title, "admin.php");
        }
    });
    </script>
</head>
<body>
    <div class="navbar">
        <h1>⚙️ Panel de Control - Filitour</h1>
        <div>
            <a href="index.php" class="logout-btn" style="margin-right: 10px; background: #0284c7; border-color: #0284c7; color: white;">🌍 Ir a la Página (Modo Edición)</a>
            <a href="logout.php" class="logout-btn">Cerrar Sesión</a>
        </div>
    </div>

    <div class="container">
        <!-- Tarjetas de Métricas Rápidas -->
        <div class="grid-stats">
            <div class="stat-card">
                <h3>Vistas de la Página</h3>
                <div class="number"><?= number_format($stats['visits']) ?></div>
            </div>
            <div class="stat-card">
                <h3>Total Reservas Hechas</h3>
                <div class="number"><?= number_format($stats['bookings']) ?></div>
            </div>
            <div class="stat-card" style="border-top-color: #10b981;">
                <h3>Total Reservas Confirmadas</h3>
                <div class="number"><?= number_format($stats['confirmed_bookings']) ?></div>
            </div>
            <div class="stat-card" style="border-top-color: #f59e0b;">
                <h3>Ingresos Confirmados</h3>
                <div class="number">$<?= number_format($stats['revenue'], 2) ?></div>
            </div>
            <div class="stat-card" style="border-top-color: #8b5cf6;">
                <h3>Promedio por Reserva</h3>
                <div class="number">$<?= number_format($stats['avg_revenue'], 2) ?></div>
            </div>
        </div>

        <!-- Tabla de Últimas Reservas -->
        <div class="table-container">
            <h3>📅 Nuevas Reservas (Por Confirmar)</h3>
            <p style="font-size: 0.9rem; color: #64748b; margin-top: -10px; margin-bottom: 15px;">Habla con el cliente, establece el precio final y confirma la reserva para agendarla.</p>
            <?php if (empty($stats['recent'])): ?>
                <p style="color: #64748b; text-align: center; padding: 2rem 0;">No hay nuevas reservas pendientes de confirmar.</p>
            <?php else: ?>
                <div class="table-responsive">
                <table>
                    <thead>
                        <tr>
                            <th>ID Reserva</th>
                            <th>Cliente</th>
                            <th>Fecha del Tour</th>
                            <th>Total ($)</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php foreach ($stats['recent'] as $booking): ?>
                        <tr>
                            <td>#<?= htmlspecialchars(substr($booking['id'], 0, 8)) ?></td>
                            <td><?= htmlspecialchars($booking['customer_name']) ?></td>
                            <td><?= htmlspecialchars($booking['tour_date'] ?? 'Sin fecha') ?></td>
                            <td>
                                <input type="number" id="price_<?= $booking['id'] ?>" value="<?= $booking['total_price'] ?>" style="width: 90px; padding: 6px; border: 1px solid #ccc; border-radius: 4px;" step="0.01" min="0">
                            </td>
                            <td>
                                <button onclick="confirmarReserva(<?= $booking['id'] ?>)" style="background: #10b981; color: white; border: none; padding: 6px 10px; border-radius: 6px; cursor: pointer; font-weight: bold; font-size: 0.85rem; margin-right: 5px;">✔ Confirmar</button>
                                <button onclick="eliminarReserva(<?= $booking['id'] ?>)" style="background: #ef4444; color: white; border: none; padding: 6px 10px; border-radius: 6px; cursor: pointer; font-weight: bold; font-size: 0.85rem;">✖ Eliminar</button>
                            </td>
                        </tr>
                        <?php endforeach; ?>
                    </tbody>
                </table>
                </div>
            <?php endif; ?>
        </div>

        <!-- Calendario de Agendados -->
        <div class="table-container" style="margin-top: 2rem; border-top-color: #3b82f6;">
            <h3>📅 Tours Agendados (Próximos)</h3>
            <p style="font-size: 0.9rem; color: #64748b; margin-top: -10px; margin-bottom: 15px;">Muestra únicamente las reservas que han sido confirmadas. Al marcar como finalizado, se archivan.</p>
            <?php 
                $agendados = $db->query("SELECT * FROM bookings WHERE status = 'confirmed' ORDER BY travel_date ASC")->fetchAll();
            ?>
            <?php if (empty($agendados)): ?>
                <p style="color: #64748b; text-align: center; padding: 2rem 0;">No hay tours agendados para los próximos días.</p>
            <?php else: ?>
                <div class="table-responsive">
                <table>
                    <thead>
                        <tr>
                            <th>Fecha</th>
                            <th>Cliente</th>
                            <th>País / Contacto</th>
                            <th>Tipo de Reserva</th>
                            <th>Total</th>
                            <th>Acción</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php foreach ($agendados as $tour): ?>
                        <tr>
                            <td><strong><?= htmlspecialchars($tour['travel_date'] ?? 'Sin fecha') ?></strong></td>
                            <td><?= htmlspecialchars($tour['client_name']) ?></td>
                            <td>
                                🌎 <?= htmlspecialchars($tour['client_phone'] ?? 'Desconocido') ?><br>
                                <a href="mailto:<?= htmlspecialchars($tour['client_email']) ?>" style="color: #0284c7; text-decoration: none; font-size: 0.9em;">📧 <?= htmlspecialchars($tour['client_email']) ?></a>
                            </td>
                            <td><?= htmlspecialchars(ucfirst($tour['booking_type'])) ?></td>
                            <td>$<?= number_format($tour['total_price'], 2) ?></td>
                            <td>
                                <button onclick="finalizarTour(<?= $tour['id'] ?>)" style="background: #10b981; color: white; border: none; padding: 6px 12px; border-radius: 6px; cursor: pointer; font-weight: bold; font-size: 0.85rem;">✔ Finalizado</button>
                            </td>
                        </tr>
                        <?php endforeach; ?>
                    </tbody>
                </table>
                </div>
            <?php endif; ?>
        </div>

        <!-- Reservas Archivadas -->
        <div class="table-container" style="margin-top: 2rem; border-top-color: #94a3b8; opacity: 0.9;">
            <h3>📁 Reservas Finalizadas (Archivadas)</h3>
            <?php 
                $archivados = $db->query("SELECT * FROM bookings WHERE status = 'completed' ORDER BY updated_at DESC LIMIT 10")->fetchAll();
            ?>
            <?php if (empty($archivados)): ?>
                <p style="color: #64748b; text-align: center; padding: 2rem 0;">Aún no hay reservas finalizadas.</p>
            <?php else: ?>
                <div class="table-responsive">
                <table>
                    <thead>
                        <tr>
                            <th>Fecha del Tour</th>
                            <th>Cliente</th>
                            <th>Total ($)</th>
                            <th>Estado</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php foreach ($archivados as $tour): ?>
                        <tr>
                            <td><?= htmlspecialchars($tour['travel_date'] ?? 'Sin fecha') ?></td>
                            <td><?= htmlspecialchars($tour['client_name']) ?></td>
                            <td>$<?= number_format($tour['total_price'], 2) ?></td>
                            <td><span style="color: #475569; font-weight: bold;">Archivado ✔</span></td>
                        </tr>
                        <?php endforeach; ?>
                    </tbody>
                </table>
                </div>
            <?php endif; ?>
        </div>

    </div>

</body>
</html>
