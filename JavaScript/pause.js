import {itemEvent, initializeItemMenu} from './item.js';
import {statusEvent} from './status.js';
import {saveEvent} from './save.js';
import{logoutmessage,logoutdisplay} from './logout.js';
import { playEffect } from './sound.js';
let menuContainer;
let moneytext;
export function createPause(scene,gameStatus,playerStatus,config,friends,itemList,gearList){
    scene.input.keyboard.on('keydown',(event) => {
        if(event.key === 'Escape'){
            pauseStart(scene,gameStatus,config,playerStatus,friends);
        }
    });
    initializeItemMenu(scene, config, gameStatus, itemList);
}

function pauseStart(scene,gameStatus,config,playerStatus,friends){
    gameStatus.pauseflg = !gameStatus.pauseflg;
    //ポーズ中の物理処理の停止と再稼働
    if(gameStatus.pauseflg){
        playEffect(scene,'pause');
        scene.physics.world.pause();//停止
        menuBar(scene,playerStatus,config,gameStatus,friends);
    }else{
        if(menuContainer){
            menuContainer.destroy();
        }
        playEffect(scene,'no');
        scene.physics.world.resume();//再稼働
        if(gameStatus.itemflg === true){
            //gameStatus.itemflgをfalseになるようflgチェンジ関数を呼ぶほかも同じようにする
            itemEvent(gameStatus,scene);
        }
        if(gameStatus.gearflg === true){
            //gameStatus.gearflgをfalseになるようflgチェンジ関数を呼ぶほかも同じようにする
        }
        if(gameStatus.statusflg === true){
            //gameStatus.statusflgをfalseになるようflgチェンジ関数を呼ぶほかも同じようにする
            statusEvent(gameStatus,scene,config,playerStatus,friends);
        }
        if(gameStatus.saveflg === true){
            //gameStatus.saveflgをfalseになるようflgチェンジ関数を呼ぶほかも同じようにする
            saveEvent(gameStatus,scene,config);
        }
        if(gameStatus.logoutflg === true){
            //gameStatus.logoutflgをfalseになるようflgチェンジ関数を呼ぶほかも同じようにする
            logoutdisplay(gameStatus,scene,config);
        }
    }
}

async function menuBar(scene,playerStatus,config,gameStatus,friends){
    //メニューのサイズを設定
    const menuWidth = config.width * 0.16;
    const menuHeight = config.height * 0.50;

    // メニュー背景を作成し、左に少しスペースを開ける
    const menuBackground = scene.add.rectangle(menuWidth * 0.1-10, config.height * 0.08, menuWidth, menuHeight, 0xFFFFFF, 0.8);
    menuBackground.setStrokeStyle(4, 0x4169e1); // 緑枠

    const takasa = menuBackground.y - menuHeight / 2 + 10;
    //テキスト（ボタンを設定）の例
    const itemtext = scene.add.text(10,takasa + menuHeight / 11 * 1,'アイテム',{fontSize:'32px',fill:'#000'});
    itemtext.setOrigin(0.5,0.5);
    const geartext = scene.add.text(10,takasa + menuHeight / 11 * 3,'装備',{fontSize:'32px',fill:'#000'});
    geartext.setOrigin(0.5,0.5);
    const statustext = scene.add.text(10,takasa + menuHeight / 11 * 5,'ステータス',{fontSize:'32px',fill:'#000'});
    statustext.setOrigin(0.5,0.5);
    const savetext = scene.add.text(10,takasa + menuHeight / 11 * 7,'セーブ',{fontSize:'32px',fill:'#000'});
    savetext.setOrigin(0.5,0.5);
    const logouttext = scene.add.text(10,takasa + menuHeight / 11 * 9,'タイトル',{fontSize:'32px',fill:'#000'});
    logouttext.setOrigin(0.5,0.5);

    //クリックイベント
    itemtext.setInteractive().on('pointerdown',()=>{
        if(gameStatus.gearflg === true){
            //gameStatus.gearflgをfalseになるようflgチェンジ関数を呼ぶほかも同じようにする
        }
        if(gameStatus.statusflg === true){
            //gameStatus.statusflgをfalseになるようflgチェンジ関数を呼ぶほかも同じようにする
            statusEvent(gameStatus,scene,config,playerStatus,friends);
        }
        if(gameStatus.saveflg === true){
            //gameStatus.saveflgをfalseになるようflgチェンジ関数を呼ぶほかも同じようにする
            saveEvent(gameStatus,scene,config);
        }
        if(gameStatus.logoutflg === true){
            //gameStatus.logoutflgをfalseになるようflgチェンジ関数を呼ぶほかも同じようにする
            logoutdisplay(gameStatus,scene,config);
        }
        itemEvent(gameStatus,scene);
    });
    itemtext.setInteractive().on('pointerover', () => {
        itemtext.y += 5;
    });
    // カーソルがアイテムテキストから外れたときの処理
    itemtext.setInteractive().on('pointerout', () => {
        itemtext.y -= 5;
    });
    //装備
    geartext.setInteractive().on('pointerdown',()=>{
        //装備用のプログラムの関数を呼び出す
        if(gameStatus.itemflg === true){
            //gameStatus.itemflgをfalseになるようflgチェンジ関数を呼ぶほかも同じようにする
            itemEvent(gameStatus,scene);
        }
        if(gameStatus.statusflg === true){
            //gameStatus.statusflgをfalseになるようflgチェンジ関数を呼ぶほかも同じようにする
            statusEvent(gameStatus,scene,config,playerStatus,friends);
        }
        if(gameStatus.saveflg === true){
            //gameStatus.saveflgをfalseになるようflgチェンジ関数を呼ぶほかも同じようにする
            saveEvent(gameStatus,scene,config);
        }
        if(gameStatus.logoutflg === true){
            //gameStatus.logoutflgをfalseになるようflgチェンジ関数を呼ぶほかも同じようにする
            logoutdisplay(gameStatus,scene,config);
        }
    });
    geartext.setInteractive().on('pointerover', () => {
        geartext.y += 5;
    });
    // カーソルがアイテムテキストから外れたときの処理
    geartext.setInteractive().on('pointerout', () => {
        geartext.y -= 5;
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
            saveEvent(gameStatus,scene,config);
        }
        if(gameStatus.logoutflg === true){
            //gameStatus.logoutflgをfalseになるようflgチェンジ関数を呼ぶほかも同じようにする
            logoutdisplay(gameStatus,scene,config);
        }
        statusEvent(gameStatus,scene,config,playerStatus,friends);
    });
    statustext.setInteractive().on('pointerover', () => {
        statustext.y += 5;
    });
    // カーソルがアイテムテキストから外れたときの処理
    statustext.setInteractive().on('pointerout', () => {
        statustext.y -= 5;
    });
    //セーブ
    savetext.setInteractive().on('pointerdown',()=>{
        if(gameStatus.itemflg === true){
            //gameStatus.itemflgをfalseになるようflgチェンジ関数を呼ぶほかも同じようにする
            itemEvent(gameStatus,scene);
        }
        if(gameStatus.gearflg === true){
            //gameStatus.gearflgをfalseになるようflgチェンジ関数を呼ぶほかも同じようにする
        }
        if(gameStatus.statusflg === true){
            //gameStatus.statusflgをfalseになるようflgチェンジ関数を呼ぶほかも同じようにする
            statusEvent(gameStatus,scene,config,playerStatus,friends);
        }
        if(gameStatus.logoutflg === true){
            //gameStatus.logoutflgをfalseになるようflgチェンジ関数を呼ぶほかも同じようにする
            logoutdisplay(gameStatus,scene,config);
        }
        //セーブの表示と非表示
        saveEvent(gameStatus,scene,config);
    });
    savetext.setInteractive().on('pointerover', () => {
        savetext.y += 5;
    });
    // カーソルがアイテムテキストから外れたときの処理
    savetext.setInteractive().on('pointerout', () => {
        savetext.y -= 5;
    });
    //ログアウト
    logouttext.setInteractive().on('pointerdown',()=>{
        //ログアウト用のプログラムの関数を呼び出す
        if(gameStatus.itemflg === true){
            //gameStatus.itemflgをfalseになるようflgチェンジ関数を呼ぶほかも同じようにする
            itemEvent(gameStatus,scene);
        }
        if(gameStatus.gearflg === true){
            //gameStatus.gearflgをfalseになるようflgチェンジ関数を呼ぶほかも同じようにする
        }
        if(gameStatus.statusflg === true){
            //gameStatus.statusflgをfalseになるようflgチェンジ関数を呼ぶほかも同じようにする
            statusEvent(gameStatus,scene,config,playerStatus,friends);
        }
        if(gameStatus.saveflg === true){
            //gameStatus.saveflgをfalseになるようflgチェンジ関数を呼ぶほかも同じようにする
            saveEvent(gameStatus,scene,config);
        }
        //ログアウトウィンドウ表示
        logoutdisplay(gameStatus,scene,config);
    });
    logouttext.setInteractive().on('pointerover', () => {
        logouttext.y += 5;
    });
    // カーソルがアイテムテキストから外れたときの処理
    logouttext.setInteractive().on('pointerout', () => {
        logouttext.y -= 5;
    });

    //所持金欄の大きさ設定
    const goldBarHeight = menuHeight*0.50
    const Moneybar = scene.add.rectangle(menuWidth * 0.1-10,menuHeight / 2 + goldBarHeight / 2+100,menuWidth,goldBarHeight,0xFFFFFF,0.8);
    Moneybar.setStrokeStyle(4,0x4169e1);

    //所持金のテキスト
    const timeismoney = scene.add.text(
        0,
        Moneybar.y - goldBarHeight / 2 + goldBarHeight / 4,
        '所持金',
        {fontSize:'32px',fill:'#000'}
    );
    timeismoney.setOrigin(0.5,0.5);
    moneytext = scene.add.text(
        //文字の設定兼表示内容
        0,
        Moneybar.y,//表示位置ｘとｙ
        //表示文字と文字の設定
        `${playerStatus.money}TP`,
        {fontSize:'32px',fill:'#000'}
    );
    moneytext.setOrigin(0.5,0.5);

    //メニュー要素をコンテナにまとめる
    menuContainer = scene.add.container(0,0,[menuBackground,itemtext,geartext,statustext,savetext,logouttext,Moneybar,timeismoney,moneytext]);
    menuContainer.setDepth(7);//一意晩上に表示されるようにする
}

export function updatepause(scene,playerStatus){
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
}