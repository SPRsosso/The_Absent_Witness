var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { assetsToPreload, loadedAssets } from "./data/assets.js";
function loadImage(name, src) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = src;
        img.onload = () => {
            loadedAssets.imgs[name] = img;
            resolve();
        };
        img.onerror = (e) => reject(`Failed to load image: ${src}`);
    });
}
function loadSound(name, src) {
    return new Promise((resolve, reject) => {
        const audio = new Audio();
        audio.src = src;
        audio.oncanplaythrough = () => {
            loadedAssets.sounds[name] = audio;
            resolve();
        };
        audio.onerror = (e) => reject(`Failed to load sound: ${src}`);
    });
}
export function preloadAssets() {
    return __awaiter(this, void 0, void 0, function* () {
        const imagePromises = Object.entries(assetsToPreload.imgs).map(([name, src]) => loadImage(name, src));
        const soundPromises = Object.entries(assetsToPreload.sounds).map(([name, src]) => loadSound(name, src));
        yield Promise.all([...imagePromises, ...soundPromises]);
    });
}
