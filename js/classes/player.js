class Player extends GameObject {
    static movementSpeed = 1.5;

    #currentFrame;
    #canAnimate;
    #animationTime;
    constructor(x, y, width) {
        super();

        this.pos = new Vertex(x, y);
        this.width = width;
        this.height = 2 * this.width;

        this.#animationTime = 0;
        this.#currentFrame = 0;
        this.#canAnimate = true;

        this.direction = "right";
        this.img = new Image();
        this.changeAnimation("person_idle", 1000);

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
        const personWidth = 32;
        const animationFrames = Math.floor(this.img.width / personWidth);

        c.drawImage(this.img, this.#currentFrame * personWidth, 0, personWidth, this.img.height, this.pos.x, this.pos.y, this.width, this.height);

        if (!this.#canAnimate) return;
        
        this.#currentFrame = ++this.#currentFrame % animationFrames;

        this.#canAnimate = false;
        setTimeout(() => {
            this.#canAnimate = true;
        }, this.#animationTime);
    }

    changeAnimation(src, frameTime, changeFrame = true) {
        this.img.src = `./imgs/${src}_${this.direction}.png`;

        if (changeFrame)
            this.#currentFrame = 0;

        this.#animationTime = frameTime;
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