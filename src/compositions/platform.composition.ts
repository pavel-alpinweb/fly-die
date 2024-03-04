import {PLATFORM_REBOUND_VELOCITY} from "../configs/gameplay.config.ts";

export const platformComposition = {
    explosionOnPlatform(bullet) {
        bullet.anims.play('explosion', true);
        bullet.body.enable = false;
    },

    collidePlatforms(player) {
        player.setVelocityY(PLATFORM_REBOUND_VELOCITY);
    },

    uploadPlatformAssets(scene: Phaser.Scene) {
        scene.load.image('sky', '/assets/backgrounds/01.png');
        scene.load.image('ground01', '/assets/tiles/ground01.png');
        scene.load.tilemapTiledJSON('tilemap', '/assets/tiles/LevelOneMap.json');
    }
};