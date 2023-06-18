console.log("hello world");
const canvas = document.querySelector("canvas");
canvas.width = 1024;
canvas.height = 576;

const c = canvas.getContext("2d");

c.fillStyle = "white";
c.fillRect(0, 0, canvas.width, canvas.height);

const image = new Image(); // create HTML Image
image.src = "./assets/images/town.png";
image.style.transform = "scale(4)";
image.style.imageRendering = "pixelated";

const playerImage = new Image();
playerImage.src = "./assets/images/playerDown.png";
playerImage.onload = () => {};

//Only call drawImage after image loaded
image.onload = () => {
  const scaledWidth = image.width * 4; // Calculate the scaled width
  const scaledHeight = image.height * 4; // Calculate the scaled height
  c.imageSmoothingEnabled = false; // Disable image smoothing
  c.drawImage(image, -930, -850, scaledWidth, scaledHeight); // Start at house
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
};
