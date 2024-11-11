<?php
session_start();
require "../php/db-connect.php";

header('Content-Type: application/json');

try {
    $sql = $pdo->prepare("SELECT * FROM Inventory_Gear WHERE save_id = ?");
    $sql->execute([$_SESSION['save_id']]);
    $inventory_gear = $sql->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($inventory_gear);
} catch (PDOException $e) {
    echo json_encode(["error" => $e->getMessage()]);
}
?>