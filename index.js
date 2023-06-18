console.log("hello world");
const canvas = document.querySelector("canvas");
canvas.width = 1024;
canvas.height = 576;

const c = canvas.getContext("2d");

c.fillStyle = "white";
c.fillRect(0, 0, canvas.width, canvas.height);

const image = new Image(); // create HTML Image
image.src = "./assets/images/town.png";

//Only call drawImage after image loaded
image.onload = () => {
  c.drawImage(image, 0, 0); //arg = html img, x position, y position)
};
