import * as Phaser from "phaser";

export const useMainScene = () => {
    const gameContainer = document.getElementById('game');
    const config = {
        type: Phaser.AUTO,
        width: 800,
        height: 600,
        parent: gameContainer,
        scene: {
            preload: preload,
            create: create,
            update: update
        }
    };

    function preload ()
    {
    }

    function create ()
    {
    }

    function update ()
    {
    }



    const game = new Phaser.Game(config);
    console.log('Game ready!', game);
};