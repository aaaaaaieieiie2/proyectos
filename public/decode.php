<?php
$c = file_get_contents('C:\Users\Abdieljose\Desktop\xaa\htdocs\filitour-project\public\index.php');
// The file is currently double-encoded UTF-8. 
// "ParaÃ­sos" -> utf8_decode("ParaÃ­sos") -> "Paraísos"
$decoded = utf8_decode($c);

file_put_contents('C:\Users\Abdieljose\Desktop\xaa\htdocs\filitour-project\public\index.php', $decoded);
echo "Decoded!";
?>

