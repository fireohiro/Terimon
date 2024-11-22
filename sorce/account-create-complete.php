<?php
    session_start();
    require '../modules/DBconnect.php';
    
    $job_id = $_SESSION['job_id'];
    $name = $_SESSION['name'];
    $pass = $_SESSION['password'];
    $hp = $_SESSION['hp'];
    $mp = $_SESSION['mp'];
    $pow = $_SESSION['pow'];
    $def = $_SESSION['def'];
    $spe = $_SESSION['speed'];
    $luck = $_SESSION['luck'];


    $sql = $pdo->prepare('INSERT INTO account (account_name, level, experience, job_id, hp, hp_nokori, mp, mp_nokori, pow, def, speed, luck, money, savepoint_x, savepoint_y,pass) 
    VALUES (?, 1, 0, ?, ?, ?, ?, ?, ?, ?, ?, ?, 300, 1080, 240, ?)');
    $sql->execute([$name, $job_id, $hp, $hp, $mp, $mp, $pow, $def, $spe, $luck, $pass]);
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="refresh" content="0;URL=login.php">
    <link rel="stylesheet" href="../css/title.css">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=RocknRoll+One&display=swap" rel="stylesheet">
    <title>テリモンのわんだーらんど</title>
</head>
<body>
    
</body>
</html>