import { GameObjects, Scene } from "phaser";

import { EventBus } from "../EventBus";
import { config } from "../main";

export class MainMenu extends Scene {
    background: GameObjects.Image;

    constructor() {
        super("MainMenu");
    }

    create() {
        this.background = this.add.image(
            Number.parseFloat((config.width ?? 0).toString()) / 2,
            Number.parseFloat((config.height ?? 0).toString()) / 2,
            "background"
        );

        EventBus.emit("current-scene-ready", this);
    }

    changeScene() {
        this.scene.start("Game");
    }
}

