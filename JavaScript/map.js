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
    loader.tilemapTiledJSON('gacha','assets/tilemaps/gacha.json');
    loader.image('gacha1','assets/tilesets/gacha1.png');

    //ダンジョン入り口
    loader.tilemapTiledJSON('entry','assets/tilemaps/dungeon_entry.json');
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
export function checkAndCreateMap(playerStatus){
    if(map_idHasChanged(playerStatus)){
        createMap(playerStatus);
    }
}

function map_idHasChanged(playerStatus){
    if(previousMapId !== playerStatus.map_id){
        previousMapId = playerStatus.map_id;
        return true;
    }
    return false;
}

export function createMap(scene,playerStatus){
    if(map){
        map.destroy();
        tilesets = [];
    }
    const map_id = playerStatus.map_id;

    //マップidごとに表示させる
    if(map_id === 1){
        mapData = 'houseMap';
        for(let i = 1; i <= 9; i++){
            tilesets.push(`house${i}`);//タイルセット名を格納
            layersu = 4;//レイヤーの数を格納
        }
    }else if(map_id === 2){
        mapData = 'homeMap';
        tilesets.push('home1');
        layersu = 3;
    }else if(map_id === 3){
        mapData = 'grassMap';
        for(let i = 1; i <= 2; i++){
            tilesets.push(`grass${i}`)
        }
        layersu = 2;
    }else if(map_id === 4){
        mapData = 'townMap';
        for(let i = 1; i <= 15; i++){
            tilesets.push(`town${i}`)
        }
        layersu = 4;
    }else if(map_id === 5){
        mapData = 'gachaMap';
        for(let i = 1; i <= 1; i++){
            tilesets.push(`gacha${i}`)
        }
        layersu = 2;
    }else if(map_id === 6){
        mapData = 'entryMap';
        for(let i = 1; i <= 2; i++){
            tilesets.push(`entry${i}`)
        }
    }else if(map_id === 7){
        mapData = 'dungeonMap';
        for(let i = 1; i <= 7; i++){
            tilesets.push(`rock${i}`)
        }
        layersu = 3;
    }

    //読み込んだマップ情報をdisplayMapに送る
    displayMap(scene);//ここは固定
}

function displayMap(scene){
    //タイルマップを作成
    map = scene.make.tilemap({key:mapData});
    dataMap(map);
    
    //タイルセットを追加
    const addTilesets = tilesets.map(tileset => map.addTilesetImage(tileset,tileset));

    for(let i = 1; i <= layersu; i++){
        const layerName = `layer${i}`;//レイヤー名をそろえる
        map.createLayer(layerName,addTilesets,0,0);
    }
    // マップの境界を設定
    scene.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    scene.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
}