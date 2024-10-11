<?php
session_start();
require 'db-connect.php';

function getRandomMonsters($pdo){
    //monsterテーブルからランダムで３体のモンスターを選択
    $sql = "SELECT * FROM monster ORDER BY RAND() LIMIT 3";
    $result = $pdo->query($sql);
    $monsters = [];

    while($row = $result->fetch_assoc()){
        $monster = [
            'id' => $row['monster_id'],
            'name' => $row['monster_name'],
            'maxhp' => rand($row['hp_kagen'], $row['hp_zyougen']),
            'maxmp' => rand($row['mp_kagen'], $row['mp_zyougen']),
            'pow' => rand($row['pow_kagen'], $row['pow_zyougen']),
            'def' => rand($row['def_kagen'], $row['def_zyougen']),
            'speed' => rand($row['speed_kagen'], $row['speed_zyougen']),
            'lack' => 5,
            'skills' => getRandomSkills($row['monster_id'], $pdo) // 修正: $row['id']を$monsterIdに修正
        ];
        $monsters[] = $monster;
    }
    return $monsters;
}

function getRandomSkills($monsterId, $pdo){
    //monster_wazaテーブルからモンスターの技をランダムで４つ取得
    $sql = "SELECT * FROM monster_waza WHERE monster_id = $monsterId ORDER BY RAND() LIMIT 4"; // 修正: $monstereId → $monsterId
    $result = $pdo->query($sql);
    $skills = [];
    while($row = $result->fetch_assoc()){
        $skills[] = $row['waza_id'];
    }
    return $skills;
}

function startBattle($pdo){
    $monsters = getRandomMonsters($pdo);
    //プレイヤー情報をDBから取得
    $player = $_SESSION['player'];
    
    //バトル情報の初期化
    $_SESSION['battle'] = [
        'player' => $player,
        'monsters' => $monsters,  // 修正: monstersを$monstersに修正
        'turn' => 0
    ];
}

//バトル開始処理
startBattle($pdo);

//JSONとして返す
header('Content-Type: application/json');
echo json_encode($_SESSION['battle']);
?>
