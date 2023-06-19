const canvas = document.querySelector("canvas");
canvas.width = 1024;
canvas.height = 576;

const c = canvas.getContext("2d");

const collisionsMap = [];

for (let i = 0; i < collisions.length; i += 70) {
  // loop through 70 tiles(Width ) (map resize -> 70 tiles wide)
  collisionsMap.push(collisions.slice(i, i + 70));
}

class Boundary {
  static width = 48;
  static height = 48;

  constructor({ position }) {
    this.position = position;
    this.width = 48; // exported at 12 pixeled, then scaled by 4
    this.height = 48;
  }

  draw() {
    c.fillStyle = "red";
    c.fillRect(this.position.x, this.position.y, this.width, this.height);
  }
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

const playerImage = new Image();
playerImage.src = "./assets/images/playerDown.png";
playerImage.onload = () => {};

class Sprite {
  constructor({ position, velocity, image, background, frames = { max: 1 } }) {
    // object prevents order mattering
    this.position = position;
    this.image = image;
    this.background = background;
    this.frames = frames;

    this.image.onload = () => {
      this.width = this.image.width / this.frames.max; // will only work when image loaded
      this.height = this.image.height;
    };
  }

  draw() {
    if (this.background == true) {
      const scaledWidth = this.image.width * 4; // Calculate the scaled width
      const scaledHeight = this.image.height * 4; // Calculate the scaled height
      c.drawImage(
        this.image,
        this.position.x,
        this.position.y,
        scaledWidth,
        scaledHeight
      ); // Start at house
    } else
      c.drawImage(
        this.image,
        0, // x start crop
        0, // y start crop
        this.image.width / this.frames.max, //crop one section of image (x axis),
        this.image.height, // crop one section of image (y axis)
        this.position.x,
        this.position.y,
        this.image.width / this.frames.max, //size to render
        this.image.height // size to render
      ); // Declare player image after map loads as map larger, place in center
  }
}

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

const keys = {
  // Check if key pressed
  w: { pressed: false },
  a: { pressed: false },
  s: { pressed: false },
  d: { pressed: false },
};

let lastKey = ""; // to change movement when two keys pressed

const moveables = [background, ...boundaries]; //... moves all items into array, so no array in an array

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
