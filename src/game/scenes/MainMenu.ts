import { GameObjects, Scene } from "phaser";

import { EventBus } from "../EventBus";
import { config } from "../main";
import { ShipAssetManifest } from "../ship/Ship";
import { InitGameData } from "./Game";

export const MainMenuAssetManifest = {
    playButton: {
        path: "menu/play.png",
    },
};

export class MainMenu extends Scene {
    private _shipColorPath: string = "ship_red.png";
    private _selectedShipRectangle?: Phaser.GameObjects.Rectangle;

    constructor() {
        super("MainMenu");
    }

    create() {
        this.add.image(config.width / 2, config.height / 2, "background");

        const title = this.add.text(0, 80, "Asteroids but with friends lol :p");
        title.x = config.width / 2 - title.displayWidth / 2;

        const playButtonSprite: GameObjects.Sprite = this.add
            .sprite(
                config.width / 2,
                config.height / 2,
                MainMenuAssetManifest.playButton.path
            )
            .setScale(0.7, 0.7);
        this._setupPlayButton(playButtonSprite);
        this._setupShipSelect();

        EventBus.emit("current-scene-ready", this);
    }

    private _setupShipSelect() {
        const shipIconPositionY = config.height / 2 + 115;
        const shipIconStartPositionX = 200;
        const shipIconIncrement =
            (config.width - shipIconStartPositionX * 2) /
            (ShipAssetManifest.shipAssets.paths.length - 1);

        for (let i = 0; i < ShipAssetManifest.shipAssets.paths.length; i++) {
            const shipImagePath = ShipAssetManifest.shipAssets.paths[i];
            const shipCenterX = shipIconStartPositionX + shipIconIncrement * i;
            const shipImage = this.add.image(
                shipCenterX,
                shipIconPositionY,
                shipImagePath
            );

            shipImage
                .setInteractive()
                .on("pointerdown", () =>
                    this._selectShipColor(shipImagePath, shipImage)
                )
                .setScale(0.5, 0.5)
                .setRotation(Math.PI / 2)
                .setDepth(1);
        }
    }

    private _selectShipColor(color: string, ship: GameObjects.Image) {
        this._shipColorPath = color;

        if (!this._selectedShipRectangle) {
            this._selectedShipRectangle = this.add.rectangle(
                ship.x,
                ship.y,
                ship.displayWidth + 20,
                ship.displayHeight + 20,
                0x222222
            );
        } else {
            this._selectedShipRectangle.x = ship.x;
            this._selectedShipRectangle.y = ship.y;
        }
    }

    private _setupPlayButton(playButton: GameObjects.Sprite) {
        playButton
            .setInteractive()
            .on("pointerdown", () => {
                playButton.setFrame(1);
            })
            .on("pointerup", () => {
                playButton.setFrame(0);
                this._changeScene();
            });
    }

    private _changeScene() {
        const socket: WebSocket = new WebSocket(config.socketUrl);
        socket.addEventListener("open", (_) => {
            const data: InitGameData = {
                selectedShipPath: this._shipColorPath,
                socket,
            };
            this.scene.start("Game", data);
        });

        socket.addEventListener("error", (event) => {
            console.log("Message from server:", JSON.stringify(event));
        });
    }
}

