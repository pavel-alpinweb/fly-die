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
        this.load.atlas('player-idle', '/assets/player/player-idle.png', '/assets/player/player-idle.json');
        this.load.atlas('player-fly', '/assets/player/player-fly.png', '/assets/player/player-fly.json');
        this.load.atlas('player-walk', '/assets/player/player-walk.png', '/assets/player/player-walk.json');
        this.load.atlas('player-jump', '/assets/player/player-jump.png', '/assets/player/player-jump.json');
    }

     create() {
        this.add.tileSprite(2346 / 2, 1119 / 2, 2346 * 2, 1119, 'sky').setScrollFactor(0.5, 0);
        this.platforms = this.physics.add.staticGroup({
            key: 'ground01',
            repeat: 40,
            setXY: {x: 138/2, y: window.innerHeight - 138/2, stepX: 138},
        });

         this.player = this.physics.add.sprite(450, 450, 'player-idle').setSize(115, 108);
         this.cameras.main.startFollow(this.player);

         this.physics.add.collider(this.player, this.platforms);

         this.anims.create({
             key: 'idle',
             frames: this.anims.generateFrameNames('player-idle',
                 {
                     start: 1,
                     end: 4,
                     zeroPad: 0,
                     suffix: '.png'
                 }
             ),
             frameRate: 10,
             repeat: -1
         });

         this.anims.create({
             key: 'fly',
             frames: this.anims.generateFrameNames('player-fly', {
                 start: 1,
                 end: 4,
                 zeroPad: 0,
                 suffix: '.png'
             }),
             frameRate: 10,
             repeat: -1
         });

         this.anims.create({
             key: 'walk',
             frames: this.anims.generateFrameNames('player-walk',
                 {
                     start: 1,
                     end: 8,
                     zeroPad: 0,
                     suffix: '.png'
                 }
             ),
             frameRate: 10,
             repeat: -1
         });
         this.anims.create({
             key: 'jump',
             frames: this.anims.generateFrameNames('player-jump', {
                 start: 1,
                 end: 3,
                 zeroPad: 0,
                 suffix: '.png'
             }),
             frameRate: 10,
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
         } else if (!this.player.body.touching.down) {
             this.player.setVelocityX(0);
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
        height: 1119,
        parent: gameContainer,
        physics: {
            default: 'arcade',
            arcade: {
                gravity: { y: 500 },
                debug: false
            }
        },
        scene: GameScene
    };

    return new Phaser.Game(config);
}