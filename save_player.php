<?php
// DB接続設定の読み込み
require 'db-connect.php';
header('Content-Type:application/json');

// 受け取ったJSONデータを取得
$inputData = file_get_contents('php://input');

// JSONデータをデコード
$data = json_decode($inputData, true);

// デバッグ: 受け取ったデータをログに出力（開発環境でのみ使用）
error_log(print_r($data, true));

// 必要なフィールドがすべて存在するかチェック
$requiredFields = [
    'account_id', 'level', 'experience', 'hp', 'hp_nokori', 'mp', 'mp_nokori', 
    'pow', 'def', 'speed', 'luck', 'money', 'map_id', 'savepoint_x', 'savepoint_y', 'event_flg'
];

foreach ($requiredFields as $field) {
    if (!isset($data[$field])) {
        // 必要なフィールドが不足している場合、エラーメッセージを返す
        echo json_encode(['error' => 'Missing field: ' . $field]);
        exit;
    }
}

// データの整合性をチェック（例えば数値型であるべきデータが数値かどうか）
if (!is_numeric($data['account_id']) || !is_numeric($data['level']) || !is_numeric($data['experience']) ||
    !is_numeric($data['hp']) || !is_numeric($data['hp_nokori']) || !is_numeric($data['mp']) || 
    !is_numeric($data['mp_nokori']) || !is_numeric($data['pow']) || !is_numeric($data['def']) ||
    !is_numeric($data['speed']) || !is_numeric($data['luck']) || !is_numeric($data['money']) ||
    !is_numeric($data['map_id']) || !is_numeric($data['savepoint_x']) || !is_numeric($data['savepoint_y']) || 
    !is_numeric($data['event_flg'])) {
    // 数値型が期待されるフィールドで数値でないデータが送られた場合
    echo json_encode(['error' => 'Invalid data type, expected numeric values']);
    exit;
}

try {
    // データベース接続
    $pdo = new PDO($connect, USER, PASS);

    // gear_idが送られているかどうかでSQLを分ける
    if (isset($data['gear_id'])) {
        // gear_idを含む場合の更新SQL
        $sql = $pdo->prepare('UPDATE account SET level = ?, experience = ?, hp = ?, hp_nokori = ?, mp = ?, mp_nokori = ?, 
            pow = ?, def = ?, speed = ?, luck = ?, money = ?, gear_id = ?, map_id = ?, savepoint_x = ?, savepoint_y = ?, event_flg = ? 
            WHERE account_id = ?');
        
        $success = $sql->execute([
            $data['level'],
            $data['experience'],
            $data['hp'],
            $data['hp_nokori'],
            $data['mp'],
            $data['mp_nokori'],
            $data['pow'],
            $data['def'],
            $data['speed'],
            $data['luck'],
            $data['money'],
            $data['gear_id'],
            $data['map_id'],
            $data['savepoint_x'],
            $data['savepoint_y'],
            $data['event_flg'],
            $data['account_id']
        ]);
    } else {
        // gear_idを含まない場合の更新SQL
        $sql = $pdo->prepare('UPDATE account SET level = ?, experience = ?, hp = ?, hp_nokori = ?, mp = ?, mp_nokori = ?, 
            pow = ?, def = ?, speed = ?, luck = ?, money = ?, map_id = ?, savepoint_x = ?, savepoint_y = ?, event_flg = ? 
            WHERE account_id = ?');
        
        $success = $sql->execute([
            $data['level'],
            $data['experience'],
            $data['hp'],
            $data['hp_nokori'],
            $data['mp'],
            $data['mp_nokori'],
            $data['pow'],
            $data['def'],
            $data['speed'],
            $data['luck'],
            $data['money'],
            $data['map_id'],
            $data['savepoint_x'],
            $data['savepoint_y'],
            $data['event_flg'],
            $data['account_id']
        ]);
    }

    // 成功した場合のレスポンス
    if ($success) {
        echo json_encode(['status' => 'success', 'message' => 'Player data updated successfully']);
    } else {
        // 更新に失敗した場合のレスポンス
        echo json_encode(['status' => 'error', 'message' => 'Failed to update player data']);
    }
} catch (PDOException $e) {
    // DB接続やSQL実行エラーが発生した場合
    echo json_encode(['status' => 'error', 'message' => 'Database error: ' . $e->getMessage()]);
}
?>
