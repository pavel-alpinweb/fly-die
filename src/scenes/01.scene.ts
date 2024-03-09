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
import {enemiesComposition} from "../compositions/enemies.composition.ts";

export class Level01Scene extends Phaser.Scene {
    private player!: Phaser.Physics.Arcade.Image & { body: Phaser.Physics.Arcade.Body }
    private map!: Phaser.Tilemaps.Tilemap
    private layer!: Phaser.Tilemaps.TilemapLayer
    private smoke!: Phaser.Physics.Arcade.Image & { body: Phaser.Physics.Arcade.Body }
    private bullets!: Phaser.Physics.Arcade.Group;
    private playerCoords!: Phaser.GameObjects.Text;
    private enemy!: Phaser.Physics.Arcade.Image & { body: Phaser.Physics.Arcade.Body };
    private visor!: Phaser.Physics.Arcade.Image & { body: Phaser.Physics.Arcade.StaticBody };
    private event!: Phaser.Time.TimerEvent;

    constructor() {
        super();
    }

    preload() {
        this.load.image('sky', '/assets/backgrounds/01.png');
        this.load.image('block', '/assets/tiles/6.png');
        this.load.image('grass', '/assets/tiles/5.png');
        this.load.image('visor', '/assets/tiles/visor.jpg');
        this.load.tilemapTiledJSON('tilemap', '/assets/tiles/LevelOneMap.json');
        playerComposition.uploadPlayerAssets(this);
        enemiesComposition.uploadEnemiesAssets(this);
    }

    create() {
        this.add.tileSprite(BACKGROUND_LAYER_WIDTH / 2, BACKGROUND_LAYER_HEIGHT / 2, BACKGROUND_LAYER_WIDTH * 3, BACKGROUND_LAYER_HEIGHT, 'sky').setScrollFactor(BACKGROUND_LAYER_ONE_SCROLL, 0);
        this.map = this.make.tilemap({key: 'tilemap'});
        this.map.setCollision([2, 1]);
        const block = this.map.addTilesetImage('2', 'block') as Tileset;
        const grass = this.map.addTilesetImage('1', 'grass') as Tileset;
        this.layer = this.map.createLayer('Ground', [block, grass]) as TilemapLayer;

        const [player, smoke] = playerComposition.initPlayer(this, this.layer);
        this.player = player;
        this.smoke = smoke;
        this.enemy = enemiesComposition.initEnemy(this, this.layer);
        this.visor = enemiesComposition.initEnemyVisor(this, this.enemy);

        this.physics.add.overlap(this.player, this.visor);
        this.physics.add.collider(this.player, this.enemy);

        playerComposition.initPlayerAnimations(this);
        enemiesComposition.initEnemiesAnimations(this);

        this.bullets = playerComposition.fire(this, this.layer, this.player, this.enemy);

        this.event = this.time.addEvent({
            paused: true,
            delay: 750,
            callback: () => {
                this.physics.add.collider(this.bullets, this.player, null, enemiesComposition.explosionOnPlayer);
                const bullet = this.bullets.get();
                if (bullet) {
                    const bullet = this.bullets.create(this.enemy.x + 45, this.enemy.y, 'red-bullet');
                    if (this.enemy.flipX) {
                        bullet.setVelocity(BULLETS_VELOCITY.x, BULLETS_VELOCITY.y);
                        bullet.flipX = false;
                    } else {
                        bullet.setVelocity(-BULLETS_VELOCITY.x, BULLETS_VELOCITY.y);
                        bullet.flipX = true;
                    }
                    bullet.on(Phaser.Animations.Events.ANIMATION_COMPLETE, function () {
                        bullet.disableBody(true, true);
                        this.bullets.remove(this.bullets.getLast(true), true);
                    }, this);
                }
            },
            loop: true,
        });

        this.playerCoords = playerComposition.showPlayerCoords(this, this.player);


    }

    update(time) {
        playerComposition.movePlayer(this.player, this.smoke, this.layer, this);
        playerComposition.updatePlayerCoords(this.playerCoords, this.player);
        enemiesComposition.moveEnemy(this.enemy, this.layer, this);
        enemiesComposition.enemyFire(this.visor, this.player, this.enemy, this.event);
    }
}