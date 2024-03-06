import Phaser from "phaser";

export const enemiesComposition = {
    uploadEnemiesAssets(scene: Phaser.Scene) {
        scene.load.atlas('soldier', '/assets/enemies/soldier.png', '/assets/enemies/soldier.json');
    },

    initEnemiesAnimations(scene: Phaser.Scene) {
        scene.anims.create({
            key: 'soldier-run',
            frames: scene.anims.generateFrameNames('soldier', {
                start: 5,
                end: 4,
                zeroPad: 0,
                suffix: '.png',
            }),
            frameRate: 10,
            repeat: -1
        });
    },
};