<?php
session_start();
require "../php/db-connect.php";

// セッションから save_id を取得
if (!isset($_SESSION['save_id'])) {
    die('セーブデータが見つかりません。');
}

$save_id = $_SESSION['save_id'];

// POSTで送信されたセーブデータを受け取る（JSON形式）
$inputData = file_get_contents("php://input");

// JSONデータを配列にデコード
$data = json_decode($inputData, true);

// 必要なデータが全て含まれているか確認
if (!isset($data['name'], $data['game_progress'], $data['level'], $data['experience'], $data['max_hp'], $data['current_hp'], 
          $data['max_mp'], $data['current_mp'], $data['job_id'], $data['strength'], $data['defense'], $data['speed'], 
          $data['luck'], $data['money'], $data['map_id'], $data['save_point_x'], $data['save_point_y'])) {
    die('不完全なデータです。');
}

try {
    // セーブデータを更新するためのSQL
    $sql = $pdo->prepare('
        UPDATE SaveData 
        SET 
            name = ?, 
            game_progress = ?, 
            level = ?, 
            experience = ?, 
            max_hp = ?, 
            current_hp = ?, 
            max_mp = ?, 
            current_mp = ?, 
            job_id = ?, 
            strength = ?, 
            defense = ?, 
            speed = ?, 
            luck = ?, 
            money = ?, 
            map_id = ?, 
            save_point_x = ?, 
            save_point_y = ?, 
            last_saved_at = NOW() 
        WHERE save_id = ?
    ');

    // SQLを実行してセーブデータを更新
    $sql->execute([
        $data['name'],
        $data['game_progress'],
        $data['level'],
        $data['experience'],
        $data['max_hp'],
        $data['current_hp'],
        $data['max_mp'],
        $data['current_mp'],
        $data['job_id'],
        $data['strength'],
        $data['defense'],
        $data['speed'],
        $data['luck'],
        $data['money'],
        $data['map_id'],
        $data['save_point_x'],
        $data['save_point_y'],
        $save_id
    ]);

    // 更新が成功した場合のレスポンス
    echo json_encode(['status' => 'success', 'message' => 'セーブデータが更新されました。']);

} catch (PDOException $e) {
    // エラーハンドリング
    error_log('Database error: ' . $e->getMessage());
    echo json_encode(['status' => 'error', 'message' => 'セーブデータの更新中にエラーが発生しました。']);
}
?>