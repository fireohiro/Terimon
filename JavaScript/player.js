import {battleStart} from './battle.js';
import {checkAndCreateMap} from './map.js';
import { shopEvent,createShop } from './shop.js';

const battlerate = 2;
let player;
let isMoving = false;//動いているのかの確認
let map;
let cursors;
let lastDirection = 'down';
let step = 0;
const StepToEncounter = 80;//バトル発生するまでの必要歩数

let direction = "down"; // プレイヤーの向きを保持
let interactionRange = 32; // 調べられる距離

export function playerpreload(loader){
    loader.spritesheet('playerImage','assets/character/terimon1.png', { frameWidth: 32, frameHeight: 32 });
}

export function playercreate(scene,playerStatus,gameStatus,layer){
    //プレイヤーをセーブ地に出現させる
    player = scene.physics.add.sprite(playerStatus.savepoint_x.scale,playerStatus.savepoint_y,'playerimage');
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

export function playerupdate(scene,config,gameStatus,playerStatus,friends,itemList){
    isMoving = false;//最初は動いていないことにする
    if (cursors.up.isDown) {
        isMoving = true;
        player.setVelocityY(-playerStatus.speed*10);
        player.anims.play('playerup', true);
        direction="up";
    } else if (cursors.down.isDown) {
        isMoving = true;
        player.setVelocityY(playerStatus.speed*10);
        player.anims.play('playerdown', true);
        direction="down";
    }else{
        player.setVelocityY(0);
    }
    if (cursors.left.isDown) {
        isMoving = true;
        player.setVelocityX(-playerStatus.speed*10);
        player.anims.play('playerleft', true);
        direction="left";
    } else if (cursors.right.isDown) {
        isMoving = true;
        player.setVelocityX(playerStatus.speed*10);
        player.anims.play('playerright', true);
        direction="right";
    }else{
        player.setVelocityX(0);
    }

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
                    //バトル発生、configの後の引数はそのバトル相手が雑魚なのか中ボスなのかボスなのかを判定（１＝雑魚、２＝中ボス、３＝ボス）カスタムも可
                    battleStart(scene,config,1,gameStatus,friends,playerStatus,itemList);
                }
            }
        }else{
            step = 0;
        }
    }
     // マップ切り替えのトリガーをチェック
    //  const transition = checkTransition(player);
    //  if (transition) {
    //      changeMap(scene,playerStatus,gameStatus,transition);
    //  }

    //それぞれのマップごとにマップが切り替わるポイントを指定
    // house
    if(playerStatus.map_id === 1){
        if((177*gameStatus.scale <= player.x && player.x <= (177+57)*gameStatus.scale ) 
            && ( 497*gameStatus.scale <= player.y && player.y <= (497+28)*gameStatus.scale)){
            playerStatus.map_id = 2;//map_idと書いているが、どのidがどのマップを表しているかは未定
            //再びcreate処理を行わせるための処理(必要ないかもなので、実行できるようになった際に試す)
            checkAndCreateMap(scene,playerStatus,gameStatus);
            player.setPosition(915*gameStatus.scale, 285*gameStatus.scale);
        }
    // home
    }else if(playerStatus.map_id === 2){
        if((894*gameStatus.scale <= player.x && player.x <= (894+34)*gameStatus.scale ) 
            && ( 194*gameStatus.scale <= player.y && player.y <= (194+65)*gameStatus.scale)){
            playerStatus.map_id = 1;//map_idと書いているが、どのidがどのマップを表しているかは未定
            //再びcreate処理を行わせるための処理(必要ないかもなので、実行できるようになった際に試す)
            checkAndCreateMap(scene,playerStatus,gameStatus);
            player.setPosition(205*gameStatus.scale, 490*gameStatus.scale);
        }
        if((0*gameStatus.scale <= player.x && player.x <= (0+17)*gameStatus.scale ) 
            && ( 507*gameStatus.scale <= player.y && player.y <= (507+255)*gameStatus.scale)){
            playerStatus.map_id = 3;//map_idと書いているが、どのidがどのマップを表しているかは未定
            //再びcreate処理を行わせるための処理(必要ないかもなので、実行できるようになった際に試す)
            checkAndCreateMap(scene,playerStatus,gameStatus);
            player.setPosition(758*gameStatus.scale, 210*gameStatus.scale);
        }
    // grass
    }else if(playerStatus.map_id === 3){
        if((781*gameStatus.scale <= player.x && player.x <= (781+17)*gameStatus.scale ) 
            && ( 94*gameStatus.scale <= player.y && player.y <= (94+256)*gameStatus.scale)){
            playerStatus.map_id = 2;//map_idと書いているが、どのidがどのマップを表しているかは未定
            //再びcreate処理を行わせるための処理(必要ないかもなので、実行できるようになった際に試す)
            checkAndCreateMap(scene,playerStatus,gameStatus);
            player.setPosition(20*gameStatus.scale, 635*gameStatus.scale);
        }
        if((0*gameStatus.scale <= player.x && player.x <= (0+17)*gameStatus.scale ) 
            && ( 545*gameStatus.scale <= player.y && player.y <= (545+157)*gameStatus.scale)){
            playerStatus.map_id = 6;//map_idと書いているが、どのidがどのマップを表しているかは未定
            //再びcreate処理を行わせるための処理(必要ないかもなので、実行できるようになった際に試す)
            checkAndCreateMap(scene,playerStatus,gameStatus);
            player.setPosition(937*gameStatus.scale, 496*gameStatus.scale);
        }
    // town
    }else if(playerStatus.map_id === 4){
        if((1260*gameStatus.scale <= player.x && player.x <= (1260+17)*gameStatus.scale ) 
            && ( 540*gameStatus.scale <= player.y && player.y <= (540+292)*gameStatus.scale)){
            playerStatus.map_id = 6;//map_idと書いているが、どのidがどのマップを表しているかは未定
            //再びcreate処理を行わせるための処理(必要ないかもなので、実行できるようになった際に試す)
            checkAndCreateMap(scene,playerStatus,gameStatus);
            player.setPosition(20*gameStatus.scale, 480*gameStatus.scale);
        }
        if((623*gameStatus.scale <= player.x && player.x <= (623+34)*gameStatus.scale )
             && ( 586*gameStatus.scale <= player.y && player.y <= (586+54)*gameStatus.scale)){
            if (!gameStatus.shopflg) { // ショップが開いていない場合のみ処理
                createShop(scene, playerStatus, config, gameStatus);
                shopEvent(gameStatus);
            }else{
                player.setPosition(player.x,player.y+32);
            }
        }
    // gacha
    }else if(playerStatus.map_id === 5){
        if((0*gameStatus.scale <= player.x && player.x <= (0+800)*gameStatus.scale ) 
            && ( 780*gameStatus.scale <= player.y && player.y <= (780+17)*gameStatus.scale)){
            playerStatus.map_id = 6;//map_idと書いているが、どのidがどのマップを表しているかは未定
            //再びcreate処理を行わせるための処理(必要ないかもなので、実行できるようになった際に試す)
            checkAndCreateMap(scene,playerStatus,gameStatus);
            player.setPosition(461*gameStatus.scale, 20*gameStatus.scale);
        }
    // entry
    }else if(playerStatus.map_id === 6){
        // 右
        if((941*gameStatus.scale <= player.x && player.x <= (941+17)*gameStatus.scale ) 
            && ( 351*gameStatus.scale <= player.y && player.y <= (351+289)*gameStatus.scale)){
            playerStatus.map_id = 3;//map_idと書いているが、どのidがどのマップを表しているかは未定
            //再びcreate処理を行わせるための処理(必要ないかもなので、実行できるようになった際に試す)
            checkAndCreateMap(scene,playerStatus,gameStatus);
            player.setPosition(20*gameStatus.scale, 623*gameStatus.scale);
        }
        // 上
        if((317*gameStatus.scale <= player.x && player.x <= (317+289)*gameStatus.scale ) 
            && ( 0*gameStatus.scale <= player.y && player.y <= (0+17)*gameStatus.scale)){
            playerStatus.map_id = 5;//map_idと書いているが、どのidがどのマップを表しているかは未定
            //再びcreate処理を行わせるための処理(必要ないかもなので、実行できるようになった際に試す)
            checkAndCreateMap(scene,playerStatus,gameStatus);
            player.setPosition(775*gameStatus.scale, 400*gameStatus.scale);
        }
        // 左
        if((0*gameStatus.scale <= player.x && player.x <= (0+17)*gameStatus.scale ) 
            && ( 319*gameStatus.scale <= player.y && player.y <= (319+320)*gameStatus.scale)){
            playerStatus.map_id = 4;//map_idと書いているが、どのidがどのマップを表しているかは未定
            //再びcreate処理を行わせるための処理(必要ないかもなので、実行できるようになった際に試す)
            checkAndCreateMap(scene,playerStatus,gameStatus);
            player.setPosition(1250*gameStatus.scale, 642*gameStatus.scale);
        }
        // 下
        if((288*gameStatus.scale <= player.x && player.x <= (288+320)*gameStatus.scale ) 
            && ( 941*gameStatus.scale <= player.y && player.y <= (941+17)*gameStatus.scale)){
            playerStatus.map_id = 8;//map_idと書いているが、どのidがどのマップを表しているかは未定
            //再びcreate処理を行わせるための処理(必要ないかもなので、実行できるようになった際に試す)
            checkAndCreateMap(scene,playerStatus,gameStatus);
            player.setPosition(174*gameStatus.scale, 52*gameStatus.scale);
        }
        // 階段
        if((192*gameStatus.scale <= player.x && player.x <= (192+32)*gameStatus.scale ) 
            && ( 157*gameStatus.scale <= player.y && player.y <= (157+32)*gameStatus.scale)){
            playerStatus.map_id = 7;//map_idと書いているが、どのidがどのマップを表しているかは未定
            //再びcreate処理を行わせるための処理(必要ないかもなので、実行できるようになった際に試す)
            checkAndCreateMap(scene,playerStatus,gameStatus);
            player.setPosition(638*gameStatus.scale, 920*gameStatus.scale);
        }
    // dungeon
    }else if(playerStatus.map_id === 7){
        if((601*gameStatus.scale <= player.x && player.x <= (601+74)*gameStatus.scale ) 
            && ( 925*gameStatus.scale <= player.y && player.y <= (925+32)*gameStatus.scale)){
            playerStatus.map_id = 6;//map_idと書いているが、どのidがどのマップを表しているかは未定
            //再びcreate処理を行わせるための処理(必要ないかもなので、実行できるようになった際に試す)
            checkAndCreateMap(scene,playerStatus,gameStatus);
            player.setPosition(208*gameStatus.scale, 200*gameStatus.scale);
        }
    // ranch
    }else if(playerStatus.map_id === 8){
        if((0*gameStatus.scale <= player.x && player.x <= (0+800)*gameStatus.scale ) 
            && ( 0*gameStatus.scale <= player.y && player.y <= (0+17)*gameStatus.scale)){
            playerStatus.map_id = 6;//map_idと書いているが、どのidがどのマップを表しているかは未定
            //再びcreate処理を行わせるための処理(必要ないかもなので、実行できるようになった際に試す)
            checkAndCreateMap(scene,playerStatus,gameStatus);
            player.setPosition(448*gameStatus.scale, 935*gameStatus.scale);
        }
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
        triggerEvent(event, this.player);
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

  // 指定範囲内のイベントを検索
  function findEventAt(area) {
    return this.events.find(event =>
      area.x >= event.x && area.x <= event.x + event.width &&
      area.y >= event.y && area.y <= event.y + event.height
    );
  }

  loadEventsFromLayer(objectLayer) {
    this.events = objectLayer.objects.map(obj => ({
      x: obj.x,
      y: obj.y,
      width: obj.width,
      height: obj.height,
      type: obj.properties.find(prop => prop.name === "type")?.value,
      data: obj.properties.find(prop => prop.name === "text")?.value
    }));
  }
