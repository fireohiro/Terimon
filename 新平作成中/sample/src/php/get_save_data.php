<?php
session_start();
require "../php/db-connect.php";

header('Content-Type: application/json');

try {
    $sql = $pdo->prepare("SELECT * FROM SaveData WHERE save_id = ?");
    $sql->execute([$_SESSION['save_id']]);
    $savedata = $sql->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($savedata);
} catch (PDOException $e) {
    echo json_encode(["error" => $e->getMessage()]);
}
?>