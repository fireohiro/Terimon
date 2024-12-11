let currentMusic;
export function soundpreload(loader){
    loader.audio('town','assets/audio/town_music.mp3');
    loader.audio('battle','assets/audio/nomal_battle.mp3');
    loader.audio('battle2','assets/audio/battle2.mp3');
    loader.audio('battle3','assets/audio/battle3.mp3');
    loader.audio('battle4','assets/audio/battle4.mp3');
    loader.audio('dungeon','assets/audio/dungeon.mp3');
    loader.audio('boss1','assets/audio/boss.mp3');
    loader.audio('boss2','assets/audio/boss_final.mp3');

    //効果音の読み込み
    loader.audio('run','assets/audio/run.mp3');
    //主にバトルで使用
    loader.audio('encount1','assets/audio/encount1.mp3');
    loader.audio('encount2','assets/audio/encount2.mp3');
    loader.audio('coment','assets/audio/coment.mp3');
    loader.audio('attack','assets/audio/nomalattack.mp3');
    loader.audio('magic','assets/audio/magic_effect.mp3');
    loader.audio('miss','assets/audio/miss_magic.mp3');
    loader.audio('getmoney','assets/audio/money.mp3');
    loader.audio('critical','assets/audio/critical.mp3');
    loader.audio('levelup','assets/audio/levelup.mp3');
    loader.audio('winner','assets/audio/winner.mp3');
    //主にポーズで使用
    loader.audio('open_pause','assets/audio/pause_open.mp3');
    loader.audio('open','assets/audio/open.mp3');
    loader.audio('yes','assets/audio/yes.mp3');
    loader.audio('no','assets/audio/no.mp3');
    //ショップ
    loader.audio('cash','assets/audio/Cash.mp3');
    loader.audio('mart','assets/audio/mart.mp3');
}
export function soundcreate(){
    currentMusic = null;
}

export function playsound(scene,condition){
    const musicMap = { 
        4 : 'town',
        battle : 'battle',
        battle2 : 'battle2',
        battle3:'battle3',
        battle4:'battle4',
        dungeon : 'dungeon',
        boss1 : 'boss1',
        boss2 : 'boss2',
    };
    const musicKey = musicMap[condition];
    if(!musicKey){
        console.log(`条件 ${condition} に該当する音楽は見つかりませんでした。`);
        if(currentMusic){
            currentMusic.stop();
        }
    }else{
        if(currentMusic){
            currentMusic.stop();
        }
        currentMusic = scene.sound.add(musicKey, { loop:true,volume: 0.5});
        currentMusic.play();
    }
}

export function playEffect(scene,condition){
    const effectMap = {
        encount1:'encount1',
        encount2:'encount2',
        coment:'coment',
        attack:'attack',
        magic:'magic',
        miss:'miss',
        getmoney:'getmoney',
        pause:'open_pause',
        open:'open',
        yes:'yes',
        no:'no',
        cash:'cash',
        critical:'critical',
        levelup:'levelup',
        mart:'mart',
        run:'run',
        winner:'winner',
    };
    const effectKey = effectMap[condition];
    if(!effectKey){
        console.log(`条件${condition}に該当する音楽は見つかりませんでした。`);
    }else{
        const sound = scene.sound.add(effectKey);
        sound.play();
    }
}

export function waitEffect(scene,condition) {
    return new Promise((resolve) => {
        const effectMap = {
            encount1:'encount1',
            encount2:'encount2',
            coment:'coment',
            attack:'attack',
            magic:'magic',
            miss:'miss',
            getmoney:'getmoney',
            pause:'open_pause',
            open:'open',
            yes:'yes',
            no:'no',
        };
        const effectKey = effectMap[condition];
        if(!effectKey){
            console.log(`条件${condition}に該当する音楽は見つかりませんでした。`);
        }else{
            const sound = scene.sound.add(effectKey);
            sound.play();

            // 効果音が再生終了したら解決
            sound.once('complete', () => {
                resolve();
            });
        }
    });
}