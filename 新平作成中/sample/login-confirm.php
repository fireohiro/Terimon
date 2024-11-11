<?php
session_start();
require "src/php/db-connect.php";

if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    $loginId = $_POST["loginId"];
    $password = $_POST["password"];

    try {
        $sql = $pdo->prepare('SELECT * FROM User WHERE loginId = ?');
        $sql->execute([$loginId]);
        $user = $sql->fetch(PDO::FETCH_ASSOC);

        if (password_verify($password, $user['password_hash'])) {
            // ユーザー認証が成功した場合、セッションにユーザー情報を保存
            $_SESSION['user_id'] = $user['user_id'];

            // セーブデータの取得
            $sql2 = $pdo->prepare('SELECT * FROM SaveData WHERE user_id = ?');
            $sql2->execute([$user['user_id']]);
            $savedata = $sql2->fetch(PDO::FETCH_ASSOC);

            if ($savedata) {
                // セーブデータが存在する場合、セッションに格納
                $_SESSION['save_id'] = $savedata['save_id'];
                // ゲームの開始ページにリダイレクト
                header('Location: index.php');
                exit();
            } else {
                // セーブデータが見つからなかった場合の処理
                // 新しいセーブデータを作成する処理を追加
                $sql3 = $pdo->prepare('INSERT INTO SaveData VALUES (null,?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');
                $sql3->execute([
                    $user['user_id'], 
                    'ななし', // 初期キャラクター名
                    0,  // 初期ゲーム進行度
                    1,  // 初期レベル
                    0,  // 初期経験値
                    100,  // 初期HP
                    100,  // 初期現在HP
                    50,  // 初期MP
                    50,  // 初期現在MP
                    1,  // 初期ジョブID
                    10,  // 初期ちから
                    10,  // 初期まもり
                    10,  // 初期スピード
                    10,  // 初期運の良さ
                    10000,  // 初期お金
                    1,  // 初期マップID
                    720,  // 初期セーブポイントX
                    190,  // 初期セーブポイントY
                    date('Y-m-d H:i:s')  // 現在の日時
                ]);
                
                // 新しいセーブデータのIDを取得
                $new_save_id = $pdo->lastInsertId();
                $_SESSION['save_id'] = $new_save_id;

                // ゲームの開始ページにリダイレクト
                header('Location: index.php');
                exit();
            }
        } else {
            // ログイン失敗時
            header('Location: login.php?error_message=アカウント名またはパスワードが違います');
            exit();
        }

    } catch (PDOException $e) {
        // ログインエラー時
        error_log('Database error: ' . $e->getMessage()); // エラーログに記録
        header('Location: login.php?error_message=サーバーエラーが発生しました。しばらくしてからもう一度お試しください。');
        exit();
    }
}
?>