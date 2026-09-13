<?php
require_once __DIR__ . '/../app/bootstrap.php';
try {
    $db = \App\Config\Database::getInstance();
    $db->exec("ALTER TABLE beaches DROP FOREIGN KEY beaches_ibfk_1");
    echo "SUCCESS: dropped foreign key";
} catch (Exception $e) {
    echo "ERROR: " . $e->getMessage();
}
?>

