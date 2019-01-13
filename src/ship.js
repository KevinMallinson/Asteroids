class Ship {
    constructor() {
        this.x = canvasWidth / 2;
        this.y = canvasHeight / 2;

        this.r = 20;
        this.forceField = this.r * 8;
        this.angle = 0;

        this.width = 50;
        this.height = 65;

        this.velocity = {
            x: 0,
            y: 0
        }

        this.rotation = 0;

        //We dont want to use JS Events for keyboard input, but rather we want to poll
        //So we can simulate that with these variables
        this.upPressed = false;
        this.downPressed = false;
        this.leftPressed = false;
        this.rightPressed = false;

        this.lives = 3;
        this.score = 0;
    }

    update() {
        //Only do this if lives > 0
        if (this.lives != 0) {
            //Consider the input, and move the ship accordingly
            if (this.leftPressed) {
                this.setRotation(-0.001);
            }
            if (this.rightPressed) {
                this.setRotation(0.001);
            }

            //If neither left or right is pressed, stop rotation
            if (!this.leftPressed && !this.rightPressed) {
                this.stopRotation(this.rotation * 0.90);

            }

            //If neither up or down is pressed, stop forward/backward movement
            if (!this.upPressed && !this.downPressed) {
                this.stopMovement(this.velocity.x * 0.95, this.velocity.y * 0.95);
            }

            if (this.upPressed) {
                this.boost();
            }
            else if (this.downPressed) {
                this.boost("down");
            }

            //We always have to turn, to simulate the space environment
            //i.e. we need to thrust in opposite direction to negate a turn
            this.turn();

            //Similarly, we must always move
            this.move();

            //Allow looping around the edges
            this.edges();
        }
    }

    setRotation(dir) {
        this.rotation += dir;
    }
    
    stopRotation(val) {
        this.rotation = val
    }

    stopMovement(x, y) {
        this.velocity.x = x;
        this.velocity.y = y;
    }

    reset() {
        if (this.lives != 0) {
            this.lives--;
            this.x = width / 2;
            this.y = height / 2;
            this.velocity.x = 0;
            this.velocity.y = 0;
            this.angle = 0;
            this.rotation = 0;
        }
    }

    boost(dir) {
        //TODO: Work it out using SIN and COS
        var force = p5.Vector.fromAngle(this.angle);

        //Invert the force to slow us down instead (and reverse us)
        if (dir == "down") {
            force.x *= -1;
            force.y *= -1;
        }

        //Apply the force to our velocity
        this.velocity.x += force.x / 10
        this.velocity.y += force.y / 10;

        //Max velocity is 8px in either direction, to prevent it getting too fast
        if (this.velocity.x > 4) {
            this.velocity.x = 4;
        }

        if (this.velocity.y > 4) {
            this.velocity.y = 4;
        }

        //Likewise for negative (reverse)
        if (this.velocity.x < -4) {
            this.velocity.x = -4;
        }

        if (this.velocity.y < -4) {
            this.velocity.y = -4;
        }
    }

    turn() {
        this.angle += this.rotation;
    }

    move() {
        this.x += this.velocity.x;
        this.y += this.velocity.y;
    }

    inForceField(asteroid) {
        if (dist(this.x, this.y, asteroid.x, asteroid.y) < this.forceField) {
            return true;
        }

        return false;
    }

    collided(asteroid) {
        //Offset by ships radius too
        if (dist(this.x, this.y, asteroid.x, asteroid.y) < asteroid.r + this.r) {
            return true;
        }

        return false;
    }

    scoreUp() {
        this.score += 20;
    }

    edges() {
        //Some arbitrary offset to account for the antenna on the ship
        var offset = 2;
        if (this.x - this.r * offset > canvasWidth) {
            this.x = 0 - this.r * offset;
        } else if (this.x + this.r * offset < 0) {
            this.x = canvasWidth + this.r * offset
        } else if (this.y - this.r * offset > canvasHeight) {
            this.y = 0 - this.r * offset;
        } else if (this.y + this.r * offset < 0) {
            this.y = canvasHeight + this.r * offset
        }
    }

    draw() {
        //Push the state of the drawing program, so it's not affecting anything else
        push();

        fill(255);
        stroke(255);

        //Translate resets the 0,0 position to the given parameters!
        translate(this.x, this.y); //Now the x and y in the below function is relative to this.x and this.y

        //Rotate applies the given angle to the drawing
        rotate(this.angle + PI / 2);

        triangle(
            //First two parameters are the bottom left
            -this.r,
            this.r,
            //Next we have bottom right
            this.r,
            this.r,
            //Then we have top
            0,
            -this.r
        );

        //Draw two lines to further emphasize our heading/direction
        line(-this.r, this.r, -this.r - this.r / 2, this.r * 2);
        line(this.r, this.r, this.r + this.r / 2, this.r * 2);

        //Pop the state of the drawing program, so it's not saved
        pop();
    }

}