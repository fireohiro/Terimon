import Phaser from '../lib/phaser.js';

export default class TitleScene extends Phaser.Scene {
    constructor() {
        super({ key: 'TitleScene' });
    }

    create() {
        // 横長の背景を追加
        this.background = this.add.image(0, 0, 'title-background').setOrigin(0).setScale(0.58);

        // タイトルテキストを中央に配置
        const titleText = this.add.text(this.cameras.main.centerX, this.cameras.main.centerY - 50, 'テリモンのわんだーらんど', {
            fontSize: '32px',
            fill: '#ffffff'
        }).setOrigin(0.5, 0.5); // テキストの中心を原点にする

        // スタートボタンの追加
        const startButton = this.add.text(this.cameras.main.centerX, this.cameras.main.centerY + 50, 'Start Game', {
            fontSize: '28px',
            fill: '#ffffff'
        }).setOrigin(0.5, 0.5).setInteractive();

        // スタートボタンに透明なインタラクティブなオーバーレイを作成
        const buttonOverlay = this.add.rectangle(
            this.cameras.main.centerX,
            this.cameras.main.centerY + 50,
            startButton.width,  // ボタンの幅に合わせて
            startButton.height, // ボタンの高さに合わせて
            0xffffff,  // 色は白（透明にするために必要）
            0 // 透明度を0に設定
        ).setOrigin(0.5, 0.5).setInteractive();

        // ボタンにホバー状態のイベントを追加
        buttonOverlay.on('pointerover', () => {
            startButton.setScale(0.9); // 大きさを変更
        });

        buttonOverlay.on('pointerout', () => {
            startButton.setScale(1); // 元の大きさに戻す
        });

        // ボタンに押された際のイベントを追加
        buttonOverlay.on('pointerdown', () => {
            this.scene.start('WorldScene'); // ゲームシーンに移動
        });

        // 背景の初期位置
        this.background.x = 0;
        // 背景を左に移動させる
        this.moveBackgroundLeft();
    }

    moveBackgroundLeft() {
        this.tweens.add({
            targets: this.background,
            x: -(this.background.displayWidth - this.cameras.main.width), // 背景との差分左に移動
            duration: 10000, // アニメーションの時間
            ease: 'Linear', // 線形で動かす
            onComplete: () => {
                this.moveBackgroundRight(); // 左に移動し終わったら右に動かす
            }
        });
    }

    moveBackgroundRight() {
        this.tweens.add({
            targets: this.background,
            x: 0, // 元の位置に戻す
            duration: 10000, // アニメーションの時間
            ease: 'Linear', // 線形で動かす
            onComplete: () => {
                this.moveBackgroundLeft(); // 右に移動し終わったら再度左に動かす
            }
        });
    }
}