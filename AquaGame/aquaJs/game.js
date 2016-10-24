
var game = new Phaser.Game(720, 480, Phaser.AUTO, 'phaser-example', { preload: preload, create: create, update: update, render: render });

function preload () {

    game.load.image('pinkBot', 'aquaSprites/pink_bot.png');
    game.load.image('purpleBot', 'aquaSprites/purple_bot.png');
    game.load.image('greenBall', 'aquaSprites/green_ball.png');
    game.load.image('redBall', 'aquaSprites/red_ball.png');
    game.load.image('yellowBall', 'aquaSprites/yellow_ball.png');
    game.load.image('background', 'aquaSprites/background.png');
    
}

var shadowPink;
var pinkBot;

var currentSpeedPink;
var currentSpeedPurple;

var cursors;
var keyA;
var keyW;
var keyS;
var keyD;

var pinkHoldingBall = -1;
var purpleHoldingBall = -1;

var balls = []  ;

function create () {

    //  Resize our game world to be a 2000 x 2000 square
    game.world.setBounds(0, 0, 720, 480);

    //  Our tiled scrolling background
    land = game.add.tileSprite(0, 0, 720, 480, 'background');
    land.fixedToCamera = true;

    //  The base of our pinkBot
    pinkBot = game.add.sprite(180, 240, 'pinkBot');
    pinkBot.anchor.setTo(0.5, 0.5);
    pinkBot.angle = 180;
    
    //  This will force it to decelerate and limit its speed
    game.physics.enable(pinkBot, Phaser.Physics.ARCADE);
    pinkBot.body.drag.set(0.2);
    pinkBot.body.maxVelocity.setTo(100, 100);
    pinkBot.body.collideWorldBounds = true;
    currentSpeedPink = 0;
    pinkBot.bringToTop();

    //  The base of our purpleBot
    purpleBot = game.add.sprite(540, 240, 'purpleBot');
    purpleBot.anchor.setTo(0.5, 0.5);
    //  This will force it to decelerate and limit its speed
    game.physics.enable(purpleBot, Phaser.Physics.ARCADE);
    purpleBot.body.drag.set(0.2);
    purpleBot.body.maxVelocity.setTo(100, 100);
    purpleBot.body.collideWorldBounds = true;
    currentSpeedPurple = 0;
    purpleBot.bringToTop();

    cursors = game.input.keyboard.createCursorKeys();
    keyW = game.input.keyboard.addKey(Phaser.Keyboard.W);
    keyA = game.input.keyboard.addKey(Phaser.Keyboard.A);
    keyS = game.input.keyboard.addKey(Phaser.Keyboard.S);
    keyD = game.input.keyboard.addKey(Phaser.Keyboard.D);

    //game Elements
    green1L = game.add.sprite(50, 400, 'greenBall');

    green2L = game.add.sprite(50, 240, 'greenBall');

    green3L = game.add.sprite(50, 80, 'greenBall');

    green1R = game.add.sprite(670, 400, 'greenBall');

    green2R = game.add.sprite(670, 240, 'greenBall');

    green3R = game.add.sprite(670, 80, 'greenBall');

    balls.push(green1L);
    balls.push(green2L);
    balls.push(green3L);

    balls.push(green1R);
    balls.push(green2R);
    balls.push(green3R);

    for(var i = 0; i < balls.length; i++)
    {
        game.physics.enable(balls[i], Phaser.Physics.ARCADE);
        balls[i].anchor.setTo(0.5, 0.5);
        balls[i].body.immovable = false;
        balls[i].body.bounce.set(1);
        balls[i].body.setCircle(13);
        balls[i].body.drag.set(0.2);
        balls[i].body.collideWorldBounds = true;
        balls[i].bringToTop();
    }
}


function update () {

    //Pink
    if (cursors.left.isDown)
    {
        pinkBot.angle -= 4;
    }
    else if (cursors.right.isDown)
    {
        pinkBot.angle += 4;
    }

    if (cursors.up.isDown)
    {
        currentSpeedPink = 100;
    }
    else if (cursors.down.isDown)
    {
        currentSpeedPink = -100;
    }

    else
    {
        if (currentSpeedPink > 0)
        {
            currentSpeedPink -= 4;
        }
        else if(currentSpeedPink < 0)
        {
            currentSpeedPink += 4;
        }
    }
    if(pinkBot.x < 280)
    {
        game.physics.arcade.velocityFromRotation(pinkBot.rotation, currentSpeedPink, pinkBot.body.velocity);    
    }
    else
    {
        game.physics.arcade.velocityFromRotation(pinkBot.rotation, 0, pinkBot.body.velocity);    

        if(pinkBot.angle < 90 && pinkBot.angle > -90 && currentSpeedPink < 0)
        {
            game.physics.arcade.velocityFromRotation(pinkBot.rotation, currentSpeedPink, pinkBot.body.velocity);           
        }
        else if(((pinkBot.angle > 90 && pinkBot.angle < 180) || (pinkBot.angle < -90 && pinkBot.angle > -180)) && currentSpeedPink > 0)
        {   
            game.physics.arcade.velocityFromRotation(pinkBot.rotation, currentSpeedPink, pinkBot.body.velocity);           
        }
    }
    
    //Purple
    if (keyA.isDown)
    {
        purpleBot.angle -= 4;
    }
    else if (keyD.isDown)
    {
        purpleBot.angle += 4;
    }
    if (keyW.isDown)
    {
        currentSpeedPurple = 100;
    }
    else if(keyS.isDown)
    {
        currentSpeedPurple = -100;
    }
    else
    {
        if (currentSpeedPurple > 0)
        {
            currentSpeedPurple -= 4;
        }
        else if(currentSpeedPurple < 0)
        {
            currentSpeedPurple += 4;
        }
    }

    if(purpleBot.x > 440)
    {
        game.physics.arcade.velocityFromRotation(purpleBot.rotation, currentSpeedPurple, purpleBot.body.velocity);    
    }
    else
    {
        game.physics.arcade.velocityFromRotation(purpleBot.rotation, 0, purpleBot.body.velocity);    

        if(purpleBot.angle < 90 && purpleBot.angle > -90 && currentSpeedPurple > 0)
        {
            game.physics.arcade.velocityFromRotation(purpleBot.rotation, currentSpeedPurple, purpleBot.body.velocity);           
        }
        else if(((purpleBot.angle > 90 && purpleBot.angle <180) || (purpleBot.angle < -90 && purpleBot.angle > -180)) && currentSpeedPurple < 0)
        {
            game.physics.arcade.velocityFromRotation(purpleBot.rotation, currentSpeedPurple, purpleBot.body.velocity);           
        } 
    }
    for(var i = 0; i < balls.length/2; i++)
    {
        if(balls[i].body.velocity.y > 0)
            balls[i].body.velocity.y -=1;
        else if (balls[i].body.velocity.y < 0)
            balls[i].body.velocity.y += 1;


        if(balls[i].body.velocity.x > 0)
            balls[i].body.velocity.x -=1;
        else if (balls[i].body.velocity.x < 0)
            balls[i].body.velocity.x += 1;
    }

    for(var i = 0; i < balls.length/2; i++) {

        if(balls[i].x < 350) {
            game.physics.arcade.collide(pinkBot, balls[i]);
            for (var j = 0; j < balls.length / 2; j++) {
                if (i != j)
                    game.physics.arcade.collide(balls[j], balls[i]);
            }
        }
        else {
            balls[i].body.velocity.x = 0;
            balls[i].body.velocity.y = 0;
        }

    }

}


function render () {

}