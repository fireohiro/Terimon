//呼び出すメソッドが存在するクラスを宣言する？
//import {メソッド名（複数ある場合は,~とする)}from 'クラス名';
import {mappreload,createMap} from './map.js';
import {createPause,updatepause} from './pause.js';
import {playerpreload,playercreate,playerupdate} from './player.js';
import {battlepreload,battleupdate} from './battle.js';
// import {statuspreload} from './status.js';

//Phaserの設定
const config = {
    type:Phaser.AUTO,//自動的に適切なレンダラー？を選択
    width:1500,//ゲームの横幅
    height:750,//ゲームの縦幅
    physics:{
        default:'arcade',
        arcade:{
            gravity:{y:0},//重力０
            debug:true//デバッグ情報を表示するか
        }
    },
    scene:{//ゲームのシーン
        preload:preload,//プリロード関数
        create:create,//作成関数
        update:update//更新関数    
    }
};

//ゲームのインスタンスを作成
const game = new Phaser.Game(config);
//ポーズのbooleanをオブジェクトで管理することで、他プログラムで中身を同期できる
const gameStatus = {pauseflg:false,battleflg:false,temotisu:0,playerfight:true,itemflg:false,gearflg:false,statusflg:false,saveflg:false,logoutflg:false};
const playerStatus = {};
const friend1Status ={};
const friend2Status ={};
const friend3Status ={};
let createok = false;

function userData() {
    return fetch('get_playersession.php')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        });
}

//手持ちモンスターの情報格納
export async function loadFriends(){
    const response = await fetch('get_temoti.php');
    const friends = await response.json();
    //最大三体のオブジェクトに割り当て
    const statuses = [friend1Status,friend2Status,friend3Status];
    friends.slice(0,3).forEach((friend,index)=>{
        Object.assign(statuses[index],friend);
    });
    //gameStatus.temotisuに取得したモンスターの数を格納
    gameStatus.temotisu = friends.length;
}

//アセット（画像、音声など）の読み鋳込み
function preload(){
    mappreload(this.load);//map.jsのpreload処理を行う
    playerpreload(this.load);//player.jsのpreload処理を行う
    battlepreload(this.load);//battle.jsのpreload処理を行う
    // statuspreload(this.load);
    //status.jsのpreload処理を行う
}

//ゲームの作成処理
async function create(){//asyncとは、非同期処理を使えるようにする
    //プレイヤーステータスを持ってくてuserに入れる
    const user = await userData();//awaitはこの処理が終わってから次の処理に行くこと
    Object.assign(playerStatus, user);//セッションデータをオブジェクトに保存
    await loadFriends();
    createMap(this,playerStatus);

    //プレイヤーを最後にいた地に表示
    playercreate(this,playerStatus);

    //pauseのcreate処理
    createPause(this,gameStatus,playerStatus,config,friend1Status,friend2Status,friend3Status);

    createok = true;
}
//ゲームの更新処理
function update(){
    if(!createok){
        return;
    }
    if(gameStatus.battleflg){
        //バトル中はバトル処理だけをして、その他を実行しない
        battleupdate(this,gameStatus,playerStatus,friend1Status,friend2Status,friend3Status,config);
        return;
    }
    if(gameStatus.pauseflg){
        updatepause(this,config);
        return;
    }
    //バトルでもポーズでもないときの処理↓
    playerupdate(this,config,playerStatus,friend1Status,friend2Status,friend3Status);
}