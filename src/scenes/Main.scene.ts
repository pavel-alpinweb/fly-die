import * as Phaser from "phaser";

export const useMainScene = () => {
    const gameContainer = document.getElementById('game');
    let platforms;
    let player;
    const config = {
        type: Phaser.AUTO,
        width: 800,
        height: 600,
        parent: gameContainer,
        physics: {
            default: 'arcade',
            arcade: {
                gravity: { y: 300 },
                debug: false
            }
        },
        scene: {
            preload,
            create,
            update,
        }
    };

    function preload ()
    {
        this.load.image('sky', '/assets/backgrounds/sky.png');
        this.load.image('ground', '/assets/objects/platform.png');
        this.load.image('star', '/assets/objects/star.png');
        this.load.image('bomb', '/assets/objects/bomb.png');
        this.load.spritesheet('dude', '/assets/player/dude.png', { frameWidth: 32, frameHeight: 48 });
    }

    function create ()
    {
        this.add.image(400, 300, 'sky');

        platforms = this.physics.add.staticGroup();

        platforms.create(400, 568, 'ground').setScale(2).refreshBody();

        platforms.create(600, 400, 'ground');
        platforms.create(50, 250, 'ground');
        platforms.create(750, 220, 'ground');

        player = this.physics.add.sprite(100, 450, 'dude');
        player.setBounce(0.2);
        player.setCollideWorldBounds(true);

        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'turn',
            frames: [ { key: 'dude', frame: 4 } ],
            frameRate: 20
        });

        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
            frameRate: 10,
            repeat: -1
        });
    }

    function update ()
    {
    }



    const game = new Phaser.Game(config);
    console.log('Game ready!', game);
};