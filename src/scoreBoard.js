class ScoreBoard {
    constructor(ship, asteroids) {
        this.ship = ship;
        this.asteroids = asteroids;
    }

    draw() {
        push();

        textSize(32);
        fill(255);
        text('Score: ' + ship.score, 0, 30);

        textSize(32);
        fill(255);
        text('Lives: ' + ship.lives, 0, 60);

        if (ship.lives == 0) {
            textSize(100);
            fill(255);

            var gameOverStr = "GAME OVER!";
            var length = textWidth(gameOverStr);

            text(gameOverStr, width/2 - length/2, height/2);
        }

        if (this.asteroids.length == 0 && ship.lives > 0) {
            textSize(100);
            fill(255);

            var youWinString = "YOU WIN!";
            var length = textWidth(youWinString);

            text(youWinString, width/2 - length/2, height/2);
        }



        pop();   
    }
}