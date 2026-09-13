<?php
$c = file_get_contents('C:\Users\Abdieljose\Desktop\xaa\htdocs\filitour-project\public\index.php');

$replacements = [
    'ParaÃ­sos' => 'Paraísos',
    'PanamÃ¡' => 'Panamá',
    'diseÃ±ados' => 'diseñados',
    'SumÃ©rgete' => 'Sumérgete',
    'paraÃsos' => 'paraísos',
    'soÃ±aste' => 'soñaste',
    'mÃ¡s' => 'más',
    'relajaciÃ³n' => 'relajación',
    'UBICACIâœ¨N' => 'UBICACIÓN',
    'DESCRIPCIÃ“N' => 'DESCRIPCIÓN',
    'ðŸ’¬ï¿½' => '🚐',
    'âœ¨ï¿½' => '✨',
    'ðŸ’¬?' => '✨', // Just in case it mangled like this
    'ðŸ –ï¸ ' => '🏖️',
    'âœ¨âœ¨ï¸ ' => '🏖️',
    'TAMAâœ¨O' => 'TAMAÑO',
    'QUÃ‰ INCLUYE' => 'QUÉ INCLUYE',
    'ðŸ“ ' => '📌',
    'â  Mostrar en TOPS' => '⭐ Mostrar en TOPS',
    'ðŸ”² Ajuste' => '📐 Ajuste',
    'ðŸ“  PosiciÃ³n' => '📍 Posición'
];

foreach ($replacements as $k => $v) {
    $c = str_replace($k, $v, $c);
}

// Remove BOM if any
$c = preg_replace('/^\xEF\xBB\xBF/', '', $c);

file_put_contents('C:\Users\Abdieljose\Desktop\xaa\htdocs\filitour-project\public\index.php', $c);
file_put_contents('public/index.php', $c);
echo "Emojis fixed";
?>
