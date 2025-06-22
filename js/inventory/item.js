export class Item {
    constructor(name, displayName, texture = null) {
        this.data = {};
        this.name = name;
        this.texture = texture;
        this.displayName = displayName;
    }
}
