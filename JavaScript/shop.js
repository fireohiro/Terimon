    export function shopPreload(loader) {
        // 必要な画像などを読み込み
        loader.image('shopBackground', 'assets/shop/shop_background.png');
        loader.image('shopNpc', 'assets/shop/npc.png');
        // 他のアイテム画像なども読み込む
    }

    export async function loadItems() {
        try {
            const response = await fetch('shop.php'); // PHPファイルのURLを指定
            return await response.json();
        } catch (error) {
            console.error('アイテムデータの取得に失敗しました:', error);
            return null;
        }
    }

    let shopContainer;
    export function shopEvent(gameStatus){
        gameStatus.shopflg = !gameStatus.shopflg;
        if (shopContainer) {
            shopContainer.setVisible(gameStatus.shopflg);
            console.log(`shopContainer の表示状態: ${shopContainer.visible}`);
        } else {
            console.error('shopContainer が見つかりません！');
        }
    }

    export async function createShop(scene, playerStatus, config,gameStatus){
        if (shopContainer) {
            return; // 既に作成済みなら何もしない
        }
        const shopItems = await loadItems(); // 非同期処理でデータ取得
        if (!shopItems || shopItems.length === 0) {
            console.error('アイテムリストが取得できませんでした');
            return;
        }
        console.log(`shopContainer: ${!!shopContainer}, shopflg: ${gameStatus.shopflg}`);
        console.log(shopItems);
        // 背景を表示（画面の中央に配置）
        const background = scene.add.image(750, 375, 'shopBackground');

        // NPC画像を表示（左端に配置）
        const npc = scene.add.image(200, 250, 'shopNpc');

        // アイテムリストの背景枠
        const itemListBackground = scene.add.rectangle(300, 375, 400, 500, 0xFFFFFF).setStrokeStyle(2, 0x000000).setAlpha(0.8);

        // アイテム詳細表示の背景枠
        const itemDetailsBackground = scene.add.rectangle(1150, 300, 300, 200, 0xFFFFFF).setStrokeStyle(2, 0x000000).setAlpha(0.8);

        // 「アイテム一覧」の見出し
        const itiran = scene.add.text(itemListBackground.x - 150, itemListBackground.y - 230, 'アイテム一覧', { fontSize: '24px', fontStyle: 'bold', color: '#000' });

        // 所持金表示の背景枠
        const goldBackground = scene.add.rectangle(1150, 500, 300, 50, 0xFFFFFF).setStrokeStyle(2, 0x000000).setAlpha(0.8);

        // 所持金表示テキスト
        const money = scene.add.text(goldBackground.x - 80, goldBackground.y - 15, `所持金 ${playerStatus.money}T`, { fontSize: '22px', color: '#000' });

        // 「かう」と「でる」ボタン
        const buyButton = scene.add.text(goldBackground.x - 90, goldBackground.y - 80, 'かう', { fontSize: '22px', color: '#000' });
        const exitButton = scene.add.text(goldBackground.x + 50, goldBackground.y - 80, 'でる', { fontSize: '22px', color: '#000' });

        // ボタンのスタイル変更
        buyButton.setInteractive();
        buyButton.on('pointerover', () => buyButton.setStyle({ color: '#ff0000', fontStyle: 'bold' }));
        buyButton.on('pointerout', () => buyButton.setStyle({ color: '#000000', fontStyle: 'normal' }));

        exitButton.setInteractive();
        exitButton.on('pointerover', () => exitButton.setStyle({ color: '#ff0000', fontStyle: 'bold' }));
        exitButton.on('pointerout', () => exitButton.setStyle({ color: '#000000', fontStyle: 'normal' }));
        exitButton.on('pointerdown', () => {
            if (shopContainer) {
                gameStatus.shopflg = false;
                shopContainer.setVisible(false); 
            }
        });

        // アイテム詳細テキスト
        let selectedItem;
        const detailText = scene.add.text(itemDetailsBackground.x - 130, itemDetailsBackground.y - 60, '', { fontSize: '18px', color: '#000' });

        // アイテムリストを表示
        let yOffset = 150;
        let itemTexts = [];
        shopItems.forEach((item, index) => {
            let itemText = scene.add.text(150, yOffset, `${item.price}T - ${item.item_name}`, { fontSize: '18px', color: '#000' });
            itemText.setInteractive();
            itemTexts.push(itemText);
            yOffset += 30;

            // クリック可能にし、クリックで詳細表示
            itemText.setInteractive();
            itemText.on('pointerover', () => itemText.setStyle({ color: '#ff0000', fontStyle: 'bold' })); // ホバーで色変更
            itemText.on('pointerout', () => itemText.setStyle({ color: '#000000', fontStyle: 'normal' }));
            itemText.on('pointerdown', () => {
                selectedItem = item;
                detailText.setText(`${item.item_name}\n${item.setumei}\n効果: ${item.naiyou} HP`);
            });
        });

        // 「かう」ボタンのクリック処理
        buyButton.on('pointerdown', () => {
            if (selectedItem && playerStatus.money >= selectedItem.price) {
                playerStatus.money -= selectedItem.price;
                scene.moneyText.setText(`所持金 ${playerStatus.money}T`);
                alert(`${selectedItem.item_name}を購入しました！`);
            } else if (selectedItem) {
                alert("所持金が足りません！");
            } else {
                alert("アイテムを選択してください！");
            }
        });

        shopContainer=scene.add.container(0,0,[background,npc,itemListBackground,itemDetailsBackground,itiran,goldBackground,money,buyButton,exitButton,detailText, ...itemTexts]);
        shopContainer.setVisible(false);
        shopContainer.setDepth(7);
    }

    export function shopUpdate(scene){
        if (shopContainer) {
            const camera = scene.cameras.main;
            shopContainer.setPosition(camera.scrollX, camera.scrollY);
        }
    }
