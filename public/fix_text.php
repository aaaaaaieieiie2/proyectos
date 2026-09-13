<?php
$c = file_get_contents('index.php');
$r = "\xEF\xBF\xBD"; // Unicode Replacement Character 

$replacements = [
    'QUI' . $r . 'NES' => 'QUIÉNES',
    'DESCRIPCI' . $r . 'N' => 'DESCRIPCIÓN',
    'QU' . $r . ' INCLUYE' => 'QUÉ INCLUYE',
    'NI' . $r . 'OS' => 'NIÑOS',
    'PA' . $r . 'S' => 'PAÍS',
    'A' . $r . 'ADIR' => 'AÑADIR',
    'A' . $r . 'adir' => 'Añadir',
    'DIRECCI' . $r . 'N' => 'DIRECCIÓN',
    'direcci' . $r . 'n' => 'dirección',
    'd' . $r . 'nde' => 'dónde',
    'D' . $r . 'NDE' => 'DÓNDE',
    'Autom' . $r . 'tico' => 'Automático',
    'autom' . $r . 'tico' => 'automático',
    'M' . $r . 's' => 'Más',
    'm' . $r . 's' => 'más',
    'A' . $r . 'o' => 'Año',
    'a' . $r . 'o' => 'año',
    'd' . $r . 'a' => 'día',
    'D' . $r . 'a' => 'Día',
    'Men' . $r . 'u' => 'Menú', // Men
    'men' . $r . 'u' => 'menú',
    'Panam' . $r => 'Panamá',
    'Para' . $r . 'so' => 'Paraíso',
    'para' . $r . 'so' => 'paraíso',
    'Tur' . $r . 'stico' => 'Turístico',
    'tur' . $r . 'stico' => 'turístico',
    'Relajaci' . $r . 'n' => 'Relajación',
    'relajaci' . $r . 'n' => 'relajación',
    'T' . $r => 'Tú',
    't' . $r => 'tú',
    'Garant' . $r . 'a' => 'Garantía',
    'garant' . $r . 'a' => 'garantía',
    'Log' . $r . 'stica' => 'Logística',
    'log' . $r . 'stica' => 'logística',
    'Escr' . $r . 'benos' => 'Escríbenos',
    'escr' . $r . 'benos' => 'escríbenos',
    'Dise' . $r . 'ado' => 'Diseñado',
    'dise' . $r . 'ado' => 'diseñado',
    'misi' . $r . 'n' => 'misión',
    'Misi' . $r . 'n' => 'Misión',
    'A' . $r . 'adiendo' => 'Añadiendo',
    
    // Custom broken strings from screenshot
    $r . ' Explorar sin TOPS' => '🏕️ Explorar sin TOPS',
    $r . $r . ' Solo Ida' => '➡️ Solo Ida',
    $r . $r . ' Ida y Vuelta' => '🔄 Ida y Vuelta',
    'GUARDAR CAMBIOS ' . $r . $r => 'GUARDAR CAMBIOS 💾',
    $r . $r . $r . ' Copiar esta secci' . $r . 'n' => '📋 Copiar esta sección',
    
    'dise' . $r . 'ados' => 'diseñados',
    'Sum' . $r . 'rgete' => 'Sumérgete',
    'so' . $r . 'aste' => 'soñaste',
    'estr' . $r . 's' => 'estrés',
    'Escr' . $r . 'benos' => 'Escríbenos',
    'A d' . $r . 'nde' => 'A dónde',
    'r' . $r . 'pida' => 'rápida',
    'S' . $r . 'b' => 'Sáb',
    'Rese' . $r . 'as' => 'Reseñas',
    'rese' . $r . 'a' => 'reseña',
    'A' . $r . 'adir' => 'Añadir',
    'bot' . $r . 'n' => 'botón',
    'selecci' . $r . 'n' => 'selección',
    'im' . $r . 'genes' => 'imágenes',
    'Im' . $r . 'genes' => 'Imágenes',
];

foreach ($replacements as $broken => $fixed) {
    $c = str_replace($broken, $fixed, $c);
}

// Fix buttons using Regex where  is present
$c = preg_replace('/<button class="step-btn" data-step="(.*?,\s?-1)">' . $r . '{1,3}<\/button>/u', '<button class="step-btn" data-step="$1">−</button>', $c);
$c = preg_replace('/<button class="step-btn" data-tfstep="(.*?,\s?-1)">' . $r . '{1,3}<\/button>/u', '<button class="step-btn" data-tfstep="$1">−</button>', $c);
$c = preg_replace('/<button class="modal-close" data-close="(.*?)">' . $r . '{1,3}<\/button>/u', '<button class="modal-close" data-close="$1">✖</button>', $c);

// Remaining random emoji replacements
$c = str_replace($r . $r . ' WhatsApp', '💬 WhatsApp', $c);
$c = str_replace($r . $r . $r . ' WhatsApp', '💬 WhatsApp', $c);
$c = str_replace($r . $r . ' Email', '📧 Email', $c);
$c = str_replace($r . $r . $r . ' Email', '📧 Email', $c);
$c = str_replace('CONFIRMAR RESERVA ' . $r . ' ' . $r, 'CONFIRMAR RESERVA ✈️ 🌴', $c);
$c = str_replace('CONFIRMAR TRASLADO ' . $r . $r . $r, 'CONFIRMAR TRASLADO 🚐', $c);
$c = str_replace('CONFIRMAR TRASLADO ' . $r, 'CONFIRMAR TRASLADO 🚐', $c);
$c = preg_replace('/' . $r . '{1,3} HAZ TU TRASLADO/', '🚐 HAZ TU TRASLADO', $c);
$c = str_replace('Se cotiza al confirmar ' . $r . $r . $r, 'Se cotiza al confirmar 💬', $c);
$c = str_replace('Se cotiza al confirmar ' . $r, 'Se cotiza al confirmar 💬', $c);

file_put_contents('index.php', $c);
echo 'Fixed text';
?>

