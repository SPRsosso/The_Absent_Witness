import { areas } from "./data/areas.js";
import { degToRad, radToDeg } from "./functions.js";
import { init } from "./init.js";
import { InteractableObject } from "./interactable_object/interactable_object.js";
import { Item } from "./item.js";
import { Decoration } from "./objects/decoration.js";
import { ObjectType } from "./objects/object_type.js";
import { objects } from "./objects/objects.js";
import { Player } from "./player.js";
import { preloadAssets } from "./preload.js";

export const gravity = 0.1;

export let volume = 0.4;

export const canvas: HTMLCanvasElement = document.getElementById("canvas") as HTMLCanvasElement;
canvas.width = innerWidth;
canvas.height = innerHeight;
canvas
export const c = canvas.getContext("2d") as CanvasRenderingContext2D;
c.imageSmoothingEnabled = false;

export const items: HTMLDivElement = document.querySelector(".items") as HTMLDivElement;

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
    
    requestAnimationFrame(game);
}

async function start(): Promise<void> {
    try {
        await preloadAssets();
        await init();

        if (menu) menu.style.display = "none";
    
        player.init();
        player.teleport(areas.workshop_reception.realLeft() + 530, areas.workshop_reception.realBottom() - player.h);
        // player.items.push(new Item("coin", "50 Cents", "key"));

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

    el.style.display = "block";
}

export function closeModal(name: string): void {
    const el = document.getElementById(name);

    if (!el)
        return;

    el.style.display = "none";
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
let sliderClickedPos = {
    x: 0,
}

const sliderThumb = document.querySelector<HTMLImageElement>("#slider-thumb");
const sliderTrack = document.querySelector<HTMLImageElement>("#slider-track");
if (sliderTrack && sliderThumb) {
    (document.getElementById("settings") as HTMLDivElement).style.display = "block";
    const left = (sliderTrack.clientWidth - sliderThumb.clientWidth) * volume;
    sliderThumb.style.left = left + "px";
    (document.getElementById("settings") as HTMLDivElement).style.display = "none";

    sliderThumb.addEventListener("mousedown", ( e ) => {
        sliderClickedPos.x = e.clientX;
        sliderClicked = true;
    });
    window.addEventListener("mouseup", () => {
        sliderClicked = false;
    });
    sliderThumb.addEventListener("mousemove", ( e ) => {
        if (sliderClicked) {
            if (e.clientX > sliderClickedPos.x) {

                if (parseFloat(sliderThumb.style.left.replace("px", "")) + sliderThumb.clientWidth > sliderTrack.clientWidth) {
                    sliderThumb.style.left = sliderTrack.clientWidth - sliderThumb.clientWidth + "px";
                } else {
                    let value = parseFloat(sliderThumb.style.left.replace("px", ""));
                    value += e.clientX - sliderClickedPos.x;

                    sliderThumb.style.left = value + "px";
                }

            } else if (e.clientX < sliderClickedPos.x) {

                if (parseFloat(sliderThumb.style.left.replace("px", "")) < 0) {
                    sliderThumb.style.left = 0 + "px";
                } else {
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