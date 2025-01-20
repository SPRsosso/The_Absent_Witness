export abstract class GameObject {
    x: number;
    y: number;
    realX: number;
    realY: number;
    w: number;
    h: number;

    constructor(x: number, y: number, w: number, h: number) {
        this.x = x;
        this.y = y;
        this.realX = x;
        this.realY = y;
        this.w = w;
        this.h = h;
    }

    render(debug: boolean = false): void {
        this.update();
        this.draw();
        if (debug) this.debug();
    }

    abstract update(): void;
    abstract draw(): void;
    abstract debug(): void;

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
}