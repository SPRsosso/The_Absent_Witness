import { loadedAssets } from "../data/assets.js";
import { circRectCollision } from "../functions.js";
import { c, player } from "../main.js";
import { GameObject } from "../objects/game_object.js";
import { ObjectType } from "../objects/object_type.js";
import { objects } from "../objects/objects.js";
export class InteractableObject extends GameObject {
    constructor(x, y, w, h, radius, texture = null, backdropRendering = false, inspectRendering = true) {
        super(x, y, w, h, backdropRendering, ObjectType.InteractableObject);
        this.inspected = false;
        this.canInteract = false;
        this.inspectRendering = true;
        this.texture = texture;
        this.radius = radius;
        this.collisionX = this.left() + this.w / 2;
        this.collisionY = this.top() + this.h / 2;
        this.interaction = () => { };
        this.inspectRendering = inspectRendering;
        objects.push(this);
    }
    createInteraction(interaction) {
        this.interaction = interaction;
    }
    interact() {
        this.interaction();
    }
    update() {
        this.collisionX = this.left() + this.w / 2;
        this.collisionY = this.top() + this.h / 2;
        if (circRectCollision(this, player) && !this.inspected) {
            this.canInteract = true;
        }
        else {
            this.canInteract = false;
        }
    }
    draw() {
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
    debug() {
    }
}
