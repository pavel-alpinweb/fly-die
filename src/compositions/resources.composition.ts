import Phaser from "phaser";
import {EventBus} from "../utils/EventBus.ts";

export const ResourcesComposition = {
    initFuelConsumption(scene: Phaser.Scene) {
        return scene.time.addEvent({
            paused: true,
            delay: 500,
            callback: () => {
                EventBus.emit('decrease-fuel');
            },
            loop: true,
        });
    },
};