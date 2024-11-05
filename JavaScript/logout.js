let logoutContainer;
export function logoutdisplay(gameStatus){
    gameStatus.logoutflg = !gameStatus.logoutflg;
    logoutContainer.setVisible(gameStatus.logoutflg);
}

export function logoutmessage(loader,config){
    //メニューのサイズを設定
    const logoutWidth = config.width * 0.6;
    const logoutHeight = config.height * 0.95;

    // メニュー背景を作成し、左に少しスペースを開ける
    const logoutback = loader.add.rectangle(config.width * 0.3 + 10, 2, logoutWidth, logoutHeight, 0xFFFFFF, 0.8);
    logoutback.setStrokeStyle(2,0x000000); // 緑枠

    //テキスト（ボタンを設定）の例
    const logouttext = loader.add.text(config.width * 0.3 + 10 + logoutWidth/2,logoutHeight / -2 - 50,'はい',{fontSize:'18px'});
    const backtext = loader.add.text(config.width * 0.3 + 10 + logoutWidth/2,logoutHeight / -2,'いいえ',{fontSize:'18px'});
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
        window.location.href='sorce/title.php';
    });
    backtext.setInteractive().on('pointerdown',()=>{
         logoutdisplay(gameStatus);
    });
    logoutContainer = loader.add.container(0,0,[logoutback,logouttext,backtext]);
    logoutContainer.setVisible(false);
    logoutContainer.setDepth(7);
}