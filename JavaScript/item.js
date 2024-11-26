let itemContainer = null; // アイテムメニューのコンテナ
let itemPointer = null;   // ポインター用のテキスト

/**
 * アイテムメニューの表示を切り替える
 */
export function itemEvent(gameStatus) {
    gameStatus.itemflg = !gameStatus.itemflg;
    if (itemContainer) {
        itemContainer.setVisible(gameStatus.itemflg);
    }
}

/**
 * アイテムメニューを初期化し、必要な描画要素を設定する
 */
export async function setupItemMenu(scene, config, gameStatus) {
    console.log("Setting up item menu...");

    // メニューサイズを設定
    const itemWidth = config.width * 0.6;
    const itemHeight = config.height * 0.95;

    // メニュー背景を作成
    const itemback = scene.add.rectangle(config.width * 0.3 + 10, 10, itemWidth, itemHeight, 0xFFFFFF, 0.8);
    itemback.setStrokeStyle(2,0x4169e1); // 緑枠
    itemback.setOrigin(0,0);

    // ヘッダー項目の表示（例: アイテムと個数）
    const headerItem = scene.add.text(
        config.width * 0.3 + 140,
        itemHeight / 8,
        "アイテム",
        { fontSize: "20px", fill: "#000" }
    );
    const headerCount = scene.add.text(
        config.width * 0.3 + 700,
        itemHeight / 8,
        "個数",
        { fontSize: "20px", fill: "#000" }
    );

    // コンテナに要素をまとめる
    itemContainer = scene.add.container(0, 0, [itemback, headerItem, headerCount]);
    itemContainer.setVisible(false); // 初期状態は非表示
    itemContainer.setDepth(7); // メニューを前面に表示
}

/**
 * データベースからアイテムデータを取得してボタンを生成する
 */
export async function createItemButtons(scene, config, itemList, playerStatus, friends) {
    console.log("Creating item buttons...");

    const buttonSpacing = 40;
    let posY = config.height / 2 - itemList.length * buttonSpacing / 2;

    // アイテムデータが空の場合のハンドリング
    if (!itemList || itemList.length === 0) {
        console.warn("アイテムリストが空です。");
        return;
    }

    // 既存のボタンがあれば削除（リセットのため）
    if (itemContainer) {
        itemContainer.removeAll(true); // コンテナ内のすべての要素を削除
    }

    itemList.forEach((item, index) => {
        const itemText = `${item.item_name}    ${item.su}`;
        const itemButton = scene.add.text(
            config.width * 0.3 + 10,
            posY + index * buttonSpacing,
            itemText,
            { fontSize: '15px', color: '#000', backgroundColor: '#FFFFFF' }
        );

        // ボタンをインタラクティブに設定
        itemButton.setInteractive();

        // ボタンクリック時のイベント処理
        itemButton.on('pointerdown', () => {
            console.log(`Selected item: ${item.item_name}`);
            // 必要に応じて以下の関数を呼び出し
            // selectConsumer(item, friends, scene, config, playerStatus, friends);
            itemRole(item, playerStatus, friends, scene); // 必要な引数を渡して itemRole を呼び出し
            itemUse(item);  // アイテムの数を減らす（itemList を更新するロジックを追加）
            useItem(scene, config, gameStatus, itemList);
        });

        // ボタンをアイテムコンテナに追加
        itemContainer.add(itemButton);
    });

    // アイテムコンテナを可視化
    itemContainer.setVisible(true);
}


export function useItem(scene, config, gameStatus, itemList) {
    // 関数の実装
    console.log("useItem function called");
    // アイテム使用処理を記述
}


/**
 * アイテムメニューの更新処理（カメラ追従用）
 */
export function updateItemMenu(scene) {
    const camera = scene.cameras.main;
    const menuX = camera.worldView.x + camera.worldView.width / 2;
    const menuY = camera.worldView.y + camera.worldView.height / 2;

    // アイテムメニューをカメラ位置に追従させる
    if (itemContainer) {
        itemContainer.setPosition(menuX - itemContainer.width / 2, menuY - itemContainer.height / 2);
    }

    // ポインターもカメラ位置に追従
    if (itemPointer) {
        itemPointer.setPosition(menuX - 50, menuY - 50);
    }
}
