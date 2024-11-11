<?php
session_start();
require "../php/db-connect.php";

header('Content-Type: application/json');

try {
    $sql = $pdo->prepare("SELECT * FROM Friends WHERE save_id = ?");
    $sql->execute([$_SESSION['save_id']]);
    $friends = $sql->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($friends);
} catch (PDOException $e) {
    echo json_encode(["error" => $e->getMessage()]);
}
?>