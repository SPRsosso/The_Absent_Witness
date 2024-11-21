class InteractableObject extends GameObject {
    constructor(x, y, width, heigth, image, interaction) {
        super();
        this.x = x;
        this.y = y;
        this.width = width;
        this.heigth = heigth;
        this.image = image;
        this.interaction = interaction;
    }

    update() {

    }

    draw() {
        const img = new Image();
        img.src = "./imgs/" + this.image;

        c.drawImage(img, this.x, this.y);
    }
}