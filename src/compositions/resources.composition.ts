import Phaser from "phaser";
import {EventBus} from "../utils/EventBus.ts";

export const resourcesComposition = {
    uploadResourcesAssets(scene: Phaser.Scene) {
        scene.load.atlas('coin', '/assets/objects/coin.png', '/assets/objects/coin.json');
    },
    initResourcesAnimations(scene: Phaser.Scene) {
        scene.anims.create({
            key: 'coin',
            frames: scene.anims.generateFrameNames('coin', {
                start: 7,
                end: 5,
                zeroPad: 0,
                suffix: '.png',
            }),
            frameRate: 5,
            repeat: -1,
        });
    },
    initFuelConsumption(scene: Phaser.Scene) {
        return scene.time.addEvent({
            paused: true,
            delay: 100,
            startAt: 1000,
            callback: () => {
                EventBus.emit('decrease-fuel');
            },
            loop: true,
        });
    },
    lostCoins(player: Phaser.Physics.Arcade.Image & { body: Phaser.Physics.Arcade.Body }, coins: Phaser.Physics.Arcade.Group, scene: Phaser.Scene) {
        const coin = coins.create(player.x, player.y, 'coin');
        coin.setBounce(0.5);
        coin.anims.play('coin', true);
        if (player.flipX) {
            coin.body.setVelocity(1000, 1000);
        } else {
            coin.body.setVelocity(-1000, -1000);
        }
        EventBus.emit('remove-coin');
    },
};