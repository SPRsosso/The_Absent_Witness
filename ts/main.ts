import { areas } from "./data/areas.js";
import { clamp, degToRad, radToDeg } from "./functions.js";
import { init } from "./init.js";
import { InteractableObject } from "./interactable_object/interactable_object.js";
import { Item } from "./inventory/item.js";
import { Decoration } from "./objects/decoration.js";
import { ObjectType } from "./objects/object_type.js";
import { objects } from "./objects/objects.js";
import { Player } from "./player.js";
import { preloadAssets } from "./preload.js";
import { Vector } from "./vector.js";

export const gravity = 0.1;

export let volume = 0.1;

export const canvas: HTMLCanvasElement = document.getElementById("canvas") as HTMLCanvasElement;
canvas.width = innerWidth;
canvas.height = innerHeight;
export const c = canvas.getContext("2d") as CanvasRenderingContext2D;
c.imageSmoothingEnabled = false;

export const player: Player = new Player(1920 / 2, 0, 180, 360);

const menu = document.querySelector<HTMLDivElement>(".menu");

let bt: number = performance.now();
export let dt: number = 0;
let fpsCounter: number = 0;
let dtSum = 0;

const fps = 1000 / 60;
function game(): void {
    //! Setup dt
    const tmp: number = performance.now();
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
    })

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
async function assets() {
    try {
        await preloadAssets();
    } catch (error) {
        new Error("Error during asset loading: " + error)
    }
}
const loading = document.createElement("div");
loading.classList.add("loading");
document.body.append(loading);
if (menu) menu.style.visibility = "hidden";
assets().then(() => {
    if (menu) menu.style.visibility = "visible";
    canvas.style.cssText = `
        background-image: url("../imgs/sky.png");
    `;
    loading.remove();
});

// Start
async function start(): Promise<void> {
    try {
        const loading = document.createElement("div");
        loading.classList.add("loading");
        document.body.append(loading);
        if (menu) menu.style.visibility = "hidden";
        
        await init();

        loading.remove();
    
        player.init();
        player.teleport(areas.street.realLeft() + 670, areas.street.realBottom() - player.h);
        player.alignX();

        player.inventory.addItem(new Item("flashlight", "Flashlight", "flashlight_item"));

        game();
    } catch (error) {
        console.error('Error during asset loading:', error);
    }
}
// start();

export function openModal(name: string): void {
    const el = document.getElementById(name);

    if (!el)
        return;

    el.style.visibility = "visible";
}

export function closeModal(name: string): void {
    const el = document.getElementById(name);

    if (!el)
        return;

    el.style.visibility = "hidden";
}

document.querySelector("#start-btn")?.addEventListener("click", start);
document.querySelectorAll(".settings-btn")?.forEach(btn => {
    btn.addEventListener("click", () => {
        openModal("settings");
    });
})
document.querySelectorAll(".tutorial-btn")?.forEach(btn => {
    btn.addEventListener("click", () => {
        openModal("tutorial");
    });
})
document.querySelector("#close-settings-btn")?.addEventListener("click", () => {
    closeModal("settings");
});
document.querySelector("#close-tutorial-btn")?.addEventListener("click", () => {
    closeModal("tutorial");
});
document.querySelector("#close-pause-btn")?.addEventListener("click", () => {
    closeModal("pause");
});

//! SLIDER
let sliderClicked = false;
const slider = document.querySelector<HTMLDivElement>(".slider");
const sliderThumb = document.querySelector<HTMLImageElement>("#slider-thumb");
if (slider && sliderThumb) {
    const boundries = {
        min: 0,
        max: slider.getBoundingClientRect().width - sliderThumb.getBoundingClientRect().width
    }

    sliderThumb.style.left = (volume * boundries.max) + "px";
    function changeVolume(event: MouseEvent) {
        if (!slider || !sliderThumb || !sliderClicked) return;

        const x = event.clientX - slider.getBoundingClientRect().left - sliderThumb.clientWidth / 2;
        const clamped = clamp(x, boundries.min, boundries.max);

        volume = clamped / boundries.max;

        sliderThumb.style.left = clamped + "px";
    }
    
    slider.addEventListener("mousedown", ( event ) => {
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