<?php
    session_start();
    require 'db-connect.php';
    if($_SERVER['REQUEST_METHOD'] === 'POST'){
        //JSONデータを受け取って取り出す
        $inputData = file_get_contents('php:input');
        //JSON形式のデータをPHPの連想配列として変数に入れる
        $data = json_decode($inputData,true);

        //データを取り出す
        $player = $data['playerStatus'];
        $friends = [
            $data['friend1Status'],
            $data['friend2Status'],
            $data['friend3Status'],
        ];
        
        $pdo = new PDO($connect,USER,PASS);
        $sql = $pdo->prepare('update account set level = ? , experience = ?,hp = ?,hp_nokori = ?,mp = ?,mp_nokori = ?,pow = ?,def = ?,speed = ?,luck = ?,money = ?,gear_id = ?,map_id = ?,savepoint_x = ?,savepoint_y = ?,eventflg = ? where account_id = ?');
        $sql->execute([$player['level'],$player['experience'],$player['hp'],$player['hp_nokori'],$player['mp'],$player['mp_nokori'],$player['pow'],$player['def'],$player['speed'],$player['luck'],$player['money'],$player['gear_id'],$player['map_id'],$player['savepoint_x'],$player['savepoint_y'],$player['eventflg'],$player['account_id']]);

        //連れている仲間モンスターの更新
        foreach($friends as $friend){
            //friend_idが存在する場合のみ更新を実施
            if(isset($frined['friend_id'])){
                //テーブル更新処理
                $sql = $pdo->prepare('update friends set level = ?,experience = ?,hp = ?,hp_nokori=?,mp=?,mp_nokori=?,pow=?,def=?,speed=?,luck=?,buff_time=?,waza_id1=?,waza_id2=?,waza_id3=?,waza_id4=? where friend_id=?');
                $sql->execute([$friend['level'],$friend['experience'],$friend['hp'],$friend['hp_nokori'],$friend['mp'],$friend['mp_nokori'],$friend['pow'],$friend['def'],$friend['speed'],$friend['luck'],$friend['buff_time'],$friend['waza_id1'],$friend['waza_id2'],$friend['waza_id3'],$friend['waza_id4'],$friend['friend_id']]);
            }
        }

        echo json_encode(['success' => true]);//成功メッセージをJSON形式で返す
    }
?>