import {save} from './main.js';
import { playEffect } from './sound.js';
 
let saveContainer;
let savetra = null;
let backtra = null;
 
export function saveEvent(gameStatus,scene){
    gameStatus.saveflg = !gameStatus.saveflg;
    if(gameStatus.saveflg){
        playEffect(scene,'open');
    }else{
        playEffect(scene,'no');
    }
    saveContainer.setVisible(gameStatus.saveflg);
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
        {fontSize:'60px',fill:'#000'}
    );
    savesetumei.setOrigin(0.5,0.5); // テキストの中心を基準に配置
 
    const savetext = scene.add.text(
        config.width * 0.3 + (saveWidth / 2),
        saveHeight / 2,
        'はい',
        {fontSize:'64px',fill:'#000'}
    );
    savetext.setOrigin(0.5,0.5);
 
    const backtext = scene.add.text(
        config.width * 0.3 + (saveWidth / 2),
        saveHeight / 2 + 80,
        'いいえ',
        {fontSize:'64px',fill:'#000'}
    );
    backtext.setOrigin(0.5,0.5);
 
    //クリックイベント
    savetext.setInteractive().on('pointerdown',()=>{
        save();
    });
    savetext.setInteractive().on('pointerover', () => {
        if(!savetra){
            savetra = scene.add.text(
                savetext.x - (savetext.width / 2) - 40,
                savetext.y,
                '▶',
                {fontSize:'64px',fill:'#000'}
            );
            savetra.setOrigin(0.5,0.5);
            savetra.setDepth(8);
        }
    });
 
    savetext.setInteractive().on('pointerout', () => {
        if (savetra) {
            savetra.destroy();
            savetra = null;
        }
    });
 
    backtext.setInteractive().on('pointerdown',()=>{
         saveEvent(gameStatus,scene);
    });
    backtext.setInteractive().on('pointerover', () => {
        if(!backtra){
            backtra = scene.add.text(
                backtext.x - (backtext.width / 2) - 40,
                backtext.y,
                '▶',
                {fontSize:'64px',fill:'#000'}
            );
            backtra.setOrigin(0.5,0.5);
            backtra.setDepth(8);
        }
    });
 
    backtext.setInteractive().on('pointerout', () => {
        if (backtra) {
            backtra.destroy();
            backtra = null;
        }
    });
 
    saveContainer = scene.add.container(0,0,[saveback,savesetumei,savetext,backtext]);
    saveContainer.setVisible(false);
    saveContainer.setDepth(7);
}
 
export function saveUpdate(scene){
    const camera = scene.cameras.main;
    saveContainer.setPosition(camera.worldView.x,camera.worldView.y);
    // カメラの中心位置を計算
    const centerX = camera.worldView.x + camera.worldView.width / 2;
    const centerY = camera.worldView.y + camera.worldView.height / 2;
    // 矢印の位置更新
    if(savetra){
        savetra.setPosition(
            centerX - 100,  // 「はい」ボタンの左側に配置
            centerY - 50
        );
    }
    if(backtra){
        backtra.setPosition(
            centerX - 100,  // 「いいえ」ボタンの左側に配置
            centerY + 30
        );
    }
}