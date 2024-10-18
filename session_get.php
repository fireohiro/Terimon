<?php
    session_start();
    require 'db-connect.php';
    header('Content-Type:application/json');
    echo json_encode($_SESSION["user"]);
?>