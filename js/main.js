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
import { clamp } from "./functions.js";
import { init } from "./init.js";
import { Item } from "./inventory/item.js";
import { ObjectType } from "./objects/object_type.js";
import { objects } from "./objects/objects.js";
import { Player } from "./player.js";
import { preloadAssets } from "./preload.js";
export const gravity = 0.1;
export let volume = 0.1;
export const canvas = document.getElementById("canvas");
canvas.width = innerWidth;
canvas.height = innerHeight;
export const c = canvas.getContext("2d");
c.imageSmoothingEnabled = false;
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
    player.showDialog();
    Object.values(areas).forEach(area => {
        if (!area.contains(player)) {
            c.save();
            c.beginPath();
            c.fillStyle = "black";
            c.fillRect(area.x - 200, area.y - 200, area.w + 400, area.h + 400);
            c.restore();
        }
        if (typeof area.data.dark === "boolean" && area.data.dark && area.contains(player)) {
            c.save();
            c.beginPath();
            if (player.flashlightEvent) {
                c.rect(0, 0, canvas.width, canvas.height);
                c.arc(player.flashlightEvent.x, player.flashlightEvent.y, player.flashlightPower, 0, Math.PI * 2, true);
                c.clip();
            }
            c.fillStyle = "black";
            c.fillRect(area.x - 200, area.y - 200, area.w + 400, area.h + 400);
            c.restore();
            if (player.flashlightEvent) {
                c.beginPath();
                c.arc(player.flashlightEvent.x, player.flashlightEvent.y, player.flashlightPower - 2.5, 0, Math.PI * 2);
                c.strokeStyle = "rgba(255, 255, 255, 0.1)";
                c.lineWidth = 15;
                c.stroke();
                c.closePath();
                c.beginPath();
                c.arc(player.flashlightEvent.x, player.flashlightEvent.y, player.flashlightPower / 3, 0, Math.PI * 2);
                c.fillStyle = "rgba(255, 255, 255, 0.05)";
                c.fill();
                c.closePath();
                c.beginPath();
                c.arc(player.flashlightEvent.x, player.flashlightEvent.y, player.flashlightPower / 2, 0, Math.PI * 2);
                c.fillStyle = "rgba(255, 255, 255, 0.05)";
                c.fill();
                c.closePath();
            }
        }
    });
    requestAnimationFrame(game);
}
// Loading assets
function assets() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield preloadAssets();
        }
        catch (error) {
            new Error("Error during asset loading: " + error);
        }
    });
}
const loading = document.createElement("div");
loading.classList.add("loading");
document.body.append(loading);
if (menu)
    menu.style.visibility = "hidden";
assets().then(() => {
    if (menu)
        menu.style.visibility = "visible";
    canvas.style.cssText = `
        background-image: url("../imgs/sky.png");
    `;
    loading.remove();
});
// Start
function start() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const loading = document.createElement("div");
            loading.classList.add("loading");
            document.body.append(loading);
            if (menu)
                menu.style.visibility = "hidden";
            yield init();
            loading.remove();
            player.init();
            player.teleport(areas.street.realLeft() + 670, areas.street.realBottom() - player.h);
            player.alignX();
            player.inventory.addItem(new Item("flashlight", "Flashlight", "flashlight_item"));
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
    el.style.visibility = "visible";
}
export function closeModal(name) {
    const el = document.getElementById(name);
    if (!el)
        return;
    el.style.visibility = "hidden";
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
const slider = document.querySelector(".slider");
const sliderThumb = document.querySelector("#slider-thumb");
if (slider && sliderThumb) {
    const boundries = {
        min: 0,
        max: slider.getBoundingClientRect().width - sliderThumb.getBoundingClientRect().width
    };
    sliderThumb.style.left = (volume * boundries.max) + "px";
    function changeVolume(event) {
        if (!slider || !sliderThumb || !sliderClicked)
            return;
        const x = event.clientX - slider.getBoundingClientRect().left - sliderThumb.clientWidth / 2;
        const clamped = clamp(x, boundries.min, boundries.max);
        volume = clamped / boundries.max;
        sliderThumb.style.left = clamped + "px";
    }
    slider.addEventListener("mousedown", (event) => {
        sliderClicked = true;
        changeVolume(event);
    });
    addEventListener("mouseup", () => {
        sliderClicked = false;
    });
    slider.addEventListener("mousemove", changeVolume);
}
addEventListener("resize", () => {
    canvas.width = innerWidth;
    canvas.height = innerHeight;
    c.imageSmoothingEnabled = false;
});
