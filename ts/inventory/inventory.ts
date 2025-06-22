import { Item } from "./item";

export class Inventory {
    items: (Item | undefined)[][] = [];
    private xSize: number;
    private ySize: number;
    isOpen: boolean = false;

    constructor(xSize: number, ySize: number) {
        this.xSize = xSize;
        this.ySize = ySize;
        for (let y = 0; y < ySize; y++) {
            this.items.push([]);
        }
    }

    setItem(x: number, y: number, item: Item): void {
        if (x >= 0 && x < this.xSize && y >= 0 && y < this.ySize) {
            this.items[y][x] = item;
        } else {
            throw new Error("Cannot assign item outside inventory!");
        }
    }

    removeItem(x: number, y: number) {
        delete this.items[y][x];
    }

    addItem(item: Item): void {
        for (let y = 0; y < this.ySize; y++) {
            for (let x = 0; x < this.xSize; x++) {
                if (this.items[y][x] === undefined) {
                    this.items[y][x] = item;
                    return;
                }
            }
        }
    }

    filter(itemID: string): void {
        for (let y = 0; y < this.ySize; y++) {
            for (let x = 0; x < this.xSize; x++) {
                if (this.items[y][x]?.name === itemID) {
                    delete this.items[y][x];
                    return;
                }
            }
        }
    }

    any(itemID: string): boolean {
        for (let y = 0; y < this.ySize; y++) {
            for (let x = 0; x < this.xSize; x++) {
                if (this.items[y][x]?.name === itemID) {
                    return true;
                }
            }
        }

        return false;
    }

    count(...itemIDs: string[]): number {
        let count = 0;
        for (let y = 0; y < this.ySize; y++) {
            for (let x = 0; x < this.xSize; x++) {
                if (itemIDs.some(itemID => itemID === this.items[y][x]?.name)) {
                    count++;
                }
            }
        }
        return count;
    }

    get(itemID: string): { x: number, y: number, item: Item } | undefined {
        for (let y = 0; y < this.ySize; y++) {
            for (let x = 0; x < this.xSize; x++) {
                const item = this.items[y][x];

                if (item?.name === itemID) {
                    return { x, y, item }
                }
            }
        }
        
        return undefined;
    }

    open(): void {
        const inventoryElement = document.querySelector<HTMLDivElement>(".inventory");
        const inventoryWrapper = document.querySelector<HTMLDivElement>(".inventory-wrapper");
        if (!inventoryElement || !inventoryWrapper) return;

        this.isOpen = true;
        inventoryWrapper.style.visibility = "visible";
        inventoryElement.style.gridTemplateColumns = `repeat(${this.ySize}, 1fr)`;
        inventoryElement.innerHTML = "";
        for (let y = 0; y < this.ySize; y++) {
            for (let x = 0; x < this.xSize; x++) {
                const item = this.items[y][x];
                inventoryElement.innerHTML += `
                    <div class="item">
                        <img src="${item ? "imgs/" + item.texture + ".png" : ""}">
                        <p>${item ? item.displayName : ""}</p>
                    </div>
                `;
            }
        }
    }

    close(): void {
        const inventoryElement = document.querySelector<HTMLDivElement>(".inventory");
        const inventoryWrapper = document.querySelector<HTMLDivElement>(".inventory-wrapper");
        if (!inventoryElement || !inventoryWrapper) return;

        this.isOpen = false;
        inventoryWrapper.style.visibility = "hidden";
    }
}