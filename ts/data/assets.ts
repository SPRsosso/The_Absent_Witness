interface Asset {
    imgs: { [key: string]: any }
}

export const assetsToPreload: Asset = {
    imgs: {
        "player_walking_left": "./imgs/person_walking_left.png",
        "player_walking_right": "./imgs/person_walking_right.png",
        "player_idle_left": "./imgs/person_idle_left.png",
        "player_idle_right": "./imgs/person_idle_right.png",
        "building_1": "./imgs/building_1.png",
        "footprint_floor": "./imgs/footprint_floor.png",
        "sky": "./imgs/sky.png",
    }
};

export const loadedAssets: Asset = {
    imgs: {

    }
};