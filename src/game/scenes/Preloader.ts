import { Scene } from "phaser";
import { MainMenuAssetManifest } from "./MainMenu";

export class Preloader extends Scene {
    constructor() {
        super("Preloader");
    }

    init() {
        //  We loaded this image in our Boot Scene, so we can display it here
        this.add.image(375, 375, "background");
    }

    preload() {
        //  Load the assets for the game - Replace with your own assets
        this.load.setPath("assets");
        this.load.spritesheet(
            MainMenuAssetManifest.playButton.path,
            MainMenuAssetManifest.playButton.path,
            {
                frameWidth: 198,
                frameHeight: 90,
            }
        );
        for (const path of MainMenuAssetManifest.shipAssets.paths) {
            this.load.image(path, path);
        }
    }

    create() {
        //  When all the assets have loaded, it's often worth creating global objects here that the rest of the game can use.
        //  For example, you can define global animations here, so we can use them in other scenes.

        //  Move to the MainMenu. You could also swap this for a Scene Transition, such as a camera fade.
        this.scene.start("MainMenu");
    }
}

