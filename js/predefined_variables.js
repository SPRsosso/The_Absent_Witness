const canvas = document.querySelector("#canvas");
const c = canvas.getContext("2d");

canvas.width = innerWidth;
canvas.height = innerHeight;
canvas.style.backgroundColor = "black";

canvas.clear = () => {
    c.clearRect(0, 0, canvas.width, canvas.height);
}

const frames = 60;
const fps = 1000 / 60;

const gravity = 0.5;

const KEYS = {
    UP: "UP",
    DOWN: "DOWN",
    LEFT: "LEFT",
    RIGHT: "RIGHT",
}
let keyPresses = [];