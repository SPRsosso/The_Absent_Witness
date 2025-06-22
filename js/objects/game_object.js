export class GameObject {
    constructor(x, y, w, h, backdropRendering, type) {
        this.data = {};
        this.x = x;
        this.y = y;
        this.realX = x;
        this.realY = y;
        this.w = w;
        this.h = h;
        this.backdropRendering = backdropRendering;
        this.type = type;
    }
    render(debug = false) {
        this.update();
        this.draw();
        if (debug)
            this.debug();
    }
    contains(object) {
        return object.realRight() > this.realLeft()
            && object.realLeft() < this.realRight()
            && object.realTop() < this.realBottom()
            && object.realBottom() > this.realTop();
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
    realTop() {
        return this.realY;
    }
    realRight() {
        return this.realX + this.w;
    }
    realBottom() {
        return this.realY + this.h;
    }
    realLeft() {
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
