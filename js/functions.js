export function degToRad(deg) {
    return deg * Math.PI / 180;
}
export function radToDeg(rad) {
    return rad * 180 / Math.PI;
}
export function rectRectCollision(a, b) {
    return !(((a.y + a.h) < (b.y)) ||
        (a.y > (b.y + b.h)) ||
        ((a.x + a.w) < b.x) ||
        (a.x > (b.x + b.w)));
}
export function circRectCollision(circle, rect) {
    var distX = Math.abs(circle.collisionX - rect.x - rect.w / 2);
    var distY = Math.abs(circle.collisionY - rect.y - rect.h / 2);
    if (distX > (rect.w / 2 + circle.radius)) {
        return false;
    }
    if (distY > (rect.h / 2 + circle.radius)) {
        return false;
    }
    if (distX <= (rect.w / 2)) {
        return true;
    }
    if (distY <= (rect.h / 2)) {
        return true;
    }
    var dx = distX - rect.w / 2;
    var dy = distY - rect.h / 2;
    return (Math.pow(dx, 2) + Math.pow(dy, 2) <= (Math.pow(circle.radius, 2)));
}
export function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
export function clamp(n, min, max) {
    return n < min ? min : (n > max ? max : n);
}
export function isAudioPlaying(audio) {
    return (audio.currentTime > 0 &&
        !audio.paused &&
        !audio.ended &&
        audio.readyState >= 3);
}
