export default class MapManager {
    constructor(scene) {
      this.scene = scene;
      this.tilemap = null;
      this.transitionTriggers = []; // 移動トリガーの情報を格納
    }
    // マップをロードし、トリガーエリアを設定
    loadMap(mapKey, mapJsonPath, tilesetKey, tilesetImagePath) {
      return new Promise((resolve, reject) => {
        this.scene.load.tilemapTiledJSON(mapKey, mapJsonPath);
        this.scene.load.image(tilesetKey, tilesetImagePath);
        this.scene.load.once('complete', () => {
          this.createMap(mapKey, tilesetKey);
          this.setTransitionTriggers();
          resolve();
        });
        this.scene.load.start();
      });
    }
    // タイルマップを生成
    createMap(mapKey, tilesetKey) {
      this.tilemap = this.scene.make.tilemap({ key: mapKey });
      const tileset = this.tilemap.addTilesetImage(tilesetKey);
      this.groundLayer = this.tilemap.createLayer('Ground', tileset, 0, 0);
      this.objectLayer = this.tilemap.createLayer('Objects', tileset, 0, 0);
      this.groundLayer.setCollisionByProperty({ collides: true });
      this.scene.physics.world.bounds.width = this.tilemap.widthInPixels;
      this.scene.physics.world.bounds.height = this.tilemap.heightInPixels;
    }
    // トリガーエリアを設定（マップオブジェクトレイヤーを利用）
    setTransitionTriggers() {
      this.transitionTriggers = this.tilemap.getObjectLayer('Transitions').objects.map(obj => ({
        x: obj.x,
        y: obj.y,
        width: obj.width,
        height: obj.height,
        targetMap: obj.properties.find(prop => prop.name === 'targetMap').value,
        targetX: obj.properties.find(prop => prop.name === 'targetX').value,
        targetY: obj.properties.find(prop => prop.name === 'targetY').value
      }));
    }
    // プレイヤーがトリガーに触れているかをチェック
    checkTransition(player) {
      for (const trigger of this.transitionTriggers) {
        if (
          player.x >= trigger.x && player.x <= trigger.x + trigger.width &&
          player.y >= trigger.y && player.y <= trigger.y + trigger.height
        ) {
          return trigger; // 移動対象のトリガー情報を返す
        }
      }
      return null;
    }
}
