import { fetchItems } from './main.js';
import { itemUse } from './main.js';
let itemContainer;

export function itemEvent(gameStatus){
    gameStatus.itemflg = !gameStatus.itemflg;
    itemContainer.setVisible(gameStatus.itemflg);
}

export async function useItem(loader,playerStatus,config,gameStatus,friend1Status,friend2Status,friend3Status){
    //メニューのサイズを設定
    const itemWidth = config.width * 0.6;
    const itemHeight = config.height * 0.95;

    // メニュー背景を作成し、左に少しスペースを開ける
    const itemback = loader.add.rectangle(config.width * 0.3 + 10, 2, itemWidth, itemHeight, 0xFFFFFF, 0.8);
    itemback.setStrokeStyle(2,0x000000); // 緑枠
    itemback.setRadius(10);



      // itemList の定義
    const itemList = [];

      // fetchItems を使ってアイテムを取得
    fetchItems().then(items => {
        items.forEach(item => itemList.push(item));
          createItemButtons(scene, config, itemList); // アイテムを使用してボタンを作成
    });

      // itemContainer の作成
    itemContainer = scene.add.container(0, 0, [saveback]);
    itemContainer.setVisible(false);
}

  // アイテム名のボタンを生成し、クリックイベントを設定する関数
function createItemButtons(scene, config, items) {
    const buttonSpacing = 40;
      let posY = config.height / 2 - items.length * buttonSpacing / 2;

    items.forEach((item, index) => {
        const itemButton = scene.add.text(
              config.width * 0.3 + 10,
              posY + index * buttonSpacing,
            item.item_name,
            { fontSize: '15px', color: '#000', backgroundColor: '#FFFFFF' }
        );

        itemButton.setInteractive();

        itemButton.on('pointerdown', () => {
            itemUse(item);
        });

          itemContainer.add(itemButton); // itemContainer にボタンを追加
    });
}