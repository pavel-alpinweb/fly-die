import * as Phaser from "phaser";

class GameScene extends Phaser.Scene {
    private player!: Phaser.Physics.Arcade.Image & { body: Phaser.Physics.Arcade.Body }
    private platforms!: Phaser.Physics.Arcade.StaticGroup

    constructor() {
        super();
    }

    preload() {
        this.load.image('sky', '/assets/backgrounds/01.png');
        this.load.image('ground01', '/assets/tiles/ground01.png');
        this.load.spritesheet('player', '/assets/player/player.png', { frameWidth: 116, frameHeight: 108 });
        this.load.spritesheet('player-fly', '/assets/player/player-fly.png', { frameWidth: 152, frameHeight: 152 });
    }

     create() {
        this.add.image(window.innerWidth / 2, window.innerHeight / 2, 'sky');
        this.platforms = this.physics.add.staticGroup({
            key: 'ground01',
            repeat: 20,
            setXY: {x: 138/2, y: window.innerHeight - 138/2, stepX: 138},
        });

         this.player = this.physics.add.sprite(450, 450, 'player')

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
    }

     update() {
         this.player.anims.play('fly', true);
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