export function mappreload(loader){
    for(let i = 1; i <= 15; i++){
        loader.image(`tileset${i}`,`../assets/tilesets${i}.png`);
    }
}
export function createMap(map){
    let mapData;
    let tilesets = [];
    //マップidごとに表示させる
    if(map === 1){
        mapData = "assets/tilemaps/town.json";//ここは変えましょうかね
        for(let i = 1; i <= 15; i++){
            tilesets.push(`tileset${i}`);//タイルセット名を格納
        }
    }else if(map === 2){
        mapData = "Desert Map";//適宜修正
    }else if(map === 3){
        mapData = "Mountain Map";//此処も適宜修正
    }else if(map === 4){
        mapData = "City Map";//ここも
    }
    //読み込んだマップ情報をdisplayMapに送る
    displayMap.call(this,{mapData,tilesets});//ここは固定
}

function displayMap({mapData,tilesets}){
    //タイルマップを作成
    const map = this.make.tilemap({key:mapData});
    //タイルセットを追加
    const addTilesets = tilesets.map(tileset => map.addTilesetImage(tileset,tileset));

    for(let i = 1; i <= tilesets.length; i++){
        const layerName = `layer${i}`;//レイヤー名をそろえる
        map.createLayer(layerName,addedTilesets,0,0);
    }
}