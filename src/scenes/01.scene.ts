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
    private map!: Phaser.Tilemaps.Tilemap
    private layer!: Phaser.Tilemaps.TilemapLayer
    private smoke!: Phaser.Physics.Arcade.Image & { body: Phaser.Physics.Arcade.Body }
    private bullets!: Phaser.Physics.Arcade.Group;
    private playerCoords!: Phaser.GameObjects.Text;

    constructor() {
        super();
    }

    preload() {
        this.load.image('sky', '/assets/backgrounds/01.png');
        this.load.image('block', '/assets/tiles/6.png');
        this.load.image('grass', '/assets/tiles/5.png');
        this.load.tilemapTiledJSON('tilemap', '/assets/tiles/LevelOneMap.json');
        playerComposition.uploadPlayerAssets(this);
    }

    create() {
        this.add.tileSprite(BACKGROUND_LAYER_WIDTH / 2, BACKGROUND_LAYER_HEIGHT / 2, BACKGROUND_LAYER_WIDTH * 3, BACKGROUND_LAYER_HEIGHT, 'sky').setScrollFactor(BACKGROUND_LAYER_ONE_SCROLL, 0);
        this.map = this.make.tilemap({key: 'tilemap'});
        this.map.setCollision([2, 1]) as Tilemap;
        const tileset = this.map.addTilesetImage('2', 'block') as Tileset;
        const tilesetGrass = this.map.addTilesetImage('1', 'grass') as Tileset;
        this.layer = this.map.createLayer('Ground', [tileset, tilesetGrass]) as TilemapLayer;

        const [player, smoke] = playerComposition.initPlayer(this, this.layer);
        this.player = player;
        this.smoke = smoke;
        playerComposition.initPlayerAnimations(this);

        this.bullets = playerComposition.fire(this, this.layer, this.player);

        this.playerCoords = playerComposition.showPlayerCoords(this, this.player);
    }

    update(time) {
        playerComposition.movePlayer(this.player, this.smoke, this.layer, this);
        playerComposition.updatePlayerCoords(this.playerCoords, this.player);
    }
}