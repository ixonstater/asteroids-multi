import { Scene } from "phaser";
import { EventBus } from "../EventBus";
import { InputState } from "../controls/Input";
import { config } from "../main";

export class Game extends Scene {
    camera: Phaser.Cameras.Scene2D.Camera;
    background: Phaser.GameObjects.Image;
    gameText: Phaser.GameObjects.Text;
    inputState: InputState;

    constructor() {
        super("Game");
    }

    create() {
        this.camera = this.cameras.main;
        this.camera.setBackgroundColor(0x000000);

        this.inputState = new InputState(
            config.isMobile ? "MOBILE" : "PC",
            this.input
        );

        EventBus.emit("current-scene-ready", this);
    }

    changeScene() {
        this.scene.start("GameOver");
    }
}

