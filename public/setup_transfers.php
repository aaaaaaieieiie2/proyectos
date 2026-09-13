<?php
require_once __DIR__ . '/../app/bootstrap.php';
try {
    $db = \App\Config\Database::getInstance();
    $db->exec("DROP TABLE IF EXISTS transfers");
    $db->exec("CREATE TABLE transfers (
      id VARCHAR(100) PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      origin VARCHAR(255) NULL,
      destination VARCHAR(255) NULL,
      price_one_way DECIMAL(10,2) DEFAULT 0.00,
      price_round_trip DECIMAL(10,2) DEFAULT 0.00,
      max_passengers INT DEFAULT 8,
      emoji VARCHAR(20) NULL,
      price_basis VARCHAR(50) DEFAULT 'per_vehicle',
      description TEXT,
      latitude DECIMAL(10,6) NULL,
      longitude DECIMAL(10,6) NULL
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;");
    echo "SUCCESS: transfers table created";
} catch (Exception $e) {
    echo "ERROR: " . $e->getMessage();
}
?>

