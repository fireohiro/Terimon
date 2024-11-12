<?php
session_start();
header('Content-Type: application/json');  // JSON形式でレスポンスを返す

// エラーメッセージの表示設定
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

require 'db-connect.php';

// セッションからアカウントIDを取得
if (!isset($_SESSION['user']['account_id'])) {
    echo json_encode(['error' => 'Account ID not found in session']);
    exit;
}
$account_id = $_SESSION['user']['account_id'];

// データベース接続の確認と例外処理
try {
    $pdo = new PDO($connect, USER, PASS);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    echo json_encode(['error' => 'Database connection failed: ' . $e->getMessage()]);
    exit;
}

// SQLクエリの実行
try {
    $sql = $pdo->prepare(
        'SELECT g.*
         FROM gear AS g 
         INNER JOIN get_gear AS gg ON g.gear_id = gg.gear_id 
         WHERE gg.account_id = ?'
    );
    $sql->execute([$account_id]);

    // アイテムを取得
    $gears = $sql->fetchAll(PDO::FETCH_ASSOC);

    // アイテムが取得できなかった場合のエラーハンドリング
    if (!$gears) {
        echo json_encode(['error' => 'No gears found']);
        exit;
    }

    // JSON形式でデータを返す
    echo json_encode(['gears' => $gears]);

} catch (PDOException $e) {
    echo json_encode(['error' => 'SQL query failed: ' . $e->getMessage()]);
    exit;
}
