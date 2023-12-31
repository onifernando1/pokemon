//Set up canvas
const canvas = document.querySelector("canvas");
canvas.width = 1024;
canvas.height = 576;
const c = canvas.getContext("2d");

const offset = { x: -930, y: -850 }; // Coordinates to offset image to centre

//Set up collisions and battle zones

function setUpCollisions() {
  const collisionsMap = [];

  for (let i = 0; i < collisions.length; i += 70) {
    // loop through 70 tiles(Width ) (check size by map resize -> 70 tiles wide)
    collisionsMap.push(collisions.slice(i, i + 70));
  }

  const boundaries = []; // store all boundaries

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

  return boundaries;
}

const boundaries = setUpCollisions();

function setUpBattleZones() {
  const battleZonesMap = [];

  for (let i = 0; i < battleZonesData.length; i += 70) {
    // loop through 70 tiles(Width ) (check size by map resize -> 70 tiles wide)
    battleZonesMap.push(battleZonesData.slice(i, i + 70));
  }

  const battleZones = [];

  battleZonesMap.forEach((row, i) => {
    row.forEach((symbol, j) => {
      if (symbol == 1025)
        // only create boundary if boundary exists
        battleZones.push(
          new Boundary({
            position: {
              x: j * Boundary.width + offset.x,
              y: i * Boundary.height + offset.y,
            },
          })
        );
    });
  });

  return battleZones;
}

const battleZones = setUpBattleZones();

function setUpBackground() {
  const image = new Image(); // create HTML Image
  image.src = "./assets/images/town.png";
  image.style.transform = "scale(4)";
  image.style.imageRendering = "pixelated";
  const background = new Sprite({
    position: { x: offset.x, y: offset.y },
    image: image,
    background: true,
  });

  return background;
}

const background = setUpBackground();

function setUpForeground() {
  const foregroundImage = new Image(); // create HTML Image
  foregroundImage.src = "./assets/images/foregroundOriginal.png";
  foregroundImage.style.transform = "scale(4)";
  foregroundImage.style.imageRendering = "pixelated";

  const foreground = new Sprite({
    background: true,
    image: foregroundImage,
    position: { x: offset.x, y: offset.y },
  });

  return foreground;
}

const foreground = setUpForeground();

function createPlayer() {
  const playerImage = new Image();
  playerImage.src = "./assets/images/playerDown.png";

  const playerUp = new Image();
  playerUp.src = "./assets/images/playerUp.png";

  const playerDown = new Image();
  playerDown.src = "./assets/images/playerDown.png";

  const playerRight = new Image();
  playerRight.src = "./assets/images/playerRight.png";

  const playerLeft = new Image();
  playerLeft.src = "./assets/images/playerLeft.png";

  //Create player

  const player = new Sprite({
    position: {
      x: canvas.width / 2 - 192 / 4 / 2,
      y: canvas.height / 2 - 68 / 2,
    },
    image: playerImage,
    frames: { max: 4, hold: 10 },
    sprites: {
      up: playerUp,
      down: playerDown,
      right: playerRight,
      left: playerLeft,
    },
  });

  return player;
}

const player = createPlayer();

const keys = {
  // Check if key pressed
  w: { pressed: false },
  a: { pressed: false },
  s: { pressed: false },
  d: { pressed: false },
};

let lastKey = ""; // to change movement when two keys pressed

const moveables = [background, ...boundaries, foreground, ...battleZones]; //... moves all items into array, so no array in an array

function rectangularCollision({ rectangle1, rectangle2 }) {
  return (
    rectangle1.position.x + rectangle1.width >= rectangle2.position.x &&
    rectangle1.position.x <= rectangle2.position.x + rectangle2.width &&
    rectangle1.position.y <= rectangle2.position.y + rectangle2.height &&
    rectangle1.position.y + rectangle1.height >= rectangle2.position.y
  ); // return true / false based on if there is a collision
}

const battle = { initiated: false };

function startBatlle() {}

function triggerBattleAnimation() {
  gsap.to("#transition", {
    opacity: 1,
    repeat: 3,
    yoyo: true,
    duration: 0.4,
    onComplete() {
      gsap.to("#transition", {
        opacity: 1,
        duration: 0.4,
        onComplete() {
          // activate new animation loop
          initBattle();
          animateBattle();
          gsap.to("#transition", {
            opacity: 0,
            duration: 0.4,
          });
        },
      });
    },
  });
}

document.querySelector("#userInterface").style.display = "none";

animate();

let clicked = false;
window.addEventListener("click", () => {
  if (!clicked) audio.Map.play();
  clicked = true;
});

addKeyEventListeners();
