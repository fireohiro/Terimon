<?php session_start(); ?>
<?php
if (!isset($_SESSION['user_id'])) {
    header('Location: login.php');
    exit();
}
?>
<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>テリモン</title>
    <link rel="icon" href="src/image/favicon.ico">
    <style>
        /* ゲームの表示場所のCSS */
        html,
        body,
        .container {
            margin: 0px;
            height: 100vh;
            width: 100vw;
            overflow: hidden;
            background: #d7d7d7;
        }
    </style>
    <!-- Phaserの読み込み -->
    <script src="https://cdn.jsdelivr.net/npm/phaser@v3.86.0/dist/phaser.min.js"></script>
    <!-- matter.jsプラグインの読み込み -->
    <script src="//cdn.jsdelivr.net/npm/phaser-matter-collision-plugin"></script>
</head>
<body>
    <!-- ゲームを表示するコンテナ -->
    <div class="container" id="game-container"></div>
    <!-- メインスクリプト読み込み -->
    <script src="src/main.js" type="module"></script>
</body>
</html>