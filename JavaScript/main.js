const config={
    type:Phaser.AUTO, //自動的に適切なレンダラーを選択
    width:800,//ゲーム画面の幅
    height:600,//ゲーム画面の高さ
    scene:{//ゲームのシーン
        proeload:prelad,//プリロード関数
        create:create,//作成関数
        update:update//更新関数
    }
};
//ゲームインスタンスを作成
const game = new Phaser.Game(config);

//アセット（画像、音声など）の読み込み
function preload(){
    this.load.image('sky','assets/img/sky.png');//背景画像を読み込む
}

//ゲームの更新処理（マイフレーム呼び出される）
function update(){
    //ゲームの更新状態を更新する処理をここに書く
}