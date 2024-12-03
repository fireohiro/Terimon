<?php
session_start();
require 'db-connect.php';
header('Content-Type:application/json');

// POSTデータを取得
$inputData = file_get_contents('php://input');
$data = json_decode($inputData, true);

// データチェック
if (!isset($data) || !is_array($data)) {
    echo json_encode(['error' => 'Invalid data format']);
    exit;
}

// friends配列が存在し、かつそれが配列であることを確認
if (!isset($data['statuses']) || !is_array($data['statuses'])) {
    echo json_encode(['error' => 'Invalid statuses data']);
    exit;
}

try {
    // DB接続
    $pdo = new PDO($connect, USER, PASS);

    // トランザクションの開始
    $pdo->beginTransaction();

    // `temoti` テーブルの既存データを削除
    $sql = $pdo->prepare('DELETE FROM temoti WHERE account_id = ?');
    $sql->execute([$_SESSION['user']['account_id']]);

    // モンスター情報を保存
    foreach ($data['statuses'] as $friend) {
        // 必要なキーが存在するか確認
        if (
            !isset($friend['level']) || !isset($friend['experience']) || 
            !isset($friend['hp']) || !isset($friend['hp_nokori']) ||
            !isset($friend['mp']) || !isset($friend['mp_nokori']) ||
            !isset($friend['pow']) || !isset($friend['def']) ||
            !isset($friend['speed']) || !isset($friend['luck']) ||
            !isset($friend['buff_time']) || !isset($friend['waza_id1']) ||
            !isset($friend['waza_id2']) || !isset($friend['waza_id3']) ||
            !isset($friend['waza_id4']) || !isset($friend['friend_id'])
        ) {
            throw new Exception('Incomplete friend data');
        }

        if ($friend['friend_id'] <= 0) {
            // 新しいモンスターを`friends`に挿入
            $sql = $pdo->prepare('INSERT INTO friends VALUES (NULL,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)');
            $result = $sql->execute([
                $_SESSION['user']['account_id'],
                $friend['monster_id'],
                $friend['job_id'],
                $friend['level'],
                $friend['experience'],
                $friend['hp'],
                $friend['hp_nokori'],
                $friend['mp'],
                $friend['mp_nokori'],
                $friend['pow'],
                $friend['def'],
                $friend['speed'],
                $friend['luck'],
                $friend['buff_time'],
                $friend['waza_id1'],
                $friend['waza_id2'],
                $friend['waza_id3'],
                $friend['waza_id4']
            ]);
            if (!$result) {
                throw new Exception('Failed to insert into friends');
            }

            // 挿入されたデータの `friend_id` を取得
            $friend_id = $pdo->lastInsertId();
            if (!$friend_id) {
                throw new Exception('Failed to get last inserted ID');
            }

            // `temoti`に挿入
            $sql = $pdo->prepare('INSERT INTO temoti VALUES (?,?)');
            $sql->execute([$_SESSION['user']['account_id'], $friend_id]);
        } else {
            // 既存モンスターを`friends`に更新
            $sql = $pdo->prepare('UPDATE friends SET level = ?, experience = ?, hp = ?, hp_nokori = ?, mp = ?, mp_nokori = ?, pow = ?, def = ?, speed = ?, luck = ?, buff_time = ?, waza_id1 = ?, waza_id2 = ?, waza_id3 = ?, waza_id4 = ? WHERE friend_id = ?');
            $result = $sql->execute([
                $friend['level'],
                $friend['experience'],
                $friend['hp'],
                $friend['hp_nokori'],
                $friend['mp'],
                $friend['mp_nokori'],
                $friend['pow'],
                $friend['def'],
                $friend['speed'],
                $friend['luck'],
                $friend['buff_time'],
                $friend['waza_id1'],
                $friend['waza_id2'],
                $friend['waza_id3'],
                $friend['waza_id4'],
                $friend['friend_id']
            ]);
            if (!$result) {
                throw new Exception('Failed to update friend data');
            }

            // `temoti`に挿入
            $sql = $pdo->prepare('INSERT INTO temoti VALUES (?,?)');
            $sql->execute([$_SESSION['user']['account_id'], $friend['friend_id']]);
        }
    }

    // トランザクションのコミット
    $pdo->commit();

    echo json_encode(['status' => 'success', 'message' => 'Monsters data saved successfully']);
} catch (Exception $e) {
    // トランザクションのロールバック
    $pdo->rollBack();
    echo json_encode(['status' => 'error', 'message' => 'Database error: ' . $e->getMessage()]);
}
?>
