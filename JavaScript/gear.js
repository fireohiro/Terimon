import { playEffect } from './sound.js';
let gearContainer = null;
let temporary = null;
let temporary_gearid = null;
let temporary_upstatus = null;
let temporary_naiyou = null;

export function gearEvent(scene, config, gameStatus, playerStatus, gearList, friends){
    gameStatus.gearflg = !gameStatus.gearflg;
    if(gameStatus.gearflg){
        playEffect(scene,'open');
        GearMenu(scene, config, gameStatus, playerStatus, gearList, friends);
    }else{
        playEffect(scene,'no');
        if(gearContainer){
            gearContainer.destroy();
        }
    }

    if(playerStatus.gear_id != null){
        temporary_gearid = playerStatus.gear_id;
        
    }
}

export function GearMenu(scene, config, gameStatus, playerStatus, gearList, friends) {
    if (!scene || !config || !gameStatus) {
        console.error("Invalid arguments passed to initializegearMenu");
        return;
    }

    // メニュー全体の幅と高さを計算
    const gearWidth = config.width * 0.6;
    const gearHeight = config.height * 0.8;

    // 背景を生成
    const gearback = scene.add.rectangle(
        config.width * 0.3,
        20,
        gearWidth,
        gearHeight,
        0xFFFFFF,
        0.8
    );
    gearback.setStrokeStyle(2, 0x4169e1);
    gearback.setOrigin(0, 0);

    // ヘッダーを生成
    const headergear = scene.add.text(
        config.width * 0.35,
        40,
        "アイテム",
        { fontSize: "20px", fill: "#000" }
    );
    const headerCount = scene.add.text(
        config.width * 0.75,
        40,
        "装備",
        { fontSize: "20px", fill: "#000" }
    );

    // アイテムメニューコンテナを作成
    const camera = scene.cameras.main;
    gearContainer = scene.add.container(camera.scrollX, camera.scrollY, [gearback, headergear, headerCount]);
    // gearContainer.setVisible(false); // 初期状態は非表示
    gearContainer.setDepth(7);

    // アイテムボタンの間隔と配置
    const buttonSpacing = 40;
    const startX = config.width * 0.35;
    let startY = 80;

    // アイテムリストからボタンを生成
if (gearList && Array.isArray(gearList)) { // gearListが存在し、配列である場合のみ処理を進める
    const countDisplays = {}; // アイテムIDをキーにカウント表示を管理

    gearList.forEach((gear, index) => {
        const gearText = `${gear.gear_name}`;
    
        // アイテムボタンを作成
        const gearButton = createButton(
            scene,
            startX,
            startY + index * buttonSpacing,
            gearText,
            () => {
                console.log(`アイテム選択: ${gear.gear_name}`);
                usegear(scene, config, gameStatus, gear, gearList,  playerStatus, friends, countDisplays);
            }
        );
    
        // 個数表示用のテキストを作成
        const countDisplay = scene.add.text(
            config.width * 0.75,
            startY + index * buttonSpacing,
            gear.gear_set === 1 ? "E" : ``,
            { fontSize: "18px", fill: "#000" }
        );
    
        // ボタンと個数表示をコンテナに追加
        gearContainer.add([gearButton, countDisplay]);
    
        // 個数表示を管理リストに追加
        countDisplays[gear.gear_id] = countDisplay;
    
        console.log("ボタン生成:", gearButton);
    });
    

} else {
    console.warn("gearListが無効または空です:", gearList);
}
    console.log("アイテムメニュー初期化完了:", gearContainer);
}


/**
 * ボタン生成用のユーティリティ関数
 */
function createButton(scene, x, y, text, callback) {
    console.log(`Creating button at (${x}, ${y}): ${text}`);
    const button = scene.add.text(x, y, text, {
        fontSize: "18px",
        backgroundColor: "#FFFFFF",
        color: "#000",
        padding: { left: 10, right: 10, top: 5, bottom: 5 },
    });
    
    button.setInteractive();

    // 登録前に既存のリスナーをクリア
    button.off("pointerdown");

    button.on("pointerdown", callback);
    button.on("pointerover", () => button.setStyle({ backgroundColor: "#E0E0E0" }));
    button.on("pointerout", () => button.setStyle({ backgroundColor: "#FFFFFF" }));
    return button;
    
}

/**
 * 装備登録処理
 */

export function usegear(scene, config, gameStatus, gear, gearList, playerStatus, friends, countDisplays) {
    console.log("playerStatus:", playerStatus);
    console.log("friends:", friends);

    if (!scene || !config || !gameStatus || !gear || !playerStatus) {
        console.error("Invalid arguments passed to usegear");
        return;
    }

    console.count("usegear called");

    console.log(playerStatus.gear_id);
    console.log(gear.gear_set);

    // 元の装備を外す処理
    if (playerStatus.gear_id !== null) {
        console.log(`元の装備を外します: gear_id=${playerStatus.gear_id}`);

        // `gearList` から元の装備を見つける
        const previousGear = gearList.find(item => item.gear_id === playerStatus.gear_id);
        if (previousGear) {
            previousGear.gear_set = 0; // 元の装備の `gear_set` を 0 に更新
            console.log(`元の装備のgear_setを0に設定: gear_id=${previousGear.gear_id}`);
        }

        if (temporary_upstatus === "pow") {
            playerStatus.pow -= temporary_naiyou; // 元の装備のステータスを下げる
            console.log(`元の装備のステータスを減算: pow -${temporary_naiyou}`);
        }

        // 表示を更新
        if (countDisplays[temporary_gearid]) {
            countDisplays[temporary_gearid].setText(""); // 非装備状態に
        }
    }

    // 新しい装備を設定
    playerStatus.gear_id = gear.gear_id; // プレイヤーの装備を更新
    gear.gear_set = 1; // 装備状態にする
    console.log(`新しい装備を設定: ${gear.gear_name} (${gear.gear_id})`);

    // 新しい装備のステータスを追加
    if (gear.up_status === "pow") {
        playerStatus.pow += gear.naiyou; // ステータスを加算
        console.log(`新しい装備のステータスを加算: pow +${gear.naiyou}`);
    }

    console.log(playerStatus.gear_id);
    console.log(gear.gear_set);

    // 表示を更新
    if (countDisplays[gear.gear_id]) {
        countDisplays[gear.gear_id].setText("E"); // 装備状態を表示
    }

    console.log(playerStatus.gear_id);
    console.log(gear.gear_set);

    // 一時変数に新しい装備情報を保存
    temporary_gearid = gear.gear_id;
    temporary_upstatus = gear.up_status;
    temporary_naiyou = gear.naiyou;

    console.log("装備変更処理が完了しました。");
}



/**
 * アイテムメニューの更新（カメラ追従）
 */
export function gearUpdate(scene) {
    if (gearContainer) {
        const camera = scene.cameras.main;
        const saveX = camera.scrollX; // カメラのスクロール位置に合わせる
        const saveY = camera.scrollY;
        gearContainer.setPosition(saveX, saveY);
    }
}
