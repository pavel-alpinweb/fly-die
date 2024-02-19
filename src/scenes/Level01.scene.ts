import * as Phaser from "phaser";

class GameScene extends Phaser.Scene {
    private player!: Phaser.Physics.Arcade.Image & { body: Phaser.Physics.Arcade.Body }
    private platforms!: Phaser.Physics.Arcade.StaticGroup
    private cursors!: Phaser.Input.Keyboard.KeyboardManager

    constructor() {
        super();
    }

    preload() {
        this.load.image('sky', '/assets/backgrounds/01.png');
        this.load.image('ground01', '/assets/tiles/ground01.png');
        this.load.spritesheet('player', '/assets/player/player.png', { frameWidth: 116, frameHeight: 108 });
        this.load.spritesheet('player-fly', '/assets/player/player-fly.png', { frameWidth: 152, frameHeight: 152 });
        this.load.spritesheet('player-walk', '/assets/player/player-walk.png', { frameWidth: 115, frameHeight: 108 });
        this.load.spritesheet('player-jump', '/assets/player/player-jump.png', { frameWidth: 152, frameHeight: 152 });
    }

     create() {
        this.add.image(window.innerWidth / 2, window.innerHeight / 2, 'sky').setScrollFactor(0, 0);
        this.platforms = this.physics.add.staticGroup({
            key: 'ground01',
            repeat: 20,
            setXY: {x: 138/2, y: window.innerHeight - 138/2, stepX: 138},
        });

         this.player = this.physics.add.sprite(450, 450, 'player')
         this.cameras.main.startFollow(this.player, );

         this.physics.add.collider(this.player, this.platforms);

         this.anims.create({
             key: 'idle',
             frames: this.anims.generateFrameNumbers('player', { start: 0, end: 3 }),
             frameRate: 10,
             repeat: -1
         });

         this.anims.create({
             key: 'fly',
             frames: this.anims.generateFrameNumbers('player-fly', { start: 0, end: 2 }),
             frameRate: 10,
             repeat: -1
         });

         this.anims.create({
             key: 'walk',
             frames: this.anims.generateFrameNumbers('player-walk', { start: 0, end: 3 }),
             frameRate: 8,
             repeat: -1
         });
         this.anims.create({
             key: 'jump',
             frames: this.anims.generateFrameNumbers('player-jump', { start: 0, end: 2 }),
             frameRate: 8,
             repeat: -1
         });
    }

     update() {
         this.cursors = this.input.keyboard.createCursorKeys()
         if (this.cursors.up.isDown) {
             this.player.setVelocityY(-500);
             this.player.anims.play('fly', true);
         } else if (this.cursors.right.isDown && !this.player.body.touching.down) {
             this.player.setVelocityX(300);
             this.player.flipX = false;
             this.player.anims.play('jump', true);
         } else if (this.cursors.right.isDown && this.player.body.touching.down) {
             this.player.setVelocityX(250);
             this.player.flipX = false;
             this.player.anims.play('walk', true);
         } else if (this.cursors.left.isDown && this.player.body.touching.down) {
             this.player.setVelocityX(-250);
             this.player.flipX = true;
             this.player.anims.play('walk', true);
         } else if (this.cursors.left.isDown && !this.player.body.touching.down) {
             this.player.setVelocityX(-300);
             this.player.flipX = true;
             this.player.anims.play('jump', true);
         } else {
             this.player.setVelocityX(0);
             this.player.anims.play('idle', true);
         }
     }
}

export const useLevelOneScene = () => {
    const gameContainer = document.getElementById('game');

    const config = {
        type: Phaser.AUTO,
        width: window.innerWidth,
        height: window.innerHeight,
        parent: gameContainer,
        physics: {
            default: 'arcade',
            arcade: {
                gravity: { y: 300 },
                debug: true
            }
        },
        scene: GameScene
    };

    return new Phaser.Game(config);
}