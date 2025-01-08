const canvas = document.querySelector("#canvas");
const c = canvas.getContext("2d");

canvas.width = innerWidth;
canvas.height = innerHeight;
canvas.style.backgroundImage = `url("./imgs/sky.png")`;

c.mozImageSmoothingEnabled = false;
c.webkitImageSmoothingEnabled = false;
c.msImageSmoothingEnabled = false;
c.imageSmoothingEnabled = false;

const frames = 60; // frames
const fps = 1000 / 60; // ms

const KEYS = {
    UP: "UP",
    DOWN: "DOWN",
    LEFT: "LEFT",
    RIGHT: "RIGHT",
}
let keyPresses = [];

const gravity = 0.5;