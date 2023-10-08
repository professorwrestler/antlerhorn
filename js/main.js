class GameScene extends Phaser.Scene
{
    player;
    cursors;
    bullets;
    
    preload ()
    {
        //load our assets
        this.load.image("background0", "./assets/parallax0.png");
        this.load.image("background1", "./assets/parallax1.png");
        this.load.image("background2", "./assets/parallax2.png");
        this.load.image("background3", "./assets/parallax3.png");
        this.load.spritesheet("playerAnimated", "./assets/playerAnimated.png", { frameWidth: 16, frameHeight: 32 });
        this.load.spritesheet("enemy1", "./assets/enemy1.png", { frameWidth: 16, frameHeight: 16});
        this.load.image("bullet", "./assets/bullet.png");
        this.load.image("ui", "./assets/uiOverlay.png");
        this.load.image("life", "./assets/life.png");
        this.load.spritesheet("flame", "./assets/flame.png", { frameWidth: 16, frameHeight: 16 });
        this.load.audio('hit', "./assets/explosion.wav");
        this.load.audio('flame', "./assets/hitHurt.wav");
        this.load.audio('enemyHit', "./assets/laserShoot.wav");
        this.load.audio('mainTheme', "./assets/mainTheme.wav");

    }

    create ()
    {
        
        //setup background parallax images. These are intentionally out of sequence due to personal preference.
        this.background0 = this.add.tileSprite(0, 0, this.game.config.width, this.game.config.height, "background0").setOrigin(0, 0);
        this.background2 = this.add.tileSprite(0, 0, this.game.config.width, this.game.config.height, "background2").setOrigin(0, 0);
        this.background1 = this.add.tileSprite(0, 0, this.game.config.width, this.game.config.height, "background1").setOrigin(0, 0); 
        this.background3 = this.add.tileSprite(0, 0, this.game.config.width, this.game.config.height, "background3").setOrigin(0, 0);

        //add two pointers
        this.input.addPointer(2);

        //add our sound effects
        this.hitSound = this.sound.add("hit");
        //lower the volume some
        this.hitSound.setVolume(0.5);
        this.flameSound = this.sound.add("flame");
        //lower the volume some
        this.flameSound.setVolume(0.5);
        this.enemyHitSound = this.sound.add("enemyHit");
        //lower the volume
        this.enemyHitSound.setVolume(0.5);
        //add music
        this.mainTheme = this.sound.add("mainTheme");
        //lower the volume some
        this.mainTheme.setVolume(0.8);
        //loop it
        this.mainTheme.setLoop(true);

        //score variable
        this.score = 0;
        //add the little window at the bottom of the screen for ui/stats
        this.ui = this.add.tileSprite(0, 0, this.game.config.width, this.game.config.height, "ui").setOrigin(0, 0);
        
        //some ui text
        this.add.text(8, 200, "Life: ", { fontFamily: 'Brush Script MT', fontSize: 14, color: "rgb(209,184,184)" });
        //some score text
        this.add.text(150, 200, "Score: ", { fontFamily: 'Brush Script MT', fontSize: 14, color: "rgb(209,184,184)" });
        //add score
        this.scoreBoard = this.add.text(186, 201, `${this.score}`, { fontFamily: 'Brush Script MT', fontSize: 14, color: "rgb(209,184,184)" });
        
        //player health for the ui
        this.health = 15;

        //set world bounds 
        this.physics.world.setBounds(0, 0, 256, 194);
        
        //setup WASD keys
        this.keys = this.input.keyboard.addKeys("W, A, S, D");

        //setup animations for player 
        const flyAnimation = this.anims.create({
            key: 'fly',
            frames: this.anims.generateFrameNumbers('playerAnimated', {start: 0, end: 1}),
            frameRate: 10
        });

        const shootAnimation = this.anims.create({
            key: 'shoot',
            frames: this.anims.generateFrameNumbers('playerAnimated', {start: 2, end: 3}),
            frameRate: 10
        });

        const hurtAnimation = this.anims.create({
            key: 'hurt',
            frames: this.anims.generateFrameNumbers('playerAnimated', {start: 4, end: 5}),
            frameRate: 10
        });

        //animation for flame
        const flameAnimation = this.anims.create({
            key: 'flameAnimation',
            frames: this.anims.generateFrameNumbers('flame', {start: 0, end: 3}),
            frameRate: 10
            
        });

        //animation for enemy
        const enemyAnimation = this.anims.create({
            key: 'enemyFly',
            frames: this.anims.generateFrameNumbers('enemy1', {start: 0, end: 3}),
            frameRate: 10
        });


        //add the player
        this.player = this.physics.add.sprite(60, 60, 'playerAnimated').setScale(2).setInteractive({ draggable: true });
        
        //have em come out playing the fly animation
        this.player.play({ key: "fly", repeat: -1 });

        //collide with world bounds (which is set to the game's window size)
        this.player.setCollideWorldBounds(true);

        //make player draggable
        this.player.on('drag', function (pointer, dragX, dragY)
        {

            this.x = dragX;
            this.y = dragY;

        });
       
        //setup spacebar for firing bullets
        this.spacebar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        //create bullet group
        this.bullets = this.add.group({
            classType: Bullet,
            maxSize: 30,
            runChildUpdate: true
        });

        //create enemy group
        this.enemies = this.add.group({
            classType: Enemy,
            maxSize: 30,
            runChildUpdate: true
        });

        //add the life group onto UI window
        this.groupLife = this.add.group({
            key: "life",
            repeat: 14,
            setXY: {
                x: 40,
                y: 209,
                stepX: 7 } 
            });


        this.enemy1 = this.enemies.get();
        this.enemy1.x = 300;
        this.enemy1.y = 50;
        
        //create enemy2 (another instance)
        this.enemy2 = this.enemies.get();
        this.enemy2.x = 300;
        this.enemy2.y = 80;

        //create enemy3 (another instance)
        this.enemy3 = this.enemies.get();
        this.enemy3.x = 300;
        this.enemy3.y = 110; 

        //create enemy4(another instance)
        this.enemy4 = this.enemies.get();
        this.enemy4.x = 500;
        this.enemy4.y = 100;
        
        //create enemy5 (another instance)
        this.enemy5 = this.enemies.get();
        this.enemy5.x = 500;
        this.enemy5.y = 130;

        //create enemy6 (another instance)
        this.enemy6 = this.enemies.get();
        this.enemy6.x = 500;
        this.enemy6.y = 160; 

        this.enemy7 = this.enemies.get();
        this.enemy7.x = 600;
        this.enemy7.y = 50;
        
        //create enemy2 (another instance)
        this.enemy8 = this.enemies.get();
        this.enemy8.x = 600;
        this.enemy8.y = 80;

        //create enemy3 (another instance)
        this.enemy9 = this.enemies.get();
        this.enemy9.x = 600;
        this.enemy9.y = 110; 

        //create enemy4(another instance)
        this.enemy10 = this.enemies.get();
        this.enemy10.x = 700;
        this.enemy10.y = 100;
        
        //create enemy5 (another instance)
        this.enemy11 = this.enemies.get();
        this.enemy11.x = 700;
        this.enemy11.y = 130;

        //create enemy6 (another instance)
        this.enemy12 = this.enemies.get();
        this.enemy12.x = 700;
        this.enemy12.y = 160; 

        this.enemy13 = this.enemies.get();
        this.enemy13.x = 800;
        this.enemy13.y = 50;
        
        //create enemy2 (another instance)
        this.enemy14 = this.enemies.get();
        this.enemy14.x = 800;
        this.enemy14.y = 80;

        //create enemy3 (another instance)
        this.enemy15 = this.enemies.get();
        this.enemy15.x = 800;
        this.enemy15.y = 110; 

        //create enemy4(another instance)
        this.enemy16 = this.enemies.get();
        this.enemy16.x = 900;
        this.enemy16.y = 100;
        
        //create enemy5 (another instance)
        this.enemy17 = this.enemies.get();
        this.enemy17.x = 900;
        this.enemy17.y = 130;

        //create enemy6 (another instance)
        this.enemy18 = this.enemies.get();
        this.enemy18.x = 900;
        this.enemy18.y = 160; 

        this.enemy19 = this.enemies.get();
        this.enemy19.x = 1000;
        this.enemy19.y = 50;
        
        //create enemy2 (another instance)
        this.enemy20 = this.enemies.get();
        this.enemy20.x = 1000;
        this.enemy20.y = 80;

        //create enemy3 (another instance)
        this.enemy21 = this.enemies.get();
        this.enemy21.x = 1000;
        this.enemy21.y = 110; 

        //create enemy4(another instance)
        this.enemy22 = this.enemies.get();
        this.enemy22.x = 1100;
        this.enemy22.y = 100;
        
        //create enemy5 (another instance)
        this.enemy23 = this.enemies.get();
        this.enemy23.x = 1100;
        this.enemy23.y = 130;

        //create enemy6 (another instance)
        this.enemy24 = this.enemies.get();
        this.enemy24.x = 1100;
        this.enemy24.y = 160; 
    
        //animate the enemies
        this.enemy1.play({ key: "enemyFly", repeat: -1 });
        this.enemy2.play({ key: "enemyFly", repeat: -1 });
        this.enemy3.play({ key: "enemyFly", repeat: -1 });
        this.enemy4.play({ key: "enemyFly", repeat: -1 });
        this.enemy5.play({ key: "enemyFly", repeat: -1 });
        this.enemy6.play({ key: "enemyFly", repeat: -1 });
        this.enemy7.play({ key: "enemyFly", repeat: -1 });
        this.enemy8.play({ key: "enemyFly", repeat: -1 });
        this.enemy9.play({ key: "enemyFly", repeat: -1 });
        this.enemy10.play({ key: "enemyFly", repeat: -1 });
        this.enemy11.play({ key: "enemyFly", repeat: -1 });
        this.enemy12.play({ key: "enemyFly", repeat: -1 });  
        this.enemy13.play({ key: "enemyFly", repeat: -1 });
        this.enemy14.play({ key: "enemyFly", repeat: -1 });
        this.enemy15.play({ key: "enemyFly", repeat: -1 });
        this.enemy16.play({ key: "enemyFly", repeat: -1 });
        this.enemy17.play({ key: "enemyFly", repeat: -1 });
        this.enemy18.play({ key: "enemyFly", repeat: -1 });
        this.enemy19.play({ key: "enemyFly", repeat: -1 });
        this.enemy20.play({ key: "enemyFly", repeat: -1 });
        this.enemy21.play({ key: "enemyFly", repeat: -1 });
        this.enemy22.play({ key: "enemyFly", repeat: -1 });
        this.enemy23.play({ key: "enemyFly", repeat: -1 });
        this.enemy24.play({ key: "enemyFly", repeat: -1 }); 
        
        /*Gonna come back later and throw 
        in a for loop or something to spit 
        out an array of enemies */

        //setup overlap (collision) between bullet group and enemy group
        this.physics.add.overlap(this.bullets, this.enemies, (bullets, enemies) =>
        {   
            this.enemyHitSound.play();
            //destroy bullet, destroy enemy, note it in the console        
            bullets.destroy();
            enemies.destroy();
            //add to the score
            this.score += 10;
            //set score display
            this.scoreBoard.setText(`${this.score}`);
            console.log("Collided");          
        });

        //take damage from enemies when overlapping
        this.physics.add.overlap(this.player, this.enemies, (player, enemies) =>
        {   
            this.hitSound.play();
            this.cameras.main.shake(20);
            enemies.destroy();
            //remove one health
            this.health -= 1;     
            console.log(`You're hit! Health is now ${this.health}.`);
            //remove one of the health sprites from the life group (groupLife group)   
            this.groupLife.getChildren()[this.groupLife.getChildren().length - 1].destroy();
            //play the "hurt" animation
            this.player.play("hurt").once('animationcomplete', () => {
                //then play the original "fly" animation on repeat
                this.player.play({ key: 'fly', repeat: -1 });
                });     
        });

        /*
        use second multitouch to fire bullets--
        I'm basically copying and pasting the 
        entire run of our spacebar event down
        in the update method into this touch input/click
        arrow function*/

        this.input.on('pointerdown', () => {
            this.flameSound.play();
            
            //play the "shoot" animation once
            this.player.play("shoot").once('animationcomplete', () => {
            //then play the original "fly" animation on repeat
            this.player.play({ key: 'fly', repeat: -1 });
            
            });

            //make a bullet
            const bullet = this.bullets.get();
            if (bullet) {
            //if there's a bullet, put it in the middle of the player
                bullet.fire(this.player.x + 5, this.player.y + 15);
                bullet.play({ key: 'flameAnimation', repeat: -1 });
            }
        });


        //play the main music track
        this.mainTheme.play();
    }


    update () 
    {

        this.player.setVelocity(0);
        
        //parallax scroll background images
        this.background1.tilePositionX += .8;
        this.background2.tilePositionX += 1;
        this.background3.tilePositionX += 1.3;

        //if spacebar is pressed
        if (Phaser.Input.Keyboard.JustDown(this.spacebar)) {
            this.flameSound.play();
            
            //play the "shoot" animation once
            this.player.play("shoot").once('animationcomplete', () => {
            //then play the original "fly" animation on repeat
            this.player.play({ key: 'fly', repeat: -1 });
            
            });

            //make a bullet
            const bullet = this.bullets.get();
            if (bullet) {
            //if there's a bullet, put it in the middle of the player
                bullet.fire(this.player.x + 5, this.player.y + 15);
                bullet.play({ key: 'flameAnimation', repeat: -1 });
            }
        } 
       
        if (this.keys.A.isDown) {
            this.player.setVelocityX(-150);
        } else if (this.keys.D.isDown) {
            this.player.setVelocityX(150);
            //sets collision point in middle of map. If player goes over the 150 pixel mark, stop them.
            if (this.player.x > 150) {
                this.player.setVelocityX(0);
            }
        } 
        
        if (this.keys.W.isDown) {
            this.player.setVelocityY(-150);
        } else if (this.keys.S.isDown) {
            this.player.setVelocityY(150);
        }       

        //makeshift game over screen
        //if health equals zero (due to damage)
        if (this.health === 0) {
            //pause the whole scene
            this.scene.pause();
            //throw up some text saying Game Iverm followed by a message
            //telling them to restart their browser, 
            //I know, it's janky. But it's also sort of clever in a WWE Camera Angle sort of way.
            this.add.text(this.game.config.width/6, this.game.config.height/4, "GAME OVER ", { fontFamily: 'Brush Script MT', fontSize: 24, color: "rgb(209,184,184)" });
            this.add.text(this.game.config.width/9, this.game.config.height/2, "Refresh your browser to try again. ", { fontFamily: 'Brush Script MT', fontSize: 20, color: "rgb(209,184,184)" });
            //this kills the game, forcing a page refresh.
        }

    }

}

const config = {
    type: Phaser.AUTO,
    pixelArt: true,
    scale: {
        mode: Phaser.Scale.FIT,
        parent: 'phaser-example',
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: 256,
        height: 224
    },
    physics: {
        default: 'arcade',
        arcade: {
            debug: false
        }
    },
    scene: [ GameScene ]
};

const game = new Phaser.Game(config);