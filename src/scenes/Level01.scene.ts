import * as Phaser from "phaser";
import Tileset = Phaser.Tilemaps.Tileset;
import TilemapLayer = Phaser.Tilemaps.TilemapLayer;
import Tilemap = Phaser.Tilemaps.Tilemap;

function explosionOnPlatform(bullet) {
    bullet.anims.play('explosion', true);
    bullet.body.enable = false;
}

function collidePlatforms(player) {
    player.setVelocityY(-500);
}

class GameScene extends Phaser.Scene {
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
        this.load.image('red-bullet', '/assets/projectiles/red-bullet.png');
        this.load.atlas('player-idle', '/assets/player/player-idle.png', '/assets/player/player-idle.json');
        this.load.atlas('player-fly', '/assets/player/player-fly.png', '/assets/player/player-fly.json');
        this.load.atlas('player-walk', '/assets/player/player-walk.png', '/assets/player/player-walk.json');
        this.load.atlas('player-jump', '/assets/player/player-jump.png', '/assets/player/player-jump.json');
        this.load.atlas('jetpack-smoke', '/assets/player/jetpack-smoke.png', '/assets/player/jetpack-smoke.json');
        this.load.atlas('explosion', '/assets/fx/explosion.png', '/assets/fx/explosion.json');
        this.load.tilemapTiledJSON('tilemap', '/assets/tiles/LevelOneMap.json');
    }

     create() {
        this.map = this.make.tilemap({key: 'tilemap'})
        const tileset = this.map.addTilesetImage('ground01', 'ground01') as Tileset;
        this.add.tileSprite(2346 / 2, 1119 / 2, 2346 * 3, 1119, 'sky').setScrollFactor(0.5, 0);
         this.player = this.physics.add.sprite(450, 450, 'player-idle').setSize(115, 108);
         this.smoke = this.physics.add.sprite(this.player.x, this.player.y, 'jetpack-smoke');
         this.layer = this.map.createLayer('Ground', tileset) as TilemapLayer;
         this.map.setCollision([1]) as Tilemap;
         this.bullets = this.physics.add.group();

         this.physics.add.collider(this.bullets, this.layer, null, explosionOnPlatform);


         this.physics.add.collider(this.player, this.layer, null, collidePlatforms);

         this.cameras.main.startFollow(this.player);

         this.anims.create({
             key: 'idle',
             frames: this.anims.generateFrameNames('player-idle',
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
         this.anims.create({
             key: 'jetpack-smoke',
             frames: this.anims.generateFrameNames('jetpack-smoke',
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
         this.anims.create({
             key: 'explosion',
             frames: this.anims.generateFrameNames('explosion',
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
         this.anims.create({
             key: 'fly',
             frames: this.anims.generateFrameNames('player-fly', {
                 start: 1,
                 end: 4,
                 zeroPad: 0,
                 suffix: '.png'
             }),
             frameRate: 10,
             repeat: -1
         });
         this.anims.create({
             key: 'walk',
             frames: this.anims.generateFrameNames('player-walk',
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
         this.anims.create({
             key: 'jump',
             frames: this.anims.generateFrameNames('player-jump', {
                 start: 1,
                 end: 3,
                 zeroPad: 0,
                 suffix: '.png'
             }),
             frameRate: 10,
             repeat: -1
         });
         const spaceBar = this.input.keyboard?.addKey('space');
         spaceBar.on('up', () => {
             const bullet = this.bullets.get();

             if (bullet) {
                 const bullet = this.bullets.create(this.player.x + 45, this.player.y, 'red-bullet');
                 if (this.player.flipX) {
                     bullet.setVelocity(-1800, -200);
                     bullet.flipX = true;
                 } else {
                     bullet.setVelocity(1800, -200);
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
         this.smoke.y = this.player.y + 120;

         if (this.player.flipX) {
             this.smoke.x = this.player.x + 35;
         } else {
             this.smoke.x = this.player.x - 45
         }

         if (this.cursors.up.isDown || keys.w.isDown) {
             this.player.setVelocityY(-500);
             this.smoke.setVelocityY(-500);
             this.player.anims.play('fly', true);
             this.smoke.visible = true;
             this.smoke.anims.play('jetpack-smoke', true);
         } else if ((this.cursors.right.isDown || keys.d.isDown) && !this.player.body.blocked.down) {
             this.player.setVelocityX(300);
             this.smoke.setVelocityX(300);
             this.player.flipX = false;
             this.player.anims.play('jump', true);
             this.smoke.visible = false;
             this.smoke.setVelocityY(0);
         } else if ((this.cursors.right.isDown || keys.d.isDown) && this.player.body.blocked.down) {
             this.player.setVelocityX(500);
             this.smoke.setVelocityX(500);
             this.player.flipX = false;
             this.player.anims.play('walk', true);
             this.smoke.visible = false;
             this.smoke.setVelocityY(0);
         } else if ((this.cursors.left.isDown || keys.a.isDown) && this.player.body.blocked.down) {
             this.player.setVelocityX(-500);
             this.smoke.setVelocityX(-500);
             this.player.flipX = true;
             this.player.anims.play('walk', true);
             this.smoke.visible = false;
             this.smoke.setVelocityY(0);
         } else if ((this.cursors.left.isDown || keys.a.isDown) && !this.player.body.blocked.down) {
             this.player.setVelocityX(-300);
             this.smoke.setVelocityX(-300);
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

export const useLevelOneScene = () => {
    const gameContainer = document.getElementById('game');

    const config = {
        type: Phaser.AUTO,
        width: window.innerWidth,
        height: 1119,
        parent: gameContainer,
        physics: {
            default: 'arcade',
            arcade: {
                gravity: { y: 1000 },
                debug: false
            }
        },
        scene: GameScene
    };

    return new Phaser.Game(config);
}