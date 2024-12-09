<?php
// セッション開始
session_start();
require 'db-connect.php';

try {
    // データベースに接続
    $pdo = new PDO($connect, USER, PASS);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // アイテム一覧を取得するクエリ
    $stmt = $pdo->query("SELECT item_id, item_name, bunrui, setumei, naiyou, price FROM item ORDER BY RAND() LIMIT 5");
    $items = $stmt->fetchAll(PDO::FETCH_ASSOC);

    if ($items === false) {
        echo json_encode(['error' => 'Failed to fetch items.']);
        exit;
    }

    // JSON形式で出力
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($items);

} catch (PDOException $e) {
    // エラーをキャッチしてJSONで出力
    echo json_encode(['error' => 'Database connection failed: ' . $e->getMessage()]);
    exit;
}