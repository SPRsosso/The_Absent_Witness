import { Area } from "./area/area.js";
import { areas } from "./data/areas.js";
import { loadedAssets } from "./data/assets.js";
import { Key } from "./data/keys.js";
import { rectRectCollision } from "./functions.js";
import { GameObject } from "./game_object.js";
import { c, canvas, dt, gravity } from "./main.js";
import { Vector } from "./vector.js";

export class Player extends GameObject {
    static speed = 3;

    v: Vector;
    keyDown: Key[];
    direction: "right" | "left";

    private animation: Generator<number>;
    private saidLetter: Generator<string>;

    area: Area | undefined;
    private dialog: string = "";
    private saidDialog: string = this.dialog;

    constructor(x: number, y: number, w: number, h: number) {
        super(x, y, w, h);
        this.v = new Vector(0, 0);
        this.keyDown = [];
        this.direction = "right";

        this.animation = this.animate(32);
        this.saidLetter = this.sayLetter();
    }

    init() {
        addEventListener("keydown", ( e ) => {
            // LEFT
            if (e.keyCode === 65) {
                this.keyDown.push(Key.LEFT);
            }

            // RIGHT
            if (e.keyCode === 68) {
                this.keyDown.push(Key.RIGHT);
            }

            if (e.keyCode === 190) {
                this.teleport(parseFloat(prompt("X: ") ?? "0"), parseFloat(prompt("Y: ") ?? "0"));
            }
            
            if (e.keyCode === 191) {
                this.say(prompt("Text: ") ?? "Hello, World!");
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

        addEventListener("click", ( e ) => {
            if (this.dialog.trim() === "") {
                return;
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
                    Object.values(areas).forEach(area => {
                        area.x -= this.v.x;
                    });
                }
                this.realX += this.v.x;
            }
        }
        
        if (this.bottom() < canvas.height) {
            this.y += this.v.y * dt;
        } else {
            Object.values(areas).forEach(area => {
                area.y -= this.v.y * dt;
            });
        }
        this.realY += this.v.y * dt;
    }

    teleport(x: number, y: number): void {
        const diffX =  this.realX - x;
        const diffY =  this.realY - y;
        this.realX = x;
        this.realY = y;

        if (this.left() - diffX < canvas.width / 3) {
            const tmp = this.x - canvas.width / 3;
            this.x = canvas.width / 3;
            Object.values(areas).forEach(area => {
                area.x += diffX - tmp;
            });
        } else if (this.right() - diffX > canvas.width / 3 * 2) {
            const tmp = this.right() - canvas.width / 3 * 2;
            this.x = canvas.width / 3 * 2 - this.w;
            Object.values(areas).forEach(area => {
                area.x += diffX - tmp;
            });
        } else {
            this.x -= diffX;
        }

        if (this.top() - diffY < 0) {
            const tmp = this.y;
            this.y = 0;
            Object.values(areas).forEach(area => {
                area.y += diffY - tmp;
            });
        } else if (this.bottom() - diffY > canvas.height) {
            const tmp = this.bottom() - canvas.height;
            this.y = canvas.height - this.h;
            Object.values(areas).forEach(area => {
                area.y += diffY - tmp;
            });
        } else {
            this.y -= diffY;
        }
    }

    draw(): void {
        this.animation.next();

        if (this.dialog.trim() !== "") {
            this.saidLetter.next();

            console.log(this.saidDialog);
        }
    }

    *sayLetter() {
        let waitTime = 20;
        let wait = false;
        let index = 0;

        while(true) {
            if (!wait) {
                if (index >= this.dialog.length) {
                    break;
                }
    
                this.saidDialog += this.dialog.trim()[index++];
    
                wait = true;
                setTimeout(() => {
                    wait = false;
                }, waitTime);
            }

            yield this.saidDialog;
        }

        this.saidDialog = "";
        this.saidLetter = this.sayLetter();
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

    say(text: string): void {
        this.dialog = text;
    }

    debug(): void {

    }
}