var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var _a, _b, _c, _d, _e, _f;
import { areas } from "./data/areas.js";
import { init } from "./init.js";
import { ObjectType } from "./objects/object_type.js";
import { objects } from "./objects/objects.js";
import { Player } from "./player.js";
import { preloadAssets } from "./preload.js";
export const gravity = 0.1;
export let volume = 0.4;
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
            player.teleport(areas.workshop_reception.realLeft() + 530, areas.workshop_reception.realBottom() - player.h);
            // player.items.push(new Item("coin", "50 Cents", "key"));
            game();
        }
        catch (error) {
            console.error('Error during asset loading:', error);
        }
    });
}
// start();
export function openModal(name) {
    const el = document.getElementById(name);
    if (!el)
        return;
    el.style.display = "block";
}
export function closeModal(name) {
    const el = document.getElementById(name);
    if (!el)
        return;
    el.style.display = "none";
}
(_a = document.querySelector("#start-btn")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", start);
(_b = document.querySelectorAll(".settings-btn")) === null || _b === void 0 ? void 0 : _b.forEach(btn => {
    btn.addEventListener("click", () => {
        openModal("settings");
    });
});
(_c = document.querySelectorAll(".tutorial-btn")) === null || _c === void 0 ? void 0 : _c.forEach(btn => {
    btn.addEventListener("click", () => {
        openModal("tutorial");
    });
});
(_d = document.querySelector("#close-settings-btn")) === null || _d === void 0 ? void 0 : _d.addEventListener("click", () => {
    closeModal("settings");
});
(_e = document.querySelector("#close-tutorial-btn")) === null || _e === void 0 ? void 0 : _e.addEventListener("click", () => {
    closeModal("tutorial");
});
(_f = document.querySelector("#close-pause-btn")) === null || _f === void 0 ? void 0 : _f.addEventListener("click", () => {
    closeModal("pause");
});
//! SLIDER
let sliderClicked = false;
let sliderClickedPos = {
    x: 0,
};
const sliderThumb = document.querySelector("#slider-thumb");
const sliderTrack = document.querySelector("#slider-track");
if (sliderTrack && sliderThumb) {
    document.getElementById("settings").style.display = "block";
    const left = (sliderTrack.clientWidth - sliderThumb.clientWidth) * volume;
    sliderThumb.style.left = left + "px";
    document.getElementById("settings").style.display = "none";
    sliderThumb.addEventListener("mousedown", (e) => {
        sliderClickedPos.x = e.clientX;
        sliderClicked = true;
    });
    window.addEventListener("mouseup", () => {
        sliderClicked = false;
    });
    sliderThumb.addEventListener("mousemove", (e) => {
        if (sliderClicked) {
            if (e.clientX > sliderClickedPos.x) {
                if (parseFloat(sliderThumb.style.left.replace("px", "")) + sliderThumb.clientWidth > sliderTrack.clientWidth) {
                    sliderThumb.style.left = sliderTrack.clientWidth - sliderThumb.clientWidth + "px";
                }
                else {
                    let value = parseFloat(sliderThumb.style.left.replace("px", ""));
                    value += e.clientX - sliderClickedPos.x;
                    sliderThumb.style.left = value + "px";
                }
            }
            else if (e.clientX < sliderClickedPos.x) {
                if (parseFloat(sliderThumb.style.left.replace("px", "")) < 0) {
                    sliderThumb.style.left = 0 + "px";
                }
                else {
                    let value = parseFloat(sliderThumb.style.left.replace("px", ""));
                    value += e.clientX - sliderClickedPos.x;
                    sliderThumb.style.left = value + "px";
                }
            }
            volume = parseFloat(sliderThumb.style.left.replace("px", "")) / (sliderTrack.clientWidth - sliderThumb.clientWidth);
            sliderClickedPos.x = e.clientX;
        }
    });
}
