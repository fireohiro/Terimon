export function createStatusScreen(loader,gameStatus, playerStatus,friend1Status,friend2Status,friend3Status, config) {
    const statusWidth = config.width * 0.60;
    const statusHeight = config.height * 0.70;

    // ステータス画面の背景
    const statusBackground = loader.add.rectangle(statusWidth / 2, config.height / 2, statusWidth, statusHeight, 0xFFFFE0, 0.8);
    statusBackground.setStrokeStyle(4, 0x000000);

    // プレイヤーのステータス情報を表示
    const playerInfo = loader.add.text(
        statusWidth * 0.1, statusHeight * 0.1, 
        `勇者 Lv.${playerStatus.level}\nHP: ${playerStatus.hp_nokori} / ${playerStatus.hp}\nMP: ${playerStatus.mp_nokori} / ${playerStatus.mp}`,
        { fontSize: '18px', fill: '#000' }
    );

    // ステータス属性の表示
    const attributes = loader.add.text(
        statusWidth * 0.1, statusHeight * 0.3,
        `こうげき: ${playerStatus.pow}\nまもり: ${playerStatus.def}\nすばやさ: ${playerStatus.speed}\n運: ${playerStatus.luck}`,
        { fontSize: '16px', fill: '#000' }
    );

    // モンスター情報（例として追加）
    let yOffset = 150;
    const friendStatuses = [friend1Status,friend2Status,friend3Status];
    for(let i=1;i<friendStatuses.length;i++){
        if(friendStatuses[i] != null){
            const friendStatus = friendStatuses[`friend${i}Status`];
            loader.add.image(50, yOffset + i * 100, 'monsterSprite'+i); // モンスター画像
            loader.add.text(statusWidth * 0.1, statusHeight * 0.1, 
                `勇者 Lv.${friendStatus.level}\nHP: ${friendStatus.hp_nokori} / ${friendStatus.hp}\nMP: ${friendStatus.mp_nokori} / ${friendStatus.mp}`,
                { fontSize: '18px', fill: '#000' });
            loader.add.text(statusWidth * 0.1, statusHeight * 0.3,
                `こうげき: ${friendStatus.pow}\nまもり: ${friendStatus.def}\nすばやさ: ${friendStatus.speed}\n運: ${friendStatus.luck}`,
                { fontSize: '16px', fill: '#000' });
        }
    }
    // const monsters = playerStatus.monsters; // モンスターリスト
    // let yOffset = 150;
    // for (let i = 0; i < monsters.length; i++) {
    //     loader.add.image(50, yOffset + i * 100, 'monsterSprite'); // モンスター画像
    //     loader.add.text(100, yOffset + i * 100, `モンスター Lv.${monsters[i].level}`, { fontSize: '16px', fill: '#000' });
    // }

}