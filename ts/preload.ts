import { assetsToPreload, loadedAssets } from "./data/assets.js";

function loadImage(name: string, src: string): Promise<void> {
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

export async function preloadAssets() {
    const imagePromises = Object.entries(assetsToPreload.imgs).map(([name, src]) =>
        loadImage(name, src)
    );

    await Promise.all([ ...imagePromises ]);
}