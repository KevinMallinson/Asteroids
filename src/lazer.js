class Lazer {

    constructor(shipX, shipY, angle) {
        //Set the lazer to begin not in the center of the ship
        this.x = shipX;
        this.y = shipY;

        //Make the lazer inherit the same velocity + some value

        //TODO: How does this work?
        var vec = p5.Vector.fromAngle(angle);
        this.velocity = {
            x: vec.x * 7.5,
            y: vec.y * 7.5
        };

        this.angle = angle;
        this.length = 10;
    }

    update() {
        this.move();
    }

    move() {
        this.x += this.velocity.x;
        this.y += this.velocity.y;
    }

    hit(asteroid) {
        //Get the scalar distance of the point from the asteroid
        var distance = dist(this.x, this.y, asteroid.x, asteroid.y);

        //If the distance is less than radius of asteroid, then it 'hit'
        if (distance < asteroid.r) {
            return true;
        }

        return false;
    }

    draw() {
        push();
        noFill();
        stroke(255);
        strokeWeight(4);
        translate(this.x, this.y);
        // rotate(this.angle + PI / 2);
        point(0, 0);
        pop();
    }
}