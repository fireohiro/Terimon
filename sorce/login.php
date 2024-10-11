<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="../css/login.css">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=RocknRoll+One&display=swap" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=BIZ+UDPMincho:wght@400;700&display=swap" rel="stylesheet">
    <title>テリモンのわんだーらんど</title>
</head>
<body>
    <h1>テリモンのわんだーらんど</h1>
    <div class="field">    
    <form action="login-confirm.php" method="post">

    <?php unset($_SESSION['user']); ?>

    <div class="font1">アカウント名：<input type="text" name="account_name" require></div>
    <div class="font1">パスワード：　<input type="password" name="password" require></div>
    <button type="submit" ><div class="font2">ログイン</div></button><br>
    </form>
    <button type="button" onclick="location.href='b.html'"><div class="font2">新規作成</div></button>
    </div>

    <?php
    if(isset($_GET['hogeA'])){
        echo '<p style="color:red">',htmlspecialchars($_GET['hogeA']),'</p>';
    }else{
        echo '<p style="color:red"><br></p>';
    }
?>

</body>
</html>