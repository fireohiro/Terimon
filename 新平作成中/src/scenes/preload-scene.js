import Phaser from '../lib/phaser.js';

export default class PreloadScene extends Phaser.Scene {
    constructor() {
        super({ key: 'PreloadScene' });
    }

    preload() {
        // アセットの読み込み処理
        this.load.image('title-background', './src/assets/title-background.jpg');
    }

    create() {
        this.scene.start('TitleScene'); // タイトルシーンへ遷移
    }
}