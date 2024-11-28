export default class Player {
    constructor(scene, x, y, texture,speed) {
        // Phaserのシーン
        this.scene = scene;

        // プレイヤーのスプライト
        this.sprite = scene.matter.add.sprite(x, y, texture);

        // arcadeの時のプレイヤーの当たり判定変更
        this.sprite.setBody({
            type: 'rectangle',
            width: 16,
            height: 16
        });

        // プレイヤーの空気抵抗
        this.sprite.setFixedRotation(0);
        // プレイヤーの摩擦係数
        this.sprite.setFriction(0);

        // プレイヤーの回転防止
        this.sprite.setFixedRotation();

        // キャラクターのスピード
        this.speed = Math.min(speed/10+10, 5); // 200を上限とする

        // 動いているかのフラグ
        this.isMoving = false;

        //カメラ調整,必要に応じて調整
        this.scene.cameras.main.startFollow(this.sprite);//プレイヤー追従

        // プレイヤーのアニメーションを設定
        this.createAnimations(); 

        this.direction = "down"; // プレイヤーの向きを保持
        this.interactionRange = 32; // 調べられる距離

        
        this.graphics = this.scene.add.graphics(); // 範囲描画用のGraphicsオブジェクト
        this.graphics.setDepth(10);
    }

    //////////// デバッグ用
    drawInteractionArea() {
        // 古い描画をクリア
        this.graphics.clear();
        // 範囲を取得
        const area = this.getInteractionArea();
        // 半透明の四角形を描画
        this.graphics.fillStyle(0x00ff00, 0.3); // 緑色、30%透明
        this.graphics.fillRect(area.x - area.width / 2, area.y - area.height / 2, area.width, area.height);
      }

    // プレイヤーアニメーションの設定
    createAnimations() {
        this.scene.anims.create({
            key: 'walk-down',
            frames: this.scene.anims.generateFrameNumbers('playerTexture', { start: 0, end: 2 }),
            frameRate: 10,
            repeat: -1
        });
        this.scene.anims.create({
            key: 'walk-left',
            frames: this.scene.anims.generateFrameNumbers('playerTexture', { start: 3, end: 5 }),
            frameRate: 10,
            repeat: -1
        });
        this.scene.anims.create({
            key: 'walk-right',
            frames: this.scene.anims.generateFrameNumbers('playerTexture', { start: 6, end: 8 }),
            frameRate: 10,
            repeat: -1
        });
        this.scene.anims.create({
            key: 'walk-up',
            frames: this.scene.anims.generateFrameNumbers('playerTexture', { start: 9, end: 11 }),
            frameRate: 10,
            repeat: -1
        });
    }

    // プレイヤーの移動処理
    move(cursors) {
        this.isMoving = false;  // 毎フレーム最初に動いていないと仮定

        // キー入力による移動
        //左右処理を別のif分で書くことで斜め移動を可能にしている
        if (cursors.left.isDown) {
            this.sprite.setVelocityX(-this.speed,0);
            this.sprite.anims.play('walk-left', true);
            this.setDirection('left');
            this.isMoving = true;
        } else if (cursors.right.isDown) {
            this.sprite.setVelocityX(this.speed,0);
            this.sprite.anims.play('walk-right', true);
            this.setDirection('right');
            this.isMoving = true;
        } else {
            this.sprite.setVelocityX(0);
        }
        if (cursors.up.isDown) {
            this.sprite.setVelocityY(-this.speed,0);
            this.sprite.anims.play('walk-up', true);
            this.setDirection('up');
            this.isMoving = true;
        } else if (cursors.down.isDown) {
            this.sprite.setVelocityY(this.speed,0);
            this.sprite.anims.play('walk-down', true);
            this.setDirection('down');
            this.isMoving = true;
        } else {
            this.sprite.setVelocityY(0);
        }

        // 動いていない場合に待機アニメーションを再生
        if (!this.isMoving) {
            this.sprite.anims.stop();  // 現在のアニメーションを停止

            // キャラクターが最後に向いていた方向に応じた待機フレームを設定
            const currentAnim = this.sprite.anims.currentAnim;
            if (currentAnim) {
                switch (currentAnim.key) {
                    case 'walk-up':
                        this.sprite.setTexture('playerTexture', 10);
                        break;
                    case 'walk-down':
                        this.sprite.setTexture('playerTexture', 1);
                        break;
                    case 'walk-left':
                        this.sprite.setTexture('playerTexture', 4);
                        break;
                    case 'walk-right':
                        this.sprite.setTexture('playerTexture', 7);
                        break;
                    default:
                        this.sprite.setTexture('playerTexture', 1);
                }
            }
        }
    }

    // プレイヤーの位置を更新する（マップ切り替え時に使用）
    setPosition(x, y) {
        this.sprite.setPosition(x,y);
    }

    // プレイヤーの向きを更新（上下左右）
    setDirection(direction) {
        this.direction = direction;
    }

    // 調査可能なエリアを計算
    getInteractionArea() {
        const { x, y } = this.sprite;
        switch (this.direction) {
          case "up":
            return { x, y: y - this.interactionRange + 8, width: 32, height: 32 };
          case "down":
            return { x, y: y + this.interactionRange - 8, width: 32, height: 32 };
          case "left":
            return { x: x - this.interactionRange + 8, y, width: 32, height: 32 };
          case "right":
            return { x: x + this.interactionRange - 8, y, width: 32, height: 32 };
          default:
            return { x, y, width: 32, height: 32 };
        }
      }

}