import { areas } from "./data/areas.js";
import { loadedAssets } from "./data/assets.js";
import { InteractableObject } from "./interactable_object/interactable_object.js";
import { Item } from "./item.js";
import { player } from "./main.js";
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
            moaiEffect.pause();
            moaiEffect.currentTime = 0;

            moaiEffect.volume = 0.3;
            moaiEffect.play();
        });

        const trashcanBathroom = new InteractableObject(areas.workshop_bathroom.realLeft() + 930, areas.workshop_bathroom.realBottom(), 0, 200, 20, null, true, false);
        trashcanBathroom.alignY();
        trashcanBathroom.createInteraction(() => {
            const sound = loadedAssets.sounds["sweeping_garbage"];
            sound.pause();
            sound.currentTime = 0;

            sound.volume = 0.4;
            sound.play();

            player.items.push(new Item("boss_key", "Key", "key"));
            trashcanBathroom.inspected = true;
            player.say("Yuck! The worst feeling ever... Rummaging through the garbage... But i found something.", 2000);
        });

        const doorToBoss = new InteractableObject(areas.workshop_corridor.realLeft() + 1250, areas.workshop_corridor.realBottom(), 238, 400, 50, "office_door", true);
        doorToBoss.alignY();
        doorToBoss.data = {
            open: false,
        }
        doorToBoss.createInteraction(() => {
            if (doorToBoss.data.open) {
                openDoor();
                player.teleport(areas.workshop_boss.realLeft(), areas.workshop_boss.realBottom() - player.h);

                return;
            }

            if (player.items.some(item => item.name === "boss_key")) {
                const sound: HTMLAudioElement = loadedAssets.sounds["unlock_door"];
                sound.pause();
                sound.currentTime = 0;

                sound.volume = 0.5;
                sound.play();

                doorToBoss.data.open = true;
                player.items = player.items.filter(item => item.name !== "boss_key");
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
            const sound = loadedAssets.sounds["footsteps"];
            sound.pause();
            sound.currentTime = 0;

            sound.volume = 0.8;
            sound.play();
        });

        staircaseUp_FromReception.createInteraction(() => {
            player.teleport(staircaseDown_FromFirstFloor.realLeft() - player.w / 2, areas.workshop_first_floor_staircase.realBottom() - player.h);
            const sound = loadedAssets.sounds["footsteps"];
            sound.pause();
            sound.currentTime = 0;

            sound.volume = 0.8;
            sound.play();
        });

        staircaseUp_FromFirstFloor.createInteraction(() => {
            player.teleport(staircaseDown_FromSecondFloor.realLeft() - player.w / 2, areas.workshop_second_floor_staircase.realBottom() - player.h);
            const sound = loadedAssets.sounds["footsteps"];
            sound.pause();
            sound.currentTime = 0;

            sound.volume = 0.8;
            sound.play();
        });

        staircaseDown_FromSecondFloor.createInteraction(() => {
            player.teleport(staircaseUp_FromFirstFloor.realLeft() - player.w / 2, areas.workshop_first_floor_staircase.realBottom() - player.h);
            const sound = loadedAssets.sounds["footsteps"];
            sound.pause();
            sound.currentTime = 0;

            sound.volume = 0.8;
            sound.play();
        });

        const vendingMachine = new InteractableObject(areas.workshop_reception.realLeft() + 350, areas.workshop_reception.realBottom(), 225, 450, 40, "vending_machine", true);
        vendingMachine.alignY();
        vendingMachine.createInteraction(() => {
            if (player.items.some(item => item.name === "coin")) {
                vendingMachine.inspected = true;
                player.items = player.items.filter(item => item.name !== "coin");

                return;
            }

            player.say("I don't have any money on me... If I got any...", 2000);
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
            player.say("We met here when I got employed. She really liked this job before everything fell down...", 2500);
            player.say("She was happy until new boss came and ruined everything...", 2500);
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
            player.say("Our schedule, I work in the evenings... I hate it...", 2000);
        });

        const bestEmployees = new InteractableObject(areas.workshop.realLeft() + 380, areas.workshop.realTop() + 260, 0, 0, 40, null, true);
        bestEmployees.createInteraction(() => {
            player.say("Employees of the month. My colleagues, Adam and Samantha. I should be there, I'm working after-hours...", 3000);
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

        //! STREET
        //! STREET - INTERACTABLE OBJECTS
        const doorToOffice_FromStreet = new InteractableObject(areas.street.realRight(), areas.street.realBottom(), 66, 400, 50, "door_left");
        doorToOffice_FromStreet.alignX();
        doorToOffice_FromStreet.alignY();
        doorToOffice_FromStreet.createInteraction(() => {
            openDoor();
            player.teleport(areas.workshop_reception.realLeft(), areas.workshop_reception.realBottom() - player.h);
        });


        //! STREET - DECORATIONS


        //! EASTER EGGS
        const easterEgg1 = new InteractableObject(computerBoss.realRight(), computerBoss.realTop() + 35, 32, 32, 10, "golden_egg");
        easterEgg1.alignX();
        easterEgg1.createInteraction(() => {
            easterEgg1.inspected = true;
            player.items.push(new Item("easter_egg", "Golden Egg", "golden_egg"));

            if (player.items.reduce((total, item) => item.name === "easter_egg" ? total + 1 : total, 0) === 3) {
                player.say("Found all golden eggs! Good job!", 2000);
            }
        });

        resolve();
    });
}

function openDoor() {
    const open: HTMLAudioElement = loadedAssets.sounds["open_door"];
    open.pause();
    open.currentTime = 0;

    open.volume = 0.3;
    open.play();
}

function lockedDoor() {
    const sound = loadedAssets.sounds["locked_door"];
    sound.pause();
    sound.currentTime = 0;

    sound.volume = 0.2;
    sound.play();
}