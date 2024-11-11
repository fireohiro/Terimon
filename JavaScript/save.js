let saveContainer;
let kasoru;
export function saveEvent(gameStatus){
    gameStatus.saveflg = !gameStatus.saveflg;
    saveContainer.setVisible(gameStatus.saveflg);
}

export async function saveGame(scene,playerStatus,config,gameStatus,friends,itemList,gearList){
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
        //fetch関数を使ってデータをsave_player.phpに送信
        const response = await fetch('save_player.php',{
            method:'POST',//HTTPのPOSTメソッドを使用
            headers:{
                'Content-Type':'application/json',//送信データがJSON形式であることを宣言
            },
            body:JSON.stringify(playerStatus),//saveDataオブジェクトをJSON形式の文字列に変換し、送信
        });
        if(!response.ok){
            throw new Error(`HTTP error! Status:${response.status}`);
        }
        const result = await response.json();
        //モンスターの更新
        const payload = {friends:friends};
        const monsterres = await fetch('save_monster.php',{
            method:'POST',
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify(payload)
        });
        if(!monsterres.ok){
            throw new Error(`HTTP error! Status:${monsterres.status}`);
        }
        const monres = await monsterres.json();
        console.log('Monster data saved:',monres);
        const itemload =  {itemList:itemList};
        const itemres = await fetch('save_item.php',{
            method:'POST',
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify(itemload)
        });
        if(!itemres.ok){
            throw new Error(`HTTP error! Status:${itemres.status}`);
        }
        const iteres = await itemres.json();
        console.log('Item data saved:',iteres);
        const gearload =  {gearList:gearList};
        const gearres = await fetch('save_gear.php',{
            method:'POST',
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify(gearload)
        });
        if(!itemres.ok){
            throw new Error(`HTTP error! Status:${gearres.status}`);
        }
        const geares = await gearres.json();
        console.log('Item data saved:',geares);
    });
    savetext.setInteractive().on('pointerover', () => {
        if(!kasoru){
            kasoru = scene.add.text(config.width * 0.5,saveHeight / 2,'▶',{fontSize:'64px',fill:'#000'});
            kasoru.setDepth(8);
        }
    });
    // カーソルがアイテムテキストから外れたときの処理
    savetext.setInteractive().on('pointerout', () => {
        // kasoruが存在していれば非表示にし、破棄
        if (kasoru) {
            kasoru.destroy();
            kasoru = null;  // 破棄後は再度nullに設定
        }
    });
    backtext.setInteractive().on('pointerdown',()=>{
         saveEvent(gameStatus);
    });
    backtext.setInteractive().on('pointerover', () => {
        if(!kasoru){
            kasoru = scene.add.text(config.width * 0.5,saveHeight / 2+80,'▶',{fontSize:'64px',fill:'#000'});
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
    saveContainer = scene.add.container(0,0,[saveback,savesetumei,savetext,backtext]);
    saveContainer.setVisible(false);
    saveContainer.setDepth(7);
}