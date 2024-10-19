export function createPause(loader,gameStatus){
    this.input.keyboard.on('keydown',(event) => {
        if(event.key === 'Escape'){
            pauseStart.call(this,gameStatus);
        }
    });
    menuBar(this);
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

async function menuBar(loader){
    //メニューのサイズを設定

    //テキスト（ボタンを設定）の例
    const itemtext = loader.add.text(0.5,-100,'アイテム',{fontSize:'18px'});
    const geartext = loader.add.text(0.5,-75,'装備',{fontSize:'18px'});
    const statustext = loader.add.text(0.5,-50,'ステータス',{fontSize:'18px'});
    const savetext = loader.add.text(0.5,-25,'アイテム',{fontSize:'18px'});
    const logouttext = loader.add.text(0.5,0,'タイトルへ戻る',{fontSize:'18px'});

    //クリックイベント
    itemtext.setInteractive().on('pointerdown',()=>{
        //アイテム使用用のプログラムの関数を呼び出す
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

    //所持金
    const sessiondata = await userData();//awaitでこの処理が終わるまで次の処理が始まらないようにしている
    const money = sessiondata.money;
    
    //所持金欄の大きさ設定

    //所持金のテキスト
    const moneytext = loader.add.text(
        //文字の設定兼表示内容
        10,10,//表示位置ｘとｙ
        //表示文字と文字の設定
        `所持金\n${money}`,
        {fontSize:'18px',fill:'#fff'}
    );

    //メニュー要素をコンテナにまとめる
    menuContainer = loader.add.container(0,-500,[ここに枠の設定とテキストを変数,定数を入れる]);
    menuContainer.setVisible(false);//初期状態は非表示
    menuContainer.setDepth(10);//一意晩上に表示されるようにする
}