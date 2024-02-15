import * as Phaser from "phaser";

export const useMainScene = () => {
    const gameContainer = document.getElementById('game');
    let platforms;
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
    }

    function update ()
    {
    }



    const game = new Phaser.Game(config);
    console.log('Game ready!', game);
};