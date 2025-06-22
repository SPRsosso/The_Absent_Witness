import { ObjectType } from "./object_type.js";

export abstract class GameObject {
    x: number;
    y: number;
    realX: number;
    realY: number;
    w: number;
    h: number;
    backdropRendering: boolean;
    data: { [key: string]: unknown } = {};

    type: ObjectType;


    constructor(x: number, y: number, w: number, h: number, backdropRendering: boolean, type: ObjectType) {
        this.x = x;
        this.y = y;
        this.realX = x;
        this.realY = y;
        this.w = w;
        this.h = h;
        this.backdropRendering = backdropRendering;
        this.type = type;
    }

    render(debug: boolean = false): void {
        this.update();
        this.draw();
        if (debug) this.debug();
    }

    abstract update(): void;
    abstract draw(): void;
    abstract debug(): void;

    contains(object: GameObject): boolean {
        return object.realRight() > this.realLeft() 
            && object.realLeft() < this.realRight()
            && object.realTop() < this.realBottom() 
            && object.realBottom() > this.realTop();
    }
    
    top(): number {
        return this.y;
    }

    right(): number {
        return this.x + this.w;
    }

    bottom(): number {
        return this.y + this.h;
    }

    left(): number {
        return this.x;
    }

    realTop(): number {
        return this.realY;
    }

    realRight(): number {
        return this.realX + this.w;
    }

    realBottom(): number {
        return this.realY + this.h;
    }

    realLeft(): number {
        return this.realX;
    }
    
    alignY() {
        this.y -= this.h;
        this.realY -= this.h;
    }
    
    alignX() {
        this.x -= this.w;
        this.realX -= this.w;
    }
}