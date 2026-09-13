import os

path = 'app/Controllers/ApiController.php'
with open(path, 'r', encoding='utf-8') as f:
    php = f.read()

# Add logging
if 'file_put_contents' not in php:
    php = php.replace('private static function createBooking($input) {', 
                      "private static function createBooking($input) {\n        file_put_contents(__DIR__ . '/../../debug.log', date('Y-m-d H:i:s') . \" INPUT: \" . print_r($input, true) . \"\\n\", FILE_APPEND);")
    php = php.replace("return ['status' => 'error', 'message' => $e->getMessage()];", 
                      "file_put_contents(__DIR__ . '/../../debug.log', date('Y-m-d H:i:s') . \" ERROR: \" . $e->getMessage() . \"\\n\", FILE_APPEND);\n            return ['status' => 'error', 'message' => $e->getMessage()];")

with open(path, 'w', encoding='utf-8') as f:
    f.write(php)
print("SUCCESS logging added")

