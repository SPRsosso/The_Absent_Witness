addEventListener("keydown", e => {
    if (e.keyCode === 65 || e.keyCode === 37) {
        player.direction = "left";
    }

    if (e.keyCode === 68 || e.keyCode === 39) {
        player.direction = "right";
    }

    if (keyPresses.length === 0 && (e.keyCode === 68 || e.keyCode === 39 || e.keyCode === 65 || e.keyCode === 37))
        player.changeAnimation("person_walking", 200);

    if (e.keyCode === 65 || e.keyCode === 37) {
        keyPresses.push(KEYS.LEFT);
        changePlayerDirection("person_walking");
    }

    if (e.keyCode === 68 || e.keyCode === 39) {
        keyPresses.push(KEYS.RIGHT);
        changePlayerDirection("person_walking");
    }
});

addEventListener("keyup", e => {
    if (e.keyCode === 65 || e.keyCode === 37) {
        keyPresses = keyPresses.filter(key => key !== KEYS.LEFT);
        changePlayerDirection("person_walking");
    }

    if (e.keyCode === 68 || e.keyCode === 39) {
        keyPresses = keyPresses.filter(key => key !== KEYS.RIGHT);
        changePlayerDirection("person_walking");
    }

    if (keyPresses.length === 0 && (e.keyCode === 68 || e.keyCode === 39 || e.keyCode === 65 || e.keyCode === 37)) {
        player.changeAnimation("person_idle", 1000);
    }
});