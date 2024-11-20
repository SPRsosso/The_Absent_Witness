addEventListener("keydown", e => {
    if (e.keyCode === 65 || e.keyCode === 37) {
        keyPresses.push(KEYS.LEFT);
    }

    if (e.keyCode === 68 || e.keyCode === 39) {
        keyPresses.push(KEYS.RIGHT);
    }
});

addEventListener("keyup", e => {
    if (e.keyCode === 65 || e.keyCode === 37) {
        keyPresses = keyPresses.filter(key => key !== KEYS.LEFT);
    }

    if (e.keyCode === 68 || e.keyCode === 39) {
        keyPresses = keyPresses.filter(key => key !== KEYS.RIGHT);
    }
});