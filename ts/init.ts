import { areas } from "./data/areas.js";
import { loadedAssets } from "./data/assets.js";
import { InteractableObject } from "./interactable_object/interactable_object.js";
import { Item } from "./item.js";
import { player } from "./main.js";
import { Decoration } from "./objects/decoration.js";

export function init(): Promise<void> {
    return new Promise((resolve, reject) => {
        // OFFICE
        // OFFICE - INTERACTABLE OBJECTS
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
        console.log(areas.workshop_corridor.left(), areas.workshop_corridor.realLeft());
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
                return;
            }

            if (player.items.some(item => item.name === "boss_key")) {
                const sound = loadedAssets.sounds["unlock_door"];
                sound.pause();
                sound.currentTime = 0;

                sound.volume = 0.5;
                sound.play();

                doorToBoss.data.open = true;
                player.items = player.items.filter(item => item.name !== "boss_key");
                return;
            }

            player.say("Locked...", 1500);

            const sound = loadedAssets.sounds["locked_door"];
            sound.pause();
            sound.currentTime = 0;

            sound.volume = 0.2;
            sound.play();
        });

        const doorToCorridor_FromStaircase = new InteractableObject(areas.workshop_first_floor_staircase.realLeft(), areas.workshop_first_floor_staircase.realBottom(), 66, 400, 50, "door_right");
        doorToCorridor_FromStaircase.alignY();
        doorToCorridor_FromStaircase.createInteraction(() => {
            player.teleport(areas.workshop_corridor.realRight(), areas.workshop_corridor.realBottom() - player.h);
            player.alignX();
            openDoor();
        });

        // OFFICE - DECORATIONS - UNIMPORTANT INTERACTABLE OBJECTS
        const computer = new Decoration(areas.workshop.realLeft() + 500, areas.workshop.realBottom(), 266, 200, "desk_with_computer");
        computer.alignY();
        const computer2 = new Decoration(areas.workshop.realLeft() + 1000, areas.workshop.realBottom(), 266, 200, "desk_with_computer");
        computer2.alignY();

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