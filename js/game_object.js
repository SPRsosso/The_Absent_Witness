export class GameObject {
    constructor(x, y, w, h) {
        this.x = x;
        this.y = y;
        this.realX = x;
        this.realY = y;
        this.w = w;
        this.h = h;
    }
    render(debug = false) {
        this.update();
        this.draw();
        if (debug)
            this.debug();
    }
    top() {
        return this.y;
    }
    right() {
        return this.x + this.w;
    }
    bottom() {
        return this.y + this.h;
    }
    left() {
        return this.x;
    }
}
