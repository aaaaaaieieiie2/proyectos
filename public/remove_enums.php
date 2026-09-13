<?php
require_once __DIR__ . '/../app/bootstrap.php';
try {
    $db = \App\Config\Database::getInstance();
    $db->exec("ALTER TABLE tours MODIFY COLUMN type VARCHAR(50) DEFAULT 'place'");
    $db->exec("ALTER TABLE bookings MODIFY COLUMN booking_type VARCHAR(50) NOT NULL");
    echo "SUCCESS: Enums removed";
} catch (Exception $e) {
    echo "ERROR: " . $e->getMessage();
}
?>

