import * as Phaser from "phaser";
import Tileset = Phaser.Tilemaps.Tileset;
import TilemapLayer = Phaser.Tilemaps.TilemapLayer;
import {
    BACKGROUND_LAYER_HEIGHT,
    BACKGROUND_LAYER_ONE_SCROLL,
    BACKGROUND_LAYER_WIDTH,
} from "../configs/gameplay.config.ts";
import {platformComposition} from "../compositions/platform.composition.ts";
import {playerComposition} from "../compositions/player.composition.ts";
import {enemiesComposition} from "../compositions/enemies.composition.ts";
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
    private fuelConsumption!: TimerEvent;
    private resources!: Resources;
    private coins!: Phaser.Physics.Arcade.Group;
    private isGameOver = false;

    constructor(resources: Resources) {
        super();
        this.resources = resources;
    }

    preload() {
        // Загрузка ресурсов карты
        this.load.image('sky', '/assets/backgrounds/bg.png');
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
        this.add.tileSprite(
            BACKGROUND_LAYER_WIDTH / 2,
            BACKGROUND_LAYER_HEIGHT / 2.5,
            BACKGROUND_LAYER_WIDTH * 4,
            BACKGROUND_LAYER_HEIGHT,
            'sky'
        )
            .setScrollFactor(BACKGROUND_LAYER_ONE_SCROLL, 0);
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

        // Создание и поднятие монет
        this.coins = this.physics.add.group();
        this.physics.add.collider(this.coins, this.layer);
        resourcesComposition.spawnCoin(this.coins, this.map);
        resourcesComposition.collectCoin(this, this.player, this.coins);

        // Стрельба по врагу и наоборот, стрельба по платформам
        const spaceBar = this.input.keyboard?.addKey('space');
        spaceBar.on('up', () => {
            if (this.resources.rockets > 0 && !this.isGameOver) {
                playerComposition.fire(this, this.bullets, this.layer, this.player);
            }
        });

        this.physics.add.collider(this.bullets, this.layer, null, platformComposition.explosionOnPlatform);
        for (const set of this.sets) {
            const [enemy, visor, event] = set;
            this.physics.add.collider(this.bullets, enemy, null, (...args) => {
                playerComposition.explosionOnEnemy(...args, event, this.coins);
            });
        }
        this.physics.add.collider(this.bullets, this.player, null, (...args) => {
            if (this.resources.coins === 0) {
                this.isGameOver = true;
            } else {
                resourcesComposition.lostCoins(this.player, this.coins, this.resources.coins);
            }
            enemiesComposition.explosionOnPlayer(...args);
        });

        // Вывод координат игрока
        // this.playerCoords = playerComposition.showPlayerCoords(this, this.player);

        //Создаем таймер для расхода топлива
        this.fuelConsumption = resourcesComposition.initFuelConsumption(this);
        EventBus.on('set-resources', (resources: Resources) => {
            this.resources.coins = resources.coins;
            this.resources.fuel = resources.fuel;
            this.resources.rockets = resources.rockets;
        });

        //Заверешение игры
        playerComposition.finishGame(this.player, this.map, this.coins, this);
    }

    update(time) {
        // Передвижение игрока или смерть
        if (!this.isGameOver) {
            playerComposition.movePlayer(this.player, this.smoke, this.layer, this.fuelConsumption, this.resources.fuel, this);
        } else {
            playerComposition.gameOver(this.player, this.smoke, this.fuelConsumption);
        }
        // Обновление координат игрока
        // playerComposition.updatePlayerCoords(this.playerCoords, this.player);
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