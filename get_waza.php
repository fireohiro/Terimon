<?php
session_start();
require 'db-connect.php';

// デバッグ用: エラーを表示
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

try {
    // データベース接続
    $pdo = new PDO($connect, USER, PASS);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    // データベース接続エラーをキャッチ
    header('Content-Type: application/json');
    echo json_encode(['error' => 'Database connection failed', 'details' => $e->getMessage()]);
    exit;
}

// リクエストデータを取得
$json = file_get_contents('php://input');
$data = json_decode($json, true);

// データが正しいか検証
if (!$data || !isset($data['wazaIds'])) {
    header('Content-Type: application/json');
    echo json_encode(['error' => 'Invalid input data']);
    exit;
}

$waza_ids = $data['wazaIds'];
$magic = [];

// データベースから該当データを取得
foreach ($waza_ids as $waza_id) {
    try {
        $sql = $pdo->prepare('SELECT * FROM waza_list WHERE waza_id = ?');
        $sql->execute([$waza_id]);
        $row = $sql->fetch(PDO::FETCH_ASSOC); // fetch(PDO::FETCH_ASSOC)を使用

        if ($row) {
            $magic[] = $row;
        }
    } catch (PDOException $e) {
        // クエリエラーをキャッチ
        header('Content-Type: application/json');
        echo json_encode(['error' => 'Query execution failed', 'details' => $e->getMessage()]);
        exit;
    }
}

// JSON形式でレスポンスを返す
header('Content-Type: application/json');
echo json_encode(['magic' => $magic], JSON_UNESCAPED_UNICODE);
?>
