console.log("hello world");
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

console.log(boundaries);

const image = new Image(); // create HTML Image
image.src = "./assets/images/town.png";
image.style.transform = "scale(4)";
image.style.imageRendering = "pixelated";

const playerImage = new Image();
playerImage.src = "./assets/images/playerDown.png";
playerImage.onload = () => {};

//Only call drawImage after image loaded
// image.onload = () => {
//   const scaledWidth = image.width * 4; // Calculate the scaled width
//   const scaledHeight = image.height * 4; // Calculate the scaled height
//   c.imageSmoothingEnabled = false; // Disable image smoothing
//   c.drawImage(image, -930, -850, scaledWidth, scaledHeight); // Start at house
//   c.drawImage(
//     playerImage,
//     0, // x start crop
//     0, // y start crop
//     playerImage.width / 4, //crop one section of image (x axis),
//     playerImage.height, // crop one section of image (y axis)
//     canvas.width / 2 - playerImage.width / 4 / 2,
//     canvas.height / 2 - playerImage.height / 2,
//     playerImage.width / 4, //size to render
//     playerImage.height // size to render
//   ); // Declare player image after map loads as map larger, place in center
// };

class Sprite {
  constructor({ position, velocity, image }) {
    // object prevents order mattering
    this.position = position;
    this.image = image;
  }

  draw() {
    const scaledWidth = this.image.width * 4; // Calculate the scaled width
    const scaledHeight = this.image.height * 4; // Calculate the scaled height
    c.drawImage(
      this.image,
      this.position.x,
      this.position.y,
      scaledWidth,
      scaledHeight
    ); // Start at house
  }
}

const background = new Sprite({
  position: { x: offset.x, y: offset.y },
  image: image,
});

const keys = {
  // Check if key pressed
  w: { pressed: false },
  a: { pressed: false },
  s: { pressed: false },
  d: { pressed: false },
};

let lastKey = ""; // to change movement when two keys pressed

const testBoundary = new Boundary({ position: { x: 400, y: 400 } });

const moveables = [background, testBoundary];

function animate() {
  window.requestAnimationFrame(animate); // arg = function to be called recursively

  c.imageSmoothingEnabled = false; // Disable image smoothing
  background.draw();

  //   boundaries.forEach((boundary) => {
  //     boundary.draw();
  //   });

  testBoundary.draw();

  c.drawImage(
    playerImage,
    0, // x start crop
    0, // y start crop
    playerImage.width / 4, //crop one section of image (x axis),
    playerImage.height, // crop one section of image (y axis)
    canvas.width / 2 - playerImage.width / 4 / 2,
    canvas.height / 2 - playerImage.height / 2,
    playerImage.width / 4, //size to render
    playerImage.height // size to render
  ); // Declare player image after map loads as map larger, place in center

  if (keys.w.pressed && lastKey == "w") {
    moveables.forEach((moveable) => {
      moveable.position.y += 3;
    });
  } else if (keys.a.pressed && lastKey == "a") {
    moveables.forEach((moveable) => {
      moveable.position.x += 3;
    });
  } else if (keys.s.pressed && lastKey == "s") {
    moveables.forEach((moveable) => {
      moveable.position.y -= 3;
    });
  } else if (keys.d.pressed && lastKey == "d") {
    moveables.forEach((moveable) => {
      moveable.position.x -= 3;
    });
  }
}

animate();

window.addEventListener("keydown", (e) => {
  // Listen to key movements to move player
  console.log(e.key);
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
  console.log(e.key);
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
