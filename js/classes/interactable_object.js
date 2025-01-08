class InteractableObject extends GameObject {
    #interactionShowTimeAfterCounter;
    #interactionShowTimeAfter;
    #interactionRadius;
    constructor(x, y, width, height, image, interaction) {
        super();
        this.pos = new Vertex(x, y);
        this.width = width;
        this.height = height;
        this.image = image;
        this.interaction = interaction;

        this.#interactionShowTimeAfter = 3000; // in ms
        this.#interactionShowTimeAfterCounter = 0;
        this.#interactionRadius = 50;

        this.interactableView = {
            width: 100,
            height: 60,
        }
    }

    update() {
        const centerX = this.pos.x + this.width / 2;
        const centerY = this.pos.y + this.height / 2;
        const radius = this.#interactionRadius;

        if (rectCircleColl({ pos: new Vertex(centerX, centerY ), radius }, player)) {
            if (this.#interactionShowTimeAfterCounter >= this.#interactionShowTimeAfter) {
                c.beginPath();
                c.fillStyle = "rgba(255, 255, 255, 0.5)";
                c.fillRect(centerX - this.interactableView.width / 2, centerY - this.interactableView.height / 2, this.interactableView.width, this.interactableView.height);
            }

            this.#interactionShowTimeAfterCounter += fps;
        } else {
            this.#interactionShowTimeAfterCounter = 0;
        }
    }

    draw() {
        const img = new Image();
        img.src = "./imgs/" + this.image;

        c.drawImage(img, this.pos.x, this.pos.y, this.width, this.height);
    }
}