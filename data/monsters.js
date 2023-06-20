const embyImage = new Image();
embyImage.src = "./assets/images/embySprite.png";

const draggleImage = new Image();
draggleImage.src = "./assets/images/draggleSprite.png";

const monsters = {
  Emby: {
    position: { x: 280, y: 325 },
    image: embyImage,
    frames: { max: 4, hold: 30 },
    animate: true,
    name: "Emby",
  },
  Draggle: {
    position: { x: 800, y: 100 },
    image: draggleImage,
    frames: { max: 4, hold: 30 },
    animate: true,
    isEnemy: true,
    name: "Draggle",
  },
};
