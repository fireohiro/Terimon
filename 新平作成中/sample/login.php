<?php session_start(); ?>
<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="src/css/login.css">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=RocknRoll+One&display=swap" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=BIZ+UDPMincho:wght@400;700&display=swap" rel="stylesheet">
    <title>テリモンのわんだーらんど</title>
    <link rel="icon" href="src/image/favicon.ico">
</head>
<body>
    <h1>テリモンのわんだーらんど</h1>
    <div class="field">    
        <form action="login-confirm.php" method="post">

            <!-- セッションリセット -->
            <?php session_unset(); ?>

            <div class="font1">アカウント名：<input type="text" name="loginId" required></div>
            <div class="font1">パスワード：　<input type="password" name="password" required></div>
            <button type="submit" ><div class="font2">ログイン</div></button><br>

        </form>
        <button type="button" onclick="location.href='account-create.php'"><div class="font2">新規作成</div></button>
    </div>

    <!-- ログインできなかった場合 -->
    <?php
    if(isset($_GET['error_message'])){
        echo '<p style="color:red">',htmlspecialchars($_GET['error_message']),'</p>';
    }else{
        echo '<p style="color:red"><br></p>';
    }
    ?>

</body>
</html>