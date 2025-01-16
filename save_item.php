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
if (!isset($data['itemList']) || !is_array($data['itemList'])) {
    echo json_encode(['error' => 'Invalid items data']);
    exit;
}

try {
    // DB接続
    $pdo = new PDO($connect, USER, PASS);
    

    // モンスター情報を保存
    foreach ($data['itemList'] as $item) {
        $sql = $pdo->prepare('select count(*) as cnt from get_item where account_id = ? and item_id = ?');
        $sql->execute([$_SESSION['user']['account_id'],$item['item_id']]);
        $kekka = $sql->fetch(PDO::FETCH_ASSOC);
        if($kekka['cnt'] > 0){
            $sql = $pdo->prepare('update get_item set su = ? where account_id = ? and item_id = ?');
            $result = $sql->execute([
                $item['su'],
                $_SESSION['user']['account_id'],
                $item['item_id']
            ]);
        }else{
            $sql = $pdo->prepare('insert into get_item values(?,?,?)');
            $result = $sql->execute([
                $_SESSION['user']['account_id'],
                $item['item_id'],
                $item['su']
            ]);
        }
        // 各モンスターの更新が成功したか確認
        if (!$result) {
            $success = false;
            break;
        }else{
            $success = true;
        }
    }

    // 成功メッセージ
    if ($success) {
        echo json_encode(['status' => 'success', 'message' => 'Items data saved successfully']);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Failed to save items data']);
    }
} catch (PDOException $e) {
    echo json_encode(['status' => 'error', 'message' => 'Database error: ' . $e->getMessage()]);
}
?>
