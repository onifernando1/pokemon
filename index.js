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

console.log(collisionsMap);
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

const background = new Sprite({ position: { x: -930, y: -850 }, image: image });

const keys = {
  // Check if key pressed
  w: { pressed: false },
  a: { pressed: false },
  s: { pressed: false },
  d: { pressed: false },
};

let lastKey = ""; // to change movement when two keys pressed
function animate() {
  window.requestAnimationFrame(animate); // arg = function to be called recursively

  c.imageSmoothingEnabled = false; // Disable image smoothing
  background.draw();
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

  if (keys.w.pressed && lastKey == "w") background.position.y += 3;
  else if (keys.a.pressed && lastKey == "a") background.position.x += 3;
  else if (keys.s.pressed && lastKey == "s") background.position.y -= 3;
  else if (keys.d.pressed && lastKey == "d") background.position.x -= 3;
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
