import { fetchItems } from './main.js';
import { itemUse } from './main.js';

let itemContainer;

// アイテムメニューを表示する関数
export function itemEvent(gameStatus) {
    gameStatus.itemflg = !gameStatus.itemflg;
    if (itemContainer) {
        itemContainer.setVisible(gameStatus.itemflg);
    }
}

export async function useItem(scene, playerStatus, config, friends, itemlist) {
    const itemWidth = config.width * 0.6;
    const itemHeight = config.height * 0.95;

    // メニュー背景を作成
    const itemback = scene.add.rectangle(config.width * 0.3 + 10, 2, itemWidth, itemHeight, 0xFFFFFF, 0.8);
    itemback.setStrokeStyle(2, 0x000000);

    // 仮置きのタイトルテキストを作成
    const summary1 = scene.add.text(
        config.width * 0.3 + 180,
        itemHeight / 4,
        'アイテム',
        { fontSize: '13px', fill: '#000' }
    );
    summary1.setOrigin(0, 0);

    const summary2 = scene.add.text(
        config.width * 0.3 + 180 + 80,
        itemHeight / 4,
        '個数',
        { fontSize: '13px', fill: '#000' }
    );
    summary2.setOrigin(0, 0);

    // アイテムリストを取得してボタンを作成
    const itemList = await fetchItems();
    createItemButtons(scene, config, itemList, playerStatus, friends);

    // コンテナに要素をまとめる
    itemContainer = scene.add.container(0, 0, [itemback, summary1, summary2]);
    itemContainer.setVisible(false);
}

// アイテムボタンを作成
function createItemButtons(scene, config, itemList, combatant, friends) {
    const buttonSpacing = 40; // ボタンの間隔
    let posY = config.height / 2 - itemList.length * buttonSpacing / 2;

    itemList.forEach((item, index) => {
        const itemText = `${item.item_name}    ${item.su}`;
        const itemButton = scene.add.text(
            config.width * 0.3 + 10,
            posY + index * buttonSpacing,
            itemText,
            { fontSize: '15px', color: '#000', backgroundColor: '#FFFFFF' }
        );

        itemButton.setInteractive();

        itemButton.on('pointerdown', () => {
            itemRole(item, combatant, friends, scene, config); // 必要な引数を渡して itemRole を呼び出し
            itemUse(item);  // アイテムの数を減らす
        });

        itemContainer.add(itemButton); // ボタンをコンテナに追加
    });
}

// itemRole 関数を定義
export function itemRole(item, combatant, friends, scene, config) {
    let rand1 = Math.floor(Math.random() * 100) + 1;

    // アイテム使用メッセージ
    displaymessage(scene, config, `${combatant.name}は${item.item_name}を使った`);

    if (rand1 <= combatant.luck) {
        item.naiyou *= 2;
        displaymessage(scene, config, `${combatant.name}の運がアイテムの効果を高めた！`);
    }

    // アイテムの効果処理
    if (item.bunrui === 'HP回復') {
        combatant.hp_nokori += item.naiyou;
        if (combatant.hp_nokori > combatant.hp) {
            combatant.hp_nokori = combatant.hp;
        }
        displaymessage(scene, config, `${combatant.name}のHPを${item.naiyou}回復した`);
    } else if (item.bunrui === 'MP回復') {
        combatant.mp_nokori += item.naiyou;
        if (combatant.mp_nokori > combatant.mp) {
            combatant.mp_nokori = combatant.mp;
        }
        displaymessage(scene, config, `${combatant.name}のMPを${item.naiyou}回復した`);
    } else if (item.bunrui === 'ちから') {
        combatant.pow += item.naiyou;
        displaymessage(scene, config, `${combatant.name}のちからステータスが${item.naiyou}上昇した`);
    } else if (item.bunrui === 'まもり') {
        combatant.def += item.naiyou;
        displaymessage(scene, config, `${combatant.name}のまもりステータスが${item.naiyou}上昇した`);
    } else if (item.bunrui === 'スピード') {
        combatant.speed += item.naiyou;
        displaymessage(scene, config, `${combatant.name}のスピードステータスが${item.naiyou}上昇した`);
    } else if (item.bunrui === '蘇生') {
        friends.forEach(friend => {
            if (friend.hp_nokori === 0) {
                friend.hp_nokori = friend.hp;
                displaymessage(scene, config, `${friend.name}は息を吹き返した！`);
            } else {
                displaymessage(scene, config, `${friend.name}には効果がなかった・・・`);
            }
        });
    }
}
