export default class Player {
    constructor(scene, x, y, texture, speed) {
        // Phaserのシーン
        this.scene = scene; 

        // プレイヤーのスプライト
        this.sprite = scene.physics.add.sprite(x, y, texture); 

        //カメラ調整,必要に応じて調整
        this.scene.cameras.main.startFollow(this);//プレイヤー追従

        // 動いているかのフラグ
        this.isMoving = false;

        // キャラクターのスピード
        this.speed = Math.min(speed + 100, 200); // 200を上限とする

        this.createAnimations(); // プレイヤーのアニメーションを設定
    }

    // プレイヤーの位置を更新する（マップ切り替え時に使用）
    setPosition(x, y) {
        this.sprite.setPosition(x, y);
    }

    // プレイヤーの移動処理
    move(cursors) {
        this.isMoving = false;  // 毎フレーム最初に動いていないと仮定

        // キー入力による移動
        if (cursors.left.isDown) {
            this.sprite.setVelocityX(-this.speed);
            this.sprite.anims.play('walk-left', true);
            this.isMoving = true;
        } else if (cursors.right.isDown) {
            this.sprite.setVelocityX(this.speed);
            this.sprite.anims.play('walk-right', true);
            this.isMoving = true;
        } else {
            this.sprite.setVelocityX(0);
        }

        //左右処理を別のif分で書くことで斜め移動を可能にしている

        if (cursors.up.isDown) {
            this.sprite.setVelocityY(-this.speed);
            this.sprite.anims.play('walk-up', true);
            this.isMoving = true;
        } else if (cursors.down.isDown) {
            this.sprite.setVelocityY(this.speed);
            this.sprite.anims.play('walk-down', true);
            this.isMoving = true;
        } else {
            this.sprite.setVelocityY(0);
        }

        // 動いていない場合に待機アニメーションを再生
        if (!this.isMoving) {
            this.sprite.anims.stop();  // 現在のアニメーションを停止

            // キャラクターが最後に向いていた方向に応じた待機フレームを設定
            switch (this.anims.getName()) {
                case 'playerUp':
                    this.setTexture('playerTexture', 10); 
                    break;
                case 'playerDown':
                    this.setTexture('playerTexture', 1); 
                    break;
                case 'playerLeft':
                    this.setTexture('playerTexture', 4); 
                    break;
                case 'playerRight':
                    this.setTexture('playerTexture', 7); 
                    break;
                default:
                    this.setTexture('playerTexture', 1); 
            }
        }
    }

    // プレイヤーアニメーションの設定
    createAnimations() {
        this.scene.anims.create({
            key: 'walk-left',
            frames: this.scene.anims.generateFrameNumbers('playerTexture', { start: 0, end: 2 }),
            frameRate: 10,
            repeat: -1
        });
        this.scene.anims.create({
            key: 'walk-right',
            frames: this.scene.anims.generateFrameNumbers('playerTexture', { start: 3, end: 5 }),
            frameRate: 10,
            repeat: -1
        });
        this.scene.anims.create({
            key: 'walk-up',
            frames: this.scene.anims.generateFrameNumbers('playerTexture', { start: 6, end: 8 }),
            frameRate: 10,
            repeat: -1
        });
        this.scene.anims.create({
            key: 'walk-down',
            frames: this.scene.anims.generateFrameNumbers('playerTexture', { start: 9, end: 11 }),
            frameRate: 10,
            repeat: -1
        });
    }
}