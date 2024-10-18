//呼び出すメソッドが存在するクラスを宣言する？
//import {メソッド名（複数ある場合は,~とする)}from 'クラス名';
import {mappreload,createMap} from './map.js';
import {createPause} from './pause.js';
import {checkPosition} from '.player.js';
import {saveGame} from './save.js';

function userData(){
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
let pauseflg = false;

//アセット（画像、音声など）の読み鋳込み
function preload(){
    this.load.image('sky','assets/img/sky.png');//背景画像を読み込む
    mappreload(this.load);//map.jsのpreload処理を読み込む
}

//ゲームの作成処理
async function create(){
    //背景を表示
    this.add.image(400,300,'sky');

    const userData = await fetchUserData();
    //sessionのマップIDを定数に入れてそれを表示させる
    const map_id = userData.map_id;
    createMap.call(this,map_id);

    //pauseのcreate処理
    createPause.call(this,pauseflg);
}
//ゲームの更新処理
function update(){
    saaveGame();
}