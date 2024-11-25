<?php
session_start();
require 'db-connect.php';
header('Content-Type: application/json');

try {
    $inputData = file_get_contents('php://input');
    $data = json_decode($inputData, true);

    if (!isset($data['enemy'])) {
        echo json_encode(['error' => 'Invalid data format']);
        exit;
    }

    $enemy = $data['enemy'];
    $wazaList = [4];

    $pdo = new PDO($connect, USER, PASS);
    $sql = $pdo->prepare('INSERT INTO friends VALUES (NULL, ?, ?, FLOOR(1+RAND() * 7), ?, DEFAULT, ?, ?, ?, ?, ?, ?, ?, ?, DEFAULT, ?, ?, ?, ?)');
    $sss = $pdo->prepare('SELECT waza_id FROM monster_waza WHERE monster_id = ? ORDER BY RAND() LIMIT 4');
    $sss->execute([$enemy['id']]);

    $i = 0;
    while ($row = $sss->fetch(PDO::FETCH_ASSOC)) {
        $wazaList[$i] = $row['waza_id'];
        $i++;
    }

    $sql->execute([
        $_SESSION['user']['account_id'],
        $enemy['id'],
        $enemy['level'],
        $enemy['hp'],
        $enemy['hp'],
        $enemy['mp'],
        $enemy['mp'],
        $enemy['pow'],
        $enemy['def'],
        $enemy['speed'],
        $enemy['luck'],
        $wazaList[0] ?? NULL,
        $wazaList[1] ?? NULL,
        $wazaList[2] ?? NULL,
        $wazaList[3] ?? NULL,
    ]);

    echo json_encode(['success' => true]);
} catch (PDOException $e) {
    echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
    exit;
} catch (Exception $e) {
    echo json_encode(['error' => 'General error: ' . $e->getMessage()]);
    exit;
}
