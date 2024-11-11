import Phaser from '../lib/phaser.js';

export default class GameOverScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameOverScene' });
    }

    create() {
        this.add.text(100, 100, 'Game Over', { fontSize: '32px', fill: '#ff0000' });
        const retryButton = this.add.text(100, 200, 'Retry', { fontSize: '24px', fill: '#ffffff' })
            .setInteractive()
            .on('pointerdown', () => this.scene.start('WorldScene')); // ワールドシーンに戻る
    }
}