<?php
$c = file_get_contents('index.php');
$r = "\xEF\xBF\xBD";

$c = str_replace($r . '??', '−', $c); // Minus buttons
$c = str_replace($r . '?', '✖', $c); // generic fallback
$c = str_replace('CONFIRMAR RESERVA ' . $r . ' ' . $r, 'CONFIRMAR RESERVA ✈️ 🌴', $c);
$c = str_replace('CONFIRMAR TRASLADO ' . $r . $r . $r, 'CONFIRMAR TRASLADO 🚐', $c);
$c = str_replace('CONFIRMAR TRASLADO ' . $r, 'CONFIRMAR TRASLADO 🚐', $c);
$c = str_replace('Se cotiza al confirmar ' . $r . $r . $r, 'Se cotiza al confirmar 💬', $c);

// Hardcoded replacements based on the task-692 log output:
$c = str_replace('??', '−', $c);
$c = str_replace('?', '✨', $c);
$c = str_replace('??', '💬', $c); // WhatsApp/Email icon? Or is it 💬?
$c = str_replace('CONFIRMAR RESERVA ?? ??', 'CONFIRMAR RESERVA ✈️ 🌴', $c);
$c = str_replace('CONFIRMAR TRASLADO ??', 'CONFIRMAR TRASLADO 🚐', $c);
$c = str_replace('Se cotiza al confirmar ??', 'Se cotiza al confirmar 💬', $c);
$c = str_replace('?? WhatsApp', '💬 WhatsApp', $c);
$c = str_replace('?? Email', '📧 Email', $c);

file_put_contents('index.php', $c);
echo 'Fixed remaining';
?>

