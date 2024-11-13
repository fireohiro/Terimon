// ゲームの設定（画面サイズを 1500 x 750 に設定）
const config = {
    type: Phaser.AUTO,
    width: 1500,
    height: 750,
    scene: ShopScene,
    backgroundColor: '#2d2d2d'
};

const game = new Phaser.Game(config);

class ShopScene extends Phaser.Scene {
    constructor() {
        super({ key: 'ShopScene' });
        this.playerMoney = 3000; // 初期の所持金
    }

    preload() {
        // 背景画像やNPCのスプライトを読み込みます
        this.load.image('background', 'path/to/background.png');
        this.load.image('npc', 'path/to/npc.png');

        // shop.phpからアイテムデータを取得
        this.load.json('items', 'https://your-server.com/shop.php');
    }

    create() {
        // 背景を表示（画面の中央に配置）
        this.add.image(750, 375, 'background');

        // NPC画像を表示（左端に配置）
        this.add.image(200, 250, 'npc');

        // アイテムリストの背景枠
        const itemListBackground = this.add.rectangle(300, 375, 400, 500, 0xFFFFFF).setStrokeStyle(2, 0x000000).setAlpha(0.8);

        // アイテム詳細表示の背景枠
        const itemDetailsBackground = this.add.rectangle(1150, 300, 300, 200, 0xFFFFFF).setStrokeStyle(2, 0x000000).setAlpha(0.8);

        // 「アイテム一覧」の見出し
        this.add.text(itemListBackground.x - 150, itemListBackground.y - 230, 'アイテム一覧', { fontSize: '24px', fontStyle: 'bold', color: '#000' });

        // 所持金表示の背景枠
        const goldBackground = this.add.rectangle(1150, 500, 300, 50, 0xFFFFFF).setStrokeStyle(2, 0x000000).setAlpha(0.8);

        // 所持金表示テキスト
        this.moneyText = this.add.text(goldBackground.x - 80, goldBackground.y - 15, `所持金 ${this.playerMoney}T`, { fontSize: '22px', color: '#000' });

        // 「かう」と「でる」ボタン
        const buyButton = this.add.text(goldBackground.x - 90, goldBackground.y - 80, 'かう', { fontSize: '22px', color: '#000' });
        const exitButton = this.add.text(goldBackground.x + 50, goldBackground.y - 80, 'でる', { fontSize: '22px', color: '#000' });

        // ボタンのスタイル変更
        buyButton.setInteractive();
        buyButton.on('pointerover', () => buyButton.setStyle({ color: '#ff0000', fontStyle: 'bold' }));
        buyButton.on('pointerout', () => buyButton.setStyle({ color: '#000000', fontStyle: 'normal' }));

        exitButton.setInteractive();
        exitButton.on('pointerover', () => exitButton.setStyle({ color: '#ff0000', fontStyle: 'bold' }));
        exitButton.on('pointerout', () => exitButton.setStyle({ color: '#000000', fontStyle: 'normal' }));
        exitButton.on('pointerdown', () => this.scene.start('PreviousScene')); // シーンを戻る

        // アイテム詳細テキスト
        let selectedItem = null;
        let detailText = this.add.text(itemDetailsBackground.x - 130, itemDetailsBackground.y - 60, '', { fontSize: '18px', color: '#000' });

        // アイテムリストを表示
        const items = this.cache.json.get('items');
        let yOffset = 150;
        items.forEach((item, index) => {
            const itemText = this.add.text(150, yOffset, `${item.price} - ${item.item_name}T`, { fontSize: '18px', color: '#000' });
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
            if (selectedItem && this.playerMoney >= selectedItem.naiyou) {
                this.playerMoney -= selectedItem.naiyou;
                this.moneyText.setText(`所持金 ${this.playerMoney}T`);
                alert(`${selectedItem.item_name}を購入しました！`);
            } else if (selectedItem) {
                alert("所持金が足りません！");
            } else {
                alert("アイテムを選択してください！");
            }
        });
    }
}