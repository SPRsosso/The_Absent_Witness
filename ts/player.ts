import { Area } from "./area/area.js";
import { areas } from "./data/areas.js";
import { loadedAssets } from "./data/assets.js";
import { Key } from "./data/keys.js";
import { Dialog } from "./dialog/dialog.js";
import { rectRectCollision } from "./functions.js";
import { InteractableObject } from "./interactable_object/interactable_object.js";
import { Item } from "./item.js";
import { c, canvas, closeModal, dt, gravity, items, openModal, volume } from "./main.js";
import { GameObject } from "./objects/game_object.js";
import { ObjectType } from "./objects/object_type.js";
import { objects } from "./objects/objects.js";
import { Vector } from "./vector.js";

export class Player extends GameObject {
    static speed = 3;

    v: Vector;
    keyDown: Key[];
    direction: "right" | "left";

    private animation: Generator<number>;
    private saidLetter: Generator<Dialog>;
    private sayLetterTime_ms: number = 40;

    area: Area | undefined;
    private dialogs: Dialog[] = [];
    private saidDialog: Dialog = { dialog: "" };
    private waitDialog: boolean = false;

    items: Item[] = [ 

    ];

    constructor(x: number, y: number, w: number, h: number) {
        super(x, y, w, h, false, ObjectType.Player);
        this.v = new Vector(0, 0);
        this.keyDown = [];
        this.direction = "right";

        this.animation = this.animate(32);
        this.saidLetter = this.sayLetter();
    }

    init() {
        addEventListener("keydown", ( e ) => {
            // ESCAPE - PAUSE
            if (e.keyCode === 27) {
                if (document.querySelector<HTMLDivElement>("#pause")?.style.display === "block") {
                    closeModal("pause");
                } else {
                    openModal("pause");
                }
            }

            if (document.querySelector<HTMLDivElement>("#pause")?.style.display === "block")
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
                for (let obj of objects) {
                    if (obj.type === ObjectType.InteractableObject) {
                        const interactable = obj as InteractableObject;
                        if (interactable.canInteract) {
                            interactable.interact();
                        }
                    }
                }
            }

            // 'SPACE' - SKIP DIALOG
            if (e.keyCode === 32) {
                this.dialogs.shift();
                this.saidDialog.dialog = "";
                this.saidLetter = this.sayLetter();
            }

            //! DEBUG
            if (e.keyCode === 190) {
                this.teleport(parseFloat(prompt("X: ") ?? "0"), parseFloat(prompt("Y: ") ?? "0"));
            }
            
            if (e.keyCode === 191) {
                this.say(prompt("Text: ") ?? "Hello, World!", parseInt(prompt("Show time:") ?? "1000"));
            }
        });

        addEventListener("keyup", ( e ) => {
            // LEFT
            if (e.keyCode === 65) {
                this.keyDown = this.keyDown.filter(key => key !== Key.LEFT);
            }

            // RIGHT
            if (e.keyCode === 68) {
                this.keyDown = this.keyDown.filter(key => key !== Key.RIGHT);
            }
        });
    }

    update(): void {
        this.area = Object.values(areas).find(area => rectRectCollision(this, area));

        // Change velocity depending on keydown
        if (this.keyDown.at(-1) === Key.LEFT) {
            this.v.x = -Player.speed * dt;
            this.direction = "left";
        } else if (this.keyDown.at(-1) === Key.RIGHT) {
            this.v.x = Player.speed * dt;
            this.direction = "right";
        } else {
            this.v.x = 0;
        }
        
        // Gravity
        this.v.y += gravity;
        if (this.area) {
            if (this.bottom() + this.v.y * dt === this.area.bottom()) {
                this.v.y = 0;
            } else if (this.bottom() + this.v.y * dt > this.area.bottom()) {
                this.v.y = this.area.bottom() - this.bottom();
            }

            // Move
            if (this.area.left() < this.left() + this.v.x && this.area.right() > this.right() + this.v.x) {
                if (this.right() + this.v.x < 2 * (canvas.width / 3) && this.left() + this.v.x > canvas.width / 3) {
                    this.x += this.v.x;
                } else {
                    Object.values(objects).forEach(obj => {
                        obj.x -= this.v.x;
                    });
                }
                this.realX += this.v.x;
            }
        }
        
        if (this.bottom() < canvas.height) {
            this.y += this.v.y * dt;
        } else {
            Object.values(objects).forEach(obj => {
                obj.y -= this.v.y * dt;
            });
        }
        this.realY += this.v.y * dt;
    }

    draw(): void {
        this.animation.next();

        const dialogElement = document.querySelector<HTMLParagraphElement>(".dialog-text");
        if (dialogElement) dialogElement.innerText = "";

        if (this.dialogs.length > 0) {
            if (!this.waitDialog) {
                const said: Dialog = this.saidLetter.next().value;

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

        items.innerHTML = "";
        this.items.forEach(item => {
            const itemElement = document.createElement("div");
            itemElement.classList.add("item");
            if (item.texture) {
                const img = loadedAssets.imgs[item.texture];

                itemElement.appendChild(img);
            }

            itemElement.innerHTML += `<p>${item.displayName}</p>`;

            items.appendChild(itemElement);
        });
    }

    teleport(x: number, y: number): void {
        const diffX =  this.realX - x;
        const diffY =  this.realY - y;
        this.realX = x;
        this.realY = y;

        if (this.left() - diffX < canvas.width / 3) {
            const tmp = this.x - canvas.width / 3;
            this.x = canvas.width / 3;
            Object.values(objects).forEach(obj => {
                obj.x += diffX - tmp;
            });
        } else if (this.right() - diffX > canvas.width / 3 * 2) {
            const tmp = this.right() - canvas.width / 3 * 2;
            this.x = canvas.width / 3 * 2 - this.w;
            Object.values(objects).forEach(obj => {
                obj.x += diffX - tmp;
            });
        } else {
            this.x -= diffX;
        }

        if (this.top() - diffY < 0) {
            const tmp = this.y;
            this.y = 0;
            Object.values(objects).forEach(obj => {
                obj.y += diffY - tmp;
            });
        } else if (this.bottom() - diffY > canvas.height) {
            const tmp = this.bottom() - canvas.height;
            this.y = canvas.height - this.h;
            Object.values(objects).forEach(obj => {
                obj.y += diffY - tmp;
            });
        } else {
            this.y -= diffY;
        }
    }

    *sayLetter() {
        let wait = false;
        let index = 0;

        while(true) {
            if (!wait) {
                const sound: HTMLAudioElement = loadedAssets.sounds["click"];
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

    *animate(w: number) {
        let posX = 0;
        let wait = false;
        let waitTime = 1000;

        while(true) {
            let x = posX * w;
            let img;
            if (this.v.x !== 0) {
                img = loadedAssets.imgs["player_walking_" + this.direction];
                waitTime = 150;
            } else {
                img = loadedAssets.imgs["player_idle_" + this.direction];
                waitTime = 1000;
            }

            c.beginPath();
            c.drawImage(img, x, 0, w, img.height, this.x, this.y, this.w, this.h);

            if (!wait) {
                if (posX + 1 < img.width / w) {
                    posX++;
                } else {
                    posX = 0;
                }

                wait = true;
                setTimeout(() => {
                    wait = false;
                }, waitTime);
            }

            yield posX;
        }
    }

    say(text: string, showTime_ms: number): void {
        this.dialogs.push({ dialog: text, showTime_ms });
    }

    debug(): void {

    }

    override alignX(): void {
        this.teleport(this.realLeft() - this.w, this.realTop());
    }

    override alignY(): void {
        this.teleport(this.realLeft(), this.realTop() - this.h);
    }
}