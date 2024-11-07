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
        $luck = $job['luck'];
    } else {
        echo "Error: 該当する職業が見つかりません。";
    }

    $sql = $pdo->prepare('UPDATE account SET level = ? ,experience = ?, hp = ?, hp_nokori = ?, mp = ?, mp_nokori = ?, pow = ?, def = ?, speed = ?, luck = ?, money = default, gear_id = default, map_id = default, savepoint_x = default, savepoint_y = default ,event_flg = default where account_id = ?');
    $sql->execute([1, 0, $hp, $hp, $mp, $mp, $pow, $def, $speed, $luck,$id]);

    $_SESSION['user'] = [];
    
    $_SESSION["user"] = [
        "account_id" => $id,
        "account_name" => $name,
        "level" => 1,
        "experience" => 0,
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
        "map_id" => 1,
        "savepoint_x" => 288,
        "savepoint_y" => 320,
        "event_flg" => 1,
        "pass" => 0,
    ];
    header("Location: ../index.php");
    exit; 
?>