import Phaser from "phaser";
import {EventBus} from "../utils/EventBus.ts";
import {COIN_BOUNCE, COIN_VELOCITY} from "../configs/gameplay.config.ts";

export const resourcesComposition = {
    uploadResourcesAssets(scene: Phaser.Scene) {
        scene.load.atlas('coin', `${import.meta.env.BASE_URL}/assets/objects/coin.png`, `${import.meta.env.BASE_URL}/assets/objects/coin.json`);
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
    lostCoins(player: Phaser.Physics.Arcade.Image & { body: Phaser.Physics.Arcade.Body }, coins: Phaser.Physics.Arcade.Group, coinsNumber: number) {
        if (coinsNumber > 0) {
            const coin = coins.create(player.x, player.y - 200, 'coin');
            coin.setBounce(COIN_BOUNCE);
            coin.anims.play('coin', true);
            if (player.flipX) {
                coin.body.setVelocity(COIN_VELOCITY, COIN_VELOCITY);
            } else {
                coin.body.setVelocity(-COIN_VELOCITY, -COIN_VELOCITY);
            }
            EventBus.emit('remove-coin');
        }
    },
    collectCoin(scene: Phaser.Scene, player: Phaser.Physics.Arcade.Image & { body: Phaser.Physics.Arcade.Body }, coins: Phaser.Physics.Arcade.Group) {
        scene.physics.add.overlap(player, coins, (player, coin) => {
            coin.disableBody(true, true);
            EventBus.emit('collect-coin');
        }, null);
    },
    spawnCoin(coins: Phaser.Physics.Arcade.Group, map: Phaser.Tilemaps.Tilemap) {
        const coinsSpawns = map.createFromObjects('Coins', { gid: 5, key: 'coin' });
        for (const coin of coinsSpawns) {
            const createdCoin = coins.create(coin.x, coin.y, 'coin');
            createdCoin.anims.play('coin', true);
            coin.destroy();
        }
    },
};