<?php
require_once __DIR__ . '/app/bootstrap.php';
$input = [
    'type' => 'tour',
    'reference_id' => 'test_tour',
    'client_name' => 'Test User',
    'client_email' => 'test@example.com',
    'client_phone' => '12345678',
    'travel_date' => '',
    'pax_adults' => 2,
    'pax_kids' => 0,
    'total_price' => 100.0,
    'client_notes' => 'Testing'
];
$response = \App\Controllers\ApiController::handle('book', ['booking' => $input]);
print_r($response);

