import { areas } from "./data/areas.js";
import { loadedAssets } from "./data/assets.js";
import { isAudioPlaying, randomInt } from "./functions.js";
import { InteractableObject } from "./interactable_object/interactable_object.js";
import { Item } from "./inventory/item.js";
import { player, volume } from "./main.js";
import { Decoration } from "./objects/decoration.js";

export function init(): Promise<void> {
    return new Promise((resolve, reject) => {
        //! OFFICE
        //! OFFICE - INTERACTABLE OBJECTS
        const doorToCorridor = new InteractableObject(areas.workshop.realRight(), areas.workshop.realBottom(), 66, 400, 50, "door_left");
        doorToCorridor.alignX();
        doorToCorridor.alignY();
        doorToCorridor.createInteraction(() => {
            player.teleport(areas.workshop_corridor.realLeft(), areas.workshop_corridor.realBottom() - player.h);

            openDoor();
        });

        const doorToOffice = new InteractableObject(areas.workshop_corridor.realLeft(), areas.workshop_corridor.realBottom(), 66, 400, 50, "door_right");
        doorToOffice.alignY();
        doorToOffice.createInteraction(() => {
            player.teleport(areas.workshop.realRight(), areas.workshop.realBottom() - player.h);
            player.alignX();

            openDoor();
        });

        const doorToBathroom = new InteractableObject(areas.workshop_corridor.realLeft() + 320, areas.workshop_corridor.realBottom(), 238, 400, 50, "office_door", true);
        doorToBathroom.alignY();
        doorToBathroom.createInteraction(() => {
            player.teleport(areas.workshop_bathroom.realLeft(), areas.workshop_bathroom.realBottom() - player.h);
            openDoor();
        });

        const doorToCorridor_FromBathroom = new InteractableObject(areas.workshop_bathroom.realLeft(), areas.workshop_bathroom.realBottom(), 66, 400, 50, "door_right");
        doorToCorridor_FromBathroom.alignY();
        doorToCorridor_FromBathroom.createInteraction(() => {
            player.teleport(doorToBathroom.realLeft(), areas.workshop_corridor.realBottom() - player.h);
            openDoor();
        });

        const doorToStaircase = new InteractableObject(areas.workshop_corridor.realRight(), areas.workshop_corridor.realBottom(), 66, 400, 50, "door_left");
        doorToStaircase.alignX();
        doorToStaircase.alignY();
        doorToStaircase.createInteraction(() => {
            player.teleport(areas.workshop_first_floor_staircase.realLeft(), areas.workshop_first_floor_staircase.realBottom() - player.h);
            openDoor();
        });

        const gigachad = new InteractableObject(areas.workshop_corridor.realLeft() + 930, areas.workshop_corridor.realBottom() - 200, 0, 0, 40, null, true);
        gigachad.createInteraction(() => {
            player.say("Hmm... What a strange sculpture, I've never noticed it.", 2500);

            const moaiEffect: HTMLAudioElement = loadedAssets.sounds["moai"];
            if (isAudioPlaying(moaiEffect))
                moaiEffect.pause();
            moaiEffect.currentTime = 0;

            moaiEffect.volume = volume;
            moaiEffect.play();
        });

        const trashcanBathroom = new InteractableObject(areas.workshop_bathroom.realLeft() + 930, areas.workshop_bathroom.realBottom(), 0, 200, 20, null, true, false);
        trashcanBathroom.alignY();
        trashcanBathroom.createInteraction(() => {
            const sound = loadedAssets.sounds["sweeping_garbage"];
            if (isAudioPlaying(sound))
                sound.pause();
            sound.currentTime = 0;

            sound.volume = volume;
            sound.play();

            pickup();

            player.inventory.addItem(new Item("boss_key", "Key", "key"));
            trashcanBathroom.inspected = true;
            player.say("Yuck! The worst feeling ever... Rummaging through the garbage... But i found something.", 2000);
        });

        const doorToBoss = new InteractableObject(areas.workshop_corridor.realLeft() + 1250, areas.workshop_corridor.realBottom(), 238, 400, 50, "office_door", true);
        doorToBoss.alignY();
        doorToBoss.data.open = false;
        doorToBoss.createInteraction(() => {
            if (typeof doorToBoss.data.open === "boolean" && doorToBoss.data.open) {
                openDoor();
                player.teleport(areas.workshop_boss.realLeft(), areas.workshop_boss.realBottom() - player.h);

                return;
            }

            if (player.inventory.any("boss_key")) {
                const sound: HTMLAudioElement = loadedAssets.sounds["unlock_door"];
                if (isAudioPlaying(sound))
                    sound.pause();
                sound.currentTime = 0;

                sound.volume = volume;
                sound.play();

                doorToBoss.data.open = true;
                player.inventory.filter("boss_key");
                return;
            }

            player.say("Locked...", 1500);
            lockedDoor();
        });

        const doorToCorridor_FromStaircase = new InteractableObject(areas.workshop_first_floor_staircase.realLeft(), areas.workshop_first_floor_staircase.realBottom(), 66, 400, 50, "door_right");
        doorToCorridor_FromStaircase.alignY();
        doorToCorridor_FromStaircase.createInteraction(() => {
            player.teleport(areas.workshop_corridor.realRight(), areas.workshop_corridor.realBottom() - player.h);
            player.alignX();
            openDoor();
        });

        const staircaseDown_FromFirstFloor = new InteractableObject(areas.workshop_first_floor_staircase.realLeft() + 530, areas.workshop_first_floor_staircase.realBottom() - 200, 0, 0, 50, null, true);
        const staircaseUp_FromReception = new InteractableObject(areas.workshop_reception.realLeft() + 1650, areas.workshop_reception.realBottom() - 200, 0, 0, 50, null, true);
        const staircaseUp_FromFirstFloor = new InteractableObject(areas.workshop_first_floor_staircase.realLeft() + 850, areas.workshop_first_floor_staircase.realBottom() - 200, 0, 0, 50, null, true)
        const staircaseDown_FromSecondFloor = new InteractableObject(areas.workshop_second_floor_staircase.realLeft() + 510, areas.workshop_first_floor_staircase.realBottom() - 200, 0, 0, 50, null, true);

        staircaseDown_FromFirstFloor.createInteraction(() => {
            player.teleport(staircaseUp_FromReception.realRight() - player.w / 2, areas.workshop_reception.realBottom() - player.h);
            
            walk();
        });

        staircaseUp_FromReception.createInteraction(() => {
            player.teleport(staircaseDown_FromFirstFloor.realLeft() - player.w / 2, areas.workshop_first_floor_staircase.realBottom() - player.h);
            
            walk();
        });

        staircaseUp_FromFirstFloor.createInteraction(() => {
            player.teleport(staircaseDown_FromSecondFloor.realLeft() - player.w / 2, areas.workshop_second_floor_staircase.realBottom() - player.h);
            
            walk();
        });

        staircaseDown_FromSecondFloor.createInteraction(() => {
            player.teleport(staircaseUp_FromFirstFloor.realLeft() - player.w / 2, areas.workshop_first_floor_staircase.realBottom() - player.h);
            
            walk();
        });

        const doorToStreet = new InteractableObject(areas.workshop_reception.realLeft(), areas.workshop_reception.realBottom(), 66, 400, 40, "door_right");
        doorToStreet.alignY();
        doorToStreet.createInteraction(() => {
            openDoor();
            player.teleport(areas.street.realRight(), areas.street.realBottom() - player.h);
            player.alignX();
        });

        const doorToCorridor_FromBoss = new InteractableObject(areas.workshop_boss.realLeft(), areas.workshop_boss.realBottom(), 66, 400, 50, "door_right");
        doorToCorridor_FromBoss.alignY();
        doorToCorridor_FromBoss.createInteraction(() => {
            player.teleport(doorToBoss.realLeft(), areas.workshop_corridor.realBottom() - player.h);
            openDoor();
        });

        const oldBossPrompt = new InteractableObject(areas.workshop_boss.realLeft() + 730, areas.workshop_boss.realTop() + 240, 0, 0, 10, null, true);
        oldBossPrompt.createInteraction(() => {
            player.say("My old boss John Brown. I liked him. He was nice...", 2000);
            player.say("Now we have new boss, he is such a big di... Calm down James...", 2000);
        });

        //! OFFICE - DECORATIONS
        const computer = new Decoration(areas.workshop.realLeft() + 500, areas.workshop.realBottom(), 266, 200, "desk_with_computer");
        computer.alignY();
        const computer2 = new Decoration(areas.workshop.realLeft() + 1000, areas.workshop.realBottom(), 266, 200, "desk_with_computer");
        computer2.alignY();
        const receptionDesk = new InteractableObject(areas.workshop_reception.realLeft() + 700, areas.workshop.realBottom(), 600, 200, 50, "reception_desk", true);
        receptionDesk.alignY();
        receptionDesk.createInteraction(() => {
            player.say("My wife used to work here.", 1500);
            player.say("I remember when she came here for the first time. She was full of energy, smiling... She said, that this is new beginning.", 2000);
            player.say("But... Then new boss got hired.", 1500);
            player.say("He ruined everything. Layoffs, changes, pressure... Mia saw it every day until she couldn't stand it anymore.", 2000);
            player.say("And me... I didn't do anything.", 1500);
        });

        const computerBoss = new Decoration(areas.workshop_boss.realLeft() + 300, areas.workshop.realBottom(), 266, 200, "desk_with_computer");
        computerBoss.alignY();

        const dresser = new Decoration(areas.workshop_boss.realRight(), areas.workshop_boss.realBottom(), 62, 250, "sideways_dresser");
        dresser.alignX();
        dresser.alignY();

        const wcSize = {
            w: 120,
            h: 60,
        }
        const wcSign = new Decoration(doorToBathroom.realLeft() + doorToBathroom.w / 2 - wcSize.w / 2, doorToBathroom.realTop() - 30, wcSize.w, wcSize.h, "wc_sign", true);
        wcSign.alignY();

        const waterCooler = new InteractableObject(doorToBoss.realRight() + 50, areas.workshop_corridor.realBottom(), 180, 360, 20, "water_cooler", true);
        waterCooler.alignY();
        waterCooler.createInteraction(() => {
            player.say("I'm not thirsty.", 1500);
        });

        const mirror = new InteractableObject(areas.workshop_bathroom.realLeft() + 500, areas.workshop_bathroom.realTop() + 250, 0, 0, 75, null, true);
        mirror.createInteraction(() => {
            player.say("That's me... Same as usual.", 1500);
        });

        const schedule = new InteractableObject(areas.workshop.realLeft() + 180, areas.workshop.realTop() + 260, 0, 0, 40, null, true);
        schedule.createInteraction(() => {
            player.say("Sure. Who's staying up late again? Me. Who gets up well rested in the morning? Certainly not me.", 2000);
            player.say("I don't know why I even try...", 1500);
        });

        const bestEmployees = new InteractableObject(areas.workshop.realLeft() + 380, areas.workshop.realTop() + 260, 0, 0, 40, null, true);
        bestEmployees.createInteraction(() => {
            player.say("Here you go... The best employees of the month. And no, not me.", 2000);
        });

        const clock = new InteractableObject(areas.workshop.realLeft() + 910, areas.workshop.realTop() + 130, 0, 0, 70, null, true);
        clock.createInteraction(() => {
            player.say("It's 12:15AM, I should go home...", 1500);
        });

        const lockedDoorSecondFloor = new InteractableObject(areas.workshop_second_floor_staircase.realLeft(), areas.workshop_second_floor_staircase.realBottom(), 66, 400, 50, "door_right");
        lockedDoorSecondFloor.alignY();
        lockedDoorSecondFloor.createInteraction(() => {
            player.say("Locked...", 1500);
            lockedDoor();
        });

        const stackOfPaper = new InteractableObject(areas.workshop.realLeft() + 720, areas.workshop.realBottom() - 134, 54, 42, 20, "stack_of_paper", false);
        stackOfPaper.alignY();
        stackOfPaper.createInteraction(() => {
            player.say("Next night, next stacks of paper. I don't even know when was the last time I finished work at a normal time.", 2000);
            player.say("I wonder if they even realize how much it is. They probably don't even have to worry about it.", 2000);
        });

        //! STREET
        //! STREET - INTERACTABLE OBJECTS
        const doorToOffice_FromStreet = new InteractableObject(areas.street.realRight(), areas.street.realBottom(), 66, 400, 50, "door_left");
        doorToOffice_FromStreet.alignX();
        doorToOffice_FromStreet.alignY();
        doorToOffice_FromStreet.createInteraction(() => {
            openDoor();
            player.teleport(areas.workshop_reception.realLeft(), areas.workshop_reception.realBottom() - player.h);
        });

        const doorToLivingRoom_FromStreet = new InteractableObject(areas.street.realLeft(), areas.street.realBottom(), 66, 400, 50, "house_door_right");
        doorToLivingRoom_FromStreet.alignY();
        doorToLivingRoom_FromStreet.createInteraction(() => {
            openDoor();

            player.teleport(areas.house_living_room.realRight(), areas.house_living_room.realBottom() - player.h);
            player.alignX();

            setTimeout(() => {
                player.say("Honey! I'm home!", 2000);
                player.say("(silence)", 1500);
                player.say("...", 1500);
                player.say("Hello? ", 1000);
                player.say("Are you here?", 1500);
                player.say("Mia? ", 1000);
            }, 1000);
        });


        //! STREET - DECORATIONS
        const buildings: Decoration[] = [];
        const officeHeight = 900;
        const officeResolutionY = loadedAssets.imgs["office_outside"].width / loadedAssets.imgs["office_outside"].height;
        const officeResolutionX = loadedAssets.imgs["office_outside"].height / loadedAssets.imgs["office_outside"].width;

        const officeOutside = new Decoration(areas.street.realRight() - 2 * officeResolutionX, areas.street.realBottom(), officeHeight * officeResolutionY, officeHeight, "office_outside");
        officeOutside.alignY();
        const houseOutside = new Decoration(areas.street.realLeft() + 2 * officeResolutionX, areas.street.realBottom(), officeHeight * officeResolutionY, officeHeight, "house_outside");
        houseOutside.alignX();
        houseOutside.alignY();

        const plants: Decoration[] = [];
        let nextBuildingX = areas.street.realRight();
        for (let i = 1; i <= 6; i++) {
            const img = loadedAssets.imgs["building_" + i];
            const resolution = img.width / img.height;
            const height = 900;

            const building = new Decoration(nextBuildingX, areas.street.realBottom(), resolution * height, height, "building_" + i, true);
            building.alignX();
            building.alignY();
            nextBuildingX = building.realLeft();

            if (i === 4) {
                const coin = new InteractableObject(nextBuildingX, areas.street.realBottom(), 32, 11, 10, "laying_coin", false, false, true);
                coin.alignY();
                coin.createInteraction(() => {
                    coin.inspected = true;
                    player.inventory.addItem(new Item("coin", "50 Cents", "coin"));
                });
            }

            buildings.push(building);
        }
        
        for (let building of buildings) {
            const plantImg = loadedAssets.imgs["tree"];
            const plantWidth = 300;
            const plantResolution = plantImg.height / plantImg.width;

            const plant = new Decoration(building.realLeft() - plantWidth / 2, areas.street.realBottom(), plantWidth, plantWidth * plantResolution, "tree", true);
            plant.alignY();

            const randomBush = "bush_" + randomInt(1, 2);
            const bushImg = loadedAssets.imgs[randomBush];
            const bushResolution = bushImg.height / bushImg.width;
            const bush = new Decoration(building.realLeft() + building.w / 2 - plantWidth / 2 + randomInt(-100, 100), areas.street.realBottom(), plantWidth, plantWidth * bushResolution, randomBush);
            bush.alignY();

            plants.push(plant);
            plants.push(bush);
        }


        //! HOUSE - INTERACTABLE OBJECTS
        const doorToStreet_FromLivingRoom = new InteractableObject(areas.house_living_room.realRight(), areas.house_living_room.realBottom(), 66, 400, 30, "house_door_left");
        doorToStreet_FromLivingRoom.alignX();
        doorToStreet_FromLivingRoom.alignY();
        doorToStreet_FromLivingRoom.createInteraction(() => {
            player.say("I don't need to go outside...", 2000);
        });

        const doorToBedroom = new InteractableObject(areas.house_living_room.realLeft() + 1120, areas.house_living_room.realBottom(),  238, 400, 20, "house_door", true);
        doorToBedroom.alignY();
        doorToBedroom.createInteraction(() => {
            player.say("Locked...", 1500);
            player.say("Hmm... That's weird, Mia wouldn't lock the door without me...", 3000);
            lockedDoor();
        });


        const doorToHallway = new InteractableObject(areas.house_living_room.realLeft(), areas.house_living_room.realBottom(), 66, 400, 30, "house_door_right");
        doorToHallway.alignY();
        doorToHallway.createInteraction(() => {
            openDoor();

            player.teleport(areas.house_corridor.realRight(), areas.house_corridor.realBottom() - player.h);
            player.alignX();
        });

        const houseDoorToBathroom = new InteractableObject(areas.house_corridor.realRight() - 125, areas.house_corridor.realBottom(), 238, 400, 20, "house_door", true);
        houseDoorToBathroom.alignX();
        houseDoorToBathroom.alignY();
        houseDoorToBathroom.createInteraction(() => {
            lockedDoor();

            player.say("Locked...", 1500);
        });

        const houseDoorToBasement = new InteractableObject(areas.house_corridor.realLeft() + 125, areas.house_corridor.realBottom(), 238, 400, 20, "house_door", true);
        houseDoorToBasement.alignY();
        houseDoorToBasement.createInteraction(() => {
            const flashlightItem = player.inventory.get("flashlight");
            if (flashlightItem) {
                openDoor();
                walk();

                player.teleport(areas.basement_corridor.realRight(), areas.basement_corridor.realBottom() - player.h);
                player.alignX();

                return;
            }
            
            player.say("There is too dark without flashlight...", 2000);
            player.say("I broke the lightbulb last year when we had piñata at my birthday party...", 2000);
        });

        const houseDoorToLivingRoom = new InteractableObject(areas.house_corridor.realRight(), areas.house_corridor.realBottom(), 66, 400, 20, "house_door_left", false);
        houseDoorToLivingRoom.alignX();
        houseDoorToLivingRoom.alignY();
        houseDoorToLivingRoom.createInteraction(() => {
            openDoor();

            player.teleport(areas.house_living_room.realLeft(), areas.house_living_room.realBottom() - player.h);
        });

        const houseDoorToKitchen = new InteractableObject(areas.house_corridor.realLeft(), areas.house_corridor.realBottom(), 66, 400, 20, "house_door_right", false);
        houseDoorToKitchen.alignY();
        houseDoorToKitchen.createInteraction(() => {
            lockedDoor();

            player.say("Locked...", 1500);
        });

        const basementToCorridor = new InteractableObject(areas.basement_corridor.realRight(), areas.basement_corridor.realBottom(), 66, 400, 20, "house_door_left", false);
        basementToCorridor.alignX();
        basementToCorridor.alignY();
        basementToCorridor.createInteraction(() => {
            openDoor();
            walk();

            player.teleport(houseDoorToBasement.realLeft(), houseDoorToBasement.realBottom() - player.h);
        });

        //! HOUSE - DECORATIONS
        const vinylRecord = new InteractableObject(areas.house_living_room.realLeft() + 930, areas.house_living_room.realTop() + 100, 128, 128, 50, "vinyl_record", true);
        vinylRecord.createInteraction(() => {
            player.say("We played it many times... We always danced to it even if we were exhausted after a whole day.", 2000);
            player.say("Mia always said that I have two left feet. Maybe she was right. But she never let me sit down - 'Music is for feeling'.", 2000);
            player.say("I don't remember the last time I played it.", 1500);
        });

        const damagedMug = new InteractableObject(areas.house_living_room.realLeft() + 180, areas.house_living_room.realBottom() - 100, 55, 48, 50, "damaged_mug", true);
        damagedMug.alignY();
        damagedMug.createInteraction(() => {
            player.say("Her favorite. Broke, when she tried to pretend that she could juggle cups", 2000);
            player.say("She was always overconfident when it came to stupid things.", 2000);
            player.say("I wanted to throw it away, but she wouldn't let me. 'It has a crack but still works' - she said", 2000);
            player.say("Now somehow... I understand what she meant.", 2000);
        });

        const perfume = new InteractableObject(areas.house_living_room.realRight() - 350, areas.house_living_room.realBottom() - 210, 22, 44, 20, "perfume", true);
        perfume.alignY();
        perfume.createInteraction(() => {
            player.say("She always smelled with this. Even when she got bored, Mia kept coming back to that smell.", 2500);
            player.say("I always knew when she was close by. All you had to do is to close your eyes and... She was here.", 2500);
        });

        //! EASTER EGGS
        const easterEgg1 = new InteractableObject(computerBoss.realRight(), computerBoss.realTop() + 35, 32, 32, 10, "golden_egg");
        easterEgg1.alignX();
        easterEgg1.createInteraction(() => {
            easterEgg1.inspected = true;
            player.inventory.addItem(new Item("easter_egg", "Golden Egg", "golden_egg"));

            pickup();

            checkEasterEggs();
        });

        

        const vendingMachine = new InteractableObject(areas.workshop_reception.realLeft() + 350, areas.workshop_reception.realBottom(), 225, 450, 40, "vending_machine", true, true, false);
        vendingMachine.alignY();
        vendingMachine.createInteraction(() => {
            if (player.inventory.any("coin")) {
                vendingMachine.inspected = true;
                player.inventory.filter("coin");

                pickup();
                const sound = loadedAssets.sounds["vending_machine"];
                if (isAudioPlaying(sound))
                    sound.pause();
                sound.volume = volume;
                sound.play();

                const easterEgg2 = new InteractableObject(vendingMachine.right() - 115, vendingMachine.bottom() - 80, 32, 32, 10, "golden_egg", true);
                easterEgg2.alignX();
                easterEgg2.alignY();
                easterEgg2.createInteraction(() => {
                    player.inventory.addItem(new Item("easter_egg", "Golden Egg", "golden_egg"));
                    easterEgg2.inspected = true;

                    pickup();

                    checkEasterEggs();
                });

                return;
            }

            player.say("I don't have any money on me... If I got any...", 2000);
        });

        resolve();
    });
}

function openDoor(): void {
    const open: HTMLAudioElement = loadedAssets.sounds["open_door"];
    if (isAudioPlaying(open))
        open.pause();
    open.currentTime = 0;

    open.volume = volume;
    open.play();
}

function lockedDoor(): void {
    const sound = loadedAssets.sounds["locked_door"];
    if (isAudioPlaying(sound))
        sound.pause();
    sound.currentTime = 0;

    sound.volume = volume;
    sound.play();
}

function checkEasterEggs(): void {
    if (player.inventory.count("golden_egg") === 3) {
        player.say("Found all golden eggs! Good job!", 2000);
    }
}

function pickup(): void {
    const sound = loadedAssets.sounds["pickup"];
    if (isAudioPlaying(sound))
        sound.pause();
    sound.currentTime = 0;

    sound.volume = volume;
    sound.play();
}

function walk(): void {
    const sound = loadedAssets.sounds["footsteps"];
    if (isAudioPlaying(sound))
        sound.pause();
    sound.currentTime = 0;

    sound.volume = volume;
    sound.play();
}