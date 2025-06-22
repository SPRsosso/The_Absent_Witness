export class Inventory {
    constructor(xSize, ySize) {
        this.items = [];
        this.isOpen = false;
        this.xSize = xSize;
        this.ySize = ySize;
        for (let y = 0; y < ySize; y++) {
            this.items.push([]);
        }
    }
    setItem(x, y, item) {
        if (x >= 0 && x < this.xSize && y >= 0 && y < this.ySize) {
            this.items[y][x] = item;
        }
        else {
            throw new Error("Cannot assign item outside inventory!");
        }
    }
    removeItem(x, y) {
        delete this.items[y][x];
    }
    addItem(item) {
        for (let y = 0; y < this.ySize; y++) {
            for (let x = 0; x < this.xSize; x++) {
                if (this.items[y][x] === undefined) {
                    this.items[y][x] = item;
                    return;
                }
            }
        }
    }
    filter(itemID) {
        var _a;
        for (let y = 0; y < this.ySize; y++) {
            for (let x = 0; x < this.xSize; x++) {
                if (((_a = this.items[y][x]) === null || _a === void 0 ? void 0 : _a.name) === itemID) {
                    delete this.items[y][x];
                    return;
                }
            }
        }
    }
    any(itemID) {
        var _a;
        for (let y = 0; y < this.ySize; y++) {
            for (let x = 0; x < this.xSize; x++) {
                if (((_a = this.items[y][x]) === null || _a === void 0 ? void 0 : _a.name) === itemID) {
                    return true;
                }
            }
        }
        return false;
    }
    count(...itemIDs) {
        let count = 0;
        for (let y = 0; y < this.ySize; y++) {
            for (let x = 0; x < this.xSize; x++) {
                if (itemIDs.some(itemID => { var _a; return itemID === ((_a = this.items[y][x]) === null || _a === void 0 ? void 0 : _a.name); })) {
                    count++;
                }
            }
        }
        return count;
    }
    get(itemID) {
        for (let y = 0; y < this.ySize; y++) {
            for (let x = 0; x < this.xSize; x++) {
                const item = this.items[y][x];
                if ((item === null || item === void 0 ? void 0 : item.name) === itemID) {
                    return { x, y, item };
                }
            }
        }
        return undefined;
    }
    open() {
        const inventoryElement = document.querySelector(".inventory");
        const inventoryWrapper = document.querySelector(".inventory-wrapper");
        if (!inventoryElement || !inventoryWrapper)
            return;
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
    close() {
        const inventoryElement = document.querySelector(".inventory");
        const inventoryWrapper = document.querySelector(".inventory-wrapper");
        if (!inventoryElement || !inventoryWrapper)
            return;
        this.isOpen = false;
        inventoryWrapper.style.visibility = "hidden";
    }
}
