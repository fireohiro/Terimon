import Phaser from '../lib/phaser.js';
// import {mappreload} from '../modules/map.js';

export default class PreloadScene extends Phaser.Scene {
    constructor() {
        super({ key: 'PreloadScene' });
    }

    preload() {
        // アセットの読み込み処理
        this.load.image('title-background', './src/assets/title-background.jpg');//タイトル画面の背景

        // 主人公の画像セットの読み込み
        this.load.spritesheet('playerTexture', 'src/assets/character/terimon1.png', { frameWidth: 32, frameHeight: 32 });

        // タイルセットの画像をロード
        for (let i = 1; i <= 15; i++) {
            this.load.image(`town${i}`, `./src/assets/tilesets/town${i}.png`);
        }

        const mapJsonFiles = [
            { id: "house", path: "src/assets/tilemaps/house.json" },
            { id: "home", path: "src/assets/tilemaps/home.json" },
            { id: "grass", path: "src/assets/tilemaps/grass.json" },
            { id: "dungeon_entry", path: "src/assets/tilemaps/dungeon_entry.json" },
            { id: "town", path: "src/assets/tilemaps/town.json" },
            { id: "gacha", path: "src/assets/tilemaps/gacha.json" },
            { id: "dungeon", path: "src/assets/tilemaps/dungeon.json" },
            { id: "ranch", path: "src/assets/tilemaps/ranch.json" }
            // 他のマップがあれば追加
        ];

        mapJsonFiles.forEach(map => {
            this.load.tilemapTiledJSON(map.id, map.path);
        });
    }

    create() {
        this.scene.start('DataScene'); // タイトルシーンへ遷移
    }
}