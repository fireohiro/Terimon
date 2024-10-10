// プレイヤーと敵の情報を保持するための変数を宣言
let player, enemy;

// バトルが開始される時に呼び出される関数
function startBattle() {
    // サーバーにPOSTリクエストを送信し、バトルの初期データを取得する
    fetch('battle.php', {
        method: 'POST', // POSTメソッドを使用
        headers: {
            'Content-Type': 'application/json' // JSON形式のデータを送信することを示す
        },
        // バトル開始を示すJSONデータを送信
        body: JSON.stringify({ action: 'start' })
    })
    .then(response => response.json()) // サーバーからの応答をJSON形式に変換
    .then(data => {
        // サーバーから受け取ったプレイヤーと敵のデータを変数に格納
        player = data.player;
        enemy = data.enemy;
        // バトルのUIを表示する関数を呼び出す
        displayBattleUI();
    })
    .catch(error => console.error('Error:', error)); // エラーが発生した場合、コンソールに表示
}

// バトルのユーザーインターフェースを表示する関数
function displayBattleUI() {
    // プレイヤーのHPを画面に表示
    document.getElementById('player-hp').innerText = `HP: ${player.hp}`;
    // 敵のHPを画面に表示
    document.getElementById('enemy-hp').innerText = `HP: ${enemy.hp}`;
    
    // 攻撃ボタンがクリックされた時のイベントリスナーを設定
    document.getElementById('attack-button').addEventListener('click', () => {
        // プレイヤーの攻撃処理を呼び出す
        playerAttack();
    });
}

// プレイヤーの攻撃アクションを処理する関数
function playerAttack() {
    // サーバーにプレイヤーの攻撃を送信するPOSTリクエストを作成
    fetch('battle.php', {
        method: 'POST', // POSTメソッドを使用
        headers: {
            'Content-Type': 'application/json' // JSON形式のデータを送信することを示す
        },
        // プレイヤーが攻撃したことを示すJSONデータを送信
        body: JSON.stringify({ action: 'attack', attacker: 'player' })
    })
    .then(response => response.json()) // サーバーからの応答をJSON形式に変換
    .then(data => {
        // サーバーから受け取った新しいHPを敵とプレイヤーの変数に更新
        enemy.hp = data.enemy.hp;
        player.hp = data.player.hp;

        // HPを画面に更新表示
        document.getElementById('player-hp').innerText = `HP: ${player.hp}`;
        document.getElementById('enemy-hp').innerText = `HP: ${enemy.hp}`;

        // 敵のHPがまだ残っている場合、敵の攻撃を処理する
        if (enemy.hp > 0) {
            enemyAttack();
        } else {
            // 敵が倒れた場合、バトルを終了する
            endBattle('win');
        }
    })
    .catch(error => console.error('Error:', error)); // エラーが発生した場合、コンソールに表示
}

// 敵の攻撃アクションを処理する関数
function enemyAttack() {
    // サーバーに敵の攻撃を送信するPOSTリクエストを作成
    fetch('battle.php', {
        method: 'POST', // POSTメソッドを使用
        headers: {
            'Content-Type': 'application/json' // JSON形式のデータを送信することを示す
        },
        // 敵が攻撃したことを示すJSONデータを送信
        body: JSON.stringify({ action: 'attack', attacker: 'enemy' })
    })
    .then(response => response.json()) // サーバーからの応答をJSON形式に変換
    .then(data => {
        // サーバーから受け取った新しいHPをプレイヤーの変数に更新
        player.hp = data.player.hp;

        // プレイヤーのHPを画面に更新表示
        document.getElementById('player-hp').innerText = `HP: ${player.hp}`;

        // プレイヤーのHPが0以下になった場合、バトルを終了する
        if (player.hp <= 0) {
            endBattle('lose');
        }
    })
    .catch(error => console.error('Error:', error)); // エラーが発生した場合、コンソールに表示
}

// バトル終了処理を行う関数
function endBattle(result) {
    // バトルの結果に応じてメッセージを表示
    if (result === 'win') {
        alert('勝利しました！'); // 勝った場合のメッセージ
    } else if (result === 'lose') {
        alert('敗北しました...'); // 負けた場合のメッセージ
    }

    // バトル終了後の処理をここに追加（例：経験値獲得）
}

// バトルが開始された時にこの関数を呼び出す
startBattle();