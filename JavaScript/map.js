import {dataMap,playerupdate,getplayer} from './player.js';
import { playsound } from './sound.js';
import { createShop,shopEvent } from './shop.js';
let map;
let mapData;
let tilesets = [];
let layersu;
let previousMapId = null;
let transitionLayer;
let transitionTriggers = [];
let layer = [];
let events = [];
let imageGroup;

export function mappreload(loader){
    //主人公の家内
    loader.tilemapTiledJSON('houseMap','assets/tilemaps/house.json');
    for(let i = 1; i <= 9;i++){
        loader.spritesheet(`house${i}`,`assets/tilesets/house${i}.png`, { frameWidth: 32, frameHeight: 32 });
    }
    //主人公の家外
    loader.tilemapTiledJSON('homeMap','assets/tilemaps/home.json');
    loader.spritesheet('home1','assets/tilesets/home1.png', { frameWidth: 32, frameHeight: 32 });
    
    //草原
    loader.tilemapTiledJSON('grassMap','assets/tilemaps/grass.json');
    for(let i = 1; i <= 2; i++){
        loader.spritesheet(`grass${i}`,`assets/tilesets/grass${i}.png`, { frameWidth: 32, frameHeight: 32 });
    }
    //町
    loader.tilemapTiledJSON('townMap','assets/tilemaps/town.json');
    for(let i = 1; i <= 15; i++){
        loader.spritesheet(`town${i}`,`assets/tilesets/town${i}.png`, { frameWidth: 32, frameHeight: 32 });
    }
    
    //ガチャ
    loader.tilemapTiledJSON('gachaMap','assets/tilemaps/gacha.json');
    loader.spritesheet('gacha1','assets/tilesets/gacha1.png', { frameWidth: 32, frameHeight: 32 });

    //ダンジョンまでの道
    loader.tilemapTiledJSON('roadMap','assets/tilemaps/dungeon_road.json');
    for(let i = 1; i <= 6; i++){
        loader.spritesheet(`road${i}`,`assets/tilesets/dungeon_road${i}.png`, { frameWidth: 32, frameHeight: 32 });
    }

    loader.tilemapTiledJSON('frontMap','assets/tilemaps/dungeon_front.json');
    for(let i = 1; i <= 6; i++){
        loader.spritesheet(`front${i}`,`assets/tilesets/dungeon_front${i}.png`, { frameWidth: 32, frameHeight: 32 });
    }

    //ダンジョン前
    loader.tilemapTiledJSON('dungeonMap','assets/tilemaps/dungeon.json');
    for(let i = 1; i <= 7; i++){
        loader.spritesheet(`rock${i}`,`assets/tilesets/rock${i}.png`, { frameWidth: 32, frameHeight: 32 });
    }

    //牧場
    loader.tilemapTiledJSON('ranchMap','assets/tilemaps/ranch.json');

    loader.spritesheet('shopman','assets/event/shopMan.png', { frameWidth: 32, frameHeight: 32 });

}

export function changeMap(scene,playerStatus,gameStatus,transition,config){
    playerStatus.map_id = transition.targetMap;
    destroy(scene);
    createMap(scene,playerStatus,gameStatus,config);
}

export function createMap(scene,playerStatus,gameStatus,config){
  imageGroup=scene.add.group();
  
    let map_id = playerStatus.map_id;

    if(map_id === 3 || map_id === 6 || map_id === 7){
        gameStatus.encountflg = true;
    }else{
        gameStatus.encountflg = false;
    }

    //マップidごとに表示させる
    if(map_id === 1){
        gameStatus.scale=2.0;
        mapData = 'houseMap';
        map = scene.make.tilemap({key:'houseMap'});
        for(let i = 1; i <= 9; i++){
            let tileset = map.addTilesetImage(`house${i}`, `house${i}`);
            tilesets.push(tileset);
        }
        layersu = 5;//レイヤーの数を格納
    }else if(map_id === 2){
        gameStatus.scale=2.0;
        map = scene.make.tilemap({key:'homeMap'});
        let tileset = map.addTilesetImage('home1', 'home1');
        tilesets.push(tileset);
        layersu = 4;
    }else if(map_id === 3){
        gameStatus.scale=2.5;
        map = scene.make.tilemap({key:'grassMap'});
        for(let i = 1; i <= 2; i++){
            let tileset = map.addTilesetImage(`grass${i}`, `grass${i}`);
            tilesets.push(tileset);
        }
        layersu = 3;
    }else if(map_id === 4){
        gameStatus.scale=1.5;
        map = scene.make.tilemap({key:'townMap'});
        for(let i = 1; i <= 15; i++){
            let tileset = map.addTilesetImage(`town${i}`, `town${i}`);
            tilesets.push(tileset);
        }
        layersu = 5;
    }else if(map_id === 5){
        gameStatus.scale=1.5;
        map = scene.make.tilemap({key:'gachaMap'});
        for(let i = 1; i <= 1; i++){
            let tileset = map.addTilesetImage(`gacha${i}`, `gacha${i}`);
            tilesets.push(tileset);
        }
        layersu = 3;
    }else if(map_id === 6){
        gameStatus.scale=2.0;
        map = scene.make.tilemap({key:'roadMap'});
        for(let i = 1; i <= 6; i++){
            let tileset = map.addTilesetImage(`dungeon_road${i}`, `road${i}`);
            tilesets.push(tileset);
        }
        layersu = 4;
    }else if(map_id === 7){
        gameStatus.scale=2.5;
        map = scene.make.tilemap({key:'frontMap'});
        for(let i = 1; i <= 6; i++){
            let tileset = map.addTilesetImage(`dungeon_front${i}`, `front${i}`);
            tilesets.push(tileset);
        }
        layersu = 6;
    }else if(map_id === 8){
        gameStatus.scale=3.0;
        map = scene.make.tilemap({key:'dungeonMap'});
        for(let i = 1; i <= 7; i++){
            let tileset = map.addTilesetImage(`rock${i}`, `rock${i}`);
            tilesets.push(tileset);
        }
        layersu = 4;
    }else if(map_id === 9){
        gameStatus.scale=1.5;
        map = scene.make.tilemap({key:'ranchMap'});
        let tileset = map.addTilesetImage('town2', 'town2');
        tilesets.push(tileset);
        layersu = 4;
    }

    //マップの情報をplayer.jsに送る
    layer = [];
    for(let i = 1; i <= layersu; i++){
        const layerName = `layer${i}`;//レイヤー名をそろえる
        layer.push(map.createLayer(layerName,tilesets,0,0));
    }
    //カメラのズーム倍率を変える＆レイヤーの変更
    if(playerStatus.map_id === 1){
        layer[0].setScale(gameStatus.scale,gameStatus.scale);
        layer[1].setScale(gameStatus.scale,gameStatus.scale);
        layer[2].setScale(gameStatus.scale,gameStatus.scale);
        layer[3].setScale(gameStatus.scale,gameStatus.scale);
        layer[4].setScale(gameStatus.scale,gameStatus.scale);
        layer[0].setDepth(0);
        layer[1].setDepth(1);
        layer[2].setDepth(3);
        layer[3].setDepth(4);
    }else if(playerStatus.map_id === 2){
        //必要に応じて変える
        layer[0].setScale(gameStatus.scale,gameStatus.scale);
        layer[1].setScale(gameStatus.scale,gameStatus.scale);
        layer[2].setScale(gameStatus.scale,gameStatus.scale);
        layer[3].setScale(gameStatus.scale,gameStatus.scale);
        layer[0].setDepth(0);
        layer[1].setDepth(2);
        layer[2].setDepth(3);
        layer[3].setDepth(4);
    }else if(playerStatus.map_id === 3){
        layer[0].setScale(gameStatus.scale,gameStatus.scale);
        layer[1].setScale(gameStatus.scale,gameStatus.scale);
        layer[2].setScale(gameStatus.scale,gameStatus.scale);
        layer[0].setDepth(0);
        layer[1].setDepth(2);
    }else if(playerStatus.map_id === 4){
        layer[0].setScale(gameStatus.scale,gameStatus.scale);
        layer[1].setScale(gameStatus.scale,gameStatus.scale);
        layer[2].setScale(gameStatus.scale,gameStatus.scale);
        layer[3].setScale(gameStatus.scale,gameStatus.scale);
        layer[4].setScale(gameStatus.scale,gameStatus.scale);
        layer[0].setDepth(0);
        layer[1].setDepth(1);
        layer[2].setDepth(3);
        layer[3].setDepth(4);
    }else if(playerStatus.map_id === 5){
        layer[0].setScale(gameStatus.scale,gameStatus.scale);
        layer[1].setScale(gameStatus.scale,gameStatus.scale);
        layer[0].setDepth(0);
        layer[1].setDepth(2);
    }else if(playerStatus.map_id === 6){
        layer[0].setScale(gameStatus.scale,gameStatus.scale);
        layer[1].setScale(gameStatus.scale,gameStatus.scale);
        layer[2].setScale(gameStatus.scale,gameStatus.scale);
        layer[3].setScale(gameStatus.scale,gameStatus.scale);
        layer[0].setDepth(0);
        layer[1].setDepth(1);
        layer[2].setDepth(3);
    }else if(playerStatus.map_id === 7){
        layer[0].setScale(gameStatus.scale,gameStatus.scale);
        layer[1].setScale(gameStatus.scale,gameStatus.scale);
        layer[2].setScale(gameStatus.scale,gameStatus.scale);
        layer[3].setScale(gameStatus.scale,gameStatus.scale);
        layer[4].setScale(gameStatus.scale,gameStatus.scale);
        layer[5].setScale(gameStatus.scale,gameStatus.scale);
        layer[0].setDepth(0);
        layer[1].setDepth(1);
        layer[2].setDepth(3);
        layer[3].setDepth(4);
        layer[4].setDepth(5);
    }else if(playerStatus.map_id === 8){
        layer[0].setScale(gameStatus.scale,gameStatus.scale);
        layer[1].setScale(gameStatus.scale,gameStatus.scale);
        layer[2].setScale(gameStatus.scale,gameStatus.scale);
        layer[3].setScale(gameStatus.scale,gameStatus.scale);
        layer[0].setDepth(0);
        layer[1].setDepth(1);
        layer[2].setDepth(2);
    }
    for(let s = 0; s<layer.length; s++){
        layer[s].setCollisionByProperty({collides:true});
    }

    loadEventsFromLayer(scene,gameStatus);

    // トリガーエリアを設定（マップオブジェクトレイヤーを利用）
    const transitionLayer = map.getObjectLayer('Transitions');
    let graphicsA = scene.add.graphics();

    if(transitionLayer){
    // トリガーをマップのオブジェクトレイヤーから設定
    transitionTriggers = transitionLayer.objects.map(obj => ({
        x: obj.x*gameStatus.scale,
        y: obj.y*gameStatus.scale,
        width: obj.width*gameStatus.scale,
        height: obj.height*gameStatus.scale,
        targetMap: obj.properties.find(prop => prop.name === 'targetMap')?.value,
        targetX: obj.properties.find(prop => prop.name === 'targetX')?.value,
        targetY: obj.properties.find(prop => prop.name === 'targetY')?.value
        }));
    }
    for (const trigger of transitionTriggers) {
        // 半透明の四角形を描画
        graphicsA.fillStyle(0x00ff00, 0.3); // 緑色、30%透明
        graphicsA.fillRect(trigger.x, trigger.y, trigger.width, trigger.height);
    }
    
    dataMap(map,scene,playerStatus,gameStatus,layer,config);
    // マップの境界を設定
    scene.physics.world.setBounds(0, 0, map.widthInPixels*gameStatus.scale, map.heightInPixels*gameStatus.scale);
    scene.cameras.main.setBounds(0, 0, map.widthInPixels*gameStatus.scale, map.heightInPixels*gameStatus.scale);
    playsound(scene,playerStatus.map_id);
}

  // プレイヤーがトリガーに触れているかをチェック
  export function checkTransition(player) {
    for (const trigger of transitionTriggers) {
      if (
      player.x >= trigger.x && player.x <= trigger.x + trigger.width &&
      player.y >= trigger.y && player.y <= trigger.y + trigger.height
      ) {
        return trigger; // 移動対象のトリガー情報を返す
      }
    }
    return null;
  }

  // イベントレイヤーからオブジェクトを表示
  function loadEventsFromLayer(scene,gameStatus) {
    events = [];
    
    const EventLayer = map.getObjectLayer("EventLayer");

    if(EventLayer){
      events = EventLayer.objects.map(obj => {

        const event = {
            id: obj.properties.find(prop => prop.name === "eventId")?.value,
            x: obj.x*gameStatus.scale,
            y: obj.y*gameStatus.scale,
            width: obj.width*gameStatus.scale,
            height: obj.height*gameStatus.scale,
            type: obj.type,
            active: true,
          };

        const adjustedX = event.x + event.width / 2;  // 中心補正
        const adjustedY = event.y - event.height / 2; // 中心補正

        
        const tileSetName = obj.properties.find(prop => prop.name === "tileSet")?.value;

        if(tileSetName){
            //タイルセットを利用したイベントの場合
            const tileSet = map.getTileset(tileSetName); // タイルセット名
  
            const gid = obj.gid;
            const tileIndex = gid - tileSet.firstgid;
      
            const image = tileSet.name; // タイルセットの名前を参照
            const frame = tileIndex;   // タイルのフレーム番号

            // イメージをシーンに追加
            const addimage = scene.add.image(adjustedX, adjustedY, image, frame)
            .setOrigin(0.5, 0.5) // 必要に応じてオリジンを調整
            .setDepth(10)   // 深度を設定して他のオブジェクトとの重なりを調整
            .setDisplaySize(event.width, event.height);

            imageGroup.add(addimage); // グループに追加
        }else{
            //propaty("image")を利用したイベントの場合
            const imageName = obj.properties.find(prop => prop.name === "image")?.value;
            const addimage = scene.add.image(adjustedX, adjustedY, imageName)
            .setOrigin(0.5, 0.5) // 必要に応じてオリジンを調整
            .setDepth(10)   // 深度を設定して他のオブジェクトとの重なりを調整
            .setDisplaySize(event.width, event.height);
            imageGroup.add(addimage); // グループに追加
        }
  
        return event;
      });
    }
  }
    
  // 指定範囲内のイベントを検索（矩形の重なりを判定）
  export function findEventAt(area) {
    return events.find(event => {
      const eventRect = {
        x: event.x,
        y: event.y,
        width: event.width,
        height: event.height,
      };
      return isRectOverlap(area, eventRect);
    });
  }

  // 矩形同士が重なっているかを判定する関数
  function isRectOverlap(rectA, rectB) {
    return !(
      rectA.x > rectB.x + rectB.width || // AがBの右側にある
      rectA.x + rectA.width < rectB.x || // AがBの左側にある
      rectA.y > rectB.y + rectB.height || // AがBの下側にある
      rectA.y + rectA.height < rectB.y    // AがBの上側にある
    );
  }

  export function triggerEvent(event, player,scene, playerStatus, config, gameStatus) {
    switch (event.type) {
      case "dialog":
        startDialog(event.data);
        break;
      case "item":
        giveItemToPlayer(event.data, player);
        break;
    case "shop":
        shopOpen(scene, playerStatus, config, gameStatus);
        break;
      default:
        console.warn("未対応のイベントタイプ:", event.type);
    }
  }

  function startDialog(data) {
    console.log("セリフイベント:", data);
    // 実際のダイアログUI表示処理
  }

  function giveItemToPlayer(data, player) {
    console.log("アイテムを取得:", data.itemName);
    player.itemManager.addItem({ name: data.itemName });
  }

  function shopOpen(scene, playerStatus, config, gameStatus) {
    if (!gameStatus.shopflg) { // ショップが開いていない場合のみ処理
        createShop(scene, playerStatus, config, gameStatus);
        shopEvent(scene,gameStatus);//, playerStatus, config
    }else{
        
    }
  }

  function clearEventImages() {
    imageGroup.clear(true, true); // グループ内の全てのオブジェクトを削除
  }

  // Arcade版リソース破棄関数
  function destroy(scene, player) {
    imageGroup.clear(true, true); // グループ内の全てのオブジェクトを削除

    // プレイヤーオブジェクトを取得
    player = getplayer();

    // プレイヤーが存在しない場合のエラーチェック
    if (!player || !player.body) {
        console.error("Player object or body is not defined.");
        return;
    }

    // プレイヤー以外のゲームオブジェクトを削除
    scene.children.each(child => {
        if (child !== player) {
            if (child.body) {
                child.body.destroy(); // 物理ボディを破棄
            }
            child.destroy(); // ゲームオブジェクトを破棄
        }
    });

    // 世界の物理エンジンをリセット
    // scene.physics.world.shutdown();
    // scene.physics.world = new Phaser.Physics.Arcade.World(scene);

    // プレイヤーの物理設定を再登録
    // scene.physics.add.existing(player);
    // player.body.setCollideWorldBounds(true);

    // マップ関連のリソースを破棄
    // if (collisionLayer) {
    //     collisionLayer.destroy();
    //     collisionLayer = null;
    // }

    if (map) {
        layer.forEach(layer => layer.destroy());
        map.destroy();
        map = null;
    }

    tilesets = [];
    layersu = 0;
    layer = [];

    // collisionObjects = null;

    transitionTriggers = [];
}