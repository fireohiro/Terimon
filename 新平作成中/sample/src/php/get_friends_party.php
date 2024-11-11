<?php
session_start();
require "../php/db-connect.php";

header('Content-Type: application/json');

try {
    $sql = $pdo->prepare("SELECT * FROM Friends_party WHERE save_id = ?");
    $sql->execute([$_SESSION['save_id']]);
    $friends_party = $sql->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($friends_party);
} catch (PDOException $e) {
    echo json_encode(["error" => $e->getMessage()]);
}
?>