<?php
session_start();
require "../php/db-connect.php";

header('Content-Type: application/json');

try {
    $sql = $pdo->query("SELECT * FROM Monster_Waza");
    $monster_waza = $sql->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($monster_waza);
} catch (PDOException $e) {
    echo json_encode(["error" => $e->getMessage()]);
}
?>