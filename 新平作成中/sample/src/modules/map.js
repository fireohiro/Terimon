export default class MapManager{
  constructor(scene) {
    this.scene = scene;
    this.tilemap = null; // this.scene.make.tilemap
    this.tilesets = []; // タイルセット分のthis.tilemap.addTilesetImage
    this.layersu = 0; // tilemapのレイヤー数
    this.layers = []; // レイヤー数分のthis.tilemap.createLayer

    this.collisionLayer = null;//   衝突レイヤー
    this.tilemapLayerBodies = null; // TilemapLayer に関連付けたボディを格納する配列

    this.collisionObjects = null;// 衝突オブジェクト
    this.matterBodies = [];// 衝突オブジェクトのthis.scene.matter.add.(rectangle・circle・fromVertices)
    
    this.transitionTriggers = []; // 移動トリガーの情報

  }

  // リソースを破棄
  destroy(player) {
    this.scene.matter.world.pause(); 

    // 世界のすべてのボディを取得
    const bodies = this.scene.matter.world.engine.world.bodies;
    // プレイヤーのボディを取得
    const playerBody = player.body; // プレイヤーのMatterボディ
    // プレイヤー以外のボディを削除
    bodies.forEach(body => {
      if (body !== playerBody) {
        this.scene.matter.world.remove(body);
      }
    });
    // 残りの制約も削除
    const constraints = this.scene.matter.world.engine.world.constraints;
    constraints.forEach(constraint => {
      this.scene.matter.world.remove(constraint);
    });
    // ワールド内の参照をクリア（プレイヤーは除外）
    this.scene.matter.world.engine.world.bodies = [playerBody];
    this.scene.matter.world.engine.world.constraints = [];
    this.scene.matter.world.engine.enabled = true; // エンジンを再有効化

    if(this.collisionLayer){
      this.collisionLayer.destroy();
      this.collisionLayer = null;
    }

    if (this.tilemap) {
      this.layers.forEach(layer => layer.destroy());
      this.tilemap.destroy();
      this.tilemap = null;
    }

    this.tilesets = [];
    this.layersu = 0;
    this.layers = [];

    this.collisionObjects = null;
    
    this.transitionTriggers = [];
    
    this.scene.matter.world.resume();  // シミュレーションを再開
  }

  // マップをロードし、トリガーエリアを設定
  loadMap(mapKey,player) {
    return new Promise((resolve) => {
      this.destroy(player);
      // マップを作成し、トリガーを設定
      this.createMap(mapKey,player);
      this.setTransitionTriggers();
      resolve();
    });
  }

  // タイルマップを生成
  createMap(mapKey,player) {
    //マップidごとに表示させる
    if(mapKey == 1){
      this.tilemap = this.scene.make.tilemap({key:'houseMap'});
      for(let i = 1; i <= 9; i++){
        let tileset = this.tilemap.addTilesetImage(`house${i}`, `house${i}`);
        this.tilesets.push(tileset);
      }
      this.layersu = 4;//レイヤーの数を格納
    }else if(mapKey == 2){
      this.tilemap = this.scene.make.tilemap({key:'homeMap'});
      let tileset = this.tilemap.addTilesetImage('home1', 'home1');
      this.tilesets.push(tileset);
      this.layersu = 3;
    }else if(mapKey == 3){
      this.tilemap = this.scene.make.tilemap({key:'grassMap'});
      for(let i = 1; i <= 2; i++){
        let tileset = this.tilemap.addTilesetImage(`grass${i}`, `grass${i}`);
        this.tilesets.push(tileset);
      }
      this.layersu = 2;
    }else if(mapKey == 4){
      this.tilemap = this.scene.make.tilemap({key:'townMap'});
      for(let i = 1; i <= 15; i++){
        let tileset = this.tilemap.addTilesetImage(`town${i}`, `town${i}`);
        this.tilesets.push(tileset);
      }
      this.layersu = 4;
    }else if(mapKey == 5){
      this.tilemap = this.scene.make.tilemap({key:'gachaMap'});
      for(let i = 1; i <= 1; i++){
        let tileset = this.tilemap.addTilesetImage(`gacha${i}`, `gacha${i}`);
        this.tilesets.push(tileset);
      }
      this.layersu = 2;
    }else if(mapKey == 6){
      this.tilemap = this.scene.make.tilemap({key:'entryMap'});
      for(let i = 1; i <= 2; i++){
        let tileset = this.tilemap.addTilesetImage(`entry${i}`, `entry${i}`);
        this.tilesets.push(tileset);
      }
      this.layersu = 2;
    }else if(mapKey == 7){
      this.tilemap = this.scene.make.tilemap({key:'dungeonMap'});
      for(let i = 1; i <= 7; i++){
        let tileset = this.tilemap.addTilesetImage(`rock${i}`, `rock${i}`);
        this.tilesets.push(tileset);
      }
      this.layersu = 3;
    }else if(mapKey == 8){
      this.tilemap = this.scene.make.tilemap({key:'ranchMap'});
      let tileset = this.tilemap.addTilesetImage(`ranch1`, `ranch1`);
      this.tilesets.push(tileset);
      this.layersu = 4;
    }
    // レイヤーを作成
    for (let i = 1; i <= this.layersu; i++) {
      const layerName = `layer${i}`; // レイヤー名を統一
      this.layers.push(this.tilemap.createLayer(layerName, this.tilesets, 0, 0));
    }

    //レイヤーの変更
    if(mapKey == 1){
      this.layers[0].setDepth(0);
      this.layers[1].setDepth(1);
      this.layers[2].setDepth(3);
      player.setDepth(2);
      this.layers[2].setCollisionByProperty({ collides: true });
      this.layers[3].setDepth(4);
    }else if(mapKey == 2){
      //必要に応じて変える
      this.layers[0].setDepth(0);
      player.setDepth(1);
      this.layers[1].setDepth(2);
      this.layers[2].setDepth(3);
    }else if(mapKey == 3){
      this.layers[0].setDepth(0);
      player.setDepth(1);
      this.layers[1].setDepth(2);
    }else if(mapKey == 4){
      this.layers[0].setDepth(0);
      this.layers[1].setDepth(1);
      player.setDepth(2);
      this.layers[2].setDepth(3);
      this.layers[3].setDepth(4);
    }else if(mapKey == 5){
      this.layers[0].setDepth(0);
      player.setDepth(1);
      this.layers[1].setDepth(2);
    }else if(mapKey == 6){
      this.layers[0].setDepth(0);
      player.setDepth(1);
      this.layers[1].setDepth(2);
    }else if(mapKey == 7){
      this.layers[0].setDepth(0);
      this.layers[1].setDepth(1);
      this.layers[2].setDepth(2);
      player.setDepth(3);
    }else if(mapKey == 8){
      this.layers[0].setDepth(0);
      this.layers[1].setDepth(1);
      player.setDepth(2);
      this.layers[2].setDepth(3);
      this.layers[3].setDepth(4);
    }

    // 衝突レイヤーを設定
    this.collisionLayer = this.tilemap.createLayer('CollisionLayer', this.tilesets, 0, 0);
    this.collisionLayer.setCollisionByProperty({ collides: true });

    // 衝突レイヤーを透明にする
    this.collisionLayer.visible = false;

    // 衝突レイヤーとプレイヤーとの衝突を追加
    this.scene.matter.world.convertTilemapLayer(this.collisionLayer);
  
    // オブジェクトレイヤーから衝突レイヤーを取得
    this.collisionObjects = this.tilemap.getObjectLayer('CollisionObjects');

    // オブジェクトごとに処理を適用
    if(this.collisionObjects){
      this.collisionObjects.objects.forEach(obj => {
      if(obj.type === 'box'){
        const centerX = obj.x + obj.width / 2;
        const centerY = obj.y + obj.height / 2;
        // 四角形オブジェクトを作成
        const box = this.scene.matter.add.rectangle(
          centerX,
          centerY,
          obj.width,
          obj.height,
          { isStatic: true, isSensor: false}
        );
        this.scene.matterCollision.addOnCollideStart({
          objectA: player,
          objectB: box,
          callback: () => {}// console.log("Player touched hidden box")
        });
        box.visible = false; // 衝突エリアを非表示に設定
        this.matterBodies.push(box);
      }else if (obj.type === 'ellipse') {
        // 円形オブジェクトを作成
        const isCircle = (obj.width === obj.height); // 幅と高さが等しければ円
        if (isCircle) {
          // 円として処理
          const radius = obj.width / 2;
          const circle = this.scene.matter.add.circle(
            obj.x + radius,
            obj.y + radius,
            radius,
            { isStatic: true, isSensor: false}
          );
          this.scene.matterCollision.addOnCollideStart({
            objectA: player,
            objectB: circle,
            callback: () => {}// console.log("Player touched hidden box")
          });
          circle.visible = false;
          this.matterBodies.push(circle);
        } else {
          // 楕円として処理
          const centerX = obj.x + obj.width / 2;
          const centerY = obj.y + obj.height / 2;

          const ellipseVerticesArray = [];
          const ellipseVertices = 50; // 楕円の頂点数（多いほど滑らか）
          const ellipseWidth = obj.width / 2;  // 楕円の横半径
          const ellipseHeight = obj.height / 2; // 楕円の縦半径

          // 楕円の頂点を計算
          for (let i = 0; i < ellipseVertices; i++) {
              const angle = (i / ellipseVertices) * Math.PI * 2; // 角度をラジアンで計算
              const x = ellipseWidth * Math.cos(angle);         // 楕円のx座標
              const y = ellipseHeight * Math.sin(angle);        // 楕円のy座標
              ellipseVerticesArray.push({ x, y });
          }

          // Matter.jsのボディを作成
          const ellipse = this.scene.matter.add.fromVertices(
              centerX,
              centerY,
              ellipseVerticesArray,
              { isStatic: true, isSensor: false }, // 必要に応じてオプションを調整
              true // 自動で頂点を最適化（細かい誤差を修正）
          );
          this.scene.matterCollision.addOnCollideStart({
            objectA: player,
            objectB: ellipse,
            callback: () => {}// console.log("Player touched hidden box")
          });
          ellipse.visible = false;
          this.matterBodies.push(ellipse);
        }
       } else if (obj.type === 'polygon') {

        // 多角形の頂点座標リストを取得（ワールド座標をそのまま使用）
        const points = obj.polygon.map(point => ({
          x: point.x,
          y: point.y
        }));

        const centerX = obj.x + points.reduce((sum, p) => sum + p.x, 0) / points.length;
        const centerY = obj.y + points.reduce((sum, p) => sum + p.y, 0) / points.length;

        // Matter.jsで多角形を作成
        const polygon = this.scene.matter.add.fromVertices(
          centerX,
          centerY,
          points,
          { isStatic: true ,isSensor: false} // 必要に応じて調整
        );

        // 衝突検知を設定
        this.scene.matterCollision.addOnCollideStart({
          objectA: player,
          objectB: polygon,
          callback: function(eventData) {
            // この関数は、プレイヤーと オブジェクトが衝突するたびに呼び出されます。
            const { bodyA, bodyB, gameObjectA, gameObjectB, pair } = eventData;
            // bodyA と bodyB はそれぞれプレイヤーとオブジェクトの Matter ボディです。
            // gameObjectA と gameObjectB はそれぞれプレイヤーとオブジェクトです。
            // pair はMatter.js の衝突に関する未加工のデータを表します。
          }
        });
        polygon.visible = false;
        this.matterBodies.push(polygon);
       }
    });
  }

    // マップの境界を設定
    this.scene.matter.world.setBounds(0, 0, this.tilemap.widthInPixels, this.tilemap.heightInPixels);

  }

  // トリガーエリアを設定（マップオブジェクトレイヤーを利用）
  setTransitionTriggers() {
    const transitionLayer = this.tilemap.getObjectLayer('Transitions');

    // transitionLayer が存在するか確認
    if (!transitionLayer) {
      console.warn('Transitionsレイヤーが見つかりません');
      this.transitionTriggers = []; // トリガーを空にして終了
      return;
    }

    // トリガーをマップのオブジェクトレイヤーから設定
    this.transitionTriggers = transitionLayer.objects.map(obj => ({
      x: obj.x,
      y: obj.y,
      width: obj.width,
      height: obj.height,
      targetMap: obj.properties.find(prop => prop.name === 'targetMap')?.value,
      targetX: obj.properties.find(prop => prop.name === 'targetX')?.value,
      targetY: obj.properties.find(prop => prop.name === 'targetY')?.value
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

  // map情報を返す
  getMap(){
    return this.tilemap;
  }
  
}
