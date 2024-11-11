fetch()

fetch('get_item.php',{
    method:'POST',
    headers:{
        'Content-Type':'application/json'
    },
    body:JSON.stringify({account_id:playerStatus.account_id})
})
    .then(response=>response.json())
    .then(data=>{
        itemList = data.items;
});

    const items = response.json();
    createItemButtons(scene, config, items);

export function itemEvent(gameStatus){
    gameStatus.saveflg = !gameStatus.saveflg;
    saveContainer.setVisible(gameStatus.saveflg);
}

export async function saveGame(loader,playerStatus,config,gameStatus,friend1Status,friend2Status,friend3Status){
    //メニューのサイズを設定
    const itemWidth = config.width * 0.6;
    const itemHeight = config.height * 0.95;

    // メニュー背景を作成し、左に少しスペースを開ける
    const saveback = loader.add.rectangle(config.width * 0.3 + 10, 2, itemWidth, itemHeight, 0xFFFFFF, 0.8);
    saveback.setStrokeStyle(2,0x000000); // 緑枠
    saveback.setRadius(10);

    // アイテム名のボタンを生成し、クリックイベントを設定する関数
function createItemButtons(scene, config, items) {
    const buttonContainer = scene.add.container(0, 0); // ボタンをまとめるコンテナ
    const buttonSpacing = 40; // ボタン間のスペース
    let posY = config.height / 2 - items.length * buttonSpacing / 2; // ボタンの縦位置を調整

    items.forEach((item, index) => {
        // ボタンとしてアイテム名をテキストで追加
        const itemButton = scene.add.text(
            config.width * 0.3 + 10, 
            posY + index * buttonSpacing, // 各ボタンのY座標を調整
            item.item_name, // アイテム名をボタンに表示
            { fontSize: '18px', color: '#000', backgroundColor: '#FFFFFF' }
        );

        // クリック可能にする
        itemButton.setInteractive();

        // ボタンがクリックされたときの処理
        itemButton.on('pointerdown', () => {
            useItem(item); // アイテムを使用する処理
        });
})
};