// save.js

export function saveGame() {
    // PHPを使ってデータベースにセーブ処理を行う
    $.post('save_game.php', {
        playerStats: playerStats,
        // 他のデータも送信
    }).done(function(response) {
        console.log("Game saved: ", response);
    });
}
function saveGame(playerStatus, friendStatuses) {
    const data = {
        playerStatus: playerStatus,
        friendStatuses: friendStatuses
    };

    // サーバーにデータを送信（POSTリクエスト）
    fetch('save.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data), // プレイヤーのデータをJSONに変換
    })
    .then(response => response.json())
    .then(result => {
        // 成功時の処理
        if (result.success) {
            console.log('ゲームデータが正常にセーブされました');
        } else {
            console.log('セーブに失敗しました');
        }
    })
    .catch(error => {
        console.error('エラー:', error);
    });
}

// 例: プレイヤーと友達のステータスをセーブ
const playerStatus = {
    level: 10,
    hp: 100,
    mp: 50
};

const friendStatuses = [
    { level: 5, hp: 80, mp: 30 },
    { level: 7, hp: 90, mp: 40 },
    { level: 6, hp: 85, mp: 35 }
];

// セーブ処理を実行
saveGame(playerStatus, friendStatuses);