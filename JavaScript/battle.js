import {itemUse} from './main.js';
import { waitEffect,playEffect, playsound } from './sound.js';
//ここはインポートする際に１回だけ通るらしい
let friendImages = [];
let enemyImages = [];
let enemys = [];
let back;
let magicList = [];
let dieflg = false;
let enemies = [];
let speedcheck = [];
let changeflg = true;
let statusContainer;
let itemContainer;
let magicContainer;
let actionContainer;
let messageContainer;
let statusDisplay;
let koutai = false;
export function battlepreload(loader){
    //敵画像
    for(let i = 1; i <= 21;i++){
        loader.image(`monster${i}`,`assets/monster/monster${i}.png`);
    }
    //戦闘背景の読み込み
    loader.image('grass','assets/battleimg/grass.png');
    loader.image('road','assets/battleimg/road.png');
    loader.image('front','assets/battleimg/front.png');
    loader.image('dungeon','assets/battleimg/dungeon.png');
}

export async function battleupdate(scene,config,gameStatus,playerStatus,friends){
    if(statusContainer){
        statusContainer.destroy();
    }
    if(statusDisplay){
        statusDisplay.destroy();
    }
    const camera = scene.cameras.main;
    //味方ステータス表示
    const statusWidth = config.width * 0.9;
    const statusHeight = config.height * 0.3;

    // ステータスの初期配置（画面上部）
    let startX = config.width * 0.05; // 左端から少し内側
    const startY = config.height * 0.03; // 上端から少し内側

    // ステータスボックスを作成
    const statusBox = scene.add.rectangle(startX, startY, statusWidth, statusHeight, 0xFFFFFF);
    statusBox.setStrokeStyle(2, 0x000000);
    statusBox.setOrigin(0, 0);

    // ステータスコンテナを作成
    statusContainer = scene.add.container(0, 0, [statusBox]);

    let textX = startX - 150; // テキストの初期X位置（余白を設ける）
    const textY = startY; // テキストの初期Y位置（余白を設ける）

    // ステータス表示内容を動的に変更
    if (gameStatus.playerfight) {
        const statusText = `
            　　LV:${playerStatus.level}\n
            　${playerStatus.account_name}\n
            HP:${playerStatus.hp_nokori} ／ ${playerStatus.hp}\n
            MP:${playerStatus.mp_nokori} ／ ${playerStatus.mp}
        `;
        statusDisplay = scene.add.text(textX, textY, statusText, {
            fontSize: '28px',
            fill: '#000000',
            wordWrap: { width: statusWidth - 20 },
            padding:{top:10,bottom:10}
        });
        statusDisplay.setOrigin(0, 0);
        statusContainer.add(statusDisplay);
    } else {
        friends.forEach(friend => {
            const statusText = `
                　　Lv:${friend.level}\n
                　${friend.monster_name}\n
                HP:${friend.hp_nokori} ／ ${friend.hp}\n
                MP:${friend.mp_nokori} ／ ${friend.mp}
            `;
            statusDisplay = scene.add.text(textX, textY, statusText, {
                fontSize: '28px',
                fill: '#000000',
                wordWrap: { width: statusWidth - 20 },
                padding:{top:10,bottom:10}
            });
            statusDisplay.setOrigin(0, 0);
            statusContainer.add(statusDisplay);
            textX += statusWidth / gameStatus.temotisu;
        });
    }

    // 深度を設定して背景より上に表示
    statusContainer.setDepth(12);

    // カメラの動きに追従する処理
    scene.events.on('postupdate', () => {
        // カメラのスクロールに合わせてステータスコンテナを移動
        statusContainer.setPosition(camera.scrollX, camera.scrollY);
    });
}

//バトルスタート
export async function battleStart(scene,config,bunrui,gameStatus,friends,playerStatus,itemList,friendList){
    gameStatus.fadeflg = true;
    await waitEffect(scene,'encount1');
    playEffect(scene,'encount2');
    await fadeOut(scene,100);
    if (bunrui === 1){
        if(playerStatus.map_id === 3){
            playsound(scene,'battle');
        }else if(playerStatus.map_id === 6){
            playsound(scene,'battle2');
        }else if(playerStatus.map_id === 7){
            playsound(scene,'battle3');
        }else{
            playsound(scene,'battle4');
        }
    }else if(bunrui === 2){
        condition = 'boss1';
    }else if(bunrui === 3){
        condition = 'boss2';
    }
    friends.forEach(friend=>{
        if(friend.hp_nokori > 0){
            gameStatus.playerfight = false;
        }
    });
    enemys = [];
    enemyImages = [];
    const enemy1 = {};
    const enemy2 = {};
    const enemy3 = {};
    const camera = scene.cameras.main;
    let res;
    let key;
    if(bunrui === 1 && playerStatus.map_id === 3){
        res = await fetch('get_zako1.php');
        enemies = await res.json();
        key = 'grass';
    }else if(bunrui === 1 && playerStatus.map_id === 6){
        res = await fetch('get_zako2.php');
        enemies = await res.json();
        key = 'road';
    }else if(bunrui === 1 && playerStatus.map_id === 7){
        res = await fetch('get_zako3.php');
        enemies = await res.json();
        key = 'front';
    }else if(bunrui === 1 && playerStatus.map_id === 8){
        res = await fetch('get_zako4.php');
        enemies = await res.json();
        key = 'dungeon';
    }else if(bunrui === 2){
        res = await fetch('tyuboss.php');
        enemies = await res.json();
        key = 'dungeon';
    }else if(bunrui === 3){
        res = await fetch('boss.php');
        enemies = await res.json();
        key = 'dungeon';
    }
    Object.assign(enemy1,enemies[0]);
    Object.assign(enemy2,enemies[1]);
    Object.assign(enemy3,enemies[2]);


    back = scene.add.image(scene.cameras.main.worldView.x,scene.cameras.main.worldView.y,key);//左上端っこに背景画像表示※後でカメラの座標をオブジェクトに入れてそれを持ってくる
    back.setOrigin(0,0);
    back.setDisplaySize(config.width,config.height);//画像のサイズを画面のサイズに合わせる
    back.setDepth(10);
    fadeIn(scene,500);
    gameStatus.fadeflg = false;
    gameStatus.battleflg = true;

    //モンスターを中央に並べて表示
    enemys = [enemy1,enemy2,enemy3];
    const x = (camera.worldView.width - camera.worldView.x ) / 11;
    const y = (camera.worldView.height - camera.worldView.y) / 2 + camera.worldView.y - 20;
    let s = 3;
    enemys.forEach(enemy=>{
        const monsterImage = scene.add.image(x * s +camera.worldView.x,y,`monster${enemy.id}`);//モンスター画像
        monsterImage.setDisplaySize(225,225);
        monsterImage.setDepth(11);//背景の上に
        enemyImages.push(monsterImage);
        s+=3;
    });

    // カメラの動きに合わせて更新する
    scene.events.on('postupdate', () => {
        const camera = scene.cameras.main;
        let s = 3;
        enemys.forEach((enemy, index) => {
            const monsterImage = enemyImages[index];
            if (monsterImage) {
                monsterImage.setPosition(camera.scrollX + (camera.width / 11) * s, camera.scrollY + camera.height / 2 - 20);
                s += 3;
            }
        });
    });

    //敵の名前と～が現れた！を表示
    const message = `${enemy1.name}と${enemy2.name}と${enemy3.name}が現れた！`;
    await displaymessage(scene,config,message);

    //ターン継続処理
    let i = 1;
    while(gameStatus.battleflg){
        await battleturn(scene,config,gameStatus,playerStatus,friends,itemList,friendList);
        i++;
    }
}

async function battleturn(scene,config,gameStatus,playerStatus,friends,itemList,friendList){
    const camera = scene.cameras.main;
    dieflg = false;
    koutai = false;
    magicList = [];
    //プレイヤー以外が戦っているときに、全モンスターが倒れたら、強制的にプレイヤーが戦うように前線に出す
    //ターン計算
    speedcheck = [];
    if(gameStatus.playerfight){
        //playerfightがtrueであればプレイヤーと敵のスピードを比較
        speedcheck.push(playerStatus);
        enemys.forEach(enemy=>{
            if(enemy.hp_nokori > 0){
                speedcheck.push(enemy);
            }
        });
    }else{
        //playerfightがfalseであれば味方と敵のスピードを比較（temotiの数だけ味方を追加
        friends.forEach(friend=>{
            if(friend.hp_nokori > 0){
                speedcheck.push(friend);
            }
        });
        enemys.forEach(enemy=>{
            if(enemy.hp_nokori > 0){
                speedcheck.push(enemy);
            }
        });
    }
    //スピード順にソート
    speedcheck.sort((a,b) => b.speed - a.speed);
    //combatants配列から行動を選択
    for(const combatant of speedcheck){
        if(combatant.hp_nokori >= 1){
            if(combatant.type === 'enemy'){
                //敵であればenemyaction関数を呼び出す
                await enemyaction(combatant,gameStatus);//完成
            }else{
                //味方の場合はselectact関数を呼び出す
                //味方オブジェクトにはtypeデータがないのでundefindで味方はこっちに入る
                await displayAction(combatant);
            }
            if(!gameStatus.battleflg || koutai){
                break;
            }
        }
    }
    async function enemyaction(combatant){
        const result = Math.floor(Math.random() * 2) + 1;
        if(result === 1){
            playEffect(scene,'attack');
            await displaymessage(scene,config,`敵の${combatant.name}の攻撃！`);
            if(gameStatus.playerfight){
                let rannum = Math.floor(Math.random() * 100) + 1;
                let damage = Math.ceil(combatant.pow / 1.5 - (playerStatus.def / 2));
                if(damage <= 0){
                    damage = 1;
                }
                if(rannum <= playerStatus.luck){
                    damage *= 2;
                }
                playerStatus.hp_nokori -= damage;
                if(playerStatus.hp_nokori <= 0){
                    playerStatus.hp_nokori = 0;
                }
                await displaymessage(scene,config,`${playerStatus.account_name}本体に${damage}のダメージ！！`);
            }else{
                for (let i = 0; i < friends.length; i++) {
                    let rannum = Math.floor(Math.random() * 100) + 1;
                    const friend = friends[i];
                    if(friend.hp_nokori >= 1){
                        let damage;
                        if(combatant.luck >= rannum){
                            playEffect(scene,'critical');
                            damage = Math.ceil(combatant.pow / 1.5 * 2);
                            await displaymessage(scene,config,`味方の${friend.monster_name}は鳩尾に痛恨の一撃を食らった！ダメージ２倍`);
                        }else{
                            damage = Math.ceil(combatant.pow / 1.5 - (friend.def / 2));
                        }
                        if(damage <= 0){
                            damage = 1;
                        }
                        friend.hp_nokori -= damage;
                        if (friend.hp_nokori <= 0) {
                            friend.hp_nokori = 0;
                        }
                        await displaymessage(scene, config, `味方の${friend.monster_name}に${damage}ダメージ！`);
                        
                        if (friend.hp_nokori <= 0) {
                            await displaymessage(scene, config, `味方の${friend.monster_name}は倒れた！`);
                            changeflg = true;
                            friends.forEach(friend=>{
                                if(friend.hp_nokori !== 0){
                                    changeflg = false;
                                }
                            });
                            if(changeflg){
                                gameStatus.playerfight = true;
                                koutai = true;
                            }else{
                                gameStatus.playerfight = false;
                            }
                        }
                    }
                }
            }
        }else{
            magicList = [];
            magicContainer = scene.add.container();
            const wazaIds = [
                combatant.waza_id1,
                combatant.waza_id2,
                combatant.waza_id3,
                combatant.waza_id4
            ];
            const response = await fetch('get_waza.php',{
                method:'POST',
                headers:{'Content-Type':'application/json'},
                body:JSON.stringify({wazaIds})
            });
            if(!response.ok){
                throw new Error('HTTP error! Status: ' + response.status);
            }
            const data = await response.json();
            magicList = data.magic;
            const magicnumber = Math.floor(Math.random() * 4);
            let waza_bunrui = magicList[magicnumber].bunrui;
            if(combatant.mp_nokori >= magicList[magicnumber].syouhi_mp){
                combatant.mp_nokori -= magicList[magicnumber].syouhi_mp;
                let hit = Math.floor(Math.random() * 100) + 1;
                if(hit <= magicList[magicnumber].hit_rate){
                    playEffect(scene,'magic');
                    if(waza_bunrui !== 'HP回復' && waza_bunrui !== 'MP回復' && waza_bunrui !== '即死'){
                        await displaymessage(scene,config,`敵の${combatant.name}は攻撃魔法を使った！`);
                        let damage = 0;
                        if(gameStatus.playerfight){
                            damage = Math.ceil(combatant.pow * (1+magicList[magicnumber].might / 10) - (playerStatus.def * 2));
                            if(damage <= 0){
                                damage = 1;
                            }
                            playerStatus.hp_nokori -= damage;
                            if(playerStatus.hp_nokori <= 0){
                                playerStatus.hp_nokori = 0;
                            }
                            await displaymessage(scene,config,`${playerStatus.account_name}の小指に${damage}ダメージ！`);
                        }else{
                            for(const friend of friends){
                                if(friend.hp_nokori >= 1){
                                    damage = Math.ceil(combatant.pow * (1 + magicList[magicnumber].might / 50) - (friend.def * 0.5));
                                    if(friend.resist === waza_bunrui){
                                        await displaymessage(scene,config,`味方の${friend.monster_name}の耐性がダメージを激減させた！`);
                                        damage = Math.ceil(damage / 3);
                                    }
                                    if(damage <= 0){
                                        damage = 1;
                                    }
                                    friend.hp_nokori -= damage;
                                    if(friend.hp_nokori <= 0){
                                        friend.hp_nokori = 0;
                                    }
                                    await displaymessage(scene,config,`味方の${friend.monster_name}に${damage}ダメージ！`);
                                    if (friend.hp_nokori <= 0) {
                                        await displaymessage(scene, config, `味方の${friend.monster_name}は倒れた！`);
                                        changeflg = true;
                                        friends.forEach(friend=>{
                                            if(friend.hp_nokori !== 0){
                                                changeflg = false;
                                            }
                                        });
                                        if(changeflg){
                                            gameStatus.playerfight = true;
                                            koutai = true;
                                        }else{
                                            gameStatus.playerfight = false;
                                        }
                                    }
                                }
                            }
                        }
                    }else if(waza_bunrui === 'HP回復'){
                        await displaymessage(scene,config,`敵の${combatant.name}は回復魔法を使った！`)
                        combatant.hp_nokori += Math.floor(combatant.hp * 0.1);
                        if(combatant.hp_nokori > combatant.hp){
                            combatant.hp_nokori = combatant.hp;
                        }
                        await displaymessage(scene,config,`敵の${combatnat.name}のHPが10%回復した！`);
                    }else{
                        await displaymessage(scene,config,`敵は${playerStatus.account_name}を舐めているようだ・・・`);
                        await displaymessage(scene,config,'相手は手招きをしている(。-`ω-)');
                    }
                }else{
                    playEffect(scene,'miss');
                    await displaymessage(scene,config,'しかしまほうは失敗した');
                }
            }else{
                playEffect(scene,'miss');
                await displaymessage(scene,config,`敵の${combatant.name}はまほうを使おうとしたが、MPが足りなかったようだ！`);
            }
        }
        if(enemys[0].hp_nokori > 0 && playerStatus.hp_nokori === 0 || enemys[2].hp_nokori > 0 && playerStatus.hp_nokori === 0 || enemys[2].hp_nokori > 0 && playerStatus.hp_nokori === 0){
            await battleEnd(scene,config,gameStatus,false,playerStatus,friends);
            for(let i = 0;i < 3; i++){
                enemyImages[i].setVisible(false);
            }
        }
    }

    async function displayAction(combatant){
        if(actionContainer){
            actionContainer.destroy();
        }
        // モンスターが戦う場合、手持ちモンスターを右下に表示する処理
        if(!gameStatus.playerfight){
            if(friendImages){
                friendImages = [];
            }
            let startX = (camera.worldView.width - camera.worldView.x) / 12;
            let startY = camera.worldView.y + camera.worldView.height / 10 * 8 + camera.worldView.y;
            let i = 9;
            for(const friend of friends){
                if(friend.hp_nokori > 0){
                    if(combatant.friend_id === friend.friend_id){
                        gameStatus.playerfight = false;
                        const friendImage = scene.add.image(startX * i + camera.worldView.x,startY-100,`monster${friend.monster_id}`);
                        friendImage.setDisplaySize(125,125);
                        friendImage.setDepth(11);
                        friendImages.push(friendImage);
                    }else{
                        gameStatus.playerfight = false;
                        const friendImage = scene.add.image(startX * i + camera.worldView.x,startY,`monster${friend.monster_id}`);
                        friendImage.setDisplaySize(125,125);
                        friendImage.setDepth(11);
                        friendImages.push(friendImage);
                    }
                    i++;
                }
            }
            // カメラの動きに合わせて更新する処理
            scene.events.on('postupdate', () => {
                let i = 0; // 配置用のカウント
                for (const friendImage of friendImages) {
                    if (friendImage) {
                        const yOffset = (combatant.friend_id === friends[i].friend_id) ? -100 : 0; // 戦闘中キャラを少し上に
                        friendImage.setPosition(
                            camera.scrollX + camera.width - 150 - 150 * i, // 右端から配置
                            camera.scrollY + camera.height - 150 + yOffset // 下端から配置
                        );
                        i++;
                    }
                }
            });
        }
        const actWidth = config.width * 0.25;
        const actHeight = config.height * 0.2;

        // 初期位置計算（カメラ位置を基準に設定）
        let actX = camera.scrollX + camera.width / 7;
        let actY = camera.scrollY + (camera.height / 5) * 4;

        // アクションコンテナ作成
        actionContainer = scene.add.container();

        // アクションボックスとテキストの作成
        const actBox = scene.add.rectangle(actX, actY, actWidth, actHeight, 0xFFFFFF);
        actBox.setStrokeStyle(2, 0x000000);

        const attacktext = scene.add.text(actX - 125, actY - 50, 'こうげき', { fontSize: '24px', fill: '#000000',padding:{top:10,bottom:10}});
        const itemtext = scene.add.text(actX + 20, actY - 50, 'アイテム', { fontSize: '24px', fill: '#000000',padding:{top:10,bottom:10}});
        const magictext = scene.add.text(actX - 125, actY + 20, 'まほう', { fontSize: '24px', fill: '#000000',padding:{top:10,bottom:10}});

        if (gameStatus.playerfight) {
            const backtext = scene.add.text(actX + 20, actY + 20, 'やっぱ引く', { fontSize: '24px', fill: '#000000',padding:{top:10,bottom:10}});
            actionContainer.add([actBox, attacktext, itemtext, magictext, backtext]);
            actionContainer.setDepth(12);

            // カメラが動いたときにアクションメニューを更新
            scene.events.on('postupdate', () => {
                actX = camera.scrollX + camera.width / 7;
                actY = camera.scrollY + (camera.height / 5) * 4;

                actBox.setPosition(actX, actY);
                attacktext.setPosition(actX - 125, actY - 50);
                itemtext.setPosition(actX + 20, actY - 50);
                magictext.setPosition(actX - 125, actY + 20);
                backtext.setPosition(actX + 20, actY + 20);
            });

            // オプションの選択を待つ
            await waitselect(attacktext, itemtext, magictext, backtext, combatant);
        } else {
            const fronttext = scene.add.text(actX + 20, actY + 20, '俺が出る', { fontSize: '24px', fill: '#000000',padding:{top:10,bottom:10}});
            actionContainer.add([actBox, attacktext, itemtext, magictext, fronttext]);
            actionContainer.setDepth(12);

            // カメラが動いたときにアクションメニューを更新
            scene.events.on('postupdate', () => {
                actX = camera.scrollX + camera.width / 7;
                actY = camera.scrollY + (camera.height / 5) * 4;

                actBox.setPosition(actX, actY);
                attacktext.setPosition(actX - 125, actY - 50);
                itemtext.setPosition(actX + 20, actY - 50);
                magictext.setPosition(actX - 125, actY + 20);
                fronttext.setPosition(actX + 20, actY + 20);
            });

            // オプションの選択を待つ
            await waitselect(attacktext, itemtext, magictext, fronttext, combatant);
        }
    }
    function waitselect(attacktext,itemtext,magictext,backtext,combatant){
        return new Promise(resolve=>{
            attacktext.setInteractive().on('pointerdown',async()=>{
                actionContainer.destroy();
                await handleActionSelection('こうげき',combatant);
                resolve();
            });
            itemtext.setInteractive().on('pointerdown',async()=>{
                actionContainer.destroy();
                await handleActionSelection('アイテム',combatant);
                resolve();
            });
            magictext.setInteractive().on('pointerdown',async()=>{
                actionContainer.destroy();
                await handleActionSelection('まほう',combatant);
                resolve();
            });
            backtext.setInteractive().on('pointerdown',async()=>{
                actionContainer.destroy();
                if(gameStatus.playerfight){
                    await handleActionSelection('やっぱ引く',combatant);
                }else{
                    await handleActionSelection('俺が出る',combatant);
                }
                resolve();
            });
        });
    }
    
    async function handleActionSelection(action,combatant){
        //行動選択用の枠とテキストを削除
        actionContainer.destroy();
        friendImages.forEach(friendimg=>{
            friendimg.destroy();
        });
        switch(action){
            case "こうげき":
                //それぞれの敵に対してダメージ計算とHP減少を行う。会心も作成済み
                playEffect(scene,'attack');
                if(gameStatus.playerfight){
                    await displaymessage(scene,config,`味方の${combatant.account_name}の攻撃！`);
                }else{
                    await displaymessage(scene,config,`味方の${combatant.monster_name}の攻撃！`);
                }
                let i = 0;
                for(const enemy of enemys){
                    let damage;
                    if(enemy.hp_nokori > 0){
                        const randnum = Math.floor(Math.random() * 100) + 1;
                        if(combatant.luck >= randnum){
                            damage = Math.ceil(combatant.pow / 1.5) * 2;
                            playEffect(scene,'critical');
                            await displaymessage(scene,config,'会心の一撃！');
                        }else{
                            damage = Math.ceil(combatant.pow / 1.5 - (enemy.def / 2));
                        }
                        if(damage <= 0){
                            damage = 1;
                        }
                        await attack(enemy,damage,i);
                        i++;
                    }
                }
                break;
            case "まほう":
                if(gameStatus.playerfight){
                    playEffect(scene,'miss');
                    await displaymessage(scene,config,`${playerStatus.account_name}は人間なので、まほうはつかえない！`);
                }else{
                    magicList = [];
                    magicContainer = scene.add.container();
                    const wazaIds = [
                        combatant.waza_id1,
                        combatant.waza_id2,
                        combatant.waza_id3,
                        combatant.waza_id4
                    ];
                    const response = await fetch('get_waza.php',{
                        method:'POST',
                        headers:{'Content-Type':'application/json'},
                        body:JSON.stringify({wazaIds})
                    });

                    if(!response.ok){
                        throw new Error('HTTP error! Status: ' + response.status);
                    }

                    const data = await response.json();
                    magicList = data.magic;
                    //枠作成
                    const frameWidth = config.width * 0.7;
                    const frameHeight = config.height * 0.3;

                    // 初期の固定位置（画面左下）
                    const offsetX = config.width * 0.05; // 左端からの余白
                    const offsetY = config.height * 0.05; // 下端からの余白

                    // フレーム（枠）を作成
                    const frame = scene.add.rectangle(offsetX, config.height - frameHeight - offsetY, frameWidth, frameHeight, 0xffffff);
                    frame.setStrokeStyle(2, 0x000000);
                    frame.setOrigin(0, 0);

                    // コンテナにフレームを追加
                    magicContainer.add(frame);
                    magicContainer.setDepth(12);

                    // テキストをフレーム内に配置
                    let textY = config.height - frameHeight - offsetY + 20;
                    const wazatext1 = scene.add.text(offsetX + 10, textY, `${magicList[0].waza_name}　　　MP:${magicList[0].syouhi_mp}　　　分類：${magicList[0].naiyou}　　　威力：${magicList[0].might}　　　成功率：${magicList[0].hit_rate}`, { fontSize: '24px', fill: '#000000',padding:{top:10,bottom:10}});
                    const wazatext2 = scene.add.text(offsetX + 10, textY + 20, `${magicList[1].waza_name}　　　MP:${magicList[1].syouhi_mp}　　　分類：${magicList[1].naiyou}　　　威力：${magicList[1].might}　　　成功率：${magicList[1].hit_rate}`, { fontSize: '24px', fill: '#000000',padding:{top:10,bottom:10}});
                    const wazatext3 = scene.add.text(offsetX + 10, textY + 40, `${magicList[2].waza_name}　　　MP:${magicList[2].syouhi_mp}　　　分類：${magicList[2].naiyou}　　　威力：${magicList[2].might}　　　成功率：${magicList[2].hit_rate}`, { fontSize: '24px', fill: '#000000',padding:{top:10,bottom:10}});
                    const wazatext4 = scene.add.text(offsetX + 10, textY + 60, `${magicList[3].waza_name}　　　MP:${magicList[3].syouhi_mp}　　　分類：${magicList[3].naiyou}　　　威力：${magicList[3].might}　　　成功率：${magicList[3].hit_rate}`, { fontSize: '24px', fill: '#000000',padding:{top:10,bottom:10}});

                    // テキストをまとめてコンテナに追加
                    [wazatext1, wazatext2, wazatext3, wazatext4].forEach(text => {
                        text.setOrigin(0, 0);
                        text.setDepth(12);
                        magicContainer.add(text);
                    });

                    // カメラのスクロールに追従
                    scene.events.on('postupdate', () => {
                        const scrollX = camera.scrollX;
                        const scrollY = camera.scrollY;

                        // フレームとテキストの位置を更新
                        const frameNewX = scrollX + offsetX;
                        const frameNewY = scrollY + config.height - frameHeight - offsetY;
                        frame.setPosition(frameNewX, frameNewY);

                        let textNewY = frameNewY + 20;
                        wazatext1.setPosition(frameNewX + 10, textNewY);
                        wazatext2.setPosition(frameNewX + 10, textNewY + 50);
                        wazatext3.setPosition(frameNewX + 10, textNewY + 100);
                        wazatext4.setPosition(frameNewX + 10, textNewY + 150);
                    });

                    await magicselect(wazatext1,wazatext2,wazatext3,wazatext4,combatant);
                }
                break;
                case "アイテム":
                    if(itemList){
                        console.log(itemList);
                        //回復アイテムを持っているのかの確認
                        let itemflg = false;
                        let itemnum = new Array(4);
                        let i = 0;
                        itemList.forEach(item =>{
                            if(item.item_id === 2 && item.su >= 1){
                                itemnum[0] = i;
                                itemflg = true;
                            }else if(item.item_id === 3 && item.su >= 1){
                                itemnum[1] = i;
                                itemflg = true;
                            }else if(item.item_id === 6 && item.su >= 1){
                                itemnum[2] = i;
                                itemflg = true;
                            }else if(item.item_id === 8 && item.su >= 1){
                                itemnum[3] = i;
                                itemflg = true;
                            }
                            i++;
                        });
                        if(!itemflg){
                            playEffect(scene,'miss');
                            await displaymessage(scene,config,'回復アイテムを持っていなかった');
                        }else{
                            const camera = scene.cameras.main;
                            const frameWidth = config.width * 0.7;
                            const frameHeight = config.height * 0.3;
                            const framex = camera.scrollX + config.width / 5 * 4;
                            const framey = camera.scrollY + config.width / 5 * 4;

                            const itemback = scene.add.rectangle(framex,framey,frameWidth,frameHeight,0xffffff);
                            itemback.setStrokeStyle(2,0x000000);
                            itemback.setOrigin(0,0);
                            itemback.setDepth(11);

                            let i = 1;
                            let kusa;
                            let zyoukusa;
                            let sizuku;
                            let zyousizuku;
                            if(itemnum[0] || itemnum[0] === 0){
                                let item = itemList[itemnum[0]];
                                kusa = scene.add.text(10,frameHeight / 10 * 2 * i,
                                    `${item.item_name}　　　${item.setumei}　　所持数：${item.su}個`,
                                    {fontSize:'24px',fill:'0#000000',padding:{top:10,bottom:10}}
                                );
                                i++;
                            }
                            if(itemnum[1] || itemnum[1] === 0){
                                let item = itemList[itemnum[1]];
                                zyoukusa = scene.add.text(10,frameHeight / 10 * 2 * i,
                                    `${item.item_name}　　　${item.setumei}　　所持数：${item.su}個`,
                                    {fontSize:'24px',fill:'0x000000',padding:{top:10,bottom:10}}
                                );
                                i++
                            }
                            if(itemnum[2] || itemnum[2] === 0){
                                let item = itemList[itemnum[2]];
                                sizuku = scene.add.text(10,frameHeight / 10 * 2 * i,
                                    `${item.item_name}　　　${item.setumei}　　所持数：${item.su}個`,
                                    {fontSize:'24px',fill:'0x000000',padding:{top:10,bottom:10}}
                                );
                                i++;
                            }
                            if(itemnum[3] || itemnum[3] === 0){
                                let item = itemList[itemnum[3]];
                                zyousizuku = scene.add.text(10,frameHeight / 10 * 2 * i,
                                    `${item.item_name}　　　${item.setumei}　　所持数：${item.su}個`,
                                    {fontSize:'24px',fill:'0x000000',padding:{top:10,bottom:10}}
                                );
                            }
                            itemContainer = scene.add.container(0,0);
                            itemContainer.add(itemback);
                            if(kusa){
                                itemContainer.add(kusa);
                                kusa.setDepth(12);
                            }
                            if(zyoukusa){
                                itemContainer.add(zyoukusa);
                                zyoukusa.setDepth(12);
                            }
                            if(sizuku){
                                itemContainer.add(sizuku);
                                sizuku.setDepth(12);
                            }
                            if(zyousizuku){
                                itemContainer.add(zyousizuku);
                                zyousizuku.setDepth(12);
                            }
                            itemContainer.setDepth(12);

                            scene.events.on('postupdate',()=>{
                                const scrollX = camera.scrollX;
                                const scrollY = camera.scrollY;

                                const frameNewX = scrollX + config.width * 0.05;
                                const frameNewY = scrollY + config.height - frameHeight - config.height * 0.07;
                                itemback.setPosition(frameNewX,frameNewY);

                                let i = 0;
                                let textNewY = frameNewY + 10;
                                if(kusa){
                                    kusa.setPosition(frameNewX + 20,textNewY + 50 * i);
                                    i++;
                                }
                                if(zyoukusa){
                                    zyoukusa.setPosition(frameNewX + 20,textNewY + 50 * i);
                                    i++;
                                }
                                if(sizuku){
                                    sizuku.setPosition(frameNewX+20,textNewY + 50 * i);
                                    i++;
                                }
                                if(zyousizuku){
                                    zyousizuku.setPosition(frameNewX+20,textNewY + 50 * i);
                                }
                            });
                            await selectitem(kusa,zyoukusa,sizuku,zyousizuku,itemnum,combatant);
                        }
                    }else{
                        playEffect(scene,'miss');
                        await displaymessage(scene,config,`${playerStatus.account_name}は何もアイテムを持っていないようだ・・・`)
                    }
                    break;
            case "俺が出る":
                let syouhi = Math.floor(playerStatus.mp / 5);
                if(mp_nokori >= syouhi){
                    playerStatus.mp_nokori -= syouhi;
                    gameStatus.playerfight = true;
                    koutai = true;
                    await displaymessage(scene,config,`MPを${syouhi}消費して${playerStatus.account_name}が前に出た！`);
                }else{
                    await displaymessage(scene,config,`${playerStatus.account_name}のMPが足らず交代することができなかった`);
                }
                break;
            case "やっぱ引く":
                let cans = false;
                friends.forEach(friend=>{
                    if(friend.hp_nokori > 0){
                        cans = true;
                    }
                });
                if(!friends[0]){
                    playEffect(scene,'miss');
                    await displaymessage(scene,config,`しかし${playerStatus.account_name}に戦闘を任せられる仲間はいない！`);
                }else if(!cans){
                    playEffect(scene,'miss');
                    await displaymessage(scene,config,`${playerStatus.account_name}の味方は全員倒れていて交代することができない`);
                }else{
                    let syouhi = Math.floor(playerStatus.mp / 5);
                    if(mp_nokori >= syouhi){
                        playerStatus.mp_nokori -= syouhi;
                        gameStatus.playerfight = false;
                        koutai = true;
                        await displaymessage(scene,config,`${playerStatus.account_name}はやっぱり家に引きこもることを決めた！`);
                    }else{
                        await displaymessage(scene,config,`${playerStatus.account_name}のMPが足らず交代することができなかった`);
                    }
                }
                break;
        }
    }
    function selectitem(kusa,zyoukusa,sizuku,zyousizuku,itemnum,combatant){
        return new Promise(resolve=>{
            if(kusa){
                kusa.setInteractive().on('pointerdown',async()=>{
                    itemContainer.destroy();
                    await itemRole(itemList[itemnum[0]],combatant);
                    resolve();
                });
            }
            if(zyoukusa){
                zyoukusa.setInteractive().on('pointerdown',async()=>{
                    itemContainer.destroy();
                    await itemRole(itemList[itemnum[1]],combatant);
                    resolve();
                });
            }
            if(sizuku){
                sizuku.setInteractive().on('pointerdown',async()=>{
                    itemContainer.destroy();
                    await itemRole(itemList[itemnum[2]],combatant);
                    resolve();
                });
            }
            if(zyousizuku){
                zyousizuku.setInteractive().on('pointerdown',async()=>{
                    itemContainer.destroy();
                    await itemRole(itemList[itemnum[3]],combatant);
                    resolve();
                });
            }
        });
    }
    function magicselect(wazatext1,wazatext2,wazatext3,wazatext4,combatant){
        return new Promise(resolve=>{
            wazatext1.setInteractive().on('pointerdown',async()=>{
                magicContainer.destroy();
                await magicRole(magicList[0],combatant);
                resolve();
            });
            wazatext2.setInteractive().on('pointerdown',async()=>{
                magicContainer.destroy();
                await magicRole(magicList[1],combatant);
                resolve();
            });
            wazatext3.setInteractive().on('pointerdown',async()=>{
                magicContainer.destroy();
                await magicRole(magicList[2],combatant);
                resolve();
            });
            wazatext4.setInteractive().on('pointerdown',async()=>{
                magicContainer.destroy();
                await magicRole(magicList[3],combatant);
                resolve();
            });
        });
    }
    async function magicRole(magic,combatant){
        dieflg = false;
        let randnum;
        let randnum2;
        let i = 0;
        if(combatant.mp_nokori >= magic.syouhi_mp){
            combatant.mp_nokori -= magic.syouhi_mp;
            playEffect(scene,'magic');
            await displaymessage(scene,config,`味方の${combatant.monster_name}は${magic.waza_name}を使った！`);
            for (const enemy of enemys) {
                // 成功判定
                randnum = Math.floor(Math.random() * 100) + 1;
                if (randnum <= magic.hit_rate) {
                    // 即死
                    if (magic.naiyou === '即死') {
                        if(enemy.hp_nokori >= 1){
                            randnum2 = Math.floor(Math.random() * 100) + 1;
                            if (randnum2 >= enemy.luck) {
                                dieflg = true;
                                await attack(enemy,0,i);
                            } else {
                                await displaymessage(scene, config, 'しかしまほうが相手の運に負けてしまった！');
                            }
                        }
                    // HP回復
                    } else if (magic.naiyou === 'HP回復') {
                        let kouka = Math.floor((combatant.pow + combatant.def) / 3) * Math.floor(magic.syouhi_mp / 4);
                        for (const friend of friends) {
                            if (friend.hp_nokori > 0) {
                                friend.hp_nokori += kouka;
                                if (friend.hp < friend.hp_nokori) {
                                    friend.hp_nokori = friend.hp;
                                }
                            }
                        }
                        await displaymessage(scene, config, `味方のHPを${kouka}回復した`);
                        break;
                    // MP回復
                    } else if (magic.naiyou === 'MP回復') {
                        let kouka = Math.floor((combatant.speed + combatant.luck) / 4) * magic.syouhi_mp;
                        for (const friend of friends) {
                            if (friend.hp_nokori > 0) {
                                friend.mp_nokori += kouka;
                                if (friend.mp < friend.mp_nokori) {
                                    friend.mp_nokori = friend.mp;
                                }
                            }
                        }
                        await displaymessage(scene, config, `味方のMPを${kouka}回復した`);
                        break;
                    // 蘇生
                    } else if (magic.naiyou === '蘇生') {
                        for (const friend of friends) {
                            if (friend.hp_nokori === 0) {
                                let randnum2 = Math.floor(Math.random() * 100) + 1;
                                friend.hp_nokori = friend.hp / 2;
                                await displaymessage(scene, config, `${friend.monster_name}は${combatant.monster_name}のまほうによって復活した！`);
                            } else {
                                await displaymessage(scene, config, `${friend.monster_name}には効果がなかった・・・`);
                            }
                        }
                        break;
                    // 攻撃魔法
                    } else {
                        if (enemy.hp_nokori > 0) {
                            let damage = Math.ceil(combatant.pow * (1 + magic.might / 50) / 1.5);
                            let randnum2 = Math.floor(Math.random() * 100) + 1;
                            if (randnum2 <= combatant.luck) {
                                playEffect(scene,'critical');
                                damage = damage * 2;
                                await displaymessage(scene, config, '会心の一撃！');
                                if(magic.naiyou === 'MP吸収'){
                                    let drainmp =Math.ceil(damage * 0.1);
                                    if(drainmp < 1){
                                        drainmp = 1;
                                    }
                                    await displaymessage(scene,config,`味方の${combatant.monster_name}は敵からMPを${drainmp}吸収した`);
                                    combatant.mp_nokori += drainmp;
                                    if(combatant.mp_nokori > combatant.mp){
                                        combatant.mp_nokori = combatant.mp;
                                    }
                                }
                                await attack(enemy, damage, i);
                            } else if (magic.naiyou === enemy.resist) {
                                damage = Math.ceil(damage / 3);
                                await displaymessage(scene, config, `敵の${enemy.name}の耐性が${combatant.monster_name}の${magic.waza_name}のダメージを激減させた！`);
                                if(magic.naiyou === 'MP吸収'){
                                    let drainmp =Math.ceil(damage * 0.1);
                                    if(drainmp < 1){
                                        drainmp = 1;
                                    }
                                    await displaymessage(scene,config,`味方の${combatant.monster_name}は敵からMPを${drainmp}吸収した`);
                                    combatant.mp_nokori += drainmp;
                                    if(combatant.mp_nokori > combatant.mp){
                                        combatant.mp_nokori = combatant.mp;
                                    }
                                }
                                await attack(enemy, damage, i);
                            } else {
                                damage -= enemy.def / 2;
                                if(magic.naiyou === 'MP吸収'){
                                    let drainmp =Math.ceil(damage * 0.1);
                                    if(drainmp < 1){
                                        drainmp = 1;
                                    }
                                    await displaymessage(scene,config,`味方の${combatant.monster_name}は敵からMPを${drainmp}吸収した`);
                                    combatant.mp_nokori += drainmp;
                                    if(combatant.mp_nokori > combatant.mp){
                                        combatant.mp_nokori = combatant.mp;
                                    }
                                }
                                await attack(enemy, damage, i);
                            }
                        }
                    }
                } else {
                    if(enemy.hp_nokori >= 1){
                        playEffect(scene,'miss');
                        await displaymessage(scene, config, 'しかしまほうは失敗してしまった・・・');
                        break;
                    }
                }
                i++;
            }                
        }else{
            playEffect(scene,'miss');
            await displaymessage(scene,config,'しかしMPが足りない！');
        }
    }

    async function itemRole(item,combatant){
        itemContainer.destroy();
        let luckflg = false; 
        let rand1 = Math.floor(Math.random() * 100) + 1;
        await itemUse(item.item_id);
        if(gameStatus.playerfight){
            await displaymessage(scene,config,`${playerStatus.account_name}は${item.item_name}を使った！`);
        }else{
            await displaymessage(scene,config,`味方の${combatant.monster_name}は${item.item_name}を使った`);
        }
        if(rand1 <= combatant.luck){
            item.naiyou *= 2;
            await displaymessage(scene,config,`${item.item_name}の効果を高めた！`);
            luckflg = true;
        }
        if(item.bunrui === 'HP回復'){
            combatant.hp_nokori += item.naiyou;
            if(combatant.hp_nokori > combatant.hp){
                combatant.hp_nokori = combatant.hp;
            }
            if(gameStatus.playerfight){
                await displaymessage(scene,config,`${combatant.account_name}のHPを${item.naiyou}回復した`);
            }else{
                await displaymessage(scene,config,`${combatant.monster_name}のHPを${item.naiyou}回復した`);
            }
        }else if(item.bunrui === 'MP回復'){
            combatant.mp_nokori += item.naiyou;
            if(combatant.mp_nokori > combatant.mp){
                combatant.mp_nokori = combatant.mp;
            }
            if(gameStatus.playerfight){
                await displaymessage(scene,config,`${combatant.account_name}のMPを${item.naiyou}回復した`);
            }else{
                await displaymessage(scene,config,`${combatant.monster_name}のMPを${item.naiyou}回復した`);
            }
        }else if(item.bunrui === 'ちから'){
            combatant.pow += item.naiyou;
            if(gameStatus.playerfight){
                await displaymessage(scene,config,`${combatant.account_name}のちからが${item.naiyou}上昇した`);
            }else{
                await displaymessage(scene,config,`${combatant.monster_name}のちからが${item.naiyou}上昇した！`);
            }
            combatant.buff_time++;
        }else if(item.bunrui === 'まもり'){
            combatant.def += item.naiyou;
            if(gameStatus.playerfight){
                await displaymessage(scene,config,`${combatant.account_name}のまもりが${item.naiyou}上昇した`);
            }else{
                await displaymessage(scene,config,`${combatant.monster_name}のまもりが${item.naiyou}上昇した！`);
            }
            combatant.buff_time++;
        }else if(item.bunrui === 'スピード'){
            combatant.speed += item.naiyou;
            if(gameStatus.playerfight){
                await displaymessage(scene,config,`${combatant.account_name}のスピードが${item.naiyou}上昇した`);
            }else{
                await displaymessage(scene,config,`${combatant.monster_name}のスピードが${item.naiyou}上昇した！`);
            }
            combatant.buff_time++;
        }else if( item.bunrui === '蘇生'){
            for (const friend of friends) {
                if (friend.hp_nokori === 0) {
                    friend.hp_nokori = friend.hp;
                    await displaymessage(scene, config, `味方の${friend.monster_name}は息を吹き返した！`);
                } else {
                    await displaymessage(scene, config, `味方の${friend.monster_name}には効果がなかった・・・`);
                }
            }
        }
        if(luckflg){
            item.naiyou / 2;
        }
    }
    async function attack(enemy,damage,i){
        damage = Math.floor(damage/1);
        if(damage <= 0){
            damage = 1;
        }
        if(dieflg){
            await displaymessage(scene,config,`問答無用の一撃必殺まほうにより、敵の${enemy.name}は即死した`);
            enemy.hp_nokori = 0;
        }else{
            //ダメージ表示（ダメージエフェクトをつけたいのならここにつけましょ
            const damag = `敵の${enemy.name}に${damage}ダメージを与えた！`;
            await displaymessage(scene,config,damag);
            enemy.hp_nokori -= damage;
        }
        if(enemy.hp_nokori <= 0){
            enemy.hp_nokori = 0;
            //モンスター名＋を倒した！を下のメッセージボックス内で表示
            const message = `敵の${enemy.name}を倒した！`;
            await displaymessage(scene,config,message);

            //指定していたお金ドロップの量を手持ち金額に追加して表示する
            playerStatus.money += enemy.drop_money;
            playEffect(scene,'getmoney');
            const message2 = `${enemy.drop_money}チピチャパ（TP)を手に入れた！`;
            await displaymessage(scene,config,message2);
            //レベルアップ処理
            if(gameStatus.playerfight){
                playerStatus.experience += enemy.experience;
                if (playerStatus.level < 20 && playerStatus.level * 200 <= playerStatus.experience) {
                    playerStatus.level++;
                    playEffect(scene,'levelup');
                    playerStatus.experience = 0;
                
                    try {
                        // サーバーに送るデータのキーを修正
                        const response = await fetch('level_up.php', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({ job_id: playerStatus.job_id }), // 修正：fob_id -> job_id
                        });
                    
                        // HTTPレスポンスが正常かチェック
                        if (!response.ok) {
                            throw new Error(`HTTPエラー：${response.status}`);
                        }
                    
                        // 応答の生データをテキストで受け取り、ログ出力
                        const responseText = await response.text();
                    
                        // レスポンスがJSONであると仮定してパース
                        const data = JSON.parse(responseText); // 応答をJSONとしてパース
                    
                        // サーバーが返すデータにerrorが含まれている場合
                        if (data.error) {
                            console.error("Server Error:", data.error, "Details:", data);
                            return; // エラー発生時は処理を中止
                        }
                    
                        const statuses = data.levelUpData;
                    
                        // ステータスの更新
                        playerStatus.hp += statuses.up_hp;
                        playerStatus.hp_nokori += statuses.up_hp;
                        playerStatus.mp += statuses.up_mp;
                        playerStatus.mp_nokori += statuses.up_mp;
                        playerStatus.pow += statuses.up_pow;
                        playerStatus.def += statuses.up_def;
                        playerStatus.speed += statuses.up_speed;
                        playerStatus.luck += statuses.up_luck;
                    
                        // メッセージの表示
                        await displaymessage(scene, config, `${playerStatus.account_name}のレベルが${playerStatus.level}になった！`);
                        await displaymessage(scene, config, `HP:${statuses.up_hp} MP:${statuses.up_mp} ちから：${statuses.up_pow} まもり:${statuses.up_def} スピード:${statuses.up_speed} 運:${statuses.up_luck}上昇した`);
                    
                    } catch (error) {
                        // エラー内容を詳細に表示
                        console.error("レベルアップデータの取得中にエラーが発生しました:", error);
                    }
                }
            }else{
                for (const friend of friends) {
                    friend.experience += enemy.experience;
                    if (friend.level < 20 && friend.level * 200 <= friend.experience) {
                        playEffect(scene,'levelup');
                        friend.level++;
                        friend.experience = 0;
                        try {
                            // サーバーに送るデータのキーを修正
                            const response = await fetch('level_up.php', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify({ job_id: friend.job_id }), // 修正：fob_id -> job_id
                            });
                        
                            // HTTPレスポンスが正常かチェック
                            if (!response.ok) {
                                throw new Error(`HTTPエラー：${response.status}`);
                            }
                        
                            // 応答の生データをテキストで受け取り、ログ出力
                            const responseText = await response.text();
                        
                            // レスポンスがJSONであると仮定してパース
                            const data = JSON.parse(responseText); // 応答をJSONとしてパース
                        
                            // サーバーが返すデータにerrorが含まれている場合
                            if (data.error) {
                                console.error("Server Error:", data.error, "Details:", data);
                                return; // エラー発生時は処理を中止
                            }
                        
                            const statuses = data.levelUpData;
                        
                            // ステータスの更新
                            friend.hp += statuses.up_hp;
                            friend.hp_nokori += statuses.up_hp;
                            friend.mp += statuses.up_mp;
                            friend.mp_nokori += statuses.up_mp;
                            friend.pow += statuses.up_pow;
                            friend.def += statuses.up_def;
                            friend.speed += statuses.up_speed;
                            friend.luck += statuses.up_luck;
                        
                            // メッセージの表示
                            await displaymessage(scene, config, `${friend.monster_name}のレベルが${friend.level}になった！`);
                            await displaymessage(scene, config, `HP:${statuses.up_hp} MP:${statuses.up_mp} ちから：${statuses.up_pow} まもり:${statuses.up_def} スピード:${statuses.up_speed} 運:${statuses.up_luck}上昇した`);
                        
                        } catch (error) {
                            // エラー内容を詳細に表示
                            console.error("レベルアップデータの取得中にエラーが発生しました:", error);
                        }
                    }
                }
            }
            const nakama = Math.floor(Math.random() * 100) + 1;
            if(nakama <= 10){
                try {
                    await displaymessage(scene, config, `敵の${enemy.name}が仲間になりたそうにしている。`);
                    await displaymessage(scene, config, `${enemy.name}が仲間に加わった！`);
                    const randomNum = Math.floor(Math.random() * 7) + 1;
                    if (friends.length < 3) {
                        friends.push({friend_id:gameStatus.newfriend,monster_id:enemy.id,job_id:randomNum,level:enemy.level,experience:0,hp:enemy.hp,hp_nokori:enemy.hp,mp:enemy.mp,mp_nokori:enemy.mp,pow:enemy.pow,def:enemy.def,speed:enemy.speed,luck:enemy.luck,buff_time:0,waza_id1:enemy.waza_id1,waza_id2:enemy.waza_id2,waza_id3:enemy.waza_id3,waza_id4:enemy.waza_id4,monster_name:enemy.name})
                        await displaymessage(scene,config,`${enemy.name}が一緒に戦ってくれるようだ`);
                        gameStatus.temotisu++;
                        console.log(friends);
                    } else {
                        friendList.push({friend_id:gameStatus.newfriend,monster_id:enemy.id,job_id:randomNum,level:enemy.level,experience:0,hp:enemy.hp,hp_nokori:enemy.hp,mp:enemy.mp,mp_nokori:enemy.mp,pow:enemy.pow,def:enemy.def,speed:enemy.speed,luck:enemy.luck,buff_time:0,waza_id1:enemy.waza_id1,waza_id2:enemy.waza_id2,waza_id3:enemy.waza_id3,waza_id4:enemy.waza_id4,monster_name:enemy.name});
                        await displaymessage(scene, config, `${playerStatus.account_name}は手持ちがいっぱい！`);
                        await displaymessage(scene, config, `${playerStatus.account_name}は${enemy.name}を牧場に送った`);
                        console.log(friendList);
                    }
                    gameStatus.newfriend--;
                } catch (error) {
                    console.error('エラーが発生しました:', error);
                    await displaymessage(scene, config, 'エラーが発生しました。詳細はコンソールを確認してください。');
                }
            }
    
            //仲間になるならない関係なく、倒したモンスターの画像をゲーム画面から消す
            enemyImages[i].setVisible(false);
            if(enemys[0].hp_nokori <= 0 && enemys[1].hp_nokori <= 0 && enemys[2].hp_nokori <= 0 && playerStatus.hp_nokori >= 1){
                await battleEnd(scene,config,gameStatus,true,playerStatus,friends);
            }
        }
    }
}

//１文字ずつ表示するメッセージ用の枠作成と表示関数
async function displaymessage(scene, config, message) {
    if(messageContainer){
        messageContainer.destroy();
    }
    const messageWidth = config.width * 0.7;
    const messageHeight = config.height * 0.3;
    const camera = scene.cameras.main;
    let messageX = camera.centerX; //変更予定
    let messageY = camera.height - messageHeight + 50; //変更予定

    const messageBox = scene.add.rectangle(messageX, messageY, messageWidth, messageHeight, 0xFFFFFF);
    messageBox.setStrokeStyle(2, 0x000000);
    messageBox.setDepth(12);

    const messagetext = scene.add.text(
        messageX - messageWidth / 2 + 20,
        messageY - messageHeight / 2 + 30,
        '',
        { fontSize: '24px', fill: '#000000', wordWrap: { width: messageWidth - 40 } ,padding:{top:10,bottom:10}}
    );
    messagetext.setDepth(13);

    // カメラの位置変化に応じてメッセージボックスの位置を更新
    scene.events.on('postupdate', () => {
        messageX = camera.scrollX + camera.centerX;
        messageY = camera.scrollY + camera.height - messageHeight / 2 - 20;

        messageBox.setPosition(messageX, messageY);
        messagetext.setPosition(
            messageX - messageWidth / 2 + 20,
            messageY - messageHeight / 2 + 40
        );
    });

    let currentCharIndex = 0;

    async function displayNextChar() {
        return new Promise(resolve => {
            function next() {
                if (currentCharIndex < message.length) {
                    messagetext.text += message[currentCharIndex];
                    currentCharIndex++;
                    scene.time.delayedCall(50, next);
                    playEffect(scene,'coment');
                } else {
                    resolve();
                }
            }
            next();
        });
    }

    async function displayEndMarker() {
        const marker = scene.add.text(
            messageX + messageWidth / 2 - 30,
            messageY + messageHeight / 2 - 40,
            '▾',
            { fontSize: '24px', fill: '#000000',padding:{top:10,bottom:10}}
        );
        await waitForEnter(marker);
    }

    function waitForEnter(marker) {
        return new Promise(resolve => {
            scene.input.keyboard.once('keydown-ENTER', () => {
                marker.destroy();
                messagetext.destroy();
                messageBox.destroy(); //枠も消す
                resolve(); //ENTERが押されたことを通知
            });
        });
    }

    await displayNextChar(); // 文字表示を待つ
    await displayEndMarker(); // エンドマーカーの表示を待つ
}

async function fadeOut(scene,duration){
    return new Promise((resolve)=>{
        const camera = scene.cameras.main;
        camera.fadeOut(duration,0,0,0);//黒色のフェードアウト
        camera.once('camerafadeoutcomplete',()=>{
                resolve();//フェードインが完了したらPromiseを解決
        });
    });
}

function fadeIn(scene,duration){
    const camera = scene.cameras.main;
    camera.fadeIn(duration,0,0,0);
}

async function battleEnd(scene,config,gameStatus,winflg,playerStatus,friends){
    if(!winflg){
        const lostmoney = Math.floor(playerStatus.money * 0.3);
        const message = `${playerStatus.account_name}は負けてしまったストレスから、${lostmoney}チピチャパをぶちまけた！`;
        await displaymessage(scene,config,message);
        playerStatus.money = Math.floor(playerStatus.money * 0.7);
        playerStatus.hp_nokori = playerStatus.hp;
        playerStatus.mp_nokori = playerStatus.mp;
        friends.forEach(friend=>{
            friend.hp_nokori = friend.hp;
            friend.mp_nokori = friend.mp;
        });
    }else{
        playEffect(scene,'winner');
        for(let s = 0; s < 3; s++){
            if(enemyImages[s]){
                enemyImages[s].setVisible(false);
            }
        }
        const message = '勝った';
        await displaymessage(scene,config,message);
        friends.forEach(friend=>{
            if(friend.hp_nokori === 0){
                friend.hp_nokori = 1;
            }
        });
    }
    gameStatus.battleflg = false;
    if(back){
        back.destroy();
    }
    if(statusContainer){
        statusContainer.destroy();
    }
    playsound(scene,playerStatus.map_id);
}