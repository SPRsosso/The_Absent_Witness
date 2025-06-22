import { loadedAssets } from "../data/assets.js";
import { c } from "../main.js";
import { GameObject } from "../objects/game_object.js";
import { ObjectType } from "../objects/object_type.js";
import { objects } from "../objects/objects.js";

export class Area extends GameObject {
    debugColor: string = "red";
    backgroundTexture: string | null = null;
    floorTexture: string | null = null;
    floorScale: number = 4;

    constructor(x: number, y: number, w: number, h: number, debugColor: string, floorTexture: string | null = null, backgroundTexture: string | null = null) {
        super(x, y, w, h, false, ObjectType.Area);
        this.floorTexture = floorTexture;
        this.backgroundTexture = backgroundTexture;

        this.debugColor = debugColor;

        objects.push(this);
    }

    draw(): void {
        if (this.floorTexture) {
            const img: HTMLImageElement | undefined = loadedAssets.imgs[this.floorTexture];

            if (img) {
                const imgWidth = img.width * this.floorScale;
                for (let i = 0; i < this.w + imgWidth; i += imgWidth) {
                    c.beginPath();
                    if (this.w - i - imgWidth > 0) {
                        c.drawImage(img, this.x + i, this.bottom(), imgWidth, imgWidth);
                    } else {
                        c.drawImage(img, 0, 0, (this.w - i) / this.floorScale, img.height, this.x + i, this.bottom(), (this.w - i), imgWidth);
                    }
                }
            }
        }

        if (this.backgroundTexture) {
            const img: HTMLImageElement = loadedAssets.imgs[this.backgroundTexture];

            c.beginPath();
            c.drawImage(img, this.x, this.y, this.w, this.h);
        }
    }

    update(): void {}

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