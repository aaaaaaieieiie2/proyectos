<?php
$c = file_get_contents('index.php');

// Fix mangled text in the modal
$c = str_replace('UBICACIâœ¨N', 'UBICACIÓN', $c);
$c = str_replace('DESCRIPCIÃ“N', 'DESCRIPCIÓN', $c);
$c = str_replace('ðŸ’¬ï¿½', '🚐', $c);

// Add missing price fields for Beaches
$beachEditPrice = '<div class="form-row"><label>PRECIO ($)</label><input type="number" id="beach-edit-price" class="glass-input" min="0" step="0.01"></div>';
$beachNewPrice = '<div class="form-row"><label>PRECIO ($)</label><input type="number" id="beach-new-price" class="glass-input" min="0" step="0.01" value="0"></div>';

// Insert into beaches edit
$c = preg_replace('/(<div class="form-row"><label>EMOJI<\/label><input id="beach-edit-emoji" class="glass-input"><\/div>)/', '$1' . "\n" . $beachEditPrice, $c);

// Insert into beaches new
$c = preg_replace('/(<div class="form-row"><label>EMOJI<\/label><input id="beach-new-emoji" class="glass-input" value=".*?"><\/div>)/', '$1' . "\n" . $beachNewPrice, $c);

// Fix Hint text for beaches
$c = str_replace('(sin precio; se cotiza)', '', $c);
$c = str_replace('(sin precio; se cotiza por WhatsApp)', '', $c);

// Add missing fields for Transfers
$tfEditPrices = '<div class="form-row"><label>PRECIO SOLO IDA ($)</label><input type="number" id="tf-edit-oneway" class="glass-input" min="0" step="0.01"></div>' . "\n" . '<div class="form-row"><label>PRECIO IDA Y VUELTA ($)</label><input type="number" id="tf-edit-roundtrip" class="glass-input" min="0" step="0.01"></div>';
$tfNewPrices = '<div class="form-row"><label>PRECIO SOLO IDA ($)</label><input type="number" id="tf-new-oneway" class="glass-input" min="0" step="0.01"></div>' . "\n" . '<div class="form-row"><label>PRECIO IDA Y VUELTA ($)</label><input type="number" id="tf-new-roundtrip" class="glass-input" min="0" step="0.01"></div>';

// Insert into tf edit
$c = preg_replace('/(<div class="form-row full"><label>DESTINO<\/label><input id="tf-edit-dest" class="glass-input"><\/div>)/', '$1' . "\n" . $tfEditPrices, $c);

// Insert into tf new
$c = preg_replace('/(<div class="form-row full"><label>DESTINO<\/label><input id="tf-new-dest" class="glass-input" placeholder=".*?"><\/div>)/', '$1' . "\n" . $tfNewPrices, $c);

file_put_contents('index.php', $c);
echo "HTML Inputs injected";
?>

