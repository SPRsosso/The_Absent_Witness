const player = new Player(canvas.width / 2, canvas.height / 2);
const walkPaths = [
    new WalkPath(innerWidth / 2 - innerWidth / 4, innerHeight - 70, innerWidth / 2, 70),
    new WalkPath(innerWidth / 2 - innerWidth / 6, innerHeight - 70 - 70, innerWidth / 3, 70),
];

const interactableObjects = [
    new InteractableObject(innerWidth / 2, innerHeight - 140, 80, 40, "footprint_floor.png", () => {}),
] 

const gameInterval = setInterval(() => {
    canvas.clear();

    player.render();

    walkPaths.forEach(path => path.render());

    interactableObjects.forEach(obj => obj.render());
}, fps);