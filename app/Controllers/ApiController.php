<?php
namespace App\Controllers;
use App\Config\Database;

class ApiController {
 public static function handle($action, $input) {
 if ($action === 'book') { return self::createBooking($input); }
 if ($action === 'visit') { return StatsController::logVisit(); }
 if ($action === 'sync_tours') { return self::syncTours($input); }
 if ($action === 'sync_beaches') { return self::syncBeaches($input); }
 if ($action === 'sync_transfers') { return self::syncTransfers($input); }
 if ($action === 'sync_services') { return self::syncGeneric($input, 'data_services'); }
 if ($action === 'sync_about') { return self::syncGeneric($input, 'data_about'); }
 if ($action === 'sync_zones') { return self::syncGeneric($input, 'data_zones'); }
 if ($action === 'sync_styles') { return self::syncGeneric($input, 'data_styles'); }
 if ($action === 'sync_texts') { return self::syncGeneric($input, 'data_texts'); }
 if ($action === 'sync_social') { return self::syncGeneric($input, 'data_social'); }
 return ['status' => 'error', 'message' => 'Acción no válida'];
 }

 private static function syncGeneric(array $input, string $setting_key): array
 {
 $data = $input['data'] ?? [];
 try {
 $db = Database::getInstance();
 $stmtCache = $db->prepare("INSERT INTO settings (setting_key, setting_value, setting_group) VALUES (?, ?, 'config') ON DUPLICATE KEY UPDATE setting_value = ?");
 $json = json_encode($data);
 $stmtCache->execute([$setting_key, $json, $json]);
 return ['status' => 'success', 'message' => 'Datos guardados correctamente'];
 } catch (\Exception $e) {
 return ['status' => 'error', 'message' => $e->getMessage()];
 }
 }

 private static function createBooking($input) {
 try {
 $db = Database::getInstance();
 $stmt = $db->prepare('INSERT INTO bookings (booking_type, reference_id, client_name, client_email, client_phone, travel_date, pax_adults, pax_kids, total_price, client_notes, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, \'pending\')');
 
 $p = $input['booking'] ?? $input;
 $type = $p['type'] ?? 'tour';
 $ref_id = $p['reference_id'] ?? '';
 $adults = (int)($p['pax_adults'] ?? 1);
 $kids = (int)($p['pax_kids'] ?? 0);
 $total_price = (float)($p['total_price'] ?? 0.0);
 
 // 🔒 Validación segura de precios desde la BD (Solo si es un paquete o tour con ID)
 if (($type === 'package' || $type === 'tour' || $type === 'lugar') && !empty($ref_id)) {
 $stmtPrice = $db->prepare("SELECT price FROM tours WHERE id = ?");
 $stmtPrice->execute([$ref_id]);
 $tour = $stmtPrice->fetch();
 if ($tour && $tour['price'] > 0) {
 $base_price = (float)$tour['price'];
 // Estimación: niños y tercera edad pagan aprox 65% (promedio entre 50% y 80%) si están mezclados
 $calculated = ($adults * $base_price) + ($kids * round($base_price * 0.65));
 // Solo reemplazamos si el precio calculado es mayor a 0 para proteger contra manipulaciones
 if ($calculated > 0) {
 $total_price = $calculated;
 }
 }
 }
 
 $stmt->execute([
 $type,
 $ref_id,
 $p['client_name'] ?? '',
 $p['client_email'] ?? '',
 $p['client_phone'] ?? '',
 empty($p['travel_date']) ? null : $p['travel_date'],
 $adults,
 $kids,
 $total_price,
 $p['client_notes'] ?? ''
 ]);
 return ['status' => 'success', 'booking_id' => $db->lastInsertId()];
 } catch (\Exception $e) {
 error_log("Booking Error: " . $e->getMessage());
 return ['status' => 'error', 'message' => 'Error al procesar la reserva'];
 }
 }

 private static function syncTours($input) {
 $tours = $input['tours'] ?? [];
 try {
 $db = Database::getInstance();
 $db->beginTransaction();
 
 // Delete all existing tours first to ensure a clean sync 
 // (Assuming this doesn't break foreign keys because we use ON DELETE CASCADE)
 $db->exec("DELETE FROM tours");
 
 $stmtTour = $db->prepare("INSERT INTO tours (id, type, name, sub_title, price, old_price, duration, rating, is_featured, emoji, description, history, pin_size, img) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
 $stmtImg = $db->prepare("INSERT INTO tour_images (tour_id, image_url, display_order) VALUES (?, ?, ?)");
 $stmtTag = $db->prepare("INSERT INTO tour_tags (tour_id, style_id) VALUES (?, ?)");
 $stmtPlace = $db->prepare("INSERT INTO package_places (package_id, place_id, display_order) VALUES (?, ?, ?)");
 $stmtInc = $db->prepare("INSERT INTO tour_includes (tour_id, item_text) VALUES (?, ?)");

 foreach ($tours as $t) {
 $type = $t['type'] ?? 'place';
 if ($type === 'lugar') $type = 'place';
 $stmtTour->execute([
 $t['id'],
 $type,
 $t['name'] ?? '',
 $t['sub'] ?? '',
 $t['price'] ?? 0,
 $t['oldPrice'] ?? null,
 $t['duration'] ?? null,
 $t['rating'] ?? 5.0,
 $t['featured'] ? 1 : 0,
 $t['emoji'] ?? '',
 $t['long'] ?? $t['desc'] ?? '',
 $t['hist'] ?? '',
 $t['pinSize'] ?? 48,
 $t['img'] ?? ''
 ]);
 
 // Add images
 if (!empty($t['imgs']) && is_array($t['imgs'])) {
 foreach ($t['imgs'] as $i => $imgUrl) {
 if ($imgUrl) $stmtImg->execute([$t['id'], $imgUrl, $i]);
 }
 }
 
 // Add style tag
 if (!empty($t['style'])) {
 try {
 $stmtTag->execute([$t['id'], $t['style']]);
 } catch (\Exception $e) {} // ignore if style_id doesn't exist yet
 }
 
 // Add places (for packages)
 if ($type === 'package' && !empty($t['places']) && is_array($t['places'])) {
 foreach ($t['places'] as $i => $placeId) {
 try {
 $stmtPlace->execute([$t['id'], $placeId, $i]);
 } catch (\Exception $e) {}
 }
 }
 
 // Add includes
 if (!empty($t['includes']) && is_array($t['includes'])) {
 foreach ($t['includes'] as $inc) {
 if ($inc) $stmtInc->execute([$t['id'], $inc]);
 }
 }
 }
 
 // CACHE JSON FOR FAST FRONTEND LOADING
 $stmtCache = $db->prepare("INSERT INTO settings (setting_key, setting_value, setting_group) VALUES ('data_tours', ?, 'config') ON DUPLICATE KEY UPDATE setting_value = ?");
 $json = json_encode($tours);
 $stmtCache->execute([$json, $json]);
 
 $db->commit();
 return ['status' => 'success', 'message' => 'Tours sincronizados correctamente'];
 } catch (\Exception $e) {
 if (isset($db)) $db->rollBack();
 error_log("Sync Tours Error: " . $e->getMessage());
 return ['status' => 'error', 'message' => 'Error al sincronizar tours'];
 }
 }

 private static function syncBeaches($input) {
 $beaches = $input['beaches'] ?? [];
 try {
 $db = Database::getInstance();
 $db->beginTransaction();
 $db->exec("DELETE FROM beaches");
 
 $stmt = $db->prepare("INSERT INTO beaches (id, name, zone_id, emoji, price, duration, image_url, description) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
 foreach ($beaches as $b) {
 $stmt->execute([
 $b['id'],
 $b['name'] ?? '',
 $b['zone'] ?? '',
 $b['emoji'] ?? '',
 $b['price'] ?? 0,
 $b['duration'] ?? '',
 $b['img'] ?? '',
 $b['desc'] ?? ''
 ]);
 }
 
 $stmtCache = $db->prepare("INSERT INTO settings (setting_key, setting_value, setting_group) VALUES ('data_beaches', ?, 'config') ON DUPLICATE KEY UPDATE setting_value = ?");
 $json = json_encode($beaches);
 $stmtCache->execute([$json, $json]);
 
 $db->commit();
 return ['status' => 'success', 'message' => 'Playas sincronizadas correctamente'];
 } catch (\Exception $e) {
 if (isset($db)) $db->rollBack();
 return ['status' => 'error', 'message' => $e->getMessage()];
 }
 }

 public static function syncTransfers(array $input): array
 {
 $transfers = $input['data'] ?? [];
 if (empty($transfers)) {
 return ['status' => 'error', 'message' => 'No transfer data provided'];
 }

 try {
 $db = Database::getInstance();
 $db->beginTransaction();
 $db->exec("DELETE FROM transfers");
 
 $stmt = $db->prepare("INSERT INTO transfers (id, name, origin, destination, price_one_way, price_round_trip, max_passengers, emoji, price_basis, description) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
 
 foreach ($transfers as $t) {
 $stmt->execute([
 $t['id'],
 $t['name'] ?? '',
 $t['origin'] ?? '',
 $t['destination'] ?? '',
 $t['price_one_way'] ?? 0,
 $t['price_round_trip'] ?? 0,
 $t['max_passengers'] ?? 8,
 $t['emoji'] ?? '',
 $t['price_basis'] ?? 'per_vehicle',
 $t['desc'] ?? ''
 ]);
 }
 
 // CACHE JSON FOR FAST FRONTEND LOADING
 $stmtCache = $db->prepare("INSERT INTO settings (setting_key, setting_value, setting_group) VALUES ('data_transfers', ?, 'config') ON DUPLICATE KEY UPDATE setting_value = ?");
 $json = json_encode($transfers);
 $stmtCache->execute([$json, $json]);
 
 $db->commit();
 return ['status' => 'success', 'message' => 'Traslados sincronizados correctamente'];
 } catch (\Exception $e) {
 if (isset($db)) $db->rollBack();
 return ['status' => 'error', 'message' => $e->getMessage()];
 }
 }
}

