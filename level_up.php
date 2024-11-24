<?php
// エラーを表示する設定（デバッグ用）
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

require 'db-connect.php'; // データベース接続情報

try {
    $pdo = new PDO($connect, USER, PASS);

    // ヘッダー設定（JSONを返す）
    header('Content-Type: application/json');

    // クライアントからのリクエストデータを取得
    $inputData = file_get_contents('php://input');
    file_put_contents('debug.log', $inputData . PHP_EOL, FILE_APPEND); // デバッグ用ログ

    $data = json_decode($inputData, true);

    // デコード失敗時の対応
    if ($data === null) {
        echo json_encode(["error" => "JSONのデコードに失敗しました", "inputData" => $inputData]);
        exit;
    }

    // SQLの準備と実行
    $sql = $pdo->prepare('SELECT up_hp, up_mp, up_pow, up_def, up_speed, up_luck FROM job WHERE job_id = ?');
    $sql->execute([$data['job_id']]);

    // データ取得
    $levelUpData = $sql->fetch(PDO::FETCH_ASSOC);

    // データが見つからない場合
    if (!$levelUpData) {
        echo json_encode(["error" => "指定されたjob_idに対応するデータが見つかりません", "job_id" => $data['job_id']]);
        exit;
    }

    // 正常データの返却
    echo json_encode(["levelUpData" => $levelUpData]);

} catch (PDOException $e) {
    // データベースエラーの対応
    echo json_encode(["error" => "データベースエラーが発生しました", "message" => $e->getMessage()]);
    exit;
} catch (Exception $e) {
    // 一般的なエラーの対応
    echo json_encode(["error" => "予期せぬエラーが発生しました", "message" => $e->getMessage()]);
    exit;
}
