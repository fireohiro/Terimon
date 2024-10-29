import {dataMap} from './player.js';
let map;

export function mappreload(loader){
    for(let i = 1; i <= 15; i++){
        loader.image(`town${i}`,`../assets/tilesets/town${i}.png`);
    }
}
export function createMap(playerStatus){
    const map_id = playerStatus.map_id || 1;
    let mapData;
    let tilesets = [];
    let layersu;
    //マップidごとに表示させる
    if(map_id === 1){
        mapData = "../assets/tilemaps/town.json";
        for(let i = 1; i <= 15; i++){
            tilesets.push(`town${i}`);//タイルセット名を格納
            layersu = 4;//レイヤーの数を格納
        }
    }else if(map_id === 2){
        mapData = "Desert Map";//適宜修正
    }else if(map_id === 3){
        mapData = "Mountain Map";//此処も適宜修正
    }else if(map_id === 4){
        mapData = "City Map";//ここも
    }
    //読み込んだマップ情報をdisplayMapに送る
    displayMap.call(this,{mapData,tilesets,layersu});//ここは固定
}

function displayMap({mapData,tilesets,layersu}){
    //タイルマップを作成
    map = this.make.tilemap({key:mapData});
    dataMap(map);
    
    //タイルセットを追加
    const addTilesets = tilesets.map(tileset => map.addTilesetImage(tileset,tileset));

    for(let i = 1; i <= layersu; i++){
        const layerName = `layer${i}`;//レイヤー名をそろえる
        map.createLayer(layerName,addTilesets,0,0);
    }
}