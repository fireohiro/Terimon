<?php session_start();
require '../modules/DBconnect.php';

        $hp = "";
        $mp = "";
        $pow = "";
        $def = "";
        $speed = "";
        $luck = "";

if (isset($_POST['job_id'])) {
    $job_id = $_POST['job_id'];

    try {
        $stmt = $pdo->prepare('SELECT * FROM job WHERE job_id = ?');
        $stmt->execute([$job_id]);
        $job = $stmt->fetch();

        if ($job) {
            $job_name = $job['job_name'];
            $name = $_POST['name'];
            $pass = $_POST['password'];
            $hp = $job['hp'];
            $mp = $job['mp'];
            $pow = $job['pow'];
            $def = $job['def'];
            $speed = $job['speed'];
            $luck = $job['lack'];
        } else {
            echo "Error: 該当する職業が見つかりません。";
        }
    } catch (PDOException $e) {
        echo "Error: " . $e->getMessage();
    }
} else {
    echo "Error: job_id が選択されていません。";
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $_SESSION['name'] = $_POST['name'];
    $_SESSION['password'] = $_POST['password'];
    $_SESSION['hp'] = $hp;
    $_SESSION['mp'] = $mp;
    $_SESSION['pow'] = $pow;
    $_SESSION['def'] = $def;
    $_SESSION['speed'] = $speed;
    $_SESSION['luck'] = $luck;
}

?>

?>
<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="../css/account-create.css">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=RocknRoll+One&display=swap" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=M+PLUS+1p:wght@100;300;400;500;700;800;900&display=swap" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=M+PLUS+Rounded+1c:wght@100;300;400;500;700;800;900&display=swap" rel="stylesheet">
    <title>アカウント作成</title>
</head>
<body>
    <h1>アカウント作成</h1>
    <div class="field">
        <h2>アカウント情報を入力してください</h2>

        <form action="account-create.php" method="post" class="form">
            <div class="content-row">
                <div class="block"><div class="font1">アカウント名：</div><input type="text" name="name" value="<?php echo htmlspecialchars($name ?? ''); ?>"></div>
                <div class="block"><div class="font1 space">パスワード：</div><input type="password" name="password" value="<?php echo htmlspecialchars($pass ?? ''); ?>"></div>
            </div>

            <p class="border">　</p>

            <div class="content-row-m">
                <div class="font1">職　　　　業：</div>
            <select name="job_id" id="jobSelect" onchange="this.form.submit()">
            <option value="" selected hidden><?php echo htmlspecialchars($job_name ?? ''); ?></option>
            <?php
            try {
                $sql = $pdo->query('SELECT * FROM job');
                foreach ($sql as $row) {
                    echo '<option value="' . $row['job_id'] . '">' . $row['job_name'] . '</option>';
                }
            } catch (PDOException $e) {
                echo "Error: " . $e->getMessage();
            }
            ?>
            </select>

        <div class="status3">Lv</div><div class="status-value3">1</div>

        </div>

<div class="content-row-m">
    <div class="status1">HP</div><div class="status-value1"><?php echo $hp; ?></div>
    <div class="status2">MP</div><div class="status-value2"><?php echo $mp; ?></div>
    <div class="status3-3">ちから</div><div class="status-value3"><?php echo $pow; ?></div>
</div>

<div class="content-row-m">
    <div class="status1-3">まもり</div><div class="status-value1"><?php echo $def; ?></div>
    <div class="status2-4">すばやさ</div><div class="status-value2"><?php echo $speed; ?></div>
    <div class="status3">運</div><div class="status-value3"><?php echo $luck; ?></div>
</div>

<button type="button" onclick="location.href='account-create-complete.php'"><div class="font2">作成</div></button>

</form>
</body>
</html>
