import {itemUse} from './main.js';
let itemContainer = null;

/**
 * アイテムメニューの表示切り替え
 */
export function itemEvent(gameStatus,scene) {
    if (!gameStatus || typeof gameStatus !== "object") {
        console.error("Invalid gameStatus:", gameStatus);
        return;
    }

    gameStatus.itemflg = !gameStatus.itemflg;
    if (itemContainer) {
        itemContainer.setVisible(gameStatus.itemflg);
    }
}

export function initializeItemMenu(scene, config, gameStatus, playerStatus, itemList, friends) {
    if (!scene || !config || !gameStatus) {
        console.error("Invalid arguments passed to initializeItemMenu");
        return;
    }

    // メニュー全体の幅と高さを計算
    const itemWidth = config.width * 0.6;
    const itemHeight = config.height * 0.8;

    // 背景を生成
    const itemback = scene.add.rectangle(
        config.width * 0.3,
        20,
        itemWidth,
        itemHeight,
        0xFFFFFF,
        0.8
    );
    itemback.setStrokeStyle(2, 0x4169e1);
    itemback.setOrigin(0, 0);

    // ヘッダーを生成
    const headerItem = scene.add.text(
        config.width * 0.35,
        40,
        "アイテム",
        { fontSize: "20px", fill: "#000" }
    );
    const headerCount = scene.add.text(
        config.width * 0.75,
        40,
        "個数",
        { fontSize: "20px", fill: "#000" }
    );

    // アイテムメニューコンテナを作成
    const camera = scene.cameras.main;
    itemContainer = scene.add.container(camera.scrollX, camera.scrollY, [itemback, headerItem, headerCount]);
    itemContainer.setVisible(false); // 初期状態は非表示
    itemContainer.setDepth(7);

    // アイテムボタンの間隔と配置
    const buttonSpacing = 40;
    const startX = config.width * 0.35;
    let startY = 80;

    // アイテムリストからボタンを生成
if (itemList && Array.isArray(itemList)) { // itemListが存在し、配列である場合のみ処理を進める
    const countDisplays = {}; // アイテムIDをキーにカウント表示を管理

    itemList.forEach((item, index) => {
        const itemText = `${item.item_name}`;

        // アイテムボタンを作成
const itemButton = createButton(
    scene,
    startX,
    startY + index * buttonSpacing,
    itemText,
    () => {
        if (item.su <= 0) {
            console.warn(`アイテム「${item.item_name}」の在庫がありません`);
            alert(`アイテム「${item.item_name}」は在庫切れです`);
            return;
        }
        console.log(`アイテム選択: ${item.item_name}`);
        useItem(scene, config, gameStatus, item, playerStatus, friends);

        // アイテムの個数を減らし、表示を更新
        if (item.su >= 0) {
            countDisplays[item.item_id].setText(`${item.su}`);
        } else {
            console.warn(`アイテム「${item.item_name}」は在庫がありません`);
        }
    }
);


        // 個数表示用のテキストを作成
        const countDisplay = scene.add.text(
            config.width * 0.75,
            startY + index * buttonSpacing,
            `${item.su}`,
            { fontSize: "18px", fill: "#000" }
        );

        // ボタンと個数表示をコンテナに追加
        itemContainer.add([itemButton, countDisplay]);

        // 個数表示を管理リストに追加
        countDisplays[item.item_id] = countDisplay;

        console.log("ボタン生成:", itemButton);
    });
} else {
    console.warn("itemListが無効または空です:", itemList);
}
    console.log("アイテムメニュー初期化完了:", itemContainer);
}


/**
 * ボタン生成用のユーティリティ関数
 */
function createButton(scene, x, y, text, callback) {
    console.log(`Creating button at (${x}, ${y}): ${text}`);
    const button = scene.add.text(x, y, text, {
        fontSize: "18px",
        backgroundColor: "#FFFFFF",
        color: "#000",
        padding: { left: 10, right: 10, top: 5, bottom: 5 },
    });
    
    button.setInteractive();

    // 登録前に既存のリスナーをクリア
    button.off("pointerdown");

    button.on("pointerdown", callback);
    button.on("pointerover", () => button.setStyle({ backgroundColor: "#E0E0E0" }));
    button.on("pointerout", () => button.setStyle({ backgroundColor: "#FFFFFF" }));
    return button;
}

/**
 * アイテム使用処理
 */
export function useItem(scene, config, gameStatus, item, playerStatus, friends) {
    console.log("playerStatus:", playerStatus);
    console.log("friends:", friends);

    if (!scene || !config || !gameStatus || !item  || !playerStatus) {
        console.error("Invalid arguments passed to useItem");
        return;
    }

    // 呼び出し回数をデバッグ
    console.count("useItem called");

    console.log(`Using item: ${item.item_name}`);
    const item_id = item.item_id;
    console.log(item_id + "を送れてるか確認");
    // アイテム使用処理を実装
    if (item.bunrui == "HP回復" && item.su > 0) {
        let isUsed = false; // 初期化は処理の最初で行う
    
        // フレンドのHP回復処理
        for (const friend of friends) {
            if (friend && friend.hp_nokori > 0 && friend.hp_nokori < friend.hp) {
                friend.hp_nokori += item.naiyou;
                if (friend.hp_nokori > friend.hp) {
                    friend.hp_nokori = friend.hp;
                }
                isUsed = true;
            }
        }
    
        // プレイヤーのHP回復処理
        if (playerStatus.hp_nokori > 0 && playerStatus.hp_nokori < playerStatus.hp) {
            playerStatus.hp_nokori += item.naiyou;
            if (playerStatus.hp_nokori > playerStatus.hp) {
                playerStatus.hp_nokori = playerStatus.hp;
            }
            isUsed = true;
        }
    
        // アイテムが使用された場合のみ消費
        if (isUsed) {
            itemUse(item_id);
            console.log("消費確認用1");
        } else {
            console.log("HPがいっぱいです。");
            alert("HPがいっぱいです。");
        }
    } else if (item.bunrui == "MP回復") {
        let isUsed = false;
    
        // フレンドのMP回復処理
        for (const friend of friends) {
            if (friend && friend.mp_nokori > 0 && friend.mp_nokori < friend.mp) {
                friend.mp_nokori += item.naiyou;
                if (friend.mp_nokori > friend.mp) {
                    friend.mp_nokori = friend.mp;
                }
                isUsed = true;
            }
        }
    
        // プレイヤーのMP回復処理
        if (playerStatus.mp_nokori > 0 && playerStatus.mp_nokori < playerStatus.mp) {
            playerStatus.mp_nokori += item.naiyou;
            if (playerStatus.mp_nokori > playerStatus.mp) {
                playerStatus.mp_nokori = playerStatus.mp;
            }
            isUsed = true;
        }
    
        // アイテムが使用された場合のみ消費
        if (isUsed) {
            itemUse(item_id);
            console.log("消費確認用2");
        } else {
            console.log("MPがいっぱいです。");
            alert("MPがいっぱいです。");
        }
    } else {
        itemUse(item.item_id);
        console.log("消費確認用3");
    }
    
}

/**
 * アイテムメニューの更新（カメラ追従）
 */
export function updateItemMenu(scene) {
    if (itemContainer) {
        const camera = scene.cameras.main;
        const saveX = camera.scrollX; // カメラのスクロール位置に合わせる
        const saveY = camera.scrollY;
        itemContainer.setPosition(saveX, saveY);
    }
}
