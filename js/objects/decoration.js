import { loadedAssets } from "../data/assets.js";
import { c } from "../main.js";
import { GameObject } from "./game_object.js";
import { ObjectType } from "./object_type.js";
import { objects } from "./objects.js";
export class Decoration extends GameObject {
    constructor(x, y, w, h, texture = null, backdropRendering = false) {
        super(x, y, w, h, backdropRendering, ObjectType.Decoration);
        this.texture = texture;
        objects.push(this);
    }
    update() {
    }
    draw() {
        if (this.texture) {
            const img = loadedAssets.imgs[this.texture];
            c.beginPath();
            c.drawImage(img, this.x, this.y, this.w, this.h);
        }
    }
    debug() {
    }
}
