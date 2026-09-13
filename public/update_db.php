<?php
require_once __DIR__ . '/../app/bootstrap.php';
try {
    $db = \App\Config\Database::getInstance();
    $db->exec("ALTER TABLE tours ADD COLUMN img VARCHAR(255) NULL");
    $db->exec("ALTER TABLE tours ADD COLUMN price_adult DECIMAL(10,2) NULL");
    $db->exec("ALTER TABLE tours ADD COLUMN price_child DECIMAL(10,2) NULL");
    $db->exec("ALTER TABLE tours ADD COLUMN price_senior DECIMAL(10,2) NULL");
    echo 'SUCCESS_TOURS';
} catch (\Exception $e) {
    echo 'ERROR_TOURS: ' . $e->getMessage();
}
echo "\n";
try {
    // Check if beaches table exists
    $db->exec("CREATE TABLE IF NOT EXISTS beaches (
        id VARCHAR(100) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        zone_name VARCHAR(100) NULL,
        emoji VARCHAR(20) NULL,
        duration VARCHAR(100) NULL,
        image_url VARCHAR(255) NULL,
        description TEXT
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;");
    echo 'SUCCESS_BEACHES';
} catch (\Exception $e) {
    echo 'ERROR_BEACHES: ' . $e->getMessage();
}
