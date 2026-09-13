<?php \ = file_get_contents('index.php'); \ = preg_replace('/^\xEF\xBB\xBF/', '', \); file_put_contents('index.php', \); echo 'BOM Stripped'; ?>
