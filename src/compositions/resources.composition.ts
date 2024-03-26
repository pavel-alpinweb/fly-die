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
};