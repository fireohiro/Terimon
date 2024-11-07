<?php
require 'db-connect.php';
$pdo = new PDO($connect, USER, PASS);

// Content-TypeをJSONとして返す
header('Content-Type: application/json');

// POSTデータを受け取る
$inputData = file_get_contents('php://input');

// JSONデコード
$data = json_decode($inputData, true);
    // アカウントデータの更新
    $sql = $pdo->prepare('UPDATE account SET 
        level = ?, experience = ?, hp = ?, hp_nokori = ?, mp = ?, mp_nokori =?, 
        pow = ?, def = ?, speed = ?, luck = ?, money = ?, gear_id = ?, 
        map_id = ?, savepoint_x = ?, savepoint_y = ?, eventflg = ? 
        WHERE account_id = ?');
    
    $sql->execute([
        $data['playerStatus']['level'],
        $data['playerStatus']['experience'],
        $data['playerStatus']['hp'],
        $data['playerStatus']['hp_nokori'],
        $data['playerStatus']['mp'],
        $data['playerStatus']['mp_nokori'],
        $data['playerStatus']['pow'],
        $data['playerStatus']['def'],
        $data['playerStatus']['speed'],
        $data['playerStatus']['luck'],
        $data['playerStatus']['money'],
        $data['playerStatus']['gear_id'],
        $data['playerStatus']['map_id'],
        $data['playerStatus']['savepoint_x'],
        $data['playerStatus']['savepoint_y'],
        $data['playerStatus']['eventflg'],
        $data['playerStatus']['account_id']
    ]);

    // 仲間のデータを更新（friend1Status）
    if (isset($data['friend1Status'])) {
        $sql = $pdo->prepare('UPDATE friends SET 
            level = ?, experience = ?, hp = ?, hp_nokori = ?, mp = ?, mp_nokori =?,
            pow = ?, def = ?, speed = ?, luck = ?, buff_time = ?, waza_id1 = ?, 
            waza_id2 = ?, waza_id3 = ?, waza_id4 = ? WHERE friend_id = ?');
        
        $sql->execute([
            $data['friend1Status']['level'],
            $data['friend1Status']['experience'],
            $data['friend1Status']['hp'],
            $data['friend1Status']['hp_nokori'],
            $data['friend1Status']['mp'],
            $data['friend1Status']['mp_nokori'],
            $data['friend1Status']['pow'],
            $data['friend1Status']['def'],
            $data['friend1Status']['speed'],
            $data['friend1Status']['luck'],
            $data['friend1Status']['buff_time'],
            $data['friend1Status']['waza_id1'],
            $data['friend1Status']['waza_id2'],
            $data['friend1Status']['waza_id3'],
            $data['friend1Status']['waza_id4'],
            $data['friend1Status']['friend_id']
        ]);
    }

    // 友達2のデータ更新（friend2Status）
    if (isset($data['friend2Status'])) {
        $sql = $pdo->prepare('UPDATE friends SET 
            level = ?, experience = ?, hp = ?, hp_nokori = ?, mp = ?, mp_nokori =?,
            pow = ?, def = ?, speed = ?, luck = ?, buff_time = ?, waza_id1 = ?, 
            waza_id2 = ?, waza_id3 = ?, waza_id4 = ? WHERE friend_id = ?');
        
        $sql->execute([
            $data['friend2Status']['level'],
            $data['friend2Status']['experience'],
            $data['friend2Status']['hp'],
            $data['friend2Status']['hp_nokori'],
            $data['friend2Status']['mp'],
            $data['friend2Status']['mp_nokori'],
            $data['friend2Status']['pow'],
            $data['friend2Status']['def'],
            $data['friend2Status']['speed'],
            $data['friend2Status']['luck'],
            $data['friend2Status']['buff_time'],
            $data['friend2Status']['waza_id1'],
            $data['friend2Status']['waza_id2'],
            $data['friend2Status']['waza_id3'],
            $data['friend2Status']['waza_id4'],
            $data['friend2Status']['friend_id']
        ]);
    }

    // 友達3のデータ更新（friend3Status）
    if (isset($data['friend3Status'])) {
        $sql = $pdo->prepare('UPDATE friends SET 
            level = ?, experience = ?, hp = ?, hp_nokori = ?, mp = ?, mp_nokori =?,
            pow = ?, def = ?, speed = ?, luck = ?, buff_time = ?, waza_id1 = ?, 
            waza_id2 = ?, waza_id3 = ?, waza_id4 = ? WHERE friend_id = ?');
        
        $sql->execute([
            $data['friend3Status']['level'],
            $data['friend3Status']['experience'],
            $data['friend3Status']['hp'],
            $data['friend3Status']['hp_nokori'],
            $data['friend3Status']['mp'],
            $data['friend3Status']['mp_nokori'],
            $data['friend3Status']['pow'],
            $data['friend3Status']['def'],
            $data['friend3Status']['speed'],
            $data['friend3Status']['luck'],
            $data['friend3Status']['buff_time'],
            $data['friend3Status']['waza_id1'],
            $data['friend3Status']['waza_id2'],
            $data['friend3Status']['waza_id3'],
            $data['friend3Status']['waza_id4'],
            $data['friend3Status']['friend_id']
        ]);
    }
?>
