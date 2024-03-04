import Phaser from "phaser";
import {PLAYER_SIZE, PLAYER_START_POSITION} from "../configs/gameplay.config.ts";
import {platformComposition} from "./platform.composition.ts";

export const playerComposition = {
    uploadPlayerAssets(scene: Phaser.Scene) {
        scene.load.image('red-bullet', '/assets/projectiles/red-bullet.png');
        scene.load.atlas('player-idle', '/assets/player/player-idle.png', '/assets/player/player-idle.json');
        scene.load.atlas('player-fly', '/assets/player/player-fly.png', '/assets/player/player-fly.json');
        scene.load.atlas('player-walk', '/assets/player/player-walk.png', '/assets/player/player-walk.json');
        scene.load.atlas('player-jump', '/assets/player/player-jump.png', '/assets/player/player-jump.json');
        scene.load.atlas('jetpack-smoke', '/assets/player/jetpack-smoke.png', '/assets/player/jetpack-smoke.json');
        scene.load.atlas('explosion', '/assets/fx/explosion.png', '/assets/fx/explosion.json');
    },

    initPlayer(scene: Phaser.Scene, layer: Phaser.Tilemaps.TilemapLayer): (Phaser.Physics.Arcade.Sprite & {
        body: Phaser.Physics.Arcade.Body
    })[] {
        const player = scene.physics.add.sprite(PLAYER_START_POSITION.x, PLAYER_START_POSITION.y, 'player-idle').setSize(PLAYER_SIZE.width, PLAYER_SIZE.height);
        const smoke = scene.physics.add.sprite(player.x, player.y, 'jetpack-smoke');

        scene.cameras.main.startFollow(player);
        scene.physics.add.collider(player, layer, null, platformComposition.collidePlatforms);

        return [player, smoke];
    },

    initPlayerAnimations(scene: Phaser.Scene) {
        scene.anims.create({
            key: 'idle',
            frames: scene.anims.generateFrameNames('player-idle',
                {
                    start: 1,
                    end: 4,
                    zeroPad: 0,
                    suffix: '.png'
                }
            ),
            frameRate: 10,
            repeat: -1
        });
        scene.anims.create({
            key: 'jetpack-smoke',
            frames: scene.anims.generateFrameNames('jetpack-smoke',
                {
                    start: 4,
                    end: 1,
                    zeroPad: 0,
                    suffix: '.png'
                }
            ),
            frameRate: 10,
            repeat: -1
        });
        scene.anims.create({
            key: 'explosion',
            frames: scene.anims.generateFrameNames('explosion',
                {
                    start: 1,
                    end: 4,
                    zeroPad: 0,
                    suffix: '.png'
                }
            ),
            frameRate: 10,
            repeat: 1
        });
        scene.anims.create({
            key: 'fly',
            frames: scene.anims.generateFrameNames('player-fly', {
                start: 1,
                end: 4,
                zeroPad: 0,
                suffix: '.png'
            }),
            frameRate: 10,
            repeat: -1
        });
        scene.anims.create({
            key: 'walk',
            frames: scene.anims.generateFrameNames('player-walk',
                {
                    start: 1,
                    end: 8,
                    zeroPad: 0,
                    suffix: '.png'
                }
            ),
            frameRate: 10,
            repeat: -1
        });
        scene.anims.create({
            key: 'jump',
            frames: scene.anims.generateFrameNames('player-jump', {
                start: 1,
                end: 3,
                zeroPad: 0,
                suffix: '.png'
            }),
            frameRate: 10,
            repeat: -1
        });
    },
}
