<?php
require 'db-connect.php';

// クライアントからのリクエストデータを取得
$request = json_decode(file_get_contents('php://input'), true);

// バトル開始のリクエストが来た場合の処理
if ($request['action'] === 'start') {
    // プレイヤーと敵の初期ステータスをデータベースから取得
    $player = getPlayerStatus($pdo, 1); // 1はプレイヤーのIDの例
    $enemy = getEnemyStatus($pdo, 1);   // 1は敵のIDの例

    // プレイヤーと敵の初期データをJSON形式で返す
    echo json_encode(['player' => $player, 'enemy' => $enemy]);
} elseif ($request['action'] === 'attack') {
    // 攻撃者がプレイヤーか敵かを確認
    if ($request['attacker'] === 'player') {
        // プレイヤーが攻撃した場合、敵にダメージを与える処理を呼び出す
        $enemy = attackEnemy($pdo, 1);  // 1は敵のIDの例
    } elseif ($request['attacker'] === 'enemy') {
        // 敵が攻撃した場合、プレイヤーにダメージを与える処理を呼び出す
        $player = attackPlayer($pdo, 1);  // 1はプレイヤーのIDの例
    }

    // 最新のプレイヤーと敵のHPを取得して返す
    $player = getPlayerStatus($pdo, 1); // プレイヤーの最新データを取得
    $enemy = getEnemyStatus($pdo, 1);   // 敵の最新データを取得
    echo json_encode(['player' => $player, 'enemy' => $enemy]); // JSON形式で返す
}

// プレイヤーのステータスをデータベースから取得する関数
function getPlayerStatus($pdo, $playerId) {
    // プレイヤーのHPなどのデータを取得するためのSQL文を準備
    $stmt = $pdo->prepare('SELECT * FROM players WHERE id = :id');
    $stmt->execute(['id' => $playerId]); // プレイヤーのIDを指定して実行
    return $stmt->fetch(PDO::FETCH_ASSOC); // 結果を連想配列として返す
}

// 敵のステータスをデータベースから取得する関数
function getEnemyStatus($pdo, $enemyId) {
    // 敵のHPなどのデータを取得するためのSQL文を準備
    $stmt = $pdo->prepare('SELECT * FROM enemies WHERE id = :id');
    $stmt->execute(['id' => $enemyId]); // 敵のIDを指定して実行
    return $stmt->fetch(PDO::FETCH_ASSOC); // 結果を連想配列として返す
}

// プレイヤーが敵を攻撃した場合の処理
function attackEnemy($pdo, $enemyId) {
    // プレイヤーが敵に与えるダメージをランダムで決定（例：10～20のダメージ）
    $damage = rand(10, 20);
    
    // 敵のHPを減少させるためのSQL文を準備
    $stmt = $pdo->prepare('UPDATE enemies SET hp = hp - :damage WHERE id = :id');
    $stmt->execute(['damage' => $damage, 'id' => $enemyId]); // ダメージと敵のIDを指定して実行

    return getEnemyStatus($pdo, $enemyId); // 更新された敵のステータスを返す
}

// 敵がプレイヤーを攻撃した場合の処理
function attackPlayer($pdo, $playerId) {
    // 敵がプレイヤーに与えるダメージをランダムで決定（例：5～15のダメージ）
    $damage = rand(5, 15);
    
    // プレイヤーのHPを減少させるためのSQL文を準備
    $stmt = $pdo->prepare('UPDATE players SET hp = hp - :damage WHERE id = :id');
    $stmt->execute(['damage' => $damage, 'id' => $playerId]); // ダメージとプレイヤーのIDを指定して実行

    return getPlayerStatus($pdo, $playerId); // 更新されたプレイヤーのステータスを返す
}