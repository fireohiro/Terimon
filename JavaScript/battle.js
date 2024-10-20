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

export async function battleStart(bunrui,gameStatus,friend1Status,friend2Status,friend3Status){
    let enemies = [];
    gameStatus.battleflg = true;
    const response = await fetch('../battle.php');
    const html = await response.text();
    document.getElementById('main-content').innerHTML = html;//画面に挿入
    if(bunrui === 1){
        const response = await fetch('../get_zako.php');
        enemies = await response.json();
    }else if(bunrui === 2){
        const response = await fetch('../tyuboss.php');
        enemies = await response.json();
    }else if(bunrui === 3){
        const response = await fetch('../boss.php');
        enemies = await response.json();
    }
    Object.assign(enemy1,enemies[0]);
    Object.assign(enemy2,enemies[1]);
    Object.assign(enemy3,enemies[2]);

    const battleback = this.add.image(640,480,'battleback');//左上端っこに背景画像表示※後でカメラの座標をオブジェクトに入れてそれを持ってくる
    battleback.setDisplaySize(1280,960);//画像のサイズを画面のサイズに合わせる
    battleback.setDepth(0);

    //モンスターを中央に並べて表示
    const enemyImages = [
        {enemy:enemy1,x:320},
        {enemy:enemy2,x:640},
        {enemy:enemy3,x:960}
    ];

    enemyImages.forEach(({enemy,x},index)=>{
        const imagePath = `../assets/battleimg/${enemy.gazou}`;//画像パス
        const monsterImage = this.add.image(x,300,imagePath);//モンスター画像
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
        const friendImage = this.add.image(startX + i * spacing,startY,friendImagePath);
        friendImage.setDisplaySize(50,50);
        friendImage.setDepth(1);
    }

    //敵の名前と～が現れた！をhtmlと一緒に表示
    const message = `${enemy1.name}と${enemy2.name}と${enemy3.name}が現れた！`;
    await messageanimation(message);
}

async function messageanimation(message){
    const underText = document.getElementById('under-text');
    underText.innerText = '';//テキスト初期化
    let index = 0;
    return new Promise((resolve)=>{
        const interval = setInterval(()=>{
            underText.innerText += message[index];
            index++;
            if(index >= message.length){
                clearInterval(interval);//全文表示完了
                showArrow();//▾を表示
                stayEnter(resolve);//Enterキー待ち
            }
        },100);//１文字ずつ100ms感覚で表示
    });
}

function showArrow(){
    const arrow = document.createElement('span');
    arrow.innerText = ' ▾';
    arrow.style.fontSize = '24px';
    arrow.style.marginLeft = '10px';
    document.getElementById('under-text').appendChild(arrow);
}

//Enterキーが押されるのを待つ関数
function stayEnter(resolve){
    function onEnterPress(event){
        if(event.key === 'Enter'){
            document.removeEventListener('keydown',onEnterPress);//イベント削除
            resolve();//次の処理に進む
        }
    }
    document.addEventListener('keydown',onEnterPress);
}

function battleEnd(gameStatus){
    gameStatus.battleflg = false;
}

export function battleupdate(gameStatus,playerStatus,friend1Status,friend2Status,friend3Status){
    
}