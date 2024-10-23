export function createPause(gameStatus,playerStatus,config){
    this.input.keyboard.on('keydown',(event) => {
        if(event.key === 'Escape'){
            pauseStart.call(this,gameStatus);
        }
    });
    menuBar(this,playerStatus,config);
}

function pauseStart(gamestatus){
    gamestatus.pauseflg = !gameStatus.pauseflg;
    menuContainer.setVisible(gameStatus.pauseflg);//メニューの表示切替

    //ポーズ中の物理処理の停止と再稼働
    if(gameStatus.pauseflg){
        this.physics.world.pause();//停止
    }else{
        this.physics.world.resume();//再稼働
    }
}

async function menuBar(loader,playerStatus,config){
    //メニューのサイズを設定
    const menuWidth = config.width * 0.20;
    const menuHeight = config.height * 0.70;

    // メニュー背景を作成し、左に少しスペースを開ける
    const menuBackground = loader.add.rectangle(menuWidth * -0.5, 0, menuWidth, menuHeight, 0x93C572, 0.8);
    menuBackground.setStrokeStyle(4, 0xFFFDD0); // 緑枠

    //テキスト（ボタンを設定）の例
    const itemtext = loader.add.text(menuWidth*-0.5/2,-100,'アイテム',{fontSize:'18px'});
    const geartext = loader.add.text(menuWidth*-0.5/2,-75,'装備',{fontSize:'18px'});
    const statustext = loader.add.text(menuWidth*-0.5/2,-50,'ステータス',{fontSize:'18px'});
    const savetext = loader.add.text(menuWidth*-0.5/2,-25,'セーブ',{fontSize:'18px'});
    const logouttext = loader.add.text(menuWidth*-0.5/2,0,'タイトルへ戻る',{fontSize:'18px'});

    //クリックイベント
    itemtext.setInteractive().on('pointerdown',()=>{
        //アイテム使用用のプログラムの関数を呼び出す
        createStatusScreen(loader, playerStatus,friend1Status,friend2Status,friend3Status, config); 
    });
    // マウスがテキストに乗ったときの動作
    itemtext.on('pointerover', () => {
        statustext.setStyle({ fill: '#ffff00', fontStyle: 'bold', underline: true });
    });
    geartext.setInteractive().on('pointerdown',()=>{
        //装備用のプログラムの関数を呼び出す
    });
    statustext.setInteractive().on('pointerdown',()=>{
        //ステータス表示用のプログラムの関数を呼び出す
    });
    savetext.setInteractive().on('pointerdown',()=>{
        //セーブ用のプログラムの関数を呼び出す
    });
    logouttext.setInteractive().on('pointerdown',()=>{
        //ログアウト用のプログラムの関数を呼び出す
    });

    //所持金欄の大きさ設定
    const goldBarHeight = menuHeight*0.25
    const Moneybar = loader.add.rectangle(menuWidth*-0.5,menuHeight / 2 + goldBarHeight / 2+52,menuWidth,goldBarHeight,0x93C572,0.8);
    Moneybar.setStrokeStyle(4,0xFFFDD0);

    //所持金のテキスト
    const moneytext = loader.add.text(
        //文字の設定兼表示内容
        Moneybar.x-Moneybar.displayWidth/2,
        Moneybar.y-Moneybar.displayHeight/2,//表示位置ｘとｙ
        //表示文字と文字の設定
        `所持金\n${playerStatus.money}`,
        {fontSize:'18px',fill:'#fff'}
    );

    //メニュー要素をコンテナにまとめる
    menuContainer = loader.add.container(0,-500,[ここに枠の設定とテキストを変数,定数を入れる]);
    menuContainer.setVisible(false);//初期状態は非表示
    menuContainer.setDepth(10);//一意晩上に表示されるようにする
}