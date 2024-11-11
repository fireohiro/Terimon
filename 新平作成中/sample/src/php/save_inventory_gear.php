<?php
session_start();
require '../php/db-connect.php';

header('Content-Type: application/json');

// セッションからsave_idを取得
if (!isset($_SESSION['save_id'])) {
    echo json_encode(['error' => 'セーブデータが見つかりません。']);
    exit;
}
$save_id = $_SESSION['save_id'];

// POSTデータを取得
$input = file_get_contents('php://input');
$data = json_decode($input, true);

if (!$data) {
    echo json_encode(['error' => '無効なデータ形式です。']);
    exit;
}

try {
    $pdo->beginTransaction();

    // 既存の武器データを削除
    $stmt = $pdo->prepare('DELETE FROM Inventory_Gear WHERE save_id = :save_id');
    $stmt->bindParam(':save_id', $save_id, PDO::PARAM_INT);
    $stmt->execute();

    // 新しいデータを挿入
    $stmt = $pdo->prepare('
        INSERT INTO Inventory_Gear (save_id, gear_id, gear_sum, gear_used_sum) 
        VALUES (:save_id, :gear_id, :gear_sum, :gear_used_sum)
    ');

    foreach ($data as $gear) {
        $stmt->bindParam(':save_id', $save_id, PDO::PARAM_INT);
        $stmt->bindParam(':gear_id', $gear['gear_id'], PDO::PARAM_INT);
        $stmt->bindParam(':gear_sum', $gear['gear_sum'], PDO::PARAM_INT);
        $stmt->bindParam(':gear_used_sum', $gear['gear_used_sum'], PDO::PARAM_INT);
        $stmt->execute();
    }

    $pdo->commit();

    echo json_encode(['success' => true, 'message' => '武器データが正常に保存されました。']);
} catch (PDOException $e) {
    $pdo->rollBack();
    echo json_encode(['error' => 'データベースエラー: ' . $e->getMessage()]);
}
?>