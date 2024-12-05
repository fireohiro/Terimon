import { playEffect } from "./sound";

let logoutContainer;
export function logoutdisplay(gameStatus,scene,config){
    gameStatus.logoutflg = !gameStatus.logoutflg;
    if(gameStatus.logoutflg){
        playEffect(scene,'open');
        logoutmessage(scene,config,gameStatus);
    }else{
        playEffect(scene,'no');
        if(logoutContainer){
            logoutContainer.destroy();
        }
    }
}

export function logoutmessage(scene,config,gameStatus){
    //メニューのサイズを設定
    const logoutWidth = config.width * 0.6;
    const logoutHeight = config.height * 0.85;

    // メニュー背景を作成し、左に少しスペースを開ける
    const logoutback = scene.add.rectangle(config.width * 0.3 + 10, 10, logoutWidth, logoutHeight, 0xFFFFFF, 0.8);
    logoutback.setStrokeStyle(2,0x4169e1); // 枠
    logoutback.setOrigin(0,0);

    //テキスト（ボタンを設定）の例
    const logoutsetumei = scene.add.text(logoutback.x + logoutback.width / 2,logoutHeight / 4,'本当にタイトルに戻りますか？',{fontSize:'60px',fill:'#000',lineHeight:64,padding:{top:10,bottom:10}});
    logoutsetumei.setOrigin(0.5,0.5);
    const backtext = scene.add.text(logoutback.x + logoutback.width / 2,logoutHeight / 2,'いいえ',{fontSize:'64px',fill:'#000'});
    backtext.setOrigin(0.5,0.5);
    const logouttext = scene.add.text(logoutback.x + logoutback.width / 2,logoutHeight / 2 + 80,'はい',{fontSize:'64px',fill:'#000'});
    logouttext.setOrigin(0.5,0.5);
    //クリックイベント
    logouttext.setInteractive().on('pointerdown',async()=>{
        //セッションのリセット
        await fetch('/logout',{
            method:'POST',
            credentials:'include',
        });

        //PHP側で$_SESSION["user"]をリセットする処理
        await fetch('logout.php',{
            method:'POST',
            credentials:'include',
        });

        //タイトル画面に遷移
        window.location.href='sorce/login.php';
    });
    logouttext.setInteractive().on('pointerover', () => {
        logouttext.y += 5;
    });
    // カーソルがアイテムテキストから外れたときの処理
    logouttext.setInteractive().on('pointerout', () => {
        logouttext.y -= 5;
    });
    backtext.setInteractive().on('pointerdown',()=>{
         logoutdisplay(gameStatus);
    });
    backtext.setInteractive().on('pointerover', () => {
        backtext.y += 5;
    });
    // カーソルがアイテムテキストから外れたときの処理
    backtext.setInteractive().on('pointerout', () => {
        backtext.y -= 5;
    });
    logoutContainer = scene.add.container(0,0,[logoutback,logoutsetumei,logouttext,backtext]);
    logoutContainer.setDepth(7);
}
export function logoutupdate(scene){
    const camera = scene.cameras.main;
    logoutContainer.setPosition(camera.worldView.x,camera.worldView.y);
}