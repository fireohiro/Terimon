import Player from '../modules/player.js';

export default class WorldScene extends Phaser.Scene {
    constructor() {
        super({ key: 'WorldScene' });
    }

    create() {
        const dataScene = this.scene.get('DataScene');
        this.saveData = dataScene.data.get('SaveData')[0];

        this.mapManager = new MapManager(this);
        this.currentMap = saveData.map_id; // 初期マップキー
        this.loadMap(this.currentMap);

        this.player = new Player(this,saveData.save_point_x,saveData.save_point_y,'player',saveData.speed);
        this.cursors = this.input.keyboard.createCursorKeys();     
    }

    update(){
        this.player.move(this.cursors);
    }

    // マップの読み込みとプレイヤーの初期化
    loadMap(mapKey, startX = null, startY = null) {
        this.mapManager.loadMap(mapKey, `path/to/${mapKey}.json`, 'tilesetKey', 'path/to/tileset.png')
        .then(() => {
            if (this.player) {
            this.player.destroy();
            }
            const startPosition = { x: startX || 100, y: startY || 100 }; // デフォルト位置
            this.createPlayer(startPosition.x, startPosition.y);
        });
    }
    // プレイヤー作成
    createPlayer(x, y) {
        this.player = this.physics.add.sprite(x, y, 'playerTexture');
        this.physics.add.collider(this.player, this.mapManager.groundLayer);
    }
    update() {
    // マップ切り替えのトリガーをチェック
        const transition = this.mapManager.checkTransition(this.player);
        if (transition) {
            this.changeMap(transition);
        }
    }
    // マップを切り替え
    changeMap(transition) {
        this.currentMap = transition.targetMap;
        this.loadMap(this.currentMap, transition.targetX, transition.targetY);
    }
}
 