class Menu extends Phaser.Scene {
    constructor() {
        super("menuScene");
    }

    preload() {
        // load audio
        this.load.audio('sfx_select', './assets/blip_select12.wav');
        this.load.audio('sfx_explosion', './assets/explosion38.wav');
        this.load.audio('sfx_rocket', './assets/rocket_shot.wav');
        this.load.spritesheet('background', './assets/the.gif', {frameWidth: 640, frameHeight: 480, startFrame: 0, endFrame: 4});
    }

    create() {
        // menu display
        let menuConfig = {
            fontFamily: 'OPTIMA',
            fontSize: '28px',
            backgroundColor: '#FF0000',
            color: '#000',
            align: 'right',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 0
        }

        // show menu text
        let centerX = game.config.width/2;
        let centerY = game.config.height/2;
        let textSpacer = 64;

        this.background = this.add.tileSprite(0, 0, 640, 450, 'background').setOrigin(0, 0);

        //this.add.text(centerX, centerY- textSpacer, 'CROSSY ROCKETS!! AVOID THE SPACESHIPS', menuConfig).setOrigin(0.5);
        //this.add.text(centerX, centerY, 'Use ←→ arrows to move and ↓ to stop', menuConfig).setOrigin(0.5);
        //menuConfig.backgroundColor = '#FF0000';
        //menuConfig.color = '#000';
        //this.add.text(centerX, centerY + textSpacer, 'Press ← for Easy or → for Hard', menuConfig).setOrigin(0.5);  
        
        // define keys
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
    }

    update() {
        if (Phaser.Input.Keyboard.JustDown(keyLEFT)) {
            // easy mode
            game.settings = {
                spaceshipSpeed: 5,
                gameTimer: 45000    
            }
            this.sound.play('sfx_select');
            this.scene.start("playScene");    
        }
        if (Phaser.Input.Keyboard.JustDown(keyRIGHT)) {
            // hard mode
            game.settings = {
                spaceshipSpeed: 7,
                gameTimer: 30000    
            }
            this.sound.play('sfx_select');
            this.scene.start("playScene");    
        }
    }
}