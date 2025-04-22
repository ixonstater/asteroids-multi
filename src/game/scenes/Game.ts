import { Scene } from "phaser";
import { EventBus } from "../EventBus";
import { InputState } from "../controls/Input";
import { AsteroidManager } from "../entities/Asteroid";
import { BulletManager } from "../entities/Bullet";
import { config } from "../main";
import { Ship } from "../ship/Ship";

export type InitGameData = {
    selectedShipPath: string;
};

export class Game extends Scene {
    private _camera: Phaser.Cameras.Scene2D.Camera;
    private _inputState: InputState;

    private _ship: Ship;
    private _bulletManager: BulletManager;
    private _asteroidManager: AsteroidManager;
    private _data: InitGameData;

    constructor() {
        super("Game");
    }

    public init(data: InitGameData): void {
        this._data = data;
    }

    public create() {
        this._camera = this.cameras.main;
        this._camera.setBackgroundColor(0x000000);

        this._inputState = new InputState(
            config.isMobile ? "MOBILE" : "PC",
            this.input
        );

        this._ship = new Ship(
            this._inputState,
            this,
            this._data.selectedShipPath
        );

        this._bulletManager = new BulletManager(
            this._inputState,
            this._ship,
            this
        );

        this._asteroidManager = new AsteroidManager()

        EventBus.emit("current-scene-ready", this);
    }

    public override update(time: number, delta: number) {
        this._ship.update(time, delta);
        this._bulletManager.update(time, delta);
        this._asteroidManager.update(time, delta);
    }

    public changeScene() {
        this.scene.start("GameOver");
    }
}

