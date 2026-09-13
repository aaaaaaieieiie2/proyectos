<?php
$c = file_get_contents('index.php');
$r = "\xEF\xBF\xBD"; // Unicode Replacement Character 
$r2 = "\xEF\xBF\xBD?"; // Replacement character followed by literal question mark

$replacements = [
    'QUI' . $r2 . 'NES SOMOS' => 'QUIÉNES SOMOS',
    'QUI' . $r . 'NES SOMOS' => 'QUIÉNES SOMOS',
    'MINI DESCRIPCI' . $r2 . 'N' => 'MINI DESCRIPCIÓN',
    'DESCRIPCI' . $r2 . 'N COMPLETA' => 'DESCRIPCIÓN COMPLETA',
    'DESCRIPCI' . $r2 . 'N' => 'DESCRIPCIÓN',
    'QU' . $r2 . ' INCLUYE' => 'QUÉ INCLUYE',
    'NI' . $r2 . 'OS' => 'NIÑOS',
    'PA' . $r2 . 'S DE ORIGEN' => 'PAÍS DE ORIGEN',
    
    // Check if the original one matched
    'QUI' . $r . '?NES' => 'QUIÉNES',
    
    // Also try normal ? just in case
    'QUI?NES' => 'QUIÉNES',
    'MINI DESCRIPCI?N' => 'MINI DESCRIPCIÓN',
    'DESCRIPCI?N COMPLETA' => 'DESCRIPCIÓN COMPLETA',
    'DESCRIPCI?N' => 'DESCRIPCIÓN',
    'QU? INCLUYE' => 'QUÉ INCLUYE',
    'NI?OS' => 'NIÑOS',
    'PA?S DE ORIGEN' => 'PAÍS DE ORIGEN',
];

foreach ($replacements as $broken => $fixed) {
    $c = str_replace($broken, $fixed, $c);
}

// Regex for the remaining broken stuff
$c = preg_replace('/' . $r . '\? Explorar sin TOPS/u', '🏕️ Explorar sin TOPS', $c);
$c = preg_replace('/\?\? Explorar sin TOPS/u', '🏕️ Explorar sin TOPS', $c);
$c = preg_replace('/' . $r . ' Explorar sin TOPS/u', '🏕️ Explorar sin TOPS', $c);

file_put_contents('index.php', $c);
echo 'Fixed text';
?>

