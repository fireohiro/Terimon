import{itemEvent,useItem} from './item.js';
import {createStatusScreen,statusEvent} from './status.js';
import {saveEvent,saveGame} from './save.js';
import{logoutmessage,logoutdisplay} from './logout.js';

let itemtra = null;
let geartra = null;
let stattra = null;
let savetra = null;
let logotra = null;
let menuContainer;
export function createPause(scene,gameStatus,playerStatus,config,friends,itemList,gearList){
    scene.input.keyboard.on('keydown',(event) => {
        if(event.key === 'Escape'){
            pauseStart(scene,gameStatus);
        }
    });
    saveGame(scene,playerStatus,config,gameStatus,friends,itemList,gearList);
    logoutmessage(scene,config,gameStatus);
    menuBar(scene,playerStatus,config,gameStatus);
    createStatusScreen(scene,gameStatus, playerStatus,friends,config);
    useItem(loader,playerStatus,config,gameStatus,friend1Status,friend2Status,friend3Status);
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

async function menuBar(scene,playerStatus,config,gameStatus){
    //メニューのサイズを設定
    const menuWidth = config.width * 0.15+10;
    const menuHeight = config.height * 0.50;

    // メニュー背景を作成し、左に少しスペースを開ける
    const menuBackground = scene.add.rectangle(menuWidth * 0.1-10, config.height * 0.08, menuWidth, menuHeight, 0xFFFFFF, 0.8);
    menuBackground.setStrokeStyle(4, 0x4169e1); // 緑枠

    //テキスト（ボタンを設定）の例
    const itemtext = scene.add.text(menuWidth*-0.5/2+15,menuHeight / -6 - 30,'アイテム',{fontSize:'32px',fill:'#000'});
    const geartext = scene.add.text(menuWidth*-0.5/2+40,menuHeight / -6 + 40,'装備',{fontSize:'32px',fill:'#000'});
    const statustext = scene.add.text(menuWidth*-0.5/2,menuHeight / -6 + 110,'ステータス',{fontSize:'32px',fill:'#000'});
    const savetext = scene.add.text(menuWidth*-0.5/2+20,menuHeight / -6 + 180,'セーブ',{fontSize:'32px',fill:'#000'});
    const logouttext = scene.add.text(menuWidth*-0.5/2+15,menuHeight / -6 + 250,'タイトル',{fontSize:'32px',fill:'#000'});

    //クリックイベント
    itemtext.setInteractive().on('pointerdown',()=>{
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
        itemEvent(gameStatus);
    });
    itemtext.setInteractive().on('pointerover', () => {
        if(!itemtra){
            itemtra = scene.add.text(menuWidth*0.5/2+15,menuHeight / 6-5,'▶',{fontSize:'32px',fill:'#000'});
            itemtra.setDepth(8);
        }
    });
    // カーソルがアイテムテキストから外れたときの処理
    itemtext.setInteractive().on('pointerout', () => {
        // itemtraが存在していれば非表示にし、破棄
        if (itemtra) {
            itemtra.destroy();
            itemtra = null;  // 破棄後は再度nullに設定
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
    geartext.setInteractive().on('pointerover', () => {
        if(!geartra){
            geartra = scene.add.text(menuWidth*0.5/2+40,menuHeight / 6 + 65,'▶',{fontSize:'32px',fill:'#000'});
            geartra.setDepth(8);
        }
    });
    // カーソルがアイテムテキストから外れたときの処理
    geartext.setInteractive().on('pointerout', () => {
        // geartraが存在していれば非表示にし、破棄
        if (geartra) {
            geartra.destroy();
            geartra = null;  // 破棄後は再度nullに設定
        }
    });
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
        statusEvent(gameStatus);
    });
    statustext.setInteractive().on('pointerover', () => {
        if(!stattra){
            stattra = scene.add.text(menuWidth*0.5/2,menuHeight / 6 + 135,'▶',{fontSize:'32px',fill:'#000'});
            stattra.setDepth(8);
        }
    });
    // カーソルがアイテムテキストから外れたときの処理
    statustext.setInteractive().on('pointerout', () => {
        // stattraが存在していれば非表示にし、破棄
        if (stattra) {
            stattra.destroy();
            stattra = null;  // 破棄後は再度nullに設定
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
    savetext.setInteractive().on('pointerover', () => {
        if(!savetra){
            savetra = scene.add.text(menuWidth*0.5/2+20,menuHeight / 6 + 205,'▶',{fontSize:'32px',fill:'#000'});
            savetra.setDepth(8);
        }
    });
    // カーソルがアイテムテキストから外れたときの処理
    savetext.setInteractive().on('pointerout', () => {
        // savetraが存在していれば非表示にし、破棄
        if (savetra) {
            savetra.destroy();
            savetra = null;  // 破棄後は再度nullに設定
        }
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
    logouttext.setInteractive().on('pointerover', () => {
        if(!logotra){
            logotra = scene.add.text(menuWidth*0.5/2+15,menuHeight / 6 + 275,'▶',{fontSize:'32px',fill:'#000'});
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

    //所持金欄の大きさ設定
    const goldBarHeight = menuHeight*0.50
    const Moneybar = scene.add.rectangle(menuWidth * 0.1-10,menuHeight / 2 + goldBarHeight / 2+100,menuWidth,goldBarHeight,0xFFFFFF,0.8);
    Moneybar.setStrokeStyle(4,0x4169e1);

    //所持金のテキスト
    const moneytext = scene.add.text(
        //文字の設定兼表示内容
        Moneybar.x-Moneybar.displayWidth/2+35,
        Moneybar.y-Moneybar.displayHeight/2+45,//表示位置ｘとｙ
        //表示文字と文字の設定
        `　所持金\n${playerStatus.money}`,
        {fontSize:'26px',fill:'#000'}
    );

    //メニュー要素をコンテナにまとめる
    menuContainer = scene.add.container(0,0,[menuBackground,itemtext,geartext,statustext,savetext,logouttext,Moneybar,moneytext]);
    menuContainer.setVisible(false);//初期状態は非表示
    menuContainer.setDepth(7);//一意晩上に表示されるようにする
}

export function updatepause(scene){
    // //メニューの位置をカメラに追従させる
    const camera = scene.cameras.main;
    let menuX;
    let menuY;
    const cameraCenterX = camera.worldView.x + camera.worldView.width / 2;
    const cameraCenterY = camera.worldView.y + camera.worldView.height / 2;
    menuX = camera.worldView.x + (cameraCenterX - camera.worldView.x) / 5;
    menuY = camera.worldView.y + (cameraCenterY - camera.worldView.y) / 2.2;
    //メニューをカメラ中心に配置し、少し左にずらす
    menuContainer.setPosition(menuX,menuY);
    if(itemtra){
        itemtra.setPosition(menuX-85,menuY-95);
    }
    if(geartra){
        geartra.setPosition(menuX-60,menuY-20);
    }
    if(stattra){
        stattra.setPosition(menuX-100,menuY+50);
    }
    if(savetra){
        savetra.setPosition(menuX-73,menuY+120);
    }
    if(logotra){
        logotra.setPosition(menuX-85,menuY+190);
    }
}