interface Asset {
    imgs: { [key: string]: any },
    sounds: { [key: string]: any },
}

export const assetsToPreload: Asset = {
    imgs: {
        "player_walking_left": "./imgs/person_walking_left.png",
        "player_walking_right": "./imgs/person_walking_right.png",
        "player_idle_left": "./imgs/person_idle_left.png",
        "player_idle_right": "./imgs/person_idle_right.png",
        "footprint_floor": "./imgs/footprint_floor.png",
        "sky": "./imgs/sky.png",
        "speaking": "./imgs/speaking.png",
        "slider_thumb": "./imgs/slider_thumb.png",
        "slider_track": "./imgs/slider_track.png",
        "golden_egg": "./imgs/golden_egg.png",

        //! ITEMS
        "key": "./imgs/key.png",

        //! OFFICE
        "office_background": "./imgs/office_background.png",
        "office_corridor": "./imgs/office_corridor.png",
        "office_boss": "./imgs/office_boss.png",
        "sideways_dresser": "./imgs/sideways_dresser.png",
        "concrete_floor": "./imgs/concrete_floor.png",
        "desk_with_computer": "./imgs/desk_with_computer.png",
        "door_left": "./imgs/door_left.png",
        "door_right": "./imgs/door_right.png",
        "office_door": "./imgs/office_door.png",
        "wc_sign": "./imgs/wc_sign.png",
        "water_cooler": "./imgs/water_cooler.png",
        "staircase_first_floor": "./imgs/staircase_first_floor.png",
        "staircase_second_floor": "./imgs/staircase_second_floor.png",
        //? OFFICE BATHROOM
        "workshop_bathroom_background": "./imgs/workshop_bathroom_background.png",
        "bathroom_floor": "./imgs/bathroom_floor.png",
        //? OFFICE RECEPTION
        "vending_machine": "./imgs/vending_machine.png",
        "office_reception": "./imgs/reception.png",
        "reception_desk": "./imgs/reception_desk.png",

        //! STREET
        "pavement": "./imgs/pavement.png",
        "building_1": "./imgs/building_1.png",
        "building_2": "./imgs/building_2.png",
        "building_3": "./imgs/building_3.png",
        "building_4": "./imgs/building_4.png",
        "office_outside": "./imgs/office_outside.png",
        "tree": "./imgs/tree.png",
        "bush_1": "./imgs/bush_1.png",
        "bush_2": "./imgs/bush_2.png",


        "magnifying_glass": "./imgs/magnifying_glass.png",
    },
    sounds: {
        "moai": "./sounds/moai.mp3",
        "open_door": "./sounds/open_door.mp3",
        "locked_door": "./sounds/locked_door.mp3",
        "unlock_door": "./sounds/unlock_door.mp3",
        "click": "./sounds/click.mp3",
        "sweeping_garbage": "./sounds/sweeping_garbage.mp3",
        "footsteps": "./sounds/footsteps.mp3",
        "pickup": "./sounds/pickup.mp3",
        "vending_machine": "./sounds/vending_machine.mp3",
    }
};

export const loadedAssets: Asset = {
    imgs: {

    },
    sounds: {

    }
};