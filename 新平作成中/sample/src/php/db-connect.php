<?php

    // データベース接続情報を定数で定義
    const SERVER = 'mysql311.phy.lolipop.lan';
    const DBNAME = 'LAA1517449-terimon';
    const USER = 'LAA1517449';
    const PASS = 'pass0423';

    $connect = 'mysql:host='. SERVER . ';dbname='. DBNAME . ';charset=utf8';

    try {
        
        // PDOを使ってデータベースに接続
        $pdo = new PDO($connect, USER, PASS);

        // エラーモードを例外に設定
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    } catch (PDOException $e) {

        // エラーハンドリング
        die("接続エラー: " . $e->getMessage());

    }

?>