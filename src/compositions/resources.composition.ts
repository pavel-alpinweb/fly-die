import Phaser from "phaser";
import {EventBus} from "../utils/EventBus.ts";

export const ResourcesComposition = {
    initFuelConsumption(scene: Phaser.Scene) {
        return scene.time.addEvent({
            paused: true,
            delay: 100,
            startAt: 100,
            callback: () => {
                EventBus.emit('decrease-fuel');
            },
            loop: true,
        });
    },
};