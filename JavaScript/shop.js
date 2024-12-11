import {itemGet} from './main.js';
import {playerstop} from './player.js';
import { playEffect } from './sound.js';

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
export function shopEvent(scene,gameStatus, playerStatus, config){
    gameStatus.shopflg = !gameStatus.shopflg;
    if(gameStatus.shopflg){
        playEffect(scene,'mart');
        createShop(scene, playerStatus, config, gameStatus);
    }else{
        if(shopContainer){
            shopContainer.destroy();
        }
    }
}

export async function createShop(scene, playerStatus, config,gameStatus){
    playerstop();
    const shopItems = await loadItems(); // 非同期処理でデータ取得
    if (!shopItems || shopItems.length === 0) {
        console.error('アイテムリストが取得できませんでした');
        return;
    }
    // 背景を表示（画面の中央に配置）x+300,y+600
    const background = scene.add.image(920, 900, 'shopBackground').setScale(1.3);

    // NPC画像を表示（左端に配置）
    const npc = scene.add.image(600, 850, 'shopNpc').setScale(0.55);

    // アイテムリストの背景枠
    const itemListBackground = scene.add.rectangle(770, 1020, 800, 300, 0xFFFFFF).setStrokeStyle(2, 0x000000);

    // アイテム詳細表示の背景枠
    const itemDetailsBackground = scene.add.rectangle(1350, 950, 300, 200, 0xFFFFFF).setStrokeStyle(2, 0x000000);

    // 「アイテム一覧」の見出し
    const itiran = scene.add.text(itemListBackground.x - 150, itemListBackground.y - 120, 'アイテム一覧', { fontSize: '36px', fontStyle: 'bold', color: '#000' });

    // 所持金表示の背景枠
    const goldBackground = scene.add.rectangle(1350, 1145, 300, 50, 0xFFFFFF).setStrokeStyle(2, 0x000000);

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
        shopEvent(scene,gameStatus, playerStatus, config);
    });

    // アイテム詳細テキスト
    let selectedItem;
    const detailText = scene.add.text(itemDetailsBackground.x - 130, itemDetailsBackground.y - 70, '', { fontSize: '18px', color: '#000' });
    let quantity = 1; // 初期購入数
    let quantityText, totalPriceText;
    let decrementButton,incrementButton;

    // 購入数と合計価格の表示
    const updateQuantityDisplay = (item) => {
        if (quantityText && totalPriceText) {
            quantityText.setText(`個数: ${quantity}`);
            totalPriceText.setText(`合計: ${item.price * quantity}T`);
        }
    };

    // 個数変更ボタン
    
    const addQuantityButtons = (x, y, item) => {
    if (!decrementButton || !incrementButton || !quantityText || !totalPriceText) {
        decrementButton = scene.add.text(x, y, '-', { fontSize: '24px', color: '#000' });
        decrementButton.setInteractive();
        decrementButton.on('pointerdown', () => {
            if (quantity > 1) {
                quantity--;
                updateQuantityDisplay(item);
            }
        });

        quantityText = scene.add.text(x + 30, y, `個数: ${quantity}`, { fontSize: '24px', color: '#000' });

        incrementButton = scene.add.text(x + 140, y, '+', { fontSize: '24px', color: '#000' });
        incrementButton.setInteractive();
        incrementButton.on('pointerdown', () => {
            if (quantity < 50) {
                quantity++;
                updateQuantityDisplay(item);
            }
        });

        totalPriceText = scene.add.text(x, y + 40, `合計: ${item.price * quantity}TP`, { fontSize: '24px', color: '#000' });
        // 必要なテキストやボタンが作成された後に追加
        if (shopContainer) {
            shopContainer.add([decrementButton, quantityText, incrementButton, totalPriceText]);
        }
    }else{
        updateQuantityDisplay(item);
    }
    };

    // アイテムリスト表示
    let yOffset = 950;
    let itemTexts = [];
    shopItems.forEach((item, index) => {
        let itemText = scene.add.text(450, yOffset, `${item.price}TP - ${item.item_name}`, { fontSize: '24px', color: '#000' });
        itemText.setInteractive();
        itemTexts.push(itemText);
        yOffset += 30;

        itemText.on('pointerdown', () => {
            selectedItem = item;
            quantity = 1; // 選択時に購入数を初期化
            // 改行処理
            const formatText = (text, lineLength) => {
                const regex = new RegExp(`(.{1,${lineLength}})`, 'g'); // 1行の最大文字数で分割
                return text.match(regex).join('\n'); // 分割した文字列を改行で結合
            };

            // `setumei`を30文字ごとに改行
            const formattedSetumei = formatText(item.setumei, 15);
            detailText.setText(`${item.item_name}\n${formattedSetumei}\n効果: ${item.naiyou}`);

            if (!quantityText || !totalPriceText) {
                addQuantityButtons(itemDetailsBackground.x - 130, itemDetailsBackground.y + 10, selectedItem);
            } else {
                updateQuantityDisplay(selectedItem);
            }
        });
    });

    // 「かう」ボタンの処理を修正
    buyButton.on('pointerdown', () => {
        if (selectedItem) {
            const totalPrice = selectedItem.price * quantity;
            if (playerStatus.money >= totalPrice) {
                playerStatus.money -= totalPrice;
                money.setText(`所持金 ${playerStatus.money}TP`);
                playEffect(scene,'cash');
                alert(`${selectedItem.item_name}を${quantity}個購入しました！`);
                itemGet(selectedItem,quantity);
            } else {
                alert('所持金が足りません！');
            }
        } else {
            alert('アイテムを選択してください！');
        }
    });

        // shopContainerを作成して表示状態を管理
    const containerItems = [
        background, npc, itemListBackground, itemDetailsBackground, 
        itiran, goldBackground, money, buyButton, exitButton, 
        detailText, ...itemTexts
    ];
    shopContainer = scene.add.container(0, 0, containerItems);
    shopContainer.setDepth(9);
}

export function shopUpdate(scene){
    if (shopContainer) {
        const camera = scene.cameras.main;
        shopContainer.setPosition(camera.scrollX, camera.scrollY);
    }
}
