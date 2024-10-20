<?php
    require 'db-connect.php';
    $pdo=new PDO($connect,USER,PASS);
    //雑魚をランダムで３体出現させる
    $sql=$pdo->query("select * from monster where bunrui = '雑魚' order by rand() limit 3");
    $result = $sql->fetchAll();
    $enemyData = [];
    foreach($result as $monster){
        //モンスターのステータスを決めて格納します
        $enemy = [
            'id' => $monster['monster_id'],
            'name' => $monster['monster_name'],
            'gazou' => $monster['gazou'],
            'resist' => $monster['resist'],
            'hp' => rand($monster['hp_kagen'],$monster['hp_zyougen']),
            'mp' => rand($monster['mp_kagen'],$monster['mp_zyougen']),
            'pow' => rand($monster['pow_kagen'],$monster['pow_zyougen']),
            'def' => rand($monster['def_kagen'],$monster['def_zyougen']),
            'speed' => rand($monster['speed_kagen'],$monster['speed_zyougen']),
            'lack' => $monster['lack'],
            'experience' => $monster['experience'],
            'drop_money' => $monster['drop_money']
        ];
        $enemyData[] = $enemy;
    }
    //JSON毛k式で返す
    header('Content-Type:application/json');
    echo json_encode($enemyData);
?>