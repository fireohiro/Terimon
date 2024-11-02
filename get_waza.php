<?php
    session_start();
    require 'db-connect.php';
    $pdo=new PDO($connect,USER,PASS);
    $data = json_decode(file_get_contents("php://input"),true);
    $waza_ids = $data['waza_id'];

    $magic = [];

    foreach($waza_ids as $waza_id){
        $sql=$pdo->prepare('select * from waza_list where waza_id = ?');
        $sql->execute([$waza_id]);
        $result = $sql->get_result();

        if($row = $result->fetch_assoc()){
            $magic[[] = $row;]
        }
    }
    echo json_encode(['magic' => $magic]);
?>