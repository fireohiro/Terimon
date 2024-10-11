let playerPosition = { x: 0, y: 0 };  // プレイヤーの初期位置

// PHPからプレイヤーの位置情報を取得
fetch('get_player_position.php')
    .then(response => response.json())
    .then(data => {
        playerPosition.x = data.x;
        playerPosition.y = data.y;
    });

// キーボード操作でプレイヤーを動かす
document.addEventListener('keydown', function(event) {
    switch (event.key) {
        case 'ArrowUp':
            playerPosition.y -= 1;
            break;
        case 'ArrowDown':
            playerPosition.y += 1;
            break;
        case 'ArrowLeft':
            playerPosition.x -= 1;
            break;
        case 'ArrowRight':
            playerPosition.x += 1;
            break;
        case 'Enter':
            // 調べる処理
            checkPosition(playerPosition);
            break;
    }
    // 移動ごとにエンカウントチェック
    checkEncounter();
});

// プレイヤーが特定の位置を調べた際の処理
function checkPosition(position) {
    if (position.x === 5 && position.y === 3) {
        alert("宝箱を発見しました！");
    } else {
        alert("何も見つかりませんでした");
    }
}