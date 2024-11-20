class WalkPath extends GameObject {
    constructor(x, y, width, height) {
        super();

        this.pos = new Vertex(x, y);
        this.width = width;
        this.height = height;
    }
    
    update() {

    }

    draw() {
        c.beginPath();
        c.fillStyle = "wheat";
        c.fillRect(this.pos.x, this.pos.y, this.width, this.height);
    }
}