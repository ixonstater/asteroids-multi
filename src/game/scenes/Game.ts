import { Scene } from "phaser";
import { EventBus } from "../EventBus";
import { InputState } from "../controls/Input";
import { AsteroidManager } from "../entities/Asteroid";
import { BulletManager } from "../entities/Bullet";
import { config } from "../main";
import { CollisionManager } from "../physics/CollisionManager";
import { Ship, ShipAssetManifest } from "../ship/Ship";

export type InitGameData = {
    selectedShipPath: string;
};

export class Game extends Scene {
    private _camera: Phaser.Cameras.Scene2D.Camera;
    private _inputState: InputState;

    private _ship: Ship | null;
    private _bulletManager: BulletManager;
    private _asteroidManager: AsteroidManager;
    private _collisionManager: CollisionManager;
    private _data: InitGameData;
    private _gameOver: boolean;

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

        this._asteroidManager = new AsteroidManager(this);

        this._collisionManager = new CollisionManager(
            this._ship,
            this._bulletManager,
            this._asteroidManager,
            this
        );

        EventBus.emit("current-scene-ready", this);
    }

    public override update(time: number, delta: number) {
        this._bulletManager.update(time, delta);
        this._asteroidManager.update(time, delta);

        if (!this._gameOver) {
            this._ship?.update(time, delta);
            this._gameOver = this._collisionManager.update();

            if (this._gameOver) {
                this._onGameOver();
            }
        }
    }

    private _onGameOver() {
        this._bulletManager.gameOver = true;
        const shipPosition = this._ship!.position;
        this._ship?.discard();
        this._ship = null;

        this.add
            .sprite(
                shipPosition.x,
                shipPosition.y,
                ShipAssetManifest.explosionAsset.path,
                0
            )
            .play(ShipAssetManifest.explosionAsset.animationKey);
    }

    public changeScene() {
        this.scene.start("GameOver");
    }
}
