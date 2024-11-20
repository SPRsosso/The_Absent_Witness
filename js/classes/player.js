class Player extends GameObject {
    static movementSpeed = 2;

    constructor(x, y) {
        super();

        this.pos = new Vertex(x, y);
        this.width = 80;
        this.height = 2 * this.width;

        this.v = new Vertex(0, 0);
    }

    update() {
        const touchingWalkPath = walkPaths.find(path => {
            if (this.pos.y + this.height + this.v.y >= path.pos.y && this.pos.x + this.width >= path.pos.x && this.pos.x <= path.pos.x + path.width && !(path.pos.y < this.pos.y + this.height)) {
                return true;
            }
        });
        if (this.pos.y + this.height + this.v.y >= canvas.height || touchingWalkPath) {
            const calculatedDistance = Math.min(canvas.height, touchingWalkPath?.pos?.y ?? canvas.height) - (this.pos.y + this.height)
            this.v.y = Math.sign(calculatedDistance) >= 0 ? calculatedDistance : this.v.y;
        } else {
            this.v.y += gravity;
        }

        

        this.walk();

        this.pos.x += this.v.x;
        this.pos.y += this.v.y;
    }

    draw() {
        c.beginPath();
        c.fillStyle = "white";
        c.fillRect(this.pos.x, this.pos.y, this.width, this.height);
    }

    walk() {
        switch (keyPresses[keyPresses.length - 1]) {
            case KEYS.LEFT:
                this.v.x = -Player.movementSpeed;  
            break;
            case KEYS.RIGHT:
                this.v.x = Player.movementSpeed;
            break;
            default:
                this.v.x = 0;
                break;
        }
    }
}