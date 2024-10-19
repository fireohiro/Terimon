export function battlepreload(loder){
    //敵画像
    for(let i = 1; i <= 10;i++){
        loader.image(`enemy${i}`,`../assets/img/enemy${i}.png`);
    }
}

export function battlecreate(loder){
    //ここで読み込んだ画像の表示とか
}

export function battleupdate(loder){
    //毎フレーム処理
}