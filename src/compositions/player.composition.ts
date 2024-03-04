export const playerComposition = {
    uploadPlayerAssets(scene: Phaser.Scene) {
        scene.load.image('red-bullet', '/assets/projectiles/red-bullet.png');
        scene.load.atlas('player-idle', '/assets/player/player-idle.png', '/assets/player/player-idle.json');
        scene.load.atlas('player-fly', '/assets/player/player-fly.png', '/assets/player/player-fly.json');
        scene.load.atlas('player-walk', '/assets/player/player-walk.png', '/assets/player/player-walk.json');
        scene.load.atlas('player-jump', '/assets/player/player-jump.png', '/assets/player/player-jump.json');
        scene.load.atlas('jetpack-smoke', '/assets/player/jetpack-smoke.png', '/assets/player/jetpack-smoke.json');
        scene.load.atlas('explosion', '/assets/fx/explosion.png', '/assets/fx/explosion.json');
    },
}
