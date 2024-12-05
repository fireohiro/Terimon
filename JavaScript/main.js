//呼び出すメソッドが存在するクラスを宣言する？
//import {メソッド名（複数ある場合は,~とする)}from 'クラス名';
import {mappreload,createMap} from './map.js';
import {createPause,updatepause} from './pause.js';
import {playerpreload,playerupdate} from './player.js';
import {battlepreload,battleupdate} from './battle.js';
import {statuspreload,statusUpdate} from './status.js';
import {saveUpdate} from './save.js';
import{logoutupdate} from './logout.js';
import { shopPreload, createShop,shopUpdate } from './shop.js';
import {soundpreload, soundcreate} from './sound.js';

//Phaserの設定
const config = {
    type:Phaser.AUTO,//自動的に適切なレンダラー？を選択
    width:window.innerWidth,//ゲームの横幅
    height:window.innerHeight,//ゲームの縦幅
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
    },
    antialias:false
};

//ゲームのインスタンスを作成
const game = new Phaser.Game(config);
//ポーズのbooleanをオブジェクトで管理することで、他プログラムで中身を同期できる
const gameStatus = {pauseflg:false,battleflg:false,temotisu:0,playerfight:true,itemflg:false,gearflg:false,statusflg:false,saveflg:false,logoutflg:false,encountflg:false,shopflg:false,scale:1,newfriend:0,fadeflg:false};
const playerStatus = {};//プレイヤーの各種情報を格納
const friend1Status ={};//手持ち１情報
const friend2Status ={};//手持ち２情報
const friend3Status ={};//手持ち３情報
let itemList= [];//所持品情報
let gearList= [];//所持装備
let createok = false;//create関数が完了したかの判断材料
let statuses= [];//手持ちモンスター３体分の情報を入れる箱
let friendList = [];//仲間モンスターの情報(連れていないモンスターの情報、牧場で使える)

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
    statuses = [];
    friendList = [];
    gameStatus.newfriend = 0;
    const response = await fetch('get_temoti.php');
    const friends = await response.json();
    if(friends !== null){
        if(friends.length === 1){
            statuses = [friend1Status];
        }else if(friends.length === 2){
            statuses = [friend1Status,friend2Status];
        }else if(friends.length === 3){
            statuses = [friend1Status,friend2Status,friend3Status];
        }
        if(friends.length !== 0){
            //最大三体のオブジェクトに割り当て
            friends.forEach((friend,index)=>{
                Object.assign(statuses[index],friend);
            });
        }
        //gameStatus.temotisuに取得したモンスターの数を格納
        gameStatus.temotisu = friends.length;
    }else{
        gameStatus.temotisu=0;
    }
    const listres = await fetch('get_friends.php');
    const lists = await listres.json();
    if(lists !== null){
        lists.forEach(friende=>{
            friendList.push(friende);
        });
        console.log(friendList);
    }
}

export async function fetchItems() {
    try {
        const response = await fetch('get_item.php');
        
        // レスポンスが成功かどうか確認
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }

        const text = await response.text();  // レスポンスをテキストとして取得

        const data = JSON.parse(text);  // JSONとしてパース
        if(data !== null){
            itemList = data.items;  // itemsをitemListに代入
        }
    } catch (error) {
        console.error('Error fetching items:', error);
    }
}

export async function fetchGear() {
    try {
        const response = await fetch('get_gear.php');
        if (!response.ok) {
            throw new Error('Network response was not ok: ' + response.statusText);
        }

        // レスポンスをテキストとしてログに出力してみる
        const text = await response.text();
        const data = JSON.parse(text);
        if(data !== null){
            gearList = data.gears;
        }
    } catch (error) {
        console.error('Error fetching gears:', error);
    }
}
   

//アセット（画像、音声など）の読み鋳込み
function preload(){
    mappreload(this.load);//map.jsのpreload処理を行う
    playerpreload(this.load);//player.jsのpreload処理を行う
    battlepreload(this.load);//battle.jsのpreload処理を行う
    statuspreload(this.load);//status.jsのpreload処理を行う
    shopPreload(this.load);
    soundpreload(this.load);
}

//ゲームの作成処理
async function create(){//asyncとは、非同期処理を使えるようにする
    //プレイヤーステータスを持ってくてuserに入れる
    const user = await userData();//awaitはこの処理が終わってから次の処理に行くこと
    Object.assign(playerStatus, user);//セッションデータをオブジェクトに保存
    soundcreate();
    await loadFriends();
    await fetchItems();
    await fetchGear();
    createMap(this,playerStatus,gameStatus,config);
    createPause(this,gameStatus,playerStatus,config,statuses,itemList,gearList);
    createShop(this, playerStatus, config, gameStatus);

    if(playerStatus.map_id === 3 || playerStatus.map_id === 6 || playerStatus.map_id === 7){
        gameStatus.encountflg = true;
    }else{
        gameStatus.encountflg = false;
    }
    createok = true;
    
}
//ゲームの更新処理
function update(){
    if(!createok || gameStatus.fadeflg){
        return;
    }
    if(gameStatus.battleflg){
        battleupdate(this,config,gameStatus,playerStatus,statuses);
        return;
    }
    if(gameStatus.pauseflg){
        updatepause(this,playerStatus);
        //アイテム位置調整
        //装備位置調整
        // //ステータス位置調整
        if(gameStatus.statusflg){
            statusUpdate(this);
        }
        //セーブ位置調整
        if(gameStatus.saveflg){
            saveUpdate(this);
        }
        //ログアウト位置調整
        if(gameStatus.logoutflg){
            logoutupdate(this);
        }
        return;
    }
    if(gameStatus.shopflg){
        shopUpdate(this);
    }
    //バトルでもポーズでもないときの処理↓
    playerupdate(this,config,gameStatus,playerStatus,statuses,itemList,friendList);
}

export function itemUse(item_id){
    itemList.forEach(item=>{
        if(item.item_id === item_id){
            item.su--;
        }
    });
}

export function itemGet(items,su){
    let newflg = true;
    itemList.forEach(item=>{
        if(item.item_id === items.item_id){
            item.su+=su;
            newflg =false;
        }
    });
    if(newflg){
        const newItem = {
            item_id:items.item_id,
            item_name:items.item_name,
            bunrui:items.bunrui,
            setumei:items.setumei,
            naiyou:items.naiyou,
            price:items.price,
            su:su
        };
        itemList.push(newItem);
    }
}

export function gearGet(get_gear){
    gearList.push(get_gear);
}

export async function save(){
    //fetch関数を使ってデータをsave_player.phpに送信
    const response = await fetch('save_player.php',{
        method:'POST',//HTTPのPOSTメソッドを使用
        headers:{
            'Content-Type':'application/json',//送信データがJSON形式であることを宣言
        },
        body:JSON.stringify(playerStatus),//saveDataオブジェクトをJSON形式の文字列に変換し、送信
    });
    if(!response.ok){
        throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const result = await response.json();
    //モンスターの更新
    if(gameStatus.temotisu !== 0){
        const payload = {statuses:statuses};
        const monsterres = await fetch('save_monster.php',{
            method:'POST',
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify(payload)
        });
        if(!monsterres.ok){
            throw new Error(`HTTP error! Status:${monsterres.status}`);
        }
        const monres = await monsterres.json();
        console.log('Monster data saved:',monres);
        loadFriends();
    }
    //連れていないモンスターの更新
    if(friendList.length > 0){
        const payload = {statuses:friendList};
        const friendres = await fetch('save_friends.php',{
            method:'POST',
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify(payload)
        });
        const frires = await friendres.json();
        console.log('Monster data saved:',frires);
    }
    //アイテムの更新
    if(itemList){
        const itemload =  {itemList:itemList};
        const itemres = await fetch('save_item.php',{
            method:'POST',
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify(itemload)
        });
        if(!itemres.ok){
            throw new Error(`HTTP error! Status:${itemres.status}`);
        }
        const iteres = await itemres.json();
        console.log('Item data saved:',iteres);
    }
    //装備品の更新
    if(gearList){
        const gearload =  {gearList:gearList};
        const gearres = await fetch('save_gear.php',{
            method:'POST',
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify(gearload)
        });
        if(!gearres.ok){
            throw new Error(`HTTP error! Status:${gearres.status}`);
        }
        const geares = await gearres.json();
        console.log('Item data saved:',geares);
    }
    alert('セーブが完了しました！');
}