import Phaser from "phaser";
import {
    ENEMY_DISTANCE_START_FIRE,
    ENEMY_FIRE_DELAY,
    ENEMY_START_FIRE_DELAY,
    ENEMY_WALK_VELOCITY,
    PLAYER_SIZE
} from "../configs/gameplay.config.ts";
import {weaponComposition} from "./weapon.composition.ts";

export const enemiesComposition = {
    uploadEnemiesAssets(scene: Phaser.Scene) {
        scene.load.atlas('soldier', `${import.meta.env.BASE_URL}/assets/enemies/soldier.png`, `${import.meta.env.BASE_URL}/assets/enemies/soldier.json`);
        scene.load.atlas('death', `${import.meta.env.BASE_URL}/assets/fx/death.png`, `${import.meta.env.BASE_URL}/assets/fx/death.json`);
        scene.load.image('black-bullet', `${import.meta.env.BASE_URL}/assets/projectiles/black-bullet.png`);
        scene.load.image('visor', `${import.meta.env.BASE_URL}/assets/tiles/visor.png`);
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
            frameRate: 15,
            repeat: 1
        });
    },

    initEnemies(
        scene: Phaser.Scene,
        map: Phaser.Tilemaps.Tilemap,
        layer: Phaser.Tilemaps.TilemapLayer,
        player: Phaser.Physics.Arcade.Image & { body: Phaser.Physics.Arcade.Body },
        enemies: Phaser.Physics.Arcade.Group,
        visors: Phaser.Physics.Arcade.StaticGroup,
        bullets: Phaser.Physics.Arcade.Group,
    ): []{
        const spawns = map.createFromObjects('Enemies', { gid: 4, key: 'soldier' });
        const visorsSpawns = map.createFromObjects('Enemies', { gid: 4, key: 'visor' });
        const enemySets = [];
        for (const spawn of spawns) {
            enemies.add(spawn);
        }
        for (const visor of visorsSpawns) {
            visors.add(visor);
        }
        spawns.forEach((enemy) => {
            const visor = visorsSpawns.find((visor) => enemy.getBounds().x === visor.getBounds().x);
            const event = scene.time.addEvent({
                paused: true,
                delay: ENEMY_FIRE_DELAY,
                startAt: ENEMY_START_FIRE_DELAY,
                callback: () => {
                    weaponComposition.fire(
                        scene,
                        bullets,
                        <Phaser.Physics.Arcade.Image & { body: Phaser.Physics.Arcade.Body }>enemy,
                        false,
                        'black-bullet'
                    );
                },
                loop: true,
            });
            const set = [enemy, visor, event];
            enemySets.push(set);
        });
        enemies.children.entries.forEach((enemy) => {
            enemy.setDisplaySize(138, 138);
            enemy.body.setSize(PLAYER_SIZE.width, 89).setImmovable();
        });
        visors.children.entries.forEach((visor) => {
            visor.setAlpha(0);
        });

        scene.physics.add.collider(player, enemies);
        scene.physics.add.collider(enemies, layer);
        scene.physics.add.overlap(player, visors);

        return enemySets;
    },

    moveEnemy(enemy: Phaser.GameObjects.GameObject, scene: Phaser.Scene) {
        enemy.anims.play('soldier-run', true);

        if (enemy.body.blocked.left) {
            enemy.flipX = true;
        } else if (enemy.body.blocked.right) {
            enemy.flipX = false;
        }

        if (enemy.flipX) {
            enemy.body.setVelocityX(ENEMY_WALK_VELOCITY);
        } else {
            enemy.body.setVelocityX(-ENEMY_WALK_VELOCITY);
        }
    },

    enemyStartFire(
        visor: Phaser.Physics.Arcade.Image & { body: Phaser.Physics.Arcade.StaticBody },
        player: Phaser.Physics.Arcade.Image & { body: Phaser.Physics.Arcade.Body },
        enemy: Phaser.Physics.Arcade.Image & { body: Phaser.Physics.Arcade.Body },
        event: Phaser.Time.TimerEvent,
    ) {
        if (this.checkOverlap(player, visor)) {
            const distance = Phaser.Math.Distance.Between(player.x, player.y, enemy.x, enemy.y);
            if ((player.x < enemy.x && !enemy.flipX) || (player.x > enemy.x && enemy.flipX) || distance <= ENEMY_DISTANCE_START_FIRE) {
                enemy.body.setVelocityX(0);
                enemy.anims.pause();

                if (player.x < enemy.x) {
                    enemy.flipX = false;
                } else {
                    enemy.flipX = true;
                }

                event.paused = false;
            }
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