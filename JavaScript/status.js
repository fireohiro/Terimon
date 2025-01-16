import { playEffect } from "./sound";
let statusContainer;

export function statuspreload(loader) {
    loader.spritesheet('player','assets/character/terimon1.png', { frameWidth: 100, frameHeight: 100 })
    // 味方画像をプリロード
    for (let i = 1; i <= 21; i++) {
        loader.image(`monster${i}`, `assets/monster/monster${i}.png`);
    }
}
export function statusEvent(gameStatus,scene,config,playerStatus,friends){
    gameStatus.statusflg = !gameStatus.statusflg;
    if(gameStatus.statusflg){
        playEffect(scene,'open');
        createStatusScreen(scene,gameStatus,playerStatus,friends,config);
    }else{
        playEffect(scene,'no');
        if(statusContainer){
            statusContainer.destroy();
        }
    }
}

export function createStatusScreen(scene,gameStatus, playerStatus,friends, config) {
    const statusWidth = config.width * 0.6;
    const statusHeight = config.height * 0.8;

    // ステータス画面の背景
    const statusBackground = scene.add.rectangle(config.width * 0.2 + 10, 20, statusWidth, statusHeight, 0xFFFFFF, 0.8);
    statusBackground.setStrokeStyle(4, 0x4169e1);
    statusBackground.setOrigin(0,0);

    const playerImage = scene.add.sprite(config.width * 0.25, statusHeight * 0.2,'player');

    // プレイヤーのステータス情報を表示
    const playerInfo = scene.add.text(
        config.width * 0.3 + 20, statusHeight * 0.1, 
        `${playerStatus.account_name} Lv.${playerStatus.level}\nHP: ${playerStatus.hp_nokori} / ${playerStatus.hp}　　　MP: ${playerStatus.mp_nokori} / ${playerStatus.mp}`,
        { fontSize: '30px', fill: '#000' }
    );

    // ステータス属性の表示
    const attributes = scene.add.text(
        config.width * 0.3 + 20, statusHeight * 0.2,
        `ちから: ${playerStatus.pow}　　　まもり: ${playerStatus.def}\nすばやさ: ${playerStatus.speed}　　　運: ${playerStatus.luck}`,
        { fontSize: '30px', fill: '#000' }
    );

    // モンスター情報（例として追加）
    let yOffset = 150;
    let friendInfo;
    let friendattributes;
    let friendImage;
    const friendElements = [];
    if(gameStatus.temotisu != 0){
        friends.forEach((friendStatus,index) => {
            friendImage = scene.add.sprite(config.width * 0.25, statusHeight * 0.4 + index * statusHeight * 0.25,'monster'+friendStatus.monster_id);
            friendImage.setDisplaySize(100, 100);
            friendInfo = scene.add.text(config.width * 0.3 + 20, statusHeight * 0.315 + index * statusHeight * 0.25, 
                `${friendStatus.monster_name} Lv.${friendStatus.level}\nHP: ${friendStatus.hp_nokori} / ${friendStatus.hp}　　　MP: ${friendStatus.mp_nokori} / ${friendStatus.mp}`,
                { fontSize: '30px', fill: '#000' });
            friendattributes = scene.add.text(config.width * 0.3 + 20, statusHeight * 0.415 + index * statusHeight * 0.25,
                `ちから: ${friendStatus.pow}　　　まもり: ${friendStatus.def}\nすばやさ: ${friendStatus.speed}　　　運: ${friendStatus.luck}`,
                { fontSize: '30px', fill: '#000' });
            friendElements.push(friendInfo, friendattributes, friendImage);
        });
    }
    statusContainer=scene.add.container(0,0,[statusBackground,playerImage,playerInfo,attributes,...friendElements]);//,friendimage
    statusContainer.setDepth(7);
}

export function statusUpdate(scene){
    const camera = scene.cameras.main;
    statusContainer.setPosition(camera.worldView.x,camera.worldView.y);
}