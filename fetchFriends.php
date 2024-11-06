<?php
// データベース接続情報
    session_start();
    require 'db-connect.php';

    // データベースに接続
    $pdo = new PDO($connect, USER, PASS);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // temotiテーブルからfriend_idを取得
    $stmt = $pdo->prepare("SELECT account_id, friend_id FROM temoti");
    $stmt->execute();

    $friends = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // JSONで出力
    echo json_encode($friends);
?>