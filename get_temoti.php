<?php
    session_start();
    require 'db-connect.php';
    $pdo=new PDO($connect,USER,PASS);

    $sql=$pdo->prepare('select * from friends where account_id = ? and friend_id in (select friend_id from temoti)');
    $sql->execute([$_SESSION['user']['account_id']]);
    $result = $sql->fetchAll();

    //JSON形式で返す
    echo json_encode($result);
?>