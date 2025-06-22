export class Item {
    name: string;
    displayName: string;
    texture: string | null;

    data: { [key: string]: unknown } = {};

    constructor(name: string, displayName: string, texture: string | null = null) {
        this.name = name;
        this.texture = texture;
        this.displayName = displayName;
    }
}