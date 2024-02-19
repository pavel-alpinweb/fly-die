import * as Phaser from "phaser";

class GameScene extends Phaser.Scene {
    // private player!: Phaser.Physics.Arcade.Image & { body: Phaser.Physics.Arcade.Body }
    private platforms!: Phaser.Physics.Arcade.StaticGroup

    constructor() {
        super();
    }

    preload() {
        this.load.image('sky', '/assets/backgrounds/01.png');
        this.load.image('ground01', '/assets/tiles/ground01.png');
    }

     create() {
        this.add.image(window.innerWidth / 2, window.innerHeight / 2, 'sky');
        this.platforms = this.physics.add.staticGroup({
            key: 'ground01',
            repeat: 20,
            setXY: {x: 138/2, y: window.innerHeight - 138/2, stepX: 138},
        });
    }

     update() {

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
                debug: false
            }
        },
        scene: GameScene
    };

    return new Phaser.Game(config);
}