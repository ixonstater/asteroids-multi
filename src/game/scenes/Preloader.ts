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

        this.load.spritesheet(
            ShipAssetManifest.explosionAsset.path,
            ShipAssetManifest.explosionAsset.path,
            {
                frameWidth: 117,
                frameHeight: 100,
            }
        );

        for (const path of ShipAssetManifest.shipAssets.paths) {
            this.load.image(path, path);
        }
        this.load.json(
            ShipAssetManifest.shipAssets.bodyPath,
            ShipAssetManifest.shipAssets.bodyPath
        );

        this.load.image(
            ShipAssetManifest.bulletAsset.path,
            ShipAssetManifest.bulletAsset.path
        );
        this.load.json(
            ShipAssetManifest.bulletAsset.bodyPath,
            ShipAssetManifest.bulletAsset.bodyPath
        );

        for (const asteroid of AsteroidAssetManifest.asteroids) {
            this.load.image(asteroid.key, asteroid.imagePath);
            this.load.json(asteroid.key, asteroid.bodyPath);
        }

        this.load.addListener("complete", this.loadAnimations.bind(this));
    }

    loadAnimations() {
        this.anims.create({
            key: ShipAssetManifest.explosionAsset.animationKey,
            frames: this.anims.generateFrameNumbers(
                ShipAssetManifest.explosionAsset.path
            ),
            frameRate: 15,
            repeat: 0,
        });
    }

    create() {
        this.scene.start("MainMenu");
    }
}
