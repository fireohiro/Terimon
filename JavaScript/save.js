import {save} from './main.js';
import { playEffect } from './sound.js';
 
let saveContainer;
 
export function saveEvent(gameStatus,scene,config){
    gameStatus.saveflg = !gameStatus.saveflg;
    if(gameStatus.saveflg){
        playEffect(scene,'open');
        saveGame(scene,config,gameStatus);
    }else{
        playEffect(scene,'no');
        if(saveContainer){
            saveContainer.destroy();
        }
    }
}
 
export async function saveGame(scene,config,gameStatus){
    //メニューのサイズを設定
    const saveWidth = config.width * 0.6;
    const saveHeight = config.height * 0.85;
 
    // メニュー背景を作成し、左に少しスペースを開ける
    const saveback = scene.add.rectangle(config.width * 0.3 + 10, 10, saveWidth, saveHeight, 0xFFFFFF, 0.8);
    saveback.setStrokeStyle(2,0x4169e1);
    saveback.setOrigin(0,0);
 
    //テキスト（ボタンを設定）の例
    const savesetumei = scene.add.text(
        config.width * 0.3 + (saveWidth / 2), // 横方向中央
        saveHeight / 3,  // 縦方向位置調整
        '本当にセーブしますか？',
        {fontSize:'60px',fill:'#000',padding:{top:10,bottom:10}}
    );
    savesetumei.setOrigin(0.5,0.5); // テキストの中心を基準に配置
 
    const savetext = scene.add.text(
        config.width * 0.3 + (saveWidth / 2),
        saveHeight / 2,
        'はい',
        {fontSize:'64px',fill:'#000',padding:{top:10,bottom:10}}
    );
    savetext.setOrigin(0.5,0.5);
 
    const backtext = scene.add.text(
        config.width * 0.3 + (saveWidth / 2),
        saveHeight / 2 + 80,
        'いいえ',
        {fontSize:'64px',fill:'#000',padding:{top:10,bottom:10}}
    );
    backtext.setOrigin(0.5,0.5);
 
    //クリックイベント
    savetext.setInteractive().on('pointerdown',()=>{
        save();
    });
    savetext.setInteractive().on('pointerover', () => {
        savetext.y += 5;
    });
 
    savetext.setInteractive().on('pointerout', () => {
        savetext.y -= 5;
    });
 
    backtext.setInteractive().on('pointerdown',()=>{
         saveEvent(gameStatus,scene,config);
    });
    backtext.setInteractive().on('pointerover', () => {
        backtext.y += 5;
    });
 
    backtext.setInteractive().on('pointerout', () => {
        backtext.y -= 5;
    });
 
    saveContainer = scene.add.container(0,0,[saveback,savesetumei,savetext,backtext]);
    saveContainer.setDepth(7);
}
 
export function saveUpdate(scene){
    const camera = scene.cameras.main;
    saveContainer.setPosition(camera.worldView.x,camera.worldView.y);
}