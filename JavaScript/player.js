import {battleStart} from './battle.js';
import {findEventAt,triggerEvent,checkTransition,changeMap} from './map.js';
import { shopEvent,createShop } from './shop.js';

const battlerate = 2;
let player;
let isMoving = false;//動いているのかの確認
let map;
let cursors;
let step = 0;
const StepToEncounter = 80;//バトル発生するまでの必要歩数

let direction = "down"; // プレイヤーの向きを保持
let interactionRange = 32; // 調べられる距離

let graphics; // 範囲描画用のGraphicsオブジェクト

export function playerpreload(loader){
    loader.spritesheet('playerImage','assets/character/terimon1.png', { frameWidth: 32, frameHeight: 32 });
}

export function playercreate(scene,playerStatus,gameStatus,layer){
    graphics = scene.add.graphics(); // 範囲描画用のGraphicsオブジェクト
    //プレイヤーをセーブ地に出現させる
    player = scene.physics.add.sprite(playerStatus.savepoint_x,playerStatus.savepoint_y,'playerimage');
    player.setScale(gameStatus.scale);
    scene.physics.add.existing(player);
    player.setCollideWorldBounds(true);

    //タイルプロパティがcollidesで値がtrueになっているものを障害物として、playerが接触できないようにする
    for(let i = 0; i < layer.length; i++){
        scene.physics.add.collider(player,layer[i]);
    }
    //カメラ調整,必要に応じて調整
    scene.cameras.main.startFollow(player);//プレイヤー追従

    cursors = scene.input.keyboard.createCursorKeys();

    // キーボード入力を設定
    scene.input.keyboard.on("keydown-E", () => {
        checkForInteraction();
        drawInteractionArea();
    });

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
        player.setDepth(3);
    }else if(playerStatus.map_id === 7){
        player.setDepth(2);
    }else if(playerStatus.map_id === 8){
        player.setDepth(3);
    }
}

export function dataMap(mapdata,scene,playerStatus,gameStatus,layer){
    map = mapdata;
    //playerにデータが入っていた場合、それを消す
    if(player){
        player.destroy();
    }
    playercreate(scene,playerStatus,gameStatus,layer);
}

export function playerupdate(scene,config,gameStatus,playerStatus,friends,itemList,friendList){
    isMoving = false;//最初は動いていないことにする
    if (cursors.up.isDown) {
        isMoving = true;
        player.setVelocityX(0);
        player.setVelocityY(-playerStatus.speed*10);
        player.anims.play('playerup', true);
        direction="up";
    } else if (cursors.down.isDown) {
        isMoving = true;
        player.setVelocityX(0);
        player.setVelocityY(playerStatus.speed*10);
        player.anims.play('playerdown', true);
        direction="down";
    }else if (cursors.left.isDown) {
        isMoving = true;
        player.setVelocityY(0);
        player.setVelocityX(-playerStatus.speed*10);
        player.anims.play('playerleft', true);
        direction="left";
    } else if (cursors.right.isDown) {
        isMoving = true;
        player.setVelocityY(0);
        player.setVelocityX(playerStatus.speed*10);
        player.anims.play('playerright', true);
        direction="right";
    }else{
        player.setVelocityX(0);
        player.setVelocityY(0);
    }

    //プレイヤーの現在地をリアルタイムに入れる
    playerStatus.savepoint_x = player.x;
    playerStatus.savepoint_y = player.y;
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
                    playerstop();
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
                    //バトル発生、configの後の引数はそのバトル相手が雑魚なのか中ボスなのかボスなのかを判定（１＝雑魚、２＝中ボス、３＝ボス）カスタムも可
                    battleStart(scene,config,1,gameStatus,friends,playerStatus,itemList,friendList);
                }
            }
        }else{
            step = 0;
        }
    }
    //  マップ切り替えのトリガーをチェック
     const transition = checkTransition(player);
     if (transition) {
        changeMap(scene,playerStatus,gameStatus,transition);
        player.setPosition(transition.targetX*gameStatus.scale, transition.targetY*gameStatus.scale);
     }
}
export function playerstop(){
    player.setVelocityX(0);
    player.setVelocityY(0);
}

function checkForInteraction(){
    const interactionArea = getInteractionArea();
    // イベントの範囲チェック
    const event = findEventAt(interactionArea);
    if (event) {
        triggerEvent(event, player);
    } else {
        console.log("何も見つかりませんでした");
    }
}

// 調査可能なエリアを計算
function getInteractionArea() {
    const { x, y } = player;
    switch (direction) {
      case "up":
        return { x, y: y - interactionRange, width: 32, height: 32 };
      case "down":
        return { x, y: y + interactionRange, width: 32, height: 32 };
      case "left":
        return { x: x - interactionRange, y, width: 32, height: 32 };
      case "right":
        return { x: x + interactionRange, y, width: 32, height: 32 };
      default:
        return { x, y, width: 32, height: 32 };
    }
  }

  //////////// デバッグ用
  function drawInteractionArea() {
    // 古い描画をクリア
    graphics.clear();
    // 範囲を取得
    const area = getInteractionArea();
    // 半透明の四角形を描画
    graphics.fillStyle(0x00ff00, 0.3); // 緑色、30%透明
    graphics.fillRect(area.x - area.width / 2, area.y - area.height / 2, area.width, area.height);
  }

  
