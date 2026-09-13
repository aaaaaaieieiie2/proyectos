<?php
require 'app/bootstrap.php';
try {
    // Mock Auth
    $_SESSION['admin_logged_in'] = true;
    require 'public/admin.php';
} catch(Throwable $e) {
    echo "ERROR CATCHED: " . $e->getMessage() . " in " . $e->getFile() . " on line " . $e->getLine();
}
