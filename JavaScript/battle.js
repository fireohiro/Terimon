let battleData;

//バトル開始時にサーバーからデータを取得
function startBattle(){
    fetch('battle.php')
    .then(response => response.json())
    .then(data => {
        battleData = data;
        renderBattle();
    })
    .catch(error => console.error('Error:', error));
}

//バトル画面を描画する関数
function renderBattle(){
    const player = battleData.player;  // ここを修正（palyer → player）
    const monsters = battleData.monsters;

    //HTMLの要素に情報を反映
    document.getElementById('player-info').innerHTML =
        `<h3>${player.name}</h3>
        <p>HP: ${player.currentHP}/${player.maxhp}</p>
        <p>MP: ${player.currentMP}/${player.maxmp}</p>
        `;

    monsters.forEach((monster, index) => {
        document.getElementById(`monster${index + 1}-info`).innerHTML =  // 修正: monster${index + 1}-infoをバッククオートに修正
            `<h4>${monster.name}</h4>
            <p>HP: ${monster.maxhp}</p>
            <p>MP: ${monster.maxmp}</p>
            `;
    });
    
    //行動選択メニューを表示する関数
    renderActionMenu();
}

//行動選択メニューを表示する関数
function renderActionMenu(){
    //行動選択メニューをHTMLに追加
    const actionMenu = `
        <button onclick="attack()">攻撃</button>
        <button onclick="useItem()">アイテム</button>
        <button onclick="withdraw()">前線から引く</button>
    `;
    document.getElementById('action-menu').innerHTML = actionMenu;
}

//攻撃処理
function attack(){
    const player = battleData.player;
    console.log('攻撃を選択しました');
}

//アイテム使用処理
function useItem(){
    console.log('アイテムを使用しました');
}

//前線から引く処理
function withdraw(){
    console.log('前線から引きました');
}

//初期化
document.addEventListener('DOMContentLoaded', startBattle);
