let battleData;
let currentTurn = 0; // 現在のターンを管理する変数

// バトル開始時にサーバーからデータを取得
function startBattle() {
    fetch('battle.php')
    .then(response => response.json())
    .then(data => {
        battleData = data;
        renderBattle();
        startTurn(); // バトルを開始
    })
    .catch(error => console.error('Error:', error));
}

// バトル画面を描画する関数
function renderBattle() {
    const player = battleData.player;
    const monsters = battleData.monsters;

    // HTMLの要素に情報を反映
    document.getElementById('player-info').innerHTML =
        `<h3>${player.name}</h3>
        <p>HP: ${player.currentHP}/${player.maxhp}</p>
        <p>MP: ${player.currentMP}/${player.maxmp}</p>`;

    monsters.forEach((monster, index) => {
        document.getElementById(`monster${index + 1}-info`).innerHTML =
            `<h4>${monster.name}</h4>
            <p>HP: ${monster.maxhp}</p>
            <p>MP: ${monster.maxmp}</p>`;
    });

    // 行動選択メニューを表示する関数
    renderActionMenu();
}

// 行動選択メニューを表示する関数
function renderActionMenu() {
    const actionMenu =
        `<button onclick="attack()">攻撃</button>
        <button onclick="useItem()">アイテム</button>
        <button onclick="withdraw()">前線から引く</button>`;
    
    document.getElementById('action-menu').innerHTML = actionMenu;
}

// バトルのターンを開始する関数
function startTurn() {
    const player = battleData.player;
    const monsters = battleData.monsters;

    // プレイヤーとモンスターの素早さを保持する配列を作成
    const participants = [
        { type: 'player', entity: player, speed: player.speed },
        ...monsters.map(monster => ({ type: 'monster', entity: monster, speed: monster.speed }))
    ];

    // スピードが高い順にソート
    participants.sort((a, b) => b.speed - a.speed);

    // 攻撃処理を行う
    participants.forEach(participant => {
        if (participant.type === 'player') {
            // プレイヤーの行動を処理
            // ここでは攻撃の代わりにダイレクトに攻撃関数を呼び出しているが、選択した行動に応じて変更が可能
            attack(participant.entity);
        } else {
            // モンスターの行動を処理
            enemyAttack(participant.entity);
        }
    });

    // 画面を更新
    renderBattle();
}

// 攻撃処理
function attack(player) {
    const monsters = battleData.monsters;

    const damage = player.pow; // プレイヤーの攻撃力を使用

    // 敵全体にダメージを与える
    monsters.forEach(monster => {
        monster.maxhp -= damage;

        // モンスターのHPが0未満になった場合は0に設定
        if (monster.maxhp < 0) {
            monster.maxhp = 0;
        }
    });

    console.log(`敵全体に${damage}のダメージを与えました。`);
}

// 敵の攻撃処理
function enemyAttack(monster) {
    const player = battleData.player;

    const damage = monster.pow; // 敵の攻撃力を使用

    player.currentHP -= damage; // プレイヤーのHPを減少

    // プレイヤーのHPが0未満になった場合は0に設定
    if (player.currentHP < 0) {
        player.currentHP = 0;
    }

    console.log(`${monster.name}が${damage}のダメージを与えました。`);
}

// アイテム使用処理
function useItem() {
    console.log('アイテムを使用しました');
}

// 前線から引く処理
function withdraw() {
    console.log('前線から引きました');
}

// 初期化
document.addEventListener('DOMContentLoaded', startBattle);
