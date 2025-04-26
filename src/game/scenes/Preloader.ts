import { Scene } from "phaser";
import { AsteroidAssetManifest } from "../entities/Asteroid";
import { ShipAssetManifest } from "../ship/Ship";
import { MainMenuAssetManifest } from "./MainMenu";

export class Preloader extends Scene {
    constructor() {
        super("Preloader");
    }

    init() {
        this.add.image(375, 375, "background");
    }

    preload() {
        this.load.setPath("assets");
        this.load.spritesheet(
            MainMenuAssetManifest.playButton.path,
            MainMenuAssetManifest.playButton.path,
            {
                frameWidth: 198,
                frameHeight: 90,
            }
        );

        for (const path of ShipAssetManifest.shipAssets.paths) {
            this.load.image(path, path);
        }

        this.load.image(
            ShipAssetManifest.bulletAsset.path,
            ShipAssetManifest.bulletAsset.path
        );

        for (const path of AsteroidAssetManifest.imagePaths) {
            this.load.image(path, path);
        }

        for (const path of AsteroidAssetManifest.bodyPaths) {
            this.load.json(path, path);
        }
    }

    create() {
        this.scene.start("MainMenu");
    }
}
