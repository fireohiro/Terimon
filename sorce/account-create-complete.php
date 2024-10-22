<?php
    session_start();
    require '../modules/DBconnect.php';
    
    $sql = $pdo->prepare('INSERT INTO account (account_name, level, experimence, job_id, hp, hp_nokori, mp, mp_nokori, pow, def, speed, luck, money) VALUES (?, 1, 0, ?, ?, ?, ?, ?, ?, ?, ?, ?, 300)');
    $sql->execute()
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>テリモンのわんだーらんど</title>
</head>
<body>
    
</body>
</html>