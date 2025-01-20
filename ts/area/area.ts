import { GameObject } from "../game_object.js";
import { c } from "../main.js";

export class Area extends GameObject {
    debugColor: string = "red";
    constructor(x: number, y: number, w: number, h: number, debugColor: string) {
        super(x, y, w ,h);
        
        this.debugColor = debugColor;
    }

    draw(): void {
        
    }

    update(): void {
        
    }

    clear(): void {
        c.clearRect(this.x, this.y, this.w, this.h);
    }

    debug(): void {
        c.beginPath();
        c.strokeStyle = this.debugColor;
        c.lineWidth = 4;
        c.strokeRect(this.x, this.y, this.w, this.h);
    }
}