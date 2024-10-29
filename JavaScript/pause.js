import {saveEvent,saveGame} from './save.js';
import{logoutMessege,logoutdisplay} from'./logout.js';

export function createPause(gameStatus,playerStatus,config,friend1Status,friend2Status,friend3Status){
    this.input.keyboard.on('keydown',(event) => {
        if(event.key === 'Escape'){
            pauseStart.call(this,gameStatus);
        }
    });
    saveGame(this,playerStatus,config,gameStatus,friend1Status,friend2Status,friend3Status);
    logoutMessage(this,config);
    menuBar(this,playerStatus,config,gameStatus,friend1Status,friend2Status,friend3Status);
    createStatusScreen(loader,gameStatus, playerStatus,friend1Status,friend2Status,friend3Status, config);
}

function pauseStart(gamestatus){
    gamestatus.pauseflg = !gameStatus.pauseflg;
    menuContainer.setVisible(gameStatus.pauseflg);//メニューの表示切替

    //ポーズ中の物理処理の停止と再稼働
    if(gameStatus.pauseflg){
        this.physics.world.pause();//停止
    }else{
        this.physics.world.resume();//再稼働
        if(gameStatus.itemflg === true){
            //gameStatus.itemflgをfalseになるようflgチェンジ関数を呼ぶほかも同じようにする
        }
        if(gameStatus.gearflg === true){
            //gameStatus.gearflgをfalseになるようflgチェンジ関数を呼ぶほかも同じようにする
        }
        if(gameStatus.statusflg === true){
            //gameStatus.statusflgをfalseになるようflgチェンジ関数を呼ぶほかも同じようにする
            statusEvent(gameStatus);
        }
        if(gameStatus.saveflg === true){
            //gameStatus.saveflgをfalseになるようflgチェンジ関数を呼ぶほかも同じようにする
            saveEvent(gameStatus);
        }
        if(gameStatus.logoutflg === true){
            //gameStatus.logoutflgをfalseになるようflgチェンジ関数を呼ぶほかも同じようにする
            logoutdisplay(gameStatus);
        }
    }
}

async function menuBar(loader,playerStatus,config,gameStatus,friend1Status,friend2Status,friend3Status){
    //メニューのサイズを設定
    const menuWidth = config.width * 0.20;
    const menuHeight = config.height * 0.70;

    // メニュー背景を作成し、左に少しスペースを開ける
    const menuBackground = loader.add.rectangle(menuWidth * -0.5, 2, menuWidth, menuHeight, 0x93C572, 0.8);
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
        createStatusScreen(loader,gameStatus, playerStatus,friend1Status,friend2Status,friend3Status, config); 
    });
    // マウスがテキストに乗ったときの動作、2つ以上の枠が出ないように、一旦全部のflgをオフにする

    //アイテム
    itemtext.on('pointerover', () => {
        if(gameStatus.gearflg === true){
            //gameStatus.gearflgをfalseになるようflgチェンジ関数を呼ぶほかも同じようにする
        }
        if(gameStatus.statusflg === true){
            //gameStatus.statusflgをfalseになるようflgチェンジ関数を呼ぶほかも同じようにする
            statusEvent(gameStatus);
        }
        if(gameStatus.saveflg === true){
            //gameStatus.saveflgをfalseになるようflgチェンジ関数を呼ぶほかも同じようにする
            saveEvent(gameStatus);
        }
        if(gameStatus.logoutflg === true){
            //gameStatus.logoutflgをfalseになるようflgチェンジ関数を呼ぶほかも同じようにする
            logoutdisplay(gameStatus);
        }
        statustext.setStyle({ fill: '#ffff00', fontStyle: 'bold', underline: true });
    });
    //装備
    geartext.setInteractive().on('pointerdown',()=>{
        //装備用のプログラムの関数を呼び出す
        if(gameStatus.itemflg === true){
            //gameStatus.itemflgをfalseになるようflgチェンジ関数を呼ぶほかも同じようにする
        }
        if(gameStatus.statusflg === true){
            //gameStatus.statusflgをfalseになるようflgチェンジ関数を呼ぶほかも同じようにする
            statusEvent(gameStatus);
        }
        if(gameStatus.saveflg === true){
            //gameStatus.saveflgをfalseになるようflgチェンジ関数を呼ぶほかも同じようにする
            saveEvent(gameStatus);
        }
        if(gameStatus.logoutflg === true){
            //gameStatus.logoutflgをfalseになるようflgチェンジ関数を呼ぶほかも同じようにする
            logoutdisplay(gameStatus);
        }
    });
    //
    statustext.setInteractive().on('pointerdown',()=>{
        //ステータス表示用のプログラムの関数を呼び出す
        if(gameStatus.itemflg === true){
            //gameStatus.itemflgをfalseになるようflgチェンジ関数を呼ぶほかも同じようにする
        }
        if(gameStatus.gearflg === true){
            //gameStatus.gearflgをfalseになるようflgチェンジ関数を呼ぶほかも同じようにする
        }
        if(gameStatus.saveflg === true){
            //gameStatus.saveflgをfalseになるようflgチェンジ関数を呼ぶほかも同じようにする
            saveEvent(gameStatus);
        }
        if(gameStatus.logoutflg === true){
            //gameStatus.logoutflgをfalseになるようflgチェンジ関数を呼ぶほかも同じようにする
            logoutdisplay(gameStatus);
        }
    });
    //セーブ
    savetext.setInteractive().on('pointerdown',()=>{
        if(gameStatus.itemflg === true){
            //gameStatus.itemflgをfalseになるようflgチェンジ関数を呼ぶほかも同じようにする
        }
        if(gameStatus.gearflg === true){
            //gameStatus.gearflgをfalseになるようflgチェンジ関数を呼ぶほかも同じようにする
        }
        if(gameStatus.statusflg === true){
            //gameStatus.statusflgをfalseになるようflgチェンジ関数を呼ぶほかも同じようにする
            statusEvent(gameStatus);
        }
        if(gameStatus.logoutflg === true){
            //gameStatus.logoutflgをfalseになるようflgチェンジ関数を呼ぶほかも同じようにする
            logoutdisplay(gameStatus);
        }
        //セーブの表示と非表示
        saveEvent(gameStatus);
    });
    //ログアウト
    logouttext.setInteractive().on('pointerdown',()=>{
        //ログアウト用のプログラムの関数を呼び出す
        if(gameStatus.itemflg === true){
            //gameStatus.itemflgをfalseになるようflgチェンジ関数を呼ぶほかも同じようにする
        }
        if(gameStatus.gearflg === true){
            //gameStatus.gearflgをfalseになるようflgチェンジ関数を呼ぶほかも同じようにする
        }
        if(gameStatus.statusflg === true){
            //gameStatus.statusflgをfalseになるようflgチェンジ関数を呼ぶほかも同じようにする
            statusEvent(gameStatus);
        }
        if(gameStatus.saveflg === true){
            //gameStatus.saveflgをfalseになるようflgチェンジ関数を呼ぶほかも同じようにする
            saveEvent(gameStatus);
        }
        //ログアウトウィンドウ表示
        logoutdisplay(gameStatus);
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
    menuContainer.setDepth(7);//一意晩上に表示されるようにする
}