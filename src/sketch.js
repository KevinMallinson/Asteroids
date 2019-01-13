setup = function () {
  createCanvas(canvasWidth, canvasHeight);
  frameRate(60);

  ship = new Ship();
  asteroids = []

  for (i = 0; i < 50; i++) {
    asteroids[i] = new Asteroid();

    //Check if the asteroid is in the forcefield, if so, create a new asteroid at index
    //This is to prevent instant loss of life, due to an asteroid spawning at the ship.
    while (ship.inForceField(asteroids[i])) {
      asteroids[i] = new Asteroid();
    }
  }

  lazers = [];

  scoreBoard = new ScoreBoard(ship, asteroids);
};

windowResized = function () {
  canvasWidth = windowWidth;
  canvasHeight = windowHeight;
  resizeCanvas(canvasWidth, canvasHeight);
}

keyPressed = function () {
  //We can hold down multiple keys, so no else ifs here (except for LR and UD)
  if (keyCode == LEFT_ARROW) {
    ship.leftPressed = true;
  } else if (keyCode == RIGHT_ARROW) {
    ship.rightPressed = true;
  }

  if (keyCode == UP_ARROW) {
    ship.upPressed = true;
  } else if (keyCode == DOWN_ARROW) {
    ship.downPressed = true;
  }

  //For now, just create a lazer on each space press here
  if (key == ' ') {
    if (ship.lives != 0) {
      lazers.push(new Lazer(ship.x, ship.y, ship.angle));
    }
  }
}

keyReleased = function () {
  if (keyCode == LEFT_ARROW) {
    ship.leftPressed = false;
  } else if (keyCode == RIGHT_ARROW) {
    ship.rightPressed = false;
  }

  if (keyCode == UP_ARROW) {
    ship.upPressed = false;
  } else if (keyCode == DOWN_ARROW) {
    ship.downPressed = false;
  }
}

draw = function () {
  background(0);

  if (ship.lives > 0) {
    //Check if any lazer has hit any asteroid. Do this first, because we might change the asteroid array.
    lazers.forEach(function (lazer, lIndex, lArr) {
      asteroids.forEach(function (asteroid, aIndex, aArr) {
        if (lazer.hit(asteroid)) {
          //Kill the lazer so it doesn't start a chain reaction of splitting the asteroids
          lArr.splice(lIndex, 1);

          //Kill the asteroid too, but get its x, y, and radius first.
          //Radius is used to determine if we should make more asteroids.
          var x = asteroid.x;
          var y = asteroid.y;
          var radius = asteroid.r;
          aArr.splice(aIndex, 1);

          //We hit an asteroid, so increment score.
          ship.scoreUp();

          //If the radius is above 20 (always unless it was created here)
          //Then we want to make new asteroids! 
          //Else, dont do it. This allows for a game end condition.
          if (radius > 20) {
            //Create 3 new asteroids at its location
            asteroids.push(new Asteroid(20, x, y));
            asteroids.push(new Asteroid(20, x, y));
            asteroids.push(new Asteroid(20, x, y));
          }
        }
      });
    });

    var reset = false;
    asteroids.forEach(function (asteroid) {
      asteroid.update();
      asteroid.draw();

      //Check if the ship has collided with any asteroids, if so, we need to reset its position
      //to the middle, and reduce its remaining lives
      if (ship.collided(asteroid)) {
        ship.reset();
        reset = true;
      }

    })

    //Since we've reset, we need a secondary loop over the asteroids to clear the center again
    if (reset) {
      for (var i = 0; i < asteroids.length; i++) {
        var radius = asteroids[i].r;
        while (ship.inForceField(asteroids[i])) {
          //Move the asteroid so we dont just lose all our lives
          asteroids[i] = new Asteroid(radius);
        }
      }
    }

    lazers.forEach(function (lazer) {
      lazer.update();
      lazer.draw();
    });

    ship.update();
    ship.draw();
  }

  scoreBoard.draw();
};