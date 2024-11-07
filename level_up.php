<?php
    require 'db-connect.php';
    $pdo = new PDO($connect,USER,PASS);

    header('Content-Type:appplication/json');

    $inputData = file_get_contents('php://input');
    $data = json_decode($inputData,true);

    $sql=$pdo->prepare('select up_hp,up_mp,up_pow,up_def,up_speed,up_luck from job where job_id = ?');
    $sql->execute([$data['job_id']]);
    $levelUpData = $sql->fetch(PDO::FETCH_ASSOC);

    echo json_encode([
        "levelUpData" => $levelUpData
    ]);
?>