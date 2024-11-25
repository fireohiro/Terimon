console.log('Phaser Version:', Phaser.VERSION);

let itemContainer = null;
let summaryContainer = null;
let itemtra = null;

// アイテムメニューを表示する関数111
export function itemEvent(scene, config, gameStatus) {
    console.log('itemEvent called');
    gameStatus.itemflg = !gameStatus.itemflg;
    itemContainer.setVisible(gameStatus.itemflg);
}

export async function useItem(scene, config, gameStatus,itemList) {
    console.log('useItem called with:', scene, config);

    const itemWidth = config.width * 0.6;
    const itemHeight = config.height * 0.95;

    const itemback = scene.add.rectangle(config.width * 0.3 + 10, 2, itemWidth, itemHeight, 0xFFFFFF, 0.8);
    itemback.setStrokeStyle(2, 0x000000);

    const summary1 = scene.add.text(config.width * 0.3 + 180, itemHeight / 4, 'アイテム', { fontSize: '13px', fill: '#000' });
    const summary2 = scene.add.text(config.width * 0.3 + 180 + 80, itemHeight / 4, '個数', { fontSize: '13px', fill: '#000' });

    summaryContainer = scene.add.container(0, 0, [summary1, summary2]);
    itemContainer = scene.add.container(0, 0, [itemback, summary1, summary2]);
    itemContainer.setVisible(false);

    console.log('Item container initialized:', itemContainer);
}
