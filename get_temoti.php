<?php
    session_start();
    require 'db-connect.php';
    $pdo=new PDO($connect,USER,PASS);

    $sql = $pdo->prepare('
        SELECT f.*, m.monster_name , m.resist
        FROM friends f
        JOIN monster m ON f.monster_id = m.monster_id
        WHERE f.account_id = ? 
        AND f.friend_id IN (SELECT friend_id FROM temoti)
    ');
    $sql->execute([$_SESSION['user']['account_id']]);
    $result = $sql->fetchAll();

    //JSON形式で返す
    echo json_encode($result);
?>