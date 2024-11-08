<?php
    session_start();
    header('Content-Type:application/json');
    require 'db-connect.php';
    $pdo = new PDO($connect,USER,PASS);
    $data = json_decode(file_get_contents("php://input"),true);
    $account_id = $data['account_id'];

    $items = [];
    $sql=$pdo->prepare(
        'SELECT i.*, gi.su 
        FROM item AS i 
        INNER JOIN get_item AS gi ON i.item_id = gi.item_id 
        WHERE gi.account_id = ? AND gi.su >= 1');
    $sql->execute([$account_id]);
    $items = $sql->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode(['items' => $items]);
?>