import { Scene } from "phaser";
import { InputState } from "../controls/Input";
import { config } from "../main";

export class Ship {
    private _facingDirection: Phaser.Math.Vector2 = new Phaser.Math.Vector2(
        0,
        0
    );
    private _velocity: Phaser.Math.Vector2 = new Phaser.Math.Vector2();
    private _maxVelocity: number = 3;
    private _ship: Phaser.GameObjects.Image;
    private static _acceleration = 0.01;
    private static _baseRotation = Math.PI / 2;

    public constructor(
        private _inputState: InputState,
        private _scene: Scene,
        private _shipImagePath: string
    ) {
        this._ship = this._scene.add
            .image(config.width / 2, config.height / 2, this._shipImagePath)
            .setRotation(Ship._baseRotation)
            .setScale(0.3, 0.3);
    }

    public update(time: number, delta: number) {
        this._facingDirection.x = this._inputState.moveToX - this._ship.x;
        this._facingDirection.y = this._inputState.moveToY - this._ship.y;
        this._ship.setRotation(
            this._facingDirection.angle() + Ship._baseRotation
        );
    }
}
