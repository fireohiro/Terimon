let sound;

export function soundpreload(loader){
    loader.audio('town','assets/audio/town_music.mp3');
    loader.audio('battle','assets/audio/nomal_battle.mp3');
    loader.audio('dungeon','assets/audio/dungeon.mp3');
    loader.audio('boss1','assets/audio/boss.mp3');
    loader.audio('boss2','assets/audio/boss_final.mp3');
}
export function soundcreate(){
    currentMusic = null;

}

export function playsound(scene,condition){
    const musicMap = { 
        4 : 'town',
        battle : 'battle',
        dungeon : 'dungeon',
        boss1 : 'boss1',
        boss2 : 'boss2',
    };
}
const musicKey = musicMap[condition];
if(!musicKey){
    console.log(`条件 ${condition} に該当する音楽は見つかりませんでした。`);
    return;
}
if(currentMusic){
    currentMusic.stop();
}
currentMusic = scene.sound.add(musicKey, { loop:true,volume: 0.5});
currentMusic.play();