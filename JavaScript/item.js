// import { fetchItems } from './main.js';
// import { itemUse } from './main.js';

console.log('Phaser Version:', Phaser.VERSION);


let itemContainer = null;
let summaryContainer = null;
let savetra = null;

// アイテムメニューを表示する関数
export function itemEvent(scene, config, gameStatus) {
    gameStatus.itemflg = !gameStatus.itemflg;
    console.log('Item flag status:', gameStatus.itemflg);
    console.log('Scene:', scene);
    console.log('Config:', config);
    console.log('Scene and Config initialized');
    if (itemContainer) {
        itemContainer.setVisible(gameStatus.itemflg);
    }
    if (gameStatus.itemflg) {
        useItem(scene, config); // `scene` と `config` を渡す
    }
}

export async function useItem(scene, config) {

    const itemWidth = config.width * 0.6;
    const itemHeight = config.height * 0.95;

    // メニュー背景を作成
    const itemback = scene.add.rectangle(config.width * 0.3 + 10, 2, itemWidth, itemHeight, 0xFFFFFF, 0.8);
    itemback.setStrokeStyle(2, 0x000000);

    const summary1 = scene.add.text(config.width * 0.3 + 180, itemHeight / 4, 'アイテム', { fontSize: '13px', fill: '#000' });
    const summary2 = scene.add.text(config.width * 0.3 + 180 + 80, itemHeight / 4, '個数', { fontSize: '13px', fill: '#000' });

    summaryContainer = scene.add.container(0, 0, [summary1, summary2]);
    itemContainer = scene.add.container(0, 0, [itemback, summary1, summary2]);
    itemContainer.setVisible(false); // 初期状態では非表示

    itemtext.setInteractive().on('pointerover', () => {
        if(!itemtra){
            itemtra = scene.add.text(config.width * 0.5,itemHeight / 2,'▶',{fontSize:'64px',fill:'#000'});
            itemtra.setDepth(8);
        }
    });
    console.log('Config width:', config.width);
    console.log('Config height:', config.height);
    console.log('Item Container:', itemContainer);
}