let config = {  //Jaedon Lee
    type: Phaser.AUTO,
    width: 640,
    height: 480,
    scene: [ Menu, Play ]
}

// main game object
let game = new Phaser.Game(config);

//define game settings
game.settings = {
    spaceshipSpeed: 5, 
    gameTimer: 45000
}
// reserve keyboard vars 
let keyF, keyLEFT, keyRIGHT, keyDOWN;
// Create new scrolling tile sprite for background (10)
//Allow player to control rocket after its fired(10)
// replace ui borders with new artwork (15)
//create new animated sprite for enemies (15)
//create new title screen(15)
//create new spaceship type worth more points(dmg) in health (25)
//create new weapon the spaceship has no fire option so that it's a new type of weapon(25)
//changed the theme but didn't change to something other than sci-fi (50)