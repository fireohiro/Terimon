import {dataMap} from './player.js';
let map;
let mapData;
let tilesets = [];
let layersu;
let previousMapId = null;

export function mappreload(loader){
    //主人公の家内
    loader.tilemapTiledJSON('houseMap','assets/tilemaps/house.json');
    for(let i = 1; i <= 9;i++){
        loader.image(`house${i}`,`assets/tilesets/house${i}.png`);
    }
    //主人公の家外
    loader.tilemapTiledJSON('homeMap','assets/tilemaps/home.json');
    loader.image('home1','assets/tilesets/home1.png');
    
    //草原
    loader.tilemapTiledJSON('grassMap','assets/tilemaps/grass.json');
    for(let i = 1; i <= 2; i++){
        loader.image(`grass${i}`,`assets/tilesets/grass${i}.png`);
    }
    //町
    loader.tilemapTiledJSON('townMap','assets/tilemaps/town.json');
    for(let i = 1; i <= 15; i++){
        loader.image(`town${i}`,`assets/tilesets/town${i}.png`);
    }
    
    //ガチャ
    loader.tilemapTiledJSON('gachaMap','assets/tilemaps/gacha.json');
    loader.image('gacha1','assets/tilesets/gacha1.png');

    //ダンジョン入り口
    loader.tilemapTiledJSON('entryMap','assets/tilemaps/dungeon_entry.json');
    for(let i = 1; i <= 2; i++){
        loader.image(`entry${i}`,`assets/tilesets/entry${i}`);
    }

    //ダンジョン
    loader.tilemapTiledJSON('dungeonMap','assets/tilemaps/dungeon.json');
    for(let i = 1; i <= 7; i++){
        loader.image(`rock${i}`,`assets/tilesets/rock${i}.png`);
    }
}
//マップが切り替わったかを確認
export function checkAndCreateMap(scene,playerStatus,gameStatus){
    if(map_idHasChanged(playerStatus)){
        createMap(scene,playerStatus,gameStatus);
    }
}

function map_idHasChanged(playerStatus){
    if(previousMapId !== playerStatus.map_id){
        previousMapId = playerStatus.map_id;
        return true;
    }
    return false;
}

export function createMap(scene,playerStatus,gameStatus){
    if(map){
        map.destroy();
    }
    tilesets = [];
    layersu = 0;
    let map_id = playerStatus.map_id;

    if(map_id === 3 || map_id === 6 || map_id === 7){
        gameStatus.encountflg = true;
    }else{
        gameStatus.encountflg = false;
    }

    //マップidごとに表示させる
    if(map_id === 1){
        mapData = 'houseMap';
        map = scene.make.tilemap({key:'houseMap'});
        for(let i = 1; i <= 9; i++){
            let tileset = map.addTilesetImage(`house${i}`, `house${i}`);
            tilesets.push(tileset);
        }
        layersu = 4;//レイヤーの数を格納
    }else if(map_id === 2){
        map = scene.make.tilemap({key:'homeMap'});
        let tileset = map.addTilesetImage('home1', 'home1');
        tilesets.push(tileset);
        layersu = 3;
    }else if(map_id === 3){
        map = scene.make.tilemap({key:'grassMap'});
        for(let i = 1; i <= 2; i++){
            let tileset = map.addTilesetImage(`grass${i}`, `grass${i}`);
            tilesets.push(tileset);
        }
        layersu = 2;
    }else if(map_id === 4){
        map = scene.make.tilemap({key:'townMap'});
        for(let i = 1; i <= 15; i++){
            let tileset = map.addTilesetImage(`town${i}`, `town${i}`);
            tilesets.push(tileset);
        }
        layersu = 4;
    }else if(map_id === 5){
        map = scene.make.tilemap({key:'gachaMap'});
        for(let i = 1; i <= 1; i++){
            let tileset = map.addTilesetImage(`gacha${i}`, `gacha${i}`);
            tilesets.push(tileset);
        }
        layersu = 2;
    }else if(map_id === 6){
        map = scene.make.tilemap({key:'entryMap'});
        for(let i = 1; i <= 2; i++){
            let tileset = map.addTilesetImage(`entry${i}`, `entry${i}`);
            tilesets.push(tileset);
        }
        layersu = 2;
    }else if(map_id === 7){
        map = scene.make.tilemap({key:'dungeonMap'});
        for(let i = 1; i <= 7; i++){
            let tileset = map.addTilesetImage(`rock${i}`, `rock${i}`);
            tilesets.push(tileset);
        }
        layersu = 3;
    }
    //カメラのズーム倍率を変える＆レイヤーの変更
    if(playerStatus.map_id === 1){
        scene.cameras.main.setZoom(1.0);//カメラを通常の1.5倍近づける
    }else if(playerStatus.map_id === 2){
        //必要に応じて変える
        scene.cameras.main.setZoom(1.0);
    }else if(playerStatus.map_id === 3){
        //必要に応じて変える
        scene.cameras.main.setZoom(1.0);
    }else if(playerStatus.map_id === 4){
        //必要に応じて変える
        scene.cameras.main.setZoom(1.0);
    }else if(playerStatus.map_id === 5){
        //必要に応じて変える
        scene.cameras.main.setZoom(1.0);
    }else if(playerStatus.map_id === 6){
        //必要に応じて変える
        scene.cameras.main.setZoom(1.0);
    }else if(playerStatus.map_id === 7){
        //必要に応じて変える
        scene.cameras.main.setZoom(1.0);
    }
    //マップの情報をplayer.jsに送る
    dataMap(map);

    for(let i = 1; i <= layersu; i++){
        const layerName = `layer${i}`;//レイヤー名をそろえる
        map.createLayer(layerName,tilesets,0,0);
    }
    // マップの境界を設定
    scene.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    scene.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
}