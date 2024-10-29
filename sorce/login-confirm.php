<?php
session_start();
require "../modules/DBconnect.php";

// $pdo = new PDO($connect, USER, PASS);
$sql = $pdo->prepare('SELECT * FROM account WHERE account_name = ? AND pass = ?');
$sql->execute([$_POST["account_name"], $_POST["password"]]);

// SQLの結果が1行取得できた場合にのみ、セッションに情報を格納
if ($row = $sql->fetch()) {
    $_SESSION["user"] = [
        "account_id" => $row["account_id"],
        "account_name" => $row["account_name"],
        "level" => $row["level"],
        "experience" => $row["experience"],
        "job_id" => $row["job_id"],
        "hp" => $row["hp"],
        "hp_nokori" => $row["hp_nokori"],
        "mp" => $row["mp"],
        "mp_nokori" => $row["mp_nokori"],
        "pow" => $row["pow"],
        "def" => $row["def"],
        "speed" => $row["speed"],
        "luck" => $row["luck"],
        "money" => $row["money"],
        "gear_id" => $row["gear_id"],
        "savepoint_x" => $row["savepoint_x"],
        "savepoint_y" => $row["savepoint_y"],
        "event_flg" => $row["event_flg"],
        "pass" => $row["pass"],
    ];

    // ログイン成功した場合はtitle.phpにリダイレクト
    header('Location: title.php');
    exit();
} else {
    // ログイン失敗した場合はエラーメッセージ付きでlogin.phpにリダイレクト
    header('Location: login.php?hogeA=アカウント名またはパスワードが違います');
    exit();
}
?>
