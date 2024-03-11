import {BULLETS_VELOCITY} from "../configs/gameplay.config.ts";
import Phaser from "phaser";

export const weaponComposition = {
    fire(scene: Phaser.Scene, bullets: Phaser.Physics.Arcade.Group, body: Phaser.Physics.Arcade.Image & { body: Phaser.Physics.Arcade.Body }, isPlayer: boolean, texture: string) {
        const bullet = bullets.get();

        if (bullet) {
            let bulletX = 0;
            if (isPlayer) {
                bulletX = body.flipX ? body.x - 100 : body.x + 100;
            } else {
                bulletX = body.flipX ? body.x + 100 : body.x - 100;
            }
            const bullet = bullets.create(bulletX, body.y, texture).setBodySize(50, 50);
            const velocityX = isPlayer ? -BULLETS_VELOCITY.x : BULLETS_VELOCITY.x;
            if (body.flipX) {
                bullet.setVelocity(velocityX, BULLETS_VELOCITY.y);
                bullet.flipX = isPlayer;
            } else {
                bullet.setVelocity(-velocityX, BULLETS_VELOCITY.y);
                bullet.flipX = !isPlayer;
            }
            bullet.on(Phaser.Animations.Events.ANIMATION_COMPLETE, function () {
                const { world } = scene.physics;
                bullet.disableBody(true, true);
                bullets.remove(bullets.getLast(true), true, true);
                world.remove(bullet.body);
            }, this);
        }
    },
};