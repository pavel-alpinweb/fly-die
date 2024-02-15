import * as Phaser from "phaser";

export const useMainScene = () => {
    const gameContainer = document.getElementById('game');
    const config = {
        type: Phaser.AUTO,
        width: 800,
        height: 600,
        parent: gameContainer,
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
        this.add.image(400, 300, 'star');
    }

    function update ()
    {
    }



    const game = new Phaser.Game(config);
    console.log('Game ready!', game);
};