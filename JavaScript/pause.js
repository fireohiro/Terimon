// import {createStatusScreen} from './status.js';
import {saveEvent,saveGame} from './save.js';
import{logoutmessage,logoutdisplay} from './logout.js';

let menuContainer;
export function createPause(scene,gameStatus,playerStatus,config,friend1Status,friend2Status,friend3Status){
    scene.input.keyboard.on('keydown',(event) => {
        if(event.key === 'Escape'){
            pauseStart(scene,gameStatus);
        }
    });
    saveGame(scene,playerStatus,config,gameStatus,friend1Status,friend2Status,friend3Status);
    logoutmessage(scene,config);
    menuBar(scene,playerStatus,config,gameStatus,friend1Status,friend2Status,friend3Status);
    // createStatusScreen(scene,gameStatus, playerStatus,friend1Status,friend2Status,friend3Status, config);
}

function pauseStart(scene,gameStatus){
    gameStatus.pauseflg = !gameStatus.pauseflg;
    menuContainer.setVisible(gameStatus.pauseflg);//メニューの表示切替

    //ポーズ中の物理処理の停止と再稼働
    if(gameStatus.pauseflg){
        scene.physics.world.pause();//停止
    }else{
        scene.physics.world.resume();//再稼働
        if(gameStatus.itemflg === true){
            //gameStatus.itemflgをfalseになるようflgチェンジ関数を呼ぶほかも同じようにする
        }
        if(gameStatus.gearflg === true){
            //gameStatus.gearflgをfalseになるようflgチェンジ関数を呼ぶほかも同じようにする
        }
        if(gameStatus.statusflg === true){
            //gameStatus.statusflgをfalseになるようflgチェンジ関数を呼ぶほかも同じようにする
            // statusEvent(gameStatus);
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

async function menuBar(scene,playerStatus,config,gameStatus,friend1Status,friend2Status,friend3Status){
    //メニューのサイズを設定
    const menuWidth = config.width * 0.15;
    const menuHeight = config.height * 0.50;

    // メニュー背景を作成し、左に少しスペースを開ける
    const menuBackground = scene.add.rectangle(menuWidth * 0.1, config.height * 0.08, menuWidth, menuHeight, 0xFFFFFF, 0.8);
    menuBackground.setStrokeStyle(4, 0x000000); // 緑枠

    //テキスト（ボタンを設定）の例
    const itemtext = scene.add.text(menuWidth*-0.5/2+15,menuHeight / -6 - 30,'アイテム',{fontSize:'32px',fill:'#000'});
    const geartext = scene.add.text(menuWidth*-0.5/2+40,menuHeight / -6 + 40,'装備',{fontSize:'32px',fill:'#000'});
    const statustext = scene.add.text(menuWidth*-0.5/2,menuHeight / -6 + 110,'ステータス',{fontSize:'32px',fill:'#000'});
    const savetext = scene.add.text(menuWidth*-0.5/2+20,menuHeight / -6 + 180,'セーブ',{fontSize:'32px',fill:'#000'});
    const logouttext = scene.add.text(menuWidth*-0.5/2+15,menuHeight / -6 + 250,'タイトル',{fontSize:'32px',fill:'#000'});

    //クリックイベント
    itemtext.setInteractive().on('pointerdown',()=>{
        //アイテム使用用のプログラムの関数を呼び出す
        createStatusScreen(scene,gameStatus, playerStatus,friend1Status,friend2Status,friend3Status, config); 
    });
    // マウスがテキストに乗ったときの動作、2つ以上の枠が出ないように、一旦全部のflgをオフにする

    //アイテム
    itemtext.on('pointerover', () => {
        if(gameStatus.gearflg === true){
            //gameStatus.gearflgをfalseになるようflgチェンジ関数を呼ぶほかも同じようにする
        }
        if(gameStatus.statusflg === true){
            //gameStatus.statusflgをfalseになるようflgチェンジ関数を呼ぶほかも同じようにする
            // statusEvent(gameStatus);
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
    //装備
    geartext.setInteractive().on('pointerdown',()=>{
        //装備用のプログラムの関数を呼び出す
        if(gameStatus.itemflg === true){
            //gameStatus.itemflgをfalseになるようflgチェンジ関数を呼ぶほかも同じようにする
        }
        if(gameStatus.statusflg === true){
            //gameStatus.statusflgをfalseになるようflgチェンジ関数を呼ぶほかも同じようにする
            // statusEvent(gameStatus);
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
        // statusEvent(gameStatus);
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
            // statusEvent(gameStatus);
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
            // statusEvent(gameStatus);
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
    const Moneybar = scene.add.rectangle(menuWidth * 0.1,menuHeight / 2 + goldBarHeight / 2+100,menuWidth,goldBarHeight,0xFFFFFF,0.8);
    Moneybar.setStrokeStyle(4,0x000000);

    //所持金のテキスト
    const moneytext = scene.add.text(
        //文字の設定兼表示内容
        Moneybar.x-Moneybar.displayWidth/2+35,
        Moneybar.y-Moneybar.displayHeight/2+20,//表示位置ｘとｙ
        //表示文字と文字の設定
        `　所持金\n${playerStatus.money}`,
        {fontSize:'26px',fill:'#000'}
    );

    //メニュー要素をコンテナにまとめる
    menuContainer = scene.add.container(0,0,[menuBackground,itemtext,geartext,statustext,savetext,logouttext,Moneybar,moneytext]);
    menuContainer.setVisible(false);//初期状態は非表示
    menuContainer.setDepth(7);//一意晩上に表示されるようにする
}

export function updatepause(scene,config){
    //メニューの位置をカメラに追従させる
    const cameraCenterX = scene.cameras.main.scrollX + scene.cameras.main.width / 2;
    const cameraCenterY = scene.cameras.main.scrollY + scene.cameras.main.height / 2;

    //メニューをカメラ中心に配置し、少し左にずらす
    menuContainer.setPosition(cameraCenterX - cameraCenterX / 5 * 4,cameraCenterY - cameraCenterY / 5 * 3);
    //ポーズ中はupdate内の処理をすべて行わない
}