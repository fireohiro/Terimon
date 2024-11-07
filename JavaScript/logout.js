let logoutContainer;
let kasoru;
export function logoutdisplay(gameStatus){
    gameStatus.logoutflg = !gameStatus.logoutflg;
    logoutContainer.setVisible(gameStatus.logoutflg);
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
        if(!kasoru){
            kasoru = scene.add.text(config.width * 0.5,logoutHeight / 2+80,'▶',{fontSize:'64px',fill:'#000'});
            kasoru.setDepth(8);
        }
    });
    // カーソルがアイテムテキストから外れたときの処理
    logouttext.setInteractive().on('pointerout', () => {
        // kasoruが存在していれば非表示にし、破棄
        if (kasoru) {
            kasoru.destroy();
            kasoru = null;  // 破棄後は再度nullに設定
        }
    });
    backtext.setInteractive().on('pointerdown',()=>{
         logoutdisplay(gameStatus);
    });
    backtext.setInteractive().on('pointerover', () => {
        if(!kasoru){
            kasoru = scene.add.text(config.width * 0.5,logoutHeight / 2,'▶',{fontSize:'64px',fill:'#000'});
            kasoru.setDepth(8);
        }
    });
    // カーソルがアイテムテキストから外れたときの処理
    backtext.setInteractive().on('pointerout', () => {
        // kasoruが存在していれば非表示にし、破棄
        if (kasoru) {
            kasoru.destroy();
            kasoru = null;  // 破棄後は再度nullに設定
        }
    });
    logoutContainer = scene.add.container(0,0,[logoutback,logoutsetumei,logouttext,backtext]);
    logoutContainer.setVisible(false);
    logoutContainer.setDepth(7);
}