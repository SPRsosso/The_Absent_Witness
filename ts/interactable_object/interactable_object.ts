import { loadedAssets } from "../data/assets.js";
import { circRectCollision } from "../functions.js";
import { c, player } from "../main.js";
import { GameObject } from "../objects/game_object.js";
import { ObjectType } from "../objects/object_type.js";
import { objects } from "../objects/objects.js";


export class InteractableObject extends GameObject {
    texture: string | null;
    inspected: boolean = false;

    radius: number;
    collisionX: number;
    collisionY: number;
    canInteract: boolean = false;
    interaction: () => void;

    inspectRendering: boolean = true;

    data: any;

    constructor(x: number, y: number, w: number, h: number, radius: number, texture: string | null = null, backdropRendering: boolean = false, inspectRendering: boolean = true) {
        super(x, y, w, h, backdropRendering, ObjectType.InteractableObject);
        this.texture = texture;
        this.radius = radius;
        this.collisionX = this.left() + this.w / 2;
        this.collisionY = this.top() + this.h / 2;
        this.interaction = () => {}
        this.inspectRendering = inspectRendering;

        objects.push(this);
    }

    createInteraction(interaction: () => void) {
        this.interaction = interaction;
    }
    
    interact() {
        this.interaction();
    }

    update(): void {
        this.collisionX = this.left() + this.w / 2;
        this.collisionY = this.top() + this.h / 2;

        if (circRectCollision(this, player) && !this.inspected) {
            this.canInteract = true;
        } else {
            this.canInteract = false;
        }
    }

    draw(): void {
        if (this.texture) {
            const img = loadedAssets.imgs[this.texture];

            c.beginPath();
            c.drawImage(img, this.x, this.y, this.w, this.h);
        }

        if (this.canInteract && this.inspectRendering) {
            const img = loadedAssets.imgs["magnifying_glass"];
            const sizeW = 64;
            const sizeH = 64;
            c.beginPath();
            c.drawImage(img, this.collisionX - sizeW / 2, this.collisionY - sizeH / 2, sizeW, sizeH);
        }
    }

    debug(): void {
        
    }
}