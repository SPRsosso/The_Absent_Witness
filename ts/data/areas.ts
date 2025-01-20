import { Area } from "../area/area.js";

export const areas = {
    workshop: new Area(0, innerHeight / 2 - innerHeight / 4, innerWidth, innerHeight / 2, "red"),
    street: new Area(-innerWidth - 20, 0, innerWidth, innerHeight, "green"),
}