// export function statuspreload(loader) {
//     // 味方画像をプリロード
//     for (let i = 1; i <= 10; i++) {
//         loader.image(`enemy${i}`, `assets/battleimg/Enemy${i}.png`);
//     }
// }

let statusContainer;
export function statusEvent(gameStatus){
    gameStatus.statusflg = !gameStatus.statusflg;
    statusContainer.setVisible(gameStatus.statusflg);
}

export function createStatusScreen(scene,gameStatus, playerStatus,friend1Status,friend2Status,friend3Status, config) {
    const statusWidth = config.width * 0.60;
    const statusHeight = config.height * 0.95;

    // ステータス画面の背景
    const statusBackground = scene.add.rectangle(config.width * 0.5 + 10, 2, statusWidth, statusHeight, 0xFFFFE0, 0.8);
    statusBackground.setStrokeStyle(4, 0x000000);

    // プレイヤーのステータス情報を表示
    const playerInfo = scene.add.text(
        config.width * 0.2 + 10, statusHeight * 0.1, 
        `勇者 Lv.${playerStatus.level}\nHP: ${playerStatus.hp_nokori} / ${playerStatus.hp}　　　MP: ${playerStatus.mp_nokori} / ${playerStatus.mp}`,
        { fontSize: '18px', fill: '#000' }
    );

    // ステータス属性の表示
    const attributes = scene.add.text(
        config.width * 0.2 + 10, statusHeight * 0.2,
        `こうげき: ${playerStatus.pow}まもり: ${playerStatus.def}\nすばやさ: ${playerStatus.speed}運: ${playerStatus.luck}`,
        { fontSize: '16px', fill: '#000' }
    );
    // const line = scene.add.lineStyle(2, 0xFFFFE0);
    // line.beginPath();
    // line.moveTo(statusWidth, statusHeight*0.5);   // 始点の座標 (x1, y1)
    // line.lineTo(statusWidth+200, statusHeight*0.5);  // 終点の座標 (x2, y2)
    // line.strokePath();

    // モンスター情報（例として追加）
    let yOffset = 150;
    let friendimage;
    let friendInfo;
    let friendattributes;
    const friendStatuses = [friend1Status,friend2Status,friend3Status];
    if(gameStatus.temotisu != 0){
        for(let i=1;i<friendStatuses.length;i++){
            let friendStatus = friendStatuses[`friend${i}Status`];
            // friendimage = scene.add.image(50, yOffset + i * 100, 'friendStatus'); // モンスター画像
            friendInfo = scene.add.text(config.width * 0.2 + 10, statusHeight * 0.3, 
                `勇者 Lv.${friendStatus.level}\nHP: ${friendStatus.hp_nokori} / ${friendStatus.hp}MP: ${friendStatus.mp_nokori} / ${friendStatus.mp}`,
                { fontSize: '18px', fill: '#000' });
            friendattributes = scene.add.text(config.width * 0.2 + 10, statusHeight * 0.4,
                `こうげき: ${friendStatus.pow}まもり: ${friendStatus.def}\nすばやさ: ${friendStatus.speed}運: ${friendStatus.luck}`,
                { fontSize: '16px', fill: '#000' });
        }
    }
    statusContainer=scene.add.container(0,0,[statusBackground,playerInfo,attributes]);//,friendimage,friendInfo,friendattributes
    statusContainer.setVisible(false);
    statusContainer.setDepth(7);
    // const monsters = playerStatus.monsters; // モンスターリスト
    // let yOffset = 150;
    // for (let i = 0; i < monsters.length; i++) {
    //     scene.add.image(50, yOffset + i * 100, 'monsterSprite'); // モンスター画像
    //     scene.add.text(100, yOffset + i * 100, `モンスター Lv.${monsters[i].level}`, { fontSize: '16px', fill: '#000' });
    // }

}

    // 味方キャラクターの情報を表示
    // const friendContainer = [];
    // let yOffset = 200;
    // for (let i = 0; i < friendStatuses.length; i++) {
    //     const friendStatus = friendStatuses[i];
    //     if (friendStatus != null) {
    //         const friendId = friendStatus.friend_id; // friend_idに基づいて画像キーを決定
    //         const friendImage = scene.add.image(100, yOffset + i * 100, `enemy${friendId}`); // モンスター画像
            
    //         // 各味方の情報テキストを作成
    //         const friendInfo = scene.add.text(
    //             statusWidth * 0.1, yOffset + i * 100, 
    //             `味方 Lv.${friendStatus.level}\nHP: ${friendStatus.hp_nokori} / ${friendStatus.hp} MP: ${friendStatus.mp_nokori} / ${friendStatus.mp}`,
    //             { fontSize: '18px', fill: '#000' }
    //         );

    //         const friendAttributes = scene.add.text(
    //             statusWidth * 0.1, yOffset + i * 100 + 40,
    //             `こうげき: ${friendStatus.pow} まもり: ${friendStatus.def}\nすばやさ: ${friendStatus.speed} 運: ${friendStatus.luck}`,
    //             { fontSize: '16px', fill: '#000' }
    //         );

    //         friendContainer.push(friendImage, friendInfo, friendAttributes);
    //     }
    // }