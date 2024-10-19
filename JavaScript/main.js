//呼び出すメソッドが存在するクラスを宣言する？
//import {メソッド名（複数ある場合は,~とする)}from 'クラス名';
import {mappreload,createMap} from './map.js';
import {createPause} from './pause.js';
import {checkPosition} from './player.js';
import {saveGame} from './save.js';
import {battlepreload,battlecreate,battleupdate} from './battle.js';

function userData(){
    //何やってるかわからんけどphpを実行してセッションデータをとってきてる
    return fetch('session_get.php')
        .then(response => response.json())
        .catch(error =>{
            console.error('Error fetching session data:',error);
            return null;
        });
}

//Phaserの設定
const config = {
    type:Phaser.AUTO,//自動的に適切なレンダラー？を選択
    width:800,//ゲームの横幅
    height:600,//ゲームの縦幅
    scene:{//ゲームのシーン
        preload:preload,//プリロード関数
        create:create,//作成関数
        update:update//更新関数    
    }
};

//ゲームのインスタンスを作成
const game = new Phaser.Game(config);
//ポーズのbooleanをオブジェクトで管理することで、他プログラムで中身を同期できる
const gameStatus = {pauseflg:false,battleflg:false};
const playerStatus = {};

//アセット（画像、音声など）の読み鋳込み
function preload(){
    this.load.image('sky','assets/img/sky.png');//背景画像を読み込む
    mappreload(this.load);//map.jsのpreload処理を読み込む
    battlepreload(this.load);//battle.jsのpreload処理を読み込む
}

//ゲームの作成処理
async function create(){//asyncとは、非同期処理を使えるようにする
    //背景を表示
    this.add.image(400,300,'sky');

    const userData = await userData();//awaitはこの処理が終わってから次の処理に行くこと
    //sessionのマップIDを定数に入れてそれを表示させる
    const map_id = userData.map_id;
    createMap.call(this,map_id);

    //pauseのcreate処理
    createPause.call(this,gameStatus);
    //battleのcreate処理
    battlecreate.call(this,gameStatus);
}
//ゲームの更新処理
function update(){
    if(gamestatus.battleflg){
        //バトル中はバトル処理だけをして、その他を実行しない
        battleupdate.call(this,gameStatus);
        return;
    }
    if(gameStatus.pauseflg){
        //ポーズ中はupdate内の処理をすべて行わない
        return;
    }    
    //ここにプレイヤーの移動、エンカウント、バトルの発生処理を行っているメソッドを呼び出す
    
}