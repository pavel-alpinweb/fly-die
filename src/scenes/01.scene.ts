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
import TimerEvent = Phaser.Time.TimerEvent;
import {resourcesComposition} from "../compositions/resources.composition.ts";
import {EventBus} from "../utils/EventBus.ts";

declare global {
    interface Resources {
        fuel: number,
        rockets: number,
        coins: number,
    }
}

export class Level01Scene extends Phaser.Scene {
    private player!: Phaser.Physics.Arcade.Image & { body: Phaser.Physics.Arcade.Body }
    private map!: Phaser.Tilemaps.Tilemap
    private layer!: Phaser.Tilemaps.TilemapLayer
    private smoke!: Phaser.Physics.Arcade.Image & { body: Phaser.Physics.Arcade.Body }
    private bullets!: Phaser.Physics.Arcade.Group;
    // private playerCoords!: Phaser.GameObjects.Text;
    private enemies!: Phaser.Physics.Arcade.Group;
    private visors!: Phaser.Physics.Arcade.StaticGroup;
    private sets!: [];
    private deaths = 0;
    // private deathTest!: Phaser.GameObjects.Text;
    // private killedEnemiesText!: Phaser.GameObjects.Text;
    private killedEnemiesNumber = 0;
    private fuelConsumption!: TimerEvent;
    private resources!: Resources;
    private coins!: Phaser.Physics.Arcade.Group;

    constructor(resources: Resources) {
        super();
        this.resources = resources;
    }

    preload() {
        // Загрузка ресурсов карты
        this.load.image('sky', '/assets/backgrounds/01.png');
        this.load.image('block', '/assets/tiles/block.png');
        this.load.image('ground', '/assets/tiles/ground.png');
        this.load.tilemapTiledJSON('tilemap', '/assets/tiles/DemoLevel.json');
        // Загрузка ресурсов игрока и врагов
        playerComposition.uploadPlayerAssets(this);
        enemiesComposition.uploadEnemiesAssets(this);
        resourcesComposition.uploadResourcesAssets(this);
    }

    create() {
        // Создание уровня
        this.add.tileSprite(BACKGROUND_LAYER_WIDTH / 2, BACKGROUND_LAYER_HEIGHT / 2, BACKGROUND_LAYER_WIDTH * 3, BACKGROUND_LAYER_HEIGHT, 'sky').setScrollFactor(BACKGROUND_LAYER_ONE_SCROLL, 0);
        this.map = this.make.tilemap({key: 'tilemap'});
        this.map.setCollision([2, 1]);
        const block = this.map.addTilesetImage('block', 'block') as Tileset;
        const ground = this.map.addTilesetImage('ground', 'ground') as Tileset;
        this.layer = this.map.createLayer('Platforms', [block, ground]) as TilemapLayer;

        // Создание игрока и дыма от джетпака
        const [player, smoke] = playerComposition.initPlayer(this, this.layer);
        this.player = player;
        this.smoke = smoke;

        // Создание анимаций
        playerComposition.initPlayerAnimations(this);
        enemiesComposition.initEnemiesAnimations(this);
        resourcesComposition.initResourcesAnimations(this);

        // Создание визоров, врагов и пуль
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

        // Создание монет
        this.coins = this.physics.add.group();
        this.physics.add.collider(this.coins, this.layer);

        // Стрельба по врагу и наоборот, стрельба по платформам
        playerComposition.fire(this, this.bullets, this.layer, this.player, this.resources);
        this.physics.add.collider(this.bullets, this.layer, null, platformComposition.explosionOnPlatform);
        for (const set of this.sets) {
            const [enemy, visor, event] = set;
            this.physics.add.collider(this.bullets, enemy, null, (...args) => {
                this.killedEnemiesNumber += 1;
                playerComposition.explosionOnEnemy(...args, event);
            });
        }
        this.physics.add.collider(this.bullets, this.player, null, (...args) => {
            resourcesComposition.lostCoins(this.player, this.coins);
            enemiesComposition.explosionOnPlayer(...args);
        });

        // Вывод координат игрока
        // this.playerCoords = playerComposition.showPlayerCoords(this, this.player);
        // Выводим сколько раз попадали по игроку и по врагам
        // this.deathTest = playerComposition.showPlayerDeath(this, this.deaths);
        // this.killedEnemiesText = enemiesComposition.showEnemiesDeath(this, this.killedEnemiesNumber, this.sets.length);

        //Создаем таймер для расхода топлива
        this.fuelConsumption = resourcesComposition.initFuelConsumption(this);
        EventBus.on('set-fuel', (resources: Resources) => {
            this.resources = resources;
        });
    }

    update(time) {
        // Передвижение игрока
        playerComposition.movePlayer(this.player, this.smoke, this.layer, this.fuelConsumption, this.resources.fuel, this);
        // Обновление координат игрока
        // playerComposition.updatePlayerCoords(this.playerCoords, this.player);
        // Обновляем количество смертей игрока и врагов
        // playerComposition.updatePlayerDeath(this.deathTest, this.deaths);
        // enemiesComposition.updateEnemiesDeath(this.killedEnemiesText, this.killedEnemiesNumber, this.sets.length);
        // Передвижение врага и реакция на игрока
        for (const set of this.sets) {
            const [enemy, visor, event] = set;
            if (enemy.texture.key !== 'death') {
                enemiesComposition.moveEnemy(enemy, this);
                enemiesComposition.enemyStartFire(visor, this.player, enemy, event);
            }
        }
    }
}