// import Phaser from './lib/phaser.js';
import PreloadScene from './scenes/preload-scene.js'; //assetsの読み込み
import DataScene from './scenes/data-scene.js'; // データオブジェクト
import TitleScene from './scenes/title-scene.js'; // タイトル画面
import WorldScene from './scenes/world-scene.js'; // ワールド画面
// import BattleScene from './scenes/battle-scene.js'; // バトル画面
// import MenuScene from './scenes/menu-scene.js'; //メニュー画面
// import MonsterManagementScene from './scenes/monster-management-scene.js'; //モンスター管理画面
// import InventoryScene from './scenes/inventory-scene.js'; //インベントリ画面
// import GameOverScene from './scenes/gameover-scene.js'; //ゲームオーバー画面

const config = {
  type: Phaser.AUTO,
  pixelArt: true, // 2Dならtrue
  backgroundColor: '#000000',
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y:0 },
      debug: true
    }
  },
  scale: {
    parent: 'game-container', // index.htmlのコンテナID
    width: 800,  // 横幅
    height: 600, // 縦幅
    mode: Phaser.Scale.FIT,  // アスペクト比を維持して画面にフィットさせる
    autoCenter: Phaser.Scale.CENTER_BOTH  // ゲーム画面を中央に配置
  },
};

const game = new Phaser.Game(config);

game.scene.add('PreloadScene', PreloadScene); // assetsの読み込み
game.scene.add('DataScene', DataScene); // データオブジェクトを追加
game.scene.add('TitleScene', TitleScene); // タイトル画面を追加
game.scene.add('WorldScene', WorldScene); // ワールド画面を追加
// game.scene.add('BattleScene', BattleScene); // バトル画面を追加
// game.scene.add('MenuScene', MenuScene); // メニュー画面を追加
// game.scene.add('MonsterManagementScene', MonsterManagementScene); // モンスター管理画面を追加
// game.scene.add('InventoryScene', InventoryScene); // インベントリ画面を追加
// game.scene.add('GameOverScene', GameOverScene); // ゲームオーバー画面を追加

game.scene.start('PreloadScene'); // ゲーム起動
