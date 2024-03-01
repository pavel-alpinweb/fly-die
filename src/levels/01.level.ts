import * as Phaser from "phaser";
import {engineConfig} from "../configs/engine.config.ts";
import {Level01Scene} from "../scenes/01.scene.ts";


export const useLevelOneLevel = () => {
    const gameContainer = document.getElementById('game');
    const config = {
        ...engineConfig,
        scene: Level01Scene,
        parent: gameContainer,
    }
    return new Phaser.Game(config);
}