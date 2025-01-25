var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { areas } from "./data/areas.js";
import { init } from "./init.js";
import { ObjectType } from "./objects/object_type.js";
import { objects } from "./objects/objects.js";
import { Player } from "./player.js";
import { preloadAssets } from "./preload.js";
export const gravity = 0.1;
export const canvas = document.getElementById("canvas");
canvas.width = innerWidth;
canvas.height = innerHeight;
canvas;
export const c = canvas.getContext("2d");
c.imageSmoothingEnabled = false;
export const items = document.querySelector(".items");
export const player = new Player(1920 / 2, 0, 180, 360);
const menu = document.querySelector(".menu");
let bt = performance.now();
export let dt = 0;
let fpsCounter = 0;
let dtSum = 0;
const fps = 1000 / 60;
function game() {
    //! Setup dt
    const tmp = performance.now();
    dt = (tmp - bt) / fps;
    bt = tmp;
    if (dt > 2) {
        dt = 2;
    }
    if (dtSum >= fps) {
        dtSum -= 1000;
        fpsCounter = 0;
    }
    fpsCounter++;
    dtSum += dt;
    //! Game loop
    c.beginPath();
    c.fillStyle = "black";
    c.fillRect(0, 0, canvas.width, canvas.height);
    Object.values(areas).forEach(area => {
        area.clear();
        area.render();
    });
    objects.forEach(obj => {
        if (obj.type !== ObjectType.Area && obj.backdropRendering) {
            obj.render();
        }
    });
    player.render();
    objects.forEach(obj => {
        if (obj.type !== ObjectType.Area && !obj.backdropRendering) {
            obj.render();
        }
    });
    requestAnimationFrame(game);
}
function start() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield preloadAssets();
            yield init();
            if (menu)
                menu.style.display = "none";
            player.init();
            player.teleport(areas.workshop.left() + 530, areas.workshop.bottom() - player.h);
            game();
        }
        catch (error) {
            console.error('Error during asset loading:', error);
        }
    });
}
start();
