import { playEffect } from './sound.js';
let gearContainer = null;
let temporary_id = null;

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
        // if (gear.gear_set <= 0) {
        //     console.warn(`アイテム「${gear.gear_name}」の在庫がありません`);
        //     alert(`アイテム「${gear.gear_name}」は在庫切れです`);
        //     return;
        // }
        console.log(`アイテム選択: ${gear.gear_name}`);
        usegear(scene, config, gameStatus, gear, playerStatus, friends);

        // アイテムの個数を減らし、表示を更新
        // if (gear.gear_set >= 0) {
        //     countDisplays[gear.gear_id].setText(`${gear.gear_set}`);
        // } else {
        //     console.warn(`アイテム「${gear.gear_name}」は在庫がありません`);
        // }
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
export function usegear(scene, config, gameStatus, gear, playerStatus, friends) {
    
    console.log("playerStatus:", playerStatus);
    console.log("friends:", friends);

    if (!scene || !config || !gameStatus || !gear  || !playerStatus) {
        console.error("Invalid arguments passed to usegear");
        return;
    }


    if(temporary_id){
        
    }
    playerStatus.gear_id = gear.gear_id;
    gear.gear_set = 1;

    // アイテム使用処理を実装
    if (gear.up_status == "pow") {

        }

    temporary_id = gear.gear_id;
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
