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

    // 既存のパーティーデータを削除
    $stmt = $pdo->prepare('DELETE FROM Friends_party WHERE save_id = :save_id');
    $stmt->bindParam(':save_id', $save_id, PDO::PARAM_INT);
    $stmt->execute();

    // 新しいデータを挿入
    $stmt = $pdo->prepare('
        INSERT INTO Friends_party (save_id, party_id, friend_id, current_hp, current_mp, sleep_flag) 
        VALUES (:save_id, :party_id, :friend_id, :current_hp, :current_mp, :sleep_flag)
    ');

    foreach ($data as $partyMember) {
        $stmt->bindParam(':save_id', $save_id, PDO::PARAM_INT);
        $stmt->bindParam(':party_id', $partyMember['party_id'], PDO::PARAM_INT);
        $stmt->bindParam(':friend_id', $partyMember['friend_id'], PDO::PARAM_INT);
        $stmt->bindParam(':current_hp', $partyMember['current_hp'], PDO::PARAM_INT);
        $stmt->bindParam(':current_mp', $partyMember['current_mp'], PDO::PARAM_INT);
        $stmt->bindParam(':sleep_flag', $partyMember['sleep_flag'], PDO::PARAM_INT);
        $stmt->execute();
    }

    $pdo->commit();

    echo json_encode(['success' => true, 'message' => 'パーティーメンバーが正常に保存されました。']);
} catch (PDOException $e) {
    $pdo->rollBack();
    echo json_encode(['error' => 'データベースエラー: ' . $e->getMessage()]);
}
?>