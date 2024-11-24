import {save} from './main.js';
let saveContainer;
let savetra = null;
let backtra = null;
export function saveEvent(gameStatus){
    gameStatus.saveflg = !gameStatus.saveflg;
    saveContainer.setVisible(gameStatus.saveflg);
}

export async function saveGame(scene,config,gameStatus){
    //メニューのサイズを設定
    const saveWidth = config.width * 0.6;
    const saveHeight = config.height * 0.85;

    // メニュー背景を作成し、左に少しスペースを開ける
    const saveback = scene.add.rectangle(config.width * 0.3 + 10, 10, saveWidth, saveHeight, 0xFFFFFF, 0.8);
    saveback.setStrokeStyle(2,0x4169e1); // 緑枠
    saveback.setOrigin(0,0);

    //テキスト（ボタンを設定）の例
    const savesetumei = scene.add.text(config.width * 0.3+180,saveHeight / 4,'本当にセーブしますか？',{fontSize:'60px',fill:'#000'});
    savesetumei.setOrigin(0,0);
    const savetext = scene.add.text(config.width * 0.5+100,saveHeight / 2,'はい',{fontSize:'64px',fill:'#000'});
    savetext.setOrigin(0,0);
    const backtext = scene.add.text(config.width * 0.5 + 100,saveHeight / 2+80,'いいえ',{fontSize:'64px',fill:'#000'});
    backtext.setOrigin(0,0);
    //クリックイベント
    savetext.setInteractive().on('pointerdown',async()=>{
        await save();
    });
    savetext.setInteractive().on('pointerover', () => {
        if(!savetra){
            savetra = scene.add.text(config.width * 0.5,saveHeight / 2,'▶',{fontSize:'64px',fill:'#000'});
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
    backtext.setInteractive().on('pointerdown',()=>{
         saveEvent(gameStatus);
    });
    backtext.setInteractive().on('pointerover', () => {
        if(!backtra){
            backtra = scene.add.text(config.width * 0.5,saveHeight / 2+80,'▶',{fontSize:'64px',fill:'#000'});
            backtra.setDepth(8);
        }
    });
    // カーソルがアイテムテキストから外れたときの処理
    backtext.setInteractive().on('pointerout', () => {
        // backtraが存在していれば非表示にし、破棄
        if (backtra) {
            backtra.destroy();
            backtra = null;  // 破棄後は再度nullに設定
        }
    });
    saveContainer = scene.add.container(0,0,[saveback,savesetumei,savetext,backtext]);
    saveContainer.setVisible(false);
    saveContainer.setDepth(7);
}

export function saveUpdate(scene){
    const camera = scene.cameras.main;
    let saveX = camera.worldView.x + camera.worldView.width / 2;
    let saveY = camera.worldView.y + camera.worldView.height / 2;
    saveContainer.setPosition(camera.worldView.x,camera.worldView.y);
    if(savetra){
        savetra.setPosition(saveX,saveY - 50);
    }
    if(backtra){
        backtra.setPosition(saveX,saveY + 22);
    }
}