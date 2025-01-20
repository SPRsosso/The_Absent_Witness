import { areas } from "./data/areas.js";
import { degToRad, radToDeg } from "./functions.js";
import { Player } from "./player.js";
import { preloadAssets } from "./preload.js";

export const gravity = 0.1;

export const canvas: HTMLCanvasElement = document.getElementById("canvas") as HTMLCanvasElement;
canvas.width = innerWidth;
canvas.height = innerHeight;
canvas
export const c = canvas.getContext("2d") as CanvasRenderingContext2D;
c.imageSmoothingEnabled = false;

const player: Player = new Player(canvas.width / 2 - 50, 0, 100, 200);
player.init();
// player.teleport(0, 0);

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

    if (dtSum >= fps) {
        // console.log(fpsCounter);
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
        area.render(true);
    });

    player.render();
    
    requestAnimationFrame(game);
}

async function start(): Promise<void> {
    try {
        await preloadAssets();
    
        game();
    } catch (error) {
        console.error('Error during asset loading:', error);
    }
}
start();