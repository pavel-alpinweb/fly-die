import Phaser from "phaser";
import {PLAYER_SIZE} from "../configs/gameplay.config.ts";

export const enemiesComposition = {
    uploadEnemiesAssets(scene: Phaser.Scene) {
        scene.load.atlas('soldier', '/assets/enemies/soldier.png', '/assets/enemies/soldier.json');
        scene.load.atlas('death', '/assets/fx/death.png', '/assets/fx/death.json');
        scene.load.image('black-bullet', '/assets/projectiles/black-bullet.png');
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
        scene.anims.create({
            key: 'death',
            frames: scene.anims.generateFrameNames('death', {
                start: 7,
                end: 1,
                zeroPad: 0,
                suffix: '.png',
            }),
            frameRate: 10,
            repeat: 1
        });
    },

    initEnemies(
        scene: Phaser.Scene,
        map: Phaser.Tilemaps.Tilemap,
        layer: Phaser.Tilemaps.TilemapLayer,
        player: Phaser.Physics.Arcade.Image & { body: Phaser.Physics.Arcade.Body },
    ): Phaser.Physics.Arcade.Group{
        const spawns = map.createFromObjects('Enemies', { gid: 3, key: 'soldier' });
        const enemies = scene.physics.add.group();
        for (const spawn of spawns) {
            enemies.add(spawn)
        }
        enemies.children.entries.forEach((enemy) => {
            enemy.body.setSize(PLAYER_SIZE.width, 89);
        });

        scene.physics.add.collider(player, enemies);
        scene.physics.add.collider(enemies, layer);

        return enemies;
    },

    initEnemyVisor(scene: Phaser.Scene, enemy: Phaser.Physics.Arcade.Image & { body: Phaser.Physics.Arcade.Body }) {
        return scene.physics.add.staticImage(950, enemy.y, 'visor').setDisplaySize(550, 5).setAlpha(0);
    },

    moveEnemy(enemy: Phaser.GameObjects.GameObject, scene: Phaser.Scene) {
        enemy.anims.play('soldier-run', true);

        if (enemy.body.blocked.left) {
            enemy.flipX = true;
        } else if (enemy.body.blocked.right) {
            enemy.flipX = false;
        }

        if (enemy.flipX) {
            enemy.body.setVelocityX(200);
        } else {
            enemy.body.setVelocityX(-200);
        }
    },

    enemyFire(
        visor: Phaser.Physics.Arcade.Image & { body: Phaser.Physics.Arcade.StaticBody },
        player: Phaser.Physics.Arcade.Image & { body: Phaser.Physics.Arcade.Body },
        enemy: Phaser.Physics.Arcade.Image & { body: Phaser.Physics.Arcade.Body },
        event: Phaser.Time.TimerEvent,
    ) {
        if (this.checkOverlap(player, visor)) {
            enemy.setVelocityX(0);
            enemy.anims.pause();

            if (player.x < enemy.x) {
                enemy.flipX = false;
            } else {
                enemy.flipX = true;
            }

            event.paused = false;
        } else {
            event.paused = true;
        }
    },

    explosionOnPlayer(player, bullet) {
        bullet.setVelocity(0);
        bullet.anims.play('explosion', true);
        bullet.body.enable = false;
    },


    checkOverlap(spriteA, spriteB) {
        const boundsA = spriteA.getBounds();
        const boundsB = spriteB.getBounds();
        return Phaser.Geom.Intersects.RectangleToRectangle(boundsA, boundsB);
    }
};