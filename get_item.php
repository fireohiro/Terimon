<?php
session_start();
require 'db-connect.php';

function getItems($pdo) {
    $accountId = $_SESSION['account_id'];
    
    // 所持品テーブルからアイテムを取得
    $sql = "SELECT * FROM get_item WHERE account_id = ?";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([$accountId]);
    
    $items = [];
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        $items[] = $row;
    }
    
    return $items;
}

// アイテム取得処理
header('Content-Type: application/json');
echo json_encode(getItems($pdo));
?>
