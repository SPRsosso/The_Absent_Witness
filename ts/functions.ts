import { InteractableObject } from "./interactable_object/interactable_object.js";
import { GameObject } from "./objects/game_object.js";

export function degToRad(deg: number): number {
    return deg * Math.PI / 180;
}

export function radToDeg(rad: number): number {
    return rad * 180 / Math.PI;
}

export function rectRectCollision(a: GameObject, b: GameObject): boolean {
    return !(
        ((a.y + a.h) < (b.y)) ||
        (a.y > (b.y + b.h)) ||
        ((a.x + a.w) < b.x) ||
        (a.x > (b.x + b.w))
    );
}

export function circRectCollision(circle: InteractableObject, rect: GameObject) {
    var distX = Math.abs(circle.collisionX - rect.x - rect.w / 2);
    var distY = Math.abs(circle.collisionY - rect.y - rect.h / 2);

    if (distX > (rect.w / 2 + circle.radius)) { return false; }
    if (distY > (rect.h / 2 + circle.radius)) { return false; }

    if (distX <= (rect.w / 2)) { return true; }
    if (distY <= (rect.h / 2)) { return true; }

    var dx = distX - rect.w / 2;
    var dy = distY - rect.h / 2;
    return (dx ** 2 + dy ** 2 <= (circle.radius ** 2));
}

export function randomInt(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}