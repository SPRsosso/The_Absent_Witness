function rectCircleColl(circle,rect){
    var distX = Math.abs(circle.pos.x - rect.pos.x - rect.width/2);
    var distY = Math.abs(circle.pos.y - rect.pos.y - rect.height/2);

    if (distX > (rect.width/2 + circle.radius)) { return false; }
    if (distY > (rect.height/2 + circle.radius)) { return false; }

    if (distX <= (rect.width/2)) { return true; } 
    if (distY <= (rect.height/2)) { return true; }

    var dx=distX-rect.width/2;
    var dy=distY-rect.height/2;
    return (dx*dx+dy*dy <= (circle.radius*circle.radius));
}

function changePlayerDirection(src, time = 200) {
    player.direction = keyPresses[keyPresses.length - 1]?.toLowerCase() ?? player.direction;
    player.changeAnimation(src, time, false);
}

canvas.clear = () => {
    c.clearRect(0, 0, canvas.width, canvas.height);
}

function framesToMs(f) {
    return f / frames;
}

function msToFrames(t) {
    return t * frames;
}