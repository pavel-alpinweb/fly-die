import {PLATFORM_REBOUND_VELOCITY} from "../configs/gameplay.config.ts";

export const platformComposition = {
    explosionOnPlatform(bullet) {
        bullet.anims.play('explosion', true);
        bullet.body.enable = false;
    },

    collidePlatforms(player) {
        player.setVelocityY(PLATFORM_REBOUND_VELOCITY);
    }
};