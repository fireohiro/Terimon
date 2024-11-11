<?php
session_start();
require "../php/db-connect.php";

header('Content-Type: application/json');

try {
    $sql = $pdo->prepare("SELECT * FROM Inventory WHERE save_id = ?");
    $sql->execute([$_SESSION['save_id']]);
    $inventory = $sql->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($inventory);
} catch (PDOException $e) {
    echo json_encode(["error" => $e->getMessage()]);
}
?>