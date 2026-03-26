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

// Class for the game ball
class Ball extends GameObject {
    constructor(position, width, height, color, sheetCols) {
        super(position, width, height, color, "ball", sheetCols);
        this.velocity = new Vector(0, 0);
        this.special = false;
    }

    

    update(deltaTime) {
        this.velocity = this.velocity.normalize().times(ballSpeed);
        this.position = this.position.plus(this.velocity.times(deltaTime));
    }

    reset() {
        this.position = new Vector(canvasWidth / 2, canvasHeight / 2);
        this.velocity = new Vector(0, 0);
    }

    serve1() {
        // Get a random angle
        let angle = Math.random() * 3 * Math.PI / 4 - (Math.PI / 4);
        this.reset();
        // Convert the angle into a cartesian vector
        this.velocity.x = Math.cos(angle);
        this.velocity.y = -0.5

        // Choose a random direction
        if (Math.random() > 0.5) {
            this.velocity.x *= -1;
        }
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

// Class for the main character in the game
class Paddle extends GameObject {
    constructor(position, width, height, color, sheetCols) {
        super(position, width, height, color, "paddle", sheetCols);
        this.velocity = new Vector(0, 0);

        this.motion = {
            up: {
                axis: "y",
                sign: -1,
            },
            down: {
                axis: "y",
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

        this.velocity = this.velocity.normalize().times(paddleSpeed);

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

class Brick extends GameObject {
    constructor(position, width, height, color, sheetCols) {
        super(position, width, height, color, "brick", sheetCols);
        this.special = false;
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

        // Variables to keep score of the game
        this.pointsRight = 0;
        this.pointsLeft = 0;
    }

    initObjects() {
        // Add another object to draw a background
        this.background = new GameObject(new Vector(canvasWidth / 2, canvasHeight / 2), canvasWidth, canvasHeight);
        this.background.setSprite("../assets/sprites/trak2_plate2b.png");

        this.barrierLeft = new Paddle(new Vector(0, canvasHeight / 2),
            2, canvasHeight, "red");
        this.barrierRight = new Paddle(new Vector(canvasWidth, canvasHeight / 2),
            2, canvasHeight, "blue");



        this.barrierTop = new GameObject(new Vector(canvasWidth / 2, 0), canvasWidth, 20);

        this.barrierBottom = new GameObject(new Vector(canvasWidth / 2, canvasHeight), canvasWidth, 20);


        this.goalRight = new GameObject(new Vector(canvasWidth, canvasHeight / 2), 20, canvasHeight, "green");
        this.goalLeft = new GameObject(new Vector(0, canvasHeight / 2), 20, canvasHeight, "green");

        // Labels to show the score of each player
        this.pointsTextLeft = new TextLabel(canvasWidth / 4, 80, "40px Ubuntu Mono", "white");
        this.pointsTextRight = new TextLabel(canvasWidth / 4 * 3, 80, "40px Ubuntu Mono", "white");

        this.player = new Player(new Vector(canvasWidth / 2, canvasHeight - (canvasHeight * 0.1)), canvasHeight * 0.25, canvasWidth * 0.034, "red");

        this.ball = new Ball(new Vector(this.player.position.x, this.player.position.y-24),
            20, 20, "white");
        this.ball.followPlayer(this.player);
        this.actors = [];
        this.additional = [];
        

        // columns, rows
        this.createLevel(8, 5);

    }

    draw(ctx) {
        // Draw the background first, so everything else is drawn on top
        this.background.draw(ctx);


        this.ball.draw(ctx);

        for (let actor of this.actors) {
            actor.draw(ctx);
        }
        this.player.draw(ctx);
    }

    update(deltaTime) {
        // Move the paddleLeft
        this.barrierLeft.update(deltaTime);
        this.barrierRight.update(deltaTime);
        this.player.update(deltaTime);

        if (served) {
            this.ball.update(deltaTime);
        } else {
            this.ball.followPlayer(this.player);
        }


        
// first check if it comes from left or right
// 
        

        // Checks collision for the ball and the player
        if (boxOverlap(this.ball, this.player)&& this.ball.position.y < this.player.position.y) {
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
        }

        if (boxOverlap(this.ball, this.barrierLeft) || boxOverlap(this.ball, this.barrierRight)) {
            this.ball.velocity.x *= -1;
            this.ping.play();
        }



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
                this.bounceBallAgainstActor(actor);
                this.actors.splice(this.actors.indexOf(actor), 1);
                this.ping.play();
                break;
            }
        }


    }

    bounceBallAgainstActor(actor) {
        const dx = this.ball.position.x - actor.position.x;
        const dy = this.ball.position.y - actor.position.y;

        const overlapX = (this.ball.halfSize.x + actor.halfSize.x) - Math.abs(dx);
        const overlapY = (this.ball.halfSize.y + actor.halfSize.y) - Math.abs(dy);

        // Smaller overlap tells us which face was crossed first.
        if (overlapX < overlapY) {
            this.ball.velocity.x *= -1;
            const dirX = dx >= 0 ? 1 : -1;
            this.ball.position.x = actor.position.x + dirX * (actor.halfSize.x + this.ball.halfSize.x + 0.1);
        } else {
            this.ball.velocity.y *= -1;
            const dirY = dy >= 0 ? 1 : -1;
            this.ball.position.y = actor.position.y + dirY * (actor.halfSize.y + this.ball.halfSize.y + 0.1);
        }
    }


    createLevel(cols, rows) {
        const blockWidth = canvasWidth / cols;
        const blockHeight = (canvasHeight / 2) / rows;
        let colors = ["red","purple","fuchsia", "green", "lime", "olive"]
        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                // Center of each block in the grid cell
                const x = canvasWidth * ((1 + 2 * col) / (2 * cols));
                const y = (canvasHeight / 2) * ((1 + 2 * row) / (2 * rows));

                const box = new Brick(new Vector(x, y), blockWidth - 1, blockHeight - 1, colors[row%6]);

                this.actors.push(box);
            }
        }
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
