import { fetchItems } from './main.js';
import { itemUse } from './main.js';

let itemContainer;

// itemRole 関数を定義
export function itemRole(item, friends, scene, config) {

forEach.friend();

    if (item.bunrui === 'HP回復') {
        combatant.hp_nokori += item.naiyou;
        if (combatant.hp_nokori > combatant.hp) {
            combatant.hp_nokori = combatant.hp;
        }
    } else if (item.bunrui === 'MP回復') {
        combatant.mp_nokori += item.naiyou;
        if (combatant.mp_nokori > combatant.mp) {
            combatant.mp_nokori = combatant.mp;
        }
    } else if (item.bunrui === 'ちから') {
        combatant.pow += item.naiyou;
    } else if (item.bunrui === 'まもり') {
        combatant.def += item.naiyou;
    } else if (item.bunrui === 'スピード') {
        combatant.speed += item.naiyou;
    } else if (item.bunrui === '蘇生') {
        friends.forEach(friend => {
            if (friend.hp_nokori === 0) {
                friend.hp_nokori = friend.hp;
            } else {
            }
        });
    }
}

//仮置き
const summary1 = scene.add.text(config.width * 0.3+180,saveHeight / 4,'アイテム',{fontSize:'13px',fill:'#000'});
summary1.setOrigin(0,0);

const summary2 = scene.add.text(config.width * 0.3+180,saveHeight / 4,'個数',{fontSize:'13px',fill:'#000'});
summary2.setOrigin(10,0);

// アイテムメニューを表示する関数
export function itemEvent(gameStatus) {
    gameStatus.itemflg = !gameStatus.itemflg;
    itemContainer.setVisible(gameStatus.itemflg);
}

export async function useItem(scene, playerStatus, config, friends, itemlist) {
    const itemWidth = config.width * 0.6;
    const itemHeight = config.height * 0.95;

    const itemback = scene.add.rectangle(config.width * 0.3 + 10, 2, itemWidth, itemHeight, 0xFFFFFF, 0.8);
    itemback.setStrokeStyle(2, 0x000000);

    

    itemContainer = scene.add.container(0, 0, [itemback]);
    itemContainer.setVisible(false);
}

// アイテムボタンを作成
function createItemButtons(scene, config, itemlist, combatant, friends) {
    const buttonSpacing = 40;
    let posY = config.height / 2 - items.length * buttonSpacing / 2;

    itemlist.forEach((item, index) => {
        const itemText = `${item.item_name}    ${item.su}`;
        const itemButton = scene.add.text(
            config.width * 0.3 + 10,
            posY + index * buttonSpacing,
            itemText,
            { fontSize: '15px', color: '#000', backgroundColor: '#FFFFFF' }
        );

        itemButton.setInteractive();

        itemButton.on('pointerdown', () => {
            createItemButtons(scene, config, itemList, playerStatus, friends);
            // selectConsumer(item, friends, scene, config, playerStatus, frieds);
            itemRole(item, playerStatus, friends, scene); // 必要な引数を渡して itemRole を呼び出し
            itemUse(item);  // アイテムの数を減らす
        });

        itemContainer.add(itemButton);
    });
}
