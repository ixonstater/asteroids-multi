import { GameObjects, Scene } from "phaser";

import { EventBus } from "../EventBus";
import { config } from "../main";

export const MainMenuAssetManifest = {
    playButton: {
        path: "menu/play.png",
    },
};

export class MainMenu extends Scene {
    background: GameObjects.Image;

    constructor() {
        super("MainMenu");
    }

    create() {
        this.background = this.add.image(
            config.width / 2,
            config.height / 2,
            "background"
        );

        const playButtonSprite: GameObjects.Sprite = this.add.sprite(
            config.width / 2,
            config.height / 2,
            MainMenuAssetManifest.playButton.path
        );

        EventBus.emit("current-scene-ready", this);
    }

    changeScene() {
        this.scene.start("Game");
    }
}

