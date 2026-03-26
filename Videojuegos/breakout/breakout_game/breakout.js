/*
 * Basic implementation of the PONG game
 *
 * Gilberto Echeverria
 * 2026-03-11
 */

"use strict";

// Global variables
const canvasWidth = 800;
const canvasHeight = 600;

// Context of the Canvas
let ctx;

// A variable to store the game object
let game;

// Variable to store the time at the previous frame
let oldTime = 0;

let paddleSpeed = 0.5;
let ballSpeed = 0.5;
let playerSpeed = 0.6;
let served = false;
let lives = 3;
const rows_global = 5;
const cols_global = 8;

// Class for the game ball
class Ball extends GameObject {
    constructor(position, width, height, color, sheetCols) {
        super(position, width, height, color, "ball", sheetCols);
        this.velocity = new Vector(0, 0);
        this.special = false; // Checks if the ball is an extra ball that doesn't remove lives when it falls
    }



    update(deltaTime) {
        this.velocity = this.velocity.normalize().times(ballSpeed);
        this.position = this.position.plus(this.velocity.times(deltaTime));
    }

    reset() {
        this.position = new Vector(canvasWidth / 2, canvasHeight / 2);
        this.velocity = new Vector(0, 0);
    }

    serveAdditional() {
        let angle = Math.random() * (35 * Math.PI / 180) - (17.5 * Math.PI / 180);
        this
    }

    followPlayer(player) {
        this.position.x = player.position.x;
        this.position.y = player.position.y - 24;
        this.velocity = new Vector(0, 0);
    }

    serve() {
        let angle = Math.random() * (35 * Math.PI / 180) - (17.5 * Math.PI / 180);
        this.velocity.x = Math.sin(angle);
        this.velocity.y = -Math.cos(angle);
    }
}


//Class for the player paddle
class Player extends GameObject {
    constructor(position, width, height, color, sheetCols) {
        super(position, width, height, color, "player", sheetCols);
        this.velocity = new Vector(0, 0);

        this.motion = {
            up: {
                axis: "y",
                sign: -1,
            },
            left: {
                axis: "x",
                sign: -1,
            },
            down: {
                axis: "y",
                sign: 1,
            },
            right: {
                axis: "x",
                sign: 1,
            },
        }

        // Keys pressed to move the player
        this.keys = [];
    }

    update(deltaTime) {
        // Restart the velocity
        this.velocity.x = 0;
        this.velocity.y = 0;
        // Modify the velocity according to the directions pressed
        for (const direction of this.keys) {
            const axis = this.motion[direction].axis;
            const sign = this.motion[direction].sign;
            this.velocity[axis] += sign;
        }
        // TODO: Normalize the velocity to avoid greater speed on diagonals

        this.velocity = this.velocity.normalize().times(playerSpeed);

        this.position = this.position.plus(this.velocity.times(deltaTime));

        this.clampWithinCanvas();
    }

    clampWithinCanvas() {
        // Top border
        if (this.position.y - this.halfSize.y < 0) {
            this.position.y = this.halfSize.y;
            // Left border
        }
        if (this.position.x - this.halfSize.x < 0) {
            this.position.x = this.halfSize.x;
            // Bottom border
        }
        if (this.position.y + this.halfSize.y > canvasHeight) {
            this.position.y = canvasHeight - this.halfSize.y;
            // Right border
        }
        if (this.position.x + this.halfSize.x > canvasWidth) {
            this.position.x = canvasWidth - this.halfSize.x;
        }
    }
}

//Class for the bricks
class Brick extends GameObject {
    constructor(position, width, height, color, sheetCols) {
        super(position, width, height, color, "brick", sheetCols);
        this.special = false; // If the brick is special, it will spawn an extra ball when destroyed
    }
}


// Class to keep track of all the events and objects in the game
class Game {
    constructor() {
        this.createEventListeners();
        this.initObjects();

        // Add audio element
        this.ping = document.createElement("audio");
        this.ping.src = "../assets/audio/4387__noisecollector__pongblipe4.wav";

        this.gameOver = false;
        this.winner = false;
    }

    initObjects() {
        
        //Adds background image
        this.background = new GameObject(new Vector(canvasWidth / 2, canvasHeight / 2), canvasWidth, canvasHeight);
        this.background.setSprite("../assets/sprites/image.png");

        // Left right and top bouncy barriers
        this.barrierLeft = new GameObject(new Vector(0, canvasHeight / 2),
            2, canvasHeight);
        this.barrierRight = new GameObject(new Vector(canvasWidth, canvasHeight / 2),
            2, canvasHeight);
        this.barrierTop = new GameObject(new Vector(canvasWidth / 2, 0), canvasWidth, 20);

        // Bottom barrier to kill the ball
        this.barrierBottom = new GameObject(new Vector(canvasWidth / 2, canvasHeight), canvasWidth, 20);

        // Player paddle
        this.player = new Player(new Vector(canvasWidth / 2, canvasHeight - (canvasHeight * 0.1)), canvasHeight * 0.25, canvasWidth * 0.034, "red");
        this.player.setSprite("../assets/sprites/breakout_pieces_2 (1).png");

        // Main ball
        this.ball = new Ball(new Vector(this.player.position.x, this.player.position.y - 24),
            20, 20, "white");
        this.ball.followPlayer(this.player); // Start the ball on top of the player and follow it until the first serve
        
        this.actors = [];   // Array to keep track of all the bricks in the game
        this.additional = []; // Array to keep track of the extra balls in the game


        // columns, rows
        this.createLevel(cols_global, rows_global ); // Creates bricks in the level

    }

    draw(ctx) {
        // Draw the background first, so everything else is drawn on top
        this.background.draw(ctx);


        this.ball.draw(ctx);    // Draw the main ball
        for (let extraBall of this.additional) { // If there are extra balls, draw them
            extraBall.draw(ctx);
        }

        for (let actor of this.actors) { // Draw the bricks
            actor.draw(ctx);
        }
        this.player.draw(ctx); // Draw the player

        // HUD lives
        ctx.fillStyle = "white";
        ctx.font = "24px Ubuntu Mono";
        ctx.fillText(`Lives: ${lives}`, 20, canvasHeight - 20);

        // HUD blocks remaining
        ctx.fillStyle = "white";
        ctx.font = "24px Ubuntu Mono";
        ctx.fillText(`Blocks hit: ${(cols_global*rows_global)-this.actors.length}`, canvasWidth - 145, canvasHeight - 20);

        // If no lives are left, show message and stop the game
        if (this.gameOver) {
            
            ctx.fillStyle = "white";
            ctx.font = "64px Ubuntu Mono";
            ctx.textAlign = "center";
            ctx.fillText("GAME OVER", canvasWidth / 2, canvasHeight / 2);
            ctx.textAlign = "start";
        }

        // If all blocks are destroyed, show message and stop the game
        if (this.winner) {
            ctx.fillStyle = "white";
            ctx.font = "64px Ubuntu Mono";
            ctx.textAlign = "center";
            ctx.fillText("YOU WIN!", canvasWidth / 2, canvasHeight / 2);
            ctx.textAlign = "start";
        }
    }

    update(deltaTime) {
        // If the game is over, stops updating
        if (this.gameOver) {
            return;
        }

        // if there are no more bricks, the player wins and stops updating
        if (this.actors.length == 0) {
            this.winner = true;
            return;
        }

        // Update the player and the ball
        this.player.update(deltaTime);

        if (served) {
            this.ball.update(deltaTime);
        } else {
            this.ball.followPlayer(this.player);
        }


        ///
        /// COLLISION
        ///

        // Checks collision for the ball and the player only if it is above player
        if (boxOverlap(this.ball, this.player) && this.ball.position.y < this.player.position.y) {
            
            // Makes it go left or right depending on the paddle
            if (this.ball.position.x < this.player.position.x) {
                this.ball.velocity.x = -Math.abs(this.ball.velocity.x);
            }
            else {
                this.ball.velocity.x = Math.abs(this.ball.velocity.x);
            }
            
            this.ball.velocity.y *= -1;
            // Make the ball faster with every contact
            this.ball.velocity.times(1.1);
            // Play the sound
            this.ping.play();
        }

        // kills ball
        if (boxOverlap(this.ball, this.barrierBottom)) {
            this.pointsRight += 1;
            this.ball.reset();
            served = false;
            this.ball.followPlayer(this.player);
            lives -= 1;
            this.additional = []; // Removes additional balls

            if (lives <= 0) {
                lives = 0;
                this.gameOver = true;
            }
        }

        // Bounce if it touches left or right barrier
        if (boxOverlap(this.ball, this.barrierLeft) || boxOverlap(this.ball, this.barrierRight)) {
            this.ball.velocity.x *= -1;
            this.ping.play();
        }


        // Bounce if it touches top barrier
        if (boxOverlap(this.ball, this.barrierTop)) {
            this.ball.velocity.y *= -1;
            // Make the ball faster with every contact
            this.ball.velocity.times(1.1);
            // Play the sound
            this.ping.play();
        }

        // Check collision against other objects
        for (let actor of this.actors) {
            if (boxOverlap(this.ball, actor)) {
                this.bounceBallAgainstActor(this.ball, actor);
                this.actors.splice(this.actors.indexOf(actor), 1); // Removes block from array
                this.ping.play();
                if (actor.special) {
                    this.addBall();
                }
                break;
            }
        }

        // Update extra balls and apply the same collisions.
        for (let i = this.additional.length - 1; i >= 0; i--) {
            const extraBall = this.additional[i];
            extraBall.update(deltaTime);

            if (boxOverlap(extraBall, this.player) && extraBall.position.y < this.player.position.y) {
                if (extraBall.position.x < this.player.position.x) {
                    extraBall.velocity.x = -Math.abs(extraBall.velocity.x);
                }
                else {
                    extraBall.velocity.x = Math.abs(extraBall.velocity.x);
                }
                extraBall.velocity.y *= -1;
                this.ping.play();
            }

            if (boxOverlap(extraBall, this.barrierLeft) || boxOverlap(extraBall, this.barrierRight)) {
                extraBall.velocity.x *= -1;
                this.ping.play();
            }

            if (boxOverlap(extraBall, this.barrierTop)) {
                extraBall.velocity.y *= -1;
                this.ping.play();
            }

            if (boxOverlap(extraBall, this.barrierBottom)) {
                this.additional.splice(i, 1);
                continue;
            }

            for (let actor of this.actors) {
                if (boxOverlap(extraBall, actor)) {
                    this.bounceBallAgainstActor(extraBall, actor);
                    this.actors.splice(this.actors.indexOf(actor), 1);
                    this.ping.play();
                    break;
                }
            }
        }


    }

    // Makes the ball bounce against a brick depending if it hits the sides or the top/bottom.
    bounceBallAgainstActor(ball, actor) {
        // Difference in position between the ball and the bricks
        const dx = ball.position.x - actor.position.x;
        const dy = ball.position.y - actor.position.y;

        // Overlap to know if it hits sides or top/bottom
        const overlapX = (ball.halfSize.x + actor.halfSize.x) - Math.abs(dx);
        const overlapY = (ball.halfSize.y + actor.halfSize.y) - Math.abs(dy);

        // If the overlap in x is smaller, it means it hits the sides, otherwise it hits top/bottom
        if (overlapX < overlapY) {
            ball.velocity.x *= -1;
            
            let dirX =1;
            if (dx < 0) {
                dirX = -1;
            }
            
            // Move the ball outside of the brick to avoid getting stuck
            ball.position.x = actor.position.x + dirX * (actor.halfSize.x + ball.halfSize.x + 0.1);

            // means that it hits the left side of the brick, so it moves the ball to the left of the brick
        } else {
            ball.velocity.y *= -1;
            let dirY = 1;
            if (dy < 0) {
                dirY = -1;
            }
            

            // Move the ball outside of the brick to avoid getting stuck
            ball.position.y = actor.position.y + dirY * (actor.halfSize.y + ball.halfSize.y + 0.1);
        }
    }


    createLevel(cols, rows) {
        const blockWidth = canvasWidth / cols;
        const blockHeight = (canvasHeight / 2) / rows;
        
        // Repeating colors for the rows of bricks
        let colors = ["red", "purple", "fuchsia", "green", "lime", "olive"]
        
        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                // Center of each block in the grid cell
                const x = canvasWidth * ((1 + 2 * col) / (2 * cols));
                const y = (canvasHeight / 2) * ((1 + 2 * row) / (2 * rows));

                // 10% chance of being a special box that spawns an extra ball when destroyed
                if (Math.random() < 0.1) {
                    const box = new Brick(new Vector(x, y), blockWidth - 1, blockHeight - 1, "gold");
                    box.special = true;
                    box.setSprite("../assets/sprites/bloks (1).png");
                    this.actors.push(box);
                }
                else {
                    const box = new Brick(new Vector(x, y), blockWidth - 1, blockHeight - 1, colors[row % 6]);
                    this.actors.push(box);
                }

                
            }
        }
    }
    // Adds an extra ball in the position of the player and serves it immediately
    addBall() {
        const ball = new Ball(new Vector(this.player.position.x, this.player.position.y - 24),
            20, 20, "gold");
        ball.special = true;
        ball.serve();
        this.additional.push(ball);
        return ball;
    }

    createEventListeners() {
        window.addEventListener('keydown', (event) => {
            if (event.key == 'a') {
                this.addKey('left');
            } else if (event.key == 'd') {
                this.addKey('right');
            }

            // Add a key for the initial serve of the ball
            if (event.code == 'Space' && !served) {
                event.preventDefault();
                this.ball.serve();
                served = true;
            }
        });

        window.addEventListener('keyup', (event) => {
            if (event.key == 'a') {
                this.delKey('left');

            } else if (event.key == 'd') {
                this.delKey('right');
            }
        });
    }

    addKey(direction) {
        if (!this.player.keys.includes(direction)) {
            this.player.keys.push(direction);
        }
    }

    delKey(direction) {
        if (this.player.keys.includes(direction)) {
            this.player.keys.splice(this.player.keys.indexOf(direction), 1);
        }
    }
}


// Starting function that will be called from the HTML page
function main() {
    // Get a reference to the object with id 'canvas' in the page
    const canvas = document.getElementById('canvas');
    // Resize the element
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    // Get the context for drawing in 2D
    ctx = canvas.getContext('2d');

    // Create the game object
    game = new Game();

    drawScene(0);
}


// Main loop function to be called once per frame
function drawScene(newTime) {
    // Compute the time elapsed since the last frame, in milliseconds
    let deltaTime = newTime - oldTime;

    // Clean the canvas so we can draw everything again
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    game.update(deltaTime);

    game.draw(ctx);

    oldTime = newTime;
    requestAnimationFrame(drawScene);
}
