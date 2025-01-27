import { Area } from "../area/area.js";

export const areas = {
    workshop: new Area(0, innerHeight / 2 - 1080 / 4, 1920, 1080 / 2, "red", "concrete_floor", "office_background"),
    workshop_corridor: new Area(3000, innerHeight / 2 - 1080 / 4, 1920, 1080 / 2, "yellow", "concrete_floor", "office_corridor"),
    workshop_bathroom: new Area(6000, innerHeight / 2 - 1080 / 4, 1920, 1080 / 2, "lime", "bathroom_floor", "workshop_bathroom_background"),
    workshop_first_floor_staircase: new Area(9000, innerHeight / 2 - 1080 / 4, 960, 1080 / 2, "lightblue", "concrete_floor", "staircase_first_floor"),
    workshop_reception: new Area(11500, innerHeight / 2 - 1080 / 4, 1920, 1080 / 2, "blue", "concrete_floor", "office_reception"),
    workshop_second_floor_staircase: new Area(15000, innerHeight / 2 - 1080 / 4, 614, 1080 / 2, "lightblue", "concrete_floor", "staircase_second_floor"),
    workshop_boss: new Area(18000, innerHeight / 2 - 1080 / 4, 960, 1080 / 2, "violet", "concrete_floor", "office_boss"),
    street: new Area(-3000, innerHeight - 64, 5760, 1080, "green", "pavement"),
}

areas.street.alignX();
areas.street.alignY();