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
if (!isset($data['gearList']) || !is_array($data['gearList'])) {
    echo json_encode(['error' => 'Invalid gears data']);
    exit;
}

try {
    // DB接続
    $pdo = new PDO($connect, USER, PASS);
    

    // モンスター情報を保存
    foreach ($data['gearList'] as $gear) {
        // モンスター情報をDBに挿入または更新
        $sql = $pdo->prepare('select * from get_gear where account_id = ? and gear_id = ?');
        $sql->execute([$_SESSION['user']['account_id'],$gear['gear_id']]);
        $kekka = $sql->fetch(PDO::FETCH_ASSOC);
        if($kekka === null){
            $sql = $pdo->prepare('insert into get_gear values(?,?)');
            $result = $sql->execute([$_SESSION['user']['account_id'],$gear['gear_id']]);
            // 各モンスターの更新が成功したか確認
            if (!$result) {
                $success = false;
                break;
            }else{
                $success = true;
            }
        }else{
            $success = true;
        }
    }

    // 成功メッセージ
    if ($success) {
        echo json_encode(['status' => 'success', 'message' => 'Gears data saved successfully']);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Failed to save gears data']);
    }
} catch (PDOException $e) {
    echo json_encode(['status' => 'error', 'message' => 'Database error: ' . $e->getMessage()]);
}
?>
