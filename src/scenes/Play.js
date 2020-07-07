class Play extends Phaser.Scene {
    constructor() {
        super("playScene");
    }

    preload() {
        // load images/tile sprites
        this.load.image('rocket', './assets/rocketship.png');
        this.load.image('spaceship', './assets/redfighter.png');
        this.load.image('enemy', './assets/enemy.png');
        this.load.image('last', './assets/last.png');
        this.load.image('starfield', './assets/background.gif'); 
        // load spritesheet
        this.load.spritesheet('explosion', './assets/explosion.png', {frameWidth: 80, frameHeight: 40, startFrame: 0, endFrame: 9});
    }

    create() {
        // place tile sprites
        this.starfield = this.add.tileSprite(0, 0, 640, 480, 'starfield').setOrigin(0, 0);

        // white rectangle borders
        //this.add.rectangle(5, 5, 630, 32, 0xFF0000).setOrigin(0, 0);
        //this.add.rectangle(5, 443, 630, 32, 0xFF000).setOrigin(0, 0);
        //this.add.rectangle(5, 5, 32, 455, 0xFF0000).setOrigin(0, 0);
        //this.add.rectangle(603, 5, 32, 455, 0xFF0000).setOrigin(0, 0);
        // green UI background
        //this.add.rectangle(37, 42, 566, 64, 0x00FF00).setOrigin(0, 0);

        // add rocket (p1)
        this.p1Rocket = new Rocket(this, game.config.width/2 - 8, 431, 'rocket').setScale(0.75, 0.75).setOrigin(0, 0);
        

        // add spaceships (x3)
        this.ship01 = new Spaceship(this, game.config.width + 50, 25, 'last', 0, 10).setOrigin(0,0);
        this.ship02 = new Spaceship(this, game.config.width + 72, 200, 'enemy', 0, 10).setOrigin(0,0);
        this.ship03 = new Spaceship(this, game.config.width, 325, 'spaceship', 0, 10).setOrigin(0,0);

        // define keys
        keyF = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        keyDOWN = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);

        // animation config
        this.anims.create({
            key: 'explode',
            frames: this.anims.generateFrameNumbers('explosion', { start: 0, end: 9, first: 0}),
            frameRate: 25
        });

        // player 1 score
        this.p1Score = 1000;
        
        // score display
        let scoreConfig = {
            fontFamily: 'OPTIMA',
            fontSize: '28px',
            backgroundColor: '#2D3DA7',
            color: '#000',
            align: 'right',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 75
        }
        this.scoreLeft = this.add.text(30, 30, this.p1Score, scoreConfig);

        // game over flag
        this.gameOver = false;

        // 60-second play clock
        scoreConfig.fixedWidth = 0;
        if (this.p1Score > 0) {
            this.clock = this.time.delayedCall(game.settings.gameTimer, () => {
                this.add.text(game.config.width/2, game.config.height/2, 'YOU WIN!!', scoreConfig).setOrigin(0.5);
                this.add.text(game.config.width/2, game.config.height/2 + 64, '(F) to Restart or ↓ for Menu', scoreConfig).setOrigin(0.5);
                this.gameOver = true;
            }, null, this);
        }
    }
    checkY(p1Rocket, p1Score){
        if (this.p1Rocket.tilePositionX >= 60) {
            return this.p1Score += 10
        };
    }

    update() {
        // check key input for restart / menu
        if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyF)) {
            this.scene.restart();
        }
        if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyDOWN)) {
            this.scene.start("menuScene");
        }
        if (this.p1Score > 0){
            this.checkY(this.p1Rocket, this.p1Score);
        }

        this.starfield.tilePositionX += 4;  // scroll tile sprite
        if (!this.gameOver) {               
            this.p1Rocket.update();         // update rocket sprite
            this.ship01.update();           // update spaceships (x3)
            this.ship02.update();
            this.ship03.update();
        }             
        // check collisions
        if(this.checkCollision(this.p1Rocket, this.ship03)) {
            this.p1Rocket.reset();
            this.shipExplode(this.ship03);   
        }
        if (this.checkCollision(this.p1Rocket, this.ship02)) {
            this.p1Rocket.reset();
            this.shipExplode(this.ship02);
        }
        if (this.checkCollision(this.p1Rocket, this.ship01)) {
            this.p1Rocket.reset();
            this.shipExplode(this.ship01);
        }
    }

    checkCollision(rocket, ship) {
        // simple AABB checking
        if (rocket.x < ship.x + ship.width && 
            rocket.x + rocket.width > ship.x && 
            rocket.y < ship.y + ship.height &&
            rocket.height + rocket.y > ship. y) {
                return true;
        } else {
            return false;
        }
    }

    shipExplode(ship) {
        ship.alpha = 0;                         // temporarily hide ship
        // create explosion sprite at ship's position
        let boom = this.add.sprite(ship.x, ship.y, 'explosion').setOrigin(0, 0);
        boom.anims.play('explode');             // play explode animation
        boom.on('animationcomplete', () => {    // callback after animation completes
            ship.reset();                       // reset ship position
            ship.alpha = 1;                     // make ship visible again
            boom.destroy();                     // remove explosion sprite
        });
        // score increment and repaint
        this.p1Score -= ship.points;
        this.scoreLeft.text = this.p1Score;     
        // play sound
        this.sound.play('sfx_explosion');  
        let scoreConfig = {
            fontFamily: 'Optima',
            fontSize: '28px',
            backgroundColor: '#2D3DA7',
            color: '#000',
            align: 'right',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 100
        }
        if (this.p1Score <= 0) {
            scoreConfig.fixedWidth = 0;
            this.clock = this.time.delayedCall(0, () => {
                this.add.text(game.config.width/2, game.config.height/2, 'YOU LOSE', scoreConfig).setOrigin(0.5);
                this.add.text(game.config.width/2, game.config.height/2 + 64, '(F) to Restart or ↓ for Menu', scoreConfig).setOrigin(0.5);
                this.gameOver = true;
            }, null, this);
        }
    }
    
    }

