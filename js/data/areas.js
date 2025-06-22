import { Area } from "../area/area.js";
export const areas = {
    workshop: new Area(0, innerHeight / 2 - 1080 / 4, 1920, 1080 / 2, "red", "concrete_floor", "office_background"),
    workshop_corridor: new Area(3500, innerHeight / 2 - 1080 / 4, 1920, 1080 / 2, "yellow", "concrete_floor", "office_corridor"),
    workshop_bathroom: new Area(7000, innerHeight / 2 - 1080 / 4, 1920, 1080 / 2, "lime", "bathroom_floor", "workshop_bathroom_background"),
    workshop_first_floor_staircase: new Area(10500, innerHeight / 2 - 1080 / 4, 960, 1080 / 2, "lightblue", "concrete_floor", "staircase_first_floor"),
    workshop_reception: new Area(14000, innerHeight / 2 - 1080 / 4, 1920, 1080 / 2, "blue", "concrete_floor", "office_reception"),
    workshop_second_floor_staircase: new Area(17500, innerHeight / 2 - 1080 / 4, 614, 1080 / 2, "lightblue", "concrete_floor", "staircase_second_floor"),
    workshop_boss: new Area(21000, innerHeight / 2 - 1080 / 4, 960, 1080 / 2, "violet", "concrete_floor", "office_boss"),
    street: new Area(-3500, innerHeight - 64, 7200, 1080, "green", "pavement"),
    house_living_room: new Area(-17000, innerHeight / 2 - 1080 / 4, 2400, 1080 / 2, "crimson", "wooden_floor", "living_room"),
    house_corridor: new Area(-20500, innerHeight / 2 - 1080 / 4, 960, 1080 / 2, "red", "wooden_floor", "house_corridor"),
    basement_corridor: new Area(-24000, innerHeight / 2 - 1080 / 4, 1920, 1080 / 2, "gray", "pavement", "basement_corridor"),
};
areas.street.alignX();
areas.street.alignY();
areas.house_corridor.alignX();
areas.basement_corridor.alignX();
areas.basement_corridor.data.dark = true;
