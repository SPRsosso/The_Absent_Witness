class GameObject {
    update() {
        throw new Error("update() function in " + this.constructor.name + " not implemented");
    }

    draw() {
        throw new Error("draw() function in " + this.constructor.name + " not implemented");
    }

    render() {
        this.update();
        this.draw();
    }
}