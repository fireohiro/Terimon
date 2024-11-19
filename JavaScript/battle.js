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
let statusDisplay;
let canact = true;
let koutai = false;
export function battlepreload(loader){
    //敵画像
    for(let i = 1; i <= 21;i++){
        loader.image(`monster${i}`,`assets/monster/monster${i}.png`);
    }
    //戦闘背景の読み込み
    loader.image('battleback','assets/battleimg/vsback.png');
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
    let startX = (camera.worldView.width - camera.worldView.x) / 20 + camera.worldView.x;
    const startY = (camera.worldView.height - camera.worldView.y) / 20 + camera.worldView.y - 30;

    const statusBox = scene.add.rectangle(startX,startY,statusWidth,statusHeight,0xFFFFFF);
    statusBox.setStrokeStyle(2,0x000000);
    statusBox.setOrigin(0,0);
    let textX = startX - 150;
    const textY = startY - 5;
    statusContainer = scene.add.container(0,0,[statusBox]);
    if(gameStatus.playerfight){
        const statusText = `
            　　LV:${playerStatus.level}\n
            　${playerStatus.account_name}\n
            HP:${playerStatus.hp_nokori} ／ ${playerStatus.hp}\n
            MP:${playerStatus.mp_nokori} ／ ${playerStatus.mp}
        `;
        statusDisplay = scene.add.text(textX,textY,statusText,{
            fontSize:'28px',
            fill:'#000000',
            wordWrap:{width:statusWidth - 20}
        });
        statusDisplay.setOrigin(0,0);
        statusContainer.add(statusDisplay);
    }else{
        friends.forEach(friend=>{
            const statusText = `
                　　Lv:${friend.level}\n
                　${friend.monster_name}\n
                HP:${friend.hp_nokori} ／ ${friend.hp}\n
                MP:${friend.mp_nokori} ／ ${friend.mp}
            `;
            statusDisplay = scene.add.text(textX,textY,statusText,{
                fontSize:'28px',
                fill:'#000000',
                wordWrap:{width:statusWidth - 20}
            });
            statusDisplay.setOrigin(0,0);
            statusContainer.add(statusDisplay);
            textX += statusWidth / gameStatus.temotisu;
        });
    }
    statusContainer.setDepth(12);
}

//バトルスタート
export async function battleStart(scene,config,bunrui,gameStatus,friends,playerStatus,itemList){
    canact = false;
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
    gameStatus.battleflg = true;
    let res;
    if(bunrui === 1){
        res = await fetch('get_zako.php');
        enemies = await res.json();
    }else if(bunrui === 2){
        res = await fetch('tyuboss.php');
        enemies = await res.json();
    }else if(bunrui === 3){
        res = await fetch('boss.php');
        enemies = await res.json();
    }
    Object.assign(enemy1,enemies[0]);
    Object.assign(enemy2,enemies[1]);
    Object.assign(enemy3,enemies[2]);


    back = scene.add.image(scene.cameras.main.worldView.x,scene.cameras.main.worldView.y,'battleback');//左上端っこに背景画像表示※後でカメラの座標をオブジェクトに入れてそれを持ってくる
    back.setOrigin(0,0);
    back.setDisplaySize(config.width,config.height);//画像のサイズを画面のサイズに合わせる
    back.setDepth(10);

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

    //敵の名前と～が現れた！を表示
    const message = `${enemy1.name}と${enemy2.name}と${enemy3.name}が現れた！`;
    await displaymessage(scene,config,message);

    //ターン継続処理
    let i = 1;
    while(gameStatus.battleflg){
        await battleturn(scene,config,gameStatus,playerStatus,friends,itemList);
        i++;
    }
}

async function battleturn(scene,config,gameStatus,playerStatus,friends,itemList){
    const camera = scene.cameras.main;
    dieflg = false;
    koutai = false;
    changeflg = true;
    magicList = [];
    //プレイヤー以外が戦っているときに、全モンスターが倒れたら、強制的にプレイヤーが戦うように前線に出す
    if(!gameStatus.playerfight){
        friends.forEach(friend=>{
            if(friend.hp_nokori !== 0){
                changeflg = false;
            }
        });
    }
    if(changeflg){
        gameStatus.playerfight = true;
    }else{
        gameStatus.playerfight = false;
    }
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
                console.log('バトル終了、または交代を感知しました');
                break;
            }
        }
    }
    async function enemyaction(combatant){
        await displaymessage(scene,config,`${combatant.name}の攻撃！`);
        if(gameStatus.playerfight){
            let damage = Math.ceil(combatant.pow / 1.5 - (playerStatus.def / 2));
            if(damage <= 0){
                damage = 1;
            }
            playerStatus.hp_nokori -= damage;
            if(playerStatus.hp_nokori <= 0){
                playerStatus.hp_nokori = 0;
            }
            await displaymessage(scene,config,`${playerStatus.account_name}本体に${damage}のダメージ！！`);
        }else{
            for (let i = 0; i < friends.length; i++) {
                const friend = friends[i];
                let damage;
                if(combatant.luck <= 5){
                    damage = Math.ceil(combatant.pow / 1.5 * 2);
                    await displaymessage(scene,config,`${friend.monster_name}は鳩尾に痛恨の一撃を食らった！ダメージ２倍`);
                }else{
                    damage = Math.ceil(combatant.pow / 1.5 - (friend.def / 2));
                }
                if(damage <= 0){
                    damage = 1;
                }
                friend.hp_nokori -= damage;
                if (friend.hp_nokori <= 0) {
                    damage = friend.hp_nokori;
                    friend.hp_nokori = 0;
                }
                await displaymessage(scene, config, `${friend.monster_name}に${damage}ダメージ！`);
                
                if (friend.hp_nokori <= 0) {
                    await displaymessage(scene, config, `${friend.monster_name}は倒れた！`);
                }
            }
        }
        if(enemys[0].hp_nokori > 0 && playerStatus.hp_nokori === 0 || enemys[2].hp_nokori > 0 && playerStatus.hp_nokori === 0 || enemys[2].hp_nokoir > 0 && playerStatus.hp_nokori === 0){
            await battleEnd(scene,config,gameStatus,false,playerStatus);
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
            const startY = camera.worldView.y + camera.worldView.height / 10 * 8 + camera.worldView.y;
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
        }
        const actWidth = config.width * 0.25;
        const actHeight = config.height * 0.2;
        const actX = (scene.cameras.main.worldView.width - scene.cameras.main.worldView.x) / 7 + scene.cameras.main.worldView.x;
        const actY = (scene.cameras.main.worldView.height - scene.cameras.main.worldView.y) / 5 * 4 + scene.cameras.main.worldView.y;
        actionContainer = scene.add.container();
    
        const actBox = scene.add.rectangle(actX,actY,actWidth,actHeight,0xFFFFFF);
        actBox.setStrokeStyle(2,0x000000);
        const attacktext = scene.add.text(actX-125,actY-50,'こうげき',{fontSize:'24px',fill:'#000000'});
        const itemtext = scene.add.text(actX + 20,actY-50,'どうぐ',{fontSize:'24px',fill:'#000000'});
        const magictext = scene.add.text(actX-125, actY + 20,'まほう',{fontSize:'24px',fill:'#000000'});
        if(gameStatus.playerfight){
            const backtext = scene.add.text(actX + 20,actY + 20,'やっぱ引く',{fontSize:'24px',fill:'#000000'});
            actionContainer.add([actBox,attacktext,itemtext,magictext,backtext]);
            actionContainer.setDepth(12);
            await waitselect(attacktext,itemtext,magictext,backtext,combatant);
        }else{
            const fronttext = scene.add.text(actX + 20,actY + 20,'俺が出る',{fontSize:'24px',fill:'#000000'});
            actionContainer.add([actBox,attacktext,itemtext,magictext,fronttext]);
            actionContainer.setDepth(12);
            await waitselect(attacktext,itemtext,magictext,fronttext,combatant);
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
                await handleActionSelection('どうぐ',combatant);
                resolve();
            });
            magictext.setInteractive().on('pointerdown',async()=>{
                actionContainer.destroy();
                console.log(gameStatus.playerfight);
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
                if(gameStatus.playerfight){
                    await displaymessage(scene,config,`${combatant.account_name}の攻撃！`);
                }else{
                    await displaymessage(scene,config,`${combatant.monster_name}の攻撃！`);
                }
                let i = 0;
                for(const enemy of enemys){
                    let damage;
                    if(enemy.hp_nokori > 0){
                        const randnum = Math.floor(Math.random() * 100) + 1;
                        if(combatant.luck >= randnum){
                            damage = Math.ceil(combatant.pow / 1.5) * 2;
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
                    console.log(magicList);
                    //枠作成
                    const frameWidth = config.width *0.7;
                    const frameHeight = config.height * 0.4;
                    const frameX = (camera.worldView.width - camera.worldView.x) / 9 + camera.worldView.x;
                    const frameY = (camera.worldView.height - camera.worldView.y) / 5 * 3 + camera.worldView.y;
                    const frame = scene.add.rectangle(frameX,frameY,frameWidth,frameHeight,0xffffff);
                    frame.setStrokeStyle(2,0x000000);
                    frame.setOrigin(0,0);
                    magicContainer.add(frame);
                    magicContainer.setDepth(12);
                    let textY = frameY + 20;
                    const wazatext1=scene.add.text(frameX + 10,textY,`${magicList[0].waza_name}　　　MP:${magicList[0].syouhi_mp}　　　分類：${magicList[0].naiyou}`,{fontSize:'16px',fill:'#000000'});
                    const wazatext2=scene.add.text(frameX + 10,textY + 20,`${magicList[1].waza_name}　　　MP:${magicList[1].syouhi_mp}　　　分類：${magicList[1].naiyou}`,{fontSize:'16px',fill:'#000000'});
                    const wazatext3=scene.add.text(frameX + 10,textY + 40,`${magicList[2].waza_name}　　　MP:${magicList[2].syouhi_mp}　　　分類：${magicList[2].naiyou}`,{fontSize:'16px',fill:'#000000'});
                    const wazatext4=scene.add.text(frameX + 10,textY + 60,`${magicList[3].waza_name}　　　MP:${magicList[3].syouhi_mp}　　　分類：${magicList[3].naiyou}`,{fontSize:'16px',fill:'#000000'});
                    wazatext1.setOrigin(0,0);
                    wazatext2.setOrigin(0,0);
                    wazatext3.setOrigin(0,0);
                    wazatext4.setOrigin(0,0);
                    wazatext1.setDepth(12);
                    wazatext2.setDepth(12);
                    wazatext3.setDepth(12);
                    wazatext4.setDepth(12);
                    magicContainer.add([wazatext1,wazatext2,wazatext3,wazatext4]);
                    await magicselect(wazatext1,wazatext2,wazatext3,wazatext4,combatant);
                }
                break;
                case "どうぐ":
                    const frameX = (camera.worldView.width - camera.worldView.x) / 7 + camera.worldView.x;
                    const frameY = (camera.worldView.height - camera.worldView.y) / 5 * 3 + camera.worldView.y;
                    itemContainer = scene.add.container(frameX,frameY);
                    if(itemList){
                        const maskShape = scene.add.graphics();
                        maskShape.fillStyle(0xffffff);
                        maskShape.fillRect(frameX,frameY,config.width * 0.7,config.height * 0.4);
                        maskShape.setDepth(11);
                        itemContainer.setMask(maskShape.createGeometryMask());

                        //スクロールロジックを追加
                        const maxScrollY = 0;
                        const minScrollY = -Math.max(0,(itemList.length * 20) - (config.height * 0.4));//下方向の限界
                        scene.input.on('wheel',(pointer,deltaX,deltaY,) => {
                            const scrollAmount = 10;
                            itemContainer.y += deltaY > 0 ? -scrollAmount : scrollAmount;

                            if(itemContainer.y > maxScrollY){
                                itemContainer.y = maxScrollY;
                            }else if(itemContainer.y < minScrollY){
                                itemContainer.y = minScrollY;
                            }
                        });
                        itemContainer.setDepth(12);
                        let index = 0;
                        for(const item of itemList){
                            const textitem = scene.add.text(0,index * 20,`${item.item_name}　　　分類：${item.bunrui}　　${item.setumei}　　所持数：${item.su}個`,{
                                fontSize:'24px',
                                color:'#000000'
                            });
                            itemContainer.add(textitem);
                            index = index + 1;
                            await selectitem(textitem,item,maskShape,combatant);
                        }
                    }else{
                        await displaymessage(scene,config,`${playerStatus.account_name}は何もどうぐを持っていないようだ・・・`)
                    }
                    break;
            case "俺が出る":
                gameStatus.playerfight = true;
                koutai = true;
                await displaymessage(scene,config,`${playerStatus.account_name}が前に出た！`);
                break;
            case "やっぱ引く":
                if(!friends[0]){
                    await displaymessage(scene,config,`しかし${playerStatus.account_name}に戦闘を任せられる仲間はいない！`);
                }else{
                    gameStatus.playerfight = false;
                    koutai = true;
                    await displaymessage(scene,config,`${playerStatus.account_name}はやっぱり家に引きこもることを決めた！`);
                }
                break;
        }
        if(enemys[0].hp_nokori === 0 && enemys[1].hp_nokori === 0 && enemys[2].hp_nokori === 0 && playerStatus.hp_nokori >= 1){
            await battleEnd(scene,config,gameStatus,true,playerStatus);
        }
    }
    function selectitem(textitem,item,maskShape,combatant){
        return new Promise(resolve=>{
            itemContainer.setDepth(12);
            textitem.setInteractive().on('pointerdown',async()=>{
                itemContainer.destroy();
                maskShape.destroy();
                await itemRole(item,combatant);
                resolve();
            });
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
            await displaymessage(scene,config,`${combatant.monster_name}は${magic.waza_name}を使った！`);
            for (const enemy of enemys) {
                // 命中判定
                randnum = Math.floor(Math.random() * 100) + 1;
                if (randnum <= magic.hit_rate) {
                    // 即死
                    if (magic.naiyou === '即死') {
                        if(enemy.hp_nokoir >= 1){
                            randnum2 = Math.floor(Math.random() * 100) + 1;
                            if (randnum2 >= enemy.luck) {
                                dieflg = true;
                            } else {
                                await displaymessage(scene, config, 'しかしまほうが相手の運に負けてしまった！');
                            }
                        }
                    // HP回復
                    } else if (magic.naiyou === 'HP回復') {
                        let kouka = Math.floor((combatant.pow + combatant.def) / 2) * magic.syouhi_mp;
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
                                if (friend.luck >= randnum2) {
                                    friend.hp_nokori = friend.hp;
                                    await displaymessage(scene, config, `${friend.monster_name}は${combatant.name}のまほうによって復活した！`);
                                } else {
                                    await displaymessage(scene, config, `しかし${combatant.name}のまほうは失敗に終わった`);
                                }
                            } else {
                                await displaymessage(scene, config, `${friend.monster_name}には効果がなかった・・・`);
                            }
                        }
                        break;
                    // 攻撃魔法
                    } else {
                        if (enemy.hp_nokori > 0) {
                            let damage = Math.ceil(combatant.pow * (1 + magic.might / 100) / 1.5);
                            let randnum2 = Math.floor(Math.random() * 100) + 1;
                            if (randnum2 <= combatant.luck) {
                                damage = damage * 2;
                                await displaymessage(scene, config, '会心の一撃！');
                                await attack(enemy, damage, i);
                            } else if (magic.naiyou === enemy.resist) {
                                damage = Math.ceil(damage / 3);
                                await displaymessage(scene, config, `${enemy.name}の耐性が${combatant.monster_name}の${magic.waza_name}のダメージを激減させた！`);
                                await attack(enemy, damage, i);
                            } else {
                                damage -= enemy.def / 2;
                                await attack(enemy, damage, i);
                            }
                        }
                    }
                } else {
                    if(enemy.hp_nokori >= 1){
                        await displaymessage(scene, config, 'しかしまほうを外してしまった・・・');
                    }
                }
                i++;
            }                
        }else{
            await displaymessage(scene,config,'しかしMPが足りない！');
        }
    }

    async function itemRole(item,combatant){
        itemContainer.destroy();
        let luckflg = false; 
        let rand1 = Math.floor(Math.random() * 100) + 1;
        if(gameStatus.playerfight){
            await displaymessage(scene,config,`${playerStatus.account_name}は${item.item_name}を使った！`);
        }else{
            await displaymessage(scene,config,`${combatant.monster_name}は${item.item_name}を使った`);
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
                    await displaymessage(scene, config, `${friend.monster_name}は息を吹き返した！`);
                } else {
                    await displaymessage(scene, config, `${friend.monster_name}には効果がなかった・・・`);
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
            await displaymessage(scene,config,`問答無用の一撃必殺まほうにより、${enemy.name}は即死した`);
            enemy.hp_nokori = 0;
        }else{
            //ダメージ表示（ダメージエフェクトをつけたいのならここにつけましょ
            const damag = `${enemy.name}に${damage}ダメージを与えた！`;
            await displaymessage(scene,config,damag);
            enemy.hp_nokori -= damage;
        }
        if(enemy.hp_nokori < 0){
            enemy.hp_nokori = 0;
            //モンスター名＋を倒した！を下のメッセージボックス内で表示
            const message = `${enemy.name}を倒した！`;
            await displaymessage(scene,config,message);

            //指定していたお金ドロップの量を手持ち金額に追加して表示する
            playerStatus.money += enemy.drop_money;
            const message2 = `${enemy.drop_money}チピチャパを手に入れた！`;
            await displaymessage(scene,config,message2);
            //レベルアップ処理
            if(gameStatus.playerfight){
                playerStatus.experimence += enemy.experience;
                if (playerStatus.level * 200 <= playerStatus.experience) {
                    playerStatus.level++;
                
                    try {
                        const response = await fetch('level_up.php', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({ job_id: playerStatus.job_id })
                        });
                
                        const data = await response.json();
                        const statuses = data.levelUpData;
                
                        // ステータスの更新
                        playerStatus.hp += statuses.up_hp;
                        playerStatus.mp += statuses.up_mp;
                        playerStatus.pow += statuses.up_pow;
                        playerStatus.def += statuses.up_def;
                        playerStatus.speed += statuses.up_speed;
                        playerStatus.luck += statuses.up_luck;
                
                        // メッセージの表示
                        await displaymessage(scene, config, `${playerStatus.account_name}のレベルが${playerStatus.level}になった！`);
                        await displaymessage(scene, config, `HP:${statuses.up_hp} MP:${statuses.up_mp} ちから：${statuses.up_pow} まもり:${statuses.up_def} スピード:${statuses.up_speed} 運:${statuses.up_luck}上昇した`);
                    } catch (error) {
                        console.error("レベルアップデータの取得中にエラーが発生しました:", error);
                    }
                }
            }else{
                for (const friend of friends) {
                    friend.experience += enemy.experience;
                    
                    if (playerStatus.level * 200 <= playerStatus.experience) {
                        playerStatus.level++;
                    
                        try {
                            const response = await fetch('level_up.php', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify({ job_id: playerStatus.job_id })
                            });
                    
                            const data = await response.json();
                            const statuses = data.levelUpData;
                        
                            // ステータスの更新
                            playerStatus.hp += statuses.up_hp;
                            playerStatus.mp += statuses.up_mp;
                            playerStatus.pow += statuses.up_pow;
                            playerStatus.def += statuses.up_def;
                            playerStatus.speed += statuses.up_speed;
                            playerStatus.luck += statuses.up_luck;
                        
                            // メッセージの表示
                            await displaymessage(scene, config, `${playerStatus.account_name}のレベルが${playerStatus.level}になった！`);
                            await displaymessage(scene, config, `HP:${statuses.up_hp} MP:${statuses.up_mp} ちから：${statuses.up_pow} まもり:${statuses.up_def} スピード:${statuses.up_speed} 運:${statuses.up_luck}上昇した`);
                        } catch (error) {
                            console.error("レベルアップデータの取得中にエラーが発生しました:", error);
                        }
                    }
                }
            }
            const nakama = Math.floor(Math.random() * 100) + 1;
            if(nakama <= 10){
                await displaymessage(scene,config,`${enemy.name}が仲間になりたそうにしている。`);
                fetch('nakamaka.php',{
                    method:'POST',
                    headers:{
                        'Content-Type':'application/json'
                    },
                    body:JSON.stringify(enemy)
                });
                await displaymessage(scene,config,`${enemy.name}が仲間に加わった！`);
            }
    
            //仲間になるならない関係なく、倒したモンスターの画像をゲーム画面から消す
            enemyImages[i].setVisible(false);
        }
    }
}

//１文字ずつ表示するメッセージ用の枠作成と表示関数
async function displaymessage(scene, config, message) {
    canact = false;
    const messageWidth = config.width * 0.9;
    const messageHeight = config.height * 0.3;
    const messageX = scene.cameras.main.centerX; //変更予定
    const messageY = scene.cameras.main.height - messageHeight + 50; //変更予定

    const messageBox = scene.add.rectangle(messageX, messageY, messageWidth, messageHeight, 0xFFFFFF);
    messageBox.setStrokeStyle(2, 0x000000);
    messageBox.setDepth(12);

    const messagetext = scene.add.text(
        messageX - messageWidth / 2 + 20,
        messageY - messageHeight / 2 + 30,
        '',
        { fontSize: '24px', fill: '#000000', wordWrap: { width: messageWidth - 40 } }
    );
    messagetext.setDepth(13);

    let currentCharIndex = 0;

    async function displayNextChar() {
        return new Promise(resolve => {
            function next() {
                if (currentCharIndex < message.length) {
                    messagetext.text += message[currentCharIndex];
                    currentCharIndex++;
                    scene.time.delayedCall(50, next);
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
            { fontSize: '24px', fill: '#000000' }
        );
        await waitForEnter(marker);
    }

    function waitForEnter(marker) {
        return new Promise(resolve => {
            scene.input.keyboard.once('keydown-ENTER', () => {
                marker.destroy();
                messagetext.destroy();
                messageBox.destroy(); //枠も消す
                canact = true;
                resolve(); //ENTERが押されたことを通知
            });
        });
    }

    await displayNextChar(); // 文字表示を待つ
    await displayEndMarker(); // エンドマーカーの表示を待つ
}

async function battleEnd(scene,config,gameStatus,winflg,playerStatus){
    if(!winflg){
        const lostmoney = Math.floor(playerStatus.money * 0.05);
        const message = `${playerStatus.account_name}は負けてしまったストレスから、${lostmoney}チピチャパをぶちまけた！`;
        await displaymessage(scene,config,message);
        playerStatus.money = Math.floor(playerStatus.money * 0.95);
        playerStatus.hp_nokori = playerStatus.hp;
        playerStatus.mp_nokori = playerStatus.mp;
    }else{
        const message = '勝った';
        await displaymessage(scene,config,message);
    }
    gameStatus.battleflg = false;
    if(back){
        back.destroy();
    }
    if(statusContainer){
        statusContainer.destroy();
    }
}