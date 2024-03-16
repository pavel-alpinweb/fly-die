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
    private enemies!: Phaser.Physics.Arcade.Group;
    private visors!: Phaser.Physics.Arcade.StaticGroup;
    private sets!: [];

    constructor() {
        super();
    }

    preload() {
        this.load.image('sky', '/assets/backgrounds/01.png');
        this.load.image('block', '/assets/tiles/block.png');
        this.load.image('ground', '/assets/tiles/ground.png');
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

        // Столкновение с врагом и пересечение визора игроком

        playerComposition.initPlayerAnimations(this);
        enemiesComposition.initEnemiesAnimations(this);

        // Создание визоров и врагов
        this.enemies = this.physics.add.group();
        this.visors = this.physics.add.staticGroup();
        this.bullets = this.physics.add.group();
        this.physics.add.overlap(this.player, this.visors);

        this.sets = enemiesComposition.initEnemies(
            this,
            this.map,
            this.layer,
            this.player,
            this.enemies,
            this.visors,
            this.bullets
        );
        this.physics.add.collider(this.bullets, this.layer, null, platformComposition.explosionOnPlatform);
        playerComposition.fire(this, this.bullets, this.layer, this.player);
        for (const set of this.sets) {
            const [enemy, visor, event] = set;
            this.physics.add.collider(this.bullets, enemy, null, (...args) => playerComposition.explosionOnEnemy(...args, event));
        }

        // Стрельба по врагу и наоборот
        this.physics.add.collider(this.bullets, this.player, null, enemiesComposition.explosionOnPlayer);

        this.playerCoords = playerComposition.showPlayerCoords(this, this.player);


    }

    update(time) {
        playerComposition.movePlayer(this.player, this.smoke, this.layer, this);
        playerComposition.updatePlayerCoords(this.playerCoords, this.player);
        // Передвижение врага и реакция на игрока
        for (const set of this.sets) {
            const [enemy, visor, event] = set;
            if (enemy.texture.key !== 'death') {
                enemiesComposition.moveEnemy(enemy, this);
                enemiesComposition.enemyFire(visor, this.player, enemy, event);
            }
        }
    }
}