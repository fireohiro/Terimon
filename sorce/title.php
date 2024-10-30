<?php
session_start();
require '../modules/DBconnect.php';
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="../css/title.css">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=RocknRoll+One&display=swap" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=M+PLUS+1p:wght@100;300;400;500;700;800;900&display=swap" rel="stylesheet">
    <title>テリモンのわんだーらんど</title>
</head>
<body>
    <h1>テリモンのわんだーらんど</h1>
    <div class="field">
        <a href="newgame.php" class="location"><div class="font">ニューゲーム</div></a>
        <p class="border">　</p>
        <a href="index.php" class="location"><div class="font">コンティニュー</div></a>
    </div>
</body>
</html>