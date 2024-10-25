//ここはインポートする際に１回だけ通るらしい
const enemy1 = {};
const enemy2 = {};
const enemy3 = {};
export function battlepreload(loader){
    //敵画像
    for(let i = 1; i <= 10;i++){
        loader.image(`enemy${i}`,`../assets/battleimg/Enemy${i}.png`);
    }
    //戦闘背景の読み込み
    loader.image('battleback','../assets/battleimg/vsback.png');
}

function battleEnd(gameStatus){
    gameStatus.battleflg = false;
}

export async function battleupdate(scene,gameStatus,playerStatus,friend1Status,friend2Status,friend3Status,config){
    const friendStatuses = [friend1Status,friend2Status,friend3Status,config];
    const displayData = gameStatus.playerfight ? [playerStatus]:friendStatuses.slice(0,gameStatus.temotisu);
    displayStatus(scene,gameStatus,displayData,config);
    selectact(scene,gameStatus,playerStatus,friend1Status,friend2Status,friend3Status,config);
}

export async function battleStart(scene,config,bunrui,gameStatus,friend1Status,friend2Status,friend3Status){
    let enemies = [];
    gameStatus.battleflg = true;
    let res;
    if(bunrui === 1){
        res = await fetch('../get_zako.php');
        enemies = await res.json();
    }else if(bunrui === 2){
        res = await fetch('../tyuboss.php');
        enemies = await res.json();
    }else if(bunrui === 3){
        res = await fetch('../boss.php');
        enemies = await res.json();
    }
    Object.assign(enemy1,enemies[0]);
    Object.assign(enemy2,enemies[1]);
    Object.assign(enemy3,enemies[2]);

    const battleback = scene.add.image(640,480,'battleback');//左上端っこに背景画像表示※後でカメラの座標をオブジェクトに入れてそれを持ってくる
    battleback.setDisplaySize(1280,960);//画像のサイズを画面のサイズに合わせる
    battleback.setDepth(0);

    //モンスターを中央に並べて表示
    const enemyImages = [
        {enemy:enemy1,x:320},
        {enemy:enemy2,x:640},
        {enemy:enemy3,x:960}
    ];

    enemyImages.forEach(({teki,x},index)=>{
        const monsterImage = scene.add.image(x,300,teki.id);//モンスター画像
        monsterImage.setDisplaySize(150,150);
        monsterImage.setDepth(1);//背景の上に
        
    });

    //手持ちモンスターを右下に表示する処理
    const friendStatuses = [friend1Status,friend2Status,friend3Status];
    const startX = 900;
    const startY = 700;
    const spacing = 60;

    for(let i = 0; i <= gameStatus.temotisu;i++){
        gameStatus.playerfight = false;
        const friend = friendStatuses[i];
        const friendImagePath = `../assets/battleimg/${friend.gazou}`;
        const friendImage = scene.add.image(startX + i * spacing,startY,friendImagePath);
        friendImage.setDisplaySize(50,50);
        friendImage.setDepth(1);
    }

    //敵の名前と～が現れた！をhtmlと一緒に表示
    const message = `${enemy1.name}と${enemy2.name}と${enemy3.name}が現れた！`;
    await displaymessage(scene,config,message);
}

//１文字ずつ表示するメッセージ用の枠作成と表示関数
async function displaymessage(scene,config,message){
    const messageWidth = config.width * 0.9;
    const messageHeight = config.height * 0.3;
    const messageX = scene.cameras.main.centerX;//変更予定
    const messageY = scene.cameras.main.height - messageHeight - 10;//変更予定

    const messageBox = scene.add.rectangle(messageX,messageY,messageWidth,messageHeight,0xFFFFFF);
    messageBox.setStrokeStyle(2,0x000000);
    messageBox.setRadius(10);

    const messagetext = scene.add.text(
        messageX - messageWidth / 2 + 20,
        messageY - messageHeight / 2 + 20,
        '',
        {fontSize:'24px',fill:'#0000000',wordWrap:{width:messageWidth - 40}}
    );

    let currentCharIndex = 0;

    function displayNextChar(){
        if(currentCharIndex < message.elngth){
            messagetext.text += message[currentCharIndex];
            currentCharIndex++;
            scene.time.delayedCall(50,displayNextChar);
        }else{
            displayEndMarker();
        }
    }

    function displayEndMarker(){
        const marker = scene.add.text(
            messageX + messageWidth / 2 - 30,
             messageY + messageHeight / 2 - 40 ,
             '▾',
             {fontSize:'24px',fill:'#000000'}
        );
        waitForEnter(marker);
    }

    function waitForEnter(marker){
        return new Promise(resolve =>{
            scene.input.keyboard.once('keydown-ENTER',()=>{
                marker.destroy();
                resolve();//ENTERが押されたことを通知
            });
        });
    }

    displayNextChar();
    //Promiseを返すことで、後続の処理がENTERを押すまで待機するようにするウ
    await waitForEnter;
}

//味方ステータス表示
function displayStatus(scene,gameStatus,displayData,config){
    const statusWidth = config.width * 0.9;
    const statusHeight = config.height * 0.3;
    let startX = 10;
    const startY = 10;

    const statusBox = scene.add.rectangle(startX,startY,statusWidth,statusHeight,0xFFFFFF);
    statusBox.setStrokeStyle(2,0x000000);
    statusBox.setRadius(10);
    statusBox.setOrigin(0,0);

    let textX = startX + 10;
    const textY = startY + 10;
    displayData.forEach((data,index)=>{
        const statusText = `
            Lv:${data.level}\n
            ${data.name}\n
            HP:${data.nokori_hp} ／ ${data.hp}\n
            MP:${data.nokori_mp} ／ ${data.mp}
        `;

        const statusDisplay = scene.add.text(textX,textY,statusText,{
            fontSize:'16px',
            fill:'#000000',
            wordWrap:{width:statusWidth - 20}
        });
        statusDisplay.setOrigin(0,0);
        textX += statusWidth / displayData.length;
    });
    statusBox.setSize(statusWidth,statusHeight);
}

async function selectact(secen,playerStatus,friend1Status,friend2Status,friend3Status,config){
    const actWidth = config.width * 0.2;
    const actHeight = config.height * 0.2;
    actX = 10;
    actY = (config.height - actHeight - 10);//表示座標を一番下から少し上にする
    const actions = gameStatus.playerfight ? ["こうげき","アイテム","まほう","やっぱ引く"]:["こうげき","アイテム","まほう","俺が出る"];
    const actionBoxes = [];

    actions.forEach((action,index)=>{
        const offsetX = (index % 2) * (actWidth + 10);
        const offsetY = Math.floor(index/2)*(actHeight + 10);
        const boxX = actX + offsetX;
        const boxY = actY + offsetY;

        const actBox = scneadd.rectangle(boxX,boxY,actWidth,actHeight,0xFFFFFF);
        actBox.setStrokeStyle(2,0x000000);
        actBox.setRadius(10);
        actBox.setOrigin(0,0);

        const actionText = scene.add.text(boxX + 10,boxY + 10,action,{
            fontSize:'18px',
            fill:'#000000'
        });
        //クリック時に行動を選択して進める処理
        actBox.setInteractive().on('pointerdown',()=>{
            handleActionSelection(action,scee);
        });
        actionBoxes.push(actBox);
    });
    //行動が選択されるまで待機する関数
    function handleActionSelection(action,scene){
        switch(action){
            case "こうげき":
                //こうげきの処理
                break;
            case "まほう":
                //まほうの処理
                break;
            case "アイテム":
                //アイテムの処理
                break;
            case "俺が出る":
                gameStatus.playerfight = true;
                break;
            case "やっぱ引く":
                gameStatus.playerfight = false;
                break;
        }
    }
}