export default class PreloadScene extends Phaser.Scene {
    constructor() {
        super({ key: 'PreloadScene' });
    }

    preload() {

        // アセットの読み込み処理
        
        //タイトル画面の背景
        this.load.image('title-background', 'src/assets/title-background.jpg');

        // 主人公の画像セットの読み込み
        this.load.spritesheet('playerTexture', 'src/assets/character/terimon1.png', { frameWidth: 32, frameHeight: 32 });

        //主人公の家内
        this.load.tilemapTiledJSON('houseMap','src/assets/tilemaps/house.json');
        for(let i = 1; i <= 9;i++){
            this.load.spritesheet(`house${i}`,`src/assets/tilesets/house${i}.png`, { frameWidth: 32, frameHeight: 32 });
        }
        
        //主人公の家外
        this.load.tilemapTiledJSON('homeMap','src/assets/tilemaps/home.json');
        this.load.spritesheet('home1','src/assets/tilesets/home1.png', { frameWidth: 32, frameHeight: 32 });
        
        //草原
        this.load.tilemapTiledJSON('grassMap','src/assets/tilemaps/grass.json');
        for(let i = 1; i <= 2; i++){
            this.load.spritesheet(`grass${i}`,`src/assets/tilesets/grass${i}.png`, { frameWidth: 32, frameHeight: 32 });
        }

        //町
        this.load.tilemapTiledJSON('townMap','src/assets/tilemaps/town.json');
        for(let i = 1; i <= 15; i++){
            this.load.spritesheet(`town${i}`,`src/assets/tilesets/town${i}.png`, { frameWidth: 32, frameHeight: 32 });
        }
        
        //ガチャ
        this.load.tilemapTiledJSON('gachaMap','src/assets/tilemaps/gacha.json');
        this.load.spritesheet('gacha1','src/assets/tilesets/gacha1.png', { frameWidth: 32, frameHeight: 32 });

        //ダンジョン入り口
        this.load.tilemapTiledJSON('entryMap','src/assets/tilemaps/dungeon_entry.json');
        for(let i = 1; i <= 2; i++){
            this.load.spritesheet(`entry${i}`,`src/assets/tilesets/entry${i}`, { frameWidth: 32, frameHeight: 32 });
        }

        //ダンジョン
        this.load.tilemapTiledJSON('dungeonMap','src/assets/tilemaps/dungeon.json');
        for(let i = 1; i <= 7; i++){
            this.load.spritesheet(`rock${i}`,`src/assets/tilesets/rock${i}.png`, { frameWidth: 32, frameHeight: 32 });
        }

        //牧場
        this.load.tilemapTiledJSON('ranchMap','src/assets/tilemaps/ranch.json');
        this.load.spritesheet(`ranch1`,`src/assets/tilesets/ranch1.png`, { frameWidth: 32, frameHeight: 32 });
    }

    create() {
        this.scene.start('DataScene'); // タイトルシーンへ遷移
    }
}