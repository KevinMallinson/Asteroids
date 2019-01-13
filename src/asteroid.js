class Asteroid {

    //Radius, x, and y, are all OPTIONAL parameters.
    constructor(radius, x, y) {
        if (x === undefined) {
            this.x = random(0, canvasWidth);
        } else {
            this.x = x;
        }

        if (y === undefined) {
            this.y = random(0, canvasHeight);
        } else {
            this.y = y;
        }

        if (radius === undefined) {
            this.r = random(30, 40);
        } else {
            this.r = radius;
        }
        this.totalPoints = random(5, 15);

        this.velocity = {
            x: random(-1, 1),
            y: random(-1, 1)
        };

        //Create an array of offsets to make the traditional asteroid 'jaggyness'
        this.offset = []
        for (var i = 0; i < this.totalPoints; i++) {
            this.offset[i] = random(-15, 15);
        }

    }

    update() {
        this.move();
        this.edges();
    }

    move() {
        this.x += this.velocity.x;
        this.y += this.velocity.y;
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
        push();
        noFill();
        stroke(255);
        translate(this.x, this.y);
        // ellipse(0, 0, this.r * 2);

        beginShape();

        //Math humbly provided by The Coding Train (Daniel Shiffman)
        for (var i = 0; i < this.totalPoints; i++) {
            //TODO: Understand the math
            var angle = map(i, 0, this.totalPoints, 0, TWO_PI);
            var x = (this.r + this.offset[i]) * cos(angle);
            var y = (this.r + this.offset[i]) * sin(angle);
            vertex(x, y);
        }

        endShape(CLOSE);


        pop();
    }


}