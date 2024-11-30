<?php
    require 'db-connect.php';
    $pdo=new PDO($connect,USER,PASS);
    //ボスをランダムで３体出現させる
    $sql=$pdo->query("select * from monster where bunrui = '雑魚' and monster_id between 13 and 17 order by rand() limit 3");
    $result = $sql->fetchAll();
    $enemyData = [];
    foreach($result as $monster){
        $wazaList = [4];
        $sql=$pdo->prepare('SELECT waza_id FROM monster_waza WHERE monster_id = ? ORDER BY RAND() LIMIT 4');
        $sql->execute([$monster['monster_id']]);
        $i = 0;
        while ($row = $sql->fetch(PDO::FETCH_ASSOC)) {
            $wazaList[$i] = $row['waza_id'];
            $i++;
        }
        $maxhp = rand($monster['hp_kagen'],$monster['hp_zyougen']);
        $maxmp = rand($monster['mp_kagen'],$monster['mp_zyougen']);
        //モンスターのステータスを決めて格納します
        $enemy = [
            'id' => $monster['monster_id'],
            'name' => $monster['monster_name'],
            'level' => $monster['level'],
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
            'waza_id1' => $wazaList[0],
            'waza_id2' => $wazaList[1],
            'waza_id3' => $wazaList[2],
            'waza_id4' => $wazaList[3],
            'type' => 'enemy'
        ];
        $enemyData[] = $enemy;
    }
    //JSON形式で返す
    header('Content-Type:application/json');
    echo json_encode($enemyData);
?>