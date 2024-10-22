<?php session_start(); ?>
<?php require '../modules/DBconnect.php'; ?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="../css/account-create.css">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=RocknRoll+One&display=swap" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=M+PLUS+1p:wght@100;300;400;500;700;800;900&display=swap" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=M+PLUS+Rounded+1c:wght@100;300;400;500;700;800;900&display=swap" rel="stylesheet">
    <title>Document</title>
</head>
<body>
    <h1>アカウントさくせい</h1>
    <div class="field">
    <h2>アカウント情報を入力してください</h2>

    <form action="account-create-complete.php">

    <div class="content-row">
    <div class="block"><div class="font1">アカウント名：</div><input type="text"></div>
    <div class="block"><div class="font1 space">パスワード：</div><input type="password"></div>
    </div>
    
    <p class="border">　</p>
    
    <div class="content-row-m">
    <div class="font1">職　　　　業：</div>
        <select name="job">
            <option value="" selected hidden></option>
            <?php
                $sql = $pdo->query('Select * From job');
                foreach($sql as $row){
                    echo '<option id="'. $row['job_id'] .'" value="' . $row['job_name'] . '">' . $row['job_name'] . '</option>';
                }
            ?>

        </select>

        <div class="status3">Lv</div><div class="status-value3">1</div>

    </div>

    <div class="content-row-m">
        <div class="status1">HP</div><div class="status-value1">30</div>
        <div class="status2">MP</div><div class="status-value2">30</div>
        <div class="status3-3">ちから</div><div class="status-value3">30</div>
    </div>

    <div class="content-row-m">
        <div class="status1-3">まもり</div><div class="status-value1">30</div>
        <div class="status2-4">すばやさ</div><div class="status-value2">30</div>
        <div class="status3">運</div><div class="status-value3">30</div>
    </div>

    <button type="submit"><div class="font2">作成</div></button>
    </form>
</body>
</html>