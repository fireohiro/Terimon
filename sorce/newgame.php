<?php
    session_start();
    require '../modules/DBconnect.php';
    
    $job_id = $_SESSION['user']['job_id'];

    $stmt = $pdo->prepare('SELECT * FROM job WHERE job_id = ?');
    $stmt->execute([$job_id]);
    $job = $stmt->fetch();

    $id = $_SESSION["user"]['account_id'];
    $name = $_SESSION["user"]['account_name'];

    if ($job) {
        $hp = $job['hp'];
        $mp = $job['mp'];
        $pow = $job['pow'];
        $def = $job['def'];
        $speed = $job['speed'];
        $luck = $job['lack'];
    } else {
        echo "Error: 該当する職業が見つかりません。";
    }

    $sql = $pdo->prepare('UPDATE account SET level = ? ,experimence = ?, hp = ?, hp_nokori = ?, mp = ?, mp_nokori = ?, pow = ?, def = ?, speed = ?, luck = ?, money = ?, gear_id = ?, map_id = ?, savepoint_x = ?, savepoint_y = ? ,event_flg = ?');
    $sql->execute([1, 0, $hp, $hp, $mp, $mp, $pow, $def, $speed, $luck, 0, NULL, 1, 1, 1, 0]);

    $_SESSION['user'] = [];
    
    $_SESSION["user"] = [
        "account_id" => $id,
        "account_name" => $name,
        "level" => 1,
        "experimence" => 0,
        "job_id" => $job_id,
        "hp" => $hp,
        "hp_nokori" => $hp,
        "mp" => $mp,
        "mp_nokori" => $mp,
        "pow" => $pow,
        "def" => $def,
        "speed" => $speed,
        "luck" => $luck,
        "money" => 0,
        "gear_id" => 0,
        "savepoint_x" => 1,
        "savepoint_y" => 1,
        "event_flg" => 1,
        "pass" => 0,
    ];
?>


<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="refresh" content="0;URL=index.php">
    <link rel="stylesheet" href="../css/title.css">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=RocknRoll+One&display=swap" rel="stylesheet">
    <title>テリモンのわんだーらんど</title>
</head>
<body>

</body>
</html>