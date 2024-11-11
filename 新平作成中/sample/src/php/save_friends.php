<?php
session_start();
require '../php/db-connect.php'; // データベース接続用のファイルをインクルード

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

// セーブデータに紐づくFriendsテーブルを初期化
try {
    $pdo->beginTransaction();

    // 既存のデータを削除
    $stmt = $pdo->prepare('DELETE FROM Friends WHERE save_id = :save_id');
    $stmt->bindParam(':save_id', $save_id, PDO::PARAM_INT);
    $stmt->execute();

    // 新しいデータを挿入
    $stmt = $pdo->prepare('
        INSERT INTO Friends (save_id, monster_id, job_id, level, get_exprience, hp, mp, strength, defense, speed, lack, buff_time, waza_id1, waza_id2, waza_id3, waza_id4) 
        VALUES (:save_id, :monster_id, :job_id, :level, :get_exprience, :hp, :mp, :strength, :defense, :speed, :lack, :buff_time, :waza_id1, :waza_id2, :waza_id3, :waza_id4)
    ');

    // データをバインドして挿入
    foreach ($data as $friend) {
        $stmt->bindParam(':save_id', $save_id, PDO::PARAM_INT);
        $stmt->bindParam(':monster_id', $friend['monster_id'], PDO::PARAM_INT);
        $stmt->bindParam(':job_id', $friend['job_id'], PDO::PARAM_INT);
        $stmt->bindParam(':level', $friend['level'], PDO::PARAM_INT);
        $stmt->bindParam(':get_exprience', $friend['get_exprience'], PDO::PARAM_INT);
        $stmt->bindParam(':hp', $friend['hp'], PDO::PARAM_INT);
        $stmt->bindParam(':mp', $friend['mp'], PDO::PARAM_INT);
        $stmt->bindParam(':strength', $friend['strength'], PDO::PARAM_INT);
        $stmt->bindParam(':defense', $friend['defense'], PDO::PARAM_INT);
        $stmt->bindParam(':speed', $friend['speed'], PDO::PARAM_INT);
        $stmt->bindParam(':lack', $friend['lack'], PDO::PARAM_INT);
        $stmt->bindParam(':buff_time', $friend['buff_time'], PDO::PARAM_INT);
        $stmt->bindParam(':waza_id1', $friend['waza_id1'], PDO::PARAM_INT);
        $stmt->bindParam(':waza_id2', $friend['waza_id2'], PDO::PARAM_INT);
        $stmt->bindParam(':waza_id3', $friend['waza_id3'], PDO::PARAM_INT);
        $stmt->bindParam(':waza_id4', $friend['waza_id4'], PDO::PARAM_INT);
        $stmt->execute();
    }

    $pdo->commit();

    echo json_encode(['success' => true, 'message' => '仲間データが正常に保存されました。']);
} catch (PDOException $e) {
    $pdo->rollBack();
    echo json_encode(['error' => 'データベースエラー: ' . $e->getMessage()]);
}
?>