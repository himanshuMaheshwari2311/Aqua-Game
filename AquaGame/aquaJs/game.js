var game = new Phaser.Game(720, 480, Phaser.AUTO, 'phaser-example', { preload: preload, create: create, update: update, render: render });

function preload () {
    game.load.image('pinkBot', 'aquaSprites/pink_bot.png');
    game.load.image('purpleBot', 'aquaSprites/purple_bot.png');

    game.load.image('botBallHolder', 'aquaSprites/bot_ball_holder.png');
    game.load.image('centralBallSlot', 'aquaSprites/central_ball_slot.png');

    game.load.image('greenBall', 'aquaSprites/green_ball.png');
    game.load.image('redBall', 'aquaSprites/red_ball.png');
    game.load.image('yellowBall', 'aquaSprites/yellow_ball.png');

    game.load.image('background', 'aquaSprites/background.png');
}

var pinkBot;
var purpleBot;

var ballHolderPink;
var ballHolderPurple;

var currentSpeedPink = 0;
var currentSpeedPurple = 0;

var pinkHolding = -1;
var purpleHolding = -1;

var cursors;
var keyA;
var keyW;
var keyS;
var keyD;

var keyR;
var keyL;

var keyPressed = false;

var redL = true;
var yellowL = true;

var redR = true;
var yellowR = true;

var balls = [];
var ball_slots = [];
var pink_slots_flag = [-1, -1, -1, -1, -1];
var purple_slots_flag = [-1, -1, -1, -1, -1];
var arena_state = new Array(3);

for (var i = 0; i < 3; i++)
    arena_state[i] = new Array(2);

var startTime = Date.now();
var pinkrt = 0;
var purplert = 0;
var timeElapsed;
var secs = 0;
var result = "NR";
var pinkPoints = 0;
var purplePoints = 0;
var endFlag = false;

function create () {

    game.world.setBounds(0, 0, 720, 480);

    land = game.add.tileSprite(0, 0, 720, 480, 'background');
    land.fixedToCamera = true;

    //  The base of our pinkBot
    pinkBot = game.add.sprite(180, 240, 'pinkBot');
    pinkBot.anchor.setTo(0.5, 0.5);
    pinkBot.angle = 180;


    //  This will force it to decelerate and limit its speed
    game.physics.enable(pinkBot, Phaser.Physics.ARCADE);
    pinkBot.body.drag.set(0.2);
    pinkBot.body.setSize(60, 65);
    pinkBot.body.maxVelocity.setTo(100, 100);
    pinkBot.body.collideWorldBounds = true;
    pinkBot.body.immovable = true;
    pinkBot.bringToTop();

    ballHolderPink = game.add.sprite(35, 0, 'botBallHolder');
    ballHolderPink.anchor.setTo(0.5, 0.5);
    pinkBot.addChild(ballHolderPink);

    //  The base of our purpleBot
    purpleBot = game.add.sprite(540, 240, 'purpleBot');
    purpleBot.anchor.setTo(0.5, 0.5);

    //  This will force it to decelerate and limit its speed
    game.physics.enable(purpleBot, Phaser.Physics.ARCADE);
    purpleBot.body.drag.set(0.2);
    purpleBot.body.maxVelocity.setTo(100, 100);
    purpleBot.body.collideWorldBounds = true;
    purpleBot.body.immovable = true;
    currentSpeedPurple = 0;
    purpleBot.bringToTop();

    ballHolderPurple = game.add.sprite(35, 0, 'botBallHolder');
    ballHolderPurple.anchor.setTo(0.5, 0.5);
    purpleBot.addChild(ballHolderPurple);


    cursors = game.input.keyboard.createCursorKeys();
    keyW = game.input.keyboard.addKey(Phaser.Keyboard.W);
    keyA = game.input.keyboard.addKey(Phaser.Keyboard.A);
    keyS = game.input.keyboard.addKey(Phaser.Keyboard.S);
    keyD = game.input.keyboard.addKey(Phaser.Keyboard.D);
    keyR = game.input.keyboard.addKey(Phaser.Keyboard.R);
    keyL = game.input.keyboard.addKey(Phaser.Keyboard.L);

    //game Elements
    green1L = game.add.sprite(50, 400, 'greenBall');

    green2L = game.add.sprite(50, 240, 'greenBall');

    green3L = game.add.sprite(50, 80, 'greenBall');

    green1R = game.add.sprite(670, 400, 'greenBall');

    green2R = game.add.sprite(670, 240, 'greenBall');

    green3R = game.add.sprite(670, 80, 'greenBall');

    redL = game.add.sprite(160, 120, 'redBall');

    redR = game.add.sprite(550, 120, 'redBall');

    yellowL = game.add.sprite(160, 360, 'yellowBall');

    yellowR = game.add.sprite(550, 360, 'yellowBall');

    balls.push(green1L);
    balls.push(green2L);
    balls.push(green3L);
    balls.push(redL);
    balls.push(yellowL);

    balls.push(green1R);
    balls.push(green2R);
    balls.push(green3R);
    balls.push(redR);
    balls.push(yellowR);

    centerSlot1L = game.add.sprite(330, 70, 'centralBallSlot');
    centerSlot2L = game.add.sprite(330, 225, 'centralBallSlot');
    centerSlot3L = game.add.sprite(330, 378, 'centralBallSlot');

    centerSlot1R = game.add.sprite(368, 70, 'centralBallSlot');
    centerSlot2R = game.add.sprite(368, 225, 'centralBallSlot');
    centerSlot3R = game.add.sprite(368, 378, 'centralBallSlot');

    ball_slots.push(centerSlot1L);
    ball_slots.push(centerSlot2L);
    ball_slots.push(centerSlot3L);

    ball_slots.push(centerSlot1R);
    ball_slots.push(centerSlot2R);
    ball_slots.push(centerSlot3R);

    for (var i = 0; i < ball_slots.length; i++) {
        game.physics.enable(ball_slots[i], Phaser.Physics.ARCADE);
        ball_slots[i].bringToTop();
    }

    for (var i = 0; i < balls.length; i++) {
        game.physics.enable(balls[i], Phaser.Physics.ARCADE);
        balls[i].anchor.setTo(0.5, 0.5);
        balls[i].body.immovable = false;
        balls[i].body.setCircle(11);
        balls[i].body.drag.set(0.1);
        balls[i].body.collideWorldBounds = true;
        balls[i].bringToTop();
    }

    for (var i = 0; i < 3; i++) {
        for (var j = 0; j < 2; j++) {
            arena_state[i][j] = 'B';
        }
    }
    reset_balls([0,1,2,3,4,5,6,7,8,9]);
}

function update () {
    if(keyPressed) {
        timeElapsed = Date.now() - startTime;
        if (timeElapsed > 500) {
            secs++;
            timeElapsed = 0;
            startTime = Date.now();
        }
    }
    botMotion();
    ballMotion();
    if (pinkHolding == -1)
    {
        checkPinkHolding();
    }
    else
    {
        checkPinkRelease();
    }
    if (purpleHolding == -1)
    {
        checkPurpleHolding();
    }
    else
    {
        checkPurpleRelease();
    }
    if(keyR.isDown && pinkHolding != -1){
        reset_balls([pinkHolding]);
        balls[pinkHolding].body.velocity.x = 0;
        balls[pinkHolding].body.velocity.y = 0;
        pinkBot.removeChild(balls[pinkHolding]);
        game.add.existing(balls[pinkHolding]);
        pinkHolding = -1;
    }
    if(keyL.isDown && purpleHolding != -1){
        reset_balls([purpleHolding]);
        balls[purpleHolding].body.velocity.x = 0;
        balls[purpleHolding].body.velocity.y = 0;
        purpleBot.removeChild(balls[purpleHolding]);
        game.add.existing(balls[purpleHolding]);
        purpleHolding = -1;
    }
    checkEnd();
    //console.log("Pi: " + pinkPoints);
    //console.log("Pu: " + purplePoints);
}

function checkPinkHolding() {
    for (var i = 0; i < balls.length/2; i++) {
        if(i == 3 && !redL || i == 4 && !yellowL ){
            continue;
        }
        if(checkOverlap(ballHolderPink, balls[i]) && pink_slots_flag[i] == -1) {
            balls[i].x = 45;
            balls[i].y = 0;
            balls[i].body.velocity.x = 0;
            balls[i].body.velocity.y = 0;
            pinkHolding = i;
            balls[i].immovable = true;
            pinkBot.addChild(balls[i]);
            return;
        }
    }
}

function checkPurpleHolding() {
    for (var i = balls.length/2; i < balls.length; i++) {
        if(i == 8 && !redR || i == 9 && !yellowR ){
            continue;
        }
        if(checkOverlap(ballHolderPurple, balls[i]) && purple_slots_flag[i - balls.length/2] == -1){
            balls[i].x = 45;
            balls[i].y = 0;
            balls[i].body.velocity.x = 0;
            balls[i].body.velocity.y = 0;
            purpleHolding = i;
            balls[i].immovable = true;
            purpleBot.addChild(balls[i]);
            return;
        }
    }
}

function checkPinkRelease() {
    for (var i = 0; i < ball_slots.length/2; i++) {
        if(checkOverlap(ball_slots[i], balls[pinkHolding]) && isSlotEmptyL(ball_slots[i])) {
            balls[pinkHolding].x = 5;
            balls[pinkHolding].y = 15;
            balls[pinkHolding].body.velocity.x = 0;
            balls[pinkHolding].body.velocity.y = 0;
            pinkBot.removeChild(balls[pinkHolding]);
            ball_slots[i].addChild(balls[pinkHolding]);
            pink_slots_flag[pinkHolding] = 1; // any thing other than -1
            if(pinkHolding < 3){
                arena_state[i][0] = 'G';
            }
            else if(pinkHolding == 3){
                arena_state[i][0] = 'R';
            }
            else {
                arena_state[i][0] = 'Y';
            }
            pinkHolding = -1;
            gamePlay(i, 0);
            pinkrt = Date.now();
            return;
        }
    }
}

function checkPurpleRelease() {
    for (var i = ball_slots.length/2; i < ball_slots.length; i++) {

        if(checkOverlap(ball_slots[i], balls[purpleHolding]) && isSlotEmptyR(ball_slots[i])) {
            balls[purpleHolding].x = 20;
            balls[purpleHolding].y = 15;
            balls[purpleHolding].body.velocity.x = 0;
            balls[purpleHolding].body.velocity.y = 0;
            purpleBot.removeChild(balls[purpleHolding]);
            ball_slots[i].addChild(balls[purpleHolding]);
            purple_slots_flag[purpleHolding - balls.length/2] = 1; // any thing other than -1
            if(purpleHolding < 8){
                arena_state[i - ball_slots.length/2][1] = 'G';
            }
            else if(purpleHolding == 8){
                arena_state[i - ball_slots.length/2][1] = 'R';
            }
            else {
                arena_state[i - ball_slots.length/2][1] = 'Y';
            }

            purpleHolding = -1;
            gamePlay(i - ball_slots.length/2, 1);
            purplert = Date.now();
            return;
        }
    }
}

function gamePlay(i, botNo) {

    if((arena_state[i][0] == 'R' && arena_state[i][1] == 'R'))
    {
        //console.log("Blocking");
        arena_state[i][0] = 'b';
        arena_state[i][1] = 'b';
        redL = false;
        redR = false;
    }
    else if((arena_state[i][0] == 'Y' && arena_state[i][1] == 'Y'))
    {
        //console.log("Blocking");
        arena_state[i][0] = 'b';
        arena_state[i][1] = 'b';
        yellowL = false;
        yellowR = false;
    }

    else if((arena_state[i][0] == 'Y' && arena_state[i][1] == 'R') || (arena_state[i][0] == 'R' && arena_state[i][1] == 'Y'))
    {
        //console.log("Remove");
        yellowL = !(arena_state[i][0] == 'Y');
        yellowR = !(arena_state[i][1] == 'Y');
        redL = !(arena_state[i][0] == 'R');
        redR = !(arena_state[i][1] == 'R');

        if(arena_state[i][0] == 'Y'){
            j = 4;
        }
        else{
            j = 3;
        }

        ball_slots[i].removeChild(balls[j]);
        balls[j].x = 350;
        balls[j].y = 480;
        game.add.existing(balls[j]);
        balls[j].alpha = 0;
        //console.log(j);
        pink_slots_flag[j] = -1;

        if(arena_state[i][0] == 'Y'){
            j = 8;
        }
        else {
            j = 9;
        }

        ball_slots[i + 3].removeChild(balls[j]);
        balls[j].x = 350;
        balls[j].y = 480;
        game.add.existing(balls[j]);
        balls[j].alpha = 0;
        //console.log(j);
        //console.log(i+3);
        purple_slots_flag[j - balls.length/2] = -1;
        arena_state[i][0] = 'B';
        arena_state[i][1] = 'B';
    }
    else if(arena_state[i][0] == 'R' && arena_state[i][1] == 'G')
    {
        //console.log("Reposition");
        if(botNo == 0){
            purplePoints -= 10;
        }
        for(var j = balls.length/2; j < balls.length/2 + 3; j++) {
            if(checkOverlap(ball_slots[i + 3], balls[j]) && purple_slots_flag[j - balls.length/2] != -1) {
                balls[j].body.velocity.x = 0;
                balls[j].body.velocity.y = 0;
                ball_slots[i + 3].removeChild(balls[j]);
                reset_balls([j]);
                game.add.existing(balls[j]);
                //console.log(j);
                arena_state[i][1] = 'B';
                purple_slots_flag[j - balls.length/2] = -1;
                break;
            }
        }
    }
    else if(arena_state[i][1] == 'R' && arena_state[i][0] == 'G')
    {
        //console.log("Reposition");
        if(botNo == 1){
            pinkPoints -= 10;
        }
        for(var j = 0; j < 3; j++) {
            if(checkOverlap(ball_slots[i], balls[j]) && pink_slots_flag[j] != -1) {
                balls[j].body.velocity.x = 0;
                balls[j].body.velocity.y = 0;
                ball_slots[i].removeChild(balls[j]);
                reset_balls([j]);
                game.add.existing(balls[j]);
                //console.log(j);
                arena_state[i][0] = 'B';
                pink_slots_flag[j] = -1;
                break;
            }
        }
    }
    else if(arena_state[i][0] == 'G' && botNo == 0){
        //console.log("Pink Scored");
        pinkPoints += 10;
    }
    else if(arena_state[i][1] == 'G' && botNo == 1){
        //console.log("Purple Scored");
        purplePoints += 10;
    }
}

function isSlotEmptyL(slotSprite){
    for(var i = 0; i < balls.length/2; i++)
        if(checkOverlap(slotSprite,balls[i]) && i != pinkHolding){
            return false;
        }
    return true;
}

function isSlotEmptyR(slotSprite){
    for(var i = balls.length/2; i < balls.length; i++)
        if(checkOverlap(slotSprite,balls[i]) && i != purpleHolding){
            return false;
        }
    return true;
}

function ballMotion() {

    for(var i = 0; i < balls.length/2; i++) {
        if (pinkHolding != i) {
            if (balls[i].body.velocity.y > 0)
                balls[i].body.velocity.y -= 1;
            else if (balls[i].body.velocity.y < 0)
                balls[i].body.velocity.y += 1;


            if (balls[i].body.velocity.x > 0)
                balls[i].body.velocity.x -= 1;
            else if (balls[i].body.velocity.x < 0)
                balls[i].body.velocity.x += 1;

        }
        else {
            balls[i].x = 48;
            balls[i].y = 0;
        }
    }
    for(var i = balls.length/2; i < balls.length; i++) {
        if(purpleHolding != i ) {
            if (balls[i].body.velocity.y > 0)
                balls[i].body.velocity.y -= 1;
            else if (balls[i].body.velocity.y < 0)
                balls[i].body.velocity.y += 1;


            if (balls[i].body.velocity.x > 0)
                balls[i].body.velocity.x -= 1;
            else if (balls[i].body.velocity.x < 0)
                balls[i].body.velocity.x += 1;

        }
        else {
            balls[i].x = 48;
            balls[i].y = 0;
        }
    }

    for(var i = 0; i < balls.length/2; i++) {
        if (pinkHolding != i && pink_slots_flag[i] == -1) {
            if (balls[i].x < 350) {
                if(Date.now() - pinkrt > 500)
                    game.physics.arcade.collide(pinkBot, balls[i]);
                for (var j = 0; j < balls.length / 2; j++) {
                    if (i != j && pink_slots_flag[j] == -1)
                        game.physics.arcade.collide(balls[j], balls[i]);
                }
            }
            else {
                balls[i].body.velocity.x = 0;
                balls[i].body.velocity.y = 0;
            }
        }
    }
    for(var i = balls.length/2; i < balls.length; i++) {
        if(purpleHolding != i && purple_slots_flag[i-balls.length/2] == -1) {
            if (balls[i].x > 350) {
                if(Date.now() - purplert > 500)
                    game.physics.arcade.collide(purpleBot, balls[i]);
                for (var j = balls.length/2; j < balls.length; j++) {
                    if (i != j && purple_slots_flag[j - balls.length/2] == -1)
                        game.physics.arcade.collide(balls[j], balls[i]);
                }
            }
            else {
                balls[i].body.velocity.x = 0;
                balls[i].body.velocity.y = 0;
            }
        }
    }
}

function botMotion() {
    //Pink
    if (keyA.isDown)
    {
        pinkBot.angle -= 4;
        keyPressed = true;
    }
    else if (keyD.isDown)
    {
        pinkBot.angle += 4;
        keyPressed = true;
    }

    if (keyW.isDown)
    {
        currentSpeedPink = 100;
        keyPressed = true;
    }
    else if (keyS.isDown)
    {
        currentSpeedPink = -100;
        keyPressed = true;
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
    if (cursors.left.isDown)
    {
        purpleBot.angle -= 4;
        keyPressed = true;
    }
    else if (cursors.right.isDown)
    {
        purpleBot.angle += 4;
        keyPressed = true;
    }
    if (cursors.up.isDown)
    {
        currentSpeedPurple = 100;
        keyPressed = true;
    }
    else if(cursors.down.isDown)
    {
        currentSpeedPurple = -100;
        keyPressed = true;
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

}

function checkOverlap(spriteA, spriteB) {

    var boundsA = spriteA.getBounds();
    var boundsB = spriteB.getBounds();

    return Phaser.Rectangle.intersects(boundsA, boundsB);

}

function reset_balls(args){

    for(var i = 0; i < args.length; i++){
        if(args[i] == 0){
            balls[0].x = 50;
            balls[0].y = 400;
        }
        else if(args[i] == 1){
            balls[1].x = 50;
            balls[1].y = 240;

        }
        else if(args[i] == 2){
            balls[2].x = 50;
            balls[2].y = 80;

        }
        else if(args[i] == 3){
            balls[3].x = 160;
            balls[3].y = 120;

        }
        else if(args[i] == 4){
            balls[4].x = 160;
            balls[4].y = 360;

        }
        else if(args[i] == 5){
            balls[5].x = 670;
            balls[5].y = 80;

        }
        else if(args[i] == 6){
            balls[6].x = 670;
            balls[6].y = 240;

        }
        else if(args[i] == 7){
            balls[7].x = 670;
            balls[7].y = 400;

        }
        else if(args[i] == 8){
            balls[8].x = 550;
            balls[8].y = 120;

        }
        else if(args[i] == 9){
            balls[9].x = 550;
            balls[9].y = 360;

        }
    }
}

function checkEnd() {

    if(endFlag){
        game.paused = true;
    }

    if(!yellowL && !yellowR) {
        if (redL && redR) {
            if (pink_slots_flag[3] != -1 && purple_slots_flag[3] != -1) {
                result = "Draw";
                return;
            }
        }
    }

    if(pinkPoints == 30){
        result = "Player 1";
        return;
    }
    else if(purplePoints == 30){
        result = "Player 2";
        return;
    }
    counter = 0;
    for(var i = 0; i < 3; i++) {
        if(arena_state[i][0] == 'b' || (arena_state[i][0] == 'G' && (arena_state[i][1] == 'G' || arena_state[i][1] == 'Y' ))
            || (arena_state[i][0] == 'Y' && arena_state[i][1] == 'G')) {
            counter += 1;
        }
        if(arena_state[i][0] == 'B' || arena_state[i][1] == 'B'){
            break;
        }
    }
    if(secs > 180 || counter == 3) {
        if(pinkPoints == purplePoints){
            result = "Draw";
        }
        else if(pinkPoints > purplePoints){
            result = "Player 1";
        }
        else if(pinkPoints < purplePoints){
            result = "Player 2";
        }
    }

}

function render () {
    game.debug.text("Aqua Battlefront", 30, 22);
    game.debug.text("Time Left: " + (180-secs) + "s", 550, 22);
    game.debug.text("Points: " + pinkPoints, 120, 460);
    game.debug.text("Points: " + purplePoints, 700-180, 460);
    if(result != "NR"){
        if(result == "Draw") {
            game.debug.text(result, 160, 240);
            game.debug.text(result, 700-160, 240);
        }
        else if(result == "Player 1"){
            game.debug.text("You Won!", 160, 240);
            game.debug.text("You Lost!", 700-160, 240);
        }
        else if(result == "Player 2"){
            game.debug.text("You Lost!", 160, 240);
            game.debug.text("You Won!", 700-160, 240);
        }

        endFlag = true;
    }
}