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

        const title = this.add.text(0, 80, "Asteroids but with friends lol :p");
        title.x = config.width / 2 - title.displayWidth / 2;

        const playButtonSprite: GameObjects.Sprite = this.add.sprite(
            config.width / 2,
            config.height / 2,
            MainMenuAssetManifest.playButton.path
        );
        this.setupPlayButton(playButtonSprite);

        EventBus.emit("current-scene-ready", this);
    }

    setupPlayButton(playButton: GameObjects.Sprite) {
        playButton
            .setInteractive()
            .on("pointerdown", () => {
                playButton.setFrame(1);
            })
            .on("pointerup", () => {
                playButton.setFrame(0);
                this.changeScene();
            });
    }

    changeScene() {
        this.scene.start("Game");
    }
}

