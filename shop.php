<?php
// データベース接続情報
session_start();
require 'db-connect.php';
// データベースに接続
$pdo = new PDO($connect, USER, PASS);
$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

 // アイテム一覧を取得するクエリ
    $stmt = $pdo->query("SELECT item_id, item_name, bunrui, setumei, naiyou FROM item");
    $items = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // JSON形式で出力
    header('Content-Type: application/json');
    echo json_encode($items);
?>