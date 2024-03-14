import Phaser from "phaser";
import {LEVEL_GRAVITY, LEVEL_HEIGHT} from "./gameplay.config.ts";

export const engineConfig = {
    type: Phaser.AUTO,
    width: window.innerWidth,
    height: LEVEL_HEIGHT,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: LEVEL_GRAVITY },
            debug: true
        }
    },
};