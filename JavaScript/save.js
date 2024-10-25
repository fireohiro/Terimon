export function saveEvent(gameStatus){
    gameStatus.saveflg = !gameStatus.saveflg;
    saveContainer.setVisible(gameStatus.saveflg);
}

export async function saveGame(loader,playerStatus,config,gameStatus,friend1Status,friend2Status,friend3Status){
    //メニューのサイズを設定
    const saveWidth = config.width * 0.6;
    const saveHeight = config.height * 0.95;

    // メニュー背景を作成し、左に少しスペースを開ける
    const saveback = loader.add.rectangle(config.width * 0.3 + 10, 2, saveWidth, saveHeight, 0xFFFFFF, 0.8);
    saveback.setStrokeStyle(2,0x000000); // 緑枠
    saveback.setRadius(10);

    //テキスト（ボタンを設定）の例
    const savetext = loader.add.text(config.width * 0.3 + 10 + saveWidth/2,saveHeight / -2 - 50,'はい',{fontSize:'18px'});
    const backtext = loader.add.text(config.width * 0.3 + 10 + saveWidth/2,saveHeight / -2,'いいえ',{fontSize:'18px'});
    //クリックイベント
    savetext.setInteractive().on('pointerdown',()=>{
        //セーブ用PHPを作って接続して引数としてplayerStatus,friend1~3Statusを渡たす
    });
    backtext.setInteractive().on('pointerdown',()=>{
         saveEvent(gameStatus);
    });
    saveContainer.loader.add.container(0,-500,[saveback,sevetext,backtext]);
    saveContainer.setVisible(false);
    saveContainer.setDepth(7);
}