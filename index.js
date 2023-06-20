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

//Set up background and foreground

const image = new Image(); // create HTML Image
image.src = "./assets/images/town.png";
image.style.transform = "scale(4)";
image.style.imageRendering = "pixelated";

const foregroundImage = new Image(); // create HTML Image
foregroundImage.src = "./assets/images/foregroundOriginal.png";
foregroundImage.style.transform = "scale(4)";
foregroundImage.style.imageRendering = "pixelated";

//Player sprite images

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

// function animate() {
//   const animationId = window.requestAnimationFrame(animate); // arg = function to be called recursively
//   c.imageSmoothingEnabled = false; // Disable image smoothing
//   background.draw();

//   boundaries.forEach((boundary) => {
//     boundary.draw();
//   });

//   battleZones.forEach((battleZone) => {
//     battleZone.draw();
//   });

//   player.draw();

//   foreground.draw(); //rendered last so we can travel behind objects

//   let moving = true;
//   player.animate = false;

//   if (battle.initiated) return;

//   if (keys.a.pressed || keys.w.pressed || keys.s.pressed || keys.d.pressed) {
//     for (let i = 0; i < battleZones.length; i++) {
//       //loop through every battlezone
//       const battleZone = battleZones[i];
//       const overlappingArea =
//         (Math.min(
//           player.position.x + player.width,
//           battleZone.position.x + battleZone.width
//         ) -
//           Math.max(player.position.x, battleZone.position.x)) *
//         (Math.min(
//           player.position.y + player.height,
//           battleZone.position.y + battleZone.height
//         ) -
//           Math.max(player.position.y, battleZone.position.y));

//       if (
//         rectangularCollision({
//           rectangle1: player,
//           rectangle2: battleZone,
//         }) &&
//         overlappingArea > (player.width * player.height) / 2 && //divide by two to increase chance of battle and prevent trigger if travelling along edges
//         Math.random() < 0.01
//       ) {
//         console.log("BATTLE");

//         // deactivate old animation loop
//         window.cancelAnimationFrame(animationId);

//         audio.Map.stop();
//         audio.initBattle.play();
//         audio.battle.play();

//         battle.initiated = true;

//         triggerBattleAnimation();

//         break; // break out as soon as collision, otherwise collision will be false with other boundaries, so not working
//       }
//     }
//   }

//   if (keys.w.pressed && lastKey == "w") {
//     player.animate = true;
//     player.image = player.sprites.up;
//     for (let i = 0; i < boundaries.length; i++) {
//       //loop through every boundary
//       const boundary = boundaries[i];
//       if (
//         rectangularCollision({
//           rectangle1: player,
//           rectangle2: {
//             ...boundary,
//             position: { x: boundary.position.x, y: boundary.position.y + 3 }, // create copy of boundary, change position to 3 ahead, to predict future collision
//           },
//         })
//       ) {
//         moving = false;
//         break; // break out as soon as collision, otherwise collision will be false with other boundaries, so not working
//       }
//     }

//     if (moving)
//       moveables.forEach((moveable) => {
//         moveable.position.y += 3;
//       });
//   } else if (keys.a.pressed && lastKey == "a") {
//     player.animate = true;
//     player.image = player.sprites.left;

//     for (let i = 0; i < boundaries.length; i++) {
//       //loop through every boundary
//       const boundary = boundaries[i];
//       if (
//         rectangularCollision({
//           rectangle1: player,
//           rectangle2: {
//             ...boundary,
//             position: { x: boundary.position.x + 3, y: boundary.position.y }, // create copy of boundary, change position to 3 ahead, to predict future collision
//           },
//         })
//       ) {
//         moving = false;
//         break; // break out as soon as collision, otherwise collision will be false with other boundaries, so not working
//       }
//     }

//     if (moving)
//       moveables.forEach((moveable) => {
//         moveable.position.x += 3;
//       });
//   } else if (keys.s.pressed && lastKey == "s") {
//     player.animate = true;
//     player.image = player.sprites.down;

//     for (let i = 0; i < boundaries.length; i++) {
//       //loop through every boundary
//       const boundary = boundaries[i];
//       if (
//         rectangularCollision({
//           rectangle1: player,
//           rectangle2: {
//             ...boundary,
//             position: { x: boundary.position.x, y: boundary.position.y - 3 }, // create copy of boundary, change position to 3 ahead, to predict future collision
//           },
//         })
//       ) {
//         moving = false;
//         break; // break out as soon as collision, otherwise collision will be false with other boundaries, so not working
//       }
//     }

//     if (moving)
//       moveables.forEach((moveable) => {
//         moveable.position.y -= 3;
//       });
//   } else if (keys.d.pressed && lastKey == "d") {
//     player.animate = true;
//     player.image = player.sprites.right;

//     for (let i = 0; i < boundaries.length; i++) {
//       //loop through every boundary
//       const boundary = boundaries[i];
//       if (
//         rectangularCollision({
//           rectangle1: player,
//           rectangle2: {
//             ...boundary,
//             position: { x: boundary.position.x - 3, y: boundary.position.y }, // create copy of boundary, change position to 3 ahead, to predict future collision
//           },
//         })
//       ) {
//         moving = false;
//         break; // break out as soon as collision, otherwise collision will be false with other boundaries, so not working
//       }
//     }

//     if (moving)
//       moveables.forEach((moveable) => {
//         moveable.position.x -= 3;
//       });
//   }
// }
document.querySelector("#userInterface").style.display = "none";
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

let clicked = false;
window.addEventListener("click", () => {
  if (!clicked) audio.Map.play();
  clicked = true;
});
