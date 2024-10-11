<?php

    session_start();
    require "../modules/DBconnect.php";
    
    $pdo = new PDO($connect, USER, PASS);
    $sql = $pdo->prepare('select * from account where mail_address = ?');
    $sql->execute([$_POST["account_name"]]);
    foreach ($sql as $row) {
        if($row["pass"] == $_POST["password"] ){
            $_SESSION["user"]=[
                "account_id" => $row["account_id"],
                "account_name" => $row["account_name"],
                "level" => $row["level"],
                "experimence" => $row["experimence"],
                "job_id" => $row["job_id"],
                "hp" => $row["hp"],
                "hp_nokori" => $row["hp_nokori"],
                "mp" => $row["mp"],
                "mp_nokori" => $row["mp_nokori"],
                "pow" => $row["pow"],
                "def" => $row["def"],
                "speed" => $row["speed"],
                "luck" => $row["luck"],
                "waza_id1" => $row["waza_id1"],
                "waza_id2" => $row["waza_id2"],
                "waza_id3" => $row["waza_id3"],
                "waza_id4" => $row["waza_id4"],
                "money" => $row["money"],
                "gear_id" => $row["gear_id"],
                "savepoint_x" => $row["savepoint_x"],
                "savepoint_y" => $row["savepont_y"],
                "story" => $row["story"],
                "event_flg" => $row["event_flg"],
                "pass" => $row["pass"],
            ];

            if (isset($_SESSION['user'])) {
                header('title.php');
                exit();
            } else {
                header('login.php?hogeA=メールアドレスまたはパスワードが違います');
                exit();
            }
        }
    }
?>
<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>テリモンのわんだーらんど</title>
</head>
<body>
</body>
</html>