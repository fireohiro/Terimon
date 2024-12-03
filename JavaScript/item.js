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

export function initializeItemMenu(scene, config, gameStatus, itemList) {
    if (!scene || !config || !gameStatus || !Array.isArray(itemList)) {
        console.error("Invalid arguments passed to initializeItemMenu");
        return;
    }

    // メニュー全体の幅と高さを計算
    const itemWidth = config.width * 0.6;
    const itemHeight = config.height * 0.95;

    // 背景を生成
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

    // ヘッダーを生成
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

    // アイテムメニューコンテナを作成
    itemContainer = scene.add.container(0, 0, [itemback, headerItem, headerCount]);
    itemContainer.setVisible(false); // 初期状態は非表示
    itemContainer.setDepth(7);

    // アイテムボタンの間隔と配置
    const buttonSpacing = 40;
    const startX = config.width * 0.35;
    let startY = 60;

    // アイテムリストからボタンを生成
    itemList.forEach((item, index) => {
        const itemText = `${item.item_name}`;
        const countText = `${item.su}`;

        // アイテムボタンを作成
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

        // 個数表示用のテキストを作成
        const countDisplay = scene.add.text(
            config.width * 0.75,
            startY + index * buttonSpacing,
            countText,
            { fontSize: "18px", fill: "#000" }
        );

        // ボタンと個数表示をコンテナに追加
        itemContainer.add([itemButton, countDisplay]);
        console.log("ボタン生成:", itemButton);
    });

    console.log("アイテムメニュー初期化完了:", itemContainer);
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
