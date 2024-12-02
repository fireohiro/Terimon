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

    // export async function fetchItems() {
    //     console.log("進んでます！！！！！");
    //     try {
    //         const response = await fetch('get_item.php');
    //         console.log("Response received", response); // レスポンス確認用ログ
            
    //         // レスポンスが成功かどうか確認
    //         if (!response.ok) {
    //             throw new Error('Network response was not ok ' + response.statusText);
    //         }
            
    //         const text = await response.text();  // レスポンスをテキストとして取得
    
    //         const data = await response.json();  // JSONとして直接取得

    //         if(data !== null){
    //             itemList = data.items;  // itemsをitemListに代入
    //         }
    //     } catch (error) {
    //         console.error('Error fetching items:', error);
    //     }
    // }

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
export async function createItemButtons(scene, config, gameStatus, itemList) {
    console.log("Creating item buttons...");

    // gameStatusが渡されているか確認
    if (!gameStatus || typeof gameStatus !== "object") {
        console.error("gameStatus is missing or invalid:", gameStatus);
        return;
    }

    // itemListのデータ型を確認
    if (!Array.isArray(itemList)) {
        console.error("itemList is not an array:", itemList);
        return;
    }

    const buttonSpacing = 40;
    let posY = config.height / 2 - itemList.length * buttonSpacing / 2;

    // アイテムデータが空の場合のハンドリング
    if (itemList.length === 0) {
        console.warn("アイテムリストが空です。");
        return;
    }

    // 既存のボタンがあれば削除（リセットのため）
    if (itemContainer) {
        itemContainer.each(child => child.destroy()); // コンテナ内のすべての子要素を破棄
    }

    const itemButtons = itemList.map((item, index) => {
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
            useItem(scene, config, gameStatus, itemList);
        });

        return itemButton;
    });

    // コンテナを再生成
    itemContainer = createContainer(scene, itemButtons, {
        visible: true,
        depth: 7
    });
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
