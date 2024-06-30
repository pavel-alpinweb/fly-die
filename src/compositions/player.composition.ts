import Phaser from "phaser";
import {
    BULLETS_VELOCITY, COIN_BOUNCE, FLY_BUTTON_DURATION, LEVEL_WIDTH,
    PLAYER_FLY_VELOCITY, PLAYER_JUMP_VELOCITY,
    PLAYER_SIZE,
    PLAYER_START_POSITION, PLAYER_WALK_VELOCITY,
    SMOKE_POSITION_MARGIN
} from "../configs/gameplay.config.ts";
import {platformComposition} from "./platform.composition.ts";
import {weaponComposition} from "./weapon.composition.ts";
import {EventBus} from "../utils/EventBus.ts";
import GameObject = Phaser.GameObjects.GameObject;
import Tilemap = Phaser.Tilemaps.Tilemap;
import TileSprite = Phaser.GameObjects.TileSprite;

export const playerComposition = {
    uploadPlayerAssets(scene: Phaser.Scene) {
        scene.load.image('red-bullet', '/assets/projectiles/red-bullet.png');
        scene.load.atlas('player-idle', '/assets/player/player-idle.png', '/assets/player/player-idle.json');
        scene.load.atlas('player-fly', '/assets/player/player-fly.png', '/assets/player/player-fly.json');
        scene.load.atlas('player-walk', '/assets/player/player-walk.png', '/assets/player/player-walk.json');
        scene.load.atlas('player-jump', '/assets/player/player-jump.png', '/assets/player/player-jump.json');
        scene.load.atlas('player-death', '/assets/player/player-death.png', '/assets/player/player-death.json');
        scene.load.atlas('jetpack-smoke', '/assets/player/jetpack-smoke.png', '/assets/player/jetpack-smoke.json');
        scene.load.atlas('explosion', '/assets/fx/explosion.png', '/assets/fx/explosion.json');
    },

    initPlayer(
        scene: Phaser.Scene,
        layer: Phaser.Tilemaps.TilemapLayer,
        backgrounds: TileSprite[]
    ): (Phaser.Physics.Arcade.Sprite & {
        body: Phaser.Physics.Arcade.Body
    })[] {
        const player = scene.physics.add.sprite(PLAYER_START_POSITION.x, PLAYER_START_POSITION.y, 'player-idle').setSize(PLAYER_SIZE.width, PLAYER_SIZE.height);
        const smoke = scene.physics.add.sprite(player.x, player.y, 'jetpack-smoke');

        scene.cameras.main.startFollow(player).setZoom(0.7);
        scene.cameras.add(LEVEL_WIDTH - 300, 0, 300, 200)
            .setZoom(0.09)
            .setBackgroundColor(0x002244)
            .startFollow(player)
            .ignore(backgrounds);

        scene.physics.add.collider(player, layer, null, platformComposition.collidePlatforms);

        return [player, smoke];
    },

    showPlayerCoords(scene: Phaser.Scene, player: Phaser.Physics.Arcade.Image & {
        body: Phaser.Physics.Arcade.Body
    }): Phaser.GameObjects.Text {
        const text = scene.add.text(16, 16, `coords: x ${player.x} / y ${player.y}`, { fontSize: '32px', fill: '#000' });
        text.scrollFactorX = 0;
        text.scrollFactorY = 0;
        return text;
    },

    updatePlayerCoords(text: Phaser.GameObjects.Text, player: Phaser.Physics.Arcade.Image & {
        body: Phaser.Physics.Arcade.Body
    }): void {
        text.setText(`coords: x ${Math.floor(player.x)} / y ${Math.floor(player.y)}`);
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
        scene.anims.create({
            key: 'game-over',
            frames: scene.anims.generateFrameNames('player-death', {
                start: 1,
                end: 3,
                zeroPad: 0,
                suffix: '.png'
            }),
            frameRate: 10,
            repeat: 1
        });
    },

    fire(
        scene: Phaser.Scene,
        bullets: Phaser.Physics.Arcade.Group,
        layer: Phaser.Tilemaps.TilemapLayer,
        player: Phaser.Physics.Arcade.Image & { body: Phaser.Physics.Arcade.Body },
    ): Phaser.Physics.Arcade.Group {
        EventBus.emit('remove-rocket');
        weaponComposition.fire(scene, bullets, player, true, 'red-bullet');
    },

    explosionOnEnemy(enemy, bullet, event, coins: Phaser.Physics.Arcade.Group) {
        bullet.setVelocity(0);
        bullet.anims.play('explosion', true);
        bullet.body.enable = false;

        event.paused = true;
        enemy.anims.play('death', true);
        enemy.body.enable = false;
        enemy.on(Phaser.Animations.Events.ANIMATION_COMPLETE, function () {
            enemy.destroy();
            const coin = coins.create(enemy.x, enemy.y - 200, 'coin');
            coin.setBounce(COIN_BOUNCE);
            coin.anims.play('coin', true);
        }, this);
    },

    gameOver(
        player: Phaser.Physics.Arcade.Image & { body: Phaser.Physics.Arcade.Body },
        smoke: Phaser.Physics.Arcade.Image & { body: Phaser.Physics.Arcade.Body },
        fuelTimer: Phaser.Time.TimerEvent,
    ) {
        player.setVelocity(0, 0);
        player.anims.play('game-over', true);
        fuelTimer.paused = true;
        smoke.visible = false;
        smoke.setVelocityY(0);
        EventBus.emit('game-over');
    },

    finishGame(
        player: Phaser.Physics.Arcade.Image & { body: Phaser.Physics.Arcade.Body },
        map: Phaser.Tilemaps.Tilemap,
        coins: Phaser.Physics.Arcade.Group,
        scene: Phaser.Scene,
    ) {
        const finishLine = map.createFromObjects('FinishLine', { gid: 6, key: 'visor' });
        finishLine[0].setAlpha(0);
        scene.physics.add.existing(finishLine[0], true);
        scene.physics.add.overlap(player, finishLine, () => {
            coins.createMultiple({
                key: 'coin',
                repeat: 5,
                setXY: {
                    x: player.x - Phaser.Math.RND.between(-1000, 1000),
                    y: player.y - Phaser.Math.RND.between(100, 500),
                    stepX: 200
                }
            });
            coins.playAnimation('coin');
            EventBus.emit('game-win');
        });
    },

    movePlayer(
        player: Phaser.Physics.Arcade.Image & {
        body: Phaser.Physics.Arcade.Body
    },
        smoke: Phaser.Physics.Arcade.Image & { body: Phaser.Physics.Arcade.Body },
        layer: Phaser.Tilemaps.TilemapLayer,
        fuelTimer: Phaser.Time.TimerEvent,
        fuel: number,
        scene: Phaser.Scene
    ): void {


        scene.physics.collide(player, layer);

        const cursors = scene.input.keyboard.createCursorKeys();
        const keys = scene.input.keyboard?.addKeys({
            a:  Phaser.Input.Keyboard.KeyCodes.A,
            d:  Phaser.Input.Keyboard.KeyCodes.D,
            w:  Phaser.Input.Keyboard.KeyCodes.W,
            space:  Phaser.Input.Keyboard.KeyCodes.SPACE
        });
        smoke.y = player.y + SMOKE_POSITION_MARGIN.VERTICAL;

        if (player.flipX) {
            smoke.x = player.x + SMOKE_POSITION_MARGIN.RIGHT;
        } else {
            smoke.x = player.x - SMOKE_POSITION_MARGIN.LEFT
        }

        if ((cursors.up.isDown || keys.w.isDown) && player.body.blocked.down) {
            player.setVelocityY(PLAYER_FLY_VELOCITY);
            smoke.setVelocityY(PLAYER_FLY_VELOCITY);
            player.anims.play('jump', true);
            smoke.visible = false;
            smoke.setVelocityX(0);
            fuelTimer.paused = true;
        } else if ((cursors.up.isDown || keys.w.isDown) && fuel > 0 && (cursors.up.getDuration() > FLY_BUTTON_DURATION || keys.w.getDuration() > FLY_BUTTON_DURATION)) {
            player.setVelocityY(PLAYER_FLY_VELOCITY);
            smoke.setVelocityY(PLAYER_FLY_VELOCITY);
            player.anims.play('fly', true);
            smoke.visible = true;
            smoke.anims.play('jetpack-smoke', true);
            fuelTimer.paused = false;
        } else if ((cursors.right.isDown || keys.d.isDown) && !player.body.blocked.down) {
            player.setVelocityX(PLAYER_JUMP_VELOCITY);
            smoke.setVelocityX(PLAYER_JUMP_VELOCITY);
            player.flipX = false;
            player.anims.play('jump', true);
            smoke.visible = false;
            smoke.setVelocityY(0);
            fuelTimer.paused = true;
        } else if ((cursors.right.isDown || keys.d.isDown) && player.body.blocked.down) {
            player.setVelocityX(PLAYER_WALK_VELOCITY);
            player.flipX = false;
            player.anims.play('walk', true);
            smoke.visible = false;
            smoke.setVelocityY(0);
            fuelTimer.paused = true;
        } else if ((cursors.left.isDown || keys.a.isDown) && player.body.blocked.down) {
            player.setVelocityX(-PLAYER_WALK_VELOCITY);
            player.flipX = true;
            player.anims.play('walk', true);
            smoke.visible = false;
            smoke.setVelocityY(0);
            fuelTimer.paused = true;
        } else if ((cursors.left.isDown || keys.a.isDown) && !player.body.blocked.down) {
            player.setVelocityX(-PLAYER_JUMP_VELOCITY);
            smoke.setVelocityX(-PLAYER_JUMP_VELOCITY);
            player.flipX = true;
            player.anims.play('jump', true);
            smoke.visible = false;
            smoke.setVelocityY(0);
            fuelTimer.paused = true;
        } else if (!player.body.blocked.down) {
            player.setVelocityX(0);
            smoke.setVelocityX(0);
            player.anims.play('jump', true);
            smoke.visible = false;
            fuelTimer.paused = true;
        } else {
            player.setVelocityX(0);
            smoke.setVelocityX(0);
            player.anims.play('idle', true);
            smoke.visible = false;
            fuelTimer.paused = true;
        }
    }
}
