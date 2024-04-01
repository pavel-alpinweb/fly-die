import * as Phaser from "phaser";
import {engineConfig} from "../configs/engine.config.ts";
import {Level01Scene} from "../scenes/01.scene.ts";


export const useLevelOneLevel = (resources: Resources) => {
    const gameContainer = document.getElementById('game');
    const config = {
        ...engineConfig,
        scene: new Level01Scene(resources),
        parent: gameContainer,
    }
    return new Phaser.Game(config);
}