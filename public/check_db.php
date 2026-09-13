<?php require_once '../app/bootstrap.php'; \ = \App\Config\Database::getInstance(); \ = \->query('SELECT setting_key, LENGTH(setting_value) as len FROM settings')->fetchAll(); print_r(\); ?>
