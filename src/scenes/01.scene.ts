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
import {weaponComposition} from "../compositions/weapon.composition.ts";

export class Level01Scene extends Phaser.Scene {
    private player!: Phaser.Physics.Arcade.Image & { body: Phaser.Physics.Arcade.Body }
    private map!: Phaser.Tilemaps.Tilemap
    private layer!: Phaser.Tilemaps.TilemapLayer
    private smoke!: Phaser.Physics.Arcade.Image & { body: Phaser.Physics.Arcade.Body }
    private bullets!: Phaser.Physics.Arcade.Group;
    private playerCoords!: Phaser.GameObjects.Text;
    // Поля, для врага, визора и события стрельбы
    // private enemy!: Phaser.Physics.Arcade.Image & { body: Phaser.Physics.Arcade.Body };
    // private visor!: Phaser.Physics.Arcade.Image & { body: Phaser.Physics.Arcade.StaticBody };
    // private event!: Phaser.Time.TimerEvent;
    private enemies!: Phaser.Physics.Arcade.Group;

    constructor() {
        super();
    }

    preload() {
        this.load.image('sky', '/assets/backgrounds/01.png');
        this.load.image('block', '/assets/tiles/block.png');
        this.load.image('ground', '/assets/tiles/ground.png');
        this.load.image('visor', '/assets/tiles/visor.jpg');
        this.load.tilemapTiledJSON('tilemap', '/assets/tiles/DemoLevel.json');
        playerComposition.uploadPlayerAssets(this);
        enemiesComposition.uploadEnemiesAssets(this);
    }

    create() {
        this.add.tileSprite(BACKGROUND_LAYER_WIDTH / 2, BACKGROUND_LAYER_HEIGHT / 2, BACKGROUND_LAYER_WIDTH * 3, BACKGROUND_LAYER_HEIGHT, 'sky').setScrollFactor(BACKGROUND_LAYER_ONE_SCROLL, 0);
        this.map = this.make.tilemap({key: 'tilemap'});
        this.map.setCollision([2, 1]);
        const block = this.map.addTilesetImage('block', 'block') as Tileset;
        const ground = this.map.addTilesetImage('ground', 'ground') as Tileset;
        this.layer = this.map.createLayer('Platforms', [block, ground]) as TilemapLayer;

        const [player, smoke] = playerComposition.initPlayer(this, this.layer);
        this.player = player;
        this.smoke = smoke;
        // Создание визора и врага
        // this.enemy = enemiesComposition.initEnemy(this, this.layer);
        // this.visor = enemiesComposition.initEnemyVisor(this, this.enemy);

        // Столкновение с врагом и пересечение визора игроком
        // this.physics.add.overlap(this.player, this.visor);
        const spawns = this.map.createFromObjects('Enemies', { gid: 3, key: 'soldier' });
        this.enemies = this.physics.add.group();
        for (const spawn of spawns) {
            this.enemies.add(spawn)
        }
        this.enemies.children.entries.forEach((enemy) => {
            enemy.body.setSize(PLAYER_SIZE.width, 89);
        });
        this.physics.add.collider(this.player, this.enemies);
        this.physics.add.collider(this.enemies, this.layer);

        playerComposition.initPlayerAnimations(this);
        enemiesComposition.initEnemiesAnimations(this);

        this.bullets = this.physics.add.group();
        this.physics.add.collider(this.bullets, this.layer, null, platformComposition.explosionOnPlatform);
        // Стрельба по врагу и наоборот
        // this.physics.add.collider(this.bullets, this.enemy, null, (...args) => playerComposition.explosionOnEnemy(...args, this.event));
        // this.physics.add.collider(this.bullets, this.player, null, enemiesComposition.explosionOnPlayer);
        // playerComposition.fire(this, this.bullets, this.layer, this.player, this.enemy);

        // Событие стерльбы для врага
        // this.event = this.time.addEvent({
        //     paused: true,
        //     delay: 750,
        //     callback: () => {
        //         weaponComposition.fire(this, this.bullets, this.enemy, false, 'black-bullet');
        //     },
        //     loop: true,
        // });

        this.playerCoords = playerComposition.showPlayerCoords(this, this.player);


    }

    update(time) {
        playerComposition.movePlayer(this.player, this.smoke, this.layer, this);
        playerComposition.updatePlayerCoords(this.playerCoords, this.player);
        // Передвижение врага и реакция на игрока
        // if (this.enemy.texture.key !== 'death') {
        //     enemiesComposition.moveEnemy(this.enemy, this.layer, this);
        //     enemiesComposition.enemyFire(this.visor, this.player, this.enemy, this.event);
        // }
        this.enemies.children.entries.forEach((enemy) => {
            if (enemy.texture.key !== 'death') {
                enemiesComposition.moveEnemy(enemy, this);
            }
        });
    }
}