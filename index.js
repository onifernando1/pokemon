console.log("hello world");
const canvas = document.querySelector("canvas");
canvas.width = 1024;
canvas.height = 576;
const c = canvas.getContext("2d");
c.fillStyle = "white";
c.fillRect(0, 0, canvas.width, canvas.height);
