import { playEffect } from "./sound";

let logoutContainer;
let logotra = null;
let backtra = null;
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
    const logoutsetumei = scene.add.text(config.width * 0.3 + 70,logoutHeight / 4,'本当にタイトルに戻りますか？',{fontSize:'60px',fill:'#000'});
    logoutsetumei.setOrigin(0,0);
    const backtext = scene.add.text(config.width * 0.5+100,logoutHeight / 2,'いいえ',{fontSize:'64px',fill:'#000'});
    backtext.setOrigin(0,0);
    const logouttext = scene.add.text(config.width * 0.5+100,logoutHeight / 2 + 80,'はい',{fontSize:'64px',fill:'#000'});
    logouttext.setOrigin(0,0);
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
        if(!logotra){
            logotra = scene.add.text(config.width * 0.5,logoutHeight / 2+80,'▶',{fontSize:'64px',fill:'#000'});
            logotra.setDepth(8);
        }
    });
    // カーソルがアイテムテキストから外れたときの処理
    logouttext.setInteractive().on('pointerout', () => {
        // logotraが存在していれば非表示にし、破棄
        if (logotra) {
            logotra.destroy();
            logotra = null;  // 破棄後は再度nullに設定
        }
    });
    backtext.setInteractive().on('pointerdown',()=>{
         logoutdisplay(gameStatus);
    });
    backtext.setInteractive().on('pointerover', () => {
        if(!backtra){
            backtra = scene.add.text(config.width * 0.5,logoutHeight / 2,'▶',{fontSize:'64px',fill:'#000'});
            backtra.setDepth(8);
        }
    });
    // カーソルがアイテムテキストから外れたときの処理
    backtext.setInteractive().on('pointerout', () => {
        // backtraが存在していれば非表示にし、破棄
        if (backtra) {
            backtra.destroy();
            backtra = null;  // 破棄後は再度nullに設定
        }
    });
    logoutContainer = scene.add.container(0,0,[logoutback,logoutsetumei,logouttext,backtext]);
    logoutContainer.setDepth(7);
}
export function logoutupdate(scene){
    const camera = scene.cameras.main;
    let logoX = camera.worldView.x + camera.worldView.width / 2;
    let logoY = camera.worldView.y + camera.worldView.height / 2;
    logoutContainer.setPosition(camera.worldView.x,camera.worldView.y);
    if(backtra){
        backtra.setPosition(logoX,logoY - 50);
    }
    if(logotra){
        logotra.setPosition(logoX,logoY + 22);
    }
}