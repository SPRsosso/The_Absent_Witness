import { areas } from "./data/areas.js";
import { loadedAssets } from "./data/assets.js";
import { Key } from "./data/keys.js";
import { isAudioPlaying, rectRectCollision } from "./functions.js";
import { Inventory } from "./inventory/inventory.js";
import { c, canvas, closeModal, dt, gravity, openModal, volume } from "./main.js";
import { GameObject } from "./objects/game_object.js";
import { ObjectType } from "./objects/object_type.js";
import { objects } from "./objects/objects.js";
import { Vector } from "./vector.js";
export class Player extends GameObject {
    constructor(x, y, w, h) {
        super(x, y, w, h, false, ObjectType.Player);
        this.sayLetterTime_ms = 40;
        this.dialogs = [];
        this.saidDialog = { dialog: "" };
        this.waitDialog = false;
        this.animateTimeout = undefined;
        this.flashlightPower = 96;
        this.flashlightEvent = undefined;
        this.inventory = new Inventory(3, 9);
        this.v = new Vector(0, 0);
        this.keyDown = [];
        this.direction = "right";
        this.animation = this.animate(32);
        this.saidLetter = this.sayLetter();
    }
    init() {
        addEventListener("keydown", (e) => {
            var _a, _b, _c, _d, _e, _f;
            // ESCAPE - PAUSE
            if (e.keyCode === 27) {
                if (((_a = document.querySelector("#pause")) === null || _a === void 0 ? void 0 : _a.style.visibility) === "visible") {
                    closeModal("pause");
                    closeModal("settings");
                    closeModal("tutorial");
                }
                else {
                    openModal("pause");
                }
            }
            if (((_b = document.querySelector("#pause")) === null || _b === void 0 ? void 0 : _b.style.visibility) === "visible")
                return;
            // LEFT
            if (e.keyCode === 65) {
                this.keyDown.push(Key.LEFT);
            }
            // RIGHT
            if (e.keyCode === 68) {
                this.keyDown.push(Key.RIGHT);
            }
            // 'E' PRESSED
            if (e.keyCode === 69) {
                this.inventory.isOpen ? this.inventory.close() : this.inventory.open();
            }
            // 'SPACE' - SKIP DIALOG
            if (e.keyCode === 32) {
                this.dialogs.shift();
                this.saidDialog.dialog = "";
                this.saidLetter = this.sayLetter();
            }
            //! DEBUG
            if (e.keyCode === 190) {
                this.teleport(parseFloat((_c = prompt("X: ")) !== null && _c !== void 0 ? _c : "0"), parseFloat((_d = prompt("Y: ")) !== null && _d !== void 0 ? _d : "0"));
            }
            if (e.keyCode === 191) {
                this.say((_e = prompt("Text: ")) !== null && _e !== void 0 ? _e : "Hello, World!", parseInt((_f = prompt("Show time:")) !== null && _f !== void 0 ? _f : "1000"));
            }
        });
        addEventListener("keyup", (e) => {
            // LEFT
            if (e.keyCode === 65) {
                this.keyDown = this.keyDown.filter(key => key !== Key.LEFT);
            }
            // RIGHT
            if (e.keyCode === 68) {
                this.keyDown = this.keyDown.filter(key => key !== Key.RIGHT);
            }
        });
        canvas.addEventListener("click", (event) => {
            const pos = new Vector(event.clientX, event.clientY);
            for (let obj of objects) {
                if (obj.type === ObjectType.InteractableObject) {
                    const interactable = obj;
                    if (interactable.canInteract &&
                        Math.pow((pos.x - interactable.collisionX), 2) + Math.pow((pos.y - interactable.collisionY), 2) < Math.pow(interactable.inspectRadius, 2)) {
                        interactable.interact();
                    }
                }
            }
        });
        addEventListener("mousemove", (event) => {
            const flashlight = this.inventory.get("flashlight");
            if (flashlight) {
                this.flashlightEvent = { x: event.clientX, y: event.clientY };
            }
            else {
                this.flashlightEvent = undefined;
            }
        });
    }
    update() {
        this.area = Object.values(areas).find(area => rectRectCollision(this, area));
        // Change velocity depending on keydown
        if (this.keyDown.at(-1) === Key.LEFT) {
            this.v.x = -Player.speed * dt;
            this.direction = "left";
        }
        else if (this.keyDown.at(-1) === Key.RIGHT) {
            this.v.x = Player.speed * dt;
            this.direction = "right";
        }
        else {
            this.v.x = 0;
        }
        // Gravity
        this.v.y += gravity;
        if (this.area) {
            if (this.bottom() + this.v.y * dt === this.area.bottom()) {
                this.v.y = 0;
            }
            else if (this.bottom() + this.v.y * dt > this.area.bottom()) {
                this.v.y = this.area.bottom() - this.bottom();
            }
            // Move
            if (this.area.left() < this.left() + this.v.x && this.area.right() > this.right() + this.v.x) {
                if (this.right() + this.v.x < 2 * (canvas.width / 3) && this.left() + this.v.x > canvas.width / 3) {
                    this.x += this.v.x;
                }
                else {
                    Object.values(objects).forEach(obj => {
                        obj.x -= this.v.x;
                    });
                }
                this.realX += this.v.x;
            }
        }
        if (this.bottom() < canvas.height) {
            this.y += this.v.y * dt;
        }
        else {
            Object.values(objects).forEach(obj => {
                obj.y -= this.v.y * dt;
            });
        }
        this.realY += this.v.y * dt;
    }
    draw() {
        this.animation.next();
    }
    showDialog() {
        const dialogElement = document.querySelector(".dialog-text");
        if (dialogElement)
            dialogElement.innerText = "";
        if (this.dialogs.length > 0) {
            if (!this.waitDialog) {
                const said = this.saidLetter.next().value;
                if (said.dialog === this.dialogs[0].dialog) {
                    this.waitDialog = true;
                    setTimeout(() => {
                        this.waitDialog = false;
                        this.dialogs.shift();
                        this.saidDialog.dialog = "";
                        this.saidLetter = this.sayLetter();
                    }, this.dialogs[0].showTime_ms);
                }
            }
            const img = loadedAssets.imgs["speaking"];
            const widthPercent = canvas.width / img.width;
            const height = img.height * widthPercent;
            c.beginPath();
            c.drawImage(img, 0, canvas.height - height, canvas.width, height);
            if (dialogElement) {
                dialogElement.style.cssText = `
                    left: ${21 * widthPercent}px;
                    width: calc(100% - ${21 * widthPercent}px);
                    height: ${height}px;
                `;
                dialogElement.innerText = this.saidDialog.dialog;
            }
        }
    }
    teleport(x, y) {
        const diffX = this.realX - x;
        const diffY = this.realY - y;
        this.realX = x;
        this.realY = y;
        if (this.left() - diffX < canvas.width / 3) {
            const tmp = this.x - canvas.width / 3;
            this.x = canvas.width / 3;
            Object.values(objects).forEach(obj => {
                obj.x += diffX - tmp;
            });
        }
        else if (this.right() - diffX > canvas.width / 3 * 2) {
            const tmp = this.right() - canvas.width / 3 * 2;
            this.x = canvas.width / 3 * 2 - this.w;
            Object.values(objects).forEach(obj => {
                obj.x += diffX - tmp;
            });
        }
        else {
            this.x -= diffX;
        }
        if (this.top() - diffY < 0) {
            const tmp = this.y;
            this.y = 0;
            Object.values(objects).forEach(obj => {
                obj.y += diffY - tmp;
            });
        }
        else if (this.bottom() - diffY > canvas.height) {
            const tmp = this.bottom() - canvas.height;
            this.y = canvas.height - this.h;
            Object.values(objects).forEach(obj => {
                obj.y += diffY - tmp;
            });
        }
        else {
            this.y -= diffY;
        }
    }
    *sayLetter() {
        let wait = false;
        let index = 0;
        while (true) {
            if (!wait) {
                const sound = loadedAssets.sounds["click"];
                if (isAudioPlaying(sound))
                    sound.pause();
                sound.currentTime = 0;
                sound.volume = volume;
                sound.play();
                this.saidDialog.dialog += this.dialogs[0].dialog[index++];
                wait = true;
                setTimeout(() => {
                    wait = false;
                }, this.sayLetterTime_ms);
            }
            yield this.saidDialog;
        }
    }
    *animate(w) {
        let posX = 0;
        let wait = false;
        let waitTime = 1000;
        let beforeTexture = "";
        while (true) {
            let x = posX * w;
            let img;
            let currentTexture = "";
            if (this.v.x !== 0) {
                currentTexture = "player_walking_" + this.direction;
                img = loadedAssets.imgs[currentTexture];
                waitTime = 150;
            }
            else {
                currentTexture = "player_idle_" + this.direction;
                img = loadedAssets.imgs[currentTexture];
                waitTime = 1000;
            }
            if (currentTexture !== beforeTexture) {
                wait = false;
                clearTimeout(this.animateTimeout);
            }
            beforeTexture = currentTexture;
            c.beginPath();
            c.drawImage(img, x, 0, w, img.height, this.x, this.y, this.w, this.h);
            if (!wait) {
                if (posX + 1 < img.width / w) {
                    posX++;
                }
                else {
                    posX = 0;
                }
                wait = true;
                this.animateTimeout = setTimeout(() => {
                    wait = false;
                }, waitTime);
            }
            yield posX;
        }
    }
    say(text, showTime_ms) {
        if (this.dialogs.find(dialog => dialog.dialog === text))
            return;
        this.dialogs.push({ dialog: text, showTime_ms });
    }
    debug() {
    }
    alignX() {
        this.teleport(this.realLeft() - this.w, this.realTop());
    }
    alignY() {
        this.teleport(this.realLeft(), this.realTop() - this.h);
    }
}
Player.speed = 3;
