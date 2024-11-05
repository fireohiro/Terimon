import {battleStart} from './battle.js';
import {checkAndCreateMap} from './map.js';

const battlerate = 2;
let player;
let isMoving = false;//動いているのかの確認
let map;
let cursors;

export function playerpreload(loader){
    loader.image('playerimage','assets/character/terimon1.png');
}

export function playercreate(scene,playerStatus){
    //プレイヤーをセーブ地に出現させる
    player = scene.add.sprite(playerStatus.savepoint_x,playerStatus.savepoint_y,'playerimage');
    //カメラ調整,必要に応じて調整
    scene.cameras.main.startFollow(player);//プレイヤー追従

    if(playerStatus.map_id === 1){
        scene.cameras.main.setZoom(1.5);//カメラを通常の1.5倍近づける
    }else if(playerStatus.map_id === 2){
        //必要に応じて変える
        scene.cameras.main.setZoom(1.0);
    }

    //ここに大きさ調整だったりプレイヤーがいる層の設定をする

    //カーソルキーの設定をPhaserを使ってやりやすくする
    cursors = scene.input.keyboard.createCursorKeys();

    // プレイヤーのアニメーション
    scene.anims.create({
        key: 'playerdown',
        frames: scene.anims.generateFrameNumbers('player', { start: 0, end: 2 }),
        frameRate: 10,
        repeat: -1
    });
    scene.anims.create({
        key: 'playerleft',
        frames: scene.anims.generateFrameNumbers('player', { start: 3, end: 5 }),
        frameRate: 10,
        repeat: -1
    });
    scene.anims.create({
        key: 'playerright',
        frames: scene.anims.generateFrameNumbers('player', { start: 6, end: 8 }),
        frameRate: 10,
        repeat: -1
    });
    scene.anims.create({
        key: 'playerup',
        frames: scene.anims.generateFrameNumbers('player', { start: 9, end: 11 }),
        frameRate: 10,
        repeat: -1
    });
}

export function playerupdate(scene,config,gameStatus,playerStatus,friend1Status,friend2Status,friend3Status){
    isMoving = false;//最初は動いていないことにする
    console.log(cursors);
    if(cursors.up.isDown){
        //上入力処理
        isMoving=true;
        playerStatus.savepoint_y -= Math.ceil(playerStatus.speed / 10);
        player.anims.play('playerup', true);
    }else if(cursors.down.isDown){
        //下入力処理
        isMoving=true;
        playerStatus.savepoint_y += Math.ceil(playerStatus.speed / 10);
        player.anims.play('playerdown', true);
    }//左右処理を別のif分で書くことで斜め移動を可能にしている

    if(cursors.left.isDown){
        //左入力処理
        isMoving=true;
        playerStatus.savepoint_x += Math.ceil(playerStatus.speed / 10);
        player.anims.play('playerleft', true);
    }else if(cursors.right.isDown){
        //右入力処理
        isMoving=true;
        player.setVelocityX(160);
        player.anims.play('playerright', true);
    }
    //移動していたらエンカウント処理を行う（最速1フレームに１回）
    if(isMoving){
        //エンカウント処理
        let encountnum = Math.floor(Math.random() * 100) + 1;
        if(encountnum <= battlerate){//2%の確率でバトル発生
            //バトル発生、configの後の引数はそのバトル相手が雑魚なのか中ボスなのかボスなのかを判定（１＝雑魚、２＝中ボス、３＝ボス）カスタムも可
            battleStart(scene,config,1,gameStatus,friend1Status,friend2Status,friend3Status);
        }
    }
    
    //map情報をもとにプレイヤーがマップの外に行かないように調整する
    const mapWidth = map.widthInPixels;
    const mapHeight = map.heightInPixels;
    if(playerStatus.savepoint_x < 0){
        playerStatus.savepoint_x = 0;
    }else if(playerStatus.savepoint_x > mapWidth){
        playerStatus.savepoint_x = mapWidth;
    }
    if(playerStatus.savepoint_y < 0){
        playerStatus.savepoint_y = 0;
    }else if(playerStatus.savepoint_y > mapHeight){
        playerStatus.savepoint_y = mapHeight;
    }

    //それぞれのマップごとにマップが切り替わるポイントを指定
    if(playerStatus.map_id === 1){
        if((200 <= playerStatus.savepoint_x && playerStatus.savepoint_x <= 230 ) && ( 500 <= playerStatus.savepoint_y && playerStatus.savepoint_y <= 530)){
            playerStatus.map_id = 2;//map_idと書いているが、どのidがどのマップを表しているかは未定
            //再びcreate処理を行わせるための処理(必要ないかもなので、実行できるようになった際に試す)
            checkAndCreateMap(playerStatus);
            player.setPosition(915, 285);
        }else if(playerStatus.savepoint_x >= mapWidth - 32 && playerStatus.savepoint_y <= 64 && playerStatus.savepoint_y >= 0){//処理内容を簡単に書くと、今いるポイントがX座標が端or端に近い場所であるかつY座標が一定の高さ以上一定の高さ未満であるときにマップの変更を行いますというもの
            playerStatus.map_id = 3;
        }
    }else if(playerStatus.map_id === 2){
        if(playerStatus.savepoint_x <= 10 && playerStatus.savepoint_y <= 500 && playerStatus.savepoint_y >= 450){
            playerStatus.map_id = 4;
        }
    }
}

export function dataMap(mapdata){
    map = mapdata;
}