<?php
    require 'db-connect.php';
    $pdo=new PDO($connect,USER,PASS);
    //ボスをランダムで３体出現させる
    $sql=$pdo->query("select * from monster where bunrui = '雑魚' order by rand() limit 3");
    $result = $sql->fetchAll();
    $enemyData = [];
    foreach($result as $monster){
        $maxhp = rand($monster['hp_kagen'],$monster['hp_zyougen']);
        $maxmp = rand($monster['mp_kagen'],$monster['mp_zyougen']);
        //モンスターのステータスを決めて格納します
        $enemy = [
            'id' => $monster['monster_id'],
            'name' => $monster['monster_name'],
            'gazou' => $monster['gazou'],
            'resist' => $monster['resist'],
            'hp' => $maxhp,
            'hp_nokori' => $maxhp,
            'mp' => $maxmp,
            'mp_nokori' => $maxmp,
            'pow' => rand($monster['pow_kagen'],$monster['pow_zyougen']),
            'def' => rand($monster['def_kagen'],$monster['def_zyougen']),
            'speed' => rand($monster['speed_kagen'],$monster['speed_zyougen']),
            'luck' => $monster['luck'],
            'experience' => $monster['experience'],
            'drop_money' => $monster['drop_money'],
            'type' => 'enemy'
        ];
        $enemyData[] = $enemy;
    }
    //JSON形式で返す
    header('Content-Type:application/json');
    echo json_encode($enemyData);
?>