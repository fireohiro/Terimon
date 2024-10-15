const config = {
    type: Phaser.AUTO,
    width: 1500, // ゲームの幅
    height: 750, // ゲームの高さ
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 }, // 重力なし
            debug: false // デバッグ情報を表示するか
        }
    },
    scene: {
        preload: preload,//Javaでいうインスタンス変数を呼び出す場所
        create: create,//初期値設定
        update: update//毎フレーム処理
    }
};

const game = new Phaser.Game(config);
let map;
let tilesets = []; // 複数のタイルセットを管理
let layer;
let player;
let cursors;
let menuContainer;
let isPaused = false; // ポーズ画面のON/OFFの管理
let lastMoveTime = 0;
const moveThreshold = 100;
const battleProbability = 0.02;
let isInBattle = false;//バトル中かどうかのフラグ
let battleBackground;//バトル時の背景
let enemy;
let playerSavedVelocity = {x:0,y:9};//バトル前の速度を保存するための変数

function preload() {
    this.load.tilemapTiledJSON('town','town.json');
    for (let i = 1; i <= 15; i++) {
        this.load.image(`tileset${i}`, `tileset${i}.png`);
    }
    // プレイヤーの画像を読み込む
    this.load.image('player', 'player.png'); // player.pngをプロジェクトに配置
    this.load.image('battleback','battleback.png');
    this.load.image('enemy','enemy.png');
}

function create() {
    map = this.make.tilemap({key:'town'});
    for (let i = 1; i <= 15; i++) {
        let tileset = map.addTilesetImage(`tileset${i}`, `tileset${i}`);
        tilesets.push(tileset);
    }

    // 各レイヤーを作成
    const layer1 = map.createLayer('\u30bf\u30a4\u30eb\u30ec\u30a4\u30e4\u30fc1', tilesets, 0, 0);
    const layer2 = map.createLayer('\u30bf\u30a4\u30eb\u30ec\u30a4\u30e4\u30fc2', tilesets, 0, 0);
    const layer3 = map.createLayer('\u30bf\u30a4\u30eb\u30ec\u30a4\u30e4\u30fc3', tilesets, 0, 0);
    const layer4 = map.createLayer('\u30bf\u30a4\u30eb\u30ec\u30a4\u30e4\u30fc4', tilesets, 0, 0);

    // プレイヤーを作成
    player = this.physics.add.sprite(64, 480, 'player');

    // カメラをプレイヤーに追従させる設定
    this.cameras.main.startFollow(player);
    this.cameras.main.setZoom(1.5); // カメラを少し近づける（1.5倍に設定）
    
    // マップの境界を設定
    this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

    // スケールを設定
    const playerScale = config.width * 0.025 / player.width;//プレイヤーの大きさ
    player.setScale(playerScale);

    // カーソルキーの入力を設定
    cursors = this.input.keyboard.createCursorKeys();

    // プレイヤーがマップの上に表示されるようにZインデックスを設定
    layer1.setDepth(0);//床１
    layer2.setDepth(1);//床２
    player.setDepth(2);//プレイヤーキャラクター
    layer3.setDepth(3);//オブジェクトや家
    layer4.setDepth(4);//屋根等

    // ESCキーでポーズ切り替え
    this.input.keyboard.on('keydown', (event) => {
        if (event.key === 'Escape') {
            togglePause.call(this);
        }
    });
    // メニューバーを作成
    createMenuBar(this);
}

let playerPosition = {x:0,y:0};//プレイヤー位置を記憶

function update() {
    if (isPaused) {
        //メニューの位置をカメラに追従させる
        const cameraCenterX = this.cameras.main.scrollX + this.cameras.main.width / 2;
        const cameraCenterY = this.cameras.main.scrollY + this.cameras.main.height / 2;

        //メニューをカメラ中心に配置し、少し左にずらす
        menuContainer.setPosition(cameraCenterX - config.width * 0.15,cameraCenterY-130);
        return;//ポーズ中はプレイヤーの更新を行わない
    }
    if(isInBattle){
        //バトル中の処理
        player.setVelocity(0);//プレイヤーの速度を０に設定
        return;
    }
    // プレイヤーの移動処理
    player.setVelocity(0);
    let isMoving = false;
    if (cursors.left.isDown) {
        player.setVelocityX(-200); // 左
        isMoving = true;
    } else if (cursors.right.isDown) {
        player.setVelocityX(200); // 右
        isMoving = true;
    }

    if (cursors.up.isDown) {
        player.setVelocityY(-200); // 上
        isMoving = true;
    } else if (cursors.down.isDown) {
        player.setVelocityY(200); // 下
        isMoving = true;
    }

    //バトルシーンに移行するかチェック
    if(isMoving){
        //時間が経過しているかチェック
        const currentTime = this.time.now;
        if(currentTime - lastMoveTime > moveThreshold){
            lastMoveTime = currentTime;
            //2%の確率でバトルシーンに移る
            if(Math.random() < battleProbability){
                startBattle.call(this);//バトルシーンを開始する関数を呼び出す
            }
        }
    }

    // マップの境界を設定
    const mapWidth = map.widthInPixels;
    const mapHeight = map.heightInPixels;

    // プレイヤーの位置を確認してマップの境界内に制限
    if (player.x < 0) {
        player.x = 0; // 左の境界
    } else if (player.x > mapWidth) {
        player.x = mapWidth; // 右の境界
    }

    if (player.y < 0) {
        player.y = 0; // 上の境界
    } else if (player.y > mapHeight) {
        player.y = mapHeight; // 下の境界
    }
}

//バトル開始
function startBattle(){
    console.log('バトルシーンへ移動');
    const cameraCenterX = this.cameras.main.scrollX + this.cameras.main.width / 2;
    const cameraCenterY = this.cameras.main.scrollY + this.cameras.main.height / 2;
    isInBattle = true;//バトル中のフラグを立てる

    //プレイヤーの速度をリセット
    player.setVelocity(0);//バトル開始時にプレイヤーの移動を停止

    //バトル背景を設定
    if(battleBackground){
        battleBackground.destroy();//既存の背景を破棄
    }
    battleBackground = this.add.image(this.cameras.main.scrollX,this.cameras.main.scrollY,'battleback').setOrigin(0,0);
    battleBackground.setDisplaySize(config.width,config.height);//背景を画面のサイズに合わせる
    battleBackground.setDepth(6);

    //敵生成
    if(enemy){
        enemy.destroy();
    }
    enemy = this.physics.add.image(cameraCenterX,cameraCenterY, 'enemy');//中央に敵を配置
    enemy.setDepth(7);//敵のZインデックス

    //エンターキーでバトルを終了するイベントを設定
    this.input.keyboard.once('keydown-ENTER',()=>{
        endBattle.call(this);//バトル終了プログラムを呼び出す
    });
}
//バトル終了
function endBattle(){
    console.log('バトルが終了しました');
    isInBattle = false;//バトル中のフラグを解除

    //プレイヤーの速度をバトル前に戻す
    player.setVelocity(playerSavedVelocity.x,playerSavedVelocity.y);

    battleBackground.destroy();//バトル背景を破棄
    enemy.destroy();//敵を破棄
}

// ポーズ画面の処理
function togglePause() {
    console.log('ポーズ切り替え'); // デバッグ用
    isPaused = !isPaused; // ポーズの切り替え
    menuContainer.setVisible(isPaused); // メニューの表示切替

    // ポーズ中は物理処理を停止する
    if (isPaused) {
        this.physics.world.pause();
    } else {
        this.physics.world.resume();
    }
}

function createMenuBar(scene) {
    // メニューのサイズをカメラのサイズに基づいて設定
    const menuWidth = config.width * 0.16;
    const menuHeight = config.height * 0.30;

    // メニュー背景を作成し、左に少しスペースを開ける
    const menuBackground = scene.add.rectangle(menuWidth * -0.5, 0, menuWidth, menuHeight, 0x93C572, 0.8);
    menuBackground.setStrokeStyle(4, 0xFFFDD0); // 緑枠

    const resumeText = scene.add.text(menuWidth/-2, -100, '再開', { fontSize: '32px', fill: '#fff' });
    const quitText = scene.add.text(menuWidth/-2, 0, '終了', { fontSize: '32px', fill: '#fff' });

    // クリックイベントを追加
    resumeText.setInteractive().on('pointerdown', () => togglePause.call(scene));
    quitText.setInteractive().on('pointerdown', () => {
        alert('ゲーム終了！'); // 仮の終了処理後で変えろ
    });

    //所持金欄
    const goldBarHeight = menuHeight * 0.3;
    const goldBar = scene.add.rectangle(
        menuWidth * -0.5,//メニューと同じ位置から始める
        menuHeight / 2 + goldBarHeight / 2+25,//メニューの真下に配置
        menuWidth,
        goldBarHeight,
        0x93C572,0.8//緑の背景
    );
    goldBar.setStrokeStyle(2,0xFFFDD0);//白い枠線

    //所持金テキスト
    const goldText = scene.add.text(
        goldBar.x - goldBar.displayWidth / 2,//中央寄せ
        goldBar.y - goldBar.displayHeight / 2,//中央寄せ
        '所持金\n99999T',//改行で「９９９９９９T」を表示
        {fontSize:'24px',fill:'#fff'}
    );

    // メニュー要素をコンテナにまとめる
    menuContainer = scene.add.container(0, -500, [menuBackground, resumeText, quitText,goldBar,goldText]);//ここでメニューの全体位置を指定しているらしい
    menuContainer.setVisible(false); // 初期状態は非表示
    menuContainer.setDepth(100);
}