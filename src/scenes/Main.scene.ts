import * as Phaser from "phaser";

export const useMainScene = () => {
    const gameContainer = document.getElementById('game');
    let platforms;
    let player;
    let cursors;
    let stars;
    let score = 0;
    let scoreText;
    let bombs;
    let gameOver = false;
    const config = {
        type: Phaser.AUTO,
        width: 800,
        height: 600,
        parent: gameContainer,
        physics: {
            default: 'arcade',
            arcade: {
                gravity: { y: 300 },
                debug: false
            }
        },
        scene: {
            preload,
            create,
            update,
        }
    };

    function preload ()
    {
        this.load.image('sky', '/assets/backgrounds/sky.png');
        this.load.image('ground', '/assets/objects/platform.png');
        this.load.image('star', '/assets/objects/star.png');
        this.load.image('bomb', '/assets/objects/bomb.png');
        this.load.spritesheet('dude', '/assets/player/dude.png', { frameWidth: 32, frameHeight: 48 });
    }

    function create ()
    {
        this.add.image(400, 300, 'sky');

        platforms = this.physics.add.staticGroup();
        platforms.create(400, 568, 'ground').setScale(2).refreshBody();
        platforms.create(600, 400, 'ground');
        platforms.create(50, 250, 'ground');
        platforms.create(750, 220, 'ground');

        player = this.physics.add.sprite(100, 450, 'dude');
        player.setBounce(0.2);
        player.setCollideWorldBounds(true);
        player.body.setGravityY(300);

        stars = this.physics.add.group({
            key: 'star',
            repeat: 11,
            setXY: { x: 12, y: 0, stepX: 70 }
        });
        stars.children.iterate(function (child) {
            child.setBounceY(Phaser.Math.FloatBetween(0.1, 0.4));
        });

        bombs = this.physics.add.group();

        this.physics.add.collider(player, platforms);
        this.physics.add.collider(stars, platforms);
        this.physics.add.collider(bombs, platforms);
        this.physics.add.collider(player, bombs, hitBomb, null, this);

        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'turn',
            frames: [ { key: 'dude', frame: 4 } ],
            frameRate: 20
        });

        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
            frameRate: 10,
            repeat: -1
        });

        this.physics.add.overlap(player, stars, collectStar, null, this);

        scoreText = this.add.text(16, 32, 'score: 0', { fontSize: '32px', fill: '#000' });
    }

    function update ()
    {
        cursors = this.input.keyboard.createCursorKeys()
        if (cursors.left.isDown)
        {
            player.setVelocityX(-250);
            player.anims.play('left', true);
        }
        else if (cursors.right.isDown)
        {
            player.setVelocityX(250);
            player.anims.play('right', true);
        }
        else
        {
            player.setVelocityX(0);
            player.anims.play('turn');
        }
        if (cursors.up.isDown && player.body.touching.down)
        {
            player.setVelocityY(-500);
        }
    }



    function collectStar (player, star)
    {
        star.disableBody(true, true)
        score += 10;
        scoreText.setText('Score: ' + score);

        if (stars.countActive(true) === 0) {
            stars.children.iterate(function (child) {
                child.enableBody(true, child.x, 0, true, true);
            });

            const x = (player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);
            const bomb = bombs.create(x, 16, 'bomb');

            bomb.setBounce(1);
            bomb.setCollideWorldBounds(true);
            bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
        }
    }

    function hitBomb (player, bomb)
    {
        this.physics.pause();

        player.setTint(0xff0000);

        player.anims.play('turn');

        gameOver = true;
    }

    const game = new Phaser.Game(config);
};