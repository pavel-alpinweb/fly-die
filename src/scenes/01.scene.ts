import * as Phaser from "phaser";
import Tileset = Phaser.Tilemaps.Tileset;
import TilemapLayer = Phaser.Tilemaps.TilemapLayer;
import Tilemap = Phaser.Tilemaps.Tilemap;
import {
    BACKGROUND_LAYER_HEIGHT, BACKGROUND_LAYER_ONE_SCROLL,
    BACKGROUND_LAYER_WIDTH, BULLETS_VELOCITY, PLAYER_FLY_VELOCITY, PLAYER_JUMP_VELOCITY,
    PLAYER_SIZE,
    PLAYER_START_POSITION, PLAYER_WALK_VELOCITY, SMOKE_POSITION_MARGIN
} from "../configs/gameplay.config.ts";
import {platformComposition} from "../compositions/platform.composition.ts";
import {playerComposition} from "../compositions/player.composition.ts";

export class Level01Scene extends Phaser.Scene {
    private player!: Phaser.Physics.Arcade.Image & { body: Phaser.Physics.Arcade.Body }
    private cursors!: Phaser.Input.Keyboard.KeyboardManager
    private map!: Phaser.Tilemaps.Tilemap
    private layer!: Phaser.Tilemaps.TilemapLayer
    private smoke!: Phaser.Physics.Arcade.Image & { body: Phaser.Physics.Arcade.Body }
    private bullets: Phaser.Physics.Arcade.Group;

    constructor() {
        super();
    }

    preload() {
        this.load.image('sky', '/assets/backgrounds/01.png');
        this.load.image('ground01', '/assets/tiles/ground01.png');
        this.load.tilemapTiledJSON('tilemap', '/assets/tiles/LevelOneMap.json');
        playerComposition.uploadPlayerAssets(this);
    }

    create() {
        this.map = this.make.tilemap({key: 'tilemap'});
        const tileset = this.map.addTilesetImage('ground01', 'ground01') as Tileset;
        this.add.tileSprite(BACKGROUND_LAYER_WIDTH / 2, BACKGROUND_LAYER_HEIGHT / 2, BACKGROUND_LAYER_WIDTH * 3, BACKGROUND_LAYER_HEIGHT, 'sky').setScrollFactor(BACKGROUND_LAYER_ONE_SCROLL, 0);
        this.layer = this.map.createLayer('Ground', tileset) as TilemapLayer;
        this.map.setCollision([1]) as Tilemap;

        const [player, smoke] = playerComposition.initPlayer(this, this.layer);
        this.player = player;
        this.smoke = smoke;

        this.bullets = this.physics.add.group();
        this.physics.add.collider(this.bullets, this.layer, null, platformComposition.explosionOnPlatform);

        playerComposition.initPlayerAnimations(this);

        const spaceBar = this.input.keyboard?.addKey('space');
        spaceBar.on('up', () => {
            const bullet = this.bullets.get();

            if (bullet) {
                const bullet = this.bullets.create(this.player.x + 45, this.player.y, 'red-bullet');
                if (this.player.flipX) {
                    bullet.setVelocity(-BULLETS_VELOCITY.x, BULLETS_VELOCITY.y);
                    bullet.flipX = true;
                } else {
                    bullet.setVelocity(BULLETS_VELOCITY.x, BULLETS_VELOCITY.y);
                }
                bullet.on(Phaser.Animations.Events.ANIMATION_COMPLETE, function () {
                    bullet.disableBody(true, true);
                }, this);
            }
        });
    }

    update(time) {
        this.cursors = this.input.keyboard.createCursorKeys();
        const keys = this.input.keyboard?.addKeys({
            a:  Phaser.Input.Keyboard.KeyCodes.A,
            d:  Phaser.Input.Keyboard.KeyCodes.D,
            w:  Phaser.Input.Keyboard.KeyCodes.W
        });
        this.physics.collide(this.player, this.layer);
        this.smoke.y = this.player.y + SMOKE_POSITION_MARGIN.VERTICAL;

        if (this.player.flipX) {
            this.smoke.x = this.player.x + SMOKE_POSITION_MARGIN.RIGHT;
        } else {
            this.smoke.x = this.player.x - SMOKE_POSITION_MARGIN.LEFT
        }

        if (this.cursors.up.isDown || keys.w.isDown) {
            this.player.setVelocityY(PLAYER_FLY_VELOCITY);
            this.smoke.setVelocityY(PLAYER_FLY_VELOCITY);
            this.player.anims.play('fly', true);
            this.smoke.visible = true;
            this.smoke.anims.play('jetpack-smoke', true);
        } else if ((this.cursors.right.isDown || keys.d.isDown) && !this.player.body.blocked.down) {
            this.player.setVelocityX(PLAYER_JUMP_VELOCITY);
            this.smoke.setVelocityX(PLAYER_JUMP_VELOCITY);
            this.player.flipX = false;
            this.player.anims.play('jump', true);
            this.smoke.visible = false;
            this.smoke.setVelocityY(0);
        } else if ((this.cursors.right.isDown || keys.d.isDown) && this.player.body.blocked.down) {
            this.player.setVelocityX(PLAYER_WALK_VELOCITY);
            this.player.flipX = false;
            this.player.anims.play('walk', true);
            this.smoke.visible = false;
            this.smoke.setVelocityY(0);
        } else if ((this.cursors.left.isDown || keys.a.isDown) && this.player.body.blocked.down) {
            this.player.setVelocityX(-PLAYER_WALK_VELOCITY);
            this.player.flipX = true;
            this.player.anims.play('walk', true);
            this.smoke.visible = false;
            this.smoke.setVelocityY(0);
        } else if ((this.cursors.left.isDown || keys.a.isDown) && !this.player.body.blocked.down) {
            this.player.setVelocityX(-PLAYER_JUMP_VELOCITY);
            this.smoke.setVelocityX(-PLAYER_JUMP_VELOCITY);
            this.player.flipX = true;
            this.player.anims.play('jump', true);
            this.smoke.visible = false;
            this.smoke.setVelocityY(0);
        } else if (!this.player.body.blocked.down) {
            this.player.setVelocityX(0);
            this.smoke.setVelocityX(0);
            this.player.anims.play('jump', true);
            this.smoke.visible = false;
        } else {
            this.player.setVelocityX(0);
            this.smoke.setVelocityX(0);
            this.player.anims.play('idle', true);
            this.smoke.visible = false;
        }
    }
}