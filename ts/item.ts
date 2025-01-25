export class Item {
    name: string;
    displayName: string;
    texture: string | null;

    constructor(name: string, displayName: string, texture: string | null = null) {
        this.name = name;
        this.texture = texture;
        this.displayName = displayName;
    }
}