<?php
namespace App\Controllers;

use App\Config\Database;

class StatsController {
    
    /**
     * Obtiene todas las métricas para el panel de administración
     */
    public static function getDashboardStats() {
        $db = Database::getInstance();
        
        // 1. Total Reservas
        $stmt = $db->query("SELECT COUNT(*) as total FROM bookings");
        $totalBookings = $stmt->fetch()['total'] ?? 0;
        
        // 2. Reservas Confirmadas (Reemplaza Ingresos Estimados por decisión de negocio)
        $stmt = $db->query("SELECT COUNT(*) as confirmadas FROM bookings WHERE status = 'completed'");
        $confirmed = $stmt->fetch()['confirmadas'] ?? 0;
        
        // 3. Ingresos Totales y Promedio (De reservas confirmadas y completadas)
        $stmt = $db->query("SELECT SUM(total_price) as total_revenue, AVG(total_price) as avg_revenue FROM bookings WHERE status = 'completed'");
        $revenueData = $stmt->fetch();
        $totalRevenue = $revenueData['total_revenue'] ?? 0;
        $avgRevenue = $revenueData['avg_revenue'] ?? 0;
        
        // Visitas Totales (Desde la tabla settings)
        $stmt = $db->query("SELECT setting_value FROM settings WHERE setting_key = 'site_visits'");
        $row = $stmt->fetch();
        $visits = $row ? (int)$row['setting_value'] : 0;
        
        // 4. Reservas por confirmar (Pendientes)
        $stmt = $db->query("SELECT id, client_name as customer_name, reference_id as tour_id, travel_date as tour_date, status, total_price FROM bookings WHERE status = 'pending' ORDER BY created_at DESC");
        $recentBookings = $stmt->fetchAll();
        
        return [
            'bookings' => $totalBookings,
            'confirmed_bookings' => $confirmed,
            'visits' => $visits,
            'revenue' => $totalRevenue,
            'avg_revenue' => $avgRevenue,
            'recent' => $recentBookings
        ];
    }
    
    /**
     * Registra una visita nueva (Se llamará silenciosamente desde el frontend)
     */
    public static function logVisit() {
        $db = Database::getInstance();
        $sql = "INSERT INTO settings (setting_key, setting_value, setting_group) 
                VALUES ('site_visits', '1', 'config') 
                ON DUPLICATE KEY UPDATE setting_value = CAST(setting_value AS UNSIGNED) + 1";
        $db->query($sql);
    }
}

