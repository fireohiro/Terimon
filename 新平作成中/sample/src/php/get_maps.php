<?php
session_start();
require "../php/db-connect.php";

header('Content-Type: application/json');

try {
    $sql = $pdo->query("SELECT * FROM Maps");
    $maps = $sql->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($maps);
} catch (PDOException $e) {
    echo json_encode(["error" => $e->getMessage()]);
}
?>