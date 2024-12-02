let itemContainer = null;

/**
 * アイテムメニューの表示切り替え
 */
export function itemEvent(gameStatus) {
    if (!gameStatus || typeof gameStatus !== "object") {
        console.error("Invalid gameStatus:", gameStatus);
        return;
    }

    gameStatus.itemflg = !gameStatus.itemflg;
    if (itemContainer) {
        itemContainer.setVisible(gameStatus.itemflg);
    }
}

/**
 * アイテムメニューを初期化
 */
export function setupItemMenu(scene, config) {
    if (!scene || !config) {
        console.error("Invalid arguments passed to setupItemMenu");
        return;
    }

    const itemWidth = config.width * 0.6;
    const itemHeight = config.height * 0.95;

    const itemback = scene.add.rectangle(
        config.width * 0.3,
        0,
        itemWidth,
        itemHeight,
        0xFFFFFF,
        0.8
    );
    itemback.setStrokeStyle(2, 0x4169e1);
    itemback.setOrigin(0, 0);

    const headerItem = scene.add.text(
        config.width * 0.35,
        20,
        "アイテム",
        { fontSize: "20px", fill: "#000" }
    );
    const headerCount = scene.add.text(
        config.width * 0.75,
        20,
        "個数",
        { fontSize: "20px", fill: "#000" }
    );

    itemContainer = scene.add.container(0, 0, [itemback, headerItem, headerCount]);
    itemContainer.setVisible(false);
    itemContainer.setDepth(7);
}

/**
 * アイテムボタンを生成
 */
export function createItemButtons(scene, config, gameStatus, itemList) {
    if(!scene){
        console.log("sceneがemptyです");
    }else if(!config){
        console.log("configがemptyです");
    }else if(!gameStatus){
        console.log("gameStatusがemptyです");
    }else if(!itemList){
        console.log("itemListがemptyです");
    }

    if (!scene || !config || !gameStatus || !Array.isArray(itemList)) {
        console.error("Invalid arguments passed to createItemButtons");
        return;
    }

    if (!itemContainer) {
        console.warn("Item container is not initialized. Call setupItemMenu first.");
        return;
    }

    const buttonSpacing = 40;
    const startX = config.width * 0.35;
    let startY = 60;

    // 既存のボタンを削除
    itemContainer.removeAll(true);

    // 背景を再追加
    const [itemback] = itemContainer.getAll(); // 最初の背景要素を再利用
    if (itemback) itemContainer.add(itemback);

    // ヘッダーを再追加
    itemContainer.add(
        scene.add.text(config.width * 0.35, 20, "アイテム", { fontSize: "20px", fill: "#000" })
    );
    itemContainer.add(
        scene.add.text(config.width * 0.75, 20, "個数", { fontSize: "20px", fill: "#000" })
    );

    // アイテムボタンを生成
    itemList.forEach((item, index) => {
        const itemText = `${item.item_name}`;
        const countText = `${item.su}`;

        const itemButton = createButton(
            scene,
            startX,
            startY + index * buttonSpacing,
            itemText,
            () => {
                console.log(`アイテム選択: ${item.item_name}`);
                useItem(scene, config, gameStatus, item);
            }
        );

        const countDisplay = scene.add.text(
            config.width * 0.75,
            startY + index * buttonSpacing,
            countText,
            { fontSize: "18px", fill: "#000" }
        );

        itemContainer.add([itemButton, countDisplay]);
    });
}

/**
 * ボタン生成用のユーティリティ関数
 */
function createButton(scene, x, y, text, callback) {
    const button = scene.add.text(x, y, text, {
        fontSize: "18px",
        backgroundColor: "#FFFFFF",
        color: "#000",
        padding: { left: 10, right: 10, top: 5, bottom: 5 },
    });
    button.setInteractive();
    button.on("pointerdown", callback);
    button.on("pointerover", () => button.setStyle({ backgroundColor: "#E0E0E0" }));
    button.on("pointerout", () => button.setStyle({ backgroundColor: "#FFFFFF" }));
    return button;
}

/**
 * アイテム使用処理
 */
export function useItem(scene, config, gameStatus, item) {
    if (!scene || !config || !gameStatus || !item) {
        console.error("Invalid arguments passed to useItem");
        return;
    }

    console.log(`Using item: ${item.item_name}`);
    // アイテム使用処理を実装
}

/**
 * アイテムメニューの更新（カメラ追従）
 */
export function updateItemMenu(scene) {
    const camera = scene.cameras.main;
    if (itemContainer) {
        itemContainer.setPosition(camera.scrollX, camera.scrollY);
    }
}
