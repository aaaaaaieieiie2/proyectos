<?php \ = file_get_contents('index.php'); \ = preg_replace('/^\xEF\xBB\xBF/', '', \); \ = mb_convert_encoding(\, 'ISO-8859-1', 'UTF-8'); file_put_contents('index.php', \); echo 'Fixed'; ?>
<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
$content = file_get_contents('index.php');
$content = preg_replace('/^\xEF\xBB\xBF/', '', $content);
$content = mb_convert_encoding($content, 'ISO-8859-1', 'UTF-8');
file_put_contents('index.php', $content);
echo 'Fixed';
?>
