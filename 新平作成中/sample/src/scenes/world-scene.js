import Player from '../modules/player.js';
import MapManager from '../modules/map.js';
import EventManager from '../modules/event.js';



export default class WorldScene extends Phaser.Scene {
    constructor() {
        super({ key: 'WorldScene' });
    }

    create() {
        const dataScene = this.scene.get('DataScene');
        const saveData = dataScene.data.get('SaveData')[0];

        // プレイヤーのインスタンス
        this.player = new Player(this,saveData.save_point_x,saveData.save_point_y,'playerTexture',saveData.speed);

        // マップのインスタンス
        this.mapManager = new MapManager(this);

        // マップイベントのインスタンス
        this.eventManager = new EventManager(this);

        // マップ・プレイヤーの表示
        this.loadMap(saveData.map_id, saveData.save_point_x, saveData.save_point_y, this.player.sprite);
  
        // 移動カーソル
        this.cursors = this.input.keyboard.createCursorKeys();

        // キーボード入力を設定
        this.input.keyboard.on("keydown-E", () => {
            this.checkForInteraction();
            //////////// デバッグ用
            this.player.drawInteractionArea(); // 調査範囲を描画
        });

    }

    update(){
        this.player.move(this.cursors);

        // マップ切り替えのトリガーをチェック
        const transition = this.mapManager.checkTransition(this.player.sprite);
        if (transition) {
            this.changeMap(transition);
        }
    }

    // マップの読み込みとプレイヤーの初期化
    loadMap(mapKey, startX, startY,player) {
        this.mapManager.loadMap(mapKey,player)
        .then(() => {
            const startPosition = { x: startX, y: startY}; 
            this.setPlayer(startPosition.x, startPosition.y);
        });
        // EventLayer(オブジェクトレイヤー)を渡して処理
        this.eventManager.loadEventsFromLayer(this.mapManager.getMap());
    }

    // プレイヤー作成
    setPlayer(x, y) {
            this.player.setPosition(x,y);
    }

    // マップを切り替え
    changeMap(transition) {
        // コライダーを削除
        this.loadMap(transition.targetMap, transition.targetX, transition.targetY,this.player.sprite);
    }

    // プレイヤーの調査処理
    checkForInteraction() {
        const interactionArea = this.player.getInteractionArea();
        // イベントの範囲チェック
        const event = this.eventManager.findEventAt(interactionArea);
        if (event) {
            this.eventManager.triggerEvent(event, this.player);
        } else {
            console.log("何も見つかりませんでした");
        }
    }
}
 