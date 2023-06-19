const canvas = document.querySelector("canvas");
canvas.width = 1024;
canvas.height = 576;

const c = canvas.getContext("2d");

const collisionsMap = [];

for (let i = 0; i < collisions.length; i += 70) {
  // loop through 70 tiles(Width ) (map resize -> 70 tiles wide)
  collisionsMap.push(collisions.slice(i, i + 70));
}

const boundaries = []; // store all boundaries

const offset = { x: -930, y: -850 }; // Offset image to centre

collisionsMap.forEach((row, i) => {
  row.forEach((symbol, j) => {
    if (symbol == 1025)
      // only create boundary if boundary exists
      boundaries.push(
        new Boundary({
          position: {
            x: j * Boundary.width + offset.x,
            y: i * Boundary.height + offset.y,
          },
        })
      );
  });
});

const image = new Image(); // create HTML Image
image.src = "./assets/images/town.png";
image.style.transform = "scale(4)";
image.style.imageRendering = "pixelated";

const foregroundImage = new Image(); // create HTML Image
foregroundImage.src = "./assets/images/foregroundOriginal.png";
foregroundImage.style.transform = "scale(4)";
foregroundImage.style.imageRendering = "pixelated";

const playerImage = new Image();
playerImage.src = "./assets/images/playerDown.png";
playerImage.onload = () => {};

const player = new Sprite({
  position: {
    x: canvas.width / 2 - 192 / 4 / 2,
    y: canvas.height / 2 - 68 / 2,
  },
  image: playerImage,
  frames: { max: 4 },
});

const background = new Sprite({
  position: { x: offset.x, y: offset.y },
  image: image,
  background: true,
});

const foreground = new Sprite({
  background: true,
  image: foregroundImage,
  position: { x: offset.x, y: offset.y },
});

const keys = {
  // Check if key pressed
  w: { pressed: false },
  a: { pressed: false },
  s: { pressed: false },
  d: { pressed: false },
};

let lastKey = ""; // to change movement when two keys pressed

const moveables = [background, ...boundaries, foreground]; //... moves all items into array, so no array in an array

function rectangularCollision({ rectangle1, rectangle2 }) {
  return (
    rectangle1.position.x + rectangle1.width >= rectangle2.position.x &&
    rectangle1.position.x <= rectangle2.position.x + rectangle2.width &&
    rectangle1.position.y <= rectangle2.position.y + rectangle2.height &&
    rectangle1.position.y + rectangle1.height >= rectangle2.position.y
  ); // return true / false based on if there is a collision
}

function animate() {
  window.requestAnimationFrame(animate); // arg = function to be called recursively

  c.imageSmoothingEnabled = false; // Disable image smoothing
  background.draw();

  boundaries.forEach((boundary) => {
    boundary.draw();

    if (rectangularCollision({ rectangle1: player, rectangle2: boundary })) {
      //if right side of player (player position + width) touches boundaries x, it colllide)
      console.log("colliding");
    }
  });

  player.draw();

  foreground.draw();

  let moving = true;

  if (keys.w.pressed && lastKey == "w") {
    for (let i = 0; i < boundaries.length; i++) {
      //loop through every boundary
      const boundary = boundaries[i];
      if (
        rectangularCollision({
          rectangle1: player,
          rectangle2: {
            ...boundary,
            position: { x: boundary.position.x, y: boundary.position.y + 3 }, // create copy of boundary, change position to 3 ahead, to predict future collision
          },
        })
      ) {
        console.log("colliding");
        moving = false;
        break; // break out as soon as collision, otherwise collision will be false with other boundaries, so not working
      }
    }

    if (moving)
      moveables.forEach((moveable) => {
        moveable.position.y += 3;
      });
  } else if (keys.a.pressed && lastKey == "a") {
    for (let i = 0; i < boundaries.length; i++) {
      //loop through every boundary
      const boundary = boundaries[i];
      if (
        rectangularCollision({
          rectangle1: player,
          rectangle2: {
            ...boundary,
            position: { x: boundary.position.x + 3, y: boundary.position.y }, // create copy of boundary, change position to 3 ahead, to predict future collision
          },
        })
      ) {
        console.log("colliding");
        moving = false;
        break; // break out as soon as collision, otherwise collision will be false with other boundaries, so not working
      }
    }

    if (moving)
      moveables.forEach((moveable) => {
        moveable.position.x += 3;
      });
  } else if (keys.s.pressed && lastKey == "s") {
    for (let i = 0; i < boundaries.length; i++) {
      //loop through every boundary
      const boundary = boundaries[i];
      if (
        rectangularCollision({
          rectangle1: player,
          rectangle2: {
            ...boundary,
            position: { x: boundary.position.x, y: boundary.position.y - 3 }, // create copy of boundary, change position to 3 ahead, to predict future collision
          },
        })
      ) {
        console.log("colliding");
        moving = false;
        break; // break out as soon as collision, otherwise collision will be false with other boundaries, so not working
      }
    }

    if (moving)
      moveables.forEach((moveable) => {
        moveable.position.y -= 3;
      });
  } else if (keys.d.pressed && lastKey == "d") {
    for (let i = 0; i < boundaries.length; i++) {
      //loop through every boundary
      const boundary = boundaries[i];
      if (
        rectangularCollision({
          rectangle1: player,
          rectangle2: {
            ...boundary,
            position: { x: boundary.position.x - 3, y: boundary.position.y }, // create copy of boundary, change position to 3 ahead, to predict future collision
          },
        })
      ) {
        console.log("colliding");
        moving = false;
        break; // break out as soon as collision, otherwise collision will be false with other boundaries, so not working
      }
    }

    if (moving)
      moveables.forEach((moveable) => {
        moveable.position.x -= 3;
      });
  }
}

animate();

window.addEventListener("keydown", (e) => {
  // Listen to key movements to move player
  switch (e.key) {
    case "w":
      keys.w.pressed = true;
      lastKey = "w";
      break;
    case "a":
      keys.a.pressed = true;
      lastKey = "a";
      break;
    case "s":
      keys.s.pressed = true;
      lastKey = "s";
      break;
    case "d":
      keys.d.pressed = true;
      lastKey = "d";
      break;
  }
});

window.addEventListener("keyup", (e) => {
  // Listen to one key lifted, and set pressed to false
  // Listen to key movements to move player
  switch (e.key) {
    case "w":
      keys.w.pressed = false;
      break;
    case "a":
      keys.a.pressed = false;
      break;
    case "s":
      keys.s.pressed = false;
      break;
    case "d":
      keys.d.pressed = false;
      break;
  }
});
