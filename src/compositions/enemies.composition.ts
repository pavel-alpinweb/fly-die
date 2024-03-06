import Phaser from "phaser";
import {PLAYER_SIZE, PLAYER_START_POSITION} from "../configs/gameplay.config.ts";

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
            frameRate: 8,
            repeat: -1
        });
    },

    initEnemy(scene: Phaser.Scene, layer: Phaser.Tilemaps.TilemapLayer): Phaser.Physics.Arcade.Image & { body: Phaser.Physics.Arcade.Body } {
        const enemy = scene.physics.add.sprite(906, 3948, 'soldier').setSize(PLAYER_SIZE.width, 89);
        scene.physics.add.collider(enemy, layer);

        return enemy;
    },

    moveEnemy(enemy: Phaser.Physics.Arcade.Image & { body: Phaser.Physics.Arcade.Body }, layer: Phaser.Tilemaps.TilemapLayer, scene: Phaser.Scene) {
        scene.physics.collide(enemy, layer);
        enemy.anims.play('soldier-run', true);

        if (enemy.body.blocked.left) {
            enemy.flipX = true;
        } else if (enemy.body.blocked.right) {
            enemy.flipX = false;
        }

        if (enemy.flipX) {
            enemy.setVelocityX(200);
        } else {
            enemy.setVelocityX(-200);
        }
    },
};