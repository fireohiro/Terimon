import {battleStart} from './battle.js';
import {checkAndCreateMap,checkTransition,changeMap} from './map.js';

const battlerate = 2;
let player;
let isMoving = false;//動いているのかの確認
let map;
let cursors;
let lastDirection = 'down';
let step = 0;
const StepToEncounter = 80;//バトル発生するまでの必要歩数

export function playerpreload(loader){
    loader.spritesheet('playerImage','assets/character/terimon1.png', { frameWidth: 32, frameHeight: 32 });
}

export function playercreate(scene,playerStatus,gameStatus){
    //プレイヤーをセーブ地に出現させる
    player = scene.add.sprite(playerStatus.savepoint_x,playerStatus.savepoint_y,'playerimage');
    player.setScale(gameStatus.scale);
    //カメラ調整,必要に応じて調整
    scene.cameras.main.startFollow(player);//プレイヤー追従

    cursors = scene.input.keyboard.createCursorKeys();

    //ここに大きさ調整だったりプレイヤーがいる層の設定をする

    // プレイヤーのアニメーション
    scene.anims.create({
        key: 'playerdown',
        frames: scene.anims.generateFrameNumbers('playerImage', { start: 0, end: 2 }),
        frameRate: 10,
        repeat: -1
    });
    scene.anims.create({
        key: 'playerleft',
        frames: scene.anims.generateFrameNumbers('playerImage', { start: 3, end: 5 }),
        frameRate: 10,
        repeat: -1
    });
    scene.anims.create({
        key: 'playerright',
        frames: scene.anims.generateFrameNumbers('playerImage', { start: 6, end: 8 }),
        frameRate: 10,
        repeat: -1
    });
    scene.anims.create({
        key: 'playerup',
        frames: scene.anims.generateFrameNumbers('playerImage', { start: 9, end: 11 }),
        frameRate: 10,
        repeat: -1
    });
    //プレイヤーの表示レイヤーの設定
    if(playerStatus.map_id === 1){
        player.setDepth(2);
    }else if(playerStatus.map_id === 2){
        player.setDepth(1);
    }else if(playerStatus.map_id === 3){
        player.setDepth(1);
    }else if(playerStatus.map_id === 4){
        player.setDepth(2);
    }else if(playerStatus.map_id === 5){
        player.setDepth(1);
    }else if(playerStatus.map_id === 6){
        player.setDepth(1);
    }else if(playerStatus.map_id === 7){
        player.setDepth(3);
    }
}

export function dataMap(mapdata,scene,playerStatus,gameStatus){
    map = mapdata;
    //playerにデータが入っていた場合、それを消す
    if(player){
        player.destroy();
    }
    playercreate(scene,playerStatus,gameStatus);
}

export function playerupdate(scene,config,gameStatus,playerStatus,friend1Status,friend2Status,friend3Status){
    isMoving = false;//最初は動いていないことにする
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
    }
    //左右処理を別のif分で書くことで斜め移動を可能にしている

    if(cursors.left.isDown){
        //左入力処理
        isMoving=true;
        playerStatus.savepoint_x -= Math.ceil(playerStatus.speed / 10);
        player.anims.play('playerleft', true);
    }else if(cursors.right.isDown){
        //右入力処理
        isMoving=true;
        playerStatus.savepoint_x += Math.ceil(playerStatus.speed / 10);
        player.anims.play('playerright', true);
    }
    // 更新された座標を player スプライトに適用
    player.setPosition(playerStatus.savepoint_x, playerStatus.savepoint_y);

    // 動いていない場合に待機アニメーションを再生
    if (!isMoving) {
        player.anims.stop();  // 現在のアニメーションを停止

        // キャラクターが最後に向いていた方向に応じた待機フレームを設定
        switch (player.anims.getName()) {
            case 'playerup':
                player.setTexture('playerImage', 9); 
                break;
            case 'playerdown':
                player.setTexture('playerImage', 0); 
                break;
            case 'playerleft':
                player.setTexture('playerImage', 3); 
                break;
            case 'playerright':
                player.setTexture('playerImage', 6); 
                break;
            default:
                player.setTexture('playerImage', 0); 
        }
    }
    //移動していたらエンカウント処理を行う
    if(gameStatus.encountflg){
        if(isMoving){
            step++;
            if(step >= StepToEncounter){
                //エンカウント処理
                let encountnum = Math.floor(Math.random() * 100) + 1;
                if(encountnum <= battlerate){//2%の確率でバトル発生
                    //バトル発生、configの後の引数はそのバトル相手が雑魚なのか中ボスなのかボスなのかを判定（１＝雑魚、２＝中ボス、３＝ボス）カスタムも可
                    battleStart(scene,config,1,gameStatus,friend1Status,friend2Status,friend3Status);
                }
            }
        }else{
            step = 0;
        }
    }
    
    
    //map情報をもとにプレイヤーがマップの外に行かないように調整する
    const mapWidth = map.widthInPixels*gameStatus.scale;
    const mapHeight = map.heightInPixels*gameStatus.scale;
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

     // マップ切り替えのトリガーをチェック
     const transition = checkTransition(player);
     if (transition) {
         changeMap(scene,playerStatus,gameStatus,transition);
     }

    //それぞれのマップごとにマップが切り替わるポイントを指定
    // if(playerStatus.map_id === 1){
    //     if((200*gameStatus.scale <= playerStatus.savepoint_x && playerStatus.savepoint_x <= 230*gameStatus.scale ) && ( 500*gameStatus.scale <= playerStatus.savepoint_y && playerStatus.savepoint_y <= 530*gameStatus.scale)){
    //         playerStatus.map_id = 2;//map_idと書いているが、どのidがどのマップを表しているかは未定
    //         //再びcreate処理を行わせるための処理(必要ないかもなので、実行できるようになった際に試す)
    //         checkAndCreateMap(scene,playerStatus,gameStatus);
    //         player.setPosition(915, 285);
    //     }else if(playerStatus.savepoint_x >= mapWidth - 32 && playerStatus.savepoint_y <= 64 && playerStatus.savepoint_y >= 0){//処理内容を簡単に書くと、今いるポイントがX座標が端or端に近い場所であるかつY座標が一定の高さ以上一定の高さ未満であるときにマップの変更を行いますというもの
    //         playerStatus.map_id = 3;
    //     }
    // }else if(playerStatus.map_id === 2){
    //     if(playerStatus.savepoint_x <= 10 && playerStatus.savepoint_y <= 500 && playerStatus.savepoint_y >= 450){
    //         playerStatus.map_id = 4;
    //     }
    // }
}