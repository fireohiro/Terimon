import { fetchItems } from './main.js';
import { itemUse } from './main.js';

let itemContainer;

// itemRole 関数を定義
export function itemRole(item, combatant, friends, scene, config) {
    let rand1 = Math.floor(Math.random() * 100) + 1;
    displaymessage(scene, config, `${combatant.name}は${item.item_name}を使った`);

    if (rand1 <= combatant.luck) {
        item.naiyou *= 2;
        displaymessage(scene, config, `${combatant.name}の運がアイテムの効果を高めた！`);
    }

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

// アイテムメニューを表示する関数
export function itemEvent(gameStatus) {
    gameStatus.itemflg = !gameStatus.itemflg;
    itemContainer.setVisible(gameStatus.itemflg);
}

export async function useItem(loader, playerStatus, config, gameStatus, friend1Status, friend2Status, friend3Status) {
    const itemWidth = config.width * 0.6;
    const itemHeight = config.height * 0.95;

    const itemback = loader.add.rectangle(config.width * 0.3 + 10, 2, itemWidth, itemHeight, 0xFFFFFF, 0.8);
    itemback.setStrokeStyle(2, 0x000000);
    itemback.setRadius(10);

    const itemList = [];
    fetchItems().then(items => {
        items.forEach(item => itemList.push(item));
        createItemButtons(scene, config, itemList, playerStatus, [friend1Status, friend2Status, friend3Status]); 
    });

    itemContainer = scene.add.container(0, 0, [itemback]);
    itemContainer.setVisible(false);
}

// アイテムボタンを作成し、クリック時に itemRole を呼び出す
function createItemButtons(scene, config, items, combatant, friends) {
    const buttonSpacing = 40;
    let posY = config.height / 2 - items.length * buttonSpacing / 2;

    items.forEach((item, index) => {
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

        itemContainer.add(itemButton);
    });
}
