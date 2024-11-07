<?php
    require 'db-connect.php';
    $pdo=new PDO($connect,USER,PASS);

    header('Content-Type: application/json');

    $inputData =file_get_contents('php://input');
    $wazaList = [4];

    $data = json_decode($inputData,true);
    $sql=$pdo->prepare('insert into friends values(null,?,?,FLOOR(1+RAND() * 7),default,default,?,?,?,?,?,?,?,?,default,?,?,?,?)');
    $sss=$pdo->prepare('select waza_id from monster_waza where monster_id = ? order by rand() limit 4');
    $sss->execute([$data['enemy']['id']]);
    $i = 0;
    foreach($row as $sss){
        $wazaList[$i] = $row['waza_id'];
        $i++;
    }
    $sql->execute([
        $data['enemy']['name'],
        $data['enemy']['id'],
        $data['enemy']['hp'],
        $data['enemy']['hp'],
        $data['enemy']['mp'],
        $data['enemy']['mp'],
        $data['enemy']['pow'],
        $data['enemy']['def'],
        $data['enemy']['speed'],
        $data['enemy']['luck'],
        $wazaList[1],
        $wazaList[2],
        $wazaList[3],
        $wazaList[4]
    ]);
?>