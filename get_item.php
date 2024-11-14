<?php
session_start();
header('Content-Type: application/json');  // ここでJSONヘッダーを指定
require 'db-connect.php';
$pdo = new PDO($connect, USER, PASS);

$account_id = $_SESSION['user']['account_id'];  // ここで適切なaccount_idを取得する必要があります

// SQLクエリの実行
$sql = $pdo->prepare(
    'SELECT i.*, gi.su 
    FROM item AS i 
    INNER JOIN get_item AS gi ON i.item_id = gi.item_id 
    WHERE gi.account_id = ?'
);
$sql->execute([$account_id]);

// アイテムを取得
$items = $sql->fetchAll(PDO::FETCH_ASSOC);

// アイテムが取得できなかった場合はエラーを返す
if (!$items) {
    echo json_encode(['items' => null]);
    exit;
}

echo json_encode(['items' => $items]);  // JSONとしてデータを返す
?>