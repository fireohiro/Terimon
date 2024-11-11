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

    // 既存のインベントリデータを削除
    $stmt = $pdo->prepare('DELETE FROM Inventory WHERE save_id = :save_id');
    $stmt->bindParam(':save_id', $save_id, PDO::PARAM_INT);
    $stmt->execute();

    // 新しいデータを挿入
    $stmt = $pdo->prepare('
        INSERT INTO Inventory (save_id, item_id, item_sum) 
        VALUES (:save_id, :item_id, :item_sum)
    ');

    foreach ($data as $item) {
        $stmt->bindParam(':save_id', $save_id, PDO::PARAM_INT);
        $stmt->bindParam(':item_id', $item['item_id'], PDO::PARAM_INT);
        $stmt->bindParam(':item_sum', $item['item_sum'], PDO::PARAM_INT);
        $stmt->execute();
    }

    $pdo->commit();

    echo json_encode(['success' => true, 'message' => 'インベントリが正常に保存されました。']);
} catch (PDOException $e) {
    $pdo->rollBack();
    echo json_encode(['error' => 'データベースエラー: ' . $e->getMessage()]);
}
?>